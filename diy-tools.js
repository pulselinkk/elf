// ============================================================
// ELF HOME SERVICES - DIY INTERACTIVE TOOLS
// ============================================================

(function(){
  var root = document.querySelector('.diy-command');
  if (!root) return;

  var projects = [
    {
      id: 'tv-mount',
      title: 'Hang a TV mount',
      level: 'Beginner',
      category: 'mounting',
      minutes: 45,
      savings: 140,
      risk: 2,
      tools: 'Stud finder, level, drill',
      summary: 'Best when you can hit studs and have a helper for lifting. Avoid drywall-only anchors.',
      steps: [
        'Locate two studs and mark their centers.',
        'Hold the wall plate level and mark pilot holes.',
        'Drill pilot holes into studs only.',
        'Drive lag bolts snug without over-tightening.',
        'Attach TV brackets and lift with a helper.',
        'Check tilt, cable clearance, and final level.'
      ]
    },
    {
      id: 'toilet-flapper',
      title: 'Replace a toilet flapper',
      level: 'Beginner',
      category: 'plumbing',
      minutes: 10,
      savings: 95,
      risk: 1,
      tools: 'Hands only',
      summary: 'A fast fix for most running toilets. Shut off the toilet stop before opening the tank.',
      steps: [
        'Shut off the toilet water supply.',
        'Flush to drain most water from the tank.',
        'Detach the old chain and flapper ears.',
        'Install the new flapper on the overflow pipe.',
        'Reconnect chain with slight slack.',
        'Turn water on and test three flushes.'
      ]
    },
    {
      id: 'faucet-aerator',
      title: 'Replace a faucet aerator',
      level: 'Beginner',
      category: 'plumbing',
      minutes: 5,
      savings: 85,
      risk: 1,
      tools: 'Hand or pliers',
      summary: 'DFW hard water clogs aerators constantly. Wrap pliers with tape to avoid scratching chrome.',
      steps: [
        'Unscrew the aerator from the faucet tip.',
        'Note the washer and screen order.',
        'Soak parts in vinegar or replace them.',
        'Rinse debris from the faucet tip.',
        'Reinstall hand-tight, then test flow.'
      ]
    },
    {
      id: 'drywall-patch',
      title: 'Patch a small drywall hole',
      level: 'Beginner',
      category: 'drywall',
      minutes: 45,
      savings: 180,
      risk: 2,
      tools: 'Putty knife, joint compound, sandpaper',
      summary: 'Great for small dents and holes. Texture matching is the part that separates clean from obvious.',
      steps: [
        'Trim loose paper and clean the hole edge.',
        'Apply mesh patch or backing as needed.',
        'Spread compound wider than the repair.',
        'Let dry fully, then sand smooth.',
        'Apply a thinner second coat and feather edges.',
        'Texture, prime, and paint.'
      ]
    },
    {
      id: 'bathtub-caulk',
      title: 'Caulk a bathtub',
      level: 'Intermediate',
      category: 'plumbing',
      minutes: 75,
      savings: 180,
      risk: 3,
      tools: 'Caulk gun, tape, scraper',
      summary: 'Worth doing if the joint is dry and clean. Do not caulk over mold or wet backer material.',
      steps: [
        'Remove all old caulk with a scraper.',
        'Clean the joint with alcohol and let dry.',
        'Tape clean parallel lines.',
        'Apply one steady bead of silicone.',
        'Smooth once with a wet finger or tool.',
        'Remove tape immediately and cure 24 hours.'
      ]
    },
    {
      id: 'deadbolt-rekey',
      title: 'Re-key a deadbolt',
      level: 'Intermediate',
      category: 'hardware',
      minutes: 30,
      savings: 75,
      risk: 2,
      tools: 'Re-key kit',
      summary: 'Good for SmartKey locks or patient homeowners. Test the cylinder before reinstalling.',
      steps: [
        'Remove the lock from the door.',
        'Open the cylinder following kit instructions.',
        'Replace pins or use SmartKey reset steps.',
        'Test the new key repeatedly.',
        'Reinstall the deadbolt and check throw alignment.'
      ]
    },
    {
      id: 'smart-thermostat',
      title: 'Install a smart thermostat',
      level: 'Intermediate',
      category: 'electrical',
      minutes: 60,
      savings: 160,
      risk: 4,
      tools: 'Screwdriver, labels, drill',
      summary: 'Only DIY if you can identify low-voltage HVAC wires and have a C-wire or adapter plan.',
      steps: [
        'Turn HVAC power off at the breaker.',
        'Photograph existing wiring before removal.',
        'Label every wire by terminal letter.',
        'Mount the new base level.',
        'Connect wires to matching terminals.',
        'Restore power and configure the app.'
      ]
    },
    {
      id: 'light-fixture',
      title: 'Replace a light fixture',
      level: 'Intermediate',
      category: 'electrical',
      minutes: 45,
      savings: 150,
      risk: 4,
      tools: 'Voltage tester, screwdriver',
      summary: 'Do this only with breaker off and voltage verified. Stop if wiring colors are unclear.',
      steps: [
        'Turn off the breaker, not just the switch.',
        'Verify wires are dead with a tester.',
        'Support fixture while disconnecting wires.',
        'Connect hot, neutral, and ground correctly.',
        'Mount fixture to the box or bracket.',
        'Restore power and test.'
      ]
    },
    {
      id: 'sink-clog',
      title: 'Unclog a kitchen sink',
      level: 'Beginner',
      category: 'plumbing',
      minutes: 20,
      savings: 125,
      risk: 2,
      tools: 'Plunger, bucket',
      summary: 'Start with plunging and the P-trap. Skip harsh drain chemicals; they rarely solve the real problem.',
      steps: [
        'Remove standing debris from the drain.',
        'Plunge with a cup plunger for 30 seconds.',
        'Place a bucket under the P-trap.',
        'Remove and clean the trap by hand.',
        'Reassemble and check for leaks.',
        'Run hot water for several minutes.'
      ]
    },
    {
      id: 'fence-stain',
      title: 'Stain a wood fence section',
      level: 'Intermediate',
      category: 'outdoor',
      minutes: 240,
      savings: 350,
      risk: 3,
      tools: 'Pump sprayer, stain brush, drop cloths',
      summary: 'Great weekend project. In DFW heat, work early and stain only dry wood.',
      steps: [
        'Pressure wash gently and let dry 48 hours.',
        'Cover plants, concrete, and hardware.',
        'Stir stain thoroughly.',
        'Spray a small section evenly.',
        'Back-brush within one minute.',
        'Apply a second thin coat if needed.'
      ]
    }
  ];

  var tools = [
    ['Cordless drill + bit set', 160],
    ['Electronic stud finder', 35],
    ['4 ft level + torpedo level', 30],
    ['25 ft tape measure', 15],
    ['Putty knife set', 15],
    ['Steel rod caulk gun', 15],
    ['Non-contact voltage tester', 15],
    ['Adjustable wrench set', 30],
    ['Pliers set', 30],
    ['Utility knife + blades', 10],
    ['Cup + flange plunger', 20],
    ['Headlamp', 25]
  ];

  var currentFilter = 'all';
  var searchTerm = '';

  function money(value) {
    return '$' + value.toLocaleString('en-US');
  }

  function minutesLabel(value) {
    if (value < 60) return value + ' min';
    if (value === 60) return '1 hr';
    return Math.round(value / 60 * 10) / 10 + ' hr';
  }

  function projectMatches(project) {
    var filterOk = currentFilter === 'all' ||
      project.category === currentFilter ||
      project.level.toLowerCase() === currentFilter;
    var haystack = (project.title + ' ' + project.summary + ' ' + project.tools + ' ' + project.category).toLowerCase();
    return filterOk && haystack.indexOf(searchTerm) !== -1;
  }

  function renderProjects() {
    var grid = document.getElementById('diy-project-grid');
    var empty = document.getElementById('diy-empty');
    if (!grid) return;
    var list = projects.filter(projectMatches);
    grid.innerHTML = list.map(function(project){
      var riskLabel = project.risk <= 2 ? 'Low' : project.risk === 3 ? 'Medium' : 'High';
      var text = encodeURIComponent('Hi ELF, I am looking at the DIY guide for: ' + project.title + '. Can you help if I decide not to DIY it?');
      return '' +
        '<article class="diy-project-card" data-project-card="' + project.id + '">' +
          '<div class="diy-card-tags"><span>' + project.level + '</span><span>' + project.category + '</span></div>' +
          '<h3>' + project.title + '</h3>' +
          '<p>' + project.summary + '</p>' +
          '<div class="diy-card-meta">' +
            '<div><span>Time</span><strong>' + minutesLabel(project.minutes) + '</strong></div>' +
            '<div><span>Saves</span><strong>' + money(project.savings) + '</strong></div>' +
            '<div><span>Risk</span><strong>' + riskLabel + '</strong></div>' +
          '</div>' +
          '<div class="diy-card-actions">' +
            '<button type="button" data-load-checklist="' + project.id + '">Use checklist</button>' +
            '<a href="https://wa.me/13235475086?text=' + text + '" target="_blank" rel="noopener">Ask ELF</a>' +
          '</div>' +
        '</article>';
    }).join('');
    empty.classList.toggle('show', list.length === 0);
  }

  function setupTabs() {
    var tabs = root.querySelectorAll('[data-diy-tab]');
    var panels = root.querySelectorAll('[data-diy-panel]');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        var key = tab.getAttribute('data-diy-tab');
        tabs.forEach(function(item){ item.classList.toggle('active', item === tab); });
        panels.forEach(function(panel){ panel.classList.toggle('active', panel.getAttribute('data-diy-panel') === key); });
      });
    });
  }

  function setupFilters() {
    var search = document.getElementById('diy-search');
    var filters = root.querySelectorAll('[data-filter]');
    if (search) {
      search.addEventListener('input', function(){
        searchTerm = search.value.trim().toLowerCase();
        renderProjects();
      });
    }
    filters.forEach(function(button){
      button.addEventListener('click', function(){
        currentFilter = button.getAttribute('data-filter');
        filters.forEach(function(item){ item.classList.toggle('active', item === button); });
        renderProjects();
      });
    });
  }

  function riskCopy(score) {
    if (score <= 3) {
      return ['DIY-friendly', 'This looks reasonable for a careful homeowner. Read all steps first, prep the work area, and stop if conditions change.'];
    }
    if (score <= 6) {
      return ['Proceed carefully', 'You can still DIY this, but the margin for error is smaller. Take photos before disassembly, avoid rushing, and set a clear stop point.'];
    }
    return ['Call a pro', 'The risk is high enough that a mistake could cost more than the repair. This is a good moment to get a quote before opening walls, wiring, or plumbing.'];
  }

  function updateRisk() {
    var type = document.getElementById('risk-project');
    var comfort = document.getElementById('risk-comfort');
    var label = document.getElementById('risk-comfort-label');
    var result = document.getElementById('diy-risk-result');
    if (!type || !comfort || !result) return;
    var comfortValue = parseInt(comfort.value, 10);
    var base = { wall: 2, plumbing: 3, electrical: 5, mounting: 2, outdoor: 3 }[type.value] || 2;
    var score = base + (5 - comfortValue);
    ['water', 'power', 'structure'].forEach(function(id){
      var input = document.getElementById('risk-' + id);
      if (input && input.checked) score += id === 'power' ? 4 : 3;
    });
    var comfortLabels = ['Nervous', 'Cautious', 'Steady', 'Capable', 'Confident'];
    label.textContent = comfortLabels[comfortValue - 1];
    var copy = riskCopy(score);
    result.innerHTML = '<div class="diy-risk-score">' + score + '/12</div><h3>' + copy[0] + '</h3><p>' + copy[1] + '</p><a class="btn btn-primary btn-icon-right" href="quote.html">Get a second opinion</a>';
  }

  function setupRisk() {
    ['risk-project', 'risk-comfort', 'risk-water', 'risk-power', 'risk-structure'].forEach(function(id){
      var input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('input', updateRisk);
      input.addEventListener('change', updateRisk);
    });
    updateRisk();
  }

  function renderTools() {
    var list = document.getElementById('diy-tool-list');
    if (!list) return;
    var owned = JSON.parse(localStorage.getItem('elfDiyTools') || '[]');
    list.innerHTML = tools.map(function(tool, index){
      var checked = owned.indexOf(index) !== -1 ? ' checked' : '';
      return '<label class="diy-tool-item"><input type="checkbox" data-tool-index="' + index + '"' + checked + '/><div><strong>' + tool[0] + '</strong><span>Most useful starter-kit item</span></div><strong>' + money(tool[1]) + '</strong></label>';
    }).join('');
    updateToolSummary();
  }

  function updateToolSummary() {
    var checks = root.querySelectorAll('[data-tool-index]');
    var owned = [];
    var remaining = 0;
    checks.forEach(function(check){
      var index = parseInt(check.getAttribute('data-tool-index'), 10);
      if (check.checked) owned.push(index);
      else remaining += tools[index][1];
    });
    localStorage.setItem('elfDiyTools', JSON.stringify(owned));
    var total = document.getElementById('diy-tool-total');
    var copy = document.getElementById('diy-tool-copy');
    var meter = document.getElementById('diy-tool-meter');
    var pct = Math.round((owned.length / tools.length) * 100);
    if (total) total.textContent = money(remaining);
    if (copy) copy.textContent = owned.length + ' of ' + tools.length + ' starter tools owned. Estimated remaining budget: ' + money(remaining) + '.';
    if (meter) meter.style.width = pct + '%';
  }

  function setupTools() {
    renderTools();
    root.addEventListener('change', function(event){
      if (event.target && event.target.matches('[data-tool-index]')) updateToolSummary();
    });
  }

  function renderChecklistOptions() {
    var select = document.getElementById('checklist-project');
    if (!select) return;
    select.innerHTML = projects.map(function(project){
      return '<option value="' + project.id + '">' + project.title + '</option>';
    }).join('');
  }

  function selectedProject() {
    var select = document.getElementById('checklist-project');
    var id = select ? select.value : projects[0].id;
    return projects.filter(function(project){ return project.id === id; })[0] || projects[0];
  }

  function checklistKey(projectId) {
    return 'elfDiyChecklist:' + projectId;
  }

  function renderChecklist() {
    var project = selectedProject();
    var wrap = document.getElementById('diy-checklist');
    if (!wrap) return;
    var done = JSON.parse(localStorage.getItem(checklistKey(project.id)) || '[]');
    wrap.innerHTML = project.steps.map(function(step, index){
      var checked = done.indexOf(index) !== -1;
      return '<label class="diy-checkline' + (checked ? ' done' : '') + '"><input type="checkbox" data-check-step="' + index + '"' + (checked ? ' checked' : '') + '/><span>' + step + '</span></label>';
    }).join('');
    updateChecklistProgress();
  }

  function updateChecklistProgress() {
    var project = selectedProject();
    var checks = root.querySelectorAll('[data-check-step]');
    var done = [];
    checks.forEach(function(check){
      var line = check.closest('.diy-checkline');
      line.classList.toggle('done', check.checked);
      if (check.checked) done.push(parseInt(check.getAttribute('data-check-step'), 10));
    });
    localStorage.setItem(checklistKey(project.id), JSON.stringify(done));
    var pct = checks.length ? Math.round((done.length / checks.length) * 100) : 0;
    var bar = document.getElementById('checklist-progress-bar');
    var copy = document.getElementById('checklist-progress-copy');
    if (bar) bar.style.width = pct + '%';
    if (copy) copy.textContent = pct + '% complete for ' + project.title;
  }

  function setupChecklist() {
    renderChecklistOptions();
    renderChecklist();
    var select = document.getElementById('checklist-project');
    if (select) select.addEventListener('change', renderChecklist);
    root.addEventListener('change', function(event){
      if (event.target && event.target.matches('[data-check-step]')) updateChecklistProgress();
    });
    root.addEventListener('click', function(event){
      var button = event.target.closest('[data-load-checklist]');
      if (!button) return;
      var select = document.getElementById('checklist-project');
      if (select) {
        select.value = button.getAttribute('data-load-checklist');
        renderChecklist();
      }
      var checklistTab = root.querySelector('[data-diy-tab="checklist"]');
      if (checklistTab) checklistTab.click();
    });
  }

  setupTabs();
  setupFilters();
  renderProjects();
  setupRisk();
  setupTools();
  setupChecklist();
})();
