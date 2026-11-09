/* Original, local SVG scenes. Only selected differences change in picture B. */
(function (root) {
  'use strict';
  const WIDTH = 800;
  const HEIGHT = 560;
  const scenes = {
    kopitiam: {
      title: 'A morning at the kopitiam', caption: 'A FAMILIAR LITTLE COFFEE BREAK',
      description: 'A sunny coffee shop with a hanging lamp, a wall clock, breakfast on a wooden table, a vase and a green chair.',
      differences: [
        { id: 'lamp', label: 'The hanging lamp changes from a curved shade to a pointed shade.', hint: 'Compare the shape of the hanging lamp.', bounds: [75, 45, 145, 115] },
        { id: 'clock', label: 'The clock reads three o’clock in A and six o’clock in B.', hint: 'Look at the hands of the wall clock.', bounds: [610, 35, 115, 115] },
        { id: 'buns', label: 'There are two buns on the plate in A and three in B.', hint: 'Count the buns on the plate.', bounds: [135, 275, 160, 80] },
        { id: 'flower', label: 'The flower and its stem are missing from the vase in B.', hint: 'Compare what is inside the vase.', bounds: [410, 200, 95, 110] },
        { id: 'chair', label: 'The green chair on the right is missing in B.', hint: 'Look beside the table, near the floor.', bounds: [605, 330, 130, 200] }
      ]
    },
    park: {
      title: 'A little walk in the park', caption: 'FRESH AIR & FAMILIAR SIGHTS',
      description: 'A neighbourhood park with sunshine, an orange tree, a flying kite, a wooden bench and a ball on the grass.',
      differences: [
        { id: 'sun', label: 'The sun in A is replaced by a cloud in B.', hint: 'Compare the sky in the top-left corner.', bounds: [35, 30, 140, 135] },
        { id: 'kite', label: 'The kite and its string are missing in B.', hint: 'Look high above the bench.', bounds: [550, 30, 125, 180] },
        { id: 'fruit', label: 'The three oranges on the tree are missing in B.', hint: 'Look among the leaves of the tree.', bounds: [85, 170, 220, 120] },
        { id: 'bench', label: 'The middle backrest slat of the bench is missing in B.', hint: 'Compare the wooden backrest of the bench.', bounds: [360, 300, 225, 110] },
        { id: 'ball', label: 'The ball has a star in A and stripes in B.', hint: 'Look at the pattern on the ball.', bounds: [595, 405, 115, 115] }
      ]
    },
    home: {
      title: 'A cosy afternoon at home', caption: 'EVERYDAY THINGS, LITTLE SURPRISES',
      description: 'A cosy living room with a framed picture, books on a shelf, a sofa and cushions, slippers on a rug and a leafy plant.',
      differences: [
        { id: 'picture', label: 'The framed picture has a sun in A and a crescent moon in B.', hint: 'Look inside the picture on the wall.', bounds: [65, 65, 150, 130] },
        { id: 'books', label: 'There are three books on the shelf in A and two in B.', hint: 'Count the books on the wall shelf.', bounds: [330, 65, 150, 110] },
        { id: 'cushion', label: 'The right-hand sofa cushion is square in A and round in B.', hint: 'Compare the cushion on the right side of the sofa.', bounds: [265, 290, 115, 115] },
        { id: 'slippers', label: 'The pair of slippers on the rug is missing in B.', hint: 'Look on the rug, in front of the sofa.', bounds: [390, 435, 140, 85] },
        { id: 'plant', label: 'The plant has five leaves in A and three in B.', hint: 'Count the large leaves on the plant.', bounds: [570, 255, 170, 150] }
      ]
    },
    market: {
      title: 'A morning at the market', caption: 'FRESH FINDS & FRIENDLY FACES',
      description: 'A cheerful market stall with a striped awning, a fruit badge, a hanging lantern, oranges, a weighing scale and a shopping basket.',
      differences: [
        { id: 'badge', label: 'The fruit badge shows an apple in A and a pear in B.', hint: 'Compare the fruit picture on the awning.', bounds: [75, 30, 110, 115] },
        { id: 'lantern', label: 'The hanging lantern is round in A and rectangular in B.', hint: 'Compare the shape of the lantern on the right.', bounds: [630, 110, 105, 140] },
        { id: 'oranges', label: 'There are four oranges in the crate in A and three in B.', hint: 'Count the oranges in the left-hand crate.', bounds: [60, 255, 185, 100] },
        { id: 'scale', label: 'The weighing scale’s needle points up in A and right in B.', hint: 'Look at the needle inside the weighing scale.', bounds: [435, 205, 125, 125] },
        { id: 'basket', label: 'The shopping basket on the ground is missing in B.', hint: 'Look on the ground in front of the stall.', bounds: [570, 375, 165, 160] }
      ]
    },
    seaside: {
      title: 'A breezy day by the sea', caption: 'SEA BREEZES & SUNNY LITTLE DETAILS',
      description: 'A seaside scene with seabirds, a lighthouse, a sailing boat, a beach umbrella, a deckchair and a bucket on the sand.',
      differences: [
        { id: 'birds', label: 'There are two seabirds in A and three in B.', hint: 'Count the seabirds in the top-left sky.', bounds: [40, 55, 195, 100] },
        { id: 'window', label: 'The lighthouse window is round in A and square in B.', hint: 'Compare the window near the top of the lighthouse.', bounds: [640, 100, 100, 100] },
        { id: 'sail', label: 'The boat has one sail in A and two in B.', hint: 'Compare both sides of the boat’s mast.', bounds: [390, 140, 190, 195] },
        { id: 'deckchair', label: 'The beach deckchair is missing in B.', hint: 'Look beneath the umbrella, on the left.', bounds: [45, 365, 145, 170] },
        { id: 'bucket', label: 'The sand bucket has a handle in A but no handle in B.', hint: 'Look above the rim of the bucket.', bounds: [595, 375, 130, 160] }
      ]
    },
    kitchen: {
      title: 'Something nice in the kitchen', caption: 'A LITTLE COMFORT, CLOSE TO HOME',
      description: 'A sunny kitchen with a decorative wall plate, a kettle, jars on the counter, a fruit bowl and a tea towel.',
      differences: [
        { id: 'plate', label: 'The wall plate has a flower in A and stripes in B.', hint: 'Compare the pattern on the plate on the wall.', bounds: [305, 45, 115, 115] },
        { id: 'kettle', label: 'The kettle on the left of the counter is missing in B.', hint: 'Look on the counter below the window.', bounds: [60, 220, 175, 140] },
        { id: 'jars', label: 'There are three storage jars in A and two in B.', hint: 'Count the jars standing on the counter.', bounds: [260, 230, 180, 120] },
        { id: 'bananas', label: 'The bananas in the fruit bowl are missing in B.', hint: 'Look at the fruit behind the apples.', bounds: [565, 225, 175, 130] },
        { id: 'towel', label: 'The tea towel has a diamond in A and stripes in B.', hint: 'Compare the pattern on the hanging tea towel.', bounds: [430, 365, 115, 150] }
      ]
    },
    garden: {
      title: 'A little time in the garden', caption: 'GROWING THINGS & LITTLE DISCOVERIES',
      description: 'A community garden with a birdhouse, a butterfly, a sunflower in a raised bed, a watering can and gardening boots.',
      differences: [
        { id: 'birdhouse', label: 'The birdhouse entrance is round in A and heart-shaped in B.', hint: 'Compare the entrance to the birdhouse.', bounds: [65, 25, 145, 155] },
        { id: 'butterfly', label: 'The butterfly above the plants is missing in B.', hint: 'Look in the sky above the raised garden bed.', bounds: [420, 45, 125, 120] },
        { id: 'sunflower', label: 'The tall sunflower is missing in B.', hint: 'Look for the tallest flower in the garden bed.', bounds: [260, 160, 135, 205] },
        { id: 'watering-can', label: 'The watering can on the ground is missing in B.', hint: 'Look on the ground to the left of the garden bed.', bounds: [30, 385, 195, 150] },
        { id: 'boots', label: 'There are two gardening boots in A and one in B.', hint: 'Count the boots beside the garden bed.', bounds: [570, 380, 180, 155] }
      ]
    },
    busstop: {
      title: 'At the neighbourhood bus stop', caption: 'FAMILIAR STOPS, FRESH LITTLE SURPRISES',
      description: 'A neighbourhood bus stop with a bus sign, a bird on the shelter, a newspaper on the bench, a litter bin and a red bus.',
      differences: [
        { id: 'sign', label: 'The bus stop sign is round in A and square in B.', hint: 'Compare the shape of the bus stop sign.', bounds: [50, 35, 125, 130] },
        { id: 'bird', label: 'The bird perched on the shelter roof is missing in B.', hint: 'Look just above the shelter roof.', bounds: [375, 55, 115, 100] },
        { id: 'newspaper', label: 'The newspaper on the bench is missing in B.', hint: 'Look at what is lying on the waiting bench.', bounds: [265, 285, 155, 115] },
        { id: 'bin', label: 'The litter bin beside the sign is missing in B.', hint: 'Look below the bus stop sign, near the ground.', bounds: [50, 355, 125, 135] },
        { id: 'wheel', label: 'The bus wheel hub is a circle in A and a star in B.', hint: 'Look at the centre of the bus wheel.', bounds: [610, 385, 125, 115] }
      ]
    }
  };

  function flower(x, y, colour = '#d16653') {
    return `<g transform="translate(${x} ${y})"><path d="M0 12v57m0-23q-25-22-27-1 14 12 27 1" stroke="#4f7d56" stroke-width="7" fill="none"/><g fill="${colour}" stroke="none"><ellipse cy="-15" rx="12" ry="18"/><ellipse cy="15" rx="12" ry="18"/><ellipse cx="-15" rx="18" ry="12"/><ellipse cx="15" rx="18" ry="12"/></g><circle r="10" fill="#f4d47b" stroke="none"/></g>`;
  }

  function kopitiam(changed) {
    return `<rect width="800" height="560" fill="#f4e8d2"/>
      <path d="M0 390h800v170H0Z" fill="#e1c9a7" stroke="none"/>
      <path d="M0 390h800M0 470h800M80 390 35 560m240-170-15 170m240-170 15 170m240-170 45 170" stroke="#c6ac87" stroke-width="3"/>
      <rect x="277" y="130" width="268" height="216" rx="8" fill="#a8c6ae"/>
      <rect x="290" y="143" width="242" height="190" rx="3" fill="#d9e9df" stroke="none"/>
      <path d="M292 274q60-56 120-8t120-12v79H292Z" fill="#b6cfad" stroke="none"/>
      <path d="M411 141v195m-124-103h249" stroke="#6f8f77" stroke-width="9"/>
      <rect x="315" y="43" width="190" height="60" rx="12" fill="#1e6654" stroke="none"/>
      <text x="410" y="84" text-anchor="middle" font-family="Georgia,serif" font-size="33" font-weight="bold" fill="#fff5d8" stroke="none" letter-spacing="5">KOPI</text>
      <path d="M146 0v63" stroke="#785b45" stroke-width="7"/>
      ${changed.has('lamp') ? '<path d="m146 60-60 83h120Z" fill="#d9874c"/>' : '<path d="M86 143a60 76 0 0 1 120 0Z" fill="#d9874c"/>'}
      <ellipse cx="146" cy="143" rx="60" ry="10" fill="#f8d48d"/>
      <circle cx="667" cy="91" r="50" fill="#567f6b" stroke="none"/><circle cx="667" cy="91" r="42" fill="#fffbec"/>
      <path d="M667 56v5m35 30h-5m-30 35v-5m-35-30h5" stroke="#627765" stroke-width="4"/>
      <path d="M667 65v26${changed.has('clock') ? 'v26' : 'h26'}" stroke="#334e43" stroke-width="7" fill="none"/>
      <circle cx="667" cy="91" r="5" fill="#334e43" stroke="none"/>
      <rect x="40" y="211" width="145" height="24" rx="6" fill="#b87b51" stroke="none"/>
      <path d="M63 211v-46m0 29q-28-25-30-6 10 14 30 6m0-11q28-28 29-9-10 15-29 9" stroke="#4e7851" stroke-width="7" fill="none"/>
      <path d="m43 192 6 22h29l6-22" fill="#d2916b"/>
      <path d="M133 176h29v36h-29Z" fill="#f8f2de"/><path d="M161 182q25-3 19 16-6 10-19 3" fill="none"/>
      <ellipse cx="332" cy="501" rx="255" ry="27" fill="#cfb58f" stroke="none"/>
      <path d="M131 367v140m387-140v140" stroke="#7f5940" stroke-width="22"/>
      <rect x="93" y="350" width="478" height="30" rx="10" fill="#bf8656"/>
      <path d="M110 359h440" stroke="#e0ac76" stroke-width="4"/>
      <ellipse cx="213" cy="338" rx="83" ry="16" fill="#faf8e9"/>
      <g fill="#e4b16a"><path d="M152 329q0-62 53-43 23 10 21 43Z"/><path d="M210 329q0-62 53-43 23 10 21 43Z"/>${changed.has('buns') ? '<path d="M181 340q0-57 53-40 22 9 20 40Z"/>' : ''}</g>
      <path d="m171 301 10-7m50 7 10-7" stroke="#f9db9f" stroke-width="5"/>
      <ellipse cx="345" cy="339" rx="50" ry="11" fill="#f7f4e6"/>
      <path d="M310 292h63v37q-31 27-63 0Z" fill="#fffbef"/>
      <path d="M374 300h12q24 16-12 28" fill="none" stroke-width="6"/>
      <ellipse cx="342" cy="293" rx="31" ry="9" fill="#684833"/>
      <path d="M331 273q-8-10 0-20m20 20q-8-10 0-20" stroke="#a58d70" stroke-width="4" fill="none"/>
      ${changed.has('flower') ? '' : flower(456, 240)}
      <path d="M429 304h54l-7 40h-40Z" fill="#76a29b"/><ellipse cx="456" cy="305" rx="27" ry="6" fill="#a7c7bc"/>
      ${changed.has('chair') ? '' : '<g fill="#558773"><rect x="620" y="341" width="95" height="93" rx="15"/><path d="M634 434v79m65-79v79" stroke="#426e5a" stroke-width="12"/><path d="M642 359v55m25-55v55m25-55v55" stroke="#a7c3a1" stroke-width="7"/><rect x="609" y="428" width="117" height="20" rx="7"/></g>'}
      <path d="M35 549h730" stroke="#b89b77" stroke-width="3"/>`;
  }

  function park(changed) {
    return `<rect width="800" height="560" fill="#dfefe7"/>
      <g fill="#b6cfc5" stroke="none"><rect x="322" y="160" width="105" height="170" rx="8"/><rect x="445" y="195" width="100" height="135" rx="8"/><rect x="680" y="167" width="120" height="163" rx="8"/></g>
      <path d="M341 183h65m-65 28h65m-65 28h65m61-21h57m-57 25h57m166-51h70m-70 29h70m-70 29h70" stroke="#e6f0df" stroke-width="11"/>
      <path d="M0 343q180-85 380-12t420-17v246H0Z" fill="#a4bc85" stroke="none"/>
      <path d="M800 382q-460 25-390 178H223q-8-184 577-206" fill="#e6cda4" stroke="none"/>
      ${changed.has('sun') ? '<path d="M56 111q-14-33 17-39 14-42 47-19 35-6 40 29 29 31-9 42H73q-18-1-17-13Z" fill="#fffdf0" stroke="none"/>' : '<g stroke="#e6b45c" stroke-width="7"><path d="M105 34v13m0 89v13M49 92H36m125 0h13M66 53l10 10m59 59 10 10m0-79-10 10m-59 59-10 10"/><circle cx="105" cy="92" r="35" fill="#f3ca76" stroke="none"/></g>'}
      <path d="M294 76q18-20 35 0m20 0q18-20 35 0" stroke="#78998a" stroke-width="5" fill="none"/>
      ${changed.has('kite') ? '' : '<g><path d="m610 43 44 48-44 48-44-48Z" fill="#dc805b"/><path d="m610 43 0 96m-44-48h88" stroke="#fff1cb" stroke-width="4"/><path d="M610 139q-25 19-8 32t-13 31" stroke="#816b50" stroke-width="3" fill="none"/><path d="m601 165-15-4 6 13m4 16 16-4-7 14" fill="#e7b65f" stroke="none"/></g>'}
      <ellipse cx="188" cy="431" rx="115" ry="18" fill="#8ca971" stroke="none"/>
      <path d="M174 236v180h42V235Z" fill="#a6794e"/><path d="m194 322-43-47m44 15 48-52" stroke="#a6794e" stroke-width="18"/>
      <path d="M72 238q-17-55 26-74-13-67 62-68 55-44 100 14 67-4 60 65 48 46 4 80-5 40-68 32-48 38-84 0-66 25-100-49Z" fill="#568766" stroke="none"/>
      <path d="M104 164q17-24 45-22m61-13q32 2 42 28" stroke="#86a775" stroke-width="9" fill="none"/>
      ${changed.has('fruit') ? '' : '<g fill="#f1b352" stroke="#a16a36" stroke-width="2"><circle cx="129" cy="218" r="19"/><circle cx="215" cy="191" r="19"/><circle cx="268" cy="244" r="19"/><path d="m129 197 9-8m77 0 9-8m44 61 9-8" stroke="#d8e2a6" stroke-width="5"/></g>'}
      <ellipse cx="475" cy="443" rx="139" ry="15" fill="#c2ad88" stroke="none"/>
      <path d="M387 359v82m164-82v82" stroke="#546a56" stroke-width="15"/>
      <g fill="#c38b55"><rect x="366" y="312" width="211" height="23" rx="5"/>${changed.has('bench') ? '' : '<rect x="366" y="345" width="211" height="23" rx="5"/>'}<rect x="366" y="378" width="211" height="23" rx="5"/><rect x="355" y="401" width="235" height="18" rx="6"/></g>
      <path d="M368 414v35m205-35v35" stroke="#546a56" stroke-width="12"/>
      <path d="m46 481 7-21 8 21m682-95 7-21 8 21m-470 67 7-21 8 21m-16 75 7-21 8 21" stroke="#6e8e59" stroke-width="4" fill="none"/>
      <ellipse cx="651" cy="511" rx="60" ry="12" fill="#8ca971" stroke="none"/><circle cx="651" cy="460" r="45" fill="#f4d17e"/>
      ${changed.has('ball') ? '<path d="M621 432h60m-72 28h84m-72 28h60" stroke="#ca7058" stroke-width="12"/>' : '<path d="m651 430 9 19 21 3-15 15 4 21-19-10-19 10 4-21-15-15 21-3Z" fill="#c66d54" stroke="none"/>'}`;
  }

  function home(changed) {
    return `<rect width="800" height="560" fill="#eee6d8"/>
      <path d="M0 411h800v149H0Z" fill="#d7bc97" stroke="none"/><path d="M0 410h800" stroke="#bfa27c" stroke-width="8"/>
      <path d="M0 479h800m-650-65-30 146m250-146-8 146m240-146 18 146" stroke="#c6a982" stroke-width="3"/>
      <rect x="65" y="65" width="150" height="130" rx="5" fill="#b98055"/>
      <rect x="78" y="78" width="124" height="104" fill="#e2ede2" stroke="none"/>
      <path d="m78 175 38-35 24 18 24-36 38 53v7H78Z" fill="#7da48a" stroke="none"/>
      ${changed.has('picture') ? '<path d="M154 97a23 23 0 1 0 22 30 23 23 0 0 1-22-30Z" fill="#bd8557" stroke="none"/>' : '<circle cx="160" cy="111" r="22" fill="#e4b25e" stroke="none"/>'}
      <rect x="526" y="45" width="223" height="209" rx="7" fill="#6c9887"/>
      <rect x="539" y="58" width="197" height="183" fill="#daebe3" stroke="none"/>
      <g fill="#b3cabb" stroke="none"><rect x="555" y="146" width="70" height="95"/><rect x="654" y="118" width="64" height="123"/></g>
      <path d="M569 165h40m-40 23h40m60-48h33m-33 23h33m-33 23h33" stroke="#eef0dc" stroke-width="8"/>
      <path d="M637 55v189M536 151h205" stroke="#6c9887" stroke-width="8"/>
      <path d="M511 42h33v224l-20-21-20 21Zm225 0h33l8 224-20-21-21 21Z" fill="#d9a07b" stroke="none"/>
      <rect x="313" y="163" width="183" height="17" rx="5" fill="#b98155" stroke="none"/>
      <g stroke-width="2"><rect x="341" y="83" width="29" height="80" rx="3" fill="#749b8a"/><rect x="375" y="99" width="29" height="64" rx="3" fill="#d29b59"/>${changed.has('books') ? '' : '<rect x="409" y="75" width="29" height="88" rx="3" fill="#bf7461"/>'}<path d="M348 95h15m-15 53h15m19-38h15m-15 37h15" stroke="#efe6cb" stroke-width="4"/></g>
      <path d="M459 127q-22-25-17-37 24-2 22 33m0-3q5-31 23-28 3 23-23 28" fill="#688d63" stroke="none"/>
      <path d="m448 134 5 29h22l5-29Z" fill="#d7b780"/>
      <ellipse cx="421" cy="496" rx="302" ry="52" fill="#eee0bb" stroke="none"/><ellipse cx="421" cy="496" rx="268" ry="36" fill="none" stroke="#c9ae7b" stroke-width="3"/>
      <path d="M92 419v37m315-37v37" stroke="#836343" stroke-width="14"/>
      <rect x="87" y="275" width="324" height="144" rx="38" fill="#8aa896"/>
      <rect x="69" y="359" width="364" height="81" rx="22" fill="#6e9582"/>
      <rect x="65" y="323" width="48" height="104" rx="18" fill="#8aa896"/><rect x="390" y="323" width="48" height="104" rx="18" fill="#8aa896"/>
      <path d="M120 403h261m-132-124v111" stroke="#567e6b" stroke-width="4"/>
      <rect x="123" y="305" width="93" height="80" rx="13" fill="#f0d18b" transform="rotate(-8 170 345)"/>
      <path d="m151 323 22 39 18-39" stroke="#bc9859" stroke-width="5" fill="none"/>
      ${changed.has('cushion') ? '<circle cx="324" cy="347" r="46" fill="#cf8b71"/><circle cx="324" cy="347" r="6" fill="#ac6c59" stroke="none"/>' : '<rect x="278" y="301" width="91" height="91" rx="12" fill="#cf8b71" transform="rotate(8 324 347)"/><path d="m298 322 48 50m0-50-48 50" stroke="#e9b69a" stroke-width="4"/>'}
      ${changed.has('slippers') ? '' : '<g fill="#d4a05e" transform="rotate(-12 459 478)"><rect x="404" y="449" width="44" height="65" rx="19"/><rect x="467" y="449" width="44" height="65" rx="19"/><path d="M406 472q20-21 39 0m25 0q20-21 39 0" stroke="#f5d7a3" stroke-width="13" fill="none"/></g>'}
      <ellipse cx="652" cy="466" rx="78" ry="17" fill="#c3a77d" stroke="none"/>
      <path d="M650 403V286m0 82-48-47m48 31 47-63" stroke="#50745b" stroke-width="7" fill="none"/>
      <g fill="#668b60" stroke="none"><path d="M650 316q-39-59 4-62 37 21-4 62Z"/><path d="M621 345q-72 4-48-40 39-17 48 40Z"/><path d="M674 324q-10-66 41-52 23 35-41 52Z"/>${changed.has('plant') ? '' : '<path d="M645 383q-69 9-58-33 39-28 58 33Zm17-14q9-69 52-37 7 42-52 37Z"/>'}</g>
      <path d="m611 399 12 61h59l12-61Z" fill="#bb7957"/><ellipse cx="652" cy="400" rx="42" ry="9" fill="#d99d78"/>
      <path d="M629 416h46" stroke="#e8bb8b" stroke-width="5"/>`;
  }

  function market(changed) {
    return `<rect width="800" height="560" fill="#f1e5cf"/>
      <path d="M0 420h800v140H0Z" fill="#ddc6a3" stroke="none"/><path d="M0 495h800m-620-75-20 140m260-140v140m240-140 20 140" stroke="#c5ab86" stroke-width="3"/>
      <path d="M45 107v330m710-330v330" stroke="#9b7953" stroke-width="13"/>
      <path d="M25 21h750v101H25Z" fill="#d58a6b" stroke="none"/>
      <path d="M25 21h94v101H25Zm188 0h94v101h-94Zm188 0h94v101h-94Zm188 0h94v101h-94Z" fill="#f6e6ba" stroke="none"/>
      <path d="M25 121q47 36 94 0 47 36 94 0 47 36 94 0 47 36 94 0 47 36 94 0 47 36 94 0 47 36 94 0 46 36 92 0" fill="#d58a6b" stroke="#ad7356" stroke-width="3"/>
      <rect x="286" y="51" width="247" height="68" rx="12" fill="#326d59" stroke="none"/><text x="409" y="96" text-anchor="middle" font-family="Georgia,serif" font-size="33" letter-spacing="3" fill="#fff5d8" stroke="none">MARKET</text>
      <circle cx="130" cy="84" r="47" fill="#fff3d5" stroke="#b58e59"/>
      ${changed.has('badge') ? '<path d="M126 57q-16 3-12 23-29 32-6 40 38 13 45-15 2-15-17-28 7-20-10-20Z" fill="#dbb84f"/>' : '<path d="M130 75q-28-21-34 10-5 38 23 34 12-6 22 0 27-6 20-35-8-26-31-9Z" fill="#ce745b"/>'}
      <path d="m130 65 6-15m-2 10q18-16 21-4-7 10-21 4" fill="#638559" stroke="#638559" stroke-width="4"/>
      <path d="M680 120v21m0 79v21m-12-13v14m24-14v14" stroke="#a67441" stroke-width="4"/>
      ${changed.has('lantern') ? '<rect x="647" y="141" width="66" height="79" rx="6" fill="#d98d62"/><path d="M658 148v65m44-65v65" stroke="#f2c78a" stroke-width="5"/>' : '<ellipse cx="680" cy="180" rx="35" ry="40" fill="#d98d62"/><ellipse cx="680" cy="180" rx="19" ry="40" fill="none" stroke="#f2c78a" stroke-width="5"/>'}
      <path d="M664 140h32m-32 80h32" stroke="#a67441" stroke-width="5"/>
      <path d="M82 238h309" stroke="#bc9d74" stroke-width="8"/><g fill="#e0b578" stroke-width="2"><rect x="94" y="187" width="44" height="50" rx="8"/><rect x="159" y="193" width="44" height="44" rx="8"/><rect x="224" y="184" width="44" height="53" rx="8"/></g>
      <g fill="#f0b754" stroke="#a7763d" stroke-width="2"><circle cx="94" cy="310" r="23"/><circle cx="133" cy="299" r="23"/><circle cx="172" cy="310" r="23"/>${changed.has('oranges') ? '' : '<circle cx="211" cy="299" r="23"/>'}</g>
      <path d="M55 329h200v40H55Z" fill="#bc8858"/><path d="M67 344h176m-176 13h176" stroke="#e2ba83" stroke-width="5"/>
      <g fill="#759565" stroke="none"><path d="M296 335q-62-71-22-75 29 13 22 75Zm20 0q-25-96 13-83 23 27-13 83Zm18 0q23-89 44-58 9 30-44 58Z"/><path d="M361 339q6-64 33-42 8 21-33 42Z"/></g>
      <path d="M278 331h127l-10 37H288Z" fill="#d8ba7f"/>
      <path d="M452 322h94l10 39H442Z" fill="#72978b"/><path d="M488 300v32h23v-32" fill="#72978b"/>
      <circle cx="499" cy="266" r="49" fill="#75978a"/><circle cx="499" cy="266" r="39" fill="#fff8e6"/><path d="M499 232v7m-33 27h7m59 0h-7" stroke="#75978a" stroke-width="4"/>
      <path d="${changed.has('scale') ? 'M499 266h27' : 'M499 266v-27'}" stroke="#b46a49" stroke-width="7"/><circle cx="499" cy="266" r="5" fill="#b46a49" stroke="none"/>
      <g fill="#f3e5c3" stroke="#b59b72" stroke-width="2"><ellipse cx="596" cy="329" rx="16" ry="22"/><ellipse cx="631" cy="329" rx="16" ry="22"/><ellipse cx="666" cy="329" rx="16" ry="22"/><ellipse cx="701" cy="329" rx="16" ry="22"/></g><path d="M577 346h144v20H577Z" fill="#bc8858"/>
      <rect x="35" y="363" width="730" height="83" rx="6" fill="#75947c"/><rect x="30" y="358" width="740" height="19" rx="6" fill="#c28b59"/>
      <path d="M63 392h675m-675 30h675" stroke="#aec0a0" stroke-width="4"/>
      <ellipse cx="652" cy="519" rx="91" ry="12" fill="#c5ac85" stroke="none"/>
      ${changed.has('basket') ? '' : '<g><path d="M605 446q-3-91 48-41 52-50 47 41" fill="none" stroke="#87613e" stroke-width="9"/><path d="m584 445 15 65h111l15-65Z" fill="#d4a76a"/><path d="M610 455v45m22-45v45m22-45v45m22-45v45m22-45v45m-105-24h121" stroke="#aa7c49" stroke-width="4"/></g>'}`;
  }

  function seaside(changed) {
    return `<rect width="800" height="560" fill="#dfede5"/>
      <path d="M0 246h800v314H0Z" fill="#87b5b1" stroke="none"/><path d="M0 247h800" stroke="#629b99" stroke-width="3"/>
      <path d="M0 392q175-87 365 14t435-11v165H0Z" fill="#ead5aa" stroke="none"/>
      <path d="M5 376q177-68 360 20t435-15" stroke="#f4edce" stroke-width="12" fill="none"/>
      <path d="M110 283h93m-45 29h88m336-27h69m-40 37h104m-340 33h68" stroke="#cce0cf" stroke-width="6"/>
      <g stroke="#658c7d" stroke-width="5"><path d="M55 105q18-26 36 0 18-26 36 0M140 85q18-26 36 0 18-26 36 0" fill="none"/>${changed.has('birds') ? '<path d="M156 137q18-26 36 0 18-26 36 0" fill="none"/>' : ''}</g>
      <path d="M593 249q66-43 148-2h59v25H581Z" fill="#8aab83" stroke="none"/>
      <path d="m653 116 10 130h57l10-130Z" fill="#fff3d5"/><path d="M657 163h69m-65 40h61" stroke="#d58867" stroke-width="15"/>
      <rect x="650" y="86" width="83" height="35" rx="5" fill="#618675"/><path d="m640 88 51-40 52 40Z" fill="#cc8863"/><path d="M691 49V31" stroke="#6b765a" stroke-width="4"/>
      ${changed.has('window') ? '<rect x="674" y="131" width="34" height="34" rx="2" fill="#53776b"/>' : '<circle cx="691" cy="148" r="18" fill="#53776b"/>'}
      <path d="M680 246v-22q11-20 23 0v22" fill="#a37f57"/>
      <path d="M480 150v155" stroke="#886f4f" stroke-width="7"/><path d="m470 159-65 125h65Z" fill="#faf4da"/><path d="m470 195-45 89h45Z" fill="#e8bc6b" stroke="none"/>
      ${changed.has('sail') ? '<path d="m492 175 66 109h-66Z" fill="#e5a27a"/>' : ''}
      <path d="M394 300h181l-28 35H425Z" fill="#b47751"/><path d="M418 313h133" stroke="#e7c38c" stroke-width="5"/>
      <path d="M245 338v151" stroke="#a57d4c" stroke-width="8"/><path d="M144 361q102-127 204 0Z" fill="#d99470"/><path d="M181 361q63-127 127 0Z" fill="#f8e7bd" stroke="none"/><path d="M144 361h204" stroke="#9c7654" stroke-width="4"/>
      ${changed.has('deckchair') ? '' : '<g><path d="m59 392 112 116m-96 0 92-120" stroke="#906b45" stroke-width="10"/><path d="m69 390 98 2-36 78H98Z" fill="#e7b96d"/><path d="m84 393 18 73m23-73-8 74m27-74-22 75" stroke="#fff0c7" stroke-width="10"/><path d="M92 472h49" stroke="#906b45" stroke-width="7"/></g>'}
      <path d="m416 465 11 22 25 4-18 18 4 25-22-12-22 12 4-25-18-18 25-4Z" fill="#cb8d64" stroke="none"/>
      <path d="M307 453q18-35 46 0Z" fill="#fbefd0"/><path d="M313 451q7-22 13-20m4 21 8-20m-3 22 13-13" stroke="#c8a876" stroke-width="3" fill="none"/>
      ${changed.has('bucket') ? '' : '<path d="M614 445q-1-91 45-42 46-49 45 42" fill="none" stroke="#9c794c" stroke-width="8"/>'}
      <path d="m609 445 14 72h68l15-72Z" fill="#77a79d"/><ellipse cx="658" cy="446" rx="49" ry="11" fill="#b5cbb1"/><path d="M642 471h34" stroke="#dbe4c7" stroke-width="5"/>
      <path d="m735 482 9-33m-9 33 24-21" stroke="#ab9a63" stroke-width="5" fill="none"/>`;
  }

  function kitchen(changed) {
    return `<rect width="800" height="560" fill="#f2e8d6"/>
      <rect x="66" y="56" width="183" height="177" rx="8" fill="#7fa08a"/><rect x="79" y="69" width="157" height="151" fill="#d6e8dc" stroke="none"/>
      <path d="M80 176q70-49 156-4v47H80Z" fill="#b2caa5" stroke="none"/><path d="M158 68v153M80 145h157" stroke="#7fa08a" stroke-width="7"/>
      <path d="M48 51h29v199l-22-16-15 16Zm190 0h28l8 199-17-16-20 16Z" fill="#ddb28a" stroke="none"/>
      <circle cx="363" cy="103" r="49" fill="#d3ac6d" stroke="none"/><circle cx="363" cy="103" r="42" fill="#fff5db"/>
      ${changed.has('plate') ? '<path d="M336 87h54m-62 16h70m-62 16h54" stroke="#7c9c7b" stroke-width="8"/>' : '<g fill="#cf8d6e" stroke="none"><ellipse cx="363" cy="85" rx="11" ry="17"/><ellipse cx="363" cy="121" rx="11" ry="17"/><ellipse cx="345" cy="103" rx="17" ry="11"/><ellipse cx="381" cy="103" rx="17" ry="11"/><circle cx="363" cy="103" r="10" fill="#e4bb69"/></g>'}
      <rect x="494" y="57" width="246" height="170" rx="8" fill="#9db29a"/><path d="M617 61v161" stroke="#6d8c72" stroke-width="4"/><path d="M595 131v29m44-29v29" stroke="#f2e6c4" stroke-width="7"/>
      <path d="M38 344h724V238H38Z" fill="#e4d6b8" stroke="none"/><path d="M38 278h724m-724 42h724m-628-82v106m108-106v106m108-106v106m108-106v106m108-106v106m108-106v106" stroke="#f7efda" stroke-width="3"/>
      <rect x="48" y="364" width="704" height="181" rx="6" fill="#7fa08d"/><path d="M249 367v173m192-173v173m-378-77h361m-335-68h119m74 0h119" stroke="#547d67" stroke-width="4"/><path d="M127 393h39m143 0h39m-212 94h29m146 0h29" stroke="#ead3a6" stroke-width="7"/>
      <rect x="566" y="383" width="157" height="145" rx="9" fill="#d4c7a7"/><rect x="581" y="419" width="128" height="94" rx="7" fill="#405f54"/><path d="M593 432h105" stroke="#a2b8a2" stroke-width="7"/><circle cx="593" cy="400" r="7" fill="#617f68"/><circle cx="696" cy="400" r="7" fill="#617f68"/>
      <rect x="33" y="345" width="735" height="24" rx="6" fill="#c29564"/>
      ${changed.has('kettle') ? '' : '<g><path d="M121 263q-7-43 29-28 30 10 28 33" stroke="#7d6f4d" stroke-width="8" fill="none"/><path d="M106 273h85l15 65H93Z" fill="#d7ac6f"/><path d="m106 288-32-18 19 44m100-28q39-17 22 30l-15 5" fill="none" stroke="#997547" stroke-width="8"/><ellipse cx="149" cy="274" rx="43" ry="10" fill="#f2d497"/><path d="M143 259h14" stroke="#997547" stroke-width="8"/></g>'}
      <g stroke-width="2"><rect x="273" y="259" width="42" height="85" rx="8" fill="#ecd4a2"/><rect x="331" y="246" width="42" height="98" rx="8" fill="#d9bb83"/>${changed.has('jars') ? '' : '<rect x="389" y="268" width="42" height="76" rx="8" fill="#e8cc9a"/><path d="M388 268h44" stroke="#8a9d77" stroke-width="9"/>'}<path d="M272 258h44m14-12h44" stroke="#8a9d77" stroke-width="9"/><path d="M285 287h18m40-12h18" stroke="#fff1cf" stroke-width="10"/></g>
      ${changed.has('bananas') ? '' : '<g stroke="#dbaf51" stroke-width="12" fill="none"><path d="M591 258q22 62 64 31m-50-41q28 62 65 24m-49-32q23 59 62 21"/><path d="m590 255 9-7m4-3 9-5m6-3 8-3" stroke="#7b8e57" stroke-width="5"/></g>'}
      <g fill="#c97d5f" stroke-width="2"><circle cx="604" cy="315" r="22"/><circle cx="649" cy="315" r="22"/><circle cx="693" cy="315" r="22"/></g><path d="M578 324h144q-11 22-72 22t-72-22Z" fill="#f8edcd"/>
      <path d="M432 380h111" stroke="#bba276" stroke-width="9"/><path d="M447 378h80v113l-13 9-14-9-13 9-13-9-27 9Z" fill="#f6e6bc"/>
      ${changed.has('towel') ? '<path d="M459 415h55m-55 20h55m-55 20h55" stroke="#b27d60" stroke-width="7"/>' : '<path d="m487 405 22 30-22 30-22-30Z" fill="#b27d60" stroke="none"/>'}
      <path d="M0 549h800" stroke="#bda17a" stroke-width="8"/>`;
  }

  function garden(changed) {
    return `<rect width="800" height="560" fill="#e4eee0"/>
      <path d="M0 337q199-68 400-7t400-7v237H0Z" fill="#a8bd88" stroke="none"/>
      <path d="M55 267h690m-690 52h690" stroke="#b6bda0" stroke-width="13"/>
      <g fill="#f3efda" stroke="#c6c7ab" stroke-width="2">${Array.from({ length: 11 }, (_, index) => `<path d="m${30 + index * 72} 243 22-26 22 26v121h-44Z"/>`).join('')}</g>
      <path d="M136 147v231" stroke="#a48052" stroke-width="14"/>
      <path d="M90 73h91v91H90Z" fill="#d8af71"/><path d="m74 75 62-42 62 42Z" fill="#ae7551"/><path d="M91 86h89" stroke="#f1d4a0" stroke-width="5"/>
      ${changed.has('birdhouse') ? '<path d="M136 113q-23-28-30-5-4 18 30 39 34-21 30-39-7-23-30 5Z" fill="#53735b" stroke="none"/>' : '<circle cx="136" cy="125" r="22" fill="#53735b" stroke="none"/>'}
      <path d="M125 164h23" stroke="#876943" stroke-width="6"/>
      ${changed.has('butterfly') ? '' : '<g><path d="M479 108q-53-77-53-16 0 32 53 22-49 46-7 39 22-5 10-37 51 48 55 2 1-27-51-6 62-55 15-55-24 3-22 51Z" fill="#d8926d" stroke-width="2"/><path d="M482 98v39m-1-35-8-20m11 18 8-20" stroke="#765e46" stroke-width="5"/><circle cx="451" cy="92" r="8" fill="#f2d69a" stroke="none"/><circle cx="507" cy="85" r="8" fill="#f2d69a" stroke="none"/></g>'}
      <path d="M224 416q195-31 363 0v58H224Z" fill="#92a774" stroke="none"/>
      ${changed.has('sunflower') ? '' : '<g><path d="M325 226v132m0-61q-46-35-42-5 10 23 42 5m0 32q45-37 45-10-12 21-45 10" stroke="#5a7e56" stroke-width="7" fill="none"/><g transform="translate(325 215)" fill="#e3b456" stroke="none">' + Array.from({ length: 8 }, (_, index) => `<ellipse cy="-26" rx="10" ry="22" transform="rotate(${index * 45})"/>`).join('') + '</g><circle cx="325" cy="215" r="24" fill="#9c7047"/><circle cx="325" cy="215" r="11" fill="#c5995c" stroke="none"/></g>'}
      <g fill="#688d5e" stroke="none"><path d="M439 361q-58-69-24-76 34 11 24 76Zm9-4q-21-89 17-72 20 28-17 72Zm12 0q29-69 47-37 0 26-47 37Z"/><path d="M529 359q-52-42-29-57 25 0 29 57Zm7-3q7-74 35-48 7 25-35 48Z"/></g>
      <rect x="236" y="355" width="337" height="95" rx="7" fill="#ba8859"/><path d="M249 381h311m-311 36h311m-280-60v89m252-89v89" stroke="#dfb57e" stroke-width="5"/><rect x="228" y="349" width="354" height="18" rx="5" fill="#936c47"/>
      <path d="M14 528q168-70 355 4t431-5" stroke="#91aa75" stroke-width="5" fill="none"/>
      ${changed.has('watering-can') ? '' : '<g><path d="M171 435q62-38 41 31-12 15-31 11" stroke="#6b8b72" stroke-width="12" fill="none"/><path d="M80 445 38 408l-5 14 49 58" fill="#88ab94"/><path d="M80 432h105v74H80Z" fill="#88ab94"/><ellipse cx="132" cy="432" rx="53" ry="10" fill="#bfd0ac"/><path d="M108 423q24-39 48 0" stroke="#607f65" stroke-width="7" fill="none"/><path d="M107 459h49" stroke="#cdd9b8" stroke-width="6"/></g>'}
      <g fill="#688f76"><path d="M583 399h43v72h21q22 5 21 31h-87Z"/><path d="M581 502h87" stroke="#425f4c" stroke-width="10"/>${changed.has('boots') ? '' : '<path d="M665 399h43v72h21q22 5 15 31h-81Z"/><path d="M663 502h81" stroke="#425f4c" stroke-width="10"/>'}<path d="M585 415h39" stroke="#b2c49e" stroke-width="6"/></g>`;
  }

  function busstop(changed) {
    return `<rect width="800" height="560" fill="#e1eade"/>
      <g fill="#b5c8b2" stroke="none"><rect x="8" y="166" width="144" height="207" rx="8"/><rect x="261" y="129" width="139" height="244" rx="8"/><rect x="603" y="114" width="175" height="259" rx="8"/></g>
      <path d="M28 190h101m-101 32h101m-101 32h101m154-99h94m-94 32h94m-94 32h94m223-77h126m-126 32h126m-126 32h126" stroke="#edf0da" stroke-width="11"/>
      <path d="M0 359h800v201H0Z" fill="#d8c8a9" stroke="none"/><path d="M0 480h800v80H0Z" fill="#8e9b8e" stroke="none"/><path d="M0 477h800" stroke="#f4ead0" stroke-width="9"/><path d="M30 535h140m80 0h140m80 0h140m80 0h140" stroke="#efe2b6" stroke-width="7"/>
      <path d="M111 145v303" stroke="#8c9279" stroke-width="10"/>
      ${changed.has('sign') ? '<rect x="66" y="53" width="90" height="90" rx="5" fill="#4d8070"/>' : '<circle cx="111" cy="98" r="47" fill="#4d8070"/>'}
      <g fill="#f7edcf" stroke="none"><rect x="86" y="76" width="49" height="39" rx="7"/><circle cx="96" cy="120" r="5"/><circle cx="125" cy="120" r="5"/></g><path d="M94 85h32v15H94Z" fill="#7eaa97" stroke="none"/>
      <path d="M188 167v260m343-260v260" stroke="#718f77" stroke-width="14"/><path d="M196 191h327v158H196Z" fill="#cad9c5" stroke="none"/><path d="M207 203h304v130H207Z" fill="#e2e9d2" stroke="none"/>
      <path d="m160 168 39-40h320l41 40Z" fill="#b47c59"/><path d="M183 161h352" stroke="#d5a06e" stroke-width="6"/>
      ${changed.has('bird') ? '' : '<g><path d="M415 116q-29-20-17-34 12-6 22 4 15-30 38-7 12 15-7 30l-9 17Z" fill="#57765a" stroke="none"/><path d="m455 82 23 10-22 5Z" fill="#c69a55" stroke="none"/><circle cx="448" cy="83" r="3" fill="#f9f0d5" stroke="none"/><path d="m428 117-3 13m15-14 5 14" stroke="#806746" stroke-width="4"/></g>'}
      <rect x="222" y="288" width="265" height="62" rx="8" fill="#bf9564"/><path d="M231 310h246m-246 24h246" stroke="#e4bc83" stroke-width="5"/><rect x="211" y="351" width="286" height="20" rx="6" fill="#a77d50"/><path d="M236 373v47m237-47v47" stroke="#6f8067" stroke-width="11"/>
      ${changed.has('newspaper') ? '' : '<g transform="rotate(-7 343 346)"><path d="M283 311h112v65H283Z" fill="#fff4d8"/><path d="M296 325h84" stroke="#8c9373" stroke-width="7"/><path d="M296 340h35m-35 11h35m14-11h35m-35 11h35m-84 12h84" stroke="#b8b797" stroke-width="3"/></g>'}
      ${changed.has('bin') ? '' : '<g><rect x="73" y="389" width="78" height="88" rx="9" fill="#6b9380"/><path d="M65 389h94l-9-22H74Z" fill="#89a58a"/><rect x="90" y="407" width="43" height="12" rx="5" fill="#3d6554" stroke="none"/><path d="M89 437v25m21-25v25m21-25v25" stroke="#aac1a0" stroke-width="5"/></g>'}
      <path d="M557 295q0-38 37-38h206v192H557Z" fill="#cb8a6e"/><path d="M557 375h243v24H557Z" fill="#f2d5a3" stroke="none"/><rect x="575" y="298" width="151" height="70" rx="10" fill="#aec9b8"/><path d="M650 300v66" stroke="#547b67" stroke-width="5"/><rect x="739" y="296" width="55" height="141" rx="5" fill="#b8cbbb"/><path d="M766 299v135" stroke="#63856f" stroke-width="4"/>
      <rect x="601" y="264" width="104" height="25" rx="5" fill="#486f5a" stroke="none"/><text x="653" y="283" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="20" font-weight="700" fill="#fff1cc" stroke="none">12</text>
      <circle cx="673" cy="439" r="43" fill="#455c4c"/><circle cx="673" cy="439" r="29" fill="#8c9e85" stroke="none"/>
      ${changed.has('wheel') ? '<path d="m673 414 8 16 18 3-13 13 3 18-16-9-16 9 3-18-13-13 18-3Z" fill="#f3dfb0" stroke="none"/>' : '<circle cx="673" cy="439" r="18" fill="#f3dfb0" stroke="none"/>'}
      <rect x="564" y="404" width="20" height="11" rx="4" fill="#f5d99d" stroke="none"/>`;
  }

  const renderers = { kopitiam, park, home, market, seaside, kitchen, garden, busstop };
  function renderScene(key, changedIds = []) {
    if (!Object.hasOwn(scenes, key)) throw new Error('Choose a valid scene.');
    const valid = new Set(scenes[key].differences.map(difference => difference.id));
    if (changedIds.some(id => !valid.has(id))) throw new Error('Unknown scene difference.');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" aria-hidden="true" focusable="false" fill="none" stroke="#3c5849" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${renderers[key](new Set(changedIds))}</svg>`;
  }

  const api = { WIDTH, HEIGHT, scenes, renderScene };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KakiSpotScenes = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
