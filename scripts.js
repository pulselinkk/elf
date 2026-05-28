// ============================================================
// BOHDAN'S HANDYMAN — SHARED SCRIPTS
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
    bar.style.width = Math.max(0, Math.min(100, pct)) + '%';
    document.body.classList.toggle('show-mobile-actions', window.scrollY > 360);
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
  burger.addEventListener('click', function(){
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  if (close) close.addEventListener('click', function(){
    menu.classList.remove('open');
    document.body.style.overflow = '';
  });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      menu.classList.remove('open');
      document.body.style.overflow = '';
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
