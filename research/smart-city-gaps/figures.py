#!/usr/bin/env python3
"""Figures for the paper. Reads out/results.json and out/*.csv, writes figures/*.svg.
Text stays live (svg.fonttype=none) so the page's Source Sans 3 renders it."""
import csv, json
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = Path(__file__).parent
R = json.load(open(HERE / "out/results.json"))
FIG = HERE / "figures"; FIG.mkdir(exist_ok=True)

INK, BLUE, TEAL, AMBER, GREY, LIGHT = "#1b2733", "#12354e", "#007190", "#d98218", "#7d8891", "#dfe4e8"
COL, FULL = 3.41, 7.09   # inches: one column, full text width (A4, 15 mm margins, 7 mm gutter)
plt.rcParams.update({
    "svg.fonttype": "none", "font.family": ["Source Sans 3", "Helvetica Neue", "Arial", "sans-serif"],
    "font.size": 7.4, "axes.labelsize": 7.4, "xtick.labelsize": 6.6, "ytick.labelsize": 7.4,
    "axes.edgecolor": GREY, "axes.linewidth": 0.5, "xtick.color": INK, "ytick.color": INK, "text.color": INK,
    "axes.labelcolor": INK, "xtick.major.width": 0.5, "ytick.major.width": 0.5,
    "xtick.major.size": 2.5, "ytick.major.size": 0, "figure.facecolor": "none", "axes.facecolor": "none",
    "savefig.transparent": True,
})


def clean(ax, left=True):
    for s in ("top", "right"): ax.spines[s].set_visible(False)
    if not left: ax.spines["left"].set_visible(False)


# ---------------------------------------------------------------- Fig 2: attrition cascade
def fig_cascade():
    cert, rec = R["certified"], R["endorsed_records"]
    sense = R["endorsed_cities_with_sense"]["k"]
    push = R["endorsed_cities_with_hazard_push"]["k"]
    steps = [("Proposals on depa's registry", R["proposals_total"]),
             ("Certified smart cities", cert),
             ("…with a published flagship record", rec),
             ("…with a sensing (or higher) environment\nor safety project", sense),
             ("…with an alert or dispatch\nproject", push)]
    fig, ax = plt.subplots(figsize=(COL, 2.05))
    y = np.arange(len(steps))[::-1]
    mx = steps[0][1]
    for yi, (lab, v) in zip(y, steps):
        ax.barh(yi, v, height=0.56, color=BLUE if yi > 0 else GREY, zorder=2)
        ax.text(v + mx * 0.012, yi, f"{v}", va="center", ha="left", fontsize=7.4, fontweight="bold", color=INK)
    prev = None
    for yi, (lab, v) in zip(y, steps):
        if prev:
            ax.text(mx * 1.12, yi, f"{v / prev * 100:.0f}% of line above", va="center", ha="right", fontsize=6.4, color=GREY)
        prev = v
    ax.set_yticks(y); ax.set_yticklabels([s[0] for s in steps]); ax.set_xlim(0, mx * 1.12); ax.set_xticks([])
    ax.set_ylim(-0.6, len(steps) - 0.4); clean(ax, left=False); ax.spines["bottom"].set_visible(False)
    ax.tick_params(axis="y", length=0)
    fig.subplots_adjust(left=0.52, right=0.99, top=0.99, bottom=0.01)
    fig.savefig(FIG / "fig-cascade.svg"); plt.close(fig)


# ---------------------------------------------------------------- Fig 3: chain stage by domain
def fig_stage():
    rows = list(csv.DictReader(open(HERE / "out/flagship-coding.csv")))
    order = ["none", "sense", "decide", "ambiguous", "push"]
    lab = {"none": "no chain link stated", "sense": "sense", "decide": "decide (hub, twin)", "ambiguous": "programme only", "push": "push (alert, dispatch)"}
    col = {"none": LIGHT, "sense": TEAL, "decide": BLUE, "ambiguous": "#f0c98f", "push": AMBER}
    groups = [("Environment, hazard,\nsafety projects", [r for r in rows if r["env_safety_domain"] == "1"]),
              ("All other projects", [r for r in rows if r["env_safety_domain"] == "0"])]
    fig, ax = plt.subplots(figsize=(COL, 1.55))
    for gi, (g, rs) in enumerate(groups):
        left = 0; n = len(rs); yy = 1 - gi
        for s in order:
            k = sum(r["stage"] == s for r in rs)
            if not k: continue
            w = k / n * 100
            ax.barh(yy, w, left=left, height=0.5, color=col[s], edgecolor="white", linewidth=0.6, zorder=2)
            if w >= 7:
                ax.text(left + w / 2, yy, str(k), ha="center", va="center", fontsize=7, color="white" if s in ("sense", "decide", "push") else INK, fontweight="bold")
            elif w > 0:
                ax.text(left + w / 2, yy + 0.34, str(k), ha="center", va="bottom", fontsize=6.4, color=INK)
            left += w
        ax.text(101, yy, f"n = {n}", va="center", ha="left", fontsize=6.4, color=GREY)
    ax.set_yticks([1, 0]); ax.set_yticklabels([g for g, _ in groups]); ax.set_xlim(0, 112)
    ax.set_xticks([0, 25, 50, 75, 100]); ax.set_xticklabels(["0", "25", "50", "75", "100%"])
    ax.tick_params(axis="y", length=0); clean(ax, left=False); ax.set_ylim(-0.5, 1.75)
    handles = [plt.Rectangle((0, 0), 1, 1, color=col[s]) for s in order]
    ax.legend(handles, [lab[s] for s in order], ncol=3, loc="upper center", bbox_to_anchor=(0.42, 1.18), frameon=False,
              fontsize=6.2, handlelength=0.9, handleheight=0.9, columnspacing=0.9, handletextpad=0.4)
    fig.subplots_adjust(left=0.31, right=0.99, top=0.84, bottom=0.17)
    fig.savefig(FIG / "fig-stage.svg"); plt.close(fig)


# ---------------------------------------------------------------- Fig 4: targeting
def fig_targeting():
    rows = list(csv.DictReader(open(HERE / "out/targeting.csv")))
    rng = np.random.default_rng(20261105)
    fig, axs = plt.subplots(1, 2, figsize=(FULL, 1.95))
    specs = [("pm25_2024", "Annual mean PM2.5, 2024 (µg/m³)", 0), ("open_datasets", "Open datasets published by the province", 1)]
    for ax, (colname, xl, ti) in zip(axs, specs):
        t = R["targeting_tests"][ti]
        for gi, (flag, lab, c) in enumerate([("1", "Province with a\ncertified city", BLUE), ("0", "Other\nprovinces", GREY)]):
            v = np.array([float(r[colname]) for r in rows if r["certified_city"] == flag and r[colname] != ""])
            y = (1 - gi) + rng.uniform(-0.16, 0.16, len(v))
            ax.scatter(v, y, s=9, color=c, alpha=0.75, linewidths=0, zorder=3)
            m = np.median(v)
            ax.plot([m, m], [(1 - gi) - 0.3, (1 - gi) + 0.3], color=AMBER, lw=1.6, zorder=4, solid_capstyle="butt")
            ax.text(m, (1 - gi) + 0.36, f"median {m:.0f}", ha="center", va="bottom", fontsize=6.2, color=INK)
        ax.set_yticks([1, 0]); ax.set_yticklabels(["Province with a\ncertified city", "Other\nprovinces"]); ax.set_ylim(-0.55, 1.75)
        ax.set_xlabel(xl); clean(ax, left=False); ax.tick_params(axis="y", length=0)
        ax.grid(axis="x", color=LIGHT, lw=0.5, zorder=0)
        d, ci = t["cliff_delta"], t["cliff_ci"]
        ax.set_title((f"Cliff's δ = {d:+.2f} (95% CI {ci[0]:+.2f} to {ci[1]:+.2f}); Holm p {'< 0.01' if t['holm_p'] < 0.01 else '= %.2f' % t['holm_p']}").replace("-", "−"),
                     fontsize=6.6, loc="left", color=INK, pad=3)
    fig.subplots_adjust(left=0.115, right=0.99, top=0.88, bottom=0.2, wspace=0.34)
    fig.savefig(FIG / "fig-targeting.svg"); plt.close(fig)


# ---------------------------------------------------------------- Fig 5: forest plot of gap prevalences
def fig_forest():
    DROP = {"nst_updated_on_24th", "nh_forecast_warnings_missed", "gs_procurement_datasets"}
    FLIP = {"gs_datasets_with_location", "gs_shelters_with_coordinates"}  # plotted as the share WITHOUT the property
    comp = {}
    for k, v in R["companion"].items():
        if k in DROP: continue
        v = dict(v)
        if k in FLIP:
            v["k"] = v["n"] - v["k"]; v["p"], v["lo"], v["hi"] = 1 - v["p"], 1 - v["hi"], 1 - v["lo"]
        comp[k] = v
    items = sorted(comp.items(), key=lambda kv: (kv[1]["gap"], -kv[1]["p"]))
    short = {
     "gs_unreadable_resources": "Files that cannot be parsed",
     "gs_datasets_older_than_1y": "Datasets older than a year",
     "gs_datasets_with_location": "Datasets with no location",
     "gs_datasets_no_licence": "Datasets stating no licence",
     "gs_shelters_with_coordinates": "Shelter rows with no coordinate",
     "gs_shelters_over_toilet_reference": "Shelters beyond 20 per toilet (stated capacity)",
     "nst_metadata_older_than_1y": "Catalog records older than a year",
     "nst_registry_stale": "Gauge records flagged stale",
     "nst_water_not_fresh_2h": "River records with no reading in 2 h",
     "nst_rain_not_fresh_2h": "Rain records with no reading in 2 h",
     "rp_gauges_impossible_bank": "Gauges with impossible bank level",
     "nh_stations_in_bangkok": "PM2.5 stations inside Bangkok"}
    fig, ax = plt.subplots(figsize=(COL, 3.0))
    y = 0; ticks, labels, seps, glab = [], [], [], {}
    last = None
    for k, v in items:
        if last is not None and v["gap"] != last: y += 0.7; seps.append(y - 0.55)
        glab.setdefault(v["gap"], []).append(y)
        col = AMBER if v["paper"] == "NST" else BLUE
        ax.plot([v["lo"] * 100, v["hi"] * 100], [y, y], color=col, lw=1.1, zorder=2, solid_capstyle="butt")
        ax.scatter([v["p"] * 100], [y], s=16, color=col, zorder=3, linewidths=0)
        ax.text(101.5, y, f"{v['k']:,}/{v['n']:,}", va="center", ha="left", fontsize=6.0, color=GREY)
        ticks.append(y); labels.append(f"{v['gap']}  {short[k]}"); last = v["gap"]; y += 1
    ax.set_yticks(ticks); ax.set_yticklabels(labels, fontsize=6.6); ax.invert_yaxis()
    for s in seps: ax.axhline(s, color=LIGHT, lw=0.6, zorder=0)
    ax.set_xlim(0, 100); ax.set_xticks([0, 25, 50, 75, 100]); ax.set_xticklabels(["0", "25", "50", "75", "100%"])
    ax.tick_params(axis="y", length=0); clean(ax, left=False); ax.grid(axis="x", color=LIGHT, lw=0.5, zorder=0)
    ax.set_xlabel("Share showing the gap, 95% interval")
    fig.subplots_adjust(left=0.6, right=0.85, top=0.995, bottom=0.12)
    fig.savefig(FIG / "fig-forest.svg"); plt.close(fig)


# ---------------------------------------------------------------- Fig 1: the chain
def fig_chain():
    """The monitoring-to-push chain, with what stops at each link.

    The chain is the unit of analysis: sense (monitor, telemetry, sensors, CCTV)
    -> decide (operations centre, data hub, digital twin) -> push (early warning,
    alert, dispatch). The counts are the 76 hand-coded flagship projects; the
    note under each junction is the companion-preprint measurement that says
    why that link does not carry.
    """
    stages = [
        ("sense",  TEAL,  "sense",  "monitor · telemetry · sensors · CCTV",
         f"{R['flagship_stage']['sense']} of {R['flagship_projects']} projects",
         "15 of the 20 hazard projects reach this link",
         "inputs go stale before anyone reads them: 65.9% of rain records and\n58.8% of river records were more than two hours old"),
        ("decide", BLUE,  "decide", "operations centre · data hub · digital twin",
         f"{R['flagship_stage']['decide']} of {R['flagship_projects']} projects",
         "no hazard project reaches this link",
         "nothing decides because nothing is shared: 0 of 311 open datasets\ndescribe a procurement, and 0 of 177 shelter rows carry a coordinate"),
        ("push",   AMBER, "push",   "early warning · alert · dispatch",
         f"{R['flagship_stage']['push']} of {R['flagship_projects']} projects",
         "2 of 21 endorsed cities name an alert project",
         "where it works it is cheap: 7 seconds from alarm to phone, 8.2 hours\nof lead time before the flood, 84% recall on the gauge overflow"),
    ]
    fig = plt.figure(figsize=(COL, 3.15))
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")

    fig.text(0.02, 0.985, "The monitoring-to-push chain", fontsize=8.4, fontweight="bold", color=INK, ha="left", va="top")
    fig.text(0.02, 0.943, "76 flagship projects from 21 endorsed cities, hand-coded by stated stage",
             fontsize=6.2, color=GREY, ha="left", va="top")

    top, h, gap = 0.872, 0.168, 0.108
    for i, (key, col, name, sub, count, strong, note) in enumerate(stages):
        y = top - i * (h + gap) - h
        ax.add_patch(plt.Rectangle((0.02, y), 0.96, h, facecolor="white", edgecolor=col, lw=1.0, zorder=2))
        ax.add_patch(plt.Rectangle((0.02, y), 0.014, h, facecolor=col, edgecolor="none", zorder=3))
        ax.text(0.065, y + h - 0.044, name.upper(), fontsize=8.2, fontweight="bold", color=col, va="center", ha="left")
        ax.text(0.965, y + h - 0.044, count, fontsize=7.2, fontweight="bold", color=INK, va="center", ha="right")
        ax.text(0.065, y + h - 0.093, sub, fontsize=6.3, color=INK, va="center", ha="left")
        ax.text(0.065, y + 0.028, strong, fontsize=6.3, fontweight="bold", color=col, va="center", ha="left")
        if i < len(stages) - 1:
            ya, yb = y - 0.004, y - gap + 0.006
            ax.annotate("", xy=(0.027, yb), xytext=(0.027, ya),
                        arrowprops=dict(arrowstyle="-|>", color=GREY, lw=1.0, shrinkA=0, shrinkB=0), zorder=3)
        ax.text(0.055, y - 0.016, note, fontsize=6.0, color=GREY, va="top", ha="left", linespacing=1.4)
    fig.savefig(FIG / "fig-chain.svg"); plt.close(fig)


# ---------------------------------------------------------------- Fig 4b: targeting, one column
def fig_targeting_col():
    """The same two comparisons as fig_targeting, stacked for a single column."""
    rows = list(csv.DictReader(open(HERE / "out/targeting.csv")))
    rng = np.random.default_rng(20261105)
    fig, axs = plt.subplots(2, 1, figsize=(COL, 3.5))
    specs = [("pm25_2024", "Annual mean PM2.5, 2024 (µg/m³)", 0),
             ("open_datasets", "Open datasets published by the province", 1)]
    for ax, (colname, xl, ti) in zip(axs, specs):
        t = R["targeting_tests"][ti]
        for gi, (flag, lab, c) in enumerate([("1", "Province with a certified city", BLUE),
                                              ("0", "Other provinces", GREY)]):
            v = np.array([float(r[colname]) for r in rows if r["certified_city"] == flag and r[colname] != ""])
            y = (1 - gi) + rng.uniform(-0.16, 0.16, len(v))
            ax.scatter(v, y, s=9, color=c, alpha=0.75, linewidths=0, zorder=3)
            m = np.median(v)
            ax.plot([m, m], [(1 - gi) - 0.3, (1 - gi) + 0.3], color=AMBER, lw=1.6, zorder=4, solid_capstyle="butt")
            ax.text(m, (1 - gi) + 0.36, f"median {m:.0f}", ha="center", va="bottom", fontsize=6.2, color=INK)
        ax.set_yticks([1, 0]); ax.set_yticklabels(["Province with a\ncertified city", "Other\nprovinces"])
        ax.set_ylim(-0.55, 1.75); ax.set_xlabel(xl)
        clean(ax, left=False); ax.tick_params(axis="y", length=0); ax.grid(axis="x", color=LIGHT, lw=0.5, zorder=0)
        d, ci = t["cliff_delta"], t["cliff_ci"]
        ax.set_title((f"Cliff's δ = {d:+.2f} (95% CI {ci[0]:+.2f} to {ci[1]:+.2f}); Holm p "
                      f"{'< 0.01' if t['holm_p'] < 0.01 else '= %.2f' % t['holm_p']}").replace("-", "−"),
                     fontsize=6.6, loc="left", color=INK, pad=3)
    fig.subplots_adjust(left=0.30, right=0.99, top=0.96, bottom=0.135, hspace=0.95)
    fig.savefig(FIG / "fig-targeting-col.svg"); plt.close(fig)


if __name__ == "__main__":
    fig_chain(); fig_cascade(); fig_stage(); fig_targeting(); fig_targeting_col(); fig_forest(); print("figures ok")
