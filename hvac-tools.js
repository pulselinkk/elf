// ============================================================
// ELF HOME SERVICES - HVAC LIBRARY APP
// ============================================================

(function(){
  var root = document.querySelector('.hvac-command');
  if (!root) return;

  var topics = [
    {
      id: 'cooling-load',
      title: 'Why DFW AC systems work so hard',
      category: 'Cooling',
      season: 'summer',
      urgency: 'watch',
      read: '6 min',
      takeaway: 'North Texas heat, attic temperatures, humidity, and long run cycles make cooling equipment age faster than in mild climates.',
      bullets: ['Long cycles are normal on 100F days if the system still holds temperature.', 'A sudden loss of capacity is not normal.', 'Attic duct leakage can make a good system feel undersized.'],
      proFlag: 'Call when supply air gets warm, runtime jumps sharply, or the home cannot recover at night.'
    },
    {
      id: 'capacitor',
      title: 'Capacitors and contactors',
      category: 'Electrical',
      season: 'summer',
      urgency: 'soon',
      read: '4 min',
      takeaway: 'Small electrical starter parts are a common reason an outdoor unit hums, clicks, or will not start on peak summer days.',
      bullets: ['Weak capacitors often fail during the first major heat wave.', 'Buzzing, repeated clicking, or fan not spinning needs service.', 'These parts are not homeowner-safe inside the electrical cabinet.'],
      proFlag: 'Turn the system off if the outdoor unit hums without starting or trips the breaker.'
    },
    {
      id: 'drain-line',
      title: 'Condensate drain line clogs',
      category: 'Humidity',
      season: 'summer',
      urgency: 'soon',
      read: '5 min',
      takeaway: 'DFW humidity makes drain lines work hard; a clog can shut the system down or cause ceiling damage near the indoor unit.',
      bullets: ['Water near the indoor unit is never normal.', 'Float switches may stop cooling before water overflows.', 'Annual drain cleaning is cheap compared with sheetrock repair.'],
      proFlag: 'Call quickly when water appears, a ceiling stain forms, or the system shuts off with a full drain pan.'
    },
    {
      id: 'airflow',
      title: 'Airflow and filters',
      category: 'Airflow',
      season: 'year',
      urgency: 'watch',
      read: '7 min',
      takeaway: 'Restricted airflow can freeze the coil, stress the blower, lower comfort, and make a clean system behave like a failing one.',
      bullets: ['MERV 8-11 is a practical range for many homes.', 'A filter that is too restrictive can reduce airflow.', 'Closed vents do not usually save money; they can raise static pressure.'],
      proFlag: 'Call when a clean filter does not restore airflow or rooms stay uneven after vents are open.'
    },
    {
      id: 'refrigerant',
      title: 'R-22, R-410A, and A2L refrigerants',
      category: 'Refrigerant',
      season: 'year',
      urgency: 'soon',
      read: '8 min',
      takeaway: 'The refrigerant type changes repair economics, especially if an older R-22 system has a leak.',
      bullets: ['R-22 systems are usually old enough that major repairs deserve hard math.', 'R-410A service will remain available, but new equipment is shifting.', 'A2L systems require trained installers and correct parts.'],
      proFlag: 'Refrigerant work requires certified HVAC service. Do not open or modify sealed lines.'
    },
    {
      id: 'ducts',
      title: 'Duct leakage and hot attics',
      category: 'Airflow',
      season: 'summer',
      urgency: 'watch',
      read: '6 min',
      takeaway: 'A leaky duct in a 130F attic can waste conditioned air before it ever reaches the room.',
      bullets: ['Uneven rooms often come from duct routing, leakage, or insulation gaps.', 'Return leaks can pull hot attic air into the system.', 'Duct upgrades can matter as much as equipment upgrades.'],
      proFlag: 'Call when one area is consistently 4F+ different or dust collects heavily around vents.'
    },
    {
      id: 'heat-pump',
      title: 'Heat pumps in North Texas',
      category: 'Heating',
      season: 'winter',
      urgency: 'watch',
      read: '6 min',
      takeaway: 'Heat pumps can work well in DFW, but freeze events and auxiliary heat settings change comfort and power use.',
      bullets: ['Cooler supply air is normal compared with gas heat.', 'Aux heat can raise bills quickly during cold snaps.', 'Defrost cycles can create steam at the outdoor unit.'],
      proFlag: 'Call when the outdoor unit ices heavily, aux heat runs constantly, or the breaker trips.'
    },
    {
      id: 'gas-furnace',
      title: 'Gas furnace safety signals',
      category: 'Safety',
      season: 'winter',
      urgency: 'urgent',
      read: '5 min',
      takeaway: 'Gas heat needs special caution around combustion, venting, flame color, and carbon monoxide risk.',
      bullets: ['A steady blue flame is expected on many gas furnaces.', 'Yellow flame, soot, gas smell, or repeated rollout is serious.', 'Carbon monoxide alarms should be active near sleeping areas.'],
      proFlag: 'Shut the system down and call a licensed pro or utility for gas smell, soot, or suspected carbon monoxide.'
    },
    {
      id: 'thermostat',
      title: 'Thermostats and controls',
      category: 'Controls',
      season: 'year',
      urgency: 'watch',
      read: '4 min',
      takeaway: 'Thermostat settings, batteries, wiring, and sensor placement can mimic bigger HVAC problems.',
      bullets: ['Direct sunlight can misread room temperature.', 'Weak batteries can cause intermittent control problems.', 'Smart thermostats need correct system configuration.'],
      proFlag: 'Call when equipment does not respond after settings and batteries are verified.'
    },
    {
      id: 'replace-math',
      title: 'Repair vs. replace decision rules',
      category: 'Planning',
      season: 'year',
      urgency: 'soon',
      read: '7 min',
      takeaway: 'Age, refrigerant, repair cost, repeat failures, and comfort goals determine whether a repair still makes sense.',
      bullets: ['Under 10 years old usually favors repair if the failure is minor.', 'Major failures after 12-15 years deserve replacement pricing.', 'R-22 leaks often push the math toward replacement.'],
      proFlag: 'Get a second opinion for compressor, coil, or full system replacement decisions.'
    },
    {
      id: 'freeze',
      title: 'Freeze and storm preparation',
      category: 'Weather',
      season: 'storm',
      urgency: 'soon',
      read: '5 min',
      takeaway: 'Short Texas freezes can expose weak heat settings, blocked vents, attic duct issues, and neglected filters.',
      bullets: ['Replace dirty filters before cold fronts.', 'Keep supply and return paths open.', 'Confirm heat mode before the coldest night.'],
      proFlag: 'Call when heat will not start, breakers trip, or the system smells hot after a long idle period.'
    },
    {
      id: 'maintenance',
      title: 'The maintenance rhythm',
      category: 'Maintenance',
      season: 'year',
      urgency: 'watch',
      read: '8 min',
      takeaway: 'Small recurring tasks protect airflow, drainage, coils, and controls before peak-weather failures.',
      bullets: ['Filter checks are the highest-value homeowner task.', 'Outdoor clearance protects heat rejection.', 'Professional spring and fall checks catch weak parts early.'],
      proFlag: 'Schedule service before peak heat if the system is 8+ years old or struggled last season.'
    }
  ];

  var parts = {
    condenser: ['Outdoor condenser', 'Rejects heat outdoors during cooling. Watch for blocked airflow, fan noise, buzzing, and breaker trips.'],
    lines: ['Refrigerant lines', 'Move refrigerant between outdoor and indoor equipment. Frost, oil stains, or hissing need licensed HVAC service.'],
    coil: ['Indoor coil', 'Absorbs indoor heat and removes humidity. Ice often points to airflow restriction or low refrigerant.'],
    blower: ['Blower and air handler', 'Moves air through the filter, coil, ducts, and rooms. Weak airflow can stress the whole system.'],
    ducts: ['Ductwork', 'Distributes conditioned air. Leaks in hot attics can create uneven rooms and high bills.'],
    thermostat: ['Thermostat', 'Controls calls for cooling and heating. Placement, batteries, and configuration matter.']
  };

  var symptoms = [
    { id: 'warm-air', label: 'Warm air in cooling', score: 3, causes: ['low refrigerant', 'compressor issue', 'dirty coil'], action: 'Turn cooling off if ice appears. Check filter, then schedule licensed HVAC service.' },
    { id: 'water', label: 'Water near indoor unit', score: 3, causes: ['clogged drain', 'full pan', 'frozen coil thawing'], action: 'Protect the area from water, stop the system if overflow continues, and clear or service the drain.' },
    { id: 'breaker', label: 'Breaker trips', score: 5, causes: ['motor fault', 'short', 'compressor issue'], action: 'Do not keep resetting the breaker. Shut the system off and call a pro.' },
    { id: 'ice', label: 'Ice on coil or lines', score: 4, causes: ['restricted airflow', 'low refrigerant', 'dirty coil'], action: 'Switch cooling off and fan on only if safe. Service is needed before restarting cooling.' },
    { id: 'short-cycle', label: 'Starts and stops fast', score: 3, causes: ['thermostat issue', 'oversized system', 'low refrigerant'], action: 'Check thermostat placement and filter. Schedule diagnostics if it continues.' },
    { id: 'gas-smell', label: 'Gas smell or yellow flame', score: 8, causes: ['combustion issue', 'gas leak', 'venting problem'], action: 'Shut down heat, leave the area if gas smell is present, and call the utility or licensed service.' },
    { id: 'high-bill', label: 'Bill jumped 30%+', score: 2, causes: ['duct leak', 'dirty coil', 'aging system'], action: 'Compare weather and usage, inspect filter and vents, then request efficiency diagnostics.' },
    { id: 'uneven', label: 'Uneven rooms', score: 2, causes: ['duct imbalance', 'return issue', 'attic leakage'], action: 'Open vents, check blocked returns, and document room temperature differences.' }
  ];

  var maintenance = {
    spring: [
      'Replace or inspect the filter before heavy cooling starts.',
      'Clear 24 inches around the outdoor unit.',
      'Confirm the condensate drain is open and pan is dry.',
      'Schedule cooling tune-up before the first long heat wave.',
      'Check thermostat batteries and cooling mode.'
    ],
    summer: [
      'Check filter monthly during high runtime.',
      'Keep grass clippings and leaves out of the condenser.',
      'Watch for water near the indoor unit.',
      'Record rooms that stay 4F+ warmer than the thermostat area.',
      'Avoid repeated breaker resets.'
    ],
    fall: [
      'Run heat briefly before the first cold night.',
      'Replace filter after summer dust load.',
      'Check carbon monoxide alarms near sleeping areas.',
      'Schedule heating safety check for gas furnaces.',
      'Clear return vents and supply registers.'
    ],
    winter: [
      'Confirm heat mode before freeze warnings.',
      'Keep interior doors open enough for air return paths.',
      'Replace dirty filters before long heat runs.',
      'Watch heat pump outdoor icing during freezing rain.',
      'Call quickly for gas smell, soot, or yellow flame.'
    ]
  };

  var glossary = [
    ['SEER2', 'Cooling efficiency rating based on newer test conditions.', 'Cooling'],
    ['EER', 'Peak cooling efficiency at hotter outdoor conditions.', 'Cooling'],
    ['AFUE', 'Gas furnace fuel efficiency rating.', 'Heating'],
    ['HSPF2', 'Heat pump heating efficiency rating.', 'Heating'],
    ['Capacitor', 'Electrical component that helps motors start and run.', 'Electrical'],
    ['Contactor', 'High-voltage switch that turns outdoor equipment on.', 'Electrical'],
    ['Evaporator coil', 'Indoor coil that absorbs heat and removes humidity.', 'Cooling'],
    ['Condenser coil', 'Outdoor coil that releases heat.', 'Cooling'],
    ['Static pressure', 'Resistance to airflow inside ducts and equipment.', 'Airflow'],
    ['Return air', 'Air pulled from the house back to the system.', 'Airflow'],
    ['Supply air', 'Conditioned air delivered to rooms.', 'Airflow'],
    ['A2L', 'Mildly flammable lower-GWP refrigerant classification.', 'Refrigerant'],
    ['R-22', 'Older refrigerant phased out for new production.', 'Refrigerant'],
    ['R-410A', 'Common refrigerant for many 2010-2024 residential systems.', 'Refrigerant'],
    ['Condensate', 'Water removed from indoor air during cooling.', 'Humidity'],
    ['Short cycling', 'Rapid starts and stops that stress equipment.', 'Controls'],
    ['Aux heat', 'Backup electric heat used by many heat pump systems.', 'Heating'],
    ['Heat exchanger', 'Gas furnace component that separates combustion from indoor air.', 'Safety']
  ];

  var state = {
    category: 'All',
    search: '',
    season: 'all',
    urgency: 'all',
    glossaryTag: 'All',
    saved: readSaved()
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function(char){
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function money(value) {
    return '$' + Math.round(value).toLocaleString('en-US');
  }

  function readSaved() {
    try {
      return JSON.parse(localStorage.getItem('elfHvacSaved') || '[]');
    } catch (error) {
      return [];
    }
  }

  function writeSaved() {
    localStorage.setItem('elfHvacSaved', JSON.stringify(state.saved));
  }

  function setupTabs() {
    var tabs = root.querySelectorAll('[data-hvac-tab]');
    var panels = root.querySelectorAll('[data-hvac-panel]');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        var key = tab.getAttribute('data-hvac-tab');
        tabs.forEach(function(item){ item.classList.toggle('active', item === tab); });
        panels.forEach(function(panel){ panel.classList.toggle('active', panel.getAttribute('data-hvac-panel') === key); });
      });
    });
  }

  function getCategories() {
    var set = {};
    topics.forEach(function(topic){ set[topic.category] = true; });
    return ['All'].concat(Object.keys(set).sort());
  }

  function topicMatches(topic) {
    var query = state.search.trim().toLowerCase();
    var text = [topic.title, topic.category, topic.takeaway, topic.bullets.join(' '), topic.proFlag].join(' ').toLowerCase();
    var categoryOk = state.category === 'All' || topic.category === state.category;
    var seasonOk = state.season === 'all' || topic.season === state.season;
    var urgencyOk = state.urgency === 'all' || topic.urgency === state.urgency;
    var searchOk = !query || text.indexOf(query) !== -1;
    return categoryOk && seasonOk && urgencyOk && searchOk;
  }

  function renderCategories() {
    var list = byId('hvac-category-list');
    if (!list) return;
    list.innerHTML = getCategories().map(function(category){
      var count = category === 'All' ? topics.length : topics.filter(function(topic){ return topic.category === category; }).length;
      return '<button type="button" class="' + (state.category === category ? 'active' : '') + '" data-hvac-category="' + esc(category) + '"><span>' + esc(category) + '</span><strong>' + count + '</strong></button>';
    }).join('');
  }

  function renderCards() {
    var grid = byId('hvac-library-cards');
    var count = byId('hvac-match-count');
    if (!grid) return;
    var matches = topics.filter(topicMatches);
    if (count) count.textContent = matches.length;
    if (!matches.length) {
      grid.innerHTML = '<div class="hvac-empty">No matching files. Try another season, urgency, or search term.</div>';
      renderDetail(null);
      return;
    }
    grid.innerHTML = matches.map(function(topic){
      var saved = state.saved.indexOf(topic.id) !== -1;
      return '<button type="button" class="hvac-topic-card" data-topic-id="' + topic.id + '">' +
        '<span class="hvac-topic-kicker">' + esc(topic.category) + ' / ' + esc(topic.urgency) + '</span>' +
        '<h3>' + esc(topic.title) + '</h3>' +
        '<p>' + esc(topic.takeaway) + '</p>' +
        '<div class="hvac-topic-meta"><span>' + esc(topic.season) + '</span><span>' + esc(topic.read) + '</span><span>' + (saved ? 'Saved' : 'Library') + '</span></div>' +
      '</button>';
    }).join('');
    renderDetail(matches[0]);
  }

  function renderDetail(topic) {
    var detail = byId('hvac-detail');
    if (!detail) return;
    if (!topic) {
      detail.innerHTML = '';
      return;
    }
    var saved = state.saved.indexOf(topic.id) !== -1;
    detail.innerHTML = '<div class="hvac-detail-head">' +
      '<div><span class="hvac-topic-kicker">' + esc(topic.category) + ' file</span><h3>' + esc(topic.title) + '</h3></div>' +
      '<button type="button" class="hvac-save" data-save-topic="' + topic.id + '">' + (saved ? 'Saved' : 'Save file') + '</button>' +
      '</div>' +
      '<p>' + esc(topic.takeaway) + '</p>' +
      '<div class="hvac-detail-list">' + topic.bullets.map(function(item){ return '<div><span></span><p>' + esc(item) + '</p></div>'; }).join('') + '</div>' +
      '<div class="hvac-pro-flag"><strong>Pro flag</strong><p>' + esc(topic.proFlag) + '</p></div>';
  }

  function setupLibrary() {
    renderCategories();
    renderCards();

    var search = byId('hvac-search');
    var season = byId('hvac-season');
    var urgency = byId('hvac-urgency');
    if (search) search.addEventListener('input', function(){
      state.search = search.value;
      if (state.search.trim()) {
        state.category = 'All';
        renderCategories();
      }
      renderCards();
    });
    if (season) season.addEventListener('change', function(){ state.season = season.value; renderCards(); });
    if (urgency) urgency.addEventListener('change', function(){ state.urgency = urgency.value; renderCards(); });

    root.addEventListener('click', function(event){
      var category = event.target.closest('[data-hvac-category]');
      if (category) {
        state.category = category.getAttribute('data-hvac-category');
        renderCategories();
        renderCards();
        return;
      }
      var card = event.target.closest('[data-topic-id]');
      if (card) {
        var id = card.getAttribute('data-topic-id');
        renderDetail(topics.filter(function(topic){ return topic.id === id; })[0]);
        return;
      }
      var save = event.target.closest('[data-save-topic]');
      if (save) {
        var saveId = save.getAttribute('data-save-topic');
        var index = state.saved.indexOf(saveId);
        if (index === -1) state.saved.push(saveId);
        else state.saved.splice(index, 1);
        writeSaved();
        renderCards();
        renderDetail(topics.filter(function(topic){ return topic.id === saveId; })[0]);
      }
    });
  }

  function setupSystemMap() {
    var detail = byId('hvac-map-detail');
    var nodes = root.querySelectorAll('[data-hvac-part]');
    if (!detail || !nodes.length) return;
    function setPart(part) {
      var data = parts[part];
      if (!data) return;
      nodes.forEach(function(node){ node.classList.toggle('active', node.getAttribute('data-hvac-part') === part); });
      detail.innerHTML = '<span class="hvac-topic-kicker">System map</span><h3>' + esc(data[0]) + '</h3><p>' + esc(data[1]) + '</p>';
    }
    nodes.forEach(function(node){
      node.addEventListener('click', function(){ setPart(node.getAttribute('data-hvac-part')); });
    });
    setPart('condenser');
  }

  function setupDiagnose() {
    var grid = byId('hvac-symptoms');
    var result = byId('hvac-diagnosis-result');
    if (!grid || !result) return;
    grid.innerHTML = symptoms.map(function(symptom){
      return '<button type="button" data-symptom="' + symptom.id + '">' + esc(symptom.label) + '</button>';
    }).join('');

    function selectedSymptoms() {
      return Array.prototype.slice.call(grid.querySelectorAll('.active')).map(function(button){
        var id = button.getAttribute('data-symptom');
        return symptoms.filter(function(symptom){ return symptom.id === id; })[0];
      }).filter(Boolean);
    }

    function updateDiagnosis() {
      var selected = selectedSymptoms();
      var score = selected.reduce(function(total, symptom){ return total + symptom.score; }, 0);
      var temp = byId('diag-temp').value;
      var age = byId('diag-age').value;
      var filter = byId('diag-filter').value;
      var breaker = byId('diag-breaker').value;
      if (temp === 'extreme') score += 1;
      if (age === 'old') score += 1;
      if (filter === 'dirty') score += 1;
      if (breaker === 'tripped') score += 4;

      var urgent = selected.some(function(symptom){ return symptom.id === 'gas-smell' || symptom.id === 'breaker'; }) || breaker === 'tripped';
      var level = urgent || score >= 8 ? 'Call now' : score >= 4 ? 'Schedule soon' : selected.length ? 'Watch closely' : 'Select symptoms';
      var causes = {};
      selected.forEach(function(symptom){ symptom.causes.forEach(function(cause){ causes[cause] = true; }); });
      var causeList = Object.keys(causes);
      var actions = selected.map(function(symptom){ return symptom.action; });

      result.innerHTML = '<div class="result-kicker">Triage level</div><h3>' + esc(level) + '</h3>' +
        '<p>' + (selected.length ? 'Likely areas: ' + esc(causeList.join(', ')) + '.' : 'Choose one or more symptoms to build a risk profile.') + '</p>' +
        '<div class="hvac-score"><span style="width:' + Math.min(100, score * 10) + '%"></span></div>' +
        '<div class="hvac-detail-list">' + (actions.length ? actions : ['Keep filters clean, maintain clear airflow, and document changes before peak weather.']).map(function(action){ return '<div><span></span><p>' + esc(action) + '</p></div>'; }).join('') + '</div>' +
        '<a class="btn btn-primary btn-icon-right" href="https://wa.me/13235475086?text=' + encodeURIComponent('Hi ELF, I used the HVAC symptom triage. Level: ' + level + '. Symptoms: ' + selected.map(function(item){ return item.label; }).join(', ')) + '" target="_blank" rel="noopener">Text this summary</a>';
    }

    grid.addEventListener('click', function(event){
      var button = event.target.closest('[data-symptom]');
      if (!button) return;
      button.classList.toggle('active');
      updateDiagnosis();
    });
    ['diag-temp', 'diag-age', 'diag-filter', 'diag-breaker'].forEach(function(id){
      var input = byId(id);
      if (input) input.addEventListener('change', updateDiagnosis);
    });
    updateDiagnosis();
  }

  function setupDecision() {
    var age = byId('decision-age');
    var repair = byId('decision-repair');
    var replace = byId('decision-replace');
    var refrigerant = byId('decision-refrigerant');
    var failure = byId('decision-failure');
    var result = byId('hvac-decision-result');
    if (!age || !repair || !replace || !result) return;

    function updateDecision() {
      var ageValue = parseInt(age.value, 10);
      var repairValue = parseInt(repair.value, 10);
      var replaceValue = parseInt(replace.value, 10);
      var ratio = repairValue / replaceValue;
      var score = 0;
      if (ageValue >= 15) score += 3;
      else if (ageValue >= 12) score += 2;
      else if (ageValue >= 8) score += 1;
      if (ratio >= 0.5) score += 3;
      else if (ratio >= 0.3) score += 2;
      else if (ratio >= 0.18) score += 1;
      if (refrigerant.value === '22') score += 3;
      if (refrigerant.value === 'unknown') score += 1;
      if (failure.value === 'major') score += 2;
      if (failure.value === 'repeated') score += 3;

      var verdict = score >= 7 ? 'Replacement math is strong' : score >= 4 ? 'Get repair and replacement bids' : 'Repair likely makes sense';
      var note = score >= 7 ? 'The age, failure type, refrigerant, or repair ratio points toward replacement planning.' : score >= 4 ? 'The decision is close enough that side-by-side quotes matter.' : 'A controlled repair is usually reasonable if comfort and ductwork are otherwise good.';
      byId('decision-age-label').textContent = ageValue + ' years';
      byId('decision-repair-label').textContent = money(repairValue);
      byId('decision-replace-label').textContent = money(replaceValue);
      result.innerHTML = '<div class="result-kicker">Decision model</div><h3>' + esc(verdict) + '</h3><p>' + esc(note) + '</p>' +
        '<div class="hvac-result-metric"><span>Repair ratio</span><strong>' + Math.round(ratio * 100) + '%</strong></div>' +
        '<div class="hvac-result-metric"><span>Decision score</span><strong>' + score + '/11</strong></div>' +
        '<p class="hvac-muted">Use this as planning math, not a substitute for a licensed HVAC diagnosis on compressors, coils, refrigerant, gas heat, or electrical faults.</p>';
    }
    [age, repair, replace, refrigerant, failure].forEach(function(input){
      input.addEventListener('input', updateDecision);
      input.addEventListener('change', updateDecision);
    });
    updateDecision();
  }

  function setupMaintenance() {
    var season = byId('maint-season');
    var list = byId('hvac-maint-list');
    var bar = byId('hvac-maint-bar');
    var copy = byId('hvac-maint-copy');
    if (!season || !list || !bar || !copy) return;

    function key() {
      return 'elfHvacMaint:' + season.value;
    }

    function checkedIndexes() {
      try {
        return JSON.parse(localStorage.getItem(key()) || '[]');
      } catch (error) {
        return [];
      }
    }

    function renderMaintenance() {
      var done = checkedIndexes();
      list.innerHTML = maintenance[season.value].map(function(item, index){
        var checked = done.indexOf(index) !== -1;
        return '<label class="hvac-check-line' + (checked ? ' done' : '') + '"><input type="checkbox" data-maint-step="' + index + '"' + (checked ? ' checked' : '') + '/><span>' + esc(item) + '</span></label>';
      }).join('');
      updateProgress();
    }

    function updateProgress() {
      var checks = list.querySelectorAll('[data-maint-step]');
      var done = [];
      checks.forEach(function(check){
        var line = check.closest('.hvac-check-line');
        line.classList.toggle('done', check.checked);
        if (check.checked) done.push(parseInt(check.getAttribute('data-maint-step'), 10));
      });
      localStorage.setItem(key(), JSON.stringify(done));
      var pct = checks.length ? Math.round((done.length / checks.length) * 100) : 0;
      bar.style.width = pct + '%';
      copy.textContent = pct + '% complete';
    }

    season.addEventListener('change', renderMaintenance);
    list.addEventListener('change', function(event){
      if (event.target && event.target.matches('[data-maint-step]')) updateProgress();
    });
    renderMaintenance();
  }

  function setupGlossary() {
    var search = byId('hvac-glossary-search');
    var tags = byId('hvac-glossary-tags');
    var list = byId('hvac-glossary-list');
    if (!search || !tags || !list) return;
    var tagSet = { All: true };
    glossary.forEach(function(item){ tagSet[item[2]] = true; });
    var tagNames = Object.keys(tagSet);

    function renderTags() {
      tags.innerHTML = tagNames.map(function(tag){
        return '<button type="button" class="' + (state.glossaryTag === tag ? 'active' : '') + '" data-glossary-tag="' + esc(tag) + '">' + esc(tag) + '</button>';
      }).join('');
    }

    function renderTerms() {
      var query = search.value.trim().toLowerCase();
      var filtered = glossary.filter(function(item){
        var tagOk = state.glossaryTag === 'All' || item[2] === state.glossaryTag;
        var searchOk = !query || (item[0] + ' ' + item[1] + ' ' + item[2]).toLowerCase().indexOf(query) !== -1;
        return tagOk && searchOk;
      });
      list.innerHTML = filtered.map(function(item){
        return '<div class="hvac-term"><span>' + esc(item[2]) + '</span><h3>' + esc(item[0]) + '</h3><p>' + esc(item[1]) + '</p></div>';
      }).join('') || '<div class="hvac-empty">No glossary terms match.</div>';
    }

    tags.addEventListener('click', function(event){
      var tag = event.target.closest('[data-glossary-tag]');
      if (!tag) return;
      state.glossaryTag = tag.getAttribute('data-glossary-tag');
      renderTags();
      renderTerms();
    });
    search.addEventListener('input', renderTerms);
    renderTags();
    renderTerms();
  }

  setupTabs();
  setupLibrary();
  setupSystemMap();
  setupDiagnose();
  setupDecision();
  setupMaintenance();
  setupGlossary();
})();
