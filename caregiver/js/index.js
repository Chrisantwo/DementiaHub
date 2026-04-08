// ══════════════════════════════════════════════════════════════
// CONFIG
// ══════════════════════════════════════════════════════════════
const CFG = {
  // API key is NOT here — it lives in Vercel env vars (GHL_API_KEY).
  // All GHL calls go through /api/ghl via window.DHAPI.
  locationId: "Idf9v4q6aqh5KhzXip6e",
  elevenLabsAgentId: "agent_7801kkd50dzsez4tfv4qme5mn6br", // ← replace with your ElevenLabs Conversational AI agent ID
  logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23006D77' width='100' height='100'/%3E%3Ctext x='50' y='65' font-size='80' font-weight='bold' fill='white' text-anchor='middle'%3EDH%3C/text%3E%3C/svg%3E",
};

// ══════════════════════════════════════════════════════════════
// GHL STATE
// ══════════════════════════════════════════════════════════════
const S = {
  opps: null, // null=loading, []=empty, [...]=data
  convos: null,
  calendars: null,
  filter: "all", // all|new|triaged|due_soon|critical|resolved
  kbViewed: JSON.parse(localStorage.getItem("dh_kb_viewed") || "[]"),
  journalMood: "okay", // overwhelmed|tired|okay|hopeful|good
};

// ══════════════════════════════════════════════════════════════
// GHL API HELPERS — proxied securely via /api/ghl (DHAPI)
// ══════════════════════════════════════════════════════════════

async function loadGHLData() {
  try {
    const { opps, convos, calendars } = await DHAPI.loadDashboardData();
    S.opps = opps;
    S.convos = convos;
    S.calendars = calendars;
  } catch (e) {
    console.error("[loadGHLData]", e.message);
    S.opps = [];
    S.convos = [];
    S.calendars = [];
  }
  render();
}

async function postNote(contactId, noteText) {
  return DHAPI.addNote(contactId, noteText);
}

async function scheduleCallback(calendarId, contactId, startTime, endTime) {
  return DHAPI.scheduleAppointment(calendarId, contactId, startTime, endTime);
}

// ══════════════════════════════════════════════════════════════
// SAFETY & SLA LOGIC
// ══════════════════════════════════════════════════════════════
const CRITICAL_KEYWORDS = [
  "urgent",
  "critical",
  "emergency",
  "fall",
  "wander",
  "missing",
  "crisis",
  "acute",
  "unsafe",
  "danger",
  "immediate",
];

function isCritical(op) {
  const text = (
    (op.name || "") +
    " " +
    (op.pipelineStageName || "")
  ).toLowerCase();
  return CRITICAL_KEYWORDS.some((k) => text.includes(k));
}

function getSLA(op) {
  const hrs =
    (Date.now() - new Date(op.updatedAt || op.createdAt).getTime()) / 3600000;
  if (hrs < 24) return { label: "On Track", cls: "dh-badge-track", hrs };
  if (hrs < 48) return { label: "Due Soon", cls: "dh-badge-due", hrs };
  return { label: "Overdue", cls: "dh-badge-needs", hrs };
}

function getSafetyAlerts(opps) {
  return opps.filter((op) => isCritical(op) || getSLA(op).hrs >= 72);
}

// Normalize GHL opp to display status: 'new' | 'triaged' | 'resolved'
function getDisplayStatus(op) {
  const st = (op.status || "").toLowerCase();
  const stage = (op.pipelineStageName || "").toLowerCase();
  if (st === "won" || st === "lost") return "resolved";
  if (/triage|progress|active|contact|open/i.test(stage)) return "triaged";
  return "new";
}

// Due-soon: high urgency unresolved OR overdue SLA
function isDueSoon(op) {
  if (getDisplayStatus(op) === "resolved") return false;
  return isCritical(op) || getSLA(op).hrs >= 48;
}

function getFilteredOpps(opps) {
  switch (S.filter) {
    case "new":
      return opps.filter((op) => getDisplayStatus(op) === "new");
    case "triaged":
      return opps.filter((op) => getDisplayStatus(op) === "triaged");
    case "due_soon":
      return opps.filter((op) => isDueSoon(op));
    case "critical":
      return opps.filter((op) => isCritical(op));
    case "resolved":
      return opps.filter((op) => getDisplayStatus(op) === "resolved");
    case "open":
      return opps.filter((op) => getDisplayStatus(op) !== "resolved");
    case "overdue":
      return opps.filter((op) => getSLA(op).hrs >= 48);
    default:
      return opps;
  }
}

// ══════════════════════════════════════════════════════════════
// USER AUTH (localStorage + sessionStorage)
// ══════════════════════════════════════════════════════════════
function getUsers() {
  return JSON.parse(localStorage.getItem("dh_users") || "[]");
}
function saveUsers(u) {
  localStorage.setItem("dh_users", JSON.stringify(u));
}
function getCurrentUser() {
  const id = sessionStorage.getItem("dh_cg_uid");
  return id ? getUsers().find((u) => u.id === id) || null : null;
}
async function hashPass(p) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(p),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
async function registerUser(fullname, email, phone, pass, patientName) {
  const users = getUsers();
  if (users.find((u) => u.email === email))
    return { error: "Email already registered." };
  if (pass.length < 8)
    return { error: "Password must be at least 8 characters." };
  const user = {
    id: Date.now().toString(),
    fullname,
    email,
    phone,
    patientName: patientName || null,
    role: "caregiver",
    hash: await hashPass(pass),
    joinedAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  sessionStorage.setItem("dh_cg_uid", user.id);
  // Pre-configure GHL widget with identity for this session
  DHUserContext.configureGHLWidget(DHUserContext.getCaregiverContext());
  return { ok: true, user };
}
async function loginUser(email, pass) {
  const user = getUsers().find((u) => u.email === email);
  if (!user || user.hash !== (await hashPass(pass)))
    return { error: "Invalid email or password." };
  sessionStorage.setItem("dh_cg_uid", user.id);
  // Pre-configure GHL widget identity for this session
  DHUserContext.configureGHLWidget(DHUserContext.getCaregiverContext());
  return { ok: true, user };
}
function logoutUser() {
  sessionStorage.removeItem("dh_cg_uid");
  S.opps = null;
  S.convos = null;
  S.calendars = null;
  location.hash = "";
  render();
}

// ══════════════════════════════════════════════════════════════
// ROUTING
// ══════════════════════════════════════════════════════════════
function getView() {
  return location.hash.replace("#", "") || "dashboard";
}
window.addEventListener("hashchange", render);

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════
function esc(v) {
  return String(v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function fmtDate(iso) {
  return iso
    ? new Date(iso).toLocaleDateString("en-SG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
}
function fmtTime(iso) {
  return iso
    ? new Date(iso).toLocaleString("en-SG", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
}
function timeAgo(iso) {
  if (!iso) return "—";
  const hrs = (Date.now() - new Date(iso).getTime()) / 3600000;
  if (hrs < 1) return Math.round(hrs * 60) + "m ago";
  if (hrs < 24) return Math.round(hrs) + "h ago";
  return Math.round(hrs / 24) + "d ago";
}

// ══════════════════════════════════════════════════════════════
// RENDER ENTRY
// ══════════════════════════════════════════════════════════════
// Mount the ElevenLabs widget only when the AI Support tab is active.
function mountAISupportWidgetInline() {
  // Cleanup any legacy fixed-position widget from previous versions.
  const legacy = document.getElementById("dh-voice-widget-root");
  if (legacy) legacy.remove();

  const slot = document.getElementById("dh-ai-support-widget-slot");
  if (!slot) return;

  const ctx = DHUserContext.getCaregiverContext();
  if (!ctx) {
    slot.innerHTML =
      '<p class="text-sm text-slate-500">Sign in again to start AI voice support.</p>';
    return;
  }

  const agentId = String(CFG.elevenLabsAgentId || "").trim();
  if (!agentId || agentId === "YOUR_ELEVENLABS_AGENT_ID") {
    slot.innerHTML = `
      <div class="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p class="text-sm font-bold text-amber-900">AI Support is not configured yet.</p>
        <p class="text-xs text-amber-800 mt-1">Set <span class="font-mono">CFG.elevenLabsAgentId</span> in <span class="font-mono">caregiver/js/index.js</span> to your real ElevenLabs agent id.</p>
      </div>`;
    return;
  }

  slot.innerHTML =
    '<p class="text-sm text-slate-500">Loading AI voice support...</p>';

  const elVars = JSON.stringify(DHUserContext.buildElevenLabsVars(ctx));
  const mountWidget = () => {
    slot.innerHTML = `<elevenlabs-convai
      id="dh-el-widget-caregiver"
      agent-id="${esc(agentId)}"
      dynamic-variables='${elVars}'
      style="display:block;width:100%;">
    </elevenlabs-convai>`;
  };

  if (customElements.get("elevenlabs-convai")) {
    mountWidget();
    return;
  }

  setTimeout(() => {
    if (customElements.get("elevenlabs-convai")) {
      mountWidget();
      return;
    }
    slot.innerHTML =
      '<p class="text-sm text-slate-500">Still loading voice widget... please wait a moment and refresh if needed.</p>';
  }, 900);
}

function render() {
  const user = getCurrentUser();
  const app = document.getElementById("app");
  if (!user) {
    // Remove persistent widget when logged out
    const w = document.getElementById("dh-voice-widget-root");
    if (w) w.remove();
    const path = location.hash.replace("#", "");
    app.innerHTML = path === "register" ? renderRegister() : renderLogin();
    if (path === "register")
      document
        .getElementById("regForm")
        .addEventListener("submit", handleRegister);
    else
      document
        .getElementById("loginForm")
        .addEventListener("submit", handleLogin);
    return;
  }
  app.innerHTML = renderShell(user, getView());
  mountAISupportWidgetInline();
}

// ══════════════════════════════════════════════════════════════
// AUTH SCREENS
// ══════════════════════════════════════════════════════════════
function renderLogin(msg) {
  return `<div class="dh-auth-bg"><div class="dh-auth-card">
    <div class="text-center mb-8">
      <img src="${CFG.logo}" class="h-12 mx-auto mb-6" alt="DementiaHub">
      <h1 class="text-2xl font-black text-slate-900 mb-1">Welcome Back</h1>
      <p class="text-slate-500 text-sm font-medium">Sign in to your Caregiver Portal</p>
    </div>
    ${msg ? `<div class="alert-error">${esc(msg)}</div>` : ""}
    <form id="loginForm" class="space-y-4">
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
        <input id="loginEmail" class="dh-input" type="email" required placeholder="your@email.com" autocomplete="email"></div>
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
        <input id="loginPass" class="dh-input" type="password" required placeholder="Your password" autocomplete="current-password"></div>
      <button type="submit" class="dh-btn-primary mt-2">Sign In →</button>
    </form>
    <p class="text-center text-sm text-slate-500 mt-6">New caregiver? <a href="#register" class="text-[#006D77] font-bold hover:underline">Register here</a></p>
  </div></div>`;
}
async function handleLogin(e) {
  e.preventDefault();
  const res = await loginUser(
    document.getElementById("loginEmail").value,
    document.getElementById("loginPass").value,
  );
  if (res.error) {
    document.getElementById("app").innerHTML = renderLogin(res.error);
    document
      .getElementById("loginForm")
      .addEventListener("submit", handleLogin);
  } else {
    location.hash = "dashboard";
    loadGHLData();
    render();
  }
}

function renderRegister(msg) {
  return `<div class="dh-auth-bg"><div class="dh-auth-card">
    <div class="text-center mb-8">
      <img src="${CFG.logo}" class="h-12 mx-auto mb-6" alt="DementiaHub">
      <h1 class="text-2xl font-black text-slate-900 mb-1">Create Account</h1>
      <p class="text-slate-500 text-sm font-medium">Join the DementiaHub Caregiver Network</p>
    </div>
    ${msg ? `<div class="alert-error">${esc(msg)}</div>` : ""}
    <form id="regForm" class="space-y-4">
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
        <input id="regName" class="dh-input" type="text" required placeholder="Jane Smith" autocomplete="name"></div>
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
        <input id="regEmail" class="dh-input" type="email" required placeholder="jane@example.com" autocomplete="email"></div>
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Phone <span class="text-slate-400 font-normal normal-case">(optional)</span></label>
        <input id="regPhone" class="dh-input" type="tel" placeholder="+65 9XXX XXXX" autocomplete="tel"></div>
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Name of person you care for <span class="text-slate-400 font-normal normal-case">(optional)</span></label>
        <input id="regPatient" class="dh-input" type="text" placeholder="e.g. Mum, Dad, Mary Tan" autocomplete="off"></div>
      <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
        <input id="regPass" class="dh-input" type="password" required placeholder="Min. 8 characters" minlength="8" autocomplete="new-password"></div>
      <button type="submit" class="dh-btn-primary mt-2">Create Account →</button>
    </form>
    <p class="text-center text-sm text-slate-500 mt-6">Already registered? <a href="#login" class="text-[#006D77] font-bold hover:underline">Sign in</a></p>
  </div></div>`;
}
async function handleRegister(e) {
  e.preventDefault();
  const res = await registerUser(
    document.getElementById("regName").value,
    document.getElementById("regEmail").value,
    document.getElementById("regPhone").value,
    document.getElementById("regPass").value,
    document.getElementById("regPatient").value,
  );
  if (res.error) {
    document.getElementById("app").innerHTML = renderRegister(res.error);
    document
      .getElementById("regForm")
      .addEventListener("submit", handleRegister);
  } else {
    location.hash = "dashboard";
    loadGHLData();
    render();
  }
}

// ══════════════════════════════════════════════════════════════
// SHELL (sidebar + main)
// ══════════════════════════════════════════════════════════════
function renderShell(user, activeV) {
  const init = (user.fullname || "U")[0].toUpperCase();
  const nav = [
    { view: "dashboard", icon: "🏠", label: "Dashboard" },
    { view: "resources", icon: "📚", label: "Resources" },
    { view: "ai-support", icon: "🤖", label: "DementiaHub AI Support" },
  ];
  const navLinks = nav
    .map(
      (n) =>
        `<a class="dh-nav-link${activeV === n.view ? " active" : ""}" href="#${n.view}"><span class="text-lg">${n.icon}</span><span>${n.label}</span></a>`,
    )
    .join("");
  const mobIcons = nav
    .map(
      (n) =>
        `<a href="#${n.view}" class="text-lg ${activeV === n.view ? "text-white" : "text-white/50"}">${n.icon}</a>`,
    )
    .join("");
  let content = "";
  if (activeV === "dashboard") content = renderDashboard(user);
  else if (activeV === "resources") content = renderResources();
  else if (activeV === "ai-support") content = renderAISupport(user);
  return `
    <div class="dh-mob-bar">
      <img src="${CFG.logo}" class="h-8 brightness-0 invert" alt="Logo">
      <div class="flex gap-4">${mobIcons}<span onclick="logoutUser()" class="text-red-400 text-lg cursor-pointer">↩</span></div>
    </div>
    <div class="dh-sidebar">
      <img src="${CFG.logo}" class="h-9 mb-8 brightness-0 invert" alt="Logo">
      <div class="flex items-center gap-3 mb-6 p-4 bg-white/10 rounded-2xl">
        <div class="w-10 h-10 rounded-full bg-[#006D77] flex items-center justify-center font-black text-white">${init}</div>
        <div><p class="text-white font-bold text-sm leading-tight">${esc(user.fullname)}</p>
          <p class="text-white/50 text-[10px] font-semibold uppercase tracking-wider">Caregiver</p></div>
      </div>
      <nav class="flex-1 space-y-1">${navLinks}</nav>
      <div class="pt-6 border-t border-white/10">
        <a class="dh-nav-link" style="color:rgba(248,113,113,.8)" onclick="logoutUser()"><span>↩</span><span>Logout</span></a>
      </div>
    </div>
    <div class="dh-main"><div class="dh-content">${content}</div></div>`;
}

function setFilter(f) {
  S.filter = f;
  render();
}

function markKBViewed(key) {
  if (!S.kbViewed.includes(key)) {
    S.kbViewed.push(key);
    localStorage.setItem("dh_kb_viewed", JSON.stringify(S.kbViewed));
    render();
  }
}

// Note Modal
let _noteOppIdx = null;
function openNoteModal(idx) {
  _noteOppIdx = idx;
  const op = idx !== null ? (S.opps || [])[idx] : null;
  const name = op?.contact?.name || "";
  document.getElementById("modal-root").innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal-box">
        <h2 class="text-xl font-black text-slate-900 mb-1">📝 Add Case Note</h2>
        <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mb-5">Syncing to: <span class="text-teal-600">${esc(name || "Select a case below")}</span></p>
        ${!name ? `<div class="mb-3"><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contact ID</label><input id="noteContactId" class="dh-input" placeholder="GHL Contact ID"></div>` : ""}
        <textarea id="noteText" class="dh-input resize-none h-32 mb-2" placeholder="Describe the care update or urgency…"></textarea>
        <div id="noteResult" class="mt-2"></div>
        <div class="flex gap-3 mt-4">
          <button id="noteBtn" onclick="submitNote()" class="dh-btn-primary dh-btn-sm flex-1" style="width:auto;">Sync to GHL</button>
          <button onclick="closeModal()" class="px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition">Cancel</button>
        </div>
      </div>
    </div>`;
}

async function submitNote() {
  const noteText = document.getElementById("noteText").value.trim();
  const btn = document.getElementById("noteBtn");
  const resultEl = document.getElementById("noteResult");
  const op = _noteOppIdx !== null ? (S.opps || [])[_noteOppIdx] : null;
  const contactId =
    op?.contact?.id ||
    (document.getElementById("noteContactId")?.value || "").trim();

  if (!noteText) {
    resultEl.innerHTML = '<div class="alert-error">Please type a note.</div>';
    return;
  }
  if (!contactId) {
    resultEl.innerHTML = '<div class="alert-error">No contact ID found.</div>';
    return;
  }

  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    await postNote(contactId, noteText);
    resultEl.innerHTML =
      '<div class="alert-success">✓ Note synced to GHL!</div>';
    document.getElementById("noteText").value = "";
    setTimeout(closeModal, 1500);
  } catch (e) {
    resultEl.innerHTML = `<div class="alert-error">Failed: ${esc(e.message)}</div>`;
  } finally {
    btn.innerHTML = "Sync to GHL";
    btn.disabled = false;
  }
}

// Callback Modal
let _cbOppIdx = null;
function openCallbackModal(idx) {
  _cbOppIdx = idx;
  const op = idx !== null ? (S.opps || [])[idx] : null;
  const name = op?.contact?.name || "";
  const cid = op?.contact?.id || "";
  const calOptions =
    S.calendars && S.calendars.length
      ? S.calendars
          .map((c) => `<option value="${esc(c.id)}">${esc(c.name)}</option>`)
          .join("")
      : '<option value="">No calendars loaded</option>';
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("modal-root").innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal-box">
        <h2 class="text-xl font-black text-slate-900 mb-1">📅 Schedule Callback</h2>
        ${name ? `<p class="text-xs text-teal-600 font-bold uppercase tracking-wider mb-5">For: ${esc(name)}</p>` : '<p class="text-xs text-slate-400 mb-5">Select a contact and time</p>'}
        <div class="space-y-3">
          <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Calendar</label>
            <select id="mcbCal" class="dh-select">${calOptions}</select></div>
          <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contact ID</label>
            <input id="mcbContact" class="dh-input" value="${esc(cid)}" placeholder="GHL Contact ID" style="font-size:12px;font-family:monospace;"></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Date</label>
              <input id="mcbDate" class="dh-input" type="date" min="${today}" value="${today}"></div>
            <div><label class="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Time</label>
              <input id="mcbTime" class="dh-input" type="time" value="10:00"></div>
          </div>
        </div>
        <div id="cbModalResult" class="mt-3"></div>
        <div class="flex gap-3 mt-4">
          <button id="mcbBtn" onclick="submitCallbackModal()" class="dh-btn-primary dh-btn-sm flex-1" style="width:auto;">Book Callback</button>
          <button onclick="closeModal()" class="px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition">Cancel</button>
        </div>
      </div>
    </div>`;
}

async function submitCallbackModal() {
  const calId = document.getElementById("mcbCal").value;
  const contactId = document.getElementById("mcbContact").value.trim();
  const date = document.getElementById("mcbDate").value;
  const time = document.getElementById("mcbTime").value;
  const btn = document.getElementById("mcbBtn");
  const resultEl = document.getElementById("cbModalResult");

  if (!calId || !contactId || !date || !time) {
    resultEl.innerHTML =
      '<div class="alert-error">Please fill all fields.</div>';
    return;
  }

  const startTime = new Date(date + "T" + time + ":00").toISOString();
  const endTime = new Date(
    new Date(startTime).getTime() + 30 * 60000,
  ).toISOString(); // 30min slot

  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled = true;
  try {
    await scheduleCallback(calId, contactId, startTime, endTime);
    resultEl.innerHTML =
      '<div class="alert-success">✓ Callback scheduled in GHL!</div>';
    setTimeout(closeModal, 1800);
  } catch (e) {
    resultEl.innerHTML = `<div class="alert-error">Failed: ${esc(e.message)}</div>`;
  } finally {
    btn.innerHTML = "Book Callback";
    btn.disabled = false;
  }
}

// Inline callback (dashboard panel)
async function submitCallback() {
  const calId = document.getElementById("cbCalendar")?.value;
  const contactId = document.getElementById("cbContactId")?.value?.trim();
  const date = document.getElementById("cbDate")?.value;
  const time = document.getElementById("cbTime")?.value;
  const btn = document.getElementById("cbBtn");
  const resultEl = document.getElementById("cbResult");
  if (!calId || !contactId || !date || !time) {
    resultEl.innerHTML =
      '<div class="alert-error">Please fill all fields.</div>';
    return;
  }
  const startTime = new Date(date + "T" + time + ":00").toISOString();
  const endTime = new Date(
    new Date(startTime).getTime() + 30 * 60000,
  ).toISOString();
  btn.innerHTML = '<span class="spinner mx-auto"></span>';
  btn.disabled = true;
  try {
    await scheduleCallback(calId, contactId, startTime, endTime);
    resultEl.innerHTML = '<div class="alert-success">✓ Callback booked!</div>';
    document.getElementById("cbContactId").value = "";
    document.getElementById("cbDate").value = "";
  } catch (e) {
    resultEl.innerHTML = `<div class="alert-error">Failed: ${esc(e.message)}</div>`;
  } finally {
    btn.innerHTML = "Book Callback →";
    btn.disabled = false;
  }
}

function closeModal() {
  document.getElementById("modal-root").innerHTML = "";
}

// ══════════════════════════════════════════════════════════════
// CHAT VIEW — GHL webchat + ElevenLabs voice, both context-aware
// ══════════════════════════════════════════════════════════════
function renderChat(user) {
  const ctx = DHUserContext.getCaregiverContext();
  const chatUrl = DHUserContext.buildGHLChatUrl(CFG.locationId, ctx);
  const elVars = ctx
    ? JSON.stringify(DHUserContext.buildElevenLabsVars(ctx))
    : "{}";
  const greeting = ctx
    ? `Welcome back, ${esc(ctx.firstName)}. ${ctx.patientName ? "Caring for <strong>" + esc(ctx.patientName) + "</strong>." : ""}`
    : "AI assistant is available 24/7 to help with caregiving questions.";

  // Log the chat session start
  if (ctx)
    DHUserContext.storeConversationEvent(ctx, {
      type: "chat_view_opened",
      channel: "ghl_webchat",
    });

  return `
    <div class="mb-6">
      <h1 class="text-3xl font-black text-slate-900">💬 AI Support</h1>
      <p class="text-slate-500 mt-1 font-medium">${greeting}</p>
    </div>

    <!-- ── Tab bar ──────────────────────────────────────────── -->
    <div class="flex gap-3 mb-5">
      <button onclick="showChatTab('text')"  id="tab-text"  class="filter-btn active">💬 Text Chat</button>
      <button onclick="showChatTab('voice')" id="tab-voice" class="filter-btn">🎙️ Voice AI</button>
    </div>

    <!-- ── GHL Text Chat ─────────────────────────────────────── -->
    <div id="chat-panel-text">
      <div class="dh-card">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full dh-pulse"></span>
            <span class="text-emerald-700 text-xs font-black uppercase tracking-widest">Chat — Online</span>
          </div>
          ${ctx ? `<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged in as ${esc(ctx.name)}</span>` : ""}
        </div>
        <iframe id="ghl-chat-frame" src="${esc(chatUrl)}"
          style="width:100%;height:620px;border:none;border-radius:16px;display:block;"
          title="DementiaHub AI Chat" loading="lazy" allow="microphone camera"></iframe>
        <div class="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <p class="text-amber-800 text-xs font-semibold">⚠️ General guidance only. For life-threatening emergencies, call <strong>995</strong>.</p>
        </div>
      </div>
    </div>

    <!-- ── ElevenLabs Voice AI ──────────────────────────────── -->
    <div id="chat-panel-voice" class="hidden">
      <div class="dh-card">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-violet-500 rounded-full dh-pulse"></span>
            <span class="text-violet-700 text-xs font-black uppercase tracking-widest">Voice AI — Ready</span>
          </div>
          ${ctx ? `<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Speaking as ${esc(ctx.name)}</span>` : ""}
        </div>

        <div class="flex flex-col items-center justify-center py-8 gap-6">
          <div class="text-center mb-2">
            <p class="font-black text-slate-800 text-lg mb-1">Talk to Your AI Care Assistant</p>
            <p class="text-slate-500 text-sm">Press the button below to start a voice conversation.${ctx?.patientName ? " I already know you're caring for <strong>" + esc(ctx.patientName) + "</strong>." : ""}</p>
          </div>

          <!-- ElevenLabs widget — dynamic-variables inject user context -->
          <elevenlabs-convai
            id="dh-el-widget-caregiver"
            agent-id="${esc(CFG.elevenLabsAgentId)}"
            dynamic-variables='${elVars}'
            style="width:100%;max-width:480px;">
          </elevenlabs-convai>
        </div>

        <div class="mt-4 p-4 bg-violet-50 rounded-2xl border border-violet-100">
          <p class="text-violet-800 text-xs font-semibold">🎙️ Your voice session is private. For emergencies, say <strong>"call 995"</strong> or end the call and dial directly.</p>
        </div>
      </div>
    </div>`;
}

function showChatTab(tab) {
  document
    .getElementById("chat-panel-text")
    .classList.toggle("hidden", tab !== "text");
  document
    .getElementById("chat-panel-voice")
    .classList.toggle("hidden", tab !== "voice");
  document
    .getElementById("tab-text")
    .classList.toggle("active", tab === "text");
  document
    .getElementById("tab-voice")
    .classList.toggle("active", tab === "voice");

  if (tab === "voice") {
    // Ensure ElevenLabs widget has the latest context (in case user data changed)
    const widget = document.getElementById("dh-el-widget-caregiver");
    const ctx = DHUserContext.getCaregiverContext();
    DHUserContext.injectElevenLabsVars(widget, ctx);
    if (ctx)
      DHUserContext.storeConversationEvent(ctx, {
        type: "voice_tab_opened",
        channel: "elevenlabs",
      });
  }
}

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
render();
if (getCurrentUser()) loadGHLData();
