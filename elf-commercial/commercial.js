(function(){
  const money = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  const phone = '13235475086';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const val = (id, fallback=0) => {
    const el = document.getElementById(id);
    if (!el) return fallback;
    const n = Number(el.value);
    return Number.isFinite(n) ? n : fallback;
  };
  function setText(id, text){ const el = document.getElementById(id); if(el) el.textContent = text; }
  function encodeBrief(text){ return 'https://wa.me/'+phone+'?text='+encodeURIComponent(text); }
  function bindInputs(root, selector, update){
    $$(selector, root).forEach(el => { el.addEventListener('input', update); el.addEventListener('change', update); });
    update();
  }
  function initDispatch(){
    const app = $('[data-commercial-app]');
    if(!app) return;
    const businessBase = { office:520, retail:690, restaurant:870, medical:940, industrial:780, property:720 };
    const labels = { office:'Office', retail:'Retail', restaurant:'Restaurant', medical:'Medical / clinic', industrial:'Warehouse / light industrial', property:'Multi-tenant property', standard:'Standard', soon:'This week', rush:'Rush', emergency:'Emergency', business:'business-hours access', after:'after-hours access', occupied:'occupied customer-facing access', secure:'secured escorted access', repair:'repair / punch list', maintenance:'maintenance route', finishout:'tenant improvement', safety:'safety / security risk', water:'water / storm damage' };
    function update(){
      const business = $('#cc-business')?.value || 'office';
      const urgency = $('#cc-urgency')?.value || 'standard';
      const scope = $('#cc-scope')?.value || 'repair';
      const access = $('#cc-access')?.value || 'business';
      const sites = Math.max(1, val('cc-sites',1));
      const size = Math.max(100, val('cc-size',2400));
      const urgencyMult = { standard:1, soon:1.18, rush:1.45, emergency:1.95 }[urgency];
      const accessMult = { business:1, after:1.18, occupied:1.12, secure:1.24 }[access];
      const scopeMult = { repair:1, maintenance:.92, finishout:1.7, safety:1.38, water:1.55 }[scope];
      const base = businessBase[business] || 600;
      const sizeMult = 1 + Math.min(size, 60000) / 18000;
      const low = base * sites * sizeMult * urgencyMult * accessMult * scopeMult;
      const high = low * (scope === 'finishout' ? 1.85 : scope === 'water' ? 1.7 : 1.48);
      let score = 18 + sites * 5 + Math.min(30, size/1800) + (urgency === 'emergency' ? 45 : urgency === 'rush' ? 30 : urgency === 'soon' ? 16 : 4) + (scope === 'safety' || scope === 'water' ? 24 : scope === 'finishout' ? 18 : 6);
      let priority = score >= 85 ? 'Critical' : score >= 65 ? 'High' : score >= 44 ? 'Medium' : 'Standard';
      let response = priority === 'Critical' ? 'Same-day / 24 hr' : priority === 'High' ? '24-72 hr' : priority === 'Medium' ? '2-5 days' : 'Route window';
      let risk = priority === 'Critical' ? 'Severe' : priority === 'High' ? 'High' : priority === 'Medium' ? 'Moderate' : 'Low';
      const brief = labels[business]+' - '+labels[scope]+' for '+sites+' location'+(sites>1?'s':'')+', '+size.toLocaleString()+' sq ft affected, '+labels[urgency].toLowerCase()+', '+labels[access]+'. Suggested priority: '+priority+'. Response: '+response+'. Planning range: '+money.format(low)+' - '+money.format(high)+'.';
      setText('cc-priority', priority); setText('cc-response', response); setText('cc-range', money.format(low)+' - '+money.format(high)); setText('cc-risk', risk); setText('cc-brief', brief);
      const wa = $('#cc-whatsapp'); if(wa) wa.href = encodeBrief('ELF Commercial dispatch request: '+brief);
      const status = $('[data-cc-status]'); if(status) status.textContent = priority;
    }
    bindInputs(app, 'select,input', update);
  }
  function initDowntime(){
    const app = $('[data-downtime-app]'); if(!app) return;
    function update(){
      const revenue = val('dt-revenue',8500), impact = val('dt-impact',.25), hours = val('dt-hours',8), visible = val('dt-visible',1);
      const hourly = revenue / 12;
      const cost = hourly * hours * impact * visible;
      const score = Math.min(100, Math.round((cost / 250) + hours * 1.2 + impact * 30 + (visible - 1) * 35));
      const note = 'At '+money.format(revenue)+' daily revenue, '+hours+' affected hours can put about '+money.format(cost)+' at risk. Urgency score '+score+'/100.';
      setText('dt-cost', money.format(cost)); setText('dt-score', score+'/100'); setText('dt-note', note);
    }
    bindInputs(app, 'select,input', update);
  }
  function initMaintenance(){
    const app = $('[data-maintenance-app]'); if(!app) return;
    function update(){
      const sites = Math.max(1,val('mt-sites',4)), size = Math.max(500,val('mt-size',18000)), traffic = val('mt-traffic',1), age = Math.max(0,val('mt-age',12));
      const visits = Math.max(6, Math.round(sites * (traffic > 1.4 ? 18 : traffic > 1.1 ? 12 : 8)));
      const reserve = ((size * .035) + sites * 185 + age * 22) * traffic;
      const rhythm = sites > 8 || traffic > 1.4 ? 'Weekly / biweekly' : sites > 2 ? 'Monthly route' : 'Quarterly route';
      const band = reserve > 1800 ? 'Active wear' : reserve > 950 ? 'Managed' : 'Stable';
      setText('mt-rhythm', rhythm); setText('mt-reserve', money.format(reserve)); setText('mt-visits', visits); setText('mt-band', band);
      setText('mt-note', sites+' location'+(sites>1?'s':'')+' and '+size.toLocaleString()+' sq ft suggest a '+rhythm.toLowerCase()+' with about '+money.format(reserve)+' monthly repair reserve planning.');
    }
    bindInputs(app, '[data-maintenance-input]', update);
  }
  function initVendor(){
    const app = $('[data-vendor-app]'); if(!app) return;
    function update(){
      const spaces = Math.max(1,val('vp-spaces',8)), tickets = Math.max(0,val('vp-tickets',5));
      const paper = $('#vp-paper')?.value || 'basic';
      const billing = $('#vp-billing')?.value || 'cod';
      let score = 44 + Math.min(24, spaces * 2) + Math.min(16, tickets * 2);
      if(paper === 'vendor') score += 8; if(paper === 'additional') score += 16;
      if(billing === 'net15') score += 6; if(billing === 'account') score += 10;
      score = Math.min(100, score);
      const escalation = tickets > 10 || paper === 'additional' ? 'Account lead' : tickets > 4 ? 'Priority queue' : 'Standard';
      const report = paper === 'additional' || billing === 'account' ? 'Owner-ready' : paper === 'vendor' ? 'Vendor-ready' : 'Basic';
      const fit = score > 82 ? 'Excellent' : score > 66 ? 'Strong' : 'Good';
      setText('vp-score', score+'%'); setText('vp-escalation', escalation); setText('vp-report', report); setText('vp-fit', fit);
      setText('vp-note', spaces+' managed space'+(spaces>1?'s':'')+' with '+tickets+' open ticket'+(tickets!==1?'s':'')+' should start with '+report.toLowerCase()+' documentation, '+escalation.toLowerCase()+' routing, and confirmed approval limits before dispatch.');
    }
    bindInputs(app, '[data-vendor-input]', update);
  }
  function initRoute(){
    const app = $('[data-route-app]'); if(!app) return;
    function update(){
      const sites = Math.max(2,val('rp-sites',12)), cities = Math.max(1,val('rp-cities',5));
      const cadence = $('#rp-cadence')?.value || 'monthly';
      const priority = $('#rp-priority')?.value || 'standard';
      const cadenceVisits = { quarterly:4, monthly:12, biweekly:26, weekly:52 }[cadence] || 12;
      const waves = Math.max(1, Math.ceil(sites / Math.max(3, Math.ceil(10 / cities))));
      const visits = sites * cadenceVisits;
      const sla = priority === 'emergency' ? '24/7 triage' : priority === 'rush' ? 'Rush + route' : 'Route SLA';
      const load = visits > 700 ? 'Heavy' : visits > 240 ? 'Active' : 'Managed';
      setText('rp-waves', waves); setText('rp-visits', visits); setText('rp-sla', sla); setText('rp-load', load);
      setText('rp-note', sites+' locations across '+cities+' DFW submarkets create about '+waves+' route wave'+(waves>1?'s':'')+' and '+visits+' annual planned visits at a '+cadence+' cadence.');
    }
    bindInputs(app, '[data-route-input]', update);
  }
  function initFinish(){
    const app = $('[data-finish-app]'); if(!app) return;
    function update(){
      const area = Math.max(25,val('fp-area',650)), damage = val('fp-damage',1), colors = Math.max(1,val('fp-colors',2)), access = val('fp-access',1);
      const gallons = Math.max(1, Math.ceil((area / 325) * (damage > 1.5 ? 1.4 : 1)));
      const phases = Math.max(1, Math.ceil((damage * colors * access) / 1.8));
      const low = (area * 1.65 + colors * 95 + gallons * 48) * damage * access;
      const high = low * 1.55;
      const risk = phases > 3 ? 'High' : phases > 1 ? 'Managed' : 'Low';
      setText('fp-gallons', gallons+' gal'); setText('fp-phases', phases); setText('fp-risk', risk); setText('fp-range', money.format(low)+' - '+money.format(high));
      setText('fp-note', area.toLocaleString()+' sq ft with '+colors+' color'+(colors>1?'s':'')+' suggests '+gallons+' gallon reserve, '+phases+' work phase'+(phases>1?'s':'')+', and '+risk.toLowerCase()+' finish-risk planning.');
    }
    bindInputs(app, '[data-finish-input]', update);
  }
  function initFlooring(){
    const app = $('[data-flooring-app]'); if(!app) return;
    function update(){
      const area = Math.max(20,val('fl-area',420)), traffic = val('fl-traffic',1);
      const type = $('#fl-type')?.value || 'tile';
      const win = $('#fl-window')?.value || 'open';
      const waste = type === 'transition' ? 8 : type === 'tile' ? 12 : type === 'lvp' ? 10 : 7;
      const duration = Math.max(1, Math.ceil((area / (win === 'closed' ? 520 : win === 'after' ? 360 : 240)) * traffic));
      const risk = traffic > 1.4 || win === 'open' ? 'High visibility' : duration > 2 ? 'Managed' : 'Low';
      const access = win === 'after' ? 'After-hours' : win === 'closed' ? 'Closed block' : 'Barricade';
      setText('fl-waste', waste+'%'); setText('fl-access', access); setText('fl-risk', risk); setText('fl-duration', duration+' day'+(duration>1?'s':''));
      setText('fl-note', area.toLocaleString()+' sq ft of '+type+' repair should plan for about '+waste+'% waste, '+access.toLowerCase()+' access, and '+duration+' work day'+(duration>1?'s':'')+' before closeout.');
    }
    bindInputs(app, '[data-flooring-input]', update);
  }
  function initAda(){
    const app = $('[data-ada-app]'); if(!app) return;
    function update(){
      const entry = val('ada-entry',0), restroom = val('ada-restroom',0), reach = val('ada-reach',0);
      const urgency = $('#ada-urgency')?.value || 'standard';
      let score = entry * 18 + restroom * 20 + reach * 14 + (urgency === 'inspection' ? 30 : urgency === 'soon' ? 16 : 4);
      const priority = score > 72 ? 'Critical review' : score > 44 ? 'High' : score > 18 ? 'Medium' : 'Standard';
      const scopeClass = score > 58 ? 'Mixed scope' : score > 24 ? 'Punch + review' : 'Punch';
      const flag = entry === 2 || restroom === 2 || urgency === 'inspection' ? 'Specialist' : score > 30 ? 'Review' : 'Low';
      setText('ada-priority', priority); setText('ada-class', scopeClass); setText('ada-flag', flag); setText('ada-packet', flag === 'Specialist' ? 'Photos + notes' : 'Photos');
      setText('ada-note', 'ADA punch scan score '+score+'/100. Start with photos, measurements, visible barriers, and clear separation between practical punch work and code-heavy specialist review.');
    }
    bindInputs(app, '[data-ada-input]', update);
  }
  function initChecks(){
    const app = $('.check-app'); if(!app) return;
    const tabs = $$('[data-check-tab]', app), lists = $$('[data-check-list]', app), bar = $('[data-check-progress]', app), label = $('[data-check-label]', app);
    function activeList(){ return $('[data-check-list]:not(.hide)', app) || lists[0]; }
    function update(){ const list = activeList(); const boxes = $$('input[type="checkbox"]', list); const done = boxes.filter(b => b.checked).length; const pct = boxes.length ? Math.round(done / boxes.length * 100) : 0; if(bar) bar.style.width = pct+'%'; if(label) label.textContent = pct+'% ready'; }
    tabs.forEach(tab => tab.addEventListener('click', () => { tabs.forEach(t=>t.classList.remove('active')); tab.classList.add('active'); lists.forEach(l=>l.classList.toggle('hide', l.dataset.checkList !== tab.dataset.checkTab)); update(); }));
    $$('input[type="checkbox"]', app).forEach(box => box.addEventListener('change', update)); update();
  }
  function initFilters(){
    const root = $('[data-service-filter]'); if(!root) return;
    root.addEventListener('click', e => {
      const btn = e.target.closest('[data-filter]'); if(!btn) return;
      $$('[data-filter]', root).forEach(b=>b.classList.remove('active')); btn.classList.add('active');
      const filter = btn.dataset.filter;
      $$('[data-service-card]').forEach(card => {
        const groups = (card.dataset.type || '').split(/\s+/);
        card.hidden = filter !== 'all' && !groups.includes(filter);
      });
    });
  }
  function initCopy(){
    document.addEventListener('click', async e => { const btn = e.target.closest('[data-copy-commercial]'); if(!btn) return; const id = btn.dataset.copyCommercial; const text = document.getElementById(id)?.textContent || ''; try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied'; setTimeout(()=>btn.textContent='Copy brief',1300); } catch { btn.textContent = 'Brief ready'; setTimeout(()=>btn.textContent='Copy brief',1300); } });
  }
  document.addEventListener('DOMContentLoaded', () => { initDispatch(); initDowntime(); initMaintenance(); initVendor(); initRoute(); initFinish(); initFlooring(); initAda(); initChecks(); initFilters(); initCopy(); });
})();