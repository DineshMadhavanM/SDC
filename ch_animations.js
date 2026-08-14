// ============================================================
//  CH STEP 1 — Simple hashing failure demo
// ============================================================
const CH_KEYS_DEMO = ['user123','user456','order99','cart55','sess01','item77','pay33','auth88'];
const CH_KEY_HASHES = [30,62,88,15,45,72,20,55];
let chSimpleN=3, chSimpleT=0, chSimpleChanged=[];

function chSimpleDemo(n){
  const prev=chSimpleN; chSimpleN=n;
  chSimpleChanged=CH_KEY_HASHES.map((h,i)=>{
    return {key:CH_KEYS_DEMO[i],hash:h,old:h%prev,new:h%n,changed:(h%prev)!==(h%n)};
  });
  const moved=chSimpleChanged.filter(k=>k.changed).length;
  const pct=Math.round(moved/CH_KEYS_DEMO.length*100);
  const el=document.getElementById('chSimpleInfo');
  if(el){
    el.style.color=pct>50?'var(--red)':'var(--green)';
    el.innerHTML=`<strong>${prev}</strong> → <strong>${n}</strong> servers: `+
      `<strong style="color:${pct>50?'var(--red)':'var(--green)'}">${moved}/${CH_KEYS_DEMO.length} keys (${pct}%) moved</strong>. `+
      (pct>50?'🔴 Cache completely invalidated — catastrophic for production!':'✅ Minimal disruption.');
  }
  document.querySelectorAll('#chSimpleCanvas ~ .anim-controls .anim-btn').forEach(b=>
    b.classList.toggle('active',b.textContent.trim()===n+' Servers'||b.textContent.includes('Add '+(n)+'th')||b.textContent.includes('Add '+(n)+'rd')));
  _stopRaf('chSimpleCanvas'); chSimpleT=0;
  _raf('chSimpleCanvas',drawChSimpleFrame);
}

function initCHSimpleCanvas(n){
  chSimpleN=n; chSimpleChanged=[]; chSimpleT=0;
  _raf('chSimpleCanvas',drawChSimpleFrame);
}

function drawChSimpleFrame(){
  const c=getCanvas('chSimpleCanvas'); if(!c)return;
  const {ctx,W,H}=c; chSimpleT+=0.018;
  ctx.clearRect(0,0,W,H);
  const sColors=['#6366f1','#22c55e','#f59e0b','#ec4899','#06b6d4'];
  const sw=Math.min((W-32)/Math.max(chSimpleN,1)-8,88);
  const sGap=(W-chSimpleN*sw)/(chSimpleN+1);
  for(let i=0;i<chSimpleN;i++){
    const x=sGap+i*(sw+sGap)+sw/2;
    const pulse=1+Math.sin(chSimpleT*2+i)*0.022;
    gBox(ctx,x-sw/2,H-52,sw*pulse,36,8,sColors[i]+'22',sColors[i],2);
    txt(ctx,'S'+(i+1),x,H-34,{size:12,color:sColors[i],weight:'800'});
    txt(ctx,'Server '+(i+1),x,H-20,{size:8,color:sColors[i]+'99'});
  }
  const kCount=CH_KEY_HASHES.length;
  const kw=Math.min((W-24)/kCount-4,60);
  const kGap=(W-kCount*kw)/(kCount+1);
  CH_KEY_HASHES.forEach((h,i)=>{
    const kx=kGap+i*(kw+kGap)+kw/2;
    const serverIdx=h%chSimpleN;
    const col=sColors[serverIdx];
    const info=chSimpleChanged[i];
    const changed=info?.changed;
    ctx.save();
    if(changed){ctx.shadowColor='#ef4444';ctx.shadowBlur=10;}
    ctx.beginPath();ctx.roundRect(kx-kw/2,14,kw,26,5);
    ctx.fillStyle=changed?'rgba(239,68,68,0.15)':col+'22';
    ctx.strokeStyle=changed?'#ef4444':col; ctx.lineWidth=changed?2:1.5;
    ctx.fill();ctx.stroke();ctx.restore();
    txt(ctx,CH_KEYS_DEMO[i],kx,24,{size:8,color:changed?'#ef4444':col,weight:'600'});
    txt(ctx,'h='+h,kx,35,{size:7,color:'#334155'});
    const sx=sGap+serverIdx*(sw+sGap)+sw/2;
    ctx.save();ctx.globalAlpha=0.3;ctx.strokeStyle=changed?'#ef4444':col;
    ctx.lineWidth=1;ctx.setLineDash([3,3]);
    ctx.beginPath();ctx.moveTo(kx,40);ctx.lineTo(sx,H-52);ctx.stroke();ctx.restore();
    if(changed) txt(ctx,'⚡',kx,8,{size:11});
  });
  txt(ctx,'hash(key) % '+chSimpleN+' = server assignment',W/2,H-3,{size:9,color:'#334155'});
}

// ============================================================
//  CH STEP 2 — Hash Ring + animated key lookup
// ============================================================
const CH_RING_SERVERS=[
  {label:'S1',angle:10, color:'#6366f1'},
  {label:'S2',angle:45, color:'#22c55e'},
  {label:'S3',angle:80, color:'#f59e0b'},
];
let chRingT=0, chLookupAngle=null, chLookupName='', chLookupResult='', chLookupProgress=0;

function initCHRingCanvas(){
  chRingT=0; chLookupAngle=null;
  _raf('chRingCanvas',drawChRingFrame);
}

function chLookupKey(name,angle){
  chLookupName=name; chLookupAngle=angle; chLookupProgress=0;
  const sorted=[...CH_RING_SERVERS].sort((a,b)=>a.angle-b.angle);
  const srv=sorted.find(s=>s.angle>=angle)||sorted[0];
  chLookupResult=srv.label;
  const el=document.getElementById('chRingInfo');
  if(el){
    el.style.color='var(--cyan)';
    el.innerHTML=`hash("<strong>${name}</strong>") = <strong style="color:var(--yellow)">${angle}°</strong> → `+
      `walk clockwise → hit <strong style="color:${srv.color}">${srv.label}</strong> at ${srv.angle}° → `+
      `<strong style="color:${srv.color}">"${name}" lives on ${srv.label}</strong>`;
  }
}

function drawChRingFrame(){
  const c=getCanvas('chRingCanvas'); if(!c)return;
  const {ctx,W,H}=c; chRingT+=0.018;
  ctx.clearRect(0,0,W,H);
  const cx=W/2, cy=H/2+10, R=Math.min(W,H)*0.34;

  // ownership arc fills
  const sorted=[...CH_RING_SERVERS].sort((a,b)=>a.angle-b.angle);
  sorted.forEach((srv,i)=>{
    const next=sorted[(i+1)%sorted.length];
    let span=next.angle-srv.angle; if(span<=0)span+=360;
    ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,R-2,(srv.angle-90)*Math.PI/180,(srv.angle+span-90)*Math.PI/180);
    ctx.closePath();ctx.fillStyle=srv.color+'18';ctx.fill();
    // ownership % at arc midpoint
    const mid=srv.angle+span/2;
    const pct=Math.round(span/360*100);
    txt(ctx,pct+'%',cx+(R*0.6)*Math.cos((mid-90)*Math.PI/180),cy+(R*0.6)*Math.sin((mid-90)*Math.PI/180),{size:11,weight:'700',color:srv.color+'cc'});
  });

  // ring
  ctx.save();ctx.shadowColor='#6366f1';ctx.shadowBlur=10;
  ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);
  ctx.strokeStyle='#2a3347';ctx.lineWidth=3;ctx.stroke();ctx.restore();

  // ticks & degree labels
  for(let a=0;a<360;a+=30){
    const rad=(a-90)*Math.PI/180;
    const len=a%90===0?10:5;
    ctx.beginPath();ctx.moveTo(cx+(R-len)*Math.cos(rad),cy+(R-len)*Math.sin(rad));
    ctx.lineTo(cx+R*Math.cos(rad),cy+R*Math.sin(rad));
    ctx.strokeStyle=a%90===0?'#2a3347':'#1a2030';ctx.lineWidth=1;ctx.stroke();
  }
  [0,90,180,270].forEach(a=>{
    const rad=(a-90)*Math.PI/180;
    txt(ctx,a+'°',cx+(R+16)*Math.cos(rad),cy+(R+16)*Math.sin(rad),{size:9,color:'#2a3347'});
  });

  // servers
  CH_RING_SERVERS.forEach(s=>{
    const rad=(s.angle-90)*Math.PI/180;
    const nx=cx+R*Math.cos(rad),ny=cy+R*Math.sin(rad);
    const isRes=chLookupResult===s.label&&chLookupAngle!==null;
    const pulse=isRes?1+Math.sin(chRingT*5)*0.1:1+Math.sin(chRingT*1.5)*0.03;
    const nr=22*pulse;
    ctx.save();if(isRes){ctx.shadowColor=s.color;ctx.shadowBlur=26;}
    ctx.beginPath();ctx.arc(nx,ny,nr,0,Math.PI*2);
    ctx.fillStyle=s.color+'44';ctx.strokeStyle=s.color;ctx.lineWidth=isRes?3:2;
    ctx.fill();ctx.stroke();ctx.restore();
    txt(ctx,s.label,nx,ny-2,{size:11,weight:'800',color:s.color});
    txt(ctx,s.angle+'°',cx+(R+28)*Math.cos(rad),cy+(R+28)*Math.sin(rad),{size:9,color:s.color+'cc',weight:'600'});
  });

  // lookup key + sweep arc
  if(chLookupAngle!==null){
    chLookupProgress=Math.min(chLookupProgress+0.022,1);
    const krad=(chLookupAngle-90)*Math.PI/180;
    const kx=cx+R*Math.cos(krad),ky=cy+R*Math.sin(krad);
    ctx.save();ctx.shadowColor='#f59e0b';ctx.shadowBlur=20;
    ctx.beginPath();ctx.arc(kx,ky,10+Math.sin(chRingT*6)*2,0,Math.PI*2);
    ctx.fillStyle='#f59e0b';ctx.fill();ctx.restore();
    txt(ctx,'"'+chLookupName+'"',cx+(R+32)*Math.cos(krad),cy+(R+32)*Math.sin(krad),{size:9,color:'#f59e0b',weight:'700'});
    txt(ctx,chLookupAngle+'°',kx,ky+20,{size:9,color:'#f59e0b'});
    const srvAngle=CH_RING_SERVERS.find(s=>s.label===chLookupResult)?.angle||0;
    let sweep=srvAngle-chLookupAngle;if(sweep<0)sweep+=360;
    ctx.save();ctx.strokeStyle='#f59e0bcc';ctx.lineWidth=3;ctx.setLineDash([7,5]);
    ctx.lineDashOffset=-chRingT*22;
    ctx.beginPath();ctx.arc(cx,cy,R,(chLookupAngle-90)*Math.PI/180,(chLookupAngle+sweep*chLookupProgress-90)*Math.PI/180);
    ctx.stroke();ctx.restore();
    const tipRad=(chLookupAngle+sweep*chLookupProgress-90)*Math.PI/180;
    gDot(ctx,cx+R*Math.cos(tipRad),cy+R*Math.sin(tipRad),6,'#f59e0b',0.9);
  }

  txt(ctx,'Hash Ring (0–360°)',cx,cy-6,{size:13,weight:'700',color:'#334155'});
  txt(ctx,'Keys walk clockwise to find server',cx,cy+12,{size:9,color:'#1e2535'});
}

// ============================================================
//  CH STEP 3 — Uneven distribution canvas
// ============================================================
let chUnevenMode='uneven', chUnevenT=0;

function chShowDistrib(mode){
  chUnevenMode=mode;
  const el=document.getElementById('chUnevenInfo');
  if(mode==='uneven'&&el){
    el.style.color='var(--red)';
    el.innerHTML='S1=10°, S2=20°, S3=90°: S1 owns 10%, S2 owns 10%, <strong style="color:var(--red)">S3 owns 80%!</strong> → S3 is a hotspot and will be overloaded.';
  } else if(el){
    el.style.color='var(--green)';
    el.innerHTML='With vnodes: S1-A/B/C, S2-A/B/C, S3-A/B/C spread evenly → each server owns ~33% → <strong style="color:var(--green)">no hotspots!</strong>';
  }
}

function initCHUnevenCanvas(mode){
  chUnevenMode=mode; chUnevenT=0;
  _raf('chUnevenCanvas',drawChUnevenFrame);
}

function drawChUnevenFrame(){
  const c=getCanvas('chUnevenCanvas'); if(!c)return;
  const {ctx,W,H}=c; chUnevenT+=0.015;
  ctx.clearRect(0,0,W,H);
  const cx=W*0.38, cy=H/2+5, R=Math.min(W*0.38,H)*0.4;

  let servers;
  if(chUnevenMode==='uneven'){
    servers=[
      {label:'S1',angle:10, color:'#6366f1', phys:'S1'},
      {label:'S2',angle:20, color:'#22c55e', phys:'S2'},
      {label:'S3',angle:90, color:'#ef4444', phys:'S3'},
    ];
  } else {
    servers=[
      {label:'S1-A',angle:10,  color:'#6366f1', phys:'S1'},
      {label:'S2-A',angle:40,  color:'#22c55e', phys:'S2'},
      {label:'S3-A',angle:70,  color:'#f59e0b', phys:'S3'},
      {label:'S1-B',angle:130, color:'#6366f1', phys:'S1'},
      {label:'S2-B',angle:200, color:'#22c55e', phys:'S2'},
      {label:'S3-B',angle:250, color:'#f59e0b', phys:'S3'},
      {label:'S1-C',angle:310, color:'#6366f1', phys:'S1'},
      {label:'S2-C',angle:335, color:'#22c55e', phys:'S2'},
      {label:'S3-C',angle:358, color:'#f59e0b', phys:'S3'},
    ];
  }
  const sorted=[...servers].sort((a,b)=>a.angle-b.angle);

  // arc fills
  sorted.forEach((s,i)=>{
    const next=sorted[(i+1)%sorted.length];
    let span=next.angle-s.angle; if(span<=0)span+=360;
    ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,R-1,(s.angle-90)*Math.PI/180,(s.angle+span-90)*Math.PI/180);
    ctx.closePath();ctx.fillStyle=s.color+'28';ctx.fill();
    // pct label inside arc
    const midA=s.angle+span/2, pct=Math.round(span/360*100);
    const lx=cx+(R*0.58)*Math.cos((midA-90)*Math.PI/180);
    const ly=cy+(R*0.58)*Math.sin((midA-90)*Math.PI/180);
    const isBig=pct>25;
    txt(ctx,pct+'%',lx,ly,{size:isBig?14:9,weight:'700',color:s.color+(chUnevenMode==='uneven'&&isBig?'':'cc')});
  });

  // ring glow
  ctx.save();
  if(chUnevenMode==='uneven'){ctx.shadowColor='#ef4444';ctx.shadowBlur=8;}
  ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);
  ctx.strokeStyle='#2a3347';ctx.lineWidth=2.5;ctx.stroke();ctx.restore();

  // nodes
  sorted.forEach(s=>{
    const rad=(s.angle-90)*Math.PI/180;
    const nx=cx+R*Math.cos(rad),ny=cy+R*Math.sin(rad);
    const isHot=chUnevenMode==='uneven'&&s.label==='S3';
    const nr=(chUnevenMode==='uneven'?18:11)*(isHot?1+Math.sin(chUnevenT*5)*0.1:1);
    ctx.save();if(isHot){ctx.shadowColor='#ef4444';ctx.shadowBlur=22;}
    ctx.beginPath();ctx.arc(nx,ny,nr,0,Math.PI*2);
    ctx.fillStyle=s.color+'55';ctx.strokeStyle=s.color;ctx.lineWidth=2;ctx.fill();ctx.stroke();ctx.restore();
    txt(ctx,s.label,nx,ny,{size:chUnevenMode==='uneven'?10:7,weight:'700',color:s.color});
    if(isHot){
      // flame effect
      for(let j=0;j<4;j++){
        const fa=chUnevenT*3+j*1.6;
        ctx.save();ctx.globalAlpha=0.5;
        ctx.beginPath();ctx.arc(nx+Math.cos(fa)*8,ny-nr-6-j*4,3-j*0.4,0,Math.PI*2);
        ctx.fillStyle='#f59e0b';ctx.fill();ctx.restore();
      }
    }
  });

  // ── right panel: ownership bars ──
  const bx=cx+R+24, bw=W-bx-12;
  if(chUnevenMode==='uneven'){
    const items=[{l:'S1',c:'#6366f1',pct:10},{l:'S2',c:'#22c55e',pct:10},{l:'S3',c:'#ef4444',pct:80}];
    txt(ctx,'Ring Ownership',bx+bw/2,cy-R*0.7,{size:10,color:'#475569',weight:'700'});
    items.forEach((it,i)=>{
      const by=cy-24+i*38;
      txt(ctx,it.l+' ('+it.pct+'%)',bx,by+6,{size:10,color:it.c,weight:'700',align:'left'});
      ctx.beginPath();ctx.roundRect(bx,by+14,bw,14,3);ctx.fillStyle='#0f1117';ctx.fill();
      ctx.save();if(it.pct>50){ctx.shadowColor=it.c;ctx.shadowBlur=8;}
      ctx.beginPath();ctx.roundRect(bx,by+14,Math.max(bw*it.pct/100,4),14,3);
      ctx.fillStyle=it.c+'88';ctx.fill();ctx.strokeStyle=it.c;ctx.lineWidth=1;ctx.stroke();ctx.restore();
    });
    txt(ctx,'⚠️ S3 overloaded!',bx+bw/2,cy+52,{size:10,color:'#ef4444',weight:'700'});
  } else {
    const items=[{l:'S1',c:'#6366f1',pct:33},{l:'S2',c:'#22c55e',pct:33},{l:'S3',c:'#f59e0b',pct:34}];
    txt(ctx,'Ring Ownership',bx+bw/2,cy-R*0.7,{size:10,color:'#475569',weight:'700'});
    items.forEach((it,i)=>{
      const by=cy-24+i*38;
      txt(ctx,it.l+' ('+it.pct+'%)',bx,by+6,{size:10,color:it.c,weight:'700',align:'left'});
      ctx.beginPath();ctx.roundRect(bx,by+14,bw,14,3);ctx.fillStyle='#0f1117';ctx.fill();
      ctx.save();ctx.shadowColor=it.c;ctx.shadowBlur=6;
      ctx.beginPath();ctx.roundRect(bx,by+14,Math.max(bw*it.pct/100,4),14,3);
      ctx.fillStyle=it.c+'88';ctx.fill();ctx.strokeStyle=it.c;ctx.lineWidth=1;ctx.stroke();ctx.restore();
    });
    txt(ctx,'✅ Balanced!',bx+bw/2,cy+52,{size:10,color:'var(--green)',weight:'700'});
  }
}

// ============================================================
//  CH STEP 4a — Physical → Virtual node mapping diagram
// ============================================================
function initCHVnodeMapCanvas(){
  let t=0;
  _raf('chVnodeMapCanvas',()=>{
    const c=getCanvas('chVnodeMapCanvas'); if(!c)return;
    const {ctx,W,H}=c; t+=0.02;
    ctx.clearRect(0,0,W,H);

    const physServers=[
      {label:'Physical S1', color:'#6366f1', ram:'16 GB', vnodes:['S1-A','S1-B','S1-C'], x:W*0.18},
      {label:'Physical S2', color:'#22c55e', ram:'16 GB', vnodes:['S2-A','S2-B','S2-C'], x:W*0.50},
      {label:'Physical S3', color:'#f59e0b', ram:'16 GB', vnodes:['S3-A','S3-B','S3-C'], x:W*0.82},
    ];

    // header
    txt(ctx,'3 Physical Servers',W/2,11,{size:10,color:'#334155',weight:'700'});
    txt(ctx,'9 Virtual Positions on the Ring',W/2,H-4,{size:9,color:'#334155'});

    physServers.forEach(p=>{
      // physical server box
      const pulse=1+Math.sin(t*1.5+p.x)*0.02;
      gBox(ctx,p.x-54,18,108*pulse,38*pulse,8,p.color+'22',p.color,2);
      txt(ctx,p.label,p.x,31,{size:10,weight:'700',color:p.color});
      txt(ctx,p.ram+' RAM',p.x,43,{size:8,color:p.color+'99'});

      // vnode boxes at bottom
      p.vnodes.forEach((v,i)=>{
        const vx=p.x+(i-1)*46, vy=H-30;
        gBox(ctx,vx-22,vy,44,24,6,p.color+'18',p.color+'88',1.5);
        txt(ctx,v,vx,vy+12,{size:9,weight:'600',color:p.color});

        // animated line from physical → vnode
        ctx.save();ctx.strokeStyle=p.color+'44';ctx.lineWidth=1.5;ctx.setLineDash([4,4]);
        ctx.lineDashOffset=-t*20;
        ctx.beginPath();ctx.moveTo(p.x,58);ctx.lineTo(vx,vy);ctx.stroke();ctx.restore();

        // moving particle on the line
        const progress=((t*0.6+i*0.35)%1);
        const px2=p.x+(vx-p.x)*progress;
        const py2=58+(vy-58)*progress;
        gDot(ctx,px2,py2,3,p.color,0.8);
      });

      // "= same machine" label
      txt(ctx,'= same machine',p.x,H/2+10,{size:8,color:p.color+'77'});
    });

    // "NOT extra servers" callout
    gBox(ctx,W/2-88,H/2-14,176,28,6,'rgba(239,68,68,0.08)','#ef444466',1);
    txt(ctx,'NOT 9 servers — still only 3!',W/2,H/2+1,{size:9,weight:'600',color:'#ef4444aa'});
  });
}

// ============================================================
//  CH STEP 4b — Full vnode ring with lookup toggle
// ============================================================
const CH_VNODES=[
  {label:'S1-A',angle:10,  phys:'S1',color:'#6366f1'},
  {label:'S2-A',angle:40,  phys:'S2',color:'#22c55e'},
  {label:'S3-A',angle:70,  phys:'S3',color:'#f59e0b'},
  {label:'S1-B',angle:130, phys:'S1',color:'#6366f1'},
  {label:'S2-B',angle:185, phys:'S2',color:'#22c55e'},
  {label:'S3-B',angle:245, phys:'S3',color:'#f59e0b'},
  {label:'S1-C',angle:300, phys:'S1',color:'#6366f1'},
  {label:'S2-C',angle:330, phys:'S2',color:'#22c55e'},
  {label:'S3-C',angle:356, phys:'S3',color:'#f59e0b'},
];
const CH_BASIC=[
  {label:'S1',angle:10, phys:'S1',color:'#6366f1'},
  {label:'S2',angle:45, phys:'S2',color:'#22c55e'},
  {label:'S3',angle:80, phys:'S3',color:'#f59e0b'},
];
let chVnodeT=0, chVnodeLookupAngle=null, chVnodeLookupName='', chVnodeLookupResult=null, chVnodeLookupProg=0;
let chVnodesEnabled=true;

function initCHVnodeRingCanvas(){
  chVnodeT=0; chVnodeLookupAngle=null; chVnodesEnabled=true;
  _raf('chVnodeRingCanvas',drawChVnodeRingFrame);
}

function chVnodeLookup(name,angle){
  chVnodeLookupName=name; chVnodeLookupAngle=angle; chVnodeLookupProg=0;
  const nodes=chVnodesEnabled?CH_VNODES:CH_BASIC;
  const sorted=[...nodes].sort((a,b)=>a.angle-b.angle);
  const vn=sorted.find(s=>s.angle>=angle)||sorted[0];
  chVnodeLookupResult=vn;
  const el=document.getElementById('chVnodeInfo');
  if(el){
    el.style.color='var(--cyan)';
    el.innerHTML=`hash("<strong>${name}</strong>") = <strong style="color:var(--yellow)">${angle}°</strong> → `+
      `walk clockwise → <strong style="color:${vn.color}">${vn.label}</strong> at ${vn.angle}° → `+
      `Physical server: <strong style="color:${vn.color}">${vn.phys}</strong>`;
  }
}

function chToggleVnodes(){
  chVnodesEnabled=!chVnodesEnabled;
  chVnodeLookupAngle=null; chVnodeLookupResult=null;
  const el=document.getElementById('chVnodeInfo');
  if(el){
    el.style.color=chVnodesEnabled?'var(--green)':'var(--yellow)';
    el.textContent=chVnodesEnabled
      ?'✅ Virtual nodes ON — 9 positions, each server owns ~33%'
      :'⚠️ Virtual nodes OFF — 3 positions, distribution may be uneven';
  }
}

function drawChVnodeRingFrame(){
  const c=getCanvas('chVnodeRingCanvas'); if(!c)return;
  const {ctx,W,H}=c; chVnodeT+=0.016;
  ctx.clearRect(0,0,W,H);

  const cx=W*0.42, cy=H/2+8, R=Math.min(W*0.42,H)*0.36;
  const nodes=chVnodesEnabled?CH_VNODES:CH_BASIC;
  const sorted=[...nodes].sort((a,b)=>a.angle-b.angle);

  // arc ownership zones
  sorted.forEach((n,i)=>{
    const next=sorted[(i+1)%sorted.length];
    let span=next.angle-n.angle; if(span<=0)span+=360;
    ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,R-1,(n.angle-90)*Math.PI/180,(n.angle+span-90)*Math.PI/180);
    ctx.closePath();ctx.fillStyle=n.color+'1c';ctx.fill();
    // mini pct label
    if(chVnodesEnabled){
      const pct=Math.round(span/360*100);
      const mid=n.angle+span/2;
      if(pct>3) txt(ctx,pct+'%',cx+(R*0.62)*Math.cos((mid-90)*Math.PI/180),cy+(R*0.62)*Math.sin((mid-90)*Math.PI/180),{size:8,color:n.color+'99'});
    }
  });

  // ring
  ctx.save();ctx.shadowColor=chVnodesEnabled?'#6366f1':'#334155';ctx.shadowBlur=10;
  ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);
  ctx.strokeStyle='#2a3347';ctx.lineWidth=3;ctx.stroke();ctx.restore();

  // ticks
  for(let a=0;a<360;a+=15){
    const rad=(a-90)*Math.PI/180, len=a%90===0?10:a%45===0?6:3;
    ctx.beginPath();ctx.moveTo(cx+(R-len)*Math.cos(rad),cy+(R-len)*Math.sin(rad));
    ctx.lineTo(cx+R*Math.cos(rad),cy+R*Math.sin(rad));
    ctx.strokeStyle=a%90===0?'#334155':'#1e2535';ctx.lineWidth=1;ctx.stroke();
  }

  // nodes on ring
  nodes.forEach(n=>{
    const rad=(n.angle-90)*Math.PI/180;
    const nx=cx+R*Math.cos(rad), ny=cy+R*Math.sin(rad);
    const isResult=chVnodeLookupResult?.label===n.label&&chVnodeLookupAngle!==null;
    const pulse=isResult?1+Math.sin(chVnodeT*5)*0.12:1+Math.sin(chVnodeT+n.angle)*0.03;
    const nr=(chVnodesEnabled?13:20)*pulse;
    ctx.save();if(isResult){ctx.shadowColor=n.color;ctx.shadowBlur=24;}
    ctx.beginPath();ctx.arc(nx,ny,nr,0,Math.PI*2);
    ctx.fillStyle=n.color+(isResult?'55':'33');ctx.strokeStyle=n.color;ctx.lineWidth=isResult?2.5:1.5;
    ctx.fill();ctx.stroke();ctx.restore();
    txt(ctx,n.label,nx,ny,{size:chVnodesEnabled?7:10,weight:'700',color:n.color});
    txt(ctx,n.angle+'°',cx+(R+18)*Math.cos(rad),cy+(R+18)*Math.sin(rad),{size:7,color:n.color+'88'});
  });

  // lookup sweep animation
  if(chVnodeLookupAngle!==null&&chVnodeLookupResult){
    chVnodeLookupProg=Math.min(chVnodeLookupProg+0.022,1);
    const krad=(chVnodeLookupAngle-90)*Math.PI/180;
    const kx=cx+R*Math.cos(krad), ky=cy+R*Math.sin(krad);
    ctx.save();ctx.shadowColor='#f59e0b';ctx.shadowBlur=20;
    ctx.beginPath();ctx.arc(kx,ky,11+Math.sin(chVnodeT*5)*2,0,Math.PI*2);
    ctx.fillStyle='#f59e0b';ctx.fill();ctx.restore();
    txt(ctx,'"'+chVnodeLookupName+'"',cx+(R+34)*Math.cos(krad),cy+(R+34)*Math.sin(krad),{size:9,color:'#f59e0b',weight:'700'});
    txt(ctx,chVnodeLookupAngle+'°',kx,ky+22,{size:8,color:'#f59e0b'});
    const srvAngle=chVnodeLookupResult.angle;
    let sweep=srvAngle-chVnodeLookupAngle; if(sweep<0)sweep+=360;
    ctx.save();ctx.strokeStyle='#f59e0bcc';ctx.lineWidth=3;ctx.setLineDash([7,5]);
    ctx.lineDashOffset=-chVnodeT*25;
    ctx.beginPath();ctx.arc(cx,cy,R,(chVnodeLookupAngle-90)*Math.PI/180,(chVnodeLookupAngle+sweep*chVnodeLookupProg-90)*Math.PI/180);
    ctx.stroke();ctx.restore();
    gDot(ctx,cx+R*Math.cos((chVnodeLookupAngle+sweep*chVnodeLookupProg-90)*Math.PI/180),cy+R*Math.sin((chVnodeLookupAngle+sweep*chVnodeLookupProg-90)*Math.PI/180),6,'#f59e0b',0.9);
  }

  // center label
  txt(ctx,chVnodesEnabled?'VNode Ring':'Basic Ring',cx,cy-6,{size:12,weight:'700',color:'#334155'});
  txt(ctx,nodes.length+' positions',cx,cy+11,{size:9,color:'#1e2535'});

  // ── right legend: physical → owned vnodes ──
  const lx=cx+R+20, lw=W-lx-8;
  txt(ctx,'Physical → Vnodes',lx+lw/2,cy-R*0.55,{size:9,color:'#334155',weight:'700'});
  [{p:'S1',c:'#6366f1',v:chVnodesEnabled?'S1-A, S1-B, S1-C':'S1'},{p:'S2',c:'#22c55e',v:chVnodesEnabled?'S2-A, S2-B, S2-C':'S2'},{p:'S3',c:'#f59e0b',v:chVnodesEnabled?'S3-A, S3-B, S3-C':'S3'}].forEach((row,i)=>{
    const ry=cy-22+i*36;
    gBox(ctx,lx,ry,lw,30,6,row.c+'15',row.c+'88',1.5);
    txt(ctx,row.p,lx+18,ry+15,{size:10,weight:'800',color:row.c});
    txt(ctx,row.v,lx+24,ry+15,{size:8,color:row.c+'cc',align:'left'});
    // ownership bar
    const pct=chVnodesEnabled?33:Math.round([40,20,40][i]);
    const bx2=lx, by2=ry+30, bh2=5;
    ctx.beginPath();ctx.roundRect(bx2,by2,lw,bh2,2);ctx.fillStyle='#0f1117';ctx.fill();
    ctx.beginPath();ctx.roundRect(bx2,by2,lw*pct/100,bh2,2);ctx.fillStyle=row.c+'99';ctx.fill();
    txt(ctx,pct+'%',lx+lw+4,by2+3,{size:7,color:row.c,align:'left'});
  });
}

// ============================================================
//  CH STEP 5 — Add/Remove server interactive ring (uses existing chCanvas)
//  (initCHCanvas / drawCHFrame already defined in app.js — no changes needed)
// ============================================================

// ============================================================
//  CH STEP 6 — Weighted vnode distribution
// ============================================================
let chWeightMode='equal', chWeightT=0;

function chWeightDemo(mode){
  chWeightMode=mode;
  const el=document.getElementById('chWeightInfo');
  if(mode==='equal'&&el){
    el.style.color='var(--text2)';
    el.innerHTML='Equal capacity: S1 (16 GB) = S2 (16 GB) = S3 (16 GB) → 3 vnodes each → each handles <strong>~33%</strong> of keys.';
  } else if(el){
    el.style.color='var(--green)';
    el.innerHTML='S3 has 32 GB (2× capacity) → gets 6 vnodes → handles <strong style="color:var(--yellow)">~50%</strong> of keys. S1 & S2 handle ~25% each.';
  }
}

function initCHWeightCanvas(mode){
  chWeightMode=mode; chWeightT=0;
  _raf('chWeightCanvas',drawChWeightFrame);
}

function drawChWeightFrame(){
  const c=getCanvas('chWeightCanvas'); if(!c)return;
  const {ctx,W,H}=c; chWeightT+=0.016;
  ctx.clearRect(0,0,W,H);
  const cx=W*0.38, cy=H/2+5, R=Math.min(W*0.38,H)*0.38;

  const equalNodes=[
    {label:'S1-A',angle:10, phys:'S1',color:'#6366f1'},{label:'S1-B',angle:130,phys:'S1',color:'#6366f1'},{label:'S1-C',angle:250,phys:'S1',color:'#6366f1'},
    {label:'S2-A',angle:50, phys:'S2',color:'#22c55e'},{label:'S2-B',angle:170,phys:'S2',color:'#22c55e'},{label:'S2-C',angle:290,phys:'S2',color:'#22c55e'},
    {label:'S3-A',angle:90, phys:'S3',color:'#f59e0b'},{label:'S3-B',angle:210,phys:'S3',color:'#f59e0b'},{label:'S3-C',angle:330,phys:'S3',color:'#f59e0b'},
  ];
  const weightedNodes=[
    {label:'S1-A',angle:10, phys:'S1',color:'#6366f1'},{label:'S1-B',angle:175,phys:'S1',color:'#6366f1'},{label:'S1-C',angle:325,phys:'S1',color:'#6366f1'},
    {label:'S2-A',angle:90, phys:'S2',color:'#22c55e'},{label:'S2-B',angle:255,phys:'S2',color:'#22c55e'},
    {label:'S3-A',angle:38, phys:'S3',color:'#f59e0b'},{label:'S3-B',angle:128,phys:'S3',color:'#f59e0b'},
    {label:'S3-C',angle:210,phys:'S3',color:'#f59e0b'},{label:'S3-D',angle:285,phys:'S3',color:'#f59e0b'},{label:'S3-E',angle:355,phys:'S3',color:'#f59e0b'},
  ];
  const nodes=chWeightMode==='equal'?equalNodes:weightedNodes;
  const sorted=[...nodes].sort((a,b)=>a.angle-b.angle);

  // arc fills
  sorted.forEach((n,i)=>{
    const next=sorted[(i+1)%sorted.length];
    let span=next.angle-n.angle; if(span<=0)span+=360;
    ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,R-1,(n.angle-90)*Math.PI/180,(n.angle+span-90)*Math.PI/180);
    ctx.closePath();ctx.fillStyle=n.color+'22';ctx.fill();
  });

  // ring
  ctx.save();ctx.shadowColor='#334155';ctx.shadowBlur=6;
  ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);
  ctx.strokeStyle='#2a3347';ctx.lineWidth=2.5;ctx.stroke();ctx.restore();

  // nodes
  nodes.forEach(n=>{
    const rad=(n.angle-90)*Math.PI/180;
    const nx=cx+R*Math.cos(rad), ny=cy+R*Math.sin(rad);
    const isS3heavy=n.phys==='S3'&&chWeightMode==='weighted';
    const pulse=isS3heavy?1+Math.sin(chWeightT*2+n.angle)*0.06:1;
    const nr=(isS3heavy?15:11)*pulse;
    ctx.save();if(isS3heavy){ctx.shadowColor=n.color;ctx.shadowBlur=16;}
    ctx.beginPath();ctx.arc(nx,ny,nr,0,Math.PI*2);
    ctx.fillStyle=n.color+'44';ctx.strokeStyle=n.color;ctx.lineWidth=1.5;ctx.fill();ctx.stroke();ctx.restore();
    txt(ctx,n.label,nx,ny,{size:7,weight:'700',color:n.color});
  });

  // center info
  txt(ctx,chWeightMode==='equal'?'Equal Weights':'Weighted',cx,cy-6,{size:11,weight:'700',color:'#334155'});
  txt(ctx,nodes.length+' total vnodes',cx,cy+11,{size:9,color:'#1e2535'});

  // ── right panel: capacity cards + bar ──
  const bx=cx+R+22, bw=W-bx-10;
  txt(ctx,'Server Capacity',bx+bw/2,cy-R*0.65,{size:9,color:'#334155',weight:'700'});

  const servers=chWeightMode==='equal'
    ?[{p:'S1',c:'#6366f1',ram:'16 GB',vnodes:3,pct:33},{p:'S2',c:'#22c55e',ram:'16 GB',vnodes:3,pct:33},{p:'S3',c:'#f59e0b',ram:'16 GB',vnodes:3,pct:34}]
    :[{p:'S1',c:'#6366f1',ram:'16 GB',vnodes:3,pct:25},{p:'S2',c:'#22c55e',ram:'16 GB',vnodes:2,pct:25},{p:'S3',c:'#f59e0b',ram:'32 GB (2×)',vnodes:5,pct:50}];

  servers.forEach((s,i)=>{
    const sy=cy-32+i*42;
    gBox(ctx,bx,sy,bw,36,7,s.c+'15',s.c+'66',1.5);
    txt(ctx,s.p,bx+14,sy+12,{size:10,weight:'800',color:s.c});
    txt(ctx,s.ram,bx+14,sy+26,{size:8,color:s.c+'99',align:'left'});
    txt(ctx,s.vnodes+' vnodes',bx+bw-8,sy+12,{size:8,color:s.c,weight:'600',align:'right'});
    // load bar
    ctx.beginPath();ctx.roundRect(bx+2,sy+30,bw-4,5,2);ctx.fillStyle='#0f1117';ctx.fill();
    const isHeavy=chWeightMode==='weighted'&&s.p==='S3';
    ctx.save();if(isHeavy){ctx.shadowColor=s.c;ctx.shadowBlur=8;}
    ctx.beginPath();ctx.roundRect(bx+2,sy+30,(bw-4)*s.pct/100,5,2);ctx.fillStyle=s.c+'99';ctx.fill();
    ctx.strokeStyle=s.c;ctx.lineWidth=0.5;ctx.stroke();ctx.restore();
    txt(ctx,s.pct+'%',bx+bw-6,sy+24,{size:8,color:s.c,weight:'700',align:'right'});
  });

  // caption
  const cap=chWeightMode==='equal'?'Equal vnodes → equal load':'More vnodes → more load proportional to capacity';
  txt(ctx,cap,bx+bw/2,cy+R*0.6,{size:8,color:'#475569'});
}


// ============================================================
//  CH STEP 7 — Data Sharding + Consistent Hashing live demo
//  Phases:
//   0  FILL   – records stream in, fill shards on A/B/C
//   1  FULL   – all three servers at capacity, warning pulses
//   2  JOIN   – Server D's vnodes appear on the ring
//   3  MIGRATE– affected records animate from old server to D
//   4  DONE   – balanced state, all servers at ~75%
// ============================================================

// ── vnode layout ────────────────────────────────────────────
// 3 vnodes per server, spread ~120° apart
const CHS_VNODES = [
  // Server A  (indigo)
  { angle:20,  phys:'A', color:'#6366f1', label:'A-1' },
  { angle:140, phys:'A', color:'#6366f1', label:'A-2' },
  { angle:260, phys:'A', color:'#6366f1', label:'A-3' },
  // Server B  (green)
  { angle:60,  phys:'B', color:'#22c55e', label:'B-1' },
  { angle:180, phys:'B', color:'#22c55e', label:'B-2' },
  { angle:300, phys:'B', color:'#22c55e', label:'B-3' },
  // Server C  (amber)
  { angle:100, phys:'C', color:'#f59e0b', label:'C-1' },
  { angle:220, phys:'C', color:'#f59e0b', label:'C-2' },
  { angle:340, phys:'C', color:'#f59e0b', label:'C-3' },
];

// Server D vnodes — inserted between existing ones
const CHS_D_VNODES = [
  { angle:40,  phys:'D', color:'#ec4899', label:'D-1' },
  { angle:160, phys:'D', color:'#ec4899', label:'D-2' },
  { angle:280, phys:'D', color:'#ec4899', label:'D-3' },
];

const CHS_SERVERS = {
  A: { color:'#6366f1', fill:0, max:1, records:[] },
  B: { color:'#22c55e', fill:0, max:1, records:[] },
  C: { color:'#f59e0b', fill:0, max:1, records:[] },
  D: { color:'#ec4899', fill:0, max:1, records:[] },
};

// Record pool – each has angle on ring, owning server, migration state
let chsRecords = [];
let chsPhase = 0;       // 0=fill 1=full 2=join 3=migrate 4=done
let chsT = 0;
let chsPlaying = true;
let chsMigPackets = []; // { rec, fromSrv, toSrv, t, trail }
let chsDJoined = false;
let chsFullTimer = 0;
let chsSpawnTimer = 0;
let chsInfoSet = false;

// helpers
function chsGetOwner(angle, includeD) {
  const pool = includeD ? [...CHS_VNODES, ...CHS_D_VNODES] : CHS_VNODES;
  const sorted = [...pool].sort((a,b)=>a.angle-b.angle);
  const node = sorted.find(n=>n.angle>=angle) || sorted[0];
  return node.phys;
}

function chsServerFill(srv) {
  return CHS_SERVERS[srv].records.length / 28; // 28 = visual cap
}

function chsReset() {
  chsPhase=0; chsT=0; chsPlaying=true;
  chsMigPackets=[]; chsDJoined=false; chsFullTimer=0; chsSpawnTimer=0; chsInfoSet=false;
  Object.keys(CHS_SERVERS).forEach(k=>{CHS_SERVERS[k].fill=0; CHS_SERVERS[k].records=[];});
  chsRecords=[];
  const el=document.getElementById('chShardInfo');
  if(el) el.textContent='▶ Watching records stream in and fill Server A, B, and C…';
  document.querySelectorAll('#chShardPlayBtn,#chShardPauseBtn').forEach((b,i)=>{
    b.classList.toggle('active', i===0);
  });
}

function chsSkipToFull() {
  chsReset();
  // pre-fill all three servers to capacity
  for(let i=0;i<28;i++){
    ['A','B','C'].forEach(srv=>{
      const angle=Math.floor(Math.random()*360);
      chsRecords.push({angle,srv,id:chsRecords.length,mig:false,alpha:1});
      CHS_SERVERS[srv].records.push(chsRecords[chsRecords.length-1]);
    });
  }
  chsPhase=1; chsFullTimer=60; chsPlaying=true;
}

function chShardControl(cmd) {
  if(cmd==='play')  { chsPlaying=true;  document.getElementById('chShardPlayBtn')?.classList.add('active'); document.getElementById('chShardPauseBtn')?.classList.remove('active'); }
  if(cmd==='pause') { chsPlaying=false; document.getElementById('chShardPauseBtn')?.classList.add('active'); document.getElementById('chShardPlayBtn')?.classList.remove('active'); }
  if(cmd==='reset') { _stopRaf('chShardCanvas'); chsReset(); _raf('chShardCanvas', drawCHShardFrame); }
  if(cmd==='skip')  { chsSkipToFull(); }
}

function initCHShardCanvas() {
  chsReset();
  _raf('chShardCanvas', drawCHShardFrame);
}

function drawCHShardFrame() {
  const c = getCanvas('chShardCanvas'); if(!c) return;
  const {ctx,W,H} = c;
  if(chsPlaying) chsT++;
  ctx.clearRect(0,0,W,H);

  // ── layout constants ──────────────────────────────────────
  const ringCX = W*0.38, ringCY = H*0.44, R = Math.min(W*0.34, H*0.38);
  const panelX  = ringCX + R + 28;
  const panelW  = W - panelX - 12;

  // ── PHASE LOGIC ───────────────────────────────────────────
  if(chsPlaying) {
    if(chsPhase===0) {
      // spawn a record every ~18 frames
      chsSpawnTimer++;
      if(chsSpawnTimer % 18 === 0) {
        const angle = Math.floor(Math.random()*360);
        const srv   = chsGetOwner(angle, false);
        if(CHS_SERVERS[srv].records.length < 28) {
          const rec = {angle, srv, id:chsRecords.length, mig:false, alpha:0, targetAlpha:1};
          chsRecords.push(rec);
          CHS_SERVERS[srv].records.push(rec);
        }
      }
      // fade in new records
      chsRecords.forEach(r=>{ if(r.alpha<1) r.alpha=Math.min(r.alpha+0.08,1); });
      // check if all full
      const allFull = ['A','B','C'].every(s=>CHS_SERVERS[s].records.length>=26);
      if(allFull) { chsPhase=1; chsFullTimer=0; }
    }

    if(chsPhase===1) {
      chsFullTimer++;
      if(!chsInfoSet) {
        chsInfoSet=true;
        const el=document.getElementById('chShardInfo');
        if(el){ el.style.color='var(--red)'; el.innerHTML='🔴 <strong>Servers A, B and C are full!</strong> No more records can be written. We need to add capacity…'; }
      }
      if(chsFullTimer>90) { chsPhase=2; chsInfoSet=false; }
    }

    if(chsPhase===2 && !chsDJoined) {
      chsDJoined=true; chsInfoSet=false;
      const el=document.getElementById('chShardInfo');
      if(el){ el.style.color='var(--pink)'; el.innerHTML='🆕 <strong>Server D joins the ring</strong> with 3 vnodes at positions 40°, 160°, 280° — carving new arcs from A, B and C.'; }
    }

    if(chsPhase===2 && chsDJoined) {
      chsFullTimer++;
      if(chsFullTimer>150 && chsMigPackets.length===0) {
        // identify records that now belong to D
        const toMigrate = chsRecords.filter(r=>{
          return !r.mig && chsGetOwner(r.angle,true)==='D';
        });
        toMigrate.forEach(r=>{
          r.mig=true;
          chsMigPackets.push({rec:r, fromSrv:r.srv, toSrv:'D', t:0, trail:[]});
        });
        chsPhase=3; chsInfoSet=false;
        const el=document.getElementById('chShardInfo');
        if(el){ el.style.color='var(--cyan)'; el.innerHTML=`📦 <strong>Migrating ${toMigrate.length} records</strong> from A, B, C → D (only those in D's new arcs). The rest stay put.`; }
      }
    }

    if(chsPhase===3) {
      // advance migration packets
      chsMigPackets.forEach(p=>{ p.t=Math.min(p.t+0.022,1); });
      if(chsMigPackets.every(p=>p.t>=1)) {
        // finalise: move records to D
        chsMigPackets.forEach(p=>{
          const srv=p.rec.srv;
          CHS_SERVERS[srv].records=CHS_SERVERS[srv].records.filter(r=>r!==p.rec);
          p.rec.srv='D';
          CHS_SERVERS['D'].records.push(p.rec);
        });
        chsMigPackets=[];
        chsPhase=4; chsInfoSet=false;
        const el=document.getElementById('chShardInfo');
        if(el){ el.style.color='var(--green)'; el.innerHTML='✅ <strong>Rebalancing complete!</strong> Server D now holds its share. A, B, C are back under capacity — achieved with minimal data movement.'; }
      }
    }
  }

  // ── DRAW RING ─────────────────────────────────────────────
  const allVnodes = chsDJoined ? [...CHS_VNODES,...CHS_D_VNODES] : CHS_VNODES;
  const sorted    = [...allVnodes].sort((a,b)=>a.angle-b.angle);

  // arc ownership fills
  sorted.forEach((n,i)=>{
    const next=sorted[(i+1)%sorted.length];
    let span=next.angle-n.angle; if(span<=0)span+=360;
    ctx.beginPath(); ctx.moveTo(ringCX,ringCY);
    ctx.arc(ringCX,ringCY,R-2,(n.angle-90)*Math.PI/180,(n.angle+span-90)*Math.PI/180);
    ctx.closePath();
    const alpha = (chsPhase>=2&&n.phys==='D') ? 0.28 : 0.14;
    ctx.fillStyle=n.color+Math.round(alpha*255).toString(16).padStart(2,'0');
    ctx.fill();
  });

  // ring stroke
  ctx.save();
  ctx.shadowColor=chsPhase>=2?'#ec4899':'#6366f1'; ctx.shadowBlur=10;
  ctx.beginPath(); ctx.arc(ringCX,ringCY,R,0,Math.PI*2);
  ctx.strokeStyle='#2a3347'; ctx.lineWidth=3; ctx.stroke(); ctx.restore();

  // degree ticks
  for(let a=0;a<360;a+=30){
    const rad=(a-90)*Math.PI/180, len=a%90===0?10:5;
    ctx.beginPath(); ctx.moveTo(ringCX+(R-len)*Math.cos(rad),ringCY+(R-len)*Math.sin(rad));
    ctx.lineTo(ringCX+R*Math.cos(rad),ringCY+R*Math.sin(rad));
    ctx.strokeStyle=a%90===0?'#334155':'#1e2535'; ctx.lineWidth=1; ctx.stroke();
  }
  [0,90,180,270].forEach(a=>{
    const rad=(a-90)*Math.PI/180;
    txt(ctx,a+'°',ringCX+(R+15)*Math.cos(rad),ringCY+(R+15)*Math.sin(rad),{size:8,color:'#2a3347'});
  });

  // ── draw records as tiny dots on ring ──
  chsRecords.forEach(r=>{
    if(r.mig&&chsPhase===3) return; // drawn as migrating packet instead
    const rad=(r.angle-90)*Math.PI/180;
    const dist = R - 14;
    const rx=ringCX+dist*Math.cos(rad), ry=ringCY+dist*Math.sin(rad);
    const col=CHS_SERVERS[r.srv]?.color||'#94a3b8';
    ctx.save(); ctx.globalAlpha=r.alpha||1;
    ctx.beginPath(); ctx.arc(rx,ry,3.5,0,Math.PI*2);
    ctx.fillStyle=col+'cc'; ctx.fill();
    ctx.restore();
  });

  // ── vnodes on ring ──
  CHS_VNODES.forEach(n=>{
    const rad=(n.angle-90)*Math.PI/180;
    const nx=ringCX+R*Math.cos(rad), ny=ringCY+R*Math.sin(rad);
    const fill=chsServerFill(n.phys);
    const pulse = chsPhase===1 ? 1+Math.sin(chsT*0.18)*0.1 : 1+Math.sin(chsT*0.06+n.angle)*0.04;
    const nr=14*pulse;
    ctx.save(); ctx.shadowColor=n.color; ctx.shadowBlur=chsPhase===1?20:12;
    ctx.beginPath(); ctx.arc(nx,ny,nr,0,Math.PI*2);
    ctx.fillStyle=n.color+(chsPhase===1?'66':'33'); ctx.strokeStyle=n.color; ctx.lineWidth=2;
    ctx.fill(); ctx.stroke(); ctx.restore();
    txt(ctx,n.label,nx,ny,{size:7,weight:'800',color:n.color});
  });

  // D vnodes (appear in phase 2+)
  if(chsDJoined) {
    CHS_D_VNODES.forEach((n,i)=>{
      const rad=(n.angle-90)*Math.PI/180;
      const nx=ringCX+R*Math.cos(rad), ny=ringCY+R*Math.sin(rad);
      const appear = Math.min((chsT - (chsPhase>=2?0:9999))*0.04 + i*(-0.2), 1);
      const nr=14*(1+Math.sin(chsT*0.1+i)*0.06);
      ctx.save(); ctx.shadowColor=n.color; ctx.shadowBlur=22; ctx.globalAlpha=Math.max(appear,0.1);
      ctx.beginPath(); ctx.arc(nx,ny,nr,0,Math.PI*2);
      ctx.fillStyle=n.color+'55'; ctx.strokeStyle=n.color; ctx.lineWidth=2.5;
      ctx.fill(); ctx.stroke(); ctx.restore();
      txt(ctx,n.label,nx,ny,{size:7,weight:'800',color:n.color});
    });
  }

  // ── migration packets ──
  chsMigPackets.forEach(p=>{
    const fromRad=(p.rec.angle-90)*Math.PI/180;
    const x1=ringCX+(R-14)*Math.cos(fromRad), y1=ringCY+(R-14)*Math.sin(fromRad);
    // find D vnode that owns this record
    const dOwner=CHS_D_VNODES.reduce((best,n)=>{
      const sorted2=[...CHS_VNODES,...CHS_D_VNODES].sort((a,b)=>a.angle-b.angle);
      const owner=sorted2.find(v=>v.angle>=p.rec.angle)||sorted2[0];
      return owner;
    }, CHS_D_VNODES[0]);
    const dRad=(dOwner.angle-90)*Math.PI/180;
    const x2=ringCX+R*Math.cos(dRad), y2=ringCY+R*Math.sin(dRad);
    const et=ease(p.t);
    const mx=lerp(x1,x2,et) + Math.sin(p.t*Math.PI)*18*(Math.random()>0.5?1:-1)*0.3;
    const my=lerp(y1,y2,et) - Math.sin(p.t*Math.PI)*18;
    if(!p.trail) p.trail=[];
    p.trail.push({x:mx,y:my}); if(p.trail.length>10) p.trail.shift();
    gDot(ctx,mx,my,4,'#ec4899',0.9,p.trail);
  });

  // ── RIGHT PANEL: server shard bars ──
  drawCHShardPanel(ctx, panelX, panelW, ringCY, R);

  // center label
  txt(ctx,'Hash Ring',ringCX,ringCY-8,{size:12,weight:'700',color:'#334155'});
  txt(ctx,chsDJoined?'4 servers · vnodes':'3 servers · vnodes',ringCX,ringCY+10,{size:9,color:'#1e2535'});
}

function drawCHShardPanel(ctx, px, pw, ringCY, R) {
  const servers = chsDJoined
    ? [{k:'A',label:'Server A',sub:'16 GB'},{k:'B',label:'Server B',sub:'16 GB'},{k:'C',label:'Server C',sub:'16 GB'},{k:'D',label:'Server D',sub:'16 GB (new)'}]
    : [{k:'A',label:'Server A',sub:'16 GB'},{k:'B',label:'Server B',sub:'16 GB'},{k:'C',label:'Server C',sub:'16 GB'}];

  const cardH = 72, gap = 14;
  const totalH = servers.length*(cardH+gap) - gap;
  const startY = ringCY - totalH/2;

  txt(ctx,'Shard Status',px+pw/2,startY-18,{size:10,color:'#475569',weight:'700'});

  servers.forEach((s,i)=>{
    const srv=CHS_SERVERS[s.k];
    const col=srv.color;
    const fill=srv.records.length/28;
    const isNew=s.k==='D'&&chsDJoined;
    const isFull=chsPhase===1&&s.k!=='D';
    const y=startY+i*(cardH+gap);

    // card bg
    ctx.save();
    if(isNew){ctx.shadowColor=col;ctx.shadowBlur=16;}
    if(isFull){ctx.shadowColor='#ef4444';ctx.shadowBlur=12+Math.sin(chsT*0.2)*8;}
    ctx.beginPath(); ctx.roundRect(px,y,pw,cardH,8);
    ctx.fillStyle=col+(isFull?'22':isNew?'1a':'14');
    ctx.fill(); ctx.strokeStyle=col+(isFull?'':isNew?'':'88'); ctx.lineWidth=isFull?2:isNew?2.5:1.5;
    ctx.stroke(); ctx.restore();

    // server emoji + name
    const emoji=['🟣','🟢','🟡','🩷'][['A','B','C','D'].indexOf(s.k)];
    txt(ctx,emoji+' '+s.label,px+12,y+16,{size:11,weight:'700',color:col,align:'left'});
    txt(ctx,s.sub,px+pw-8,y+16,{size:8,color:col+'99',align:'right'});

    // fill bar bg
    ctx.beginPath(); ctx.roundRect(px+8,y+28,pw-16,12,4);
    ctx.fillStyle='#0f1117'; ctx.fill();

    // fill bar fg
    const barW=Math.max((pw-16)*Math.min(fill,1),0);
    const barCol=fill>0.9?'#ef4444':fill>0.65?'#f59e0b':col;
    ctx.save(); ctx.shadowColor=barCol; ctx.shadowBlur=isFull?10:4;
    ctx.beginPath(); ctx.roundRect(px+8,y+28,barW,12,4);
    ctx.fillStyle=barCol+'cc'; ctx.fill(); ctx.restore();

    // pct label inside bar
    const pct=Math.round(fill*100);
    txt(ctx,pct+'%',px+8+barW/2,y+34,{size:9,weight:'700',color:'#fff'});

    // record count + capacity note
    const recCount=srv.records.length;
    const capNote=isFull?'🔴 FULL':isNew?'🆕 Accepting':'';
    txt(ctx,`${recCount} records`,px+12,y+50,{size:9,color:col+'cc',align:'left'});
    if(capNote) txt(ctx,capNote,px+pw-8,y+50,{size:9,color:isFull?'#ef4444':'#22c55e',weight:'700',align:'right'});

    // D gets a "vnodes" badge
    if(isNew) {
      txt(ctx,'3 vnodes @ 40°, 160°, 280°',px+pw/2,y+60,{size:8,color:'#ec4899',weight:'600'});
    }

    // vnode ownership badges for A/B/C
    if(s.k!=='D') {
      const ownVnodes=CHS_VNODES.filter(v=>v.phys===s.k).map(v=>v.angle+'°').join('  ');
      txt(ctx,ownVnodes,px+pw/2,y+60,{size:8,color:col+'99'});
    }
  });

  // phase legend at bottom
  const legendY = startY + servers.length*(cardH+gap) + 8;
  const phases=['● Fill','● Full','● D Joins','● Migrate','● Done'];
  const pCols=['#6366f1','#ef4444','#ec4899','#f59e0b','#22c55e'];
  txt(ctx,'Phase:',px,legendY+8,{size:9,color:'#334155',align:'left'});
  phases.forEach((p,i)=>{
    const active=i===chsPhase;
    ctx.save();
    if(active){ctx.shadowColor=pCols[i];ctx.shadowBlur=10;}
    txt(ctx,p,px+46+i*48,legendY+8,{size:active?10:8,color:active?pCols[i]:'#334155',weight:active?'700':'500'});
    ctx.restore();
  });
}
