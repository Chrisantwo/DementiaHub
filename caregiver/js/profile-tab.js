// Profile Management tab renderer and actions.

function renderProfileManagement(user) {
  return `
    <div class="dh-dashboard-view">
      <div class="dh-card mb-5">
        <p class="text-[11px] font-black uppercase tracking-widest text-slate-500">Profile Management</p>
        <h2 class="font-black text-slate-900 text-2xl mt-1">Manage Your Caregiver Profile</h2>
        <p class="text-sm text-slate-600 mt-2">Update your account details so DementiaHub can personalize support and outreach.</p>
      </div>

      <div class="dh-card">
        <form id="profileForm" class="space-y-4" onsubmit="saveProfileDetails(event)">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
            <input id="profileFullname" class="dh-input" type="text" required value="${esc(user.fullname || "")}" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email</label>
            <input id="profileEmail" class="dh-input" type="email" required value="${esc(user.email || "")}" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Phone</label>
            <input id="profilePhone" class="dh-input" type="tel" placeholder="+65 9XXX XXXX" value="${esc(user.phone || "")}" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Name of Person You Care For</label>
            <input id="profilePatient" class="dh-input" type="text" placeholder="e.g. Mum, Dad, Mary Tan" value="${esc(user.patientName || "")}" />
          </div>

          <div class="pt-1">
            <button type="submit" class="dh-btn-primary" style="width:auto;">Save Profile</button>
            <p id="profileSaveResult" class="text-xs font-semibold text-teal-600 mt-2 hidden">✓ Profile updated</p>
            <p id="profileSaveError" class="text-xs font-semibold text-rose-600 mt-2 hidden"></p>
          </div>
        </form>
      </div>
    </div>`;
}

function saveProfileDetails(e) {
  e.preventDefault();

  const fullname = (
    document.getElementById("profileFullname")?.value || ""
  ).trim();
  const email = (document.getElementById("profileEmail")?.value || "")
    .trim()
    .toLowerCase();
  const phone = (document.getElementById("profilePhone")?.value || "").trim();
  const patientName = (
    document.getElementById("profilePatient")?.value || ""
  ).trim();

  const err = document.getElementById("profileSaveError");
  const ok = document.getElementById("profileSaveResult");

  if (err) {
    err.classList.add("hidden");
    err.textContent = "";
  }

  if (!fullname || !email) {
    if (err) {
      err.textContent = "Full name and email are required.";
      err.classList.remove("hidden");
    }
    return;
  }

  const current = getCurrentUser();
  if (!current) {
    if (err) {
      err.textContent = "Your session has expired. Please sign in again.";
      err.classList.remove("hidden");
    }
    return;
  }

  const users = getUsers();
  const emailTaken = users.some(
    (u) => u.id !== current.id && String(u.email || "").toLowerCase() === email,
  );

  if (emailTaken) {
    if (err) {
      err.textContent = "That email is already used by another account.";
      err.classList.remove("hidden");
    }
    return;
  }

  const updatedUsers = users.map((u) => {
    if (u.id !== current.id) return u;
    return {
      ...u,
      fullname,
      email,
      phone: phone || null,
      patientName: patientName || null,
    };
  });

  saveUsers(updatedUsers);

  if (ok) {
    ok.classList.remove("hidden");
    setTimeout(() => ok.classList.add("hidden"), 2500);
  }

  render();
}

window.renderProfileManagement = renderProfileManagement;
window.saveProfileDetails = saveProfileDetails;
