// Resources tab renderer and tab-specific actions.

window.dhResourceTab = localStorage.getItem("dh_resource_tab") || "emergency";

function openResourceLink(url) {
  if (url.startsWith("tel:")) {
    window.location.href = url;
  } else {
    window.open(url, "_blank");
  }
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const btn = event.target;
      const original = btn.textContent;
      btn.textContent = "✓ Copied!";
      btn.classList.add("bg-emerald-100", "text-emerald-600");
      btn.classList.remove("bg-slate-100", "text-slate-500");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("bg-emerald-100", "text-emerald-600");
        btn.classList.add("bg-slate-100", "text-slate-500");
      }, 2000);
    })
    .catch(() => alert("Failed to copy"));
}

function setResourceTab(tab) {
  window.dhResourceTab = tab;
  localStorage.setItem("dh_resource_tab", tab);
  render();
}

function renderResources() {
  const resourceTab = window.dhResourceTab || "emergency";
  const emergency = [
    {
      icon: "🚑",
      name: "999 Emergency Line",
      text: "Life-threatening emergencies only",
      hours: "24/7",
      phone: "999",
      link: "tel:999",
      priority: "critical",
      color: "red",
    },
    {
      icon: "📞",
      name: "Dementia Singapore Helpline",
      text: "Dementia & caregiver advice",
      hours: "Mon-Fri 9am-6pm, Sat 9am-1pm",
      phone: "6377 0700",
      link: "tel:6377-0700",
      priority: "high",
      color: "teal",
    },
    {
      icon: "🏥",
      name: "AIC Hotline",
      text: "Care services & subsidy info",
      hours: "24/7",
      phone: "1800-650-6060",
      link: "tel:+6518006506060",
      priority: "medium",
      color: "blue",
    },
    {
      icon: "💉",
      name: "HPB Health Programs",
      text: "Senior wellness & prevention",
      hours: "24/7",
      phone: "1800-223-1313",
      link: "tel:1800-223-1313",
      priority: "medium",
      color: "emerald",
    },
  ];

  const sections = [
    {
      title: "🤝 Caregiver Support & Programs",
      desc: "Community programs and professional support",
      color: "purple",
      items: [
        {
          icon: "👥",
          name: "Caregiver Support Groups (CSG)",
          text: "Join peer support groups led by Dementia Singapore. Weekly meetings across Singapore.",
          link: "https://dementia.org.sg/csg/",
          tag: "Community",
          info: "Dementia Singapore",
        },
        {
          icon: "🎓",
          name: "Dementia Singapore Academy",
          text: "Training programs, workshops, and specialized care courses.",
          link: "https://dementia.org.sg/academy/",
          tag: "Training",
          info: "Free courses",
        },
        {
          icon: "💬",
          name: "Counselling for Caregivers",
          text: "Professional counselling with emotional support and coping strategies.",
          link: "https://www.dementiahub.sg/dementia/counselling-for-caregivers/",
          tag: "Wellness",
          info: "Personalized",
        },
        {
          icon: "🎵",
          name: "Dementia Social Club",
          text: "Recreational activities and social engagement events.",
          link: "https://dementia.org.sg/csn/",
          tag: "Activity",
          info: "Multiple locations",
        },
      ],
    },
    {
      title: "🛡️ Safety Tools & Technology",
      desc: "Digital companions and safety features",
      color: "blue",
      items: [
        {
          icon: "📱",
          name: "CARA — Digital Care Companion",
          text: "Free mobile app with Safe Return, missing person alerts, and resources.",
          link: "https://cara.sg/",
          tag: "Technology",
          info: "Free membership",
        },
        {
          icon: "🔍",
          name: "Safe Return Program",
          text: "Help identify and reunite wandering loved ones through CARA alerts.",
          link: "https://cara.sg/safe-return-guide/",
          tag: "Safety",
          info: "Community-powered",
        },
        {
          icon: "📚",
          name: "Dementia Hub Portal",
          text: "Singapore's comprehensive resource site with articles and services directory.",
          link: "https://www.dementiahub.sg/",
          tag: "Information",
          info: "Free access",
        },
      ],
    },
    {
      title: "📚 Education & Understanding",
      desc: "Learn about dementia and care strategies",
      color: "orange",
      items: [
        {
          icon: "🧠",
          name: "Dementia Stages & Signs",
          text: "Comprehensive guides on Early, Middle, and Late stage symptoms.",
          link: "https://www.dementiahub.sg/i-live-with-dementia/",
          tag: "Education",
          info: "Interactive",
        },
        {
          icon: "❤️",
          name: "Caregiver Burnout Recognition",
          text: "Identify warning signs and learn sustainable self-care practices.",
          link: "https://dementia.org.sg/about/",
          tag: "Wellbeing",
          info: "Expert guidance",
        },
        {
          icon: "🗣️",
          name: "Communication Strategies",
          text: "Evidence-based techniques for communicating with someone who has dementia.",
          link: "https://www.dementiahub.sg/my-loved-one-has-dementia/",
          tag: "Skills",
          info: "Video tutorials",
        },
        {
          icon: "📰",
          name: "Voice of Dementia Newsletter",
          text: "Monthly updates with caregiver tips, events, and medical insights.",
          link: "https://dementia.org.sg/vod/",
          tag: "Newsletter",
          info: "Free",
        },
      ],
    },
    {
      title: "🏥 Care Services & Locations",
      desc: "Singapore-wide services and care centers",
      color: "emerald",
      items: [
        {
          icon: "🏢",
          name: "New Horizon Centres",
          text: "Multi-purpose dementia care centers in Bukit Batok, Jurong Point, Tampines, Toa Payoh.",
          link: "https://dementia.org.sg/contact/",
          tag: "Service",
          info: "7:30am-6:30pm",
        },
        {
          icon: "💚",
          name: "Family of Wisdom Program",
          text: "Multi-generational dementia-inclusive engagement and family support.",
          link: "https://dementia.org.sg/contact/",
          tag: "Program",
          info: "Bendemeer",
        },
        {
          icon: "🎤",
          name: "Voices for Hope",
          text: "10-week caregiver advocacy and storytelling program.",
          link: "https://dementia.org.sg/contact/",
          tag: "Community",
          info: "Free",
        },
      ],
    },
    {
      title: "🌍 Practical Care Topics",
      desc: "Day-to-day caregiving advice and strategies",
      color: "cyan",
      items: [
        {
          icon: "🏠",
          name: "Home Safety for Dementia",
          text: "Checklist and tips to make your home safer for someone with dementia.",
          link: "https://www.dementiahub.sg/",
          tag: "Safety",
          info: "Practical",
        },
        {
          icon: "💊",
          name: "Medication & Health Management",
          text: "Guidance on medication adherence and working with healthcare providers.",
          link: "https://www.dementiahub.sg/",
          tag: "Medical",
          info: "Expert",
        },
        {
          icon: "🍽️",
          name: "Nutrition & Mealtime Support",
          text: "Tips on appetite changes and nutritious meal planning.",
          link: "https://www.dementiahub.sg/",
          tag: "Health",
          info: "Caregiver-focused",
        },
        {
          icon: "😴",
          name: "Sleep & Behavioral Management",
          text: "Strategies for managing sleep disturbances and challenging behaviors.",
          link: "https://www.dementiahub.sg/",
          tag: "Care",
          info: "Evidence-based",
        },
      ],
    },
  ];

  let html = `<div class="mb-3">
    <h1 class="text-xl font-black text-slate-900 mb-0.5">📚 Resources & Support</h1>
    <p class="text-slate-600 text-xs font-medium mb-2">Quick access to helplines, guides & services.</p>
    <div class="bg-slate-50 border border-slate-200 rounded-lg p-2 mb-3">
      <p class="text-xs text-slate-700"><strong>💡 Tip:</strong> Quick Help = emergencies | CARA = app | DementiaHub = guides | Services = programs</p>
    </div>
  </div>`;

  html += `<div class="mb-4"><div class="mb-2"><h2 class="text-base font-black text-slate-900 mb-0">🆘 Emergency Numbers</h2></div><div class="grid grid-cols-2 md:grid-cols-4 gap-1.5">`;

  emergency.forEach((item) => {
    const colorMap = {
      red: {
        bg: "bg-white",
        border: "border-slate-200",
        icon: "text-slate-400",
        phone: "text-slate-900",
        tag: "bg-slate-100 text-slate-600",
        hover: "hover:shadow-md",
      },
      teal: {
        bg: "bg-white",
        border: "border-slate-200",
        icon: "text-slate-400",
        phone: "text-slate-900",
        tag: "bg-slate-100 text-slate-600",
        hover: "hover:shadow-md",
      },
      blue: {
        bg: "bg-white",
        border: "border-slate-200",
        icon: "text-slate-400",
        phone: "text-slate-900",
        tag: "bg-slate-100 text-slate-600",
        hover: "hover:shadow-md",
      },
      emerald: {
        bg: "bg-white",
        border: "border-slate-200",
        icon: "text-slate-400",
        phone: "text-slate-900",
        tag: "bg-slate-100 text-slate-600",
        hover: "hover:shadow-md",
      },
    };
    const colors = colorMap[item.color];
    html += `
      <div class="dh-card ${colors.border} border transition-all ${colors.hover} cursor-pointer group p-2 rounded-lg text-center flex flex-col items-center" onclick="openResourceLink('${esc(item.link)}')">
        <div class="text-xl mb-0.5">${item.icon}</div>
        <p class="text-[10px] font-black text-slate-900 mb-1">${item.name}</p>
        <p class="font-black ${colors.phone} text-xs leading-none mb-1">${item.phone}</p>
        <button onclick="event.stopPropagation(); copyToClipboard('${esc(item.phone)}')" class="text-[8px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold transition w-full">📋 Copy</button>
      </div>`;
  });
  html += `</div></div>`;

  const colorSchemes = {
    purple: {
      bg: "bg-white",
      border: "border-slate-200",
      icon: "text-slate-400",
      link: "text-teal-600",
      tag: "bg-slate-100 text-slate-600",
      hover: "hover:shadow-md",
      accent: "text-slate-900",
    },
    blue: {
      bg: "bg-white",
      border: "border-slate-200",
      icon: "text-slate-400",
      link: "text-teal-600",
      tag: "bg-slate-100 text-slate-600",
      hover: "hover:shadow-md",
      accent: "text-slate-900",
    },
    orange: {
      bg: "bg-white",
      border: "border-slate-200",
      icon: "text-slate-400",
      link: "text-teal-600",
      tag: "bg-slate-100 text-slate-600",
      hover: "hover:shadow-md",
      accent: "text-slate-900",
    },
    emerald: {
      bg: "bg-white",
      border: "border-slate-200",
      icon: "text-slate-400",
      link: "text-teal-600",
      tag: "bg-slate-100 text-slate-600",
      hover: "hover:shadow-md",
      accent: "text-slate-900",
    },
    cyan: {
      bg: "bg-white",
      border: "border-slate-200",
      icon: "text-slate-400",
      link: "text-teal-600",
      tag: "bg-slate-100 text-slate-600",
      hover: "hover:shadow-md",
      accent: "text-slate-900",
    },
  };

  html += `<div class="mb-6">
    <p class="text-slate-700 text-sm font-bold mb-4">📌 What do you need help with?</p>
    <div class="flex flex-wrap gap-3">
      <button class="px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center gap-3 whitespace-nowrap min-w-max ${resourceTab === "emergency" ? "bg-red-100 text-red-700 border-2 border-red-400 shadow-lg" : "bg-white text-slate-700 border-2 border-slate-200 hover:border-red-300 hover:bg-red-50"}" onclick="setResourceTab('emergency')">
        <span class="text-2xl">🆘</span><span>Quick Help</span>
      </button>
      <button class="px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center gap-3 whitespace-nowrap min-w-max ${resourceTab === "cara" ? "bg-blue-100 text-blue-700 border-2 border-blue-400 shadow-lg" : "bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50"}" onclick="setResourceTab('cara')">
        <span class="text-2xl">📱</span><span>CARA App</span>
      </button>
      <button class="px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center gap-3 whitespace-nowrap min-w-max ${resourceTab === "dementiahub" ? "bg-orange-100 text-orange-700 border-2 border-orange-400 shadow-lg" : "bg-white text-slate-700 border-2 border-slate-200 hover:border-orange-300 hover:bg-orange-50"}" onclick="setResourceTab('dementiahub')">
        <span class="text-2xl">📚</span><span>Learn & Guides</span>
      </button>
      <button class="px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center gap-3 whitespace-nowrap min-w-max ${resourceTab === "dementiasgt" ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-400 shadow-lg" : "bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"}" onclick="setResourceTab('dementiasgt')">
        <span class="text-2xl">🏥</span><span>Services</span>
      </button>
    </div>
  </div>`;

  if (resourceTab === "emergency") {
    html += sections
      .slice(0, 3)
      .map((sec) => {
        const colors = colorSchemes[sec.color] || colorSchemes.purple;
        return `<div class="mb-3">
        <div class="mb-2 pb-1.5 border-b border-slate-200">
          <h2 class="text-sm font-black text-slate-900 mb-0.5">${sec.title}</h2>
          <p class="text-slate-600 text-xs font-medium">${sec.desc}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${sec.items
            .map((item) => {
              return `
            <div class="bg-white border-l-4 ${colors.border} p-3 rounded-lg transition-all ${colors.hover} cursor-pointer group" onclick="openResourceLink('${esc(item.link)}')">
              <div class="flex items-start justify-between mb-1">
                <h3 class="font-black text-slate-900 text-xs">${item.name}</h3>
                <span class="text-lg">${item.icon}</span>
              </div>
              <p class="text-slate-600 text-xs mb-1.5">${item.text}</p>
              <div class="flex items-center justify-between pt-1.5 border-t border-slate-100">
                <span class="text-xs text-slate-500 font-semibold">${item.info}</span>
                <button onclick="event.stopPropagation(); copyToClipboard('${esc(item.link)}')" class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold transition">Copy</button>
              </div>
            </div>`;
            })
            .join("")}
        </div>
      </div>`;
      })
      .join("");
  } else if (resourceTab === "cara") {
    html += `
      <div class="mb-2">
        <div class="mb-2 pb-1.5 border-b border-slate-200">
          <h2 class="text-sm font-black text-slate-900 mb-0.5">📱 CARA — Digital Companion</h2>
          <p class="text-slate-600 text-xs font-medium">Free app by Dementia Singapore.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          <div class="bg-white border border-slate-200 p-2.5 rounded-lg">
            <h3 class="font-black text-slate-900 text-xs mb-1.5">🎯 About CARA</h3>
            <p class="text-slate-600 text-xs mb-2">Easy access to digital solutions and community support.</p>
            <div class="space-y-0.5">
              <span class="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded">✓ Free</span>
              <span class="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded ml-1">iOS & Android</span>
            </div>
          </div>
          <div class="bg-white border border-slate-200 p-2.5 rounded-lg">
            <h3 class="font-black text-slate-900 text-xs mb-1.5">✨ Features</h3>
            <ul class="text-xs text-slate-600 space-y-0.5">
              <li>🛡️ Safe Return Program</li>
              <li>👥 Community Alerts</li>
              <li>🎁 Partner Rewards</li>
            </ul>
          </div>
        </div>
        <div class="mt-2 bg-white border border-slate-200 p-2.5 rounded-lg">
          <h3 class="font-black text-slate-900 text-xs mb-1.5">📲 Download CARA</h3>
          <div class="flex flex-wrap gap-1.5">
            <button onclick="openResourceLink('https://play.google.com/store/apps/details?id=com.embreo.carasg')" class="text-xs bg-teal-600 text-white px-2.5 py-1 rounded hover:shadow-md transition font-bold">Play Store</button>
            <button onclick="openResourceLink('https://apps.apple.com/sg/app/cara-sg/id1553855834')" class="text-xs bg-teal-600 text-white px-2.5 py-1 rounded hover:shadow-md transition font-bold">App Store</button>
            <button onclick="openResourceLink('https://cara.sg/join-now/')" class="text-xs bg-teal-600 text-white px-2.5 py-1 rounded hover:shadow-md transition font-bold">Join Online</button>
          </div>
        </div>
      </div>`;
  } else if (resourceTab === "dementiahub") {
    html += `
      <div class="mb-2">
        <div class="mb-2 pb-1.5 border-b border-slate-200">
          <h2 class="text-sm font-black text-slate-900 mb-0.5">📚 DementiaHub — Resource Portal</h2>
          <p class="text-slate-600 text-xs font-medium">Guides and advice by your role</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          <div class="bg-white border border-slate-200 p-2.5 rounded-lg hover:shadow-md transition cursor-pointer" onclick="openResourceLink('https://www.dementiahub.sg/i-live-with-dementia/')">
            <h3 class="font-black text-slate-900 text-xs mb-0.5">🧠 Living with Dementia</h3>
            <p class="text-slate-600 text-xs">Resources & support</p>
          </div>
          <div class="bg-white border border-slate-200 p-2.5 rounded-lg hover:shadow-md transition cursor-pointer" onclick="openResourceLink('https://www.dementiahub.sg/my-loved-one-has-dementia/')">
            <h3 class="font-black text-slate-900 text-xs mb-0.5">❤️ Caregiver Guides</h3>
            <p class="text-slate-600 text-xs">For family caregivers</p>
          </div>
          <div class="bg-white border border-slate-200 p-2.5 rounded-lg hover:shadow-md transition cursor-pointer" onclick="openResourceLink('https://www.dementiahub.sg/general-public/')">
            <h3 class="font-black text-slate-900 text-xs mb-0.5">👫 Community</h3>
            <p class="text-slate-600 text-xs">Volunteers & supporters</p>
          </div>
          <div class="bg-white border border-slate-200 p-2.5 rounded-lg hover:shadow-md transition cursor-pointer" onclick="openResourceLink('https://www.dementiahub.sg/care-professional/')">
            <h3 class="font-black text-slate-900 text-xs mb-0.5">👨‍⚕️ Professionals</h3>
            <p class="text-slate-600 text-xs">Healthcare workers</p>
          </div>
        </div>
      </div>`;
  } else if (resourceTab === "dementiasgt") {
    html += `
      <div class="mb-2">
        <div class="mb-2 pb-1.5 border-b border-slate-200">
          <h2 class="text-sm font-black text-slate-900 mb-0.5">🏥 Dementia Singapore Services</h2>
          <p class="text-slate-600 text-xs font-medium">Community support, care programs & resources</p>
        </div>
      </div>`;

    html += sections
      .slice(3)
      .map((sec) => {
        const colors = colorSchemes[sec.color] || colorSchemes.emerald;
        return `<div class="mb-2">
        <h3 class="text-xs font-black text-slate-900 mb-1.5">${sec.title}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          ${sec.items
            .map((item) => {
              return `
            <div class="bg-white border-l-4 ${colors.border} p-2.5 rounded-lg transition-all ${colors.hover} cursor-pointer group" onclick="openResourceLink('${esc(item.link)}')">
              <h4 class="font-black text-slate-900 text-xs mb-0.5">${item.icon} ${item.name}</h4>
              <p class="text-slate-600 text-xs mb-1.5">${item.text}</p>
              <button onclick="event.stopPropagation(); copyToClipboard('${esc(item.link)}')" class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Copy</button>
            </div>`;
            })
            .join("")}
        </div>
      </div>`;
      })
      .join("");
  }

  html += `<div class="mt-3 p-3 bg-white rounded-lg border border-slate-200"><div class="flex items-start gap-2"><div class="text-xl">🆘</div><div class="flex-1"><h3 class="font-black text-slate-900 text-xs mb-1">Life-Threatening Crisis?</h3><p class="text-slate-700 text-xs font-semibold mb-2">Call 999 immediately.</p><div class="grid grid-cols-2 gap-1.5"><div class="bg-white rounded-lg p-2 border border-slate-200 cursor-pointer hover:shadow-md transition" onclick="openResourceLink('tel:999')"><p class="font-black text-slate-900 text-xs mb-0.5">🚑 999</p><p class="text-xs text-slate-500 font-semibold">Ambulance • Police</p></div><div class="bg-white rounded-lg p-2 border border-slate-200 cursor-pointer hover:shadow-md transition" onclick="openResourceLink('tel:6377-0700')"><p class="font-black text-slate-900 text-xs mb-0.5">📞 6377 0700</p><p class="text-xs text-slate-500 font-semibold">Dementia Helpline</p></div></div></div></div></div>`;

  return `<div class="dh-resources-view">${html}</div>`;
}

window.openResourceLink = openResourceLink;
window.copyToClipboard = copyToClipboard;
window.setResourceTab = setResourceTab;
window.renderResources = renderResources;
