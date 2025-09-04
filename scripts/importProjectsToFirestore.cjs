// Run this script with: node scripts/importProjectsToFirestore.js
// Make sure you have firebase-admin installed: npm install firebase-admin
// And that you have a serviceAccountKey.json for your Firebase project in the scripts/ directory

const admin = require('firebase-admin');
const serviceAccount = require('../backend/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Helper: Replace all undefined values with null recursively
function replaceUndefinedWithNull(obj) {
  if (Array.isArray(obj)) {
    return obj.map(replaceUndefinedWithNull);
  } else if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (obj[key] === undefined) {
        newObj[key] = null;
      } else {
        newObj[key] = replaceUndefinedWithNull(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

// Project data (replace image imports with relative URLs)
const projects = [
  {
    id: 'laya',
    title: 'Laya',
    formalName: 'Laya Residences',
    sm: 'Luxury living in Ortigas Center',
    description: 'Laya offers a vibrant community in Ortigas with 1,238 thoughtfully-designed units and over 2,934 sqm of amenities, providing a dynamic space for creativity, connection, and growth.',
    address: 'Christian Route corner St. Peter Street, Brgy. Oranbo, Pasig City 1600 Metro Manila Philippines. ',
    project_type: 'Residential',
    design_team: 'W&T INTERNATIONAL BOND STUDIO. INC. CASAS + ARCHITECTS. INC.',
    noofunits: '1,283',
    productmix: 'Studio, 1BR, 2BR, 3BR',
    developer: 'SPI Property Holdings. Inc.',
    description2: 'With 1,238 studio, one-, two-, and three-bedroom units in thoughtfully-designed layout configurations, Laya is both a home and a community for the creative and the connected. Offering over 2,934 sqm of amenities, Laya is more than a place to call home: it is a place to create, a place to entertain, a place to connect, build, and grow.',
    gallery: [
      '/assets/imgs/projects/laya/Pool_Night.webp',
      '/assets/imgs/projects/laya/Outdoor_Kids_Play_Area.webp',
      '/assets/imgs/projects/laya/Lobby1.webp',
      '/assets/imgs/projects/laya/Pool_Day.webp',
      '/assets/imgs/projects/laya/Lobby2.webp',
      '/assets/imgs/projects/laya/Lobby3.webp',
      '/assets/imgs/projects/laya/Co_Working_Space.webp',
      '/assets/imgs/projects/laya/Cross_Training_Area.webp',
      '/assets/imgs/projects/laya/Indoor_Kids_Play_Area.webp',
      '/assets/imgs/projects/laya/Pool_Table_Lounge.webp',
      '/assets/imgs/projects/laya/The_Yoga_Group_Area.webp',
      '/assets/imgs/projects/laya/The_Drawing_Room1.webp',
      '/assets/imgs/projects/laya/The_Drawing_Room2.webp',
      '/assets/imgs/projects/laya/The_Viewing_Room.webp',
      '/assets/imgs/projects/laya/The_Corner_Lounge1.webp',
      '/assets/imgs/projects/laya/The_Corner_Lounge2.webp',
      '/assets/imgs/projects/laya/The-_Corner_Lounge3.webp',
      '/assets/imgs/projects/laya/Laya_Building_Render_2.webp',
      '/assets/imgs/projects/laya/Drop_off_Night.webp',
      '/assets/imgs/projects/laya/01_Aerial_View_Night_03.webp',
      '/assets/imgs/projects/laya/04_Semi_Aerial_View_Night_03.webp',
    ],
    image: '/assets/imgs/projects/laya/01_Aerial_View_Night_03.webp',
    iframeSrc: 'https://livetour.istaging.com/1897223f-79f8-4d10-ad66-37bf1126bcf8',
    tours360: [
      { url: 'https://livetour.istaging.com/1897223f-79f8-4d10-ad66-37bf1126bcf8', label: 'Main Lobby' },
      { url: 'https://livetour.istaging.com/1897223f-79f8-4d10-ad66-37bf1126bcf8', label: 'Amenity Deck' },
      { url: 'https://livetour.istaging.com/1897223f-79f8-4d10-ad66-37bf1126bcf8', label: 'Pool Area' },
      { url: 'https://livetour.istaging.com/1897223f-79f8-4d10-ad66-37bf1126bcf8', label: 'Unit Interior' },
      { url: 'https://livetour.istaging.com/1897223f-79f8-4d10-ad66-37bf1126bcf8', label: 'Sky Lounge' },
      { url: 'https://livetour.istaging.com/1897223f-79f8-4d10-ad66-37bf1126bcf8', label: 'Fitness Center' },
    ],
    telephone: '',
    email: '',
  },
  {
    id: 'haraya',
    title: 'Haraya',
    formalName: 'Haraya Residences',
    sm: 'Serene views and elegant lifestyle',
    description: 'Haraya Residences is a vertical gated village in Bridgetowne Estate, offering 558 exquisite homes in the South Tower and more soon in the North Tower.',
    address: 'Riverside Road corner Bridgetowne Blvd., Bridgetowne Destination Estate, E. Rodriguez Ave. Brgy. Rosario, Pasig City Metro Manila Philippines',
    project_type: 'Residential',
    design_team: 'P&T Architects and Engineers Ltd FM Architettura Casas + Architects Inc.',
    noofunits: 'South Tower – 558',
    productmix: '1BR, 2BR, 3BR, and Penthouse',
    developer: 'Shang Robinsons Properties, Inc.',
    description2: 'A new era requires new thinking. It demands a new understanding of the home; how we live, interact, unwind, and be productive. Bringing together the finest architects, designers, and artisans to deliver this unique vision, Haraya Residences offers an uncompromising new perspective on cosmopolitan living. Haraya Residences is a vertical gated village located at the heart of Bridgetowne Estate, featuring a collection of 558 beautifully appointed residences in the South Tower and more forthcoming in the North Tower. Take in the soaring views; lounge in the lofty Italian-inspired loggias that redefine the experience of home living; rediscover a sense of freedom and vibrancy among the lush private landscapes and world-class amenities. Welcome home to Haraya Residences.',
    image: '/assets/imgs/projects/haraya/V1.webp',
    iframeSrc: null,
    tours360: [],
    telephone: '',
    email: '',
    gallery: [
      '/assets/imgs/projects/haraya/KMS1.webp',
      '/assets/imgs/projects/haraya/KMS2.webp',
      '/assets/imgs/projects/haraya/KMS3.webp',
      '/assets/imgs/projects/haraya/KMS4.webp',
      '/assets/imgs/projects/haraya/KMS5.webp',
      '/assets/imgs/projects/haraya/KMS6.webp',
      '/assets/imgs/projects/haraya/KMS7.webp',
      '/assets/imgs/projects/haraya/KMS8.webp',
      '/assets/imgs/projects/haraya/KMS9.webp',
      '/assets/imgs/projects/haraya/KMS10.webp',
      '/assets/imgs/projects/haraya/KMS11.webp',
      '/assets/imgs/projects/haraya/KMS12.webp',
      '/assets/imgs/projects/haraya/KMS13.webp',
      '/assets/imgs/projects/haraya/KMS14.webp',
      '/assets/imgs/projects/haraya/KMS15.webp',
      '/assets/imgs/projects/haraya/KMS16.webp',
      '/assets/imgs/projects/haraya/KMS17.webp',
      '/assets/imgs/projects/haraya/KMS18.webp',
      '/assets/imgs/projects/haraya/KMS19.webp',
      '/assets/imgs/projects/haraya/KMS20.webp',
      '/assets/imgs/projects/haraya/KMS21.webp',
      '/assets/imgs/projects/haraya/V1.webp',
    ],
  },
  {
    id: 'shangsummit',
    title: 'ShangSummit',
    formalName: 'Shang Summit Residences',
    sm: 'Privacy & Convenience at Heart',
    description: 'Located in the quiet enclave of South Triangle, Quezon City, Shang Summit offers a rare balance of privacy and convenience. Only a stone’s throw to trendy hangout places, a short stroll along tree-shaded streets to gourmet dining options and artisan coffee shops, and a few minutes drive to a whole host of world-class retail hubs.',
    address: '40 Scout Bayoran Street Brgy. South Triangle Quezon City Philippines',
    project_type: 'Residential',
    design_team: 'P&T Group FM Architettura CASAS + ARCHITECTS, INC.',
    noofunits: '1,020 (East Tower)',
    productmix: 'Studio, 1-Bedroom, 2-Bedroom, 3-Bedroom',
    developer: 'SPI LAND DEVELOPMENT, INC. ',
    description2: 'Unveiling Shang Properties’ first residential project in Quezon City. An iconic luxury tower that will redefine the Metro Manila skyline. Shang Summit is a collaboration between renowned architects and designers P&T Group and Fm Architettura. The first of two towers, the East Tower features 1020 beautifully-appointed residences and soaring panoramic views of the city.',
    image: '/assets/imgs/projects/shangsummit/ShangSummit.webp',
    iframeSrc: 'https://livetour.istaging.com/0092d133-c169-4395-ad45-eaab70a88f87',
    tours360: [
      { url: 'https://livetour.istaging.com/0092d133-c169-4395-ad45-eaab70a88f87', label: 'Main Lobby' }
    ],
    telephone: '',
    email: '',
    gallery: [
      '/assets/imgs/projects/shangsummit/BallroomAlfresco.webp',
      '/assets/imgs/projects/shangsummit/BallroomAlfresco2.webp',
      '/assets/imgs/projects/shangsummit/L11_FamilyGameRoom1.webp',
      '/assets/imgs/projects/shangsummit/L11_FamilyGameRoom2.webp',
      '/assets/imgs/projects/shangsummit/L11_FamilyGameRoom3.webp',
      '/assets/imgs/projects/shangsummit/Fitness1.webp',
      '/assets/imgs/projects/shangsummit/Fitness2.webp',
      '/assets/imgs/projects/shangsummit/PoolDeck1.webp',
    ],
  },
  {
    id: 'wackwack',
    title: 'WackWack',
    formalName: 'Shang Residences at Wack Wack',
    sm: 'An exclusive resort-inspired residential property in the verdant neighborhood of Wack Wack',
    description: 'An exclusive resort-inspired residential property in the verdant neighborhood of Wack Wack. Shang Residences at Wack Wack is uniquely set in beautifully landscaped gardens neighboring one of Manila’s most iconic heritage golf clubs – The Wack Wack Golf & Country Club.',
    address: '575 Wack Wack Road Mandaluyong City 1550 Metro Manila Philippines',
    telephone: '(632) 5322 6900',
    email: 'property.management@srww.com.ph',
    project_type: 'Residential',
    design_team: 'Wong & Tung International Ltd. Asya Design Partners BTR Workshop, Limited Hong Kong',
    noofunits: '404',
    productmix: '1BR, 2BR, 3BR, and Penthouse',
    developer: 'Shang Properties, Inc.',
    description2: 'Shang Residences at Wack Wack is an exclusive resort-inspired residential property in the verdant neighborhood of Wack Wack, Mandaluyong. Set in beautifully landscaped gardens neighboring one of Manila’s iconic heritage golf clubs – The Wack Wack Golf & Country Club- enjoy some of the city’s most sought-after views: sweeping vistas over two 18-hole championship golf courses or towards the dramatic Makati skyline.',
    image: '/assets/imgs/projects/wackwack/facade_evening.webp',
    iframeSrc: null,
    tours360: [
      { url: 'https://livetour.istaging.com/5fdfa6c5-7c49-4c36-b670-d1822d4abadc', label: '1 BR Unit' },
      { url: 'https://livetour.istaging.com/f0036f49-ba57-4d97-8dcb-85fc4cbf9565', label: '2 BR Unit' },
      { url: 'https://livetour.istaging.com/31fe4478-0e5e-4063-a986-3c5c588fbf0f', label: '3 BR Unit' },
      { url: 'https://livetour.istaging.com/a7ee6675-2e61-44f0-ab5b-afdba3cbe890', label: '3 BR Unit F Bare' },
    ],
    gallery: [
      '/assets/imgs/projects/wackwack/SWW_Gym.webp',
      '/assets/imgs/projects/wackwack/SWW_Lobby.webp',
      '/assets/imgs/projects/wackwack/SWW_Lounge.webp',
      '/assets/imgs/projects/wackwack/SWW_PoolArea.webp',
      '/assets/imgs/projects/wackwack/SWW_GolfArea.webp',
      '/assets/imgs/projects/wackwack/SWW_Garden.webp',
      '/assets/imgs/projects/wackwack/SWW_DropOff.webp',
      '/assets/imgs/projects/wackwack/SWW_Playroom.webp',
      '/assets/imgs/projects/wackwack/SWW_FunctionArea.webp',
    ],
  },
  {
    id: 'aurelia',
    title: 'Aurelia',
    formalName: 'Aurelia Residences',
    sm: 'A limited collection of 285 bespoke residences',
    description: 'A limited collection of 285 bespoke residences in a location with cosmopolitan skyline views and lush greens of Manila Golf Club, Manila Polo Club, & Forbes Park.',
    address: 'McKinley Parkway corner 5th Avenue and 21st Drive Bonifacio Global City, Taguig City 1634 Metro Manila Philippines',
    project_type: 'Residential',
    design_team: 'Skidmore Owings & Merril, LLP FM Architettura d’Interni Rchitects, Inc.',
    noofunits: '285',
    productmix: '3BR, 4BR and Penthouse',
    developer: 'Shang Robinsons Properties, Inc.',
    description2: 'One of the most coveted addresses in the Philippines. A location defined by the extraordinary cosmopolitan skyline views and the lush greens of Manila Golf Club, Manila Polo Club, and Forbes Park. An unparalleled collaboration of architects, designers, and artisans who represent the pinnacle of their respective fields. A meticulously curated vision inspired by sprezzatura – an effortless and understated sense of classic Italian elegance.',
    image: '/assets/imgs/projects/aurelia/Aurelia_Street_View_with_bleed.webp',
    iframeSrc: null,
    tours360: [
      { url: 'https://livetour.istaging.com/0092d133-c169-4395-ad45-eaab70a88f87', label: '360 Outside View' }
    ],
    telephone: '',
    email: '',
    gallery: [
      '/assets/imgs/projects/aurelia/Lobby1.webp',
      '/assets/imgs/projects/aurelia/Lobby2.webp',
      '/assets/imgs/projects/aurelia/Pool.webp',
      '/assets/imgs/projects/aurelia/Alfresco.webp',
      '/assets/imgs/projects/aurelia/Gym1.webp',
      '/assets/imgs/projects/aurelia/Luxhomecinema1.webp',
      '/assets/imgs/projects/aurelia/FunctionRoom1.webp',
      '/assets/imgs/projects/aurelia/KidsPlay1.webp',
      '/assets/imgs/projects/aurelia/KidsPlay2.webp',
      '/assets/imgs/projects/aurelia/KidsPlay3.webp',
    ],
  },
];

async function importProjects() {
  for (const project of projects) {
    const cleanProject = replaceUndefinedWithNull(project);
    const ref = db.collection('projects').doc(project.id);
    await ref.set(cleanProject, { merge: true });
    console.log(`Imported project: ${project.title}`);
  }
  console.log('All projects imported.');
  process.exit(0);
}

importProjects().catch(err => {
  console.error('Error importing projects:', err);
  process.exit(1);
});
