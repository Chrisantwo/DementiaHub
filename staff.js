/* ════════════════════════════════════════════════════════════
   SVG ICON LIBRARY  — replaces every emoji in the UI
   icon('name', size)  →  inline SVG string
════════════════════════════════════════════════════════════ */
function icon(name, sz = 16, col = 'currentColor') {
  const d = {
    grid:        `<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
    folder:      `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>`,
    shield:      `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
    refresh:     `<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>`,
    logout:      `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>`,
    alert:       `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
    'alert-tri': `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
    calendar:    `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
    clock:       `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
    phone:       `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z"/>`,
    check:       `<polyline points="20 6 9 17 4 12"/>`,
    'check-c':   `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>`,
    user:        `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
    users:       `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    inbox:       `<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>`,
    search:      `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
    'file-text': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
    save:        `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>`,
    send:        `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
    zap:         `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
    'chevron-r': `<polyline points="9 18 15 12 9 6"/>`,
    'chevron-d': `<polyline points="6 9 12 15 18 9"/>`,
    plus:        `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
    x:           `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
    'arrow-l':   `<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`,
    list:        `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>`,
    tag:         `<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>`,
    mic:         `<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>`,
    eye:         `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
    lock:        `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
    brain:       `<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.97-3.12 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.45-1.1z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.97-3.12 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.45-1.1z"/>`,
    chat:        `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
    clipboard:   `<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>`,
    flag:        `<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>`,
    book:        `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
    cpu:         `<rect x="9" y="9" width="6" height="6"/><path d="M3 8h2m14 0h2M3 12h2m14 0h2M3 16h2m14 0h2M8 3v2m0 14v2m4-18v2m0 14v2m4-18v2m0 14v2"/><path d="M7 3a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4z"/>`,
    activity:    `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
    kb:          `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
    'bar-chart': `<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>`,
  };
  const sw = name === 'check' ? '2.5' : '2';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" class="dh-ico" style="display:inline-flex;align-items:center;vertical-align:middle;flex-shrink:0;">${d[name] || ''}</svg>`;
}

/* Urgency dot helper */
function urgDot(u) {
  const c = { critical: '#DC2626', high: '#EA580C', medium: '#D97706', low: '#16A34A' };
  return `<span class="urgency-dot" style="background:${c[u] || '#16A34A'};"></span>`;
}

/* Info tile helper */
function infoTile(label, content, bgColor = '#F8FAFC', borderColor = '#E8EDF3') {
  return `<div style="background:${bgColor};border:1px solid ${borderColor};border-radius:10px;padding:11px 13px;">
    <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px;">${label}</p>
    ${content}
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   CONFIG  (preserved exactly)
════════════════════════════════════════════════════════════ */
const CFG = {
  locationId:        'Idf9v4q6aqh5KhzXip6e',
  accessKey:         'admin123',
  elevenLabsAgentId: 'agent_7801kkd50dzsez4tfv4qme5mn6br',
};

const STAFF_LIST = ['Case Manager Wibiz','DementiaSG Admin','Helpline Staff Wibiz','Read-only Analyst Wibiz','Unassigned'];
const ROLES      = ['Case Manager Wibiz','DementiaSG Admin','Helpline Staff Wibiz','Read-only Analyst Wibiz'];
const CASE_STATUSES = [
  'New - Untriaged',
  'Self-Serve Resolved',
  'Needs Staff - Awaiting Contact',
  'Escalation \u2013 No Staff Available',
  'In Progress',
  'Callback Scheduled',
  'Scheduled / Follow Up',
  'Referred / Redirected',
  'Closed - Resolved',
  'Closed - Unreachable',
  'Urgent - Immediate Action',
];
const _RESOLVED_STATUSES = new Set(['Self-Serve Resolved','Closed - Resolved','Closed - Unreachable','Referred / Redirected']);
const _TRIAGED_STATUSES  = new Set(['In Progress','Needs Staff - Awaiting Contact','Callback Scheduled','Scheduled / Follow Up','Escalation \u2013 No Staff Available']);

/* Role helpers */
function currentRole(){ return getCurrentStaff()?.staffRole || ''; }
function isCaseManager(){ return currentRole() === 'Case Manager Wibiz'; }
function roleAccessControl(enrichedList){
  if(isCaseManager()) return enrichedList;
  const role = currentRole();
  return enrichedList.filter(o => o.assignedTo === role || o.assignedTo === 'Unassigned');
}

/* ════════════════════════════════════════════════════════════
   STATE  (preserved exactly)
════════════════════════════════════════════════════════════ */
let ghlOpps        = null;
let activeFilter   = 'all';
let searchQuery    = '';
let sortCol        = 'updated';
let sortDir        = 'desc';
let activeChatIdx  = 0;
let selectedCaseId = null;
let assignments    = JSON.parse(localStorage.getItem('dsg_assignments')    || '{}');
let callbacks      = JSON.parse(localStorage.getItem('dsg_callbacks')      || '[]');
let caseStatuses   = JSON.parse(localStorage.getItem('dsg_case_statuses')  || '{}');
let caseNotes      = JSON.parse(localStorage.getItem('dsg_case_notes')     || '{}');
let cbStatuses     = JSON.parse(localStorage.getItem('dsg_cb_statuses')    || '{}');

/* ════════════════════════════════════════════════════════════
   AUTH  (preserved exactly)
════════════════════════════════════════════════════════════ */
function isAuth(){ return sessionStorage.getItem('dsg_auth') === '1'; }
function doLogin(key, staffRole){
  if(key !== CFG.accessKey) return false;
  DHUserContext.saveStaffSession(staffRole, staffRole);
  DHUserContext.configureGHLWidget(DHUserContext.getStaffContext());
  return true;
}
function doLogout(){ DHUserContext.clearStaffSession(); ghlOpps = null; render(); }
function getCurrentStaff(){ return DHUserContext.getStaffContext(); }

/* ════════════════════════════════════════════════════════════
   ROUTING  (preserved exactly)
════════════════════════════════════════════════════════════ */
function getView(){ return location.hash.replace('#', '') || 'overview'; }
window.addEventListener('hashchange', () => { selectedCaseId = null; render(); });

/* ════════════════════════════════════════════════════════════
   GHL API  (preserved exactly)
════════════════════════════════════════════════════════════ */
async function fetchGHL(){
  try{
    ghlOpps = await DHAPI.getOpportunities(50);
    console.log('[fetchGHL] Loaded - staff.js:142', ghlOpps.length, 'opportunities');
  }catch(e){ ghlOpps = []; console.warn('[fetchGHL] - staff.js:143', e.message); }
  render();
}
async function syncNoteToGHL(contactId, text){ return DHAPI.addNote(contactId, text); }

/* ════════════════════════════════════════════════════════════
   DATA ENRICHMENT  (preserved exactly)
════════════════════════════════════════════════════════════ */
const CRIT_KW=['urgent','critical','emergency','fall','missing','wander','danger','immediate','acute','assault','suicid','harm'];
const WARN_KW=['anxious','distress','confused','upset','worried','agitated','unsafe','concern'];
const CAT_MAP={Safety:['fall','missing','wander','danger','harm','suicid','assault'],Medical:['medical','health','doctor','hospital','medication','pain','ill'],Emotional:['anxiety','distress','depress','grief','upset','agitated'],Admin:['grant','subsidy','cara','registration','form','paperwork'],Resource:['resource','centre','facility','service','referral']};
const INTENT_MAP={Emergency:['urgent','emergency','critical','immediate'],'Seeking Help':['help','assist','support','need'],Information:['info','resource','find','where','what','how'],'Follow-up':['follow','update','status','check'],Complaint:['complaint','issue','problem']};

function enrich(op, idx){
  const txt=((op.name||'')+' '+(op.pipelineStageName||'')).toLowerCase();
  const hrs=(Date.now()-new Date(op.updatedAt||op.createdAt).getTime())/3600000;
  let urgency='low';
  if(CRIT_KW.some(k=>txt.includes(k))||hrs>72) urgency='critical';
  else if(WARN_KW.some(k=>txt.includes(k))||hrs>24) urgency='medium';
  let category='General';
  for(const [cat,kws] of Object.entries(CAT_MAP)){ if(kws.some(k=>txt.includes(k))){ category=cat; break; } }
  let intent='General Inquiry';
  for(const [int,kws] of Object.entries(INTENT_MAP)){ if(kws.some(k=>txt.includes(k))){ intent=int; break; } }
  let sla='ok';
  if(hrs>4) sla='breach'; else if(hrs>2) sla='warn';
  const caseId='C-'+String(op.id||idx).replace(/[^a-z0-9]/gi,'').slice(-6).toUpperCase();
  const assignedTo=assignments[op.id]||'Unassigned';
  const localStatus=caseStatuses[op.id];
  let displayStatus='new';
  if(localStatus){
    if(_RESOLVED_STATUSES.has(localStatus)) displayStatus='resolved';
    else if(_TRIAGED_STATUSES.has(localStatus)) displayStatus='triaged';
    else if(localStatus==='Urgent - Immediate Action') displayStatus='critical';
    else{
      const ls=localStatus.toLowerCase().replace(/\s+/g,'');
      if(ls==='resolved') displayStatus='resolved';
      else if(ls==='inprogress'||ls==='triaged') displayStatus='triaged';
    }
  } else {
    const stage=(op.pipelineStageName||'').toLowerCase();
    const ghlSt=(op.status||'').toLowerCase();
    if(ghlSt==='won'||ghlSt==='lost') displayStatus='resolved';
    else if(/triage|progress|active|contact|open/i.test(stage)) displayStatus='triaged';
  }
  const cbEntry=cbStatuses[op.id];
  const dueSoon=displayStatus!=='resolved'&&(urgency==='critical'||urgency==='high'||(cbEntry&&!cbEntry.done));
  const displayName=op.contact?.name||op.contact?.phone||caseId;
  return{...op,urgency,category,intent,sla,caseId,hrs,assignedTo,displayStatus,dueSoon,displayName};
}

/* ════════════════════════════════════════════════════════════
   HELPERS  (preserved exactly)
════════════════════════════════════════════════════════════ */
function esc(v){ return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtDate(iso){ return iso?new Date(iso).toLocaleString('en-SG',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'—'; }
function fmtShort(iso){ if(!iso)return'—'; const d=new Date(iso); return d.toLocaleTimeString('en-SG',{hour:'2-digit',minute:'2-digit'})+' · '+d.toLocaleDateString('en-SG',{month:'short',day:'numeric'}); }
function today(){ return new Date().toLocaleDateString('en-SG',{weekday:'long',year:'numeric',month:'long',day:'numeric'}); }
function timeAgo(iso){ if(!iso)return'—'; const h=(Date.now()-new Date(iso).getTime())/3600000; if(h<1)return Math.round(h*60)+'m ago'; if(h<24)return Math.round(h)+'h ago'; return Math.round(h/24)+'d ago'; }
function getHandovers(){ return JSON.parse(localStorage.getItem('dsg_handovers')||'[]'); }
function saveHandover(text){
  const staff=getCurrentStaff();
  const notes=getHandovers();
  notes.unshift({staff_id:staff?.userId||'unknown',staff_name:staff?.name||'Staff Member',staff_role:staff?.staffRole||'',note_content:text,created_at:new Date().toISOString()});
  localStorage.setItem('dsg_handovers',JSON.stringify(notes.slice(0,30)));
}
function getMessages(id){ return JSON.parse(localStorage.getItem('dsg_msg_'+id)||'[]'); }
function addMessage(id,msg){ const msgs=getMessages(id); msgs.push(msg); localStorage.setItem('dsg_msg_'+id,JSON.stringify(msgs.slice(-60))); }

/* ════════════════════════════════════════════════════════════
   RENDER ENTRY  (preserved exactly)
════════════════════════════════════════════════════════════ */
function render(){
  const app=document.getElementById('app');
  if(!isAuth()){ app.innerHTML=renderLogin(); document.getElementById('loginForm').addEventListener('submit',handleLogin); return; }
  app.innerHTML=renderShell(getView());
  if(selectedCaseId) openCaseDetail(selectedCaseId);
}
function handleLogin(e){
  e.preventDefault();
  const key      =document.getElementById('accessKey').value;
  const staffRole=document.getElementById('staffRole').value;
  if(!staffRole){ document.getElementById('loginError').textContent='Please select your role.'; document.getElementById('loginError').classList.remove('hidden'); return; }
  if(doLogin(key,staffRole)){ fetchGHL(); startAutoRefresh(30000); render(); }
  else{ document.getElementById('loginError').textContent='Incorrect access key.'; document.getElementById('loginError').classList.remove('hidden'); }
}

/* ════════════════════════════════════════════════════════════
   ① LOGIN  — redesigned (role-only, no name)
════════════════════════════════════════════════════════════ */
function renderLogin(){
  const roleOpts=ROLES.map(r=>`<option value="${esc(r)}">${esc(r)}</option>`).join('');
  return `
  <div class="dh-auth-bg">
    <div class="auth-orb" style="width:480px;height:480px;background:#00BFD0;top:-160px;right:-110px;opacity:.13;filter:blur(80px);"></div>
    <div class="auth-orb" style="width:320px;height:320px;background:#006D77;bottom:-90px;left:-60px;opacity:.16;filter:blur(80px);"></div>

    <div class="dh-auth-card">
      <!-- Brand -->
      <div style="display:flex;align-items:center;gap:13px;margin-bottom:30px;">
        <div style="width:46px;height:46px;background:linear-gradient(135deg,#003D44,#006D77);border-radius:13px;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 6px 20px rgba(0,109,119,.38);flex-shrink:0;">
          ${icon('brain', 24)}
        </div>
        <div>
          <div style="font-size:15px;font-weight:800;color:#003D44;letter-spacing:-.2px;">DementiaHub</div>
          <div style="font-size:10px;color:#94A3B8;font-weight:500;margin-top:1px;">AI Command Center v4.0</div>
        </div>
      </div>

      <h1 style="font-size:23px;font-weight:800;color:#0F172A;letter-spacing:-.4px;margin-bottom:5px;">Welcome back</h1>
      <p style="font-size:13.5px;color:#64748B;margin-bottom:26px;">Staff access — DementiaHub</p>

      <div id="loginError" class="hidden" style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:10px 14px;font-size:12.5px;font-weight:600;color:#B91C1C;margin-bottom:16px;"></div>

      <form id="loginForm" style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px;">Your Role</label>
          <select id="staffRole" class="dh-select" style="width:100%;height:44px;" required>
            <option value="">— Select your role —</option>
            ${roleOpts}
          </select>
        </div>
        <div>
          <label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px;">Access Key</label>
          <div style="position:relative;">
            <input id="accessKey" type="password" placeholder="Enter access key"
              class="dh-input" style="padding-right:44px;font-family:monospace;letter-spacing:2px;height:44px;"
              autocomplete="current-password" required>
            <button type="button" onclick="togglePwVis()" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#94A3B8;display:flex;align-items:center;padding:4px;">
              ${icon('eye', 16)}
            </button>
          </div>
        </div>
        <button type="submit" class="dh-btn dh-btn-primary" style="height:46px;font-size:14px;margin-top:2px;width:100%;">
          Unlock Dashboard ${icon('chevron-r', 15, '#fff')}
        </button>
      </form>

      <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:18px;font-size:10.5px;color:#94A3B8;">
        ${icon('lock', 11, '#94A3B8')} Secured connection &nbsp;·&nbsp; HIPAA-aware logging
      </div>
    </div>
  </div>`;
}
function togglePwVis(){ const i=document.getElementById('accessKey'); i.type=i.type==='password'?'text':'password'; }

/* ════════════════════════════════════════════════════════════
   ② SHELL  — role-based nav, footer, redesigned
════════════════════════════════════════════════════════════ */
function renderShell(activeV){
  const canHandover=isCaseManager();
  if(activeV==='handover'&&!canHandover){ location.hash='overview'; return renderShell('overview'); }

  const nav=[
    {section:'Monitor'},
    {view:'overview', ico:'grid',   label:'Overview'},
    {view:'cases',    ico:'folder', label:'Case Management'},
    ...(canHandover?[{section:'Operations'},{view:'handover',ico:'shield',label:'Staff Handover'}]:[]),
  ];
  const navHtml=nav.map(n=>{
    if(n.section) return `<div class="dh-nav-section">${n.section}</div>`;
    return `<a class="dh-nav-link${activeV===n.view?' active':''}" href="#${n.view}">
      <div class="nav-ico">${icon(n.ico, 14)}</div>
      <span>${n.label}</span>
    </a>`;
  }).join('');

  const mobIcons=nav.filter(n=>n.view).map(n=>`
    <a href="#${n.view}" style="color:${activeV===n.view?'#fff':'rgba(255,255,255,.4)'};display:flex;">${icon(n.ico, 20)}</a>`).join('');

  const allEnriched=(ghlOpps||[]).map(enrich);
  const enriched=roleAccessControl(allEnriched);
  const critCount=enriched.filter(o=>o.urgency==='critical').length;

  let content='';
  if(activeV==='overview') content=renderOverview(enriched);
  else if(activeV==='cases') content=renderCases(enriched);
  else if(activeV==='handover') content=renderHandover();

  const staff=getCurrentStaff();
  const init=staff?staff.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase():'S';
  const name=staff?esc(staff.name):'Staff Member';
  const role=staff?esc(staff.staffRole):'Admin';

  return `
  <!-- Mobile bar -->
  <div class="dh-mob-bar">
    <div style="display:flex;align-items:center;gap:9px;color:#fff;">${icon('brain',20)} <span style="font-weight:800;font-size:13px;">DementiaHub</span></div>
    <div style="display:flex;align-items:center;gap:12px;">${mobIcons}
      <span onclick="doLogout()" style="cursor:pointer;color:rgba(248,113,113,.8);display:flex;">${icon('logout',18)}</span>
    </div>
  </div>

  <!-- Sidebar -->
  <nav class="dh-sidebar">
    <!-- Brand -->
    <div style="display:flex;align-items:center;gap:10px;padding-bottom:17px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:15px;position:relative;z-index:1;">
      <div style="width:34px;height:34px;background:linear-gradient(135deg,#006D77,#009FA9);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;box-shadow:0 3px 12px rgba(0,109,119,.4);">
        ${icon('brain', 16)}
      </div>
      <div>
        <div style="font-size:12.5px;font-weight:800;color:#fff;line-height:1.2;">DementiaHub</div>
        <div style="font-size:9px;color:rgba(255,255,255,.3);font-weight:500;">AI Command Center v4.0</div>
      </div>
    </div>

    <!-- User card -->
    <div style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:10px 12px;margin-bottom:18px;display:flex;align-items:center;gap:10px;position:relative;z-index:1;">
      <div style="width:32px;height:32px;background:linear-gradient(135deg,#006D77,#009FA9);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0;">${init}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:11.5px;font-weight:700;color:#fff;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
        <div style="font-size:9px;color:rgba(255,255,255,.36);font-weight:600;text-transform:uppercase;letter-spacing:.05em;">${role}</div>
      </div>
      ${critCount?`<span style="background:#DC2626;color:#fff;font-size:9px;font-weight:800;border-radius:99px;min-width:20px;height:20px;display:flex;align-items:center;justify-content:center;padding:0 5px;flex-shrink:0;animation:flashbadge 1.3s infinite;">${critCount}</span>`:''}
    </div>

    <nav style="flex:1;position:relative;z-index:1;">${navHtml}</nav>

    <div class="sb-bot" style="position:relative;z-index:1;">
      <div class="sb-live"><div class="sb-live-dot"></div>GHL Live Connected</div>
      <div class="sb-act" onclick="fetchGHL()">${icon('refresh',14)} <span>Refresh Data</span></div>
      <div class="sb-act danger" onclick="doLogout()">${icon('logout',14)} <span>Logout</span></div>
      <div class="sb-ver">AI Command Center v4.0</div>
    </div>
  </nav>

  <!-- Main -->
  <div class="dh-main">
    <div class="dh-content">${content}</div>

    <footer style="padding:16px 28px;border-top:1px solid #E8EDF3;background:#fff;display:flex;align-items:center;justify-content:center;gap:20px;">
      <a href="https://dementiahub.wibiz.ai/home" target="_blank" style="color:#006D77;font-size:12.5px;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:6px;">
        ${icon('kb',13,'#006D77')} Knowledge Base
      </a>
      <span style="color:#E2E8F0;">|</span>
      <span style="color:#94A3B8;font-size:11.5px;">DementiaHub AI Command Center</span>
    </footer>
  </div>

  <!-- Voice AI widget -->
  <div id="voice-ai-widget" style="position:fixed;bottom:24px;right:28px;z-index:200;"></div>

  <!-- Note Modal -->
  <div id="noteModal" class="hidden" style="position:fixed;inset:0;background:rgba(0,30,40,.65);backdrop-filter:blur(7px);z-index:500;display:none;align-items:center;justify-content:center;padding:20px;">
    <div style="background:#fff;border-radius:22px;padding:28px;width:100%;max-width:440px;box-shadow:0 24px 60px rgba(0,0,0,.2);">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
        <div style="width:40px;height:40px;background:#F0FDF4;border-radius:11px;display:flex;align-items:center;justify-content:center;color:#16A34A;">${icon('file-text',20)}</div>
        <div>
          <div style="font-size:16px;font-weight:800;color:#0F172A;">Add Case Note</div>
          <div style="font-size:11px;color:#94A3B8;margin-top:2px;">Syncing to: <span id="modalName" style="color:#006D77;font-weight:700;">Contact</span></div>
        </div>
      </div>
      <textarea id="noteText" class="dh-input" style="resize:none;min-height:120px;margin-bottom:10px;" placeholder="Describe the care update…"></textarea>
      <div id="noteErr" class="hidden" style="font-size:12px;color:#DC2626;font-weight:600;margin-bottom:10px;"></div>
      <div style="display:flex;gap:10px;">
        <button id="noteBtn" onclick="submitNote()" class="dh-btn dh-btn-primary" style="flex:1;">${icon('send',13,'#fff')} Sync to GHL</button>
        <button onclick="closeNoteModal()" class="dh-btn dh-btn-ghost">Cancel</button>
      </div>
    </div>
  </div>

  <div id="modal-root"></div>`;
}

/* ════════════════════════════════════════════════════════════
   ③ OVERVIEW  — Quick View filters don't redirect (preserved)
════════════════════════════════════════════════════════════ */
function renderOverview(enriched){
  const loading  =ghlOpps===null;
  const total    =enriched.length;
  const critical =enriched.filter(o=>o.urgency==='critical').length;
  const today_ct =enriched.filter(o=>{ if(!o.createdAt)return false; return (Date.now()-new Date(o.createdAt).getTime())<86400000; }).length;
  const resolved =enriched.filter(o=>o.displayStatus==='resolved').length;
  const active_ct=enriched.filter(o=>o.displayStatus!=='resolved').length;
  const due_soon =enriched.filter(o=>o.dueSoon&&o.displayStatus!=='resolved').length;
  const pend_cb  =Object.values(cbStatuses).filter(c=>!c.done).length+callbacks.length;
  const slaOk    =enriched.filter(o=>o.sla==='ok').length;
  const slaWarn  =enriched.filter(o=>o.sla==='warn').length;
  const slaBreach=enriched.filter(o=>o.sla==='breach').length;
  const pct      =n=>total?Math.round(n/total*100):0;

  /* Safety banner */
  const safetyOps=enriched.filter(o=>o.urgency==='critical');
  const banner=safetyOps.length?`
    <div class="safety-banner">
      <div class="safety-ico flash">${icon('alert-tri',20)}</div>
      <div style="flex:1;">
        <p style="font-size:13px;font-weight:800;color:#7F1D1D;margin-bottom:8px;">
          SAFETY ALERT — ${safetyOps.length} Critical Case${safetyOps.length>1?'s':''} Require Immediate Attention
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${safetyOps.slice(0,4).map(o=>`
            <div style="display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #FECACA;border-radius:10px;padding:6px 12px;">
              <span class="badge badge-critical flash" style="font-size:9.5px;">${esc(o.caseId)}</span>
              <span style="font-size:12px;font-weight:700;color:#7F1D1D;">${esc((o.contact?.name||'Unknown').split(' ')[0])}</span>
              <span style="font-size:10px;color:#EF4444;">${timeAgo(o.updatedAt)}</span>
              <button onclick="openAIModal(${enriched.indexOf(o)})" class="dh-btn dh-btn-danger dh-btn-sm">${icon('zap',10)} AI Insight</button>
            </div>`).join('')}
          ${safetyOps.length>4?`<span style="font-size:11px;font-weight:700;color:#DC2626;align-self:center;">+${safetyOps.length-4} more</span>`:''}
        </div>
      </div>
      <a href="#cases" onclick="setFilter('critical')" class="dh-btn dh-btn-danger" style="flex-shrink:0;">
        View Critical ${icon('chevron-r',12,'#DC2626')}
      </a>
    </div>`:''

  /* Stat cards */
  const stats=[
    {ico:'calendar', label:'Calls Today',       val:today_ct,  fg:'#3B82F6', bg:'rgba(59,130,246,.09)',  bar:'#3B82F6,#93C5FD'},
    {ico:'folder',   label:'Active Cases',       val:active_ct, fg:'#7C3AED', bg:'rgba(124,58,237,.09)', bar:'#7C3AED,#C4B5FD'},
    {ico:'alert',    label:'High Priority',      val:critical,  fg:'#DC2626', bg:'rgba(220,38,38,.09)',  bar:'#DC2626,#FCA5A5'},
    {ico:'clock',    label:'Due Soon',           val:due_soon,  fg:'#D97706', bg:'rgba(217,119,6,.09)',  bar:'#D97706,#FCD34D'},
    {ico:'phone',    label:'Pending Callbacks',  val:pend_cb,   fg:'#0284C7', bg:'rgba(2,132,199,.09)',  bar:'#0284C7,#7DD3FC'},
    {ico:'check-c',  label:'Resolved',           val:resolved,  fg:'#16A34A', bg:'rgba(22,163,74,.09)',  bar:'#16A34A,#86EFAC'},
  ];
  const statsHtml=stats.map(s=>`
    <div class="dh-stat-card">
      <div class="stat-top-bar" style="background:linear-gradient(90deg,${s.bar});"></div>
      <div class="stat-bg-glow" style="background:${s.fg};"></div>
      <div class="dh-stat-icon" style="background:${s.bg};color:${s.fg};">${icon(s.ico, 20)}</div>
      <div>
        <div style="font-size:32px;font-weight:800;line-height:1;letter-spacing:-.5px;color:${s.fg};">
          ${loading?`<span style="font-size:18px;color:#CBD5E1;">—</span>`:s.val}
        </div>
        <div style="font-size:11px;color:#94A3B8;font-weight:600;margin-top:3px;">${s.label}</div>
      </div>
    </div>`).join('');

  /* SLA row */
  const slaRow=`
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px;">
      ${[
        {cls:'sla-ok',    ico:'check',    num:slaOk,    lbl:'On Track',     sub:'Within 2 hours',  pct:pct(slaOk)},
        {cls:'sla-warn',  ico:'clock',    num:slaWarn,  lbl:'Due Soon',     sub:'2 – 4 hours',     pct:pct(slaWarn)},
        {cls:'sla-breach',ico:'alert',    num:slaBreach,lbl:'SLA Breached', sub:'Over 4 hours',    pct:pct(slaBreach)},
      ].map(s=>`
        <div class="sla-card ${s.cls}">
          <div class="sla-ico">${icon(s.ico, 20)}</div>
          <div style="flex:1;min-width:0;">
            <div class="sla-num">${loading?'—':s.num}</div>
            <div class="sla-lbl">${s.lbl}</div>
            <div class="sla-sub">${s.sub}</div>
            <div class="sla-bar-bg"><div class="sla-fill" style="width:${s.pct}%;"></div></div>
          </div>
          <div class="sla-pct">${s.pct}%</div>
        </div>`).join('')}
    </div>`;

  /* Pipeline: responds to Quick View filter without redirecting */
  const _24h=86400000;
  let pipelineRows=enriched;
  if     (activeFilter==='critical')    pipelineRows=enriched.filter(o=>o.urgency==='critical');
  else if(activeFilter==='untriaged')   pipelineRows=enriched.filter(o=>o.displayStatus==='new');
  else if(activeFilter==='needs_staff') pipelineRows=enriched.filter(o=>o.assignedTo==='Unassigned'&&o.displayStatus!=='resolved');
  else if(activeFilter==='sla_breach')  pipelineRows=enriched.filter(o=>o.sla==='breach');
  else if(activeFilter==='resolved')    pipelineRows=enriched.filter(o=>o.displayStatus==='resolved');
  else if(activeFilter==='new')         pipelineRows=enriched.filter(o=>(Date.now()-new Date(o.createdAt||0).getTime())<_24h);

  const topRows=pipelineRows.slice(0,6).map((op,i)=>`
    <tr>
      <td><span class="badge badge-${op.urgency}">${urgDot(op.urgency)} ${op.urgency}</span></td>
      <td>
        <p style="font-weight:700;font-size:12.5px;color:#0F172A;">${esc(op.contact?.name||'Visitor')}</p>
        <p style="font-size:9.5px;color:#94A3B8;font-family:monospace;margin-top:2px;">${esc(op.caseId)}</p>
      </td>
      <td class="truncate-cell" style="font-size:12px;color:#64748B;">${esc(op.name||'—')}</td>
      <td><span class="badge badge-sla-${op.sla}">${op.sla==='ok'?'On Track':op.sla==='warn'?'Due Soon':'Breached'}</span></td>
      <td style="font-size:10.5px;color:#94A3B8;white-space:nowrap;">${timeAgo(op.updatedAt)}</td>
      <td>
        <div style="display:flex;gap:5px;justify-content:flex-end;">
          <button onclick="openAIModal(${i})" class="dh-btn dh-btn-ghost dh-btn-sm">${icon('zap',11)} AI</button>
          <button onclick="openModal(${i})"   class="dh-btn dh-btn-ghost dh-btn-sm">${icon('file-text',11)}</button>
        </div>
      </td>
    </tr>`).join('')||`
    <tr><td colspan="6">
      <div class="empty-state">
        <div class="empty-ico">${icon('inbox',26)}</div>
        <div class="empty-title">No pipeline data</div>
        <div class="empty-sub">Cases will appear once synced from GoHighLevel</div>
      </div>
    </td></tr>`;

  /* Callbacks */
  const cbHtml=callbacks.slice(0,4).map(cb=>`
    <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#F8FAFC;border:1px solid #E8EDF3;border-radius:11px;margin-bottom:8px;">
      <div style="width:32px;height:32px;background:#E0F2FE;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#0284C7;flex-shrink:0;">${icon('phone',13)}</div>
      <div style="flex:1;min-width:0;">
        <p style="font-weight:700;font-size:12.5px;color:#0F172A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(cb.name)}</p>
        <p style="font-size:10px;color:#94A3B8;margin-top:2px;">${esc(cb.time)} · ${esc(cb.staff||'Unassigned')}</p>
      </div>
      <button onclick="removeCallback('${cb.id}')" class="dh-btn dh-btn-ghost dh-btn-sm">${icon('check',11)} Done</button>
    </div>`).join('')||`
    <div class="empty-state" style="padding:24px 0;">
      <div class="empty-ico" style="width:40px;height:40px;">${icon('phone',18)}</div>
      <div class="empty-title" style="font-size:12px;">No callbacks scheduled</div>
    </div>`;

  /* Breakdown */
  const bdData=[
    ['Open',   enriched.filter(o=>o.displayStatus!=='resolved').length,'#60A5FA'],
    ['Critical',critical,'#F87171'],
    ['Resolved',resolved,'#34D399'],
  ];

  return `
  <!-- Page header -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:12px;">
    <div>
      <h1 style="font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-.3px;">AI Command Center</h1>
      <p style="font-size:12.5px;color:#94A3B8;margin-top:3px;font-weight:500;">${today()}</p>
    </div>
    <div style="display:flex;align-items:center;gap:10px;">
      <div class="status-chip chip-live">
        <span style="width:7px;height:7px;background:#22C55E;border-radius:50%;display:inline-block;" class="dh-pulse"></span>
        ${loading?'Connecting…':'GHL Live'}
      </div>
      <button onclick="fetchGHL()" class="status-chip chip-ref">${icon('refresh',12)} Refresh</button>
    </div>
  </div>

  ${banner}

  <!-- Stat cards -->
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:16px;">${statsHtml}</div>

  <!-- SLA -->
  ${slaRow}

  <!-- Quick View — does NOT redirect, filters pipeline inline -->
  <div class="filter-bar">
    <span style="font-size:11px;font-weight:700;color:#94A3B8;align-self:center;margin-right:3px;">Quick View:</span>
    <button class="flt-btn danger ${activeFilter==='critical'?'active':''}" onclick="setFilter('critical')">${icon('alert-tri',12)} Safety Priority</button>
    <button class="flt-btn ${activeFilter==='untriaged'?'active':''}" onclick="setFilter('untriaged')">${icon('tag',12)} Untriaged</button>
    <button class="flt-btn ${activeFilter==='needs_staff'?'active':''}" onclick="setFilter('needs_staff')">${icon('user',12)} Needs Staff</button>
    <button class="flt-btn ${activeFilter==='sla_breach'?'active':''}" onclick="setFilter('sla_breach')">${icon('clock',12)} SLA Breached</button>
    <button class="flt-btn ${activeFilter==='all'?'active':''}" onclick="setFilter('all')">${icon('refresh',12)} Reset</button>
  </div>

  <!-- Pipeline + right column -->
  <div style="display:grid;grid-template-columns:1fr 336px;gap:16px;">

    <div class="dh-card" style="padding:0;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 22px 14px;border-bottom:1px solid #F5F7FA;">
        <div>
          <div style="font-size:14px;font-weight:800;color:#0F172A;">Live Pipeline</div>
          <div style="font-size:11.5px;color:#94A3B8;margin-top:2px;">Top 6 from GoHighLevel</div>
        </div>
        <a href="#cases" class="dh-btn dh-btn-ghost dh-btn-sm" style="text-decoration:none;">
          Full View ${icon('chevron-r',11)}
        </a>
      </div>
      ${loading?`<div style="padding:48px;text-align:center;"><div class="spinner" style="width:22px;height:22px;margin:0 auto 12px;"></div><p style="font-size:12px;color:#94A3B8;font-weight:600;">Loading GHL data…</p></div>`:`
      <div style="overflow-x:auto;">
        <table class="dh-table">
          <thead><tr><th>Urgency</th><th>Caregiver</th><th>Case</th><th>SLA</th><th>Updated</th><th style="text-align:right;padding-right:18px;"></th></tr></thead>
          <tbody>${topRows}</tbody>
        </table>
      </div>`}
    </div>

    <div style="display:flex;flex-direction:column;gap:14px;">

      <div class="dh-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <div style="font-size:14px;font-weight:800;color:#0F172A;">Upcoming Callbacks</div>
          <span style="font-size:9.5px;font-weight:700;color:#7C3AED;background:#F5F3FF;padding:3px 9px;border-radius:99px;border:1px solid #DDD6FE;">AI-sourced</span>
        </div>
        ${cbHtml}
      </div>

      <div class="breakdown-card">
        <p style="font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.38);margin-bottom:16px;">Status Breakdown</p>
        ${bdData.map(([l,v,c])=>{
          const p=total?Math.round(v/total*100):0;
          return `<div style="margin-bottom:13px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
              <div style="display:flex;align-items:center;gap:7px;">
                <span style="width:8px;height:8px;border-radius:50%;background:${c};display:inline-block;flex-shrink:0;"></span>
                <span style="font-size:12px;font-weight:600;color:rgba(255,255,255,.6);">${l}</span>
              </div>
              <span style="font-size:13px;font-weight:800;color:#fff;">${v}</span>
            </div>
            <div style="height:4px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden;">
              <div style="width:${p}%;height:100%;background:${c};border-radius:99px;opacity:.85;transition:width .4s;"></div>
            </div>
          </div>`;
        }).join('')}
        <a href="#cases" style="margin-top:8px;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;background:rgba(255,255,255,.1);border-radius:10px;color:#fff;font-size:12px;font-weight:700;text-decoration:none;border:1px solid rgba(255,255,255,.14);transition:background .14s;" onmouseover="this.style.background='rgba(255,255,255,.18)'" onmouseout="this.style.background='rgba(255,255,255,.1)'">
          Open Case Manager ${icon('chevron-r',12,'#fff')}
        </a>
      </div>

    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   ④ CASE MANAGEMENT  — 24h new, untriaged, needs_staff filters preserved
════════════════════════════════════════════════════════════ */
function renderCases(enriched){
  const loading=ghlOpps===null;
  const _24h=24*3600000;

  let filtered=enriched;
  if     (activeFilter==='new')         filtered=enriched.filter(o=>(Date.now()-new Date(o.createdAt||0).getTime())<_24h);
  else if(activeFilter==='triaged')     filtered=enriched.filter(o=>o.displayStatus==='triaged');
  else if(activeFilter==='due_soon')    filtered=enriched.filter(o=>o.dueSoon&&o.displayStatus!=='resolved');
  else if(activeFilter==='resolved')    filtered=enriched.filter(o=>o.displayStatus==='resolved');
  else if(activeFilter==='critical')    filtered=enriched.filter(o=>o.urgency==='critical');
  else if(activeFilter==='untriaged')   filtered=enriched.filter(o=>o.displayStatus==='new');
  else if(activeFilter==='needs_staff') filtered=enriched.filter(o=>o.assignedTo==='Unassigned'&&o.displayStatus!=='resolved');
  else if(activeFilter==='sla_breach')  filtered=enriched.filter(o=>o.sla==='breach');

  if(searchQuery){ const q=searchQuery.toLowerCase(); filtered=filtered.filter(o=>(o.contact?.name||'').toLowerCase().includes(q)||(o.name||'').toLowerCase().includes(q)||(o.caseId||'').toLowerCase().includes(q)); }

  filtered=[...filtered].sort((a,b)=>{
    let av,bv;
    if(sortCol==='urgency'){ const u={critical:0,medium:1,low:2}; av=u[a.urgency]||2;bv=u[b.urgency]||2; }
    else if(sortCol==='name'){ av=(a.contact?.name||'').toLowerCase();bv=(b.contact?.name||'').toLowerCase(); }
    else if(sortCol==='sla'){ const s={breach:0,warn:1,ok:2}; av=s[a.sla]||2;bv=s[b.sla]||2; }
    else{ av=new Date(a.updatedAt||0);bv=new Date(b.updatedAt||0); }
    if(av<bv)return sortDir==='asc'?-1:1;if(av>bv)return sortDir==='asc'?1:-1;return 0;
  });

  const si=col=>sortCol===col?(sortDir==='asc'?'↑':'↓'):'↕';

  let rows='';
  if(loading){
    rows=`<tr><td colspan="8"><div class="empty-state"><div class="spinner" style="margin:0 auto 12px;"></div><div class="empty-title">Loading cases from GHL…</div></div></td></tr>`;
  } else if(!filtered.length){
    rows=`<tr><td colspan="8"><div class="empty-state"><div class="empty-ico">${icon('inbox',26)}</div><div class="empty-title">No cases match this filter</div><div class="empty-sub">Try a different filter or refresh your data source</div><button class="dh-btn dh-btn-ghost dh-btn-sm" style="margin-top:14px;" onclick="setFilter('all');searchQuery='';render()">Clear Filters</button></div></td></tr>`;
  } else {
    rows=filtered.map(op=>{
      const origIdx=(ghlOpps||[]).findIndex(o=>o.id===op.id);
      const cbDone=cbStatuses[op.id]?.done;
      const cbBadge=op.cbRequired===false?'<span class="badge badge-no">No</span>'
        :cbDone?`<span class="badge badge-completed">${icon('check',9)} Done</span>`
        :'<span class="badge badge-pending">Pending</span>';
      const consentBadge=op.consent===false?'<span class="badge badge-no">No</span>':`<span class="badge badge-yes">${icon('check',9)} Yes</span>`;
      const _stored=caseStatuses[op.id]||'';
      const statusLabel=_stored&&CASE_STATUSES.includes(_stored)
        ?_stored.replace(' - ',' ').replace(' \u2013 ',' – ')
        :(op.displayStatus==='resolved'?'Closed - Resolved':op.displayStatus==='triaged'?'In Progress':'New - Untriaged');
      const statusClass=op.displayStatus==='resolved'?'badge-resolved'
        :op.displayStatus==='critical'?'badge-urgent'
        :op.displayStatus==='triaged'?'badge-inprogress':'badge-new';
      return `
        <tr id="row-${op.id}" style="${op.urgency==='critical'?'background:#FFF8F8;':''}" onclick="openCaseDetail('${op.id}')">
          <td>
            <p style="font-weight:700;font-size:12.5px;color:#0F172A;line-height:1.3;">${esc(op.displayName)}</p>
            <p style="font-size:10px;color:#94A3B8;margin-top:2px;">${op.contact?.name&&op.contact?.phone?esc(op.contact.phone):''}</p>
            <p style="font-family:monospace;font-size:9px;color:#CBD5E1;margin-top:1px;">${esc(op.caseId)}</p>
          </td>
          <td style="font-size:11px;color:#64748B;white-space:nowrap;">${op.createdAt?fmtDate(op.createdAt):'—'}</td>
          <td><span class="badge badge-${op.urgency}">${urgDot(op.urgency)} ${op.urgency}</span></td>
          <td><span class="badge ${statusClass}" style="font-size:9.5px;">${esc(statusLabel)}</span></td>
          <td>${cbBadge}</td>
          <td>${consentBadge}</td>
          <td onclick="event.stopPropagation()">
            <select class="dh-select" style="height:30px;font-size:11px;padding:0 28px 0 9px;" onchange="assignStaff('${op.id}',this.value)">
              ${STAFF_LIST.map(s=>`<option ${op.assignedTo===s?'selected':''}>${esc(s)}</option>`).join('')}
            </select>
          </td>
          <td onclick="event.stopPropagation()" style="text-align:right;padding-right:18px;">
            <div style="display:flex;gap:5px;justify-content:flex-end;">
              <button onclick="openCaseDetail('${op.id}')" class="dh-btn dh-btn-primary dh-btn-sm">View ${icon('chevron-r',10,'#fff')}</button>
              <button onclick="openEscalateModal(${origIdx})" class="dh-btn dh-btn-warn dh-btn-sm" title="Escalate">${icon('alert-tri',12)}</button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  const cn=fn=>enriched.filter(fn).length;
  return `
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
    <div>
      <h1 style="font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-.3px;">Case Management</h1>
      <p style="font-size:12.5px;color:#94A3B8;margin-top:3px;">${loading?'Loading…':filtered.length+' cases shown of '+enriched.length+' total'}</p>
    </div>
    <div style="display:flex;gap:9px;flex-wrap:wrap;align-items:center;">
      <div style="position:relative;">
        <span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#94A3B8;pointer-events:none;">${icon('search',13)}</span>
        <input type="text" placeholder="Search cases…" value="${esc(searchQuery)}" oninput="searchQuery=this.value;render()"
          class="dh-input" style="padding-left:34px;width:210px;background:#fff;height:38px;" />
      </div>
      <button onclick="setFilter('all');searchQuery='';render()" class="dh-btn dh-btn-ghost">${icon('refresh',13)} Reset</button>
      <button onclick="fetchGHL()" class="dh-btn dh-btn-ghost">${icon('refresh',13)} Refresh</button>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tabs-bar">
    <button class="tab-item ${activeFilter==='all'?'on':''}"      onclick="setFilter('all')">All <span class="tab-cnt" style="background:${activeFilter==='all'?'#006D77':'currentColor'};">${enriched.length}</span></button>
    <button class="tab-item ${activeFilter==='new'?'on':''}"      onclick="setFilter('new')">${icon('flag',11)} New 24h <span class="tab-cnt">${cn(o=>(Date.now()-new Date(o.createdAt||0).getTime())<86400000)}</span></button>
    <button class="tab-item ${activeFilter==='triaged'?'on':''}"  onclick="setFilter('triaged')">${icon('tag',11)} Triaged <span class="tab-cnt">${cn(o=>o.displayStatus==='triaged')}</span></button>
    <button class="tab-item ${activeFilter==='due_soon'?'on':''}" onclick="setFilter('due_soon')">${icon('clock',11)} Due Soon <span class="tab-cnt">${cn(o=>o.dueSoon&&o.displayStatus!=='resolved')}</span></button>
    <button class="tab-item ${activeFilter==='resolved'?'on':''}" onclick="setFilter('resolved')">${icon('check-c',11)} Resolved <span class="tab-cnt">${cn(o=>o.displayStatus==='resolved')}</span></button>
    <button class="tab-item crit ${activeFilter==='critical'?'on':''}" onclick="setFilter('critical')">${icon('alert-tri',11)} Critical <span class="tab-cnt">${cn(o=>o.urgency==='critical')}</span></button>
  </div>

  <div class="dh-card" style="padding:0;overflow:hidden;">
    <table class="dh-table" style="min-width:840px;">
      <thead><tr>
        <th onclick="toggleSort('name')">Caller ${si('name')}</th>
        <th onclick="toggleSort('updated')">Call Date ${si('updated')}</th>
        <th onclick="toggleSort('urgency')">Urgency ${si('urgency')}</th>
        <th>Status</th><th>Callback</th><th>Consent</th>
        <th>Assigned Staff</th>
        <th style="text-align:right;padding-right:18px;">Actions</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   ⑤ OMNICHANNEL CHAT
════════════════════════════════════════════════════════════ */
function renderChat(enriched){
  const loading=ghlOpps===null;
  const op=enriched[activeChatIdx]||null;
  const chatId=op?.id||'demo';
  const msgs=getMessages(chatId);

  const contactList=enriched.length?enriched.slice(0,12).map((o,i)=>`
    <div onclick="activeChatIdx=${i};render()" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:11px;cursor:pointer;border:1px solid ${activeChatIdx===i?'#B2E8EC':'transparent'};background:${activeChatIdx===i?'#F0FAFA':'transparent'};transition:all .13s;">
      <div style="width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#006D77,#003D44);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:12px;flex-shrink:0;">${(o.contact?.name||'?')[0].toUpperCase()}</div>
      <div style="flex:1;min-width:0;">
        <p style="font-weight:700;font-size:12.5px;color:#0F172A;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(o.contact?.name||'Unknown')}</p>
        <p style="font-size:10px;color:#94A3B8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(o.name||'—')}</p>
      </div>
      <span class="badge badge-${o.urgency}" style="font-size:9px;">${urgDot(o.urgency)} ${o.urgency}</span>
    </div>`).join('')
    :`<div class="empty-state" style="padding:28px 0;"><div class="empty-ico">${icon('users',20)}</div><div class="empty-title" style="font-size:12px;">No contacts loaded</div></div>`;

  const msgHtml=msgs.length?msgs.map(m=>`
    <div style="display:flex;flex-direction:column;align-items:${m.role==='staff'?'flex-end':'flex-start'};margin-bottom:12px;">
      <p class="msg-label" style="${m.role==='staff'?'text-align:right;':''}">${m.role==='ai'?'AI Assistant':m.role==='staff'?'Staff':'Caregiver'}</p>
      <div class="msg-bubble msg-${m.role}">${esc(m.text)}</div>
      <p style="font-size:9.5px;color:#CBD5E1;margin-top:3px;">${fmtShort(m.ts)}</p>
    </div>`).join('')
    :`<div class="empty-state"><div class="empty-ico">${icon('chat',24)}</div><div class="empty-title">No messages yet</div><div class="empty-sub">Start the conversation</div></div>`;

  const aiSug=op?`I understand you're concerned about ${(op.contact?.name||'your loved one').split(' ')[0]}. I can connect you with our ${op.category==='Medical'?'medical team':'care coordinator'} right away.`:'';

  return `
  <div style="margin-bottom:20px;">
    <h1 style="font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-.3px;display:flex;align-items:center;gap:8px;">${icon('chat',20)} Omnichannel Chat</h1>
    <p style="font-size:12.5px;color:#94A3B8;margin-top:3px;">Manage conversations across all channels</p>
  </div>
  <div style="display:grid;grid-template-columns:1fr 2fr 1fr;gap:14px;height:calc(100vh - 180px);min-height:500px;">
    <div class="dh-card" style="overflow-y:auto;padding:14px;">
      <div style="margin-bottom:11px;position:relative;">
        <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#94A3B8;">${icon('search',13)}</span>
        <input type="text" placeholder="Search contacts…" class="dh-input" style="padding-left:32px;font-size:12px;height:36px;">
      </div>
      ${loading?`<div style="text-align:center;padding:24px;"><div class="spinner" style="margin:0 auto;"></div></div>`:contactList}
    </div>
    <div class="dh-card" style="display:flex;flex-direction:column;padding:0;overflow:hidden;">
      <div style="display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid #F1F5F9;">
        ${op?`
        <div style="width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#006D77,#003D44);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:12px;">${(op.contact?.name||'?')[0].toUpperCase()}</div>
        <div><p style="font-weight:700;font-size:12.5px;color:#0F172A;">${esc(op.contact?.name||'Contact')}</p><p style="font-size:10px;color:#94A3B8;">${esc(op.caseId)} · ${esc(op.category)}</p></div>
        <div style="margin-left:auto;display:flex;gap:8px;">
          <span class="badge badge-${op.urgency}">${urgDot(op.urgency)} ${op.urgency}</span>
          ${op.contact?.phone?`<a href="tel:${esc(op.contact.phone)}" class="dh-btn dh-btn-ghost dh-btn-sm">${icon('phone',12)}</a>`:''}
        </div>`:
        `<p style="font-size:13px;color:#94A3B8;font-weight:600;">Select a contact to begin</p>`}
      </div>
      <div id="chatMsgs" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;min-height:0;">${msgHtml}</div>
      <div style="padding:14px 18px;border-top:1px solid #F1F5F9;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.07em;">Reply as:</span>
          <button id="replyModeBtn" onclick="toggleReplyMode()" class="dh-btn dh-btn-ghost dh-btn-sm">${icon('zap',11)} AI Reply</button>
        </div>
        <div style="display:flex;gap:8px;">
          <textarea id="chatInput" rows="2" class="dh-input" style="flex:1;min-height:0;resize:none;" placeholder="${op?'Type a message to '+esc((op.contact?.name||'contact').split(' ')[0])+'…':'Select a contact first'}"></textarea>
          <button onclick="sendChatMsg()" class="dh-btn dh-btn-primary" style="align-self:flex-end;">${icon('send',13,'#fff')} Send</button>
        </div>
        ${aiSug&&op?`
        <div style="margin-top:9px;padding:10px 13px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;">
          <p style="font-size:10px;font-weight:700;color:#16A34A;margin-bottom:4px;display:flex;align-items:center;gap:4px;">${icon('zap',10,'#16A34A')} AI Suggestion</p>
          <p style="font-size:12px;color:#14532D;">${esc(aiSug)}</p>
          <button onclick="useAISuggestion()" class="dh-btn dh-btn-ghost dh-btn-sm" style="margin-top:7px;color:#16A34A;border-color:#BBF7D0;">Use This Reply</button>
        </div>`:''}
      </div>
    </div>
    <div class="dh-card" style="overflow-y:auto;padding:15px;display:flex;flex-direction:column;gap:12px;">
      ${(()=>{
        const sc=DHUserContext.getStaffContext();
        const bv=sc?DHUserContext.buildElevenLabsVars(sc):{};
        const cv=op?{case_id:op.caseId||'',contact_name:(op.contact?.name||'').split(' ')[0],urgency:op.urgency||'',category:op.category||'',intent:op.intent||''}:{};
        return `<div style="background:#FAF5FF;border:1px solid #EDE9FE;border-radius:12px;padding:12px 14px;">
          <p style="font-size:9.5px;font-weight:800;color:#7C3AED;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;display:flex;align-items:center;gap:5px;">${icon('mic',11,'#7C3AED')} Voice AI — Staff</p>
          <p style="font-size:11px;color:#A78BFA;margin-bottom:9px;">${op?`Briefed on ${esc(op.caseId)}`:'Ask anything'}</p>
          <elevenlabs-convai id="dh-el-widget-staff" agent-id="${esc(CFG.elevenLabsAgentId)}" dynamic-variables='${JSON.stringify({...bv,...cv})}' style="width:100%;"></elevenlabs-convai>
        </div>`;
      })()}
      ${op?renderAIPanelInline(op,(ghlOpps||[]).findIndex(o=>o.id===op.id)):`<div class="empty-state" style="padding:20px 0;"><div class="empty-ico">${icon('cpu',20)}</div><div class="empty-title" style="font-size:12px;">Select a case for AI insights</div></div>`}
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   ⑥ HANDOVER  — Case Manager only (preserved)
════════════════════════════════════════════════════════════ */
function renderHandover(){
  return `
  <div style="margin-bottom:20px;">
    <h1 style="font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-.3px;display:flex;align-items:center;gap:8px;">${icon('shield',20)} Staff Handover</h1>
    <p style="font-size:12.5px;color:#94A3B8;margin-top:3px;">Shift transitions, assignments, and internal notes</p>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
    <div style="display:flex;flex-direction:column;gap:14px;">

      <div class="dh-card">
        <div style="margin-bottom:16px;">
          <div style="font-size:14px;font-weight:800;color:#0F172A;display:flex;align-items:center;gap:7px;">${icon('users',15)} Staff Assignment</div>
          <div style="font-size:11.5px;color:#94A3B8;margin-top:3px;">Reassign cases to staff members</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:13px;">
          <div>
            <label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Case ID</label>
            <input id="assignCaseId" class="dh-input" placeholder="e.g. C-ABC123" style="font-family:monospace;letter-spacing:1px;height:42px;">
          </div>
          <div>
            <label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Assign To</label>
            <select id="assignStaffSel" class="dh-select" style="width:100%;height:42px;">${STAFF_LIST.map(s=>`<option>${esc(s)}</option>`).join('')}</select>
          </div>
          <div>
            <label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Internal Note</label>
            <textarea id="assignNote" class="dh-input" rows="3" style="resize:vertical;padding-top:10px;" placeholder="Reason for assignment or context…"></textarea>
          </div>
          <button onclick="saveAssignment()" class="dh-btn dh-btn-primary" style="width:100%;height:42px;">${icon('save',13,'#fff')} Save Assignment</button>
        </div>
      </div>

      <div class="dh-card">
        <div style="margin-bottom:16px;">
          <div style="font-size:14px;font-weight:800;color:#0F172A;display:flex;align-items:center;gap:7px;">${icon('clipboard',15)} Post Handover Note</div>
          <div style="font-size:11.5px;color:#94A3B8;margin-top:3px;">Record shift transitions for the care team</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <textarea id="handoverNote" class="dh-input" rows="6" style="resize:vertical;padding-top:10px;" placeholder="Describe care updates, urgent flags, or shift context…"></textarea>
          <button onclick="submitHandover()" class="dh-btn dh-btn-primary" style="width:100%;height:42px;">${icon('send',13,'#fff')} Publish to Shift Feed</button>
        </div>
      </div>

    </div>

    <div class="dh-card" style="display:flex;flex-direction:column;">
      <div style="margin-bottom:16px;">
        <div style="font-size:14px;font-weight:800;color:#0F172A;display:flex;align-items:center;gap:7px;">${icon('list',15)} Handover Feed</div>
        <div style="font-size:11.5px;color:#94A3B8;margin-top:3px;">Recent shift notes from the team</div>
      </div>
      <div id="handoverList" style="flex:1;overflow-y:auto;max-height:620px;padding-right:2px;">
        ${renderHandoverList()}
      </div>
    </div>
  </div>`;
}

function renderHandoverList(){
  const notes=getHandovers();
  if(!notes.length) return `<div class="empty-state"><div class="empty-ico">${icon('file-text',22)}</div><div class="empty-title">No handover notes yet</div><div class="empty-sub">Published notes will appear here</div></div>`;
  return notes.map(h=>`
    <div class="hv-note">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:7px;">
        <div>
          <div class="hv-note-author">${esc(h.staff_name)}</div>
          ${h.staff_role?`<div class="hv-note-role">${esc(h.staff_role)}</div>`:''}
        </div>
        <div class="hv-note-time">${fmtShort(h.created_at)}</div>
      </div>
      <p class="hv-note-body">"${esc(h.note_content)}"</p>
    </div>`).join('');
}

/* ════════════════════════════════════════════════════════════
   AI PANEL INLINE
════════════════════════════════════════════════════════════ */
function renderAIPanelInline(op, origIdx){
  const e=enrich(op,origIdx);
  const conf=72+Math.floor((op.id||'').charCodeAt(0)%22);
  const sf=e.urgency==='critical';
  const kb={Safety:'Home Safety & Fall Prevention',Medical:'Medication Management for Dementia',Emotional:'Managing Behavioural Changes',Admin:'CARA Registration Guide',Resource:'SG Dementia Resources Directory'}[e.category]||'Understanding Dementia';
  const ra={critical:'Escalate immediately — assign senior staff and notify family.',medium:'Schedule follow-up call within 2 hours. Monitor for changes.',low:'Standard response — review at next shift check-in.'}[e.urgency];
  return `
    <div>
      <p style="font-size:13px;font-weight:800;color:#0F172A;display:flex;align-items:center;gap:6px;margin-bottom:12px;">${icon('cpu',14)} AI Case Summary</p>
      <div style="display:flex;flex-direction:column;gap:7px;">
        ${infoTile('Who',`<p style="font-size:12.5px;font-weight:700;color:#0F172A;">${esc(op.contact?.name||'Unknown')}</p>`)}
        ${infoTile('What',`<p style="font-size:12px;color:#374151;">${esc(op.name||'—')}</p>`)}
        <div style="${sf?'background:#FEF2F2;border-color:#FECACA;':'background:#F8FAFC;border-color:#E8EDF3;'}border:1px solid;border-radius:10px;padding:10px 12px;">
          <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Urgency</p>
          <span class="badge badge-${e.urgency}">${urgDot(e.urgency)} ${e.urgency.toUpperCase()}</span>
        </div>
        <div style="${sf?'background:#FEF2F2;border-color:#FECACA;':'background:#F0FDF4;border-color:#BBF7D0;'}border:1px solid;border-radius:10px;padding:10px 12px;">
          <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Safety</p>
          <p style="font-size:11.5px;font-weight:700;color:${sf?'#B91C1C':'#15803D'};display:flex;align-items:center;gap:5px;">
            ${sf?icon('alert-tri',12,'#DC2626'):icon('check-c',12,'#16A34A')} ${sf?'Safety concern detected':'No immediate concern'}
          </p>
        </div>
        <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:10px 12px;">
          <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Action</p>
          <p style="font-size:11.5px;font-weight:700;color:#1E40AF;">${ra}</p>
        </div>
      </div>
      <div style="height:1px;background:#F1F5F9;margin:12px 0;"></div>
      <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;display:flex;align-items:center;gap:4px;">${icon('book',10)} KB Article</p>
      <p style="font-size:11.5px;font-weight:700;color:#006D77;margin-bottom:12px;">${esc(kb)}</p>
      <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">AI Confidence</p>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:13px;">
        <div style="flex:1;height:6px;background:#F1F5F9;border-radius:99px;overflow:hidden;">
          <div style="width:${conf}%;height:100%;background:linear-gradient(90deg,#006D77,#009199);border-radius:99px;"></div>
        </div>
        <span style="font-size:11px;font-weight:800;color:#006D77;">${conf}%</span>
      </div>
      <button onclick="openModal(${origIdx})" class="dh-btn dh-btn-primary dh-btn-sm" style="width:100%;">${icon('file-text',12,'#fff')} Use AI Suggestion</button>
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   MODALS  (all logic preserved, HTML redesigned)
════════════════════════════════════════════════════════════ */
let activeOppIdx=null;

function openModal(idx){
  activeOppIdx=idx;
  const op=ghlOpps?.[idx];
  document.getElementById('modalName').innerText=op?.contact?.name||'Contact';
  document.getElementById('noteErr').classList.add('hidden');
  document.getElementById('noteText').value='';
  const m=document.getElementById('noteModal');
  m.style.display='flex'; m.classList.remove('hidden');
}
function closeNoteModal(){ const m=document.getElementById('noteModal'); m.style.display='none'; m.classList.add('hidden'); }

async function submitNote(){
  const text=document.getElementById('noteText').value.trim();
  const btn=document.getElementById('noteBtn'), err=document.getElementById('noteErr');
  if(!text){ err.textContent='Please type a note.'; err.classList.remove('hidden'); return; }
  const op=ghlOpps?.[activeOppIdx]; const cid=op?.contact?.id;
  if(!cid){ err.textContent='No contact ID for this case.'; err.classList.remove('hidden'); return; }
  btn.innerHTML=`<span class="spinner-white"></span> Syncing…`; btn.disabled=true; err.classList.add('hidden');
  try{ await syncNoteToGHL(cid,text); closeNoteModal(); alert('Note synced to GHL!'); }
  catch(e){ err.textContent='Failed: '+e.message; err.classList.remove('hidden'); }
  finally{ btn.innerHTML=`${icon('send',13,'#fff')} Sync to GHL`; btn.disabled=false; }
}

function openAIModal(idx){
  const op=ghlOpps?.[idx]; if(!op)return;
  const e=enrich(op,idx); const conf=72+Math.floor((op.id||'').charCodeAt(0)%22);
  const sf=e.urgency==='critical';
  const ra={critical:'Escalate immediately — assign senior staff and notify family.',medium:'Schedule follow-up call within 2 hours.',low:'Standard response — review at next shift check-in.'}[e.urgency];
  const sug=`Hello ${(op.contact?.name||'').split(' ')[0]||'there'}, thank you for reaching out to DementiaHub. I can see your case has been flagged as ${e.urgency} priority. ${sf?'A senior care coordinator has been alerted and will contact you within 30 minutes.':'One of our care specialists will be in touch with you shortly.'}`;

  document.getElementById('modal-root').innerHTML=`
    <div class="modal-overlay" onclick="if(event.target===this)closeAIModal()">
      <div class="modal-box" style="max-width:540px;">
        <div style="display:flex;align-items:center;gap:13px;margin-bottom:20px;">
          <div style="width:42px;height:42px;border-radius:11px;background:linear-gradient(135deg,#006D77,#003D44);display:flex;align-items:center;justify-content:center;color:#fff;">${icon('cpu',20)}</div>
          <div>
            <div style="font-size:16px;font-weight:800;color:#0F172A;">AI Case Insight</div>
            <div style="font-size:11px;color:#94A3B8;margin-top:2px;">${esc(e.caseId)} · Confidence: ${conf}%</div>
          </div>
          <button onclick="closeAIModal()" class="dh-btn dh-btn-ghost dh-btn-sm" style="margin-left:auto;">${icon('x',12)} Close</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
          ${infoTile('Who',`<p style="font-size:12.5px;font-weight:700;color:#0F172A;">${esc(op.contact?.name||'Unknown')}</p>`)}
          ${infoTile('What',`<p style="font-size:12px;color:#374151;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(op.name||'—')}</p>`)}
          <div style="${e.urgency==='critical'?'background:#FEF2F2;border-color:#FECACA;':'background:#F8FAFC;border-color:#E8EDF3;'}border:1px solid;border-radius:10px;padding:10px 12px;">
            <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Urgency</p>
            <span class="badge badge-${e.urgency}">${urgDot(e.urgency)} ${e.urgency.toUpperCase()}</span>
          </div>
          <div style="${sf?'background:#FEF2F2;border-color:#FECACA;':'background:#F0FDF4;border-color:#BBF7D0;'}border:1px solid;border-radius:10px;padding:10px 12px;">
            <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Safety</p>
            <p style="font-size:11.5px;font-weight:700;color:${sf?'#B91C1C':'#15803D'};display:flex;align-items:center;gap:4px;">
              ${sf?icon('alert-tri',12,'#DC2626'):icon('check-c',12,'#16A34A')} ${sf?'Concern detected':'Clear'}
            </p>
          </div>
        </div>
        <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:13px;margin-bottom:14px;">
          <p style="font-size:9.5px;font-weight:800;color:#1E40AF;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;">Recommended Action</p>
          <p style="font-size:12.5px;font-weight:700;color:#1E3A8A;">${ra}</p>
        </div>
        <div style="margin-bottom:16px;">
          <p style="font-size:10px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:7px;">Suggested Response (editable)</p>
          <textarea id="aiReplyText" class="dh-input" style="resize:none;min-height:90px;font-size:13px;padding-top:10px;">${esc(sug)}</textarea>
        </div>
        <div style="display:flex;gap:10px;">
          <button onclick="useAISuggestionFromModal(${idx})" class="dh-btn dh-btn-primary" style="flex:1;">${icon('check',13,'#fff')} Use AI Suggestion</button>
          <button onclick="openEscalateModal(${idx})" class="dh-btn dh-btn-warn">${icon('alert-tri',12)} Escalate</button>
          <button onclick="closeAIModal()" class="dh-btn dh-btn-ghost">Cancel</button>
        </div>
      </div>
    </div>`;
}
function closeAIModal(){ document.getElementById('modal-root').innerHTML=''; }

function openEscalateModal(idx){
  const op=ghlOpps?.[idx]; if(!op)return;
  document.getElementById('modal-root').innerHTML=`
    <div class="modal-overlay" onclick="if(event.target===this)document.getElementById('modal-root').innerHTML=''">
      <div class="modal-box" style="max-width:440px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
          <div style="width:40px;height:40px;border-radius:11px;background:#FEF2F2;display:flex;align-items:center;justify-content:center;color:#DC2626;">${icon('alert-tri',20)}</div>
          <div>
            <div style="font-size:16px;font-weight:800;color:#DC2626;">Escalate Case</div>
            <div style="font-size:11.5px;color:#64748B;margin-top:2px;">${esc(op.contact?.name||'Contact')} · ${esc(enrich(op,idx).caseId)}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div><label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Escalation Type</label>
            <select id="escType" class="dh-select" style="width:100%;height:42px;"><option>Missing Person</option><option>Self-Harm Risk</option><option>Medical Emergency</option><option>Caregiver Distress</option><option>Violence / Safety</option><option>Other Critical</option></select>
          </div>
          <div><label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Assign To</label>
            <select id="escStaff" class="dh-select" style="width:100%;height:42px;">${STAFF_LIST.filter(s=>s!=='Unassigned').map(s=>`<option>${esc(s)}</option>`).join('')}</select>
          </div>
          <div><label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Notes</label>
            <textarea id="escNote" class="dh-input" rows="3" style="resize:vertical;padding-top:10px;" placeholder="Describe the situation…"></textarea>
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:18px;">
          <button onclick="submitEscalation(${idx})" class="dh-btn dh-btn-danger" style="flex:1;font-weight:800;">${icon('alert-tri',13)} Confirm Escalation</button>
          <button onclick="document.getElementById('modal-root').innerHTML=''" class="dh-btn dh-btn-ghost">Cancel</button>
        </div>
      </div>
    </div>`;
}

function openCallbackForm(){
  document.getElementById('modal-root').innerHTML=`
    <div class="modal-overlay" onclick="if(event.target===this)document.getElementById('modal-root').innerHTML=''">
      <div class="modal-box" style="max-width:420px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
          <div style="width:40px;height:40px;border-radius:11px;background:#E0F2FE;display:flex;align-items:center;justify-content:center;color:#0284C7;">${icon('phone',20)}</div>
          <div style="font-size:16px;font-weight:800;color:#0F172A;">Schedule Callback</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div><label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Contact Name</label><input id="cbName" class="dh-input" style="height:42px;" placeholder="Caregiver name"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div><label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Date</label><input id="cbDate" class="dh-input" type="date" style="height:42px;" min="${new Date().toISOString().split('T')[0]}"></div>
            <div><label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Time</label><input id="cbTime" class="dh-input" type="time" style="height:42px;" value="10:00"></div>
          </div>
          <div><label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Assign To</label><select id="cbStaff" class="dh-select" style="width:100%;height:42px;">${STAFF_LIST.map(s=>`<option>${esc(s)}</option>`).join('')}</select></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:18px;">
          <button onclick="saveCallback()" class="dh-btn dh-btn-primary" style="flex:1;">${icon('check',13,'#fff')} Schedule</button>
          <button onclick="document.getElementById('modal-root').innerHTML=''" class="dh-btn dh-btn-ghost">Cancel</button>
        </div>
      </div>
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   TRANSCRIPT RENDERER  (preserved exactly)
════════════════════════════════════════════════════════════ */
function renderTranscript(transcriptData){
  if(!transcriptData||(typeof transcriptData==='string'&&!transcriptData.trim())){
    return '<p class="transcript-empty">No transcript available for this call.</p>';
  }
  let parsed=null;
  if(typeof transcriptData==='string'){ try{ parsed=JSON.parse(transcriptData); }catch(e){} }
  else if(Array.isArray(transcriptData)){ parsed=transcriptData; }

  if(Array.isArray(parsed)&&parsed.length){
    return parsed.map(entry=>{
      const role=(entry.role||entry.speaker||'').toLowerCase();
      const text=entry.message||entry.text||entry.content||'';
      const isAgent=role.includes('agent')||role.includes('assistant')||role.includes('ai')||role.includes('bot');
      const label=isAgent?'Agent':'Caller';
      const bg=isAgent?'bg-blue-50 border-blue-100':'bg-slate-50 border-slate-200';
      const lc=isAgent?'text-blue-700':'text-slate-500';
      const ts=entry.timestamp||entry.time_in_call_secs!=null?` · ${typeof entry.time_in_call_secs==='number'?Math.floor(entry.time_in_call_secs)+'s':fmtShort(entry.timestamp)}`:'';
      return `<div class="p-3 rounded-xl border ${bg} mb-2">
        <p class="text-[10px] font-black uppercase tracking-wide ${lc} mb-1">[${label}]${ts}</p>
        <p class="text-sm text-slate-700 leading-relaxed">${esc(text)}</p>
      </div>`;
    }).join('');
  }

  const lines=String(transcriptData).split('\n');
  const hasLabels=lines.some(l=>/^\[?(agent|caller|ai|user|human|caregiver)\]?[:：]/i.test(l.trim()));
  if(hasLabels){
    return lines.map(line=>{
      if(!line.trim())return'';
      const agentM=line.match(/^\[?(agent|ai|bot|assistant)\]?[:：]\s*/i);
      const callerM=line.match(/^\[?(caller|user|human|caregiver)\]?[:：]\s*/i);
      if(agentM) return `<div class="p-3 rounded-xl border bg-blue-50 border-blue-100 mb-2"><p class="text-[10px] font-black uppercase tracking-wide text-blue-700 mb-1">[Agent]</p><p class="text-sm text-slate-700 leading-relaxed">${esc(line.slice(agentM[0].length))}</p></div>`;
      if(callerM) return `<div class="p-3 rounded-xl border bg-slate-50 border-slate-200 mb-2"><p class="text-[10px] font-black uppercase tracking-wide text-slate-500 mb-1">[Caller]</p><p class="text-sm text-slate-700 leading-relaxed">${esc(line.slice(callerM[0].length))}</p></div>`;
      return `<p class="text-sm text-slate-600 leading-relaxed py-1 px-1">${esc(line)}</p>`;
    }).filter(Boolean).join('');
  }
  return `<p class="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">${esc(String(transcriptData))}</p>`;
}

/* ════════════════════════════════════════════════════════════
   CASE DETAIL PANEL  (CASE_STATUSES, selectedCaseId preserved)
════════════════════════════════════════════════════════════ */
function openCaseDetail(oppId){
  selectedCaseId=oppId;
  const idx=(ghlOpps||[]).findIndex(o=>o.id===oppId);
  if(idx<0)return;
  const op=enrich(ghlOpps[idx],idx);
  const _raw=caseStatuses[oppId]||'';
  const _leg={'New':'New - Untriaged','In Progress':'In Progress','Resolved':'Closed - Resolved','Triaged':'In Progress'};
  const csKey=CASE_STATUSES.includes(_raw)?_raw:(_leg[_raw]||'New - Untriaged');
  const cbDone=cbStatuses[oppId]?.done;
  const cbTs=cbStatuses[oppId]?.ts;
  const notes=caseNotes[oppId]||'';
  const conf=72+Math.floor((op.id||'').charCodeAt(0)%22);
  const sf=op.urgency==='critical';
  const ra={critical:'Escalate immediately — assign senior staff and notify family.',medium:'Schedule follow-up call within 2 hours. Monitor for changes.',low:'Standard response — review at next shift check-in.',high:'Priority response — follow up within 1 hour.'}[op.urgency]||'Review case details.';
  const kb={Safety:'Home Safety & Fall Prevention',Medical:'Medication Management for Dementia',Emotional:'Managing Behavioural Changes',Admin:'CARA Registration Guide',Resource:'SG Dementia Resources Directory'}[op.category]||'Understanding Dementia';
  const aiSum=op.ai_summary||op.name||`AI analysis: Caller ${esc(op.contact?.name||'Unknown')} reported a ${op.urgency}-priority concern related to ${op.category}. Intent detected: ${op.intent}.`;

  document.getElementById('modal-root').innerHTML=`
  <div class="case-detail-overlay" id="caseDetailOverlay" onclick="if(event.target===this)closeCaseDetail()">
    <div class="case-detail-panel" onclick="event.stopPropagation()">

      <!-- Header -->
      <div class="case-detail-header">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
          <button onclick="closeCaseDetail()" style="width:32px;height:32px;background:rgba(255,255,255,.14);border:none;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;flex-shrink:0;transition:background .13s;" onmouseover="this.style.background='rgba(255,255,255,.22)'" onmouseout="this.style.background='rgba(255,255,255,.14)'">${icon('arrow-l',14,'#fff')}</button>
          <div style="flex:1;">
            <p style="font-size:9.5px;font-weight:800;color:rgba(255,255,255,.45);text-transform:uppercase;letter-spacing:.1em;margin-bottom:3px;">Case Detail</p>
            <h2 style="font-size:18px;font-weight:800;color:#fff;line-height:1.2;">${esc(op.contact?.name||'Unknown Caller')}</h2>
          </div>
          <span class="badge" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.25)!important;">${urgDot(op.urgency)} ${op.urgency.toUpperCase()}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:7px;">
          ${[op.caseId, fmtDate(op.createdAt), op.category, op.intent].map(t=>`<span style="background:rgba(255,255,255,.12);color:#fff;font-size:10px;font-weight:700;padding:4px 11px;border-radius:99px;">${esc(String(t))}</span>`).join('')}
        </div>
      </div>

      <!-- Caller Info -->
      <div class="cd-section">
        <span class="cd-label">Caller Information</span>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          ${infoTile('Phone',`<p style="font-size:12.5px;font-weight:700;color:#0F172A;">${esc(op.contact?.phone||'—')}</p>`)}
          ${infoTile('Email',`<p style="font-size:12.5px;font-weight:700;color:#0F172A;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(op.contact?.email||'—')}</p>`)}
          <div style="${cbDone?'background:#F0FDF4;border-color:#BBF7D0;':'background:#FFFBEB;border-color:#FDE68A;'}border:1px solid;border-radius:10px;padding:11px 13px;">
            <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px;">Callback</p>
            ${cbDone
              ?`<p style="font-size:11.5px;font-weight:700;color:#15803D;display:flex;align-items:center;gap:4px;">${icon('check',11,'#16A34A')} Completed · ${fmtShort(cbTs)}</p>`
              :`<div style="display:flex;align-items:center;gap:8px;"><span class="badge badge-pending">Pending</span><button onclick="markCallbackDone('${oppId}')" class="dh-btn dh-btn-primary dh-btn-sm">Mark Called</button></div>`}
          </div>
          ${infoTile('Consent',`<span class="badge badge-yes">${icon('check',9)} Yes</span>`)}
        </div>
      </div>

      <!-- AI Insights -->
      <div class="cd-section">
        <span class="cd-label">AI Insights</span>
        <div class="ai-insight-box ai-summary">
          <p style="font-size:9.5px;font-weight:800;color:#16A34A;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:4px;margin-bottom:6px;">${icon('zap',10,'#16A34A')} AI Summary</p>
          <p style="font-size:12.5px;color:#14532D;font-weight:500;line-height:1.6;">${esc(aiSum)}</p>
        </div>
        <div class="ai-insight-box ai-intent">
          <p style="font-size:9.5px;font-weight:800;color:#1D4ED8;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:4px;margin-bottom:5px;">${icon('tag',10,'#1D4ED8')} Detected Intent</p>
          <p style="font-size:12.5px;font-weight:700;color:#1E3A8A;">${esc(op.intent)} · <span style="font-weight:500;color:#3B82F6;">${esc(op.category)}</span></p>
        </div>
        <div class="ai-insight-box ${sf?'ai-critical-action':'ai-action'}">
          <p style="font-size:9.5px;font-weight:800;${sf?'color:#DC2626;':'color:#7C3AED;'}text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:4px;margin-bottom:5px;">${icon(sf?'alert-tri':'zap',10,sf?'#DC2626':'#7C3AED')} Recommended Action</p>
          <p style="font-size:12.5px;font-weight:700;${sf?'color:#7F1D1D;':'color:#4C1D95;'}">${ra}</p>
        </div>
        <div style="background:#F8FAFC;border:1px solid #E8EDF3;border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:14px;">
          <div style="flex:1;">
            <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">AI Confidence</p>
            <div style="display:flex;align-items:center;gap:9px;">
              <div style="flex:1;height:6px;background:#E2E8F0;border-radius:99px;overflow:hidden;">
                <div style="width:${conf}%;height:100%;background:linear-gradient(90deg,#006D77,#009199);border-radius:99px;"></div>
              </div>
              <span style="font-size:12px;font-weight:800;color:#006D77;">${conf}%</span>
            </div>
          </div>
          <div style="text-align:right;">
            <p style="font-size:9.5px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;display:flex;align-items:center;justify-content:flex-end;gap:3px;">${icon('book',10)} KB</p>
            <p style="font-size:11px;font-weight:700;color:#006D77;">${esc(kb)}</p>
          </div>
        </div>
      </div>

      <!-- Transcript -->
      <div class="cd-section">
        <span class="cd-label">Full Call Transcript</span>
        <div class="transcript-box">${renderTranscript(op.transcript||op.description)}</div>
      </div>

      <!-- Staff Actions — CASE_STATUSES dropdown preserved -->
      <div class="cd-section">
        <span class="cd-label">Staff Actions</span>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div>
            <label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Case Status</label>
            <select id="cdStatus" class="dh-select" style="width:100%;height:42px;">
              ${CASE_STATUSES.map(s=>`<option ${csKey===s?'selected':''}>${esc(s)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Assign To</label>
            <select id="cdAssign" class="dh-select" style="width:100%;height:42px;">${STAFF_LIST.map(s=>`<option ${op.assignedTo===s?'selected':''}>${esc(s)}</option>`).join('')}</select>
          </div>
          <div>
            <label style="display:block;font-size:10.5px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;">Case Notes</label>
            <textarea id="cdNotes" class="dh-input" rows="4" style="resize:vertical;padding-top:10px;" placeholder="Add notes about this case…">${esc(notes)}</textarea>
          </div>
          <div id="cdSaveMsg" class="hidden" style="font-size:11.5px;font-weight:700;color:#15803D;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:9px;padding:9px 13px;display:flex;align-items:center;gap:6px;">${icon('check',12,'#16A34A')} Saved successfully</div>
          <div style="display:flex;gap:10px;">
            <button onclick="saveCaseAction('${oppId}',${idx})" class="dh-btn dh-btn-primary" style="flex:1;">${icon('save',13,'#fff')} Save Updates</button>
            <button onclick="openEscalateModal(${idx})" class="dh-btn dh-btn-warn">${icon('alert-tri',12)} Escalate</button>
            <button onclick="openModal(${idx})" class="dh-btn dh-btn-ghost">${icon('file-text',12)}</button>
          </div>
        </div>
      </div>

    </div>
  </div>`;
}

function closeCaseDetail(){ selectedCaseId=null; document.getElementById('modal-root').innerHTML=''; }

/* ════════════════════════════════════════════════════════════
   CASE ACTIONS  (all preserved exactly)
════════════════════════════════════════════════════════════ */
function updateCaseStatus(oppId, status){
  caseStatuses[oppId]=status;
  localStorage.setItem('dsg_case_statuses',JSON.stringify(caseStatuses));
  const resolvedCount=Object.values(caseStatuses).filter(s=>_RESOLVED_STATUSES.has(s)).length;
  console.log('[updateCaseStatus] - staff.js:1274',oppId,'→',status,'| resolved total:',resolvedCount);
}

function saveCaseAction(oppId, idx){
  const status=document.getElementById('cdStatus').value;
  const assign=document.getElementById('cdAssign').value;
  const notes=document.getElementById('cdNotes').value.trim();
  updateCaseStatus(oppId, status);
  assignments[oppId]=assign;
  if(notes) caseNotes[oppId]=notes;
  localStorage.setItem('dsg_assignments',JSON.stringify(assignments));
  localStorage.setItem('dsg_case_notes',JSON.stringify(caseNotes));
  openCaseDetail(oppId);
  setTimeout(()=>{
    const msg=document.getElementById('cdSaveMsg');
    if(msg){ msg.style.display='flex'; msg.classList.remove('hidden'); setTimeout(()=>{ msg.style.display='none'; msg.classList.add('hidden'); },2500); }
  },0);
}

function markCallbackDone(oppId){
  cbStatuses[oppId]={done:true,ts:new Date().toISOString()};
  localStorage.setItem('dsg_cb_statuses',JSON.stringify(cbStatuses));
  openCaseDetail(oppId);
}

/* ════════════════════════════════════════════════════════════
   ACTIONS  (all preserved exactly)
════════════════════════════════════════════════════════════ */
function setFilter(f){ activeFilter=f; render(); }
function toggleSort(col){ if(sortCol===col) sortDir=sortDir==='asc'?'desc':'asc'; else{sortCol=col;sortDir='asc';} render(); }
function assignStaff(oppId, staffName){ assignments[oppId]=staffName; localStorage.setItem('dsg_assignments',JSON.stringify(assignments)); }

function saveAssignment(){
  const cid=document.getElementById('assignCaseId').value.trim();
  const staff=document.getElementById('assignStaffSel').value;
  const note=document.getElementById('assignNote').value.trim();
  if(!cid){ alert('Please enter a Case ID.'); return; }
  const op=(ghlOpps||[]).find(o=>enrich(o,0).caseId===cid.toUpperCase());
  if(op){ assignments[op.id]=staff; localStorage.setItem('dsg_assignments',JSON.stringify(assignments)); }
  if(note) saveHandover(`Assigned ${cid} to ${staff}. ${note}`);
  document.getElementById('assignCaseId').value='';
  document.getElementById('assignNote').value='';
  render();
}

function submitHandover(){
  const note=document.getElementById('handoverNote').value.trim();
  if(!note){ alert('Please write a note.'); return; }
  saveHandover(note);
  document.getElementById('handoverNote').value='';
  document.getElementById('handoverList').innerHTML=renderHandoverList();
}

function resolveCase(id){
  if(!confirm('Close this case?')) return;
  const row=document.getElementById('row-'+id);
  if(row){ row.style.transition='all .4s'; row.style.opacity='.15'; row.style.transform='translateX(20px)'; setTimeout(()=>row.remove(),400); }
}

function submitEscalation(idx){
  const op=ghlOpps?.[idx]; if(!op)return;
  const type=document.getElementById('escType').value;
  const staff=document.getElementById('escStaff').value;
  const note=document.getElementById('escNote').value.trim();
  assignments[op.id]=staff; localStorage.setItem('dsg_assignments',JSON.stringify(assignments));
  saveHandover(`ESCALATION — ${enrich(op,idx).caseId} · Type: ${type} · Assigned: ${staff}${note?' · '+note:''}`);
  document.getElementById('modal-root').innerHTML='';
  alert(`Case escalated to ${staff} as "${type}".`);
  render();
}

function saveCallback(){
  const name=document.getElementById('cbName').value.trim();
  const date=document.getElementById('cbDate').value;
  const time=document.getElementById('cbTime').value;
  const staff=document.getElementById('cbStaff').value;
  if(!name||!date||!time){ alert('Please fill all fields.'); return; }
  callbacks.unshift({id:Date.now().toString(),name,time:date+' '+time,staff,created:new Date().toISOString()});
  localStorage.setItem('dsg_callbacks',JSON.stringify(callbacks.slice(0,20)));
  document.getElementById('modal-root').innerHTML='';
  render();
}

function removeCallback(id){ callbacks=callbacks.filter(c=>c.id!==id); localStorage.setItem('dsg_callbacks',JSON.stringify(callbacks)); render(); }

let replyIsAI=true;
function toggleReplyMode(){ replyIsAI=!replyIsAI; const btn=document.getElementById('replyModeBtn'); if(btn) btn.innerHTML=replyIsAI?`${icon('zap',11)} AI Reply`:`${icon('user',11)} Human Reply`; }

function sendChatMsg(){
  const input=document.getElementById('chatInput'); if(!input||!input.value.trim())return;
  const op=(ghlOpps||[])[activeChatIdx]; const chatId=op?.id||'demo'; const staff=getCurrentStaff();
  const msg={role:replyIsAI?'ai':'staff',text:input.value.trim(),ts:new Date().toISOString(),sender_id:staff?.userId||'unknown',sender_name:staff?.name||'Staff Member'};
  addMessage(chatId,msg);
  if(staff) DHUserContext.storeConversationEvent(DHUserContext.getStaffContext(),{type:'chat_message_sent',channel:'omnichannel',case_id:op?.id||null,contact_name:op?.contact?.name||null,preview:msg.text.slice(0,80)});
  input.value=''; render();
  setTimeout(()=>{ const el=document.getElementById('chatMsgs'); if(el) el.scrollTop=el.scrollHeight; },50);
}

function useAISuggestion(){ const op=(ghlOpps||[])[activeChatIdx]; const s=`Hello ${(op?.contact?.name||'').split(' ')[0]||'there'}, thank you for reaching out to DementiaHub. One of our care specialists will be in touch shortly.`; const input=document.getElementById('chatInput'); if(input) input.value=s; }

function useAISuggestionFromModal(idx){ const text=document.getElementById('aiReplyText')?.value; const op=ghlOpps?.[idx]; if(op&&text){ addMessage(op.id,{role:'ai',text,ts:new Date().toISOString()}); closeAIModal(); location.hash='chat'; activeChatIdx=idx; render(); } }

/* ════════════════════════════════════════════════════════════
   AUTO-REFRESH + INIT  (preserved exactly)
════════════════════════════════════════════════════════════ */
let _refreshTimer=null;
function startAutoRefresh(intervalMs=30000){
  if(_refreshTimer) clearInterval(_refreshTimer);
  _refreshTimer=setInterval(()=>{ if(isAuth()) fetchGHL(); },intervalMs);
}

render();
if(isAuth()){ fetchGHL(); startAutoRefresh(30000); }