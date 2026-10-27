import { useState } from "react";
import { assetUrl } from "./assetUtils";
import { getCityHeritage } from "./cityHeritage";
import { getCityName, translate } from "./cityPresentation";
import type { Locale, SmartCity } from "./types";

export default function CityHeritageGallery({city,locale}:{city:SmartCity;locale:Locale}) {
  const records=getCityHeritage(city);
  const [selectedId,setSelectedId]=useState("");
  const selected=records.find(record=>record.id===selectedId)??records[0];
  const creditIsAuthor = selected?.creditLine?.replace(/^Photo by\s+/i, "").trim() === selected?.author.trim();
  const t=(copy:{en:string;th:string;zh:string})=>translate(locale,copy);
  const search=`https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(getCityName(city,"en").replace(/Smart City|Smart /g,""))}&title=Special:MediaSearch&type=image`;
  return <section className="city-heritage" aria-labelledby={`heritage-${city.id}`}>
    <h2 id={`heritage-${city.id}`}>{t({en:"A closer look",th:"มองเมืองใกล้ขึ้น",zh:"走近这座城"})}</h2>
    {selected?<>
      {records.length>1&&<label className="heritage-selector">{t({en:"Visual record",th:"ภาพหรือวัตถุ",zh:"影像或文物"})}<select aria-label={t({en:"Visual record",th:"ภาพหรือวัตถุ",zh:"影像或文物"})} value={selected.id} onChange={event=>setSelectedId(event.target.value)}>{records.map(record=><option key={record.id} value={record.id}>{record.title[locale]}</option>)}</select></label>}
      <figure className="heritage-layout">
        <a className="heritage-image-link" href={selected.sourceUrl} target="_blank" rel="noopener noreferrer"><picture>{selected.jpegImage&&<source type="image/webp" srcSet={assetUrl(selected.image)}/>}<img src={assetUrl(selected.jpegImage??selected.image)} alt={selected.title[locale]} loading="lazy" decoding="async" /></picture></a>
        <figcaption>
          <p className="heritage-scope">{t(selected.scope==="local"?{en:"Local place",th:"สถานที่ในพื้นที่",zh:"当地场所"}:selected.scope==="province"?{en:"Provincial context",th:"บริบทระดับจังหวัด",zh:"省级背景"}:{en:"Regional comparison · not a documented city find",th:"ตัวอย่างเปรียบเทียบระดับภูมิภาค · ไม่ได้ยืนยันว่าพบในเมืองนี้",zh:"区域比较 · 未证实为本城出土文物"})}</p>
          {records.length===1&&<h3>{selected.title[locale]}</h3>}<p>{selected.caption[locale]}</p>
          {selected.contextSourceUrl&&<p><a href={selected.contextSourceUrl} target="_blank" rel="noopener noreferrer">{t({en:"Place and history reference",th:"อ้างอิงสถานที่และประวัติศาสตร์",zh:"地点与历史参考"})} ↗</a></p>}
          {(selected.objectDate||selected.photoDate)&&<p className="heritage-dates">
            {selected.objectDate&&<>{t({en:"Object period",th:"สมัยของวัตถุ",zh:"文物年代"})}: {selected.objectDate[locale]}</>}
            {selected.objectDate&&selected.photoDate&&" · "}
            {selected.photoDate&&<>{t({en:"Photo date in source",th:"วันที่ภาพตามแหล่งที่มา",zh:"来源所载拍摄日期"})}: {selected.photoDate}</>}
          </p>}
          {selected.creditLine&&!creditIsAuthor&&<p>{selected.creditLine}</p>}
          <p className="heritage-rights">{creditIsAuthor ? selected.creditLine : selected.author} · <a href={selected.licenseUrl} target="_blank" rel="noopener noreferrer">{selected.license}</a> · <a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer">{t({en:"Source record",th:"ระเบียนต้นทาง",zh:"来源记录"})} ↗</a></p>
          <details className="heritage-technical-notes"><summary>{t({en:"Image preparation and source check",th:"การจัดเตรียมภาพและการตรวจแหล่งที่มา",zh:"影像处理与来源核查"})}</summary>
            <p className="heritage-image-note">{t(selected.verifiedAt&&selected.imagePreparation==="resized-uncropped"?{en:"Image resized and converted for display; no crop. Source and reuse terms checked",th:"ย่อและแปลงรูปแบบภาพเพื่อแสดงผล ไม่ตัดส่วนภาพ ตรวจสอบแหล่งที่มาและเงื่อนไขการใช้",zh:"影像仅缩放并转换格式展示，未裁剪。已核查来源及使用条款"} : selected.verifiedAt ? {en:"Display copy; consult the source for the original image. Source and reuse terms checked",th:"ภาพสำเนาสำหรับแสดงผล ดูภาพต้นฉบับจากแหล่งที่มา ตรวจสอบแหล่งภาพและเงื่อนไขการใช้",zh:"展示副本；原图请参阅来源。已核查来源及使用条款"} : {en:"Attribution from the existing image archive. Consult the source for the original image and its reuse terms.",th:"เครดิตจากคลังภาพเดิม ดูภาพต้นฉบับและเงื่อนไขการใช้ที่แหล่งอ้างอิง",zh:"署名沿用既有影像档案。请在来源页查阅原图及使用条款。"})} {selected.verifiedAt??""}</p>
            <p><a href={assetUrl("/heritage/source-register.json")} download>{t({en:"Download the source register (JSON)",th:"ดาวน์โหลดทะเบียนแหล่งที่มา (JSON)",zh:"下载来源登记表（JSON）"})}</a></p>
          </details>
        </figcaption>
      </figure>
    </>:<p>{t({en:"A locally verified visual record has not yet been curated for this dossier. Explore collection sources below; search results are not evidence of a local find.",th:"แฟ้มนี้ยังไม่มีภาพที่คัดสรรและยืนยันความเกี่ยวข้องกับพื้นที่ สำรวจแหล่งสะสมด้านล่าง ผลการค้นหาไม่ได้ยืนยันว่าพบวัตถุในพื้นที่",zh:"本档案尚未策展经核实的当地影像。可继续浏览下方馆藏来源；搜索结果并不能证明文物出土于本地。"})}</p>}
    <p className="heritage-search"><a href={search} target="_blank" rel="noopener noreferrer">{t({en:"Explore more images in Wikimedia Commons",th:"สำรวจภาพเพิ่มเติมใน Wikimedia Commons",zh:"在Wikimedia Commons探索更多影像"})} ↗</a></p>
  </section>;
}
