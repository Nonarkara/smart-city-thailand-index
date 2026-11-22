<p align="center">
  <a href="#english">English</a> · <a href="#thai">ภาษาไทย</a> · <a href="#chinese">简体中文</a>
</p>

# Smart City Thailand Index (SCITI)

<p align="center">
  <img src="docs/hero-banner.png" alt="Illustration of a researcher at a glass dashboard over a map of Thailand. Figures on the glass are artwork, not live SCITI scores." width="100%">
</p>

<p align="center"><em>Studio drawing for this page. The gauges on the glass are not live telemetry and are not the published pillar weights.</em></p>

Public web app for Thailand’s smart-city index. It records what is running in a city, not what a plan promises. The scoring line is inspired by SLIC (Smart Liveable Cities Index). This repository is not [SLIC Index V3](https://github.com/Nonarkara/SLIC-Index) and not the editorial city-narrative site [Nonarkara/sciti](https://github.com/Nonarkara/sciti).

**Live:** [nonarkara.github.io/smart-city-thailand-index](https://nonarkara.github.io/smart-city-thailand-index/) · [sciti.nonarkara.org](https://sciti.nonarkara.org) (`public/CNAME`)

---

<a id="english"></a>

## English

### What this is

SCITI is a trilingual (English, Thai, Chinese — on screen the Chinese label is **CN**) React app: city dossiers, a map, rankings, comparisons, and a written method. depa’s Smart City Local certification reviews plans and readiness. This index asks what is operating. This page’s own line is that the scoring is inspired by SLIC. The knowledge base in `src/KnowledgePage.tsx` calls SCITI an independent assessment tool, and says it was developed by Dr. Non A., Senior Expert at depa’s Smart City Promotion Department, using the SLIC (Smart Liveable Cities Index) methodology.

It is not a census of every Thai municipality, and this repository does not contain a gazette that makes a SCITI rank a statutory national ranking.

### Who it is for

The about page (`src/AboutPage.tsx`) says the purpose is to help people ask better questions about where to live, learn, work, visit or invest. It also says a score is a research estimate, not a service guarantee or an investment recommendation. `CityLeague` in `src/types.ts` is a province, a municipality, a district, a campus, a special zone, or a township. Mae Moh is a township. The about page names the first five. Those units are not interchangeable.

Corrections and data submissions go to [data@slic-index.org](mailto:data@slic-index.org) or [non.ar@depa.or.th](mailto:non.ar@depa.or.th), the addresses the interface already publishes.

### How to read it

| View | Path |
|---|---|
| Home | `/` |
| City map | `/map` |
| Rankings | `/rankings` |
| Your city | `/discover` |
| Compare | `/compare` |
| City dossier | `/city/:id` |
| Data and sources | `/references` |
| Methodology | `/methodology` |
| Knowledge base | `/knowledge` |
| Evidence bingo | `/bingo` |
| Provincial baseline | `/baseline` |
| Mission | `/about` |
| Manifesto | `/story` |
| Nakhon Si Thammarat showcase | `/showcase` |
| Programme | `/program` |
| Partners | `/partners` |
| Invest | `/invest` |

The header groups these under Home, Cities, Method, Places & people, and Network (`src/TopbarNav.tsx`). Routing is custom (`src/routing.ts`). There is no React Router.

### Run and build

Node.js 20 or newer. The weekly sync workflow uses Node 20. The GitHub Pages workflow uses Node 24.

```bash
git clone https://github.com/Nonarkara/smart-city-thailand-index.git
cd smart-city-thailand-index
npm install
npm run dev
```

Dev server: <http://localhost:5188>.

```bash
npm run test:run
npm run lint
npm run build
```

`npm run build` is `tsc -b && vite build`. The postbuild step writes the static API files, `cities.json`, Open Graph city pages, and the heritage register into `dist/`. Do not commit `dist/`, `node_modules`, or `.env`.

Optional, only if you point the app at Supabase. Leave them unset to read the dataset in this repo.

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

`public/CNAME` is `sciti.nonarkara.org`. Project notes say that hostname is served from Cloudflare Pages, and that GitHub Actions also publishes a Pages copy from `main`. `vercel.json` is an SPA rewrite for a Vercel deploy. This page does not include deploy tokens.

### Data and method

Seven pillars, fixed weights in `PILLAR_WEIGHTS` (`src/types.ts`): livability 25, economy 20, safety 15, wellbeing 15, environment 10, hospitality 10, digital 5. The composite is weighted arithmetic in `src/scoring.ts`. Method code **SCITI-2026-METH**, version **2026.04**, data cut-off **2026-04-04** (`src/methodologySpec.ts`). `assignTier` returns Alpha at 65 and above, Beta at 45 and below 65, and Gamma below 45.

The source registry in `src/evidenceData.ts` names NSO, NESDC (GPP), the Pollution Control Department, the Royal Thai Police, the Ministry of Public Health, GISTDA, Open-Meteo / Copernicus, World Bank Open Data, depa Smart City Office, City Data Platform Thailand, BOI, ONEP, the Royal Forest Department, field observation, and the Treasury Department. What each series covers is in the `descEn`, `descTh`, and `descZh` fields on those records in `src/evidenceData.ts`. Dossiers are TypeScript in `src/cityData.ts` and `src/registeredCityData.ts`. The cited research snapshot is `src/researchSnapshot.json`, which points at one file under `public/research/`. `index.html` describes rankings and scores for 118 Thai smart cities.

### License and credit

Source code is [MIT](LICENSE). Copyright 2026 Digital Economy Promotion Agency (depa).

Published index data is named as [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) in `index.html`. Photographs keep the license on each record (`src/photoCredits.ts`).

Developed by **Dr Non Arkaraprasertkul** (นน อัครประเสริฐกุล), Smart City Promotion, depa, Ministry of Digital Economy and Society. The in-app knowledge base and the Hitachi Review citation in `src/ProgramPage.tsx` give the role as Senior Expert in Smart City Promotion.

---

<a id="thai"></a>

## ภาษาไทย

### นี่คืออะไร

SCITI เป็นเว็บแอปดัชนีเมืองอัจฉริยะของไทย สามภาษา (อังกฤษ ไทย จีน — บนจอใช้ตัวย่อ **CN**) รวมแฟ้มเมือง แผนที่ อันดับ หน้าเปรียบเทียบ และระเบียบวิธีที่อ่านได้ การรับรอง Smart City Local ของ depa ดูแผนและความพร้อม ดัชนีนี้ถามว่าอะไรเดินอยู่จริง หน้านี้บรรยายเองว่าแนวให้คะแนนได้แรงจาก SLIC คลังความรู้ใน `src/KnowledgePage.tsx` เรียก SCITI ว่าเครื่องมือประเมินอิสระ และบอกว่าพัฒนาโดย ดร.ณณ ผู้เชี่ยวชาญอาวุโส ฝ่ายส่งเสริมเมืองอัจฉริยะ depa โดยใช้ระเบียบวิธี SLIC (Smart Liveable Cities Index)

ที่เก็บนี้ไม่ใช่ [SLIC Index V3](https://github.com/Nonarkara/SLIC-Index) และไม่ใช่เว็บเล่าเรื่องเมือง [Nonarkara/sciti](https://github.com/Nonarkara/sciti) ในรีโปนี้ไม่มีราชกิจจานุเบกษาที่ทำให้ลำดับ SCITI เป็นดัชนีแห่งชาติตามกฎหมาย

### ใครใช้

หน้าเกี่ยวกับแพลตฟอร์ม (`src/AboutPage.tsx`) บอกว่ามีไว้เพื่อช่วยตั้งคำถามที่ดีขึ้นเกี่ยวกับเมืองที่จะอยู่อาศัย เรียน ทำงาน ท่องเที่ยว หรือลงทุน และบอกว่าคะแนนคือค่าประมาณวิจัย ไม่ใช่การรับประกันบริการหรือคำแนะนำลงทุน หน้าเกี่ยวกับแพลตฟอร์มระบุจังหวัด เทศบาล เขต วิทยาเขต หรือเขตพิเศษ `CityLeague` ใน `src/types.ts` มีประเภทที่หกคือชุมชน แม่เมาะเป็นชุมชน หน่วยเหล่านี้ใช้แทนกันไม่ได้

ส่งข้อมูลหรือแก้ตัวเลขที่ตรวจได้ที่ [data@slic-index.org](mailto:data@slic-index.org) หรือ [non.ar@depa.or.th](mailto:non.ar@depa.or.th) ซึ่งเป็นที่อยู่ที่หน้าเว็บใช้อยู่แล้ว

### อ่านดัชนียังไง

หน้าแรก `/` · แผนที่ `/map` · อันดับ `/rankings` · เมืองคุณ `/discover` · เทียบเมือง `/compare` · แฟ้มเมือง `/city/:id` · ข้อมูลและแหล่งที่มา `/references` · ระเบียบวิธี `/methodology` · คลังความรู้ `/knowledge` · บิงโกหลักฐาน `/bingo` · ข้อมูลพื้นฐาน `/baseline` · พันธกิจ `/about` · ปฏิญญา `/story` · นครศรีต้นแบบ `/showcase` · โครงการ `/program` · พันธมิตร `/partners` · ลงทุน `/invest`

เมนูบนรวมหน้าเหล่านี้เป็นห้ากลุ่มใน `src/TopbarNav.tsx` เส้นทางเขียนเองใน `src/routing.ts` ไม่ได้ใช้ React Router

**ไซต์:** [nonarkara.github.io/smart-city-thailand-index](https://nonarkara.github.io/smart-city-thailand-index/) และ [sciti.nonarkara.org](https://sciti.nonarkara.org) (ค่าใน `public/CNAME`) บันทึกโปรเจกต์ระบุว่าโดเมนนี้เสิร์ฟจาก Cloudflare Pages และ GitHub Actions ยังเผยแพร่สำเนา Pages จากสาขา `main`

### รันและบิลด์

ใช้ Node.js 20 ขึ้นไป เวิร์กโฟลว์ซิงก์รายสัปดาห์ใช้ Node 20 เวิร์กโฟลว์ GitHub Pages ใช้ Node 24

```bash
git clone https://github.com/Nonarkara/smart-city-thailand-index.git
cd smart-city-thailand-index
npm install
npm run dev
```

เซิร์ฟเวอร์พัฒนาอยู่ที่ <http://localhost:5188>

```bash
npm run test:run
npm run lint
npm run build
```

`npm run build` คือ `tsc -b && vite build` ขั้นตอน postbuild เขียนไฟล์ API คงที่ `cities.json` หน้า Open Graph ของแต่ละเมือง และทะเบียนภาพมรดก ลงใน `dist/` อย่าคอมมิต `dist/` `node_modules` หรือ `.env`

ถ้าจะชี้แอปไปที่ Supabase ค่อยใส่สองตัวนี้ ไม่ใส่ก็อ่านชุดข้อมูลในรีโป

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

`vercel.json` เป็นกฎ rewrite ของ SPA สำหรับการดีพลอยบน Vercel หน้านี้ไม่มีโทเคนสำหรับดีพลอย

### ข้อมูลและระเบียบวิธี

เสาหลักเจ็ดเสา น้ำหนักคงที่ใน `PILLAR_WEIGHTS` (`src/types.ts`): ความน่าอยู่ 25 เศรษฐกิจ 20 ความปลอดภัย 15 คุณภาพชีวิต 15 สิ่งแวดล้อม 10 อัธยาศัย 10 ดิจิทัล 5 คะแนนรวมเป็นการถ่วงน้ำหนักธรรมดาใน `src/scoring.ts` รหัสวิธี **SCITI-2026-METH** เวอร์ชัน **2026.04** จุดตัดข้อมูล **2026-04-04** (`src/methodologySpec.ts`) `assignTier` ให้ Alpha ตั้งแต่ 65, Beta ตั้งแต่ 45 แต่ต่ำกว่า 65, และ Gamma ต่ำกว่า 45

ทะเบียนแหล่งใน `src/evidenceData.ts` ระบุ สสช., สศช. (GPP), กรมควบคุมมลพิษ, สำนักงานตำรวจแห่งชาติ, กระทรวงสาธารณสุข, GISTDA, Open-Meteo / Copernicus, World Bank Open Data, สำนักงานเมืองอัจฉริยะ depa, City Data Platform Thailand, BOI, สผ., กรมป่าไม้, การลงพื้นที่ และกรมธนารักษ์ แต่ละชุดคลุมถึงไหนอยู่ในฟิลด์ `descEn`, `descTh` และ `descZh` ของระเบียนนั้นใน `src/evidenceData.ts` แฟ้มเมืองอยู่ใน `src/cityData.ts` กับ `src/registeredCityData.ts` สแนปช็อตวิจัยที่อ้างอิงอยู่ที่ `src/researchSnapshot.json` ซึ่งชี้ไปไฟล์เดียวใต้ `public/research/` `index.html` บรรยายอันดับและคะแนนของ 118 เมืองอัจฉริยะของไทย

### สัญญาอนุญาตและเครดิต

ซอร์สโค้ดเป็น [MIT](LICENSE) ลิขสิทธิ์ 2026 สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa)

ข้อมูลดัชนีที่เผยแพร่ระบุเป็น [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) ใน `index.html` ภาพถ่ายคงสัญญาอนุญาตของแต่ละรายการ (`src/photoCredits.ts`)

พัฒนาโดย **ดร. นน อัครประเสริฐกุล** ฝ่ายส่งเสริมเมืองอัจฉริยะ depa กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม คลังความรู้ในแอปและบรรณานุกรม Hitachi Review ใน `src/ProgramPage.tsx` ระบุตำแหน่งเป็นผู้เชี่ยวชาญอาวุโสด้านการส่งเสริมเมืองอัจฉริยะ

---

<a id="chinese"></a>

## 简体中文

### 这是什么

SCITI 是泰国智慧城市指数的网页应用，界面为英文、泰文和中文（屏幕上的中文缩写是 **CN**）。里面是城市档案、地图、排名、对比，以及写明的计算方法。depa 的 Smart City Local 认证看的是方案和准备程度；这个指数问的是城市里已经在运行的东西。本页自己的说法是计分受 SLIC 启发。`src/KnowledgePage.tsx` 的知识库称 SCITI 为独立评估工具，并写明它由 depa 智慧城市推广部门高级专家 Non A. 博士开发，采用 SLIC（智慧宜居城市指数）方法。

本仓库不是 [SLIC Index V3](https://github.com/Nonarkara/SLIC-Index)，也不是城市叙事站 [Nonarkara/sciti](https://github.com/Nonarkara/sciti)。仓库里没有把 SCITI 名次定为法定国家排名的政府公报。

### 给谁用

关于页（`src/AboutPage.tsx`）写明，目的是帮助人们更好地思考居住、学习、工作、旅行或投资的地点。它还写明，分数属于研究估算，并非服务保证或投资建议。关于页写出的是府、市镇、区、校园或特别区域。`src/types.ts` 的 `CityLeague` 还有第六种：镇。Mae Moh 是镇。这些单位不能互相替换。

可核对的更正和数据，寄到界面已经公开的 [data@slic-index.org](mailto:data@slic-index.org) 或 [non.ar@depa.or.th](mailto:non.ar@depa.or.th)。

### 怎么读

首页 `/` · 城市地图 `/map` · 排名 `/rankings` · 你的城市 `/discover` · 对比 `/compare` · 城市档案 `/city/:id` · 数据与来源 `/references` · 方法论 `/methodology` · 知识库 `/knowledge` · 证据宾果 `/bingo` · 省级基线 `/baseline` · 使命 `/about` · 宣言 `/story` · 洛坤样板 `/showcase` · 计划 `/program` · 合作伙伴 `/partners` · 投资 `/invest`

顶栏把这些收成五组，见 `src/TopbarNav.tsx`。路由写在 `src/routing.ts`，没有使用 React Router。

**站点：** [nonarkara.github.io/smart-city-thailand-index](https://nonarkara.github.io/smart-city-thailand-index/) 与 [sciti.nonarkara.org](https://sciti.nonarkara.org)（`public/CNAME`）。项目说明写明该域名由 Cloudflare Pages 提供，GitHub Actions 也会从 `main` 发布一份 Pages 副本。

### 本地运行和构建

需要 Node.js 20 或更高版本。每周同步工作流使用 Node 20，GitHub Pages 工作流使用 Node 24。

```bash
git clone https://github.com/Nonarkara/smart-city-thailand-index.git
cd smart-city-thailand-index
npm install
npm run dev
```

开发服务器：<http://localhost:5188>

```bash
npm run test:run
npm run lint
npm run build
```

`npm run build` 即 `tsc -b && vite build`。postbuild 会把静态 API、`cities.json`、各城市的 Open Graph 页面和遗产图像登记写入 `dist/`。不要提交 `dist/`、`node_modules` 或 `.env`。

只有在把应用指向 Supabase 时才需要下面两项。留空则读取仓库里的数据集。

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

`vercel.json` 是给 Vercel 部署用的 SPA 重写规则。本页不包含部署令牌。

### 数据与方法

七个支柱，权重固定在 `PILLAR_WEIGHTS`（`src/types.ts`）：宜居 25、经济 20、安全 15、福祉 15、环境 10、人文 10、数字 5。综合分是 `src/scoring.ts` 里的加权算术。方法编号 **SCITI-2026-METH**，版本 **2026.04**，数据截止 **2026-04-04**（`src/methodologySpec.ts`）。`assignTier` 的切分是 Alpha 为 65 及以上，Beta 为 45 及以上且低于 65，Gamma 低于 45。

`src/evidenceData.ts` 的来源登记包括泰国国家统计局、NESDC（府级生产总值）、污染控制局、泰国皇家警察、公共卫生部、GISTDA、Open-Meteo / Copernicus、世界银行公开数据、depa 智慧城市办公室、City Data Platform Thailand、BOI、ONEP、皇家林业局、实地观察，以及国库厅（กรมธนารักษ์）。每一组数据覆盖到哪里，写在这些记录的 `descEn`、`descTh` 和 `descZh` 字段里，同在 `src/evidenceData.ts`。城市档案在 `src/cityData.ts` 和 `src/registeredCityData.ts`。被引用的研究快照是 `src/researchSnapshot.json`，它指向 `public/research/` 下的一个文件。`index.html` 写的是 118 座泰国智慧城市的排名与分数。

### 许可与署名

源代码为 [MIT](LICENSE)。版权 2026 数字经济促进局（depa）。

已发布的指数数据在 `index.html` 中标明为 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。照片沿用各自记录上的许可（`src/photoCredits.ts`）。

由 **Dr Non Arkaraprasertkul**（นน อัครประเสริฐกุล）开发。应用内知识库写的是 depa 智慧城市推广部门高级专家。`src/ProgramPage.tsx` 的 Hitachi Review 引文写的职务是 depa 智慧城市推广高级专家。
