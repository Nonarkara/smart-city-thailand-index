// ---------------------------------------------------------------------------
// City Data Platform (CDP) Integration Layer
// ---------------------------------------------------------------------------
// Connects to Thailand's open data infrastructure:
// - data.go.th (CKAN API) — national open government data
// - citydata.in.th — depa's central smart city data hub
// - air4thai.pcd.go.th — real-time air quality
// - stat.bora.dopa.go.th — population statistics
// - GISTDA — satellite/geospatial data
// ---------------------------------------------------------------------------

/** Data source registry — what's available and how to access it */
export interface CDPDataSource {
  id: string;
  name: string;
  nameEn: string;
  nameTh: string;
  type: "api" | "download" | "dashboard";
  url: string;
  apiEndpoint?: string;
  coverage: string;
  frequency: string;
  metrics: string[];
  descEn: string;
  descTh: string;
}

/** A live data point fetched from a CDP source */
export interface CDPLiveMetric {
  cityId: string;
  source: string;
  metric: string;
  value: string | number;
  unit: string;
  timestamp: string;
  url?: string;
}

export const cdpSources: CDPDataSource[] = [
  {
    id: "data-go-th",
    name: "Open Government Data Portal",
    nameEn: "data.go.th — Open Government Data",
    nameTh: "data.go.th — ศูนย์ข้อมูลเปิดภาครัฐ",
    type: "api",
    url: "https://data.go.th",
    apiEndpoint: "https://data.go.th/api/3/action/package_search",
    coverage: "National — thousands of datasets from all agencies, many city-level",
    frequency: "Varies by dataset",
    metrics: ["economy", "population", "infrastructure", "environment", "health"],
    descEn: "Thailand's central open data portal (CKAN-based). Contains datasets from every government agency. Filter by province/district for city-level data. Used for GPP, employment, infrastructure baselines, and land use.",
    descTh: "ศูนย์ข้อมูลเปิดภาครัฐ (CKAN) มีชุดข้อมูลจากทุกหน่วยงาน กรองตามจังหวัด/อำเภอ ใช้สำหรับ GPP การจ้างงาน โครงสร้างพื้นฐาน การใช้ที่ดิน",
  },
  {
    id: "citydata-in-th",
    name: "City Data Platform Thailand",
    nameEn: "citydata.in.th — depa Smart City Data Hub",
    nameTh: "citydata.in.th — แพลตฟอร์มข้อมูลเมืองอัจฉริยะ",
    type: "dashboard",
    url: "https://www.citydata.in.th/en/smart-city-thailand/",
    coverage: "37 certified + 173 promotion zones",
    frequency: "Real-time for participating cities",
    metrics: ["smartDimensions", "projects", "iotSensors", "citizenEngagement"],
    descEn: "depa's central smart city data hub. ArcGIS-powered. Each city has a dedicated page showing projects across all 7 smart city dimensions, IoT sensor data, COVID case maps, and social listening/sentiment analysis. Free to join for any city.",
    descTh: "แพลตฟอร์มข้อมูลเมืองอัจฉริยะของ depa ใช้ ArcGIS แต่ละเมืองมีหน้าเฉพาะแสดงโครงการ 7 มิติ ข้อมูลเซ็นเซอร์ IoT แผนที่ COVID วิเคราะห์ความรู้สึกสังคม เข้าร่วมฟรี",
  },
  {
    id: "air4thai",
    name: "Air4Thai",
    nameEn: "air4thai.pcd.go.th — Real-time Air Quality",
    nameTh: "air4thai.pcd.go.th — คุณภาพอากาศเรียลไทม์",
    type: "api",
    url: "http://air4thai.pcd.go.th",
    apiEndpoint: "http://air4thai.pcd.go.th/forpublic/getNewAQI",
    coverage: "70+ monitoring stations nationwide",
    frequency: "Hourly",
    metrics: ["pm25", "pm10", "o3", "co", "no2", "so2", "aqi"],
    descEn: "Pollution Control Department's real-time air quality monitoring. 70+ stations across Thailand. PM2.5, PM10, AQI, and other pollutants. Historical data available for annual averages used in scoring.",
    descTh: "เฝ้าระวังคุณภาพอากาศเรียลไทม์ของกรมควบคุมมลพิษ สถานี 70+ แห่งทั่วไทย PM2.5 PM10 AQI สารมลพิษอื่น ข้อมูลย้อนหลังสำหรับค่าเฉลี่ยปีที่ใช้ในการให้คะแนน",
  },
  {
    id: "dopa-stat",
    name: "DOPA Population Statistics",
    nameEn: "stat.bora.dopa.go.th — Registered Population",
    nameTh: "stat.bora.dopa.go.th — ทะเบียนราษฎร์",
    type: "download",
    url: "https://stat.bora.dopa.go.th",
    coverage: "Every province, district, subdistrict — monthly updates",
    frequency: "Monthly",
    metrics: ["population", "households", "births", "deaths", "migration"],
    descEn: "Department of Provincial Administration. Official registered population by province, district, subdistrict, with age/gender breakdowns. Most current 'static' population data in Thailand.",
    descTh: "กรมการปกครอง ข้อมูลทะเบียนราษฎร์รายจังหวัด อำเภอ ตำบล แยกอายุ/เพศ ข้อมูลประชากร 'คงที่' ที่อัปเดตบ่อยที่สุด",
  },
  {
    id: "nso",
    name: "NSO Statistical Hub",
    nameEn: "stathub.nso.go.th — National Statistics (SDMX API)",
    nameTh: "stathub.nso.go.th — สถิติแห่งชาติ (SDMX API)",
    type: "api",
    url: "https://stathub.nso.go.th",
    apiEndpoint: "https://stathub.nso.go.th/sdmx/",
    coverage: "National — census, surveys, projections at all admin levels",
    frequency: "Annual (census cycles) + quarterly surveys",
    metrics: ["income", "employment", "education", "health", "housing", "poverty"],
    descEn: "NSO's machine-readable statistical hub using SDMX global standard. Census data (latest 2020 + updates), subnational projections, household surveys, labor force data. Covers every administrative unit.",
    descTh: "ศูนย์สถิติ NSO ใช้มาตรฐาน SDMX อ่านด้วยเครื่องได้ ข้อมูลสำมะโน ประมาณการรายจังหวัด สำรวจครัวเรือน แรงงาน ครอบคลุมทุกหน่วยปกครอง",
  },
  {
    id: "gistda",
    name: "GISTDA Sphere",
    nameEn: "sphere.gistda.or.th — Satellite & Geospatial",
    nameTh: "sphere.gistda.or.th — ดาวเทียมและภูมิสารสนเทศ",
    type: "api",
    url: "https://sphere.gistda.or.th",
    coverage: "National — satellite imagery, admin boundaries, disaster data",
    frequency: "Real-time (disaster), quarterly (land use)",
    metrics: ["greenCoverage", "urbanSprawl", "landUse", "floodRisk", "disasterAlert"],
    descEn: "Geo-Informatics and Space Technology Agency. High-res satellite data, digital twins, admin boundaries, disaster monitoring. Maps API, WMS/WMTS, and disaster info API. Used for green coverage calculation and urban sprawl analysis.",
    descTh: "สำนักงานพัฒนาเทคโนโลยีอวกาศฯ ภาพถ่ายดาวเทียมความละเอียดสูง digital twin ขอบเขตปกครอง เฝ้าระวังภัยพิบัติ Maps API WMS/WMTS ใช้คำนวณพื้นที่สีเขียวและวิเคราะห์การขยายตัวเมือง",
  },
  {
    id: "tmd",
    name: "TMD IoT Weather",
    nameEn: "iot.tmd.go.th — Real-time Weather & Climate",
    nameTh: "iot.tmd.go.th — สภาพอากาศเรียลไทม์",
    type: "api",
    url: "https://iot.tmd.go.th",
    coverage: "Nationwide weather stations",
    frequency: "Real-time (hourly)",
    metrics: ["temperature", "humidity", "rainfall", "windSpeed", "forecast"],
    descEn: "Thai Meteorological Department IoT platform. Real-time temperature, humidity, wind, rainfall from stations nationwide. Historical data and forecasts. Used for climate comfort scoring.",
    descTh: "แพลตฟอร์ม IoT กรมอุตุนิยมวิทยา อุณหภูมิ ความชื้น ลม ฝนเรียลไทม์ ข้อมูลย้อนหลังและพยากรณ์ ใช้คำนวณคะแนนความสบายทางภูมิอากาศ",
  },
  {
    id: "nesdc",
    name: "NESDC Economic Data",
    nameEn: "nesdc.go.th — GPP & Economic Indicators",
    nameTh: "nesdc.go.th — GPP และตัวชี้วัดเศรษฐกิจ",
    type: "download",
    url: "https://www.nesdc.go.th",
    coverage: "Provincial-level economic data",
    frequency: "Annual",
    metrics: ["gppPerCapita", "gdpGrowth", "investmentFlow", "tradeBalance"],
    descEn: "National Economic and Social Development Council. Publishes Gross Provincial Product (GPP) per capita — the primary economic output metric for scoring. Also provides investment flow data and economic growth projections.",
    descTh: "สภาพัฒนาการเศรษฐกิจฯ เผยแพร่ GPP ต่อหัว — ตัวชี้วัดผลผลิตเศรษฐกิจหลักสำหรับการให้คะแนน ข้อมูลการลงทุนและประมาณการเติบโตทางเศรษฐกิจ",
  },
];

/** Get CDP profile URL for a city on citydata.in.th */
export function getCityDataUrl(cityNameEn: string): string {
  return `https://www.citydata.in.th/en/smart-city-thailand/?city=${encodeURIComponent(cityNameEn)}`;
}

/** Get data.go.th search URL for a city's datasets */
export function getOpenDataSearchUrl(provinceName: string): string {
  return `https://data.go.th/dataset?q=${encodeURIComponent(provinceName)}`;
}

/** Get air quality dashboard URL for a station near the city */
export function getAirQualityUrl(): string {
  return "http://air4thai.pcd.go.th/forpublic/index.php";
}
