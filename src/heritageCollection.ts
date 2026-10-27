import { PROVINCE_HERITAGE } from "./provinceHeritage";
/** Curated visual evidence; geographic association never establishes an excavation findspot. */
export type HeritageText = { en: string; th: string; zh: string };
export interface CuratedHeritage {
  id: string;
  provinces: string[];
  scope: 'local' | 'province' | 'regional';
  image: string;
  jpegImage?: string;
  imagePreparation?: "resized-uncropped";
  contextSourceUrl?: string;
  title: HeritageText;
  caption: HeritageText;
  photoDate?: string;
  objectDate?: HeritageText;
  sourceUrl: string;
  sourceImageUrl: string;
  author: string;
  creditLine?: string;
  license: string;
  licenseUrl: string;
  verifiedAt: string;
}
const commons = 'https://commons.wikimedia.org/wiki/File:';
const upload = 'https://upload.wikimedia.org/wikipedia/commons/';
const by4 = 'https://creativecommons.org/licenses/by/4.0/';
const sa4 = 'https://creativecommons.org/licenses/by-sa/4.0/';
export const heritageCollection: CuratedHeritage[] = [
  ...PROVINCE_HERITAGE,
  {
    id: 'nakhon-procession', provinces: ['Nakhon Si Thammarat'], scope: 'province', image: '/heritage/nakhon-procession.webp',
    title: { en: 'Cloth procession at Wat Phra Mahathat', th: 'แห่ผ้าขึ้นธาตุที่วัดพระมหาธาตุ', zh: '帕玛哈泰寺的绕塔布幔游行' },
    caption: { en: 'Worshippers carry cloth toward the stupa during Hae Pha Khuen That. UNESCO records this annual cloth-wrapping ceremony among the monastery’s continuing traditions, shaped by religious connections across the Indian Ocean.', th: 'พุทธศาสนิกชนแห่ผ้าไปยังพระบรมธาตุเจดีย์ในประเพณีแห่ผ้าขึ้นธาตุ ยูเนสโกระบุว่าพิธีประจำปีนี้เป็นประเพณีที่ยังสืบต่ออยู่ และสัมพันธ์กับเครือข่ายศาสนาข้ามมหาสมุทรอินเดีย', zh: '信众在绕塔布幔仪式中携布走向佛塔。联合国教科文组织将这种年度仪式列为寺院延续至今的传统，并指出其与跨印度洋宗教交流的联系。' },
    contextSourceUrl: 'https://whc.unesco.org/en/list/1761',
    photoDate: '2011-02-18', sourceUrl: commons + 'Wat_phra_mahathat_woramahawihan_nakhon_si_thammarat.jpg',
    sourceImageUrl: upload + '9/9c/Wat_phra_mahathat_woramahawihan_nakhon_si_thammarat.jpg', author: 'KOSIN SUKHUM', license: 'CC BY-SA 4.0', licenseUrl: sa4, verifiedAt: '2026-10-28',
  },
  {
    id: 'phuket-dragon', provinces: ['Phuket'], scope: 'province', image: '/heritage/phuket-dragon.webp',
    title: { en: 'Hai Leng Ong statue', th: 'ประติมากรรมพญามังกรทะเล', zh: '海龙王雕像' },
    caption: { en: 'The Hai Leng Ong Golden Dragon Monument in Phuket Town, photographed in 2017.', th: 'ประติมากรรมพญามังกรทะเลในเมืองภูเก็ต ถ่ายภาพเมื่อ พ.ศ. 2560', zh: '普吉镇的海龙王金龙雕像，摄于2017年。' },
    photoDate: '2017-04-27', sourceUrl: commons + 'Phuket_Town_Thailand-Golden-Dragon-Monument-01.jpg', sourceImageUrl: upload + '6/67/Phuket_Town_Thailand-Golden-Dragon-Monument-01.jpg', author: 'CEphoto, Uwe Aranas', creditLine: 'Photo by CEphoto, Uwe Aranas', license: 'CC BY-SA 4.0', licenseUrl: sa4, verifiedAt: '2026-10-28',
  },
  {
    id: 'doi-suthep', provinces: ['Chiang Mai'], scope: 'province', image: '/heritage/doi-suthep.webp',
    title: { en: 'Golden chedi at Doi Suthep', th: 'พระธาตุดอยสุเทพ', zh: '素贴寺金塔' },
    caption: { en: 'The golden chedi and ceremonial umbrella at Doi Suthep. TAT records the Tiaw Khuen Doi pilgrimage, when worshippers climb the hill to honour the Buddhist relics enshrined at the temple.', th: 'พระเจดีย์และฉัตรสีทองที่วัดพระธาตุดอยสุเทพ ททท. บันทึกประเพณีเตียวขึ้นดอย ซึ่งผู้ศรัทธาเดินขึ้นเขาเพื่อสักการะพระบรมสารีริกธาตุที่วัด', zh: '素贴寺的金塔与仪式伞盖。泰国旅游局记载Tiaw Khuen Doi朝圣传统，信众登山礼敬寺内供奉的佛教舍利。' },
    contextSourceUrl: 'https://www.tourismthailand.org/Attraction/wat-phra-that-doi-suthep',
    photoDate: '2014-02-01', sourceUrl: commons + 'Doi_Suthep_Temple_Chiang_Mai_Thailand.jpg', sourceImageUrl: upload + '2/2e/Doi_Suthep_Temple_Chiang_Mai_Thailand.jpg', author: 'Philip Nalangan', license: 'CC BY 4.0', licenseUrl: by4, verifiedAt: '2026-10-28',
  },
  {
    id: 'ayutthaya-buddha', provinces: ['Phra Nakhon Si Ayutthaya'], scope: 'province', image: '/heritage/ayutthaya-buddha.webp',
    title: { en: 'Buddha head at Wat Mahathat', th: 'เศียรพระพุทธรูปที่วัดมหาธาตุ', zh: '玛哈泰寺佛首' },
    caption: { en: 'A Buddha head among tree roots at Wat Mahathat. UNESCO dates the foundation of Ayutthaya to about 1350 and describes its surviving monasteries and reliquary towers; that is the city’s history, not a date assigned to this sculpture.', th: 'เศียรพระพุทธรูปในรากไม้ที่วัดมหาธาตุ ยูเนสโกระบุการก่อตั้งอยุธยาราว ค.ศ. 1350 และกล่าวถึงวัดกับปรางค์ที่ยังหลงเหลือ นี่คือประวัติศาสตร์ของเมือง ไม่ใช่การกำหนดอายุประติมากรรมชิ้นนี้', zh: '玛哈泰寺树根间的佛首。联合国教科文组织将大城的建立定为约1350年，并记载其留存的寺院与舍利塔；这是城市历史，并非对此件雕塑的断代。' },
    contextSourceUrl: 'https://whc.unesco.org/en/list/576',
    photoDate: '2023-08-22', sourceUrl: commons + 'Cabeza_de_Buda_en_el_%C3%A1rbol,_Wat_Mahathat,_Ayutthaya_3.tif', sourceImageUrl: upload + '1/12/Cabeza_de_Buda_en_el_%C3%A1rbol%2C_Wat_Mahathat%2C_Ayutthaya_3.tif', author: 'ProtoplasmaKid', license: 'CC BY-SA 4.0', licenseUrl: sa4, verifiedAt: '2026-10-28',
  },
  {
    id: 'sukhothai-buddha', provinces: ['Sukhothai'], scope: 'province', image: '/heritage/sukhothai-buddha.webp',
    title: { en: 'Seated Buddha at Wat Si Chum', th: 'พระพุทธรูปประทับนั่งที่วัดศรีชุม', zh: '西春寺坐佛' },
    caption: { en: 'A seated Buddha inside Wat Si Chum. UNESCO describes Sukhothai as a kingdom centre in the thirteenth and fourteenth centuries, where different influences formed a distinctive architectural and artistic style.', th: 'พระพุทธรูปประทับนั่งภายในวัดศรีชุม ยูเนสโกอธิบายสุโขทัยว่าเป็นศูนย์กลางอาณาจักรในคริสต์ศตวรรษที่ 13–14 ซึ่งผสานอิทธิพลต่าง ๆ จนเกิดรูปแบบศิลปะและสถาปัตยกรรมเฉพาะ', zh: '西春寺内的坐佛。联合国教科文组织将素可泰描述为十三至十四世纪的王国中心，不同影响在此形成了独特的建筑与艺术风格。' },
    contextSourceUrl: 'https://whc.unesco.org/en/list/574',
    photoDate: '2007-02-03', sourceUrl: commons + 'Sukhothai,_Wat_Si_Chum,_Thailand.jpg', sourceImageUrl: upload + '6/61/Sukhothai%2C_Wat_Si_Chum%2C_Thailand.jpg', author: 'Vyacheslav Argenberg', license: 'CC BY 4.0', licenseUrl: by4, verifiedAt: '2026-10-28',
  },
  {
    id: 'wat-pho', provinces: ['Bangkok'], scope: 'province', image: '/heritage/wat-pho.webp',
    title: { en: 'Reclining Buddha at Wat Pho', th: 'พระพุทธไสยาสน์วัดโพธิ์', zh: '卧佛寺卧佛' },
    caption: { en: 'The reclining Buddha at Wat Pho in Bangkok, photographed in 2013.', th: 'พระพุทธไสยาสน์ที่วัดโพธิ์ กรุงเทพมหานคร ถ่ายภาพเมื่อ พ.ศ. 2556', zh: '曼谷卧佛寺的卧佛，摄于2013年。' },
    photoDate: '2013-08-22', sourceUrl: commons + 'Wat_Pho,_Bangkok,_Tailandia,_2013-08-22,_DD_11.jpg', sourceImageUrl: upload + 'f/f4/Wat_Pho%2C_Bangkok%2C_Tailandia%2C_2013-08-22%2C_DD_11.jpg', author: 'Diego Delso', creditLine: 'Diego Delso, delso.photo', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/', verifiedAt: '2026-10-28',
  },
  {
    id: 'avalokiteshvara', provinces: ['Nakhon Si Thammarat'], scope: 'regional', image: '/heritage/avalokiteshvara.webp',
    title: { en: 'Bodhisattva Avalokiteshvara', th: 'พระโพธิสัตว์อวโลกิเตศวร', zh: '观世音菩萨像' },
    caption: { en: 'This sandstone sculpture at The Met, New York, is attributed to Southern Thailand; it offers regional context, with no documented Nakhon Si Thammarat findspot in the record.', th: 'ประติมากรรมหินทรายที่พิพิธภัณฑ์เมโทรโพลิแทน นิวยอร์ก ระบุแหล่งวัฒนธรรมเป็นภาคใต้ของไทย ใช้เป็นบริบทระดับภูมิภาค โดยระเบียนไม่ได้ระบุว่าพบที่นครศรีธรรมราช', zh: '纽约大都会艺术博物馆将这件砂岩雕像归于泰国南部文化，仅作区域参照，馆藏记录未记载洛坤发现地点。' },
    objectDate: { en: 'Second half of the 7th century', th: 'ครึ่งหลังของคริสต์ศตวรรษที่ 7', zh: '7世纪后半叶' },
    sourceUrl: 'https://www.metmuseum.org/art/collection/search/38177', sourceImageUrl: 'https://images.metmuseum.org/CRDImages/as/original/LK.1987.218.16_DP291641R2_25U.jpg', author: 'Artist unrecorded', creditLine: 'The Metropolitan Museum of Art, 1987.218.16. Samuel Eilenberg Collection, Ex Coll.: Columbia University, Purchase, Lila Acheson Wallace Gift, 1987', license: 'Public Domain / CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', verifiedAt: '2026-10-28',
  },
  {
    id: 'vishnu', provinces: ['Nakhon Si Thammarat'], scope: 'regional', image: '/heritage/vishnu.webp',
    title: { en: 'Vishnu on Adisesha', th: 'พระวิษณุบนอนันตนาคราช', zh: '阿迪舍沙上的毗湿奴' },
    caption: { en: 'The Met, New York, attributes this bronze to Indonesia or Southern Thailand; it is a regional comparison, not a documented Nakhon Si Thammarat find.', th: 'พิพิธภัณฑ์เมโทรโพลิแทน นิวยอร์ก ระบุประติมากรรมสำริดนี้ว่าเป็นวัฒนธรรมอินโดนีเซียหรือภาคใต้ของไทย ใช้เทียบเคียงระดับภูมิภาค ไม่ใช่หลักฐานว่าพบที่นครศรีธรรมราช', zh: '纽约大都会艺术博物馆将这件青铜像归于印度尼西亚或泰国南部文化，仅作区域比较，并非有记录的洛坤出土文物。' },
    objectDate: { en: '11th–12th century', th: 'คริสต์ศตวรรษที่ 11–12', zh: '11至12世纪' },
    sourceUrl: 'https://www.metmuseum.org/art/collection/search/37608', sourceImageUrl: 'https://images.metmuseum.org/CRDImages/as/original/1974_12.JPG', author: 'Artist unrecorded', creditLine: 'The Metropolitan Museum of Art, 1974.12. Rogers Fund, 1974', license: 'Public Domain / CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', verifiedAt: '2026-10-28',
  },
];
