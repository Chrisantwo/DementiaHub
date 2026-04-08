// Dashboard tab renderer and tab-specific actions.

function renderDashboard(user) {
  const convos = S.convos;
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
  const moodDefs = [
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
  const patientName = user.patientName || "your loved one";

  const moodButtons = moodDefs
    .map((m) => {
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
    })
    .join("");

  const recentEntries = journalEntries
    .slice(-5)
    .reverse()
    .map((e) => {
      const md = moodDefs.find((m) => m.key === e.mood) || moodDefs[2];
      return `
      <div class="flex items-start gap-3 py-3 border-t border-slate-100">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
          style="background:${md.ring};">${md.emoji}</div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center mb-0.5">
            <span class="text-[10px] font-black uppercase tracking-wider" style="color:${md.color};">${md.label}</span>
            <span class="text-[10px] text-slate-400 font-semibold">${timeAgo(e.date)}</span>
          </div>
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

  let convoItems = "";
  if (S.convos === null) {
    convoItems = `<div class="text-center py-6"><div class="spinner mx-auto mb-2"></div><p class="text-slate-400 text-xs">Loading conversations…</p></div>`;
  } else if (!S.convos.length) {
    convoItems = `<div class="text-center py-6"><div class="text-3xl mb-2">💬</div><p class="text-slate-400 text-sm font-semibold">No conversations yet.</p></div>`;
  } else {
    convoItems = S.convos
      .slice(0, 8)
      .map(
        (c) => `
      <div class="convo-item mb-2">
        <div class="flex justify-between items-start mb-1">
          <p class="font-bold text-slate-800 text-sm leading-tight">${esc(c.contactName || c.fullName || "Unknown Contact")}</p>
          <span class="text-[10px] text-slate-400 font-semibold ml-2 whitespace-nowrap">${timeAgo(c.lastMessageDate || c.dateUpdated)}</span>
        </div>
        <p class="text-xs text-slate-500 leading-relaxed line-clamp-1">${esc(c.lastMessageBody || c.snippet || "No preview available")}</p>
        <div class="flex gap-1.5 mt-2">
          ${c.unreadCount ? `<span class="dh-badge dh-badge-needs">${c.unreadCount} unread</span>` : ""}
          <span class="dh-badge" style="background:#f1f5f9;color:#64748b;">${esc(c.type || "SMS")}</span>
        </div>
      </div>`,
      )
      .join("");
  }

  const conversationsHtml = `
    <div class="dh-card">
      <h3 class="font-black text-slate-800 mb-4">💬 Conversation History</h3>
      <div class="max-h-80 overflow-y-auto pr-1">${convoItems}</div>
    </div>`;

  return `
    <div class="dh-dashboard-view">
      <div class="mb-6">${profileHtml}</div>
      <div class="mb-5">${journalHtml}</div>
      <div class="mb-5">${conversationsHtml}</div>
    </div>`;
}

function setJournalMood(mood) {
  S.journalMood = mood;
  const existingNote = document.getElementById("journalNote")?.value || "";
  render();
  const noteEl = document.getElementById("journalNote");
  if (noteEl && existingNote) noteEl.value = existingNote;
}

function saveJournalEntry(userId) {
  const noteEl = document.getElementById("journalNote");
  const note = noteEl ? noteEl.value.trim() : "";
  const key = `dh_journal_${userId}`;
  const entries = JSON.parse(localStorage.getItem(key) || "[]");
  entries.push({
    id: Date.now().toString(),
    mood: S.journalMood,
    note,
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
