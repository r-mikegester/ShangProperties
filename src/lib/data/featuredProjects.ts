// data/projects.ts
import ShangSummit from "../../assets/imgs/ShangSummit.webp";
import Laya from "../../assets/imgs/laya/facade/01_Aerial View_Night_03.jpg";
import Laya2 from "../../assets/imgs/laya/facade/01_Aerial View_Night_03.jpg";
import Laya3 from "../../assets/imgs/laya/facade/01_Aerial View_Night_03.jpg";
import Aurelia from "../../assets/imgs/aurelia/Aurelia Street View_with bleed.jpg";
import WackWack from "../../assets/imgs/wackwack/SRWW_Building-Façade_View-01b_FA_181105.webp";
import Haraya from "../../assets/imgs/haraya/V1_Shang Robinsons Inc. Properties_Haraya Residences_view01_extended_transparency brighter - Copy.jpg";

const projects = [
    {
        id: 1,
        title: "Laya",
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
    },
    {
        id: 2,
        title: "Shang Summit",
        sm: "Modern spaces in the heart of Makati",
        description: "Elevate your lifestyle at Shang Summit...",
        address: "Ortigas Center, Pasig City",
        project_type: "Residential",
        design_team: "s",
        noofunits: "1",
        productmix: "1",
        developer: "Shang Properties, Inc.",
        description2: "Shang Summit redefines urban living...",
        gallery: [Laya2, Laya3],
        image: ShangSummit,
    },
    {
        id: 3,
        title: "Haraya Residences",
        sm: "Serene views and elegant lifestyle",
        description: "Haraya Residences is a vertical gated village in Bridgetowne Estate, offering 558 exquisite homes in the South Tower and more soon in the North Tower.",
        address: "Riverside Road corner Bridgetowne Blvd., Bridgetowne Destination Estate, E. Rodriguez Ave. Brgy. Rosario, Pasig City Metro Manila Philippines",
        project_type: "Residential",
        design_team: "P&T Architects and Engineers Ltd FM Architettura Casas + Architects Inc.",
        noofunits: "South Tower – 558",
        productmix: "1BR, 2BR, 3BR, and Penthouse",
        developer: "Shang Robinsons Properties, Inc.",
        description2: "A new era requires new thinking. It demands a new understanding of the home; how we live, interact, unwind, and be productive. Bringing together the finest architects, designers, and artisans to deliver this unique vision, Haraya Residences offers an uncompromising new perspective on cosmopolitan living. Haraya Residences is a vertical gated village located at the heart of Bridgetowne Estate, featuring a collection of 558 beautifully appointed residences in the South Tower and more forthcoming in the North Tower. Take in the soaring views; lounge in the lofty Italian-inspired loggias that redefine the experience of home living; rediscover a sense of freedom and vibrancy among the lush private landscapes and world-class amenities. Welcome home to Haraya Residences.",
        gallery: [Laya2, Laya3],
        image: Haraya,
    },
    {
        id: 4,
        title: "Aurelia Residences",
        sm: "Exclusive luxury in BGC",
        description: "A premier address in Bonifacio Global City...",
        address: "Ortigas Center, Pasig City",
        project_type: "Residential",
        design_team: "s",
        noofunits: "1",
        productmix: "1",
        developer: "Shang Properties, Inc.",
        description2: "Aurelia fuses modern luxury and heritage...",
        gallery: [Laya2, Laya3],
        image: Aurelia,
    },
    {
        id: 5,
        title: "Shang Residences",
        sm: "Sleek urban living in Salcedo Village",
        description: "Live at the center of Makati’s business and culture...",
        address: "Ortigas Center, Pasig City",
        project_type: "Residential",
        design_team: "s",
        noofunits: "1",
        productmix: "1",
        developer: "Shang Properties, Inc.",
        description2: "A vibrant home in Makati’s bustling center...",
        gallery: [Laya2, Laya3],
        image: WackWack,
    },
];

export default projects;
