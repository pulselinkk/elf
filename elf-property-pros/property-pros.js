(function(){
  var root = document.querySelector('[data-pro-app]');
  function money(n){ return '$' + Math.round(n).toLocaleString(); }
  function byId(id){ return document.getElementById(id); }
  function setText(id, text){ var el = byId(id); if(el) el.textContent = text; }
  function selected(id){ var el = byId(id); return el ? el.value : ''; }
  var serviceBase = { turnover: 2400, listing: 1800, tenant: 850, exterior: 1400, flooring: 3200, multi: 5200 };
  var serviceNames = { turnover:'Make-ready turnover', listing:'Pre-listing repair list', tenant:'Tenant work order', exterior:'Exterior / curb appeal', flooring:'Flooring / paint bundle', multi:'Multi-unit portfolio day' };
  function updateBuilder(){
    var service = selected('pp-service') || 'turnover';
    var urgency = selected('pp-urgency') || 'standard';
    var units = Number(selected('pp-units') || 1);
    var condition = Number(selected('pp-condition') || 2);
    var occupied = selected('pp-occupied') || 'vacant';
    var multiplier = 1 + (condition - 1) * .22 + Math.max(0, units - 1) * .68;
    if(urgency === 'rush') multiplier += .18;
    if(urgency === 'emergency') multiplier += .35;
    if(occupied === 'occupied') multiplier += .08;
    var low = serviceBase[service] * multiplier;
    var high = low * (service === 'multi' ? 1.55 : 1.42);
    var priority = urgency === 'emergency' || condition >= 4 ? 'High' : urgency === 'rush' || condition === 3 ? 'Medium' : 'Standard';
    var days = urgency === 'emergency' ? 'same day triage' : urgency === 'rush' ? '24-72 hr start' : units > 1 ? '3-7 business days' : '2-5 business days';
    var priorityClass = priority === 'High' ? 'priority-high' : priority === 'Medium' ? 'priority-med' : 'priority-low';
    var priorityEl = byId('pp-priority');
    if(priorityEl){ priorityEl.className = priorityClass; priorityEl.textContent = priority; }
    setText('pp-range', money(low) + ' - ' + money(high));
    setText('pp-window', days);
    setText('pp-summary', serviceNames[service] + ' for ' + units + ' unit' + (units>1?'s':'') + ', ' + occupied + ', condition level ' + condition + '. Suggested priority: ' + priority + '. Planning range: ' + money(low) + ' - ' + money(high) + '.');
    var msg = 'Hi ELF, I need property help. Scope: ' + serviceNames[service] + '. Units: ' + units + '. Urgency: ' + urgency + '. Occupancy: ' + occupied + '. Condition: ' + condition + '. Please send next steps.';
    var wa = byId('pp-whatsapp');
    if(wa) wa.href = 'https://wa.me/13235475086?text=' + encodeURIComponent(msg);
  }
  ['pp-service','pp-urgency','pp-units','pp-condition','pp-occupied'].forEach(function(id){ var el=byId(id); if(el) el.addEventListener('input', updateBuilder); });
  updateBuilder();

  document.querySelectorAll('[data-copy-summary]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var summary = byId('pp-summary') ? byId('pp-summary').textContent : '';
      if(navigator.clipboard && summary){ navigator.clipboard.writeText(summary); btn.textContent = 'Copied'; setTimeout(function(){ btn.textContent = 'Copy brief'; }, 1400); }
    });
  });

  var tabButtons = document.querySelectorAll('[data-pro-tab]');
  var lists = document.querySelectorAll('[data-pro-list]');
  tabButtons.forEach(function(button){
    button.addEventListener('click', function(){
      var key = button.getAttribute('data-pro-tab');
      tabButtons.forEach(function(item){ item.classList.toggle('active', item === button); });
      lists.forEach(function(list){ list.classList.toggle('hide', list.getAttribute('data-pro-list') !== key); });
      updateChecklist();
    });
  });
  function updateChecklist(){
    var active = document.querySelector('[data-pro-list]:not(.hide)');
    if(!active) return;
    var checks = active.querySelectorAll('input[type="checkbox"]');
    var done = active.querySelectorAll('input[type="checkbox"]:checked').length;
    var percent = checks.length ? Math.round(done / checks.length * 100) : 0;
    var bar = document.querySelector('[data-progress-bar]');
    var label = document.querySelector('[data-progress-label]');
    if(bar) bar.style.width = percent + '%';
    if(label) label.textContent = percent + '% ready';
  }
  document.addEventListener('change', function(e){ if(e.target.matches('[data-pro-list] input[type="checkbox"]')) updateChecklist(); });
  updateChecklist();

  document.querySelectorAll('[data-portfolio-input]').forEach(function(input){ input.addEventListener('input', updatePortfolio); });
  function updatePortfolio(){
    var doors = Number((byId('pp-doors')||{}).value || 12);
    var age = Number((byId('pp-age')||{}).value || 12);
    var turns = Math.max(1, Math.round(doors * .22));
    var reserve = Math.round((doors * 55) + (age * 18));
    var visit = doors > 35 ? 'biweekly account route' : doors > 12 ? 'monthly route + rush slots' : 'on-demand with priority slots';
    setText('pp-turns', turns + ' turns / year');
    setText('pp-reserve', money(reserve) + ' / mo');
    setText('pp-route', visit);
  }
  updatePortfolio();

  function updateMobileActions(){
    document.body.classList.toggle('show-mobile-actions', window.scrollY > 360);
  }
  window.addEventListener('scroll', updateMobileActions, { passive: true });
  window.addEventListener('resize', updateMobileActions);
  updateMobileActions();
})();
