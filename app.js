// ============================================================
//  APP.JS — routing, canvas utilities, and all non-CH animations
// ============================================================

// ── POLYFILL & SAFETY GUARDS ────────────────────────────────
if (typeof CanvasRenderingContext2D !== 'undefined') {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    if (w < 0) { x += w; w = Math.abs(w); }
    if (h < 0) { y += h; h = Math.abs(h); }
    if (w < 0.5 || h < 0.5) return;
    let rTL = 0, rTR = 0, rBR = 0, rBL = 0;
    if (typeof radii === 'number') {
      rTL = rTR = rBR = rBL = radii;
    } else if (Array.isArray(radii)) {
      rTL = radii[0] || 0;
      rTR = radii[1] !== undefined ? radii[1] : rTL;
      rBR = radii[2] !== undefined ? radii[2] : rTL;
      rBL = radii[3] !== undefined ? radii[3] : rTR;
    }
    const maxR = Math.min(w / 2, h / 2);
    rTL = Math.min(rTL, maxR);
    rTR = Math.min(rTR, maxR);
    rBR = Math.min(rBR, maxR);
    rBL = Math.min(rBL, maxR);

    this.moveTo(x + rTL, y);
    this.lineTo(x + w - rTR, y);
    if (rTR > 0) this.arcTo(x + w, y, x + w, y + rTR, rTR);
    this.lineTo(x + w, y + h - rBR);
    if (rBR > 0) this.arcTo(x + w, y + h, x + w - rBR, y + h, rBR);
    this.lineTo(x + rBL, y + h);
    if (rBL > 0) this.arcTo(x, y + h, x, y + h - rBL, rBL);
    this.lineTo(x, y + rTL);
    if (rTL > 0) this.arcTo(x, y, x + rTL, y, rTL);
    this.closePath();
  };
}

const TOPIC_ORDER = [
  'intro','scalability','latency','cap',
  'load-balancing','consistent-hashing','caching','cdn','websocket','databases','sharding','replication',
  'microservices','api-gateway','service-discovery','message-queues','event-driven','rate-limiting','circuit-breaker','ha-ft',
  'blob-storage','search','realtime'
];

let visited = new Set(JSON.parse(localStorage.getItem('visited') || '[]'));
let currentTopic = 'intro';
let lbAlgo = 'round-robin', lbRR = 0, lbLoads = [15,30,20,10];
let cacheHits = 0, cacheMisses = 0;
let capSelected = null;
let chNodes = [], chKeys = [];
let msFailedIdx = -1, msView2 = 'micro';

// active RAF handles – keyed by canvas id
const _rafs = {};
function _raf(id, fn) {
  if (_rafs[id]) cancelAnimationFrame(_rafs[id]);
  function loop() {
    _rafs[id] = requestAnimationFrame(loop);
    try {
      fn();
    } catch(err) {
      console.warn(`[RAF:${id}] frame error:`, err);
    }
  }
  _rafs[id] = requestAnimationFrame(loop);
}
function _stopRaf(id) {
  if (_rafs[id]) { cancelAnimationFrame(_rafs[id]); delete _rafs[id]; }
}

let rlRefillInterval = null;

// ── ROUTING ──────────────────────────────────────────────────
function loadTopic(id) {
  if (!TOPICS[id]) return;
  Object.keys(_rafs).forEach(_stopRaf);
  if (typeof rlRefillInterval !== 'undefined' && rlRefillInterval) {
    clearInterval(rlRefillInterval);
    rlRefillInterval = null;
  }

  currentTopic = id;
  if (window.location.hash !== '#' + id) {
    history.pushState(null, '', '#' + id);
  }
  visited.add(id);
  localStorage.setItem('visited', JSON.stringify([...visited]));

  const content = document.getElementById('mainContent');
  content.innerHTML = '';
  try {
    TOPICS[id].render(content);
  } catch(err) {
    console.error(`Error rendering topic [${id}]:`, err);
  }

  document.querySelectorAll('.nav-link').forEach(l =>
    l.classList.toggle('active', l.dataset.topic === id));
  document.getElementById('topbarTitle').textContent = TOPICS[id].title;

  const pct = Math.round((visited.size / TOPIC_ORDER.length) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressPct').textContent = pct + '%';
  window.scrollTo(0, 0);
  document.getElementById('sidebar').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link').forEach(l =>
    l.addEventListener('click', e => { e.preventDefault(); loadTopic(l.dataset.topic); }));
  document.getElementById('menuBtn').addEventListener('click', () =>
    document.getElementById('sidebar').classList.toggle('open'));
  document.getElementById('closeSidebar').addEventListener('click', () =>
    document.getElementById('sidebar').classList.remove('open'));
  // close sidebar when clicking the overlay (mobile)
  document.getElementById('sidebar').addEventListener('click', e => {
    if (e.target === e.currentTarget) document.getElementById('sidebar').classList.remove('open');
  });

  window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1);
    if (hash && TOPICS[hash]) loadTopic(hash);
  });

  const initHash = window.location.hash.slice(1);
  if (initHash && TOPICS[initHash]) {
    loadTopic(initHash);
  } else {
    loadTopic('intro');
  }
});

// ============================================================
//  CANVAS UTILITIES
// ============================================================
function getCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;

  const H = parseFloat(canvas.getAttribute('height') || 240);
  const container = canvas.closest('.anim-container') || canvas.parentElement;

  let W = 650;
  if (container) {
    const rect = container.getBoundingClientRect();
    const cW = rect.width || container.clientWidth;
    if (cW && cW > 200) {
      W = Math.max(300, Math.floor(cW - 36));
    }
  }

  if (canvas.width !== W || canvas.height !== H) {
    canvas.width  = W;
    canvas.height = H;
    canvas.style.removeProperty('width');
    canvas.style.removeProperty('height');
  }

  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return { ctx, W, H };
}

const ease = t => t < .5 ? 2*t*t : -1+(4-2*t)*t;
const lerp = (a,b,t) => a + (b-a)*t;

function gBox(ctx, x, y, w, h, r, fillHex, glowHex, lineW=1.5) {
  ctx.save();
  ctx.shadowColor = glowHex; ctx.shadowBlur = 4;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fillHex; ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = glowHex; ctx.lineWidth = lineW; ctx.stroke();
  ctx.restore();
}

function txt(ctx, s, x, y, { size=12, color='#94a3b8', weight='500', align='center', baseline='middle' }={}) {
  ctx.save();
  ctx.font = `${weight} ${size}px Inter,sans-serif`;
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = baseline;
  ctx.fillText(s, x, y);
  ctx.restore();
}

function arrowLine(ctx, x1, y1, x2, y2, color='#334155', dashOffset=0, dashed=false, lineW=1.5) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = lineW;
  if (dashed) { ctx.setLineDash([6,4]); ctx.lineDashOffset = dashOffset; }
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  ctx.setLineDash([]);
  const a = Math.atan2(y2-y1, x2-x1);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 9*Math.cos(a-.4), y2 - 9*Math.sin(a-.4));
  ctx.lineTo(x2 - 9*Math.cos(a+.4), y2 - 9*Math.sin(a+.4));
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function gDot(ctx, x, y, r, color, alpha=1, trail=null) {
  if (trail) {
    trail.forEach((p, i) => {
      const a = (i/trail.length) * alpha * 0.5;
      ctx.beginPath(); ctx.arc(p.x, p.y, r * (i/trail.length), 0, Math.PI*2);
      ctx.fillStyle = color + Math.floor(a*255).toString(16).padStart(2,'0'); ctx.fill();
    });
  }
  ctx.save();
  ctx.shadowColor = color; ctx.shadowBlur = 4;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fillStyle = color; ctx.globalAlpha = alpha; ctx.fill();
  ctx.restore();
}

// ============================================================
//  INTRO CANVAS — animated bar chart
// ============================================================
function initIntroCanvas() {
  const c = getCanvas('introCanvas'); if (!c) return;
  const pillars = [
    { label:'Scalability',     color:'#6366f1' },
    { label:'Reliability',     color:'#22c55e' },
    { label:'Performance',     color:'#f59e0b' },
    { label:'Maintainability', color:'#06b6d4' },
    { label:'Security',        color:'#ec4899' },
  ];
  const targets = [0.65, 0.85, 0.72, 0.78, 0.68];
  const current = pillars.map(() => 0);
  let t = 0;
  _raf('introCanvas', () => {
    const cObj = getCanvas('introCanvas') || c;
    if (!cObj || !cObj.ctx) return;
    const { ctx, W, H } = cObj;
    t += 0.012;
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
    ctx.clearRect(0, 0, W, H);
    const bw = Math.max(10, Math.min((W - 48) / pillars.length - 10, 100));
    const totalW = (bw + 10) * pillars.length - 10;
    const sx = (W - totalW) / 2;
    pillars.forEach((p, i) => {
      current[i] = lerp(current[i], targets[i] + Math.sin(t + i)*0.04, 0.06);
      const bh = Math.max(1, current[i] * (H - 52));
      const x = sx + i * (bw + 10);
      const y = H - 38 - bh;
      const gr = ctx.createLinearGradient(0, y, 0, Math.max(y + bh, y + 1));
      gr.addColorStop(0, p.color + 'aa'); gr.addColorStop(1, p.color + '33');
      ctx.save(); ctx.shadowColor = p.color; ctx.shadowBlur = 4;
      ctx.beginPath(); ctx.roundRect(x, y, bw, bh, [6,6,0,0]);
      ctx.fillStyle = gr; ctx.fill();
      ctx.strokeStyle = p.color; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
      txt(ctx, Math.round(current[i]*100)+'%', x+bw/2, y-10, { size:11, color:p.color, weight:'700' });
      txt(ctx, p.label, x+bw/2, H-18, { size:10, color:'#64748b' });
    });
    ctx.save(); ctx.strokeStyle = '#1e2535'; ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1.0].forEach(v => {
      const y = H - 38 - v*(H-52);
      ctx.beginPath(); ctx.moveTo(sx-4, y); ctx.lineTo(sx+totalW+4, y); ctx.stroke();
    });
    ctx.restore();
    ctx.restore();
  });
}

// ============================================================
//  SCALABILITY CANVAS
// ============================================================
let scalingMode = 'vertical';
function initScalingCanvas(mode) {
  scalingMode = mode || 'vertical';
  _stopRaf('scalingCanvas');
  let t = 0;
  _raf('scalingCanvas', () => {
    const c = getCanvas('scalingCanvas'); if (!c) return;
    const { ctx, W, H } = c;
    t += 0.02; ctx.clearRect(0, 0, W, H);
    if (scalingMode === 'vertical') {
      const sizes = [36, 54, 72, 96], alpha = [0.3, 0.55, 0.78, 1.0];
      sizes.forEach((s, i) => {
        const x = W*0.12 + i * (W*0.22);
        const pulse = 1 + Math.sin(t*2 + i*0.8) * 0.02, ss = s * pulse;
        gBox(ctx, x-ss/2, H/2-ss/2, ss, ss, 8, `rgba(99,102,241,${alpha[i]*0.18})`, `rgba(99,102,241,${alpha[i]})`, 2);
        txt(ctx, '🖥️', x, H/2, { size: s*0.3 });
        txt(ctx, `${[8,16,32,64][i]}GB RAM`, x, H/2 - ss/2 - 14, { size:10, color:'#818cf8', weight:'700' });
        if (i < 3) arrowLine(ctx, x+ss/2+4, H/2, x + W*0.22 - sizes[i+1]*(1+Math.sin(t*2+(i+1)*0.8)*0.02)/2 - 6, H/2, '#2a3347');
      });
      txt(ctx, '▲ Scale Up: same machine, bigger spec', W/2, H-12, { size:11, color:'#6366f1aa' });
    } else {
      const count = 4, s = 56, gap = (W - count*s) / (count+1);
      const active = Math.floor(t / 1.2) % count;
      for (let i = 0; i < count; i++) {
        const x = gap + i*(s+gap) + s/2, pulse = i===active ? 1+Math.sin(t*4)*0.05 : 1, ss = s*pulse;
        const load = i===active ? 0.7 + Math.sin(t*3)*0.15 : 0.2 + i*0.08;
        gBox(ctx, x-ss/2, H/2-ss/2, ss, ss, 8, `rgba(6,182,212,${i===active?0.18:0.07})`, `rgba(6,182,212,${i===active?1:0.4})`, i===active?2:1.5);
        txt(ctx, '🖥️', x, H/2-4, { size:18 });
        txt(ctx, `S${i+1}`, x, H/2+14, { size:9, color: i===active?'#06b6d4':'#475569', weight:'600' });
        const bw = ss-16, bh = 4, bx = x - bw/2, by = H/2 + ss/2 + 8;
        ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 2); ctx.fillStyle = '#1e2535'; ctx.fill();
        const lc = load > 0.7 ? '#ef4444' : load > 0.4 ? '#f59e0b' : '#22c55e';
        ctx.beginPath(); ctx.roundRect(bx, by, bw*load, bh, 2); ctx.fillStyle = lc; ctx.fill();
        if (i === active) { ctx.save(); ctx.shadowColor='#06b6d4'; ctx.shadowBlur=20; ctx.beginPath(); ctx.roundRect(x-ss/2, H/2-ss/2, ss, ss, 8); ctx.strokeStyle='#06b6d4'; ctx.lineWidth=2; ctx.stroke(); ctx.restore(); }
      }
      gBox(ctx, W/2-62, 14, 124, 32, 8, 'rgba(99,102,241,0.12)', '#6366f1', 2);
      txt(ctx, '⚖️ Load Balancer', W/2, 30, { size:11, color:'#818cf8', weight:'700' });
      for (let i = 0; i < count; i++) { const x = gap + i*(s+gap) + s/2; arrowLine(ctx, W/2, 46, x, H/2-s/2-4, i===active?'#06b6d488':'#2a3347', 0, false, i===active?2:1); }
      txt(ctx, '▶ Scale Out: more machines, distribute load', W/2, H-12, { size:11, color:'#06b6d4aa' });
    }
  });
}
function setScaling(mode) {
  scalingMode = mode;
  document.querySelectorAll('.anim-btn').forEach(b => b.classList.toggle('active', b.textContent.toLowerCase().includes(mode.split('-')[0])));
  initScalingCanvas(mode);
}

// ============================================================
//  LATENCY CANVAS
// ============================================================
function initLatencyCanvas() {
  const data = [
    { label:'L1 Cache',        ns:0.5,       display:'0.5 ns',  color:'#22c55e' },
    { label:'L2 Cache',        ns:7,         display:'7 ns',    color:'#22c55e' },
    { label:'RAM Read',        ns:100,       display:'100 ns',  color:'#06b6d4' },
    { label:'SSD Random',      ns:150000,    display:'150 µs',  color:'#f59e0b' },
    { label:'HDD Seek',        ns:10000000,  display:'10 ms',   color:'#ef4444' },
    { label:'Same DC',         ns:500000,    display:'0.5 ms',  color:'#818cf8' },
    { label:'Cross-continent', ns:150000000, display:'150 ms',  color:'#ec4899' },
  ];
  const maxLog = Math.log10(data[data.length-1].ns);
  let progress = 0;
  _raf('latencyCanvas', () => {
    const c = getCanvas('latencyCanvas'); if (!c) return;
    const { ctx, W, H } = c;
    progress = Math.min(progress + 0.025, 1);
    ctx.clearRect(0, 0, W, H);
    const barH = 24, gap = 6, pL = 148, pR = 90;
    data.forEach((d, i) => {
      const y = 10 + i*(barH+gap);
      const logV = Math.log10(Math.max(d.ns, 0.1));
      const fullW = (logV/maxLog)*(W - pL - pR);
      const barW = fullW * ease(Math.min(progress * 1.5 - i*0.08, 1));
      ctx.save(); ctx.shadowColor = d.color; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.roundRect(pL, y, Math.max(barW, 3), barH, 4);
      ctx.fillStyle = d.color+'44'; ctx.fill(); ctx.strokeStyle = d.color; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.roundRect(pL+1, y+1, Math.max(barW-2,1), 3, 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
      txt(ctx, d.label, pL-8, y+barH/2, { size:11, color:'#94a3b8', align:'right' });
      if (barW > 10) txt(ctx, d.display, pL+barW+6, y+barH/2, { size:11, color:d.color, weight:'700', align:'left' });
    });
  });
}

// ============================================================
//  CAP THEOREM — glowing triangle
// ============================================================
function initCAPCanvas() {
  let t = 0;
  _raf('capCanvas', () => {
    t += 0.015;
    const c = getCanvas('capCanvas'); if (!c) return;
    const { ctx, W, H } = c;
    ctx.clearRect(0, 0, W, H);
    const cx = W/2, cy = H/2+10, R = Math.min(W,H)*0.35;
    const nodes = [
      { id:'C', label:'Consistency',    angle:-90,  color:'#3b82f6' },
      { id:'A', label:'Availability',   angle:150,  color:'#22c55e' },
      { id:'P', label:'Partition\nTol', angle:30,   color:'#f59e0b' },
    ];
    const pts = nodes.map(n => ({ ...n, x: cx + R*Math.cos(n.angle*Math.PI/180), y: cy + R*Math.sin(n.angle*Math.PI/180) }));
    ctx.save(); ctx.beginPath();
    pts.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
    ctx.closePath();
    const grd = ctx.createRadialGradient(cx,cy,0,cx,cy,R);
    grd.addColorStop(0,'rgba(99,102,241,0.08)'); grd.addColorStop(1,'rgba(99,102,241,0.02)');
    ctx.fillStyle = grd; ctx.fill(); ctx.restore();
    for (let i = 0; i < 3; i++) {
      const a = pts[i], b = pts[(i+1)%3];
      const sel = capSelected && capSelected.includes(a.id) && capSelected.includes(b.id);
      arrowLine(ctx, a.x, a.y, b.x, b.y, sel ? a.color : '#2a3347', t*40, sel, sel?2.5:1.5);
    }
    pts.forEach(p => {
      const sel = capSelected && capSelected.includes(p.id);
      const pulse = sel ? 1 + Math.sin(t*3)*0.08 : 1, nr = 36 * pulse;
      ctx.save(); if (sel) { ctx.shadowColor = p.color; ctx.shadowBlur = 24; }
      ctx.beginPath(); ctx.arc(p.x, p.y, nr, 0, Math.PI*2);
      ctx.fillStyle = sel ? p.color+'33' : '#161b27'; ctx.strokeStyle = p.color; ctx.lineWidth = sel?2.5:1.5;
      ctx.fill(); ctx.stroke(); ctx.restore();
      txt(ctx, p.id, p.x, p.y-6, { size:15, weight:'800', color:p.color });
      txt(ctx, p.label, p.x, p.y+10, { size:9, color:p.color+'cc' });
    });
    const zones=[{label:'CA',x:cx,y:pts[0].y+(pts[1].y-pts[0].y)*0.28,c:'#3b82f6'},{label:'CP',x:cx+(pts[0].x-cx)*0.38,y:cy-8,c:'#818cf8'},{label:'AP',x:cx-(cx-pts[1].x)*0.38,y:cy-8,c:'#22c55e'}];
    zones.forEach(z => txt(ctx, z.label, z.x, z.y, { size:12, color:z.c+'77', weight:'700' }));
  });
}
function selectCAP(combo) {
  capSelected = combo.split('');
  const info = {
    CA:'🔵🟢 CA — Consistent + Available. Traditional RDBMS (MySQL, PostgreSQL) on a single node. Breaks under network partition.',
    CP:'🔵🟡 CP — Consistent + Partition Tolerant. HBase, Zookeeper, MongoDB (strong). Refuses writes during partition to stay consistent.',
    AP:'🟢🟡 AP — Available + Partition Tolerant. Cassandra, DynamoDB, CouchDB. Stays up during partition but may serve stale data.',
  };
  document.getElementById('capInfo').textContent = info[combo] || '';
  document.querySelectorAll('.anim-btn').forEach(b => b.classList.toggle('active', b.textContent.includes(combo)));
}

// ============================================================
//  LOAD BALANCER
// ============================================================
const LB_SERVERS = ['Server 1','Server 2','Server 3','Server 4'];
const LB_COLORS  = ['#22c55e','#3b82f6','#f59e0b','#ec4899'];
let lbPackets = [], lbT = 0;

function initLBCanvas() {
  lbLoads = [15,30,20,10]; lbPackets = []; lbRR = 0; lbT = 0;
  _raf('lbCanvas', drawLBFrame);
}

function drawLBFrame() {
  const c = getCanvas('lbCanvas'); if (!c) return;
  const { ctx, W, H } = c;
  lbT++; ctx.clearRect(0, 0, W, H);
  const clientX=72, clientY=H/2, lbX=W*0.42, lbY=H/2, srvX=W-80;
  const srvY=[H*0.13,H*0.38,H*0.63,H*0.88];
  ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=1;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.restore();
  srvY.forEach((sy,i)=>arrowLine(ctx,lbX+58,lbY,srvX-44,sy,LB_COLORS[i]+'22',0,false,1));
  arrowLine(ctx,clientX+40,clientY,lbX-58,lbY,'#33415566',0,false,1.5);
  gBox(ctx,clientX-40,clientY-20,80,40,8,'#0f1117','#3b82f6',2);
  txt(ctx,'👤',clientX,clientY-3,{size:16}); txt(ctx,'Client',clientX,clientY+14,{size:10,color:'#60a5fa',weight:'600'});
  const lbPulse=1+Math.sin(lbT*0.05)*0.015;
  ctx.save(); ctx.shadowColor='#6366f1'; ctx.shadowBlur=20;
  ctx.beginPath(); ctx.roundRect(lbX-60,lbY-28,120*lbPulse,56*lbPulse,10);
  ctx.fillStyle='rgba(99,102,241,0.12)'; ctx.fill(); ctx.strokeStyle='#6366f1'; ctx.lineWidth=2; ctx.stroke(); ctx.restore();
  txt(ctx,'⚖️',lbX,lbY-10,{size:16}); txt(ctx,'Load Balancer',lbX,lbY+7,{size:10,color:'#818cf8',weight:'700'}); txt(ctx,lbAlgo,lbX,lbY+20,{size:9,color:'#4f5d75'});
  srvY.forEach((sy,i)=>{
    const load=Math.min(lbLoads[i],100)/100, isHot=load>0.65, c2=LB_COLORS[i];
    gBox(ctx,srvX-44,sy-20,88,40,8,'#0f1117',c2+(isHot?'ff':'88'),isHot?2:1.5);
    txt(ctx,LB_SERVERS[i],srvX,sy-5,{size:10,color:c2,weight:'700'});
    const bx=srvX-34,by=sy+8,bw2=68;
    ctx.beginPath();ctx.roundRect(bx,by,bw2,5,2);ctx.fillStyle='#1e2535';ctx.fill();
    const lc=isHot?'#ef4444':load>0.4?'#f59e0b':'#22c55e';
    ctx.save();ctx.shadowColor=lc;ctx.shadowBlur=6;ctx.beginPath();ctx.roundRect(bx,by,Math.max(bw2*load,3),5,2);ctx.fillStyle=lc;ctx.fill();ctx.restore();
    txt(ctx,Math.round(load*100)+'%',srvX+36,sy+10,{size:9,color:lc,align:'left'});
  });
  lbPackets=lbPackets.filter(p=>p.t<1);
  lbPackets.forEach(p=>{
    p.t+=0.022;
    const sy=srvY[p.target]; let px,py;
    if(p.t<0.42){const tt=p.t/0.42;px=lerp(clientX+40,lbX-60,ease(tt));py=clientY;}
    else{const tt=(p.t-0.42)/0.58,et2=ease(tt),cpX=lbX+(srvX-lbX)*0.35,cpY=lerp(lbY,sy,0.5);px=(1-et2)*(1-et2)*(lbX+60)+2*(1-et2)*et2*cpX+et2*et2*(srvX-44);py=(1-et2)*(1-et2)*lbY+2*(1-et2)*et2*cpY+et2*et2*sy;}
    if(!p.trail)p.trail=[];p.trail.push({x:px,y:py});if(p.trail.length>12)p.trail.shift();
    gDot(ctx,px,py,6,LB_COLORS[p.target],1,p.trail);
  });
}
function setLBAlgo(algo) {
  lbAlgo=algo; lbRR=0;
  document.querySelectorAll('.anim-btn').forEach(b=>b.classList.toggle('active',b.textContent.toLowerCase().replace(/\s/g,'').includes(algo.replace('-',''))));
}
function sendLBRequest() {
  let target;
  if(lbAlgo==='round-robin'){target=lbRR%4;lbRR++;}
  else if(lbAlgo==='least-conn'){target=lbLoads.indexOf(Math.min(...lbLoads));}
  else{target=Math.floor(Math.random()*4);}
  lbPackets.push({t:0,target,trail:[]});
  lbLoads[target]=Math.min(lbLoads[target]+8,99);
  setTimeout(()=>{lbLoads[target]=Math.max(lbLoads[target]-8,5);},2200);
  const el=document.getElementById('lbStatus');
  if(el){el.style.color=LB_COLORS[target];el.textContent=`→ Routed to ${LB_SERVERS[target]}  [${lbAlgo}]`;}
}

// ============================================================
//  CONSISTENT HASHING — Step 5 interactive ring (add/remove nodes)
//  Steps 1-4 and 6 live entirely in ch_animations.js
// ============================================================
const CH_COLORS = ['#6366f1','#22c55e','#f59e0b','#ec4899','#06b6d4','#ef4444'];
let chAnimT = 0, chHighlightKey = null;

function initCHCanvas() {
  chNodes = [
    { id:0, angle:30,  label:'Node A' },
    { id:1, angle:140, label:'Node B' },
    { id:2, angle:250, label:'Node C' },
  ];
  chKeys = [
    { angle:70,  label:'K1' },
    { angle:100, label:'K2' },
    { angle:180, label:'K3' },
    { angle:220, label:'K4' },
    { angle:310, label:'K5' },
  ];
  chHighlightKey = null;
  _raf('chCanvas', drawCHFrame);
}

function drawCHFrame() {
  const c = getCanvas('chCanvas'); if (!c) return;
  const { ctx, W, H } = c;
  chAnimT += 0.012;
  ctx.clearRect(0, 0, W, H);
  const cx = W/2, cy = H/2, R = Math.min(W,H)*0.34;

  // arc ownership zones
  const sorted = [...chNodes].sort((a,b) => a.angle - b.angle);
  sorted.forEach((node, i) => {
    const next = sorted[(i+1) % sorted.length];
    const span = ((next.angle - node.angle + 360) % 360) * Math.PI/180;
    const col = CH_COLORS[node.id % CH_COLORS.length];
    ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R-1, (node.angle-90)*Math.PI/180, (node.angle-90)*Math.PI/180 + span);
    ctx.closePath(); ctx.fillStyle = col + '18'; ctx.fill(); ctx.restore();
  });

  // ring
  ctx.save(); ctx.shadowColor='#6366f1'; ctx.shadowBlur=10;
  ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
  ctx.strokeStyle='#2a3347'; ctx.lineWidth=3; ctx.stroke(); ctx.restore();

  // ticks
  for(let a=0;a<360;a+=15){
    const rad=(a-90)*Math.PI/180, len=a%90===0?10:a%45===0?6:3;
    ctx.beginPath(); ctx.moveTo(cx+(R-len)*Math.cos(rad),cy+(R-len)*Math.sin(rad));
    ctx.lineTo(cx+R*Math.cos(rad),cy+R*Math.sin(rad));
    ctx.strokeStyle=a%90===0?'#334155':'#1e2535'; ctx.lineWidth=1; ctx.stroke();
    if(a%90===0) txt(ctx,a+'°',cx+(R+16)*Math.cos(rad),cy+(R+16)*Math.sin(rad),{size:9,color:'#334155'});
  }

  // keys
  chKeys.forEach(k=>{
    const rad=(k.angle-90)*Math.PI/180, kx=cx+R*Math.cos(rad), ky=cy+R*Math.sin(rad);
    const isHL=chHighlightKey&&chHighlightKey.label===k.label, r2=isHL?9+Math.sin(chAnimT*6)*2:7;
    ctx.save(); if(isHL){ctx.shadowColor='#f59e0b';ctx.shadowBlur=20;}
    ctx.beginPath(); ctx.arc(kx,ky,r2,0,Math.PI*2);
    ctx.fillStyle=isHL?'#f59e0b':'#f59e0b44'; ctx.strokeStyle='#f59e0b'; ctx.lineWidth=isHL?2:1.5;
    ctx.fill(); ctx.stroke(); ctx.restore();
    txt(ctx,k.label,cx+(R+22)*Math.cos(rad),cy+(R+22)*Math.sin(rad),{size:10,color:'#f59e0b',weight:'700'});
    const resp=getCHNode(k.angle);
    if(resp){
      let a1=k.angle, a2=resp.angle; if(a2<a1)a2+=360;
      ctx.save(); ctx.strokeStyle=isHL?'#f59e0b88':'#f59e0b22'; ctx.lineWidth=isHL?1.5:1;
      ctx.setLineDash([4,4]); ctx.beginPath(); ctx.arc(cx,cy,R,(a1-90)*Math.PI/180,(a2-90)*Math.PI/180); ctx.stroke(); ctx.restore();
    }
  });

  // nodes
  chNodes.forEach((n,i)=>{
    const rad=(n.angle-90)*Math.PI/180, nx=cx+R*Math.cos(rad), ny=cy+R*Math.sin(rad);
    const col=CH_COLORS[i%CH_COLORS.length], pulse=1+Math.sin(chAnimT*2+i*2.1)*0.06, nr=18*pulse;
    ctx.save(); ctx.shadowColor=col; ctx.shadowBlur=18;
    ctx.beginPath(); ctx.arc(nx,ny,nr,0,Math.PI*2);
    ctx.fillStyle=col+'44'; ctx.strokeStyle=col; ctx.lineWidth=2.5; ctx.fill(); ctx.stroke(); ctx.restore();
    txt(ctx,n.label.replace('Node ',''),nx,ny-1,{size:10,weight:'800',color:col});
    txt(ctx,n.label,cx+(R+38)*Math.cos(rad),cy+(R+38)*Math.sin(rad),{size:9,color:col+'cc'});
  });

  txt(ctx,'Hash Ring',cx,cy-2,{size:13,weight:'700',color:'#475569'});
  txt(ctx,`${chNodes.length} nodes · ${chKeys.length} keys`,cx,cy+16,{size:10,color:'#334155'});
}

function getCHNode(angle) {
  if(!chNodes.length) return null;
  const sorted=[...chNodes].sort((a,b)=>a.angle-b.angle);
  return sorted.find(n=>n.angle>=angle)||sorted[0];
}
function addCHNode() {
  if(chNodes.length>=6) return;
  const angle=Math.floor(Math.random()*360), id=chNodes.length;
  chNodes.push({id,angle,label:`Node ${'ABCDEF'[id]}`});
  const el=document.getElementById('chInfo');
  if(el){el.style.color='var(--green)';el.textContent=`✅ Added Node ${'ABCDEF'[id]} at ${angle}° — only adjacent keys reassigned`;}
}
function removeCHNode() {
  if(chNodes.length<=1) return;
  const removed=chNodes.pop();
  const el=document.getElementById('chInfo');
  if(el){el.style.color='var(--yellow)';el.textContent=`⚠️ Removed ${removed.label} — its keys migrated to next node clockwise`;}
}
function addCHKey() {
  if(chKeys.length>=14) return;
  const angle=Math.floor(Math.random()*360);
  chKeys.push({angle,label:`K${chKeys.length+1}`});
  const node=getCHNode(angle);
  chHighlightKey=chKeys[chKeys.length-1];
  setTimeout(()=>{chHighlightKey=null;},2000);
  const el=document.getElementById('chInfo');
  if(el){el.style.color='var(--cyan)';el.textContent=`🔑 Key at ${angle}° → assigned to ${node?.label}`;}
}
function resetCH() {
  initCHCanvas();
  const el=document.getElementById('chInfo'); if(el) el.textContent='';
}

// ============================================================
//  CACHE CANVAS
// ============================================================
let cacheState = 'idle', cacheT = 0, cachePacket = null;

function initCacheCanvas() {
  cacheHits=0; cacheMisses=0; cacheState='idle'; cachePacket=null;
  updateCacheStats();
  _raf('cacheCanvas', drawCacheFrame);
}

function drawCacheFrame() {
  const c=getCanvas('cacheCanvas'); if(!c) return;
  const {ctx,W,H}=c;
  cacheT++; ctx.clearRect(0,0,W,H);
  const clX=70, lbY=H/2, caX=W/2, dbX=W-70;
  const cCol=cacheState==='hit'?'#22c55e':cacheState==='miss'?'#ef4444':'#6366f1';
  gBox(ctx,clX-42,lbY-22,84,44,8,'#0f1117','#3b82f6',2);
  txt(ctx,'🖥️',clX,lbY-3,{size:18}); txt(ctx,'Client',clX,lbY+16,{size:10,color:'#60a5fa',weight:'600'});
  ctx.save(); ctx.shadowColor=cCol; ctx.shadowBlur=10+(cacheState!=='idle'?16:0);
  ctx.beginPath(); ctx.roundRect(caX-52,lbY-32,104,64,10);
  ctx.fillStyle=cCol+'22'; ctx.fill(); ctx.strokeStyle=cCol; ctx.lineWidth=2; ctx.stroke(); ctx.restore();
  txt(ctx,'💾',caX,lbY-12,{size:22}); txt(ctx,'Cache (Redis)',caX,lbY+8,{size:10,color:cCol,weight:'700'});
  if(cacheState==='hit')  txt(ctx,'✓ HIT', caX,lbY+22,{size:11,color:'#22c55e',weight:'800'});
  if(cacheState==='miss') txt(ctx,'✗ MISS',caX,lbY+22,{size:11,color:'#ef4444',weight:'800'});
  const dbCol=cacheState==='miss'?'#f59e0b':'#334155';
  gBox(ctx,dbX-42,lbY-22,84,44,8,'#0f1117',dbCol,1.5);
  txt(ctx,'🗄️',dbX,lbY-4,{size:18}); txt(ctx,'Database',dbX,lbY+14,{size:10,color:dbCol,weight:'600'});
  arrowLine(ctx,clX+42,lbY-4,caX-52,lbY-4,'#3b82f655',0,false,1.5);
  if(cacheState==='hit'){arrowLine(ctx,caX-52,lbY+4,clX+42,lbY+4,'#22c55e',0,false,2);txt(ctx,'Serve from cache ⚡',W*0.32,lbY+20,{size:10,color:'#22c55e'});}
  if(cacheState==='miss'){arrowLine(ctx,caX+52,lbY-4,dbX-42,lbY-4,'#f59e0b',0,false,2);arrowLine(ctx,dbX-42,lbY+4,caX+52,lbY+4,'#22c55e',cacheT*2,true,2);txt(ctx,'Fetch from DB → store in cache',W/2,lbY+22,{size:10,color:'#f59e0b'});}
  if(cachePacket){
    cachePacket.t+=0.04;
    if(!cachePacket.trail)cachePacket.trail=[];
    cachePacket.trail.push({x:cachePacket.x,y:cachePacket.y});
    if(cachePacket.trail.length>10)cachePacket.trail.shift();
    gDot(ctx,cachePacket.x,cachePacket.y,7,cachePacket.color,1,cachePacket.trail);
    if(cachePacket.t>1)cachePacket=null;
  }
}
function simulateCache(type) {
  const c=getCanvas('cacheCanvas');
  if(type==='hit'){cacheHits++;cacheState='hit';cachePacket={x:112,y:c?c.H/2:100,color:'#22c55e',t:0,trail:[]};}
  else{cacheMisses++;cacheState='miss';cachePacket={x:112,y:c?c.H/2:100,color:'#ef4444',t:0,trail:[]};}
  updateCacheStats();
  setTimeout(()=>{cacheState='idle';cachePacket=null;},2500);
}
function resetCache(){cacheHits=0;cacheMisses=0;cacheState='idle';updateCacheStats();}
function updateCacheStats(){
  const total=cacheHits+cacheMisses;
  const h=document.getElementById('cacheHits'),m=document.getElementById('cacheMisses'),r=document.getElementById('cacheRate');
  if(h)h.textContent=cacheHits; if(m)m.textContent=cacheMisses;
  if(r)r.textContent=total?Math.round(cacheHits/total*100)+'%':'0%';
}

// ============================================================
//  CDN CANVAS
// ============================================================
let cdnT=0, cdnActive=-1;
const CDN_EDGES=[
  {x:0.12,y:0.52,label:'🌎 US West', color:'#3b82f6'},
  {x:0.32,y:0.72,label:'🌎 US East', color:'#22c55e'},
  {x:0.55,y:0.50,label:'🌍 Europe',  color:'#f59e0b'},
  {x:0.80,y:0.62,label:'🌏 Asia',    color:'#ec4899'},
  {x:0.22,y:0.38,label:'🌎 Canada',  color:'#06b6d4'},
  {x:0.70,y:0.82,label:'🌏 SEAsia',  color:'#6366f1'},
];
let cdnPackets=[], cdnEdgeIdx=0;

function initCDNCanvas(){
  cdnT=0; cdnPackets=[];
  _raf('cdnCanvas', drawCDNFrame);
}
function drawCDNFrame(){
  const c=getCanvas('cdnCanvas'); if(!c)return;
  const {ctx,W,H}=c; cdnT++;
  ctx.clearRect(0,0,W,H);
  ctx.save(); ctx.strokeStyle='#1a2236'; ctx.lineWidth=.5;
  for(let i=0;i<=6;i++){const y=H*0.2+i*(H*0.65/6);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  for(let i=0;i<=8;i++){const x=i*W/8;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  ctx.restore();
  const ox=W/2, oy=28;
  ctx.save(); ctx.shadowColor='#6366f1'; ctx.shadowBlur=20;
  ctx.beginPath(); ctx.roundRect(ox-56,oy-14,112,28,7);
  ctx.fillStyle='rgba(99,102,241,0.15)'; ctx.fill(); ctx.strokeStyle='#6366f1'; ctx.lineWidth=2; ctx.stroke(); ctx.restore();
  txt(ctx,'🏢 Origin Server',ox,oy,{size:11,color:'#818cf8',weight:'700'});
  CDN_EDGES.forEach((e,i)=>{
    const ex=e.x*W, ey=e.y*H, isA=cdnActive===i, pulse=isA?1+Math.sin(cdnT*.15)*0.07:1;
    ctx.save(); ctx.strokeStyle=e.color+'22'; ctx.lineWidth=1; ctx.setLineDash([4,6]);
    ctx.beginPath(); ctx.moveTo(ox,oy+14); ctx.lineTo(ex,ey-14); ctx.stroke(); ctx.restore();
    const bw2=92*pulse, bh=28*pulse;
    ctx.save(); if(isA){ctx.shadowColor=e.color;ctx.shadowBlur=20;}
    ctx.beginPath(); ctx.roundRect(ex-bw2/2,ey-bh/2,bw2,bh,7);
    ctx.fillStyle=isA?e.color+'33':'#0f1117'; ctx.fill(); ctx.strokeStyle=e.color+(isA?'':'66'); ctx.lineWidth=isA?2:1; ctx.stroke(); ctx.restore();
    txt(ctx,e.label,ex,ey,{size:10,color:e.color+(isA?'':'aa'),weight:isA?'700':'500'});
  });
  [{x:.08,y:.93},{x:.42,y:.96},{x:.75,y:.93}].forEach(u=>txt(ctx,'👤',u.x*W,u.y*H,{size:14}));
  cdnPackets=cdnPackets.filter(p=>p.t<1);
  cdnPackets.forEach(p=>{
    p.t+=0.025; if(!p.trail)p.trail=[];
    const et=ease(p.t), px=lerp(p.x1,p.x2,et), py=lerp(p.y1,p.y2,et)-Math.sin(p.t*Math.PI)*30;
    p.trail.push({x:px,y:py}); if(p.trail.length>8)p.trail.shift();
    gDot(ctx,px,py,5,p.color,1,p.trail);
  });
}
function simulateCDN(){
  const i=cdnEdgeIdx%CDN_EDGES.length; cdnEdgeIdx++; cdnActive=i;
  const e=CDN_EDGES[i], c=getCanvas('cdnCanvas');
  if(c) cdnPackets.push({x1:c.W/2,y1:28,x2:e.x*c.W,y2:e.y*c.H,t:0,color:e.color,trail:[]});
  setTimeout(()=>{cdnActive=-1;},1800);
}

// ============================================================
//  WEBSOCKET CANVAS — HTTP polling vs Long Polling vs WebSocket
// ============================================================
let wsMode = 'http', wsT = 0;
let wsPackets = [];

function initWSCanvas() {
  wsMode = 'http'; wsT = 0; wsPackets = [];
  const el = document.getElementById('wsInfo');
  if(el){ el.style.color='var(--yellow)'; el.textContent='HTTP Polling: client asks every 2 seconds. Server responds each time — even if nothing changed. Wastes bandwidth and server resources.'; }
  document.querySelectorAll('.anim-btn').forEach((b,i)=>b.classList.toggle('active',i===0));
  _raf('wsCanvas', drawWSFrame);
}

function setWSMode(mode) {
  wsMode = mode; wsT = 0; wsPackets = [];
  const el = document.getElementById('wsInfo');
  const msgs = {
    http:     'HTTP Polling: client asks every 2 seconds. Even if nothing changed, full HTTP headers (~800B) are sent both ways.',
    longpoll: 'Long Polling: client sends a request, server holds it open until data is available (up to 30s), then responds. Client immediately re-opens.',
    ws:       'WebSocket: one TCP handshake, then both sides push data freely. 2-byte frame overhead. Server pushes events the instant they happen.',
  };
  const cols = { http:'var(--yellow)', longpoll:'var(--cyan)', ws:'var(--green)' };
  if(el){ el.style.color=cols[mode]; el.textContent=msgs[mode]; }
  document.querySelectorAll('.anim-btn').forEach(b=>{
    b.classList.toggle('active', b.textContent.toLowerCase().replace(/\s/g,'').includes(mode==='http'?'http':mode==='longpoll'?'long':'web'));
  });
}

function drawWSFrame() {
  const c = getCanvas('wsCanvas'); if(!c) return;
  const {ctx, W, H} = c;
  wsT++; ctx.clearRect(0,0,W,H);

  const clX = W*0.12, srvX = W*0.88, midY = H/2;
  const clColor = '#3b82f6', srvColor = '#6366f1';

  // client box
  gBox(ctx, clX-44, midY-52, 88, 104, 10, '#0f1117', clColor, 2);
  txt(ctx,'🖥️', clX, midY-24, {size:26});
  txt(ctx,'Client', clX, midY+8, {size:11,color:clColor,weight:'700'});
  txt(ctx,'Browser', clX, midY+24, {size:9,color:clColor+'88'});

  // server box
  gBox(ctx, srvX-44, midY-52, 88, 104, 10, '#0f1117', srvColor, 2);
  txt(ctx,'⚙️', srvX, midY-24, {size:26});
  txt(ctx,'Server', srvX, midY+8, {size:11,color:srvColor,weight:'700'});
  txt(ctx,'Node.js', srvX, midY+24, {size:9,color:srvColor+'88'});

  if(wsMode === 'http') {
    // show multiple request-response cycles at different vertical positions
    const cycles = 4;
    for(let i=0;i<cycles;i++){
      const yt = midY - 36 + i*24;
      const phase = (wsT*0.012 + i*0.28) % 1;
      const going = phase < 0.5;
      const prog = going ? phase/0.5 : (phase-0.5)/0.5;
      const px = going ? lerp(clX+44, srvX-44, ease(prog)) : lerp(srvX-44, clX+44, ease(prog));
      const pCol = going ? '#f59e0b' : '#22c55e';
      // faint track line
      ctx.save(); ctx.strokeStyle='#1e2535'; ctx.lineWidth=1; ctx.setLineDash([3,6]);
      ctx.beginPath(); ctx.moveTo(clX+44, yt); ctx.lineTo(srvX-44, yt); ctx.stroke(); ctx.restore();
      gDot(ctx, px, yt, 5, pCol, 0.85);
      // label on first cycle
      if(i===0){
        txt(ctx, going?'GET /updates':'200 OK (empty)', W/2, yt-10, {size:9, color:pCol+'cc'});
      }
    }
    // cost indicator
    txt(ctx, '~800B headers × every poll', W/2, H-16, {size:10, color:'#ef4444aa'});
  }

  else if(wsMode === 'longpoll') {
    const phase = (wsT*0.008) % 1;
    const holdEnd = 0.65;
    const yt1 = midY - 20, yt2 = midY + 20;
    // request going right
    const reqProg = Math.min(phase/0.12, 1);
    ctx.save(); ctx.strokeStyle='#f59e0b44'; ctx.lineWidth=1.5; ctx.setLineDash([4,6]);
    ctx.beginPath(); ctx.moveTo(clX+44, yt1); ctx.lineTo(srvX-44, yt1); ctx.stroke(); ctx.restore();
    if(phase < 0.12) {
      gDot(ctx, lerp(clX+44,srvX-44,ease(reqProg)), yt1, 5, '#f59e0b', 0.9);
    }
    // "waiting" indicator at server
    if(phase >= 0.12 && phase < holdEnd) {
      const waitW = 60*((phase-0.12)/(holdEnd-0.12));
      ctx.save(); ctx.shadowColor='#f59e0b'; ctx.shadowBlur=6;
      ctx.beginPath(); ctx.roundRect(srvX-44, midY-8, waitW, 16, 4);
      ctx.fillStyle='#f59e0b22'; ctx.fill(); ctx.strokeStyle='#f59e0b'; ctx.lineWidth=1; ctx.stroke(); ctx.restore();
      txt(ctx,'⏳ holding…', srvX, midY, {size:9,color:'#f59e0b'});
      txt(ctx,'Server waits for new data', W/2, yt1-14, {size:9, color:'#f59e0bcc'});
    }
    // response going left
    if(phase >= holdEnd) {
      const resProg = (phase-holdEnd)/(1-holdEnd);
      gDot(ctx, lerp(srvX-44,clX+44,ease(resProg)), yt2, 6, '#22c55e', 0.9);
      ctx.save(); ctx.strokeStyle='#22c55e44'; ctx.lineWidth=1.5; ctx.setLineDash([4,6]);
      ctx.beginPath(); ctx.moveTo(srvX-44,yt2); ctx.lineTo(clX+44,yt2); ctx.stroke(); ctx.restore();
      txt(ctx,'📦 Data ready! Respond', W/2, yt2+14, {size:9, color:'#22c55e'});
    }
    txt(ctx, 'Reconnect overhead + server threads held open', W/2, H-16, {size:10, color:'#f59e0baa'});
  }

  else { // websocket
    // draw the persistent connection line
    ctx.save(); ctx.shadowColor='#22c55e'; ctx.shadowBlur=8;
    ctx.beginPath(); ctx.moveTo(clX+44, midY); ctx.lineTo(srvX-44, midY);
    ctx.strokeStyle='#22c55e44'; ctx.lineWidth=3; ctx.stroke(); ctx.restore();
    txt(ctx,'── Persistent TCP Connection ──', W/2, midY-18, {size:9,color:'#22c55e88'});

    // bidirectional message bursts
    const period = 60;
    const phase = wsT % period;
    // client → server messages
    if(phase < 20) {
      const prog = phase/20;
      const mx = lerp(clX+44, srvX-44, ease(prog));
      gDot(ctx, mx, midY-8, 5, '#6366f1', 0.9);
      txt(ctx,'{"type":"message","d":"Hello!"}', W/2, midY-34, {size:9,color:'#6366f1cc'});
    }
    // server → client push (no request needed)
    if(phase > 25 && phase < 45) {
      const prog = (phase-25)/20;
      const mx = lerp(srvX-44, clX+44, ease(prog));
      gDot(ctx, mx, midY+8, 5, '#22c55e', 0.9);
      txt(ctx,'{"type":"notification","d":"Bob liked your post"}', W/2, midY+28, {size:9,color:'#22c55ecc'});
    }
    // another server push
    if(phase > 48 && phase < 60) {
      const prog = (phase-48)/12;
      const mx = lerp(srvX-44, clX+44, ease(prog));
      gDot(ctx, mx, midY+8, 5, '#06b6d4', 0.9);
    }
    // overhead label
    ctx.save(); ctx.shadowColor='#22c55e'; ctx.shadowBlur=6;
    gBox(ctx, W/2-70, H-32, 140, 20, 6, 'rgba(34,197,94,0.08)', '#22c55e', 1.5);
    txt(ctx,'~2 bytes per frame ⚡ zero poll overhead', W/2, H-22, {size:9,color:'#22c55e',weight:'600'});
    ctx.restore();
  }

  // connection type label top-left
  const modeLabels = {http:'HTTP Polling 🔁', longpoll:'Long Polling ⏳', ws:'WebSocket ⚡'};
  const modeCols   = {http:'#f59e0b', longpoll:'#06b6d4', ws:'#22c55e'};
  txt(ctx, modeLabels[wsMode], W/2, 16, {size:11, color:modeCols[wsMode], weight:'700'});
}
