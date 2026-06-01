// AI Support tab renderer.

function renderAISupport(user) {
  const patientName = user.patientName || "your loved one";
  return `
    <div class="dh-dashboard-view">
      <div class="dh-card mb-5">
        <p class="text-[11px] font-black uppercase tracking-widest text-slate-500">DementiaHub AI Support</p>
        <h2 class="font-black text-slate-900 text-2xl mt-1">Communicate with your AI companion</h2>
        <p class="text-sm text-slate-600 mt-2">Use AI support for caregiver guidance, stress check-ins, and next-step coaching for ${esc(patientName)}.</p>
      </div>

      <div class="dh-card">
        <div class="flex items-center justify-between gap-3 mb-3">
          <p class="font-bold text-slate-800">Chat/Voice Session</p>
          <span class="dh-badge dh-badge-track">Private</span>
        </div>
        <div id="dh-ai-support-widget-slot" class="min-h-[320px]"></div>
        <p class="text-xs text-slate-400 mt-3">If the widget does not load, confirm CFG.elevenLabsAgentId is set in caregiver/js/index.js.</p>
      </div>
    </div>`;
}

window.renderAISupport = renderAISupport;
