(function () {
  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  };

  ready(() => {
    const studio = document.querySelector("[data-tile-studio]");
    if (!studio) return;

    const surfaces = {
      shower: {
        label: "Shower wall",
        base: 3800,
        per: 58,
        min: 3800,
        time: "5-8 days",
        build: "Waterproof first",
        priority: "Waterproofing",
        ready: "Photos + dimensions",
        note: "Shower tile needs waterproofing, slope, niche and drain planning before tile selection."
      },
      backsplash: {
        label: "Kitchen backsplash",
        base: 650,
        per: 24,
        min: 650,
        time: "1-2 days",
        build: "Layout first",
        priority: "Outlet cuts",
        ready: "Counter height",
        note: "Backsplashes are won with centered lines, outlet planning, clean edges, and cabinet-to-counter alignment."
      },
      floor: {
        label: "Tile floor",
        base: 850,
        per: 32,
        min: 850,
        time: "2-4 days",
        build: "Flatness first",
        priority: "Substrate prep",
        ready: "Existing floor photos",
        note: "Floor tile depends on slab flatness, transitions, crack isolation, and movement joints."
      },
      fireplace: {
        label: "Fireplace surround",
        base: 850,
        per: 38,
        min: 850,
        time: "2-4 days",
        build: "Edges first",
        priority: "Heat-safe materials",
        ready: "Mantel + hearth photos",
        note: "Fireplaces need balanced cuts, edge profiles, and clean termination at the mantel and hearth."
      }
    };

    const materials = {
      porcelain: { label: "Porcelain", mult: 1, risk: 0 },
      ceramic: { label: "Ceramic", mult: 0.9, risk: 1 },
      marble: { label: "Natural stone", mult: 1.32, risk: 3 },
      zellige: { label: "Zellige handmade", mult: 1.42, risk: 3 }
    };

    const patterns = {
      straight: { label: "Straight lay", mult: 1, risk: 0 },
      stack: { label: "Stacked porcelain", mult: 1.08, risk: 1 },
      herringbone: { label: "Herringbone layout", mult: 1.35, risk: 3 },
      large: { label: "Large-format slab look", mult: 1.28, risk: 2 }
    };

    const grouts = {
      cement: { label: "Cement", add: 0, risk: 2 },
      epoxy: { label: "Epoxy", add: 420, risk: 0 },
      hybrid: { label: "Hybrid", add: 260, risk: 1 }
    };

    const state = {
      surface: "shower",
      material: "porcelain",
      pattern: "stack",
      grout: "epoxy",
      sqft: 60
    };

    const $ = (selector) => studio.querySelector(selector);
    const preview = $("[data-tile-preview]");
    const range = $("[data-tile-range]");
    const time = $("[data-tile-time]");
    const priority = $("[data-tile-priority]");
    const readyText = $("[data-tile-ready]");
    const build = $("[data-tile-build]");
    const risk = $("[data-tile-risk]");
    const groutLabel = $("[data-tile-grout-label]");
    const surfaceLabel = $("[data-tile-surface-label]");
    const patternLabel = $("[data-tile-pattern-label]");
    const briefBox = $("[data-tile-brief]");
    const whatsapp = $("[data-tile-whatsapp]");
    const copyButton = $("[data-copy-tile-brief]");
    const materialInput = $("[data-tile-input='material']");
    const sqftInput = $("[data-tile-input='sqft']");
    const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

    const roundTo = (value, step) => Math.round(value / step) * step;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const riskLabel = (score) => {
      if (score <= 2) return "Controlled";
      if (score <= 5) return "Detail-heavy";
      return "Specialist plan";
    };

    const writeBrief = (low, high) => {
      const surface = surfaces[state.surface];
      const material = materials[state.material];
      const pattern = patterns[state.pattern];
      const grout = grouts[state.grout];
      return [
        "ELF tile brief:",
        `${surface.label}, ${state.sqft} sqft.`,
        `${material.label} tile, ${pattern.label}, ${grout.label} grout.`,
        `Planning range: ${currency.format(low)} - ${currency.format(high)}.`,
        `Timeline: ${surface.time}.`,
        `${surface.note}`
      ].join(" ");
    };

    const updateButtons = (groupName, value) => {
      studio.querySelectorAll(`[data-tile-choice='${groupName}'] button`).forEach((button) => {
        button.classList.toggle("active", button.dataset.value === value);
      });
    };

    const render = () => {
      state.sqft = clamp(Number.parseInt(sqftInput.value || "0", 10) || 12, 12, 260);
      sqftInput.value = state.sqft;

      const surface = surfaces[state.surface];
      const material = materials[state.material];
      const pattern = patterns[state.pattern];
      const grout = grouts[state.grout];
      const raw = Math.max(surface.min, (surface.base + state.sqft * surface.per) * material.mult * pattern.mult + grout.add);
      const low = roundTo(raw * 0.85, 50);
      const high = roundTo(raw * 1.25, 50);
      const score = pattern.risk + material.risk + grout.risk + (state.surface === "shower" ? 2 : 0);
      const brief = writeBrief(low, high);

      range.textContent = `${currency.format(low)} - ${currency.format(high)}`;
      time.textContent = surface.time;
      priority.textContent = surface.priority;
      readyText.textContent = surface.ready;
      build.textContent = surface.build;
      risk.textContent = riskLabel(score);
      groutLabel.textContent = grout.label;
      surfaceLabel.textContent = surface.label;
      patternLabel.textContent = pattern.label;
      briefBox.textContent = brief;
      whatsapp.href = `https://wa.me/13235475086?text=${encodeURIComponent(brief)}`;

      preview.classList.remove("pattern-straight", "pattern-stack", "pattern-herringbone", "pattern-large", "material-porcelain", "material-ceramic", "material-marble", "material-zellige");
      preview.classList.add(`pattern-${state.pattern}`, `material-${state.material}`);
      updateButtons("surface", state.surface);
      updateButtons("pattern", state.pattern);
      updateButtons("grout", state.grout);
    };

    studio.querySelectorAll("[data-tile-choice]").forEach((group) => {
      group.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-value]");
        if (!button) return;
        state[group.dataset.tileChoice] = button.dataset.value;
        render();
      });
    });

    materialInput.addEventListener("change", () => {
      state.material = materialInput.value;
      render();
    });

    sqftInput.addEventListener("input", render);

    copyButton.addEventListener("click", async () => {
      const text = briefBox.textContent.trim();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        }
        copyButton.textContent = "Copied";
      } catch (error) {
        copyButton.textContent = "Select brief";
      }
      window.setTimeout(() => {
        copyButton.textContent = "Copy brief";
      }, 1400);
    });

    render();
  });
})();
