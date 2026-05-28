// ============================================================
// ELF HOME SERVICES - PAINTING SERVICE TOOLS
// ============================================================

(function(){
  var root = document.querySelector('.paint-studio');
  if (!root) return;

  var scopes = {
    room: {
      label: 'Single room',
      base: 420,
      timeline: ['1 day', '1 day', '1-2 days', '2 days', '2-3 days'],
      gallons: ['1 gal', '1-2 gal', '2 gal', '2-3 gal', '3-4 gal'],
      copy: 'A single-room paint job includes floor protection, patching minor holes, two coats, and clean cut lines.'
    },
    interior: {
      label: 'Whole interior',
      base: 2900,
      timeline: ['2-3 days', '3-5 days', '4-6 days', '6-8 days', '8-12 days'],
      gallons: ['6-9 gal', '10-14 gal', '14-20 gal', '20-28 gal', '28-38 gal'],
      copy: 'Whole-interior work is priced by wall area, trim complexity, ceiling height, prep, and room count.'
    },
    exterior: {
      label: 'Exterior',
      base: 3400,
      timeline: ['3-4 days', '4-6 days', '5-8 days', '7-10 days', '10-14 days'],
      gallons: ['8-12 gal', '12-18 gal', '18-26 gal', '26-36 gal', '36-48 gal'],
      copy: 'Exterior work includes washing, scraping, caulking, priming bare spots, masking, and weather-aware scheduling.'
    },
    cabinets: {
      label: 'Cabinets',
      base: 2600,
      timeline: ['3-4 days', '5-7 days', '6-8 days', '8-10 days', '10-14 days'],
      gallons: ['1 kit', '1-2 kits', '2 kits', '2-3 kits', '3 kits'],
      copy: 'Cabinet refinishing includes cleaning, sanding, bonding primer, spray enamel, and careful cure handling.'
    },
    trim: {
      label: 'Trim & doors',
      base: 520,
      timeline: ['1 day', '1-2 days', '2-3 days', '3-4 days', '4-6 days'],
      gallons: ['1 gal', '1-2 gal', '2-3 gal', '3-4 gal', '4-6 gal'],
      copy: 'Trim and doors need sanding, caulk, primer where needed, and enamel that cures hard enough for daily contact.'
    }
  };

  var sizeLabels = ['Touch-up', 'Standard', 'Medium', 'Large', 'Estate'];
  var sizeMultipliers = [0.68, 1, 1.48, 2.12, 3.05];
  var prepMultipliers = { light: 0.9, standard: 1.08, heavy: 1.38 };

  var colors = [
    ['Warm White', '#ece5d8', 'Safest for resale, brightens rooms, works with most trim.'],
    ['Soft Greige', '#cfc6b8', 'A calm neutral for open plans and warm flooring.'],
    ['Sage Cabinet', '#7f8f75', 'Great for cabinets, laundry rooms, and grounded accent walls.'],
    ['Deep Navy', '#24364a', 'Best as an accent or office color; usually needs primer.'],
    ['Clay Taupe', '#aa7f5d', 'Warm, earthy, and forgiving in Texas sunlight.'],
    ['Charcoal Trim', '#343331', 'Sharp contrast for modern doors, rails, and built-ins.']
  ];

  var sheenData = {
    bedroom: ['Eggshell', 'Forgiving, soft, and washable enough for bedrooms and living rooms.', ['Best balance', 'Hides texture', 'Low glare']],
    kitchen: ['Satin', 'More washable for grease, hand contact, and busy family kitchens.', ['Wipeable', 'Moisture aware', 'Low maintenance']],
    bath: ['Satin / Semi-gloss', 'Better resistance against moisture and regular cleaning.', ['Moisture resistant', 'Scrubbable', 'Durable']],
    trim: ['Semi-gloss', 'Harder finish for doors, casing, baseboards, and high-touch edges.', ['Impact resistant', 'Easy clean', 'Crisp lines']],
    cabinets: ['Urethane enamel satin', 'Cabinets need a harder enamel, not ordinary wall paint.', ['Factory-like finish', 'Hard cure', 'Spray ready']],
    ceiling: ['Flat ceiling paint', 'Low reflectivity hides waves, patches, and ceiling texture.', ['No glare', 'Hides flaws', 'Classic ceiling']],
    exterior: ['Satin / Low-lustre', 'Sheds dirt and handles DFW UV without looking too glossy.', ['UV resistant', 'Sheds dirt', 'Exterior rated']]
  };

  var prepLists = {
    interior: [
      'Move furniture to the center of the room or clear the room completely.',
      'Remove wall decor, curtains, switch plates, outlet covers, and small hardware.',
      'Point out nail holes, water stains, cracks, and glossy trim before the estimate.',
      'Choose wall color, trim color, ceiling scope, and sheen before work begins.',
      'Keep pets away from work rooms until paint is dry to touch.',
      'Wait 72 hours before hanging heavy frames or pushing furniture tight to walls.'
    ],
    exterior: [
      'Trim shrubs and branches at least 18 inches away from painted surfaces.',
      'Move patio furniture, grills, planters, and hoses away from the house.',
      'Check sprinkler heads so they do not spray fresh paint.',
      'Flag rotten trim, loose caulk, chalky siding, and previous peeling areas.',
      'Approve a weather window with dry surfaces and safe temperatures.',
      'Keep gates unlocked and pets inside during exterior work.'
    ],
    cabinets: [
      'Empty cabinets and drawers near work areas.',
      'Choose door/drawer hardware plan before painting.',
      'Expect doors and drawers to be removed and labeled.',
      'Plan a temporary kitchen setup during spray and cure days.',
      'Avoid heavy cleaning or slamming doors during the cure window.',
      'Use gentle cleaners for the first 30 days.'
    ]
  };

  function money(value) {
    return '$' + Math.round(value).toLocaleString('en-US');
  }

  function selected(id) {
    return document.getElementById(id);
  }

  function isDark(hex) {
    var clean = hex.replace('#', '');
    var red = parseInt(clean.slice(0, 2), 16);
    var green = parseInt(clean.slice(2, 4), 16);
    var blue = parseInt(clean.slice(4, 6), 16);
    return ((red * 299) + (green * 587) + (blue * 114)) / 1000 < 132;
  }

  function setupTabs() {
    var tabs = root.querySelectorAll('[data-paint-tab]');
    var panels = root.querySelectorAll('[data-paint-panel]');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        var key = tab.getAttribute('data-paint-tab');
        tabs.forEach(function(item){ item.classList.toggle('active', item === tab); });
        panels.forEach(function(panel){ panel.classList.toggle('active', panel.getAttribute('data-paint-panel') === key); });
      });
    });
  }

  function updateEstimate() {
    var scopeEl = selected('paint-scope');
    var sizeEl = selected('paint-size');
    var prepEl = selected('paint-prep');
    if (!scopeEl || !sizeEl || !prepEl) return;
    var scope = scopes[scopeEl.value];
    var sizeIndex = parseInt(sizeEl.value, 10) - 1;
    var prep = prepEl.value;
    var low = scope.base * sizeMultipliers[sizeIndex] * prepMultipliers[prep];
    var high = low * 1.72;
    if (selected('paint-ceilings').checked) {
      low *= 1.18;
      high *= 1.24;
    }
    if (selected('paint-trim').checked) {
      low *= 1.24;
      high *= 1.36;
    }
    if (selected('paint-color-change').checked) {
      low *= 1.12;
      high *= 1.18;
    }
    var sheen = scopeEl.value === 'cabinets' ? 'Urethane satin' : scopeEl.value === 'exterior' ? 'Satin' : selected('paint-trim').checked ? 'Eggshell + semi-gloss' : 'Eggshell';
    selected('paint-size-label').textContent = sizeLabels[sizeIndex];
    selected('paint-price').textContent = money(low) + ' - ' + money(high);
    selected('paint-result-copy').textContent = scope.copy;
    selected('paint-timeline').textContent = scope.timeline[sizeIndex];
    selected('paint-gallons').textContent = scope.gallons[sizeIndex];
    selected('paint-sheen').textContent = sheen;
    var msg = 'Hi ELF, I used the painting estimator. Scope: ' + scope.label + '. Size: ' + sizeLabels[sizeIndex] + '. Prep: ' + prep + '. Rough range: ' + selected('paint-price').textContent + '. Can I get a firm painting quote?';
    selected('paint-whatsapp').href = 'https://wa.me/13235475086?text=' + encodeURIComponent(msg);
  }

  function setupEstimate() {
    ['paint-scope', 'paint-size', 'paint-prep', 'paint-ceilings', 'paint-trim', 'paint-color-change'].forEach(function(id){
      var input = selected(id);
      if (!input) return;
      input.addEventListener('input', updateEstimate);
      input.addEventListener('change', updateEstimate);
    });
    updateEstimate();
  }

  function setupColors() {
    var grid = selected('paint-swatches');
    var wall = selected('paint-preview-wall');
    var note = selected('paint-color-note');
    if (!grid || !wall) return;
    grid.innerHTML = colors.map(function(color, index){
      return '<button type="button" class="paint-swatch' + (index === 0 ? ' active' : '') + (isDark(color[1]) ? ' is-dark' : '') + '" data-color-index="' + index + '" aria-pressed="' + (index === 0 ? 'true' : 'false') + '" style="background:' + color[1] + ';">' + color[0] + '<span>' + color[1] + '</span></button>';
    }).join('');
    grid.addEventListener('click', function(event){
      var swatch = event.target.closest('[data-color-index]');
      if (!swatch) return;
      var index = parseInt(swatch.getAttribute('data-color-index'), 10);
      grid.querySelectorAll('.paint-swatch').forEach(function(item){
        var active = item === swatch;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      wall.style.setProperty('--paint-preview-color', colors[index][1]);
      note.textContent = colors[index][0] + ': ' + colors[index][2];
    });
  }

  function updateSheen() {
    var room = selected('sheen-room');
    var result = selected('paint-sheen-result');
    if (!room || !result) return;
    var data = sheenData[room.value];
    var notes = data[2].slice();
    if (selected('sheen-kids').checked && notes.indexOf('Scrubbable') === -1) notes.push('Scrubbable');
    if (selected('sheen-imperfections').checked) notes.push('Avoid high gloss');
    if (selected('sheen-moisture').checked && notes.indexOf('Moisture resistant') === -1) notes.push('Moisture resistant');
    result.innerHTML = '<div class="result-kicker">Recommended finish</div><h3>' + data[0] + '</h3><p>' + data[1] + '</p><div class="paint-sheen-chips">' + notes.map(function(note){ return '<span>' + note + '</span>'; }).join('') + '</div>';
  }

  function setupSheen() {
    ['sheen-room', 'sheen-kids', 'sheen-imperfections', 'sheen-moisture'].forEach(function(id){
      var input = selected(id);
      if (!input) return;
      input.addEventListener('input', updateSheen);
      input.addEventListener('change', updateSheen);
    });
    updateSheen();
  }

  function prepKey(type) {
    return 'elfPaintPrep:' + type;
  }

  function renderPrep() {
    var type = selected('prep-type').value;
    var list = selected('paint-prep-list');
    var done = JSON.parse(localStorage.getItem(prepKey(type)) || '[]');
    list.innerHTML = prepLists[type].map(function(item, index){
      var checked = done.indexOf(index) !== -1;
      return '<label class="paint-prep-line' + (checked ? ' done' : '') + '"><input type="checkbox" data-paint-prep-step="' + index + '"' + (checked ? ' checked' : '') + '/><span>' + item + '</span></label>';
    }).join('');
    updatePrepProgress();
  }

  function updatePrepProgress() {
    var type = selected('prep-type').value;
    var checks = root.querySelectorAll('[data-paint-prep-step]');
    var done = [];
    checks.forEach(function(check){
      var line = check.closest('.paint-prep-line');
      line.classList.toggle('done', check.checked);
      if (check.checked) done.push(parseInt(check.getAttribute('data-paint-prep-step'), 10));
    });
    localStorage.setItem(prepKey(type), JSON.stringify(done));
    var pct = checks.length ? Math.round((done.length / checks.length) * 100) : 0;
    selected('paint-prep-bar').style.width = pct + '%';
    selected('paint-prep-copy').textContent = pct + '% complete for ' + selected('prep-type').options[selected('prep-type').selectedIndex].text;
  }

  function setupPrep() {
    var type = selected('prep-type');
    if (!type) return;
    type.addEventListener('change', renderPrep);
    root.addEventListener('change', function(event){
      if (event.target && event.target.matches('[data-paint-prep-step]')) updatePrepProgress();
    });
    renderPrep();
  }

  setupTabs();
  setupEstimate();
  setupColors();
  setupSheen();
  setupPrep();
})();
