import type {Route} from './routing';
import type {Locale} from './types';
import {PAGE_MASCOT_BRIEFS,type PageMascotKind,type MascotPose} from './pageMascotBriefs';
import {NONG_PLUB_ASSETS} from './nongPlubData';
import {toAppPath} from './routing';
const POSES:Record<MascotPose,string>={...NONG_PLUB_ASSETS,welcome:'/nong-plub/nong-plub-welcome-crayon.webp',explain:'/nong-plub/nong-plub-explain-crayon.webp'};
export default function PageMascot({kind,locale,embedded=false}:{kind:Route['kind'];locale:Locale;embedded?:boolean}){
 if(kind==='city'||kind==='creative-economy')return null;
 const brief=PAGE_MASCOT_BRIEFS[kind as PageMascotKind];
 const guide=<aside className={`page-mascot${embedded?' page-mascot-embedded':' section'}`} lang={locale==='zh'?'zh-Hans':locale} aria-label={locale==='th'?'หนึ่งนาทีกับน้องพลับ':locale==='zh'?'小普的一分钟导读':'One minute with Nong Plub'}>
  <img className="page-mascot-art" src={POSES[brief.pose]} width={220} height={260} alt={locale==='th'?'น้องพลับ ผู้แนะนำข้อมูลเมือง':locale==='zh'?'城市数据向导小普':'Nong Plub, your city-data guide'} loading="lazy"/>
  <div className="page-mascot-note">
   <p className="mascot-hand mascot-note-title">{locale==='th'?'หนึ่งนาทีกับน้องพลับ':locale==='zh'?'小普的一分钟导读':'One minute with Nong Plub'}</p>
   <p className="mascot-hand">{brief.copy[locale]}</p>
   {!(embedded&&kind==='home')&&<a href={toAppPath(brief.action.path)}>{brief.action.label[locale]} →</a>}
  </div>
 </aside>;
 if(!embedded&&["rankings","map","compare","invest","references","canvas"].includes(kind))return <details className="page-mascot-toggle section"><summary><img src="/nong-plub/nong-plub-avatar-crayon.webp" width={32} height={32} alt=""/><span className="mascot-hand">{locale==='th'?'หนึ่งนาทีกับน้องพลับ':locale==='zh'?'小普的一分钟导读':'One minute with Nong Plub'}</span></summary>{guide}</details>;
 return guide;
}
