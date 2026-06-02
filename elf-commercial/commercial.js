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
    $$('select,input', app).forEach(el => { el.addEventListener('input', update); el.addEventListener('change', update); });
    update();
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
    $$('select,input', app).forEach(el => { el.addEventListener('input', update); el.addEventListener('change', update); }); update();
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
    $$('[data-maintenance-input]', app).forEach(el => { el.addEventListener('input', update); el.addEventListener('change', update); }); update();
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
    root.addEventListener('click', e => { const btn = e.target.closest('[data-filter]'); if(!btn) return; $$('[data-filter]', root).forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const filter = btn.dataset.filter; $$('[data-service-card]').forEach(card => { card.hidden = filter !== 'all' && card.dataset.type !== filter; }); });
  }
  function initCopy(){
    document.addEventListener('click', async e => { const btn = e.target.closest('[data-copy-commercial]'); if(!btn) return; const id = btn.dataset.copyCommercial; const text = document.getElementById(id)?.textContent || ''; try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied'; setTimeout(()=>btn.textContent='Copy brief',1300); } catch { btn.textContent = 'Brief ready'; setTimeout(()=>btn.textContent='Copy brief',1300); } });
  }
  document.addEventListener('DOMContentLoaded', () => { initDispatch(); initDowntime(); initMaintenance(); initChecks(); initFilters(); initCopy(); });
})();