// ============================================================
// ELF HOME SERVICES - SITEWIDE PAGE ENHANCEMENTS
// ============================================================

(function(){
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function(){
    var path = location.pathname.replace(/\/+$/, '');
    var file = path.split('/').pop() || 'index.html';
    var isService = path.indexOf('/services/') !== -1;
    var isLocation = path.indexOf('/locations/') !== -1;
    var rel = isService || isLocation ? '../' : '';
    var skip = {
      'index.html': true,
      'diy.html': true,
      'hvac.html': true,
      'painting.html': path.indexOf('/services/') !== -1
    };
    if (skip[file]) return;

    ensureProgress();
    ensureMobileActions(rel);
    ensureEstimateFallbackStyles();
    document.body.classList.add('elf-page-enhanced');

    if (isService && serviceData[file]) {
      renderService(serviceData[file], rel);
      return;
    }
    if (isLocation && locationData[file]) {
      renderLocation(locationData[file], rel);
      return;
    }
    if (pageData[file]) {
      renderPage(pageData[file], rel);
    }
  });

  var pageData = {
    'about.html': {
      kicker: 'Craft standards',
      title: 'A sharper look at how ELF protects the job.',
      intro: 'A practical standards board for what should happen before, during, and after a visit.',
      cards: [
        ['Written scope', 'Every meaningful job starts with scope, price, materials, and assumptions documented.'],
        ['Daily reset', 'Tools controlled, pathways clean, and the home left usable at the end of each workday.'],
        ['Warranty trail', 'The final walkthrough creates a simple record of what was done and what is covered.']
      ],
      tool: { type: 'checklist', title: 'Pre-hire confidence check', storage: 'about', items: ['Scope is written clearly', 'Timeline has start and finish windows', 'Materials are named or allowance is listed', 'Warranty is in writing', 'Cleanup expectation is explicit'] }
    },
    'book.html': {
      kicker: 'Booking concierge',
      title: 'Turn a vague project into a clean appointment.',
      intro: 'Pick the visit type and get a preparation note before you book.',
      cards: [
        ['Fast visit', 'Best for repairs, punch lists, fixture swaps, and small drywall or trim work.'],
        ['Estimate visit', 'Best for painting, flooring, tile, remodels, and multi-room planning.'],
        ['Emergency slot', 'Best for leaks, unsafe doors, active water, or anything that cannot wait.']
      ],
      tool: { type: 'picker', title: 'Visit planner', options: [
        ['Repair visit', 'Make one list, include photos, and group small tasks to make the visit efficient.'],
        ['Remodel estimate', 'Bring inspiration photos, rough dimensions, budget range, and must-have dates.'],
        ['Urgent help', 'Send photos first, stop active damage if safe, and keep the area accessible.']
      ] }
    },
    'emergency.html': {
      kicker: 'Urgent decision aid',
      title: 'Know what is urgent, what is unsafe, and what can wait.',
      intro: 'A quick triage board for the calls that should move fastest.',
      cards: [
        ['Active water', 'Shut off water if safe, protect electrical, and photograph the source.'],
        ['Security issue', 'Broken exterior doors, locks, or windows get priority scheduling.'],
        ['Electrical concern', 'Burning smells, heat, repeated breaker trips, or sparks are stop-now events.']
      ],
      tool: { type: 'picker', title: 'Emergency triage', options: [
        ['Active leak', 'Turn off water at fixture or main if safe. Do not wait for visible ceiling spread.'],
        ['Door will not lock', 'Keep the area supervised and request same-day security repair.'],
        ['Electrical smell', 'Stop using the circuit and call licensed electrical help immediately.']
      ] }
    },
    'estimate.html': {
      kicker: 'Estimate command center',
      title: 'Build a cleaner estimate before you start clicking.',
      intro: 'A compact prep layer for the quote builder: define the room, evidence, materials, and decision deadline first.',
      cards: [
        ['Scope clarity', 'List what is included, what is excluded, and which rooms or surfaces are part of the first phase.'],
        ['Photo set', 'Use one wide shot, one close detail, and one access photo for each major project area.'],
        ['Decision path', 'Separate must-haves from upgrades so the estimate can show a practical range.']
      ],
      tool: { type: 'checklist', title: 'Estimate-ready packet', storage: 'estimate', items: ['Room or area is named', 'Photos are ready', 'Rough dimensions are available', 'Material preference is selected', 'Deadline or reason is clear', 'Budget comfort range is known'] }
    },
    'faq.html': {
      kicker: 'Answer finder',
      title: 'Search the questions people ask before hiring.',
      intro: 'A faster layer on top of the full FAQ, organized around decisions homeowners actually make.',
      cards: [
        ['Pricing', 'Minimum visits, written estimates, change orders, and what affects final scope.'],
        ['Scheduling', 'Response windows, same-day availability, and how to prepare for a visit.'],
        ['Warranty', 'What the 1-year labor guarantee covers and what counts as material failure.']
      ],
      tool: { type: 'search', title: 'FAQ quick search', placeholder: 'price, warranty, licensed, schedule', items: [
        ['Flat pricing', 'Projects over small hourly work are quoted as a firm written price.'],
        ['Same-day quotes', 'Most core DFW areas can get same-day or next-day estimate response.'],
        ['Licensed scope', 'Specialty plumbing, electrical, HVAC, gas, and structural work require licensed trades.'],
        ['Warranty', 'Workmanship is covered for one year when the failure is due to our installation.'],
        ['Photos help', 'Clear photos make estimates faster and reduce back-and-forth.']
      ] }
    },
    'gallery.html': {
      kicker: 'Project lens',
      title: 'Browse work by the decision you are trying to make.',
      intro: 'Use the lens to think about scope, disruption, finish level, and resale value.',
      cards: [
        ['Finish quality', 'Look for clean transitions, consistent texture, straight tile lines, and tight trim.'],
        ['Disruption level', 'Some projects are one-day resets; remodels need staging and access planning.'],
        ['Resale signal', 'Paint, flooring, bath updates, and cabinet refreshes change buyer perception fast.']
      ],
      tool: { type: 'picker', title: 'Project lens', options: [
        ['Quick refresh', 'Paint, fixtures, hardware, and drywall touchups are the fastest visual upgrades.'],
        ['High impact', 'Flooring, cabinets, tile, and bath upgrades change how the whole home feels.'],
        ['Pre-sale polish', 'Prioritize visible defects, neutral finishes, and punch-list repairs before photos.']
      ] }
    },
    'maintenance.html': {
      kicker: 'Maintenance cockpit',
      title: 'Make the home easier to own, one season at a time.',
      intro: 'A compact checklist board for the work that prevents bigger work.',
      cards: [
        ['Spring', 'Exterior caulk, paint touchups, drainage, AC prep, and fence checks.'],
        ['Summer', 'HVAC airflow, irrigation overspray, exterior movement, and humidity trouble spots.'],
        ['Fall/Winter', 'Heat checks, weatherstripping, gutters, freeze prep, and attic access.']
      ],
      tool: { type: 'checklist', title: 'This month at home', storage: 'maintenance', items: ['Check HVAC filter', 'Walk exterior caulk lines', 'Test GFCI outlets', 'Look under sinks for moisture', 'Vacuum dryer vent area', 'List small repairs for one bundled visit'] }
    },
    'pricing.html': {
      kicker: 'Budget planner',
      title: 'Understand the range before you request the quote.',
      intro: 'A quick planning tool for price sensitivity, scope, and timeline expectations.',
      cards: [
        ['Labor clarity', 'Prep, access, protection, cleanup, and finish quality are part of the price.'],
        ['Material swing', 'Tile, flooring, fixtures, and cabinets can change the budget more than labor.'],
        ['Scope control', 'The fastest way to protect budget is to define what is included and excluded.']
      ],
      tool: { type: 'calculator', title: 'Rough budget model', base: 450, labels: ['Repair', 'Room update', 'Multi-room', 'Remodel'], multipliers: [1, 4.8, 12, 28] }
    },
    'quote.html': {
      kicker: 'Quote router',
      title: 'Send the right information the first time.',
      intro: 'Pick the path that matches your project and get a better first message.',
      cards: [
        ['Photos', 'Wide shot, close shot, and any damage source are the three most useful images.'],
        ['Dimensions', 'Even rough dimensions help with paint, flooring, tile, and cabinet planning.'],
        ['Deadline', 'Tell us if this is for guests, move-in, listing photos, or active damage.']
      ],
      tool: { type: 'picker', title: 'Best contact path', options: [
        ['Photos ready', 'Text or WhatsApp the photos with city, deadline, and what outcome you want.'],
        ['Need advice', 'Call first if you are unsure whether the job is repair, remodel, or licensed trade.'],
        ['Large project', 'Use the quote form and include rooms, materials, inspiration, and ideal timing.']
      ] }
    },
    'reviews.html': {
      kicker: 'Trust signals',
      title: 'Read reviews like a homeowner, not a star counter.',
      intro: 'The best reviews tell you how the company communicates when work gets complicated.',
      cards: [
        ['Communication', 'Look for details about scheduling, updates, and how changes were handled.'],
        ['Craft quality', 'Look for texture match, clean lines, finish consistency, and durability mentions.'],
        ['Aftercare', 'Look for warranty follow-through and responsiveness after the invoice.']
      ],
      tool: { type: 'picker', title: 'Review lens', options: [
        ['Small repair', 'Prioritize punctuality, cleanliness, and ability to bundle small tasks.'],
        ['Remodel', 'Prioritize communication, change-order clarity, and finish detail.'],
        ['Urgent job', 'Prioritize response speed and practical problem solving.']
      ] }
    },
    'service-areas.html': {
      kicker: 'Coverage finder',
      title: 'Find the practical service fit for your city.',
      intro: 'Each city has a different home age, project pattern, and response rhythm.',
      cards: [
        ['Core cities', 'Denton, Lewisville, Flower Mound, Frisco, and nearby cities get fastest routing.'],
        ['Premium remodels', 'Frisco, Southlake, Plano, and Flower Mound often call for finish-driven work.'],
        ['Older homes', 'Denton, Plano, and McKinney need more era-aware repairs and prep.']
      ],
      tool: { type: 'search', title: 'City quick finder', placeholder: 'Frisco, Denton, Plano...', items: [
        ['Denton', 'Home base. Fastest response and broadest mix of repairs, rentals, historic homes, and updates.'],
        ['Frisco', 'Premium remodels, LVP, exterior paint, and builder-grade upgrade work.'],
        ['Plano', 'Established homes, drywall movement, bath updates, and era-specific repairs.'],
        ['McKinney', 'Historic preservation plus modern master-planned remodel work.'],
        ['Southlake', 'Premium finish expectations, custom work, and larger remodel scopes.']
      ] }
    },
    'services.html': {
      kicker: 'Service matcher',
      title: 'Choose the right service before you ask for an estimate.',
      intro: 'A guided way to turn a home problem into the right ELF service path.',
      cards: [
        ['Surface work', 'Painting, drywall, tile, and flooring change the visible feel of a home.'],
        ['Room remodels', 'Kitchen and bathroom projects need more planning, sequencing, and materials.'],
        ['Repair work', 'Doors, fixtures, trim, appliances, and punch lists keep the home functioning.']
      ],
      tool: { type: 'picker', title: 'What kind of project is it?', options: [
        ['Cosmetic refresh', 'Start with painting, drywall touchups, flooring, fixtures, and trim details.'],
        ['Room transformation', 'Kitchen, bathroom, tile, cabinets, and layout changes need a scoped estimate.'],
        ['Fix what is broken', 'General repairs and appliance diagnostics are best bundled into one visit.']
      ] }
    }
  };

  var serviceData = {
    'drywall.html': { name: 'Drywall', accent: 'Texture match', base: 185, unit: 'repair', timeline: 'same day to 3 days', prep: ['Mark every crack or hole with painter tape', 'Take photos in daylight and at night with lights on', 'Confirm paint color or plan for repainting the wall'], scopes: ['Patch', 'Texture', 'Ceiling', 'Smooth wall'] },
    'tile.html': { name: 'Tile', accent: 'Waterproofing', base: 850, unit: 'surface', timeline: '2 to 10 days', prep: ['Choose tile size and grout color early', 'Confirm waterproofing method for wet areas', 'Plan access to bathrooms or kitchen during cure time'], scopes: ['Backsplash', 'Floor', 'Shower', 'Fireplace'] },
    'flooring.html': { name: 'Flooring', accent: 'Subfloor prep', base: 1200, unit: 'room', timeline: '1 to 5 days', prep: ['Clear small furniture and closet floors', 'Decide whether baseboards stay or reset', 'Plan transitions at doorways and stairs'], scopes: ['LVP', 'Hardwood', 'Tile floor', 'Carpet'] },
    'kitchen.html': { name: 'Kitchen', accent: 'Sequencing', base: 6800, unit: 'project', timeline: '1 to 6 weeks', prep: ['List what must stay working during the project', 'Choose cabinet, counter, and backsplash direction', 'Confirm appliance sizes before layout decisions'], scopes: ['Refresh', 'Cabinets', 'Counters', 'Full remodel'] },
    'bathroom.html': { name: 'Bathroom', accent: 'Water control', base: 4200, unit: 'bath', timeline: '1 to 4 weeks', prep: ['Pick shower vs tub priority', 'Confirm tile, vanity, fixture, and glass direction', 'Plan alternate bathroom access during work'], scopes: ['Vanity', 'Shower', 'Floor tile', 'Full bath'] },
    'repairs.html': { name: 'Repairs', accent: 'Punch list', base: 220, unit: 'visit', timeline: 'same day to 2 days', prep: ['Make one consolidated list', 'Group tasks by room', 'Send photos of each item before the visit'], scopes: ['Doors', 'Trim', 'Fixtures', 'Exterior'] },
    'appliances.html': { name: 'Appliances', accent: 'Repair math', base: 165, unit: 'diagnostic', timeline: 'same day to 1 week', prep: ['Share model number and symptoms', 'Stop using leaking or sparking appliances', 'Clear access around the appliance'], scopes: ['Washer', 'Dryer', 'Dishwasher', 'Fridge'] }
  };

  var locationData = {
    'denton.html': { city: 'Denton', focus: 'home base response', distance: 'home base', services: ['repairs', 'historic drywall', 'rental turns', 'painting'], note: 'Best for same-day punch lists, rental work, and older-home problem solving.' },
    'frisco.html': { city: 'Frisco', focus: 'premium upgrades', distance: '20 mi', services: ['kitchens', 'bathrooms', 'LVP', 'exterior paint'], note: 'Best for builder-grade upgrades, resale polish, and larger finish-driven remodels.' },
    'plano.html': { city: 'Plano', focus: 'established-home refresh', distance: '30 mi', services: ['drywall', 'bath updates', 'flooring', 'painting'], note: 'Best for era-aware repairs, settlement cracks, and room-by-room modernization.' },
    'mckinney.html': { city: 'McKinney', focus: 'historic plus new', distance: '25 mi', services: ['custom repairs', 'tile', 'painting', 'kitchens'], note: 'Best for projects that need different handling across historic and newer neighborhoods.' },
    'allen.html': { city: 'Allen', focus: 'family-home updates', distance: '28 mi', services: ['bathrooms', 'flooring', 'repairs', 'painting'], note: 'Best for efficient updates, clean scheduling, and practical material choices.' },
    'lewisville.html': { city: 'Lewisville', focus: 'mixed housing stock', distance: '12 mi', services: ['repairs', 'flooring', 'exteriors', 'appliances'], note: 'Best for varied home ages, quick routing, and bundled repairs.' },
    'flower-mound.html': { city: 'Flower Mound', focus: 'upscale home care', distance: '15 mi', services: ['premium painting', 'bathrooms', 'kitchens', 'tile'], note: 'Best for finish quality, exterior maintenance, and larger update plans.' },
    'southlake.html': { city: 'Southlake', focus: 'custom finish work', distance: '35 mi', services: ['custom tile', 'premium remodels', 'cabinet work', 'exteriors'], note: 'Best for high-detail work where fit, finish, and scheduling discipline matter.' },
    'painting-contractor-denton-tx.html': {
      city: 'Denton',
      kicker: 'Denton painting playbook',
      title: 'Paint planning for historic Denton, rentals, and newer suburbs.',
      intro: 'Denton paint work changes block by block: old wood near the Square, rental refreshes near UNT, low-VOC interiors at Robson Ranch, and UV-heavy exteriors citywide.',
      focus: 'historic prep + Texas UV',
      distance: 'home base',
      services: ['historic trim', 'Robson Ranch interiors', 'cabinet enamel', 'UV-rated exterior'],
      note: 'Best first move: send exterior shade exposure, siding material, photos of peeling areas, and whether the home is historic, rental, or owner-occupied.',
      cards: [
        ['Historic prep', 'Older Denton homes need flexible caulk, careful masking, and primer decisions around original woodwork.'],
        ['Exterior durability', 'South and west elevations take the UV hit first, so paint grade matters more than color alone.'],
        ['Rental timing', 'UNT and TWU-area turns need fast, clean scheduling without skipping wall repair or stain blocking.']
      ],
      details: [
        ['Best photos', 'Wide exterior sides, close peeling paint, window trim, fascia, and any caulk failure.'],
        ['Ask early', 'Whether the job is a quick refresh, historic restoration look, or long-life exterior repaint.'],
        ['Finish note', 'Cabinet and trim enamel should be sprayed or brushed intentionally, never rolled like wall paint.']
      ],
      responses: [
        'For Denton historic trim, show closeups of old paint layers, bare wood, windows, and any failing caulk so primer can be chosen correctly.',
        'For Robson Ranch interiors, note low-VOC preference, furniture protection needs, and room access windows.',
        'For cabinet enamel in Denton, send door style, current finish, hinge type, and whether you want new hardware.',
        'For Denton exterior paint, include sun exposure, siding material, peeling areas, and whether fascia or soffit repairs are needed.'
      ]
    },
    'emergency-handyman-denton-tx.html': {
      city: 'Denton',
      kicker: 'Denton emergency response',
      title: 'Stabilize the problem first, then plan the permanent repair.',
      intro: 'Denton emergency work is about speed with judgment: stop damage, secure the home, document the issue, then quote the finish repair clearly.',
      focus: 'same-day stabilization',
      distance: 'home base',
      services: ['active water', 'door lock failure', 'storm fence', 'ceiling damage'],
      note: 'Best for active leaks, unsafe doors, wind damage, failed gates, and ceiling or drywall damage that should not wait.',
      cards: [
        ['First hour', 'Shut off water or power if safe, photograph the source, and keep access clear for the repair.'],
        ['Security priority', 'Exterior doors, locks, fence gates, and broken windows get handled as safety items first.'],
        ['Aftercare path', 'Emergency drywall, paint, flooring, or trim repairs should be scoped after the source is controlled.']
      ],
      details: [
        ['Call with', 'Address, photos, whether water or power is active, and whether the home is secure.'],
        ['Do now', 'Move valuables, place buckets, avoid wet electrical areas, and do not open bulging ceilings.'],
        ['Quote style', 'Emergency stabilization first; finish work can be priced after hidden damage is visible.']
      ],
      responses: [
        'For active water in Denton, tell us if the fixture shutoff or main shutoff is closed and send photos of the source plus the ceiling or wall below.',
        'For a door lock failure, send the door edge, strike plate, frame, lock brand, and whether the door can close at all.',
        'For storm fence work, send the broken posts, panel run, gate hardware, and whether pets need containment today.',
        'For ceiling damage, avoid poking the sagging area and send photos from across the room plus closeups of staining or cracking.'
      ]
    },
    'drywall-repair-lewisville-tx.html': {
      city: 'Lewisville',
      kicker: 'Lewisville drywall playbook',
      title: 'Texture matching for older ranches, Castle Hills, and lake-area homes.',
      intro: 'Lewisville drywall repair often means matching orange peel or knockdown texture under mixed lighting, while checking for water, settlement, or HVAC humidity causes.',
      focus: 'texture matching',
      distance: '12 mi',
      services: ['orange peel match', 'water cutout', 'settlement cracks', 'ceiling patches'],
      note: 'Best for patching holes, repairing water-damaged panels, correcting failed DIY patches, and blending texture so the repair disappears.',
      cards: [
        ['Texture first', 'The patch is only half the job; the repair reads as professional when the texture and sheen disappear.'],
        ['Water history', 'Lewisville repairs near baths, kitchens, and laundry rooms should confirm the leak is solved before closing walls.'],
        ['Ceiling lighting', 'Raking light from windows can expose poor feathering, especially on smooth or lightly textured ceilings.']
      ],
      details: [
        ['Best photos', 'One photo with lights on, one from the side, and one wide shot showing the whole wall or ceiling.'],
        ['Paint note', 'Even perfect texture may need corner-to-corner paint on the wall for a truly invisible repair.'],
        ['Watch for', 'Recurring cracks around doors, vaulted ceilings, and previous tape seams can indicate movement.']
      ],
      responses: [
        'For orange peel matching in Lewisville, send a close angled photo of existing texture and the damaged spot with a coin or hand for scale.',
        'For water cutout work, include the original leak source, whether it is repaired, and photos of any soft drywall or staining.',
        'For settlement cracks, show the full wall, nearby door frames, and whether cracks reopen seasonally.',
        'For ceiling patches, send photos with lights on and off so we can judge texture, sheen, and visibility.'
      ]
    },
    'handyman-flower-mound-tx.html': {
      city: 'Flower Mound',
      kicker: 'Flower Mound punch-list planner',
      title: 'High-finish handyman work for busy homes and pre-listing prep.',
      intro: 'Flower Mound homes often need careful maintenance that blends in: door adjustments, trim, fixtures, exterior touchups, and clean punch lists before guests, photos, or sale.',
      focus: 'polished maintenance',
      distance: '15 mi',
      services: ['pre-listing punch lists', 'door tune-ups', 'fixture installs', 'exterior touchups'],
      note: 'Best for bundled repairs where finish quality matters and the home needs to stay clean and functional during the work.',
      cards: [
        ['Bundle strategy', 'One organized list by room usually saves time compared with separate small appointments.'],
        ['HOA awareness', 'Exterior paint, fence, mailbox, and visible repairs may need color and finish consistency.'],
        ['Pre-sale polish', 'Trim gaps, drywall dents, caulk lines, and hardware details show up fast in listing photos.']
      ],
      details: [
        ['Best list', 'Group items by room, include photos, and mark what is must-do versus nice-to-have.'],
        ['Good timing', 'Schedule pre-listing repairs before photography, not after staging is already complete.'],
        ['Finish note', 'Small repairs should match surrounding sheen, texture, and hardware style.']
      ],
      responses: [
        'For a Flower Mound pre-listing punch list, send the inspection notes or room-by-room list plus photos of the most visible defects.',
        'For door tune-ups, show the hinge side, latch side, reveal gap, and any rubbing marks on the jamb.',
        'For fixture installs, send product links or photos, ceiling height, and whether old boxes or anchors are secure.',
        'For exterior touchups, include HOA color needs, siding or trim material, and the exact area visible from the street.'
      ]
    },
    'lvp-flooring-installation-frisco.html': {
      city: 'Frisco',
      kicker: 'Frisco flooring planner',
      title: 'LVP installation that respects slab flatness, transitions, and resale.',
      intro: 'Frisco LVP projects usually replace builder carpet or dated tile. The durable result depends on acclimation, slab prep, expansion gaps, and clean baseboard or stair details.',
      focus: 'subfloor flatness',
      distance: '20 mi',
      services: ['wide-plank LVP', 'carpet replacement', 'stair transitions', 'baseboard reset'],
      note: 'Best for whole-floor updates, pet-friendly surfaces, resale upgrades, and family homes that need durable flooring without a long remodel.',
      cards: [
        ['Slab prep', 'High and low spots must be handled before click-lock flooring goes down or seams telegraph later.'],
        ['Transition plan', 'Doorways, stairs, tile edges, and existing baseboards determine whether the finish feels custom.'],
        ['Material choice', 'Wear layer, core type, plank width, and attached pad matter more than the sample board alone.']
      ],
      details: [
        ['Best photos', 'Existing flooring, transition edges, stairs, baseboards, and any cracked or uneven slab areas.'],
        ['Ask early', 'Whether baseboards are removed and reset, quarter round is acceptable, and furniture moving is needed.'],
        ['Frisco note', 'Open floor plans make plank direction and long sightlines more important.']
      ],
      responses: [
        'For wide-plank LVP in Frisco, send the product specs, room photos, and whether the existing floor is carpet, tile, wood, or laminate.',
        'For carpet replacement, show closets, thresholds, and furniture density so staging can be planned.',
        'For stair transitions, send closeups of nosings, landing edges, and railing posts.',
        'For baseboard reset, tell us if you want existing baseboards reused, replaced, or finished with shoe moulding.'
      ]
    },
    'kitchen-remodel-frisco-tx.html': {
      city: 'Frisco',
      kicker: 'Frisco kitchen remodel planner',
      title: 'Open-concept kitchen planning for Frisco homes built to be upgraded.',
      intro: 'Many Frisco kitchens start with builder-grade cabinets and closed-off layouts. The best remodels sequence layout, permits, cabinets, counters, lighting, and daily-life access before demo.',
      focus: 'sequenced remodels',
      distance: '20 mi',
      services: ['island planning', 'cabinet layout', 'quartz counters', 'permit-ready demo'],
      note: 'Best for Frisco homes where resale value, storage, sightlines, and clean project sequencing all matter.',
      cards: [
        ['Layout before finishes', 'Sink, range, refrigerator, island clearance, and traffic paths should be solved before selecting tile.'],
        ['Cabinet lead time', 'Semi-custom or custom cabinets can control the calendar more than demolition does.'],
        ['Living through it', 'Temporary kitchen planning keeps the house usable while the messy work happens.']
      ],
      details: [
        ['Best photos', 'Current kitchen from each corner, pantry, appliance walls, island, ceiling, and adjacent living room.'],
        ['Decide early', 'Keep or move plumbing, appliance sizes, island seating, cabinet style, and counter material.'],
        ['Permit note', 'Wall changes, electrical, plumbing, and structural work need proper trade coordination.']
      ],
      responses: [
        'For island planning in Frisco, send current dimensions, desired seating count, appliance locations, and traffic pinch points.',
        'For cabinet layout, include ceiling height, pantry needs, trash pullout preference, and appliance spec sheets.',
        'For quartz counters, send edge preference, backsplash plan, sink type, and whether you want waterfall panels.',
        'For permit-ready demo, clarify wall removal, plumbing moves, electrical changes, and HOA or neighborhood constraints.'
      ]
    },
    'cabinet-refinishing-frisco-tx.html': {
      city: 'Frisco',
      kicker: 'Frisco cabinet refinishing plan',
      title: 'A factory-look finish without replacing solid builder cabinets.',
      intro: 'Frisco cabinet refinishing works best when the process is disciplined: remove doors, label hardware, clean, sand, prime, spray, cure, and reinstall with alignment.',
      focus: 'spray-grade enamel',
      distance: '20 mi',
      services: ['door removal', 'grain fill', 'spray enamel', 'hardware upgrade'],
      note: 'Best for structurally sound cabinets where color, sheen, and hardware can transform the kitchen without a full replacement.',
      cards: [
        ['Process matters', 'Brushing paint over cabinets is not refinishing; surface prep and controlled spray work drive durability.'],
        ['Color strategy', 'White, warm greige, and muted green read differently under Frisco open-plan lighting.'],
        ['Hardware math', 'Changing pull size may require filling old holes and drilling accurately before finish coats.']
      ],
      details: [
        ['Best photos', 'Door style, drawer fronts, inside boxes, hinges, damage, and current finish sheen.'],
        ['Ask early', 'Soft-close hinges, new pulls, island accent color, and whether grain should be minimized.'],
        ['Durability note', 'Cure time matters; doors can be dry to touch before the coating is fully hardened.']
      ],
      responses: [
        'For door removal, send the total door and drawer count plus photos of hinge type and interior boxes.',
        'For grain fill, send closeups of oak or open-grain doors so the desired smoothness can be estimated.',
        'For spray enamel, note desired color, sheen, and whether the island should be a different finish.',
        'For hardware upgrades, send pull size, existing hole spacing, and whether old holes need filling.'
      ]
    },
    'bathroom-remodel-mckinney-tx.html': {
      city: 'McKinney',
      kicker: 'McKinney bath remodel planner',
      title: 'Waterproof bathroom upgrades for established and newer McKinney homes.',
      intro: 'McKinney bath projects range from Stonebridge Ranch refreshes to older master baths needing full waterproofing, layout cleanup, tile, glass, vanity, and ventilation planning.',
      focus: 'waterproof sequencing',
      distance: '25 mi',
      services: ['tub-to-shower', 'vanity reset', 'tile waterproofing', 'glass-ready walls'],
      note: 'Best for master bath upgrades where water control, clean tile lines, and daily access matter as much as the finished photos.',
      cards: [
        ['Waterproof first', 'Tile is decorative; the waterproofing layer behind it decides whether the shower lasts.'],
        ['Access planning', 'A remodel schedule should protect alternate bathroom access and minimize daily disruption.'],
        ['Glass readiness', 'Straight, plumb walls and curb planning make frameless glass cleaner and safer.']
      ],
      details: [
        ['Best photos', 'Shower, tub deck, vanity wall, floor tile, ventilation fan, and any staining or soft areas.'],
        ['Decide early', 'Niche placement, valve trim, glass style, vanity size, lighting, and towel storage.'],
        ['McKinney note', 'Older baths often hide moisture damage around tubs and curbs, so contingency should be discussed.']
      ],
      responses: [
        'For a tub-to-shower conversion in McKinney, send tub dimensions, drain location, desired curb style, and tile inspiration.',
        'For vanity reset, include width, plumbing location, mirror and lighting plan, and storage needs.',
        'For tile waterproofing, ask for the membrane method and send photos of wet-area walls and floor. ',
        'For glass-ready walls, share desired glass style and make sure blocking, curb slope, and wall plumbness are planned.'
      ]
    },
    'tile-installation-mckinney-tx.html': {
      city: 'McKinney',
      kicker: 'McKinney tile installation planner',
      title: 'Tile work planned around substrate, layout, and Texas movement.',
      intro: 'McKinney tile projects need more than pretty tile: substrate prep, waterproofing, expansion, layout balance, and grout choices decide whether the finish stays clean.',
      focus: 'substrate + layout',
      distance: '25 mi',
      services: ['backsplash', 'shower tile', 'floor tile', 'large-format leveling'],
      note: 'Best for kitchens, showers, bath floors, fireplaces, and large-format tile that needs flat prep and precise layout.',
      cards: [
        ['Layout reads first', 'Centered lines, balanced cuts, and outlet planning matter before the first tile is set.'],
        ['Substrate decides', 'Backer board, membrane, slab flatness, and crack isolation prevent future failure.'],
        ['Grout discipline', 'Color, joint width, and sealant at changes of plane keep the finished tile looking intentional.']
      ],
      details: [
        ['Best photos', 'Full surface, corners, outlets, substrate, transitions, and tile box label if purchased.'],
        ['Ask early', 'Tile size, grout color, pattern direction, edge trim, and waterproofing method.'],
        ['McKinney note', 'Large-format tile on slab needs flatness checks before install day.']
      ],
      responses: [
        'For a backsplash, send counter-to-cabinet height, outlet count, tile size, and whether under-cabinet lighting exists.',
        'For shower tile, confirm waterproofing method, niche location, bench or curb details, and drain style.',
        'For floor tile, show the existing surface, transitions, and any cracks or hollow-sounding tile.',
        'For large-format leveling, send tile dimensions and the longest room sightline so lippage control can be planned.'
      ]
    },
    'popcorn-ceiling-removal-dallas.html': {
      city: 'Dallas / North DFW',
      kicker: 'Popcorn ceiling removal planner',
      title: 'Ceiling removal with asbestos awareness, dust control, and finish planning.',
      intro: 'Dallas-area popcorn removal should be treated as a ceiling system: test when needed, protect the home, remove texture, skim, sand, prime, and finish to smooth or knockdown.',
      focus: 'asbestos-aware ceilings',
      distance: 'route dependent',
      services: ['asbestos testing', 'skim coat', 'smooth ceiling', 'knockdown finish'],
      note: 'Best for pre-1980 homes, listing prep, lighting upgrades, and rooms where old acoustic texture makes the home feel dated.',
      cards: [
        ['Test before mess', 'Older acoustic ceilings may require asbestos testing before scraping or sanding.'],
        ['Finish choice', 'Smooth ceilings look premium but require more skim and sanding than light knockdown.'],
        ['Dust control', 'Containment, floor protection, HVAC awareness, and cleanup define the homeowner experience.']
      ],
      details: [
        ['Best photos', 'Ceiling texture closeup, room size, light fixtures, stains, cracks, and ceiling height.'],
        ['Ask early', 'Smooth versus knockdown, whether lights are changing, and whether the home was built before 1980.'],
        ['Dallas note', 'Older homes with ceiling stains should solve roof, plumbing, or HVAC causes before finish work.']
      ],
      responses: [
        'For asbestos testing, share build year, room count, and whether the texture has been painted before.',
        'For skim coat, send ceiling closeups and light locations because raking light reveals surface quality.',
        'For smooth ceiling finish, expect more prep, sanding, and primer than knockdown; send ceiling height and room size.',
        'For knockdown finish, send examples of the desired texture density so it matches the rest of the home.'
      ]
    }
  };

  function ensureProgress() {
    if (!document.querySelector('.scroll-progress')) {
      var progress = document.createElement('div');
      progress.className = 'scroll-progress';
      progress.setAttribute('aria-hidden', 'true');
      progress.innerHTML = '<span></span>';
      document.body.insertBefore(progress, document.body.firstChild);
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress);
      updateProgress();
    }
  }

  function updateProgress() {
    var bar = document.querySelector('.scroll-progress span');
    if (!bar) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = Math.max(0, Math.min(100, pct)) + '%';
    document.body.classList.toggle('show-mobile-actions', window.scrollY > 360);
  }

  function ensureMobileActions(rel) {
    if (!document.querySelector('link[href*="styles.css"]')) return;
    if (document.querySelector('.mobile-action-bar')) return;
    var bar = document.createElement('div');
    bar.className = 'mobile-action-bar';
    bar.setAttribute('aria-label', 'Quick actions');
    bar.innerHTML = '<a href="#page-enhancement">Tools</a><a href="tel:+13235475086">Call</a><a href="' + rel + 'quote.html">Estimate</a>';
    document.body.appendChild(bar);
  }

  function ensureEstimateFallbackStyles() {
    if (document.querySelector('link[href*="styles.css"]')) return;
    if (document.getElementById('elf-enhance-fallback-style')) return;
    var style = document.createElement('style');
    style.id = 'elf-enhance-fallback-style';
    style.textContent = '.scroll-progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:9999}.scroll-progress span{display:block;width:0;height:100%;background:#d4a02a}.elf-enhance{padding:28px 24px;background:#111;color:#f5f2ec}.elf-enhance .container{max-width:1180px;margin:0 auto}.elf-enhance-shell{border:1px solid rgba(245,242,236,.16);border-radius:12px;background:rgba(255,255,255,.06);padding:24px}.elf-enhance-head{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:20px}.elf-enhance-kicker,.elf-tool-label{font:700 10px/1.2 monospace;letter-spacing:.12em;text-transform:uppercase;color:#d4a02a}.elf-enhance h2{font-size:34px;line-height:1;margin:8px 0 0}.elf-enhance p{color:rgba(245,242,236,.72)}.elf-enhance-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.elf-mini-card,.elf-tool{border:1px solid rgba(245,242,236,.14);border-radius:8px;background:rgba(255,255,255,.06);padding:18px}.elf-mini-card h3{margin:0 0 8px}.elf-tool button,.elf-tool select,.elf-tool input{min-height:42px;border-radius:8px;border:1px solid rgba(245,242,236,.18);background:#1d1d1b;color:#f5f2ec;padding:0 12px}.elf-tool button.active{background:#d4a02a;color:#111}.elf-tool-stack{display:grid;gap:10px}.elf-result{margin-top:14px;padding:14px;border-radius:8px;background:rgba(212,160,42,.14)}@media(max-width:800px){.elf-enhance-head,.elf-enhance-grid{grid-template-columns:1fr}}';
    document.head.appendChild(style);
  }

  function renderPage(config, rel) {
    var section = shell(config);
    section.querySelector('.elf-enhance-grid').innerHTML = cardGrid(config.cards) + renderTool(config.tool, rel);
    insert(section);
    activateTool(section, config.tool, rel);
  }

  function renderService(data, rel) {
    var config = {
      kicker: data.name + ' planner',
      title: 'Plan the ' + data.name.toLowerCase() + ' job before the visit.',
      intro: 'A practical planning layer for scope, prep, budget range, and the questions that make the estimate cleaner.',
      cards: [
        [data.accent, 'The detail that usually controls quality on this service.'],
        ['Timeline', data.timeline + ' depending on access, drying, cure time, materials, and hidden conditions.'],
        ['Best prep', data.prep[0]]
      ]
    };
    var section = shell(config);
    section.querySelector('.elf-enhance-grid').innerHTML =
      '<div class="elf-service-planner">' +
        '<div class="elf-tool-label">Scope selector</div>' +
        '<div class="elf-pill-row" data-service-scope>' + data.scopes.map(function(scope, index){ return '<button type="button" class="' + (index === 0 ? 'active' : '') + '" data-scope-index="' + index + '">' + scope + '</button>'; }).join('') + '</div>' +
        '<label><span class="elf-tool-label">Project size</span><input id="elf-service-size" type="range" min="1" max="5" value="2"></label>' +
        '<label><span class="elf-tool-label">Complexity</span><select id="elf-service-complexity"><option value="1">Straightforward</option><option value="1.35">Moderate prep</option><option value="1.75">Heavy prep / detail</option></select></label>' +
      '</div>' +
      '<div class="elf-tool elf-service-result" aria-live="polite"></div>';
    insert(section);
    activateService(section, data, rel);
  }

  function renderLocation(data, rel) {
    var cards = data.cards || [
      ['Local focus', data.focus],
      ['Distance', data.distance + ' from Denton routing'],
      ['Good fit', data.note]
    ];
    var config = {
      kicker: data.kicker || data.city + ' field notes',
      title: data.title || 'A local planning view for ' + data.city + ' homes.',
      intro: data.intro || 'Each city has its own home age, finish expectations, and project rhythm. This panel turns that context into action.',
      cards: cards
    };
    var detailHtml = data.details ? '<div class="elf-local-facts">' + data.details.map(function(item){
      return '<div class="elf-local-fact"><strong>' + esc(item[0]) + '</strong><span>' + esc(item[1]) + '</span></div>';
    }).join('') + '</div>' : '';
    var section = shell(config);
    section.querySelector('.elf-enhance-grid').innerHTML =
      '<div class="elf-location-left">' +
        cardGrid(config.cards) +
        '<div class="elf-location-map">' +
          '<div class="elf-tool-label">Top local requests</div>' +
          '<div class="elf-tag-grid">' + data.services.map(function(item, index){ return '<button type="button" data-local-service-index="' + index + '">' + esc(item) + '</button>'; }).join('') + '</div>' +
          '<div class="elf-local-note">' + esc(data.note) + '</div>' +
          detailHtml +
        '</div>' +
      '</div>' +
      '<div class="elf-tool"><div class="elf-tool-label">Best first message</div><p id="elf-location-result">' + esc(data.message || ('Tell us the city, neighborhood, service, photos, and ideal timing. For ' + data.city + ', mention any HOA, access, or finish expectations up front.')) + '</p><a class="elf-tool-link" href="' + rel + 'quote.html">Start estimate</a></div>';
    insert(section);
    section.querySelectorAll('[data-local-service-index]').forEach(function(button){
      button.addEventListener('click', function(){
        var index = Number(button.getAttribute('data-local-service-index'));
        var response = data.responses && data.responses[index] ? data.responses[index] : 'For ' + data.city + ' ' + button.textContent + ', send photos, rough dimensions, neighborhood, timeline, and any HOA or access requirements.';
        section.querySelectorAll('[data-local-service-index]').forEach(function(item){ item.classList.toggle('active', item === button); });
        section.querySelector('#elf-location-result').textContent = response;
      });
    });
  }

  function shell(config) {
    var section = document.createElement('section');
    section.className = 'elf-enhance';
    section.id = 'page-enhancement';
    section.innerHTML =
      '<div class="container">' +
        '<div class="elf-enhance-shell reveal in">' +
          '<div class="elf-enhance-head">' +
            '<div><div class="elf-enhance-kicker">' + esc(config.kicker) + '</div><h2>' + esc(config.title) + '</h2></div>' +
            '<p>' + esc(config.intro) + '</p>' +
          '</div>' +
          '<div class="elf-enhance-grid"></div>' +
        '</div>' +
      '</div>';
    return section;
  }

  function cardGrid(cards) {
    return '<div class="elf-mini-grid">' + cards.map(function(card){
      return '<div class="elf-mini-card"><span></span><h3>' + esc(card[0]) + '</h3><p>' + esc(card[1]) + '</p></div>';
    }).join('') + '</div>';
  }

  function renderTool(tool) {
    if (tool.type === 'checklist') {
      return '<div class="elf-tool" data-tool="checklist"><div class="elf-tool-title">' + esc(tool.title) + '</div><div class="elf-progress"><span></span></div><p class="elf-tool-copy">0% complete</p><div class="elf-tool-stack">' + tool.items.map(function(item, index){
        return '<label class="elf-check-line"><input type="checkbox" data-check-index="' + index + '"><span>' + esc(item) + '</span></label>';
      }).join('') + '</div></div>';
    }
    if (tool.type === 'search') {
      return '<div class="elf-tool" data-tool="search"><div class="elf-tool-title">' + esc(tool.title) + '</div><input class="elf-search" type="search" placeholder="' + esc(tool.placeholder) + '"><div class="elf-search-results"></div></div>';
    }
    if (tool.type === 'calculator') {
      return '<div class="elf-tool" data-tool="calculator"><div class="elf-tool-title">' + esc(tool.title) + '</div><label><span class="elf-tool-label">Scope</span><select class="elf-calc-scope">' + tool.labels.map(function(label, index){ return '<option value="' + index + '">' + esc(label) + '</option>'; }).join('') + '</select></label><label><span class="elf-tool-label">Complexity</span><input class="elf-calc-complexity" type="range" min="1" max="4" value="2"></label><div class="elf-result"></div></div>';
    }
    return '<div class="elf-tool" data-tool="picker"><div class="elf-tool-title">' + esc(tool.title) + '</div><div class="elf-pill-row">' + tool.options.map(function(option, index){
      return '<button type="button" class="' + (index === 0 ? 'active' : '') + '" data-pick="' + index + '">' + esc(option[0]) + '</button>';
    }).join('') + '</div><div class="elf-result"></div></div>';
  }

  function activateTool(section, tool, rel) {
    if (!tool) return;
    if (tool.type === 'picker') {
      var result = section.querySelector('.elf-result');
      function setPick(index) {
        var option = tool.options[index];
        section.querySelectorAll('[data-pick]').forEach(function(button){ button.classList.toggle('active', button.getAttribute('data-pick') === String(index)); });
        result.innerHTML = '<strong>' + esc(option[0]) + '</strong><p>' + esc(option[1]) + '</p><a class="elf-tool-link" href="' + rel + 'quote.html">Use this path</a>';
      }
      section.querySelectorAll('[data-pick]').forEach(function(button){
        button.addEventListener('click', function(){ setPick(button.getAttribute('data-pick')); });
      });
      setPick(0);
    }
    if (tool.type === 'checklist') {
      var key = 'elfEnhance:' + tool.storage;
      var checks = section.querySelectorAll('[data-check-index]');
      var saved = read(key);
      checks.forEach(function(check){
        check.checked = saved.indexOf(Number(check.getAttribute('data-check-index'))) !== -1;
        check.addEventListener('change', updateChecks);
      });
      updateChecks();
      function updateChecks() {
        var done = [];
        checks.forEach(function(check){
          var line = check.closest('.elf-check-line');
          line.classList.toggle('done', check.checked);
          if (check.checked) done.push(Number(check.getAttribute('data-check-index')));
        });
        localStorage.setItem(key, JSON.stringify(done));
        var pct = checks.length ? Math.round((done.length / checks.length) * 100) : 0;
        section.querySelector('.elf-progress span').style.width = pct + '%';
        section.querySelector('.elf-tool-copy').textContent = pct + '% complete';
      }
    }
    if (tool.type === 'search') {
      var input = section.querySelector('.elf-search');
      var results = section.querySelector('.elf-search-results');
      function renderSearch() {
        var q = input.value.trim().toLowerCase();
        var matches = tool.items.filter(function(item){ return !q || (item[0] + ' ' + item[1]).toLowerCase().indexOf(q) !== -1; });
        results.innerHTML = matches.map(function(item){ return '<div class="elf-search-item"><strong>' + esc(item[0]) + '</strong><p>' + esc(item[1]) + '</p></div>'; }).join('') || '<div class="elf-search-item"><strong>No match</strong><p>Try a broader word or send the question with photos.</p></div>';
      }
      input.addEventListener('input', renderSearch);
      renderSearch();
    }
    if (tool.type === 'calculator') {
      var scope = section.querySelector('.elf-calc-scope');
      var complexity = section.querySelector('.elf-calc-complexity');
      var result = section.querySelector('.elf-result');
      function updateCalc() {
        var index = Number(scope.value);
        var mult = tool.multipliers[index] * (0.82 + Number(complexity.value) * 0.18);
        var low = tool.base * mult;
        var high = low * 1.65;
        result.innerHTML = '<strong>' + esc(tool.labels[index]) + '</strong><p>Planning range: ' + money(low) + ' - ' + money(high) + '. Final quote depends on access, prep, materials, and finish expectations.</p><a class="elf-tool-link" href="' + rel + 'quote.html">Request firm quote</a>';
      }
      scope.addEventListener('change', updateCalc);
      complexity.addEventListener('input', updateCalc);
      updateCalc();
    }
  }

  function activateService(section, data, rel) {
    var scopeIndex = 0;
    var size = section.querySelector('#elf-service-size');
    var complexity = section.querySelector('#elf-service-complexity');
    var result = section.querySelector('.elf-service-result');
    function update() {
      var sizeValue = Number(size.value);
      var complexityValue = Number(complexity.value);
      var base = data.base * (0.7 + sizeValue * 0.42) * complexityValue * (1 + scopeIndex * 0.16);
      result.innerHTML = '<div class="elf-tool-title">' + esc(data.name) + ' planning range</div><h3>' + money(base) + ' - ' + money(base * 1.72) + '</h3><p>For a ' + esc(data.scopes[scopeIndex]) + ' ' + esc(data.unit) + '. Typical timeline: ' + esc(data.timeline) + '.</p><div class="elf-prep-list">' + data.prep.map(function(item){ return '<span>' + esc(item) + '</span>'; }).join('') + '</div><a class="elf-tool-link" href="' + rel + 'quote.html">Get firm ' + esc(data.name) + ' quote</a>';
    }
    section.querySelectorAll('[data-scope-index]').forEach(function(button){
      button.addEventListener('click', function(){
        scopeIndex = Number(button.getAttribute('data-scope-index'));
        section.querySelectorAll('[data-scope-index]').forEach(function(item){ item.classList.toggle('active', item === button); });
        update();
      });
    });
    size.addEventListener('input', update);
    complexity.addEventListener('change', update);
    update();
  }

  function insert(section) {
    var anchor = document.querySelector('.trust-bar') || document.querySelector('.page-hero') || document.querySelector('.topbar');
    if (!anchor || !anchor.parentNode) return;
    anchor.parentNode.insertBefore(section, anchor.nextSibling);
  }

  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
      return [];
    }
  }

  function money(value) {
    return '$' + Math.round(value).toLocaleString('en-US');
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function(char){
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }
})();
