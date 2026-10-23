import { heritageCollection as CURATED_HERITAGE, type CuratedHeritage } from "./heritageCollection";
import { WIKIMEDIA_PHOTO_CREDITS } from "./photoCredits";
import { resolveProvince } from "./dimensionScores";
import type { SmartCity } from "./types";
type HeritageRecord = Omit<CuratedHeritage, "verifiedAt"> & { verifiedAt: string | null };

// Explicit provenance mapping; never infer a location from the current hero
// image, since several legacy heroes are editorial stand-ins.
const ARCHIVE_PROVINCES: Record<string,string> = {
  "chiang-rai":"Chiang Rai",lampang:"Lampang",nan:"Nan",krabi:"Krabi","hat-yai":"Songkhla",yala:"Yala",pattani:"Pattani",narathiwat:"Narathiwat",phangnga:"Phang Nga",samui:"Surat Thani",songkhla:"Songkhla","nakhon-si-thammarat":"Nakhon Si Thammarat",korat:"Nakhon Ratchasima",ubon:"Ubon Ratchathani",nakhonsawan:"Nakhon Sawan",rayong:"Rayong",chachoengsao:"Chachoengsao",chanthaburi:"Chanthaburi",phitsanulok:"Phitsanulok",saensuk:"Chonburi",sritrang:"Trang",rattanakosin:"Bangkok","klong-phadung":"Bangkok",nonthaburi:"Nonthaburi","samut-prakan":"Samut Prakan",maesai:"Chiang Rai",tak:"Tak",phichit:"Phichit",
};
function licenseUrl(license:string):string {
  if(license === "Public domain") return "https://creativecommons.org/publicdomain/mark/1.0/";
  const match=license.match(/^CC (BY-SA|BY) ([234]\.0)$/);
  return match?`https://creativecommons.org/licenses/${match[1].toLowerCase()}/${match[2]}/`:"";
}
const ARCHIVE_HERITAGE: HeritageRecord[] = WIKIMEDIA_PHOTO_CREDITS.flatMap(photo=>{
  const province=ARCHIVE_PROVINCES[photo.cityId];
  if(!province || !licenseUrl(photo.license)) return [];
  const title=decodeURIComponent(photo.sourceUrl.split("File:")[1]??photo.file).replace(/_/g," ").replace(/\.(jpg|jpeg|png)$/i,"");
  return [{id:`archive-${photo.cityId}`,provinces:[province],scope:"province",image:photo.file,title:{en:title,th:title,zh:title},caption:{en:"Provincial visual context from SCITI’s existing Commons archive. The scene is not necessarily inside this city’s administrative boundary.",th:"ภาพบริบทระดับจังหวัดจากคลัง Commons เดิมของ SCITI สถานที่ในภาพอาจอยู่นอกเขตปกครองของเมืองนี้",zh:"来自SCITI既有Commons影像档案的省级背景。画面地点不一定处于本城行政边界内。"},sourceUrl:photo.sourceUrl,sourceImageUrl:photo.sourceUrl,author:photo.author,license:photo.license,licenseUrl:licenseUrl(photo.license),verifiedAt:null}];
});
export function getCityHeritage(city: Pick<SmartCity,"province">):HeritageRecord[]{
  const province=resolveProvince(city.province);
  return [...CURATED_HERITAGE,...ARCHIVE_HERITAGE].filter(record=>record.provinces.includes(province));
}
