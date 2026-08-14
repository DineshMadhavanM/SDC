// ============================================================
//  DB_ANIMATIONS.JS
//  Animations for: Database, Sharding, Replication topics
// ============================================================

// ============================================================
//  DATABASE — API → Table Write Animation
// ============================================================
const DB_CUSTOMERS = [
  { id:1, name:'Betty',  age:22, country:'UAE' },
  { id:2, name:'David',  age:22, country:'UK'  },
  { id:3, name:'Maria',  age:25, country:'UK'  },
  { id:4, name:'Robert', age:28, country:'USA' },
  { id:5, name:'John',   age:31, country:'USA' },
];
let dbRows = [], dbT = 0, dbPacket = null, dbMode = 'idle', dbQueryResult = null;

const DB_COLS = ['id','name','age','country'];
const DB_COL_W = [36, 70, 36, 62];

function initDBWriteCanvas() {
  dbRows = []; dbT = 0; dbPacket = null; dbMode = 'idle'; dbQueryResult = null;
  _raf('dbWriteCanvas', drawDBWriteFrame);
  const el = document.getElementById('dbWriteInfo');
  if(el) el.textContent = 'Click INSERT to add a customer row, SELECT to query, or GROUP BY to see aggregation.';
}

function dbSendRequest(type) {
  dbMode = type;
  dbPacket = { t: 0, trail: [] };
  dbQueryResult = null;
  const msgs = {
    insert: '🟣 POST /customers → INSERT INTO customers (name,age,country) VALUES (…) → Row added to table',
    select: '🔵 GET /customers?country=UK → SELECT * FROM customers WHERE country=\'UK\' → Returns matching rows',
    group:  '🟡 GET /analytics → SELECT country, COUNT(*) FROM customers GROUP BY country → Groups formed',
  };
  const el = document.getElementById('dbWriteInfo');
  if(el){ el.style.color='var(--cyan)'; el.textContent = msgs[type]; }
}

function dbResetAnim() {
  dbRows=[]; dbPacket=null; dbMode='idle'; dbQueryResult=null;
  const el=document.getElementById('dbWriteInfo');
  if(el){ el.style.color='var(--text2)'; el.textContent='Table cleared. Click INSERT to add rows.'; }
}

function drawDBWriteFrame() {
  const c = getCanvas('dbWriteCanvas'); if(!c) return;
  const { ctx, W, H } = c;
  dbT++; ctx.clearRect(0,0,W,H);

  const apiX = 56, dbX = W*0.52, tableX = dbX + 14;
  const midY = H/2;

  // ── API box ──
  gBox(ctx, apiX-44, midY-22, 88, 44, 8, '#0f1117', '#6366f1', 2);
  txt(ctx,'🌐', apiX, midY-6, {size:18});
  txt(ctx,'API', apiX, midY+12, {size:10, color:'#818cf8', weight:'700'});

  // ── DB cylinder ──
  const dbCol = dbMode==='insert'?'#22c55e': dbMode==='select'?'#3b82f6': dbMode==='group'?'#f59e0b':'#6366f1';
  ctx.save(); ctx.shadowColor=dbCol; ctx.shadowBlur=12;
  ctx.beginPath(); ctx.ellipse(dbX+50,midY-28, 44,12, 0,0,Math.PI*2); ctx.fillStyle=dbCol+'33'; ctx.fill(); ctx.strokeStyle=dbCol; ctx.lineWidth=2; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dbX+6,midY-28); ctx.lineTo(dbX+6,midY+20); ctx.moveTo(dbX+94,midY-28); ctx.lineTo(dbX+94,midY+20); ctx.strokeStyle=dbCol; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(dbX+50,midY+20, 44,12, 0,0,Math.PI*2); ctx.fillStyle=dbCol+'22'; ctx.fill(); ctx.stroke();
  ctx.restore();
  txt(ctx,'🗄️ Database', dbX+50, midY-4, {size:11, color:dbCol, weight:'700'});
  txt(ctx,'customers', dbX+50, midY+12, {size:9, color:dbCol+'99'});

  // ── arrow from API to DB ──
  arrowLine(ctx, apiX+44, midY, dbX+6, midY, '#33415566', 0, false, 1.5);

  // ── moving packet ──
  if(dbPacket) {
    dbPacket.t += 0.028;
    if(!dbPacket.trail) dbPacket.trail=[];
    const et = ease(Math.min(dbPacket.t,1));
    const px = lerp(apiX+44, dbX+6, et);
    dbPacket.trail.push({x:px,y:midY}); if(dbPacket.trail.length>12) dbPacket.trail.shift();
    gDot(ctx, px, midY, 7, dbCol, 1, dbPacket.trail);

    if(dbPacket.t >= 1) {
      dbPacket = null;
      // add row if insert
      if(dbMode==='insert' && dbRows.length < DB_CUSTOMERS.length) {
        dbRows.push({...DB_CUSTOMERS[dbRows.length], alpha:0});
      }
      if(dbMode==='select') {
        dbQueryResult = { type:'select', rows: DB_CUSTOMERS.filter(r=>r.country==='UK') };
      }
      if(dbMode==='group') {
        dbQueryResult = { type:'group', groups:[{country:'UAE',count:1},{country:'UK',count:2},{country:'USA',count:2}] };
      }
    }
  }

  // ── table panel ──
  const tx = W*0.62, ty = 14, tw = W - tx - 8, rowH = 22;
  txt(ctx,'customers table', tx+tw/2, ty+8, {size:9, color:'#475569', weight:'700'});
  // header
  let cx2 = tx;
  DB_COLS.forEach((col,i)=>{
    ctx.beginPath(); ctx.roundRect(cx2, ty+14, DB_COL_W[i], rowH, 2);
    ctx.fillStyle='#1e2535'; ctx.fill(); ctx.strokeStyle='#2a3347'; ctx.lineWidth=1; ctx.stroke();
    txt(ctx, col, cx2+DB_COL_W[i]/2, ty+25, {size:8, color:'#64748b', weight:'700'});
    cx2+=DB_COL_W[i];
  });
  // data rows
  dbRows.forEach((row,ri)=>{
    if(row.alpha<1) row.alpha=Math.min(row.alpha+0.06,1);
    let cx3=tx;
    const rowY=ty+14+(ri+1)*rowH;
    const isHL=(dbMode==='select'&&row.country==='UK')||(dbMode==='group');
    const rowBg=isHL?'#1e2535':'#161b27';
    DB_COLS.forEach((col,i)=>{
      ctx.save(); ctx.globalAlpha=row.alpha;
      ctx.beginPath(); ctx.roundRect(cx3, rowY, DB_COL_W[i], rowH, 2);
      ctx.fillStyle=isHL?'#6366f122':rowBg; ctx.fill();
      ctx.strokeStyle='#2a3347'; ctx.lineWidth=.5; ctx.stroke();
      txt(ctx, String(row[col]), cx3+DB_COL_W[i]/2, rowY+rowH/2, {size:8, color:isHL?'#818cf8':'#94a3b8'});
      ctx.restore();
      cx3+=DB_COL_W[i];
    });
  });

  // ── query result overlay ──
  if(dbQueryResult) {
    const qx=tx, qy=ty+14+(dbRows.length+1)*rowH+8;
    if(dbQueryResult.type==='select') {
      txt(ctx,'↳ Result: WHERE country=\'UK\'',tx+70,qy+8,{size:9,color:'#3b82f6',weight:'700'});
      dbQueryResult.rows.forEach((r,i)=>{
        txt(ctx,`${r.id} · ${r.name} · ${r.age} · ${r.country}`, tx+70, qy+22+i*16, {size:8,color:'#60a5fa'});
      });
    }
    if(dbQueryResult.type==='group') {
      txt(ctx,'GROUP BY country → 3 groups',tx+70,qy+8,{size:9,color:'#f59e0b',weight:'700'});
      dbQueryResult.groups.forEach((g,i)=>{
        const barW=g.count/2*60;
        ctx.save(); ctx.shadowColor='#f59e0b'; ctx.shadowBlur=4;
        ctx.beginPath(); ctx.roundRect(tx+70,qy+18+i*18,barW,12,3); ctx.fillStyle='#f59e0b44'; ctx.fill(); ctx.strokeStyle='#f59e0b'; ctx.lineWidth=1; ctx.stroke(); ctx.restore();
        txt(ctx,`${g.country}: ${g.count}`,tx+150,qy+24+i*18,{size:8,color:'#f59e0b',weight:'700',align:'left'});
      });
    }
  }
}

// ============================================================
//  DATABASE — SQL vs NoSQL bar comparison
// ============================================================
function initDBCanvas() {
  let t = 0;
  _raf('dbCanvas', () => {
    const c = getCanvas('dbCanvas'); if(!c) return;
    const { ctx, W, H } = c;
    t += 0.012; ctx.clearRect(0,0,W,H);

    const dbs = [
      { label:'PostgreSQL', type:'SQL',   color:'#3b82f6', traits:[0.9,0.85,0.6,0.95] },
      { label:'MySQL',      type:'SQL',   color:'#06b6d4', traits:[0.85,0.8,0.55,0.9] },
      { label:'MongoDB',    type:'NoSQL', color:'#22c55e', traits:[0.7,0.5,0.9,0.6]  },
      { label:'Cassandra',  type:'NoSQL', color:'#f59e0b', traits:[0.5,0.4,0.95,0.5] },
      { label:'Redis',      type:'NoSQL', color:'#ec4899', traits:[0.3,0.2,0.95,0.4] },
    ];
    const traits=['ACID','Consistency','Scale','Speed'];
    const traitColors=['#6366f1','#3b82f6','#22c55e','#f59e0b'];
    const bw=18, groupGap=28, traitGap=4;
    const groupW=dbs.length*(bw+traitGap)-traitGap;
    const totalW=traits.length*(groupW+groupGap)-groupGap;
    const sx=(W-totalW)/2;

    traits.forEach((trait,ti)=>{
      const gx=sx+ti*(groupW+groupGap);
      dbs.forEach((db,di)=>{
        const bx=gx+di*(bw+traitGap);
        const target=db.traits[ti]*(H-52);
        const bh=target*(0.8+Math.sin(t+di*0.7+ti*1.2)*0.08);
        const by=H-36-bh;
        const gr=ctx.createLinearGradient(0,by,0,H-36);
        gr.addColorStop(0,db.color+'cc'); gr.addColorStop(1,db.color+'33');
        ctx.save(); ctx.shadowColor=db.color; ctx.shadowBlur=6;
        ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,[3,3,0,0]);
        ctx.fillStyle=gr; ctx.fill(); ctx.strokeStyle=db.color; ctx.lineWidth=1; ctx.stroke();
        ctx.restore();
      });
      txt(ctx,trait,gx+groupW/2,H-18,{size:9,color:traitColors[ti],weight:'700'});
      // group label
      ctx.save(); ctx.strokeStyle='#2a3347'; ctx.lineWidth=1; ctx.setLineDash([3,4]);
      ctx.beginPath(); ctx.moveTo(gx-6,H-36); ctx.lineTo(gx+groupW+4,H-36); ctx.stroke(); ctx.restore();
    });

    // legend
    dbs.forEach((db,i)=>{
      const lx=14+i*80;
      ctx.beginPath(); ctx.arc(lx,10,5,0,Math.PI*2); ctx.fillStyle=db.color; ctx.fill();
      txt(ctx,db.label,lx+8,10,{size:8,color:db.color,align:'left'});
    });
    txt(ctx,'SQL  ←  →  NoSQL',W-56,10,{size:8,color:'#475569'});
  });
}

// ============================================================
//  SHARDING — Replication vs Sharding side-by-side
// ============================================================
let shardVsReplMode = 'shard', shardVsT = 0;
const RECORDS_ABCDEF = ['A','B','C','D','E','F'];

function setShardVsRepl(mode) {
  shardVsReplMode = mode;
  const el = document.getElementById('shardVsReplInfo');
  if(mode==='shard') {
    if(el){ el.style.color='var(--cyan)'; el.innerHTML='<strong>Sharding = SPLIT</strong>: DB1 gets A,B — DB2 gets C,D — DB3 gets E,F. Each DB owns different data. Total data = same as original.'; }
  } else {
    if(el){ el.style.color='var(--green)'; el.innerHTML='<strong>Replication = COPY</strong>: DB1, DB2, DB3 all have A,B,C,D,E,F. Same data everywhere. Total data = 3× original.'; }
  }
  document.querySelectorAll('.anim-btn').forEach(b=>{
    b.classList.toggle('active', b.textContent.toLowerCase().includes(mode==='shard'?'shard':'repl'));
  });
}

function initShardVsReplCanvas(mode) {
  shardVsReplMode = mode || 'shard'; shardVsT = 0;
  setShardVsRepl(shardVsReplMode);
  _raf('shardVsReplCanvas', drawShardVsReplFrame);
}

function drawShardVsReplFrame() {
  const c = getCanvas('shardVsReplCanvas'); if(!c) return;
  const { ctx, W, H } = c;
  shardVsT += 0.018; ctx.clearRect(0,0,W,H);

  const isShard = shardVsReplMode === 'shard';
  const srcX = W*0.12, dbXs = [W*0.42, W*0.62, W*0.82];
  const midY = H/2;
  const colors = ['#6366f1','#22c55e','#f59e0b'];
  const shardData = [['A','B'],['C','D'],['E','F']];
  const replData  = [['A','B','C','D','E','F'],['A','B','C','D','E','F'],['A','B','C','D','E','F']];

  // source table
  gBox(ctx, srcX-44, midY-32, 88, 64, 8, '#0f1117', '#475569', 2);
  txt(ctx,'📋', srcX, midY-14, {size:20});
  txt(ctx,'All Data', srcX, midY+6, {size:10, color:'#94a3b8', weight:'700'});
  txt(ctx,'A B C D E F', srcX, midY+22, {size:9, color:'#64748b'});

  // arrows + DB boxes
  dbXs.forEach((dx,i)=>{
    const col = colors[i];
    const data = isShard ? shardData[i] : replData[i];
    const label = isShard ? `Shard ${i+1}` : `Replica ${i+1}`;
    const anim = 1+Math.sin(shardVsT*1.5+i*1.1)*0.04;

    // animated arrow
    const dash = -shardVsT*18;
    ctx.save(); ctx.strokeStyle=col+'66'; ctx.lineWidth=1.5; ctx.setLineDash([6,4]); ctx.lineDashOffset=dash;
    ctx.beginPath(); ctx.moveTo(srcX+44,midY); ctx.lineTo(dx-38,midY); ctx.stroke(); ctx.restore();

    // moving packet on first item
    const ph = (shardVsT*0.4 + i*0.33) % 1;
    const pkx = lerp(srcX+44, dx-38, ease(ph));
    gDot(ctx, pkx, midY, 5, col, 0.7);

    // DB box
    gBox(ctx, dx-38, midY-36*anim, 76, 72*anim, 8, col+'15', col, 1.5);
    txt(ctx,'🗄️', dx, midY-16, {size:16});
    txt(ctx,label, dx, midY+2, {size:9, color:col, weight:'700'});
    txt(ctx, data.join(' '), dx, midY+16, {size:8, color:col+'cc'});

    // copy/split indicator
    const badge = isShard ? '✂️ owns' : '📋 copy';
    txt(ctx, badge, dx, midY+28, {size:8, color:col+'99'});
  });

  // big label
  const label = isShard ? '✂️  S H A R D I N G  =  S P L I T' : '📋  R E P L I C A T I O N  =  C O P Y';
  const labelCol = isShard ? '#06b6d4' : '#22c55e';
  txt(ctx, label, W/2, H-12, {size:11, color:labelCol, weight:'700'});
}

// ============================================================
//  SHARDING — Strategy animation with live record routing
// ============================================================
let shardStrategy = 'range', shardT = 0;
let shardPackets = [];
const SHARD_COLORS = ['#6366f1','#22c55e','#f59e0b'];
const SHARD_USERS = [
  {id:101,name:'Betty',   uid:101},
  {id:102,name:'David',   uid:102},
  {id:103,name:'Maria',   uid:103},
  {id:104,name:'Robert',  uid:104},
  {id:105,name:'John',    uid:105},
  {id:201,name:'Alice',   uid:201},
  {id:202,name:'Bob',     uid:202},
];
let shardUserIdx = 0;
let shardBins = [[],[],[]]; // records landed in each shard

const SHARD_DIR = {101:0, 102:2, 103:1, 104:0, 105:2, 201:1, 202:0}; // directory

function getShardFor(uid, strategy) {
  if(strategy==='range') {
    if(uid<=102) return 0;
    if(uid<=104) return 1;
    return 2;
  }
  if(strategy==='hash') return uid % 3;
  if(strategy==='directory') return SHARD_DIR[uid] ?? uid%3;
  return 0;
}

function setShardStrategy(s) {
  shardStrategy = s; shardPackets = []; shardBins = [[],[],[]]; shardUserIdx = 0;
  document.querySelectorAll('.anim-btn').forEach(b=>{
    const t=b.textContent.toLowerCase();
    b.classList.toggle('active', t.includes(s==='range'?'range':s==='hash'?'hash':'dir'));
  });
  const msgs = {
    range: 'Range Sharding: user_id 101–102 → Shard 1,  103–104 → Shard 2,  105+ → Shard 3. Sequential writes hit the last shard.',
    hash:  'Hash Sharding: shard = user_id % 3. Uniform distribution but range queries require scanning all shards.',
    directory: 'Directory Sharding: a lookup table maps each user to their shard. Maximum flexibility but the directory is a bottleneck.',
  };
  const el=document.getElementById('shardInfo');
  if(el){ el.style.color='var(--cyan)'; el.textContent=msgs[s]; }
}

function shardSendRecord() {
  if(shardUserIdx >= SHARD_USERS.length) { shardUserIdx=0; shardBins=[[],[],[]]; }
  const user = SHARD_USERS[shardUserIdx++];
  const target = getShardFor(user.uid, shardStrategy);
  shardPackets.push({ user, target, t:0, trail:[] });
  const el=document.getElementById('shardInfo');
  if(el){
    const algo = shardStrategy==='range' ? `uid ${user.uid} ≤ ${user.uid<=102?'102':user.uid<=104?'104':'∞'}` :
                 shardStrategy==='hash'  ? `${user.uid} % 3 = ${user.uid%3}` :
                 `DIR[${user.uid}] = Shard ${target+1}`;
    el.style.color=SHARD_COLORS[target];
    el.innerHTML=`user_id <strong>${user.uid}</strong> (${user.name})  →  <strong>${algo}</strong>  →  <strong style="color:${SHARD_COLORS[target]}">Shard ${target+1}</strong>`;
  }
}

function initShardCanvas(strategy) {
  if(strategy) shardStrategy=strategy;
  shardPackets=[]; shardBins=[[],[],[]]; shardUserIdx=0; shardT=0;
  _raf('shardCanvas', drawShardFrame);
}

function drawShardFrame() {
  const c = getCanvas('shardCanvas'); if(!c) return;
  const { ctx, W, H } = c;
  shardT += 0.02; ctx.clearRect(0,0,W,H);

  const appX=52, shardXs=[W*0.45, W*0.62, W*0.79];
  const topY=H*0.18, botY=H*0.82;

  // ── App / Router box ──
  gBox(ctx, appX-40, H/2-28, 80, 56, 8, '#0f1117', '#6366f1', 2);
  txt(ctx,'⚙️', appX, H/2-10, {size:18});
  txt(ctx,'App', appX, H/2+8, {size:10, color:'#818cf8', weight:'700'});
  const routerLabel = shardStrategy==='range'?'range':'hash %3';
  txt(ctx,routerLabel, appX, H/2+22, {size:8, color:'#6366f155'});

  // ── Shard boxes ──
  shardXs.forEach((sx,i)=>{
    const col=SHARD_COLORS[i];
    const records=shardBins[i];
    const fill=Math.min(records.length/5, 1);
    const pulse=1+Math.sin(shardT*1.2+i*1.4)*0.03;

    arrowLine(ctx, appX+40, H/2, sx-36, H/2, col+'33', 0, false, 1);
    gBox(ctx, sx-36, topY, 72, botY-topY, 10, col+Math.round(fill*0.2*255).toString(16).padStart(2,'0'), col, fill>0.8?2.5:1.5);

    // fill bar inside shard
    if(fill>0) {
      ctx.save(); ctx.shadowColor=col; ctx.shadowBlur=4;
      ctx.beginPath(); ctx.roundRect(sx-30, botY-8-(botY-topY-24)*fill, 60, (botY-topY-24)*fill, [4,4,0,0]);
      ctx.fillStyle=col+'44'; ctx.fill(); ctx.strokeStyle=col+'66'; ctx.lineWidth=1; ctx.stroke();
      ctx.restore();
    }

    txt(ctx,`Shard ${i+1}`, sx, topY+14, {size:10, color:col, weight:'700'});

    // shard range label
    const rangeLabel = shardStrategy==='range' ? [`101–102`,`103–104`,`105+`][i] :
                       shardStrategy==='hash'  ? [`uid%3=0`,`uid%3=1`,`uid%3=2`][i] :
                       [`DIR=0`,`DIR=1`,`DIR=2`][i];
    txt(ctx, rangeLabel, sx, topY+28, {size:8, color:col+'88'});

    // records in shard
    records.slice(-4).forEach((r,ri)=>{
      txt(ctx, `${r.uid}·${r.name}`, sx, botY-14-ri*16, {size:8, color:col+'cc'});
    });
    txt(ctx, `${records.length} records`, sx, botY+14, {size:9, color:col, weight:'600'});
  });

  // ── Moving packets ──
  shardPackets = shardPackets.filter(p=>p.t<1);
  shardPackets.forEach(p=>{
    p.t+=0.025;
    const tx=shardXs[p.target], col=SHARD_COLORS[p.target];
    const px=lerp(appX+40, tx-36, ease(p.t));
    const py=H/2;
    if(!p.trail) p.trail=[];
    p.trail.push({x:px,y:py}); if(p.trail.length>10) p.trail.shift();
    gDot(ctx,px,py,6,col,1,p.trail);
    txt(ctx,p.user.name,px,py-14,{size:8,color:col,weight:'700'});
    if(p.t>=1) {
      shardBins[p.target].push(p.user);
    }
  });

  // ── Strategy badge ──
  const badgeCol={range:'#6366f1',hash:'#22c55e',directory:'#f59e0b'}[shardStrategy];
  gBox(ctx, W-100, 4, 96, 20, 6, badgeCol+'22', badgeCol, 1);
  txt(ctx, shardStrategy.toUpperCase(), W-52, 14, {size:8, color:badgeCol, weight:'700'});
}

// ============================================================
//  SHARDING — Shard + Replication combined diagram
// ============================================================
let shardReplT = 0, shardReplPackets = [], shardReplFailedPrimary = -1;
const SR_SHARD_COLORS = ['#6366f1','#22c55e','#f59e0b'];

function initShardReplCanvas() {
  shardReplT=0; shardReplPackets=[]; shardReplFailedPrimary=-1;
  _raf('shardReplCanvas', drawShardReplFrame);
  const el=document.getElementById('shardReplInfo');
  if(el){ el.style.color='var(--text2)'; el.textContent='Each shard has 1 Primary (writes) + 2 Replicas (reads). Click Write or Read to see traffic flow.'; }
}

function shardReplWrite() {
  // pick a random shard, send write to primary
  const si = Math.floor(Math.random()*3);
  shardReplPackets.push({type:'write', shard:si, t:0, trail:[], from:'app', to:'primary'});
  const el=document.getElementById('shardReplInfo');
  if(el){ el.style.color=SR_SHARD_COLORS[si]; el.innerHTML=`✏️ Write → <strong>Shard ${si+1} Primary</strong> → async replication to Shard ${si+1} Replicas`; }
}

function shardReplRead() {
  const si = Math.floor(Math.random()*3);
  const ri = Math.floor(Math.random()*2);
  shardReplPackets.push({type:'read', shard:si, replica:ri, t:0, trail:[], from:'app', to:'replica'});
  const el=document.getElementById('shardReplInfo');
  if(el){ el.style.color=SR_SHARD_COLORS[si]; el.innerHTML=`📖 Read → <strong>Shard ${si+1} Replica ${ri+1}</strong> (primary handles ${shardReplFailedPrimary===si?'❌ FAILED':'writes only'})`; }
}

function shardReplFail() {
  shardReplFailedPrimary = Math.floor(Math.random()*3);
  const el=document.getElementById('shardReplInfo');
  if(el){ el.style.color='var(--red)'; el.innerHTML=`💥 <strong>Shard ${shardReplFailedPrimary+1} Primary FAILED!</strong> Replica 1 will be promoted automatically (leader election). Zero data loss if sync replication was enabled.`; }
}

function shardReplReset() {
  shardReplFailedPrimary=-1; shardReplPackets=[];
  const el=document.getElementById('shardReplInfo');
  if(el){ el.style.color='var(--text2)'; el.textContent='Reset. Each shard: 1 Primary + 2 Replicas.'; }
}

function drawShardReplFrame() {
  const c = getCanvas('shardReplCanvas'); if(!c) return;
  const { ctx, W, H } = c;
  shardReplT++; ctx.clearRect(0,0,W,H);

  const appX=48, shardGap=(W-80)/3;
  // 3 shards, each at a column
  const shardXs=[96+shardGap*0, 96+shardGap*1, 96+shardGap*2];
  const primaryY=H*0.28, replicaYs=[H*0.62, H*0.88];

  // App box
  gBox(ctx, appX-36, H/2-20, 72, 40, 8, '#0f1117', '#6366f1', 2);
  txt(ctx,'⚙️ App', appX, H/2, {size:10, color:'#818cf8', weight:'700'});

  shardXs.forEach((sx,si)=>{
    const col=SR_SHARD_COLORS[si];
    const isFailed=shardReplFailedPrimary===si;

    // shard header label
    txt(ctx, `Shard ${si+1}`, sx, 14, {size:10, color:col, weight:'700'});

    // App → shard arrow
    arrowLine(ctx, appX+36, H/2, sx-28, primaryY, col+'44', 0, false, 1);

    // Primary box
    const primCol = isFailed ? '#ef4444' : col;
    ctx.save(); if(isFailed){ctx.shadowColor='#ef4444';ctx.shadowBlur=16;}
    gBox(ctx, sx-28, primaryY-18, 56, 36, 8, primCol+'22', primCol, isFailed?2.5:2);
    ctx.restore();
    txt(ctx, isFailed?'💀':'👑', sx, primaryY-4, {size:14});
    txt(ctx, isFailed?'FAILED':'Primary', sx, primaryY+12, {size:8, color:primCol, weight:'700'});

    // Replica boxes
    replicaYs.forEach((ry,ri)=>{
      const isPromoted = isFailed && ri===0;
      const rCol = isPromoted ? '#22c55e' : col;
      // replication arrow from primary
      ctx.save(); ctx.strokeStyle=rCol+'55'; ctx.lineWidth=1.5; ctx.setLineDash([4,4]); ctx.lineDashOffset=-shardReplT*2;
      ctx.beginPath(); ctx.moveTo(sx, primaryY+18); ctx.lineTo(sx, ry-18); ctx.stroke(); ctx.restore();

      gBox(ctx, sx-28, ry-18, 56, 36, 8, rCol+(isPromoted?'33':'15'), rCol, isPromoted?2.5:1.5);
      txt(ctx, isPromoted?'👑':'📋', sx, ry-4, {size:12});
      txt(ctx, isPromoted?'NEW PRIMARY':`Replica ${ri+1}`, sx, ry+12, {size:7, color:rCol, weight:'700'});
    });

    // small replication-lag labels on lines
    if(!isFailed){
      const lagMs = [12,28][si%2];
      txt(ctx, `~${lagMs}ms lag`, sx+32, primaryY+36, {size:7, color:col+'66', align:'left'});
    }
  });

  // moving packets
  shardReplPackets = shardReplPackets.filter(p=>p.t<1);
  shardReplPackets.forEach(p=>{
    p.t += 0.022;
    const sx=shardXs[p.shard], col=SR_SHARD_COLORS[p.shard];
    const ty = p.type==='write' ? primaryY : replicaYs[p.replica||0];
    const px=lerp(appX+36, sx-28, ease(p.t));
    const py=lerp(H/2, ty, ease(p.t));
    if(!p.trail) p.trail=[];
    p.trail.push({x:px,y:py}); if(p.trail.length>10) p.trail.shift();
    gDot(ctx, px, py, 6, p.type==='write'?'#f59e0b':col, 1, p.trail);
    // after write hits primary, fan out replication
    if(p.type==='write' && p.t>0.7) {
      replicaYs.forEach((ry,ri)=>{
        const rp=(p.t-0.7)/0.3;
        const rx=sx, ryy=lerp(primaryY+18,ry-18,ease(rp));
        gDot(ctx, rx, ryy, 4, col, 0.5);
      });
    }
  });

  txt(ctx,'Writes → Primary  ·  Reads → Replicas  ·  Replication = async fan-out', W/2, H-6, {size:9, color:'#334155'});
}

// ============================================================
//  REPLICATION — Leader-Follower / Multi-Leader / Leaderless
// ============================================================
let replMode = 'leader-follower', replT = 0, replPackets = [];

function setReplMode(mode) {
  replMode = mode; replT = 0; replPackets = [];
  document.querySelectorAll('.anim-btn').forEach(b=>{
    const t=b.textContent.toLowerCase();
    b.classList.toggle('active',
      (mode==='leader-follower'&&t.includes('leader-f'))||
      (mode==='multi-leader'&&t.includes('multi'))||
      (mode==='leaderless'&&t.includes('leader'+'less')));
  });
  const msgs={
    'leader-follower':'Leader-Follower: all writes go to the Primary. Primary replicates to Replicas asynchronously. Reads can hit any node.',
    'multi-leader':'Multi-Leader: writes accepted by any leader node. Leaders sync with each other. Conflicts possible — need resolution strategy.',
    'leaderless':'Leaderless (Quorum): writes go to W=2 nodes, reads from R=2 nodes. W+R=4 > N=3, guaranteeing overlap with latest write.',
  };
  const el=document.getElementById('replInfo');
  if(el){ el.style.color='var(--cyan)'; el.textContent=msgs[mode]; }
  replSendWrite();
}

function replSendWrite() {
  replPackets = [];
  if(replMode==='leader-follower') {
    // write to leader (node 0), then fan out to 1 & 2
    replPackets.push({from:0,to:1,t:0,trail:[],delay:0.4,color:'#22c55e',label:'replicate'});
    replPackets.push({from:0,to:2,t:0,trail:[],delay:0.4,color:'#22c55e',label:'replicate'});
    replPackets.push({from:-1,to:0,t:0,trail:[],delay:0,color:'#f59e0b',label:'WRITE'});
  } else if(replMode==='multi-leader') {
    // write accepted by node 0, sync to 1 & 2 as peers
    [0,1,2].forEach((src,i)=>{
      [[1,2],[0,2],[0,1]][i].forEach(dst=>{
        replPackets.push({from:src,to:dst,t:0,trail:[],delay:i*0.2,color:['#6366f1','#22c55e','#f59e0b'][src],label:'sync'});
      });
    });
    replPackets.push({from:-1,to:0,t:0,trail:[],delay:0,color:'#f59e0b',label:'WRITE'});
  } else {
    // quorum: write to nodes 0 and 1
    replPackets.push({from:-1,to:0,t:0,trail:[],delay:0,  color:'#f59e0b',label:'W'});
    replPackets.push({from:-1,to:1,t:0,trail:[],delay:0.1,color:'#f59e0b',label:'W'});
    replPackets.push({from:2, to:-2,t:0,trail:[],delay:0.5,color:'#22c55e',label:'READ'});
  }
}

function initReplCanvas() {
  replMode='leader-follower'; replT=0; replPackets=[];
  _raf('replCanvas', drawReplFrame);
  setTimeout(()=>setReplMode('leader-follower'),100);
}

function drawReplFrame() {
  const c = getCanvas('replCanvas'); if(!c) return;
  const { ctx, W, H } = c;
  replT += 0.018; ctx.clearRect(0,0,W,H);

  const clientX=46, clientY=H/2;
  // 3 DB nodes arranged in a triangle
  const nodePositions=[
    { x:W*0.42, y:H*0.2 },   // node 0 — Primary / Leader A
    { x:W*0.62, y:H*0.72 },  // node 1 — Replica 1 / Leader B
    { x:W*0.82, y:H*0.32 },  // node 2 — Replica 2 / Leader C
  ];
  const nodeColors=['#6366f1','#22c55e','#f59e0b'];
  const nodeLabels={
    'leader-follower':['Primary','Replica 1','Replica 2'],
    'multi-leader':['Leader A','Leader B','Leader C'],
    'leaderless':['Node 1','Node 2','Node 3'],
  };
  const labels=nodeLabels[replMode];

  // client
  gBox(ctx, clientX-38, clientY-20, 76, 40, 8, '#0f1117', '#3b82f6', 2);
  txt(ctx,'👤 Client', clientX, clientY, {size:10, color:'#60a5fa', weight:'700'});

  // connection lines between DB nodes
  [[0,1],[0,2],[1,2]].forEach(([a,b])=>{
    const na=nodePositions[a], nb=nodePositions[b];
    ctx.save(); ctx.strokeStyle='#1e2535'; ctx.lineWidth=1.5; ctx.setLineDash([4,6]);
    ctx.beginPath(); ctx.moveTo(na.x,na.y); ctx.lineTo(nb.x,nb.y); ctx.stroke(); ctx.restore();
  });

  // DB nodes
  nodePositions.forEach((np,i)=>{
    const col=nodeColors[i];
    const isLeader=(replMode==='leader-follower'&&i===0)||(replMode==='multi-leader')||(replMode==='leaderless');
    const pulse=1+Math.sin(replT*1.8+i*2.2)*0.04;
    const nr=26*pulse;
    ctx.save(); ctx.shadowColor=col; ctx.shadowBlur=14;
    ctx.beginPath(); ctx.roundRect(np.x-nr, np.y-nr*0.7, nr*2, nr*1.4, 8);
    ctx.fillStyle=col+'22'; ctx.fill(); ctx.strokeStyle=col; ctx.lineWidth=2; ctx.stroke(); ctx.restore();
    txt(ctx,'🗄️', np.x, np.y-6, {size:16});
    txt(ctx, labels[i], np.x, np.y+12, {size:9, color:col, weight:'700'});

    // quorum indicator
    if(replMode==='leaderless') {
      const quorumLabel = i<2 ? 'W=✓' : 'R=✓';
      const qCol = i<2?'#f59e0b':'#22c55e';
      txt(ctx, quorumLabel, np.x, np.y+24, {size:8, color:qCol, weight:'700'});
    }
  });

  // arrow client → node 0
  arrowLine(ctx, clientX+38, clientY, nodePositions[0].x-26, nodePositions[0].y, '#33415555', 0, false, 1.5);

  // packets
  replPackets = replPackets.filter(p=>p.t<1.2);
  replPackets.forEach(p=>{
    if(replT*0.018*55 < (p.delay||0)*55 ) return; // delay
    p.t = Math.min(p.t + 0.022, 1);
    let x1,y1,x2,y2;
    if(p.from===-1){ x1=clientX+38; y1=clientY; }
    else { x1=nodePositions[p.from].x; y1=nodePositions[p.from].y; }
    if(p.to===-2){ x2=clientX+38; y2=clientY+30; }
    else { x2=nodePositions[p.to].x; y2=nodePositions[p.to].y; }
    const px=lerp(x1,x2,ease(p.t)), py=lerp(y1,y2,ease(p.t));
    if(!p.trail)p.trail=[];
    p.trail.push({x:px,y:py}); if(p.trail.length>10)p.trail.shift();
    gDot(ctx, px, py, 6, p.color, 1, p.trail);
    txt(ctx, p.label||'', lerp(x1,x2,0.5), lerp(y1,y2,0.5)-12, {size:8, color:p.color+'cc'});
  });

  // auto-loop packets
  if(replT % 140 < 2) replSendWrite();
}

// ============================================================
//  REPLICATION — Primary Failure + Failover demo
// ============================================================
let replFailState = 'normal', replFailT = 0, replFailPackets = [];

function initReplFailCanvas() {
  replFailState='normal'; replFailT=0; replFailPackets=[];
  _raf('replFailCanvas', drawReplFailFrame);
  const el=document.getElementById('replFailInfo');
  if(el){ el.style.color='var(--text2)'; el.textContent='Normal operation: Primary handles writes, Replica 1 & 2 handle reads. Click "Kill Primary" to simulate a failure.'; }
}

function replFailDemo(cmd) {
  if(cmd==='fail') {
    replFailState='failed'; replFailPackets=[];
    const el=document.getElementById('replFailInfo');
    if(el){ el.style.color='var(--red)'; el.innerHTML='💥 <strong>Primary is DOWN!</strong> Health check detects no heartbeat after 30s. Initiating leader election among replicas…'; }
  }
  if(cmd==='promote') {
    if(replFailState!=='failed') return;
    replFailState='promoted';
    const el=document.getElementById('replFailInfo');
    if(el){ el.style.color='var(--green)'; el.innerHTML='✅ <strong>Replica 1 promoted to Primary!</strong> Application config updated (or via DNS failover). Replica 2 now replicates from the new Primary. Zero data loss (sync replication was enabled).'; }
  }
  if(cmd==='reset') {
    replFailState='normal'; replFailPackets=[];
    const el=document.getElementById('replFailInfo');
    if(el){ el.style.color='var(--text2)'; el.textContent='Reset to normal operation.'; }
  }
}

function drawReplFailFrame() {
  const c = getCanvas('replFailCanvas'); if(!c) return;
  const { ctx, W, H } = c;
  replFailT += 0.02; ctx.clearRect(0,0,W,H);

  const appX=48, midY=H/2;
  const nodes=[
    { x:W*0.38, label:'Primary',   color:'#6366f1', role:'write' },
    { x:W*0.60, label:'Replica 1', color:'#22c55e', role:'read'  },
    { x:W*0.82, label:'Replica 2', color:'#f59e0b', role:'read'  },
  ];

  // determine current state per node
  const nodeStates={
    normal:    ['active','active','active'],
    failed:    ['dead',  'active','active'],
    promoted:  ['dead',  'primary','active'],
  }[replFailState];

  // App box
  gBox(ctx, appX-36, midY-20, 72, 40, 8, '#0f1117', '#3b82f6', 2);
  txt(ctx,'⚙️ App', appX, midY, {size:10, color:'#60a5fa', weight:'700'});

  nodes.forEach((n,i)=>{
    const state=nodeStates[i];
    const isDead=state==='dead';
    const isPrimary=state==='primary'||(state==='active'&&i===0&&replFailState==='normal');
    const col=isDead?'#ef4444':state==='primary'?'#ec4899':n.color;
    const pulse=isDead?1:1+Math.sin(replFailT*2+i)*0.04;

    // arrow from app
    arrowLine(ctx, appX+36, midY, n.x-30, midY, col+'44', 0, false, isDead?0.5:1.5);

    // node box
    ctx.save();
    if(isDead){ctx.shadowColor='#ef4444';ctx.shadowBlur=8+Math.sin(replFailT*8)*6;}
    else if(isPrimary){ctx.shadowColor=col;ctx.shadowBlur=16;}
    ctx.beginPath(); ctx.roundRect(n.x-30, midY-32*pulse, 60, 64*pulse, 10);
    ctx.fillStyle=col+(isDead?'22':isPrimary?'33':'18'); ctx.fill();
    ctx.strokeStyle=col; ctx.lineWidth=isDead?2.5:isPrimary?2.5:1.5;
    ctx.stroke(); ctx.restore();

    const icon=isDead?'💀':isPrimary?'👑':'📋';
    txt(ctx, icon, n.x, midY-12, {size:18});
    const stateLabel=isDead?'DEAD':state==='primary'?'NEW PRIMARY':n.label;
    txt(ctx, stateLabel, n.x, midY+8, {size:9, color:col, weight:'700'});
    txt(ctx, isDead?'❌ no heartbeat':isPrimary?'✅ accepts writes':'reads', n.x, midY+22, {size:8, color:col+'99'});

    // replication arrow between Replica1 and Replica2 in promoted state
    if(i===1 && replFailState==='promoted') {
      ctx.save(); ctx.strokeStyle='#22c55e66'; ctx.lineWidth=1.5; ctx.setLineDash([4,4]); ctx.lineDashOffset=-replFailT*15;
      ctx.beginPath(); ctx.moveTo(n.x+30,midY); ctx.lineTo(nodes[2].x-30,midY); ctx.stroke(); ctx.restore();
      const px=lerp(n.x+30,nodes[2].x-30,(replFailT*0.3)%1);
      gDot(ctx,px,midY,4,'#22c55e',0.7);
      txt(ctx,'replicates to',lerp(n.x+30,nodes[2].x-30,0.5),midY-12,{size:8,color:'#22c55e88'});
    }
  });

  // normal write/read packets
  if(replFailState==='normal' && replFailT%80<40) {
    const ph=(replFailT%80)/40;
    const px=lerp(appX+36,nodes[0].x-30,ease(ph));
    gDot(ctx,px,midY-4,5,'#f59e0b',0.8);
    txt(ctx,'WRITE',lerp(appX+36,nodes[0].x-30,0.5),midY-18,{size:8,color:'#f59e0b88'});
  }
  if(replFailState==='normal' && replFailT%60<30) {
    const ph=(replFailT%60)/30, ni=Math.floor(replFailT/60)%2+1;
    const px=lerp(appX+36,nodes[ni].x-30,ease(ph));
    gDot(ctx,px,midY+4,5,'#22c55e',0.7);
    txt(ctx,'READ',lerp(appX+36,nodes[ni].x-30,0.5),midY+20,{size:8,color:'#22c55e88'});
  }
}
