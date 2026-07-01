import json

with open("cea-submission/content.json", "r", encoding="utf-8") as f:
    content = json.load(f)

# q16 — remove Kimi 9.7/10 sentence (th L134 + en L135)
if "q16" in content:
    content["q16"]["th"] = content["q16"]["th"].replace("ระบบยังได้รับการตรวจสอบอย่างเข้มข้นจากผู้เชี่ยวชาญ AI (Kimi Agent) และได้คะแนน 9.7/10 ในด้านนวัตกรรมและความครอบคลุมของข้อมูล", "").strip()
    content["q16"]["en"] = content["q16"]["en"].replace("The system also underwent a rigorous hostile audit by an AI specialist (Kimi Agent), scoring 9.7/10 for innovation and data comprehensiveness.", "").strip()

# verifiedFacts — remove "Kimi internal review scores" row (L334-336)
if "verifiedFacts" in content:
    content["verifiedFacts"] = [fact for fact in content["verifiedFacts"] if "Kimi" not in fact.get("metric", "")]

# L182 — fix Thai doubled word "ผู้ชม ผู้เข้าชม" in proposal §4 bodyTh
if "proposal" in content and "section4" in content["proposal"]:
    content["proposal"]["section4"]["bodyTh"] = content["proposal"]["section4"]["bodyTh"].replace("ผู้ชม ผู้เข้าชม", "ผู้ชม")

# L13 — align UNESCO list prose w/ table (finding 33)
# It seems q2 or similar might have the UNESCO list. Let's find where UNESCO list is.
for key in content:
    if isinstance(content[key], dict):
        for subkey in content[key]:
            if isinstance(content[key][subkey], str) and "Phetchaburi" in content[key][subkey]:
                content[key][subkey] = content[key][subkey].replace("Phetchaburi", "Suphan Buri")

with open("cea-submission/content.json", "w", encoding="utf-8") as f:
    json.dump(content, f, ensure_ascii=False, indent=2)

