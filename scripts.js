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
