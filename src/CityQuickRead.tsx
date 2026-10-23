import { PILLAR_LABELS, type Locale, type ScoringPillar, type SmartCity } from './types';
import { translate } from './cityPresentation';
export default function CityQuickRead({ city, locale, highest, lowest }: { city: SmartCity; locale: Locale; highest: ScoringPillar; lowest: ScoringPillar }) {
  const t = (en: string, th: string, zh: string) => translate(locale, { en, th, zh });
  return <div className="city-profile-read">
    <dl>
      <div><dt>{t('Highest', 'สูงสุด', '最高')}</dt><dd>{PILLAR_LABELS[locale][highest]} <strong>{city.scores[highest]}/100</strong></dd></div>
      <div><dt>{t('Lowest', 'ต่ำสุด', '最低')}</dt><dd>{PILLAR_LABELS[locale][lowest]} <strong>{city.scores[lowest]}/100</strong></dd></div>
    </dl>
    <p>{t('Curated scores. Before assessing a project, check sources, dates and provincial context in Evidence.', 'คะแนนที่คัดสรร ก่อนประเมินโครงการ ดูแหล่งข้อมูล วันที่ และบริบทจังหวัดในแท็บหลักฐาน', '编辑评估分数。评估项目前，请在证据页核查来源、日期与省级背景。')}</p>
  </div>;
}
