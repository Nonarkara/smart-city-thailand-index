// ---------------------------------------------------------------------------
// Photo credits — legal attribution for Wikimedia Commons photos used in the
// city media. Required by CC BY and CC BY-SA licenses: we must name the
// author, the license, and link to the source page.
// ---------------------------------------------------------------------------

export interface PhotoCredit {
  cityId: string;           // e.g. "chiang-rai"
  file: string;             // e.g. "/photos/wp-chiang-rai.jpg"
  author: string;           // photographer name
  license: string;          // e.g. "CC BY-SA 4.0"
  sourceUrl: string;        // link to the Wikimedia Commons file page
}

const COMMONS = "https://commons.wikimedia.org/wiki/File:";

export const WIKIMEDIA_PHOTO_CREDITS: PhotoCredit[] = [
  {
    cityId: "chiang-rai",
    file: "/photos/wp-chiang-rai.jpg",
    author: "Chainwit.",
    license: "CC BY-SA 4.0",
    sourceUrl: COMMONS + "หอนาฬิกาเชียงราย_Chiang_Rai_Clock_Tower.jpg",
  },
  {
    cityId: "lampang",
    file: "/photos/wp-lampang.jpg",
    author: "Hong2101",
    license: "CC BY-SA 4.0",
    sourceUrl: COMMONS + "วัดพระธาตุลำปางหลวง_2.jpg",
  },
  {
    cityId: "nan",
    file: "/photos/wp-nan.jpg",
    author: "Takeaway",
    license: "CC BY-SA 3.0",
    sourceUrl: COMMONS + "2013_Wat_Phumin_Nan.jpg",
  },
  {
    cityId: "krabi",
    file: "/photos/wp-krabi.jpg",
    author: "kallerna",
    license: "CC BY-SA 3.0",
    sourceUrl: COMMONS + "Wat_Tham_Sua_18.jpg",
  },
  {
    cityId: "hat-yai",
    file: "/photos/wp-hat-yai.jpg",
    author: "Supanut Arunoprayote",
    license: "CC BY 4.0",
    sourceUrl: COMMONS + "View_of_Hat_Yai_City_(I).jpg",
  },
  {
    cityId: "yala",
    file: "/photos/wp-yala.jpg",
    author: "Fannykong",
    license: "Public domain",
    sourceUrl: COMMONS + "Betong_town_street.JPG",
  },
  {
    cityId: "pattani",
    file: "/photos/wp-pattani.jpg",
    author: "Poakpong (Bangkok)",
    license: "CC BY 2.0",
    sourceUrl: COMMONS + "Pattani_Central_Mosque.jpg",
  },
  {
    cityId: "narathiwat",
    file: "/photos/wp-narathiwat.jpg",
    author: "Piyawat Chongkaichak",
    license: "CC BY-SA 4.0",
    sourceUrl: COMMONS + "ชุมชนต่อเรือกอและและริมน้ำบางนรา_(นราธิวาส).jpg",
  },
  {
    cityId: "phangnga",
    file: "/photos/wp-phangnga.jpg",
    author: "Vyacheslav Argenberg",
    license: "CC BY 4.0",
    sourceUrl: COMMONS + "Dramatic_karst_landscape_of_Phang_Nga_Bay,_Thailand.jpg",
  },
  {
    cityId: "satun",
    file: "/photos/wp-satun.jpg",
    author: "Nopphasin Suksawat",
    license: "CC BY-SA 3.0",
    sourceUrl: COMMONS + "Pak_Nam,_La-ngu_District,_Satun,_Thailand_-_panoramio.jpg",
  },
  {
    cityId: "samui",
    file: "/photos/wp-samui.jpg",
    author: "Manfred Werner",
    license: "CC BY-SA 3.0",
    sourceUrl: COMMONS + "Koh_Samui_Lipa_Noi2.jpg",
  },
  {
    cityId: "songkhla",
    file: "/photos/wp-songkhla.jpg",
    author: "Tarik Abdel Monem",
    license: "CC BY 2.0",
    sourceUrl: COMMONS + "City_of_Songkhla.jpg",
  },
  {
    cityId: "nakhon-si-thammarat",
    file: "/photos/wp-nakhon-si-thammarat.jpg",
    author: "Seksan Phonsuwan",
    license: "CC BY 3.0",
    sourceUrl: COMMONS + "Nai_Mueang,_Mueang_Nakhon_Si_Thammarat_District,_Nakhon_Si_Thammarat_80000,_Thailand_-_panoramio.jpg",
  },
  {
    cityId: "korat",
    file: "/photos/wp-korat.jpg",
    author: "Khaosaming",
    license: "CC BY-SA 3.0",
    sourceUrl: COMMONS + "Thao_Suranaree_Statue_Korat_Thailand.JPG",
  },
  {
    cityId: "ubon",
    file: "/photos/wp-ubon.jpg",
    author: "Nopparat Thanatawan",
    license: "CC BY-SA 4.0",
    sourceUrl: COMMONS + "แสงแห่งผาชะนะได_01.jpg",
  },
  {
    cityId: "nakhonsawan",
    file: "/photos/wp-nakhonsawan.jpg",
    author: "Eternally9",
    license: "CC BY-SA 4.0",
    sourceUrl: COMMONS + "ตรุษจีนนครสวรรค์1.jpg",
  },
  {
    cityId: "rayong",
    file: "/photos/wp-rayong.jpg",
    author: "Yakuzakorat",
    license: "CC BY-SA 4.0",
    sourceUrl: COMMONS + "อุทยานแห่งชาติเขาแหลมหญ้า-หมู่เกาะเสม็ด4.jpg",
  },
  {
    cityId: "chachoengsao",
    file: "/photos/wp-chachoengsao.jpg",
    author: "Yakuzakorat",
    license: "CC BY-SA 4.0",
    sourceUrl: COMMONS + "วัดโสธรวรารามวรวิหาร3.jpg",
  },
  {
    cityId: "chanthaburi",
    file: "/photos/wp-chanthaburi.jpg",
    author: "Ajtnk",
    license: "Public domain",
    sourceUrl: COMMONS + "Chanthaburi_City.jpg",
  },
  {
    cityId: "phitsanulok",
    file: "/photos/wp-phitsanulok.jpg",
    author: "JJ Harrison",
    license: "CC BY-SA 3.0",
    sourceUrl: COMMONS + "Wat_Phra_Si_Rattana_Mahathat_-_Phitsanulok.jpg",
  },
  {
    cityId: "saensuk",
    file: "/photos/wp-saensuk.jpg",
    author: "Slyronit",
    license: "CC BY-SA 4.0",
    sourceUrl: COMMONS + "Bang_Saen_Beach_at_sunset_2.jpg",
  },
  {
    cityId: "sritrang",
    file: "/photos/wp-sritrang.jpg",
    author: "Lerdsuwa",
    license: "CC BY-SA 3.0",
    sourceUrl: COMMONS + "LaoLiangPhi.jpg",
  },
  {
    cityId: "rattanakosin",
    file: "/photos/wp-rattanakosin.jpg",
    author: "Jorge Láscar",
    license: "CC BY 2.0",
    sourceUrl: COMMONS + "Lascar_Grand_Palace_entrance_(4509079545).jpg",
  },
  {
    cityId: "klong-phadung",
    file: "/photos/wp-klong-phadung.jpg",
    author: "Heinrich Damm",
    license: "CC BY 2.0",
    sourceUrl: COMMONS + "Bkkpadungkrungkasem03c.jpg",
  },
  {
    cityId: "makkasan",
    file: "/photos/wp-makkasan.jpg",
    author: "aotaro",
    license: "CC BY 2.0",
    sourceUrl: COMMONS + "Highway_interchange_at_night_(35517755855)_(cropped).jpg",
  },
  {
    cityId: "nonthaburi",
    file: "/photos/wp-nonthaburi.jpg",
    author: "Supanut Arunoprayote",
    license: "CC BY 4.0",
    sourceUrl: COMMONS + "Wat_Paramai_Yikawat_(I).jpg",
  },
  {
    cityId: "samut-prakan",
    file: "/photos/wp-samut-prakan.jpg",
    author: "Preecha.MJ",
    license: "CC BY-SA 4.0",
    sourceUrl: COMMONS + "The_most_significant_Buddhist_temple_of_Samut_Prakan_province_south_of_Bangkok_is_Wat_Phra_Samut_Chedi.jpg",
  },
  {
    cityId: "maesai",
    file: "/photos/wp-maesai.jpg",
    author: "Vyacheslav Argenberg",
    license: "CC BY 4.0",
    sourceUrl: COMMONS + "Mae_Sai,_Northern_Thailand.jpg",
  },
  {
    cityId: "umong",
    file: "/photos/wp-umong.jpg",
    author: "Vano111ru",
    license: "CC BY-SA 4.0",
    sourceUrl: COMMONS + "Wat_Umong_Suan_Phutthatham.jpg",
  },
  {
    cityId: "tak",
    file: "/photos/wp-tak.jpg",
    author: "PumpkinSky",
    license: "CC BY-SA 4.0",
    sourceUrl: COMMONS + "Ping_River_in_Tak_3.JPG",
  },
  {
    cityId: "phichit",
    file: "/photos/wp-phichit.jpg",
    author: "Kittipong khunnen",
    license: "CC BY-SA 3.0",
    sourceUrl: COMMONS + "Wat_Pho_Prathap_Chang_07.jpg",
  },
];
