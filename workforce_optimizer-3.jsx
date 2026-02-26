import { useState, useMemo } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const EMPLOYEES = [
  { id:"E001", capacity:40, skills:["A","B"] },
  { id:"E002", capacity:35, skills:["B","C"] },
  { id:"E003", capacity:30, skills:["C","E"] },
  { id:"E004", capacity:25, skills:["A","D"] },
  { id:"E005", capacity:45, skills:["A","B","D"] },
  { id:"E006", capacity:20, skills:["C"] },
  { id:"E007", capacity:30, skills:["B","D"] },
  { id:"E008", capacity:15, skills:["E"] },
  { id:"E009", capacity:40, skills:["A","C"] },
  { id:"E010", capacity:35, skills:["B","E"] },
  { id:"E011", capacity:25, skills:["A","B","C"] },
  { id:"E012", capacity:30, skills:["D"] },
  { id:"E013", capacity:20, skills:["A","E"] },
  { id:"E014", capacity:45, skills:["B","C","D"] },
  { id:"E015", capacity:10, skills:["C","E"] },
  { id:"E016", capacity:30, skills:["A","D","E"] },
  { id:"E017", capacity:40, skills:["B"] },
  { id:"E018", capacity:25, skills:["C","D","E"] },
];
const PROJECTS = [
  { id:"P001", reimbursable:true,  maxTotal:90  },
  { id:"P002", reimbursable:true,  maxTotal:85  },
  { id:"P003", reimbursable:true,  maxTotal:95  },
  { id:"P004", reimbursable:true,  maxTotal:100 },
  { id:"P005", reimbursable:true,  maxTotal:85  },
  { id:"P006", reimbursable:true,  maxTotal:80  },
  { id:"P007", reimbursable:false, maxTotal:null },
  { id:"P008", reimbursable:false, maxTotal:null },
  { id:"P009", reimbursable:false, maxTotal:null },
  { id:"P010", reimbursable:false, maxTotal:null },
  { id:"P011", reimbursable:false, maxTotal:null },
  { id:"P012", reimbursable:false, maxTotal:null },
];
const TASKS = [
  {project:"P001",id:"T001",type:"A",minHours:17},{project:"P001",id:"T002",type:"A",minHours:10},
  {project:"P001",id:"T003",type:"B",minHours:14},{project:"P001",id:"T004",type:"B",minHours:7},
  {project:"P002",id:"T005",type:"B",minHours:14},{project:"P002",id:"T006",type:"C",minHours:10},
  {project:"P002",id:"T007",type:"C",minHours:10},{project:"P002",id:"T008",type:"B",minHours:14},
  {project:"P003",id:"T009",type:"D",minHours:10},{project:"P003",id:"T010",type:"D",minHours:7},
  {project:"P003",id:"T011",type:"D",minHours:7},{project:"P003",id:"T012",type:"D",minHours:10},
  {project:"P004",id:"T013",type:"E",minHours:7},{project:"P004",id:"T014",type:"E",minHours:3},
  {project:"P004",id:"T015",type:"B",minHours:14},{project:"P004",id:"T016",type:"A",minHours:7},
  {project:"P005",id:"T017",type:"B",minHours:17},{project:"P005",id:"T018",type:"C",minHours:27},
  {project:"P005",id:"T019",type:"A",minHours:7},{project:"P005",id:"T020",type:"E",minHours:3},
  {project:"P006",id:"T021",type:"C",minHours:20},{project:"P006",id:"T022",type:"E",minHours:14},
  {project:"P006",id:"T023",type:"D",minHours:7},{project:"P006",id:"T024",type:"C",minHours:14},
  {project:"P007",id:"T025",type:"E",minHours:10},{project:"P007",id:"T026",type:"B",minHours:7},
  {project:"P007",id:"T027",type:"E",minHours:3},{project:"P007",id:"T028",type:"D",minHours:10},
  {project:"P008",id:"T029",type:"A",minHours:14},{project:"P008",id:"T030",type:"A",minHours:10},
  {project:"P008",id:"T031",type:"E",minHours:17},{project:"P008",id:"T032",type:"A",minHours:7},
  {project:"P009",id:"T033",type:"D",minHours:24},{project:"P009",id:"T034",type:"B",minHours:10},
  {project:"P009",id:"T035",type:"B",minHours:7},{project:"P009",id:"T036",type:"E",minHours:7},
  {project:"P010",id:"T037",type:"B",minHours:7},{project:"P010",id:"T038",type:"D",minHours:14},
  {project:"P010",id:"T039",type:"C",minHours:7},{project:"P011",id:"T040",type:"E",minHours:7},
  {project:"P011",id:"T041",type:"E",minHours:7},{project:"P011",id:"T042",type:"A",minHours:14},
  {project:"P012",id:"T043",type:"B",minHours:24},{project:"P012",id:"T044",type:"A",minHours:14},
  {project:"P012",id:"T045",type:"E",minHours:10},
];

const SC = { A:"#fb923c", B:"#60a5fa", C:"#34d399", D:"#c084fc", E:"#f87171" };
const SL_BG = { A:"#431407", B:"#172554", C:"#052e16", D:"#3b0764", E:"#450a0a" };
const projMap = Object.fromEntries(PROJECTS.map(p=>[p.id,p]));
const SKILL_NAMES = { A:"Type A", B:"Type B", C:"Type C", D:"Type D", E:"Type E" };

// ─── OPTIMIZER ───────────────────────────────────────────────────────────────
function runOptimizer(employees, tasks) {
  const rem={}, load={}, pHours={};
  employees.forEach(e=>{ rem[e.id]=e.capacity; load[e.id]=0; });
  PROJECTS.forEach(p=>{ pHours[p.id]=0; });
  const sorted=[...tasks].sort((a,b)=>{
    const r=(projMap[b.project]?.reimbursable?1:0)-(projMap[a.project]?.reimbursable?1:0);
    return r!==0?r:b.minHours-a.minHours;
  });
  const asgn={};
  sorted.forEach(t=>{
    const proj=projMap[t.project];
    if(proj?.reimbursable&&proj.maxTotal!=null&&pHours[t.project]+t.minHours>proj.maxTotal){
      asgn[t.id]={employee:null,reason:"budget"}; return;
    }
    const ok=employees.filter(e=>e.skills.includes(t.type)&&rem[e.id]>=t.minHours).sort((a,b)=>load[a.id]-load[b.id]);
    if(!ok.length){
      const partial=employees.filter(e=>e.skills.includes(t.type)&&rem[e.id]>0);
      if(partial.length){
        const e=partial.sort((a,b)=>rem[b.id]-rem[a.id])[0];
        asgn[t.id]={employee:e.id,partial:true};
        rem[e.id]=Math.max(0,rem[e.id]-t.minHours); load[e.id]+=t.minHours; pHours[t.project]+=t.minHours;
      } else asgn[t.id]={employee:null,reason:"no_skill"};
      return;
    }
    const best=ok[0];
    asgn[t.id]={employee:best.id};
    rem[best.id]-=t.minHours; load[best.id]+=t.minHours; pHours[t.project]+=t.minHours;
  });
  return {asgn, rem, load, pHours};
}

// ─── DEPARTURE ───────────────────────────────────────────────────────────────
function analyzeDeparture(leavingId){
  const {asgn,load}=runOptimizer(EMPLOYEES,TASKS);
  const leaving=EMPLOYEES.find(e=>e.id===leavingId); if(!leaving)return null;
  const owned=TASKS.filter(t=>asgn[t.id]?.employee===leavingId);
  const needSkills=[...new Set(owned.map(t=>t.type))];
  const totalH=owned.reduce((s,t)=>s+t.minHours,0);
  const rest=EMPLOYEES.filter(e=>e.id!==leavingId);
  const {asgn:nA,load:nL}=runOptimizer(rest,TASKS);
  const plan=owned.map(t=>{ const a=nA[t.id]; return {task:t,newOwner:a?.employee||null,status:a?.employee?(a.partial?"overloaded":"ok"):"failed"}; });
  const cands=rest.map(e=>{
    const ov=needSkills.filter(s=>e.skills.includes(s));
    const sc=ov.length/Math.max(needSkills.length,1);
    const free=e.capacity-(nL[e.id]||0);
    const canAll=free>=totalH;
    const cr=totalH>0?Math.min(free/totalH,1):1;
    return {e,overlap:ov,sc,free,canAll,score:sc*0.6+cr*0.3+(canAll?0.1:0)};
  }).filter(c=>c.sc>0).sort((a,b)=>b.score-a.score).slice(0,5);
  return {leaving,owned,needSkills,totalH,cands,plan};
}

// ─── EMERGENCY ───────────────────────────────────────────────────────────────
function analyzeEmergency(absentIds){
  if(!absentIds.length)return null;
  const {asgn}=runOptimizer(EMPLOYEES,TASKS);
  const avail=EMPLOYEES.filter(e=>!absentIds.includes(e.id));
  const disrupted=TASKS.filter(t=>absentIds.includes(asgn[t.id]?.employee));
  const {asgn:nA,load:nL}=runOptimizer(avail,TASKS);
  const subMap={};
  disrupted.forEach(t=>{
    const a=nA[t.id];
    if(a?.employee&&!a.partial){subMap[t.id]={autoSub:a.employee};return;}
    const cands=avail.filter(e=>e.skills.includes(t.type)).map(e=>{
      const free=e.capacity-(nL[e.id]||0);
      return {e,free,canTake:free>=t.minHours,utilAfter:((nL[e.id]||0)+t.minHours)/e.capacity*100};
    }).sort((a,b)=>(b.canTake?1:0)-(a.canTake?1:0)||b.free-a.free).slice(0,3);
    subMap[t.id]={autoSub:null,cands};
  });
  const autoCov=Object.values(subMap).filter(s=>s.autoSub).length;
  const gaps={};
  EMPLOYEES.filter(e=>absentIds.includes(e.id)).forEach(e=>{
    e.skills.forEach(s=>{
      if(!gaps[s])gaps[s]={lost:0,lostH:0,remain:0,demH:0};
      gaps[s].lost++; gaps[s].lostH+=e.capacity;
    });
  });
  Object.keys(gaps).forEach(s=>{ gaps[s].remain=avail.filter(e=>e.skills.includes(s)).length; gaps[s].demH=disrupted.filter(t=>t.type===s).reduce((a,t)=>a+t.minHours,0); });
  const urgProj={};
  disrupted.forEach(t=>{
    if(!urgProj[t.project])urgProj[t.project]={proj:projMap[t.project],tasks:[],total:0,risk:0,cov:0};
    urgProj[t.project].tasks.push(t); urgProj[t.project].total+=t.minHours;
    if(subMap[t.id]?.autoSub)urgProj[t.project].cov++; else urgProj[t.project].risk++;
  });
  return {absentEmps:EMPLOYEES.filter(e=>absentIds.includes(e.id)),disrupted,urgProj,subMap,gaps,autoCov,total:disrupted.length};
}

// ─── SKILL GAP ADVISOR ───────────────────────────────────────────────────────
function analyzeSkillGap(){
  const totalDemand={A:0,B:0,C:0,D:0,E:0};
  TASKS.forEach(t=>{ totalDemand[t.type]+=t.minHours; });
  const totalSupply={A:0,B:0,C:0,D:0,E:0};
  EMPLOYEES.forEach(e=>{ e.skills.forEach(s=>{ totalSupply[s]+=e.capacity; }); });
  const empCount={A:0,B:0,C:0,D:0,E:0};
  EMPLOYEES.forEach(e=>{ e.skills.forEach(s=>{ empCount[s]++; }); });

  const results=["A","B","C","D","E"].map(skill=>{
    const dem=totalDemand[skill], sup=totalSupply[skill];
    const gap=dem-sup;
    const ratio=sup>0?dem/sup:99;
    const coverage=sup>0?Math.min(sup/dem,1)*100:0;
    const status=ratio<=0.6?"surplus":ratio<=1.0?"healthy":ratio<=1.3?"tight":"critical";
    const hoursShort=Math.max(0,gap);
    // How many employees with that skill needed to cover gap (avg ~30h capacity)
    const hiresNeeded=hoursShort>0?Math.ceil(hoursShort/30):0;
    // Which existing employees could learn this skill (don't have it, have spare capacity)
    const canLearn=EMPLOYEES.filter(e=>!e.skills.includes(skill)&&(e.skills.length<3))
      .map(e=>{ const {load}=runOptimizer(EMPLOYEES,TASKS); const free=e.capacity-(load[e.id]||0); return {e,free}; })
      .filter(c=>c.free>=5).sort((a,b)=>b.free-a.free).slice(0,3);
    return {skill,dem,sup,gap,ratio,coverage,status,hoursShort,hiresNeeded,canLearn,empCount:empCount[skill]};
  });
  const overallOk=results.every(r=>r.status==="healthy"||r.status==="surplus");
  return {results,overallOk};
}

// ─── UI PRIMITIVES ───────────────────────────────────────────────────────────
function Pill({skill,size=24}){
  return <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:size,height:size,borderRadius:"50%",fontSize:size*0.45,fontWeight:700,background:SC[skill],color:"#fff",flexShrink:0,letterSpacing:0}}>{skill}</span>;
}
function Tag({children,color="#60a5fa",bg}){
  return <span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:bg||color+"25",color,border:`1px solid ${color}40`,whiteSpace:"nowrap"}}>{children}</span>;
}
function Card({children,style={},onClick,accent}){
  return <div onClick={onClick} style={{background:"#111827",border:`1px solid ${accent||"#1f2937"}`,borderRadius:10,padding:20,...style,cursor:onClick?"pointer":undefined}}>{children}</div>;
}
function Stat({label,value,color,sub}){
  return (
    <div style={{background:"#111827",border:"1px solid #1f2937",borderRadius:10,padding:"18px 22px"}}>
      <div style={{fontSize:12,color:"#6b7280",fontWeight:500,marginBottom:8,letterSpacing:"0.03em"}}>{label}</div>
      <div style={{fontSize:38,fontWeight:700,color:color||"#f9fafb",lineHeight:1,fontFamily:"'Inter',sans-serif",letterSpacing:"-0.02em"}}>{value}</div>
      {sub&&<div style={{fontSize:12,color:"#9ca3af",marginTop:6}}>{sub}</div>}
    </div>
  );
}
function Bar({pct,color,height=6}){
  return <div style={{height,background:"#1f2937",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(Math.max(pct,0),100)}%`,background:color,borderRadius:99,transition:"width .4s ease"}}/></div>;
}
function SectionTitle({children,icon}){
  return <div style={{fontSize:13,fontWeight:600,color:"#9ca3af",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:16,display:"flex",alignItems:"center",gap:6}}>{icon&&<span>{icon}</span>}{children}</div>;
}
function InfoBanner({type,children}){
  const cfg={success:{bg:"#052e16",border:"#166534",color:"#4ade80"},warning:{bg:"#1c1003",border:"#92400e",color:"#fbbf24"},danger:{bg:"#1c0505",border:"#991b1b",color:"#f87171"},info:{bg:"#0c1a2e",border:"#1e3a5f",color:"#60a5fa"}};
  const c=cfg[type]||cfg.info;
  return <div style={{padding:"12px 16px",borderRadius:8,border:`1px solid ${c.border}`,background:c.bg,color:c.color,fontSize:13,lineHeight:1.5}}>{children}</div>;
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [hlE,setHlE]=useState(null);
  const [hlP,setHlP]=useState(null);
  const [deptId,setDeptId]=useState("");
  const [deptR,setDeptR]=useState(null);
  const [absentIds,setAbsentIds]=useState([]);
  const [emR,setEmR]=useState(null);

  const {asgn,load,pHours}=useMemo(()=>runOptimizer(EMPLOYEES,TASKS),[]);
  const skillGapData=useMemo(()=>analyzeSkillGap(),[]);
  const totalCap=EMPLOYEES.reduce((s,e)=>s+e.capacity,0);
  const totalLoad=Object.values(load).reduce((s,v)=>s+v,0);
  const util=Math.round(totalLoad/totalCap*100);
  const nOk=Object.values(asgn).filter(a=>a.employee&&!a.partial).length;
  const nFail=Object.values(asgn).filter(a=>!a.employee).length;
  const nPart=Object.values(asgn).filter(a=>a.partial).length;
  const tasksByEmp=Object.fromEntries(EMPLOYEES.map(e=>[e.id,[]]));
  TASKS.forEach(t=>{const a=asgn[t.id];if(a?.employee)tasksByEmp[a.employee].push({...t,...a});});
  const toggleAbsent=id=>{setAbsentIds(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);setEmR(null);};

  const criticalGaps=skillGapData.results.filter(r=>r.status==="critical"||r.status==="tight");

  const TABS=[
    {id:"dashboard",label:"Dashboard"},
    {id:"employees",label:"Employees"},
    {id:"projects",label:"Projects"},
    {id:"assignments",label:"Assignments"},
    {id:"skillgap",label:"Skill Gap Advisor",alert:criticalGaps.length},
    {id:"departure",label:"Departure Planner"},
    {id:"emergency",label:"Emergency Coverage"},
  ];

  return (
    <div style={{fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",background:"#0d1117",minHeight:"100vh",color:"#f9fafb"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:6px;height:6px;}::-webkit-scrollbar-track{background:#0d1117;}::-webkit-scrollbar-thumb{background:#374151;border-radius:99px;}
        .tab-btn{cursor:pointer;padding:12px 20px;border:none;border-bottom:2px solid transparent;background:transparent;color:#6b7280;font-family:inherit;font-size:13px;font-weight:500;transition:all .2s;white-space:nowrap;position:relative;}
        .tab-btn.active{color:#f9fafb;border-bottom-color:#3b82f6;font-weight:600;}
        .tab-btn:hover:not(.active){color:#d1d5db;}
        .row-hover:hover{background:#161d2a!important;}
        .emp-chip{cursor:pointer;padding:6px 12px;border:1px solid #1f2937;border-radius:6px;font-size:12px;font-weight:500;background:#111827;color:#9ca3af;transition:all .15s;user-select:none;}
        .emp-chip.absent{background:#1c0505;border-color:#7f1d1d;color:#fca5a5;}
        .emp-chip:hover{border-color:#374151;color:#d1d5db;}
        select{background:#111827;border:1px solid #1f2937;color:#f9fafb;padding:10px 14px;border-radius:8px;font-family:inherit;font-size:13px;outline:none;cursor:pointer;min-width:320px;}
        select:focus{border-color:#3b82f6;}
        .btn{cursor:pointer;padding:9px 20px;border-radius:8px;font-family:inherit;font-size:13px;font-weight:600;transition:all .15s;border:none;}
        .btn-blue{background:#2563eb;color:#fff;}.btn-blue:hover{background:#1d4ed8;}.btn-blue:disabled{background:#1f2937;color:#4b5563;cursor:not-allowed;}
        .btn-ghost{background:transparent;color:#6b7280;border:1px solid #1f2937;}.btn-ghost:hover{color:#d1d5db;border-color:#374151;}
        .status-ok{color:#4ade80;} .status-warn{color:#fbbf24;} .status-bad{color:#f87171;}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:"#111827",borderBottom:"1px solid #1f2937",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:64}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:32,height:32,background:"#2563eb",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚡</div>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#f9fafb",letterSpacing:"-0.01em"}}>Workforce Optimizer</div>
            <div style={{fontSize:12,color:"#6b7280"}}>Capstone · 18 employees · 12 projects · 45 tasks</div>
          </div>
        </div>
        <div style={{display:"flex",gap:24,alignItems:"center"}}>
          {[
            {label:"Utilization", value:`${util}%`, color:util>=70?"#4ade80":util>=50?"#fbbf24":"#f87171"},
            {label:"Tasks Done",  value:`${nOk} / ${TASKS.length}`, color:"#f9fafb"},
            {label:"Skill Alerts",value:criticalGaps.length, color:criticalGaps.length>0?"#f87171":"#4ade80"},
          ].map((s,i)=>(
            <div key={i} style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"#6b7280",fontWeight:500,marginBottom:2}}>{s.label}</div>
              <div style={{fontSize:22,fontWeight:700,color:s.color,letterSpacing:"-0.02em",lineHeight:1}}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{background:"#111827",borderBottom:"1px solid #1f2937",display:"flex",padding:"0 32px",overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.id} className={`tab-btn ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
            {t.label}
            {t.alert>0&&<span style={{marginLeft:6,background:"#ef4444",color:"#fff",borderRadius:99,fontSize:10,fontWeight:700,padding:"1px 6px"}}>{t.alert}</span>}
          </button>
        ))}
      </div>

      <div style={{padding:32,maxWidth:1400,margin:"0 auto"}}>

        {/* ══════════════════════════════════════════════════════════ DASHBOARD */}
        {tab==="dashboard"&&(
          <div>
            {/* KPI row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
              <Stat label="Total Employees" value={EMPLOYEES.length} color="#60a5fa" sub={`${totalCap} total hours/week`}/>
              <Stat label="Active Projects" value={PROJECTS.length} color="#c084fc" sub="6 reimbursable · 6 standard"/>
              <Stat label="Tasks Assigned" value={`${nOk} / ${TASKS.length}`} color="#4ade80" sub={nFail+nPart>0?`${nFail+nPart} need attention`:"All tasks covered"}/>
              <Stat label="Workforce Utilization" value={`${util}%`} color={util>=70?"#4ade80":util>=50?"#fbbf24":"#f87171"} sub={`${totalLoad} of ${totalCap} hours used`}/>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
              {/* Capacity bars */}
              <Card>
                <SectionTitle icon="👥">Employee Utilization</SectionTitle>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {EMPLOYEES.map(e=>{
                    const l=load[e.id]||0, p=Math.round(l/e.capacity*100);
                    const col=p>100?"#f87171":p>80?"#fbbf24":"#60a5fa";
                    return (
                      <div key={e.id} style={{display:"grid",gridTemplateColumns:"50px 1fr 80px 42px",gap:8,alignItems:"center"}}>
                        <span style={{fontSize:13,color:"#d1d5db",fontWeight:600}}>{e.id}</span>
                        <Bar pct={p} color={col} height={7}/>
                        <span style={{fontSize:12,color:"#9ca3af",textAlign:"right"}}>{l} / {e.capacity} h</span>
                        <span style={{fontSize:12,fontWeight:600,color:col,textAlign:"right"}}>{p}%</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Skill demand vs supply */}
              <Card>
                <SectionTitle icon="🎯">Skill Demand vs Supply</SectionTitle>
                <div style={{display:"flex",flexDirection:"column",gap:20}}>
                  {["A","B","C","D","E"].map(sk=>{
                    const dem=TASKS.filter(t=>t.type===sk).reduce((s,t)=>s+t.minHours,0);
                    const sup=EMPLOYEES.filter(e=>e.skills.includes(sk)).reduce((s,e)=>s+e.capacity,0);
                    const pct=sup>0?Math.min(dem/sup*100,100):100;
                    const ratio=sup>0?dem/sup:99;
                    const status=ratio>1.3?"critical":ratio>1?"tight":ratio>0.6?"healthy":"surplus";
                    const statusColor=status==="critical"?"#f87171":status==="tight"?"#fbbf24":status==="surplus"?"#9ca3af":"#4ade80";
                    const nEmp=EMPLOYEES.filter(e=>e.skills.includes(sk)).length;
                    const nTask=TASKS.filter(t=>t.type===sk).length;
                    return (
                      <div key={sk}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <Pill skill={sk} size={26}/>
                            <div>
                              <span style={{fontSize:13,color:"#e5e7eb",fontWeight:600}}>Skill {sk}</span>
                              <span style={{fontSize:12,color:"#6b7280",marginLeft:8}}>{nTask} tasks · {nEmp} employees</span>
                            </div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{fontSize:12,color:"#6b7280"}}>{dem}h demand / {sup}h supply</span>
                            <Tag color={statusColor}>{status.toUpperCase()}</Tag>
                          </div>
                        </div>
                        <Bar pct={pct} color={statusColor} height={8}/>
                      </div>
                    );
                  })}
                </div>
                {criticalGaps.length>0&&(
                  <div style={{marginTop:20}}>
                    <InfoBanner type="danger">⚠ {criticalGaps.length} skill(s) under pressure — see <strong>Skill Gap Advisor</strong> for investment recommendations.</InfoBanner>
                  </div>
                )}
              </Card>
            </div>

            {/* Project table */}
            <Card>
              <SectionTitle icon="📁">Project Summary</SectionTitle>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{borderBottom:"1px solid #1f2937"}}>
                    {["Project","Type","Demand","Assigned","Budget Cap","Coverage","Status"].map(h=>(
                      <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:12,fontWeight:600,color:"#6b7280",letterSpacing:"0.04em"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PROJECTS.map(p=>{
                    const dem=TASKS.filter(t=>t.project===p.id).reduce((s,t)=>s+t.minHours,0);
                    const as=pHours[p.id]||0;
                    const ov=p.maxTotal&&as>p.maxTotal;
                    const ok=as>=dem;
                    const covPct=dem>0?Math.round(as/dem*100):100;
                    return (
                      <tr key={p.id} className="row-hover" style={{borderBottom:"1px solid #161d2a"}}>
                        <td style={{padding:"12px 14px",fontWeight:700,color:"#f9fafb",fontSize:14}}>{p.id}</td>
                        <td style={{padding:"12px 14px"}}><Tag color={p.reimbursable?"#60a5fa":"#c084fc"}>{p.reimbursable?"Reimbursable":"Non-Reimb."}</Tag></td>
                        <td style={{padding:"12px 14px",fontSize:14,color:"#d1d5db",fontWeight:500}}>{dem} h</td>
                        <td style={{padding:"12px 14px",fontSize:14,color:"#f9fafb",fontWeight:600}}>{as} h</td>
                        <td style={{padding:"12px 14px",fontSize:14,color:"#9ca3af"}}>{p.maxTotal?`${p.maxTotal} h`:"—"}</td>
                        <td style={{padding:"12px 14px",width:120}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{flex:1}}><Bar pct={covPct} color={ov?"#f87171":ok?"#4ade80":"#fbbf24"} height={6}/></div>
                            <span style={{fontSize:12,color:"#9ca3af",minWidth:32,textAlign:"right"}}>{covPct}%</span>
                          </div>
                        </td>
                        <td style={{padding:"12px 14px"}}><Tag color={ov?"#f87171":ok?"#4ade80":"#fbbf24"}>{ov?"Over Budget":ok?"Fulfilled":"Partial"}</Tag></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ EMPLOYEES */}
        {tab==="employees"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {EMPLOYEES.map(e=>{
              const l=load[e.id]||0, p=Math.round(l/e.capacity*100), tasks=tasksByEmp[e.id]||[], open=hlE===e.id;
              const col=p>100?"#f87171":p>80?"#fbbf24":"#4ade80";
              return (
                <Card key={e.id} onClick={()=>setHlE(open?null:e.id)} accent={open?"#3b82f6":undefined} style={{transition:"border-color .2s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                    <div>
                      <div style={{fontSize:18,fontWeight:700,color:"#f9fafb",letterSpacing:"-0.01em"}}>{e.id}</div>
                      <div style={{fontSize:13,color:"#6b7280",marginTop:3}}>{e.capacity} h/week capacity</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:26,fontWeight:700,color:col,lineHeight:1,letterSpacing:"-0.02em"}}>{p}%</div>
                      <div style={{fontSize:12,color:"#6b7280",marginTop:3}}>{l} h assigned</div>
                    </div>
                  </div>
                  <Bar pct={p} color={col} height={6}/>
                  <div style={{display:"flex",gap:6,marginTop:12,flexWrap:"wrap"}}>
                    {e.skills.map(s=><Pill key={s} skill={s} size={28}/>)}
                  </div>
                  {open&&(
                    <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid #1f2937"}}>
                      <div style={{fontSize:12,fontWeight:600,color:"#6b7280",letterSpacing:"0.05em",marginBottom:10}}>ASSIGNED TASKS</div>
                      {tasks.length===0
                        ?<div style={{fontSize:13,color:"#4b5563"}}>No tasks assigned</div>
                        :tasks.map(t=>(
                          <div key={t.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #161d2a",fontSize:13}}>
                            <span style={{color:"#d1d5db",fontWeight:500}}>{t.id} <span style={{color:SC[t.type],marginLeft:4}}>({t.type})</span></span>
                            <span style={{color:"#6b7280"}}>{t.project} · {t.minHours} h</span>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ PROJECTS */}
        {tab==="projects"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
            {PROJECTS.map(p=>{
              const pt=TASKS.filter(t=>t.project===p.id), dem=pt.reduce((s,t)=>s+t.minHours,0), as=pHours[p.id]||0, open=hlP===p.id;
              const ok=as>=dem, ov=p.maxTotal&&as>p.maxTotal;
              const valColor=ov?"#f87171":ok?"#4ade80":"#fbbf24";
              return (
                <Card key={p.id} onClick={()=>setHlP(open?null:p.id)} accent={open?"#a855f7":undefined} style={{transition:"border-color .2s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                    <div>
                      <div style={{fontSize:20,fontWeight:700,color:"#f9fafb",letterSpacing:"-0.01em"}}>{p.id}</div>
                      <div style={{marginTop:6}}><Tag color={p.reimbursable?"#60a5fa":"#c084fc"}>{p.reimbursable?"Reimbursable":"Non-Reimbursable"}</Tag></div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:28,fontWeight:700,color:valColor,lineHeight:1,letterSpacing:"-0.02em"}}>{as} h</div>
                      <div style={{fontSize:13,color:"#6b7280",marginTop:3}}>of {dem} h demand</div>
                    </div>
                  </div>
                  {p.maxTotal&&(
                    <div style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#6b7280",marginBottom:5}}>
                        <span>Budget usage</span><span style={{fontWeight:600,color:"#d1d5db"}}>{as} / {p.maxTotal} h</span>
                      </div>
                      <Bar pct={as/p.maxTotal*100} color={ov?"#f87171":"#4ade80"} height={7}/>
                    </div>
                  )}
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {["A","B","C","D","E"].map(s=>{
                      const c=pt.filter(t=>t.type===s).length;
                      return c?<div key={s} style={{display:"flex",alignItems:"center",gap:4,background:"#1f2937",padding:"3px 8px",borderRadius:6,fontSize:12,color:"#9ca3af"}}><Pill skill={s} size={16}/> {c} task{c>1?"s":""}</div>:null;
                    })}
                  </div>
                  {open&&(
                    <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid #1f2937"}}>
                      <div style={{fontSize:12,fontWeight:600,color:"#6b7280",letterSpacing:"0.05em",marginBottom:10}}>TASK BREAKDOWN</div>
                      {pt.map(t=>{
                        const a=asgn[t.id];
                        return (
                          <div key={t.id} style={{display:"grid",gridTemplateColumns:"60px 28px 60px 1fr",gap:10,padding:"7px 0",borderBottom:"1px solid #161d2a",fontSize:13,alignItems:"center"}}>
                            <span style={{color:"#d1d5db",fontWeight:600}}>{t.id}</span>
                            <Pill skill={t.type} size={20}/>
                            <span style={{color:"#6b7280"}}>{t.minHours} h</span>
                            <span style={{color:a?.employee?"#4ade80":"#f87171",fontWeight:a?.employee?500:600}}>{a?.employee||"Unassigned"}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ ASSIGNMENTS */}
        {tab==="assignments"&&(
          <Card>
            <SectionTitle icon="📋">Full Task Assignment Matrix</SectionTitle>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:"2px solid #1f2937"}}>
                  {["Task","Project","Skill","Min Hours","Assigned To","Status"].map(h=>(
                    <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:12,fontWeight:600,color:"#6b7280",letterSpacing:"0.04em"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TASKS.map(t=>{
                  const a=asgn[t.id], s=!a?.employee?"Failed":a.partial?"Overloaded":"OK";
                  return (
                    <tr key={t.id} className="row-hover" style={{borderBottom:"1px solid #161d2a"}}>
                      <td style={{padding:"10px 14px",fontWeight:700,color:"#f9fafb",fontSize:14}}>{t.id}</td>
                      <td style={{padding:"10px 14px"}}>
                        <span style={{fontSize:13,color:"#d1d5db",marginRight:8}}>{t.project}</span>
                        <Tag color={projMap[t.project]?.reimbursable?"#60a5fa":"#c084fc"}>{projMap[t.project]?.reimbursable?"R":"N"}</Tag>
                      </td>
                      <td style={{padding:"10px 14px"}}><Pill skill={t.type} size={26}/></td>
                      <td style={{padding:"10px 14px",fontSize:14,color:"#d1d5db",fontWeight:500}}>{t.minHours} h</td>
                      <td style={{padding:"10px 14px",fontSize:14,color:a?.employee?"#f9fafb":"#4b5563",fontWeight:a?.employee?600:400}}>{a?.employee||"—"}</td>
                      <td style={{padding:"10px 14px"}}><Tag color={s==="Failed"?"#f87171":s==="Overloaded"?"#fbbf24":"#4ade80"}>{s}</Tag></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}

        {/* ══════════════════════════════════════════════════════════ SKILL GAP ADVISOR */}
        {tab==="skillgap"&&(()=>{
          const {results,overallOk}=skillGapData;
          return (
            <div>
              {/* Overall verdict */}
              <div style={{marginBottom:24}}>
                {overallOk
                  ?<InfoBanner type="success">✅ Your current team's skill coverage is sufficient for all active projects. No immediate investment required — but monitor Skill E closely.</InfoBanner>
                  :<InfoBanner type="danger">⚠ Current skill supply cannot meet project demand. Immediate investment recommended for the skills highlighted below.</InfoBanner>
                }
              </div>

              {/* Summary KPIs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
                {[
                  {label:"Skills Healthy",   value:results.filter(r=>r.status==="healthy"||r.status==="surplus").length+"/5", color:"#4ade80"},
                  {label:"Tight Supply",      value:results.filter(r=>r.status==="tight").length, color:"#fbbf24"},
                  {label:"Critical Gaps",     value:results.filter(r=>r.status==="critical").length, color:"#f87171"},
                  {label:"Est. Hires Needed", value:results.reduce((s,r)=>s+r.hiresNeeded,0), color:"#c084fc"},
                ].map(k=><Stat key={k.label} label={k.label} value={k.value} color={k.color}/>)}
              </div>

              {/* Per-skill cards */}
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {results.sort((a,b)=>{const o={"critical":0,"tight":1,"healthy":2,"surplus":3};return o[a.status]-o[b.status];}).map(r=>{
                  const statusColor=r.status==="critical"?"#f87171":r.status==="tight"?"#fbbf24":r.status==="surplus"?"#9ca3af":"#4ade80";
                  const isBad=r.status==="critical"||r.status==="tight";
                  return (
                    <Card key={r.skill} accent={isBad?statusColor+"66":undefined}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:16}}>
                        <div style={{display:"flex",alignItems:"center",gap:14}}>
                          <Pill skill={r.skill} size={44}/>
                          <div>
                            <div style={{fontSize:20,fontWeight:700,color:"#f9fafb",marginBottom:4}}>Skill {r.skill}</div>
                            <Tag color={statusColor}>{r.status.toUpperCase()}</Tag>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
                          {[
                            {l:"Demand",   v:`${r.dem} h`, c:"#f9fafb"},
                            {l:"Supply",   v:`${r.sup} h`, c:"#f9fafb"},
                            {l:"Gap",      v:r.gap>0?`−${r.gap} h`:`+${Math.abs(r.gap)} h`, c:r.gap>0?"#f87171":"#4ade80"},
                            {l:"Employees",v:r.empCount, c:"#f9fafb"},
                            {l:"Coverage", v:`${r.coverage.toFixed(0)}%`, c:statusColor},
                          ].map(s=>(
                            <div key={s.l} style={{textAlign:"center",minWidth:72}}>
                              <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>{s.l}</div>
                              <div style={{fontSize:22,fontWeight:700,color:s.c,lineHeight:1,letterSpacing:"-0.02em"}}>{s.v}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Coverage bar */}
                      <div style={{marginBottom:isBad?20:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#6b7280",marginBottom:6}}>
                          <span>Supply vs Demand coverage</span>
                          <span style={{color:statusColor,fontWeight:600}}>{r.coverage.toFixed(0)}% covered</span>
                        </div>
                        <Bar pct={r.coverage} color={statusColor} height={10}/>
                      </div>

                      {/* Recommendations */}
                      {isBad&&(
                        <div style={{marginTop:20,paddingTop:20,borderTop:"1px solid #1f2937",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>

                          {/* Option A: Upskill existing */}
                          <div style={{background:"#0c1a2e",border:"1px solid #1e3a5f",borderRadius:8,padding:16}}>
                            <div style={{fontSize:13,fontWeight:700,color:"#60a5fa",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                              <span style={{fontSize:16}}>📚</span> Option A — Upskill Existing Staff
                            </div>
                            {r.canLearn.length===0
                              ?<div style={{fontSize:13,color:"#6b7280"}}>No employees have bandwidth to learn this skill right now.</div>
                              :(<>
                                <div style={{fontSize:12,color:"#9ca3af",marginBottom:10}}>These employees have spare capacity and fewer than 3 skills — good upskilling candidates:</div>
                                {r.canLearn.map(({e:emp,free})=>(
                                  <div key={emp.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:"#111827",borderRadius:6,marginBottom:6}}>
                                    <div>
                                      <span style={{fontSize:14,fontWeight:700,color:"#f9fafb"}}>{emp.id}</span>
                                      <div style={{display:"flex",gap:4,marginTop:4}}>{emp.skills.map(s=><Pill key={s} skill={s} size={18}/>)}</div>
                                    </div>
                                    <div style={{textAlign:"right"}}>
                                      <div style={{fontSize:13,color:"#4ade80",fontWeight:600}}>{free} h free</div>
                                      <div style={{fontSize:11,color:"#6b7280"}}>{emp.capacity} h capacity</div>
                                    </div>
                                  </div>
                                ))}
                                <div style={{marginTop:10,fontSize:12,color:"#6b7280",background:"#111827",padding:"8px 12px",borderRadius:6}}>
                                  💡 Training investment would add ~{r.canLearn.reduce((s,c)=>s+c.free,0)} h of Skill {r.skill} capacity without new hires.
                                </div>
                              </>)
                            }
                          </div>

                          {/* Option B: Hire */}
                          <div style={{background:"#0d1a0d",border:"1px solid #166534",borderRadius:8,padding:16}}>
                            <div style={{fontSize:13,fontWeight:700,color:"#4ade80",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                              <span style={{fontSize:16}}>🧑‍💼</span> Option B — Hire New Employee
                            </div>
                            <div style={{fontSize:12,color:"#9ca3af",marginBottom:12}}>To fully close the gap without overloading existing staff:</div>
                            <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:12}}>
                              <div style={{background:"#111827",borderRadius:8,padding:"12px 16px",flex:1,minWidth:100}}>
                                <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>Hours short</div>
                                <div style={{fontSize:24,fontWeight:700,color:"#f87171"}}>{r.hoursShort} h</div>
                              </div>
                              <div style={{background:"#111827",borderRadius:8,padding:"12px 16px",flex:1,minWidth:100}}>
                                <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>Est. hires needed</div>
                                <div style={{fontSize:24,fontWeight:700,color:"#4ade80"}}>{r.hiresNeeded}</div>
                                <div style={{fontSize:11,color:"#6b7280"}}>@ avg 30 h/week</div>
                              </div>
                            </div>
                            <div style={{fontSize:12,color:"#6b7280",background:"#111827",padding:"8px 12px",borderRadius:6}}>
                              💡 Ideal hire profile: Skill {r.skill}{r.status==="critical"&&r.gap>20?" specialist (high hours needed)":" generalist"}. Look for candidates who also have {["A","B","C","D","E"].filter(s=>s!==r.skill&&TASKS.filter(t=>t.type===s).length>0).slice(0,2).join(" or ")} skills for versatility.
                            </div>
                          </div>
                        </div>
                      )}

                      {!isBad&&r.status==="surplus"&&(
                        <div style={{marginTop:12,padding:"10px 14px",background:"#1f2937",borderRadius:6,fontSize:13,color:"#9ca3af"}}>
                          ✓ Surplus supply — consider reassigning some Skill {r.skill} capacity to support tighter skill areas.
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ══════════════════════════════════════════════════════════ DEPARTURE */}
        {tab==="departure"&&(
          <div>
            <InfoBanner type="info" style={{marginBottom:24}}>
              Select an employee who is leaving. The engine analyzes their task portfolio, identifies coverage gaps, and ranks the best internal replacements by skill overlap and available capacity.
            </InfoBanner>
            <div style={{marginBottom:24}}/>

            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:28,flexWrap:"wrap"}}>
              <select value={deptId} onChange={e=>{setDeptId(e.target.value);setDeptR(null);}}>
                <option value="">— Select departing employee —</option>
                {EMPLOYEES.map(e=><option key={e.id} value={e.id}>{e.id} · Skills: {e.skills.join(", ")} · {e.capacity} h/week</option>)}
              </select>
              <button className="btn btn-blue" disabled={!deptId} onClick={()=>setDeptR(analyzeDeparture(deptId))}>Analyze Departure</button>
              {deptR&&<button className="btn btn-ghost" onClick={()=>{setDeptId("");setDeptR(null);}}>Clear</button>}
            </div>

            {!deptR&&!deptId&&(
              <div style={{textAlign:"center",padding:"80px 0",color:"#374151"}}>
                <div style={{fontSize:64,marginBottom:20}}>👤</div>
                <div style={{fontSize:20,fontWeight:700,color:"#6b7280",marginBottom:8}}>Departure Impact Planner</div>
                <div style={{fontSize:14,color:"#4b5563"}}>Choose an employee above to see who can cover their work and keep all projects on track.</div>
              </div>
            )}

            {deptR&&(()=>{
              const {leaving,owned,needSkills,totalH,cands,plan}=deptR;
              const autoOk=plan.filter(p=>p.status==="ok").length;
              const atRisk=plan.filter(p=>p.status!=="ok").length;
              return (
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
                    <Stat label="Tasks Owned" value={owned.length} color="#f9fafb"/>
                    <Stat label="Hours to Cover" value={`${totalH} h`} color="#fbbf24"/>
                    <Stat label="Auto-Redistributed" value={autoOk} color="#4ade80"/>
                    <Stat label="Needs Manual Cover" value={atRisk} color={atRisk>0?"#f87171":"#4ade80"} sub={atRisk>0?"Action required":"All tasks handled"}/>
                  </div>

                  <Card style={{marginBottom:20}}>
                    <SectionTitle>Departing Employee</SectionTitle>
                    <div style={{display:"flex",gap:32,alignItems:"center",flexWrap:"wrap"}}>
                      <div>
                        <div style={{fontSize:24,fontWeight:700,color:"#f9fafb",marginBottom:4}}>{leaving.id}</div>
                        <div style={{fontSize:14,color:"#6b7280"}}>{leaving.capacity} h/week capacity</div>
                      </div>
                      <div>
                        <div style={{fontSize:12,color:"#6b7280",marginBottom:8,fontWeight:600,letterSpacing:"0.05em"}}>CURRENT SKILLS</div>
                        <div style={{display:"flex",gap:8}}>{leaving.skills.map(s=><Pill key={s} skill={s} size={32}/>)}</div>
                      </div>
                      <div>
                        <div style={{fontSize:12,color:"#6b7280",marginBottom:8,fontWeight:600,letterSpacing:"0.05em"}}>SKILLS NEEDED FOR COVERAGE</div>
                        <div style={{display:"flex",gap:8}}>{needSkills.map(s=><Pill key={s} skill={s} size={32}/>)}</div>
                      </div>
                      {atRisk>0&&<InfoBanner type="danger">⚠ {atRisk} task(s) cannot be auto-covered without a replacement</InfoBanner>}
                    </div>
                  </Card>

                  <Card style={{marginBottom:20}}>
                    <SectionTitle>Top Replacement Candidates</SectionTitle>
                    {cands.length===0&&<div style={{fontSize:14,color:"#f87171"}}>No internal candidates found. External hire recommended.</div>}
                    {cands.map((c,i)=>(
                      <div key={c.e.id} style={{padding:"18px 0",borderBottom:"1px solid #1f2937",display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap"}}>
                        <div style={{minWidth:44,textAlign:"center"}}>
                          <div style={{fontSize:28,fontWeight:700,color:i===0?"#fbbf24":"#374151",lineHeight:1}}>#{i+1}</div>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}>
                            <span style={{fontSize:18,fontWeight:700,color:"#f9fafb"}}>{c.e.id}</span>
                            {i===0&&<Tag color="#fbbf24">Best Match</Tag>}
                            <Tag color={c.canAll?"#4ade80":"#fbbf24"}>{c.canAll?"Can absorb all hours":"Partial coverage"}</Tag>
                          </div>
                          <div style={{display:"flex",gap:24,flexWrap:"wrap",marginBottom:12}}>
                            <div>
                              <div style={{fontSize:12,color:"#6b7280",marginBottom:6,fontWeight:600}}>SKILL SET</div>
                              <div style={{display:"flex",gap:6}}>{c.e.skills.map(s=><Pill key={s} skill={s} size={26}/>)}</div>
                            </div>
                            <div>
                              <div style={{fontSize:12,color:"#6b7280",marginBottom:6,fontWeight:600}}>SKILL COVERAGE</div>
                              <div style={{display:"flex",alignItems:"center",gap:10}}>
                                <div style={{width:80}}><Bar pct={c.sc*100} color="#60a5fa" height={8}/></div>
                                <span style={{fontSize:14,color:"#60a5fa",fontWeight:600}}>{Math.round(c.sc*100)}%</span>
                              </div>
                            </div>
                            <div>
                              <div style={{fontSize:12,color:"#6b7280",marginBottom:6,fontWeight:600}}>FREE HOURS</div>
                              <span style={{fontSize:18,fontWeight:700,color:c.canAll?"#4ade80":"#fbbf24"}}>{c.free} h</span>
                              <span style={{fontSize:12,color:"#6b7280",marginLeft:4}}>of {c.e.capacity} h</span>
                            </div>
                            <div>
                              <div style={{fontSize:12,color:"#6b7280",marginBottom:6,fontWeight:600}}>FIT SCORE</div>
                              <span style={{fontSize:22,fontWeight:700,color:i===0?"#fbbf24":"#6b7280"}}>{Math.round(c.score*100)}</span>
                            </div>
                          </div>
                          {c.sc<1&&<div style={{fontSize:13,color:"#fbbf24"}}>⚠ Missing skills: {needSkills.filter(s=>!c.e.skills.includes(s)).join(", ")} — additional resource needed for these tasks.</div>}
                        </div>
                      </div>
                    ))}
                  </Card>

                  <Card>
                    <SectionTitle>Task Redistribution Plan</SectionTitle>
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead><tr style={{borderBottom:"2px solid #1f2937"}}>{["Task","Project","Skill","Hours","New Owner","Status"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:12,fontWeight:600,color:"#6b7280",letterSpacing:"0.04em"}}>{h}</th>)}</tr></thead>
                      <tbody>{plan.map(({task:t,newOwner,status})=>(
                        <tr key={t.id} className="row-hover" style={{borderBottom:"1px solid #161d2a"}}>
                          <td style={{padding:"10px 14px",fontWeight:700,color:"#f9fafb",fontSize:14}}>{t.id}</td>
                          <td style={{padding:"10px 14px",fontSize:13,color:"#d1d5db"}}>{t.project}</td>
                          <td style={{padding:"10px 14px"}}><Pill skill={t.type} size={24}/></td>
                          <td style={{padding:"10px 14px",fontSize:14,color:"#d1d5db"}}>{t.minHours} h</td>
                          <td style={{padding:"10px 14px",fontSize:14,color:newOwner?"#f9fafb":"#4b5563",fontWeight:newOwner?600:400}}>{newOwner||"—"}</td>
                          <td style={{padding:"10px 14px"}}><Tag color={status==="failed"?"#f87171":status==="overloaded"?"#fbbf24":"#4ade80"}>{status==="ok"?"Reassigned":status.charAt(0).toUpperCase()+status.slice(1)}</Tag></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </Card>
                </div>
              );
            })()}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ EMERGENCY */}
        {tab==="emergency"&&(
          <div>
            <InfoBanner type="danger">
              Mark employees as absent (sick, unavailable). The engine instantly identifies disrupted tasks and recommends the best available subs — reimbursable projects are treated as highest priority.
            </InfoBanner>
            <div style={{marginBottom:24}}/>

            <Card style={{marginBottom:24}}>
              <SectionTitle icon="🚨">Mark Absent Employees</SectionTitle>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                {EMPLOYEES.map(e=>(
                  <button key={e.id} className={`emp-chip ${absentIds.includes(e.id)?"absent":""}`} onClick={()=>toggleAbsent(e.id)}>
                    {absentIds.includes(e.id)?"✕ ":""}{e.id} <span style={{opacity:.7}}>[{e.skills.join("")}]</span>
                  </button>
                ))}
              </div>
              <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                <button className="btn btn-blue" disabled={absentIds.length===0} onClick={()=>setEmR(analyzeEmergency(absentIds))}>Run Coverage Analysis</button>
                {absentIds.length>0&&<button className="btn btn-ghost" onClick={()=>{setAbsentIds([]);setEmR(null);}}>Clear All</button>}
                {absentIds.length>0&&<span style={{fontSize:13,color:"#fca5a5",fontWeight:500}}>Absent: {absentIds.join(", ")}</span>}
              </div>
            </Card>

            {!emR&&absentIds.length===0&&(
              <div style={{textAlign:"center",padding:"70px 0"}}>
                <div style={{fontSize:64,marginBottom:20}}>🚨</div>
                <div style={{fontSize:20,fontWeight:700,color:"#374151",marginBottom:8}}>Emergency Coverage Planner</div>
                <div style={{fontSize:14,color:"#4b5563"}}>Toggle absent employees above, then run the analysis for instant sub recommendations prioritized by project urgency.</div>
              </div>
            )}

            {emR&&(()=>{
              const {absentEmps,disrupted,urgProj,subMap,gaps,autoCov,total}=emR;
              const atRiskN=total-autoCov;
              return (
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:20}}>
                    <Stat label="Employees Absent" value={absentEmps.length} color="#f87171"/>
                    <Stat label="Tasks Disrupted"  value={total} color="#fbbf24"/>
                    <Stat label="Auto-Covered"     value={autoCov} color="#4ade80"/>
                    <Stat label="Needs Manual Sub" value={atRiskN} color={atRiskN>0?"#f87171":"#4ade80"} sub={atRiskN>0?"Action required":"Full coverage"}/>
                  </div>

                  <div style={{marginBottom:20}}>
                    <InfoBanner type={atRiskN===0?"success":"danger"}>
                      {atRiskN===0?`✅ All ${total} disrupted tasks can be auto-redistributed. Full coverage maintained.`:`⚠ ${atRiskN} task(s) require manual reassignment. See recommendations below.`}
                    </InfoBanner>
                  </div>

                  {Object.keys(gaps).length>0&&(
                    <Card style={{marginBottom:20}}>
                      <SectionTitle icon="📊">Skill Gap Impact</SectionTitle>
                      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                        {Object.entries(gaps).map(([sk,g])=>(
                          <div key={sk} style={{background:"#1f2937",borderRadius:8,padding:"14px 18px",minWidth:160,border:`1px solid ${SC[sk]}33`}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><Pill skill={sk} size={26}/><span style={{fontSize:15,fontWeight:700,color:SC[sk]}}>Skill {sk}</span></div>
                            <div style={{fontSize:13,color:"#f87171",marginBottom:4}}>Lost: {g.lost} emp · {g.lostH} h</div>
                            <div style={{fontSize:13,color:"#9ca3af",marginBottom:4}}>Available: {g.remain} employees</div>
                            <div style={{fontSize:13,color:"#fbbf24"}}>At-risk demand: {g.demH} h</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {Object.keys(urgProj).length>0&&(
                    <Card style={{marginBottom:20}}>
                      <SectionTitle icon="📁">Affected Projects — Priority Order</SectionTitle>
                      {Object.entries(urgProj).sort((a,b)=>(b[1].proj?.reimbursable?1:0)-(a[1].proj?.reimbursable?1:0)||b[1].risk-a[1].risk).map(([pid,info])=>(
                        <div key={pid} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:"1px solid #1f2937",flexWrap:"wrap"}}>
                          <span style={{fontSize:16,fontWeight:700,color:info.proj?.reimbursable?"#60a5fa":"#c084fc",minWidth:52}}>{pid}</span>
                          <Tag color={info.proj?.reimbursable?"#60a5fa":"#c084fc"}>{info.proj?.reimbursable?"Reimbursable · High Priority":"Non-Reimbursable"}</Tag>
                          <span style={{flex:1,fontSize:13,color:"#6b7280"}}>{info.tasks.length} tasks · {info.total} h</span>
                          <div style={{display:"flex",gap:8}}>
                            {info.cov>0&&<Tag color="#4ade80">{info.cov} auto-covered</Tag>}
                            {info.risk>0&&<Tag color="#f87171">{info.risk} at risk</Tag>}
                          </div>
                        </div>
                      ))}
                    </Card>
                  )}

                  <Card>
                    <SectionTitle icon="👥">Immediate Sub Recommendations</SectionTitle>
                    {disrupted.sort((a,b)=>(projMap[b.project]?.reimbursable?1:0)-(projMap[a.project]?.reimbursable?1:0)||b.minHours-a.minHours).map(t=>{
                      const sub=subMap[t.id], p=projMap[t.project];
                      return (
                        <div key={t.id} style={{padding:"16px 0",borderBottom:"1px solid #1f2937"}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
                            <Pill skill={t.type} size={28}/>
                            <span style={{fontWeight:700,color:"#f9fafb",fontSize:15}}>{t.id}</span>
                            <span style={{fontSize:13,color:"#6b7280"}}>{t.project} · {t.minHours} h</span>
                            <Tag color={p?.reimbursable?"#60a5fa":"#c084fc"}>{p?.reimbursable?"High Priority":"Standard"}</Tag>
                            {sub?.autoSub?<Tag color="#4ade80">Auto-assigned → {sub.autoSub}</Tag>:<Tag color="#f87171">Needs Manual Assignment</Tag>}
                          </div>
                          {!sub?.autoSub&&sub?.cands?.length>0&&(
                            <div style={{marginLeft:36}}>
                              <div style={{fontSize:12,color:"#6b7280",marginBottom:8,fontWeight:600,letterSpacing:"0.05em"}}>BEST AVAILABLE SUBS:</div>
                              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                                {sub.cands.map((c,i)=>(
                                  <div key={c.e.id} style={{background:i===0?(c.canTake?"#052e16":"#1c1003"):"#1f2937",border:`1px solid ${i===0?(c.canTake?"#166534":"#92400e"):"#374151"}`,borderRadius:8,padding:"10px 16px",minWidth:140}}>
                                    <div style={{fontSize:14,fontWeight:700,color:"#f9fafb",marginBottom:4}}>{c.e.id}</div>
                                    <div style={{fontSize:12,color:"#9ca3af",marginBottom:4}}>{c.free} h free · {Math.round(c.utilAfter)}% after</div>
                                    <div style={{fontSize:12,color:c.canTake?"#4ade80":"#fbbf24",fontWeight:600}}>{c.canTake?"✓ No overload":"⚡ Slight overload"}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {!sub?.autoSub&&(!sub?.cands||sub.cands.length===0)&&(
                            <div style={{marginLeft:36,fontSize:13,color:"#f87171"}}>❌ No available employees with Skill {t.type} — consider external hire or deferral.</div>
                          )}
                        </div>
                      );
                    })}
                  </Card>
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
}
