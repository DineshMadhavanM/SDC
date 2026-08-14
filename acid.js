/* ============================================================
   ACID.JS  —  Interactive ACID transaction visualizer
   PLAYKERS cricket slot booking + payment example
   ============================================================ */

// ── Shared palette ───────────────────────────────────────────
const AC = {
  bg:      '#0f1117', bg2: '#161b27', bg3: '#1e2535',
  border:  '#2a3347',
  accent:  '#6366f1', accent2: '#818cf8',
  green:   '#22c55e', yellow: '#f59e0b',
  red:     '#ef4444', cyan:   '#06b6d4',
  pink:    '#ec4899', blue:   '#3b82f6',
  text:    '#e2e8f0', text2: '#94a3b8', text3: '#64748b',
};

// ── State machine for each scenario ─────────────────────────
let acidScenario = 0;   // 0=atomicity 1=consistency 2=isolation 3=durability
let acidStep     = 0;
let acidRunning  = false;
let acidTimer    = null;

// Shared DB state (reset per scenario)
const ACID_DB = {
  slots:    1,    // available slots
  balance:  500,  // User A wallet balance (₹)
  balanceB: 500,  // User B wallet balance
  bookings: [],   // [{user, slot, status}]
  walLog:   [],   // WAL entries
  crashed:  false,
};

function acidResetDB() {
  ACID_DB.slots    = 1;
  ACID_DB.balance  = 500;
  ACID_DB.balanceB = 500;
  ACID_DB.bookings = [];
  ACID_DB.walLog   = [];
  ACID_DB.crashed  = false;
}

// ── Scenario step definitions ────────────────────────────────
// Each step: { label, code, actor, from, to, state, detail, dbPatch }
const ACID_SCENARIOS = {

  // ── ATOMICITY ───────────────────────────────────────────────
  atomicity: {
    title: 'Atomicity',
    icon: '⚛️',
    color: AC.accent,
    tagline: 'All operations succeed — or ALL are rolled back.',
    problem: 'Without atomicity: payment deducted ✅  but booking creation fails ❌  → money gone, no slot!',
    steps: [
      { label:'BEGIN',    actor:'txn',   from:'user',    to:'txnCtrl',  state:'begin',   code:'BEGIN TRANSACTION',                          detail:'Transaction controller opens a new transaction. All ops are atomic.' },
      { label:'READ',     actor:'read',  from:'txnCtrl', to:'slotDB',   state:'read',    code:'SELECT slots FROM cricket_slots WHERE id=1',  detail:'Read: 1 slot available. Proceeding.' },
      { label:'WRITE',    actor:'write', from:'txnCtrl', to:'payDB',    state:'write',   code:'UPDATE wallet SET balance=balance-150 WHERE user=\'UserA\'', detail:'Deduct ₹150 from User A wallet. Balance: ₹500 → ₹350.' },
      { label:'WRITE',    actor:'write', from:'txnCtrl', to:'slotDB',   state:'write',   code:'INSERT INTO bookings (user,slot) VALUES (\'UserA\',1)', detail:'Attempting to create booking record…' },
      { label:'FAIL ❌',  actor:'error', from:'slotDB',  to:'txnCtrl',  state:'fail',    code:'ERROR: disk quota exceeded',                 detail:'⚠️ Booking write FAILED! Without atomicity, payment is already gone.' },
      { label:'ROLLBACK', actor:'txn',   from:'txnCtrl', to:'payDB',    state:'rollback',code:'ROLLBACK TRANSACTION',                       detail:'Atomicity kicks in: undo ALL ops. Restoring wallet balance → ₹500.' },
      { label:'ROLLBACK', actor:'txn',   from:'txnCtrl', to:'slotDB',   state:'rollback',code:'ROLLBACK — booking record deleted',           detail:'Slot stays available. DB is back to exact pre-transaction state.' },
      { label:'RESTORED', actor:'done',  from:'txnCtrl', to:'user',     state:'done',    code:'-- DB restored to prior state --',            detail:'✅ Atomicity guaranteed: no partial write survived. Retry is safe.' },
    ],
    dbPatches: {
      2: { balance: 350 },
      5: { balance: 500 },  // rollback
    },
  },

  // ── CONSISTENCY ─────────────────────────────────────────────
  consistency: {
    title: 'Consistency',
    icon: '⚖️',
    color: AC.cyan,
    tagline: 'Every committed transaction must preserve database rules.',
    problem: 'Without consistency: two bookings could be created for the same slot → overbooking!',
    steps: [
      { label:'BEGIN',   actor:'txn',   from:'user',    to:'txnCtrl',  state:'begin',   code:'BEGIN TRANSACTION — Booking 1',               detail:'First transaction: User A tries to book slot #1.' },
      { label:'READ',    actor:'read',  from:'txnCtrl', to:'slotDB',   state:'read',    code:'SELECT count(*) FROM bookings WHERE slot=1 AND status=\'confirmed\'', detail:'Result: 0 confirmed bookings. Slot is free.' },
      { label:'WRITE',   actor:'write', from:'txnCtrl', to:'slotDB',   state:'write',   code:'INSERT INTO bookings (user,slot,status) VALUES (\'UserA\',1,\'confirmed\')', detail:'User A booking created. slots_available → 0.' },
      { label:'COMMIT',  actor:'txn',   from:'txnCtrl', to:'slotDB',   state:'commit',  code:'COMMIT',                                      detail:'First booking committed. Constraint: UNIQUE(slot, status=confirmed) now enforced.' },
      { label:'BEGIN',   actor:'txn',   from:'user',    to:'txnCtrl',  state:'begin',   code:'BEGIN TRANSACTION — Booking 2',               detail:'Second transaction: User B now tries to book the SAME slot #1.' },
      { label:'READ',    actor:'read',  from:'txnCtrl', to:'slotDB',   state:'read',    code:'SELECT count(*) FROM bookings WHERE slot=1 AND status=\'confirmed\'', detail:'Result: 1 confirmed booking already exists!' },
      { label:'REJECT ❌',actor:'error',from:'slotDB',  to:'txnCtrl',  state:'fail',    code:'CONSTRAINT VIOLATION: slot already booked',   detail:'DB constraint prevents a second confirmed booking on the same slot.' },
      { label:'ROLLBACK',actor:'txn',   from:'txnCtrl', to:'user',     state:'rollback',code:'ROLLBACK — slot unavailable',                  detail:'✅ Consistency: rule "1 slot = max 1 confirmed booking" is preserved.' },
    ],
    dbPatches: {
      2: { slots: 0, bookings: [{user:'UserA',slot:1,status:'confirmed'}] },
    },
  },

  // ── ISOLATION ───────────────────────────────────────────────
  isolation: {
    title: 'Isolation',
    icon: '🔒',
    color: AC.yellow,
    tagline: 'Concurrent transactions must not produce an incorrect result.',
    problem: 'Without isolation: two users read "slot available", both write a booking → double booking!',
    steps: [
      { label:'BEGIN A',  actor:'txnA',  from:'userA',   to:'txnA',    state:'begin',   code:'TXN-A: BEGIN — User A starts booking',        detail:'User A transaction starts. Slot: 1 available.' },
      { label:'BEGIN B',  actor:'txnB',  from:'userB',   to:'txnB',    state:'begin',   code:'TXN-B: BEGIN — User B starts simultaneously', detail:'User B transaction starts at the same moment. Last slot!' },
      { label:'READ A',   actor:'readA', from:'txnA',    to:'slotDB',  state:'read',    code:'TXN-A: SELECT … slots=1',                     detail:'TXN-A reads: 1 slot available. Continues.' },
      { label:'READ B',   actor:'readB', from:'txnB',    to:'slotDB',  state:'read',    code:'TXN-B: SELECT … slots=1',                     detail:'TXN-B also reads: 1 slot available. Both think they can book!' },
      { label:'LOCK A 🔒',actor:'lockA', from:'txnA',    to:'slotDB',  state:'lock',    code:'TXN-A: SELECT … FOR UPDATE (row lock)',        detail:'TXN-A acquires a write lock on slot row. TXN-B must wait.' },
      { label:'WAIT B ⏳',actor:'waitB', from:'txnB',    to:'slotDB',  state:'wait',    code:'TXN-B: WAITING for lock…',                    detail:'TXN-B is blocked. Cannot proceed until TXN-A releases the lock.' },
      { label:'WRITE A',  actor:'writeA',from:'txnA',    to:'slotDB',  state:'write',   code:'TXN-A: INSERT booking + UPDATE slots=0',      detail:'TXN-A writes the booking. Slot count: 1 → 0.' },
      { label:'COMMIT A', actor:'txnA',  from:'txnA',    to:'slotDB',  state:'commit',  code:'TXN-A: COMMIT ✅',                            detail:'TXN-A committed. Lock released. TXN-B can now proceed.' },
      { label:'READ B',   actor:'readB', from:'txnB',    to:'slotDB',  state:'read',    code:'TXN-B: re-reads after lock — slots=0',        detail:'TXN-B now reads: 0 slots. Slot was taken by TXN-A.' },
      { label:'ROLLBACK B',actor:'txnB', from:'txnB',    to:'userB',   state:'rollback',code:'TXN-B: ROLLBACK — slot no longer available',  detail:'✅ Isolation: locking prevented both from booking the same slot.' },
    ],
    dbPatches: {
      6: { slots: 0, bookings: [{user:'UserA',slot:1,status:'confirmed'}] },
    },
  },

  // ── DURABILITY ──────────────────────────────────────────────
  durability: {
    title: 'Durability',
    icon: '🛡️',
    color: AC.green,
    tagline: 'Committed data survives system failures.',
    problem: 'Without durability: a crash after COMMIT could wipe the booking — user paid but no record!',
    steps: [
      { label:'BEGIN',   actor:'txn',   from:'user',    to:'txnCtrl', state:'begin',   code:'BEGIN TRANSACTION',                           detail:'User A books slot #1. Transaction begins.' },
      { label:'WRITE',   actor:'write', from:'txnCtrl', to:'slotDB',  state:'write',   code:'INSERT INTO bookings …',                      detail:'Booking created in memory (buffer pool). Not yet on disk.' },
      { label:'WAL ✍️',  actor:'wal',   from:'slotDB',  to:'walLog',  state:'write',   code:'Write-Ahead Log: append "booking:UserA:slot1"',detail:'Before COMMIT, every change is written to the WAL (append-only disk log).' },
      { label:'COMMIT',  actor:'txn',   from:'txnCtrl', to:'slotDB',  state:'commit',  code:'COMMIT — WAL fsynced to disk',                detail:'COMMIT triggers fsync. WAL is safely on persistent storage.' },
      { label:'CRASH 💥',actor:'crash', from:'server',  to:'server',  state:'crash',   code:'FATAL: server crash / power loss',            detail:'Server crashes immediately after COMMIT. Memory (buffer) is lost!' },
      { label:'RESTART', actor:'start', from:'server',  to:'walLog',  state:'read',    code:'PostgreSQL: replaying WAL log on restart…',   detail:'Database restarts and replays the WAL. Re-applies all committed ops.' },
      { label:'RECOVER', actor:'done',  from:'walLog',  to:'slotDB',  state:'done',    code:'RECOVERED: booking UserA slot #1 restored',   detail:'Booking is back! COMMIT survived the crash via WAL.' },
      { label:'DURABLE ✅',actor:'done',from:'slotDB',  to:'user',    state:'done',    code:'SELECT * FROM bookings WHERE user=\'UserA\'  → 1 row', detail:'✅ Durability: once committed, data survives any failure.' },
    ],
    dbPatches: {
      1: { bookings: [{user:'UserA',slot:1,status:'pending'}] },
      3: { bookings: [{user:'UserA',slot:1,status:'confirmed'}], walLog:['UserA:slot1:COMMIT'] },
      4: { crashed: true },
      5: { crashed: false },
      6: { bookings: [{user:'UserA',slot:1,status:'confirmed'}] },
    },
  },
};

const SCENARIO_KEYS = ['atomicity','consistency','isolation','durability'];

// ── DOM Builder ──────────────────────────────────────────────
function initACID() {
  const root = document.getElementById('acidRoot');
  if (!root) return;

  root.innerHTML = `
  <style>
    .acid-wrap { font-family: 'Inter', sans-serif; }
    .acid-tabs { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
    .acid-tab {
      padding:8px 18px; border-radius:8px; border:1.5px solid var(--border);
      background:var(--bg2); color:var(--text2); cursor:pointer;
      font-size:.82rem; font-weight:600; transition:all .15s;
    }
    .acid-tab:hover { background:var(--bg3); color:var(--text); }
    .acid-tab.active { color:#fff; border-color:transparent; }
    .acid-tab[data-s="0"].active { background:#6366f1; }
    .acid-tab[data-s="1"].active { background:#06b6d4; }
    .acid-tab[data-s="2"].active { background:#f59e0b; }
    .acid-tab[data-s="3"].active { background:#22c55e; }

    .acid-stage {
      background:var(--bg3); border:1px solid var(--border);
      border-radius:12px; padding:16px; position:relative; overflow:hidden;
    }
    .acid-canvas-wrap { position:relative; width:100%; }
    #acidCanvas { display:block; width:100%; border-radius:8px; }

    .acid-controls { display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; align-items:center; }
    .acid-run-btn {
      padding:9px 22px; border-radius:8px; font-size:.85rem; font-weight:700;
      cursor:pointer; border:none; transition:all .15s; color:#fff;
    }
    .acid-run-btn:hover { opacity:.88; transform:translateY(-1px); }

    .acid-steps-wrap { margin-top:12px; }
    .acid-steps { display:flex; gap:6px; flex-wrap:wrap; }
    .acid-step-dot {
      width:28px; height:28px; border-radius:50%; display:flex; align-items:center;
      justify-content:center; font-size:9px; font-weight:700; cursor:default;
      border:1.5px solid var(--border); background:var(--bg2); color:var(--text3);
      transition:all .3s; flex-shrink:0;
    }
    .acid-step-dot.active { color:#fff; border-color:transparent; transform:scale(1.18); }
    .acid-step-dot.done   { opacity:.5; }

    .acid-log {
      background:var(--bg); border:1px solid var(--border); border-radius:8px;
      padding:12px 14px; margin-top:10px; min-height:72px;
      font-size:.82rem; color:var(--text2); line-height:1.65;
    }
    .acid-log .log-code { font-family:'Fira Code',monospace; color:var(--cyan); font-size:.78rem; }
    .acid-log .log-detail { color:var(--text2); margin-top:4px; }
    .acid-log .log-state-begin    { color:var(--accent2); }
    .acid-log .log-state-write    { color:var(--yellow); }
    .acid-log .log-state-read     { color:var(--blue); }
    .acid-log .log-state-commit   { color:var(--green); font-weight:700; }
    .acid-log .log-state-rollback { color:var(--red); font-weight:700; }
    .acid-log .log-state-fail     { color:var(--red); }
    .acid-log .log-state-lock     { color:var(--yellow); }
    .acid-log .log-state-wait     { color:var(--yellow); }
    .acid-log .log-state-crash    { color:var(--red); font-weight:700; }
    .acid-log .log-state-done     { color:var(--green); }

    .acid-db-row { display:flex; gap:10px; margin-top:10px; flex-wrap:wrap; }
    .acid-db-card {
      flex:1; min-width:140px; background:var(--bg2); border:1px solid var(--border);
      border-radius:8px; padding:10px 12px;
    }
    .acid-db-card h4 { font-size:.75rem; font-weight:700; text-transform:uppercase;
      letter-spacing:.6px; color:var(--text3); margin-bottom:6px; }
    .acid-db-card .db-val { font-size:.9rem; font-weight:700; font-family:'Fira Code',monospace; }

    .acid-discovery {
      background:rgba(99,102,241,.07); border:1.5px solid var(--accent);
      border-radius:10px; padding:14px 16px; margin-top:12px;
      font-size:.88rem; line-height:1.65; display:none;
    }
    .acid-discovery.show { display:block; }
    .acid-discovery strong { color:var(--accent2); }

    .acid-summary-wrap { margin-top:24px; }
    .acid-summary-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; margin-top:12px; }
    .acid-summary-card {
      background:var(--bg2); border-radius:10px; padding:14px;
      border:1.5px solid var(--border); text-align:center;
    }
    .acid-summary-card .sc-icon { font-size:1.8rem; margin-bottom:6px; }
    .acid-summary-card .sc-letter { font-size:1.4rem; font-weight:800; margin-bottom:2px; }
    .acid-summary-card .sc-word { font-size:.9rem; font-weight:700; margin-bottom:4px; }
    .acid-summary-card .sc-desc { font-size:.78rem; color:var(--text2); line-height:1.5; }

    .acid-saga { background:var(--bg2); border:1px solid var(--border); border-radius:10px; padding:16px; margin-top:16px; }
    .acid-saga h3 { font-size:1rem; font-weight:700; margin-bottom:10px; }
    .acid-saga-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .acid-saga-col { background:var(--bg3); border-radius:8px; padding:12px; }
    .acid-saga-col h4 { font-size:.8rem; font-weight:700; margin-bottom:6px; }
    .acid-saga-col ul { font-size:.78rem; color:var(--text2); padding-left:14px; line-height:1.9; }
    @media(max-width:600px){
      .acid-saga-grid { grid-template-columns:1fr; }
    }
  </style>

  <div class="acid-wrap">
    <div class="acid-tabs" id="acidTabs">
      <button class="acid-tab active" data-s="0" onclick="acidSelectScenario(0)">⚛️ Atomicity</button>
      <button class="acid-tab"        data-s="1" onclick="acidSelectScenario(1)">⚖️ Consistency</button>
      <button class="acid-tab"        data-s="2" onclick="acidSelectScenario(2)">🔒 Isolation</button>
      <button class="acid-tab"        data-s="3" onclick="acidSelectScenario(3)">🛡️ Durability</button>
    </div>

    <div class="acid-stage">
      <div class="acid-canvas-wrap" id="acidDiagram" style="width:100%;background:var(--bg3);border-radius:8px;overflow:hidden;min-height:200px;">
      </div>
      <div class="acid-controls">
        <button class="acid-run-btn" id="acidRunBtn" onclick="acidRun()" style="background:#6366f1">
          ▶ Run Scenario
        </button>
        <button class="acid-run-btn" onclick="acidReset()" style="background:#334155">
          ↺ Reset
        </button>
        <span id="acidTxnBadge" style="font-size:.8rem;color:var(--text3);margin-left:4px;"></span>
      </div>
      <div class="acid-steps-wrap">
        <div class="acid-steps" id="acidStepDots"></div>
      </div>
      <div class="acid-log" id="acidLog">
        <span class="log-code">-- Select a scenario and click Run --</span>
      </div>
      <div class="acid-db-row" id="acidDBState"></div>
      <div class="acid-discovery" id="acidDiscovery"></div>
    </div>

    <div class="acid-summary-wrap">
      <div class="section-title" style="margin-top:24px">📋 ACID Summary</div>
      <div class="acid-summary-grid">
        <div class="acid-summary-card">
          <div class="sc-icon">⚛️</div>
          <div class="sc-letter" style="color:#6366f1">A</div>
          <div class="sc-word" style="color:#818cf8">Atomicity</div>
          <div class="sc-desc">All operations succeed or all are rolled back. Never a partial state.</div>
        </div>
        <div class="acid-summary-card">
          <div class="sc-icon">⚖️</div>
          <div class="sc-letter" style="color:#06b6d4">C</div>
          <div class="sc-word" style="color:#06b6d4">Consistency</div>
          <div class="sc-desc">Every committed transaction moves DB from one valid state to another. Constraints enforced.</div>
        </div>
        <div class="acid-summary-card">
          <div class="sc-icon">🔒</div>
          <div class="sc-letter" style="color:#f59e0b">I</div>
          <div class="sc-word" style="color:#f59e0b">Isolation</div>
          <div class="sc-desc">Concurrent transactions produce the same result as if they ran serially. No dirty reads.</div>
        </div>
        <div class="acid-summary-card">
          <div class="sc-icon">🛡️</div>
          <div class="sc-letter" style="color:#22c55e">D</div>
          <div class="sc-word" style="color:#22c55e">Durability</div>
          <div class="sc-desc">Once committed, data survives crashes. WAL + fsync guarantee persistence.</div>
        </div>
      </div>

      <div class="acid-saga">
        <h3>⚡ ACID vs Saga Pattern — When do you use each?</h3>
        <div class="acid-saga-grid">
          <div class="acid-saga-col">
            <h4 style="color:#6366f1">🏦 ACID Transaction</h4>
            <ul>
              <li>Single database / bounded context</li>
              <li>Operations wrapped in one transaction</li>
              <li>All-or-nothing with automatic rollback</li>
              <li>Strong consistency guaranteed</li>
              <li>PostgreSQL, MySQL, Oracle</li>
              <li>Example: bank transfer, slot booking</li>
            </ul>
          </div>
          <div class="acid-saga-col">
            <h4 style="color:#22c55e">🧩 Saga Pattern (Distributed)</h4>
            <ul>
              <li>Multiple microservices / databases</li>
              <li>Chain of local transactions</li>
              <li>Compensating transactions on failure</li>
              <li>Eventual consistency only</li>
              <li>Kafka, Step Functions, Temporal</li>
              <li>Example: e-commerce checkout across services</li>
            </ul>
          </div>
        </div>
        <div style="margin-top:12px;font-size:.83rem;color:var(--text2);background:var(--bg3);padding:10px 14px;border-radius:6px;line-height:1.7">
          <strong style="color:var(--cyan)">Rule of thumb:</strong>
          Use <strong>ACID</strong> when all your data lives in one database and you need guaranteed all-or-nothing semantics.
          Use <strong>Saga</strong> when your workflow spans multiple independent microservices/databases and you can tolerate eventual consistency with compensating rollbacks.
        </div>
      </div>
    </div>
  </div>`;

  acidSelectScenario(0);
}

// ── Scenario selection ───────────────────────────────────────
function acidSelectScenario(idx) {
  acidScenario = idx;
  acidStep = 0;
  acidRunning = false;
  if (acidTimer) { clearTimeout(acidTimer); acidTimer = null; }
  acidResetDB();

  const key = SCENARIO_KEYS[idx];
  const sc  = ACID_SCENARIOS[key];
  const colors = [AC.accent, AC.cyan, AC.yellow, AC.green];
  const col = colors[idx];

  // update tabs
  document.querySelectorAll('.acid-tab').forEach(t => {
    t.classList.toggle('active', +t.dataset.s === idx);
  });

  // update run button color
  const btn = document.getElementById('acidRunBtn');
  if (btn) btn.style.background = col;

  // build step dots
  const dots = document.getElementById('acidStepDots');
  if (dots) {
    dots.innerHTML = sc.steps.map((s, i) =>
      `<div class="acid-step-dot" id="acid-dot-${i}" title="${s.label}">${i+1}</div>`
    ).join('');
  }

  // hide discovery
  const disc = document.getElementById('acidDiscovery');
  if (disc) { disc.classList.remove('show'); disc.innerHTML = ''; }

  // badge
  const badge = document.getElementById('acidTxnBadge');
  if (badge) badge.textContent = sc.tagline;

  // reset log
  const log = document.getElementById('acidLog');
  if (log) log.innerHTML = `<span class="log-code">-- ${sc.title}: ${sc.problem} --</span>`;

  // render initial DB state
  acidRenderDB();

  // draw initial diagram
  acidDraw(idx, -1);
}

function acidReset() {
  acidRunning = false;
  if (acidTimer) { clearTimeout(acidTimer); acidTimer = null; }
  acidResetDB();
  acidStep = 0;
  acidSelectScenario(acidScenario);
}

// ── Run the scenario step by step ───────────────────────────
function acidRun() {
  if (acidRunning) return;
  const key = SCENARIO_KEYS[acidScenario];
  const sc  = ACID_SCENARIOS[key];
  if (acidStep >= sc.steps.length) { acidReset(); return; }
  acidRunning = true;
  acidAdvance();
}

function acidAdvance() {
  const key = SCENARIO_KEYS[acidScenario];
  const sc  = ACID_SCENARIOS[key];
  if (acidStep >= sc.steps.length) {
    acidRunning = false;
    acidShowDiscovery();
    return;
  }

  const step = sc.steps[acidStep];

  // apply DB patch if defined
  if (sc.dbPatches && sc.dbPatches[acidStep]) {
    const patch = sc.dbPatches[acidStep];
    if (patch.balance  !== undefined) ACID_DB.balance  = patch.balance;
    if (patch.balanceB !== undefined) ACID_DB.balanceB = patch.balanceB;
    if (patch.slots    !== undefined) ACID_DB.slots     = patch.slots;
    if (patch.bookings !== undefined) ACID_DB.bookings  = [...patch.bookings];
    if (patch.walLog   !== undefined) ACID_DB.walLog    = [...patch.walLog];
    if (patch.crashed  !== undefined) ACID_DB.crashed   = patch.crashed;
  }

  // update dot states
  document.querySelectorAll('.acid-step-dot').forEach((d, i) => {
    const colors = [AC.accent, AC.cyan, AC.yellow, AC.green];
    const col = colors[acidScenario];
    d.classList.remove('active', 'done');
    if (i < acidStep)  { d.classList.add('done');   d.style.background = col + '44'; d.style.color = col; d.style.borderColor = col + '66'; }
    if (i === acidStep){ d.classList.add('active');  d.style.background = col; d.style.color = '#fff'; d.style.borderColor = col; }
    if (i > acidStep)  { d.style.background = ''; d.style.color = ''; d.style.borderColor = ''; }
  });

  // update log
  const stateColors = {begin:AC.accent2,read:AC.blue,write:AC.yellow,commit:AC.green,rollback:AC.red,fail:AC.red,lock:AC.yellow,wait:AC.yellow,crash:AC.red,done:AC.green,wal:AC.cyan};
  const sCol = stateColors[step.state] || AC.text2;
  const log = document.getElementById('acidLog');
  if (log) {
    log.innerHTML = `
      <div class="log-code log-state-${step.state}">
        [${step.label}]  ${step.code}
      </div>
      <div class="log-detail">${step.detail}</div>`;
  }

  // update DB display
  acidRenderDB();

  // draw canvas
  acidDraw(acidScenario, acidStep);

  acidStep++;
  const delay = step.state === 'crash' ? 1200 : step.state === 'rollback' ? 900 : 700;
  acidTimer = setTimeout(() => { acidAdvance(); }, delay);
}

function acidShowDiscovery() {
  const key = SCENARIO_KEYS[acidScenario];
  const sc  = ACID_SCENARIOS[key];
  const colors = [AC.accent, AC.cyan, AC.yellow, AC.green];
  const col = colors[acidScenario];
  const disc = document.getElementById('acidDiscovery');
  if (!disc) return;
  disc.style.borderColor = col;
  disc.style.background  = col + '11';
  disc.innerHTML = `
    <strong style="color:${col}; font-size:.95rem;">${sc.icon} ${sc.title}: ${sc.tagline}</strong><br>
    <span style="color:var(--text2); font-size:.84rem; margin-top:4px; display:block;">
      ⚠️ <em>Without this property:</em> ${sc.problem}
    </span>`;
  disc.classList.add('show');

  const btn = document.getElementById('acidRunBtn');
  if (btn) btn.textContent = '↺ Run Again';
}

// ── DB state panel ───────────────────────────────────────────
function acidRenderDB() {
  const panel = document.getElementById('acidDBState');
  if (!panel) return;
  const crashed = ACID_DB.crashed;
  const bookingStr = ACID_DB.bookings.length
    ? ACID_DB.bookings.map(b => `${b.user} → slot#${b.slot} [${b.status}]`).join('<br>')
    : '<span style="color:var(--text3)">empty</span>';
  const walStr = ACID_DB.walLog.length
    ? ACID_DB.walLog.join(', ')
    : '<span style="color:var(--text3)">empty</span>';

  panel.innerHTML = `
    <div class="acid-db-card">
      <h4>🎯 Slots DB</h4>
      <div class="db-val" style="color:${ACID_DB.slots>0?AC.green:AC.red}">${ACID_DB.slots} available</div>
    </div>
    <div class="acid-db-card">
      <h4>💰 Wallet A</h4>
      <div class="db-val" style="color:${ACID_DB.balance<500?AC.yellow:AC.green}">₹${ACID_DB.balance}</div>
    </div>
    <div class="acid-db-card">
      <h4>💰 Wallet B</h4>
      <div class="db-val" style="color:${ACID_DB.balanceB<500?AC.yellow:AC.green}">₹${ACID_DB.balanceB}</div>
    </div>
    <div class="acid-db-card" style="min-width:180px;">
      <h4>📋 Bookings</h4>
      <div class="db-val" style="font-size:.75rem;line-height:1.7">${bookingStr}</div>
    </div>
    <div class="acid-db-card">
      <h4>📝 WAL Log</h4>
      <div class="db-val" style="font-size:.72rem;color:var(--cyan)">${walStr}</div>
    </div>
    ${crashed ? `<div class="acid-db-card" style="border-color:${AC.red}">
      <h4 style="color:${AC.red}">💥 Server</h4>
      <div class="db-val" style="color:${AC.red}">CRASHED</div>
    </div>` : ''}`;
}

// ── SVG drawing engine (replaces canvas — fully responsive) ──
function acidDraw(scenarioIdx, stepIdx) {
  const wrap = document.getElementById('acidDiagram');
  if (!wrap) return;
  const key  = SCENARIO_KEYS[scenarioIdx];
  const sc   = ACID_SCENARIOS[key];
  const step = stepIdx >= 0 && stepIdx < sc.steps.length ? sc.steps[stepIdx] : null;
  wrap.innerHTML = scenarioIdx === 2
    ? acidSVGIsolation(step)
    : acidSVGLinear(step, scenarioIdx, sc);
}

// ── SVG primitives ───────────────────────────────────────────
function svgRect(x,y,w,h,r,fill,stroke,sw=1.5,gid=''){
  const f=gid?`filter="url(#g_${gid})"`:''
  return `<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${f}/>`;
}
function svgTxt(x,y,s,fill='#94a3b8',fs=10,fw=500,anchor='middle'){
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${fs}" font-weight="${fw}" text-anchor="${anchor}" dominant-baseline="middle" font-family="Inter,sans-serif">${s}</text>`;
}
function svgLine(x1,y1,x2,y2,col,dashed=false,sw=1){
  const d=dashed?'stroke-dasharray="4,5"':'';
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${sw}" ${d}/>`;
}
function svgArrow(x1,y1,x2,y2,col,dashed=false){
  const d=dashed?'stroke-dasharray="5,4"':'';
  const a=Math.atan2(y2-y1,x2-x1),aw=8;
  const p1x=x2-aw*Math.cos(a-.4),p1y=y2-aw*Math.sin(a-.4);
  const p2x=x2-aw*Math.cos(a+.4),p2y=y2-aw*Math.sin(a+.4);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="2" ${d}/>
  <polygon points="${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}" fill="${col}"/>`;
}
function svgBadge(x,y,label,col){
  const w=label.length*5.8+18;
  return `<rect x="${x-w/2}" y="${y-9}" width="${w}" height="18" rx="5" fill="${col}22" stroke="${col}" stroke-width="1"/>
  ${svgTxt(x,y,label,col,9,700)}`;
}
function svgCyl(cx,cy,w,h,fill,stroke,sw=1.5,gid=''){
  const rx=w/2,ry=7,f=gid?`filter="url(#g_${gid})"`:''
  return `<g ${f}>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
  <rect x="${cx-rx}" y="${cy}" width="${w}" height="${h}" fill="${fill}" stroke="none"/>
  <line x1="${cx-rx}" y1="${cy}" x2="${cx-rx}" y2="${cy+h}" stroke="${stroke}" stroke-width="${sw}"/>
  <line x1="${cx+rx}" y1="${cy}" x2="${cx+rx}" y2="${cy+h}" stroke="${stroke}" stroke-width="${sw}"/>
  <ellipse cx="${cx}" cy="${cy+h}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
  </g>`;
}
function svgGlowDefs(pairs){
  return pairs.map(([id,col])=>`<filter id="g_${id}" x="-60%" y="-60%" width="220%" height="220%">
  <feGaussianBlur stdDeviation="5" result="b"/><feFlood flood-color="${col}" flood-opacity=".65" result="c"/>
  <feComposite in="c" in2="b" operator="in" result="g"/>
  <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`).join('');
}
function svgGrid(){
  return `<pattern id="dotgrid" width="40" height="40" patternUnits="userSpaceOnUse">
  <path d="M40,0 L0,0 0,40" fill="none" stroke="#1a2236" stroke-width=".5"/></pattern>
  <rect width="100%" height="100%" fill="url(#dotgrid)"/>`;
}

// ── Linear SVG (Atomicity / Consistency / Durability) ────────
function acidSVGLinear(step, scenarioIdx, sc) {
  const colors=[AC.accent,AC.cyan,AC.yellow,AC.green];
  const col=colors[scenarioIdx];
  const VW=640,VH=260;
  const c1=64,c2=210,c3=390,c4=572,MY=VH/2;
  const crashed=scenarioIdx===3&&ACID_DB.crashed;

  const slotAct=step&&(step.to==='slotDB'||step.from==='slotDB');
  const payAct =step&&(step.to==='payDB' ||step.from==='payDB');
  const walAct =step&&(step.to==='walLog'||step.from==='walLog');
  const isBad  =step&&(step.state==='fail'||step.state==='rollback');

  const txnCol=!step?col:step.state==='rollback'?AC.red:step.state==='commit'?AC.green:col;
  const slotCol=slotAct?(isBad?AC.red:AC.cyan):'#2a3347';
  const payCol =payAct ?(isBad?AC.red:AC.yellow):'#2a3347';
  const walCol =walAct ?AC.green:'#334155';
  const s1Col  =step&&step.to==='slotDB'?(isBad?AC.red:col):'#334155';
  const s2Col  =step&&step.to==='payDB' ?(isBad?AC.red:col):'#334155';

  // arrow
  let arr='';
  if(step&&step.state!=='done'){
    const xmap={user:c1,txnCtrl:c2,slotDB:c4,payDB:c4,walLog:c4,server:c4};
    const ymap={slotDB:MY-62,payDB:MY+62,walLog:MY,server:MY};
    let x1=xmap[step.from]??c2, x2=xmap[step.to]??c4;
    let y1=ymap[step.from]??MY, y2=ymap[step.to]??MY;
    if(step.from==='user'||step.from==='userA'){x1=c1+40;y1=MY;}
    if(step.to  ==='user'||step.to  ==='userA'){x2=c1+40;y2=MY;}
    if(step.from==='txnCtrl')x1=c2+48;
    if(step.to  ==='txnCtrl')x2=c2-48;
    const ac=isBad?AC.red:step.state==='commit'?AC.green:col;
    arr=svgArrow(x1,y1,x2,y2,ac,step.state==='rollback')
       +svgBadge((x1+x2)/2,(y1+y2)/2-14,step.label,ac);
  }
  const stLbl=step?({begin:'🟣 BEGIN',read:'🔵 READ',write:'✏️ WRITE',commit:'✅ COMMIT',
    rollback:'↩️ ROLLBACK',fail:'❌ FAIL',crash:'💥 CRASH',done:'✅ DONE',wal:'📝 WAL',
    start:'🔄 START'}[step.state]||step.state.toUpperCase()):'';

  return `<svg viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg"
    style="width:100%;display:block;border-radius:8px;background:#0f1117;font-family:Inter,sans-serif">
    <defs>${svgGlowDefs([[col,col],['red',AC.red],['green',AC.green],['cyan',AC.cyan],['yellow',AC.yellow]])}
    <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40,0L0,0 0,40" fill="none" stroke="#1a2236" stroke-width=".5"/></pattern></defs>
    <rect width="${VW}" height="${VH}" fill="url(#g)"/>

    ${svgLine(c1+40,MY,c2-48,MY,'#1e2535',true)}
    ${svgLine(c2+48,MY-12,c3-46,MY-62,'#1e2535',true)}
    ${svgLine(c2+48,MY+12,c3-46,MY+62,'#1e2535',true)}
    ${svgLine(c3+46,MY-62,c4-40,MY-62,'#1e2535',true)}
    ${svgLine(c3+46,MY+62,c4-40,MY+62,'#1e2535',true)}

    ${svgRect(c1,MY,80,48,8,'#0f1117',AC.blue,2)}
    ${svgTxt(c1,MY-11,'👤','#fff',17)} ${svgTxt(c1,MY+8,'User A',AC.blue,10,700)}

    ${svgRect(c2,MY,96,58,8,txnCol+'22',txnCol,2,step&&['begin','commit','rollback'].includes(step.state)?col:'')}
    ${svgTxt(c2,MY-15,'⚙️','#fff',15)} ${svgTxt(c2,MY+2,'Txn Controller',txnCol,9,700)}
    ${svgTxt(c2,MY+16,step?step.state.toUpperCase():'IDLE',txnCol,8,600)}

    ${svgRect(c3,MY-62,92,38,8,s1Col+'22',s1Col,step&&step.to==='slotDB'?2:1.5)}
    ${svgTxt(c3,MY-73,'🎯','#fff',13)} ${svgTxt(c3,MY-55,'Slot Service',s1Col,9,700)}

    ${svgRect(c3,MY+62,92,38,8,s2Col+'22',s2Col,step&&step.to==='payDB'?2:1.5)}
    ${svgTxt(c3,MY+51,'💳','#fff',13)} ${svgTxt(c3,MY+69,'Pay Service',s2Col,9,700)}

    ${svgCyl(c4,MY-86,78,38,crashed?'#ef444411':slotCol+'22',crashed?AC.red:slotCol,slotAct?2:1.5,slotAct?'cyan':'')}
    ${svgTxt(c4,MY-69,crashed?'💥 CRASHED':'🗄️ Bookings',crashed?AC.red:slotCol,9,700)}

    ${svgCyl(c4,MY+36,78,38,payCol+'22',payCol,payAct?2:1.5,payAct?'yellow':'')}
    ${svgTxt(c4,MY+53,'💳 Wallet DB',payCol,9,700)}

    ${scenarioIdx===3?`
    ${svgRect(c4,MY,76,30,6,walCol+'22',walCol,walAct?2:1,walAct?'green':'')}
    ${svgTxt(c4,MY-6,'📝 WAL Log',walCol,9,700)}
    ${svgTxt(c4,MY+8,ACID_DB.walLog.length?'FSYNCED':'empty',walCol,8,500)}`:''}

    ${arr}
    ${svgBadge(VW/2,16,`${sc.icon} ${sc.title}`,col)}
    ${stLbl?svgTxt(VW-6,VH-12,stLbl,col,10,700,'end'):''}
  </svg>`;
}

// ── Isolation SVG — two parallel transactions ────────────────
function acidSVGIsolation(step) {
  const VW=640,VH=290;
  const rA=VH*0.24,rB=VH*0.76;
  const uX=54,tX=210,dbX=510,lkX=370,MY=VH/2;
  const sColor=ACID_DB.slots===0?AC.green:AC.cyan;

  const actA=step&&['txnA','readA','writeA','lockA'].includes(step.actor);
  const actB=step&&['txnB','readB','waitB'].includes(step.actor);
  const isLock=step&&['lockA','waitB'].includes(step.actor);

  const colA=!step?AC.accent:step.actor==='txnA'&&step.state==='commit'?AC.green:
    ['lockA','writeA'].includes(step.actor)?AC.yellow:AC.accent;
  const colB=!step?AC.pink:step.actor==='txnB'&&step.state==='rollback'?AC.red:
    step.actor==='waitB'?AC.yellow:AC.pink;

  let arr='';
  if(step){
    const row=actA?rA:actB?rB:null;
    if(row!==null){
      let x1=tX+44,y1=row,x2=dbX-44,y2=MY;
      if(step.to==='slotDB'){x1=tX+44;y1=row;x2=dbX-44;y2=row<MY?MY-16:MY+16;}
      else if(step.from==='slotDB'){x1=dbX-44;y1=MY;x2=tX+44;y2=row;}
      else if(['txnA','txnB','userA','userB'].includes(step.to)){x1=tX-44;y1=row;x2=uX+30;y2=row;}
      else{x1=uX+30;y1=row;x2=tX-44;y2=row;}
      const ac=step.state==='rollback'?AC.red:step.state==='wait'||step.state==='lock'?AC.yellow:step.state==='commit'?AC.green:AC.yellow;
      arr=svgArrow(x1,y1,x2,y2,ac,step.state==='wait')+svgBadge((x1+x2)/2,(y1+y2)/2-14,step.label,ac);
    }
  }
  const stLbl=step?({begin:'🟣 BEGIN',read:'🔵 READ',write:'✏️ WRITE',commit:'✅ COMMIT',
    rollback:'↩️ ROLLBACK',lock:'🔒 LOCK',wait:'⏳ WAIT'}[step.state]||step.state.toUpperCase()):'';

  return `<svg viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg"
    style="width:100%;display:block;border-radius:8px;background:#0f1117;font-family:Inter,sans-serif">
    <defs>${svgGlowDefs([['yellow',AC.yellow],['green',AC.green],['red',AC.red],['cyan',AC.cyan],['pink',AC.pink],['accent',AC.accent]])}
    <pattern id="g2" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40,0L0,0 0,40" fill="none" stroke="#1a2236" stroke-width=".5"/></pattern></defs>
    <rect width="${VW}" height="${VH}" fill="url(#g2)"/>

    ${svgLine(uX+30,rA,tX-44,rA,'#1e2535',true)}
    ${svgLine(tX+44,rA,dbX-44,MY-16,'#1e2535',true)}
    ${svgLine(uX+30,rB,tX-44,rB,'#1e2535',true)}
    ${svgLine(tX+44,rB,dbX-44,MY+16,'#1e2535',true)}

    ${svgCyl(dbX,MY-26,90,52,sColor+'22',sColor,2,ACID_DB.slots===0?'green':'cyan')}
    ${svgTxt(dbX,MY-12,'🎯 Slot DB',sColor,10,700)}
    ${svgTxt(dbX,MY+5,`slots: ${ACID_DB.slots}`,sColor,9,600)}
    ${ACID_DB.bookings.length?svgTxt(dbX,MY+21,'✅ '+ACID_DB.bookings[0]?.user,AC.green,8,600):''}

    ${svgRect(uX,rA,60,40,8,'#0f1117',AC.blue,1.5)}
    ${svgTxt(uX,rA-10,'👤','#fff',14)} ${svgTxt(uX,rA+9,'User A',AC.blue,9,700)}

    ${svgRect(tX,rA,88,42,8,colA+'22',colA,actA?2:1.5,actA?'accent':'')}
    ${svgTxt(tX,rA-11,'⚙️','#fff',12)} ${svgTxt(tX,rA+2,'TXN-A',colA,10,700)}
    ${actA&&step?svgTxt(tX,rA+15,step.state.toUpperCase(),colA,8,600):''}

    ${svgRect(uX,rB,60,40,8,'#0f1117',AC.pink,1.5)}
    ${svgTxt(uX,rB-10,'👤','#fff',14)} ${svgTxt(uX,rB+9,'User B',AC.pink,9,700)}

    ${svgRect(tX,rB,88,42,8,colB+'22',colB,actB?2:1.5,actB?'pink':'')}
    ${svgTxt(tX,rB-11,'⚙️','#fff',12)} ${svgTxt(tX,rB+2,'TXN-B',colB,10,700)}
    ${actB&&step?svgTxt(tX,rB+15,step.actor==='waitB'?'WAITING':step.state.toUpperCase(),colB,8,600):''}

    ${isLock?`${svgRect(lkX,MY,84,34,8,AC.yellow+'22',AC.yellow,2,'yellow')}
    ${svgTxt(lkX,MY-7,'🔒 LOCK',AC.yellow,11,800)}
    ${svgTxt(lkX,MY+9,step.actor==='lockA'?'TXN-A holds':'TXN-B waits',AC.yellow,8,600)}`:''}

    ${arr}
    ${svgBadge(VW/2,16,'🔒 Isolation',AC.yellow)}
    ${stLbl?svgTxt(VW-6,VH-12,stLbl,AC.yellow,10,700,'end'):''}
  </svg>`;
}
