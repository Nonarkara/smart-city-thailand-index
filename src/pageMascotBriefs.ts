import type { Locale } from "./types";
import type { Route } from "./routing";

export type PageMascotKind = Exclude<Route["kind"], "city" | "creative-economy">;
export type MascotPose = "urban" | "heritage" | "temple" | "cafe" | "nature" | "welcome" | "explain";
export interface PageMascotBrief {
  copy: Record<Locale, string>;
  action: { path: string; label: Record<Locale, string> };
  pose: MascotPose;
}

/** One reading task and one next step per page; never personal testimony or proof of operation. */
export const PAGE_MASCOT_BRIEFS: Record<PageMascotKind, PageMascotBrief> = {
  "home": {
    "copy": {
      "en": "Start with a city, then look behind its numbers. Here you can explore research profiles, public sources and gaps in the evidence.",
      "th": "เริ่มจากเมืองที่สนใจ แล้วค่อยดูที่มาของตัวเลข ที่นี่มีโปรไฟล์วิจัย แหล่งข้อมูลสาธารณะ และช่องว่างของหลักฐานให้ค้นต่อ",
      "zh": "先选一座城市，再看看数字从哪里来。这里汇集研究概况、公开来源与证据空白，方便继续查证。"
    },
    "action": {
      "path": "/rankings",
      "label": {
        "en": "Explore city records",
        "th": "เปิดดูแฟ้มเมือง",
        "zh": "浏览城市档案"
      }
    },
    "pose": "welcome"
  },
  "rankings": {
    "copy": {
      "en": "Change the priorities and watch the comparison change. Scores help you form questions; open a dossier to check sources and assessment status.",
      "th": "ลองเปลี่ยนสิ่งที่ให้ความสำคัญ แล้วดูผลเทียบเมือง ใช้คะแนนตั้งคำถาม ก่อนเปิดแฟ้มตรวจแหล่งข้อมูลและสถานะการประเมิน",
      "zh": "换一组关注重点，看看城市比较如何变化。分数用来提出问题；打开档案，再核查来源与评估状态。"
    },
    "action": {
      "path": "/compare",
      "label": {
        "en": "Compare a shortlist",
        "th": "เทียบเมืองที่เลือก",
        "zh": "比较候选城市"
      }
    },
    "pose": "urban"
  },
  "methodology": {
    "copy": {
      "en": "Here is how the research scores are built: indicators, weights and limits. Read this before treating a small score difference as a meaningful difference between places.",
      "th": "หน้านี้อธิบายที่มาของคะแนนวิจัย ทั้งตัวชี้วัด น้ำหนัก และข้อจำกัด อ่านก่อนสรุปว่าคะแนนที่ต่างกันเล็กน้อยหมายถึงเมืองที่ต่างกันมาก",
      "zh": "这里说明研究评分所用的指标、权重和限制。别急着把分数的微小差距，当成城市之间的实质差距。"
    },
    "action": {
      "path": "/references",
      "label": {
        "en": "Follow the sources",
        "th": "ตามไปดูแหล่งข้อมูล",
        "zh": "追溯数据来源"
      }
    },
    "pose": "explain"
  },
  "story": {
    "copy": {
      "en": "A smart city should make everyday life work better. This page explains the questions behind the platform; the method helps distinguish that ambition from measured results.",
      "th": "เมืองอัจฉริยะควรช่วยให้ชีวิตประจำวันดีขึ้น หน้านี้เล่าคำถามเบื้องหลังแพลตฟอร์ม แล้วค่อยใช้วิธีวิจัยแยกเป้าหมายออกจากผลที่วัดได้",
      "zh": "智慧城市应让日常生活更好。这里讲平台背后的问题，再用研究方法区分愿景与已经测得的结果。"
    },
    "action": {
      "path": "/methodology",
      "label": {
        "en": "See how it is measured",
        "th": "ดูวิธีประเมิน",
        "zh": "了解评估方法"
      }
    },
    "pose": "heritage"
  },
  "why": {
    "copy": {
      "en": "Useful comparisons reveal what to investigate next. Read why the platform compares places, keeping research estimates separate from certification or a verdict on a community.",
      "th": "การเทียบเมืองมีประโยชน์เมื่อช่วยให้รู้ว่าควรศึกษาอะไรต่อ ลองดูเหตุผลของการเปรียบเทียบ โดยแยกค่าประมาณวิจัยออกจากการรับรองหรือการตัดสินชุมชน",
      "zh": "有用的比较，会告诉你下一步该查什么。这里解释为什么比较城市，也提醒你把研究估算与认证、对社区的评判分开。"
    },
    "action": {
      "path": "/methodology",
      "label": {
        "en": "Read the method",
        "th": "อ่านวิธีวิจัย",
        "zh": "阅读研究方法"
      }
    },
    "pose": "explain"
  },
  "showcase": {
    "copy": {
      "en": "Use Nakhon Si Thammarat as a case to examine, not a template to copy blindly. Open the city record to check dates, scope and evidence of delivery.",
      "th": "ใช้นครศรีธรรมราชเป็นกรณีศึกษา ไม่ใช่สูตรที่ต้องทำตามทุกอย่าง ลองเปิดแฟ้มเมืองเพื่อตรวจวันที่ ขอบเขต และหลักฐานการดำเนินงาน",
      "zh": "把洛坤当作值得研究的案例，而非照搬的模板。打开城市档案，核查时间、范围与实施证据。"
    },
    "action": {
      "path": "/city/nakhon-si-thammarat",
      "label": {
        "en": "Open the city dossier",
        "th": "เปิดแฟ้มเมือง",
        "zh": "打开城市档案"
      }
    },
    "pose": "heritage"
  },
  "partners": {
    "copy": {
      "en": "Cities need people and institutions that can work together. Explore cooperation routes and responsibilities; a mention here does not establish an endorsement or a funded project.",
      "th": "เมืองต้องอาศัยคนและหน่วยงานที่ทำงานร่วมกันได้ ลองดูช่องทางความร่วมมือและบทบาท การมีชื่อที่นี่ไม่ได้ยืนยันการรับรองหรือเงินทุนโครงการ",
      "zh": "城市需要能够协作的人与机构。这里介绍合作渠道和职责；页面提及不等于背书，也不代表项目已获资金。"
    },
    "action": {
      "path": "/program",
      "label": {
        "en": "Explore the program context",
        "th": "ดูบริบทโครงการ",
        "zh": "了解计划背景"
      }
    },
    "pose": "welcome"
  },
  "map": {
    "copy": {
      "en": "Use the map to find a city record and see its broader setting. Legacy reference points are not verified project boundaries or a guide to exact site selection.",
      "th": "ใช้แผนที่หาแฟ้มเมืองและมองบริบทโดยรอบ จุดอ้างอิงเดิมยังไม่ใช่ขอบเขตโครงการที่ยืนยันแล้ว และไม่ควรใช้เลือกทำเลเฉพาะจุด",
      "zh": "用地图找到城市档案，了解周边背景。既有参考点并非已核实的项目边界，也不能用来确定具体选址。"
    },
    "action": {
      "path": "/rankings",
      "label": {
        "en": "Browse city records",
        "th": "ดูรายชื่อแฟ้มเมือง",
        "zh": "浏览城市档案"
      }
    },
    "pose": "nature"
  },
  "asus": {
    "copy": {
      "en": "Look across ASEAN at urban projects and the process behind them. Compare problems and methods first, then check what each source actually establishes.",
      "th": "ชวนดูโครงการเมืองในอาเซียนและกระบวนการเบื้องหลัง เริ่มเทียบปัญหากับวิธีทำงาน แล้วตรวจว่าแต่ละแหล่งอ้างอิงยืนยันอะไรได้บ้าง",
      "zh": "放眼东盟的城市项目及其过程。先比较问题与方法，再核查各来源究竟能证明什么。"
    },
    "action": {
      "path": "/methodology",
      "label": {
        "en": "Compare the research approach",
        "th": "เทียบแนวทางวิจัย",
        "zh": "对照研究方法"
      }
    },
    "pose": "explain"
  },
  "audit": {
    "copy": {
      "en": "Trace a claim back to its evidence. Look for the original source, the period it describes and what remains uncertain before reusing a figure.",
      "th": "ลองไล่จากข้อกล่าวอ้างกลับไปหาหลักฐาน ก่อนใช้ตัวเลขต่อ ให้ดูแหล่งต้นทาง ช่วงเวลาของข้อมูล และส่วนที่ยังไม่แน่ชัด",
      "zh": "顺着一项说法追溯证据。复用数字前，先找原始来源、统计时期和仍不确定的部分。"
    },
    "action": {
      "path": "/references",
      "label": {
        "en": "Inspect the source register",
        "th": "ตรวจทะเบียนแหล่งข้อมูล",
        "zh": "查看来源登记"
      }
    },
    "pose": "explain"
  },
  "references": {
    "copy": {
      "en": "The source matters as much as the number. Inspect publications, datasets and scope limits here, then check which indicators are available in the baseline.",
      "th": "ที่มาสำคัญพอ ๆ กับตัวเลข ตรวจงานวิจัย ชุดข้อมูล และข้อจำกัดของขอบเขต ก่อนดูว่าฐานข้อมูลมีตัวชี้วัดใดให้ใช้บ้าง",
      "zh": "来源和数字同样重要。在这里查阅研究、数据集与范围限制，再看看基线中有哪些可用指标。"
    },
    "action": {
      "path": "/baseline",
      "label": {
        "en": "Inspect baseline indicators",
        "th": "ดูตัวชี้วัดตั้งต้น",
        "zh": "查看基线指标"
      }
    },
    "pose": "cafe"
  },
  "program": {
    "copy": {
      "en": "A program is a route from an urban problem to a workable project. Read the stages, responsibilities and constraints, then examine how they apply to a city.",
      "th": "โครงการคือเส้นทางจากปัญหาเมืองไปสู่สิ่งที่ทำได้จริง ลองดูขั้นตอน บทบาท และข้อจำกัด แล้วตรวจว่าเหมาะกับเมืองที่สนใจอย่างไร",
      "zh": "计划应把城市问题带向可实施的项目。先了解阶段、职责与约束，再检验它们如何适用于具体城市。"
    },
    "action": {
      "path": "/rankings",
      "label": {
        "en": "Start from a city record",
        "th": "เริ่มจากแฟ้มเมือง",
        "zh": "从城市档案开始"
      }
    },
    "pose": "explain"
  },
  "knowledge": {
    "copy": {
      "en": "Start with the question you would ask a city team. Find explanations of terms, institutions and common misunderstandings, then follow the references when a detail matters.",
      "th": "เริ่มจากคำถามที่อยากถามทีมเมือง ลองหาคำอธิบายศัพท์ หน่วยงาน และความเข้าใจผิดที่พบบ่อย ถ้าเรื่องใดสำคัญ ค่อยตามไปอ่านแหล่งอ้างอิง",
      "zh": "从你想问城市团队的问题开始。查阅术语、机构与常见误解；遇到重要细节，再顺着引用查证。"
    },
    "action": {
      "path": "/references",
      "label": {
        "en": "Keep the sources nearby",
        "th": "เปิดแหล่งข้อมูลประกอบ",
        "zh": "对照原始来源"
      }
    },
    "pose": "cafe"
  },
  "discover": {
    "copy": {
      "en": "Choose what matters to you and watch the shortlist change. A preference match uses research scores: a starting point for comparison, not a promise about life in a city.",
      "th": "ลองเลือกสิ่งที่สำคัญกับชีวิต แล้วดูรายชื่อเมืองเปลี่ยนตาม ผลจับคู่ใช้คะแนนวิจัย จึงเป็นจุดเริ่มต้นสำหรับเทียบเมือง ไม่ใช่คำรับรองชีวิตในพื้นที่",
      "zh": "选出你重视的事情，看看候选城市怎样变化。匹配采用研究评分，是比较的起点，不是对当地生活的保证。"
    },
    "action": {
      "path": "/compare",
      "label": {
        "en": "Compare your candidates",
        "th": "เทียบเมืองที่สนใจ",
        "zh": "比较你的候选城市"
      }
    },
    "pose": "urban"
  },
  "invest": {
    "copy": {
      "en": "Use this page to frame questions for a possible city project. Read financing ideas alongside their conditions, then verify local costs, capacity and eligibility with responsible sources.",
      "th": "ใช้หน้านี้ตั้งคำถามสำหรับโครงการเมืองที่กำลังพิจารณา อ่านแนวทางการเงินคู่กับเงื่อนไข แล้วตรวจต้นทุน ความสามารถรองรับ และคุณสมบัติกับแหล่งที่รับผิดชอบ",
      "zh": "用这一页梳理城市项目需要回答的问题。融资思路要与条件一起读，再向负责机构核实当地成本、承载能力与资格。"
    },
    "action": {
      "path": "/references",
      "label": {
        "en": "Check the evidence first",
        "th": "ตรวจหลักฐานก่อน",
        "zh": "先核查证据"
      }
    },
    "pose": "urban"
  },
  "compare": {
    "copy": {
      "en": "Put selected cities side by side and look for differences relevant to your question. Keep the same measures and check source periods and geographic scope before drawing a conclusion.",
      "th": "วางเมืองที่เลือกไว้ข้างกัน แล้วดูความต่างที่ตอบคำถามของคุณ ใช้มาตรวัดเดียวกัน และตรวจช่วงเวลากับขอบเขตพื้นที่ก่อนสรุป",
      "zh": "把选中的城市并排放好，找出与你的问题有关的差异。使用相同尺度，并核对统计时期与地理范围后再下结论。"
    },
    "action": {
      "path": "/rankings",
      "label": {
        "en": "Choose more cities",
        "th": "เลือกเมืองเพิ่มเติม",
        "zh": "选择更多城市"
      }
    },
    "pose": "explain"
  },
  "bingo": {
    "copy": {
      "en": "Match the called dimension to a term on your board. The game helps you learn the framework; marking a square does not prove that a city delivers that service.",
      "th": "จับคู่มิติที่เรียกกับคำบนกระดาน เกมนี้ช่วยให้เข้าใจกรอบคิด แต่การเปิดช่องไม่ได้พิสูจน์ว่าเมืองมีบริการนั้นจริง",
      "zh": "将叫出的维度与卡片上的术语配对。游戏帮助理解框架，翻开一格并不证明某座城市已提供该项服务。"
    },
    "action": {
      "path": "/knowledge",
      "label": {
        "en": "Look up a term",
        "th": "ค้นความหมายของคำ",
        "zh": "查阅术语解释"
      }
    },
    "pose": "welcome"
  },
  "baseline": {
    "copy": {
      "en": "Choose an indicator or threshold and see which records can be compared. Keep source values, derived scores and missing data distinct: a provincial measure is not automatically a city measurement.",
      "th": "ลองเลือกตัวชี้วัดหรือเกณฑ์เพื่อดูว่าเทียบแฟ้มใดได้บ้าง แยกค่าต้นทาง คะแนนที่คำนวณ และข้อมูลที่ขาด ตัวเลขจังหวัดไม่ได้เป็นค่าระดับเมืองโดยอัตโนมัติ",
      "zh": "选择指标或门槛，看看哪些记录可以比较。区分来源原值、推导分数与缺失数据；省级数据不能自动当作城市测量值。"
    },
    "action": {
      "path": "/references",
      "label": {
        "en": "Read source scopes",
        "th": "อ่านขอบเขตแหล่งข้อมูล",
        "zh": "核对来源范围"
      }
    },
    "pose": "explain"
  },
  "canvas": {
    "copy": {
      "en": "Bring evidence and open questions into a city discussion. The blank areas are for field notes; check the dossier before using any research estimate in a project decision.",
      "th": "นำหลักฐานและคำถามที่ยังเปิดอยู่ไปคุยกับทีมเมือง พื้นที่ว่างมีไว้จดจากการลงพื้นที่ ก่อนใช้ค่าประมาณตัดสินใจโครงการ ให้ตรวจแฟ้มเมืองประกอบ",
      "zh": "把证据和待解问题带进城市讨论。空白处留给实地笔记；将研究估算用于项目判断前，请核查档案。"
    },
    "action": {
      "path": "/rankings",
      "label": {
        "en": "Return to city records",
        "th": "กลับไปดูแฟ้มเมือง",
        "zh": "返回城市档案"
      }
    },
    "pose": "cafe"
  },
  "about": {
    "copy": {
      "en": "Meet the purpose, people and limits behind the platform. Nong Plub is our mascot, helping readers find a way into city evidence; the method explains how to read what follows.",
      "th": "ชวนรู้จักจุดประสงค์ ผู้จัดทำ และข้อจำกัดของแพลตฟอร์ม น้องพลับเป็นมาสคอตที่ช่วยพาเข้าไปอ่านหลักฐานเมือง ส่วนวิธีวิจัยอธิบายว่าควรตีความข้อมูลอย่างไร",
      "zh": "认识平台的目的、参与者与限制。小普是我们的吉祥物，带读者走近城市证据；研究方法则说明该如何理解这些资料。"
    },
    "action": {
      "path": "/methodology",
      "label": {
        "en": "Read the method",
        "th": "อ่านวิธีวิจัย",
        "zh": "阅读研究方法"
      }
    },
    "pose": "welcome"
  }
};
