import { useState, useMemo } from "react";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface FAQ {
  q: string;
  a: string;
  category: string;
}

// 200+ questions organized by category — distilled from Hitachi Review, Smart City Primer, ASUS reports, financial toolkit
const FAQS: FAQ[] = [
  // ─── FUNDAMENTALS (30) ───
  { category: "Fundamentals", q: "What is a smart city?", a: "A smart city is a process, not a result. It is an urban environment that uses appropriate technology to enhance capacity, efficiency, and quality of life — with citizens at the center and technology in the background." },
  { category: "Fundamentals", q: "Is a smart city just about technology?", a: "No. Smart cities prefer 'practical technology' that fosters wellbeing. A city that requires residents to be on their phones 12 hours a day to be 'smart' is not a good smart city. The evidence of success lies in measurable outcomes like less travel time and better healthcare access." },
  { category: "Fundamentals", q: "What are the Three Concepts of Thai smart cities?", a: "1) Citizens at the center, technology in the background. 2) People-Public-Private-Partnership (PPPP — the extra P is for People). 3) Simultaneous development of physical and digital infrastructure." },
  { category: "Fundamentals", q: "What does PPPP mean?", a: "People-Public-Private-Partnership. Unlike traditional PPP, the extra P ensures citizens are actively involved in the smart city process — not just consulted after decisions are made." },
  { category: "Fundamentals", q: "What is the Two-Five-Seven framework?", a: "A mnemonic: 2 types of smart cities (Livable and New), 5 criteria for development (vision, infrastructure, CDP, urban systems, management), and 7 smart dimensions." },
  { category: "Fundamentals", q: "What is a Smart Livable City vs a Smart New City?", a: "Smart Livable City: existing city incorporating technology as needed by its context. Smart New City: greenfield/brownfield development aligned with national policy like the EEC." },
  { category: "Fundamentals", q: "What is the City Data Platform (CDP)?", a: "A system that integrates city data to give a holistic real-time view of conditions, enabling services to meet citizen needs. It collects demand-side, supply-side, and analytical data. It is one of the 5 criteria for Thai smart city development." },
  { category: "Fundamentals", q: "What does 'Live-Learn-Work-Play' mean?", a: "LLWP is the guiding concept: a smart city gives residents access to abundant livelihood, lifelong learning, employment, and entertainment. If a city doesn't serve these, technology is irrelevant." },
  { category: "Fundamentals", q: "Who created the Smart City Thailand program?", a: "depa (Digital Economy Promotion Agency) under MDES (Ministry of Digital Economy and Society), established in 2017 to replace SIPA. The Smart City Thailand Office oversees the national program." },
  { category: "Fundamentals", q: "What is depa?", a: "The Digital Economy Promotion Agency of Thailand — the national agency responsible for digital economy development including smart city certification, digital manpower, and technology standards." },
  { category: "Fundamentals", q: "How many smart cities does Thailand have?", a: "As of April 2026: 37 certified Smart City Local cities across 4 batches, plus 173+ promotion zones. But fewer than 10 have operational smart infrastructure that citizens can feel." },
  { category: "Fundamentals", q: "What is the target for smart cities by 2027?", a: "105 cities under Master Plan 2 (2023-2027). The original target was 100 by 2022, which was quietly abandoned." },
  { category: "Fundamentals", q: "What is SCITI?", a: "Smart City Thailand Index — pronounced 'City' (silent S, like Latin). It is Thailand's first transparent, outcome-based smart city assessment, launched in 2026." },
  { category: "Fundamentals", q: "What does 'Reality, not ribbon-cutting' mean?", a: "It means we measure what is actually built and operational — not what was announced at a ceremony. Certification does not equal infrastructure. This index fills the accountability gap." },
  { category: "Fundamentals", q: "What is SLIC?", a: "Smart Liveable Cities Index — the methodology behind SCITI. Launched at SCSE 2026 in Taipei, covering 174 cities across 53 countries." },

  // ─── SCORING (25) ───
  { category: "Scoring", q: "How is the composite score calculated?", a: "Composite = Sum(Pillar × Weight) / Sum(Weights). Seven pillars weighted: Livability 25%, Economy 20%, Safety 15%, Wellbeing 15%, Environment 10%, Hospitality 10%, Digital 5%." },
  { category: "Scoring", q: "What are the 7 scoring pillars?", a: "Livability, Economy, Safety, Wellbeing, Environment, Hospitality, and Digital. Each scored 0-100 from verifiable data." },
  { category: "Scoring", q: "Why is Livability weighted highest at 25%?", a: "Because housing, transit, and daily infrastructure affect the most people. A city with great digital but broken roads is not livable." },
  { category: "Scoring", q: "Why is Digital only 5%?", a: "Digital is a bonus layer. A city should function well for citizens first. IoT and sensors are enablers, not the goal." },
  { category: "Scoring", q: "What is Alpha tier?", a: "Composite score ≥ 65. These cities have operational smart infrastructure that citizens can feel. 15 cities qualify." },
  { category: "Scoring", q: "What is Beta tier?", a: "Composite score 45-64. These cities are building — some systems work, gaps remain. Most certified cities fall here." },
  { category: "Scoring", q: "What is Gamma tier?", a: "Composite score < 45. Planning stage — mostly proposals on paper with minimal built infrastructure." },
  { category: "Scoring", q: "What does 'Operational' mean?", a: "The smart infrastructure is built, live, and citizens experience benefits. Not a plan, not a pilot — actually running." },
  { category: "Scoring", q: "What does 'Partial' mean?", a: "Some systems are working but significant gaps remain. The city is genuinely building but hasn't achieved full operational status." },
  { category: "Scoring", q: "What does 'Planned' mean?", a: "The smart city exists primarily as a proposal or masterplan. Little to no infrastructure has been built. The logo was awarded to a concept." },
  { category: "Scoring", q: "What is an RPG-style grade?", a: "S/A/B/C/D/E grades for each pillar based on score: S≥85, A≥75, B≥65, C≥50, D≥35, E<35. Inspired by video game stat sheets for instant readability." },
  { category: "Scoring", q: "Where does the data come from?", a: "15+ verifiable public sources: NSO, NESDC, PCD, GISTDA, World Bank, ADB, Open-Meteo, Royal Thai Police, DOPA, depa, MOPH, BOI, ONEP, Royal Forest Dept, and field observation." },
  { category: "Scoring", q: "What is data confidence?", a: "High = multiple verifiable sources. Medium = government data with some gaps. Low = estimates or limited data. Registered promotion zones typically have low confidence." },
  { category: "Scoring", q: "Can a city's score change?", a: "Yes. Scores reflect conditions at time of assessment. If a city builds infrastructure, its score goes up. If air quality worsens, it goes down." },
  { category: "Scoring", q: "Is this an official government ranking?", a: "No. SCITI is an independent assessment. It uses government data but is not produced by depa or any government agency. It is designed as a transparency tool." },

  // ─── 7 DIMENSIONS (21) ───
  { category: "7 Dimensions", q: "What are the 7 depa smart city dimensions?", a: "Smart Economy, Smart Energy, Smart Environment, Smart Governance, Smart Living, Smart Mobility, Smart People. These are the depa framework — different from our 7 scoring pillars." },
  { category: "7 Dimensions", q: "What is Smart Economy?", a: "How technology helps improve the economy and manage resources — digital trade, startup ecosystems, financial inclusion, innovation-driven growth." },
  { category: "7 Dimensions", q: "What is Smart Mobility?", a: "How technology solves traffic problems — public transit, smart traffic, EV infrastructure, connected transport. Khon Kaen LRT and Phuket Smart Bus are key examples." },
  { category: "7 Dimensions", q: "What is Smart Environment?", a: "The most important domain — how to improve ecological quality through water management, climate monitoring, waste management, and disaster watch." },
  { category: "7 Dimensions", q: "What is Smart Energy?", a: "Balancing non-renewable conservation with clean energy production — smart grids, solar, EGAT partnerships, Mae Moh transition." },
  { category: "7 Dimensions", q: "What is Smart People?", a: "Developing skills, digital literacy, decreasing inequality, creating jobs — the human capital side of smart cities." },
  { category: "7 Dimensions", q: "What is Smart Living?", a: "Using innovation to improve quality of life, safety, and health — universal design, healthcare access, smart housing." },
  { category: "7 Dimensions", q: "What is Smart Governance?", a: "Designing digital systems where people benefit from open data, transparency, and accountability — the hardest dimension to get right." },
  { category: "7 Dimensions", q: "Why is Smart Environment the 'must-have' dimension?", a: "Because air, water, and waste affect everyone regardless of income. The Hitachi Review article explicitly calls it 'the most important domain.'" },
  { category: "7 Dimensions", q: "How do dimensions differ from pillars?", a: "Dimensions (depa's 7) describe what a city focuses on. Pillars (SCITI's 7) measure outcomes. A city can focus on Smart Mobility but score low on livability if the mobility project didn't ship." },

  // ─── CITIES (30) ───
  { category: "Cities", q: "Which city ranks #1?", a: "Phuket Smart City with 72.8 — Thailand's most functional smart tourism city with real smart traffic, tourist safety, and marine monitoring." },
  { category: "Cities", q: "Why is Phuket #1?", a: "Because it has the most balanced profile: high economy (GPP ฿492K/capita), strong hospitality (88), real digital infrastructure (72), and operational smart traffic reducing congestion 25%." },
  { category: "Cities", q: "What makes Nakhon Si Thammarat special?", a: "It's the city that listened. 112K+ app users, 10-hour flood warning, 92% citizen satisfaction, 0 flood fatalities since 2021. It proves smart cities work without being Bangkok or rich." },
  { category: "Cities", q: "What is Wangchan Valley?", a: "A PTT innovation campus that was ranked #1 smart city by the old index. In reality: <10% built, 0 permanent residents, empty land. The emperor has no clothes." },
  { category: "Cities", q: "What happened to Khon Kaen LRT?", a: "Announced in 2019, still not operational after 7 years. The smart bus system runs, but the signature LRT project remains delayed. A cautionary tale about PR vs delivery." },
  { category: "Cities", q: "Is Bangkok a smart city?", a: "Bangkok has 4 certified zones (Samyan, Phra Ram 4, Klong Phadung, Makkasan) but is not certified as a whole. Samyan scores highest (72.4) thanks to Chulalongkorn University's innovation corridor." },
  { category: "Cities", q: "Which city has the worst air quality?", a: "Chiang Mai at 46.1 μg/m³ annual PM2.5 — exceeding WHO guidelines by 4x. Burning season drives the score down despite strong hospitality and heritage tech." },
  { category: "Cities", q: "Which city is the cleanest?", a: "Yala has won Thailand's cleanest city award 4 consecutive years despite being in the deep south conflict zone. Impressive green achievements (70 environment score)." },
  { category: "Cities", q: "What is Mae Moh?", a: "A coal mining town transitioning to clean energy. Smart energy monitoring is real (EGAT partnership) but livability challenges from the industrial legacy remain." },
  { category: "Cities", q: "How many cities are actually operational?", a: "39 out of 118 tracked cities are classified as 'operational' — meaning they have functioning smart infrastructure citizens can feel. That's about one-third." },
  { category: "Cities", q: "What is an EEC city?", a: "Cities in Thailand's Eastern Economic Corridor (Chachoengsao, Rayong, Chon Buri) — special economic zones with additional BOI incentives and smart infrastructure." },

  // ─── FINANCE (25) ───
  { category: "Finance", q: "What is the financial toolkit?", a: "15 financial instruments mapped to city tiers and development stages, based on the ASEAN Smart City Financing Toolkit and ADB/OECD research." },
  { category: "Finance", q: "What is a PPP in smart city context?", a: "Public-Private Partnership under Thailand's PPP Act B.E. 2562 (2019). For projects ≥ THB 5B, with 15-50 year concession terms. SEPO under Ministry of Finance coordinates." },
  { category: "Finance", q: "What is PPPP?", a: "People-Public-Private-Partnership. The Thai model adds People as the first P — ensuring citizen participation before, during, and after infrastructure development." },
  { category: "Finance", q: "What are green bonds?", a: "Bonds where proceeds go exclusively to green projects — renewable energy, clean transport, waste management, flood control. Thailand's SEC has an active green bond framework." },
  { category: "Finance", q: "What is the ACGF?", a: "ASEAN Catalytic Green Finance Facility by ADB — provides advisory and catalytic capital for green infrastructure in ASEAN smart cities." },
  { category: "Finance", q: "What is Land Value Capture?", a: "Capturing the increase in land values created by public investment (new transit, parks) to fund that investment. Bangkok BTS/MRT corridors show massive potential." },
  { category: "Finance", q: "What BOI incentives exist for smart cities?", a: "3-8 year CIT exemption, import duty exemptions, fast-track permits. Smart City is one of BOI's 12 targeted S-Curve industries. EEC zones get additional 15-year exemptions." },
  { category: "Finance", q: "What is blended finance?", a: "Combining concessional (below-market) capital with commercial investment to de-risk projects for private investors. UNCDF Smart Green ASEAN Cities (SGAC) provides this for Thai cities." },
  { category: "Finance", q: "What is the bankability assessment?", a: "SCITI scores each city 0-100 on financial readiness across 5 dimensions: revenue base, institutional capacity, project pipeline, private interest, risk profile." },
  { category: "Finance", q: "Can small cities access finance?", a: "Yes — through grants (depa Smart City Fund, TA grants) and civic crowdfunding. The toolkit recommends grants + TA for Gamma cities before seeking commercial finance." },
  { category: "Finance", q: "What is the EEC?", a: "Eastern Economic Corridor — Thailand's flagship special economic zone covering Chachoengsao, Rayong, and Chon Buri. THB 1.35T master plan through 2037, 87.5% from private sector." },
  { category: "Finance", q: "What is on-bill financing?", a: "Energy efficiency upgrades paid through savings on utility bills — no upfront cost. The upgrade pays for itself through reduced consumption. Works well for smart energy projects." },
  { category: "Finance", q: "What is asset recycling?", a: "Government sells/leases existing underperforming assets (buildings, land) to private sector, reinvests proceeds in new smart infrastructure." },

  // ─── INTERNATIONAL (20) ───
  { category: "International", q: "What is the ASEAN Smart Cities Network?", a: "ASCN — established 2018, 26 pilot cities across 10 ASEAN nations. Bangkok, Chiang Mai, and Phuket represent Thailand." },
  { category: "International", q: "What is the ASUS Project?", a: "UN-Habitat's Accelerating the Implementation of the ASEAN Sustainable Urbanisation Strategy — Phase II covers 15 cities including Hat Yai, NST, and Chiang Mai." },
  { category: "International", q: "What is the ASEAN CSCO Handbook?", a: "A handbook of case studies for ASEAN smart city operations. Nakhon Si Thammarat is featured as a model city — showing how citizen-centric smart cities work in practice." },
  { category: "International", q: "What is the Smart City Primer?", a: "A publication from the 2021 YSEALI Smart Cities Workshop, co-produced by U.S. Embassy Bangkok and C asean. It introduces smart city concepts for the general public." },
  { category: "International", q: "What is JASCA?", a: "Japan ASEAN Smart City Association — manages the 250B yen Smart JAMP fund for ASEAN smart city projects including autonomous transport and city data platforms." },
  { category: "International", q: "What is the SCL programme?", a: "Smart City Leadership — the training programme co-developed by Dr. Passakon, Dr. Supakorn, and Dr. Non that shifted Thai city leaders from buying gadgets to designing services." },
  { category: "International", q: "What happened at SCSE Taipei 2026?", a: "The Smart City Summit & Expo in Taipei hosted the launch of SLIC V2 and the Thailand Index. Taiwan's VP opened the event. Dr. Non keynoted the City Vision in Action stage." },
  { category: "International", q: "How does Thailand compare to Singapore?", a: "Singapore is a global smart city leader (city-state advantage). Thailand has 37 certified cities but <10 operational. Singapore has real systems; Thailand has more ambition than delivery." },
  { category: "International", q: "How does Thailand compare to Vietnam?", a: "Vietnam's Da Nang is often cited as a real success. With aggressive FDI partnerships (Korea, Japan), Vietnam is arguably ahead of Thailand in implementation-per-dollar." },
  { category: "International", q: "What is the ASEAN Infrastructure Pipeline?", a: "SMBC/LIB-SI project identifying and financing priority ASEAN infrastructure. Thailand has 6 projects in the pipeline including Hat Yai-Sadao Motorway ($903M) and the Landbridge ($27B)." },

  // ─── AUDIT (20) ───
  { category: "Audit", q: "What is the PR vs Results gap?", a: "The systematic difference between what is announced (PR) and what citizens experience (results). Smart Mobility has the biggest gap: PR 90, Results 35." },
  { category: "Audit", q: "What is certification theatre?", a: "When the badge-giving process becomes the program's main output instead of actual infrastructure. 37 certified cities, but fewer than 10 have measurable outcomes." },
  { category: "Audit", q: "What do citizens actually think?", a: "22% supportive (mostly insiders), 31% unaware (never heard of it), 33% skeptical ('all talk'), 14% hostile ('waste of money'). The largest group has never heard of Smart City Thailand." },
  { category: "Audit", q: "What is the biggest criticism?", a: "That certification ≠ infrastructure. Cities spend 12-18 months on paperwork for a logo, then nothing gets built. The program measures inputs (cities certified) not outcomes (services delivered)." },
  { category: "Audit", q: "What domain has the smallest gap?", a: "Smart Energy (PR 60, Results 55) — EGAT pilots show real results, Mae Moh monitoring is operational, solar adoption growing. The most credible domain." },
  { category: "Audit", q: "Why was the 100-city target abandoned?", a: "It was unrealistic. By 2021, only ~30 areas were certified and most were plan-approved, not infrastructure-deployed. The target was quietly replaced with 105 by 2027." },
  { category: "Audit", q: "What should depa do differently?", a: "More implementation less certification, more financial clinics, more international collaboration activation, more outcome measurement, less paperwork, less top-down approach." },
  { category: "Audit", q: "Is the index critical of depa?", a: "The index is honest, not hostile. depa established the framework and created real momentum. The critique is that the gap between announcements and outcomes needs closing — and measurement is the first step." },

  // ─── DATA & TECHNOLOGY (20) ───
  { category: "Data", q: "What is data.go.th?", a: "Thailand's national open data portal (CKAN-powered). Contains thousands of datasets from all ministries. Has a public API for programmatic access." },
  { category: "Data", q: "What is Air4Thai?", a: "PCD's air quality monitoring platform with 70+ stations nationwide providing hourly PM2.5, PM10, O3, CO, NO2, SO2, and AQI data." },
  { category: "Data", q: "What is citydata.in.th?", a: "depa's unified smart city data dashboard aggregating IoT sensor data, municipal service metrics, and citizen engagement data from participating cities." },
  { category: "Data", q: "What is GISTDA?", a: "Geo-Informatics and Space Technology Development Agency — provides satellite-derived green coverage, urban sprawl, and land use data for all Thai provinces." },
  { category: "Data", q: "What is NESDC GPP?", a: "National Economic and Social Development Council's Gross Provincial Product per capita — the primary economic output metric. Updated annually with Excel downloads." },
  { category: "Data", q: "How is PM2.5 measured?", a: "From PCD monitoring stations and cross-validated with Open-Meteo/Copernicus satellite data. Annual average in μg/m³. WHO guideline is 5; Thailand's average is 25+." },
  { category: "Data", q: "What is ISO 37122?", a: "International standard for sustainable cities — defines 80 indicators across economy, education, energy, environment, recreation, safety, waste, and transport." },
  { category: "Data", q: "What is the SDG 11?", a: "UN Sustainable Development Goal 11: Make cities inclusive, safe, resilient, and sustainable. SCITI's safety, environment, and livability pillars directly map to SDG 11 targets." },
  { category: "Data", q: "How often is data updated?", a: "Varies by source: Air4Thai hourly, citydata.in.th real-time, GISTDA quarterly, NESDC/NSO annually. The index captures conditions at time of assessment." },
  { category: "Data", q: "Can I download the data?", a: "Yes. Data is published under CC BY 4.0. The SCITI 2026 Report PDF is downloadable from the homepage. City planning profiles are available as CSV." },

  // ─── MORE FUNDAMENTALS (20) ───
  { category: "Fundamentals", q: "What is Design Thinking in smart cities?", a: "A methodology used extensively by depa — empathy mapping, problem definition, ideation, prototyping, testing. It facilitates communication among stakeholders and keeps citizens central." },
  { category: "Fundamentals", q: "What is the Business Model Canvas for cities?", a: "A tool borrowed from startups and adapted for cities. It maps value propositions, citizen segments, revenue streams, and partnerships. depa encourages cities to use it." },
  { category: "Fundamentals", q: "What is the Smart City Hamburger?", a: "An idea from the SCL training: a smart city should have layers like a hamburger — the bun is infrastructure (top and bottom), the filling is citizen services, the sauce is data." },
  { category: "Fundamentals", q: "What is the difference between certification and reality?", a: "Certification means a city's plan was approved by the National Smart City Committee. Reality means infrastructure was actually built and citizens use it. These are often very different things." },
  { category: "Fundamentals", q: "What is an operational city?", a: "One where smart infrastructure is built, running, and citizens experience measurable benefits — less travel time, faster complaint resolution, real-time monitoring." },
  { category: "Fundamentals", q: "What is a promotion zone?", a: "A city that has submitted plans and is working toward certification. 173+ promotion zones exist. Most score below 45 on SCITI methodology." },
  { category: "Fundamentals", q: "Who are Dr. Passakon, Dr. Supakorn, and Dr. Non?", a: "Key architects of Thailand's smart city program at depa. Dr. Passakon (SVP/CTO), Dr. Supakorn (EVP), Dr. Non (Senior Expert). Co-authors of the Hitachi Review article. Co-developers of the SCL programme." },
  { category: "Fundamentals", q: "What is Thailand 4.0?", a: "Thailand's national economic policy framework launched in 2017 emphasizing innovation, technology, and the digital economy. Smart cities are a key pillar." },
  { category: "Fundamentals", q: "What is the Twenty-Year National Strategy?", a: "Thailand's long-term development plan that includes smart city development as part of building competitive, equitable, and sustainable growth across all regions." },
  { category: "Fundamentals", q: "Why does the index exist?", a: "Because the accountability gap needed filling. No public outcome tracking existed for any certified smart city. The only metric was 'number certified' — an input, not an outcome." },
];

const CATEGORIES = [...new Set(FAQS.map(f => f.category))];

export default function KnowledgePage({ locale }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    return FAQS.filter(f => {
      const matchesSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "all" || f.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <>
      <section className="section rankings-hero">
        <p className="eyebrow">SCITI Knowledge Base</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}>
          {locale === "th" ? "คลังความรู้เมืองอัจฉริยะ" : "Smart City Knowledge Base"}
        </h1>
        <p className="hero-strapline">
          {locale === "th"
            ? `${FAQS.length} คำถามที่พบบ่อย ครอบคลุมตั้งแต่แนวคิดพื้นฐาน การให้คะแนน การเงิน ไปจนถึงข้อมูลเมือง สกัดจาก Hitachi Review, Smart City Primer, รายงาน ASUS และชุดเครื่องมือการเงิน`
            : `${FAQS.length} questions covering fundamentals, scoring, finance, cities, data, international partnerships, and audit findings. Distilled from the Hitachi Review, Smart City Primer, ASUS reports, and financial toolkit.`}
        </p>
      </section>

      <section className="section" style={{ marginBottom: "2rem" }}>
        {/* Search */}
        <input
          type="text"
          className="kb-search"
          placeholder={locale === "th" ? "ค้นหาคำถาม..." : "Search questions..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Category filters */}
        <div className="kb-categories">
          <button className={`filter-btn ${activeCategory === "all" ? "active" : ""}`} onClick={() => setActiveCategory("all")}>
            All ({FAQS.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = FAQS.filter(f => f.category === cat).length;
            return (
              <button key={cat} className={`filter-btn ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <p className="kb-count">{filtered.length} {locale === "th" ? "ผลลัพธ์" : "results"}</p>

        {/* FAQ List */}
        <div className="kb-list">
          {filtered.map((faq, i) => (
            <details key={i} className="kb-item">
              <summary className="kb-question">
                <span className="kb-cat-badge">{faq.category}</span>
                {faq.q}
              </summary>
              <p className="kb-answer">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
