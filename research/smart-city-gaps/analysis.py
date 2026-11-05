#!/usr/bin/env python3
"""Reproducible analysis for the smart-city gaps synthesis paper.

Inputs  (frozen 5 Nov 2026, in ./data):
  scity-snapshot-2026-11-05.json   118 SCITI city records + 21 depa-endorsed flagship records
  province-baseline-2026-11-05.json  20 open province indicators + GISTDA flood score (30 provinces)
  companion-evidence.json          counts reported in the four companion preprints
Outputs (./out): results.json, flagship-coding.csv, targeting.csv
Run:  python3 analysis.py
"""
import csv, json, math, re, collections
from pathlib import Path
import numpy as np
from scipy import stats

HERE = Path(__file__).parent
OUT = HERE / "out"; OUT.mkdir(exist_ok=True)
SEED = 20261105
rng = np.random.default_rng(SEED)

snap = json.load(open(HERE / "data/scity-snapshot-2026-11-05.json"))
base = json.load(open(HERE / "data/province-baseline-2026-11-05.json"))
comp = json.load(open(HERE / "data/companion-evidence.json"))
cities, depa = snap["cities"], snap["depa"]
R = {}  # everything that ends up in the paper


def wilson(k, n, z=1.959964):
    if n == 0:
        return (float("nan"),) * 2
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return (max(0.0, c - h), min(1.0, c + h))


def prop(k, n):
    lo, hi = wilson(k, n)
    return {"k": k, "n": n, "p": k / n, "lo": lo, "hi": hi}


# ---------------------------------------------------------------- 1. programme funnel
C = collections.Counter
R["cities"] = len(cities)
R["provinces"] = len({c["province"] for c in cities})
R["status"] = dict(C(c["status"] for c in cities))
R["reality"] = dict(C(c["reality"] for c in cities))
R["status_x_reality"] = {f"{s}|{r}": n for (s, r), n in C((c["status"], c["reality"]) for c in cities).items()}
cert = [c for c in cities if c["status"] == "certified"]
R["certified"] = len(cert)
R["certified_operational"] = prop(sum(c["reality"] == "operational" for c in cert), len(cert))
R["certified_planned"] = prop(sum(c["reality"] == "planned" for c in cert), len(cert))
R["proposals_total"] = 227            # depa registry, January 2026 (claimRegistry.ts)
R["proposals_to_certified"] = prop(len(cert), 227)
R["target_2024_27"] = 105             # depa target for the 2024-2027 plan period
R["certified_vs_target"] = prop(len(cert), 105)
R["metrics_cities"] = prop(sum(bool(c["m"]) for c in cities), len(cities))
R["metrics_certified"] = prop(sum(bool(c["m"]) for c in cert), len(cert))
R["conf"] = dict(C(c["conf"] for c in cities))
R["endorsed_records"] = len(depa)
R["endorsed_batches"] = dict(C(v.get("batch") for v in depa.values()))
R["certified_with_endorsed_record"] = prop(sum(c["id"] in depa for c in cert), len(cert))

# ---------------------------------------------------------------- 2. flagship coding
# Hand-coded by one coder (the second author) from the project text in depa's endorsed records, in the
# order the records list them. Two fields per project:
#   E     1 if the stated domain is environmental monitoring, a natural hazard, or public safety/emergency
#   stage the highest link of the monitoring-to-push chain (Fig. 1) the TEXT states:
#         none | sense (monitor, telemetry, sensors, CCTV) | decide (operations centre, data hub, digital
#         twin) | push (early warning, alert, dispatch) | ambiguous (names a programme, not a function)
# The text is an endorsed vision, not evidence of delivery. Service platforms (e-service, MaaS, tourism
# platforms) are coded none: they serve transactions, not the chain.
CODE = {
 "phuket":     [(0,"decide"),(0,"none"),(1,"sense"),(0,"decide"),(0,"none"),(0,"decide")],
 "khon-kaen":  [(0,"none"),(1,"push"),(0,"none"),(0,"sense"),(0,"none")],
 "cmu-smart-city": [(0,"none"),(0,"sense"),(0,"none"),(0,"none"),(0,"none")],
 "yala":       [(1,"none"),(1,"sense"),(0,"none"),(0,"none")],
 "makkasan":   [(0,"none")]*5,
 "phra-ram-4": [(0,"none")]*4,
 "saensuk":    [(0,"none"),(1,"sense"),(1,"sense"),(0,"sense")],
 "wangchan-valley": [(0,"sense"),(0,"none"),(0,"decide"),(0,"none")],
 "sritrang":   [(0,"none"),(1,"sense"),(0,"none")],
 "rayong":     [(0,"none"),(1,"sense"),(0,"none")],
 "chiang-rai": [(0,"none"),(0,"none"),(1,"sense")],
 "nan":        [(1,"sense"),(0,"none"),(0,"none")],
 "korat":      [(0,"none"),(1,"sense"),(0,"none")],
 "ubon":       [(0,"none"),(1,"sense"),(0,"none")],
 "krabi":      [(1,"sense"),(0,"none"),(0,"none")],
 "phangnga":   [(1,"sense"),(0,"decide"),(1,"ambiguous")],
 "satun":      [(0,"none"),(0,"none"),(1,"sense")],
 "samui":      [(1,"none"),(0,"none"),(1,"sense")],
 "hat-yai":    [(1,"push"),(0,"none"),(0,"none")],
 "pattani":    [(0,"none")]*3,
 "narathiwat": [(1,"sense"),(0,"none"),(0,"none")],
}
assert set(CODE) == set(depa), set(depa) ^ set(CODE)
rows = []
for cid, rec in depa.items():
    ps = rec.get("keyProjects", [])
    assert len(ps) == len(CODE[cid]), (cid, len(ps), len(CODE[cid]))
    for p, (e, st) in zip(ps, CODE[cid]):
        rows.append({"city": cid, "batch": rec.get("batch"), "project": p, "env_safety_domain": e, "stage": st})
with open(OUT / "flagship-coding.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)

N = len(rows)
R["flagship_projects"] = N
R["flagship_stage"] = dict(C(r["stage"] for r in rows))
hz = [r for r in rows if r["env_safety_domain"]]
R["hazard_projects"] = prop(len(hz), N)
R["hazard_stage"] = dict(C(r["stage"] for r in hz))
for s_ in ("push", "decide", "sense", "none", "ambiguous"):
    R[f"hazard_stage_{s_}"] = prop(sum(r["stage"] == s_ for r in hz), len(hz))
R["hazard_push_strict"] = prop(sum(r["stage"] == "push" for r in hz), len(hz))
R["hazard_push_lenient"] = prop(sum(r["stage"] in ("push", "ambiguous") for r in hz), len(hz))
R["hazard_reaches_decide_or_push"] = prop(sum(r["stage"] in ("push", "decide") for r in hz), len(hz))
R["hazard_sense_only"] = prop(sum(r["stage"] == "sense" for r in hz), len(hz))
R["cities_with_hazard_push"] = sorted({r["city"] for r in hz if r["stage"] == "push"})
R["endorsed_cities_with_any_push"] = prop(len({r["city"] for r in rows if r["stage"] == "push"}), len(depa))
R["endorsed_cities_with_hazard_push"] = prop(len({r["city"] for r in hz if r["stage"] == "push"}), len(depa))
R["flagship_decide_projects"] = sum(r["stage"] == "decide" for r in rows)
R["flagship_decide_in_hazard_domain"] = sum(r["stage"] == "decide" for r in hz)
# which cities name a monitoring project at all?
R["endorsed_cities_with_sense"] = prop(len({r["city"] for r in hz if r["stage"] in ("sense", "decide", "push")}), len(depa))
# partnerships: coordination is named only where the record names a partner
named = [v for v in depa.values() if v.get("partnerships")]
R["endorsed_with_named_partners"] = prop(len(named), len(depa))
batch1 = [v for v in depa.values() if v.get("batch") == 1]
R["batch1_with_named_partners"] = prop(sum(bool(v.get("partnerships")) for v in batch1), len(batch1))
R["batch2_with_named_partners"] = prop(sum(bool(v.get("partnerships")) for v in depa.values() if v.get("batch") == 2),
                                       sum(1 for v in depa.values() if v.get("batch") == 2))
R["partners_public_agencies_named"] = None  # intentionally not coded: partner type is not stated consistently in the records

# ---------------------------------------------------------------- 3. province-level analyses
norm = lambda s: re.sub(r"[^a-z]", "", s.lower().replace("chon buri", "chonburi"))
ALIAS = {"nakhonsithammarat": "nakhonsithammarat", "phangnga": "phangnga", "phranakhonsiayutthaya": "ayutthaya",
         "buriram": "buriram", "burirum": "buriram", "lopburi": "lopburi"}
key = lambda s: ALIAS.get(norm(s), norm(s))

ind = {i["id"]: i for i in base["indicators"]}
prov_all = sorted(ind["rtddi-road-deaths"]["provinces"])  # 77 names, English
designated = {key(c["province"]) for c in cert}
anyrec = {key(c["province"]) for c in cities}
R["provinces_with_certified_city"] = len(designated)
R["provinces_with_any_record"] = len(anyrec)
unmatched = sorted(p for p in designated | anyrec if p not in {key(x) for x in prov_all})
R["unmatched_province_keys"] = unmatched


def series(iid):
    return {key(k): v for k, v in ind[iid]["provinces"].items()}


def cliff(a, b):
    a, b = np.asarray(a), np.asarray(b)
    return float(np.mean(np.sign(a[:, None] - b[None, :])))


def compare(name, x, higher_is, note=""):
    """x: {province_key: value}. Compare provinces with a certified city vs without."""
    d = [v for k, v in x.items() if k in designated]
    u = [v for k, v in x.items() if k not in designated]
    out = {"name": name, "n_designated": len(d), "n_other": len(u), "note": note}
    if len(d) < 3 or len(u) < 3:
        out["too_few"] = True; return out
    U, pval = stats.mannwhitneyu(d, u, alternative="two-sided")
    delta = cliff(d, u)
    bs = [cliff(rng.choice(d, len(d)), rng.choice(u, len(u))) for _ in range(5000)]
    md = [np.median(rng.choice(d, len(d))) - np.median(rng.choice(u, len(u))) for _ in range(5000)]
    out.update({"median_designated": float(np.median(d)), "median_other": float(np.median(u)),
                "median_diff": float(np.median(d) - np.median(u)),
                "median_diff_ci": [float(np.percentile(md, 2.5)), float(np.percentile(md, 97.5))],
                "cliff_delta": delta, "cliff_ci": [float(np.percentile(bs, 2.5)), float(np.percentile(bs, 97.5))],
                "mannwhitney_p": float(pval), "higher_is": higher_is})
    return out


pm = series("pcd-pm25-annual")
flood = {key(k): v["score"] for k, v in base["flood"].items()}
pop = series("nso-province-population"); ods = series("data-go-th-open-datasets")
tab = series("data-go-th-open-data-tabular")
ods_pc = {k: ods[k] / pop[k] * 100 for k in ods if k in pop and pop[k] > 0}   # datasets per 100 000 (pop in thousands)
ods_pc = {k: v / 1.0 * 1.0 for k, v in ods_pc.items()}
R["flood_provinces"] = len(flood); R["pm_provinces"] = len(pm)
R["flood_provinces_designated"] = sum(k in designated for k in flood)
R["flood_testable"] = False  # 25 of the 30 scored provinces host a certified city: the score was built for SCITI cities, so no comparison group exists
R["pm_provinces_designated"] = sum(k in designated for k in pm)
R["provinces_without_pm_station"] = sorted(k for k in {key(x) for x in prov_all} if k not in pm)
R["certified_provinces_without_pm_station"] = sorted(k for k in designated if k not in pm)
tests = [
    compare("PM2.5 2024 annual mean (ug/m3)", pm, "worse", "65 provinces with a PCD station"),
    compare("Open datasets published by province (count)", ods, "more"),
    compare("Open datasets per 100 000 residents", ods_pc, "more"),
    compare("Share of open data offered as a table (%)", tab, "better"),
]
# Holm adjustment across the four tests
ps = [(i, t["mannwhitney_p"]) for i, t in enumerate(tests) if "mannwhitney_p" in t]
ps.sort(key=lambda x: x[1]); m = len(ps); run = 0
for rank, (i, p) in enumerate(ps):
    run = max(run, min(1.0, (m - rank) * p)); tests[i]["holm_p"] = run
R["targeting_tests"] = tests
with open(OUT / "targeting.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["province", "certified_city", "pm25_2024", "flood_score", "open_datasets", "pop_thousand"])
    for p in prov_all:
        k = key(p); w.writerow([p, int(k in designated), pm.get(k, ""), flood.get(k, ""), ods.get(k, ""), pop.get(k, "")])

# confound check for PM2.5: urbanity proxy = population; rank correlation with designation and with PM2.5
ks = [k for k in pm if k in pop]
R["pm_pop_spearman"] = float(stats.spearmanr([pm[k] for k in ks], [pop[k] for k in ks])[0])
R["designated_pop_median"] = float(np.median([pop[k] for k in pop if k in designated]))
R["other_pop_median"] = float(np.median([pop[k] for k in pop if k not in designated]))
# designation ~ log population (what does certification track?)
pdv = [pop[k] for k in pop if k in designated]; pov = [pop[k] for k in pop if k not in designated]
R["pop_cliff_designated_vs_other"] = cliff(pdv, pov)
R["pop_mannwhitney_p"] = float(stats.mannwhitneyu(pdv, pov)[1])
# the 8 provinces with the highest PM2.5: designated?
top = sorted(pm, key=pm.get, reverse=True)[:10]
R["pm_top10"] = [{"province": k, "pm25": pm[k], "certified_city": k in designated} for k in top]
# the 10 lowest flood scores: designated?
worst = sorted(flood, key=flood.get)[:10]
R["flood_worst10"] = [{"province": k, "score": flood[k], "certified_city": k in designated} for k in worst]

# vintage of the open province indicators (H3: how current is what a programme could steer by?)
yrs = [(i["id"], i["year"], i["provinceCount"]) for i in base["indicators"]]
R["indicators_n"] = len(yrs)
R["indicator_years"] = dict(C(y for _, y, _ in yrs))
R["indicators_complete77"] = sum(n == 77 for *_, n in yrs)
R["indicators_pre2020"] = sum(y < 2020 for _, y, _ in yrs)

# ---------------------------------------------------------------- 4. companion evidence (exact counts as reported)
R["companion"] = {k: {**prop(v["k"], v["n"]), "label": v["label"], "paper": v["paper"], "gap": v["gap"]}
                  for k, v in comp["proportions"].items()}

json.dump(R, open(OUT / "results.json", "w"), indent=1, ensure_ascii=False, default=str)
print("ok", len(rows), "projects;", len(tests), "tests")
