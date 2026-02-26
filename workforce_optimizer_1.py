import streamlit as st

# ─── PAGE CONFIG ──────────────────────────────────────────────────────────────
st.set_page_config(page_title="Workforce Optimizer", page_icon="⚡", layout="wide")

# ─── DATA ─────────────────────────────────────────────────────────────────────
EMPLOYEES = [
    {"id": "E001", "capacity": 40, "skills": ["A", "B"]},
    {"id": "E002", "capacity": 35, "skills": ["B", "C"]},
    {"id": "E003", "capacity": 30, "skills": ["C", "E"]},
    {"id": "E004", "capacity": 25, "skills": ["A", "D"]},
    {"id": "E005", "capacity": 45, "skills": ["A", "B", "D"]},
    {"id": "E006", "capacity": 20, "skills": ["C"]},
    {"id": "E007", "capacity": 30, "skills": ["B", "D"]},
    {"id": "E008", "capacity": 15, "skills": ["E"]},
    {"id": "E009", "capacity": 40, "skills": ["A", "C"]},
    {"id": "E010", "capacity": 35, "skills": ["B", "E"]},
    {"id": "E011", "capacity": 25, "skills": ["A", "B", "C"]},
    {"id": "E012", "capacity": 30, "skills": ["D"]},
    {"id": "E013", "capacity": 20, "skills": ["A", "E"]},
    {"id": "E014", "capacity": 45, "skills": ["B", "C", "D"]},
    {"id": "E015", "capacity": 10, "skills": ["C", "E"]},
    {"id": "E016", "capacity": 30, "skills": ["A", "D", "E"]},
    {"id": "E017", "capacity": 40, "skills": ["B"]},
    {"id": "E018", "capacity": 25, "skills": ["C", "D", "E"]},
]

PROJECTS = [
    {"id": "P001", "reimbursable": True,  "maxTotal": 90},
    {"id": "P002", "reimbursable": True,  "maxTotal": 85},
    {"id": "P003", "reimbursable": True,  "maxTotal": 95},
    {"id": "P004", "reimbursable": True,  "maxTotal": 100},
    {"id": "P005", "reimbursable": True,  "maxTotal": 85},
    {"id": "P006", "reimbursable": True,  "maxTotal": 80},
    {"id": "P007", "reimbursable": False, "maxTotal": None},
    {"id": "P008", "reimbursable": False, "maxTotal": None},
    {"id": "P009", "reimbursable": False, "maxTotal": None},
    {"id": "P010", "reimbursable": False, "maxTotal": None},
    {"id": "P011", "reimbursable": False, "maxTotal": None},
    {"id": "P012", "reimbursable": False, "maxTotal": None},
]

TASKS = [
    {"project": "P001", "id": "T001", "type": "A", "minHours": 17},
    {"project": "P001", "id": "T002", "type": "A", "minHours": 10},
    {"project": "P001", "id": "T003", "type": "B", "minHours": 14},
    {"project": "P001", "id": "T004", "type": "B", "minHours": 7},
    {"project": "P002", "id": "T005", "type": "B", "minHours": 14},
    {"project": "P002", "id": "T006", "type": "C", "minHours": 10},
    {"project": "P002", "id": "T007", "type": "C", "minHours": 10},
    {"project": "P002", "id": "T008", "type": "B", "minHours": 14},
    {"project": "P003", "id": "T009", "type": "D", "minHours": 10},
    {"project": "P003", "id": "T010", "type": "D", "minHours": 7},
    {"project": "P003", "id": "T011", "type": "D", "minHours": 7},
    {"project": "P003", "id": "T012", "type": "D", "minHours": 10},
    {"project": "P004", "id": "T013", "type": "E", "minHours": 7},
    {"project": "P004", "id": "T014", "type": "E", "minHours": 3},
    {"project": "P004", "id": "T015", "type": "B", "minHours": 14},
    {"project": "P004", "id": "T016", "type": "A", "minHours": 7},
    {"project": "P005", "id": "T017", "type": "B", "minHours": 17},
    {"project": "P005", "id": "T018", "type": "C", "minHours": 27},
    {"project": "P005", "id": "T019", "type": "A", "minHours": 7},
    {"project": "P005", "id": "T020", "type": "E", "minHours": 3},
    {"project": "P006", "id": "T021", "type": "C", "minHours": 20},
    {"project": "P006", "id": "T022", "type": "E", "minHours": 14},
    {"project": "P006", "id": "T023", "type": "D", "minHours": 7},
    {"project": "P006", "id": "T024", "type": "C", "minHours": 14},
    {"project": "P007", "id": "T025", "type": "E", "minHours": 10},
    {"project": "P007", "id": "T026", "type": "B", "minHours": 7},
    {"project": "P007", "id": "T027", "type": "E", "minHours": 3},
    {"project": "P007", "id": "T028", "type": "D", "minHours": 10},
    {"project": "P008", "id": "T029", "type": "A", "minHours": 14},
    {"project": "P008", "id": "T030", "type": "A", "minHours": 10},
    {"project": "P008", "id": "T031", "type": "E", "minHours": 17},
    {"project": "P008", "id": "T032", "type": "A", "minHours": 7},
    {"project": "P009", "id": "T033", "type": "D", "minHours": 24},
    {"project": "P009", "id": "T034", "type": "B", "minHours": 10},
    {"project": "P009", "id": "T035", "type": "B", "minHours": 7},
    {"project": "P009", "id": "T036", "type": "E", "minHours": 7},
    {"project": "P010", "id": "T037", "type": "B", "minHours": 7},
    {"project": "P010", "id": "T038", "type": "D", "minHours": 14},
    {"project": "P010", "id": "T039", "type": "C", "minHours": 7},
    {"project": "P011", "id": "T040", "type": "E", "minHours": 7},
    {"project": "P011", "id": "T041", "type": "E", "minHours": 7},
    {"project": "P011", "id": "T042", "type": "A", "minHours": 14},
    {"project": "P012", "id": "T043", "type": "B", "minHours": 24},
    {"project": "P012", "id": "T044", "type": "A", "minHours": 14},
    {"project": "P012", "id": "T045", "type": "E", "minHours": 10},
]

SKILL_COLORS = {"A": "🟠", "B": "🔵", "C": "🟢", "D": "🟣", "E": "🔴"}
proj_map = {p["id"]: p for p in PROJECTS}

# ─── OPTIMIZER ────────────────────────────────────────────────────────────────
def run_optimizer(employees, tasks):
    rem = {e["id"]: e["capacity"] for e in employees}
    load = {e["id"]: 0 for e in employees}
    p_hours = {p["id"]: 0 for p in PROJECTS}

    sorted_tasks = sorted(
        tasks,
        key=lambda t: (
            -(1 if proj_map.get(t["project"], {}).get("reimbursable") else 0),
            -t["minHours"]
        )
    )

    asgn = {}
    for t in sorted_tasks:
        proj = proj_map.get(t["project"])
        if proj and proj.get("reimbursable") and proj.get("maxTotal") is not None:
            if p_hours[t["project"]] + t["minHours"] > proj["maxTotal"]:
                asgn[t["id"]] = {"employee": None, "reason": "budget"}
                continue

        ok = sorted(
            [e for e in employees if t["type"] in e["skills"] and rem[e["id"]] >= t["minHours"]],
            key=lambda e: load[e["id"]]
        )
        if ok:
            best = ok[0]
            asgn[t["id"]] = {"employee": best["id"]}
            rem[best["id"]] -= t["minHours"]
            load[best["id"]] += t["minHours"]
            p_hours[t["project"]] += t["minHours"]
        else:
            partial = [e for e in employees if t["type"] in e["skills"] and rem[e["id"]] > 0]
            if partial:
                e = sorted(partial, key=lambda x: -rem[x["id"]])[0]
                asgn[t["id"]] = {"employee": e["id"], "partial": True}
                rem[e["id"]] = max(0, rem[e["id"]] - t["minHours"])
                load[e["id"]] += t["minHours"]
                p_hours[t["project"]] += t["minHours"]
            else:
                asgn[t["id"]] = {"employee": None, "reason": "no_skill"}

    return {"asgn": asgn, "rem": rem, "load": load, "p_hours": p_hours}


def analyze_departure(leaving_id):
    result = run_optimizer(EMPLOYEES, TASKS)
    asgn, load = result["asgn"], result["load"]
    leaving = next((e for e in EMPLOYEES if e["id"] == leaving_id), None)
    if not leaving:
        return None
    owned = [t for t in TASKS if asgn.get(t["id"], {}).get("employee") == leaving_id]
    need_skills = list(set(t["type"] for t in owned))
    total_h = sum(t["minHours"] for t in owned)
    rest = [e for e in EMPLOYEES if e["id"] != leaving_id]
    new_result = run_optimizer(rest, TASKS)
    n_asgn, n_load = new_result["asgn"], new_result["load"]
    plan = []
    for t in owned:
        a = n_asgn.get(t["id"], {})
        status = "ok" if a.get("employee") and not a.get("partial") else ("overloaded" if a.get("partial") else "failed")
        plan.append({"task": t, "newOwner": a.get("employee"), "status": status})
    cands = []
    for e in rest:
        overlap = [s for s in need_skills if s in e["skills"]]
        sc = len(overlap) / max(len(need_skills), 1)
        free = e["capacity"] - (n_load.get(e["id"]) or 0)
        can_all = free >= total_h
        cr = min(free / total_h, 1) if total_h > 0 else 1
        score = sc * 0.6 + cr * 0.3 + (0.1 if can_all else 0)
        if sc > 0:
            cands.append({"e": e, "overlap": overlap, "sc": sc, "free": free, "canAll": can_all, "score": score})
    cands = sorted(cands, key=lambda x: -x["score"])[:5]
    return {"leaving": leaving, "owned": owned, "needSkills": need_skills, "totalH": total_h, "cands": cands, "plan": plan}


def analyze_emergency(absent_ids):
    if not absent_ids:
        return None
    result = run_optimizer(EMPLOYEES, TASKS)
    asgn = result["asgn"]
    avail = [e for e in EMPLOYEES if e["id"] not in absent_ids]
    disrupted = [t for t in TASKS if asgn.get(t["id"], {}).get("employee") in absent_ids]
    new_result = run_optimizer(avail, TASKS)
    n_asgn, n_load = new_result["asgn"], new_result["load"]
    sub_map = {}
    for t in disrupted:
        a = n_asgn.get(t["id"], {})
        if a.get("employee") and not a.get("partial"):
            sub_map[t["id"]] = {"autoSub": a["employee"]}
        else:
            cands = []
            for e in avail:
                if t["type"] in e["skills"]:
                    free = e["capacity"] - (n_load.get(e["id"]) or 0)
                    util_after = ((n_load.get(e["id"]) or 0) + t["minHours"]) / e["capacity"] * 100
                    cands.append({"e": e, "free": free, "canTake": free >= t["minHours"], "utilAfter": util_after})
            cands = sorted(cands, key=lambda x: (-(1 if x["canTake"] else 0), -x["free"]))[:3]
            sub_map[t["id"]] = {"autoSub": None, "cands": cands}
    auto_cov = sum(1 for s in sub_map.values() if s.get("autoSub"))
    gaps = {}
    for e in EMPLOYEES:
        if e["id"] in absent_ids:
            for s in e["skills"]:
                if s not in gaps:
                    gaps[s] = {"lost": 0, "lostH": 0, "remain": 0, "demH": 0}
                gaps[s]["lost"] += 1
                gaps[s]["lostH"] += e["capacity"]
    for s in gaps:
        gaps[s]["remain"] = len([e for e in avail if s in e["skills"]])
        gaps[s]["demH"] = sum(t["minHours"] for t in disrupted if t["type"] == s)
    urg_proj = {}
    for t in disrupted:
        pid = t["project"]
        if pid not in urg_proj:
            urg_proj[pid] = {"proj": proj_map[pid], "tasks": [], "total": 0, "risk": 0, "cov": 0}
        urg_proj[pid]["tasks"].append(t)
        urg_proj[pid]["total"] += t["minHours"]
        if sub_map.get(t["id"], {}).get("autoSub"):
            urg_proj[pid]["cov"] += 1
        else:
            urg_proj[pid]["risk"] += 1
    return {
        "absentEmps": [e for e in EMPLOYEES if e["id"] in absent_ids],
        "disrupted": disrupted,
        "urgProj": urg_proj,
        "subMap": sub_map,
        "gaps": gaps,
        "autoCov": auto_cov,
        "total": len(disrupted)
    }


def analyze_skill_gap():
    total_demand = {s: 0 for s in "ABCDE"}
    total_supply = {s: 0 for s in "ABCDE"}
    emp_count = {s: 0 for s in "ABCDE"}
    for t in TASKS:
        total_demand[t["type"]] += t["minHours"]
    for e in EMPLOYEES:
        for s in e["skills"]:
            total_supply[s] += e["capacity"]
            emp_count[s] += 1
    opt = run_optimizer(EMPLOYEES, TASKS)
    results = []
    for skill in "ABCDE":
        dem = total_demand[skill]
        sup = total_supply[skill]
        gap = dem - sup
        ratio = dem / sup if sup > 0 else 99
        coverage = min(sup / dem, 1) * 100 if dem > 0 else 100
        status = "surplus" if ratio <= 0.6 else "healthy" if ratio <= 1.0 else "tight" if ratio <= 1.3 else "critical"
        hours_short = max(0, gap)
        hires_needed = max(0, -(-hours_short // 30)) if hours_short > 0 else 0
        can_learn = []
        for e in EMPLOYEES:
            if skill not in e["skills"] and len(e["skills"]) < 3:
                free = e["capacity"] - (opt["load"].get(e["id"]) or 0)
                if free >= 5:
                    can_learn.append({"e": e, "free": free})
        can_learn = sorted(can_learn, key=lambda x: -x["free"])[:3]
        results.append({
            "skill": skill, "dem": dem, "sup": sup, "gap": gap,
            "ratio": ratio, "coverage": coverage, "status": status,
            "hoursShort": hours_short, "hiresNeeded": hires_needed,
            "canLearn": can_learn, "empCount": emp_count[skill]
        })
    overall_ok = all(r["status"] in ("healthy", "surplus") for r in results)
    return {"results": results, "overallOk": overall_ok}


# ─── STYLE HELPERS ────────────────────────────────────────────────────────────
def status_badge(status):
    colors = {"OK": "🟢", "Overloaded": "🟡", "Failed": "🔴",
              "Fulfilled": "🟢", "Partial": "🟡", "Over Budget": "🔴",
              "critical": "🔴", "tight": "🟡", "healthy": "🟢", "surplus": "⚪",
              "Reassigned": "🟢"}
    return f"{colors.get(status, '')} {status}"


# ─── RUN ONCE ─────────────────────────────────────────────────────────────────
opt_result = run_optimizer(EMPLOYEES, TASKS)
asgn = opt_result["asgn"]
load = opt_result["load"]
p_hours = opt_result["p_hours"]

total_cap = sum(e["capacity"] for e in EMPLOYEES)
total_load = sum(load.values())
util = round(total_load / total_cap * 100)
n_ok = sum(1 for a in asgn.values() if a.get("employee") and not a.get("partial"))
n_fail = sum(1 for a in asgn.values() if not a.get("employee"))
n_part = sum(1 for a in asgn.values() if a.get("partial"))

tasks_by_emp = {e["id"]: [] for e in EMPLOYEES}
for t in TASKS:
    a = asgn.get(t["id"], {})
    if a.get("employee"):
        tasks_by_emp[a["employee"]].append({**t, **a})

skill_gap_data = analyze_skill_gap()
critical_gaps = [r for r in skill_gap_data["results"] if r["status"] in ("critical", "tight")]

# ─── HEADER ───────────────────────────────────────────────────────────────────
st.markdown("## ⚡ Workforce Optimizer")
st.caption("Capstone · 18 employees · 12 projects · 45 tasks")

col1, col2, col3 = st.columns(3)
util_color = "normal" if util >= 70 else "off"
col1.metric("Utilization", f"{util}%")
col2.metric("Tasks Done", f"{n_ok} / {len(TASKS)}")
col3.metric("Skill Alerts", critical_gaps.__len__())

st.divider()

# ─── TABS ─────────────────────────────────────────────────────────────────────
tab_labels = ["📊 Dashboard", "👥 Employees", "📁 Projects",
              "📋 Assignments", "🎯 Skill Gap Advisor",
              "👤 Departure Planner", "🚨 Emergency Coverage"]

tabs = st.tabs(tab_labels)

# ══════════════════════════════════════════════════════════════════ DASHBOARD
with tabs[0]:
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Total Employees", len(EMPLOYEES), f"{total_cap} total hours/week")
    c2.metric("Active Projects", len(PROJECTS), "6 reimbursable · 6 standard")
    c3.metric("Tasks Assigned", f"{n_ok} / {len(TASKS)}", f"{n_fail + n_part} need attention" if n_fail + n_part > 0 else "All tasks covered")
    c4.metric("Workforce Utilization", f"{util}%", f"{total_load} of {total_cap} hours used")

    st.subheader("Employee Utilization")
    import pandas as pd
    emp_rows = []
    for e in EMPLOYEES:
        l = load.get(e["id"], 0)
        p = round(l / e["capacity"] * 100)
        emp_rows.append({"Employee": e["id"], "Skills": " ".join(SKILL_COLORS[s] for s in e["skills"]),
                         "Assigned (h)": l, "Capacity (h)": e["capacity"], "Utilization %": p})
    df_emp = pd.DataFrame(emp_rows)
    st.dataframe(df_emp, use_container_width=True, hide_index=True,
                 column_config={"Utilization %": st.column_config.ProgressColumn("Utilization %", min_value=0, max_value=100, format="%d%%")})

    st.subheader("Skill Demand vs Supply")
    skill_rows = []
    for sk in "ABCDE":
        dem = sum(t["minHours"] for t in TASKS if t["type"] == sk)
        sup = sum(e["capacity"] for e in EMPLOYEES if sk in e["skills"])
        ratio = dem / sup if sup > 0 else 99
        status = "surplus" if ratio <= 0.6 else "healthy" if ratio <= 1.0 else "tight" if ratio <= 1.3 else "critical"
        n_emp = len([e for e in EMPLOYEES if sk in e["skills"]])
        n_task = len([t for t in TASKS if t["type"] == sk])
        skill_rows.append({"Skill": f"{SKILL_COLORS[sk]} {sk}", "Tasks": n_task, "Employees": n_emp,
                            "Demand (h)": dem, "Supply (h)": sup, "Coverage %": round(min(sup / dem, 1) * 100) if dem > 0 else 100,
                            "Status": status.upper()})
    df_skills = pd.DataFrame(skill_rows)
    st.dataframe(df_skills, use_container_width=True, hide_index=True,
                 column_config={"Coverage %": st.column_config.ProgressColumn("Coverage %", min_value=0, max_value=100, format="%d%%")})

    if critical_gaps:
        st.warning(f"⚠ {len(critical_gaps)} skill(s) under pressure — see **Skill Gap Advisor** for recommendations.")

    st.subheader("Project Summary")
    proj_rows = []
    for p in PROJECTS:
        dem = sum(t["minHours"] for t in TASKS if t["project"] == p["id"])
        asn = p_hours.get(p["id"], 0)
        cov_pct = round(asn / dem * 100) if dem > 0 else 100
        ov = p["maxTotal"] and asn > p["maxTotal"]
        ok = asn >= dem
        status = "Over Budget" if ov else ("Fulfilled" if ok else "Partial")
        proj_rows.append({"Project": p["id"], "Type": "Reimbursable" if p["reimbursable"] else "Non-Reimb.",
                          "Demand (h)": dem, "Assigned (h)": asn,
                          "Budget Cap": f"{p['maxTotal']} h" if p["maxTotal"] else "—",
                          "Coverage %": cov_pct, "Status": status_badge(status)})
    st.dataframe(pd.DataFrame(proj_rows), use_container_width=True, hide_index=True,
                 column_config={"Coverage %": st.column_config.ProgressColumn("Coverage %", min_value=0, max_value=100, format="%d%%")})

# ══════════════════════════════════════════════════════════════════ EMPLOYEES
with tabs[1]:
    st.subheader("Employee Roster")
    for e in EMPLOYEES:
        l = load.get(e["id"], 0)
        p = round(l / e["capacity"] * 100)
        skill_icons = " ".join(SKILL_COLORS[s] + s for s in e["skills"])
        with st.expander(f"**{e['id']}** — {skill_icons} — {p}% utilized ({l}/{e['capacity']} h)"):
            tasks = tasks_by_emp.get(e["id"], [])
            if not tasks:
                st.write("No tasks assigned.")
            else:
                rows = [{"Task": t["id"], "Project": t["project"],
                         "Skill": f"{SKILL_COLORS[t['type']]} {t['type']}", "Hours": t["minHours"],
                         "Status": "Partial" if t.get("partial") else "OK"} for t in tasks]
                st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)

# ══════════════════════════════════════════════════════════════════ PROJECTS
with tabs[2]:
    st.subheader("Project Overview")
    for p in PROJECTS:
        pt = [t for t in TASKS if t["project"] == p["id"]]
        dem = sum(t["minHours"] for t in pt)
        asn = p_hours.get(p["id"], 0)
        ov = p["maxTotal"] and asn > p["maxTotal"]
        ok = asn >= dem
        label = "🟢 Fulfilled" if ok and not ov else ("🔴 Over Budget" if ov else "🟡 Partial")
        ptype = "Reimbursable" if p["reimbursable"] else "Non-Reimbursable"
        with st.expander(f"**{p['id']}** — {ptype} — {label} ({asn}/{dem} h)"):
            if p["maxTotal"]:
                st.progress(min(asn / p["maxTotal"], 1.0), text=f"Budget: {asn} / {p['maxTotal']} h")
            rows = []
            for t in pt:
                a = asgn.get(t["id"], {})
                rows.append({"Task": t["id"], "Skill": f"{SKILL_COLORS[t['type']]} {t['type']}",
                             "Hours": t["minHours"], "Assigned To": a.get("employee") or "—",
                             "Status": "🟡 Partial" if a.get("partial") else ("🟢 OK" if a.get("employee") else "🔴 Unassigned")})
            st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)

# ══════════════════════════════════════════════════════════════════ ASSIGNMENTS
with tabs[3]:
    st.subheader("Full Task Assignment Matrix")
    rows = []
    for t in TASKS:
        a = asgn.get(t["id"], {})
        s = "Failed" if not a.get("employee") else ("Overloaded" if a.get("partial") else "OK")
        reimb = "R" if proj_map[t["project"]].get("reimbursable") else "N"
        rows.append({"Task": t["id"], "Project": f"{t['project']} ({reimb})",
                     "Skill": f"{SKILL_COLORS[t['type']]} {t['type']}", "Min Hours": t["minHours"],
                     "Assigned To": a.get("employee") or "—", "Status": status_badge(s)})
    st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)

# ══════════════════════════════════════════════════════════════════ SKILL GAP
with tabs[4]:
    st.subheader("Skill Gap Advisor")
    data = skill_gap_data

    if data["overallOk"]:
        st.success("✅ Your current team's skill coverage is sufficient for all active projects.")
    else:
        st.error("⚠ Current skill supply cannot meet project demand. Immediate investment recommended.")

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Skills Healthy", f"{sum(1 for r in data['results'] if r['status'] in ('healthy','surplus'))}/5")
    c2.metric("Tight Supply", sum(1 for r in data['results'] if r['status'] == 'tight'))
    c3.metric("Critical Gaps", sum(1 for r in data['results'] if r['status'] == 'critical'))
    c4.metric("Est. Hires Needed", sum(r["hiresNeeded"] for r in data["results"]))

    order = {"critical": 0, "tight": 1, "healthy": 2, "surplus": 3}
    for r in sorted(data["results"], key=lambda x: order[x["status"]]):
        icon = "🔴" if r["status"] == "critical" else "🟡" if r["status"] == "tight" else "🟢" if r["status"] == "healthy" else "⚪"
        with st.expander(f"{SKILL_COLORS[r['skill']]} **Skill {r['skill']}** — {icon} {r['status'].upper()} — {r['coverage']:.0f}% covered"):
            c1, c2, c3, c4, c5 = st.columns(5)
            c1.metric("Demand", f"{r['dem']} h")
            c2.metric("Supply", f"{r['sup']} h")
            c3.metric("Gap", f"{'-' if r['gap'] > 0 else '+'}{abs(r['gap'])} h")
            c4.metric("Employees", r["empCount"])
            c5.metric("Coverage", f"{r['coverage']:.0f}%")
            st.progress(r["coverage"] / 100, text=f"Supply vs Demand: {r['coverage']:.0f}%")

            if r["status"] in ("critical", "tight"):
                col_a, col_b = st.columns(2)
                with col_a:
                    st.markdown("**📚 Option A — Upskill Existing Staff**")
                    if not r["canLearn"]:
                        st.caption("No employees have bandwidth to learn this skill right now.")
                    else:
                        for c in r["canLearn"]:
                            skills_str = " ".join(SKILL_COLORS[s] + s for s in c["e"]["skills"])
                            st.caption(f"**{c['e']['id']}** ({skills_str}) — {c['free']} h free")
                        total_free = sum(c["free"] for c in r["canLearn"])
                        st.info(f"💡 Training would add ~{total_free} h of Skill {r['skill']} capacity without new hires.")
                with col_b:
                    st.markdown("**🧑‍💼 Option B — Hire New Employee**")
                    st.metric("Hours Short", f"{r['hoursShort']} h")
                    st.metric("Est. Hires Needed", r["hiresNeeded"], "@ avg 30 h/week")
            elif r["status"] == "surplus":
                st.caption(f"✓ Surplus supply — consider reassigning some Skill {r['skill']} capacity to support tighter skill areas.")

# ══════════════════════════════════════════════════════════════════ DEPARTURE
with tabs[5]:
    st.subheader("Departure Impact Planner")
    st.info("Select an employee who is leaving. The engine analyzes their task portfolio, identifies coverage gaps, and ranks the best internal replacements.")

    emp_options = ["— Select departing employee —"] + [
        f"{e['id']} · Skills: {', '.join(e['skills'])} · {e['capacity']} h/week" for e in EMPLOYEES
    ]
    selection = st.selectbox("Departing Employee", emp_options)

    if selection != emp_options[0]:
        dept_id = selection.split(" · ")[0]
        if st.button("Analyze Departure"):
            st.session_state["dept_result"] = analyze_departure(dept_id)

    if "dept_result" in st.session_state and st.session_state["dept_result"]:
        dr = st.session_state["dept_result"]
        leaving = dr["leaving"]
        auto_ok = sum(1 for p in dr["plan"] if p["status"] == "ok")
        at_risk = sum(1 for p in dr["plan"] if p["status"] != "ok")

        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Tasks Owned", len(dr["owned"]))
        c2.metric("Hours to Cover", f"{dr['totalH']} h")
        c3.metric("Auto-Redistributed", auto_ok)
        c4.metric("Needs Manual Cover", at_risk)

        skills_str = " ".join(SKILL_COLORS[s] + s for s in leaving["skills"])
        need_str = " ".join(SKILL_COLORS[s] + s for s in dr["needSkills"])
        st.markdown(f"**Departing:** {leaving['id']} — {skills_str} — {leaving['capacity']} h/week capacity")
        st.markdown(f"**Skills needed for coverage:** {need_str}")

        if at_risk > 0:
            st.error(f"⚠ {at_risk} task(s) cannot be auto-covered without a replacement.")

        st.subheader("Top Replacement Candidates")
        for i, c in enumerate(dr["cands"]):
            label = "🥇 Best Match" if i == 0 else f"#{i+1}"
            c_skills = " ".join(SKILL_COLORS[s] + s for s in c["e"]["skills"])
            with st.expander(f"{label} — **{c['e']['id']}** — {c_skills} — Score: {round(c['score']*100)}"):
                col1, col2, col3, col4 = st.columns(4)
                col1.metric("Skill Coverage", f"{round(c['sc']*100)}%")
                col2.metric("Free Hours", f"{c['free']} h")
                col3.metric("Can Absorb All", "Yes" if c["canAll"] else "No")
                col4.metric("Fit Score", round(c["score"] * 100))
                missing = [s for s in dr["needSkills"] if s not in c["e"]["skills"]]
                if missing:
                    st.warning(f"⚠ Missing skills: {', '.join(missing)} — additional resource needed.")

        st.subheader("Task Redistribution Plan")
        rows = [{"Task": p["task"]["id"], "Project": p["task"]["project"],
                 "Skill": f"{SKILL_COLORS[p['task']['type']]} {p['task']['type']}",
                 "Hours": p["task"]["minHours"],
                 "New Owner": p["newOwner"] or "—",
                 "Status": status_badge("Reassigned" if p["status"] == "ok" else p["status"].capitalize())}
                for p in dr["plan"]]
        st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)

        if st.button("Clear Analysis"):
            del st.session_state["dept_result"]
            st.rerun()

# ══════════════════════════════════════════════════════════════════ EMERGENCY
with tabs[6]:
    st.subheader("Emergency Coverage Planner")
    st.error("Mark employees as absent (sick, unavailable). The engine instantly identifies disrupted tasks and recommends the best available subs — reimbursable projects are treated as highest priority.")

    absent_ids = st.multiselect(
        "Mark Absent Employees",
        options=[e["id"] for e in EMPLOYEES],
        format_func=lambda eid: f"{eid} [{next(e for e in EMPLOYEES if e['id']==eid)['skills']}]"
    )

    if absent_ids:
        if st.button("Run Coverage Analysis"):
            em_result = analyze_emergency(absent_ids)

            c1, c2, c3, c4 = st.columns(4)
            c1.metric("Employees Absent", len(em_result["absentEmps"]))
            c2.metric("Tasks Disrupted", em_result["total"])
            c3.metric("Auto-Covered", em_result["autoCov"])
            at_risk_n = em_result["total"] - em_result["autoCov"]
            c4.metric("Needs Manual Sub", at_risk_n)

            if at_risk_n == 0:
                st.success(f"✅ All {em_result['total']} disrupted tasks can be auto-redistributed. Full coverage maintained.")
            else:
                st.error(f"⚠ {at_risk_n} task(s) require manual reassignment. See recommendations below.")

            if em_result["gaps"]:
                st.subheader("Skill Gap Impact")
                gap_rows = [{"Skill": f"{SKILL_COLORS[sk]} {sk}", "Lost Employees": g["lost"],
                             "Lost Hours": g["lostH"], "Remaining Employees": g["remain"],
                             "At-Risk Demand (h)": g["demH"]} for sk, g in em_result["gaps"].items()]
                st.dataframe(pd.DataFrame(gap_rows), use_container_width=True, hide_index=True)

            if em_result["urgProj"]:
                st.subheader("Affected Projects — Priority Order")
                proj_rows = sorted(
                    [{"Project": pid, "Type": "🔵 Reimbursable · High Priority" if info["proj"].get("reimbursable") else "🟣 Non-Reimbursable",
                      "Tasks": len(info["tasks"]), "Total (h)": info["total"],
                      "Auto-Covered": info["cov"], "At Risk": info["risk"]}
                     for pid, info in em_result["urgProj"].items()],
                    key=lambda x: (0 if "Reimbursable" in x["Type"] else 1, -x["At Risk"])
                )
                st.dataframe(pd.DataFrame(proj_rows), use_container_width=True, hide_index=True)

            st.subheader("Immediate Sub Recommendations")
            disrupted_sorted = sorted(
                em_result["disrupted"],
                key=lambda t: (-(1 if proj_map[t["project"]].get("reimbursable") else 0), -t["minHours"])
            )
            for t in disrupted_sorted:
                sub = em_result["subMap"].get(t["id"], {})
                p = proj_map[t["project"]]
                priority = "🔵 High Priority" if p.get("reimbursable") else "🟣 Standard"
                auto = sub.get("autoSub")
                header = f"**{t['id']}** — {SKILL_COLORS[t['type']]} Skill {t['type']} — {t['project']} — {t['minHours']} h — {priority}"
                if auto:
                    header += f" — 🟢 Auto-assigned → {auto}"
                else:
                    header += " — 🔴 Needs Manual Assignment"
                with st.expander(header):
                    if not auto and sub.get("cands"):
                        st.markdown("**Best Available Subs:**")
                        for i, cand in enumerate(sub["cands"]):
                            label = "🥇 Top Pick" if i == 0 else f"#{i+1}"
                            ok_label = "✓ No overload" if cand["canTake"] else "⚡ Slight overload"
                            st.caption(f"{label} — **{cand['e']['id']}** — {cand['free']} h free — {round(cand['utilAfter'])}% util after — {ok_label}")
                    elif not auto:
                        st.error(f"❌ No available employees with Skill {t['type']} — consider external hire or deferral.")
    else:
        st.caption("Select one or more absent employees above, then click Run Coverage Analysis.")
