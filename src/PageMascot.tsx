import {useId,useState,type ReactNode} from 'react';
import type {Route} from './routing';
import type {Locale} from './types';
import {PAGE_MASCOT_BRIEFS,type PageMascotKind,type MascotPose} from './pageMascotBriefs';
import {NONG_PLUB_ASSETS} from './nongPlubData';
import {toAppPath} from './routing';
const POSES:Record<MascotPose,string>={...NONG_PLUB_ASSETS,welcome:'/nong-plub/nong-plub-welcome-crayon.webp',explain:'/nong-plub/nong-plub-explain-crayon.webp'};
const L=(locale:Locale,en:string,th:string,zh:string)=>locale==='th'?th:locale==='zh'?zh:en;
/* Right-sized derivatives of the commissioned poses (scripts/build-guide-figures.py). */
const GUIDE:Record<MascotPose,{src:string;w:number}>={
 urban:{src:'/nong-plub/guide/nong-plub-urban.webp',w:202},heritage:{src:'/nong-plub/guide/nong-plub-heritage.webp',w:222},
 temple:{src:'/nong-plub/guide/nong-plub-temple.webp',w:188},cafe:{src:'/nong-plub/guide/nong-plub-cafe.webp',w:253},
 nature:{src:'/nong-plub/guide/nong-plub-nature.webp',w:221},welcome:{src:'/nong-plub/guide/nong-plub-welcome.webp',w:253},
 explain:{src:'/nong-plub/guide/nong-plub-explain.webp',w:203},
};

/*
 * The presenter band. The artists drew full-figure poses, one per page brief,
 * with flat bottom edges: she is shown at a size where the drawing reads, standing
 * ON the band's closing hairline, the note beside her. The band is one row, the
 * same on every page, and the figure is the reason for its height — it is not
 * chrome around an avatar, and not a 220px sticker above the title either.
 * (An earlier pass shrank her to a 40px thumbnail: that is an amateur use of
 * commissioned art, and it is recorded here so nobody repeats it.)
 */
export default function PageMascot({kind,locale,embedded=false,photo,search}:{kind:Route['kind'];locale:Locale;embedded?:boolean;photo?:ReactNode;search?:ReactNode}){
 const photoId=useId();
 const [photoOpen,setPhotoOpen]=useState(false);
 if(kind==='city'||kind==='creative-economy')return null;
 const brief=PAGE_MASCOT_BRIEFS[kind as PageMascotKind];
 if(kind==='home'&&embedded)return <section className="home-city-guide" lang={locale==='zh'?'zh-Hans':locale} aria-labelledby="home-guide-title">
  <div className="home-city-guide-message">
   <h1 id="home-guide-title" className="cinematic-hero-title">{locale==='th'?'เลือกเมืองที่ใช่':locale==='zh'?'寻找适合你的城市':'Find your city'}</h1>
   <div className="home-city-guide-reading"><p className="mascot-hand home-city-guide-copy">{brief.copy[locale]}</p>
   <p className="home-city-guide-byline">{locale==='th'?'น้องพลับ · ผู้นำทางข้อมูลเมือง':locale==='zh'?'小普 · 城市数据向导':'Nong Plub · Your city-data guide'}</p></div>
  </div>
  <div className="home-city-guide-visual"><img className="home-city-guide-art" src={POSES.welcome} width={220} height={260} alt={locale==='th'?'น้องพลับชวนเปิดดูแฟ้มเมือง':locale==='zh'?'小普邀你浏览城市档案':'Nong Plub welcomes you into the city records'} fetchPriority="high"/></div>
  {search}
  <nav className="home-city-guide-actions" aria-label={locale==='th'?'เริ่มสำรวจ':locale==='zh'?'开始探索':'Start exploring'}>
   <a className="cta-button home-city-guide-action" href={toAppPath('/rankings')}>{locale==='th'?'ดูแฟ้มเมือง':locale==='zh'?'浏览城市':'Explore cities'} →</a>
   <a href={toAppPath('/references')} aria-label={locale==='th'?'สรุปหลักฐานการส่งมอบ':locale==='zh'?'交付实证简报':'Delivery Evidence Brief'}>{locale==='th'?'หลักฐาน':locale==='zh'?'证据':'Evidence'} →</a>
   <a href={toAppPath('/map')}>{locale==='th'?'แผนที่':locale==='zh'?'地图':'Map'} →</a>
  </nav>
 </section>;
 const lang=locale==='zh'?'zh-Hans':locale;
 const name=L(locale,'One minute with Nong Plub','หนึ่งนาทีกับน้องพลับ','小普的一分钟导读');
 /* Embedded (inside Bingo's own popover): the full figure still earns its room there. */
 if(embedded)return <aside className="page-mascot page-mascot-embedded" lang={lang} aria-label={name}>
  <img className="page-mascot-art" src={POSES[brief.pose]} width={220} height={260} alt={L(locale,'Nong Plub, your city-data guide','น้องพลับ ผู้แนะนำข้อมูลเมือง','城市数据向导小普')} loading="lazy"/>
  <div className="page-mascot-note">
   <p className="mascot-hand mascot-note-title">{name}</p>
   <p className="mascot-hand">{brief.copy[locale]}</p>
   <a href={toAppPath(brief.action.path)}>{brief.action.label[locale]} →</a>
  </div>
 </aside>;
 const photoLabel=L(locale,'Photo context','ภาพบริบท','背景照片');
 const figure=GUIDE[brief.pose];
 return <>
  <aside className="page-guide section" lang={lang} aria-label={name}>
   <div className="page-guide-note">
    <p className="mascot-hand">{brief.copy[locale]}</p>
    <div className="page-guide-actions">
     <a href={toAppPath(brief.action.path)}>{brief.action.label[locale]} →</a>
     {photo&&<button type="button" className="page-guide-photo" aria-expanded={photoOpen} aria-controls={photoId} aria-label={photoLabel} title={photoLabel} onClick={()=>setPhotoOpen(open=>!open)}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true"><path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="3.5"/></svg>
     </button>}
    </div>
   </div>
   <img className="page-guide-figure" src={figure.src} width={figure.w} height={300} alt={L(locale,'Nong Plub, your city-data guide','น้องพลับ ผู้แนะนำข้อมูลเมือง','城市数据向导小普')} loading="lazy"/>
  </aside>
  {photo&&<div id={photoId} className="page-guide-photo-panel section" hidden={!photoOpen}>{photoOpen&&photo}</div>}
 </>;
}
