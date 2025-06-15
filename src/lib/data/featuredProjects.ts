// data/projects.ts

//LAYA FILES
import Laya from "../../assets/imgs/projects/laya/facade/01_Aerial View_Night_03.jpg";
import Laya2 from "../../assets/imgs/projects/laya/facade/04_Semi Aerial View_Night_03.jpg";
import Laya3 from "../../assets/imgs/projects/laya/facade/Laya Building Render_2.jpg";
import Laya4 from "../../assets/imgs/projects/laya/facade/02_Semi Aerial View_Dusk_03.jpg";

//AURELIA FILES
import Aurelia from "../../assets/imgs/projects/aurelia/Aurelia Street View_with bleed.jpg";

//WACKWACK FILES
import WackWack from "../../assets/imgs/projects/wackwack/SRWW_Building-Façade_View-01b_FA_181105.webp";

//HARAYA FILES
import Haraya from "../../assets/imgs/projects/haraya/V1_Shang Robinsons Inc. Properties_Haraya Residences_view01_extended_transparency brighter - Copy.jpg";

//SHANG SUMMIT FILES
import ShangSummit from "../../assets/imgs/projects/shangsummit/ShangSummit.webp";




const projects = [
    {
        id: 1,
        title: "Laya",
        formalName: "Laya Residences",
        sm: "Luxury living in Ortigas Center",
        description: "Laya offers a vibrant community in Ortigas with 1,238 thoughtfully-designed units and over 2,934 sqm of amenities, providing a dynamic space for creativity, connection, and growth.",
        address: "Christian Route corner St. Peter Street, Brgy. Oranbo, Pasig City 1600 Metro Manila Philippines. ",
        project_type: "Residential",
        design_team: "W&T INTERNATIONAL BOND STUDIO. INC. CASAS + ARCHITECTS. INC.",
        noofunits: "1,283",
        productmix: "Studio, 1BR, 2BR, 3BR",
        developer: "SPI Property Holdings. Inc.",
        description2: "With 1,238 studio, one-, two-, and three-bedroom units in thoughtfully-designed layout configurations, Laya is both a home and a community for the creative and the connected. Offering over 2,934 sqm of amenities, Laya is more than a place to call home: it is a place to create, a place to entertain, a place to connect, build, and grow.",
        gallery: [Laya2, Laya3],
        image: Laya,
        live_tour: "",
        telephone: "",
        email: "",
    },
    {
        id: 2,
        title: "ShangSummit",
        formalName: "Shang Summit Residences",
        sm: "Privacy & Convenience at Heart",
        description: "Located in the quiet enclave of South Triangle, Quezon City, Shang Summit offers a rare balance of privacy and convenience. Only a stone’s throw to trendy hangout places, a short stroll along tree-shaded streets to gourmet dining options and artisan coffee shops, and a few minutes drive to a whole host of world-class retail hubs.",
        address: "40 Scout Bayoran Street Brgy. South Triangle Quezon City Philippines",
        project_type: "Residential",
        design_team: "P&T Group FM Architettura CASAS + ARCHITECTS, INC.",
        noofunits: "1,020 (East Tower)",
        productmix: "Studio, 1-Bedroom, 2-Bedroom, 3-Bedroom",
        developer: "SPI LAND DEVELOPMENT, INC. ",
        description2: "Unveiling Shang Properties’ first residential project in Quezon City. An iconic luxury tower that will redefine the Metro Manila skyline. Shang Summit is a collaboration between renowned architects and designers P&T Group and Fm Architettura. The first of two towers, the East Tower features 1020 beautifully-appointed residences and soaring panoramic views of the city.",
        gallery: [ShangSummit, ShangSummit],
        image: ShangSummit,
        live_tour: "",
        telephone: "",
        email: "",
    },
    {
        id: 3,
        title: "Haraya",
        formalName: "Haraya Residences",
        sm: "Serene views and elegant lifestyle",
        description: "Haraya Residences is a vertical gated village in Bridgetowne Estate, offering 558 exquisite homes in the South Tower and more soon in the North Tower.",
        address: "Riverside Road corner Bridgetowne Blvd., Bridgetowne Destination Estate, E. Rodriguez Ave. Brgy. Rosario, Pasig City Metro Manila Philippines",
        project_type: "Residential",
        design_team: "P&T Architects and Engineers Ltd FM Architettura Casas + Architects Inc.",
        noofunits: "South Tower – 558",
        productmix: "1BR, 2BR, 3BR, and Penthouse",
        developer: "Shang Robinsons Properties, Inc.",
        description2: "A new era requires new thinking. It demands a new understanding of the home; how we live, interact, unwind, and be productive. Bringing together the finest architects, designers, and artisans to deliver this unique vision, Haraya Residences offers an uncompromising new perspective on cosmopolitan living. Haraya Residences is a vertical gated village located at the heart of Bridgetowne Estate, featuring a collection of 558 beautifully appointed residences in the South Tower and more forthcoming in the North Tower. Take in the soaring views; lounge in the lofty Italian-inspired loggias that redefine the experience of home living; rediscover a sense of freedom and vibrancy among the lush private landscapes and world-class amenities. Welcome home to Haraya Residences.",
        gallery: [Haraya, Haraya],
        image: Haraya,
        live_tour: "",
        telephone: "",
        email: "",
    },
    {
        id: 4,
        title: "Aurelia",
        formalName: "Aurelia Residences",
        sm: "A limited collection of 285 bespoke residences",
        description: "A limited collection of 285 bespoke residences in a location with cosmopolitan skyline views and lush greens of Manila Golf Club, Manila Polo Club, & Forbes Park.",
        address: "McKinley Parkway corner 5th Avenue and 21st Drive Bonifacio Global City, Taguig City 1634 Metro Manila Philippines",
        project_type: "Residential",
        design_team: "Skidmore Owings & Merril, LLP FM Architettura d’Interni Rchitects, Inc.",
        noofunits: "285",
        productmix: "3BR, 4BR and Penthouse",
        developer: "Shang Robinsons Properties, Inc.",
        description2: "One of the most coveted addresses in the Philippines. A location defined by the extraordinary cosmopolitan skyline views and the lush greens of Manila Golf Club, Manila Polo Club, and Forbes Park. An unparalleled collaboration of architects, designers, and artisans who represent the pinnacle of their respective fields. A meticulously curated vision inspired by sprezzatura – an effortless and understated sense of classic Italian elegance.",
        gallery: [Aurelia, Aurelia],
        image: Aurelia,
        live_tour: "",
        telephone: "",
        email: "",
    },
    {
        id: 5,
        title: "WackWack",
        formalName: "Shang Residences at Wack Wack",
        sm: "An exclusive resort-inspired residential property in the verdant neighborhood of Wack Wack",
        description: "An exclusive resort-inspired residential property in the verdant neighborhood of Wack Wack. Shang Residences at Wack Wack is uniquely set in beautifully landscaped gardens neighboring one of Manila’s most iconic heritage golf clubs – The Wack Wack Golf & Country Club.",
        address: "575 Wack Wack Road Mandaluyong City 1550 Metro Manila Philippines",
        telephone: "(632) 5322 6900",
        email: "property.management@srww.com.ph",
        project_type: "Residential",
        design_team: "Wong & Tung International Ltd. Asya Design Partners BTR Workshop, Limited Hong Kong",
        noofunits: "404",
        productmix: "1 BR, 2BR, 3BR, and Penthouse",
        developer: "Shang Properties, Inc.",
        description2: "Shang Residences at Wack Wack is an exclusive resort-inspired residential property in the verdant neighborhood of Wack Wack, Mandaluyong. Set in beautifully landscaped gardens neighboring one of Manila’s iconic heritage golf clubs – The Wack Wack Golf & Country Club- enjoy some of the city’s most sought-after views: sweeping vistas over two 18-hole championship golf courses or towards the dramatic Makati skyline.",
        gallery: [WackWack, WackWack],
        image: WackWack,
        live_tour: "",
    },
];

export default projects;
