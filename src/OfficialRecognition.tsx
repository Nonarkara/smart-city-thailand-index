import { translate } from './cityPresentation';
import type { DepaOfficialRecord } from './depaOfficialData';
import type { Locale } from './types';

export default function OfficialRecognition({ record, locale }: { record: DepaOfficialRecord; locale: Locale }) {
  const t = (en: string, th: string, zh: string) => translate(locale, { en, th, zh });
  const projects = locale === 'th' && record.keyProjectsTh ? record.keyProjectsTh : record.keyProjects;
  const date = new Date(`${record.endorsedDate}T00:00:00`).toLocaleDateString(locale === 'th' ? 'th-TH' : locale === 'zh' ? 'zh-CN' : 'en', { month: 'short', day: 'numeric', year: 'numeric' });
  return <section className="depa-official-section" aria-labelledby={`recognition-${record.cityId}`}>
    <header className="depa-official-header">
      <h2 id={`recognition-${record.cityId}`}>{t('The certified plan', 'แผนที่ได้รับการรับรอง', '获认证的规划')}</h2>
      <p className="depa-official-date">depa · {t(`Batch ${record.batch}`, `รุ่นที่ ${record.batch}`, `第 ${record.batch} 批`)} · <time dateTime={record.endorsedDate}>{date}</time></p>
    </header>
    <div className="depa-plan-layout">
      <div className="depa-plan-summary">
        {record.projectCount != null && <p className="depa-plan-count"><strong>{record.projectCount}</strong><span>{t('planned projects', 'โครงการตามแผน', '规划项目')}</span></p>}
        <h3>{t('Stated vision', 'วิสัยทัศน์ตามแผน', '规划愿景')}</h3>
        <p className="depa-official-vision">{locale === 'th' ? record.visionTh : record.vision}</p>
        {record.brandline && <p className="depa-official-brandline">“{record.brandline}”</p>}
        <p className="depa-plan-caveat">{t('Certification records intent. It does not establish that these services are operating today.', 'การรับรองแสดงเจตนาของแผน ไม่ได้ยืนยันว่าบริการเหล่านี้ดำเนินงานอยู่ในปัจจุบัน', '认证记录规划意图，不能证明这些服务目前正在运行。')}</p>
      </div>
      <div className="depa-plan-projects">
        <h3>{t('Selected projects in the plan', 'ตัวอย่างโครงการตามแผน', '规划中的部分项目')}</h3>
        <p className="depa-plan-selection">{t(`${projects.length} examples from the source summary`, `${projects.length} ตัวอย่างจากสรุปเอกสารต้นทาง`, `来源摘要中的 ${projects.length} 个示例`)}</p>
        <ol className="depa-official-project-list">{projects.map((project, index) => {
          const separator = project.match(/ — | (?=connecting |with |serving |city-wide )/);
          const split = separator?.index;
          return <li key={index} className="depa-official-project-item">{split == null ? <strong>{project}</strong> : <><strong>{project.slice(0, split)}</strong>{' '}<span>{project.slice(split + separator![0].length)}</span></>}</li>;
        })}</ol>
      </div>
    </div>
    <footer className="depa-plan-footer">
      {record.partnerships?.length ? <div><h3>{t('Named partners', 'พันธมิตรที่ระบุ', '所列合作方')}</h3><p className="depa-official-partnerships">{record.partnerships.join(' · ')}</p></div> : null}
      <a href={record.depaUrl} className="depa-official-source" target="_blank" rel="noopener noreferrer">{t('Read the certification plan (PDF)', 'อ่านแผนที่ได้รับการรับรอง (PDF)', '阅读认证规划（PDF）')} ↗</a>
    </footer>
  </section>;
}
