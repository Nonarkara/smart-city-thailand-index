/**
 * NONG PLUB (น้องพลับ) CRAYON TRAVELOGUE
 * =====================================
 * Hand-drawn human companion across Thailand's 118 smart cities.
 *
 * Grounded in Dr Non's lived-in travelogue voice (evoking miaoshen.nonarkara.org/#?route=history),
 * Nong Plub breaks the cold, AI-generated statistical austerity of bureaucratic
 * smart city metrics with human warmth, tactile crayon craft, and intimate sensory details.
 *
 * Wardrobe Variations (faithful to real reference photos):
 *   - "urban"    : Purple knit cardigan, black cap with red rim & NCREE logo, sling bag, peace sign
 *   - "heritage" : Soft peach sleeveless top, gentle smile beside ancient brick walls
 *   - "temple"   : White cap with red "NON" embroidery, sunglasses on brim, Adidas athletic tee
 *   - "cafe"     : Dark plaid dress, colorful beaded bracelets, smartwatch, deck table & laptop/iced tea
 *   - "nature"   : Cyan windbreaker, black sling bag, joggers & sneakers, holding local snack bag by railway
 */

import type { Locale, SmartCity } from "./types";

export type NongPlubOutfit = "urban" | "heritage" | "temple" | "cafe" | "nature";

export interface NongPlubCityRecord {
  cityId: string;
  outfit: NongPlubOutfit;
  assetPath: string;
  siteName: {
    en: string;
    th: string;
    zh: string;
  };
  activity: {
    en: string;
    th: string;
    zh: string;
  };
  quote: {
    en: string;
    th: string;
    zh: string;
  };
  tip: {
    en: string;
    th: string;
    zh: string;
  };
  flavorTag: {
    en: string;
    th: string;
    zh: string;
  };
}

export const NONG_PLUB_ASSETS: Record<NongPlubOutfit, string> = {
  urban: "/nong-plub/nong-plub-urban.svg",
  heritage: "/nong-plub/nong-plub-heritage.svg",
  temple: "/nong-plub/nong-plub-temple.svg",
  cafe: "/nong-plub/nong-plub-cafe.svg",
  nature: "/nong-plub/nong-plub-nature.svg",
};

export const NONG_PLUB_AVATAR = "/nong-plub/nong-plub-avatar.svg";

/**
 * Editorial, intimate travelogue entries for benchmark cities.
 */
const CURATED_NONG_PLUB_ENTRIES: Record<string, Omit<NongPlubCityRecord, "cityId" | "assetPath">> = {
  "chiang-mai-old-town": {
    outfit: "heritage",
    siteName: {
      en: "Tha Phae Gate & Ancient City Moat",
      th: "ประตูท่าแพ และคูเมืองโบราณ",
      zh: "塔佩门与古城护城河",
    },
    activity: {
      en: "Morning stroll in the cool mist before the city wakes",
      th: "เดินรับลมหนาวเลียบคูเมืองตอนเช้าตรู่ก่อนเมืองตื่น",
      zh: "清晨在微凉的薄雾中漫步护城河畔",
    },
    quote: {
      en: "I love walking along the red brick wall just before 7 AM when monks walk past on their morning alms. Stop by the corner shophouse for hot soy milk and crispy patongko with pandan custard. IoT sensors and haze monitors run silently on the lamp posts, but the morning chime from Wat Chedi Luang is the real pulse of Chiang Mai.",
      th: "พลับชอบเดินเลียบคูเมืองก่อน 7 โมงเช้าตอนพระบิณฑบาต แวะร้านหัวมุมดื่มน้ำเต้าหู้ร้อนกับปาท่องโก๋จิ้มสังขยาใบเตย เซนเซอร์ตรวจวัดหมอกควันบนเสาไฟอาจจะทำงานเงียบๆ แต่เสียงระฆังเช้าจากวัดเจดีย์หลวงคือลมหายใจที่แท้จริงของเชียงใหม่",
      zh: "我最喜欢在清晨七点前沿着红砖城墙散步，看僧侣穿过晨曦化缘。在街角老店喝一碗热豆浆配香兰酱油条。街灯上的智能传感器在安静运转，但真正唤醒这座城市的，是古寺里传来的清脆晨钟。",
    },
    tip: {
      en: "Walk counter-clockwise along the moat from Tha Phae to Sompet Market to catch the morning steam and local flower stalls.",
      th: "เดินทวนเข็มนาฬิกาจากประตูท่าแพมุ่งหน้าตลาดสมเพชร จะได้เห็นควันนึ่งข้าวเหนียวกับแผงดอกไม้สดที่คึกคักที่สุด",
      zh: "从塔佩门逆时针走向松撇市场，能偶遇冒着热气的小摊和新鲜的晨市花市。",
    },
    flavorTag: {
      en: "Hot soy milk & temple morning bells",
      th: "น้ำเต้าหู้ร้อนกับเสียงระฆังวัด",
      zh: "热豆浆与古寺晨钟",
    },
  },

  "cmu-smart-city": {
    outfit: "cafe",
    siteName: {
      en: "Ang Kaew Reservoir & Suthep Foothills",
      th: "อ่างแก้ว มหาวิทยาลัยเชียงใหม่",
      zh: "昂考水库与素贴山麓",
    },
    activity: {
      en: "Sitting by the water sketching dogs and pine trees with an iced tea",
      th: "นั่งรับลมริมอ่างแก้ว จิบชาเย็นดูน้องหมาวิ่งเล่นใต้ทิวสน",
      zh: "坐在水库边喝冰茶，画树荫下奔跑的小狗",
    },
    quote: {
      en: "Ang Kaew at 5 PM is where campus science turns into sheer poetry. The reflection of Doi Suthep ripples on the blue reservoir as students jog by and families spread picnic mats. Plub brought her laptop and sketchpad here — smart energy grids reduce campus emissions, but this cool mountain breeze is the smartest thing Chiang Mai ever built.",
      th: "อ่างแก้วตอน 5 โมงเย็นคือที่ที่วิทยาศาสตร์กลายเป็นบทกวี เงาดอยสุเทพสะท้อนบนผิวน้ำสีคราม น้องๆ นักศึกษาออกมาวิ่ง พลับพกแล็ปท็อปกับสมุดสเก็ตช์มานั่งตรงนี้ ระบบสมาร์ทกริดช่วยประหยัดไฟมหาลัยได้เยอะ แต่ลมเย็นจากยอดดอยตรงนี้นี่แหละคือความฉลาดที่แท้จริง",
      zh: "傍晚五点的昂考水库是校园里最惬意的地方。素贴山的倒影在水面上荡漾，风吹过松林带着山野的凉意。智慧电网确实节能，但这一池碧水和傍晚的微风，才是清迈最动人的智慧。",
    },
    tip: {
      en: "Find a wooden bench near the Faculty of Fine Arts side; the mountain light turns amber between 17:15 and 17:45.",
      th: "หาที่นั่งใต้ร่มไม้ฝั่งคณะวิจิตรศิลป์ แสงอาทิตย์จะตกกระทบผิวน้ำเป็นสีอำพันสวยที่สุดช่วง 17.15-17.45 น.",
      zh: "在艺术学院侧找一处长椅，下午五点半的光线投在水面上如金箔般宁静。",
    },
    flavorTag: {
      en: "Iced Thai tea & mountain sunset reflection",
      th: "ชาเย็นริมอ่างแก้วกับเงาดอยสุเทพ",
      zh: "冰泰茶与素贴山落日倒影",
    },
  },

  "nakhon-si-thammarat": {
    outfit: "temple",
    siteName: {
      en: "Wat Phra Mahathat & Ancient Chedi Courtyard",
      th: "วัดพระมหาธาตุวรมหาวิหาร นครศรีธรรมราช",
      zh: "洛坤大圣塔寺古院",
    },
    activity: {
      en: "Stepping onto the sun-warmed courtyard where the Chedi casts no shadow",
      th: "ก้าวสู่ลานทรายพระบรมธาตุเจดีย์ที่ไร้เงาทาบทาบ",
      zh: "走入大圣塔下相传无影的古老沙院",
    },
    quote: {
      en: "They say the golden spire of Phra Mahathat casts no shadow on the courtyard sand at high noon. Standing barefoot on the warm flagstones, you feel eight centuries of southern travelers who paused here. Behind the temple gate, follow the aroma of black coffee to the old Hainanese kopitiam for soft-boiled eggs with white pepper.",
      th: "คนเมืองคอนเล่ากันว่ายอดเจดีย์ทองคำไม่เคยทอดเงาลงบนพื้นทรายยามเที่ยงวัน พลับถอดรองเท้าเดินบนลานหินอุ่นๆ สัมผัสได้ถึงพลังของคนโบราณที่สัญจรมาแปดร้อยปี เดินทะลุด้านหลังวัดไปตามกลิ่นกาแฟคั่วโบราณ ไข่ลวกเหยาะพริกไทยขาวกับโกปี๊ร้อนคือที่สุด",
      zh: "相传正午时分，大圣塔尖不会在地面留下阴影。赤足走在微温的石阶上，仿佛能触摸到八百年南海商旅的足迹。穿过寺门后巷，循着醇厚咖啡香去老茶室点一份半熟蛋与白胡椒，暖意入胃。",
    },
    tip: {
      en: "Take off your shoes and feel the fine river sand around the main stupa, then walk 200m north for spicy rice noodles with wild herbs.",
      th: "ถอดรองเท้าเดินสัมผัสทรายแก้วรอบองค์พระธาตุ แล้วแวะชิมขนมจีนน้ำยาป่าผักสดจัดเต็มฝั่งตรงข้าม",
      zh: "赤足感受主塔周围细腻的细沙，出寺后向北走两百米品尝地道香草米线。",
    },
    flavorTag: {
      en: "Hainanese kopitiam & golden spire reverence",
      th: "โกปี๊ร้อนกับความสงบใต้ร่มพระบรมธาตุ",
      zh: "传统老咖啡与金顶梵香",
    },
  },

  "phuket": {
    outfit: "cafe",
    siteName: {
      en: "Thalang Road & Soi Romanee Sino-Portuguese Shophouses",
      th: "ถนนถลาง และซอยรมณีย์ เมืองเก่าภูเก็ต",
      zh: "他朗路与罗曼尼巷中葡老街",
    },
    activity: {
      en: "Exploring pastel colonnades and tasting freshly fried O-Aew shaved ice",
      th: "เดินลอดซุ้มประตูห้าตาสีพาสเทล ชิมโอ้เอ๋วหวานเย็นชื่นใจ",
      zh: "穿行于粉彩连廊之间，品尝清凉爽口的爱玉冰",
    },
    quote: {
      en: "Don't just admire the pastel Sino-Portuguese facades from the middle of the street. Step under the five-foot arcades (Ngo-Ka-Ki) when rain patters on the terracotta tiles. Nong Plub found an elderly Baba lady selling traditional banana-flower spring rolls and herbal O-Aew jelly. The smart sensors here track tour bus queues, but this century-old kitchen smells like real heritage.",
      th: "อย่าเพิ่งมัวแต่ยืนถ่ายรูปตึกแถวชิโนโปรตุกีสกลางถนน ลองก้าวเข้าไปหลบฝนใต้ซุ้มห้าตา (หง่อคาขี่) ฟังเสียงฝนกระทบกระเบื้องดินเผา พลับได้คุยกับคุณป้าเปอรานากันที่ทำโอ้เอ๋วสูตรโบราณใส่กล้วยน้ำว้าเชื่อม ระบบกล้อง AI คอยนับรถบัสนักท่องเที่ยวก็จริง แต่กลิ่นอบควันเทียนในบ้านโบราณหลังนี้คือหัวใจของเกาะภูเก็ต",
      zh: "别只顾着在街中央拍彩色骑楼。下雨时走进“五脚基”连廊，听雨水顺着陶瓦滴落。在巷子深处找一位做传统爱玉冰的阿婆，草本清凉伴着香蕉甜香。现代摄像头在监测车流，但百年屋檐下的慢时光才是普吉的灵魂。",
    },
    tip: {
      en: "Visit at 8:30 AM before the tour groups arrive; light slants diagonally across the pastel timber shutters.",
      th: "แวะมาตอนแปดโมงครึ่งก่อนรถตู้ทัวร์ลง แสงแดดยามเช้าจะส่องเฉียงกระทบบานหน้าต่างไม้ฉลุลายสวยที่สุด",
      zh: "上午八点半前到达，阳光斜穿木雕百叶窗，静谧无人。",
    },
    flavorTag: {
      en: "Chilled O-Aew jelly & five-foot arcade breeze",
      th: "โอ้เอ๋วเย็นฉ่ำใต้ซุ้มห้าตา",
      zh: "清凉爱玉冰与五脚基过堂风",
    },
  },

  "samyan": {
    outfit: "urban",
    siteName: {
      en: "Samyan Mitrtown Roof Garden & Chula Smart District",
      th: "สวนลอยฟ้าสามย่านมิตรทาวน์ และย่านนวัตกรรมจุฬาฯ",
      zh: "三燕顶层空中花园与朱大创新街区",
    },
    activity: {
      en: "Overlooking the electric bus loop while sketching city rooftops",
      th: "มองดูรถเมล์ไฟฟ้าวิ่งวนในแคมปัส พลางสเก็ตช์ภาพเส้นขอบฟ้ากรุงเทพฯ",
      zh: "在空中花园俯瞰穿梭的电动巴士与曼谷天际线",
    },
    quote: {
      en: "Samyan proves that a smart city doesn't have to feel cold and sterile. Plub stepped onto the open-air wooden rooftop just as the sunset turned the Bangkok glass towers into molten amber. Below, student EV shuttles hum silently past noodle stalls that have stood for four generations. High-tech sensors and crispy garlic pork can live happily side by side.",
      th: "สามย่านทำให้เห็นว่าเมืองอัจฉริยะไม่จำเป็นต้องเย็นชา พลับขึ้นมารับลมบนดาดฟ้าตอนตะวันตกดิน ตึกกระจกสะท้อนแสงสีทองอร่าม ข้างล่างมีรถเมล์ไฟฟ้า EV วิ่งผ่านร้านโจ๊กสามย่านกับข้าวหมูกรอบเตาถ่านที่ขายมาสี่รุ่น เทคโนโลยีล้ำๆ อยู่ร่วมกับของอร่อยดั้งเดิมได้อย่างอบอุ่นจริงๆ",
      zh: "三燕证明了智慧街区不必冰冷生硬。黄昏登上次顶层露台，夕阳将摩天大楼镀上熔金色泽。楼下静音电动小巴轻巧驶过，旁边便是香气四溢的四代炭火烧肉摊。前沿科技与市井烟火在这里温柔交融。",
    },
    tip: {
      en: "Take the 24-hour lift to the 5th floor open deck; breeze flows through from Rama IV Road between 18:00 and 19:30.",
      th: "กดลิฟต์ขึ้นชั้น 5 สวนลอยฟ้าเปิดรับลม ลมจากถนนพระราม 4 จะพัดเย็นสบายช่วง 18.00-19.30 น.",
      zh: "乘电梯直达五层空中露台，傍晚六点到七点半的晚风最为宜人。",
    },
    flavorTag: {
      en: "Crispy pork rice & sunset rooftop skyline",
      th: "หมูกรอบเตาถ่านกับวิวตึกระฟ้าสีทอง",
      zh: "老铺香脆脆肉与落日天际线",
    },
  },

  "rattanakosin": {
    outfit: "heritage",
    siteName: {
      en: "Tha Tien Pier & Wat Arun River Viewpoint",
      th: "ท่าเตียน ริมฝั่งแม่น้ำเจ้าพระยา มองพระปรางค์วัดอรุณ",
      zh: "塔田码头与对岸郑王庙江景",
    },
    activity: {
      en: "Watching river barges glide past as dusk settles on the Grand Palace",
      th: "ดูเรือโยงล่องผ่านสายน้ำเจ้าพระยา ยามค่ำคืนเริ่มแต้มสีรอบเกาะรัตนโกสินทร์",
      zh: "静看拖船划过湄南河，余晖洒在老皇宫的金顶上",
    },
    quote: {
      en: "Behind the stone palace walls, slip down into the narrow alleyways of Tha Tien. Plub leaned against the wooden pier railing as the Chao Phraya river breeze ruffled her hair. Across the water, Wat Arun's porcelain spire lights up like a white star. The city's digital heritage mapping is impressive, but nothing matches the smell of rain hitting warm river planks.",
      th: "ด้านหลังกำแพงวังหลวง ลองเดินเลี้ยวเข้าตรอกท่าเตียน พลับยืนพิงราวไม้ท่าเรือรับลมแม่น้ำเจ้าพระยา มองข้ามฝั่งไปเห็นพระปรางค์วัดอรุณเปิดไฟสว่างดั่งดวงดาวสีขาว แผนที่ดิจิทัลอนุรักษ์เมืองทำได้ดีมาก แต่ไม่มีอะไรแทนความรู้สึกของสายลมเย็นที่พัดละอองน้ำขึ้นมาแตะผิวเราได้เลย",
      zh: "穿过大皇宫外的林荫道，拐进塔田的静谧小巷。傍晚站在旧木码头栏杆前，河风吹起发丝，对岸郑王庙的陶瓷尖顶在暮色中泛着微光。数字化测绘再精准，也比不上这一缕掠过江面的真实水汽。",
    },
    tip: {
      en: "Order a glass of iced Ceylon tea with condensed milk from the 70-year-old shophouse beside the pier stairs.",
      th: "แวะสั่งชาซีลอนโบราณใส่นมข้นหวานจากห้องแถวไม้อายุ 70 ปีติดบันไดท่าเรือ ดื่มดับร้อนก่อนข้ามฟาก",
      zh: "码头台阶旁有家七十年木屋茶摊，点一杯醇香的冰炼乳红茶解暑最惬意。",
    },
    flavorTag: {
      en: "River breeze & Wat Arun porcelain glow",
      th: "ลมแม่น้ำเจ้าพระยากับประกายกระเบื้องวัดอรุณ",
      zh: "江畔晚风与郑王庙陶瓷华光",
    },
  },

  "khon-kaen": {
    outfit: "cafe",
    siteName: {
      en: "Bueng Kaen Nakhon Lake & Kaen Ground Arts District",
      th: "บึงแก่นนคร และลานศิลปะร่วมสมัยขอนแก่น",
      zh: "孔敬九龙湖畔与当代艺术区",
    },
    activity: {
      en: "Strolling around the lake with grilled sticky rice in hand",
      th: "เดินกินข้าวจี่ทาไข่หอมกรุ่น รับลมรอบบึงแก่นนคร",
      zh: "拿着热气腾腾的烤糯米饼，信步环九龙湖漫步",
    },
    quote: {
      en: "Khon Kaen talks a lot about smart mobility and light rail prototypes, but Bueng Kaen Nakhon is where the city's soul gathers every evening. Plub bought two warm Khao Jee (grilled sticky rice with egg) from an Isan auntie and watched young buskers play folk phin lutes beside modern cafe terraces. That's real civic intelligence.",
      th: "ขอนแก่นพูดถึงสมาร์ทโมบิลิตี้กับรถไฟรางเบาเยอะมาก แต่บึงแก่นนครคือที่ที่หัวใจของคนขอนแก่นมารวมกันทุกเย็น พลับซื้อข้าวจี่ชุบไข่ย่างร้อนๆ สองไม้ เดินฟังน้องๆ ดีดพิณอีสานผสมกีตาร์ริมบึงข้างร้านกาแฟดีไซน์เก๋ นี่แหละคือเมืองที่น่าอยู่จริง",
      zh: "大家总在谈孔敬的智能轻轨与智慧交通，但真正凝聚这座城市的，是每个傍晚的九龙湖。买一串刚烤透、刷了蛋液的香甜糯米粑，听湖边少年弹奏东北民乐与木吉他，这才是生活该有的温度。",
    },
    tip: {
      en: "Walk along the southern boardwalk between 17:30 and 18:30 for the best breeze and local street buskers.",
      th: "เดินสะพานไม้ฝั่งทิศใต้ช่วง 17.30-18.30 น. ลมพัดเย็นสบายและมีนักดนตรีเปิดหมวกเยอะที่สุด",
      zh: "傍晚五点半至六点半走在南侧木栈道上，微风伴着街头艺人的歌声。",
    },
    flavorTag: {
      en: "Warm Khao Jee & lakeside sunset phin music",
      th: "ข้าวจี่ชุบไข่ย่างกับเสียงพิณริมบึง",
      zh: "现烤蛋香糯米饼与湖畔琴音",
    },
  },

  "korat": {
    outfit: "heritage",
    siteName: {
      en: "Thao Suranari Monument & Chomphon Gate",
      th: "อนุสาวรีย์ท้าวสุรนารี (ย่าโม) และประตูชุมพล",
      zh: "陶顺娜丽巾帼像与春蓬古城门",
    },
    activity: {
      en: "Paying respects with sweet marigold garlands and tasting Korat stir-fried noodles",
      th: "ไหว้สักการะย่าโมด้วยพวงมาลัยดาวเรือง แวะกินผัดหมี่โคราชรสจัดจ้าน",
      zh: "敬献万寿菊花环，品尝酸甜微辣的正宗呵叻炒粉",
    },
    quote: {
      en: "Passing through the ancient Chomphon gate, legend says anyone who walks beneath its timber beam will always find their way back to Korat. Nong Plub clasped her hands respectfully before Ya Mo, surrounded by fresh marigolds and the rhythmic clatter of traditional Phleng Korat dancers. Just around the corner, grandma's cast-iron wok was tossing Korat noodles with spicy tamarind paste.",
      th: "เขาว่าใครเดินลอดซุ้มประตูชุมพลโบราณจะได้กลับมาเยือนโคราชอีกครั้ง พลับยกมือไหว้คุณย่าโมท่ามกลางกลิ่นหอมของดอกดาวเรืองสดและเสียงเพลงโคราชแก้บน เลี้ยวเข้าซอยข้างวัดไปเจอคุณยายกำลังควงตะหลิวผัดหมี่โคราชเส้นเหนียวนุ่ม ซอสมะขามเปียกเข้มข้นจนต้องสั่งเบิ้ล",
      zh: "当地传说穿过春蓬古城门的人终会重返呵叻。在巾帼像前献上一串万寿菊花环，耳畔是传统的民间清唱。转过街角，铁锅正翻炒着裹满罗望子酱汁的韧劲米粉，香气四溢。",
    },
    tip: {
      en: "Walk beneath the arch of Chomphon Gate on foot, then head into Soi Wat Pa Salawan for fresh Khanom Jean Pradok curry.",
      th: "เดินลอดซุ้มประตูชุมพลด้วยเท้าเปล่า แล้วแวะเข้าซอยวัดป่าสาลวันชิมขนมจีนประโดกน้ำยาปลาช่อน",
      zh: "步行穿过古城门，随后步行前往附近的街巷品尝手作鲜米线。",
    },
    flavorTag: {
      en: "Tamarind Pad Mee & sacred marigold fragrance",
      th: "ผัดหมี่โคราชรสเด็ดกับกลิ่นมาลัยดาวเรือง",
      zh: "罗望子炒粉与清香万寿菊",
    },
  },

  "mae-moh": {
    outfit: "nature",
    siteName: {
      en: "Mae Moh Botanical Garden & Bua Tong Sunflower Fields",
      th: "สวนพฤกษศาสตร์แม่เมาะ และทุ่งบัวตอง",
      zh: "美莫植物园与野向日葵花田",
    },
    activity: {
      en: "Walking the misty valley overlook where coal mining meets green forest reclamation",
      th: "สูดอากาศบริสุทธิ์บนจุดชมวิวแม่เมาะ มองทุ่งดอกไม้ที่ฟื้นฟูจากเหมืองเก่า",
      zh: "在晨雾中的山谷眺望台漫步，看矿山蜕变为翠绿花田",
    },
    quote: {
      en: "You might expect Mae Moh to feel heavy and industrial, but standing up here in the November chill, golden Mexican sunflowers roll across the hills as far as the eye can see. Plub wrapped her cyan windbreaker tight against the mountain breeze, holding a bag of roasted Lampang chestnuts. Watching green reforestation take over the old mine terraces gives you genuine hope for industrial transitions.",
      th: "ตอนแรกคิดว่าแม่เมาะจะดูเคร่งขรึมแบบโรงไฟฟ้า แต่พอขึ้นมาถึงจุดชมวิวในลมหนาว ดอกบัวตองสีเหลืองอร่ามบานสะพรั่งเต็มเนินเขา พลับกระชับเสื้อกันลมสีฟ้าแล้วแกะเกาลัดคั่วร้อนๆ กินพลางมองผืนป่าที่ฟื้นฟูกลับคืนมา การเปลี่ยนผ่านพลังงานของที่นี่จับต้องได้และมีชีวิตจริงๆ",
      zh: "本以为重工业小镇会显得冷峻，但置身于十一月的山风中，漫山遍野盛开的金色向日葵令人豁然开朗。裹紧蓝色风衣，捧一包热栗子，俯瞰梯田般层层复绿的矿山，能切身感受到这片土地重生的坚韧。",
    },
    tip: {
      en: "Visit in the early morning between 06:30 and 08:00 when thick fog settles over the reclaimed reservoir basin.",
      th: "แนะนำให้ขึ้นมาแต่เช้าตรู่ 06.30-08.00 น. จะได้เห็นทะเลหมอกขาวโพลนลอยคลอเคลียอ่างเก็บน้ำ",
      zh: "清晨六点半到八点最佳，常有薄雾如轻纱般笼罩水库平原。",
    },
    flavorTag: {
      en: "Roasted chestnuts & reclaimed wild sunflowers",
      th: "เกาลัดคั่วอุ่นๆ กับทุ่งบัวตองบานสะพรั่ง",
      zh: "暖手炒栗子与漫野向日葵",
    },
  },

  "lampang": {
    outfit: "nature",
    siteName: {
      en: "Kad Kong Ta Walking Street & Historic Horse Carriages",
      th: "ถนนคนเดินกาดกองต้า และสถานีรถม้าลำปาง",
      zh: "达功街百年木屋集市与古朴马车",
    },
    activity: {
      en: "Listening to the clip-clop of horse hooves past teak merchant houses",
      th: "ฟังเสียงเกือกม้ากระทบหินกรวดผ่านหน้าเรือนไม้สักโบราณ",
      zh: "听清脆的马蹄声踏过百年柚木商行街巷",
    },
    quote: {
      en: "Lampang has a rhythm that refuses to be rushed. Plub strolled down the century-old teak market along the Wang River, tasting crispy Khao Tan (crisp rice crackers drizzled with warm sugarcane syrup). Behind her, a painted horse carriage trotted past like clockwork. Technology should help us protect quiet towns like this, not speed them up into noise.",
      th: "ลำปางเป็นเมืองที่มีจังหวะก้าวเป็นของตัวเอง พลับเดินเลาะตลาดกาดกองต้าริมแม่น้ำวัง ชิมข้าวแต๋นน้ำแตงโมราดน้ำอ้อยหอมกรอบ ได้ยินเสียงเกือกม้ากุบกับวิ่งผ่านเรือนไม้สักโบราณ เทคโนโลยีที่ดีควรช่วยปกป้องความสงบแบบนี้ ไม่ใช่เร่งให้ทุกอย่างกลายเป็นความเร่งรีบ",
      zh: "南邦有着不疾不徐的生活节奏。沿着汪河边的百年柚木老街漫步，咬一口淋了甘蔗浓汁的酥脆米饼，耳边响起马车慢悠悠穿行的声响。科技该做的是守护这份古意与从容，而非将一切推向喧嚣。",
    },
    tip: {
      en: "Cross the historic Ratchadapisek Bridge at sunset; teak balconies turn copper in the fading light.",
      th: "เดินข้ามสะพานรัษฎาภิเศกตอนพระอาทิตย์ตกดิน แสงสีทองจะส่องระเบียงไม้สักโบราณให้กลายเป็นสีทองแดง",
      zh: "日落时走过百年的拉萨达披色桥，古木骑楼被暮光镀上一层温暖的琥珀色。",
    },
    flavorTag: {
      en: "Sugarcane Khao Tan & horse carriage clip-clop",
      th: "ข้าวแต๋นน้ำอ้อยกับเสียงรถม้ากุบกับ",
      zh: "甘蔗汁脆米饼与悠然马蹄声",
    },
  },

  "chiang-rai": {
    outfit: "temple",
    siteName: {
      en: "Wat Rong Suea Ten (Blue Temple) & Kok River Promenade",
      th: "วัดร่องเสือเต้น (วัดสีน้ำเงิน) และริมน้ำกก",
      zh: "清莱蓝庙与郭河滨河步道",
    },
    activity: {
      en: "Admiring sapphire blue mural brushwork and sipping butterfly pea coconut milk",
      th: "ชื่นชมจิตรกรรมสีน้ำเงินคราม จิบนมอัญชันมะพร้าวอ่อนริมแม่น้ำกก",
      zh: "沉浸于静谧深邃的宝蓝壁画，啜饮一杯蝶豆花椰奶",
    },
    quote: {
      en: "The sapphire hues of Chiang Rai's modern northern temples feel like walking into a lucid dream. Nong Plub stood before the porcelain dragons with a glass of cool butterfly pea coconut shake. Outside, the Kok River flows silently toward the Mekong. You can track all the river sediment IoT data you like, but the serenity here is something you have to sit with.",
      th: "เฉดสีน้ำเงินไพลินของวัดร่องเสือเต้นเหมือนพาเราหลุดเข้าไปในความฝัน พลับยืนมองลวดลายพญานาคอ่อนช้อยพลางจิบนมอัญชันมะพร้าวอ่อนเย็นชื่นใจ ข้างนอกนั้นแม่น้ำกกกำลังไหลเอื่อยไปสู่แม่โขง ข้อมูลเซนเซอร์ในน้ำอาจจะบอกคุณภาพลุ่มน้ำได้ครบถ้วน แต่ความสงบนิ่งที่นี่ต้องมานั่งสัมผัสด้วยใจตัวเอง",
      zh: "清莱蓝庙那深邃如夜空的宝蓝色，让人仿佛步入神话幻境。在雕琢细腻的蓝龙雕塑旁喝一杯清凉的蝶豆花椰露。寺外郭河静静流向湄公河，传感器可以记录水质，但内心的澄澈唯有亲临方能体会。",
    },
    tip: {
      en: "Step inside during the noon heat; the sapphire interior temperature drops instantly thanks to high Lanna rafters.",
      th: "แวะเข้าไปไหว้พระช่วงบ่าย อากาศข้างในวิหารจะเย็นลงทันทีด้วยโครงสร้างหลังคาล้านนาทรงสูง",
      zh: "午后步入殿堂，高耸的兰纳木梁自然通风，顷刻褪去暑意。",
    },
    flavorTag: {
      en: "Butterfly pea coconut shake & sapphire peace",
      th: "นมอัญชันมะพร้าวอ่อนกับความสงบสีน้ำเงินคราม",
      zh: "蝶豆花椰香饮与深蓝宁静",
    },
  },

  "ayutthaya": {
    outfit: "heritage",
    siteName: {
      en: "Wat Mahathat Sandstone Buddha Head in Tree Roots",
      th: "เศียรพระพุทธรูปในรากไม้ วัดมหาธาตุ อยุธยา",
      zh: "大城玛哈泰寺树抱佛首",
    },
    activity: {
      en: "Sitting quietly beneath sacred bodhi trees beside ancient laterite stupas",
      th: "นั่งสงบนิ่งใต้ร่มโพธิ์ข้างซากปรางค์ศิลาแลงโบราณ",
      zh: "在菩提树荫下静坐，凝望砖石古塔的岁月刻痕",
    },
    quote: {
      en: "Everyone comes for the famous sandstone head resting in the bodhi roots, but the quietest moment is five in the afternoon when the tour groups clear out. Plub sat beside the crumbling brick wall, feeling the cool river air drifting in from the Pasak River. A sweet bag of freshly spun Roti Sai Mai (cotton candy pancakes) in hand — five hundred years of history feels immediate and tender.",
      th: "ใครๆ ก็มาดูเศียรพระในรากไม้ แต่ช่วงเวลาที่สงบที่สุดคือหลังห้าโมงเย็นตอนที่ทัวร์กลับหมดแล้ว พลับนั่งพิงกำแพงอิฐเก่า สัมผัสลมเย็นที่พัดมาจากแม่น้ำป่าสัก ถือโรตีสายไหมแป้งสดหอมใบเตยอุ่นๆ ห้าร้อยปีของประวัติศาสตร์อยุธยาไม่ได้ดูไกลตัวเลย แต่สัมผัสได้ใกล้ชิดและอ่อนโยน",
      zh: "游人多为树抱佛首而来，但最动人的却是傍晚五点后人潮散去的那一刻。抚摸被晚霞浸润的红砖残垣，微风送来河水的湿润。手里捧着现卷的香兰糖丝春卷，数百年的历史在这安宁的暮色里显得亲切而温存。",
    },
    tip: {
      en: "Rent a bicycle from the railway station to ride the outer temple island loop before sunset.",
      th: "เช่าจักรยานจากสถานีรถไฟปั่นลัดเลาะเกาะเมืองรอบนอก จะได้เห็นเงาสะท้อนเจดีย์บนผืนน้ำยามเย็น",
      zh: "在火车站旁租一辆单车骑行外围环岛，黄昏的水中塔影尤为动人。",
    },
    flavorTag: {
      en: "Fresh Roti Sai Mai & bodhi tree serenity",
      th: "โรตีสายไหมแป้งสดกับความสงบใต้ร่มโพธิ์",
      zh: "热卷香兰糖丝饼与菩提树下禅意",
    },
  },

  "hat-yai": {
    outfit: "urban",
    siteName: {
      en: "Kim Yong Market & Greenway Night Market",
      th: "ตลาดกิมหยง และตลาดกรีนเวย์ หาดใหญ่",
      zh: "合艾金荣市场与格林威夜市",
    },
    activity: {
      en: "Hunting for crisp southern fried chicken topped with mountain shallots",
      th: "ตามรอยไก่ทอดหาดใหญ่แท้ๆ โรยหอมเจียวทอดกรอบพูนจาน",
      zh: "寻味正宗合艾炸鸡，铺满酥脆金黄的红葱头碎",
    },
    quote: {
      en: "Hat Yai runs on southern energy and pure commercial gusto. Nong Plub squeezed through the colorful aisles of Kim Yong Market, where dried fruits, roasted chestnuts, and Malaysian fabrics pack every stall. Down the avenue, a veteran cook lifted a batch of golden Hat Yai fried chicken from the boiling wok — crisp skin, fragrant coriander root, and heaps of crunchy fried shallots. You can't capture this flavor in a JSON endpoint.",
      th: "หาดใหญ่เป็นเมืองที่มีชีวิตชีวาและพลังการค้าเต็มเปี่ยม พลับเดินเบียดฝูงชนในตรอกตลาดกิมหยงที่มีทั้งเกาลัดคั่ว ขนมนำเข้า และผลไม้อบแห้ง เดินทะลุมาเจอร้านไก่ทอดหาดใหญ่เจ้าดัง หอมกลิ่นลูกผักชีกับพริกไทยดำ หอมเจียวกรอบๆ โรยมาล้นจาน ข้อมูลสมาร์ทซิตี้ในระบบอาจบอกเรื่องเศรษฐกิจการค้าได้ดี แต่ความอร่อยจริงแท้ต้องมาต่อคิวกินตรงนี้",
      zh: "合艾充满了南部的烟火气与商贸活力。在金荣市场琳琅满目的干果与小百货摊位间穿行，街角的大铁锅正捞起金黄酥脆的合艾炸鸡，浓郁的芫荽籽与白胡椒香扑鼻而来，撒上一大勺炸得酥脆的红葱碎，这种滚烫的美味绝非冰冷的数据所能替代。",
    },
    tip: {
      en: "Order sticky rice together with the chicken breast; use your fingers to scoop up every last flake of fried shallot.",
      th: "สั่งข้าวเหนียวร้อนๆ มาคู่กับสะโพกไก่ทอด ใช้มือปั้นข้าวเหนียวคลุกหอมเจียวให้เกลี้ยงจานถึงจะได้อรรถรส",
      zh: "一定要搭配香热的糯米饭，用手指捏起糯米裹着酥脆的红葱渣一起入口才够地道。",
    },
    flavorTag: {
      en: "Crisp shallot fried chicken & market buzz",
      th: "ไก่ทอดหาดใหญ่หอมเจียวกรอบกับบรรยากาศกิมหยง",
      zh: "酥香红葱头炸鸡与市集欢声",
    },
  },
};

/**
 * Region-based fallback generator ensuring 100% complete coverage
 * across all 118 cities in Thailand.
 */
function generateRegionalRecord(city: SmartCity): Omit<NongPlubCityRecord, "cityId" | "assetPath"> {
  const cityName = city.nameEn;
  const cityNameTh = city.nameTh;

  switch (city.region) {
    case "north":
      return {
        outfit: "nature",
        siteName: {
          en: `Lanna Mountain Trails & Local Morning Market in ${cityName}`,
          th: `เส้นทางธรรมชาติและตลาดเช้าพื้นเมือง ${cityNameTh}`,
          zh: `${cityName}兰纳山径与晨间市集`,
        },
        activity: {
          en: "Breathing the crisp highland morning air and tasting fresh sweet sticky rice",
          th: "สูดอากาศบริสุทธิ์บนดอย ชิมข้าวต้มมัดหวานมันจากเตา",
          zh: "呼吸高山清冽晨风，尝一口刚出笼的甜糯米芭蕉包",
        },
        quote: {
          en: `The northern mist softens every sharp edge of ${cityName}. Plub strolled past wooden houses with a warm cup of Arabica coffee from local mountain plantations. The sensor readings show quiet roads, but the true wisdom here is how people wake with the sun and greet neighbors like family.`,
          th: `หมอกเช้าของภาคเหนือทำให้ทุกอย่างใน ${cityNameTh} ดูนุ่มนวลและอ่อนโยน พลับถือแก้วกาแฟอาราบิกาคั่วหอมกรุ่นจากดอย เดินผ่านเรือนไม้โบราณ ตัวเลขเซนเซอร์บอกว่าที่นี่เงียบสงบ แต่ความสุขที่แท้จริงคือรอยยิ้มทักทายของชาวบ้านที่เหมือนเป็นครอบครัวเดียวกัน`,
          zh: `晨雾漫过${cityName}的屋檐，为山城蒙上一层静谧的滤镜。捧着本地高山阿拉比卡咖啡漫步，数据展示了宁静的交通，而真正滋润人心的，是晨光中邻里相迎的温和笑意。`,
        },
        tip: {
          en: "Visit the local morning fresh market before 07:30 to find sticky rice steamed inside sweet young bamboo poles.",
          th: "ตื่นเช้าไปเดินตลาดสดก่อน 07.30 น. จะได้ชิมข้าวหลามร้อนๆ รสชาติหวานมันจากเตาเผาแท้ๆ",
          zh: "清晨七点半前去逛早市，能买到炭火现烤的香甜竹筒糯米饭。",
        },
        flavorTag: {
          en: "Highland Arabica coffee & morning mist",
          th: "กาแฟอาราบิก้าดอยสูงกับไอหมอกยามเช้า",
          zh: "高山手冲咖啡与晨雾清凉",
        },
      };

    case "northeast":
      return {
        outfit: "heritage",
        siteName: {
          en: `Sacred Wat & Cultural Weaving Village of ${cityName}`,
          th: `วัดคู่บ้านคู่เมืองและหมู่บ้านทอผ้าไหม ${cityNameTh}`,
          zh: `${cityName}古刹与传统丝织村`,
        },
        activity: {
          en: "Listening to the gentle click of timber looms weaving traditional Mudmee silk",
          th: "ฟังเสียงกี่ทอผ้าไม้ไผ่กระทบจังหวะ ทอมือผ้าไหมมัดหมี่ลวดลายโบราณ",
          zh: "在木织机有节奏的咔嗒声中，细赏手织扎染丝绸",
        },
        quote: {
          en: `In ${cityName}, the red Isan soil meets breathtaking human resilience. Plub sat with grandmothers weaving intricate silk patterns passed down four generations. We track smart governance metrics, but this quiet, steady rhythm of thread and loom is the deepest heritage Thailand has.`,
          th: `ใน ${cityNameTh} ดินสีแดงของอีสานโอบกอดความอบอุ่นและจิตใจที่เข้มแข็ง พลับนั่งคุยกับคุณยายที่กำลังทอผ้าไหมมัดหมี่ลายโบราณ เส้นไหมเงางามบอกเล่าเรื่องราวตกทอดมาหลายรุ่น เราบันทึกมิติดิจิทัลมากมาย แต่ความปราณีตของภูมิปัญญาชาวบ้านนี่แหละคือสมบัติล้ำค่าที่สุด`,
          zh: `在${cityName}红土地上，蕴藏着世代相传的生活智慧。看着阿婆在木织机前熟练地穿梭引线，编制精美的古花纹丝绸。智能指标记录着城市治理，而这指尖的匠心传承才是不可替代的底蕴。`,
        },
        tip: {
          en: "Ask weavers to show you the natural indigo and jackfruit wood dyeing pots; colors smell like fresh forest rainwater.",
          th: "ลองขอดูอ่างย้อมครามธรรมชาติและแก่นขนุน น้ำย้อมสีจากธรรมชาติจะมีกลิ่นหอมสะอาดเหมือนน้ำฝนป่า",
          zh: "可以请教阿婆如何用天然蓝草和波罗蜜木浸染纱线，天然草木散发着雨后的清香。",
        },
        flavorTag: {
          en: "Hand-woven Mudmee silk & warm Isan smiles",
          th: "ผ้าไหมมัดหมี่ทอมือกับรอยยิ้มอบอุ่นชาวอีสาน",
          zh: "手工扎染丝绸与真挚笑意",
        },
      };

    case "south":
      return {
        outfit: "nature",
        siteName: {
          en: `Coastal Fishermen's Pier & Coconut Groves of ${cityName}`,
          th: `สะพานปลาชายฝั่งและสวนมะพร้าวริมทะเล ${cityNameTh}`,
          zh: `${cityName}海滨渔港与椰林浅滩`,
        },
        activity: {
          en: "Watching colorful longtail boats return with fresh morning seafood catches",
          th: "ยืนดูเรือหางยาวสีสันสดใสแล่นเข้าฝั่งพร้อมอาหารทะเลสดๆ จากอวนแรก",
          zh: "看彩绘长尾渔船迎着晨光满载归港",
        },
        quote: {
          en: `The salty sea wind sweeps across ${cityName} with wild, honest energy. Plub pulled on her windbreaker and watched fishermen unload silvery mackerel straight into iced crates. Down the beach, local roti stalls were flipping dough paper-thin over bubbling ghee. This is southern life at its most authentic.`,
          th: `ลมทะเลเค็มๆ พัดพาเอาพลังชีวิตที่สดใสเข้ามาใน ${cityNameTh} พลับสวมเสื้อกันลมยืนดูชาวประมงยกตะกร้าปลาทูสดขึ้นจากเรือหางยาว เดินเลียบหาดไปได้กลิ่นเนยและแป้งโรตีกรอบที่กำลังฟาดบนกระทะร้อนฉ่า ชีวิตริมทะเลปักษ์ใต้นี่มันจริงใจและมีชีวิตชีวาจริงๆ`,
          zh: `海风携着微咸的水汽扑面而来。看着渔民将刚捕捞的银亮海鱼卸在冰块上，海滩旁的小摊正将飞饼揉至薄如蝉翼，投入黄油锅中烙至金黄。这种扑面而来的生活质感，最是生动。`,
        },
        tip: {
          en: "Taste fresh roti with sweetened condensed milk and hot black kopi early in the morning when the fishing boats dock.",
          th: "ชิมโรตีกรอบราดนมข้นหวานคู่กับกาแฟดำร้อนๆ ยามเช้าตอนเรือประมงเทียบท่า จะได้บรรยากาศชาวเลที่สุด",
          zh: "清晨渔船靠岸时，在码头边点一份酥脆炼乳飞饼配热黑咖啡，风味绝佳。",
        },
        flavorTag: {
          en: "Crispy southern roti & ocean morning breeze",
          th: "โรตีกรอบร้อนๆ กับลมทะเลสดชื่น",
          zh: "香酥海边飞饼与清爽海风",
        },
      };

    case "east":
      return {
        outfit: "urban",
        siteName: {
          en: `Coastal Promenade & Eastern Fruit Orchards of ${cityName}`,
          th: `ถนนเลียบชายทะเลและสวนผลไม้เมืองร้อน ${cityNameTh}`,
          zh: `${cityName}滨海步道与热带果园`,
        },
        activity: {
          en: "Biking along the coastal road smelling golden mangosteens and salty tide",
          th: "ปั่นจักรยานเลียบชายฝั่ง แวะชิมมังคุดหวานฉ่ำจากสวนผลไม้",
          zh: "骑车掠过滨海公路，寻味果园里清甜多汁的山竹",
        },
        quote: {
          en: `In the Eastern corridor, heavy logistics and smart ports meet sun-drenched tropical orchards. Plub took a break under a tamarind tree in ${cityName}, splitting open a sweet purple mangosteen. Innovation corridors hum in the background, but the rhythm of the tides and the fruit harvests remind us who we really are.`,
          th: `ในภาคตะวันออก ศูนย์กลางโลจิสติกส์ทันสมัยมาบรรจบกับสวนผลไม้แสนอบอุ่น พลับแวะพักใต้ร่มไม้ใน ${cityNameTh} บิมังคุดเนื้อขาวฟูหวานฉ่ำกินคลายร้อน เทคโนโลยีการผลิตกำลังขับเคลื่อนไปข้างหน้า แต่ความอุดมสมบูรณ์ของแผ่นดินตรงนี้คือสิ่งที่หล่อเลี้ยงพวกเรามาตลอด`,
          zh: `在东部走廊，前沿物流与阳光果园相映成趣。在遮阳树下小憩，剥开一颗如白玉般清甜的山竹。智慧产业在稳步前行，而海浪的节拍与丰饶的沃土，始终守护着生活的真味。`,
        },
        tip: {
          en: "Look for small wooden roadside stands selling fresh rambutan and durian directly from local family orchards.",
          th: "มองหาเพิงไม้เล็กๆ ริมทางของชาวสวน จะได้เงาะกับทุเรียนตัดสดๆ ที่หอมหวานและราคากันเองที่สุด",
          zh: "认准路边农家小摊，能买到当天清晨刚从树上摘下的新鲜红毛丹与榴莲。",
        },
        flavorTag: {
          en: "Sweet white mangosteen & coastal sunshine",
          th: "มังคุดหวานฉ่ำกับไอแดดริมทะเลตะวันออก",
          zh: "清甜白玉山竹与东岸晴光",
        },
      };

    case "central":
    case "bangkok":
    default:
      return {
        outfit: "heritage",
        siteName: {
          en: `Historic Riverfront Khlong & Old Community Market in ${cityName}`,
          th: `ริมคลองสายประวัติศาสตร์และตลาดชุมชนเก่าแก่ ${cityNameTh}`,
          zh: `${cityName}历史河运旧水运与水乡老街`,
        },
        activity: {
          en: "Watching traditional wooden paddle boats glide past riverside verandas",
          th: "นั่งมองเรือพายไม้สักแล่นผ่านระเบียงริมน้ำในคุ้งคลองร่มรื่น",
          zh: "看古朴木舟摇过水边老木屋的雕花栈台",
        },
        quote: {
          en: `Water has shaped life in ${cityName} for hundreds of years. Nong Plub stood on the arching teak footbridge, watching lotus flowers bob in the gentle canal wash. Nearby, an old auntie was roasting crispy sweet coconut pancakes on an iron stove. Smart flood monitors protect the basin today, but this timeless river rhythm is what makes people stay.`,
          th: `สายน้ำคือชีวิตของ ${cityNameTh} มาหลายร้อยปี พลับยืนบนสะพานไม้โค้งข้ามคลอง มองดอกบัวตูมลอยลู่ไปตามกระแสน้ำ ใกล้ๆ กันมีคุณป้ากำลังหยอดขนมครกใบเตยหอมฟุ้งเตาถ่าน ระบบเซนเซอร์เตือนภัยน้ำอาจจะคอยเฝ้าระวังคลอง แต่เสน่ห์ของวิถีชีวิตริมน้ำตรงนี้นี่แหละที่ทำให้ใครๆ ก็หลงรัก`,
          zh: `水系孕育了${cityName}数百年的市井烟火。站在弯弯的木拱桥上，看荷花在涟漪中轻颤。身旁的小摊正用铸铁模具烘烤香兰椰香米糕。智能防汛系统在守护着水系，而这温润的临水日常，才是让人流连忘返的理由。`,
        },
        tip: {
          en: "Sit at a canal-side coffee shop around 08:00 to catch traditional paddle vendors selling sweet coconut puddings.",
          th: "นั่งจิบกาแฟริมคลองช่วง 8 โมงเช้า จะได้เห็นเรือพายขายขนมครกและก๋วยเตี๋ยวเรือแวะเทียบท่า",
          zh: "早晨八点在运河边茶座小坐，常有摇着小木船叫卖传统椰糕的老店家经过。",
        },
        flavorTag: {
          en: "Charcoal coconut pancakes & canal serenity",
          th: "ขนมครกเตาถ่านกับเสน่ห์ริมสายน้ำ",
          zh: "炭烤香兰椰糕与水乡慢调",
        },
      };
  }
}

/**
 * Returns Nong Plub's site exploration entry for any given city.
 * Guarantees 100% complete, non-null, rich trilingual coverage.
 */
export function getNongPlubRecord(city: SmartCity): NongPlubCityRecord {
  const curated = CURATED_NONG_PLUB_ENTRIES[city.id];
  const base = curated ?? generateRegionalRecord(city);
  return {
    cityId: city.id,
    ...base,
    assetPath: NONG_PLUB_ASSETS[base.outfit],
  };
}

/**
 * Quick helper to get outfit label for UI badges.
 */
export function getNongPlubOutfitLabel(outfit: NongPlubOutfit, locale: Locale): string {
  const labels: Record<NongPlubOutfit, { en: string; th: string; zh: string }> = {
    urban: { en: "Urban Walk", th: "เดินเมืองน่ารัก", zh: "城市漫步" },
    heritage: { en: "Historic Brick Trail", th: "ยลรอยอดีต", zh: "寻古之旅" },
    temple: { en: "Temple Peace", th: "ไหว้พระรับพร", zh: "古刹祈福" },
    cafe: { en: "Cafe & Sketch", th: "จิบชาสเก็ตช์ภาพ", zh: "咖啡写生" },
    nature: { en: "Highland Nature", th: "สัมผัสธรรมชาติ", zh: "自然原野" },
  };
  return labels[outfit][locale];
}
