// ============================================================
// ELF HOME SERVICES — SHARED SCRIPTS
// ============================================================

// NAV: scrolled state
(function(){
  var nav = document.querySelector('.nav');
  if (!nav) return;
  function updateScroll(){
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
})();

// PAGE PROGRESS
(function(){
  var bar = document.querySelector('.scroll-progress span');
  if (!bar) return;
  function updateProgress(){
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    var hasActions = !!document.querySelector('.mobile-action-bar');
    bar.style.width = Math.max(0, Math.min(100, pct)) + '%';
    document.body.classList.toggle('has-mobile-actions', hasActions);
    document.body.classList.toggle('show-mobile-actions', hasActions && window.scrollY > 360);
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
})();

// NAV: mega dropdown tap support (mobile/tablet)
document.querySelectorAll('.nav-item').forEach(function(item){
  var link = item.querySelector('.nav-link');
  var mega = item.querySelector('.mega');
  if (!mega || !link) return;
  link.addEventListener('click', function(e){
    if (window.innerWidth <= 1024) return; // mobile handles separately
    if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
      e.preventDefault();
      document.querySelectorAll('.nav-item.open').forEach(function(o){ if (o !== item) o.classList.remove('open'); });
      item.classList.toggle('open');
    }
  });
});
document.addEventListener('click', function(e){
  if (!e.target.closest('.nav-item')) {
    document.querySelectorAll('.nav-item.open').forEach(function(o){ o.classList.remove('open'); });
  }
});

// MOBILE MENU
(function(){
  var burger = document.querySelector('.nav-burger');
  var menu = document.querySelector('.mobile-menu');
  var close = document.querySelector('.mobile-menu-close');
  if (!burger || !menu) return;
  function setMobileMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    if (open) {
      menu.removeAttribute('inert');
      document.body.style.overflow = 'hidden';
    } else {
      menu.setAttribute('inert', '');
      document.body.style.overflow = '';
    }
    burger.setAttribute('aria-expanded', String(open));
  }
  setMobileMenu(false);
  burger.addEventListener('click', function(){
    setMobileMenu(true);
  });
  if (close) close.addEventListener('click', function(){
    setMobileMenu(false);
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      setMobileMenu(false);
      burger.focus();
    }
  });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      setMobileMenu(false);
    });
  });
})();

// FAQ
document.querySelectorAll('.faq-q').forEach(function(btn){
  btn.addEventListener('click', function(){
    var item = btn.closest('.faq-item');
    item.classList.toggle('open');
  });
});

// SCROLL REVEAL
(function(){
  var els = document.querySelectorAll('.reveal');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(function(e){ e.classList.add('in'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  els.forEach(function(el){ obs.observe(el); });
})();

// TABS (generic data-tabs)
document.querySelectorAll('[data-tabs]').forEach(function(tabs){
  var triggers = tabs.querySelectorAll('[data-tab]');
  triggers.forEach(function(trig){
    trig.addEventListener('click', function(){
      var name = trig.getAttribute('data-tab');
      triggers.forEach(function(t){ t.classList.toggle('active', t === trig); });
      var panels = tabs.querySelectorAll('[data-panel]');
      panels.forEach(function(p){
        p.classList.toggle('active', p.getAttribute('data-panel') === name);
      });
    });
  });
});

// ACCORDION (generic data-accordion)
document.querySelectorAll('[data-accordion] > [data-acc-item]').forEach(function(item){
  var hdr = item.querySelector('[data-acc-hdr]');
  if (!hdr) return;
  hdr.addEventListener('click', function(){
    var wasOpen = item.classList.contains('open');
    var parent = item.closest('[data-accordion]');
    if (parent.getAttribute('data-accordion') === 'single') {
      parent.querySelectorAll('> [data-acc-item]').forEach(function(i){ i.classList.remove('open'); });
    }
    if (!wasOpen) item.classList.add('open');
  });
});

// CONTEXTUAL CONVERSION INTAKE
(function(){
  if (document.querySelector('[data-conversion-intake]')) return;

  var path = window.location.pathname;
  var isGuide = /^\/guides\/[^/]+\.html$/.test(path);
  var isService = /^\/services\/[^/]+\.html$/.test(path);
  var isLocation = /^\/locations\/[^/]+\.html$/.test(path);
  var isCaseStudy = /^\/case-studies\/[^/]+\.html$/.test(path);
  if (!isGuide && !isService && !isLocation && !isCaseStudy) return;

  var anchor = document.querySelector('.guide-hero, .page-hero, .case-hero');
  if (!anchor) return;

  var title = (document.querySelector('h1') || {}).textContent || document.title || 'ELF Home Services';
  title = title.replace(/\s+/g, ' ').trim();
  var file = path.split('/').pop().replace('.html', '');
  var serviceGuess = 'Handyman / punch list';
  if (/kitchen|cabinet/.test(file)) serviceGuess = 'Kitchen / cabinets';
  else if (/bath|shower|vanity|grout/.test(file)) serviceGuess = 'Bathroom / tile';
  else if (/paint|repaint|pintura/.test(file)) serviceGuess = 'Painting';
  else if (/drywall|ceiling|popcorn/.test(file)) serviceGuess = 'Drywall / texture';
  else if (/floor|lvp|hardwood/.test(file)) serviceGuess = 'Flooring';
  else if (/tile|backsplash/.test(file)) serviceGuess = 'Tile / backsplash';
  else if (/hvac|air|heat/.test(file)) serviceGuess = 'HVAC guidance';
  else if (/appliance/.test(file)) serviceGuess = 'Appliance install';

  var cityGuess = 'DFW';
  ['denton','frisco','plano','mckinney','allen','lewisville','southlake','dallas','fort-worth','arlington','flower-mound','prosper','carrollton'].some(function(city){
    if (!file.includes(city)) return false;
    cityGuess = city.split('-').map(function(part){ return part.charAt(0).toUpperCase() + part.slice(1); }).join(' ');
    return true;
  });

  var section = document.createElement('section');
  section.className = 'conversion-intake';
  section.setAttribute('data-conversion-intake', '');
  section.innerHTML =
    '<div class="container conversion-intake-grid">' +
      '<div class="conversion-copy">' +
        '<div class="kicker">Project clarity</div>' +
        '<h2>Turn this page into a real DFW estimate.</h2>' +
        '<p>Pick the closest scope and send ELF the page you are reading. We will reply with the right next step, likely price drivers, and what photos help us quote faster.</p>' +
        '<div class="conversion-proof">' +
          '<span>Flat pricing</span><span>Photo-friendly quotes</span><span>Same-day reply when available</span>' +
        '</div>' +
      '</div>' +
      '<form class="conversion-card" novalidate>' +
        '<label>Service <select name="service">' +
          '<option>Handyman / punch list</option><option>Painting</option><option>Drywall / texture</option><option>Tile / backsplash</option><option>Flooring</option><option>Kitchen / cabinets</option><option>Bathroom / tile</option><option>Appliance install</option><option>HVAC guidance</option>' +
        '</select></label>' +
        '<div class="conversion-row">' +
          '<label>City <input name="city" type="text" value="' + cityGuess + '" autocomplete="address-level2"/></label>' +
          '<label>Timing <select name="timing"><option>This week</option><option>Next 2 weeks</option><option>This month</option><option>Planning only</option></select></label>' +
        '</div>' +
        '<label>What should we look at? <textarea name="detail" rows="3" placeholder="Example: 2 drywall holes, orange peel texture, need paint blend, Frisco house."></textarea></label>' +
        '<div class="conversion-result" aria-live="polite">' +
          '<strong data-conversion-result-title>Fastest quote path</strong>' +
          '<span data-conversion-result-copy>Send 3 clear photos plus this page link. We will confirm scope before giving a number.</span>' +
        '</div>' +
        '<div class="conversion-actions">' +
          '<a href="#" target="_blank" rel="noopener" class="btn btn-primary" data-conversion-whatsapp>Send via WhatsApp</a>' +
          '<a href="../quote.html" class="btn btn-ghost-light">Full quote form</a>' +
        '</div>' +
      '</form>' +
    '</div>';

  anchor.insertAdjacentElement('afterend', section);

  var form = section.querySelector('form');
  var service = form.elements.service;
  var city = form.elements.city;
  var timing = form.elements.timing;
  var detail = form.elements.detail;
  var resultTitle = section.querySelector('[data-conversion-result-title]');
  var resultCopy = section.querySelector('[data-conversion-result-copy]');
  var whatsapp = section.querySelector('[data-conversion-whatsapp]');

  Array.prototype.slice.call(service.options).forEach(function(option){
    option.selected = option.value === serviceGuess;
  });

  function updateConversion(){
    var serviceValue = service.value;
    var detailValue = detail.value.trim();
    var titleMap = {
      'Painting': 'Photos that matter',
      'Drywall / texture': 'Texture matching first',
      'Tile / backsplash': 'Measure plus material',
      'Flooring': 'Square footage and transitions',
      'Kitchen / cabinets': 'Scope before style',
      'Bathroom / tile': 'Waterproofing details',
      'Appliance install': 'Model number helps',
      'HVAC guidance': 'Symptoms and system age',
      'Handyman / punch list': 'Bundle the small items'
    };
    var copyMap = {
      'Painting': 'Send room photos, trim photos, ceiling height, and paint color if selected.',
      'Drywall / texture': 'Send close-ups and a wider wall photo so we can plan patch, texture, primer, and paint blend.',
      'Tile / backsplash': 'Send dimensions, tile choice, outlet count, and photos of the current surface.',
      'Flooring': 'Send room dimensions, existing floor type, transition photos, and any slab or squeak concerns.',
      'Kitchen / cabinets': 'Send cabinet photos, layout photos, desired finish level, and whether counters or backsplash stay.',
      'Bathroom / tile': 'Send shower, floor, vanity, plumbing wall, and ventilation photos before choosing finish details.',
      'Appliance install': 'Send the appliance model number, opening measurements, and current connection photos.',
      'HVAC guidance': 'Send system age, thermostat photo, filter size, symptoms, and whether it is cooling or heating.',
      'Handyman / punch list': 'Send one photo per item, access notes, and which repair matters most if time is limited.'
    };
    resultTitle.textContent = titleMap[serviceValue] || 'Fastest quote path';
    resultCopy.textContent = copyMap[serviceValue] || 'Send 3 clear photos plus this page link. We will confirm scope before giving a number.';
    var msg = 'Hi ELF, I am reading: ' + title + '. Service: ' + serviceValue + '. City: ' + (city.value || 'DFW') + '. Timing: ' + timing.value + '. Details: ' + (detailValue || 'I would like help turning this into a real estimate.') + ' Page: ' + window.location.href.split('#')[0];
    whatsapp.href = 'https://wa.me/13235475086?text=' + encodeURIComponent(msg);
  }

  form.addEventListener('submit', function(e){ e.preventDefault(); window.open(whatsapp.href, '_blank', 'noopener'); });
  [service, city, timing, detail].forEach(function(input){
    input.addEventListener('input', updateConversion);
    input.addEventListener('change', updateConversion);
  });
  updateConversion();
})();

// SITE FINDER AND STATIC SEARCH PAGE
(function(){
  var path = window.location.pathname;
  var segments = path.split('/').filter(Boolean);
  var depth = path.endsWith('/') ? segments.length : Math.max(0, segments.length - 1);
  var rootPrefix = new Array(depth + 1).join('../');
  var isSearchPage = /\/search\.html$/.test(path);

  function esc(value) {
    return String(value || '').replace(/[&<>"']/g, function(ch){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]);
    });
  }

  function localHref(item) {
    return rootPrefix + item.href.replace(/^\/+/, '');
  }

  function scoreItem(item, terms) {
    var haystack = (item.keywords || '').toLowerCase();
    return terms.reduce(function(score, term){
      if (!term) return score;
      if ((item.title || '').toLowerCase().indexOf(term) !== -1) score += 10;
      if ((item.h1 || '').toLowerCase().indexOf(term) !== -1) score += 7;
      if (haystack.indexOf(term) !== -1) score += 3;
      if ((item.category || '').toLowerCase().indexOf(term) !== -1) score += 2;
      return score;
    }, 0);
  }

  function findMatches(index, query, category) {
    var terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return index.items
      .filter(function(item){ return !category || category === 'All' || item.category === category; })
      .map(function(item){ return { item: item, score: terms.length ? scoreItem(item, terms) : 1 }; })
      .filter(function(row){ return !terms.length || row.score > 0; })
      .sort(function(a,b){ return b.score - a.score || a.item.title.localeCompare(b.item.title); })
      .slice(0, isSearchPage ? 40 : 8)
      .map(function(row){ return row.item; });
  }

  function card(item, compact) {
    var img = item.image ? '<img src="' + esc(rootPrefix + item.image) + '" alt="' + esc(item.title || item.h1 || item.category || 'ELF Home Services') + '" loading="lazy" decoding="async"/>' : '';
    return '<a class="' + (compact ? 'site-finder-result' : 'search-result-card') + '" href="' + esc(localHref(item)) + '">' +
      img +
      '<span>' + esc(item.category) + '</span>' +
      '<strong>' + esc(item.title) + '</strong>' +
      '<p>' + esc(item.description || item.h1 || '') + '</p>' +
    '</a>';
  }

  function renderCompact(root, index) {
    var input = root.querySelector('[data-site-finder-input]');
    var results = root.querySelector('[data-site-finder-results]');
    var chips = root.querySelectorAll('[data-site-finder-chip]');
    var category = 'All';

    function render() {
      var q = input.value || '';
      var matches = findMatches(index, q, category);
      if (!q.trim() && category === 'All') {
        matches = index.items.filter(function(item){
          return ['Service','Guide','Location','Case Study'].indexOf(item.category) !== -1;
        }).slice(0, 6);
      }
      results.innerHTML = matches.map(function(item){ return card(item, true); }).join('') ||
        '<div class="site-finder-empty">No exact match. Try kitchen, drywall, Frisco, pricing, bathroom, LVP, or painting.</div>';
    }

    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        category = chip.getAttribute('data-site-finder-chip');
        chips.forEach(function(c){ c.classList.toggle('active', c === chip); });
        render();
      });
    });
    input.addEventListener('input', render);
    render();
  }

  function renderSearchPage(index) {
    var root = document.querySelector('[data-search-page]');
    if (!root) return;
    var input = root.querySelector('[data-search-page-input]');
    var count = root.querySelector('[data-search-page-count]');
    var results = root.querySelector('[data-search-page-results]');
    var filters = root.querySelectorAll('[data-search-page-filter]');
    var category = 'All';

    function render() {
      var matches = findMatches(index, input.value || '', category);
      count.textContent = matches.length + ' results';
      results.innerHTML = matches.map(function(item){ return card(item, false); }).join('') ||
        '<div class="search-empty">No match yet. Try a broader service, city, room, material, or repair word.</div>';
    }

    filters.forEach(function(filter){
      filter.addEventListener('click', function(){
        category = filter.getAttribute('data-search-page-filter');
        filters.forEach(function(f){ f.classList.toggle('active', f === filter); });
        render();
      });
    });
    input.addEventListener('input', render);
    render();
  }

  function injectCompact(index) {
    if (isSearchPage || /\/(?:quote|book|estimate)\.html$/.test(path) || document.querySelector('[data-site-finder]')) return;
    var anchor = document.querySelector('.hero-editorial, .page-hero, .guide-hero, .case-hero, .case-index-hero, .workpedia-hero, .hvac-hero, .painting-hero');
    if (!anchor) return;
    var section = document.createElement('section');
    section.className = 'site-finder';
    section.setAttribute('data-site-finder', '');
    section.innerHTML =
      '<div class="container site-finder-shell">' +
        '<div class="site-finder-head"><span>ELF finder</span><strong>Find the right service, guide, city, or case study.</strong></div>' +
        '<label class="site-finder-input"><span>Search</span><input type="search" data-site-finder-input placeholder="kitchen, drywall, Frisco, LVP, pricing..."/></label>' +
        '<div class="site-finder-chips" aria-label="Search filters">' +
          '<button type="button" class="active" data-site-finder-chip="All">All</button>' +
          '<button type="button" data-site-finder-chip="Service">Services</button>' +
          '<button type="button" data-site-finder-chip="Guide">Guides</button>' +
          '<button type="button" data-site-finder-chip="Location">Cities</button>' +
          '<button type="button" data-site-finder-chip="Case Study">Cases</button>' +
        '</div>' +
        '<div class="site-finder-results" data-site-finder-results></div>' +
        '<a class="site-finder-more" href="' + esc(rootPrefix + 'search.html') + '">Open full site search</a>' +
      '</div>';
    anchor.insertAdjacentElement('afterend', section);
    renderCompact(section, index);
  }

  fetch(rootPrefix + 'site-index.json', { credentials: 'same-origin' })
    .then(function(response){ return response.ok ? response.json() : null; })
    .then(function(index){
      if (!index || !index.items) return;
      renderSearchPage(index);
      injectCompact(index);
    })
    .catch(function(){});
})();

// SMOOTH ANCHOR SCROLL with offset for sticky nav
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  var href = a.getAttribute('href');
  if (href === '#' || href.length < 2) return;
  a.addEventListener('click', function(e){
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    var y = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// INTERACTIVE APP TABS
(function(){
  var root = document.querySelector('[data-app-tabs]');
  if (!root) return;
  var tabs = root.querySelectorAll('[data-app-tab]');
  var panels = document.querySelectorAll('[data-app-panel]');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      var key = tab.getAttribute('data-app-tab');
      tabs.forEach(function(t){ t.classList.toggle('active', t === tab); });
      panels.forEach(function(panel){
        panel.classList.toggle('active', panel.getAttribute('data-app-panel') === key);
      });
    });
  });
})();

// QUICK ESTIMATOR
(function(){
  var service = document.getElementById('est-service');
  var size = document.getElementById('est-size');
  var urgent = document.getElementById('est-urgent');
  var materials = document.getElementById('est-materials');
  var price = document.getElementById('est-price');
  var copy = document.getElementById('est-copy');
  var sizeLabel = document.getElementById('est-size-label');
  var whatsapp = document.getElementById('est-whatsapp');
  if (!service || !size || !price) return;

  var services = {
    painting: { label: 'Painting', base: 280, text: 'Painting usually fits a same-week estimate and a 1-2 day work window.' },
    drywall: { label: 'Drywall repair', base: 145, text: 'Drywall repair depends on texture matching, water staining, and paint blending.' },
    tile: { label: 'Tile / backsplash', base: 650, text: 'Tile work is priced by prep, layout complexity, material, and grout type.' },
    flooring: { label: 'Flooring', base: 900, text: 'Flooring varies with square footage, demo, subfloor prep, trim, and transitions.' },
    repairs: { label: 'General repairs', base: 180, text: 'Punch-list repairs are best bundled into one visit to keep the price efficient.' },
    bath: { label: 'Bathroom remodel', base: 3800, text: 'Bathroom remodels depend on plumbing moves, tile scope, shower systems, and fixtures.' },
    kitchen: { label: 'Kitchen remodel', base: 6800, text: 'Kitchen remodels vary most with cabinetry, counters, backsplash, lighting, and layout changes.' }
  };
  var labels = ['Tiny', 'Standard', 'Medium', 'Large', 'Major'];
  var multipliers = [0.65, 1, 1.55, 2.25, 3.2];

  function money(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function updateEstimate(){
    var data = services[service.value];
    var index = parseInt(size.value, 10) - 1;
    var low = data.base * multipliers[index];
    var high = low * 1.8;
    if (materials.checked) {
      low *= 1.18;
      high *= 1.28;
    }
    if (urgent.checked) {
      low *= 1.18;
      high *= 1.22;
    }
    sizeLabel.textContent = labels[index];
    price.textContent = money(low) + ' - ' + money(high);
    copy.textContent = data.text + (urgent.checked ? ' We will flag it for faster scheduling.' : '');
    var msg = 'Hi ELF, I used the estimator. Service: ' + data.label + '. Size: ' + labels[index] + '. Rough range: ' + price.textContent + '. Can I get a firm quote?';
    whatsapp.href = 'https://wa.me/13235475086?text=' + encodeURIComponent(msg);
  }

  [service, size, urgent, materials].forEach(function(input){
    input.addEventListener('input', updateEstimate);
    input.addEventListener('change', updateEstimate);
  });
  updateEstimate();
})();

// SERVICE FINDER
(function(){
  var result = document.getElementById('finder-result');
  var options = document.querySelectorAll('[data-service-match]');
  if (!result || !options.length) return;
  var matches = {
    drywall: ['Drywall repair', 'Best for holes, water stains, texture matching, cracked seams, and paint-ready wall restoration.', 'services/drywall.html'],
    painting: ['Painting', 'Best for interior refreshes, exterior protection, cabinet paint, trim, doors, and clean color changes.', 'services/painting.html'],
    tile: ['Tile & backsplash', 'Best for cracked tile, shower walls, kitchen backsplashes, grout issues, and water-safe surfaces.', 'services/tile.html'],
    flooring: ['Flooring', 'Best for LVP, laminate, hardwood repairs, uneven transitions, worn floors, and new-room installs.', 'services/flooring.html'],
    repairs: ['General repairs', 'Best for doors, fixtures, trim, hardware, small leaks, fence gates, punch lists, and odd jobs.', 'services/repairs.html'],
    bathroom: ['Bathroom remodel', 'Best for showers, vanities, tile, fixtures, moisture problems, and full bathroom upgrades.', 'services/bathroom.html']
  };
  options.forEach(function(button){
    button.addEventListener('click', function(){
      var key = button.getAttribute('data-service-match');
      var match = matches[key];
      options.forEach(function(option){ option.classList.toggle('active', option === button); });
      result.innerHTML = '<span>Recommended</span><h3>' + match[0] + '</h3><p>' + match[1] + '</p><a href="' + match[2] + '">View service</a>';
    });
  });
})();

// QUICK QUOTE WIZARD
(function(){
  var form = document.querySelector('[data-quote-wizard]');
  if (!form) return;
  var step = 1;
  var steps = form.querySelectorAll('[data-step]');
  var prev = form.querySelector('[data-wizard-prev]');
  var next = form.querySelector('[data-wizard-next]');
  var progress = form.querySelector('[data-wizard-progress]');
  var preview = form.querySelector('[data-quote-preview]');
  var send = form.querySelector('[data-quote-send]');

  function val(name) {
    var field = form.elements[name];
    return field && field.value ? field.value.trim() : '';
  }

  function buildMessage() {
    var name = val('name') || 'New customer';
    var city = val('city') || 'DFW';
    var service = val('service') || 'Home service';
    var detail = val('detail') || 'I would like a quote.';
    return 'Hi ELF, my name is ' + name + '. I am in ' + city + '. I need help with: ' + service + '. Details: ' + detail;
  }

  function render() {
    steps.forEach(function(panel){
      panel.classList.toggle('active', panel.getAttribute('data-step') === String(step));
    });
    progress.style.width = (step * 33.333) + '%';
    prev.style.visibility = step === 1 ? 'hidden' : 'visible';
    next.textContent = step === 3 ? 'Start over' : 'Next';
    var msg = buildMessage();
    preview.textContent = msg;
    send.href = 'https://wa.me/13235475086?text=' + encodeURIComponent(msg);
  }

  prev.addEventListener('click', function(){ step = Math.max(1, step - 1); render(); });
  next.addEventListener('click', function(){ step = step === 3 ? 1 : step + 1; render(); });
  form.addEventListener('submit', function(e){
    e.preventDefault();
    window.open(send.href, '_blank', 'noopener');
  });
  form.addEventListener('input', render);
  render();
})();

// BEFORE / AFTER DRAGGABLE SLIDERS
(function(){
  document.querySelectorAll('.ba-imgs').forEach(function(slider){
    var after = slider.querySelector('.ba-after');
    if (!after) return;
    var handle = document.createElement('span');
    var active = false;
    handle.className = 'ba-handle';
    slider.classList.add('ba-slider-ready');
    slider.appendChild(handle);

    function setPosition(clientX) {
      var rect = slider.getBoundingClientRect();
      var pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.style.left = pct + '%';
    }

    slider.addEventListener('pointerdown', function(e){
      active = true;
      slider.setPointerCapture(e.pointerId);
      setPosition(e.clientX);
    });
    slider.addEventListener('pointermove', function(e){
      if (!active) return;
      setPosition(e.clientX);
    });
    slider.addEventListener('pointerup', function(){
      active = false;
    });
    slider.addEventListener('pointerleave', function(){
      active = false;
    });
  });
})();
