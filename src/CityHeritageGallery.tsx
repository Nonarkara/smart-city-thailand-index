import { useState } from "react";
import { getCityHeritage } from "./cityHeritage";
import { getCityName, translate } from "./cityPresentation";
import type { Locale, SmartCity } from "./types";

export default function CityHeritageGallery({city,locale}:{city:SmartCity;locale:Locale}) {
  const records=getCityHeritage(city);
  const [selectedId,setSelectedId]=useState("");
  const selected=records.find(record=>record.id===selectedId)??records[0];
  const t=(copy:{en:string;th:string;zh:string})=>translate(locale,copy);
  const search=`https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(getCityName(city,"en").replace(/Smart City|Smart /g,""))}&title=Special:MediaSearch&type=image`;
  return <section className="city-heritage" aria-labelledby={`heritage-${city.id}`}>
    <h2 id={`heritage-${city.id}`}>{t({en:"A place seen through its objects",th:"อ่านเมืองผ่านวัตถุและสถานที่",zh:"通过文物与场所认识城市"})}</h2>
    {selected?<>
      {records.length>1&&<label className="heritage-selector">{t({en:"Choose a visual record",th:"เลือกภาพหรือวัตถุ",zh:"选择影像或文物"})}<select value={selected.id} onChange={event=>setSelectedId(event.target.value)}>{records.map(record=><option key={record.id} value={record.id}>{record.title[locale]}</option>)}</select></label>}
      <figure className="heritage-layout">
        <a className="heritage-image-link" href={selected.sourceUrl} target="_blank" rel="noopener noreferrer"><img src={selected.image} alt={selected.title[locale]} loading="lazy" decoding="async" /></a>
        <figcaption>
          <p className="heritage-scope">{t(selected.scope==="local"?{en:"Local place",th:"สถานที่ในพื้นที่",zh:"当地场所"}:selected.scope==="province"?{en:"Provincial context",th:"บริบทระดับจังหวัด",zh:"省级背景"}:{en:"Regional comparison · not a documented city find",th:"ตัวอย่างเปรียบเทียบระดับภูมิภาค · ไม่ได้ยืนยันว่าพบในเมืองนี้",zh:"区域比较 · 未证实为本城出土文物"})}</p>
          <h3>{selected.title[locale]}</h3><p>{selected.caption[locale]}</p>
          {selected.objectDate&&<p>{t({en:"Object period",th:"สมัยของวัตถุ",zh:"文物年代"})}: {selected.objectDate[locale]}</p>}
          {selected.photoDate&&<p>{t({en:"Photograph date",th:"วันที่ถ่ายภาพ",zh:"拍摄时间"})}: {selected.photoDate}</p>}
          {selected.creditLine&&<p>{selected.creditLine}</p>}
          <p>{selected.author} · <a href={selected.licenseUrl} target="_blank" rel="noopener noreferrer">{selected.license}</a></p>
          <p><a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer">{t({en:"Collection / source record",th:"ทะเบียนวัตถุ / แหล่งภาพ",zh:"馆藏／影像来源记录"})} ↗</a></p>
          <p className="heritage-image-note">{t(selected.verifiedAt?{en:"Image resized and converted to WebP; no crop. Source and reuse terms checked",th:"ย่อภาพเพื่อแสดงผล ไม่ตัดส่วนภาพ ตรวจสอบแหล่งที่มาและเงื่อนไขการใช้",zh:"影像仅缩放展示，未裁剪。已核查来源及使用条款"}:{en:"Attribution from the existing image archive. Consult the source for the original image and its reuse terms.",th:"เครดิตจากคลังภาพเดิม ดูภาพต้นฉบับและเงื่อนไขการใช้ที่แหล่งอ้างอิง",zh:"署名沿用既有影像档案。请在来源页查阅原图及使用条款。"})} {selected.verifiedAt??""}</p>
        </figcaption>
      </figure>
    </>:<p>{t({en:"A locally verified visual record has not yet been curated for this dossier. Explore collection sources below; search results are not evidence of a local find.",th:"แฟ้มนี้ยังไม่มีภาพที่คัดสรรและยืนยันความเกี่ยวข้องกับพื้นที่ สำรวจแหล่งสะสมด้านล่าง ผลการค้นหาไม่ได้ยืนยันว่าพบวัตถุในพื้นที่",zh:"本档案尚未策展经核实的当地影像。可继续浏览下方馆藏来源；搜索结果并不能证明文物出土于本地。"})}</p>}
    <p className="heritage-search"><a href={search} target="_blank" rel="noopener noreferrer">{t({en:"Explore more images in Wikimedia Commons",th:"สำรวจภาพเพิ่มเติมใน Wikimedia Commons",zh:"在Wikimedia Commons探索更多影像"})} ↗</a></p>
  </section>;
}
