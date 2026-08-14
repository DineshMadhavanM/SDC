/* ============================================================
   MS_SIM.JS — PLAYKERS Microservices Interactive Simulator
   9 scenarios: Monolith Problem → Split → API Request →
   Sync → Async → Service Discovery → Load Balancing →
   Auto Scaling → Circuit Breaker → Saga → Failure Isolation
   ============================================================ */

// ── Palette ─────────────────────────────────────────────────
const MS = {
  bg:'#0f1117', bg2:'#161b27', bg3:'#1e2535', border:'#2a3347',
  accent:'#6366f1', a2:'#818cf8',
  green:'#22c55e', yellow:'#f59e0b', red:'#ef4444',
  cyan:'#06b6d4', pink:'#ec4899', blue:'#3b82f6',
  orange:'#f97316', purple:'#a855f7',
  text:'#e2e8f0', t2:'#94a3b8', t3:'#64748b',
};

// ── Service palette ──────────────────────────────────────────
const SVC = {
  user:     { label:'User Service',         icon:'👤', color:'#6366f1', db:'User DB'        },
  match:    { label:'Match Service',         icon:'🏏', color:'#22c55e', db:'Match DB'        },
  booking:  { label:'Booking Service',       icon:'📅', color:'#06b6d4', db:'Booking DB'      },
  payment:  { label:'Payment Service',       icon:'💳', color:'#f59e0b', db:'Payment DB'      },
  tourney:  { label:'Tournament Service',    icon:'🏆', color:'#a855f7', db:'Tournament DB'   },
  scoring:  { label:'Scoring Service',       icon:'📊', color:'#f97316', db:'Scoring DB'      },
  notify:   { label:'Notification Service',  icon:'🔔', color:'#ec4899', db:'Notify DB'       },
};

// ── Simulator state ─────────────────────────────────────────
let msSimScenario = 0;
let msSimStep = 0;
let msSimRunning = false;
let msSimTimer = null;
let msSimPaused = false;

const SCENARIOS = [
  'monolith','split','api-request','sync','async',
  'discovery','loadbalance','autoscale','circuit','saga','isolation'
];

function msSimInit() {
  const root = document.getElementById('msSimRoot');
  if (!root) return;
  root.innerHTML = buildMsSimHTML();
  msSimScenario = 0; msSimStep = 0; msSimRunning = false; msSimPaused = false;
  // show first step SVG immediately so diagram is never blank
  msSimStep = 1;
  msSimRender();
  msSimStep = 0; // reset step counter — user still needs to click Run to advance
  // re-render log to show "click run" message but keep the diagram
  const log = document.getElementById('mssLog');
  if (log) log.innerHTML = `<code>▶ Click <strong>Run</strong> to start — or use <strong>Step</strong> to advance manually</code>`;
}

// ── HTML shell ───────────────────────────────────────────────
function buildMsSimHTML() {
  return `<style>
.mss-wrap { font-family:'Inter',sans-serif; }
.mss-nav { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:14px; }
.mss-tab {
  padding:7px 13px; border-radius:7px; border:1.5px solid var(--border);
  background:var(--bg2); color:var(--text2); cursor:pointer;
  font-size:.75rem; font-weight:600; transition:all .15s; white-space:nowrap;
}
.mss-tab:hover { background:var(--bg3); color:var(--text); }
.mss-tab.active { background:var(--accent); color:#fff; border-color:transparent; }
.mss-stage {
  background:var(--bg3); border:1px solid var(--border);
  border-radius:12px; padding:16px; position:relative;
}
.mss-diagram {
  width:100%; min-height:200px; border-radius:8px;
  background:#0f1117; overflow:hidden;
}
.mss-diagram svg { display:block; width:100%; }
.mss-controls { display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; align-items:center; }
.mss-btn {
  padding:8px 18px; border-radius:7px; font-size:.82rem; font-weight:700;
  cursor:pointer; border:none; color:#fff; transition:all .15s;
}
.mss-btn:hover { opacity:.88; transform:translateY(-1px); }
.mss-btn-green  { background:#22c55e; }
.mss-btn-red    { background:#ef4444; }
.mss-btn-yellow { background:#f59e0b; }
.mss-btn-gray   { background:#334155; }
.mss-btn-accent { background:#6366f1; }
.mss-steps { display:flex; gap:5px; flex-wrap:wrap; margin-top:10px; }
.mss-dot {
  width:26px; height:26px; border-radius:50%; border:1.5px solid var(--border);
  background:var(--bg2); color:var(--text3); font-size:9px; font-weight:700;
  display:flex; align-items:center; justify-content:center;
  cursor:default; transition:all .25s; flex-shrink:0;
}
.mss-dot.active { background:#6366f1; color:#fff; border-color:#6366f1; transform:scale(1.2); }
.mss-dot.done   { background:#6366f133; color:#818cf8; border-color:#6366f166; }
.mss-log {
  background:var(--bg); border:1px solid var(--border); border-radius:8px;
  padding:12px 14px; margin-top:10px; min-height:60px;
  font-size:.82rem; color:var(--text2); line-height:1.65;
}
.mss-log code { font-family:'Fira Code',monospace; color:var(--cyan); font-size:.78rem; }
.mss-discovery { margin-top:10px; display:none; }
.mss-discovery.show { display:block; }
</style>
<div class="mss-wrap">
  <div class="mss-nav" id="mssNav">
    ${SCENARIOS.map((s,i)=>`<button class="mss-tab${i===0?' active':''}" data-s="${i}" onclick="msSimSelect(${i})">${['🏛️ Monolith Problem','✂️ Split to MS','📡 API Request','🔗 Sync Comm.','📨 Async Comm.','🔍 Svc Discovery','⚖️ Load Balance','📈 Auto Scale','🔌 Circuit Breaker','📜 Saga Pattern','🛡️ Failure Isolation'][i]}</button>`).join('')}
  </div>
  <div class="mss-stage">
    <div class="mss-diagram" id="mssDiagram"></div>
    <div class="mss-controls">
      <button class="mss-btn mss-btn-green"  onclick="msSimRun()">▶ Run</button>
      <button class="mss-btn mss-btn-yellow" onclick="msSimPause()">⏸ Pause</button>
      <button class="mss-btn mss-btn-gray"   onclick="msSimStep_()">⏭ Step</button>
      <button class="mss-btn mss-btn-gray"   onclick="msSimReset()">↺ Reset</button>
    </div>
    <div class="mss-steps" id="mssSteps"></div>
    <div class="mss-log"   id="mssLog"><code>-- Select a scenario and click Run --</code></div>
    <div class="mss-discovery" id="mssDiscovery"></div>
  </div>
</div>`;
}

// ── Scenario definitions ─────────────────────────────────────
const MS_SCENARIOS = {

  // 0 — MONOLITH PROBLEM
  monolith: {
    title:'Monolith Problem', color:MS.red,
    discovery:'💥 A monolith works fine initially. But as PLAYKERS grows, a single bug in Scoring Service takes down ALL features. Scaling one feature requires scaling everything. Every deploy is a full-app risk.',
    steps:[
      { label:'PLAYKERS Monolith running — all features in one process', svg: monolithSVG('idle') },
      { label:'Traffic increases — Booking feature overloaded 🔴', svg: monolithSVG('overload') },
      { label:'💥 Scoring bug crashes the ENTIRE application!', svg: monolithSVG('crashed') },
      { label:'All features affected: Login ❌ Booking ❌ Payment ❌ Tournament ❌', svg: monolithSVG('all-down') },
      { label:'To fix Scoring, the whole app must be redeployed — 30min downtime', svg: monolithSVG('redeploy') },
    ]
  },

  // 1 — SPLIT TO MICROSERVICES
  split: {
    title:'Convert to Microservices', color:MS.green,
    discovery:'✅ Each PLAYKERS capability becomes its own service with its own database. Changes to Scoring don\'t affect Booking. Each service deploys independently.',
    steps:[
      { label:'Step 1: Identify business capabilities in the monolith', svg: splitSVG(1) },
      { label:'Step 2: Extract User Service + its own DB', svg: splitSVG(2) },
      { label:'Step 3: Extract Booking + Payment + Match Services', svg: splitSVG(3) },
      { label:'Step 4: Extract Tournament + Scoring + Notification', svg: splitSVG(4) },
      { label:'Step 5: All 7 services independent — each owns its data ✅', svg: splitSVG(5) },
    ]
  },

  // 2 — API REQUEST
  'api-request': {
    title:'API Request Flow', color:MS.cyan,
    discovery:'📡 POST /book-turf routes through DNS → Load Balancer → API Gateway → Booking Service → Payment Service → DB. Each hop is visible and traceable.',
    steps:[
      { label:'Client sends: POST /book-turf', svg: apiRequestSVG(0) },
      { label:'DNS resolves → Load Balancer routes to healthy gateway', svg: apiRequestSVG(1) },
      { label:'API Gateway authenticates JWT, routes to Booking Service', svg: apiRequestSVG(2) },
      { label:'Booking Service calls Payment Service (sync HTTP)', svg: apiRequestSVG(3) },
      { label:'Payment confirmed → Booking saved to DB → 200 OK ✅', svg: apiRequestSVG(4) },
    ]
  },

  // 3 — SYNCHRONOUS
  sync: {
    title:'Synchronous Communication', color:MS.yellow,
    discovery:'🔗 Synchronous: Booking Service calls Payment Service via HTTP/REST and WAITS for the response before continuing. Simple but tight coupling — if Payment is slow, Booking is slow.',
    steps:[
      { label:'Booking Service needs to charge the user', svg: syncSVG(0) },
      { label:'HTTP POST /charge → Payment Service (caller WAITS)', svg: syncSVG(1) },
      { label:'Payment Service queries Payment DB', svg: syncSVG(2) },
      { label:'Payment DB returns result → Payment Service responds', svg: syncSVG(3) },
      { label:'Booking Service receives 200 OK and continues ✅', svg: syncSVG(4) },
    ]
  },

  // 4 — ASYNCHRONOUS
  async: {
    title:'Asynchronous Communication', color:MS.pink,
    discovery:'📨 Async: Booking Service publishes BookingCreated event to Message Queue. Notification Service consumes it later. Booking Service does NOT wait — total decoupling.',
    steps:[
      { label:'Booking confirmed — need to notify the user', svg: asyncSVG(0) },
      { label:'Booking Service publishes BookingCreated event to Queue', svg: asyncSVG(1) },
      { label:'Booking Service immediately returns 200 OK (no waiting) ✅', svg: asyncSVG(2) },
      { label:'Message Queue holds event — Notification Service picks it up', svg: asyncSVG(3) },
      { label:'Notification Service sends SMS/email — independently ✅', svg: asyncSVG(4) },
    ]
  },

  // 5 — SERVICE DISCOVERY
  discovery: {
    title:'Service Discovery', color:MS.accent,
    discovery:'🔍 Without service discovery, services hardcode IP addresses. Microservices register their address dynamically. Booking asks the registry "where is Payment?" and gets healthy instances.',
    steps:[
      { label:'3 Payment instances register with Service Registry', svg: discoverySVG(0) },
      { label:'Booking Service asks registry: "Where is Payment?"', svg: discoverySVG(1) },
      { label:'Registry returns: Payment-1 ✅ Payment-2 ✅ Payment-3 ✅', svg: discoverySVG(2) },
      { label:'💥 Payment-2 crashes — registry health check detects it', svg: discoverySVG(3) },
      { label:'Registry removes Payment-2. Requests route to -1 and -3 only ✅', svg: discoverySVG(4) },
    ]
  },

  // 6 — LOAD BALANCING
  loadbalance: {
    title:'Load Balancing', color:MS.green,
    discovery:'⚖️ 100 concurrent booking requests distributed across 3 Booking Service instances using Round Robin. No single instance gets overwhelmed.',
    steps:[
      { label:'100 requests arrive at Load Balancer simultaneously', svg: lbSVG(0) },
      { label:'Round Robin: req 1→B-1, req 2→B-2, req 3→B-3, req 4→B-1…', svg: lbSVG(1) },
      { label:'Each instance handles ~33 requests in parallel', svg: lbSVG(2) },
      { label:'B-1 becomes hot (80% CPU) → LB shifts traffic to B-2, B-3', svg: lbSVG(3) },
      { label:'Load rebalanced: B-1 40%, B-2 35%, B-3 25% ✅', svg: lbSVG(4) },
    ]
  },

  // 7 — AUTO SCALING
  autoscale: {
    title:'Auto Scaling', color:MS.orange,
    discovery:'📈 Only Booking Service needs more capacity during PLAYKERS tournament season — other services stay at normal scale. Auto Scaler adds instances based on CPU/request metrics.',
    steps:[
      { label:'Normal load: Booking-1 and Booking-2 running fine', svg: autoScaleSVG(0) },
      { label:'Tournament starts — 10× traffic spike on Booking Service 🔴', svg: autoScaleSVG(1) },
      { label:'Auto Scaler detects CPU > 70% → adds Booking-3', svg: autoScaleSVG(2) },
      { label:'Traffic still high → adds Booking-4 and Booking-5', svg: autoScaleSVG(3) },
      { label:'5 instances handle load. Other services untouched ✅', svg: autoScaleSVG(4) },
    ]
  },

  // 8 — CIRCUIT BREAKER
  circuit: {
    title:'Circuit Breaker', color:MS.red,
    discovery:'🔌 Payment Service starts failing. Without CB, Booking Service would queue thousands of hanging requests. Circuit Breaker trips to OPEN → fail fast → service recovers → HALF-OPEN → CLOSED.',
    steps:[
      { label:'Payment Service failing — Booking CB monitors failures', svg: circuitSVG('monitoring') },
      { label:'Failure threshold (3/5) reached → Circuit trips to OPEN 🔴', svg: circuitSVG('open') },
      { label:'CB OPEN: all requests fail fast, no calls reach Payment', svg: circuitSVG('failfast') },
      { label:'After 30s timeout → CB moves to HALF-OPEN 🟡', svg: circuitSVG('halfopen') },
      { label:'Probe succeeds → CB CLOSED → normal operation ✅', svg: circuitSVG('closed') },
    ]
  },

  // 9 — SAGA
  saga: {
    title:'Saga Pattern', color:MS.purple,
    discovery:'📜 Distributed transaction: Booking → Payment → Notification. If Payment fails, a compensating action cancels the Booking. No distributed locks — each service handles its own rollback.',
    steps:[
      { label:'Saga starts: Create Booking (Step 1)', svg: sagaSVG(0) },
      { label:'Booking created ✅ → Charge Payment (Step 2)', svg: sagaSVG(1) },
      { label:'💥 Payment FAILS — insufficient funds', svg: sagaSVG(2) },
      { label:'Compensating action: Cancel Booking (rollback Step 1)', svg: sagaSVG(3) },
      { label:'Saga complete — no partial state. User sees "Booking failed" ✅', svg: sagaSVG(4) },
    ]
  },

  // 10 — FAILURE ISOLATION
  isolation: {
    title:'Failure Isolation', color:MS.cyan,
    discovery:'🛡️ Notification Service crashes. With proper isolation (timeouts + circuit breakers), all other services continue normally. Users can still book and pay — they just don\'t get an SMS.',
    steps:[
      { label:'All PLAYKERS services running normally ✅', svg: isolationSVG('normal') },
      { label:'💥 Notification Service crashes!', svg: isolationSVG('notify-down') },
      { label:'Booking Service has circuit breaker → detects Notify is down', svg: isolationSVG('cb-open') },
      { label:'Booking continues without notification — graceful degradation', svg: isolationSVG('degraded') },
      { label:'User Service ✅ Booking ✅ Payment ✅ Scoring ✅ Notify ❌ (isolated) ✅', svg: isolationSVG('isolated') },
    ]
  },
};

// ── SVG primitives ───────────────────────────────────────────
const VW=700, VH=320;
function msSVG(body) {
  return `<svg viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg"
    style="width:100%;display:block;background:#0f1117;font-family:Inter,sans-serif">
    <defs>
      <filter id="gl_g"><feGaussianBlur stdDeviation="4" result="b"/><feFlood flood-color="#22c55e" flood-opacity=".6" result="c"/><feComposite in="c" in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="gl_r"><feGaussianBlur stdDeviation="5" result="b"/><feFlood flood-color="#ef4444" flood-opacity=".7" result="c"/><feComposite in="c" in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="gl_y"><feGaussianBlur stdDeviation="4" result="b"/><feFlood flood-color="#f59e0b" flood-opacity=".6" result="c"/><feComposite in="c" in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="gl_b"><feGaussianBlur stdDeviation="4" result="b"/><feFlood flood-color="#6366f1" flood-opacity=".6" result="c"/><feComposite in="c" in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="gl_c"><feGaussianBlur stdDeviation="4" result="b"/><feFlood flood-color="#06b6d4" flood-opacity=".6" result="c"/><feComposite in="c" in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="gl_p"><feGaussianBlur stdDeviation="4" result="b"/><feFlood flood-color="#a855f7" flood-opacity=".6" result="c"/><feComposite in="c" in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <pattern id="dot" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40,0L0,0 0,40" fill="none" stroke="#1a2236" stroke-width=".5"/>
      </pattern>
    </defs>
    <rect width="${VW}" height="${VH}" fill="url(#dot)"/>
    ${body}
  </svg>`;
}

function msBox(x,y,w,h,r,fill,stroke,sw=1.5,gid='') {
  const f=gid?`filter="url(#${gid})"`:''
  return `<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${f}/>`;
}
function msT(x,y,s,fill='#94a3b8',fs=10,fw=500,anchor='middle') {
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${fs}" font-weight="${fw}" text-anchor="${anchor}" dominant-baseline="middle" font-family="Inter,sans-serif">${s}</text>`;
}
function msArrow(x1,y1,x2,y2,col='#334155',dashed=false,sw=1.5) {
  const d=dashed?'stroke-dasharray="5,4"':'';
  const a=Math.atan2(y2-y1,x2-x1),aw=8;
  const p1x=x2-aw*Math.cos(a-.4),p1y=y2-aw*Math.sin(a-.4);
  const p2x=x2-aw*Math.cos(a+.4),p2y=y2-aw*Math.sin(a+.4);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${sw}" ${d}/>
  <polygon points="${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}" fill="${col}"/>`;
}
function msLine(x1,y1,x2,y2,col,dashed=false,sw=1) {
  const d=dashed?'stroke-dasharray="4,5"':'';
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${sw}" ${d}/>`;
}
function msBadge(x,y,label,col) {
  const w=label.length*5.8+16;
  return `<rect x="${x-w/2}" y="${y-9}" width="${w}" height="18" rx="5" fill="${col}22" stroke="${col}" stroke-width="1"/>
  ${msT(x,y,label,col,9,700)}`;
}
function msCyl(cx,cy,w,h,fill,stroke,sw=1.5,gid='') {
  const rx=w/2,ry=7,f=gid?`filter="url(#${gid})"`:''
  return `<g ${f}>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
  <rect x="${cx-rx}" y="${cy}" width="${w}" height="${h}" fill="${fill}" stroke="none"/>
  <line x1="${cx-rx}" y1="${cy}" x2="${cx-rx}" y2="${cy+h}" stroke="${stroke}" stroke-width="${sw}"/>
  <line x1="${cx+rx}" y1="${cy}" x2="${cx+rx}" y2="${cy+h}" stroke="${stroke}" stroke-width="${sw}"/>
  <ellipse cx="${cx}" cy="${cy+h}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
  </g>`;
}
function msSvc(x,y,key,state='normal',scale=1) {
  const s=SVC[key], w=90*scale, h=38*scale;
  const col=state==='down'?MS.red:state==='warn'?MS.yellow:s.color;
  const gid=state==='down'?'gl_r':state==='warn'?'gl_y':'';
  const icon=state==='down'?'💥':s.icon;
  return `${msBox(x,y,w,h,8,col+'22',col,state!=='normal'?2.5:1.5,gid)}
  ${msT(x,y-8,icon,'#fff',13)}
  ${msT(x,y+7,state==='down'?'DOWN':s.label,col,9,700)}`;
}
function msDB(x,y,label,col,state='normal') {
  const gid=state==='down'?'gl_r':state==='warn'?'gl_y':'';
  const c=state==='down'?MS.red:col;
  return `${msCyl(x,y-12,60,24,c+'22',c,state!=='normal'?2:1.5,gid)}
  ${msT(x,y+6,label,c,8,600)}`;
}

// ── SCENARIO SVG GENERATORS ──────────────────────────────────

function monolithSVG(state) {
  const features=['👤 Users','🏏 Match','📅 Booking','💳 Payment','🏆 Tournament','📊 Scoring','🔔 Notify'];
  const col=state==='idle'?MS.accent:state==='overload'?MS.yellow:(state==='crashed'||state==='all-down')?MS.red:MS.yellow;
  const gid=state==='crashed'||state==='all-down'?'gl_r':state==='overload'?'gl_y':'gl_b';
  const crashed=state==='crashed'||state==='all-down';
  const clients=[{x:60,y:80},{x:60,y:160},{x:60,y:240}];
  let s=``;
  // clients
  clients.forEach(c=>{
    s+=msBox(c.x,c.y,56,32,8,MS.bg,MS.blue,1.5);
    s+=msT(c.x,c.y-6,'📱','#fff',13);
    s+=msT(c.x,c.y+8,'Client',MS.blue,8,700);
    s+=msLine(c.x+28,c.y,140,VH/2,MS.blue+'44',true);
  });
  // monolith box
  s+=msBox(280,VH/2,200,240,12,col+'18',col,2.5,gid);
  s+=msT(280,70,'🏛️ PLAYKERS Monolith','#fff',16,800);
  if(crashed) {
    s+=msT(280,VH/2,'💥 CRASHED',MS.red,22,800);
    s+=msT(280,VH/2+28,'All features DOWN',MS.red,11,700);
  } else {
    features.forEach((f,i)=>{
      const fy=108+i*26;
      const isBad=(state==='overload'&&f.includes('Booking'))||state==='all-down';
      s+=msBox(280,fy,160,20,4,isBad?MS.red+'22':col+'11',isBad?MS.red:col,1);
      s+=msT(280,fy,f,isBad?MS.red:col,9,isBad?700:500);
    });
  }
  // single DB
  s+=msCyl(520,VH/2-12,80,60,crashed?MS.red+'22':MS.accent+'22',crashed?MS.red:MS.accent,2);
  s+=msT(520,VH/2+28,'One Database',crashed?MS.red:MS.accent,10,700);
  if(!crashed) s+=msArrow(380,VH/2,476,VH/2,MS.accent+'88',false,2);
  if(state==='overload') { s+=msBadge(280,68,'⚠️ OVERLOADED',MS.yellow); }
  if(state==='redeploy') { s+=msBadge(280,VH-28,'🔄 Redeploying… 30min downtime',MS.yellow); }
  return msSVG(s);
}

function splitSVG(step) {
  const svcKeys=Object.keys(SVC);
  const cols=4, rows=2;
  let s=``;
  const visible=step<=1?0:step===2?2:step===3?5:7;
  // client + gateway
  s+=msBox(60,VH/2,64,36,8,MS.bg,MS.blue,1.5);
  s+=msT(60,VH/2-7,'📱','#fff',15); s+=msT(60,VH/2+9,'Client',MS.blue,9,700);
  if(step>=2){
    s+=msBox(180,VH/2,90,40,8,MS.accent+'18',MS.accent,2,'gl_b');
    s+=msT(180,VH/2-8,'🚪','#fff',16); s+=msT(180,VH/2+9,'API Gateway',MS.accent,9,700);
    s+=msArrow(92,VH/2,135,VH/2,MS.blue+'88',false,2);
  }
  if(step===1){
    s+=msBox(280,VH/2,200,240,12,MS.accent+'18',MS.accent,2);
    s+=msT(280,VH/2,'🏛️ Monolith',MS.accent,14,800);
  }
  const positions=[{x:340,y:80},{x:460,y:80},{x:580,y:80},{x:640,y:80},{x:340,y:200},{x:460,y:200},{x:580,y:200}];
  const dbY=positions.map(p=>p.y+80);
  svcKeys.slice(0,visible).forEach((key,i)=>{
    const p=positions[i]||{x:400,y:160};
    const svc=SVC[key];
    s+=msSvc(p.x,p.y,key,'normal',0.9);
    s+=msDB(p.x,p.y+78,svc.db,svc.color);
    if(step>=2) s+=msLine(p.x,p.y+22,p.x,p.y+52,svc.color+'66',false,1);
    if(step>=2) s+=msArrow(225,VH/2,p.x-42,p.y,svc.color+'55',false,1);
  });
  if(step>=5) { s+=msBadge(VW/2,VH-12,'✅ 7 independent services, each with its own database',MS.green); }
  return msSVG(s);
}

function apiRequestSVG(step) {
  const nodes=[
    {x:60, y:VH/2, label:'📱 Client',   col:MS.blue},
    {x:180,y:VH/2, label:'⚖️ Load Bal', col:MS.green},
    {x:300,y:VH/2, label:'🚪 API GW',   col:MS.accent},
    {x:420,y:VH/2, label:'📅 Booking',  col:MS.cyan},
    {x:560,y:VH/2, label:'💳 Payment',  col:MS.yellow},
  ];
  const dbX=560, dbY=VH/2+80;
  let s=``;
  nodes.forEach((n,i)=>{
    const active=i<=step;
    const gid=active?'gl_c':'';
    s+=msBox(n.x,n.y,88,40,8,active?n.col+'22':MS.bg3,active?n.col:MS.border,active?2:1.5,active?'gl_c':'');
    s+=msT(n.x,n.y,n.label,active?n.col:MS.t3,9,active?700:500);
    if(i<nodes.length-1&&i<step){
      s+=msArrow(n.x+44,n.y,nodes[i+1].x-44,nodes[i+1].y,n.col,false,2);
    }
  });
  // DB
  if(step>=4){
    s+=msDB(dbX,dbY,'Booking DB',MS.cyan);
    s+=msArrow(dbX,VH/2+20,dbX,dbY-24,MS.cyan,false,1.5);
    s+=msBadge(VW/2,VH-12,'✅ 200 OK — Booking saved',MS.green);
  }
  // request label
  const labels=['POST /book-turf','DNS → LB','JWT verified, routed','Sync call to Payment','Payment OK → Booking saved'];
  if(step>=0) s+=msBadge(VW/2,20,labels[step]||'',MS.cyan);
  // response arrow back
  if(step>=4) s+=msArrow(nodes[2].x-44,VH/2+12,nodes[0].x+44,VH/2+12,MS.green,true,2);
  return msSVG(s);
}

function syncSVG(step) {
  const bkX=160,payX=380,dbX=560,Y=VH/2;
  let s=``;
  s+=msBox(bkX,Y,110,50,8,step>=1?MS.cyan+'22':MS.bg3,step>=1?MS.cyan:MS.border,step>=1?2:1.5,step>=1?'gl_c':'');
  s+=msT(bkX,Y-8,'📅','#fff',18); s+=msT(bkX,Y+10,'Booking Service',MS.cyan,9,700);

  s+=msBox(payX,Y,110,50,8,step>=2?MS.yellow+'22':MS.bg3,step>=2?MS.yellow:MS.border,step>=2?2:1.5,step>=2?'gl_y':'');
  s+=msT(payX,Y-8,'💳','#fff',18); s+=msT(payX,Y+10,'Payment Service',MS.yellow,9,700);

  s+=msDB(dbX,Y,'Payment DB',MS.yellow,step>=3?'normal':'');
  // arrows
  if(step>=1) s+=msArrow(bkX+55,Y-4,payX-55,Y-4,MS.yellow,false,2)+msBadge((bkX+payX)/2,Y-20,'HTTP POST /charge',MS.yellow);
  if(step>=2) s+=msArrow(payX+55,Y-4,dbX-30,Y-4,MS.yellow+'88',false,1.5);
  if(step>=3) s+=msArrow(dbX-30,Y+4,payX+55,Y+4,MS.green,false,1.5)+msBadge((payX+dbX)/2,Y+20,'result',MS.green);
  if(step>=4) s+=msArrow(payX-55,Y+4,bkX+55,Y+4,MS.green,false,2)+msBadge((bkX+payX)/2,Y+20,'200 OK ✅',MS.green);

  // waiting indicator
  if(step===1||step===2||step===3){
    s+=msT(bkX,Y+36,'⏳ waiting…',MS.yellow,9,600);
  }
  s+=msBadge(VW/2,VH-12,'Synchronous: Booking waits for Payment response',step>=4?MS.green:MS.yellow);
  return msSVG(s);
}

function asyncSVG(step) {
  const bkX=130,qX=360,notX=580,Y=VH/2;
  let s=``;
  s+=msBox(bkX,Y,110,50,8,MS.cyan+'18',MS.cyan,2,'gl_c');
  s+=msT(bkX,Y-8,'📅','#fff',18); s+=msT(bkX,Y+10,'Booking Service',MS.cyan,9,700);

  // queue
  s+=msBox(qX,Y,120,60,10,step>=2?MS.accent+'22':MS.bg3,step>=2?MS.accent:MS.border,step>=2?2:1.5,step>=2?'gl_b':'');
  s+=msT(qX,Y-12,'📨','#fff',18); s+=msT(qX,Y+4,'Message Queue',MS.accent,9,700);
  if(step>=2) s+=msT(qX,Y+18,'BookingCreated',MS.a2,8,600);

  // notification
  s+=msBox(notX,Y,110,50,8,step>=4?MS.pink+'18':MS.bg3,step>=4?MS.pink:MS.border,step>=4?2:1.5,step>=4?'gl_c':'');
  s+=msT(notX,Y-8,'🔔','#fff',18); s+=msT(notX,Y+10,'Notification Svc',step>=4?MS.pink:MS.t3,9,700);

  if(step>=1) s+=msArrow(bkX+55,Y,qX-60,Y,MS.accent,false,2)+msBadge((bkX+qX)/2,Y-20,'publish event',MS.accent);
  if(step>=2) s+=msBadge(bkX,Y+36,'✅ returns 200 immediately',MS.green);
  if(step>=3) s+=msArrow(qX+60,Y,notX-55,Y,MS.pink,true,2)+msBadge((qX+notX)/2,Y-20,'consume event',MS.pink);
  if(step>=4) s+=msBadge(notX,Y+36,'📧 SMS sent',MS.pink);

  s+=msBadge(VW/2,VH-12,step>=2?'Async: Booking does NOT wait ✅':'Booking needs to notify user…',step>=2?MS.green:MS.t2);
  return msSVG(s);
}

function discoverySVG(step) {
  const regX=VW/2, regY=80;
  const instances=[{x:160,y:220,id:'Payment-1'},{x:320,y:220,id:'Payment-2'},{x:480,y:220,id:'Payment-3'}];
  const bkX=620, bkY=220;
  let s=``;

  // Service Registry
  s+=msBox(regX,regY,200,52,10,MS.accent+'18',MS.accent,2,'gl_b');
  s+=msT(regX,regY-10,'🗂️ Service Registry',MS.a2,11,800);
  const regs=instances.map((ins,i)=>{
    const alive=!(step>=3&&i===1);
    return `${ins.id}: ${alive?'✅':'❌'}`;
  });
  s+=msT(regX,regY+8,step>=1?regs.join('  '):' — empty — ',step>=3?MS.yellow:MS.t2,8,600);

  // Payment instances
  instances.forEach((ins,i)=>{
    const isDown=step>=3&&i===1;
    const active=step>=1;
    s+=msBox(ins.x,ins.y,120,44,8,isDown?MS.red+'22':active?MS.yellow+'18':MS.bg3,isDown?MS.red:active?MS.yellow:MS.border,isDown?2.5:active?2:1.5,isDown?'gl_r':'');
    s+=msT(ins.x,ins.y-7,'💳','#fff',14);
    s+=msT(ins.x,ins.y+9,isDown?'💥 DOWN':ins.id,isDown?MS.red:MS.yellow,9,isDown?700:600);
    if(active&&!isDown) s+=msLine(ins.x,ins.y-22,regX+(i-1)*60,regY+26,MS.yellow+'44',true);
    if(isDown) s+=msArrow(ins.x,ins.y-22,regX+(i-1)*60,regY+26,MS.red+'66',true,1);
  });

  // Booking Service asking
  s+=msBox(bkX,bkY,100,44,8,MS.cyan+'18',MS.cyan,1.5);
  s+=msT(bkX,bkY-7,'📅','#fff',14); s+=msT(bkX,bkY+9,'Booking',MS.cyan,9,700);
  if(step>=2) { s+=msArrow(bkX-50,bkY-8,regX+100,regY+4,MS.cyan,false,1.5); s+=msBadge((bkX+regX)/2,bkY-28,'Where is Payment?',MS.cyan); }
  if(step>=4) {
    s+=msArrow(instances[0].x+60,instances[0].y,bkX-50,bkY+4,MS.green,false,1.5);
    s+=msArrow(instances[2].x+60,instances[2].y,bkX-50,bkY+10,MS.green,false,1.5);
    s+=msBadge(VW/2,VH-12,'Payment-2 removed. Traffic routes to -1 and -3 only ✅',MS.green);
  }
  if(step===3) s+=msBadge(VW/2,VH-12,'💥 Payment-2 crashed — registry health check detects it',MS.red);
  return msSVG(s);
}

function lbSVG(step) {
  const lbX=180,Y=VH/2;
  const instances=[{x:380,y:100},{x:380,y:200},{x:380,y:300}];
  const loads=[step>=3?0.8:step>=2?0.33:step>=1?0.33:0,
               step>=3?0.35:step>=2?0.33:step>=1?0.33:0,
               step>=3?0.25:step>=2?0.34:step>=1?0.34:0];
  let s=``;
  // requests indicator
  if(step>=1) {
    for(let i=0;i<(step>=2?9:5);i++){
      const rx=20+Math.sin(i*1.3)*14, ry=40+i*26;
      s+=msBox(rx+32,ry,52,18,5,MS.blue+'18',MS.blue,1);
      s+=msT(rx+32,ry,'req'+(i+1),MS.blue,8,600);
    }
  }
  // Load Balancer
  s+=msBox(lbX,Y,90,50,8,MS.green+'18',MS.green,2,'gl_g');
  s+=msT(lbX,Y-8,'⚖️','#fff',18); s+=msT(lbX,Y+10,'Load Balancer',MS.green,9,700);
  if(step>=1) s+=msT(lbX,Y+22,'Round Robin',MS.t3,8,500);

  instances.forEach((ins,i)=>{
    const fill=loads[i];
    const col=fill>0.7?MS.red:fill>0.4?MS.yellow:MS.cyan;
    s+=msBox(ins.x,ins.y,110,48,8,col+'18',col,fill>0?2:1.5);
    s+=msT(ins.x,ins.y-9,'📅','#fff',14); s+=msT(ins.x,ins.y+6,'Booking-'+(i+1),col,9,700);
    // load bar
    if(fill>0){
      s+=`<rect x="${ins.x-40}" y="${ins.y+18}" width="80" height="8" rx="3" fill="#0f1117" stroke="#2a3347" stroke-width=".5"/>`;
      s+=`<rect x="${ins.x-40}" y="${ins.y+18}" width="${80*fill}" height="8" rx="3" fill="${col}aa"/>`;
      s+=msT(ins.x+44,ins.y+22,Math.round(fill*100)+'%',col,8,700,'left');
    }
    if(step>=1) s+=msArrow(lbX+45,Y+(i-1)*18,ins.x-55,ins.y,col+'88',false,1.5);
  });
  if(step===3) s+=msBadge(instances[0].x,instances[0].y-36,'🔴 Hot! Shifting traffic',MS.red);
  if(step>=4) s+=msBadge(VW/2,VH-12,'✅ Load rebalanced: B-1 40%, B-2 35%, B-3 25%',MS.green);
  return msSVG(s);
}

function autoScaleSVG(step) {
  const counts=[2,2,3,4,5];
  const n=counts[step]||2;
  const scaler=step>=2;
  let s=``;
  s+=msBox(80,VH/2,80,40,8,MS.cyan+'18',MS.cyan,1.5);
  s+=msT(80,VH/2-7,'📱','#fff',14); s+=msT(80,VH/2+9,'Client',MS.cyan,9,700);
  if(step>=1){
    s+=msBadge(80,VH/2-36,'⚡ 10× traffic!',MS.red);
    for(let i=0;i<8;i++){
      s+=`<circle cx="${50+i*8}" cy="${VH/2-56-i*4}" r="3" fill="${MS.red}88"/>`;
    }
  }
  // scaler box
  if(scaler){
    s+=msBox(VW/2,40,170,32,8,MS.orange+'18',MS.orange,2);
    s+=msT(VW/2,40,'📈 Auto Scaler (CPU>70%)',MS.orange,9,700);
  }
  // instances
  const startY=80;
  for(let i=0;i<n;i++){
    const ix=300+(i%3)*140, iy=startY+(Math.floor(i/3)*100)+60;
    const isNew=i>=2&&step>=2;
    const col=isNew?MS.green:MS.cyan;
    s+=msBox(ix,iy,110,44,8,col+'18',col,isNew?2.5:1.5,isNew?'gl_g':'');
    s+=msT(ix,iy-8,'📅','#fff',14); s+=msT(ix,iy+8,'Booking-'+(i+1),col,9,isNew?800:700);
    if(isNew) s+=msBadge(ix,iy-30,'✨ New instance',MS.green);
    s+=msArrow(130,VH/2,ix-55,iy,col+'55',false,1);
    if(scaler&&isNew) s+=msArrow(VW/2,56,ix,iy-22,MS.orange,true,1.5);
  }
  if(step>=4) s+=msBadge(VW/2,VH-12,'Only Booking Service scaled. Other services untouched ✅',MS.green);
  if(step===1) s+=msBadge(VW/2,VH-12,'🔴 Booking Service overloaded! Auto scaler triggered…',MS.red);
  return msSVG(s);
}

function circuitSVG(state) {
  const bkX=130,cbX=360,payX=570,Y=VH/2;
  const cbCol={monitoring:MS.green,open:MS.red,failfast:MS.red,halfopen:MS.yellow,closed:MS.green}[state]||MS.green;
  const cbLabel={monitoring:'🟢 CLOSED',open:'🔴 OPEN',failfast:'🔴 OPEN',halfopen:'🟡 HALF-OPEN',closed:'🟢 CLOSED'}[state];
  const cbGid={monitoring:'gl_g',open:'gl_r',failfast:'gl_r',halfopen:'gl_y',closed:'gl_g'}[state];
  const payDown=state==='open'||state==='failfast'||state==='halfopen';
  let s=``;
  // Booking Service
  s+=msBox(bkX,Y,110,50,8,MS.cyan+'18',MS.cyan,2,'gl_c');
  s+=msT(bkX,Y-9,'📅','#fff',18); s+=msT(bkX,Y+9,'Booking Service',MS.cyan,9,700);
  // Circuit Breaker
  s+=msBox(cbX,Y,130,58,10,cbCol+'18',cbCol,2.5,cbGid);
  s+=msT(cbX,Y-13,'🔌','#fff',20); s+=msT(cbX,Y+2,'Circuit Breaker',cbCol,10,800);
  s+=msT(cbX,Y+16,cbLabel,cbCol,10,700);
  const failures={monitoring:1,open:3,failfast:3,halfopen:3,closed:0}[state];
  s+=msT(cbX,Y+28,'Failures: '+failures+'/3',failures>=3?MS.red:MS.t3,8,600);
  // Payment Service
  s+=msBox(payX,Y,110,50,8,payDown?MS.red+'18':MS.yellow+'18',payDown?MS.red:MS.yellow,payDown?2.5:1.5,payDown?'gl_r':'');
  s+=msT(payX,Y-9,payDown?'💥':'💳','#fff',18); s+=msT(payX,Y+9,payDown?'DOWN':'Payment Svc',payDown?MS.red:MS.yellow,9,700);

  // arrows
  if(state==='failfast'){
    s+=msArrow(bkX+55,Y,cbX-65,Y,MS.cyan,false,2);
    s+=msArrow(cbX-65,Y+12,bkX+55,Y+12,MS.red,false,2);
    s+=msBadge((bkX+cbX)/2,Y-22,'request',MS.cyan);
    s+=msBadge((bkX+cbX)/2,Y+28,'❌ FAIL FAST (no call)',MS.red);
    s+=msLine(cbX+65,Y,payX-55,Y,MS.red+'33',true);
    s+=msBadge(VW/2,VH-12,'CB OPEN: requests fail immediately — Payment never called',MS.red);
  } else if(state==='open'){
    s+=msArrow(bkX+55,Y,cbX-65,Y,MS.cyan,false,2);
    s+=msBadge(VW/2,VH-12,'Circuit tripped to OPEN — threshold reached!',MS.red);
  } else if(state==='halfopen'){
    s+=msArrow(bkX+55,Y,cbX-65,Y,MS.yellow,false,2);
    s+=msArrow(cbX+65,Y,payX-55,Y,MS.yellow,true,2);
    s+=msBadge(VW/2,VH-12,'HALF-OPEN: sending probe request to test recovery…',MS.yellow);
  } else if(state==='closed'){
    s+=msArrow(bkX+55,Y,cbX-65,Y,MS.green,false,2);
    s+=msArrow(cbX+65,Y,payX-55,Y,MS.green,false,2);
    s+=msBadge(VW/2,VH-12,'✅ Circuit CLOSED — service recovered, normal operation',MS.green);
  } else {
    s+=msArrow(bkX+55,Y,cbX-65,Y,MS.cyan+'88',false,1.5);
    s+=msArrow(cbX+65,Y,payX-55,Y,MS.yellow+'88',false,1.5);
    s+=msBadge(VW/2,VH-12,'Monitoring failure rate… (threshold: 3 failures)',MS.t2);
  }
  return msSVG(s);
}

function sagaSVG(step) {
  const steps2=[
    {x:110, label:'📅 Create Booking', svc:'booking', col:MS.cyan},
    {x:280, label:'💳 Charge Payment', svc:'payment', col:MS.yellow},
    {x:450, label:'🔔 Send Notify',    svc:'notify',  col:MS.pink},
  ];
  const failed=step>=2;
  const compensate=step>=3;
  let s=``;
  s+=msBox(60,40,90,30,8,MS.accent+'18',MS.accent,1.5);
  s+=msT(60,40,'📜 Saga Orchestrator',MS.a2,8,700);
  steps2.forEach((st,i)=>{
    const active=step>=i;
    const isFailed=failed&&i===1;
    const isComp=compensate&&i===0;
    const col=isFailed?MS.red:isComp?MS.orange:active?st.col:MS.border;
    const gid=isFailed?'gl_r':isComp?'':'';
    const Y=VH/2+(i-1)*0;
    s+=msBox(st.x,VH/2,120,50,8,active?col+'18':MS.bg3,col,active?2:1,gid);
    s+=msT(st.x,VH/2-8,isFailed?'💥':isComp?'↩️':st.label.split(' ')[0],'#fff',16);
    s+=msT(st.x,VH/2+9,isFailed?'FAILED':isComp?'CANCELLED':st.label.split(' ').slice(1).join(' '),col,9,active?700:400);
    if(active&&i>0) s+=msArrow(steps2[i-1].x+60,VH/2,st.x-60,VH/2,st.col,false,2);
    if(isFailed) s+=msBadge(st.x,VH/2-36,'💥 Payment Failed!',MS.red);
    if(isComp){
      s+=msArrow(steps2[1].x-60,VH/2+12,st.x+60,VH/2+12,MS.orange,true,2);
      s+=msBadge((st.x+steps2[1].x)/2,VH/2+28,'↩️ Compensating action',MS.orange);
    }
    // db below
    s+=msDB(st.x,VH/2+82,SVC[st.svc].db,col,isFailed?'down':isComp?'warn':active?'normal':'');
    if(active) s+=msLine(st.x,VH/2+26,st.x,VH/2+56,col+'66');
  });
  const captions=['Saga Step 1: Create Booking','Step 2: Charge Payment','💥 Payment fails — trigger compensation','↩️ Cancel Booking (compensating transaction)','✅ Saga complete — no partial state'];
  s+=msBadge(VW/2,VH-12,captions[step]||'',step>=4?MS.green:step>=2?MS.red:MS.t2);
  return msSVG(s);
}

function isolationSVG(state) {
  const svcs=[
    {key:'user',   x:100, y:100},
    {key:'booking',x:240, y:100},
    {key:'payment',x:380, y:100},
    {key:'match',  x:520, y:100},
    {key:'scoring',x:100, y:230},
    {key:'tourney',x:240, y:230},
    {key:'notify', x:380, y:230},
  ];
  const notifyDown=state!=='normal';
  let s=``;
  svcs.forEach((sv,i)=>{
    const isNotify=sv.key==='notify';
    const down=isNotify&&notifyDown;
    const warn=isNotify&&(state==='cb-open'||state==='degraded');
    const st=down&&state==='notify-down'?'down':warn?'warn':'normal';
    s+=msSvc(sv.x,sv.y,sv.key,st,0.9);
    // connections between some services
    if(i<4&&i>0) s+=msLine(svcs[i-1].x+44,100,sv.x-44,100,MS.green+'33',true);
    if(isNotify&&(state==='cb-open'||state==='degraded'||state==='isolated')){
      s+=msBox(sv.x+80,sv.y,60,24,6,MS.accent+'18',MS.accent,1.5);
      s+=msT(sv.x+80,sv.y,'🔌 CB',state==='cb-open'?MS.red:MS.yellow,9,700);
      s+=msT(sv.x+80,sv.y+10,state==='cb-open'?'OPEN':'degraded',state==='cb-open'?MS.red:MS.yellow,8,600);
    }
  });
  const captions={
    normal:'All PLAYKERS services running normally ✅',
    'notify-down':'💥 Notification Service crashed!',
    'cb-open':'Circuit Breaker OPEN — Booking detects Notify is down',
    degraded:'Booking continues without notification — graceful degradation',
    isolated:'✅ Failure isolated: Users book, pay, score — just no SMS',
  };
  const col={normal:MS.green,'notify-down':MS.red,'cb-open':MS.accent,degraded:MS.yellow,isolated:MS.green}[state];
  s+=msBadge(VW/2,VH-12,captions[state]||'',col||MS.t2);
  if(state==='isolated'){
    svcs.filter(sv=>sv.key!=='notify').forEach(sv=>{
      s+=msBadge(sv.x,sv.y-34,'✅',MS.green);
    });
    s+=msBadge(380,230-34,'❌ isolated',MS.red);
  }
  return msSVG(s);
}

// ── Controller ───────────────────────────────────────────────
function msSimSelect(idx) {
  if (msSimTimer) { clearTimeout(msSimTimer); msSimTimer = null; }
  msSimRunning = false; msSimPaused = false;
  msSimScenario = idx; msSimStep = 0;
  document.querySelectorAll('.mss-tab').forEach(t => t.classList.toggle('active', +t.dataset.s === idx));
  const disc = document.getElementById('mssDiscovery');
  if (disc) { disc.classList.remove('show'); disc.innerHTML = ''; }
  // show first step diagram immediately
  msSimStep = 1; msSimRender();
  msSimStep = 0;
  const log = document.getElementById('mssLog');
  if (log) log.innerHTML = `<code>▶ Click <strong>Run</strong> to start — or use <strong>Step</strong></code>`;
}

function msSimRun() {
  if (msSimRunning) return;
  msSimRunning = true; msSimPaused = false;
  msSimAdvance();
}
function msSimPause() {
  msSimPaused = !msSimPaused;
  if (!msSimPaused && msSimRunning) msSimAdvance();
}
function msSimStep_() {
  if (msSimRunning && !msSimPaused) return;
  msSimRunning = false;
  const key = SCENARIOS[msSimScenario];
  const sc  = MS_SCENARIOS[key];
  if (msSimStep < sc.steps.length) { msSimStep++; msSimRender(); }
}
function msSimReset() {
  if (msSimTimer) { clearTimeout(msSimTimer); msSimTimer = null; }
  msSimRunning = false; msSimPaused = false; msSimStep = 0;
  const disc = document.getElementById('mssDiscovery');
  if (disc) { disc.classList.remove('show'); disc.innerHTML = ''; }
  msSimRender();
}

function msSimAdvance() {
  if (msSimPaused) return;
  const key = SCENARIOS[msSimScenario];
  const sc  = MS_SCENARIOS[key];
  if (msSimStep >= sc.steps.length) {
    msSimRunning = false;
    msSimShowDiscovery();
    return;
  }
  msSimStep++;
  msSimRender();
  msSimTimer = setTimeout(msSimAdvance, 1400);
}

function msSimShowDiscovery() {
  const key = SCENARIOS[msSimScenario];
  const sc  = MS_SCENARIOS[key];
  const disc = document.getElementById('mssDiscovery');
  if (!disc) return;
  disc.style.background = sc.color + '11';
  disc.style.border     = '1.5px solid ' + sc.color;
  disc.style.borderRadius = '10px';
  disc.style.padding = '12px 16px';
  disc.style.fontSize = '.86rem';
  disc.style.lineHeight = '1.65';
  disc.style.color = 'var(--text2)';
  disc.innerHTML = `<strong style="color:${sc.color};font-size:.95rem">${sc.title}</strong><br>${sc.discovery}`;
  disc.classList.add('show');
}

function msSimRender() {
  const key = SCENARIOS[msSimScenario];
  const sc  = MS_SCENARIOS[key];

  // diagram
  const diag = document.getElementById('mssDiagram');
  if (diag) {
    const stepData = sc.steps[msSimStep - 1];
    diag.innerHTML = stepData ? stepData.svg : sc.steps[0].svg;
  }

  // log
  const log = document.getElementById('mssLog');
  if (log) {
    const stepData = sc.steps[msSimStep - 1];
    log.innerHTML = stepData
      ? `<strong style="color:${sc.color}">Step ${msSimStep}/${sc.steps.length}</strong> — ${stepData.label}`
      : `<code>▶ Click Run to start "${sc.title}"</code>`;
  }

  // dots
  const dots = document.getElementById('mssSteps');
  if (dots) {
    dots.innerHTML = sc.steps.map((st, i) => {
      const cls = i < msSimStep ? 'done' : i === msSimStep - 1 ? 'active' : '';
      const style = i < msSimStep
        ? `background:${sc.color}33;color:${sc.color};border-color:${sc.color}66`
        : i === msSimStep - 1
        ? `background:${sc.color};color:#fff;border-color:${sc.color}`
        : '';
      return `<div class="mss-dot ${cls}" style="${style}" title="${st.label}">${i+1}</div>`;
    }).join('');
  }
}
