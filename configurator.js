(function () {
  "use strict";

  const storageKey = "elf-remodel-planner-v1";
  const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const spaces = {
    kitchen: {
      label: "Kitchen",
      image: "assets/generated/services-kitchen-remodel-after-16x9-v1.webp",
      alt: "Finished modern kitchen remodel",
      low: 12000,
      high: 35000,
      quoteService: "kitchen",
      details: ["Cabinets or refinishing", "Countertops", "Backsplash", "Flooring", "Lighting", "Appliance installation", "Sink and faucet", "Layout changes"]
    },
    bathroom: {
      label: "Bathroom",
      image: "assets/generated/services-bathroom-remodel-after-16x9-v1.webp",
      alt: "Finished bathroom remodel with tiled shower",
      low: 9000,
      high: 26000,
      quoteService: "bathroom",
      details: ["Shower or tub", "Wall and floor tile", "Vanity and top", "Fixtures", "Lighting", "Ventilation", "Storage", "Layout changes"]
    },
    living: {
      label: "Living area",
      image: "assets/generated/services-painting-interior-16x9-v1.webp",
      alt: "Professional interior painting in a living room",
      low: 4000,
      high: 15000,
      quoteService: "multiple",
      details: ["Wall repair", "Interior painting", "Trim and doors", "Built-in storage", "Lighting", "Flooring", "TV or art mounting", "Finish carpentry"]
    },
    bedroom: {
      label: "Bedroom",
      image: "assets/generated/services-flooring-lvp-install-16x9-v1.webp",
      alt: "Professional flooring installation in a bright room",
      low: 2500,
      high: 9000,
      quoteService: "multiple",
      details: ["Wall repair", "Interior painting", "Trim and doors", "Closet upgrades", "Lighting", "Flooring", "Hardware", "Finish carpentry"]
    },
    exterior: {
      label: "Home exterior",
      image: "assets/generated/services-painting-exterior-16x9-v1.webp",
      alt: "Professional exterior home painting",
      low: 6000,
      high: 24000,
      quoteService: "painting",
      details: ["Exterior painting", "Siding repair", "Fascia and soffit", "Doors and trim", "Deck or fence", "Caulking and sealing", "Pressure washing", "Rot repair"]
    },
    whole: {
      label: "Whole home",
      image: "assets/generated/home-team-tools-garage-16x9-v1.webp",
      alt: "ELF Home Services team and organized tools",
      low: 35000,
      high: 110000,
      quoteService: "multiple",
      details: ["Kitchen", "Bathrooms", "Interior painting", "Drywall repair", "Flooring", "Trim and doors", "Lighting", "Punch-list repairs"]
    }
  };

  const scopes = {
    refresh: { label: "Finish refresh", multiplier: 0.55, description: "Keep the layout and focus on visible finishes, repairs, and selective replacements." },
    focused: { label: "Focused remodel", multiplier: 1, description: "Replace major surfaces and fixtures while keeping most utility locations in place." },
    full: { label: "Full transformation", multiplier: 1.65, description: "Rebuild the space with broader demolition, new systems, or meaningful layout changes." }
  };

  const sizes = {
    compact: { label: "Compact", multiplier: 0.75, description: "Small room or tightly defined zone" },
    standard: { label: "Standard", multiplier: 1, description: "Typical North DFW room or project" },
    large: { label: "Large", multiplier: 1.35, description: "Oversized room or connected areas" }
  };

  const timelines = {
    soon: { label: "As soon as practical", quote: "ASAP / urgent" },
    month: { label: "Within a month", quote: "Within a month" },
    quarter: { label: "Within 1-3 months", quote: "1-3 months" },
    exploring: { label: "Just exploring", quote: "Just exploring / no rush" }
  };

  const defaults = { step: 1, space: "", scope: "", details: [], size: "", timeline: "" };
  let state = loadState();

  const elements = {
    spaceOptions: document.getElementById("space-options"),
    scopeOptions: document.getElementById("scope-options"),
    detailOptions: document.getElementById("detail-options"),
    sizeOptions: document.getElementById("size-options"),
    timelineOptions: document.getElementById("timeline-options"),
    screens: Array.from(document.querySelectorAll("[data-screen]")),
    progressLabel: document.getElementById("progress-label"),
    progressName: document.getElementById("progress-name"),
    progressBar: document.getElementById("progress-bar"),
    status: document.getElementById("planner-status"),
    controls: document.getElementById("planner-controls"),
    back: document.getElementById("back-button"),
    next: document.getElementById("next-button"),
    previewImage: document.getElementById("preview-image"),
    previewSpaceLabel: document.getElementById("preview-space-label"),
    previewTitle: document.getElementById("preview-title"),
    previewCopy: document.getElementById("preview-copy"),
    previewSpace: document.getElementById("preview-space"),
    previewScope: document.getElementById("preview-scope"),
    previewDetails: document.getElementById("preview-details"),
    previewSize: document.getElementById("preview-size"),
    previewPrice: document.getElementById("preview-price"),
    resultPrice: document.getElementById("result-price"),
    resultContext: document.getElementById("result-context"),
    resultBrief: document.getElementById("result-brief"),
    resultFactors: document.getElementById("result-factors"),
    quoteLink: document.getElementById("quote-link"),
    whatsappLink: document.getElementById("whatsapp-link")
  };

  renderStaticOptions();
  renderDetails();
  bindEvents();
  showStep(state.step, false);
  updateAll();

  if (state.space || state.scope || state.size) announce("Draft restored from this browser.");

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved || typeof saved !== "object") return { ...defaults };
      return {
        step: Number.isInteger(saved.step) && saved.step >= 1 && saved.step <= 5 ? saved.step : 1,
        space: spaces[saved.space] ? saved.space : "",
        scope: scopes[saved.scope] ? saved.scope : "",
        details: Array.isArray(saved.details) ? saved.details.filter(item => typeof item === "string") : [],
        size: sizes[saved.size] ? saved.size : "",
        timeline: timelines[saved.timeline] ? saved.timeline : ""
      };
    } catch (error) {
      return { ...defaults };
    }
  }

  function saveState() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (error) { /* Storage can be unavailable in private modes. */ }
  }

  function renderStaticOptions() {
    elements.spaceOptions.innerHTML = Object.entries(spaces).map(([key, item]) => `
      <button class="choice-card" type="button" data-space="${key}" aria-pressed="${state.space === key}">
        <img src="${item.image}" width="480" height="270" alt="" loading="lazy">
        <span>${item.label}</span>
      </button>`).join("");

    elements.scopeOptions.innerHTML = Object.entries(scopes).map(([key, item], index) => `
      <button class="scope-card" type="button" data-scope="${key}" aria-pressed="${state.scope === key}">
        <span class="scope-number">0${index + 1}</span>
        <strong>${item.label}</strong>
        <p>${item.description}</p>
      </button>`).join("");

    elements.sizeOptions.innerHTML = Object.entries(sizes).map(([key, item]) => `
      <button class="size-card" type="button" data-size="${key}" aria-pressed="${state.size === key}">
        <strong>${item.label}</strong><span>${item.description}</span>
      </button>`).join("");

    elements.timelineOptions.innerHTML = Object.entries(timelines).map(([key, item]) => `
      <button class="timeline-card" type="button" data-timeline="${key}" aria-pressed="${state.timeline === key}">
        <strong>${item.label}</strong><span>Scheduling preference</span>
      </button>`).join("");
  }

  function renderDetails() {
    const list = state.space ? spaces[state.space].details : [];
    state.details = state.details.filter(item => list.includes(item));
    elements.detailOptions.innerHTML = list.map((item, index) => `
      <button class="detail-card" type="button" data-detail="${escapeAttribute(item)}" aria-pressed="${state.details.includes(item)}">
        <span class="detail-icon">${String(index + 1).padStart(2, "0")}</span><span>${item}</span>
      </button>`).join("");
  }

  function bindEvents() {
    elements.spaceOptions.addEventListener("click", event => {
      const button = event.target.closest("[data-space]");
      if (!button) return;
      if (state.space !== button.dataset.space) state.details = [];
      state.space = button.dataset.space;
      renderDetails();
      updateAll();
    });

    elements.scopeOptions.addEventListener("click", event => selectSingle(event, "scope"));
    elements.sizeOptions.addEventListener("click", event => selectSingle(event, "size"));
    elements.timelineOptions.addEventListener("click", event => selectSingle(event, "timeline"));

    elements.detailOptions.addEventListener("click", event => {
      const button = event.target.closest("[data-detail]");
      if (!button) return;
      const value = button.dataset.detail;
      state.details = state.details.includes(value) ? state.details.filter(item => item !== value) : [...state.details, value];
      updateAll();
    });

    elements.back.addEventListener("click", () => showStep(Math.max(1, state.step - 1)));
    elements.next.addEventListener("click", () => {
      if (!isCurrentStepValid()) return;
      showStep(Math.min(5, state.step + 1));
    });
    document.getElementById("edit-plan").addEventListener("click", () => showStep(1));
    document.getElementById("copy-brief").addEventListener("click", copyBrief);
    document.getElementById("print-plan").addEventListener("click", () => window.print());
    document.getElementById("reset-plan").addEventListener("click", resetPlan);
  }

  function selectSingle(event, key) {
    const button = event.target.closest(`[data-${key}]`);
    if (!button) return;
    state[key] = button.dataset[key];
    updateAll();
  }

  function showStep(step, focus = true) {
    state.step = step;
    elements.screens.forEach(screen => {
      const active = Number(screen.dataset.screen) === step;
      screen.hidden = !active;
      screen.classList.toggle("is-active", active);
    });
    elements.controls.hidden = step === 5;
    updateAll();
    if (focus) {
      const heading = document.querySelector(`[data-screen="${step}"] h2`);
      if (heading) heading.focus({ preventScroll: true });
      document.querySelector(".planner-shell").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }

  function updateAll() {
    updatePressedStates();
    updateProgress();
    updateControls();
    updatePreview();
    updateResult();
    saveState();
  }

  function updatePressedStates() {
    document.querySelectorAll("[data-space]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.space === state.space)));
    document.querySelectorAll("[data-scope]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.scope === state.scope)));
    document.querySelectorAll("[data-detail]").forEach(button => button.setAttribute("aria-pressed", String(state.details.includes(button.dataset.detail))));
    document.querySelectorAll("[data-size]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.size === state.size)));
    document.querySelectorAll("[data-timeline]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.timeline === state.timeline)));
  }

  function updateProgress() {
    const names = ["Choose a space", "Define the scope", "Add inclusions", "Set scale and timing", "Review your plan"];
    elements.progressLabel.textContent = state.step === 5 ? "Plan complete" : `Step ${state.step} of 4`;
    elements.progressName.textContent = names[state.step - 1];
    elements.progressBar.style.width = `${Math.min(state.step, 4) * 25}%`;
  }

  function updateControls() {
    elements.back.disabled = state.step === 1;
    elements.next.disabled = !isCurrentStepValid();
    elements.next.firstChild.textContent = state.step === 4 ? "Build my range " : "Continue ";
  }

  function isCurrentStepValid() {
    if (state.step === 1) return Boolean(state.space);
    if (state.step === 2) return Boolean(state.scope);
    if (state.step === 3) return true;
    if (state.step === 4) return Boolean(state.size && state.timeline);
    return true;
  }

  function updatePreview() {
    const space = spaces[state.space];
    const scope = scopes[state.scope];
    const size = sizes[state.size];
    if (space) {
      elements.previewImage.src = space.image;
      elements.previewImage.alt = space.alt;
      elements.previewSpaceLabel.textContent = space.label;
      elements.previewTitle.textContent = `${space.label} project`;
      elements.previewCopy.textContent = scope ? scope.description : "Now choose how far the work should go.";
    } else {
      elements.previewSpaceLabel.textContent = "Choose a space";
      elements.previewTitle.textContent = "Your plan starts here.";
      elements.previewCopy.textContent = "Select a space to build a project profile and preliminary planning range.";
    }
    elements.previewSpace.textContent = space ? space.label : "Not selected";
    elements.previewScope.textContent = scope ? scope.label : "Not selected";
    elements.previewDetails.textContent = state.details.length ? state.details.join(", ") : "None yet";
    elements.previewSize.textContent = size ? size.label : "Not selected";
    const range = calculateRange();
    elements.previewPrice.textContent = range ? formatRange(range) : "Complete four steps";
  }

  function calculateRange() {
    if (!state.space || !state.scope || !state.size) return null;
    const space = spaces[state.space];
    const detailRatio = state.details.length / Math.max(space.details.length, 1);
    const detailFactor = 0.82 + detailRatio * 0.38;
    const multiplier = scopes[state.scope].multiplier * sizes[state.size].multiplier * detailFactor;
    let low = roundTo500(space.low * multiplier);
    let high = roundTo500(space.high * multiplier);
    high = Math.max(high, low + 1000);
    return { low, high, detailFactor };
  }

  function updateResult() {
    const range = calculateRange();
    if (!range) return;
    const space = spaces[state.space];
    const scope = scopes[state.scope];
    const size = sizes[state.size];
    const timeline = timelines[state.timeline];
    elements.resultPrice.textContent = formatRange(range);
    elements.resultContext.textContent = `${space.label} / ${scope.label} / ${size.label}. This is a broad pre-visit planning range, not a bid or offer.`;
    const detailsText = state.details.length ? state.details.join(", ") : "No specific inclusions selected";
    elements.resultBrief.innerHTML = [
      ["Space", space.label],
      ["Scope", scope.label],
      ["Scale", size.label],
      ["Timing", timeline ? timeline.label : "Not selected"],
      ["Includes", detailsText]
    ].map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join("");

    const detailPercent = Math.round((state.details.length / space.details.length) * 100);
    const factorRows = [
      ["Scope intensity", scope.label, Math.round((scope.multiplier / 1.65) * 100)],
      ["Project scale", size.label, Math.round((size.multiplier / 1.35) * 100)],
      ["Selected inclusions", `${state.details.length} of ${space.details.length}`, detailPercent]
    ];
    elements.resultFactors.innerHTML = factorRows.map(([label, value, width]) => `
      <div class="factor-item"><span>${label}</span><strong>${value}</strong><div class="factor-meter" aria-hidden="true"><i style="width:${Math.max(8, width)}%"></i></div></div>`).join("");

    const brief = buildBrief(range);
    const quoteParams = new URLSearchParams({
      service: space.quoteService,
      timeline: timeline ? timeline.quote : "",
      details: brief
    });
    elements.quoteLink.href = `quote.html?${quoteParams.toString()}#form`;
    elements.whatsappLink.href = `https://wa.me/13235475086?text=${encodeURIComponent(`Hi ELF Home Services, I used the project planner.\n\n${brief}`)}`;
  }

  function buildBrief(range) {
    const space = spaces[state.space];
    const scope = scopes[state.scope];
    const size = sizes[state.size];
    const timeline = timelines[state.timeline];
    return [
      "ELF project planner brief",
      `Space: ${space.label}`,
      `Scope: ${scope.label}`,
      `Approximate scale: ${size.label}`,
      `Preferred timing: ${timeline ? timeline.label : "Not selected"}`,
      `Possible inclusions: ${state.details.length ? state.details.join(", ") : "Not selected"}`,
      `Preliminary planning range: ${formatRange(range)}`,
      "Note: This range is an early planning aid, not a written quote."
    ].join("\n");
  }

  async function copyBrief() {
    const range = calculateRange();
    if (!range) return;
    const text = buildBrief(range);
    try {
      await navigator.clipboard.writeText(text);
      announce("Project brief copied.");
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      announce("Project brief copied.");
    }
  }

  function resetPlan() {
    state = { ...defaults, details: [] };
    try { localStorage.removeItem(storageKey); } catch (error) { /* No action needed. */ }
    renderDetails();
    showStep(1);
    announce("Planner reset.");
  }

  function announce(message) {
    elements.status.textContent = message;
    window.clearTimeout(announce.timer);
    announce.timer = window.setTimeout(() => { elements.status.textContent = ""; }, 3500);
  }

  function formatRange(range) { return `${money.format(range.low)} - ${money.format(range.high)}`; }
  function roundTo500(value) { return Math.max(500, Math.round(value / 500) * 500); }
  function escapeAttribute(value) { return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
})();
