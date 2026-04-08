// Dashboard tab renderer and tab-specific actions.

const DH_MOOD_DEFS = [
  {
    key: "overwhelmed",
    emoji: "😟",
    label: "Overwhelmed",
    color: "#f43f5e",
    ring: "#fecdd3",
  },
  {
    key: "tired",
    emoji: "😔",
    label: "Tired",
    color: "#8b5cf6",
    ring: "#ede9fe",
  },
  {
    key: "okay",
    emoji: "😐",
    label: "Okay",
    color: "#94a3b8",
    ring: "#e2e8f0",
  },
  {
    key: "hopeful",
    emoji: "🙂",
    label: "Hopeful",
    color: "#006D77",
    ring: "#ccfbf1",
  },
  {
    key: "good",
    emoji: "😊",
    label: "Good",
    color: "#16a34a",
    ring: "#dcfce7",
  },
];

const DH_MOOD_RISK = {
  overwhelmed: 4,
  tired: 3,
  okay: 2,
  hopeful: 1,
  good: 0,
};

function getBurnoutInsight(entries) {
  const recent = entries.slice(-7);
  if (!recent.length) {
    return {
      score: 0,
      status: "Low",
      cls: "low",
      summary: "No risk signals yet. Keep doing regular check-ins.",
      avgSleep: null,
    };
  }

  let total = 0;
  let sleepCount = 0;
  let sleepSum = 0;

  recent.forEach((e) => {
    const moodRisk = DH_MOOD_RISK[e.mood] ?? 2;
    const stress = Number.isFinite(e.stressLevel) ? e.stressLevel : 3;
    const stressRisk = Math.max(0, Math.min(4, stress - 1));

    let sleepRisk = 1;
    if (Number.isFinite(e.sleepHours)) {
      sleepCount += 1;
      sleepSum += e.sleepHours;
      if (e.sleepHours < 5) sleepRisk = 3;
      else if (e.sleepHours < 6) sleepRisk = 2;
      else if (e.sleepHours < 7) sleepRisk = 1;
      else sleepRisk = 0;
    }

    const energy = Number.isFinite(e.energyLevel) ? e.energyLevel : 3;
    const energyRisk = Math.max(0, Math.min(4, 5 - energy));

    total += moodRisk + stressRisk + sleepRisk + energyRisk;
  });

  const avg = total / recent.length;
  const avgSleep = sleepCount ? sleepSum / sleepCount : null;

  if (avg >= 7) {
    return {
      score: avg,
      status: "High",
      cls: "high",
      summary: "High burnout risk detected. Please activate support today.",
      avgSleep,
    };
  }

  if (avg >= 4) {
    return {
      score: avg,
      status: "Medium",
      cls: "medium",
      summary: "Stress is building up. Add recovery time in the next 24 hours.",
      avgSleep,
    };
  }

  return {
    score: avg,
    status: "Low",
    cls: "low",
    summary: "You are relatively stable this week. Keep your support routine.",
    avgSleep,
  };
}

function getBurnoutTrend(entries) {
  if (!entries.length) return [];

  const toDateKey = (dateInput) => {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const byDate = new Map();
  entries.forEach((e) => {
    const key = toDateKey(e.date);
    if (!key) return;

    const moodRisk = DH_MOOD_RISK[e.mood] ?? 2;
    const stress = Number.isFinite(e.stressLevel) ? e.stressLevel : 3;
    const stressRisk = Math.max(0, Math.min(4, stress - 1));
    const sleepRisk = Number.isFinite(e.sleepHours)
      ? e.sleepHours < 5
        ? 3
        : e.sleepHours < 6
          ? 2
          : e.sleepHours < 7
            ? 1
            : 0
      : 1;
    const energy = Number.isFinite(e.energyLevel) ? e.energyLevel : 3;
    const energyRisk = Math.max(0, Math.min(4, 5 - energy));
    const riskScore = moodRisk + stressRisk + sleepRisk + energyRisk;

    const bucket = byDate.get(key) || {
      totalRisk: 0,
      count: 0,
      moodCounts: {},
    };
    bucket.totalRisk += riskScore;
    bucket.count += 1;

    const moodKey = e.mood || "okay";
    bucket.moodCounts[moodKey] = (bucket.moodCounts[moodKey] || 0) + 1;
    byDate.set(key, bucket);
  });

  const today = new Date();
  const trend = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(today.getDate() - i);
    const key = toDateKey(d);
    const bucket = byDate.get(key);

    if (!bucket) {
      trend.push({
        day: d.toLocaleDateString("en-SG", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        pct: 0,
        mood: "okay",
        riskScore: null,
        hasData: false,
      });
      continue;
    }

    const avgRisk = bucket.totalRisk / bucket.count;
    const dominantMood =
      Object.entries(bucket.moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "okay";

    trend.push({
      day: d.toLocaleDateString("en-SG", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      pct: Math.max(12, Math.min(100, Math.round((avgRisk / 15) * 100))),
      mood: dominantMood,
      riskScore: Number(avgRisk.toFixed(1)),
      hasData: true,
    });
  }

  return trend;
}

function getJournalDraft() {
  return {
    note: document.getElementById("journalNote")?.value || "",
    sleepHours: document.getElementById("journalSleep")?.value || "",
    stressLevel: document.getElementById("journalStress")?.value || "",
    energyLevel: document.getElementById("journalEnergy")?.value || "",
  };
}

function restoreJournalDraft(draft) {
  const noteEl = document.getElementById("journalNote");
  const sleepEl = document.getElementById("journalSleep");
  const stressEl = document.getElementById("journalStress");
  const energyEl = document.getElementById("journalEnergy");

  if (noteEl) noteEl.value = draft.note || "";
  if (sleepEl) sleepEl.value = draft.sleepHours || "";
  if (stressEl) stressEl.value = draft.stressLevel || "";
  if (energyEl) energyEl.value = draft.energyLevel || "";
}

function startBreathingReset(seconds) {
  const label = document.getElementById("dhBreathingLabel");
  if (!label) return;

  const total = Number(seconds) || 60;
  let left = total;
  clearInterval(window.dhBreathingTimer);

  label.textContent = `Breathing reset started (${left}s left). Inhale for 4s, hold 4s, exhale 6s.`;
  window.dhBreathingTimer = setInterval(() => {
    left -= 1;
    if (left <= 0) {
      clearInterval(window.dhBreathingTimer);
      label.textContent =
        "Done. Take a sip of water and stretch your shoulders.";
      return;
    }
    label.textContent = `Breathing reset in progress (${left}s left).`;
  }, 1000);
}

function renderDashboard(user) {
  const profileHtml = `
    <div class="dh-card flex items-center gap-5">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006D77] to-[#003D44] flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
        ${(user.fullname || "U")[0].toUpperCase()}
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-black text-slate-900 text-lg leading-tight truncate">${esc(user.fullname)}</p>
        <p class="text-slate-500 text-xs font-semibold truncate mt-0.5">${esc(user.email)}</p>
        ${user.phone ? `<p class="text-slate-400 text-xs mt-0.5">${esc(user.phone)}</p>` : ""}
        <p class="text-[10px] text-teal-600 font-black uppercase tracking-wider mt-1.5">Member since ${fmtDate(user.joinedAt)}</p>
      </div>
      <span class="dh-badge dh-badge-track hidden md:inline">Active</span>
    </div>`;

  const journalKey = `dh_journal_${user.id}`;
  const journalEntries = JSON.parse(localStorage.getItem(journalKey) || "[]");
  const patientName = user.patientName || "your loved one";
  const insight = getBurnoutInsight(journalEntries);
  const riskScore = insight.score.toFixed(1);
  const trend = getBurnoutTrend(journalEntries);
  const trendLegendHtml = `<div class="dh-trend-legend" aria-label="Trend legend">
        <span class="dh-trend-legend-item"><i class="dot mood-good"></i>Good</span>
        <span class="dh-trend-legend-item"><i class="dot mood-hopeful"></i>Hopeful</span>
        <span class="dh-trend-legend-item"><i class="dot mood-okay"></i>Okay</span>
        <span class="dh-trend-legend-item"><i class="dot mood-tired"></i>Tired</span>
        <span class="dh-trend-legend-item"><i class="dot mood-overwhelmed"></i>Overwhelmed</span>
      </div>`;
  const trendHtml = trend.length
    ? `<div class="dh-trend-strip" aria-label="7-day burnout trend">
        ${trend
          .map(
            (
              t,
            ) => `<div class="dh-trend-item" title="${t.hasData ? `${t.day}: average risk ${t.riskScore}` : `${t.day}: no check-in`}">
            <div class="dh-trend-bar-wrap"><span class="dh-trend-bar mood-${esc(t.mood)}" style="height:${t.pct}%;opacity:${t.hasData ? 1 : 0.2}"></span></div>
            <span class="dh-trend-day">${esc(t.day)}</span>
          </div>`,
          )
          .join("")}
      </div>`
    : `<p class="text-xs text-slate-400 mt-3">Trend appears after at least 1 check-in.</p>`;

  const burnoutHtml = `
    <div class="dh-card dh-burnout-card ${insight.cls}">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-[11px] font-black uppercase tracking-widest text-slate-500">Burnout Risk (Last 7 Check-ins)</p>
          <h3 class="font-black text-slate-900 text-xl mt-1">${insight.status} <span class="text-sm font-bold text-slate-500">Score ${riskScore}</span></h3>
          <p class="text-sm text-slate-600 mt-1">${insight.summary}</p>
          ${Number.isFinite(insight.avgSleep) ? `<p class="text-xs text-slate-500 mt-2">Average sleep: ${insight.avgSleep.toFixed(1)}h</p>` : `<p class="text-xs text-slate-500 mt-2">Add sleep hours to improve burnout tracking accuracy.</p>`}
          ${trendHtml}
          ${trend.length ? trendLegendHtml : ""}
        </div>
        <span class="dh-badge ${insight.cls === "high" ? "dh-badge-needs" : insight.cls === "medium" ? "dh-badge-due" : "dh-badge-track"}">${insight.status}</span>
      </div>
    </div>`;

  const helpNowHtml = `
    <div class="dh-card dh-help-card">
      <h3 class="font-black text-slate-800 mb-1">🆘 I Need Help Now</h3>
      <p class="text-xs text-slate-600 mb-4">If you feel overwhelmed, use one quick action below.</p>
      <div class="dh-help-grid">
        <button onclick="window.location.href='tel:6377-0700'" class="dh-help-btn">📞 Call Dementia Helpline</button>
        <button onclick="window.location.href='sms:?body=I%20need%20help%20covering%20caregiving%20today.%20Can%20you%20support%20me%3F'" class="dh-help-btn">💬 Text Trusted Contact</button>
        <button onclick="startBreathingReset(60)" class="dh-help-btn">🫁 Start 60s Breathing Reset</button>
      </div>
      <p id="dhBreathingLabel" class="text-xs text-slate-500 mt-3"></p>
    </div>`;

  const moodButtons = DH_MOOD_DEFS.map((m) => {
    const active = S.journalMood === m.key;
    return `
      <button onclick="setJournalMood('${m.key}')" class="flex flex-col items-center gap-1.5 focus:outline-none">
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-150"
          style="border: 2px solid ${active ? m.color : "#e2e8f0"};
                 background: ${active ? m.ring : "transparent"};
                 transform: ${active ? "scale(1.12)" : "scale(1)"};">
          ${m.emoji}
        </div>
        <span class="text-[10px] font-bold transition-colors" style="color:${active ? m.color : "#94a3b8"};">${m.label}</span>
      </button>`;
  }).join("");

  const recentEntries = journalEntries
    .slice(-5)
    .reverse()
    .map((e) => {
      const md = DH_MOOD_DEFS.find((m) => m.key === e.mood) || DH_MOOD_DEFS[2];
      const wellbeingMeta = [
        Number.isFinite(e.sleepHours) ? `Sleep ${e.sleepHours}h` : null,
        Number.isFinite(e.stressLevel) ? `Stress ${e.stressLevel}/5` : null,
        Number.isFinite(e.energyLevel) ? `Energy ${e.energyLevel}/5` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      return `
      <div class="flex items-start gap-3 py-3 border-t border-slate-100">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
          style="background:${md.ring};">${md.emoji}</div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center mb-0.5">
            <span class="text-[10px] font-black uppercase tracking-wider" style="color:${md.color};">${md.label}</span>
            <span class="text-[10px] text-slate-400 font-semibold">${timeAgo(e.date)}</span>
          </div>
          ${wellbeingMeta ? `<p class="text-[10px] text-slate-400 mb-1">${wellbeingMeta}</p>` : ""}
          ${e.note ? `<p class="text-xs text-slate-500 leading-relaxed line-clamp-2">${esc(e.note)}</p>` : `<p class="text-xs text-slate-300 italic">No note added.</p>`}
        </div>
      </div>`;
    })
    .join("");

  const journalHtml = `
    <div class="dh-card">
      <h3 class="font-black text-slate-800 mb-0.5">📔 How are YOU feeling right now?</h3>
      <p class="text-xs font-semibold mb-5" style="color:#006D77;">Check in with yourself — not just with ${esc(patientName)}.</p>
      <div class="flex justify-between mb-5">${moodButtons}</div>

      <div class="dh-wellbeing-grid mb-4">
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Sleep (hours)</label>
          <input id="journalSleep" class="dh-input" type="number" min="0" max="24" step="0.5" placeholder="e.g. 6.5">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Stress (1-5)</label>
          <select id="journalStress" class="dh-select">
            <option value="">Select</option>
            <option value="1">1 - Very low</option>
            <option value="2">2 - Low</option>
            <option value="3">3 - Moderate</option>
            <option value="4">4 - High</option>
            <option value="5">5 - Very high</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Energy (1-5)</label>
          <select id="journalEnergy" class="dh-select">
            <option value="">Select</option>
            <option value="1">1 - Very low</option>
            <option value="2">2 - Low</option>
            <option value="3">3 - Moderate</option>
            <option value="4">4 - Good</option>
            <option value="5">5 - Strong</option>
          </select>
        </div>
      </div>

      <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">What's on your mind? <span class="normal-case font-semibold text-slate-400">(private)</span></label>
      <textarea id="journalNote" class="dh-input resize-none mb-4" rows="3"
        placeholder="Vent freely here — this is just for you…"></textarea>
      <button onclick="saveJournalEntry('${user.id}')" id="journalSaveBtn" class="dh-btn-primary w-full"
        style="background:linear-gradient(135deg,#006D77,#003D44);">Save my check-in</button>
      <div id="journalSaveResult" class="mt-2 text-xs text-center font-semibold text-teal-600 hidden">✓ Check-in saved</div>
      ${
        journalEntries.length
          ? `
        <div class="mt-2">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0">Recent Check-ins</p>
          ${recentEntries}
        </div>`
          : ""
      }
    </div>`;

  return `
    <div class="dh-dashboard-view">
      <div class="mb-6">${profileHtml}</div>
      <div class="mb-5">${burnoutHtml}</div>
      <div class="mb-5">${helpNowHtml}</div>
      <div class="mb-5">${journalHtml}</div>
    </div>`;
}

function setJournalMood(mood) {
  S.journalMood = mood;
  const draft = getJournalDraft();
  render();
  restoreJournalDraft(draft);
}

function saveJournalEntry(userId) {
  const draft = getJournalDraft();
  const note = (draft.note || "").trim();
  const key = `dh_journal_${userId}`;
  const entries = JSON.parse(localStorage.getItem(key) || "[]");

  const sleepHoursRaw = Number.parseFloat(draft.sleepHours);
  const sleepHours = Number.isFinite(sleepHoursRaw)
    ? Math.max(0, Math.min(24, sleepHoursRaw))
    : null;

  const stressRaw = Number.parseInt(draft.stressLevel, 10);
  const stressLevel = Number.isInteger(stressRaw)
    ? Math.max(1, Math.min(5, stressRaw))
    : null;

  const energyRaw = Number.parseInt(draft.energyLevel, 10);
  const energyLevel = Number.isInteger(energyRaw)
    ? Math.max(1, Math.min(5, energyRaw))
    : null;

  entries.push({
    id: Date.now().toString(),
    mood: S.journalMood,
    note,
    sleepHours,
    stressLevel,
    energyLevel,
    date: new Date().toISOString(),
  });
  localStorage.setItem(key, JSON.stringify(entries));
  S.journalMood = "okay";
  render();

  const saved = document.getElementById("journalSaveResult");
  if (saved) {
    saved.classList.remove("hidden");
    setTimeout(() => saved.classList.add("hidden"), 3000);
  }
}

window.renderDashboard = renderDashboard;
window.setJournalMood = setJournalMood;
window.saveJournalEntry = saveJournalEntry;
window.startBreathingReset = startBreathingReset;
