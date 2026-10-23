/** Curated visual evidence; geographic association never establishes an excavation findspot. */
export type HeritageText = { en: string; th: string; zh: string };
export interface CuratedHeritage {
  id: string;
  provinces: string[];
  scope: 'local' | 'province' | 'regional';
  image: string;
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
  verifiedAt: '2026-10-23';
}
const commons = 'https://commons.wikimedia.org/wiki/File:';
const upload = 'https://upload.wikimedia.org/wikipedia/commons/';
const by4 = 'https://creativecommons.org/licenses/by/4.0/';
const sa4 = 'https://creativecommons.org/licenses/by-sa/4.0/';
export const heritageCollection: CuratedHeritage[] = [
  {
    id: 'nakhon-procession', provinces: ['Nakhon Si Thammarat'], scope: 'province', image: '/heritage/nakhon-procession.webp',
    title: { en: 'Cloth procession at Wat Phra Mahathat', th: 'แห่ผ้าขึ้นธาตุที่วัดพระมหาธาตุ', zh: '帕玛哈泰寺的绕塔布幔游行' },
    caption: { en: 'Worshippers carry cloth toward the stupa at Wat Phra Mahathat during Hae Pha Khuen That in 2011.', th: 'พุทธศาสนิกชนแห่ผ้าไปยังพระบรมธาตุเจดีย์ที่วัดพระมหาธาตุในประเพณีแห่ผ้าขึ้นธาตุ พ.ศ. 2554', zh: '2011年，信众在帕玛哈泰寺的绕塔布幔仪式中携布走向佛塔。' },
    photoDate: '2011-02-18', sourceUrl: commons + 'Wat_phra_mahathat_woramahawihan_nakhon_si_thammarat.jpg',
    sourceImageUrl: upload + '9/9c/Wat_phra_mahathat_woramahawihan_nakhon_si_thammarat.jpg', author: 'KOSIN SUKHUM', license: 'CC BY-SA 4.0', licenseUrl: sa4, verifiedAt: '2026-10-23',
  },
  {
    id: 'phuket-dragon', provinces: ['Phuket'], scope: 'province', image: '/heritage/phuket-dragon.webp',
    title: { en: 'Hai Leng Ong statue', th: 'ประติมากรรมพญามังกรทะเล', zh: '海龙王雕像' },
    caption: { en: 'The Hai Leng Ong Golden Dragon Monument in Phuket Town, photographed in 2017.', th: 'ประติมากรรมพญามังกรทะเลในเมืองภูเก็ต ถ่ายภาพเมื่อ พ.ศ. 2560', zh: '普吉镇的海龙王金龙雕像，摄于2017年。' },
    photoDate: '2017-04-27', sourceUrl: commons + 'Phuket_Town_Thailand-Golden-Dragon-Monument-01.jpg', sourceImageUrl: upload + '6/67/Phuket_Town_Thailand-Golden-Dragon-Monument-01.jpg', author: 'CEphoto, Uwe Aranas', creditLine: 'Photo by CEphoto, Uwe Aranas', license: 'CC BY-SA 4.0', licenseUrl: sa4, verifiedAt: '2026-10-23',
  },
  {
    id: 'doi-suthep', provinces: ['Chiang Mai'], scope: 'province', image: '/heritage/doi-suthep.webp',
    title: { en: 'Golden chedi at Doi Suthep', th: 'พระธาตุดอยสุเทพ', zh: '素贴寺金塔' },
    caption: { en: 'The golden chedi and ceremonial umbrella at Doi Suthep in Chiang Mai province, photographed in 2014.', th: 'พระเจดีย์และฉัตรสีทองที่วัดพระธาตุดอยสุเทพ จังหวัดเชียงใหม่ ถ่ายภาพเมื่อ พ.ศ. 2557', zh: '清迈府素贴寺的金塔与仪式伞盖，摄于2014年。' },
    photoDate: '2014-02-01', sourceUrl: commons + 'Doi_Suthep_Temple_Chiang_Mai_Thailand.jpg', sourceImageUrl: upload + '2/2e/Doi_Suthep_Temple_Chiang_Mai_Thailand.jpg', author: 'Philip Nalangan', license: 'CC BY 4.0', licenseUrl: by4, verifiedAt: '2026-10-23',
  },
  {
    id: 'ayutthaya-buddha', provinces: ['Phra Nakhon Si Ayutthaya'], scope: 'province', image: '/heritage/ayutthaya-buddha.webp',
    title: { en: 'Buddha head at Wat Mahathat', th: 'เศียรพระพุทธรูปที่วัดมหาธาตุ', zh: '玛哈泰寺佛首' },
    caption: { en: 'A Buddha sculpture head among tree roots at Wat Mahathat in Ayutthaya, photographed in 2023.', th: 'เศียรพระพุทธรูปในรากไม้ที่วัดมหาธาตุ อยุธยา ถ่ายภาพเมื่อ พ.ศ. 2566', zh: '大城玛哈泰寺树根间的佛首，摄于2023年。' },
    photoDate: '2023-08-22', sourceUrl: commons + 'Cabeza_de_Buda_en_el_%C3%A1rbol,_Wat_Mahathat,_Ayutthaya_3.tif', sourceImageUrl: upload + '1/12/Cabeza_de_Buda_en_el_%C3%A1rbol%2C_Wat_Mahathat%2C_Ayutthaya_3.tif', author: 'ProtoplasmaKid', license: 'CC BY-SA 4.0', licenseUrl: sa4, verifiedAt: '2026-10-23',
  },
  {
    id: 'sukhothai-buddha', provinces: ['Sukhothai'], scope: 'province', image: '/heritage/sukhothai-buddha.webp',
    title: { en: 'Seated Buddha at Wat Si Chum', th: 'พระพุทธรูปประทับนั่งที่วัดศรีชุม', zh: '西春寺坐佛' },
    caption: { en: 'A seated Buddha inside Wat Si Chum in historic Sukhothai, photographed in 2007.', th: 'พระพุทธรูปประทับนั่งภายในวัดศรีชุม เมืองเก่าสุโขทัย ถ่ายภาพเมื่อ พ.ศ. 2550', zh: '素可泰古城西春寺内的坐佛，摄于2007年。' },
    photoDate: '2007-02-03', sourceUrl: commons + 'Sukhothai,_Wat_Si_Chum,_Thailand.jpg', sourceImageUrl: upload + '6/61/Sukhothai%2C_Wat_Si_Chum%2C_Thailand.jpg', author: 'Vyacheslav Argenberg', license: 'CC BY 4.0', licenseUrl: by4, verifiedAt: '2026-10-23',
  },
  {
    id: 'wat-pho', provinces: ['Bangkok'], scope: 'province', image: '/heritage/wat-pho.webp',
    title: { en: 'Reclining Buddha at Wat Pho', th: 'พระพุทธไสยาสน์วัดโพธิ์', zh: '卧佛寺卧佛' },
    caption: { en: 'The reclining Buddha at Wat Pho in Bangkok, photographed in 2013.', th: 'พระพุทธไสยาสน์ที่วัดโพธิ์ กรุงเทพมหานคร ถ่ายภาพเมื่อ พ.ศ. 2556', zh: '曼谷卧佛寺的卧佛，摄于2013年。' },
    photoDate: '2013-08-22', sourceUrl: commons + 'Wat_Pho,_Bangkok,_Tailandia,_2013-08-22,_DD_11.jpg', sourceImageUrl: upload + 'f/f4/Wat_Pho%2C_Bangkok%2C_Tailandia%2C_2013-08-22%2C_DD_11.jpg', author: 'Diego Delso', creditLine: 'Diego Delso, delso.photo', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/', verifiedAt: '2026-10-23',
  },
  {
    id: 'avalokiteshvara', provinces: ['Nakhon Si Thammarat'], scope: 'regional', image: '/heritage/avalokiteshvara.webp',
    title: { en: 'Bodhisattva Avalokiteshvara', th: 'พระโพธิสัตว์อวโลกิเตศวร', zh: '观世音菩萨像' },
    caption: { en: 'This sandstone sculpture at The Met, New York, is attributed to Southern Thailand; it offers regional context, with no documented Nakhon Si Thammarat findspot in the record.', th: 'ประติมากรรมหินทรายที่พิพิธภัณฑ์เมโทรโพลิแทน นิวยอร์ก ระบุแหล่งวัฒนธรรมเป็นภาคใต้ของไทย ใช้เป็นบริบทระดับภูมิภาค โดยระเบียนไม่ได้ระบุว่าพบที่นครศรีธรรมราช', zh: '纽约大都会艺术博物馆将这件砂岩雕像归于泰国南部文化，仅作区域参照，馆藏记录未记载洛坤发现地点。' },
    objectDate: { en: 'Second half of the 7th century', th: 'ครึ่งหลังของคริสต์ศตวรรษที่ 7', zh: '7世纪后半叶' },
    sourceUrl: 'https://www.metmuseum.org/art/collection/search/38177', sourceImageUrl: 'https://images.metmuseum.org/CRDImages/as/original/LK.1987.218.16_DP291641R2_25U.jpg', author: 'Artist unrecorded / The Metropolitan Museum of Art', creditLine: 'The Metropolitan Museum of Art, 1987.218.16. Samuel Eilenberg Collection, Ex Coll.: Columbia University, Purchase, Lila Acheson Wallace Gift, 1987', license: 'Public Domain / CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', verifiedAt: '2026-10-23',
  },
  {
    id: 'vishnu', provinces: ['Nakhon Si Thammarat'], scope: 'regional', image: '/heritage/vishnu.webp',
    title: { en: 'Vishnu on Adisesha', th: 'พระวิษณุบนอนันตนาคราช', zh: '阿迪舍沙上的毗湿奴' },
    caption: { en: 'The Met, New York, attributes this bronze to Indonesia or Southern Thailand; it is a regional comparison, not a documented Nakhon Si Thammarat find.', th: 'พิพิธภัณฑ์เมโทรโพลิแทน นิวยอร์ก ระบุประติมากรรมสำริดนี้ว่าเป็นวัฒนธรรมอินโดนีเซียหรือภาคใต้ของไทย ใช้เทียบเคียงระดับภูมิภาค ไม่ใช่หลักฐานว่าพบที่นครศรีธรรมราช', zh: '纽约大都会艺术博物馆将这件青铜像归于印度尼西亚或泰国南部文化，仅作区域比较，并非有记录的洛坤出土文物。' },
    objectDate: { en: '11th–12th century', th: 'คริสต์ศตวรรษที่ 11–12', zh: '11至12世纪' },
    sourceUrl: 'https://www.metmuseum.org/art/collection/search/37608', sourceImageUrl: 'https://images.metmuseum.org/CRDImages/as/original/1974_12.JPG', author: 'Artist unrecorded / The Metropolitan Museum of Art', creditLine: 'The Metropolitan Museum of Art, 1974.12. Rogers Fund, 1974', license: 'Public Domain / CC0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', verifiedAt: '2026-10-23',
  },
];
