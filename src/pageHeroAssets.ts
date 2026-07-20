import type { Route } from "./routing";

export type PageHeroCopy = { en: string; th: string; zh: string };
export type StaticHeroKind = Exclude<Route["kind"], "home" | "city" | "canvas">;
export type PageHeroAsset = {
  src: string;
  objectPosition?: string;
  title: PageHeroCopy;
  place: string;
  description: PageHeroCopy;
};

// 2026-07-02 photo de-dup audit: every scenic cityscape in /photos is already
// claimed by a city identity in cityMedia.ts, so page heroes draw exclusively
// from the authored depa / event archive — each file used exactly once site-wide.
// Guarded by src/heroPhotoIntegrity.test.ts against title/place/description drift.
export const PAGE_HERO_ASSETS: Record<StaticHeroKind, PageHeroAsset> = {
  rankings: {
    src: "/photos/wp-makkasan.jpg",
    objectPosition: "center 40%",
    title: { en: "Rankings", th: "อันดับเมือง", zh: "城市排名" },
    place: "Bangkok",
    description: {
      en: "Makkasan, Bangkok — Thailand's financial heart and the engine of a 15-million-person metropolis. The district anchors Southeast Asia's second-largest economy.",
      th: "มักกะสัน กรุงเทพฯ — ศูนย์กลางการเงินของไทยและเครื่องยนต์ของมหานคร 15 ล้านคน ย่านนี้เป็นหลักของเศรษฐกิจที่ใหญ่เป็นอันดับสองของอาเซียน",
      zh: "曼谷玛卡珊 — 泰国的金融心脏，1500万人口大都市的经济引擎。该区是东盟第二大经济体的支柱。",
    },
  },
  discover: {
    src: "/photos/khonkaen-aerial.jpg",
    objectPosition: "center 40%",
    title: { en: "Find Your City", th: "ค้นหาเมืองของคุณ", zh: "寻找你的城市" },
    place: "Khon Kaen",
    description: {
      en: "Khon Kaen — The smart-city pioneer of Northeast Thailand, home to Khon Kaen University and the economic hub of the entire Isan region.",
      th: "ขอนแก่น — ผู้บุกเบิกเมืองอัจฉริยะของภาคตะวันออกเฉียงเหนือ ที่ตั้งของมหาวิทยาลัยขอนแก่นและศูนย์กลางเศรษฐกิจของทั้งภาคอีสาน",
      zh: "孔敬 — 泰国东北部的智慧城市先驱，孔敬大学所在地，整个伊善地区的经济中心。",
    },
  },
  program: {
    src: "/photos/wp-hat-yai.jpg",
    objectPosition: "center 40%",
    title: { en: "Smart City Program", th: "โครงการเมืองอัจฉริยะ", zh: "智慧城市计划" },
    place: "Hat Yai",
    description: {
      en: "Hat Yai — The commercial capital of southern Thailand and a vital gateway to Malaysia, driving ASEAN cross-border trade and connectivity.",
      th: "หาดใหญ่ — เมืองหลวงการค้าของภาคใต้และประตูสู่มาเลเซีย ขับเคลื่อนการค้าข้ามพรมแดนและการเชื่อมโยงอาเซียน",
      zh: "合艾 — 泰国南部商业之都，通往马来西亚的重要门户，推动东盟跨境贸易与互联互通。",
    },
  },
  methodology: {
    src: "/photos/wp-chanthaburi.jpg",
    objectPosition: "center 40%",
    title: { en: "Methodology", th: "วิธีการประเมิน", zh: "评估方法" },
    place: "Chanthaburi",
    description: {
      en: "Chanthaburi — The 「City of the Moon,」 world capital of gems and jewellery, famed for durian orchards and a unique French-colonial heritage.",
      th: "จันทบุรี — 「เมืองจันทร์」 เมืองหลวงอัญมณีและเครื่องประดับของโลก ขึ้นชื่อเรื่องสวนทุเรียนและมรดกเชิงอาณานิคมฝรั่งเศสที่เป็นเอกลักษณ์",
      zh: "尖竹汶 — 「月亮之城」，世界珠宝之都，以榴莲果园和独特的法国殖民遗产闻名。",
    },
  },
  story: {
    src: "/photos/wp-phangnga.jpg",
    objectPosition: "center 40%",
    title: { en: "Story", th: "เรื่องราว", zh: "故事" },
    place: "Phang Nga",
    description: {
      en: "Phang Nga — Home to Ao Phang Nga National Park and the iconic James Bond Island, a UNESCO-recognized natural heritage site of towering limestone karsts.",
      th: "พังงา — ที่ตั้งของอุทยานแห่งชาติอ่าวพังงาและเกาะเจมส์บอนด์อันโด่งดัง แหล่งมรดกธรรมชาติที่ได้รับการรับรองจากยูเนสโก",
      zh: "攀牙 — 攀牙湾国家公园和标志性詹姆斯·邦德岛所在地，联合国教科文组织认定的自然遗产，以高耸的石灰岩喀斯特地貌闻名。",
    },
  },
  why: {
    src: "/photos/slic-waterfront.jpg",
    objectPosition: "center 40%",
    title: { en: "Why SCITI", th: "ทำไมต้อง SCITI", zh: "为什么是 SCITI" },
    place: "Thailand",
    description: {
      en: "Thailand — A kingdom of 77 provinces bridging the Mekong and ASEAN, where ancient temples, tropical coastlines, and vibrant cultural diversity converge.",
      th: "ประเทศไทย — อาณาจักร 77 จังหวัดที่เชื่อมโยงแม่โขงและอาเซียน ที่ซึ่งวัดโบราณ ชายฝั่งเขตร้อน และความหลากหลายทางวัฒนธรรมมาบรรจบกัน",
      zh: "泰国 — 拥有77个府的王国，连接湄公河与东盟，古老寺庙、热带海岸线和丰富的文化多样性在此交汇。",
    },
  },
  showcase: {
    src: "/photos/wp-tak.jpg",
    objectPosition: "center 40%",
    title: { en: "Tak", th: "ตาก", zh: "达府" },
    place: "Tak",
    description: {
      en: "Tak — A historic western gateway to Myanmar tied to King Taksin the Great, home to the bustling Mae Sot border trade zone and the serene Ping River.",
      th: "ตาก — ประตูสู่พม่าทางตะวันตกที่มีประวัติศาสตร์ยาวนาน ผูกพันกับสมเด็จพระเจ้าตากสินมหาราช เขตการค้าชายแดนแม่สอดที่คึกคัก และแม่น้ำปิงอันเงียบสงบ",
      zh: "达府 — 通往缅甸的历史性西部门户，与达信大帝渊源深厚，拥有繁忙的美索边境贸易区和宁静的宾河。",
    },
  },
  partners: {
    src: "/photos/report-city-night.jpg",
    objectPosition: "center 40%",
    title: { en: "Partners", th: "พันธมิตร", zh: "伙伴" },
    place: "Thailand",
    description: {
      en: "Thailand at night — A nation of 70 million people serving as Southeast Asia's bridge, where fast-modernizing infrastructure meets millennia of heritage and digital transformation.",
      th: "ประเทศไทยยามค่ำคืน — ประเทศที่มีประชากร 70 ล้านคนเป็นสะพานเชื่อมเอเชียตะวันออกเฉียงใต้ ที่ซึ่งโครงสร้างพื้นฐานที่ทันสมัยอย่างรวดเร็วผสานกับมรดกหลายพันปีและการเปลี่ยนผ่านสู่ดิจิทัล",
      zh: "泰国夜景 — 一个7000万人口的国度，作为东南亚的桥梁，快速现代化的基础设施与千年遗产及数字化转型在此交融。",
    },
  },
  map: {
    src: "/photos/wp-klong-phadung.jpg",
    objectPosition: "center 40%",
    title: { en: "National Map", th: "แผนที่ประเทศ", zh: "全国地图" },
    place: "Bangkok",
    description: {
      en: "Bangkok's historic Khlong Phadung Krung Kasem — The 「Venice of the East」 owes its soul to waterways like this, once the lifeblood of a trading empire.",
      th: "คลองผดุงกรุงเกษมอันมีประวัติศาสตร์ของกรุงเทพฯ — 「เวนิสตะวันออก」 มีจิตวิญญาณจากทางน้ำเช่นนี้ ที่เคยเป็นสายเลือดของจักรวรรดิการค้า",
      zh: "曼谷历史悠久的帕东克鲁格卡塞姆运河 — 「东方威尼斯」的灵魂源于这样的水道，它曾是贸易帝国的命脉。",
    },
  },
  asus: {
    src: "/photos/wiki-bangkok-bts.jpg",
    objectPosition: "center 40%",
    title: { en: "ASUS Collaboration", th: "ความร่วมมือ ASUS", zh: "ASUS 合作" },
    place: "Bangkok",
    description: {
      en: "Bangkok's BTS Skytrain — A symbol of urban modernization and smart mobility, transforming how 15 million residents navigate the capital every day.",
      th: "รถไฟฟ้า BTS กรุงเทพฯ — สัญลักษณ์ของการทันสมัยของเมืองและความคล่องตัวอัจฉริยะ เปลี่ยนแปลงวิธีที่ประชากร 15 ล้านคนเดินทางในเมืองหลวงทุกวัน",
      zh: "曼谷BTS天轨 — 城市现代化和智慧出行的象征，每天改变着1500万居民在首都的出行方式。",
    },
  },
  audit: {
    src: "/photos/wp-chachoengsao.jpg",
    objectPosition: "center 40%",
    title: { en: "Jury walk-through", th: "เส้นทางสำหรับคณะกรรมการ", zh: "评审导览" },
    place: "Chachoengsao",
    description: {
      en: "Chachoengsao — The eastern gateway to Bangkok along the Bang Pakong River, home to the revered Wat Sothon Wararam and centuries of trading history.",
      th: "ฉะเชิงเทรา — ประตูสู่กรุงเทพฯ ทางตะวันออกริมแม่น้ำบางปะกง ที่ตั้งของวัดโสธรวรารามวรวิหารอันเป็นที่เคารพและประวัติศาสตร์การค้าหลายศตวรรษ",
      zh: "北柳府 — 曼谷东部门户，沿邦巴功河而建，拥有备受尊崇的索通寺和数百年的贸易历史。",
    },
  },
  references: {
    src: "/photos/wp-maesai.jpg",
    objectPosition: "center 40%",
    title: { en: "References", th: "แหล่งอ้างอิง", zh: "参考资料" },
    place: "Mae Sai",
    description: {
      en: "Mae Sai — Thailand's northernmost town on the Myanmar border, a historic crossroads of the Golden Triangle and a vibrant hub of cross-border trade.",
      th: "แม่สาย — เมืองเหนือสุดของไทยริมชายแดนพม่า จุดตัดทางประวัติศาสตร์ของสามเหลี่ยมทองคำและศูนย์กลางการค้าข้ามพรมแดนที่คึกคัก",
      zh: "美塞 — 泰国最北端城镇，位于缅泰边境，金三角的历史十字路口和活跃的跨境贸易中心。",
    },
  },
  knowledge: {
    src: "/photos/cmu-smart-city.jpg",
    objectPosition: "center 55%",
    title: { en: "Knowledge Base", th: "คลังความรู้", zh: "知识库" },
    place: "Chiang Mai University",
    description: {
      en: "Chiang Mai University — One of Thailand's premier research universities, pioneering smart-city research and digital innovation in the cultural heart of the North.",
      th: "มหาวิทยาลัยเชียงใหม่ — หนึ่งในมหาวิทยาลัยวิจัยชั้นนำของไทย ผู้บุกเบิกการวิจัยเมืองอัจฉริยะและนวัตกรรมดิจิทัลในใจกลางวัฒนธรรมภาคเหนือ",
      zh: "清迈大学 — 泰国顶尖研究型大学之一，在北部文化核心地带开创智慧城市研究和数字创新。",
    },
  },
  invest: {
    src: "/photos/wp-nakhonsawan.jpg",
    objectPosition: "center 40%",
    title: { en: "Invest", th: "ลงทุน", zh: "投资" },
    place: "Nakhon Sawan",
    description: {
      en: "Nakhon Sawan — The 「Heavenly City」 at the confluence of the Ping and Nan rivers, a strategic logistics hub and gateway to Northern Thailand.",
      th: "นครสวรรค์ — 「เมืองสวรรค์」 ที่จุดบรรจบของแม่น้ำปิงและน่าน ศูนย์กลางโลจิสติกส์เชิงกลยุทธ์และประตูสู่ภาคเหนือของไทย",
      zh: "北榄坡（那空沙旺）— 「天堂之城」，位于宾河与难河交汇处，战略物流枢纽和泰国北部的门户。",
    },
  },
  compare: {
    src: "/photos/wp-phichit.jpg",
    objectPosition: "center 40%",
    title: { en: "Compare Cities", th: "เปรียบเทียบเมือง", zh: "城市对比" },
    place: "Phichit",
    description: {
      en: "Phichit — Along the Nan River, known as Chalawan City for the legendary crocodile epic Krai Thong, where ancient folklore and timeless traditions endure.",
      th: "พิจิตร — ริมแม่น้ำน่าน ได้ฉายาเมืองชาละวันจากวรรณคดีไกรทองในตำนาน ที่ซึ่งตำนานโบราณและประเพณีอันเป็นเอกลักษณ์ยังคงดำรงอยู่",
      zh: "披集 — 位于难河畔，因传奇鳄鱼史诗《盖通》而被称为「差拉万之城」，古老的民间传说和永恒的传统在此延续。",
    },
  },
  bingo: {
    src: "/photos/wp-phitsanulok.jpg",
    objectPosition: "center 40%",
    title: { en: "SCITI Bingo", th: "SCITI บิงโก", zh: "SCITI 宾果" },
    place: "Phitsanulok",
    description: {
      en: "Phitsanulok — 「Vishnu's Heaven,」 home to the sacred Wat Phra Si Rattana Mahathat and a historic crossroads of Northern and Central Thailand.",
      th: "พิษณุโลก — 「สวรรค์ของพระนารายณ์」 ที่ตั้งของวัดพระศรีรัตนมหาธาตุอันเป็นที่เคารพ และจุดตัดทางประวัติศาสตร์ของภาคเหนือและภาคกลาง",
      zh: "彭世洛 — 「毗湿奴的天堂」，神圣的帕西拉塔纳玛哈泰寺所在地，泰国北部与中部的历史十字路口。",
    },
  },
  about: {
    src: "/photos/wp-nan.jpg",
    objectPosition: "center 40%",
    title: { en: "Mission", th: "พันธกิจ", zh: "使命" },
    place: "Nan",
    description: {
      en: "Nan — A UNESCO Creative City renowned for exquisite temple murals, deep Lanna cultural roots, and breathtaking mountain landscapes in the far North.",
      th: "น่าน — เมืองสร้างสรรค์ยูเนสโกที่มีชื่อเสียงด้านจิตรกรรมฝาผนังวัดอันงดงาม รากฐานวัฒนธรรมล้านนาอันลึกซึ้ง และทิวทัศน์ภูเขาอันน่าทึ่งในภาคเหนือสุด",
      zh: "难府 — 联合国教科文组织创意城市，以精美的寺庙壁画、深厚的兰纳文化根基和北部壮丽的山景闻名。",
    },
  },
  "creative-economy": {
    src: "/photos/wp-ubon.jpg",
    objectPosition: "center 40%",
    title: { en: "Creative Economy", th: "เศรษฐกิจสร้างสรรค์", zh: "创意经济" },
    place: "Ubon Ratchathani",
    description: {
      en: "Ubon Ratchathani — The cultural heart of the Northeast, famous for the spectacular Candle Festival, ancient Khmer heritage, and a thriving creative-arts scene.",
      th: "อุบลราชธานี — ใจกลางวัฒนธรรมของภาคตะวันออกเฉียงเหนือ ขึ้นชื่อเรื่องประเพณีแห่เทียนพรรษาอันงดงาม มรดกขอมโบราณ และวงการศิลปะสร้างสรรค์ที่เฟื่องฟู",
      zh: "乌汶叻差他尼 — 泰国东北部的文化心脏，以壮观的蜡烛节、古老的吴哥遗产和蓬勃发展的创意艺术场景闻名。",
    },
  },
};
