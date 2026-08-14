// ============================================================
//  ARCH_ANIMATIONS.JS
//  Microservices, API Gateway, Message Queues, Event-Driven,
//  Rate Limiting, Circuit Breaker, Blob, Search, Realtime
// ============================================================

// ── shared colours (mirrors AC palette from acid.js) ─────────
const AR = {
  bg:'#0f1117', bg2:'#161b27', bg3:'#1e2535', border:'#2a3347',
  accent:'#6366f1', a2:'#818cf8', green:'#22c55e', yellow:'#f59e0b',
  red:'#ef4444', cyan:'#06b6d4', pink:'#ec4899', blue:'#3b82f6',
  text:'#e2e8f0', text2:'#94a3b8', text3:'#64748b',
};

// ── canvas helper — resize only when width changes, never flash white ─
function arCanvas(id) {
  const el = document.getElementById(id); if (!el) return null;
  const H = parseFloat(el.getAttribute('height') || 240);
  const container = el.closest('.anim-container') || el.parentElement;

  let W = 650;
  if (container) {
    const rect = container.getBoundingClientRect();
    const cW = rect.width || container.clientWidth;
    if (cW && cW > 200) {
      W = Math.max(300, Math.floor(cW - 36));
    }
  }

  if (el.width !== W || el.height !== H) {
    el.width  = W;
    el.height = H;
    el.style.removeProperty('width');
    el.style.removeProperty('height');
  }

  const ctx = el.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return { ctx, W, H };
}

// defer _raf until canvas container has a real clientWidth
function arStart(id, drawFn) {
  function tryStart(n) {
    const el = document.getElementById(id); if (!el) return;
    const container = el.closest('.anim-container') || el.parentElement;
    const W = container ? container.clientWidth - 36 : 0;
    if (W < 50 && n < 60) { requestAnimationFrame(() => tryStart(n + 1)); return; }
    _raf(id, drawFn);
  }
  // first attempt after two frames so container is guaranteed to have layout
  requestAnimationFrame(() => requestAnimationFrame(() => tryStart(0)));
}

// ============================================================
//  MICROSERVICES — Monolith vs Microservices canvas
// ============================================================
let msView = 'micro', msT = 0, msFailIdx = -1, msPackets = [];
const MS_SERVICES = [
  { label:'User Svc',     color:'#6366f1', icon:'👤', x:0.72, y:0.18 },
  { label:'Order Svc',    color:'#22c55e', icon:'🛒', x:0.72, y:0.38 },
  { label:'Payment Svc',  color:'#f59e0b', icon:'💳', x:0.72, y:0.58 },
  { label:'Notify Svc',   color:'#ec4899', icon:'🔔', x:0.72, y:0.78 },
  { label:'Search Svc',   color:'#06b6d4', icon:'🔍', x:0.88, y:0.28 },
  { label:'Shipping Svc', color:'#ef4444', icon:'📦', x:0.88, y:0.58 },
];

function initMSCanvas() {
  msView='micro'; msT=0; msFailIdx=-1; msPackets=[];
  _raf('msCanvas', drawMSFrame);
}
function setMSView(v) {
  msView=v; msFailIdx=-1; msPackets=[];
  document.querySelectorAll('.anim-btn').forEach(b=>{
    b.classList.toggle('active', b.textContent.toLowerCase().includes(v==='micro'?'micro':'mono'));
  });
  const el=document.getElementById('msStatus');
  if(el) el.textContent = v==='micro'
    ? '✅ Microservices: each service is independent. One failure stays contained.'
    : '⚠️ Monolith: all features in one process. One bug can crash everything.';
}
function simulateMSFailure() {
  msFailIdx = msView==='mono' ? 99 : Math.floor(Math.random()*MS_SERVICES.length);
  setTimeout(()=>{ msFailIdx=-1; }, 3000);
  const el=document.getElementById('msStatus');
  if(el){ el.style.color='var(--red)'; el.textContent = msView==='mono'
    ? '💥 Monolith crash — ALL services affected! Users see 500 errors across the board.'
    : '💥 '+MS_SERVICES[msFailIdx]?.label+' failed — other services continue unaffected ✅'; }
}
function resetMS() { msFailIdx=-1; msPackets=[]; const el=document.getElementById('msStatus'); if(el){el.style.color='';el.textContent='';} }

function drawMSFrame() {
  const c=arCanvas('msCanvas'); if(!c)return;
  const {ctx,W,H}=c; msT++;
  ctx.clearRect(0,0,W,H);
  ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();

  const gwX=W*0.38, gwY=H/2;
  // client
  gBox(ctx, W*0.1, gwY, 76, 46, 8, AR.bg, AR.blue, 2);
  txt(ctx,'👤',W*0.1,gwY-8,{size:18}); txt(ctx,'Client',W*0.1,gwY+10,{size:10,color:AR.blue,weight:'700'});
  arrowLine(ctx, W*0.1+38, gwY, gwX-54, gwY, AR.border+'aa', 0, false, 1.5);

  if(msView==='mono') {
    const isFailed = msFailIdx===99;
    const mCol = isFailed?AR.red:AR.accent;
    ctx.save(); if(isFailed){ctx.shadowColor=AR.red;ctx.shadowBlur=24;}
    gBox(ctx, gwX, gwY, 108, 140, 10, mCol+'18', mCol, 2);
    ctx.restore();
    txt(ctx,'🏛️',gwX,gwY-50,{size:24});
    txt(ctx,'Monolith',gwX,gwY-26,{size:11,color:mCol,weight:'800'});
    ['User','Order','Payment','Notify','Search'].forEach((s,i)=>{
      txt(ctx,s,gwX,gwY-8+i*18,{size:9,color:isFailed?AR.red:AR.text3});
    });
    if(isFailed) { txt(ctx,'💥 CRASHED',gwX,gwY+68,{size:11,color:AR.red,weight:'800'}); }
  } else {
    // API gateway
    const gwPulse=1+Math.sin(msT*0.06)*0.015;
    ctx.save(); ctx.shadowColor=AR.accent; ctx.shadowBlur=14;
    gBox(ctx, gwX, gwY, 108*gwPulse, 52*gwPulse, 10, AR.accent+'18', AR.accent, 2);
    ctx.restore();
    txt(ctx,'🚪',gwX,gwY-8,{size:18}); txt(ctx,'API Gateway',gwX,gwY+10,{size:10,color:AR.a2,weight:'700'});

    MS_SERVICES.forEach((s,i)=>{
      const sx=s.x*W, sy=s.y*H;
      const isFailed = i===msFailIdx;
      const sCol = isFailed?AR.red:s.color;
      const pulse = isFailed?1+Math.sin(msT*0.3)*0.07:1+Math.sin(msT*0.05+i)*0.02;
      ctx.save(); if(isFailed){ctx.shadowColor=AR.red;ctx.shadowBlur=20;}
      gBox(ctx, sx, sy, 88*pulse, 36*pulse, 8, sCol+'18', sCol, isFailed?2.5:1.5);
      ctx.restore();
      txt(ctx,s.icon,sx,sy-7,{size:13});
      txt(ctx,isFailed?'💥 DOWN':s.label,sx,sy+8,{size:9,color:sCol,weight:'700'});
      // arrow from gateway to service
      const ax1=gwX+54, ay1=gwY+(i-2.5)*14;
      arrowLine(ctx,ax1,ay1,sx-44,sy,isFailed?AR.red+'44':sCol+'33',0,false,1);
    });
  }
}

// ── Netflix microservices diagram ─────────────────────────────
function initMSNetflixCanvas() {
  let t=0;
  _raf('msNetflixCanvas', ()=>{
    const c=arCanvas('msNetflixCanvas'); if(!c)return;
    const {ctx,W,H}=c; t+=0.015;
    ctx.clearRect(0,0,W,H);
    ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.restore();

    const layers=[
      { label:'Client (TV/Mobile/Web)', x:W*0.5, y:24, color:AR.blue, w:220, icon:'📱' },
      { label:'API Gateway (Zuul)', x:W*0.5, y:78, color:AR.accent, w:180, icon:'🚪' },
    ];
    const services=[
      {label:'Auth',    color:'#6366f1',x:W*0.12,y:150,icon:'🔐'},
      {label:'Playback',color:'#22c55e',x:W*0.28,y:150,icon:'▶️'},
      {label:'Reco.',   color:'#f59e0b',x:W*0.44,y:150,icon:'⭐'},
      {label:'Billing', color:'#ec4899',x:W*0.60,y:150,icon:'💳'},
      {label:'Search',  color:'#06b6d4',x:W*0.76,y:150,icon:'🔍'},
      {label:'Encoding',color:'#ef4444',x:W*0.92,y:150,icon:'🎞️'},
    ];
    const infra=[
      {label:'Cassandra',color:'#818cf8',x:W*0.18,y:228,icon:'🗄️'},
      {label:'Kafka',    color:'#22c55e',x:W*0.40,y:228,icon:'📨'},
      {label:'Redis',    color:'#ef4444',x:W*0.62,y:228,icon:'⚡'},
      {label:'S3',       color:'#f59e0b',x:W*0.84,y:228,icon:'📦'},
    ];

    layers.forEach(l=>{
      const p=1+Math.sin(t*1.5)*0.02;
      gBox(ctx,l.x,l.y,l.w*p,32*p,8,l.color+'18',l.color,2);
      txt(ctx,l.icon+' '+l.label,l.x,l.y,{size:10,color:l.color,weight:'700'});
    });

    // arrows gateway → services
    services.forEach((s,i)=>{
      const pulse=1+Math.sin(t*2+i)*0.03;
      arrowLine(ctx,W*0.5,94,s.x,s.y-18,s.color+'44',0,false,1);
      gBox(ctx,s.x,s.y,76*pulse,36*pulse,8,s.color+'18',s.color,1.5);
      txt(ctx,s.icon,s.x,s.y-8,{size:13});
      txt(ctx,s.label,s.x,s.y+9,{size:9,color:s.color,weight:'700'});
      // moving packet on one service at a time
      const ph=((t*0.5+i*0.17)%1);
      const px=lerp(W*0.5,s.x,ease(ph)), py=lerp(94,s.y-18,ease(ph));
      if(ph<0.98) gDot(ctx,px,py,4,s.color,0.7);
    });

    // arrows services → infra
    infra.forEach((inf,i)=>{
      arrowLine(ctx,inf.x,inf.y-18,inf.x,inf.y-18,inf.color+'22',0,false,0.5);
      // connect 2 services each
      [services[i*1],services[i*1+1]].filter(Boolean).forEach(s=>{
        ctx.save(); ctx.strokeStyle=inf.color+'33'; ctx.lineWidth=1; ctx.setLineDash([3,5]);
        ctx.beginPath(); ctx.moveTo(s.x,s.y+18); ctx.lineTo(inf.x,inf.y-18); ctx.stroke();
        ctx.restore();
      });
      gBox(ctx,inf.x,inf.y,80,30,8,inf.color+'18',inf.color,1.5);
      txt(ctx,inf.icon+' '+inf.label,inf.x,inf.y,{size:9,color:inf.color,weight:'700'});
    });

    txt(ctx,'Netflix Architecture: Client → Gateway → 700+ Services → Data Layer',W/2,H-8,{size:9,color:AR.text3});
  });
}

// ============================================================
//  API GATEWAY canvas
// ============================================================
let apigT=0, apigPackets=[], apigMode='idle';
const APIG_SERVICES=[
  {label:'User Service',    color:'#6366f1',y:0.18,icon:'👤'},
  {label:'Order Service',   color:'#22c55e',y:0.38,icon:'🛒'},
  {label:'Payment Service', color:'#f59e0b',y:0.58,icon:'💳'},
  {label:'Search Service',  color:'#06b6d4',y:0.78,icon:'🔍'},
];

function initAPIGCanvas() {
  apigT=0; apigPackets=[]; apigMode='idle';
  _raf('apigCanvas', drawAPIGFrame);
}

function simulateAPIGRequest(type) {
  apigMode=type;
  const msgs={
    mobile:'📱 Mobile: GET /feed → Auth ✅ → Rate limit ok → Route to User+Order → Aggregate → respond 200',
    web:'🌐 Web: GET /dashboard → Auth ✅ → Cache HIT → respond 200 (no service call needed)',
    blocked:'🚫 Blocked: 429 Too Many Requests — client exceeded 100 req/min quota → reject at gateway',
    aggregated:'🔀 Aggregated: GET /home → fan-out to 3 services → merge responses → single 200',
  };
  const el=document.getElementById('apigStatus');
  if(el){
    el.style.color=type==='blocked'?'var(--red)':type==='aggregated'?'var(--cyan)':'var(--green)';
    el.textContent=msgs[type];
  }
  // spawn packet
  apigPackets.push({type,t:0,trail:[],phase:'req'});
}

function drawAPIGFrame() {
  const c=arCanvas('apigCanvas'); if(!c)return;
  const {ctx,W,H}=c; apigT++;
  ctx.clearRect(0,0,W,H);
  ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();

  const clX=W*0.08, gwX=W*0.42, srvX=W*0.82, midY=H/2;

  // Client
  gBox(ctx,clX,midY,70,44,8,AR.bg,AR.blue,2);
  txt(ctx,'📱',clX,midY-8,{size:18}); txt(ctx,'Client',clX,midY+10,{size:10,color:AR.blue,weight:'700'});

  // Gateway pipeline boxes
  const gPulse=1+Math.sin(apigT*0.05)*0.015;
  ctx.save(); ctx.shadowColor=AR.accent; ctx.shadowBlur=16;
  gBox(ctx,gwX,midY,180*gPulse,200*gPulse,12,AR.accent+'18',AR.accent,2);
  ctx.restore();
  txt(ctx,'🚪 API Gateway',gwX,midY-84,{size:11,color:AR.a2,weight:'800'});
  const steps=['🔐 Auth/JWT','🚦 Rate Limit','📋 Route','⚡ Cache','🗜️ Transform','📊 Logging'];
  const stepCols=[AR.red,AR.yellow,AR.cyan,AR.green,AR.accent,AR.text3];
  const isBlocked=apigMode==='blocked';
  steps.forEach((s,i)=>{
    const active=apigPackets.some(p=>p.t>0.15+i*0.08&&p.t<0.15+(i+1)*0.08);
    const blocked=isBlocked&&i===1;
    const sCol=blocked?AR.red:active?stepCols[i]:AR.border;
    ctx.save(); if(active||blocked){ctx.shadowColor=sCol;ctx.shadowBlur=10;}
    gBox(ctx,gwX,midY-64+i*26,162,22,5,sCol+(active||blocked?'22':'11'),sCol,active||blocked?2:1);
    ctx.restore();
    txt(ctx,blocked?'❌ BLOCKED':s,gwX,midY-64+i*26,{size:9,color:blocked?AR.red:active?sCol:AR.text3,weight:active||blocked?'700':'500'});
  });

  // Services
  APIG_SERVICES.forEach((s,i)=>{
    const sy=s.y*H;
    const active=apigMode!=='blocked'&&apigPackets.some(p=>p.t>0.6);
    const sCol=active?s.color:AR.border;
    arrowLine(ctx,gwX+90,midY,srvX-36,sy,sCol+'33',0,false,1);
    gBox(ctx,srvX,sy,72,32,8,sCol+'18',sCol,active?2:1.5);
    txt(ctx,s.icon,srvX,sy-6,{size:13}); txt(ctx,s.label,srvX,sy+8,{size:9,color:sCol,weight:'700'});
  });

  // line client → gateway
  arrowLine(ctx,clX+35,midY,gwX-90,midY,AR.blue+'66',0,false,1.5);

  // packets
  apigPackets=apigPackets.filter(p=>p.t<1);
  apigPackets.forEach(p=>{
    p.t+=0.018;
    const pCol=p.type==='blocked'?AR.red:p.type==='aggregated'?AR.cyan:AR.green;
    let px,py;
    if(p.t<0.4){
      px=lerp(clX+35,gwX-90,ease(p.t/0.4)); py=midY;
    } else if(p.type==='blocked'){
      px=gwX; py=midY; // stays at gateway
    } else if(p.t<0.7){
      const i=Math.floor((p.t-0.4)/0.075)%APIG_SERVICES.length;
      const sy=APIG_SERVICES[i].y*H;
      px=lerp(gwX+90,srvX-36,ease((p.t-0.4)/0.3)); py=lerp(midY,sy,ease((p.t-0.4)/0.3));
    } else {
      px=lerp(gwX-90,clX+35,ease((p.t-0.7)/0.3)); py=midY;
    }
    if(!p.trail)p.trail=[];
    p.trail.push({x:px,y:py}); if(p.trail.length>10)p.trail.shift();
    gDot(ctx,px,py,6,pCol,1,p.trail);
  });

  txt(ctx,'Client → [Auth→RateLimit→Route→Cache→Transform] → Services → Response',W/2,H-8,{size:8,color:AR.text3});
}

// ============================================================
//  MESSAGE QUEUE canvas
// ============================================================
let mqT=0, mqMessages=[], mqConsumed=0, mqProduced=0;
const MQ_CONSUMERS=[
  {label:'Email Svc',   color:'#6366f1',icon:'📧'},
  {label:'Inventory',   color:'#22c55e',icon:'📦'},
  {label:'Analytics',   color:'#f59e0b',icon:'📊'},
];

function initMQCanvas() {
  mqT=0; mqMessages=[]; mqConsumed=0; mqProduced=0;
  _raf('mqCanvas', drawMQFrame);
}
function mqProduce() {
  if(mqMessages.length>=12) return;
  mqProduced++;
  mqMessages.push({id:mqProduced,t:0,color:['#6366f1','#22c55e','#f59e0b','#06b6d4','#ec4899'][mqProduced%5],state:'queued'});
  const el=document.getElementById('mqStatus');
  if(el){el.style.color='var(--cyan)';el.textContent='✉️ Message #'+mqProduced+' added to queue. '+mqMessages.length+' pending.';}
}
function mqBurst() { for(let i=0;i<8;i++) setTimeout(mqProduce, i*120); }
function mqReset() { mqMessages=[]; mqConsumed=0; mqProduced=0; const el=document.getElementById('mqStatus'); if(el)el.textContent=''; }

function drawMQFrame() {
  const c=arCanvas('mqCanvas'); if(!c)return;
  const {ctx,W,H}=c; mqT++;
  ctx.clearRect(0,0,W,H);
  ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();

  const prodX=W*0.1, queueX=W*0.42, consX=W*0.82, midY=H/2;

  // Producer
  gBox(ctx,prodX,midY,80,50,8,AR.bg,AR.blue,2);
  txt(ctx,'⚙️',prodX,midY-10,{size:20}); txt(ctx,'Producer',prodX,midY+8,{size:10,color:AR.blue,weight:'700'});
  txt(ctx,'(Order Svc)',prodX,midY+20,{size:8,color:AR.blue+'88'});

  // Queue box
  const qColor=mqMessages.length>8?AR.yellow:mqMessages.length>4?AR.accent:AR.green;
  ctx.save(); ctx.shadowColor=qColor; ctx.shadowBlur=12;
  gBox(ctx,queueX,midY,160,H*0.7,12,qColor+'12',qColor,2);
  ctx.restore();
  txt(ctx,'📨 Message Queue',queueX,24,{size:10,color:qColor,weight:'700'});
  txt(ctx,mqMessages.length+' messages',queueX,40,{size:9,color:qColor});

  // Messages in queue as small boxes
  const maxShow=8, startY=58;
  mqMessages.slice(0,maxShow).forEach((m,i)=>{
    if(m.alpha===undefined) m.alpha=0;
    m.alpha=Math.min(m.alpha+0.08,1);
    const my=startY+i*((H*0.7-80)/maxShow);
    ctx.save(); ctx.globalAlpha=m.alpha;
    gBox(ctx,queueX,my,140,18,4,m.color+'22',m.color,1.5);
    txt(ctx,'msg#'+m.id,queueX,my,{size:8,color:m.color,weight:'600'});
    ctx.restore();
  });
  if(mqMessages.length>maxShow) txt(ctx,'+'+(mqMessages.length-maxShow)+' more…',queueX,startY+maxShow*((H*0.7-80)/maxShow),{size:8,color:AR.text3});

  // auto-consume every 90 frames
  if(mqT%90===0 && mqMessages.length>0) {
    const consumed=mqMessages.shift();
    mqConsumed++;
    const el=document.getElementById('mqStatus');
    if(el){el.style.color='var(--green)';el.textContent='✅ Consumed msg#'+consumed.id+' | Total consumed: '+mqConsumed+' | Queue: '+mqMessages.length;}
  }

  // Consumers
  MQ_CONSUMERS.forEach((con,i)=>{
    const cy=H*0.2+i*(H*0.28);
    arrowLine(ctx,queueX+80,midY,consX-36,cy,con.color+'44',mqT*2,true,1.5);
    gBox(ctx,consX,cy,76,34,8,con.color+'18',con.color,1.5);
    txt(ctx,con.icon,consX,cy-7,{size:13}); txt(ctx,con.label,consX,cy+8,{size:9,color:con.color,weight:'700'});
  });

  // arrow from producer to queue
  arrowLine(ctx,prodX+40,midY,queueX-80,midY,AR.blue+'88',0,false,2);

  // stats bottom
  txt(ctx,'Produced: '+mqProduced+'  Consumed: '+mqConsumed+'  Queue depth: '+mqMessages.length,W/2,H-8,{size:9,color:AR.text3});
}

// ============================================================
//  KAFKA canvas — partitions + consumer groups
// ============================================================
let kafkaT=0, kafkaMode='produce', kafkaOffsets=[0,0,0], kafkaEvents=[];

function initKafkaCanvas() {
  kafkaT=0; kafkaMode='produce'; kafkaOffsets=[0,0,0]; kafkaEvents=[];
  _raf('kafkaCanvas', drawKafkaFrame);
}
function kafkaDemo(mode) {
  kafkaMode=mode;
  document.querySelectorAll('.anim-btn').forEach(b=>{
    b.classList.toggle('active', b.textContent.toLowerCase().includes(mode));
  });
  const msgs={
    produce:'Events stream into Kafka partitions. Each partition is an ordered append-only log. Producers choose partition via key hash.',
    lag:'Consumer Lag = latest offset − consumer offset. High lag means consumers are falling behind producers.',
    rebalance:'New consumer joins the group → Kafka reassigns partitions. Each partition owned by exactly one consumer in the group.',
  };
  const el=document.getElementById('kafkaStatus');
  if(el){el.style.color='var(--cyan)';el.textContent=msgs[mode];}
  if(mode==='produce'&&kafkaEvents.length<30) { for(let i=0;i<6;i++) setTimeout(()=>kafkaEvents.push({p:Math.floor(Math.random()*3),t:0}),i*150); }
}

function drawKafkaFrame() {
  const c=arCanvas('kafkaCanvas'); if(!c)return;
  const {ctx,W,H}=c; kafkaT++;
  ctx.clearRect(0,0,W,H);
  ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();

  const pColors=['#6366f1','#22c55e','#f59e0b'];
  const partYs=[H*0.22,H*0.50,H*0.78];
  const brokerX=W*0.42, prodX=W*0.1, consX=W*0.80;

  // producer
  gBox(ctx,prodX,H/2,72,46,8,AR.bg,AR.blue,2);
  txt(ctx,'⚙️',prodX,H/2-8,{size:18}); txt(ctx,'Producer',prodX,H/2+8,{size:10,color:AR.blue,weight:'700'});
  txt(ctx,'(Uber app)',prodX,H/2+20,{size:8,color:AR.blue+'88'});

  // partitions
  partYs.forEach((py,i)=>{
    const col=pColors[i];
    // partition track
    gBox(ctx,brokerX,py,W*0.38,28,6,col+'11',col,1.5);
    txt(ctx,'Partition '+i,brokerX-W*0.17,py,{size:9,color:col,weight:'700',align:'left'});
    // offset markers
    const maxOff=Math.max(kafkaOffsets[i],1);
    for(let o=0;o<Math.min(kafkaOffsets[i],8);o++){
      const ox=brokerX-W*0.18+o*(W*0.38/8);
      ctx.save(); ctx.shadowColor=col; ctx.shadowBlur=4;
      ctx.beginPath(); ctx.roundRect(ox,py-10,W*0.38/8-2,20,3);
      ctx.fillStyle=col+'44'; ctx.fill(); ctx.strokeStyle=col; ctx.lineWidth=1; ctx.stroke();
      ctx.restore();
      txt(ctx,o+'',ox+W*0.38/16,py,{size:7,color:col,weight:'600'});
    }

    // consumer offset pointer
    if(kafkaMode==='lag') {
      const consOff=Math.max(kafkaOffsets[i]-3,0);
      const cx2=brokerX-W*0.18+consOff*(W*0.38/8)+W*0.38/16;
      ctx.save(); ctx.shadowColor=AR.yellow; ctx.shadowBlur=8;
      ctx.beginPath(); ctx.moveTo(cx2,py+14); ctx.lineTo(cx2-5,py+24); ctx.lineTo(cx2+5,py+24); ctx.closePath();
      ctx.fillStyle=AR.yellow; ctx.fill(); ctx.restore();
      txt(ctx,'consumer',cx2,py+30,{size:7,color:AR.yellow,weight:'700'});
      txt(ctx,'lag: '+3,brokerX+W*0.05,py,{size:9,color:AR.red,weight:'700'});
    }
    arrowLine(ctx,prodX+36,H/2,brokerX-W*0.19,py,col+'44',0,false,1);
    arrowLine(ctx,brokerX+W*0.19,py,consX-36,H*0.25+(i*(H*0.25)),col+'66',0,false,1.5);
  });

  // consumers
  const consLabels=['Consumer 1','Consumer 2','Consumer 3'];
  const rebalancing=kafkaMode==='rebalance';
  consLabels.forEach((cl,i)=>{
    const cy=H*0.25+i*H*0.25;
    const col=pColors[i];
    const isNew=rebalancing&&i===2;
    ctx.save(); if(isNew){ctx.shadowColor=AR.green;ctx.shadowBlur=16;}
    gBox(ctx,consX,cy,80,30,8,isNew?AR.green+'18':col+'18',isNew?AR.green:col,isNew?2:1.5);
    ctx.restore();
    txt(ctx,isNew?'✨ NEW':consLabels[i],consX,cy,{size:9,color:isNew?AR.green:col,weight:'700'});
  });

  // auto-produce events
  if(kafkaMode==='produce'&&kafkaT%45===0) {
    const p=Math.floor(Math.random()*3);
    kafkaOffsets[p]=Math.min(kafkaOffsets[p]+1,8);
  }

  // moving event dots
  if(kafkaT%30===0&&kafkaMode==='produce') {
    kafkaEvents.push({p:Math.floor(Math.random()*3),t:0,trail:[]});
  }
  kafkaEvents=kafkaEvents.filter(e=>e.t<1);
  kafkaEvents.forEach(e=>{
    e.t+=0.025;
    const py=partYs[e.p];
    const px=lerp(prodX+36,brokerX-W*0.19,ease(e.t));
    if(!e.trail)e.trail=[];
    e.trail.push({x:px,y:py}); if(e.trail.length>8)e.trail.shift();
    gDot(ctx,px,py,5,pColors[e.p],0.9,e.trail);
  });

  txt(ctx,'Topic: driver-locations  |  3 Partitions  |  1 Consumer Group (3 consumers)',W/2,H-8,{size:8,color:AR.text3});
}

// ============================================================
//  EVENT-DRIVEN canvas — event fan-out
// ============================================================
let edT=0, edPackets=[], edEvent='';
const ED_SUBSCRIBERS=[
  {label:'Inventory Svc', color:'#6366f1', icon:'📦', y:0.15},
  {label:'Email Svc',     color:'#22c55e', icon:'📧', y:0.33},
  {label:'Analytics',     color:'#f59e0b', icon:'📊', y:0.51},
  {label:'Fraud Check',   color:'#ec4899', icon:'🔍', y:0.69},
  {label:'Shipping Svc',  color:'#06b6d4', icon:'🚚', y:0.87},
];
const ED_EVENTS={
  order:  {label:'order.created',   color:'#22c55e',icon:'🛒'},
  payment:{label:'payment.charged', color:'#f59e0b',icon:'💳'},
  ship:   {label:'item.shipped',    color:'#06b6d4',icon:'📦'},
};

function initEDCanvas() {
  edT=0; edPackets=[]; edEvent='';
  _raf('edCanvas', drawEDFrame);
}
function triggerEvent(type) {
  edEvent=type;
  const ev=ED_EVENTS[type];
  ED_SUBSCRIBERS.forEach((s,i)=>{
    edPackets.push({t:0-(i*0.12),sub:i,color:s.color,trail:[],event:ev.label});
  });
  const el=document.getElementById('edStatus');
  if(el){el.style.color=ev.color;el.textContent='🔔 Event "'+ev.label+'" emitted → broadcasting to '+ED_SUBSCRIBERS.length+' subscribers in parallel';}
}

function drawEDFrame() {
  const c=arCanvas('edCanvas'); if(!c)return;
  const {ctx,W,H}=c; edT++;
  ctx.clearRect(0,0,W,H);
  ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();

  const srcX=W*0.12, busX=W*0.44, subX=W*0.82;
  const ev=edEvent?ED_EVENTS[edEvent]:null;

  // Event source
  gBox(ctx,srcX,H/2,80,50,8,AR.bg,AR.accent,2);
  txt(ctx,'📡',srcX,H/2-10,{size:20}); txt(ctx,'Event Source',srcX,H/2+8,{size:10,color:AR.a2,weight:'700'});
  txt(ctx,'(Shopify)',srcX,H/2+20,{size:8,color:AR.a2+'88'});

  // Event Bus
  const busCol=ev?ev.color:AR.accent;
  const busPulse=1+Math.sin(edT*0.08)*0.02;
  ctx.save(); ctx.shadowColor=busCol; ctx.shadowBlur=edPackets.length?16:6;
  gBox(ctx,busX,H/2,140*busPulse,H*0.75,12,busCol+'12',busCol,2);
  ctx.restore();
  txt(ctx,'📨 Event Bus',busX,H*0.1,{size:10,color:busCol,weight:'800'});
  txt(ctx,'(Kafka / SNS)',busX,H*0.1+16,{size:8,color:busCol+'88'});
  if(ev) txt(ctx,ev.icon+' '+ev.label,busX,H/2,{size:9,color:ev.color,weight:'700'});

  arrowLine(ctx,srcX+40,H/2,busX-70,H/2,AR.accent+'88',0,false,2);

  // Subscribers
  ED_SUBSCRIBERS.forEach((s,i)=>{
    const sy=s.y*H;
    arrowLine(ctx,busX+70,H/2,subX-38,sy,s.color+'33',edT,true,1);
    gBox(ctx,subX,sy,76,30,8,s.color+'18',s.color,1.5);
    txt(ctx,s.icon,subX,sy-7,{size:13}); txt(ctx,s.label,subX,sy+7,{size:9,color:s.color,weight:'700'});
  });

  // packets
  edPackets=edPackets.filter(p=>p.t<1.1);
  edPackets.forEach(p=>{
    if(p.t<0){p.t+=0.02;return;}
    p.t+=0.02;
    const sy=ED_SUBSCRIBERS[p.sub].y*H;
    let px,py;
    if(p.t<0.4){px=lerp(srcX+40,busX,ease(p.t/0.4));py=H/2;}
    else{px=lerp(busX+70,subX-38,ease((p.t-0.4)/0.6));py=lerp(H/2,sy,ease((p.t-0.4)/0.6));}
    if(!p.trail)p.trail=[];
    p.trail.push({x:px,y:py}); if(p.trail.length>10)p.trail.shift();
    gDot(ctx,px,py,5,p.color,1,p.trail);
  });
}

// ── CQRS mini canvas ──────────────────────────────────────────
function initCQRSCanvas() {
  let t=0;
  _raf('cqrsCanvas',()=>{
    const c=arCanvas('cqrsCanvas'); if(!c)return;
    const {ctx,W,H}=c; t+=0.018;
    ctx.clearRect(0,0,W,H);
    const nodes=[
      {label:'Command Handler',x:W*0.18,y:H/2,color:'#f59e0b',icon:'✏️'},
      {label:'Event Store',    x:W*0.38,y:H/2,color:'#6366f1',icon:'📋'},
      {label:'Projections',    x:W*0.58,y:H/2,color:'#22c55e',icon:'🔄'},
      {label:'Read Model',     x:W*0.78,y:H/2,color:'#06b6d4',icon:'👁️'},
    ];
    nodes.forEach((n,i)=>{
      if(i>0) arrowLine(ctx,nodes[i-1].x+52,H/2,n.x-52,H/2,n.color+'66',0,false,2);
      const pulse=1+Math.sin(t*1.5+i*1.2)*0.03;
      gBox(ctx,n.x,H/2,104*pulse,44*pulse,8,n.color+'18',n.color,1.5);
      txt(ctx,n.icon,n.x,H/2-10,{size:15});
      txt(ctx,n.label,n.x,H/2+8,{size:9,color:n.color,weight:'700'});
      const ph=((t*0.4+i*0.25)%1);
      if(i<nodes.length-1){
        const px=lerp(n.x+52,nodes[i+1].x-52,ease(ph));
        gDot(ctx,px,H/2,5,n.color,0.8);
      }
    });
    txt(ctx,'Write path: Command → Event Store  |  Read path: Projections → Read Model (optimized for queries)',W/2,H-8,{size:8,color:AR.text3});
  });
}

// ============================================================
//  RATE LIMITING canvas — Token Bucket / Leaky / Sliding
// ============================================================
let rlAlgo='token-bucket', rlTokens=8, rlMaxTokens=8;
rlRefillInterval=null;
let rlRequests=[], rlT=0, rlAllowed=0, rlRejected=0;
const RL_REFILL_RATE=2; // tokens/sec visual

function initRLCanvas() {
  rlAlgo='token-bucket'; rlTokens=rlMaxTokens; rlRequests=[]; rlT=0; rlAllowed=0; rlRejected=0;
  if(rlRefillInterval) clearInterval(rlRefillInterval);
  rlRefillInterval=setInterval(()=>{
    if(rlAlgo==='token-bucket') rlTokens=Math.min(rlMaxTokens, rlTokens+1);
    if(rlAlgo==='leaky-bucket'&&rlRequests.filter(r=>r.state==='queued').length>0) {
      const next=rlRequests.find(r=>r.state==='queued');
      if(next){next.state='processing';setTimeout(()=>{next.state='done';},500);}
    }
  },800);
  _raf('rlCanvas', drawRLFrame);
}

function setRLAlgo(algo) {
  rlAlgo=algo; rlTokens=rlMaxTokens; rlRequests=[];
  document.querySelectorAll('.anim-btn').forEach(b=>{
    const t=b.textContent.toLowerCase();
    b.classList.toggle('active',(algo==='token-bucket'&&t.includes('token'))||(algo==='leaky-bucket'&&t.includes('leaky'))||(algo==='sliding-window'&&t.includes('sliding')));
  });
  const el=document.getElementById('rlStatus');
  if(el){
    const msgs={'token-bucket':'🪣 Token Bucket: '+rlTokens+'/'+rlMaxTokens+' tokens. Requests consume tokens. Refills at 1/sec. Bursting allowed up to '+rlMaxTokens+'.','leaky-bucket':'💧 Leaky Bucket: requests queue and drain at fixed rate. Strict smoothing — no bursting.','sliding-window':'📊 Sliding Window: track last 60s of request timestamps. No edge-burst problem like fixed windows.'};
    el.style.color='var(--cyan)'; el.textContent=msgs[algo];
  }
}

function rlSendRequest() {
  const id=rlRequests.length+1;
  let allowed=false;
  if(rlAlgo==='token-bucket') { if(rlTokens>=1){rlTokens--;allowed=true;}else{allowed=false;} }
  else if(rlAlgo==='leaky-bucket') { allowed=rlRequests.filter(r=>r.state==='queued').length<6; }
  else { // sliding window: allow up to 5 per visible window
    const recent=rlRequests.filter(r=>r.t>0&&r.state!=='rejected').length;
    allowed=recent<5;
  }
  rlRequests.push({id,t:0,state:allowed?'allowed':'rejected',trail:[]});
  if(allowed) rlAllowed++; else rlRejected++;
  const el=document.getElementById('rlStatus');
  if(el){
    el.style.color=allowed?'var(--green)':'var(--red)';
    el.textContent=allowed?'✅ Request #'+id+' ALLOWED ('+rlTokens+' tokens left)':'❌ Request #'+id+' REJECTED — 429 Too Many Requests';
  }
}
function rlBurst() { for(let i=0;i<5;i++) setTimeout(rlSendRequest,i*80); }

function drawRLFrame() {
  const c=arCanvas('rlCanvas'); if(!c)return;
  const {ctx,W,H}=c; rlT++;
  ctx.clearRect(0,0,W,H);
  ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();

  const clientX=W*0.1,gatewayX=W*0.42,svcX=W*0.82,midY=H/2;

  // Client
  gBox(ctx,clientX,midY,72,46,8,AR.bg,AR.blue,2);
  txt(ctx,'👤',clientX,midY-8,{size:18}); txt(ctx,'Client',clientX,midY+8,{size:10,color:AR.blue,weight:'700'});

  // Rate Limiter
  const fill=rlAlgo==='token-bucket'?(rlTokens/rlMaxTokens):rlAlgo==='leaky-bucket'?Math.max(0,1-rlRequests.filter(r=>r.state==='queued').length/6):1;
  const rCol=fill<0.3?AR.red:fill<0.6?AR.yellow:AR.green;
  ctx.save(); ctx.shadowColor=rCol; ctx.shadowBlur=14;
  gBox(ctx,gatewayX,midY,130,90,10,rCol+'12',rCol,2);
  ctx.restore();
  txt(ctx,'🚦 Rate Limiter',gatewayX,midY-34,{size:10,color:rCol,weight:'800'});

  // visual bucket/counter
  if(rlAlgo==='token-bucket') {
    const bh=60, bw=80, bx=gatewayX-bw/2, by=midY-18;
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,4); ctx.fillStyle=AR.bg3; ctx.fill();
    ctx.save(); ctx.shadowColor=rCol; ctx.shadowBlur=8;
    ctx.beginPath(); ctx.roundRect(bx,by+bh*(1-fill),bw,bh*fill,[0,0,4,4]);
    ctx.fillStyle=rCol+'77'; ctx.fill(); ctx.restore();
    txt(ctx,Math.round(rlTokens)+'/'+rlMaxTokens+' tokens',gatewayX,midY+38,{size:9,color:rCol,weight:'700'});
  } else if(rlAlgo==='leaky-bucket') {
    const queued=rlRequests.filter(r=>r.state==='queued').length;
    txt(ctx,'Queue: '+queued+'/6',gatewayX,midY-8,{size:10,color:rCol,weight:'700'});
    txt(ctx,'Leak: 1 req/800ms',gatewayX,midY+10,{size:9,color:rCol});
    txt(ctx,'▼',gatewayX,midY+28,{size:14,color:rCol+'88'});
  } else {
    const recent=rlRequests.filter(r=>r.t>0&&r.state!=='rejected').length;
    txt(ctx,recent+'/5 in window',gatewayX,midY-8,{size:10,color:rCol,weight:'700'});
    txt(ctx,'Sliding 60s window',gatewayX,midY+8,{size:9,color:rCol});
  }

  // Service
  gBox(ctx,svcX,midY,72,46,8,AR.bg,AR.green,2);
  txt(ctx,'⚙️',svcX,midY-8,{size:18}); txt(ctx,'API Service',svcX,midY+8,{size:10,color:AR.green,weight:'700'});
  arrowLine(ctx,gatewayX+65,midY,svcX-36,midY,AR.green+'66',0,false,1.5);
  arrowLine(ctx,clientX+36,midY,gatewayX-65,midY,AR.blue+'88',0,false,1.5);

  // packets
  rlRequests=rlRequests.filter(r=>r.t<1.2);
  rlRequests.forEach(r=>{
    r.t+=0.022;
    const pCol=r.state==='rejected'?AR.red:AR.green;
    let px,py=midY;
    if(r.state==='rejected'&&r.t>0.4) {
      px=lerp(gatewayX,clientX+36,ease((r.t-0.4)/0.6));
    } else {
      px=lerp(clientX+36,r.state==='rejected'?gatewayX:svcX-36,ease(Math.min(r.t/0.8,1)));
    }
    if(!r.trail)r.trail=[];
    r.trail.push({x:px,y:py}); if(r.trail.length>8)r.trail.shift();
    gDot(ctx,px,py,r.state==='rejected'?5:6,pCol,1,r.trail);
  });

  txt(ctx,'Allowed: '+rlAllowed+'  Rejected: '+rlRejected+'  Algorithm: '+rlAlgo,W/2,H-8,{size:9,color:AR.text3});
}

// ============================================================
//  CIRCUIT BREAKER canvas
// ============================================================
let cbState='closed', cbFailCount=0, cbSuccessCount=0, cbT=0, cbPackets=[], cbHalfOpenProbes=0;
const CB_THRESHOLD=3, CB_HALF_PROBES=2;

function initCBCanvas() {
  cbState='closed'; cbFailCount=0; cbSuccessCount=0; cbT=0; cbPackets=[]; cbHalfOpenProbes=0;
  _raf('cbCanvas', drawCBFrame);
  const el=document.getElementById('cbStatus');
  if(el){ el.style.color='var(--green)'; el.textContent='🟢 CLOSED — Normal operation. Requests passing through. Monitoring failure rate (threshold: '+CB_THRESHOLD+' failures).'; }
}
function cbSimulate(type) {
  if(type==='burst') { for(let i=0;i<5;i++) setTimeout(()=>cbSimulate('fail'),i*300); return; }
  cbPackets.push({type,t:0,trail:[]});
  if(type==='fail') {
    cbFailCount++;
    if(cbState==='closed'&&cbFailCount>=CB_THRESHOLD) {
      cbState='open'; cbFailCount=0;
      const el=document.getElementById('cbStatus');
      if(el){ el.style.color='var(--red)'; el.textContent='🔴 OPEN — Circuit tripped! '+CB_THRESHOLD+' failures reached. All requests now FAIL FAST (no downstream calls). Will attempt recovery after 5s…'; }
      setTimeout(()=>{ if(cbState==='open'){cbState='half-open';cbHalfOpenProbes=0;const el=document.getElementById('cbStatus');if(el){el.style.color='var(--yellow)';el.textContent='🟡 HALF-OPEN — Timeout elapsed. Allowing '+CB_HALF_PROBES+' probe requests through to test if service recovered…';}} }, 5000);
    } else if(cbState==='half-open') {
      cbState='open';
      const el=document.getElementById('cbStatus');
      if(el){ el.style.color='var(--red)'; el.textContent='🔴 OPEN again — Probe failed! Service still down. Resetting timeout…'; }
    } else {
      const el=document.getElementById('cbStatus');
      if(el){ el.style.color='var(--yellow)'; el.textContent='⚠️ Failure #'+cbFailCount+'/'+CB_THRESHOLD+'. '+(CB_THRESHOLD-cbFailCount)+' more until circuit opens.'; }
    }
  } else {
    cbSuccessCount++;
    if(cbState==='half-open') {
      cbHalfOpenProbes++;
      if(cbHalfOpenProbes>=CB_HALF_PROBES) {
        cbState='closed'; cbFailCount=0;
        const el=document.getElementById('cbStatus');
        if(el){ el.style.color='var(--green)'; el.textContent='🟢 CLOSED — Probes succeeded! Service recovered. Circuit closed. Normal operation resumed.'; }
      } else {
        const el=document.getElementById('cbStatus');
        if(el){ el.style.color='var(--yellow)'; el.textContent='🟡 HALF-OPEN probe '+cbHalfOpenProbes+'/'+CB_HALF_PROBES+' succeeded… waiting for more.'; }
      }
    } else if(cbState==='closed') {
      cbFailCount=Math.max(cbFailCount-1,0);
      const el=document.getElementById('cbStatus');
      if(el){ el.style.color='var(--green)'; el.textContent='✅ Success #'+cbSuccessCount+'. Failures reset to '+cbFailCount+'/'+CB_THRESHOLD+'.'; }
    }
  }
}
function cbReset() { cbState='closed'; cbFailCount=0; cbSuccessCount=0; cbPackets=[]; cbHalfOpenProbes=0; const el=document.getElementById('cbStatus'); if(el){el.style.color='var(--green)';el.textContent='↺ Reset. Circuit CLOSED.';} }

function drawCBFrame() {
  const c=arCanvas('cbCanvas'); if(!c)return;
  const {ctx,W,H}=c; cbT++;
  ctx.clearRect(0,0,W,H);
  ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();

  const clX=W*0.1, cbX=W*0.42, svcX=W*0.82, midY=H/2;
  const stateColor={'closed':AR.green,'open':AR.red,'half-open':AR.yellow}[cbState];
  const stateLabel={'closed':'🟢 CLOSED','open':'🔴 OPEN','half-open':'🟡 HALF-OPEN'}[cbState];

  // Client
  gBox(ctx,clX,midY,72,46,8,AR.bg,AR.blue,2);
  txt(ctx,'👤',clX,midY-8,{size:18}); txt(ctx,'Client',clX,midY+8,{size:10,color:AR.blue,weight:'700'});

  // Circuit Breaker
  ctx.save(); ctx.shadowColor=stateColor; ctx.shadowBlur=18+Math.sin(cbT*0.1)*6;
  gBox(ctx,cbX,midY,130,84,10,stateColor+'18',stateColor,2.5);
  ctx.restore();
  txt(ctx,'🔌',cbX,midY-26,{size:22});
  txt(ctx,'Circuit Breaker',cbX,midY-4,{size:10,color:stateColor,weight:'800'});
  txt(ctx,stateLabel,cbX,midY+14,{size:10,color:stateColor,weight:'700'});
  txt(ctx,'Failures: '+cbFailCount+'/'+CB_THRESHOLD,cbX,midY+28,{size:9,color:cbFailCount>0?AR.red:AR.text3});

  // State transition labels
  if(cbState==='open') txt(ctx,'⚡ FAIL FAST',cbX,midY-44,{size:9,color:AR.red,weight:'700'});
  if(cbState==='half-open') txt(ctx,'🔍 Probing '+cbHalfOpenProbes+'/'+CB_HALF_PROBES,cbX,midY-44,{size:9,color:AR.yellow,weight:'700'});

  // Service
  const svcDown=cbState==='open';
  const svcCol=svcDown?AR.red:AR.green;
  ctx.save(); if(svcDown){ctx.shadowColor=AR.red;ctx.shadowBlur=12;}
  gBox(ctx,svcX,midY,72,46,8,svcCol+'18',svcCol,1.5);
  ctx.restore();
  txt(ctx,svcDown?'💥':'⚙️',svcX,midY-8,{size:18}); txt(ctx,svcDown?'DOWN':'API Service',svcX,midY+8,{size:10,color:svcCol,weight:'700'});

  arrowLine(ctx,clX+36,midY,cbX-65,midY,AR.blue+'88',0,false,1.5);
  if(cbState!=='open') arrowLine(ctx,cbX+65,midY,svcX-36,midY,svcCol+'88',0,false,1.5);

  // packets
  cbPackets=cbPackets.filter(p=>p.t<1.1);
  cbPackets.forEach(p=>{
    p.t+=0.025;
    const isFail=p.type==='fail';
    const isOpen=cbState==='open'||isFail;
    const col=isFail?AR.red:AR.green;
    let px,py=midY;
    if(p.t<0.4) { px=lerp(clX+36,cbX-65,ease(p.t/0.4)); }
    else if(isOpen||isFail) { px=lerp(cbX,clX+36,ease((p.t-0.4)/0.6)); py=midY+(isFail?-8:0); }
    else { px=lerp(cbX+65,svcX-36,ease((p.t-0.4)/0.6)); }
    if(!p.trail)p.trail=[];
    p.trail.push({x:px,y:py}); if(p.trail.length>8)p.trail.shift();
    gDot(ctx,px,py,6,col,1,p.trail);
  });
}

// ============================================================
//  CIRCUIT BREAKER CASCADE canvas
// ============================================================
let cbCascadeMode='without', cbCascadeT=0;

function initCBCascadeCanvas() {
  cbCascadeMode='without'; cbCascadeT=0;
  setShardVsRepl && null; // no-op just to reference
  _raf('cbCascadeCanvas', drawCBCascadeFrame);
  cbCascadeDemo('without');
}
function cbCascadeDemo(mode) {
  cbCascadeMode=mode; cbCascadeT=0;
  document.querySelectorAll('.anim-btn').forEach(b=>{
    b.classList.toggle('active', b.textContent.toLowerCase().includes(mode==='without'?'without':'with'));
  });
  const el=document.getElementById('cbCascadeStatus');
  if(el){
    el.style.color=mode==='without'?'var(--red)':'var(--green)';
    el.textContent=mode==='without'
      ? '❌ Without CB: Payment Service times out → all threads blocked → API Gateway exhausted → entire app crashes'
      : '✅ With CB: Payment Service open → fail fast → API Gateway returns fallback → other services unaffected';
  }
}

function drawCBCascadeFrame() {
  const c=arCanvas('cbCascadeCanvas'); if(!c)return;
  const {ctx,W,H}=c; cbCascadeT++;
  ctx.clearRect(0,0,W,H);
  ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();

  const withCB=cbCascadeMode==='with';
  const services=[
    {label:'API Gateway',   x:W*0.15,color:'#6366f1',icon:'🚪'},
    {label:'Order Service', x:W*0.38,color:'#22c55e',icon:'🛒'},
    {label:'Payment Svc',   x:W*0.62,color:'#f59e0b',icon:'💳'},
    {label:'DB',            x:W*0.85,color:'#06b6d4',icon:'🗄️'},
  ];
  const crashed=!withCB&&cbCascadeT>60;
  const paymentDown=cbCascadeT>20;

  services.forEach((s,i)=>{
    const isCrashed=crashed&&i<=1;
    const isDown=paymentDown&&i===2;
    const col=isCrashed?AR.red:isDown?AR.red:s.color;
    ctx.save(); if(isCrashed||isDown){ctx.shadowColor=AR.red;ctx.shadowBlur=12+Math.sin(cbCascadeT*0.3)*6;}
    gBox(ctx,s.x,H/2,84,46,8,col+'18',col,isCrashed||isDown?2.5:1.5);
    ctx.restore();
    txt(ctx,isCrashed?'💥':isDown?'💥':s.icon,s.x,H/2-9,{size:16});
    txt(ctx,isCrashed?'CRASHED':isDown?'TIMED OUT':s.label,s.x,H/2+8,{size:9,color:col,weight:'700'});
    if(i<services.length-1) {
      const nextS=services[i+1];
      const lCol=(crashed&&i===1)||(paymentDown&&i===2)?AR.red:col;
      arrowLine(ctx,s.x+42,H/2,nextS.x-42,H/2,lCol+'66',0,false,1.5);
    }
  });

  // CB box between Order and Payment
  if(withCB) {
    const cbBx=W*0.5, cbBy=H/2;
    const cbCol=paymentDown?AR.red:AR.green;
    ctx.save(); ctx.shadowColor=cbCol; ctx.shadowBlur=12;
    gBox(ctx,cbBx,cbBy,60,28,6,cbCol+'22',cbCol,2);
    ctx.restore();
    txt(ctx,paymentDown?'🔴 OPEN':'🟢 CB',cbBx,cbBy-4,{size:10,color:cbCol,weight:'800'});
    txt(ctx,paymentDown?'fail fast':'closed',cbBx,cbBy+8,{size:8,color:cbCol});
  }

  // wave of "blocked" requests without CB
  if(!withCB&&paymentDown) {
    for(let i=0;i<3;i++) {
      const age=(cbCascadeT+i*22)%66;
      const x=lerp(W*0.38+42,W*0.62-42,ease(age/66));
      ctx.save(); ctx.globalAlpha=0.4;
      gDot(ctx,x,H/2,5,AR.red,1);
      ctx.restore();
    }
    txt(ctx,'⏳ Requests hanging…',W*0.5,H/2-30,{size:9,color:AR.red+'cc',weight:'600'});
  }

  const label=withCB?'✅ Failure isolated — other services healthy':'❌ Cascading failure — one slow service crashes everything';
  txt(ctx,label,W/2,H-10,{size:9,color:withCB?AR.green:AR.red,weight:'700'});
}

// ============================================================
//  BLOB STORAGE canvas
// ============================================================
let blobT=0, blobPackets=[];
function initBlobCanvas() {
  blobT=0; blobPackets=[];
  _raf('blobCanvas', ()=>{
    const c=arCanvas('blobCanvas'); if(!c)return;
    const {ctx,W,H}=c; blobT++;
    ctx.clearRect(0,0,W,H);
    ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.restore();

    const clX=W*0.1, cdnX=W*0.38, s3X=W*0.65, azX=W*0.88, midY=H/2;

    gBox(ctx,clX,midY,72,46,8,AR.bg,AR.blue,2);
    txt(ctx,'📱',clX,midY-9,{size:18}); txt(ctx,'Client',clX,midY+9,{size:10,color:AR.blue,weight:'700'});

    const cdnPulse=1+Math.sin(blobT*0.06)*0.02;
    gBox(ctx,cdnX,midY,96*cdnPulse,52*cdnPulse,8,AR.yellow+'18',AR.yellow,2);
    txt(ctx,'🌐',cdnX,midY-12,{size:16}); txt(ctx,'CDN Edge',cdnX,midY+4,{size:10,color:AR.yellow,weight:'700'});
    txt(ctx,'Cache',cdnX,midY+16,{size:8,color:AR.yellow+'88'});

    gBox(ctx,s3X,midY-30,96,40,8,AR.yellow+'18',AR.yellow,1.5);
    txt(ctx,'📦 AWS S3',s3X,midY-30,{size:10,color:AR.yellow,weight:'700'});
    txt(ctx,'11 nines durability',s3X,midY-15,{size:8,color:AR.yellow+'88'});

    gBox(ctx,s3X,midY+30,96,36,8,AR.blue+'18',AR.blue,1.5);
    txt(ctx,'🔒 ACL / Signed URL',s3X,midY+30,{size:9,color:AR.blue,weight:'600'});

    gBox(ctx,azX,midY,80,46,8,AR.blue+'18',AR.blue,1.5);
    txt(ctx,'☁️',azX,midY-9,{size:16}); txt(ctx,'3 AZs',azX,midY+6,{size:9,color:AR.blue,weight:'700'});
    txt(ctx,'redundant',azX,midY+18,{size:8,color:AR.blue+'88'});

    // arrows
    arrowLine(ctx,clX+36,midY,cdnX-48,midY,AR.blue+'88',0,false,1.5);
    arrowLine(ctx,cdnX+48,midY-6,s3X-48,midY-30,AR.yellow+'66',blobT,true,1.5);
    arrowLine(ctx,s3X+48,midY-30,azX-40,midY-10,AR.blue+'66',0,false,1);
    arrowLine(ctx,s3X+48,midY+30,azX-40,midY+10,AR.blue+'66',blobT,true,1);

    // pulsing upload dot
    const ph=(blobT*0.008)%1;
    const px=lerp(clX+36,s3X-48,ease(ph));
    const py=lerp(midY,midY-30,ease(ph));
    gDot(ctx,px,py,5,AR.yellow,0.7);

    txt(ctx,'Client → CDN (cache hit) or S3 (miss) → replicated across 3 AZs — 11-nines durability',W/2,H-8,{size:8,color:AR.text3});
  });
}
function simulateBlob() {} // button-less, auto-animated

// ============================================================
//  SEARCH canvas — inverted index
// ============================================================
let searchT=0, searchQuery='', searchHighlight=[];
const SEARCH_DOCS=[
  {id:1,text:'Netflix builds streaming platform'},
  {id:2,text:'Netflix movie recommendation engine'},
  {id:3,text:'Stream video at scale with CDN'},
];
const SEARCH_INDEX={
  netflix:[1,2], stream:[3], platform:[1], movie:[2],
  recommendation:[2], video:[3], cdn:[3], scale:[3],
};

function initSearchCanvas() {
  searchT=0; searchQuery=''; searchHighlight=[];
  _raf('searchCanvas', drawSearchFrame);
}
function searchDemo(q) {
  searchQuery=q; searchHighlight=SEARCH_INDEX[q.toLowerCase()]||[];
  const el=document.getElementById('searchStatus');
  if(el){ el.style.color='var(--cyan)'; el.textContent='🔍 Query "'+q+'" → inverted index lookup → found in '+searchHighlight.length+' docs in O(1)'; }
}
function drawSearchFrame() {
  const c=arCanvas('searchCanvas'); if(!c)return;
  const {ctx,W,H}=c; searchT++;
  ctx.clearRect(0,0,W,H);
  ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();

  const idxX=W*0.28, docX=W*0.72, midY=H/2;

  // Index box
  gBox(ctx,idxX,midY,200,H*0.8,12,AR.accent+'12',AR.accent,1.5);
  txt(ctx,'📑 Inverted Index',idxX,H*0.12,{size:10,color:AR.a2,weight:'700'});
  const terms=Object.keys(SEARCH_INDEX);
  terms.forEach((t,i)=>{
    const isMatch=t===searchQuery.toLowerCase();
    const ty=H*0.22+i*(H*0.62/terms.length);
    ctx.save(); if(isMatch){ctx.shadowColor=AR.cyan;ctx.shadowBlur=14;}
    gBox(ctx,idxX,ty,180,18,4,isMatch?AR.cyan+'22':AR.bg3,isMatch?AR.cyan:AR.border,isMatch?2:1);
    ctx.restore();
    txt(ctx,t+' → ['+SEARCH_INDEX[t]+']',idxX,ty,{size:9,color:isMatch?AR.cyan:AR.text3,weight:isMatch?'700':'400'});
  });

  // Documents
  SEARCH_DOCS.forEach((d,i)=>{
    const dy=H*0.2+i*(H*0.28);
    const isHL=searchHighlight.includes(d.id);
    ctx.save(); if(isHL){ctx.shadowColor=AR.green;ctx.shadowBlur=14;}
    gBox(ctx,docX,dy,210,38,8,isHL?AR.green+'18':AR.bg2,isHL?AR.green:AR.border,isHL?2:1.5);
    ctx.restore();
    txt(ctx,'Doc #'+d.id,docX-90,dy-8,{size:9,color:isHL?AR.green:AR.text3,weight:'700',align:'left'});
    txt(ctx,d.text,docX-90,dy+6,{size:8,color:isHL?AR.text:AR.text3,align:'left'});
    if(isHL) txt(ctx,'✅ MATCH',docX+76,dy,{size:9,color:AR.green,weight:'700'});
    // arrow from index to doc
    if(isHL) arrowLine(ctx,idxX+100,H*0.22+(terms.indexOf(searchQuery.toLowerCase()))*(H*0.62/terms.length),docX-105,dy,AR.cyan+'88',0,false,1.5);
  });

  txt(ctx,'Inverted Index: term → document IDs. Lookup is O(1). Used by Elasticsearch, Solr, Lucene.',W/2,H-8,{size:8,color:AR.text3});
}

// ============================================================
//  REALTIME canvas — WebSocket pub-sub
// ============================================================
let rtT=0, rtPackets=[];
function initRTCanvas() {
  rtT=0; rtPackets=[];
  _raf('rtCanvas', ()=>{
    const c=arCanvas('rtCanvas'); if(!c)return;
    const {ctx,W,H}=c; rtT++;
    ctx.clearRect(0,0,W,H);
    ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.restore();

    const srvX=W*0.5, midY=H/2;
    const clients=[
      {x:W*0.1,y:H*0.2,label:'User A',color:'#6366f1',icon:'👤'},
      {x:W*0.1,y:H*0.5,label:'User B',color:'#22c55e',icon:'👤'},
      {x:W*0.1,y:H*0.8,label:'User C',color:'#f59e0b',icon:'👤'},
      {x:W*0.9,y:H*0.2,label:'User D',color:'#ec4899',icon:'👤'},
      {x:W*0.9,y:H*0.5,label:'User E',color:'#06b6d4',icon:'👤'},
      {x:W*0.9,y:H*0.8,label:'User F',color:'#ef4444',icon:'👤'},
    ];

    // WS server
    const pulse=1+Math.sin(rtT*0.06)*0.02;
    ctx.save(); ctx.shadowColor=AR.accent; ctx.shadowBlur=16;
    gBox(ctx,srvX,midY,110*pulse,80*pulse,10,AR.accent+'18',AR.accent,2);
    ctx.restore();
    txt(ctx,'⚡',srvX,midY-22,{size:22}); txt(ctx,'WS Server',srvX,midY-2,{size:10,color:AR.a2,weight:'800'});
    txt(ctx,'Redis Pub/Sub',srvX,midY+14,{size:8,color:AR.a2+'88'});
    txt(ctx,'Room: "live-scores"',srvX,midY+26,{size:8,color:AR.a2+'66'});

    clients.forEach(cl=>{
      arrowLine(ctx,cl.x>W/2?cl.x-36:cl.x+36,cl.y,srvX+(cl.x>W/2?55:-55),midY,cl.color+'44',rtT*(cl.x>W/2?1:-1),true,1);
      gBox(ctx,cl.x,cl.y,68,34,8,cl.color+'18',cl.color,1.5);
      txt(ctx,cl.icon,cl.x,cl.y-7,{size:13}); txt(ctx,cl.label,cl.x,cl.y+7,{size:9,color:cl.color,weight:'700'});
      // broadcast dots from server to clients
      if(rtT%40===Math.floor(cl.y/H*40)%40) rtPackets.push({x1:srvX,y1:midY,x2:cl.x,y2:cl.y,t:0,color:cl.color,trail:[]});
    });

    rtPackets=rtPackets.filter(p=>p.t<1);
    rtPackets.forEach(p=>{
      p.t+=0.035;
      const px=lerp(p.x1,p.x2,ease(p.t)), py=lerp(p.y1,p.y2,ease(p.t));
      if(!p.trail)p.trail=[];
      p.trail.push({x:px,y:py}); if(p.trail.length>8)p.trail.shift();
      gDot(ctx,px,py,5,p.color,0.9,p.trail);
    });

    txt(ctx,'WebSocket: one persistent connection per client — server pushes to all in room instantly',W/2,H-8,{size:8,color:AR.text3});
  });
}

// ============================================================
//  SERVICE DISCOVERY CANVAS — Dynamic Registration & Health Checks
// ============================================================
let sdMode = 'client';
let sdInstances = [
  { id: 'payment-1', ip: '10.0.0.5:8080', status: 'healthy' },
  { id: 'payment-2', ip: '10.0.0.8:8080', status: 'healthy' },
  { id: 'payment-3', ip: '10.0.0.10:8080', status: 'healthy' }
];
let sdPackets = [], sdHeartbeats = [], sdT = 0, sdStatusText = '', sdReqIdx = 0;

function setSDMode(m) {
  sdMode = m;
  sdStatusText = m === 'client' ? 'Client-Side: Booking service queries Registry directly & load-balances' : 'Server-Side: Booking service calls Gateway → Gateway queries Registry & routes';
}

function sdSendRequest() {
  const healthy = sdInstances.filter(i => i.status === 'healthy');
  if (!healthy.length) {
    sdStatusText = '❌ Request Failed: No healthy payment-service instances in registry!';
    return;
  }
  const chosen = healthy[sdReqIdx % healthy.length];
  sdReqIdx++;
  sdPackets.push({ t: 0, target: chosen, mode: sdMode });
  sdStatusText = `⚡ Booking Service sending request → Routing to healthy instance ${chosen.ip}`;
}

function sdCrashInstance() {
  const p2 = sdInstances.find(i => i.id === 'payment-2');
  if (p2) {
    p2.status = p2.status === 'healthy' ? 'unhealthy' : 'healthy';
    sdStatusText = p2.status === 'unhealthy' ? '❌ Payment-2 (10.0.0.8) CRASHED! Heartbeat failed → Registry marked UNHEALTHY' : '✅ Payment-2 recovered & re-registered with Service Registry';
  }
}

function sdAddInstance() {
  const existing = sdInstances.find(i => i.id === 'payment-4');
  if (!existing) {
    sdInstances.push({ id: 'payment-4', ip: '10.0.0.25:8080', status: 'healthy' });
    sdStatusText = '➕ New Instance Payment-4 (10.0.0.25) started → Auto-registered with Service Registry!';
  } else {
    sdStatusText = 'Instance 4 already running!';
  }
}

function initSDCanvas() {
  const el = document.getElementById('sdCanvas'); if (!el) return;
  _stopRaf('sdCanvas');
  arStart('sdCanvas', () => {
    const c = arCanvas('sdCanvas'); if (!c) return;
    const { ctx, W, H } = c;
    sdT += 0.015;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
    ctx.clearRect(0, 0, W, H);

    const regX = W * 0.5, regY = 40;
    ctx.save(); ctx.shadowColor = AR.accent; ctx.shadowBlur = 4;
    gBox(ctx, regX, regY, 180, 52, 8, AR.bg2, AR.accent, 1.5);
    ctx.restore();
    txt(ctx, '📋 Service Registry', regX, regY - 10, { size: 10, color: AR.a2, weight: '800' });
    txt(ctx, '(Consul / Eureka / K8s DNS)', regX, regY + 8, { size: 8, color: AR.text3 });

    const bookX = 75, bookY = H * 0.55;
    gBox(ctx, bookX, bookY, 110, 50, 8, AR.purple + '18', AR.purple, 1.5);
    txt(ctx, '🎟️ Booking Svc', bookX, bookY - 8, { size: 10, color: AR.purple, weight: '700' });
    txt(ctx, 'Cache: payment-svc', bookX, bookY + 8, { size: 8, color: AR.text3 });

    const gwyX = W * 0.32, gwyY = H * 0.55;
    if (sdMode === 'server') {
      gBox(ctx, gwyX, gwyY, 84, 44, 6, AR.yellow + '18', AR.yellow, 1.5);
      txt(ctx, '🚪 Gateway / LB', gwyX, gwyY - 6, { size: 9, color: AR.yellow, weight: '700' });
      txt(ctx, 'Routing Proxy', gwyX, gwyY + 8, { size: 7, color: AR.text3 });
    }

    const instStartX = W - 90;
    const instYStep = Math.min(48, (H - 50) / (sdInstances.length || 1));
    sdInstances.forEach((inst, idx) => {
      const iy = 40 + idx * instYStep;
      inst.y = iy; inst.x = instStartX;
      const isOk = inst.status === 'healthy';
      const col = isOk ? AR.green : AR.red;
      gBox(ctx, inst.x, iy, 120, 36, 6, col + '15', col, 1.5);
      txt(ctx, `${isOk ? '💳' : '❌'} ${inst.id}`, inst.x - 10, iy - 6, { size: 9, color: col, weight: '700' });
      txt(ctx, inst.ip, inst.x - 10, iy + 8, { size: 8, color: AR.text3 });
    });

    const healthyCount = sdInstances.filter(i => i.status === 'healthy').length;
    txt(ctx, `Registered: ${healthyCount}/${sdInstances.length} healthy`, regX, regY + 20, { size: 8, color: AR.green, weight: '700' });

    if (sdMode === 'client') {
      arrowLine(ctx, bookX + 55, bookY - 15, regX - 90, regY + 10, AR.accent + '66', 0, true, 1);
      sdInstances.forEach(inst => {
        const isOk = inst.status === 'healthy';
        arrowLine(ctx, bookX + 55, bookY + 5, inst.x - 60, inst.y, (isOk ? AR.purple : AR.red) + '44', 0, !isOk, 1);
      });
    } else {
      arrowLine(ctx, bookX + 55, bookY, gwyX - 42, gwyY, AR.purple + '88', 0, false, 1.5);
      arrowLine(ctx, gwyX, gwyY - 22, regX - 90, regY + 15, AR.yellow + '66', 0, true, 1);
      sdInstances.forEach(inst => {
        const isOk = inst.status === 'healthy';
        arrowLine(ctx, gwyX + 42, gwyY, inst.x - 60, inst.y, (isOk ? AR.green : AR.red) + '44', 0, !isOk, 1);
      });
    }

    sdPackets = sdPackets.filter(p => p.t < 1);
    sdPackets.forEach(p => {
      p.t += 0.03;
      let px = 0, py = 0;
      if (p.mode === 'client') {
        px = lerp(bookX + 55, p.target.x - 60, ease(p.t));
        py = lerp(bookY, p.target.y, ease(p.t));
      } else {
        if (p.t < 0.5) {
          px = lerp(bookX + 55, gwyX - 42, ease(p.t * 2));
          py = lerp(bookY, gwyY, ease(p.t * 2));
        } else {
          px = lerp(gwyX + 42, p.target.x - 60, ease((p.t - 0.5) * 2));
          py = lerp(gwyY, p.target.y, ease((p.t - 0.5) * 2));
        }
      }
      gDot(ctx, px, py, 5, AR.accent, 0.9);
    });

    const statusEl = document.getElementById('sdStatus');
    if (statusEl) statusEl.textContent = sdStatusText || `Mode: ${sdMode === 'client' ? 'Client-Side Discovery' : 'Server-Side Discovery'} | ${healthyCount} Healthy Instances`;

    ctx.restore();
  });
}
