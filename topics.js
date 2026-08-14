// ============================================================
//  TOPICS DATA
// ============================================================
const TOPICS = {

// ── INTRO ────────────────────────────────────────────────────
intro: {
  title: "Introduction to System Design",
  badge: "Foundations", badgeClass: "badge-foundations",
  subtitle: "System Design is the process of deciding how different components of a software system work together to satisfy requirements such as scalability, reliability, performance, security, and availability.",
  prev: null, next: "scalability",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">🤔 What is System Design?</div>
      <div class="card">
        <p><strong>System Design = Designing how a large software system works internally.</strong></p>
        <p style="margin-top:8px">It answers the question: how do we build something that millions of people can use simultaneously, without it falling apart?</p>
      </div>

      <div class="section-title">� Simple Example — PLAYKERS Cricket Booking</div>
      <div class="card">
        <p>A user wants to book a cricket turf:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Login → Find turf → Select date/time → Book → Pay → Receive notification
        </div>
        <p style="margin-top:10px">At first you think: <code>User → Backend → Database</code></p>
        <p style="margin-top:8px">But when <strong>millions of users</strong> use it, you need this:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Users → DNS → CDN → Load Balancer → API Gateway<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Booking Service · Payment Service · User Service<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Booking DB &nbsp;&nbsp;&nbsp;&nbsp;Payment DB &nbsp;&nbsp;User DB<br><br>
          + Cache · Message Queue · Replication · Sharding<br>
          + Service Discovery · Rate Limiting · Circuit Breaker
        </div>
        <p style="margin-top:8px">That overall architecture is <strong>system design</strong>.</p>
      </div>

      <div class="section-title">📊 System Design Pillars</div>
      <div class="anim-container">
        <div class="anim-label">The five pillars every large system must balance</div>
        <canvas id="introCanvas" height="180"></canvas>
      </div>

      <div class="section-title">❓ Why Do We Need System Design?</div>
      <div class="card">
        <p>At 10 users — almost any architecture works.<br>
        At <strong>1 million users</strong> — problems appear:</p>
        <table class="compare-table" style="margin-top:10px">
          <tr><th>Problem</th><th>What breaks</th><th>Solution</th></tr>
          <tr><td>Too much traffic</td><td>One server 💥</td><td>Load Balancer + multiple servers</td></tr>
          <tr><td>Database overload</td><td>DB 💥</td><td>Caching + Read Replicas + Sharding</td></tr>
          <tr><td>Server failure</td><td>App down 💥</td><td>Multiple instances + Replication</td></tr>
          <tr><td>One service fails</td><td>All services affected 💥</td><td>Circuit Breaker</td></tr>
          <tr><td>Traffic spike</td><td>1,000 → 100,000 req/sec 💥</td><td>Auto Scaling</td></tr>
        </table>
      </div>

      <div class="section-title">� Functional vs Non-Functional Requirements</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0">
        <div class="card" style="border-color:#6366f1">
          <h3 style="color:#818cf8">⚙️ Functional Requirements</h3>
          <p style="font-size:.85rem;color:var(--text2)"><em>What the system should do</em></p>
          <ul style="margin-top:8px;font-size:.84rem;color:var(--text2);line-height:1.9;padding-left:16px">
            <li>User can register and login</li>
            <li>User can search turfs</li>
            <li>User can book a turf</li>
            <li>User can make payment</li>
            <li>User receives notification</li>
          </ul>
        </div>
        <div class="card" style="border-color:#22c55e">
          <h3 style="color:#22c55e">📈 Non-Functional Requirements</h3>
          <p style="font-size:.85rem;color:var(--text2)"><em>How well it should work</em></p>
          <ul style="margin-top:8px;font-size:.84rem;color:var(--text2);line-height:1.9;padding-left:16px">
            <li>Support 1 million users (scalability)</li>
            <li>API responds within 200ms (latency)</li>
            <li>Available even if one server fails (availability)</li>
            <li>No data loss on crash (durability)</li>
            <li>Protect against 1M req/sec (security)</li>
          </ul>
        </div>
      </div>

      <div class="section-title">📐 Key Concepts You Will Learn</div>
      <table class="compare-table">
        <tr><th>Problem</th><th>Concept</th><th>Topics in this course</th></tr>
        <tr><td>Too much traffic</td><td>Load Balancing</td><td>Load Balancer, Rate Limiting</td></tr>
        <tr><td>Slow database reads</td><td>Caching</td><td>Caching, CDN</td></tr>
        <tr><td>Database too large</td><td>Distribution</td><td>Sharding, Consistent Hashing</td></tr>
        <tr><td>Server failure</td><td>Redundancy</td><td>Replication, Availability</td></tr>
        <tr><td>Service failure</td><td>Resilience</td><td>Circuit Breaker, Retry</td></tr>
        <tr><td>Async work</td><td>Decoupling</td><td>Message Queue, Event-Driven</td></tr>
        <tr><td>Large system</td><td>Architecture</td><td>Microservices, API Gateway</td></tr>
        <tr><td>Data consistency</td><td>Guarantees</td><td>ACID, CAP Theorem</td></tr>
        <tr><td>Real-time updates</td><td>Push</td><td>WebSockets, SSE</td></tr>
      </table>

      <div class="section-title">🗺️ The Complete PLAYKERS Architecture</div>
      <div class="card">
        <p>After completing all topics in this course, you will understand every component in this architecture:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2">
          CLIENT<br>
          &nbsp;&nbsp;↓ DNS (domain → IP)<br>
          &nbsp;&nbsp;↓ CDN (static assets at the edge)<br>
          &nbsp;&nbsp;↓ Load Balancer (distribute traffic)<br>
          &nbsp;&nbsp;↓ API Gateway (auth + routing + rate limiting)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          User Svc &nbsp;&nbsp;&nbsp;&nbsp;Booking Svc &nbsp;&nbsp;Match Svc<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ Circuit Breaker<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ Payment Service → Payment DB<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ Message Broker<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↙ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↘<br>
          Notification Svc &nbsp;&nbsp;&nbsp;Analytics Svc<br>
          <br>
          Databases: Replication + Sharding + Consistent Hashing<br>
          Service Discovery · Auto Scaling · Monitoring
        </div>
      </div>

      <div class="section-title">🧠 The System Design Mindset</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <p style="font-size:.95rem;line-height:1.8">System design is not about memorizing components. <strong>Always ask: what problem am I solving?</strong></p>
        <table class="compare-table" style="margin-top:10px">
          <tr><th>Problem</th><th>→</th><th>Solution</th></tr>
          <tr><td>Too much traffic</td><td>→</td><td>Load Balancer</td></tr>
          <tr><td>Too many requests</td><td>→</td><td>Rate Limiter</td></tr>
          <tr><td>Slow database</td><td>→</td><td>Cache</td></tr>
          <tr><td>Database too large</td><td>→</td><td>Sharding</td></tr>
          <tr><td>Server failure</td><td>→</td><td>Replication</td></tr>
          <tr><td>Service failure</td><td>→</td><td>Circuit Breaker</td></tr>
          <tr><td>Async work</td><td>→</td><td>Message Queue</td></tr>
          <tr><td>Need loose coupling</td><td>→</td><td>Event-Driven</td></tr>
          <tr><td>Distributed transaction</td><td>→</td><td>Saga</td></tr>
          <tr><td>Strong DB transaction</td><td>→</td><td>ACID</td></tr>
          <tr><td>Large-scale scaling</td><td>→</td><td>Microservices + horizontal scaling</td></tr>
        </table>
      </div>

      <div class="section-title">📋 How to Use This Course</div>
      <div class="card">
        <ul>
          <li>Each topic has <strong>concept explanations</strong> with real-world examples (Netflix, Uber, Amazon)</li>
          <li>Interactive <strong>animations</strong> show how things work under the hood</li>
          <li>Use the sidebar to jump to any topic — or follow the order for the full learning flow</li>
          <li>Track your progress with the bar at the top</li>
        </ul>
        <div class="highlight" style="margin-top:10px">
          Once you understand the full flow — load balancing, caching, sharding, consistent hashing, replication, CAP, microservices, API Gateway, queues, rate limiting, circuit breakers, Saga, and ACID — they stop looking like separate topics and start fitting together as parts of <strong>one system</strong>.
        </div>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Instagram — 1 Billion Users</div>
        <p>Instagram handles 1B+ users with: CDN for media delivery, sharded PostgreSQL databases, load-balanced API servers, Redis caching, Kafka message queues, and microservices. Every single component in that stack is something you will learn in this course.</p>
      </div>

      ${navButtons(this)}`;
    initIntroCanvas();
  }
},

// ── SCALABILITY ───────────────────────────────────────────────
scalability: {
  title: "Scalability",
  badge: "Foundations", badgeClass: "badge-foundations",
  subtitle: "Scalability is the ability of a system to handle increasing users, requests, data, or workload without a major drop in performance.",
  prev: "intro", next: "latency",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">📏 What is Scalability?</div>
      <div class="card">
        <p><strong>Scalability = How well a system can grow when the workload grows.</strong></p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          100 users → 1,000 users → 100,000 users → 1,000,000 users<br><br>
          A scalable system handles this growth by increasing resources and/or changing architecture.
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>Why do we need it? — PLAYKERS Example</h3>
        <p>One server handles 10,000 requests/sec:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          5,000 req/sec → ✅ (within capacity)<br>
          20,000 req/sec → ❌ (server overloaded 💥)
        </div>
        <p style="margin-top:8px">We need scalability to handle growth.</p>
      </div>

      <div class="section-title">📏 Two Types of Scaling — Animated</div>
      <div class="anim-container">
        <div class="anim-label">Vertical: bigger machine &nbsp;|&nbsp; Horizontal: more machines</div>
        <canvas id="scalingCanvas" height="200"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="setScaling('vertical')">⬆ Vertical (Scale Up)</button>
          <button class="anim-btn" onclick="setScaling('horizontal')">➡ Horizontal (Scale Out)</button>
        </div>
      </div>

      <div class="section-title">⬆️ Vertical Scaling — Scale Up</div>
      <div class="card">
        <h3>Increase the resources of one server</h3>
        <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;margin-top:10px">
          <div style="background:rgba(99,102,241,.1);border:1px solid #6366f166;border-radius:8px;padding:14px;text-align:center;font-family:'Fira Code',monospace;font-size:.82rem;color:var(--text2);line-height:1.9">
            Before<br>4 CPU<br>16 GB RAM
          </div>
          <div style="font-size:1.4rem;text-align:center;color:var(--accent2)">→</div>
          <div style="background:rgba(99,102,241,.18);border:1px solid #6366f1;border-radius:8px;padding:14px;text-align:center;font-family:'Fira Code',monospace;font-size:.82rem;color:var(--accent2);line-height:1.9">
            After<br>16 CPU<br>64 GB RAM
          </div>
        </div>
        <p style="margin-top:10px">✅ Simple, no architecture changes &nbsp;&nbsp; ❌ Hardware limit, single point of failure</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;margin-top:8px">
          4 CPU → 16 → 64 → 128 → maximum hardware capacity ← you hit a wall
        </div>
      </div>

      <div class="section-title">➡️ Horizontal Scaling — Scale Out ⭐</div>
      <div class="card">
        <h3>Add more servers instead of making one bigger</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Before: Users → S1 (10,000 req/sec)<br><br>
          After: &nbsp;Users → Load Balancer → S1 + S2 + S3<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10k + 10k + 10k = 30,000 req/sec
        </div>
        <p style="margin-top:8px">If S2 fails, Load Balancer routes to S1 and S3. <strong>Horizontal scaling also improves availability.</strong></p>
      </div>

      <div class="section-title">📊 Vertical vs Horizontal — Comparison</div>
      <table class="compare-table">
        <tr><th>Aspect</th><th>⬆ Vertical (Scale Up)</th><th>➡ Horizontal (Scale Out)</th></tr>
        <tr><td>Meaning</td><td>Bigger server</td><td>More servers</td></tr>
        <tr><td>Hardware limit</td><td style="color:var(--red)">Yes — hard ceiling</td><td style="color:var(--green)">Theoretically unlimited</td></tr>
        <tr><td>Complexity</td><td>Low — simple upgrade</td><td>Higher — needs LB, stateless design</td></tr>
        <tr><td>Cost curve</td><td>Expensive fast (diminishing returns)</td><td>Linear cost per server</td></tr>
        <tr><td>Fault tolerance</td><td style="color:var(--red)">Single point of failure</td><td style="color:var(--green)">Redundancy possible</td></tr>
        <tr><td>Large distributed systems</td><td>Less preferred</td><td style="color:var(--green)">Standard approach</td></tr>
      </table>

      <div class="section-title">� Stateless Servers — Required for Horizontal Scaling</div>
      <div class="card">
        <h3>Don't store session state in server RAM</h3>
        <p>For horizontal scaling to work, any server must be able to handle any request:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          ❌ Stateful: User logged in on S1 → S2 doesn't know them<br><br>
          ✅ Stateless: S1 · S2 · S3 all read from Redis<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;User Login Session → Redis ← any server reads it
        </div>
      </div>

      <div class="section-title">🗄️ Database Scalability</div>
      <div class="card">
        <h3>More app servers don't automatically fix the DB bottleneck</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;border-color:var(--red)">
          10 App Servers → One Database 💥
        </div>
        <h3 style="margin-top:12px">Solution 1 — Read Replicas</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Writes → Primary DB<br>
          Reads → Replica 1 · Replica 2 · Replica 3
        </div>
        <h3 style="margin-top:12px">Solution 2 — Sharding</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Users 1–1M → Shard 1<br>
          Users 1M–2M → Shard 2<br>
          Users 2M–3M → Shard 3
        </div>
      </div>

      <div class="section-title">⚡ Caching for Scalability</div>
      <div class="card">
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Without cache: 1M requests → Database 💥<br><br>
          With Redis: &nbsp;&nbsp;1M requests → Redis (fast)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ DB receives far fewer requests ✅
        </div>
        <p style="margin-top:8px">Caching reduces database load — making the system easier to scale without adding DB hardware.</p>
      </div>

      <div class="section-title">📈 Auto Scaling — Elasticity</div>
      <div class="card">
        <h3>Automatically add/remove instances based on workload</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Normal traffic: &nbsp;&nbsp;S1 S2<br>
          Traffic spike: &nbsp;&nbsp;&nbsp;Auto Scaling → S1 S2 S3 S4 S5<br>
          Traffic drops: &nbsp;&nbsp;&nbsp;Auto Scaling → S1 S2
        </div>
        <p style="margin-top:8px"><strong>Scalability</strong> = can handle more workload &nbsp;&nbsp; <strong>Elasticity</strong> = automatically adjusts capacity</p>
      </div>

      <div class="section-title">🧩 Independent Scaling with Microservices</div>
      <div class="card">
        <h3>Scale only the bottleneck service</h3>
        <p>PLAYKERS traffic varies by service:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          User Service &nbsp;&nbsp;&nbsp;→ 2 instances &nbsp;&nbsp;(10,000 req/sec)<br>
          Booking Service → 5 instances &nbsp;&nbsp;(50,000 req/sec)<br>
          Match Service &nbsp;&nbsp;→ 3 instances &nbsp;&nbsp;(20,000 req/sec)<br>
          Scoring Service → 20 instances (100,000 req/sec)
        </div>
        <p style="margin-top:8px">No need to scale User Service just because Scoring is busy. This is <strong>independent scaling</strong>.</p>
      </div>

      <div class="section-title">🌍 PLAYKERS Growth — 4 Stages</div>
      <div class="card">
        <table class="compare-table">
          <tr><th>Stage</th><th>Users</th><th>Architecture</th></tr>
          <tr><td>1</td><td>100</td><td>Client → Server → Database</td></tr>
          <tr><td>2</td><td>10,000</td><td>Client → Load Balancer → S1·S2·S3 → Database</td></tr>
          <tr><td>3</td><td>1 million</td><td>CDN + LB + API GW + Microservices + Cache + Read Replicas + Sharded DB</td></tr>
          <tr><td>4</td><td>Global</td><td>DNS + Regional LBs + Services per region + Geo-distributed DBs</td></tr>
        </table>
      </div>

      <div class="section-title">⚠️ Scalability Is Not Just "Add More Servers"</div>
      <div class="card">
        <p>100 app servers → one database = NOT scalable. <strong>Find the bottleneck first:</strong></p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          CPU · RAM · Database · Network · Disk I/O<br>
          Connection pool · API dependency · Cache · Message queue
        </div>
        <p style="margin-top:8px">Then scale the bottleneck appropriately — not everything uniformly.</p>
      </div>

      <div class="section-title">🧠 Interview Answer + Memory Aid</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <p style="font-size:.95rem;line-height:1.8"><strong>Scalability</strong> is the ability of a system to handle increasing workload by adding or increasing resources while maintaining acceptable performance.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;margin-top:10px">
          More traffic → Load Balancer → Horizontal Scaling<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ More service instances<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ Cache → DB Replication<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ Sharding → Consistent Hashing<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ Auto Scaling
        </div>
        <p style="margin-top:10px;font-size:.9rem;color:var(--text2)"><strong>The one question scalability answers:</strong> "If 100 users become 1 million users, how will my system continue working?"</p>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Twitter — Monolith to Horizontal Scaling</div>
        <p>Twitter started on a single monolith server. During the 2010 World Cup, the "Fail Whale" appeared constantly — the system couldn't handle the load. They migrated to horizontal scaling across thousands of servers. During the Super Bowl, they auto-scale to handle 10× normal traffic spikes — impossible with vertical scaling alone.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Netflix — Auto Scaling for Streaming Peaks</div>
        <p>Netflix uses AWS Auto Scaling across all services. When a popular show drops (Stranger Things Season 5), streaming demand spikes instantly. Auto Scaling adds EC2 instances across User Service, Playback Service, and Recommendation Service within minutes. When demand drops after the premiere weekend, instances scale back down — saving cost.</p>
      </div>

      ${navButtons(this)}`;
    initScalingCanvas('vertical');
  }
},
// ── LATENCY ───────────────────────────────────────────────────
latency: {
  title: "Latency vs Throughput",
  badge: "Foundations", badgeClass: "badge-foundations",
  subtitle: "Latency = how long one request takes. Throughput = how many requests the system can handle. Two of the most important performance concepts in System Design.",
  prev: "scalability", next: "cap",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">⏱️ The Easy Way to Remember</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0">
        <div class="card" style="border-color:#06b6d4;text-align:center">
          <div style="font-size:2rem">⏱️</div>
          <h3 style="color:#06b6d4;margin-top:6px">Latency</h3>
          <p style="font-size:.95rem;margin-top:6px">How long does <strong>ONE request</strong> take?</p>
          <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.85rem;margin-top:8px">100 ms</div>
        </div>
        <div class="card" style="border-color:#22c55e;text-align:center">
          <div style="font-size:2rem">📊</div>
          <h3 style="color:#22c55e;margin-top:6px">Throughput</h3>
          <p style="font-size:.95rem;margin-top:6px">How many requests can the system handle?</p>
          <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.85rem;margin-top:8px">10,000 req/sec</div>
        </div>
      </div>

      <div class="section-title">📏 Latency — Deep Dive</div>
      <div class="card">
        <h3>Latency = time taken to complete a request</h3>
        <p>In PLAYKERS: <code>GET /matches</code></p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Request sent &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ 0 ms<br>
          Server processing → 70 ms<br>
          Response received → 100 ms<br><br>
          <strong>Latency = 100 ms</strong> &nbsp;&nbsp; (lower is better)
        </div>
      </div>

      <div class="section-title">📊 Throughput — Deep Dive</div>
      <div class="card">
        <h3>Throughput = work processed per unit of time</h3>
        <p>Commonly measured as requests per second (RPS):</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Server processes 10,000 requests/sec<br>
          <strong>Throughput = 10,000 req/sec</strong> &nbsp;&nbsp; (higher is better)
        </div>
      </div>

      <div class="section-title">🏏 Cricket Stadium Analogy</div>
      <div class="card">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:8px">
          <div style="background:rgba(6,182,212,.08);border:1px solid rgba(6,182,212,.3);border-radius:8px;padding:12px">
            <h4 style="color:#06b6d4">⏱️ Latency</h4>
            <p style="font-size:.85rem;color:var(--text2);margin-top:6px">A batsman hits the ball. How long does it take to reach the fielder?<br><em>= time per single event</em></p>
          </div>
          <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:12px">
            <h4 style="color:#22c55e">📊 Throughput</h4>
            <p style="font-size:.85rem;color:var(--text2);margin-top:6px">How many balls can the team process per minute?<br><em>= volume per unit time</em></p>
          </div>
        </div>
      </div>

      <div class="section-title">⚠️ Low Latency ≠ High Throughput</div>
      <div class="card">
        <table class="compare-table" style="margin-top:8px">
          <tr><th></th><th>Latency</th><th>Throughput</th></tr>
          <tr><td>Server A</td><td style="color:var(--green)">10 ms ✅ fast</td><td style="color:var(--red)">100 req/sec ❌ low</td></tr>
          <tr><td>Server B</td><td style="color:var(--yellow)">100 ms slower</td><td style="color:var(--green)">10,000 req/sec ✅ high</td></tr>
        </table>
        <p style="margin-top:8px">Server A has lower latency. Server B has higher throughput. <strong>They are separate properties.</strong></p>
      </div>

      <div class="section-title">📉 Latency Numbers Every Engineer Should Know</div>
      <div class="anim-container">
        <div class="anim-label">Hardware latency — from nanoseconds to milliseconds</div>
        <canvas id="latencyCanvas" height="240"></canvas>
      </div>

      <div class="section-title">📊 Latency Percentiles — p50, p95, p99</div>
      <div class="card">
        <h3>Average latency hides the worst user experience</h3>
        <p>With 1,000 requests, use percentiles instead of averages:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          p50 = 20 ms &nbsp;&nbsp; → 50% of requests complete within 20 ms<br>
          p95 = 50 ms &nbsp;&nbsp; → 95% of requests complete within 50 ms<br>
          p99 = 500 ms &nbsp;→ 99% complete within 500 ms<br>
          p99.9 = 2s &nbsp;&nbsp;&nbsp;→ 99.9% complete within 2 seconds
        </div>
        <h3 style="margin-top:12px">Why p99 matters at scale</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          1,000,000 requests/sec<br>
          1% at p99 = <strong>10,000 slow requests per second</strong><br>
          That's 10,000 users with a bad experience — every second.
        </div>
        <p style="margin-top:8px">Large systems monitor p50 · p95 · p99, not just average.</p>
      </div>

      <div class="section-title">📈 What Increases Latency?</div>
      <div class="card">
        <table class="compare-table">
          <tr><th>Cause</th><th>Example</th><th>Fix</th></tr>
          <tr><td>Network distance</td><td>India user → US server → long round trip</td><td>CDN, geo-distributed servers</td></tr>
          <tr><td>Slow DB query</td><td>No index → full table scan</td><td>Indexes, query optimisation</td></tr>
          <tr><td>Too many service calls</td><td>Client → GW → Booking → Payment → User → Notify</td><td>Reduce sync calls, aggregate</td></tr>
          <tr><td>Queue waiting</td><td>Producer → Queue → Consumer waits</td><td>More consumers, priority queue</td></tr>
          <tr><td>Server overloaded</td><td>CPU 100% → requests queue up</td><td>Horizontal scaling, auto scale</td></tr>
        </table>
      </div>

      <div class="section-title">📈 What Increases Throughput?</div>
      <div class="card">
        <table class="compare-table">
          <tr><th>Technique</th><th>How it helps</th></tr>
          <tr><td><span class="tag tag-blue">Horizontal Scaling</span></td><td>LB + S1·S2·S3 → 3× capacity</td></tr>
          <tr><td><span class="tag tag-green">Caching</span></td><td>Redis serves hot data → DB gets far fewer requests</td></tr>
          <tr><td><span class="tag tag-yellow">DB Replication</span></td><td>Reads spread across replicas → more read throughput</td></tr>
          <tr><td><span class="tag tag-purple">Sharding</span></td><td>Data split across DBs → write throughput scales</td></tr>
          <tr><td><span class="tag tag-cyan">Async / Message Queue</span></td><td>Decouple slow work → producer isn't blocked</td></tr>
        </table>
      </div>

      <div class="section-title">🔄 Queueing — When Throughput Hits Its Limit</div>
      <div class="card">
        <h3>Sending more requests doesn't always increase useful throughput</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Server capacity: 1,000 req/sec<br><br>
          500 req/sec coming in: &nbsp;server keeps up ✅<br>
          2,000 req/sec coming in: extra 1,000 wait in queue<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Queue grows → Latency ↑↑
        </div>
        <p style="margin-top:8px">This is why Load Balancing, Auto Scaling, Rate Limiting, and Message Queues all exist — they manage the relationship between incoming load and actual capacity.</p>
      </div>

      <div class="section-title">📊 Summary Table</div>
      <table class="compare-table">
        <tr><th></th><th>⏱️ Latency</th><th>📊 Throughput</th></tr>
        <tr><td>Meaning</td><td>Time taken per request</td><td>Work processed per unit time</td></tr>
        <tr><td>Unit</td><td>ms / seconds</td><td>req/sec, RPS, TPS</td></tr>
        <tr><td>Focus</td><td>Individual request speed</td><td>Overall system capacity</td></tr>
        <tr><td>Better when</td><td>Lower</td><td>Higher</td></tr>
        <tr><td>PLAYKERS example</td><td>p50=40ms, p99=250ms</td><td>20,000 req/sec</td></tr>
      </table>

      <div class="section-title">🔗 Connection to Other Topics</div>
      <div class="card">
        <p>Every topic you learn in this course either reduces latency, increases throughput, or both:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          CDN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ ↓ latency (serve from edge)<br>
          Caching &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ ↓ latency + ↑ throughput<br>
          Load Balancer &nbsp;&nbsp;&nbsp;→ ↑ throughput<br>
          DB Replication &nbsp;&nbsp;→ ↑ read throughput<br>
          Sharding &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ ↑ write throughput<br>
          Auto Scaling &nbsp;&nbsp;&nbsp;&nbsp;→ ↑ throughput on demand<br>
          Message Queue &nbsp;&nbsp;&nbsp;→ ↑ throughput (decouple slow work)
        </div>
      </div>

      <div class="section-title">🧠 Interview Answer + Memory Aid</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <p style="font-size:.95rem;line-height:1.8"><strong>Latency</strong> measures the time taken to process a single request. <strong>Throughput</strong> measures the amount of work a system can process per unit of time.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;margin-top:10px">
          Latency &nbsp;&nbsp;&nbsp;→ ms/request<br>
          Throughput → requests/second
        </div>
        <p style="margin-top:10px;font-size:.88rem;color:var(--text2)">A good system design doesn't always minimize latency at any cost. It <strong>balances latency, throughput, consistency, availability, reliability, and cost</strong> according to requirements.</p>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Amazon — Every 100ms Costs 1% Sales</div>
        <p>Amazon found that every 100ms of latency costs 1% in sales. Google found 500ms delay reduces traffic by 20%. This is why CDNs, caching, and edge computing exist — to slash latency for global users.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Netflix — p99 Monitoring at Scale</div>
        <p>Netflix monitors p99 latency across all 700+ microservices. A p99 spike in the Playback service (even at 1% of requests) means millions of users see buffering. They set SLAs at p99 not average — and auto-alert when any service breaches its p99 threshold. At 250M+ subscribers, 1% is 2.5 million people.</p>
      </div>

      ${navButtons(this)}`;
    initLatencyCanvas();
  }
},

// ── CAP THEOREM ───────────────────────────────────────────────
cap: {
  title: "CAP Theorem",
  badge: "Foundations", badgeClass: "badge-foundations",
  subtitle: "When a network partition happens in a distributed system, you must choose between Consistency and Availability. CAP explains this fundamental trade-off.",
  prev: "latency", next: "load-balancing",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">🔺 What is CAP Theorem?</div>
      <div class="card">
        <p>CAP stands for <strong>Consistency, Availability, Partition Tolerance</strong>.</p>
        <p style="margin-top:8px">The core idea: <strong>when a network partition happens, a distributed system must choose between Consistency and Availability.</strong></p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          C → Consistency<br>
          A → Availability<br>
          P → Partition Tolerance
        </div>
        <p style="margin-top:8px"><strong>CAP is not simply "choose any 2 of 3."</strong> The important part is what happens <em>during a network partition</em>.</p>
      </div>

      <div class="section-title">🌐 Why Do We Need CAP? — The Partition Scenario</div>
      <div class="card">
        <h3>Two database servers normally communicate:</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          S1 ←──── Network ────→ S2<br>
          (synchronized, same data)
        </div>
        <h3 style="margin-top:12px">Network connection breaks → Network Partition:</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;border-color:var(--red)">
          S1 &nbsp;&nbsp;&nbsp;❌&nbsp;&nbsp;&nbsp; S2<br>
          │ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
          Users &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Users
        </div>
        <p style="margin-top:8px">Both servers are alive. But they <strong>cannot communicate</strong>. Now the system faces a hard decision.</p>
      </div>

      <div class="section-title">🔺 The Three Properties</div>
      <div class="anim-container">
        <div class="anim-label">Click a combination to see which systems choose that trade-off</div>
        <canvas id="capCanvas" height="260"></canvas>
        <div id="capInfo" class="cap-info">Select a combination to see what database systems choose this trade-off.</div>
        <div class="anim-controls">
          <button class="anim-btn" onclick="selectCAP('CA')">CA</button>
          <button class="anim-btn" onclick="selectCAP('CP')">CP</button>
          <button class="anim-btn" onclick="selectCAP('AP')">AP</button>
        </div>
      </div>

      <div class="card">
        <h3>🔵 C — Consistency</h3>
        <p>Every successful read gets the most recent valid data. No stale or conflicting state.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;margin-top:8px">
          Balance = ₹8,000 after withdrawal<br>
          All nodes must agree: ₹8,000 (not ₹10,000)
        </div>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>🟢 A — Availability</h3>
        <p>Every request to a non-failing node receives a response — even if some nodes are unreachable.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;margin-top:8px">
          S1 ❌ &nbsp;&nbsp; S2 ✅ &nbsp;&nbsp; S3 ✅<br>
          User → S2 → Response ✅ &nbsp;&nbsp;(availability preserved)<br>
          Note: response may not have the latest data
        </div>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>🟡 P — Partition Tolerance</h3>
        <p>The system continues operating despite a network communication failure between nodes.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;margin-top:8px">
          S1 ✅ &nbsp;&nbsp;&nbsp;❌ network ❌&nbsp;&nbsp;&nbsp; S2 ✅<br>
          Both servers alive — just can't talk to each other.<br>
          <strong>In real distributed systems, P is always required.</strong>
        </div>
      </div>

      <div class="section-title">⚖️ The Core Trade-off — During a Partition</div>
      <div class="card">
        <h3>PLAYKERS Bank Example</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          S1 ←──❌──→ S2 &nbsp;&nbsp;(network partition)<br><br>
          User A withdraws ₹2,000 on S1<br>
          S1: ₹10,000 → ₹8,000<br>
          S1 cannot tell S2 about this<br><br>
          User B asks S2: "What is the balance?"<br>
          S2 still has: ₹10,000 (stale!)
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px">
          <div style="background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.3);border-radius:8px;padding:12px">
            <h4 style="color:#3b82f6">CP choice</h4>
            <p style="font-size:.82rem;color:var(--text2);margin-top:6px">S2 rejects the request: "Cannot safely process — partition in progress."<br><br>✅ Consistency preserved<br>❌ Availability reduced</p>
          </div>
          <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:12px">
            <h4 style="color:#22c55e">AP choice</h4>
            <p style="font-size:.82rem;color:var(--text2);margin-top:6px">S2 responds with ₹10,000 (may be stale).<br>After network recovers → reconcile.<br><br>✅ Availability preserved<br>❌ Temporary inconsistency</p>
          </div>
        </div>
      </div>

      <div class="section-title">🔵 CP Systems — Consistency + Partition Tolerance</div>
      <div class="card">
        <p>During a network partition, the system may reject or delay requests rather than return stale data.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:1.9">
          Consistency ✅ &nbsp;Partition Tolerance ✅ &nbsp;Availability during partition ❌/reduced
        </div>
        <p style="margin-top:8px"><strong>When to choose CP:</strong> financial systems, inventory, anywhere stale data = wrong decision.</p>
        <p style="margin-top:6px"><strong>Examples:</strong> <span class="tag tag-blue">HBase</span> <span class="tag tag-blue">Zookeeper</span> <span class="tag tag-blue">MongoDB (strong consistency mode)</span> <span class="tag tag-blue">etcd</span></p>
      </div>

      <div class="section-title">🟢 AP Systems — Availability + Partition Tolerance</div>
      <div class="card">
        <p>During a partition, nodes keep responding even if data may temporarily differ. After the network heals, the system reconciles (eventual consistency).</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          User → S1 → Response ✅ (may have old data)<br>
          User → S2 → Response ✅ (may have old data)<br>
          Network recovers → S1 ←──→ S2 → reconcile
        </div>
        <p style="margin-top:8px"><strong>When to choose AP:</strong> social feeds, like counters, shopping carts — where brief staleness is acceptable.</p>
        <p style="margin-top:6px"><strong>Examples:</strong> <span class="tag tag-green">Cassandra</span> <span class="tag tag-green">DynamoDB</span> <span class="tag tag-green">CouchDB</span> <span class="tag tag-green">Riak</span></p>
      </div>

      <div class="section-title">🤔 What About CA?</div>
      <div class="card">
        <p>CA (Consistency + Availability) is meaningful only when partitioning is not in the model — like a single-node database or a system assuming perfectly reliable networking.</p>
        <div class="highlight">In a <em>truly distributed</em> system, you cannot ignore network partitions. So distributed systems face the CP vs AP choice, not CA.</div>
        <p style="margin-top:8px"><strong>Examples:</strong> <span class="tag tag-purple">MySQL (single node)</span> <span class="tag tag-purple">PostgreSQL (single node)</span> — only CA within a single server.</p>
      </div>

      <div class="section-title">📊 CAP Decision Tree</div>
      <div class="card">
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Network Partition occurs?<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Can I keep responding to users?<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↘<br>
          YES → AP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NO → CP<br>
          (serve stale) &nbsp;&nbsp;&nbsp;(reject/wait)
        </div>
        <p style="margin-top:8px">Both choices include <strong>Partition Tolerance</strong> — that's the condition that forces the trade-off.</p>
      </div>

      <div class="section-title">⚠️ Common Misconceptions</div>
      <div class="card">
        <table class="compare-table">
          <tr><th>❌ Wrong</th><th>✅ Correct</th></tr>
          <tr><td>"Choose exactly 2 of 3 at startup"</td><td>It's about behaviour during a network partition</td></tr>
          <tr><td>"AP means data is always inconsistent"</td><td>AP means eventually consistent — reconciles after partition heals</td></tr>
          <tr><td>"CP means entire system is unavailable"</td><td>CP may reduce availability only during the partition</td></tr>
          <tr><td>Server failure = network partition</td><td>Partition = servers alive but can't communicate</td></tr>
        </table>
      </div>

      <div class="section-title">🔗 CAP vs ACID, Replication, Quorum</div>
      <div class="card">
        <table class="compare-table">
          <tr><th>Concept</th><th>What it describes</th></tr>
          <tr><td><span class="tag tag-blue">CAP</span></td><td>Trade-off between consistency and availability during a partition</td></tr>
          <tr><td><span class="tag tag-green">ACID</span></td><td>Transaction properties: Atomicity, Consistency, Isolation, Durability</td></tr>
          <tr><td><span class="tag tag-yellow">Replication</span></td><td>Multiple copies of data → introduces CAP trade-off between nodes</td></tr>
          <tr><td><span class="tag tag-purple">Quorum</span></td><td>Mechanism to coordinate reads/writes across replicas (W+R &gt; N)</td></tr>
        </table>
        <div class="highlight" style="margin-top:10px">Note: "Consistency" in ACID and "Consistency" in CAP mean different things. Don't confuse them.</div>
      </div>

      <div class="section-title">🧠 One-Line Interview Answer</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <p style="font-size:.95rem;line-height:1.8"><strong>CAP theorem states that when a network partition occurs in a distributed system, you cannot simultaneously guarantee strong consistency and availability — you must make a trade-off between them.</strong></p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;margin-top:10px">
          Replication → Multiple nodes → Network partition<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CP or AP trade-off<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Quorum / consistency model
        </div>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Amazon DynamoDB — AP by Default</div>
        <p>DynamoDB is AP by default — every node responds even during a partition, offering eventual consistency. If you need strong consistency, you can request it per-read (higher latency cost). Amazon chose AP because their shopping cart must always be writable — it's worse to tell a customer "can't add to cart" than to briefly show a slightly stale cart.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Apache Zookeeper — CP</div>
        <p>Zookeeper is used for distributed coordination (leader election, service registry). It is CP — during a partition, it stops accepting writes to preserve consistency. This is correct for its use case: you'd rather have Zookeeper temporarily unavailable than have two leaders elected simultaneously, which would corrupt the cluster state.</p>
      </div>

      ${navButtons(this)}`;
    initCAPCanvas();
  }
},
// ── LOAD BALANCING ─────────────────────────────────────────────
"load-balancing": {
  title: "Load Balancing",
  badge: "Core Concepts", badgeClass: "badge-core",
  subtitle: "A load balancer distributes incoming network traffic across multiple servers to ensure no single server becomes overwhelmed.",
  prev: "cap", next: "consistent-hashing",
  render(c) {
    c.innerHTML = `
      ${hero(this)}
      <div class="section-title">⚖️ How It Works</div>
      <div class="anim-container">
        <div class="anim-label">Live Load Balancer Simulation</div>
        <canvas id="lbCanvas" height="220"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="setLBAlgo('round-robin')">Round Robin</button>
          <button class="anim-btn" onclick="setLBAlgo('least-conn')">Least Connections</button>
          <button class="anim-btn" onclick="setLBAlgo('ip-hash')">IP Hash</button>
          <button class="anim-btn" onclick="sendLBRequest()">Send Request</button>
        </div>
        <div id="lbStatus" style="font-size:.8rem;color:var(--text3);margin-top:8px;min-height:18px;"></div>
      </div>
      <div class="section-title">🧮 Load Balancing Algorithms</div>
      <table class="compare-table">
        <tr><th>Algorithm</th><th>How it works</th><th>Best for</th></tr>
        <tr><td><span class="tag tag-blue">Round Robin</span></td><td>Requests cycle through servers in order</td><td>Uniform request weight</td></tr>
        <tr><td><span class="tag tag-green">Weighted RR</span></td><td>Servers get traffic proportional to weight</td><td>Different server capacities</td></tr>
        <tr><td><span class="tag tag-yellow">Least Connections</span></td><td>Next server with fewest active connections</td><td>Variable request duration</td></tr>
        <tr><td><span class="tag tag-purple">IP Hash</span></td><td>Client IP determines server (sticky sessions)</td><td>Session-based apps</td></tr>
        <tr><td><span class="tag tag-cyan">Random</span></td><td>Random server selection</td><td>Stateless, uniform servers</td></tr>
      </table>
      <div class="section-title">🏗️ Layer 4 vs Layer 7</div>
      <div class="card">
        <h3>Layer 4 (Transport)</h3>
        <p>Operates on TCP/UDP. Faster, simpler. Routes by IP and port. Cannot read HTTP content.</p>
        <p>Examples: <span class="tag tag-blue">AWS NLB</span> <span class="tag tag-blue">HAProxy (TCP mode)</span></p>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>Layer 7 (Application)</h3>
        <p>Reads HTTP headers, cookies, URLs. Enables content-based routing, SSL termination, A/B testing.</p>
        <p>Examples: <span class="tag tag-purple">AWS ALB</span> <span class="tag tag-purple">Nginx</span> <span class="tag tag-purple">Cloudflare</span></p>
      </div>
      <div class="real-world">
        <div class="real-world-title">🌍 Real-World Example</div>
        <p><strong>Netflix</strong> uses a multi-tier load balancing setup: Zuul (edge gateway) at the front, then Ribbon (client-side load balancer) between microservices. Their Eureka service registry tells Ribbon which instances are healthy. This handles 250 million+ subscribers streaming simultaneously.</p>
      </div>
      <div class="section-title">❤️ Health Checks</div>
      <div class="card">
        <p>Load balancers periodically ping servers. If a server fails to respond within <code>timeout</code>, it's marked unhealthy and removed from rotation. When it recovers, it rejoins automatically.</p>
      </div>
      ${navButtons(this)}`;
    initLBCanvas();
  }
},

// ── CONSISTENT HASHING ─────────────────────────────────────────
"consistent-hashing": {
  title: "Consistent Hashing + Virtual Nodes",
  badge: "Core Concepts", badgeClass: "badge-core",
  subtitle: "Consistent hashing places both servers and keys on a circular hash ring. Virtual nodes give each physical server multiple ring positions — solving uneven distribution without extra hardware.",
  prev: "load-balancing", next: "caching",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <!-- ①  WHY SIMPLE HASHING BREAKS -->
      <div class="section-title">⚡ Step 1 — The Problem: Simple Hashing</div>
      <div class="card">
        <h3>hash(key) % N breaks when N changes</h3>
        <p>With 3 servers, <code>hash("user123") % 3 = 1</code> → Server 1.<br>
        Add a 4th server: <code>hash("user123") % 4 = 3</code> → Server 3.<br>
        The key moved! Now every cached item on every server is <strong>wrong</strong>.</p>
        <div class="highlight">Going from 10 → 11 servers with modulo hashing: ~91% of all keys must be remapped. Your cache becomes useless instantly.</div>
      </div>
      <div class="anim-container">
        <div class="anim-label">Simple Hashing Failure — watch what happens when you add a server</div>
        <canvas id="chSimpleCanvas" height="180"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="chSimpleDemo(3)">3 Servers</button>
          <button class="anim-btn" onclick="chSimpleDemo(4)">Add 4th Server</button>
          <button class="anim-btn" onclick="chSimpleDemo(5)">Add 5th Server</button>
        </div>
        <div id="chSimpleInfo" style="font-size:.82rem;margin-top:8px;min-height:36px;padding:8px;background:var(--bg);border-radius:6px;"></div>
      </div>

      <!-- ②  THE RING CONCEPT -->
      <div class="section-title">💍 Step 2 — The Hash Ring</div>
      <div class="card">
        <h3>Bend the number line into a circle (0 → 360°)</h3>
        <p>Instead of a line, imagine a <strong>circular hash space</strong> 0–360. Both servers and keys are placed on this ring using a hash function.</p>
        <ul>
          <li><strong>S1</strong> hashes to position <code>10</code></li>
          <li><strong>S2</strong> hashes to position <code>45</code></li>
          <li><strong>S3</strong> hashes to position <code>80</code></li>
        </ul>
        <p style="margin-top:8px">To find which server owns a key: <strong>hash the key → place on ring → walk clockwise → first server you hit = owner</strong>.</p>
      </div>
      <div class="anim-container">
        <div class="anim-label">Key Lookup Animation — click a key to watch it find its server</div>
        <canvas id="chRingCanvas" height="310"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="chLookupKey('user123',30)">Lookup "user123" (pos 30)</button>
          <button class="anim-btn" onclick="chLookupKey('user456',60)">Lookup "user456" (pos 60)</button>
          <button class="anim-btn" onclick="chLookupKey('user789',5)">Lookup "user789" (pos 5)</button>
          <button class="anim-btn" onclick="chLookupKey('order99',88)">Lookup "order99" (pos 88)</button>
        </div>
        <div id="chRingInfo" style="font-size:.82rem;margin-top:8px;min-height:36px;padding:8px;background:var(--bg);border-radius:6px;color:var(--text2);"></div>
      </div>

      <!-- ③  UNEVEN DISTRIBUTION PROBLEM -->
      <div class="section-title">⚠️ Step 3 — The Problem: Uneven Distribution</div>
      <div class="card">
        <h3>3 servers, 3 positions — massive imbalance possible</h3>
        <p>If your 3 servers happen to hash close together, one server ends up responsible for a huge arc of the ring — and therefore most of the keys.</p>
        <div class="highlight">S1=10, S2=20, S3=90<br>
        S1 owns: 90→10 = 10% of ring<br>
        S2 owns: 10→20 = 10% of ring<br>
        S3 owns: 20→90 = <strong style="color:var(--red)">70% of ring → S3 is overloaded!</strong></div>
      </div>
      <div class="anim-container">
        <div class="anim-label">Uneven vs Even Distribution — compare arc ownership</div>
        <canvas id="chUnevenCanvas" height="260"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="chShowDistrib('uneven')">Uneven (no vnodes)</button>
          <button class="anim-btn" onclick="chShowDistrib('even')">Even (with vnodes)</button>
        </div>
        <div id="chUnevenInfo" style="font-size:.82rem;margin-top:8px;min-height:36px;padding:8px;background:var(--bg);border-radius:6px;color:var(--text2);"></div>
      </div>

      <!-- ④  VIRTUAL NODES SOLUTION -->
      <div class="section-title">🔮 Step 4 — Virtual Nodes: The Fix</div>
      <div class="card">
        <h3>Give each physical server multiple positions on the ring</h3>
        <p>Instead of S1 appearing once, it appears as <strong>S1-A, S1-B, S1-C</strong> at different positions. These are <em>not</em> extra hardware — they are <strong>logical ownership points</strong>.</p>
      </div>
      <div class="anim-container" style="padding:16px 20px;">
        <div class="anim-label">Physical vs Virtual — the mapping</div>
        <canvas id="chVnodeMapCanvas" height="200"></canvas>
      </div>
      <div class="card" style="margin-top:12px">
        <h3>The pizza analogy 🍕</h3>
        <p><strong>Without vnodes:</strong> each server gets one large slice — slices are unequal because positions are random.<br>
        <strong>With vnodes:</strong> each server gets many small slices spread around the pizza — much more equal.</p>
      </div>
      <div class="anim-container">
        <div class="anim-label">Virtual Node Ring — S1, S2, S3 each with 3 vnodes (S?-A, S?-B, S?-C)</div>
        <canvas id="chVnodeRingCanvas" height="320"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="chVnodeLookup('user123',25)">Lookup "user123" (25)</button>
          <button class="anim-btn" onclick="chVnodeLookup('order99',42)">Lookup "order99" (42)</button>
          <button class="anim-btn" onclick="chVnodeLookup('cart55',75)">Lookup "cart55" (75)</button>
          <button class="anim-btn" onclick="chToggleVnodes()">Toggle Vnodes On/Off</button>
        </div>
        <div id="chVnodeInfo" style="font-size:.82rem;margin-top:8px;min-height:36px;padding:8px;background:var(--bg);border-radius:6px;color:var(--text2);"></div>
      </div>

      <!-- ⑤  ADD / REMOVE SERVER -->
      <div class="section-title">� Step 5 — Adding & Removing Servers</div>
      <div class="card">
        <h3>Why only a small fraction of keys move</h3>
        <p>When S4 is added with vnodes S4-A, S4-B, S4-C, each virtual node only "steals" the keys in its small clockwise arc from the previous vnode — a fraction of one server's total keys. Without vnodes, adding S4 might steal half of S3's keys all at once.</p>
      </div>
      <div class="anim-container">
        <div class="anim-label">Live Ring — Add / Remove servers and watch key reassignment</div>
        <canvas id="chCanvas" height="320"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="addCHNode()">+ Add Server</button>
          <button class="anim-btn" onclick="removeCHNode()">− Remove Server</button>
          <button class="anim-btn" onclick="addCHKey()">+ Add Key</button>
          <button class="anim-btn" onclick="resetCH()">Reset</button>
        </div>
        <div id="chInfo" style="font-size:.82rem;margin-top:8px;min-height:36px;padding:8px;background:var(--bg);border-radius:6px;color:var(--text2);"></div>
      </div>

      <!-- ⑥  WEIGHTED VNODES -->
      <div class="section-title">⚖️ Step 6 — Weighted Distribution</div>
      <div class="card">
        <h3>Bigger servers get more vnodes</h3>
        <p>If S3 has 32 GB RAM while S1 and S2 have 16 GB each, you give S3 twice as many virtual nodes — so it handles ~twice the traffic proportionally.</p>
      </div>
      <div class="anim-container">
        <div class="anim-label">Weighted Vnodes — S3 has 2× capacity → 2× vnodes</div>
        <canvas id="chWeightCanvas" height="260"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="chWeightDemo('equal')">Equal Capacity</button>
          <button class="anim-btn" onclick="chWeightDemo('weighted')">S3 = 2× Capacity</button>
        </div>
        <div id="chWeightInfo" style="font-size:.82rem;margin-top:8px;min-height:36px;padding:8px;background:var(--bg);border-radius:6px;color:var(--text2);"></div>
      </div>

      <!-- ⑦  COMPARISON TABLE -->
      <div class="section-title">📊 Summary Comparison</div>
      <table class="compare-table">
        <tr><th>Aspect</th><th>Simple (hash % N)</th><th>Consistent Hashing</th><th>+ Virtual Nodes</th></tr>
        <tr><td>Add server</td><td style="color:var(--red)">~100% remapped</td><td>Only 1/N keys move</td><td style="color:var(--green)">Even smaller portions from many servers</td></tr>
        <tr><td>Remove server</td><td style="color:var(--red)">~100% remapped</td><td>Keys go to one neighbor</td><td style="color:var(--green)">Spread across multiple servers</td></tr>
        <tr><td>Distribution</td><td>Even (by math)</td><td style="color:var(--yellow)">Can be uneven</td><td style="color:var(--green)">Near-uniform</td></tr>
        <tr><td>Hotspots</td><td>Unlikely</td><td style="color:var(--red)">Possible</td><td style="color:var(--green)">Minimized</td></tr>
        <tr><td>Weighted servers</td><td>Not native</td><td>Manual</td><td style="color:var(--green)">More vnodes = more share</td></tr>
        <tr><td>Used in</td><td>Simple KV stores</td><td>Early Dynamo</td><td style="color:var(--cyan)">Cassandra, DynamoDB, Redis Cluster</td></tr>
      </table>

      <!-- ⑧  REAL WORLD -->
      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Cassandra at Netflix</div>
        <p>Netflix uses Apache Cassandra with virtual nodes for their viewing history, user profiles, and recommendations. Each physical node gets 256 virtual tokens (vnodes) on the ring. When Netflix adds capacity during peak streaming (Super Bowl halftime, finale nights), the new nodes each grab 256 small ranges from <em>all</em> existing nodes — load redistributes evenly across the cluster in minutes, with zero downtime.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Amazon DynamoDB</div>
        <p>DynamoDB uses consistent hashing internally to partition data across its storage nodes. The partition key of every item is hashed onto the ring. Virtual nodes ensure that even a cluster with thousands of nodes stays balanced. When AWS adds hardware to a DynamoDB region, your application notices no disruption — only a small fraction of partitions migrate.</p>
      </div>

      <!-- ⑦  DATA SHARDING + CONSISTENT HASHING LIVE DEMO -->
      <div class="section-title">🗄️ Step 7 — Data Sharding Meets Consistent Hashing</div>
      <div class="card">
        <h3>The full picture: data sharding on a vnode ring</h3>
        <p>Each server owns arcs of the ring and stores the data whose keys hash into those arcs — that <em>is</em> sharding. Watch the simulation below:</p>
        <ul>
          <li>Servers <strong>A, B, C</strong> each have 3 vnodes spreading their arcs evenly</li>
          <li>Incoming records stream in and fill each server's shard</li>
          <li>When all three servers hit capacity, <strong>Server D</strong> joins the ring</li>
          <li>D's vnodes carve out small arcs from A, B and C — only those records migrate</li>
          <li>The result: load is balanced again with <strong>minimal data movement</strong></li>
        </ul>
      </div>
      <div class="anim-container">
        <div class="anim-label">Live Shard Fill → Server D Joins → Data Migrates</div>
        <canvas id="chShardCanvas" height="420"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active"  id="chShardPlayBtn"  onclick="chShardControl('play')">▶ Play</button>
          <button class="anim-btn"         id="chShardPauseBtn" onclick="chShardControl('pause')">⏸ Pause</button>
          <button class="anim-btn"         onclick="chShardControl('reset')">↺ Reset</button>
          <button class="anim-btn"         onclick="chShardControl('skip')">⏩ Skip to Full</button>
        </div>
        <div id="chShardInfo" style="font-size:.83rem;margin-top:8px;min-height:44px;padding:10px 12px;background:var(--bg);border-radius:6px;color:var(--text2);line-height:1.6;"></div>
      </div>
      <div class="card" style="margin-top:12px">
        <h3>Why this matters for real databases</h3>
        <p>This is exactly how <strong>Cassandra, DynamoDB, and Redis Cluster</strong> work internally. Each shard is called a <em>partition</em> (Cassandra) or <em>slot</em> (Redis). When you add a node, only the data in its new vnodes' arcs moves — not the entire dataset.</p>
        <div class="highlight">Redis Cluster uses 16,384 hash slots. Adding a node reassigns only a proportional subset of slots — the rest stay put, keeping your cluster online with zero downtime.</div>
      </div>

      <!-- ⑧  COMPARISON TABLE -->
      <div class="section-title">📊 Summary Comparison</div>
      <table class="compare-table">
        <tr><th>Aspect</th><th>Simple (hash % N)</th><th>Consistent Hashing</th><th>+ Virtual Nodes</th></tr>
        <tr><td>Add server</td><td style="color:var(--red)">~100% remapped</td><td>Only 1/N keys move</td><td style="color:var(--green)">Even smaller portions from many servers</td></tr>
        <tr><td>Remove server</td><td style="color:var(--red)">~100% remapped</td><td>Keys go to one neighbor</td><td style="color:var(--green)">Spread across multiple servers</td></tr>
        <tr><td>Distribution</td><td>Even (by math)</td><td style="color:var(--yellow)">Can be uneven</td><td style="color:var(--green)">Near-uniform</td></tr>
        <tr><td>Hotspots</td><td>Unlikely</td><td style="color:var(--red)">Possible</td><td style="color:var(--green)">Minimized</td></tr>
        <tr><td>Weighted servers</td><td>Not native</td><td>Manual</td><td style="color:var(--green)">More vnodes = more share</td></tr>
        <tr><td>Used in</td><td>Simple KV stores</td><td>Early Dynamo</td><td style="color:var(--cyan)">Cassandra, DynamoDB, Redis Cluster</td></tr>
      </table>

      <!-- ⑨  REAL WORLD -->
      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Cassandra at Netflix</div>
        <p>Netflix uses Apache Cassandra with virtual nodes for their viewing history, user profiles, and recommendations. Each physical node gets 256 virtual tokens (vnodes) on the ring. When Netflix adds capacity during peak streaming (Super Bowl halftime, finale nights), the new nodes each grab 256 small ranges from <em>all</em> existing nodes — load redistributes evenly across the cluster in minutes, with zero downtime.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Amazon DynamoDB</div>
        <p>DynamoDB uses consistent hashing internally to partition data across its storage nodes. The partition key of every item is hashed onto the ring. Virtual nodes ensure that even a cluster with thousands of nodes stays balanced. When AWS adds hardware to a DynamoDB region, your application notices no disruption — only a small fraction of partitions migrate.</p>
      </div>

      <!-- ONE-LINER TO REMEMBER -->
      <div class="section-title">🧠 One Line to Remember</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <p style="font-size:1rem;line-height:1.7"><strong>Virtual nodes</strong> are multiple logical positions of the same physical server on a consistent-hashing ring — they improve key distribution, eliminate hotspots, and make rebalancing smooth when servers are added or removed.</p>
      </div>

      ${navButtons(this)}`;

    initCHSimpleCanvas(3);
    initCHRingCanvas();
    initCHUnevenCanvas('uneven');
    initCHVnodeMapCanvas();
    initCHVnodeRingCanvas();
    initCHCanvas();
    initCHWeightCanvas('equal');
    initCHShardCanvas();
  }
},

// ── CACHING ────────────────────────────────────────────────────
caching: {
  title: "Caching",
  badge: "Core Concepts", badgeClass: "badge-core",
  subtitle: "Caching stores copies of frequently accessed data in fast storage to reduce latency and database load. A well-designed cache layer can absorb 95%+ of reads.",
  prev: "consistent-hashing", next: "cdn",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">💾 Cache Hit vs Miss</div>
      <div class="anim-container">
        <div class="anim-label">Cache Simulation — Hit saves ~150ms, Miss costs a DB round-trip</div>
        <canvas id="cacheCanvas" height="200"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="simulateCache('hit')">Simulate Cache Hit</button>
          <button class="anim-btn" onclick="simulateCache('miss')">Simulate Cache Miss</button>
          <button class="anim-btn" onclick="resetCache()">Reset Stats</button>
        </div>
        <div id="cacheStats" style="margin-top:10px;display:flex;gap:20px;font-size:.85rem;">
          <span>Hits: <strong id="cacheHits" style="color:var(--green)">0</strong></span>
          <span>Misses: <strong id="cacheMisses" style="color:var(--red)">0</strong></span>
          <span>Hit Rate: <strong id="cacheRate" style="color:var(--cyan)">0%</strong></span>
        </div>
      </div>

      <div class="section-title">🏗️ Cache Layers — Where Caches Live</div>
      <table class="compare-table">
        <tr><th>Layer</th><th>Location</th><th>Latency</th><th>Example</th></tr>
        <tr><td><span class="tag tag-green">L1 — CPU</span></td><td>On-chip, per core</td><td>~1 ns</td><td>Hardware managed</td></tr>
        <tr><td><span class="tag tag-blue">L2 — App</span></td><td>In-process memory</td><td>~100 ns</td><td>Guava Cache, Caffeine</td></tr>
        <tr><td><span class="tag tag-purple">L3 — Distributed</span></td><td>Shared across servers</td><td>~1 ms</td><td>Redis, Memcached</td></tr>
        <tr><td><span class="tag tag-yellow">L4 — CDN</span></td><td>Edge nodes globally</td><td>~10 ms</td><td>Cloudflare, Fastly</td></tr>
        <tr><td><span class="tag tag-cyan">L5 — Browser</span></td><td>Client machine</td><td>~0 ms</td><td>HTTP Cache-Control</td></tr>
      </table>

      <div class="section-title">📦 Eviction Policies</div>
      <table class="compare-table">
        <tr><th>Policy</th><th>Evicts</th><th>Best For</th><th>Real Use</th></tr>
        <tr><td><span class="tag tag-purple">LRU</span></td><td>Least Recently Used</td><td>General workloads</td><td>Redis default, Linux page cache</td></tr>
        <tr><td><span class="tag tag-blue">LFU</span></td><td>Least Frequently Used</td><td>Stable hotspot data</td><td>Redis 4.0+ LFU mode</td></tr>
        <tr><td><span class="tag tag-green">FIFO</span></td><td>Oldest insertion</td><td>Time-ordered streams</td><td>Log buffers, queues</td></tr>
        <tr><td><span class="tag tag-yellow">TTL</span></td><td>Expired by time</td><td>Session, rate limits</td><td>JWT tokens, OTP codes</td></tr>
        <tr><td><span class="tag tag-cyan">ARC</span></td><td>Adaptive (recency + freq)</td><td>Mixed access patterns</td><td>ZFS, Solaris</td></tr>
      </table>

      <div class="section-title">🏗️ Cache Write Patterns</div>
      <div class="card">
        <h3>① Cache-Aside (Lazy Loading) — most common</h3>
        <p>App checks cache → miss → read DB → write to cache → return data.</p>
        <div class="highlight">Read flow: <code>GET /user/42</code> → check Redis → miss → query Postgres → SET redis user:42 → respond<br>
        Used by: Twitter timelines, GitHub repo metadata, Shopify product pages</div>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>② Write-Through — always consistent</h3>
        <p>Every write goes to cache AND DB at the same time. Reads are always cache hits. Slower writes, but no stale data.</p>
        <div class="highlight">Used by: Banking apps, inventory systems where stale data is unacceptable</div>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>③ Write-Behind (Write-Back) — fastest writes</h3>
        <p>Write only to cache, asynchronously flush to DB in batches. Fastest writes, but crash = data loss.</p>
        <div class="highlight">Used by: Analytics event buffers, click counters, game leaderboards (Discord uses this for message counts)</div>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>④ Read-Through — transparent caching</h3>
        <p>Cache sits in front of DB. On miss, cache itself fetches from DB and populates itself. App only talks to cache.</p>
        <div class="highlight">Used by: AWS ElastiCache with DAX (DynamoDB Accelerator), Hibernate 2nd-level cache</div>
      </div>

      <div class="section-title">⚠️ Cache Failure Patterns & Fixes</div>
      <div class="card">
        <h3>🔥 Cache Stampede (Thundering Herd)</h3>
        <p>A hot key expires. 10,000 requests miss simultaneously and all hammer the DB.</p>
        <p><strong>Fix 1 — Mutex/Lock:</strong> only one request fetches from DB, others wait for cache to repopulate.<br>
        <strong>Fix 2 — Probabilistic Early Expiration (PER):</strong> randomly refresh the key slightly before it expires.<br>
        <strong>Fix 3 — Cache Warming:</strong> pre-populate on deploy, never let it go cold.</p>
        <div class="highlight">Slack uses probabilistic early refresh on workspace metadata to prevent stampedes during deploy rollouts.</div>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>🕳️ Cache Penetration</h3>
        <p>Requests for keys that <em>never exist</em> in DB (e.g., <code>user:-1</code>) bypass cache every time and slam DB.</p>
        <p><strong>Fix — Bloom Filter:</strong> a probabilistic data structure that answers "definitely not in DB" in O(1). If bloom filter says NO, return 404 immediately without hitting DB or cache.</p>
        <div class="highlight">Akamai uses bloom filters at edge to block non-existent asset requests before they hit origin.</div>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>🌊 Cache Avalanche</h3>
        <p>Massive batch of keys all expire at the same moment → DB gets flooded.</p>
        <p><strong>Fix — TTL Jitter:</strong> add random offset to TTLs so they don't all expire simultaneously.<br>
        <code>TTL = base_ttl + random(0, base_ttl * 0.2)</code></p>
      </div>

      <div class="section-title">🔑 Redis Deep-Dive — Data Structures</div>
      <table class="compare-table">
        <tr><th>Structure</th><th>Command</th><th>Real Use Case</th></tr>
        <tr><td><span class="tag tag-blue">String</span></td><td><code>SET/GET</code></td><td>Session tokens, feature flags, counters</td></tr>
        <tr><td><span class="tag tag-green">Hash</span></td><td><code>HSET/HGET</code></td><td>User profile objects (field-level updates)</td></tr>
        <tr><td><span class="tag tag-yellow">Sorted Set</span></td><td><code>ZADD/ZRANGE</code></td><td>Leaderboards, rate limiting with timestamps</td></tr>
        <tr><td><span class="tag tag-purple">List</span></td><td><code>LPUSH/LRANGE</code></td><td>Activity feed, task queues (Twitter timeline)</td></tr>
        <tr><td><span class="tag tag-red">Bitmap</span></td><td><code>SETBIT/BITCOUNT</code></td><td>Daily active users, feature rollout flags</td></tr>
        <tr><td><span class="tag tag-cyan">HyperLogLog</span></td><td><code>PFADD/PFCOUNT</code></td><td>Unique visitor counts (12 KB for billions of items)</td></tr>
      </table>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Discord — Redis at Scale</div>
        <p>Discord stores <strong>online presence</strong> (which users are online in which server) entirely in Redis sorted sets. With 19M+ concurrent users, Redis handles ~15M reads/second. They run Redis in cluster mode across 12 shards. Each user's guild memberships, roles, and voice state are cached — never hitting Cassandra for hot reads.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: GitHub — Memcached + Fragment Caching</div>
        <p>GitHub uses Memcached for fragment caching of rendered HTML partials (repository file trees, commit diffs). A repository page can involve 50+ DB queries — with fragment caching, most pages are assembled from pre-rendered cache entries in &lt;5ms. Cache keys are namespaced by content hash so invalidation is exact.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Facebook — TAO (The Associations and Objects)</div>
        <p>Facebook built TAO — a distributed cache on top of MySQL — specifically for social graph data. TAO uses a two-tier architecture: regional leader caches and local follower caches. It serves <strong>billions of graph reads per second</strong> with sub-millisecond latency, using LRU eviction and write-through to MySQL.</p>
      </div>

      ${navButtons(this)}`;
    initCacheCanvas();
  }
},

// ── CDN ─────────────────────────────────────────────────────────
cdn: {
  title: "Content Delivery Network (CDN)",
  badge: "Core Concepts", badgeClass: "badge-core",
  subtitle: "A CDN is a geographically distributed network of servers that caches content close to end users, reducing latency from 200ms to under 10ms.",
  prev: "caching", next: "websocket",
  render(c) {
    c.innerHTML = `
      ${hero(this)}
      <div class="section-title">🌍 CDN Architecture</div>
      <div class="anim-container">
        <div class="anim-label">CDN Edge Node Distribution — click Simulate to route a request</div>
        <canvas id="cdnCanvas" height="240"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="simulateCDN()">Simulate Request</button>
        </div>
      </div>
      <div class="card">
        <h3>How CDNs Work — Step by Step</h3>
        <ol style="padding-left:18px;line-height:2">
          <li>User requests <code>img.example.com/photo.jpg</code></li>
          <li>DNS resolves to <strong>nearest CDN PoP</strong> (via Anycast or GeoDNS)</li>
          <li>Edge checks its cache → <strong>HIT</strong>: serve in ~5ms. <strong>MISS</strong>: fetch from origin</li>
          <li>Edge caches the asset with TTL from <code>Cache-Control</code> header</li>
          <li>All subsequent users in that region get the cached copy</li>
        </ol>
      </div>

      <div class="section-title">📤 Push CDN vs Pull CDN</div>
      <table class="compare-table">
        <tr><th>Type</th><th>How it works</th><th>Best for</th><th>Example</th></tr>
        <tr><td><span class="tag tag-blue">Pull CDN</span></td><td>CDN fetches from origin on first miss</td><td>Frequently changing content</td><td>Cloudflare, Fastly</td></tr>
        <tr><td><span class="tag tag-purple">Push CDN</span></td><td>You upload assets to CDN proactively</td><td>Large static files, software downloads</td><td>AWS CloudFront S3 sync</td></tr>
      </table>

      <div class="section-title">🗂️ Cache-Control Headers — the CDN contract</div>
      <div class="card">
        <h3>Key HTTP headers that control CDN behavior</h3>
        <table class="compare-table" style="margin:8px 0">
          <tr><th>Header</th><th>Example Value</th><th>Effect</th></tr>
          <tr><td><code>Cache-Control</code></td><td><code>public, max-age=86400</code></td><td>Cache for 24h, shared caches allowed</td></tr>
          <tr><td><code>Cache-Control</code></td><td><code>s-maxage=3600</code></td><td>CDN caches 1h, browser uses max-age</td></tr>
          <tr><td><code>ETag</code></td><td><code>"abc123"</code></td><td>Fingerprint for conditional revalidation</td></tr>
          <tr><td><code>Vary</code></td><td><code>Accept-Encoding</code></td><td>Cache separate copies per encoding</td></tr>
          <tr><td><code>Surrogate-Key</code></td><td><code>product-42</code></td><td>Tag-based purge (Fastly, Varnish)</td></tr>
        </table>
        <div class="highlight">Shopify uses surrogate keys to instantly purge all CDN-cached pages for a specific product the moment its price changes — even across 200+ edge nodes worldwide.</div>
      </div>

      <div class="section-title">⚡ CDN Capabilities Beyond Caching</div>
      <table class="compare-table">
        <tr><th>Feature</th><th>What it does</th><th>Real Example</th></tr>
        <tr><td>TLS Termination</td><td>CDN handles HTTPS handshake at the edge, origin gets plain HTTP</td><td>Cloudflare terminates TLS for 20M+ domains</td></tr>
        <tr><td>DDoS Mitigation</td><td>Absorbs volumetric attacks at edge before reaching origin</td><td>Cloudflare blocked 71M rps attack in 2023</td></tr>
        <tr><td>Image Optimization</td><td>Resize, compress, convert to WebP/AVIF on the fly</td><td>Cloudflare Images, Imgix, Cloudinary</td></tr>
        <tr><td>Edge Functions</td><td>Run JS/Wasm at edge for A/B testing, auth, personalization</td><td>Cloudflare Workers, Vercel Edge Functions</td></tr>
        <tr><td>Video Streaming</td><td>Adaptive bitrate chunking (HLS/DASH) from edge</td><td>AWS CloudFront + MediaPackage for Prime Video</td></tr>
      </table>

      <div class="section-title">🔄 CDN Cache Invalidation</div>
      <div class="card">
        <h3>The hardest problem in CDN design</h3>
        <p>Once an asset is cached across 300 edge nodes, how do you update it?</p>
        <ul>
          <li><strong>URL versioning</strong> (best): <code>/app.v2.3.1.js</code> — new URL = new cache. Old URL still works.</li>
          <li><strong>Purge API</strong>: programmatically delete specific paths from all edges. Takes 1–5 seconds to propagate.</li>
          <li><strong>Short TTL</strong>: <code>max-age=60</code> — content is at most 1 minute stale. High origin load.</li>
          <li><strong>Surrogate-Key / Cache-Tag</strong>: tag assets by entity, purge all tagged items atomically.</li>
        </ul>
        <div class="highlight">Phil Karlton's famous quote: "There are only two hard things in Computer Science: cache invalidation and naming things."</div>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Netflix Open Connect</div>
        <p>Netflix built their own CDN — Open Connect — with 17,000+ servers embedded directly inside ISPs globally. ~95% of Netflix traffic never touches the open internet. Open Connect Appliances (OCAs) pre-position the next day's popular content overnight using predictive algorithms, so when you hit play, the bytes are already in your ISP's rack — under 10ms away.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Cloudflare — Anycast at Global Scale</div>
        <p>Cloudflare operates 300+ PoPs in 100+ countries using <strong>Anycast routing</strong>. Every PoP advertises the same IP addresses via BGP. Your DNS request automatically routes to the geographically closest PoP without any GeoDNS configuration. This is why Cloudflare can offer sub-20ms latency to 95% of the world's internet users.</p>
      </div>

      <div class="card">
        <h3>Popular CDN Providers</h3>
        <p>
          <span class="tag tag-blue">Cloudflare — 300+ PoPs, edge compute, DDoS</span>&nbsp;
          <span class="tag tag-yellow">AWS CloudFront — tight AWS integration</span>&nbsp;
          <span class="tag tag-red">Akamai — enterprise, 4,200+ PoPs</span>&nbsp;
          <span class="tag tag-green">Fastly — real-time purge, edge compute</span>&nbsp;
          <span class="tag tag-purple">Vercel Edge — frontend-focused, serverless</span>
        </p>
      </div>
      ${navButtons(this)}`;
    initCDNCanvas();
  }
},

// ── WEBSOCKET ─────────────────────────────────────────────────
websocket: {
  title: "WebSockets",
  badge: "Core Concepts", badgeClass: "badge-core",
  subtitle: "WebSocket is a full-duplex, persistent connection over a single TCP socket. Unlike HTTP, either side can send data at any time — no polling, no overhead.",
  prev: "cdn", next: "databases",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">🔌 HTTP vs WebSocket — The Core Difference</div>
      <div class="anim-container">
        <div class="anim-label">Live comparison — HTTP polling vs WebSocket push</div>
        <canvas id="wsCanvas" height="260"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="setWSMode('http')">HTTP Polling</button>
          <button class="anim-btn" onclick="setWSMode('longpoll')">Long Polling</button>
          <button class="anim-btn" onclick="setWSMode('ws')">WebSocket</button>
        </div>
        <div id="wsInfo" style="font-size:.82rem;margin-top:8px;min-height:36px;padding:8px;background:var(--bg);border-radius:6px;color:var(--text2);"></div>
      </div>

      <div class="section-title">🤝 The WebSocket Handshake</div>
      <div class="card">
        <h3>It starts as HTTP, then upgrades</h3>
        <p>WebSocket begins with a standard HTTP/1.1 request and upgrades the connection:</p>
        <pre style="background:var(--bg3);padding:12px;border-radius:8px;font-size:.8rem;overflow-x:auto;margin-top:8px;line-height:1.8"><code style="background:none;padding:0;color:var(--text2)">GET /chat HTTP/1.1
Host: chat.example.com
<span style="color:var(--cyan)">Upgrade: websocket</span>
<span style="color:var(--cyan)">Connection: Upgrade</span>
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

HTTP/1.1 <span style="color:var(--green)">101 Switching Protocols</span>
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</code></pre>
        <p style="margin-top:8px">After the 101 response, the TCP connection is <strong>kept alive</strong>. HTTP is gone — you now have a raw bidirectional byte stream.</p>
      </div>

      <div class="section-title">📊 HTTP vs WebSocket vs SSE Comparison</div>
      <table class="compare-table">
        <tr><th>Protocol</th><th>Direction</th><th>Connection</th><th>Overhead</th><th>Best For</th></tr>
        <tr><td><span class="tag tag-blue">HTTP/REST</span></td><td>Client → Server</td><td>New per request</td><td>Full headers (~800B)</td><td>CRUD, file uploads</td></tr>
        <tr><td><span class="tag tag-yellow">HTTP Polling</span></td><td>Client pulls</td><td>New every N seconds</td><td>Full headers × frequency</td><td>Low-frequency updates</td></tr>
        <tr><td><span class="tag tag-purple">Long Polling</span></td><td>Client pulls</td><td>Held open until data</td><td>Medium (reconnect overhead)</td><td>Simple chat, notifications</td></tr>
        <tr><td><span class="tag tag-cyan">SSE</span></td><td>Server → Client only</td><td>Persistent, HTTP/2</td><td>Low (text stream)</td><td>Live feeds, dashboards</td></tr>
        <tr><td><span class="tag tag-green">WebSocket</span></td><td>Both directions</td><td>Persistent TCP</td><td>~2B per frame</td><td>Chat, gaming, trading</td></tr>
      </table>

      <div class="section-title">🏗️ WebSocket Message Framing</div>
      <div class="card">
        <h3>Wire-level efficiency — 2-byte minimum frame</h3>
        <p>Each WebSocket message is wrapped in a lightweight frame:</p>
        <table class="compare-table" style="margin-top:8px">
          <tr><th>Field</th><th>Size</th><th>Purpose</th></tr>
          <tr><td>FIN + Opcode</td><td>1 byte</td><td>Message type: text(1), binary(2), ping(9), pong(10), close(8)</td></tr>
          <tr><td>Mask + Payload Len</td><td>1–9 bytes</td><td>Client→Server frames are always masked (XOR key)</td></tr>
          <tr><td>Payload</td><td>N bytes</td><td>Your actual data</td></tr>
        </table>
        <div class="highlight">A "Hello" message over WebSocket costs ~8 bytes of framing. Over HTTP it costs ~800 bytes of headers. At 1M messages/second, that's 792MB/s saved in overhead alone.</div>
      </div>

      <div class="section-title">🏗️ Building a WebSocket Server — Patterns</div>
      <div class="card">
        <h3>Connection Management at Scale</h3>
        <p>Each WebSocket is a persistent TCP connection. A single Node.js server can hold ~65,000 connections (limited by OS file descriptors). To scale beyond that:</p>
        <ul>
          <li><strong>Horizontal scaling</strong> — multiple WebSocket servers behind a load balancer with <em>sticky sessions</em> (IP hash or cookie-based). Without sticky sessions, a client reconnects to a different server and loses state.</li>
          <li><strong>Pub/Sub backbone</strong> — servers subscribe to a Redis channel. When user A sends a message, server 1 publishes to Redis, which fans out to server 2 where user B is connected.</li>
          <li><strong>Heartbeat / Ping-Pong</strong> — server sends <code>ping</code> frames every 30s. If client doesn't respond with <code>pong</code>, connection is considered dead and cleaned up.</li>
        </ul>
        <div class="highlight">Architecture: Client → Nginx (sticky) → WS Server pool → Redis Pub/Sub → Other WS Servers → Other Clients</div>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>Rooms & Namespaces (Socket.io Pattern)</h3>
        <p>Group connections into logical rooms (a chat room, a game lobby, a dashboard). When you emit to a room, the server fans out to all sockets in that room — even across multiple server processes via the Redis adapter.</p>
        <pre style="background:var(--bg3);padding:10px;border-radius:6px;font-size:.8rem;margin-top:8px;overflow-x:auto"><code style="background:none;padding:0;color:var(--text2)"><span style="color:var(--accent2)">// Server</span>
io.to('room:gamelobby-42').emit('player-joined', { user: 'Alice' });

<span style="color:var(--accent2)">// Client</span>
socket.on('player-joined', (data) => updateLobbyUI(data));</code></pre>
      </div>

      <div class="section-title">⚠️ WebSocket Challenges</div>
      <table class="compare-table">
        <tr><th>Challenge</th><th>Problem</th><th>Solution</th></tr>
        <tr><td>Load Balancing</td><td>Standard LB breaks persistent connections</td><td>Sticky sessions (IP hash or session cookie)</td></tr>
        <tr><td>Reconnection</td><td>Network drops kill the connection</td><td>Exponential backoff retry, resume tokens</td></tr>
        <tr><td>Message Order</td><td>TCP guarantees order per connection only</td><td>Sequence numbers, client-side ordering buffer</td></tr>
        <tr><td>Backpressure</td><td>Fast server overwhelms slow client buffer</td><td>Flow control, client ACKs, message queuing</td></tr>
        <tr><td>Firewall/Proxy</td><td>Some corporate proxies block WebSocket upgrades</td><td>Fall back to SSE or long-polling (Socket.io does this automatically)</td></tr>
      </table>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Slack — WebSockets for Real-Time Messaging</div>
        <p>Slack maintains a persistent WebSocket connection for every active client. All message delivery, typing indicators, presence updates, and reaction notifications go through this connection. Slack's gateway layer runs on Envoy proxies with sticky routing — your connection stays on the same backend server for the entire session. They handle <strong>10M+ concurrent WebSocket connections</strong> and publish events through a Kafka-backed fan-out system.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Figma — WebSocket for Collaborative Editing</div>
        <p>Figma's multiplayer design editor uses WebSockets to sync vector operations in real time between collaborators. When you move a shape, a delta operation is sent over WebSocket, applied via Operational Transform (OT) on every connected client simultaneously. Figma's WebSocket server is written in C++ for maximum throughput and runs on AWS with horizontal scaling behind an NLB with TCP sticky sessions.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Robinhood — WebSocket for Live Stock Ticks</div>
        <p>Robinhood streams live stock price ticks to millions of users via WebSockets. Each client subscribes to a set of ticker symbols. The server maintains a pub/sub map of symbol → subscriber connections. When a price update arrives from market data feeds, it's published to all subscribed connections in microseconds — far faster than HTTP polling could ever achieve.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Online Multiplayer Games</div>
        <p>Games like <strong>Agar.io</strong> and browser-based MMOs use binary WebSocket frames (not JSON) to minimize bandwidth. A position update is packed into 6 bytes (x: int16, y: int16, id: uint16) rather than <code>{"x":1234,"y":5678,"id":42}</code> which costs 28 bytes. At 60 updates/sec for 1000 players, that's 132MB/s vs 1.7GB/s — an 13× bandwidth reduction.</p>
      </div>

      <div class="section-title">🔧 When to Use What</div>
      <div class="card">
        <ul>
          <li><strong>Use WebSocket</strong> when: chat, live collaboration, multiplayer games, trading dashboards, real-time notifications that require client-to-server messages too</li>
          <li><strong>Use SSE</strong> when: one-directional server push only (live score, news feed, progress bar, log streaming) — simpler, works over HTTP/2</li>
          <li><strong>Use Long Polling</strong> when: legacy environments, proxy restrictions, or low-frequency updates where persistent connection overhead isn't worth it</li>
          <li><strong>Use WebRTC</strong> when: peer-to-peer audio/video/data (Zoom, Google Meet, file sharing)</li>
        </ul>
      </div>

      ${navButtons(this)}`;
    initWSCanvas();
  }
},

// ── DATABASES ─────────────────────────────────────────────────
databases: {
  title: "Databases",
  badge: "Core Concepts", badgeClass: "badge-core",
  subtitle: "Choosing the right database is one of the most critical system design decisions. SQL vs NoSQL, ACID vs BASE, indexes, storage engines, and when to use each.",
  prev: "websocket", next: "sharding",
  render(c) {
    c.innerHTML = `
      ${hero(this)}
      <div class="section-title">🗄️ What is a Database?</div>
      <div class="card">
        <h3>Your application's permanent memory</h3>
        <p>Every piece of data your app creates — user accounts, orders, messages — must be stored somewhere persistent. A database is that store: structured, queryable, and durable across crashes.</p>
        <div class="highlight">
          API Request → Service → <strong>Database</strong> → Persistent data<br><br>
          POST /book-turf → Booking Service → DB → Booking saved ✅
        </div>
      </div>

      <div class="section-title">🎬 Live — API Writing to a Database</div>
      <div class="anim-container">
        <div class="anim-label">Watch a real API request flow into a database table</div>
        <canvas id="dbWriteCanvas" height="220"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="dbSendRequest('insert')">INSERT Row</button>
          <button class="anim-btn" onclick="dbSendRequest('select')">SELECT Query</button>
          <button class="anim-btn" onclick="dbSendRequest('group')">GROUP BY Query</button>
          <button class="anim-btn" onclick="dbResetAnim()">Reset</button>
        </div>
        <div id="dbWriteInfo" style="font-size:.82rem;margin-top:8px;min-height:36px;padding:8px;background:var(--bg);border-radius:6px;color:var(--text2);line-height:1.6;"></div>
      </div>

      <div class="section-title">🗄️ SQL vs NoSQL</div>
      <div class="anim-container">
        <div class="anim-label">Database Types Visualized</div>
        <canvas id="dbCanvas" height="200"></canvas>
      </div>
      <table class="compare-table">
        <tr><th>Aspect</th><th>SQL (Relational)</th><th>NoSQL</th></tr>
        <tr><td>Schema</td><td>Fixed, predefined</td><td>Flexible / dynamic</td></tr>
        <tr><td>Scaling</td><td>Vertical (mostly)</td><td>Horizontal</td></tr>
        <tr><td>ACID</td><td>Full ACID support</td><td>Eventual consistency (BASE)</td></tr>
        <tr><td>Joins</td><td>Powerful multi-table joins</td><td>Denormalized, no joins</td></tr>
        <tr><td>Query language</td><td>SQL (standardized)</td><td>Vendor-specific APIs</td></tr>
        <tr><td>Best for</td><td>Financial, inventory, ERP</td><td>Social, IoT, catalogs, caches</td></tr>
        <tr><td>Examples</td><td>PostgreSQL, MySQL, Oracle</td><td>MongoDB, Cassandra, Redis, DynamoDB</td></tr>
      </table>

      <div class="section-title">🏦 ACID Transactions — Interactive Simulation</div>
      <div class="card">
        <p>ACID is a set of guarantees that every database transaction must satisfy. Run each scenario below to see exactly what breaks without each property — using a real PLAYKERS cricket slot booking + payment example.</p>
      </div>
      <div id="acidRoot"></div>

      <div class="section-title">🏦 ACID vs BASE</div>
      <div class="card">
        <h3>ACID — Relational DBs</h3>
        <ul>
          <li><strong>A</strong>tomicity — transaction is all-or-nothing. Bank transfer: debit + credit in one unit.</li>
          <li><strong>C</strong>onsistency — data always satisfies constraints (foreign keys, unique, not null).</li>
          <li><strong>I</strong>solation — concurrent transactions behave as if serial. Prevents dirty reads.</li>
          <li><strong>D</strong>urability — committed data survives crashes (WAL log, fsync).</li>
        </ul>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>BASE — NoSQL systems</h3>
        <ul>
          <li><strong>B</strong>asically Available — system is always up (AP in CAP theorem).</li>
          <li><strong>S</strong>oft state — data may change without input (replication catching up).</li>
          <li><strong>E</strong>ventually consistent — all replicas will converge to same value <em>given enough time</em>.</li>
        </ul>
        <div class="highlight">DynamoDB default: write to one region, replicate to others within ~1 second. Read after write may return stale data unless you request <em>strongly consistent reads</em>.</div>
      </div>

      <div class="section-title">📇 Indexes — How Databases Find Data Fast</div>
      <div class="card">
        <h3>B-Tree Index (default in PostgreSQL, MySQL)</h3>
        <p>A self-balancing tree where leaf nodes contain actual row pointers. O(log N) reads and writes. Works great for equality and range queries: <code>WHERE age BETWEEN 20 AND 30</code>.</p>
        <div class="highlight">PostgreSQL creates a B-tree index on every PRIMARY KEY and UNIQUE column automatically.</div>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>LSM-Tree (Log-Structured Merge — used by Cassandra, RocksDB, LevelDB)</h3>
        <p>Writes go to an in-memory buffer (MemTable) first — ultra-fast. Periodically flushed to sorted disk files (SSTables). Reads merge multiple levels. Optimized for <strong>write-heavy</strong> workloads.</p>
        <div class="highlight">RocksDB (used inside MySQL at Facebook, Kafka, TiKV) achieves 300K+ writes/sec on NVMe SSDs using LSM.</div>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>Other Index Types</h3>
        <table class="compare-table" style="margin-top:8px">
          <tr><th>Type</th><th>Best For</th><th>Example</th></tr>
          <tr><td>Hash Index</td><td>Exact equality only, O(1)</td><td>Redis, MySQL MEMORY engine</td></tr>
          <tr><td>GiST / GIN</td><td>Full-text, JSON, arrays, geo</td><td>PostgreSQL — <code>tsvector</code> search</td></tr>
          <tr><td>BRIN</td><td>Time-series, naturally ordered cols</td><td>PostgreSQL — IoT timestamps</td></tr>
          <tr><td>Columnar</td><td>Analytics, aggregations</td><td>Redshift, BigQuery, ClickHouse</td></tr>
          <tr><td>Vector Index</td><td>Nearest-neighbour / AI embeddings</td><td>pgvector, Pinecone, Weaviate</td></tr>
        </table>
      </div>

      <div class="section-title">🗂️ NoSQL Database Types</div>
      <table class="compare-table">
        <tr><th>Type</th><th>Data Model</th><th>Best For</th><th>Example</th></tr>
        <tr><td><span class="tag tag-blue">Document</span></td><td>JSON/BSON documents</td><td>Catalogs, CMS, user profiles</td><td>MongoDB, Firestore</td></tr>
        <tr><td><span class="tag tag-green">Key-Value</span></td><td>Key → opaque value</td><td>Caching, sessions, feature flags</td><td>Redis, DynamoDB</td></tr>
        <tr><td><span class="tag tag-purple">Wide Column</span></td><td>Rows with dynamic columns</td><td>Time-series, IoT, write-heavy</td><td>Cassandra, HBase</td></tr>
        <tr><td><span class="tag tag-yellow">Graph</span></td><td>Nodes + edges</td><td>Social networks, fraud detection</td><td>Neo4j, Neptune</td></tr>
        <tr><td><span class="tag tag-cyan">Time-Series</span></td><td>Timestamp + metrics</td><td>Monitoring, finance, IoT</td><td>InfluxDB, TimescaleDB</td></tr>
        <tr><td><span class="tag tag-red">Vector</span></td><td>High-dim float arrays</td><td>AI similarity search, RAG</td><td>Pinecone, pgvector</td></tr>
      </table>

      <div class="section-title">📊 Read vs Write Optimization Trade-offs</div>
      <div class="card">
        <h3>The fundamental tension</h3>
        <p>Every index speeds up reads but slows down writes (index must be updated). Every denormalization speeds up reads but risks inconsistency on writes.</p>
        <ul>
          <li><strong>Read-heavy workload (100:1 ratio)</strong>: add indexes aggressively, use read replicas, CDN + cache in front. Example: social media feeds, product pages.</li>
          <li><strong>Write-heavy workload (1:100 ratio)</strong>: minimize indexes, use LSM-tree DBs, batch writes, partition by time. Example: IoT sensor data, analytics events, chat messages.</li>
        </ul>
        <div class="highlight">Twitter ingests 500M tweets/day (~5,800/sec). PostgreSQL write throughput without indexing tweaks would be the bottleneck — they batch-insert and use Kafka as a write buffer before flushing to storage.</div>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Uber's Polyglot Persistence</div>
        <p>Uber uses every type of database for different problems: <strong>MySQL/Schemaless</strong> (custom KV on MySQL) for trip data requiring ACID, <strong>Cassandra</strong> for driver location history (write-heavy time-series), <strong>Redis</strong> for real-time matching and fare caching, <strong>Elasticsearch</strong> for search-as-you-type, and <strong>Pinot</strong> (Apache) for real-time analytics dashboards. Each database is matched exactly to its access pattern.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Notion — PostgreSQL at Scale</div>
        <p>Notion runs entirely on PostgreSQL. At their scale, they sharded Postgres using a custom approach: one database cluster per "workspace block" range. They also use aggressive connection pooling via PgBouncer (thousands of app connections → ~300 actual DB connections) and custom read-replica routing to handle 200M+ page loads per day.</p>
      </div>

      ${navButtons(this)}`;
    initDBWriteCanvas();
    initDBCanvas();
    initACID();
  }
},

// ── SHARDING ──────────────────────────────────────────────────
sharding: {
  title: "Database Sharding",
  badge: "Core Concepts", badgeClass: "badge-core",
  subtitle: "Sharding splits a database horizontally across multiple servers. Each shard holds a subset of rows — together they form the complete dataset.",
  prev: "databases", next: "replication",
  render(c) {
    c.innerHTML = `
      ${hero(this)}
      <div class="section-title">✂️ Replication vs Sharding — The Key Difference</div>
      <div class="anim-container">
        <div class="anim-label">COPY vs SPLIT — watch data flow into each architecture</div>
        <canvas id="shardVsReplCanvas" height="200"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="setShardVsRepl('shard')">Show Sharding</button>
          <button class="anim-btn" onclick="setShardVsRepl('repl')">Show Replication</button>
        </div>
        <div id="shardVsReplInfo" style="font-size:.82rem;margin-top:8px;min-height:36px;padding:8px;background:var(--bg);border-radius:6px;color:var(--text2);"></div>
      </div>

      <div class="section-title">✂️ How Sharding Works</div>
      <div class="anim-container">
        <div class="anim-label">Sharding Strategy — watch records route to their shard</div>
        <canvas id="shardCanvas" height="240"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="setShardStrategy('range')">Range Sharding</button>
          <button class="anim-btn" onclick="setShardStrategy('hash')">Hash Sharding</button>
          <button class="anim-btn" onclick="setShardStrategy('directory')">Directory Sharding</button>
          <button class="anim-btn" onclick="shardSendRecord()">Send Record</button>
        </div>
        <div id="shardInfo" style="font-size:.82rem;margin-top:8px;min-height:36px;padding:8px;background:var(--bg);border-radius:6px;color:var(--text2);"></div>
      </div>

      <div class="section-title">🔁 Sharding + Replication Together</div>
      <div class="anim-container">
        <div class="anim-label">Production reality: each shard has its own Primary + Replicas</div>
        <canvas id="shardReplCanvas" height="260"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="shardReplWrite()">Write (goes to Primary)</button>
          <button class="anim-btn" onclick="shardReplRead()">Read (served by Replica)</button>
          <button class="anim-btn" onclick="shardReplFail()">Simulate Primary Fail</button>
          <button class="anim-btn" onclick="shardReplReset()">Reset</button>
        </div>
        <div id="shardReplInfo" style="font-size:.82rem;margin-top:8px;min-height:40px;padding:8px;background:var(--bg);border-radius:6px;color:var(--text2);line-height:1.6;"></div>
      </div>

      <div class="section-title">📐 Sharding Strategies — Deep Dive</div>
      <div class="card">
        <h3>① Range-Based Sharding</h3>
        <p>Rows are assigned to shards based on a value range of the shard key.</p>
        <div class="highlight">
          Shard 1: user_id 1 – 10,000,000<br>
          Shard 2: user_id 10,000,001 – 20,000,000<br>
          Shard 3: user_id 20,000,001 – 30,000,000
        </div>
        <p style="margin-top:8px">✅ <strong>Range queries are fast</strong> — all records in a date range live on one shard.<br>
        ❌ <strong>Hot spots</strong> — new users always go to the last shard. Sequential writes create uneven load.</p>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>② Hash-Based Sharding</h3>
        <p>Apply a hash function to the shard key, distribute modulo number of shards.</p>
        <div class="highlight">
          shard = hash(user_id) % N<br>
          hash("alice") % 4 = 2  →  Shard 2<br>
          hash("bob")   % 4 = 0  →  Shard 0
        </div>
        <p style="margin-top:8px">✅ <strong>Uniform distribution</strong> — no hot spots for writes.<br>
        ❌ <strong>Range queries expensive</strong> — must scatter across all shards and gather results.<br>
        ❌ <strong>Resharding is painful</strong> — changing N remaps almost all keys (use consistent hashing to fix this!).</p>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>③ Directory-Based Sharding</h3>
        <p>A lookup table (directory) maps each key to its shard. Maximum flexibility.</p>
        <div class="highlight">
          Directory: { "alice" → Shard-2, "bob" → Shard-0, "EU users" → Shard-4 }
        </div>
        <p style="margin-top:8px">✅ <strong>Can move any record</strong> to any shard by updating the directory.<br>
        ❌ <strong>Directory is a single point of failure</strong> — must be replicated and cached.<br>
        ❌ <strong>Extra hop</strong> — every query hits the directory first.</p>
      </div>

      <div class="section-title">🔑 Choosing the Shard Key — The Most Critical Decision</div>
      <div class="card">
        <h3>A bad shard key will haunt you forever</h3>
        <p>The shard key determines data distribution, query patterns, and whether you get hot spots. Rules:</p>
        <ul>
          <li><strong>High cardinality</strong> — enough distinct values to spread data evenly (user_id: good, country_code: bad for 200 countries across 10,000 shards)</li>
          <li><strong>Query locality</strong> — queries should hit as few shards as possible. If 90% of queries filter by <code>tenant_id</code>, make that the shard key.</li>
          <li><strong>Avoid monotonic keys</strong> — auto-increment IDs or timestamps cause all writes to go to the "last" shard. Use random UUIDs or prefix with hash.</li>
          <li><strong>Immutable</strong> — once a row is written to a shard, changing the shard key requires moving the row. Make the key something that never changes.</li>
        </ul>
        <div class="highlight">Instagram's mistake: sharding by user_id worked for most users, but celebrity accounts (Justin Bieber: 100M+ followers) created extreme read hot spots on their shard. They had to special-case "super-sharding" for high-follower accounts.</div>
      </div>

      <div class="section-title">🔁 Resharding — Adding Shards Without Downtime</div>
      <div class="card">
        <h3>The hard problem: what do you do when shards get full?</h3>
        <p><strong>Option 1 — Double Shards (2× expansion):</strong> split each shard into 2. Only half the data on each shard moves. Simple but limited to powers of 2.</p>
        <p><strong>Option 2 — Consistent Hashing:</strong> new shard joins the ring and only steals adjacent data. Minimal movement. Used by Cassandra and DynamoDB.</p>
        <p><strong>Option 3 — Logical Shard Mapping:</strong> keep many more logical shards than physical servers. Instagram: 12,000 logical shards on 12 physical servers. Adding a server = move some logical shards, no key remapping needed.</p>
        <div class="highlight">Vitess (used by YouTube, Slack, GitHub) handles MySQL resharding by maintaining a virtualized sharding layer. You define shard ranges, and Vitess routes queries automatically — resharding is a background migration with no downtime.</div>
      </div>

      <div class="section-title">⚠️ Sharding Challenges</div>
      <div class="card">
        <ul>
          <li><strong>Cross-shard joins</strong> — JOIN across shards must be done in application code. Expensive scatter-gather queries.</li>
          <li><strong>Cross-shard transactions</strong> — 2-phase commit (2PC) required for ACID across shards. High latency and complexity.</li>
          <li><strong>Global aggregations</strong> — <code>COUNT(*)</code> or <code>SUM(revenue)</code> must query all shards and sum in application layer.</li>
          <li><strong>Schema migrations</strong> — running <code>ALTER TABLE</code> on 1000 shards in sequence takes hours. Use pt-online-schema-change or gh-ost.</li>
          <li><strong>Hot shards</strong> — one shard gets 80% of traffic (celebrity problem). Mitigate with read replicas per shard + application-level caching.</li>
        </ul>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Instagram — 12,000 Logical Shards</div>
        <p>Instagram shards PostgreSQL using 12,000 logical shards mapped to physical servers. Their shard key is <code>user_id</code>. When they needed more capacity, they moved logical shards to new physical hosts without any schema changes or data remapping. This "logical sharding" pattern is now widely copied — it separates the application routing logic from the physical infrastructure scaling.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: YouTube — Vitess for MySQL Sharding</div>
        <p>YouTube built <strong>Vitess</strong> to transparently shard MySQL horizontally. Vitess sits in front of MySQL and handles query routing, connection pooling, and resharding. It rewrites queries to target the correct shard, handles scatter-gather for cross-shard queries, and supports live resharding with zero downtime. Vitess is now a CNCF project used by Slack, GitHub, and PlanetScale.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: MongoDB Atlas — Automatic Sharding</div>
        <p>MongoDB's Atlas service handles sharding automatically using <strong>zone sharding</strong> for geographic distribution and <strong>hashed sharding</strong> for uniform distribution. The config server (a 3-node replica set) stores the chunk map. mongos routers sit between application and shards, transparently routing queries. Moving chunks between shards happens in the background via a "balancer" process with zero downtime.</p>
      </div>

      ${navButtons(this)}`;
    initShardVsReplCanvas('shard');
    initShardCanvas('range');
    initShardReplCanvas();
  }
},

// ── REPLICATION ───────────────────────────────────────────────
replication: {
  title: "Database Replication",
  badge: "Core Concepts", badgeClass: "badge-core",
  subtitle: "Replication maintains multiple copies of data across nodes for high availability, disaster recovery, and read scalability. Every major database supports it.",
  prev: "sharding", next: "microservices",
  render(c) {
    c.innerHTML = `
      ${hero(this)}
      <div class="section-title">🔄 Replication Types</div>
      <div class="anim-container">
        <div class="anim-label">Replication Flow — watch writes propagate to replicas</div>
        <canvas id="replCanvas" height="240"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="setReplMode('leader-follower')">Leader-Follower</button>
          <button class="anim-btn" onclick="setReplMode('multi-leader')">Multi-Leader</button>
          <button class="anim-btn" onclick="setReplMode('leaderless')">Leaderless</button>
          <button class="anim-btn" onclick="replSendWrite()">Send Write</button>
        </div>
        <div id="replInfo" style="font-size:.82rem;margin-top:8px;min-height:36px;padding:8px;background:var(--bg);border-radius:6px;color:var(--text2);"></div>
      </div>

      <div class="section-title">🔴 Primary Failure & Failover</div>
      <div class="anim-container">
        <div class="anim-label">What happens when Primary DB goes down</div>
        <canvas id="replFailCanvas" height="200"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="replFailDemo('fail')">💥 Kill Primary</button>
          <button class="anim-btn" onclick="replFailDemo('promote')">⬆️ Promote Replica</button>
          <button class="anim-btn" onclick="replFailDemo('reset')">↺ Reset</button>
        </div>
        <div id="replFailInfo" style="font-size:.82rem;margin-top:8px;min-height:36px;padding:8px;background:var(--bg);border-radius:6px;color:var(--text2);"></div>
      </div>

      <div class="section-title">📋 Replication Modes Compared</div>
      <table class="compare-table">
        <tr><th>Type</th><th>Writes go to</th><th>Reads from</th><th>Consistency</th><th>Used by</th></tr>
        <tr><td><span class="tag tag-blue">Leader-Follower</span></td><td>Leader only</td><td>Leader + any follower</td><td>Eventual (async) or Strong (sync)</td><td>MySQL, PostgreSQL, MongoDB</td></tr>
        <tr><td><span class="tag tag-yellow">Multi-Leader</span></td><td>Any leader</td><td>Any node</td><td>Eventual + conflict resolution</td><td>CockroachDB, geo-distributed apps</td></tr>
        <tr><td><span class="tag tag-purple">Leaderless</span></td><td>W quorum nodes</td><td>R quorum nodes</td><td>Tunable (W + R > N)</td><td>Cassandra, DynamoDB, Riak</td></tr>
      </table>

      <div class="section-title">⚡ Sync vs Async Replication</div>
      <div class="card">
        <h3>Synchronous Replication — Strong Consistency</h3>
        <p>Leader waits for follower(s) to confirm write before acknowledging client. Zero data loss on leader failure, but <strong>higher write latency</strong> (must wait for network round-trip to follower).</p>
        <div class="highlight">PostgreSQL synchronous_commit = on: write is acknowledged only after WAL record is flushed to at least one standby. Used by financial systems where data loss is unacceptable.</div>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>Asynchronous Replication — High Throughput</h3>
        <p>Leader acknowledges write immediately, replicates to followers in the background. <strong>Replication lag</strong> = followers may be seconds behind. If leader crashes before replication, those writes are lost.</p>
        <div class="highlight">MySQL default: async replication. Instagram reported up to 30 seconds of replication lag during traffic spikes — users could post a photo and momentarily not see it in their own feed.</div>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>Semi-Synchronous (MySQL default since 5.7)</h3>
        <p>At least one follower must acknowledge before the leader responds. Balances durability and performance. If the one follower goes down, MySQL falls back to fully async automatically.</p>
      </div>

      <div class="section-title">🔢 Quorum Replication — The Math</div>
      <div class="card">
        <h3>Leaderless systems use quorum to guarantee consistency</h3>
        <p>With <strong>N</strong> total replicas, write to <strong>W</strong>, read from <strong>R</strong>:</p>
        <div class="highlight">
          Guarantee: <strong>W + R > N</strong> → at least one node has the latest write<br><br>
          N=3 replicas, W=2 writes, R=2 reads → W+R=4 > 3 ✅ guaranteed overlap<br>
          N=3 replicas, W=1 write,  R=1 read  → W+R=2 ≤ 3 ❌ might miss latest write
        </div>
        <p style="margin-top:8px">Common tunings:</p>
        <ul>
          <li><strong>W=N, R=1</strong> — write to all replicas, read from one. Maximum read performance, write availability drops when any node is down.</li>
          <li><strong>W=1, R=N</strong> — write to one, read all. Maximum write performance, read latency proportional to slowest replica.</li>
          <li><strong>W=ceil(N/2)+1, R=ceil(N/2)+1</strong> — balanced quorum. Most common for general use.</li>
        </ul>
      </div>

      <div class="section-title">📉 Replication Lag Problems</div>
      <div class="card">
        <h3>① Read-Your-Writes Violation</h3>
        <p>User updates their profile → writes to leader → reads from replica that hasn't replicated yet → sees old data. Feels like the update was lost.</p>
        <p><strong>Fix</strong>: After a write, route that user's reads to the leader for 1 minute. Or read from replica with a "read-after" timestamp check.</p>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>② Monotonic Reads Violation</h3>
        <p>User refreshes page → first request hits replica A (up-to-date), second request hits replica B (behind) → data appears to go backwards in time.</p>
        <p><strong>Fix</strong>: Sticky session — route each user always to the same replica. Or include a vector clock in responses for client-side ordering.</p>
      </div>
      <div class="card" style="margin-top:10px">
        <h3>③ Consistent Prefix Reads</h3>
        <p>In partitioned databases, operations may arrive out of order — you see the answer before the question.</p>
        <p><strong>Fix</strong>: Causally related writes go to the same partition. Version vectors track causal ordering.</p>
      </div>

      <div class="section-title">🔀 Multi-Leader Conflict Resolution</div>
      <div class="card">
        <h3>Two leaders both accept a write to the same record</h3>
        <p>User A edits document on London leader, User B edits same document on NYC leader simultaneously. Both succeed locally, then replicate to each other — conflict!</p>
        <p><strong>Resolution strategies:</strong></p>
        <ul>
          <li><strong>Last Write Wins (LWW)</strong> — use timestamp, higher wins. Simple but loses data. Used by Cassandra by default.</li>
          <li><strong>Merge</strong> — combine both values (works for sets/counters). Used by CRDTs (Conflict-free Replicated Data Types).</li>
          <li><strong>Application-level resolution</strong> — surface the conflict to the user. Git does this — you see a merge conflict and resolve manually.</li>
          <li><strong>Operational Transformation (OT)</strong> — transform operations so they commute. Used by Google Docs, Figma for collaborative editing.</li>
        </ul>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: MySQL at Facebook — 10× Read Scaling</div>
        <p>Facebook runs one MySQL primary per data center handling all writes, with 10–20 read replicas absorbing 99% of social feed reads. They built a custom MySQL replication topology where replicas can replicate from other replicas (fan-out tree) to reduce load on the primary. During peak (Super Bowl, election night), they spin up additional read replicas from existing replica snapshots in under 10 minutes.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Cassandra at Netflix — Tunable Quorum</div>
        <p>Netflix uses Cassandra across 3 AWS regions (us-east, eu-west, ap-southeast) with RF=3 (one copy per region). For viewing history (can tolerate slight staleness): W=1, R=1 — maximum write throughput. For billing data: W=2, R=2 — guaranteed to see latest write. All tuned per-query using Cassandra's consistency levels: ONE, QUORUM, LOCAL_QUORUM, ALL.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: CockroachDB — Multi-Region Multi-Leader</div>
        <p>CockroachDB implements distributed SQL with multi-leader replication using the <strong>Raft consensus algorithm</strong>. Every range (64MB data chunk) has 3–5 replicas with a Raft leader. Writes go through the Raft leader for that range, which commits when a majority agrees. Geo-partition your data by placing ranges in specific regions — European user data stays in EU replicas for GDPR compliance and low latency.</p>
      </div>

      ${navButtons(this)}`;
    initReplCanvas();
    initReplFailCanvas();
  }
},

// ── MICROSERVICES ─────────────────────────────────────────────
microservices: {
  title: "Microservices Architecture",
  badge: "Architecture", badgeClass: "badge-architecture",
  subtitle: "Microservices divides a large application into small, independently deployable services — each handling one specific business function.",
  prev: "replication", next: "api-gateway",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">�️ Monolith vs Microservices — PLAYKERS Example</div>
      <div class="card">
        <p>Instead of one large PLAYKERS application containing everything, we split into independent services:</p>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0">
        <div class="card" style="border-color:#ef4444">
          <h3 style="color:#ef4444">🏛️ Monolith (Before)</h3>
          <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:14px;margin-top:10px;font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;color:#94a3b8">
            PLAYKERS App<br>
            &nbsp;├── 👤 Users<br>
            &nbsp;├── 🏏 Matches<br>
            &nbsp;├── 📅 Booking<br>
            &nbsp;├── 💳 Payment<br>
            &nbsp;├── 🏆 Tournaments<br>
            &nbsp;└── 🔔 Notifications<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
            &nbsp;&nbsp;&nbsp;One Database
          </div>
          <p style="margin-top:10px;font-size:.82rem;color:var(--red)">One bug = entire app down. Scale everything to scale one thing.</p>
        </div>
        <div class="card" style="border-color:#22c55e">
          <h3 style="color:#22c55e">🧩 Microservices (After)</h3>
          <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:14px;margin-top:10px;font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;color:#94a3b8">
            API Gateway<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
            👤 User Svc → User DB<br>
            🏏 Match Svc → Match DB<br>
            📅 Booking Svc → Booking DB<br>
            💳 Payment Svc → Payment DB<br>
            🏆 Tournament Svc → Tour. DB<br>
            🔔 Notify Svc → Notify DB
          </div>
          <p style="margin-top:10px;font-size:.82rem;color:var(--green)">Independent services. Scale only what's needed.</p>
        </div>
      </div>

      <div class="section-title">🏗️ PLAYKERS Architecture Diagram</div>
      <div class="anim-container">
        <div class="anim-label">How a request flows through PLAYKERS microservices</div>
        <canvas id="msCanvas" height="260"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="setMSView('micro')">Microservices</button>
          <button class="anim-btn" onclick="setMSView('mono')">Monolith</button>
          <button class="anim-btn" onclick="simulateMSFailure()">💥 Simulate Failure</button>
          <button class="anim-btn" onclick="resetMS()">Reset</button>
        </div>
        <div id="msStatus" style="font-size:.82rem;color:var(--text2);margin-top:8px;min-height:20px;padding:4px 8px;"></div>
      </div>

      <div class="section-title">⚡ Why Use Microservices?</div>

      <div class="card">
        <h3>1. Independent Scaling</h3>
        <p>If Booking Service receives heavy traffic during tournament season, scale only that service:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:1.9">
          Booking Service → overloaded<br>
          Auto Scaling → adds instances<br>
          Booking-1 &nbsp;Booking-2 &nbsp;Booking-3 &nbsp;Booking-4<br><br>
          User Service, Match Service → untouched ✅
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>2. Independent Deployment</h3>
        <p>Change only the Payment Service? Deploy <em>only</em> Payment — no risk to User, Booking, or Match services. Teams deploy dozens of times per day independently.</p>
        <div class="highlight">Amazon deploys to production over <strong>50 million times per year</strong> — only possible because each microservice deploys independently.</div>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>3. Fault Isolation</h3>
        <p>If Notification Service fails, only notifications are affected. The rest of PLAYKERS keeps running:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:1.9">
          Notification ❌<br>
          Booking &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✅<br>
          Payment &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✅<br>
          Match &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✅<br>
          User &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✅
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>4. Technology Flexibility</h3>
        <p>Each service picks the right tool for the job:</p>
        <table class="compare-table" style="margin-top:8px">
          <tr><td><span class="tag tag-blue">User Service</span></td><td>Java + PostgreSQL</td></tr>
          <tr><td><span class="tag tag-green">Booking Service</span></td><td>Node.js + MongoDB</td></tr>
          <tr><td><span class="tag tag-yellow">Payment Service</span></td><td>Go + MySQL (ACID)</td></tr>
          <tr><td><span class="tag tag-cyan">AI / Recommendation</span></td><td>Python + vector DB</td></tr>
        </table>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>5. Database Ownership</h3>
        <p>Each service owns its data — no shared databases. This prevents tight coupling at the data layer:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:1.9">
          User Service &nbsp;&nbsp;&nbsp;→ User DB<br>
          Booking Service → Booking DB<br>
          Payment Service → Payment DB<br>
          Match Service &nbsp;&nbsp;→ Match DB
        </div>
      </div>

      <div class="section-title">🔗 Service Communication</div>
      <div class="card">
        <h3>Synchronous — REST / gRPC</h3>
        <p>Booking Service calls Payment Service and <strong>waits</strong> for the response before continuing. Simple but creates coupling — if Payment is slow, Booking is slow.</p>
        <div class="highlight">Booking → <code>POST /charge</code> → Payment → waits → 200 OK → Booking continues</div>
      </div>
      <div class="card" style="margin-top:12px">
        <h3>Asynchronous — Message Queue / Events</h3>
        <p>Booking Service publishes a <code>BookingCreated</code> event to Kafka/SQS and <strong>immediately returns</strong>. Notification Service consumes it independently later — zero coupling.</p>
        <div class="highlight">Booking → publish event → Queue → Notification picks it up<br>Booking does NOT wait ✅</div>
      </div>

      <div class="section-title">🏗️ Supporting Patterns (the tools that make it work)</div>
      <div class="anim-container">
        <div class="anim-label">Netflix Architecture — Client → Gateway → 700+ Services → Data Layer</div>
        <canvas id="msNetflixCanvas" height="280"></canvas>
      </div>
      <table class="compare-table">
        <tr><th>Pattern</th><th>Solves</th><th>Tool</th></tr>
        <tr><td>API Gateway</td><td>Single entry point, auth, routing</td><td>Kong, AWS API GW, Zuul</td></tr>
        <tr><td>Service Discovery</td><td>How do services find each other?</td><td>Consul, Eureka, K8s DNS</td></tr>
        <tr><td>Load Balancer</td><td>Distribute traffic across instances</td><td>Nginx, AWS ALB, Envoy</td></tr>
        <tr><td>Circuit Breaker</td><td>Stop cascading failures</td><td>Resilience4j, Hystrix</td></tr>
        <tr><td>Message Queue</td><td>Async decoupled communication</td><td>Kafka, RabbitMQ, SQS</td></tr>
        <tr><td>Distributed Tracing</td><td>Track request across 20 services</td><td>Jaeger, Zipkin, OTEL</td></tr>
        <tr><td>Saga Pattern</td><td>Distributed transactions</td><td>Temporal, Axon</td></tr>
      </table>

      <div class="section-title">📊 Monolith vs Microservices — Summary</div>
      <table class="compare-table">
        <tr><th>Aspect</th><th>🏛️ Monolith</th><th>🧩 Microservices</th></tr>
        <tr><td>Application</td><td>One large application</td><td>Many small independent services</td></tr>
        <tr><td>Deployment</td><td>One deployment unit, risky</td><td>Per-service, independent</td></tr>
        <tr><td>Database</td><td>Usually one shared DB</td><td>Service-owned DB per service</td></tr>
        <tr><td>Scaling</td><td>Scale everything together</td><td>Scale only the bottleneck</td></tr>
        <tr><td>Fault</td><td style="color:var(--red)">One bug crashes all</td><td style="color:var(--green)">Failure isolated per service</td></tr>
        <tr><td>Complexity</td><td>Simple to start</td><td>More operational complexity</td></tr>
        <tr><td>Team</td><td>Shared codebase</td><td>One team per service</td></tr>
      </table>

      <div class="section-title">⚠️ When NOT to Use Microservices</div>
      <div class="card">
        <ul>
          <li><strong>Small team</strong> — operational overhead outweighs benefits</li>
          <li><strong>Early product</strong> — domain boundaries unknown; start as modular monolith, extract later</li>
          <li><strong>No DevOps maturity</strong> — needs CI/CD, containers, observability, service mesh</li>
        </ul>
        <div class="highlight">Martin Fowler: "Don't start with microservices. Start with a well-structured monolith and extract services when you feel the pain."</div>
      </div>

      <div class="section-title">🧠 One Line to Remember</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <p style="font-size:1rem;line-height:1.7">
          <strong>Monolith</strong> → one large application<br>
          <strong>Microservices</strong> → many small independent services, each handling one business function
        </p>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Netflix — 700+ Services</div>
        <p>Netflix runs 700+ microservices. Playback, Recommendation, Billing, and Auth all run independently. When the recommendation engine had issues on Super Bowl Sunday, playback continued unaffected. <strong>Chaos Monkey</strong> randomly kills services in production to ensure resilience is always battle-tested.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Amazon — 1000+ Services, 50M deploys/year</div>
        <p>Amazon decomposed their monolith starting in 2001. The <strong>Two-Pizza Rule</strong>: if a team needs more than 2 pizzas, it's too big. Each team owns their service end-to-end. This enables 50 million production deployments per year — impossible with a shared monolith.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Uber — DOMA (Domain-Oriented Microservices)</div>
        <p>Uber evolved from monolith → microservices → DOMA. They grouped 2,200+ services into domains (Maps, Dispatch, Pricing) with a single API per domain. This solved the "nobody knows what calls what" problem while keeping independent deployment per domain.</p>
      </div>

      ${navButtons(this)}`;
    // defer canvas inits until DOM is painted
    requestAnimationFrame(() => {
      initMSCanvas();
      initMSNetflixCanvas();
    });
  }
},

// ── API GATEWAY ───────────────────────────────────────────────
"api-gateway": {
  title: "API Gateway",
  badge: "Architecture", badgeClass: "badge-architecture",
  subtitle: "An API Gateway is the single entry point between clients and backend microservices — handling routing, authentication, rate limiting, load balancing, and more.",
  prev: "microservices", next: "message-queues",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">🚪 The Problem — Without an API Gateway</div>
      <div class="card">
        <p>Without a gateway, the client must know about every service and call each one directly:</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px">
          <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:14px;">
            <div style="font-size:.8rem;font-weight:700;color:var(--red);margin-bottom:8px">❌ Without API Gateway</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              Mobile App<br>
              &nbsp;├──→ User Service :3001<br>
              &nbsp;├──→ Booking Service :3002<br>
              &nbsp;├──→ Payment Service :3003<br>
              &nbsp;├──→ Match Service :3004<br>
              &nbsp;└──→ Notify Service :3005
            </div>
            <p style="font-size:.78rem;color:var(--red);margin-top:8px">Client knows about all services. Adding one service = updating all clients.</p>
          </div>
          <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:14px;">
            <div style="font-size:.8rem;font-weight:700;color:var(--green);margin-bottom:8px">✅ With API Gateway</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              Client<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
              API Gateway :443<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
              Routes to correct service
            </div>
            <p style="font-size:.78rem;color:var(--green);margin-top:8px">Client talks only to the gateway. Services can change without affecting clients.</p>
          </div>
        </div>
      </div>

      <div class="section-title">🏗️ PLAYKERS — API Gateway Architecture</div>
      <div class="anim-container">
        <div class="anim-label">Watch requests route through the gateway — try each button</div>
        <canvas id="apigCanvas" height="280"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="simulateAPIGRequest('mobile')">📱 Mobile Request</button>
          <button class="anim-btn" onclick="simulateAPIGRequest('web')">🌐 Web Request</button>
          <button class="anim-btn" onclick="simulateAPIGRequest('blocked')">🚫 Blocked (rate limit)</button>
          <button class="anim-btn" onclick="simulateAPIGRequest('aggregated')">🔀 Aggregated</button>
        </div>
        <div id="apigStatus" style="font-size:.82rem;color:var(--text2);margin-top:8px;min-height:20px;padding:4px 8px;"></div>
      </div>

      <div class="section-title">🔧 What an API Gateway Does</div>

      <div class="card">
        <h3>1. 🗺️ Routing</h3>
        <p>The gateway reads the request path and method, then routes to the correct service. The client only needs to know one address.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          GET /users/101 &nbsp;&nbsp;&nbsp;→ API Gateway → User Service<br>
          POST /bookings &nbsp;&nbsp;&nbsp;→ API Gateway → Booking Service<br>
          POST /payments &nbsp;&nbsp;&nbsp;→ API Gateway → Payment Service<br>
          GET /matches/today → API Gateway → Match Service
        </div>
        <p style="margin-top:8px"><strong>API Gateway = Request traffic controller</strong></p>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>2. 🔐 Authentication</h3>
        <p>Instead of every service independently implementing JWT verification, the gateway handles it once for all services:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Client → sends JWT token<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          API Gateway → validates JWT<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          JWT valid &nbsp;&nbsp;→ forward to backend ✅<br>
          JWT invalid → 401 Unauthorized ❌
        </div>
        <p style="margin-top:8px">Services receive only authenticated requests. No auth code needed in each service.</p>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>3. 🚦 Rate Limiting</h3>
        <p>If one user sends 10,000 requests per second, the gateway throttles them before they reach backend services:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          User sends 10,000 req/sec<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          API Gateway → Rate Limiter<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          100 requests → allowed ✅<br>
          9,900 requests → 429 Too Many Requests ❌
        </div>
        <p style="margin-top:8px">This protects backend services from abuse and ensures fair usage across all clients.</p>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>4. ⚖️ Load Balancing</h3>
        <p>When a service runs multiple instances, the gateway distributes requests across healthy ones:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Request → Gateway<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          &nbsp;&nbsp;┌────┬────┬────┐<br>
          &nbsp;&nbsp;B-1 &nbsp;B-2 &nbsp;B-3 &nbsp;← Booking instances<br><br>
          Round Robin / Least Connections
        </div>
        <p style="margin-top:8px">If Booking-2 goes down, the gateway detects it via health checks and stops routing to it automatically.</p>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>5. 🔄 Request / Response Transformation</h3>
        <p>Clients may send data in one format, but internal services expect another. The gateway transforms on the fly:</p>
        <table class="compare-table" style="margin-top:8px">
          <tr><th>Client sends</th><th>→</th><th>Service receives</th></tr>
          <tr><td><code>firstName, lastName</code></td><td>→</td><td><code>first_name, last_name</code></td></tr>
          <tr><td>REST/JSON</td><td>→</td><td>gRPC/Protocol Buffers</td></tr>
          <tr><td>Mobile payload (small)</td><td>→</td><td>Full internal DTO</td></tr>
        </table>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>6. 📊 Logging and Monitoring</h3>
        <p>The gateway is the single chokepoint — a perfect place to capture every request for debugging and analytics:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:1.9">
          Request ID: req-8f3a2b<br>
          User: user_101<br>
          Endpoint: POST /bookings<br>
          Status: 200 OK<br>
          Latency: 142ms<br>
          Timestamp: 2026-08-11T09:32:11Z
        </div>
        <p style="margin-top:8px">This log entry is generated for <em>every</em> request — even if the backend service doesn't log anything. Feeds into Datadog, Grafana, CloudWatch.</p>
      </div>

      <div class="section-title">🔧 Full Request Pipeline</div>
      <div class="card">
        <h3>What happens to every single request, in order:</h3>
        <ol style="padding-left:18px;line-height:2.2;font-size:.88rem;color:var(--text2)">
          <li><strong style="color:var(--red)">SSL Termination</strong> — decrypt HTTPS, forward plain HTTP internally</li>
          <li><strong style="color:var(--yellow)">Authentication</strong> — verify JWT / API key / OAuth token</li>
          <li><strong style="color:var(--yellow)">Authorization</strong> — check RBAC: does this user have permission?</li>
          <li><strong style="color:var(--accent2)">Rate Limiting</strong> — count requests per client, reject if over quota</li>
          <li><strong style="color:var(--cyan)">Routing</strong> — match path/method → correct microservice</li>
          <li><strong style="color:var(--cyan)">Load Balancing</strong> — pick healthy instance of target service</li>
          <li><strong style="color:var(--green)">Request Transform</strong> — field rename, REST → gRPC, add headers</li>
          <li><strong style="color:var(--green)">Response Aggregation</strong> — fan out to N services, merge results</li>
          <li><strong style="color:var(--text3)">Logging / Tracing</strong> — emit trace ID, log response status + latency</li>
        </ol>
      </div>

      <div class="section-title">🔀 BFF Pattern — Backend for Frontend</div>
      <div class="card">
        <h3>One gateway per client type</h3>
        <p>Mobile needs smaller payloads. Web needs richer data. Desktop and TV have different needs. Instead of one gateway serving all, use specialized gateways per consumer:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Mobile App → Mobile BFF → &nbsp;lightweight responses<br>
          Web App &nbsp;&nbsp;&nbsp;→ Web BFF &nbsp;&nbsp;→ &nbsp;rich aggregated data<br>
          Partner API → Partner BFF → rate-limited, versioned
        </div>
        <p style="margin-top:8px">Used by: <strong>Netflix</strong> (per device type), <strong>SoundCloud</strong> (coined the BFF pattern), <strong>Spotify</strong></p>
      </div>

      <div class="section-title">📊 API Gateway vs Service Mesh</div>
      <table class="compare-table">
        <tr><th>Concern</th><th>API Gateway</th><th>Service Mesh (Istio/Envoy)</th></tr>
        <tr><td>Traffic direction</td><td>North-South (client → cluster)</td><td>East-West (service → service)</td></tr>
        <tr><td>Auth</td><td>External clients (JWT, API keys)</td><td>Internal mTLS between services</td></tr>
        <tr><td>Rate limiting</td><td>Per external client</td><td>Per service-to-service call</td></tr>
        <tr><td>Observability</td><td>External request logs</td><td>Internal service mesh traces</td></tr>
        <tr><td>Who configures it</td><td>Gateway config / plugins</td><td>Sidecar proxies (no app changes)</td></tr>
      </table>

      <div class="section-title">🧠 One Line to Remember</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <p style="font-size:1rem;line-height:1.7"><strong>API Gateway = the front door of your microservices system.</strong> Clients talk to one address. The gateway handles auth, routing, rate limiting, and load balancing — so your services don't have to.</p>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Netflix Zuul — 100,000 RPS</div>
        <p>Netflix's Zuul gateway handles 100,000+ requests per second at peak. It does authentication, routing, A/B testing (route 5% of traffic to new service version), and dynamic load shedding. When backend services are slow, Zuul sheds load by rejecting with 503 — protecting the whole system from cascade failure.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Uber — One Call Fans Out to 5 Services</div>
        <p>When you open the Uber app, a single gateway call fans out to: Location Service, Pricing Service, Driver Service, Surge Service, and ETA Service. The gateway aggregates all responses into one JSON payload. Without it, your app would make 5 separate API calls — each with its own auth, latency, and failure mode.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Stripe — Idempotency at the Gateway</div>
        <p>Stripe's gateway enforces idempotency keys — if you send the same payment request twice after a timeout, the gateway detects the duplicate key and returns the original result without charging again. Idempotency keys are stored in Redis with a 24-hour TTL. This is entirely handled at the gateway layer, before the request reaches the payment service.</p>
      </div>

      <div class="card">
        <h3>Popular API Gateway Tools</h3>
        <p style="line-height:2.2">
          <span class="tag tag-yellow">AWS API Gateway — managed, serverless-friendly</span>&nbsp;
          <span class="tag tag-blue">Kong — open-source, plugin ecosystem</span>&nbsp;
          <span class="tag tag-green">Nginx — high-perf, reverse proxy</span>&nbsp;
          <span class="tag tag-purple">Zuul — Netflix OSS, JVM-based</span>&nbsp;
          <span class="tag tag-cyan">Traefik — container-native, auto-discovery</span>&nbsp;
          <span class="tag tag-red">Apigee — enterprise, Google Cloud</span>
        </p>
      </div>
      ${navButtons(this)}`;
    requestAnimationFrame(() => initAPIGCanvas());
  }
},

// ── SERVICE DISCOVERY ──────────────────────────────────────────
"service-discovery": {
  title: "Service Discovery",
  badge: "Architecture", badgeClass: "badge-architecture",
  subtitle: "Service Discovery is a mechanism that helps microservices in a distributed system find the correct network location (IP and Port) of other services dynamically without hardcoding.",
  prev: "api-gateway", next: "message-queues",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">🔍 What is Service Discovery?</div>
      <div class="card">
        <p><strong>Service Discovery = A system that keeps track of where microservice instances are running and helps other services find them dynamically.</strong></p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Service Registry (Phonebook)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↑ register / discover<br>
          Booking Service ─────────→ Payment Service (10.0.0.5:8080)
        </div>
      </div>

      <div class="section-title">❓ Why Do We Need Service Discovery?</div>
      <div class="card">
        <p>Suppose you have microservices: <code>User Service</code>, <code>Booking Service</code>, <code>Payment Service</code>, <code>Notification Service</code>.</p>
        <p style="margin-top:8px">The <strong>Booking Service</strong> needs to call the <strong>Payment Service</strong>.</p>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:12px">
          <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:12px">
            <div style="font-size:.78rem;font-weight:700;color:var(--red);margin-bottom:6px">❌ Without Service Discovery (Hardcoded IP)</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              Booking Service<br>
              &nbsp;&nbsp;↓ calls http://192.168.1.10:8080<br>
              Payment Service<br><br>
              Payment Service Crashes! 💥<br>
              New Instance starts at: 192.168.1.25:8080 ✅<br><br>
              Booking still calls 192.168.1.10 ❌ (CRASH)
            </div>
          </div>
          <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:12px">
            <div style="font-size:.78rem;font-weight:700;color:var(--green);margin-bottom:6px">✅ With Service Discovery (Dynamic)</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              Booking Service<br>
              &nbsp;&nbsp;↓ "Where is payment-service?"<br>
              Service Registry<br>
              &nbsp;&nbsp;↓ returns 192.168.1.25:8080 ✅<br>
              Booking calls Payment Service<br><br>
              Zero downtime, dynamic updates!
            </div>
          </div>
        </div>
      </div>

      <div class="section-title">📱 The Service Registry — Central Dynamic Phonebook</div>
      <div class="card">
        <p>Think of the Service Registry as a dynamic phonebook of your entire cluster:</p>
        <table class="compare-table" style="margin-top:10px">
          <tr><th>Service Name</th><th>Instance ID</th><th>Network Address</th><th>Health Status</th></tr>
          <tr><td>user-service</td><td>user-01</td><td>10.0.0.1:8080</td><td><span class="tag tag-green">HEALTHY</span></td></tr>
          <tr><td>payment-service</td><td>payment-01</td><td>10.0.0.5:8080</td><td><span class="tag tag-green">HEALTHY</span></td></tr>
          <tr><td>payment-service</td><td>payment-02</td><td>10.0.0.8:8080</td><td><span class="tag tag-green">HEALTHY</span></td></tr>
          <tr><td>notification-service</td><td>notify-01</td><td>10.0.0.12:8080</td><td><span class="tag tag-green">HEALTHY</span></td></tr>
        </table>
        <p style="margin-top:10px;font-size:.84rem;color:var(--text2)">When an instance boots up, it posts its metadata JSON to the registry:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:1.9">{
  "serviceName": "payment-service",
  "instanceId": "payment-01",
  "host": "10.0.0.5",
  "port": 8080,
  "status": "healthy"
}</div>
      </div>

      <div class="section-title">⚙️ Interactive Service Discovery Visualizer — PLAYKERS Booking System</div>
      <div class="anim-container">
        <div class="anim-label">6-Step Guided Animation: Registration → Discovery → Local Caching → Load Balancing → Failure → Auto-Scaling</div>
        <canvas id="sdCanvas" height="320"></canvas>

        <div class="anim-controls" style="flex-wrap:wrap;gap:6px;margin-top:10px;">
          <button class="anim-btn" onclick="sdPrevStep()">◀ Prev</button>
          <button class="anim-btn active" id="sdBtnStep1" onclick="setSDStep(1)">1️⃣ Registration</button>
          <button class="anim-btn" id="sdBtnStep2" onclick="setSDStep(2)">2️⃣ Book Turf</button>
          <button class="anim-btn" id="sdBtnStep3" onclick="setSDStep(3)">3️⃣ Cache</button>
          <button class="anim-btn" id="sdBtnStep4" onclick="setSDStep(4)">4️⃣ Load Balancer</button>
          <button class="anim-btn" id="sdBtnStep5" onclick="setSDStep(5)">5️⃣ Failure</button>
          <button class="anim-btn" id="sdBtnStep6" onclick="setSDStep(6)">6️⃣ Auto-Scale</button>
          <button class="anim-btn" id="sdNextBtn" onclick="sdNextStep()">Next ▶</button>
          <button class="anim-btn" id="sdPlayBtn" onclick="sdTogglePlay()">▶ Play Auto</button>
          <button class="anim-btn" onclick="sdReset()">🔄 Reset</button>
        </div>

        <div id="sdConceptPanel" class="card" style="margin-top:12px;border-color:var(--accent);background:rgba(99,102,241,0.06);padding:12px 16px;">
          <h4 id="sdConceptTitle" style="color:var(--accent2);font-size:.9rem;margin-bottom:4px;">Step 1: Service Registration</h4>
          <p id="sdConceptText" style="font-size:.82rem;color:var(--text2);line-height:1.7">Payment Services start up and automatically send registration POST requests to the central Service Registry with their IP address, port, and health metadata.</p>
        </div>

        <div style="margin-top:10px;">
          <div style="font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text3);margin-bottom:4px;">📜 Live System Event Log</div>
          <pre id="sdEventLog" class="highlight" style="font-family:'Fira Code',monospace;font-size:.76rem;line-height:1.8;padding:10px 14px;max-height:110px;overflow-y:auto;margin:0;color:#22c55e;">[10:00:01] Payment-1 (10.0.0.5:8080) registered with Service Registry
[10:00:02] Payment-2 (10.0.0.8:8080) registered with Service Registry
[10:00:03] Payment-3 (10.0.0.10:8080) registered with Service Registry</pre>
        </div>
      </div>

      <div class="section-title">⚡ Client-Side vs Server-Side Discovery</div>
      <table class="compare-table">
        <tr><th>Feature</th><th>📱 Client-Side Discovery</th><th>🌐 Server-Side Discovery</th></tr>
        <tr><td>Who queries registry?</td><td>Client / calling microservice directly</td><td>Load Balancer / API Gateway</td></tr>
        <tr><td>Who load-balances?</td><td>Client library (e.g. Netflix Ribbon)</td><td>Infrastructure Proxy (e.g. AWS ALB, Nginx)</td></tr>
        <tr><td>Client complexity</td><td>Higher (needs discovery library)</td><td>Lower (simple HTTP request)</td></tr>
        <tr><td>Network Hops</td><td>1 hop (Client → Target Service)</td><td>2 hops (Client → Gateway → Target)</td></tr>
        <tr><td>Technologies</td><td>Netflix Eureka, Spring Cloud LoadBalancer</td><td>Kubernetes Service / DNS, HashiCorp Consul + Envoy</td></tr>
      </table>

      <div class="section-title">💓 Heartbeats, Health Checks & Failure Handling</div>
      <div class="card">
        <h3>How does the Registry know if an instance dies?</h3>
        <p>Every active service instance sends a periodic heartbeat (e.g. every 10 seconds):</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Payment Instance → "I am alive ❤️" → Service Registry
        </div>
        <p style="margin-top:10px">If the registry misses 3 consecutive heartbeats:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Heartbeat ❌ → Heartbeat ❌ → Heartbeat ❌<br>
          Registry marks instance: UNHEALTHY ❌<br>
          Instance removed from discovery pool!
        </div>
      </div>

      <div class="section-title">⚡ Does Service Discovery Add Latency?</div>
      <div class="card">
        <p>If every single API request queried the Service Registry over the network first, it would double network latency!</p>
        <p style="margin-top:8px"><strong>Solution: Local Instance Caching</strong></p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:1.9">
          Booking Service maintains a Local Memory Cache:<br>
          payment-service = [10.0.0.5:8080, 10.0.0.8:8080, 10.0.0.10:8080]<br><br>
          Request 1..10,000 → Reads from Local Cache (0ms extra delay!)<br>
          Background thread syncs with Service Registry every 30s for updates.
        </div>
      </div>

      <div class="section-title">🗺️ Complete Animated System Discovery Architecture</div>
      <div class="card">
        <h3>End-to-End Microservices Discovery Flow</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2">
                USER<br>
                  │<br>
                  ▼<br>
           BOOKING SERVICE<br>
                  │<br>
        ┌─────────┴─────────┐<br>
        │                   │<br>
        ▼                   ▼<br>
  LOCAL SERVICE CACHE   SERVICE REGISTRY<br>
                                ▲<br>
                                │<br>
                          Heartbeats<br>
                                │<br>
                 ┌──────────────┼──────────────┐<br>
                 ▼              ▼              ▼<br>
             PAYMENT-1      PAYMENT-3      PAYMENT-4<br>
             Healthy ✓      Healthy ✓      Healthy ✓
        </div>
        <ol style="font-size:.85rem;line-height:2;color:var(--text2);margin-top:10px;padding-left:18px;">
          <li><strong>Service starts</strong> — Payment instances boot up in cloud/containers.</li>
          <li><strong>Auto-Registration</strong> — Send <code>POST /register</code> payload with IP & Port to Service Registry.</li>
          <li><strong>Registry Tracking</strong> — Registry maintains active health table.</li>
          <li><strong>Service Discovery</strong> — Booking Service queries Registry or reads Local Cache.</li>
          <li><strong>Load Balancing</strong> — Distributes traffic evenly (Round-Robin) across healthy instances.</li>
          <li><strong>Failure Removal</strong> — Missed heartbeats mark node ❌ UNHEALTHY & strip it from routing.</li>
          <li><strong>Dynamic Scaling</strong> — New Payment-4 registers automatically without restart.</li>
        </ol>
      </div>

      <div class="section-title">🔀 Service Discovery vs Load Balancer vs API Gateway</div>
      <table class="compare-table">
        <tr><th>Component</th><th>Core Question Answered</th><th>Example Technology</th></tr>
        <tr><td><span class="tag tag-blue">Service Discovery</span></td><td>"Where are all healthy instances running?"</td><td>HashiCorp Consul, Netflix Eureka, K8s CoreDNS</td></tr>
        <tr><td><span class="tag tag-yellow">Load Balancer</span></td><td>"Which single healthy instance gets this request?"</td><td>HAProxy, Nginx, AWS ALB</td></tr>
        <tr><td><span class="tag tag-green">API Gateway</span></td><td>"Is this client authenticated & allowed to enter?"</td><td>Kong, AWS API Gateway, Nginx</td></tr>
      </table>

      <div class="section-title">🧠 One-Line Interview Answer</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <p style="font-size:1rem;line-height:1.7"><strong>Service Discovery is a mechanism in distributed systems that allows microservices to dynamically register themselves and enables other services to discover healthy instances without hardcoding IP addresses.</strong></p>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Kubernetes CoreDNS & Kube-Proxy</div>
        <p>In Kubernetes, every Pod gets a dynamic ephemeral IP. Kubernetes runs <strong>CoreDNS</strong> as a built-in Service Discovery engine. When <code>booking-service</code> calls <code>http://payment-service</code>, CoreDNS resolves the domain to cluster Pod IPs automatically, while Kube-Proxy load-balances traffic across healthy Pods.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Netflix Eureka & Ribbon (Pioneer of Microservices)</div>
        <p>Netflix built <strong>Eureka</strong> to manage tens of thousands of AWS EC2 instances auto-scaling up and down dynamically. Client microservices use <strong>Ribbon</strong> for client-side load balancing, caching instance lists locally to achieve sub-millisecond routing across Netflix's streaming cluster.</p>
      </div>

      ${navButtons(this)}`;
    requestAnimationFrame(() => initSDCanvas());
  }
},

// ── MESSAGE QUEUES ─────────────────────────────────────────────
"message-queues": {
  title: "Message Queues",
  badge: "Architecture", badgeClass: "badge-architecture",
  subtitle: "A Message Queue is a system where one service puts a message into a queue and another service processes it later — enabling async, decoupled communication.",
  prev: "service-discovery", next: "event-driven",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">📨 What is a Message Queue?</div>
      <div class="card">
        <p>A Message Queue is a system where one service (Producer) puts a message into a queue and another service (Consumer) processes it later — independently.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Producer<br>
          &nbsp;&nbsp;&nbsp;↓<br>
          Message Queue<br>
          &nbsp;&nbsp;&nbsp;↓<br>
          Consumer
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>PLAYKERS Example — BookingCreated Event</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Booking Service<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ "BookingCreated"<br>
          Message Queue<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Notification Service
        </div>
        <p style="margin-top:8px">The Booking Service does <strong>not</strong> wait for Notification Service to finish. It publishes the event and immediately returns to the user.</p>
      </div>

      <div class="section-title">❓ Why Do We Need a Message Queue?</div>

      <div class="card">
        <h3>Problem Without a Queue — Slow Dependency</h3>
        <p>If Notification Service is slow, it makes the entire booking flow slow:</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:10px">
          <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:12px">
            <div style="font-size:.78rem;font-weight:700;color:var(--red);margin-bottom:6px">❌ Without Queue (Synchronous)</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              User<br>
              &nbsp;&nbsp;↓<br>
              Booking Service<br>
              &nbsp;&nbsp;↓ (waits…)<br>
              Notification Service<br>
              &nbsp;&nbsp;↓ 5 seconds<br>
              Response to User ← slow!
            </div>
          </div>
          <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:12px">
            <div style="font-size:.78rem;font-weight:700;color:var(--green);margin-bottom:6px">✅ With Queue (Asynchronous)</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              User<br>
              &nbsp;&nbsp;↓<br>
              Booking Service<br>
              &nbsp;&nbsp;↓ publish event<br>
              Queue<br>
              &nbsp;&nbsp;↓ Response to User ← fast! ✅<br>
              (Queue → Notify later)
            </div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>Problem Without a Queue — Service Down</h3>
        <p>If Notification Service is down entirely, a synchronous call would fail the booking:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Booking → Notification ❌<br>
          Booking fails too! ❌
        </div>
        <p style="margin-top:8px">With a queue: Booking succeeds, message sits in queue. When Notification recovers, it processes the backlog. <strong>Zero data loss.</strong></p>
      </div>

      <div class="section-title">📊 Queue as a Buffer — Handling Traffic Spikes</div>
      <div class="card">
        <h3>Notification Service normally processes 100 messages/second</h3>
        <p>Suddenly 10,000 booking events arrive during a tournament start:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Booking (×10,000)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Queue (10,000 messages waiting)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ 100/sec<br>
          Notification Service (processes gradually)
        </div>
        <p style="margin-top:8px">The queue acts as a <strong>buffer</strong>. Notification Service is never overwhelmed. It processes at its own pace — 100 seconds to drain the backlog, without crashing.</p>
      </div>

      <div class="section-title">� Live Simulation — Producer → Queue → Consumer</div>
      <div class="anim-container">
        <div class="anim-label">Produce messages and watch the queue buffer → consumer processes them</div>
        <canvas id="mqCanvas" height="260"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="mqProduce()">+ Produce Message</button>
          <button class="anim-btn" onclick="mqBurst()">⚡ Burst (×8)</button>
          <button class="anim-btn" onclick="mqReset()">↺ Reset</button>
        </div>
        <div id="mqStatus" style="font-size:.82rem;color:var(--text2);margin-top:8px;min-height:20px;padding:4px 8px;"></div>
      </div>

      <div class="section-title">📋 Message Acknowledgement</div>
      <div class="card">
        <h3>What happens when a consumer processes a message?</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Queue<br>
          &nbsp;├── Message 1<br>
          &nbsp;├── Message 2<br>
          &nbsp;├── Message 3<br>
          &nbsp;├── Message 4<br>
          &nbsp;└── Message 5<br><br>
          Message 1 → processed → acknowledged ✅<br>
          Message 2 → processed → acknowledged ✅<br>
          Message 3 → processing…
        </div>
        <p style="margin-top:8px">After successful processing, the consumer <strong>acknowledges</strong> the message — the queue removes it. If the consumer crashes mid-process, the unacknowledged message becomes available again for retry.</p>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>What if the consumer crashes?</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Queue → Notification Service 💥 (crash)<br>
          Message NOT acknowledged → stays in queue<br><br>
          Service restarts<br>
          Queue → Notification Service ✅<br>
          Message redelivered → processed ✅
        </div>
        <p style="margin-top:8px">Messages are not lost when a consumer crashes. This is one of the key reliability benefits of message queues.</p>
      </div>

      <div class="section-title">🛒 Real-World Example — E-Commerce Order</div>
      <div class="card">
        <h3>Customer places an order:</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Order Service<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Message Queue<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          &nbsp;┌─────────────┬──────────────┐<br>
          &nbsp;↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Email &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Inventory &nbsp;&nbsp;Analytics<br>
          Service &nbsp;&nbsp;Service &nbsp;&nbsp;&nbsp;&nbsp;Service
        </div>
        <p style="margin-top:8px">The Order Service publishes one event. Three consumers each get their own copy and process independently. Order Service doesn't wait for any of them — it returns 200 OK immediately.</p>
      </div>

      <div class="section-title">🔀 Queue vs Pub/Sub vs Kafka</div>
      <table class="compare-table">
        <tr><th>Model</th><th>Delivery</th><th>Retention</th><th>Best For</th><th>Tools</th></tr>
        <tr><td><span class="tag tag-blue">Point-to-Point Queue</span></td><td>One consumer per msg</td><td>Until consumed</td><td>Task queues, work distribution</td><td>SQS, RabbitMQ</td></tr>
        <tr><td><span class="tag tag-green">Pub/Sub</span></td><td>All subscribers get msg</td><td>Until consumed by each</td><td>Notifications, event fanout</td><td>SNS, Google Pub/Sub</td></tr>
        <tr><td><span class="tag tag-yellow">Kafka (Log)</span></td><td>Consumer groups pull</td><td>Days/weeks (configurable)</td><td>Event sourcing, stream processing</td><td>Apache Kafka, Redpanda</td></tr>
        <tr><td><span class="tag tag-purple">Stream</span></td><td>Sequential, ordered</td><td>Sliding window</td><td>Real-time analytics, ML</td><td>Kinesis, Kafka Streams</td></tr>
      </table>

      <div class="section-title">📦 Kafka — How It Works</div>
      <div class="anim-container">
        <div class="anim-label">Kafka Topics, Partitions and Consumer Groups</div>
        <canvas id="kafkaCanvas" height="240"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="kafkaDemo('produce')">Produce Events</button>
          <button class="anim-btn" onclick="kafkaDemo('lag')">Show Consumer Lag</button>
          <button class="anim-btn" onclick="kafkaDemo('rebalance')">Consumer Rebalance</button>
        </div>
        <div id="kafkaStatus" style="font-size:.82rem;color:var(--text2);margin-top:8px;min-height:20px;padding:4px 8px;"></div>
      </div>
      <div class="card">
        <ul>
          <li><strong>Log-based</strong> — messages written to an append-only log. Consumers track their own offset and can replay from any point.</li>
          <li><strong>Partitions</strong> — a topic is split into N partitions. Each partition is ordered. Parallelism = number of partitions.</li>
          <li><strong>Consumer Groups</strong> — multiple consumers share partitions. Add consumers to scale throughput linearly.</li>
          <li><strong>Retention</strong> — messages aren't deleted on consume. Replay the last 7 days to fix a bug.</li>
        </ul>
      </div>

      <div class="section-title">🛡️ Message Delivery Guarantees</div>
      <table class="compare-table">
        <tr><th>Guarantee</th><th>Meaning</th><th>Trade-off</th><th>Use when</th></tr>
        <tr><td><span class="tag tag-red">At-most-once</span></td><td>May be lost, never duplicated</td><td>Possible data loss</td><td>Metrics, analytics</td></tr>
        <tr><td><span class="tag tag-yellow">At-least-once</span></td><td>Delivered, may duplicate</td><td>Consumer must be idempotent</td><td>Most systems (default)</td></tr>
        <tr><td><span class="tag tag-green">Exactly-once</span></td><td>Delivered exactly once</td><td>Higher latency, 2PC overhead</td><td>Financial transactions</td></tr>
      </table>

      <div class="section-title">🧠 One Line to Remember</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <p style="font-size:1rem;line-height:1.7"><strong>Message Queue = Producer puts a message in, Consumer picks it up later.</strong> The producer doesn't wait. The queue buffers spikes, survives crashes, and decouples services.</p>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: LinkedIn — Kafka's Birthplace</div>
        <p>LinkedIn built Kafka in 2010 to replace N×M point-to-point pipelines. Kafka reduced this to N+M. Today LinkedIn processes <strong>7 trillion messages/day</strong>. Every page view, connection, and job application is a Kafka event consumed by multiple downstream services independently.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Slack — RabbitMQ + Dead Letter Queues</div>
        <p>Slack uses RabbitMQ to deliver notifications. If your phone is offline, messages stay in the queue until you reconnect — no data loss. Failed deliveries go to a <strong>Dead Letter Queue (DLQ)</strong> after 3 retries, allowing engineers to investigate and replay without losing messages.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Amazon SQS — Decoupled Order Processing</div>
        <p>Amazon's checkout service drops an order message into SQS. Inventory, shipping, email, and analytics services each consume independently. If the email service is down during a deploy, orders keep flowing — the queue builds up and drains when the service comes back. <strong>Zero data loss, zero coupling.</strong></p>
      </div>

      ${navButtons(this)}`;
    requestAnimationFrame(() => { initMQCanvas(); initKafkaCanvas(); });
  }
},

// ── EVENT-DRIVEN ──────────────────────────────────────────────
"event-driven": {
  title: "Event-Driven Architecture",
  badge: "Architecture", badgeClass: "badge-architecture",
  subtitle: "A service publishes an event describing something that happened, and other services react to that event — creating loose coupling, independent scaling, and natural resilience.",
  prev: "message-queues", next: "rate-limiting",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">📡 The Central Idea</div>
      <div class="card">
        <p>A service publishes an event describing something that <em>happened</em>, and other services react to it independently.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Booking Service<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ BookingCreated<br>
          Other services react…
        </div>
        <p style="margin-top:8px">The event says: <strong>"A booking was created."</strong><br>
        It does <em>not</em> say: <strong>"Notification Service, send an SMS."</strong><br>
        That distinction is everything.</p>
      </div>

      <div class="section-title">⚡ Command vs Event</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0">
        <div class="card" style="border-color:#3b82f6">
          <h3 style="color:#3b82f6">📋 Command</h3>
          <p>Tells another service to <strong>do something</strong>.</p>
          <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;margin-top:8px">SendNotification</div>
          <p style="margin-top:8px;font-size:.82rem">Meaning: "Please send a notification."<br>Directed at a <em>specific</em> service.</p>
        </div>
        <div class="card" style="border-color:#22c55e">
          <h3 style="color:#22c55e">📣 Event</h3>
          <p>Tells the system something <strong>already happened</strong>.</p>
          <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;margin-top:8px">BookingCreated</div>
          <p style="margin-top:8px;font-size:.82rem">Meaning: "A booking has been created."<br>Any service that cares can react.</p>
        </div>
      </div>
      <div class="card">
        <p style="text-align:center;font-size:.95rem;line-height:1.9">
          <strong style="color:#3b82f6">Command</strong> → Do this &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong style="color:#22c55e">Event</strong> → This happened
        </p>
      </div>

      <div class="section-title">🎯 PLAYKERS — Event-Driven Booking Flow</div>
      <div class="card">
        <h3>One event triggers multiple independent reactions</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          User<br>
          &nbsp;&nbsp;↓<br>
          Booking Service → booking created ✅<br>
          &nbsp;&nbsp;↓ BookingCreated event<br>
          Message Broker<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Notification &nbsp;Analytics &nbsp;Loyalty<br>
          Service &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Service &nbsp;&nbsp;&nbsp;Service<br><br>
          "SMS sent" &nbsp;&nbsp;Count +1 &nbsp;&nbsp;Points +10
        </div>
        <p style="margin-top:8px">The <strong>Booking Service doesn't know</strong> who subscribes to its events. That's loose coupling.</p>
      </div>

      <div class="section-title">📡 Live Event Flow — Watch the Cascade</div>
      <div class="anim-container">
        <div class="anim-label">Trigger an event and watch independent services react in parallel</div>
        <canvas id="edCanvas" height="280"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="triggerEvent('order')">🛒 BookingCreated</button>
          <button class="anim-btn" onclick="triggerEvent('payment')">💳 PaymentCharged</button>
          <button class="anim-btn" onclick="triggerEvent('ship')">📦 ItemShipped</button>
        </div>
        <div id="edStatus" style="font-size:.82rem;color:var(--text2);margin-top:8px;min-height:20px;padding:4px 8px;"></div>
      </div>

      <div class="section-title">� Message Queue vs Event-Driven Architecture</div>
      <div class="card">
        <p>They are related but not the same thing:</p>
        <table class="compare-table" style="margin-top:10px">
          <tr><th></th><th>Message Queue</th><th>Event-Driven Architecture</th></tr>
          <tr><td>Focuses on</td><td>How messages are transported and processed</td><td>How services communicate by reacting to events</td></tr>
          <tr><td>Mental model</td><td>Producer → Queue → Consumer</td><td>Something happened → Event → Consumers react</td></tr>
          <tr><td>Relationship</td><td colspan="2">A queue/broker is the <em>infrastructure</em> used to transport events in EDA</td></tr>
        </table>
      </div>

      <div class="section-title">📮 Queue vs Pub/Sub</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0">
        <div class="card" style="border-color:#06b6d4">
          <h3 style="color:#06b6d4">Queue</h3>
          <p>A message is processed by <strong>one</strong> consumer from a competing pool.</p>
          <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:1.9;margin-top:8px">
            Queue<br>
            &nbsp;&nbsp;↓<br>
            C-1 or C-2 or C-3
          </div>
          <p style="margin-top:8px;font-size:.78rem">Use case: 100 image-processing jobs distributed among workers. Each job done by exactly one worker.</p>
        </div>
        <div class="card" style="border-color:#22c55e">
          <h3 style="color:#22c55e">Pub/Sub</h3>
          <p>Multiple subscribers <strong>all receive</strong> the same event.</p>
          <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:1.9;margin-top:8px">
            Event<br>
            &nbsp;&nbsp;↓<br>
            Email + Analytics + Loyalty
          </div>
          <p style="margin-top:8px;font-size:.78rem">Use case: OrderCreated → all interested consumers react. Very common in EDA.</p>
        </div>
      </div>

      <div class="section-title">� Kafka Example</div>
      <div class="card">
        <h3>One Kafka topic → multiple independent consumers</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Booking Service<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Kafka Topic "booking-events"<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          ┌──────────┬───────────┬────────────┐<br>
          ↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Notification &nbsp;Analytics &nbsp;Recommendation<br>
          Consumer &nbsp;&nbsp;&nbsp;&nbsp;Consumer &nbsp;&nbsp;Consumer
        </div>
        <p style="margin-top:8px">Kafka is more accurately an <strong>event streaming platform</strong> — not just a traditional queue. Consumers read at their own pace, can replay, and each maintains its own offset.</p>
      </div>

      <div class="section-title">🔗 API Gateway + Queue + EDA Together</div>
      <div class="card">
        <h3>The full PLAYKERS booking request flow:</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          User<br>
          &nbsp;&nbsp;↓<br>
          DNS → Load Balancer<br>
          &nbsp;&nbsp;↓<br>
          API Gateway (auth + routing)<br>
          &nbsp;&nbsp;↓<br>
          Booking Service<br>
          &nbsp;&nbsp;↓<br>
          Booking DB (persisted)<br>
          &nbsp;&nbsp;↓<br>
          BookingCreated event published<br>
          &nbsp;&nbsp;↓<br>
          Message Broker<br>
          &nbsp;&nbsp;&nbsp;↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Notification &nbsp;Analytics &nbsp;Loyalty
        </div>
        <ol style="padding-left:18px;line-height:2.1;font-size:.86rem;color:var(--text2);margin-top:10px">
          <li><strong>POST /bookings</strong> — client sends request</li>
          <li><strong>API Gateway</strong> — authenticates JWT, rate-limits, routes</li>
          <li><strong>Booking Service</strong> — creates the booking</li>
          <li><strong>Database</strong> — booking is persisted (ACID)</li>
          <li><strong>BookingCreated event</strong> — published to broker</li>
          <li><strong>Message Broker</strong> — stores and fans out event</li>
          <li><strong>Consumers</strong> — Notification, Analytics, Loyalty react independently</li>
        </ol>
      </div>

      <div class="section-title">⚠️ Critical vs Non-Critical Dependencies</div>
      <div class="card">
        <h3>Not everything should be async</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:10px">
          <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:12px">
            <div style="font-size:.8rem;font-weight:700;color:var(--red);margin-bottom:6px">🔴 Critical — Use Sync</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              Booking → Payment<br><br>
              Payment ❌<br>
              Booking cannot confirm
            </div>
            <p style="font-size:.78rem;color:var(--text2);margin-top:6px">Payment is required before confirming. Use synchronous REST/gRPC.</p>
          </div>
          <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:12px">
            <div style="font-size:.8rem;font-weight:700;color:var(--green);margin-bottom:6px">🟢 Non-Critical — Use Async</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              Booking → Queue → Notify<br><br>
              Notify ❌<br>
              Booking ✅ (retry later)
            </div>
            <p style="font-size:.78rem;color:var(--text2);margin-top:6px">Notification can fail and retry. Booking still succeeds.</p>
          </div>
        </div>
      </div>

      <div class="section-title">� CQRS + Event Sourcing</div>
      <div class="card">
        <h3>Event Sourcing — store events, not state</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Event 1: BookingCreated &nbsp;&nbsp;(+₹500)<br>
          Event 2: BookingCancelled (−₹500)<br>
          Event 3: BookingCreated &nbsp;&nbsp;(+₹300)<br><br>
          Current balance = replay all events = ₹300
        </div>
        <p style="margin-top:8px">Full audit log, time-travel debugging, replay to fix bugs.</p>
        <div class="anim-container" style="margin:12px 0 0 0">
          <div class="anim-label">CQRS: Write path → Event Store → Read projections</div>
          <canvas id="cqrsCanvas" height="160"></canvas>
        </div>
      </div>

      <div class="section-title">🧠 Easy Memory Trick</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <table class="compare-table" style="margin-top:4px">
          <tr><td><strong style="color:var(--accent2)">API Gateway</strong></td><td>"Where should this request go?"</td></tr>
          <tr><td><strong style="color:var(--yellow)">Queue</strong></td><td>"Hold this message until it is processed."</td></tr>
          <tr><td><strong style="color:var(--green)">Event</strong></td><td>"Something happened — whoever cares can react."</td></tr>
        </table>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;margin-top:10px">
          Client → API Gateway → Microservice<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Database<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Event<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Message Broker<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other Microservices
        </div>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Shopify — 234,000 Orders/Minute on Black Friday</div>
        <p>When <code>order.created</code> fires, independent consumers handle inventory reservation, fraud scoring, email confirmation, analytics tracking, and fulfillment — all in parallel, none blocking each other. If the email service is slow, orders still ship.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Airbnb — Smart Pricing via Events</div>
        <p>When a booking is made or a local event detected (concert, festival), a <code>demand.signal</code> event triggers the pricing engine to recalculate prices for nearby listings in real time — without any synchronous API call from the booking service.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Grab — Saga Orchestration on Temporal</div>
        <p>Grab uses saga orchestration for their booking flow: driver matching → payment authorization → trip confirmation. If payment fails, the orchestrator sends a compensating command to release the matched driver. Built on <strong>Temporal.io</strong> — durable execution with automatic retries and state persistence.</p>
      </div>

      ${navButtons(this)}`;
    requestAnimationFrame(() => { initEDCanvas(); initCQRSCanvas(); });
  }
},

// ── RATE LIMITING ─────────────────────────────────────────────
"rate-limiting": {
  title: "Rate Limiting",
  badge: "Architecture", badgeClass: "badge-architecture",
  subtitle: "Rate limiting controls how many requests a user, IP, API key, or service can make within a specific period of time — protecting systems from abuse, ensuring fairness, and preventing resource exhaustion.",
  prev: "event-driven", next: "circuit-breaker",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">🚦 What is Rate Limiting?</div>
      <div class="card">
        <p>Rate limiting protects a system by restricting excessive requests.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          API Gateway<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Rate Limiter<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Maximum 100 requests / minute<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Backend Services
        </div>
        <p style="margin-top:10px">If a user sends 101 requests in one minute:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:1.9">
          Request 1   → ✅<br>
          Request 2   → ✅<br>
          …<br>
          Request 100 → ✅<br>
          Request 101 → ❌ <strong>HTTP 429 Too Many Requests</strong>
        </div>
      </div>

      <div class="section-title">❓ Why Do We Need Rate Limiting?</div>

      <div class="card">
        <h3>1. Prevent DDoS / Abuse</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:10px">
          <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:12px">
            <div style="font-size:.78rem;font-weight:700;color:var(--red);margin-bottom:6px">❌ Without Rate Limiting</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              Attacker 1M req/sec<br>↓↓↓↓↓↓↓↓↓<br>
              API Gateway<br>↓↓↓↓↓↓↓↓↓<br>
              Servers overloaded 💥
            </div>
          </div>
          <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:12px">
            <div style="font-size:.78rem;font-weight:700;color:var(--green);margin-bottom:6px">✅ With Rate Limiting</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              Attacker<br>&nbsp;&nbsp;&nbsp;↓<br>
              Rate Limiter<br>&nbsp;&nbsp;&nbsp;↓<br>
              Allowed requests only<br>&nbsp;&nbsp;&nbsp;↓<br>
              Backend protected ✅
            </div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>2. Prevent One User Consuming All Resources</h3>
        <p>PLAYKERS has 10,000 users. One user sends 50,000 requests/minute — consuming all CPU, RAM, DB connections, and network bandwidth.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:1.9">
          User A → 100 requests/min ✅<br>
          User B → 100 requests/min ✅<br>
          User C → 100 requests/min ✅<br>
          <strong>Fairness guaranteed</strong>
        </div>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>3. Protect Expensive APIs with Different Limits</h3>
        <p>Not all endpoints cost the same:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          GET /profile &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ 1000 requests/min<br>
          GET /search &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ 100 requests/min<br>
          POST /ai/analyze → 10 requests/min
        </div>
      </div>

      <div class="section-title">🔧 Where Is Rate Limiting Implemented?</div>
      <div class="card">
        <p>In a microservices architecture, typically at the API Gateway or edge layer:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Client<br>
          &nbsp;&nbsp;↓<br>
          DNS → Load Balancer<br>
          &nbsp;&nbsp;↓<br>
          API Gateway<br>
          &nbsp;&nbsp;↓<br>
          <strong>Rate Limiter</strong><br>
          &nbsp;&nbsp;↓<br>
          Microservices
        </div>
        <p style="margin-top:8px">Individual services can also implement their own rate limiting for additional protection.</p>
      </div>

      <div class="section-title">⚙️ The 4 Main Algorithms — Interactive</div>
      <div class="anim-container">
        <div class="anim-label">Switch algorithms and send requests to see how each handles bursts differently</div>
        <canvas id="rlCanvas" height="240"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="setRLAlgo('token-bucket')">🪣 Token Bucket</button>
          <button class="anim-btn" onclick="setRLAlgo('leaky-bucket')">💧 Leaky Bucket</button>
          <button class="anim-btn" onclick="setRLAlgo('sliding-window')">📊 Sliding Window</button>
          <button class="anim-btn" onclick="rlSendRequest()">Send Request</button>
          <button class="anim-btn" onclick="rlBurst()">Burst ×5</button>
        </div>
        <div id="rlStatus" style="font-size:.82rem;margin-top:8px;min-height:20px;padding:4px 8px;color:var(--text2);"></div>
      </div>

      <div class="section-title">📐 Algorithm Deep-Dive</div>

      <div class="card">
        <h3>1. Fixed Window</h3>
        <p>Set a fixed time period. Counter resets every minute.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:1.9">
          10:00:00 ───── max 100 requests ───── 10:01:00<br>
          10:01:00 ───── counter resets ────── 10:02:00
        </div>
        <p style="margin-top:8px"><strong style="color:var(--red)">⚠️ Boundary burst problem:</strong></p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:1.9">
          10:00:59 → 100 requests ✅ (last second of window)<br>
          10:01:00 → 100 requests ✅ (first second of next window)<br>
          = 200 requests in 2 seconds! ❌
        </div>
        <p style="margin-top:8px">✅ Very simple, low memory &nbsp;&nbsp; ❌ Burst at window boundary</p>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>2. Sliding Window</h3>
        <p>Instead of fixed calendar windows, always count requests in the <strong>last 60 seconds</strong>:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:1.9">
          Now = 10:01:30<br>
          Window = 10:00:30 → 10:01:30<br>
          If &gt; 100 requests in that window → ❌
        </div>
        <p style="margin-top:8px">✅ Better burst control &nbsp;&nbsp; ❌ More memory per user (timestamp storage)</p>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>3. 🪣 Token Bucket ⭐ Most Common</h3>
        <p>A bucket holds N tokens. Tokens refill at a fixed rate. Each request consumes one token.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Bucket capacity = 10 tokens<br>
          Refill = 2 tokens/sec<br><br>
          10 requests arrive instantly → 10 tokens consumed → all ✅<br>
          Request 11 → no tokens → ❌<br>
          5 seconds later → 10 tokens refilled → burst again ✅
        </div>
        <p style="margin-top:8px">✅ Allows controlled bursts &nbsp;&nbsp; Used by: AWS API GW, Nginx, Stripe, GitHub</p>
      </div>

      <div class="card" style="margin-top:12px">
        <h3>4. 💧 Leaky Bucket</h3>
        <p>Requests enter a queue (the bucket) and leak out at a fixed rate. If bucket is full → reject.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          500 requests arrive instantly<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Bucket (queue capacity = 100)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ 100 req/sec (fixed output rate)<br>
          Server receives smooth 100/sec<br>
          400 requests over capacity → ❌
        </div>
        <p style="margin-top:8px">✅ Smooth output rate &nbsp;&nbsp; ❌ No bursting &nbsp;&nbsp; Used for: traffic shaping</p>
      </div>

      <div class="section-title">📊 Token Bucket vs Leaky Bucket</div>
      <table class="compare-table">
        <tr><th></th><th>🪣 Token Bucket</th><th>💧 Leaky Bucket</th></tr>
        <tr><td>Burst requests</td><td style="color:var(--green)">Allows up to bucket capacity</td><td style="color:var(--yellow)">Smooths them out</td></tr>
        <tr><td>Main idea</td><td>Consume tokens</td><td>Drain at fixed output rate</td></tr>
        <tr><td>Useful for</td><td>APIs, user quotas</td><td>Traffic smoothing</td></tr>
        <tr><td>Flexibility</td><td>Higher</td><td>More predictable output</td></tr>
      </table>

      <div class="section-title">🎯 PLAYKERS Example — POST /api/bookings</div>
      <div class="card">
        <h3>Limit: 100 requests / minute / user</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          User (userId=101) → POST /api/bookings<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          API Gateway → Rate Limiter<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Redis: user:101 → requests = 73 / 100<br>
          73 &lt; 100 → ALLOW ✅<br><br>
          Later: user:101 → requests = 100 / 100<br>
          Next request → 101 / 100 → REJECT ❌<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          HTTP 429 Too Many Requests
        </div>
      </div>

      <div class="section-title">🗂️ What Can Rate Limiting Be Based On?</div>
      <table class="compare-table">
        <tr><th>Type</th><th>Key</th><th>Example</th><th>Use when</th></tr>
        <tr><td><span class="tag tag-blue">IP-based</span></td><td>Client IP address</td><td>192.168.1.10 → 100/min</td><td>Anonymous APIs, DDoS protection</td></tr>
        <tr><td><span class="tag tag-green">User-based</span></td><td>User ID / session</td><td>user:101 → 100/min</td><td>Logged-in applications</td></tr>
        <tr><td><span class="tag tag-yellow">API key</span></td><td>API key string</td><td>API_KEY_ABC → 10,000/day</td><td>Developer APIs (GitHub, Stripe)</td></tr>
        <tr><td><span class="tag tag-purple">Endpoint</span></td><td>Route path</td><td>/login→5/min, /search→100/min</td><td>Different cost per endpoint</td></tr>
        <tr><td><span class="tag tag-cyan">Global</span></td><td>Entire system</td><td>API GW → 100,000 req/sec</td><td>System-wide protection</td></tr>
      </table>

      <div class="section-title">🌐 Distributed Rate Limiting — The System Design Problem</div>
      <div class="card">
        <h3>The problem with multiple API Gateway instances</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:10px">
          <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:12px">
            <div style="font-size:.78rem;font-weight:700;color:var(--red);margin-bottom:6px">❌ Local counters (broken)</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              GW1 → user:101 = 50<br>
              GW2 → user:101 = 50<br>
              GW3 → user:101 = 50<br>
              Total = 150! (limit=100)
            </div>
          </div>
          <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:12px">
            <div style="font-size:.78rem;font-weight:700;color:var(--green);margin-bottom:6px">✅ Shared Redis counter</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              GW1 ─┐<br>
              GW2 ─┼─→ Redis<br>
              GW3 ─┘<br>
              user:101 = 98 (shared)
            </div>
          </div>
        </div>
        <p style="margin-top:10px">All gateway instances read/write the same Redis counter atomically using Lua scripts. Accurate across the entire cluster.</p>
      </div>

      <div class="section-title">🔀 Rate Limiting vs Load Balancing</div>
      <div class="card">
        <p>These are not the same — they answer different questions:</p>
        <table class="compare-table" style="margin-top:8px">
          <tr><th></th><th>Rate Limiting</th><th>Load Balancing</th></tr>
          <tr><td>Question</td><td><strong>Should this request be allowed?</strong></td><td><strong>Which server handles this request?</strong></td></tr>
          <tr><td>Decision</td><td>ALLOW or REJECT</td><td>Route to S1, S2, or S3</td></tr>
          <tr><td>Position</td><td>Before routing</td><td>After rate limit passes</td></tr>
        </table>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;margin-top:10px">
          Client → Rate Limiter → Load Balancer → S1 / S2 / S3
        </div>
      </div>

      <div class="section-title">⚙️ Production Implementation — Redis Lua Script</div>
      <div class="card">
        <h3>Token Bucket in Redis (atomic operation)</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:1.9;white-space:pre">local key = KEYS[1]
local capacity = tonumber(ARGV[1])    -- 100 tokens max
local refill_rate = tonumber(ARGV[2]) -- tokens per second
local now = tonumber(ARGV[3])
local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(bucket[1]) or capacity
local last = tonumber(bucket[2]) or now
tokens = math.min(capacity, tokens + (now - last) * refill_rate)
if tokens &gt;= 1 then
  redis.call('HMSET', key, 'tokens', tokens-1, 'last_refill', now)
  return 1  -- ALLOWED ✅
else
  return 0  -- REJECTED ❌ (429 Too Many Requests)
end</div>
      </div>

      <div class="section-title">🧠 One Line to Remember</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <p style="font-size:1rem;line-height:1.7"><strong>Rate Limiting = "Should this request be allowed?"</strong> Token Bucket allows bursts up to bucket size. Leaky Bucket smooths traffic. Both protect backend services from being overwhelmed.</p>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: OpenAI GPT-4 API — Dual Token Bucket (RPM + TPM)</div>
        <p>OpenAI uses a dual-dimensional Token Bucket: <strong>RPM</strong> (Requests Per Minute, e.g. 500 RPM) and <strong>TPM</strong> (Tokens Per Minute, e.g. 100,000 TPM). Because generating a 4,000-token response consumes 100× more GPU memory than a 10-token prompt, rate limiting by request count alone is insufficient. Every API response returns <code>x-ratelimit-remaining-requests</code> and <code>x-ratelimit-remaining-tokens</code> headers.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Ticketmaster / BookMyShow — Flash Sale & Leaky Bucket Traffic Shaping</div>
        <p>During IPL / Coldplay concert ticket launches, 1M+ users hit the API at the exact same second. API Gateways use <strong>Leaky Bucket rate limiting + virtual waiting rooms</strong> to smooth 1M req/sec spikes down to a steady 500 DB bookings/sec. Excess requests are queued or returned HTTP 429, protecting payment gateways and database locks from crashing.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: WhatsApp / Uber — Phone OTP SMS Fraud Prevention</div>
        <p>SMS gateways cost $0.05 per SMS. Attackers attempt SMS toll fraud by triggering 1,000 OTP requests per minute. Rate limiting uses a sliding window log per phone number: max 1 OTP per 60 seconds, max 5 per hour, max 10 per day. Excess attempts return HTTP 429 with <code>Retry-After: 3600</code>.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: GitHub — 5,000 req/hour with Response Headers</div>
        <p>GitHub uses token bucket: 5,000/hour for authenticated users, 60/hour unauthenticated. Every response includes: <code>X-RateLimit-Limit: 5000</code>, <code>X-RateLimit-Remaining: 4987</code>, <code>X-RateLimit-Reset: 1714000000</code>. When exhausted, returns HTTP 429 with Retry-After telling you exactly when to retry.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Stripe — Multi-Tier + Concurrency Limiting</div>
        <p>Stripe enforces 100 reads/sec and 100 writes/sec per API key. They also implement <strong>concurrency limiting</strong> — max 25 simultaneous in-flight requests per account. This prevents slow distributed transactions from holding connections open indefinitely, which would starve other customers.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Cloudflare — Edge Rate Limiting at 300+ Cities</div>
        <p>Cloudflare rate limits using a distributed sliding window at every edge PoP. During the 2023 record DDoS attack (71M requests/second), rate limiting at the edge meant zero traffic reached origin servers. Rules match on IP, cookie, user-agent, and even HTTP body content.</p>
      </div>

      ${navButtons(this)}`;
    requestAnimationFrame(() => initRLCanvas());
  }
},

// ── CIRCUIT BREAKER ───────────────────────────────────────────
"circuit-breaker": {
  title: "Circuit Breaker",
  badge: "Architecture", badgeClass: "badge-architecture",
  subtitle: "Circuit Breaker detects repeated failures in a dependency and temporarily stops requests to that dependency — preventing cascading failures and giving the system time to recover.",
  prev: "rate-limiting", next: "ha-ft",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">🔌 What is a Circuit Breaker?</div>
      <div class="card">
        <p>Like an electrical circuit breaker — when something is failing, it <strong>cuts the connection</strong> to prevent further damage.</p>
        <p style="margin-top:8px">In software: the Circuit Breaker detects repeated failures in a downstream service and <strong>stops sending requests to it</strong>, allowing both sides to recover.</p>
      </div>

      <div class="section-title">🏏 PLAYKERS Example — Booking → Payment</div>
      <div class="card">
        <h3>Normal operation</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Booking Service → Payment Service → Success ✅ → Booking Confirmed
        </div>
        <h3 style="margin-top:14px">Payment Service crashes — without Circuit Breaker</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;border-color:var(--red)">
          Request 1 → Payment ❌<br>
          Request 2 → Payment ❌<br>
          Request 3 → Payment ❌<br>
          …<br>
          Booking Service wastes: threads, connections, CPU, time<br>
          Eventually <strong>Booking Service itself crashes 💥</strong>
        </div>
        <p style="margin-top:8px">Circuit Breaker prevents this cascade.</p>
      </div>

      <div class="section-title">🔴🟡🟢 Three States — Interactive</div>
      <div class="anim-container">
        <div class="anim-label">Simulate failures to trip the circuit, then watch it recover</div>
        <canvas id="cbCanvas" height="260"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="cbSimulate('success')">✅ Success</button>
          <button class="anim-btn" onclick="cbSimulate('fail')">❌ Fail</button>
          <button class="anim-btn" onclick="cbSimulate('burst')">💥 Burst Failures (×5)</button>
          <button class="anim-btn" onclick="cbReset()">↺ Reset</button>
        </div>
        <div id="cbStatus" style="font-size:.82rem;margin-top:8px;min-height:44px;padding:8px 10px;background:var(--bg);border-radius:6px;color:var(--text2);line-height:1.6;"></div>
      </div>

      <div class="section-title">📋 The Three States Explained</div>

      <div class="card">
        <h3>🟢 CLOSED — Normal Operation</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Booking Service<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Circuit Breaker (CLOSED)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Payment Service → Success ✅
        </div>
        <p style="margin-top:8px">Requests flow through normally. Circuit monitors failure rate. When failures reach the configured threshold → trips to <strong>OPEN</strong>.</p>
        <div class="highlight">Config example: Failure threshold = 5 consecutive failures</div>
      </div>

      <div class="card" style="margin-top:12px;border-color:var(--red)">
        <h3 style="color:var(--red)">🔴 OPEN — Fail Fast</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;border-color:var(--red)">
          Booking Service<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Circuit Breaker (OPEN)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          ✕ Payment Service (not called)
        </div>
        <p style="margin-top:8px">Requests <strong>immediately fail</strong> without ever calling Payment Service. Why?</p>
        <ul style="margin-top:8px;font-size:.88rem;color:var(--text2);line-height:1.9;padding-left:18px">
          <li>Payment is already unhealthy — calling it wastes resources</li>
          <li>Payment gets breathing room to recover</li>
          <li>Booking Service frees up threads for other work</li>
        </ul>
        <div class="highlight">After a recovery timeout (e.g., 30 seconds) → moves to HALF-OPEN</div>
      </div>

      <div class="card" style="margin-top:12px;border-color:var(--yellow)">
        <h3 style="color:var(--yellow)">🟡 HALF-OPEN — Recovery Probe</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;border-color:var(--yellow)">
          OPEN → 30 seconds → HALF-OPEN<br><br>
          Send 1 test request → Payment<br><br>
          Test → Success ✅ → CLOSED (normal resumed)<br>
          Test → Failure ❌ → OPEN (wait again)
        </div>
        <p style="margin-top:8px">HALF-OPEN doesn't open the floodgates immediately — it sends a controlled <strong>probe request</strong> to check if the service recovered before resuming full traffic.</p>
      </div>

      <div class="section-title">🔄 Complete State Transition</div>
      <div class="card">
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Success<br>
          &nbsp;&nbsp;&nbsp;┌────────────────────┐<br>
          &nbsp;&nbsp;&nbsp;│ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          CLOSED ──→ OPEN<br>
          &nbsp;&nbsp;&nbsp;↑ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
          &nbsp;&nbsp;&nbsp;│ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;timeout<br>
          &nbsp;&nbsp;&nbsp;│ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          &nbsp;&nbsp;&nbsp;└──────── HALF-OPEN<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\<br>
          Success &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Failure<br>
          &nbsp;&nbsp;&nbsp;↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          CLOSED &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OPEN
        </div>
      </div>

      <div class="section-title">🔴🟡🟢 Cascading Failure — Without vs With CB</div>
      <div class="anim-container">
        <div class="anim-label">See how Circuit Breaker isolates failure vs cascade without it</div>
        <canvas id="cbCascadeCanvas" height="220"></canvas>
        <div class="anim-controls">
          <button class="anim-btn active" onclick="cbCascadeDemo('without')">Without CB</button>
          <button class="anim-btn" onclick="cbCascadeDemo('with')">With CB</button>
        </div>
        <div id="cbCascadeStatus" style="font-size:.82rem;margin-top:8px;min-height:20px;padding:4px 8px;color:var(--text2);"></div>
      </div>

      <div class="section-title">📨 What Happens to the User When OPEN?</div>
      <div class="card">
        <h3>Use a Fallback — don't just return an error</h3>
        <table class="compare-table" style="margin-top:8px">
          <tr><th>Strategy</th><th>Example</th></tr>
          <tr><td><span class="tag tag-green">User-friendly message</span></td><td>"Payment unavailable. Please try again in a few minutes."</td></tr>
          <tr><td><span class="tag tag-blue">Cached response</span></td><td>Return last known good data (stock price, product info)</td></tr>
          <tr><td><span class="tag tag-yellow">Degraded mode</span></td><td>Hide the feature entirely (no recommendations shown)</td></tr>
          <tr><td><span class="tag tag-purple">Queue for later</span></td><td>Accept request, process when service recovers</td></tr>
        </table>
        <div class="highlight" style="margin-top:10px">
          <strong>Critical dependency (Payment):</strong> Cannot confirm booking without payment — show error.<br>
          <strong>Non-critical (Notification):</strong> Booking succeeds → event queued → retry notification later.
        </div>
      </div>

      <div class="section-title">⚠️ Circuit Breaker + Retry — Be Careful</div>
      <div class="card">
        <h3>Retry without Circuit Breaker = worse outage</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;border-color:var(--red)">
          Payment overloaded<br>
          &nbsp;&nbsp;&nbsp;↓<br>
          10,000 requests fail<br>
          &nbsp;&nbsp;&nbsp;↓<br>
          All clients retry immediately<br>
          &nbsp;&nbsp;&nbsp;↓<br>
          20,000 requests → Payment even more overloaded 💥
        </div>
        <p style="margin-top:8px">Retries should always use:</p>
        <ul style="padding-left:18px;line-height:1.9;font-size:.88rem;color:var(--text2)">
          <li><strong>Limited retry count</strong> — don't retry forever</li>
          <li><strong>Exponential backoff</strong> — wait 1s, 2s, 4s, 8s between retries</li>
          <li><strong>Jitter</strong> — randomize the wait to avoid thundering herd</li>
        </ul>
        <div class="highlight" style="margin-top:10px">Circuit Breaker and Retry together: CB prevents the retry storm from even reaching the failing service.</div>
      </div>

      <div class="section-title">📊 Circuit Breaker vs Other Patterns</div>
      <table class="compare-table">
        <tr><th>Concept</th><th>Protects against</th><th>Example</th></tr>
        <tr><td><span class="tag tag-red">Circuit Breaker</span></td><td>Failing / unhealthy dependency</td><td>Payment Service down → stop calling it</td></tr>
        <tr><td><span class="tag tag-yellow">Rate Limiting</span></td><td>Too many incoming requests</td><td>User sends 1M req/sec → throttle</td></tr>
        <tr><td><span class="tag tag-green">Load Balancer</span></td><td>Uneven traffic distribution</td><td>Route to healthy instances</td></tr>
        <tr><td><span class="tag tag-blue">Retry</span></td><td>Transient temporary failures</td><td>Network blip → retry once</td></tr>
        <tr><td><span class="tag tag-cyan">Timeout</span></td><td>Slow/hanging requests</td><td>Payment no response → fail after 3s</td></tr>
      </table>
      <div class="card" style="margin-top:12px">
        <h3>They all work together in the request pipeline:</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Users → Rate Limiter → Load Balancer → Booking Service<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Circuit Breaker (+ Timeout + Retry)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Payment Service
        </div>
      </div>

      <div class="section-title">⏱️ Circuit Breaker + Timeout</div>
      <div class="card">
        <p>A Circuit Breaker works with timeouts. Without a timeout, a hanging request could block a thread for minutes:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          Booking → Payment → ………………… 60 seconds 🚨<br><br>
          With timeout = 3s:<br>
          Booking → Payment → 3s → Timeout ❌<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Timeout counts as failure<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          5 timeouts → Circuit Breaker OPENS
        </div>
      </div>

      <div class="section-title">🧠 One-Line Memory</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <table class="compare-table" style="margin-top:4px">
          <tr><td><strong style="color:var(--green)">CLOSED</strong></td><td>"Everything is normal — requests flow through."</td></tr>
          <tr><td><strong style="color:var(--red)">OPEN</strong></td><td>"Stop calling the failing service — fail fast."</td></tr>
          <tr><td><strong style="color:var(--yellow)">HALF-OPEN</strong></td><td>"Let's test whether it recovered."</td></tr>
        </table>
        <p style="margin-top:12px;font-size:.9rem;line-height:1.7;color:var(--text2)">
          <strong style="color:var(--accent2)">Overall purpose:</strong> Circuit Breaker prevents a failure in one service from causing unnecessary repeated calls and cascading failures throughout the system.
        </p>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Netflix Hystrix → Resilience4j</div>
        <p>Netflix invented Hystrix in 2011 for every inter-service call. When the recommendation engine fails, Hystrix opens the circuit and returns a fallback "Top 10" list instead of an error. At Netflix scale, without circuit breakers, a slow recommendation service would cascade — exhausting thread pools and crashing the entire API layer. Hystrix has been replaced by <strong>Resilience4j</strong> (lighter, reactive-friendly).</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Uber — CB Between Dispatch and Maps API</div>
        <p>Uber's dispatch system uses circuit breakers between services and external mapping APIs. When Google Maps API is slow, Uber's circuit breaker opens and falls back to cached route calculations — drivers still get navigation, just without live traffic. Without the breaker, every ride request would hang waiting for Maps, stalling dispatch entirely.</p>
      </div>

      ${navButtons(this)}`;
    requestAnimationFrame(() => { initCBCanvas(); initCBCascadeCanvas(); });
  }
},

// ── HIGH AVAILABILITY & FAULT TOLERANCE ────────────────────────
"ha-ft": {
  title: "High Availability & Fault Tolerance",
  badge: "Architecture", badgeClass: "badge-architecture",
  subtitle: "High Availability (HA) minimizes system downtime through redundancy and failover, while Fault Tolerance (FT) enables a system to continue operating correctly even when individual components fail.",
  prev: "circuit-breaker", next: "auth-authz",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">📌 High Availability vs Fault Tolerance</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0">
        <div class="card" style="border-color:var(--accent)">
          <h3 style="color:var(--accent2)">⚡ High Availability (HA)</h3>
          <p style="font-size:.85rem;color:var(--text2)"><em>Focus: Keep the system UP and accessible</em></p>
          <ul style="margin-top:8px;font-size:.84rem;color:var(--text2);line-height:1.8;padding-left:16px">
            <li>Minimizes downtime using redundancy</li>
            <li>Reroutes traffic away from failed nodes</li>
            <li>Measures availability in "Nines" (e.g. 99.99%)</li>
            <li><strong>Example:</strong> Load Balancer → S2 when S1 crashes</li>
          </ul>
        </div>
        <div class="card" style="border-color:var(--green)">
          <h3 style="color:var(--green)">🛡️ Fault Tolerance (FT)</h3>
          <p style="font-size:.85rem;color:var(--text2)"><em>Focus: Survive failures without stopping operations</em></p>
          <ul style="margin-top:8px;font-size:.84rem;color:var(--text2);line-height:1.8;padding-left:16px">
            <li>Handles faults gracefully (degraded mode / retry)</li>
            <li>Operation continues correctly despite node loss</li>
            <li>Uses queues, circuit breakers, & fallbacks</li>
            <li><strong>Example:</strong> Booking succeeds even if Notification fails</li>
          </ul>
        </div>
      </div>

      <div class="section-title">⚖️ HA vs Fault Tolerance Comparison</div>
      <table class="compare-table">
        <tr><th>Feature</th><th>⚡ High Availability (HA)</th><th>🛡️ Fault Tolerance (FT)</th></tr>
        <tr><td>Core Goal</td><td>Minimize system downtime</td><td>Survive component failures gracefully</td></tr>
        <tr><td>Primary Mechanism</td><td>Redundancy, Health Checks, Failover</td><td>Retry, Timeouts, Queues, Replicas, Circuit Breakers</td></tr>
        <tr><td>User Experience</td><td>Service remains accessible</td><td>Operation completes correctly without crash</td></tr>
        <tr><td>Failed Node Handling</td><td>Traffic rerouted to healthy backup</td><td>System handles failure inline or asynchronously</td></tr>
        <tr><td>Key Example</td><td>Load Balancer → healthy server</td><td>Async Queue buffers notification retry</td></tr>
      </table>

      <div class="section-title">⚙️ Interactive HA & FT Simulator — PLAYKERS Booking System</div>
      <div class="anim-container">
        <div class="anim-label">Simulate server crashes, database failovers, and non-critical service failures</div>
        <canvas id="haCanvas" height="300"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="haSimulate('failS1')">💥 Fail Booking S1 (HA)</button>
          <button class="anim-btn" onclick="haSimulate('failDB')">💥 Fail Primary DB (Failover)</button>
          <button class="anim-btn" onclick="haSimulate('failNotify')">💥 Fail Notification (FT)</button>
          <button class="anim-btn" onclick="haSimulate('traffic')">⚡ Send Traffic</button>
          <button class="anim-btn" onclick="haReset()">🔄 Restore All</button>
        </div>
        <div id="haStatus" style="font-size:.82rem;color:var(--text2);margin-top:8px;min-height:20px;padding:4px 8px;">Status: All systems operational (Active-Active Booking Servers, Primary + Replica DBs)</div>
      </div>

      <div class="section-title">🗄️ Database Failover: Active-Passive vs Active-Active</div>
      <div class="card">
        <h3>Primary DB Failure & Replica Promotion</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:10px">
          <div style="background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.3);border-radius:8px;padding:12px">
            <div style="font-size:.8rem;font-weight:700;color:var(--accent2);margin-bottom:6px">🔄 Active-Passive (Master-Slave)</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              Primary (Active) → Reads/Writes ✅<br>
              Backup (Passive) → Standby waiting<br><br>
              When Primary crashes ❌:<br>
              Backup promoted to New Primary ✅
            </div>
          </div>
          <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.3);border-radius:8px;padding:12px">
            <div style="font-size:.8rem;font-weight:700;color:var(--green);margin-bottom:6px">⚡ Active-Active (Multi-Master)</div>
            <div style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2;color:var(--text2)">
              Server 1 (Active) → Serves traffic ✅<br>
              Server 2 (Active) → Serves traffic ✅<br><br>
              When S1 crashes ❌:<br>
              S2 handles 100% of traffic automatically
            </div>
          </div>
        </div>
      </div>

      <div class="section-title">💓 Health Checks — How Load Balancers Detect Failures</div>
      <div class="card">
        <p>Load Balancers poll backend instances periodically (e.g. every 5 seconds):</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2">
          GET /health → 200 OK {"status": "healthy"}<br><br>
          S1 → 200 OK ✅ (Healthy)<br>
          S2 → No response ❌ (Marked Down)<br>
          S3 → 200 OK ✅ (Healthy)<br><br>
          Result: Load Balancer removes S2 from routing table instantly!
        </div>
      </div>

      <div class="section-title">⚠️ Critical vs Non-Critical Dependencies</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0">
        <div class="card" style="border-color:var(--red)">
          <h3 style="color:var(--red)">🔴 Critical Dependency (Payment)</h3>
          <p style="font-size:.84rem;color:var(--text2)">Booking <strong>cannot be confirmed</strong> without payment confirmation.</p>
          <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.78rem;margin-top:8px">
            Payment ❌ → Booking fails fast<br>
            Return: "Payment unavailable, try again."
          </div>
        </div>
        <div class="card" style="border-color:var(--green)">
          <h3 style="color:var(--green)">🟢 Non-Critical Dependency (Notification)</h3>
          <p style="font-size:.84rem;color:var(--text2)">Booking <strong>can succeed</strong> even if SMS/email notification fails.</p>
          <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.78rem;margin-top:8px">
            Booking saved to DB ✅<br>
            Notification event queued for async retry!
          </div>
        </div>
      </div>

      <div class="section-title">🚢 Bulkhead Pattern — Isolating Failures</div>
      <div class="card">
        <p>Inspired by ship watertight compartments — if one compartment floods, the ship stays afloat.</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:1.9">
          Application Connection Pools:<br>
          ├── Payment Thread Pool &nbsp;&nbsp;&nbsp;&nbsp;(10 threads)<br>
          ├── Notification Thread Pool (10 threads)<br>
          └── Search Thread Pool &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(10 threads)<br><br>
          If Notification Service hangs, it only consumes its 10 threads.<br>
          Payment & Search pools remain 100% operational!
        </div>
      </div>

      <div class="section-title">📈 Availability Percentages — The "Nines" Table</div>
      <table class="compare-table">
        <tr><th>Availability</th><th>Downtime per Year</th><th>Downtime per Month</th><th>Downtime per Day</th></tr>
        <tr><td><span class="tag tag-red">99% (Two Nines)</span></td><td>3.65 days</td><td>7.3 hours</td><td>14.4 minutes</td></tr>
        <tr><td><span class="tag tag-yellow">99.9% (Three Nines)</span></td><td>8.76 hours</td><td>43.8 minutes</td><td>1.44 minutes</td></tr>
        <tr><td><span class="tag tag-blue">99.99% (Four Nines)</span></td><td>52.6 minutes</td><td>4.38 minutes</td><td>8.64 seconds</td></tr>
        <tr><td><span class="tag tag-green">99.999% (Five Nines)</span></td><td>5.26 minutes</td><td>25.9 seconds</td><td>0.86 seconds</td></tr>
      </table>

      <div class="section-title">🌐 Multi-AZ & Multi-Region Resilience</div>
      <div class="card">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:4px">
          <div>
            <h4 style="color:var(--accent2)">🏢 Multi-AZ (Availability Zones)</h4>
            <p style="font-size:.82rem;color:var(--text2);line-height:1.7;margin-top:4px">Deploy servers across separate physical datacenters in the same region. If Zone A power fails, Zone B continues instantly.</p>
          </div>
          <div>
            <h4 style="color:var(--green)">🌍 Multi-Region</h4>
            <p style="font-size:.82rem;color:var(--text2);line-height:1.7;margin-top:4px">Deploy complete stacks across continents (e.g. India Region & US Region). Protects against total regional disasters.</p>
          </div>
        </div>
      </div>

      <div class="section-title">🗺️ Complete Highly Available PLAYKERS Architecture</div>
      <div class="card">
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2">
                         USERS<br>
                           │<br>
                           ▼<br>
                    DNS / CDN Layer<br>
                           │<br>
                           ▼<br>
                  Load Balancer Cluster<br>
                           │<br>
                ┌──────────┴──────────┐<br>
                ▼                     ▼<br>
         Availability Zone A    Availability Zone B<br>
                │                     │<br>
          Booking S1              Booking S3<br>
          Booking S2              Booking S4<br>
                │                     │<br>
                └──────────┬──────────┘<br>
                           ▼<br>
                     Message Queue<br>
                           │<br>
             ┌─────────────┼─────────────┐<br>
             ▼             ▼             ▼<br>
          Payment      Notification   Analytics<br>
          Service       Service        Service<br>
             │<br>
             ▼<br>
        Database Primary<br>
             │<br>
             ▼<br>
        Database Replicas
        </div>
      </div>

      <div class="section-title">🧠 One-Line Interview Summary</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <p style="font-size:.95rem;line-height:1.8">
          <strong>HA = Keep the system UP.</strong> (Redundancy, Load Balancing, Failover, Health Checks)<br>
          <strong>Fault Tolerance = Handle component failures gracefully.</strong> (Retries, Circuit Breakers, Queues, Bulkheads)<br>
          <strong>Failover = Automatically switch to backup.</strong><br>
          <strong>Replication = Keep multiple copies of data.</strong>
        </p>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: AWS S3 — 99.999999999% (11 Nines) Durability</div>
        <p>AWS S3 stores objects redundantly across a minimum of 3 physical Availability Zones within an AWS Region. It is engineered to withstand concurrent loss of data in two facilities without losing user data.</p>
      </div>
      <div class="real-world" style="margin-top:10px">
        <div class="real-world-title">🌍 Real-World: Netflix Chaos Engineering (Chaos Monkey)</div>
        <p>Netflix intentionally terminates random production instances during business hours using <strong>Chaos Monkey</strong> to verify that auto-scaling groups, health checks, and circuit breakers handle real-world failures automatically without impacting subscribers.</p>
      </div>

      ${navButtons(this)}`;
    requestAnimationFrame(() => initHAFlowCanvas());
  }
},
// ── AUTHENTICATION & AUTHORIZATION ────────────────────────────
"auth-authz": {
  title: "Authentication & Authorization",
  badge: "Architecture", badgeClass: "badge-architecture",
  subtitle: "Authentication verifies WHO a user is, while Authorization determines WHAT resources or actions that authenticated user is allowed to access.",
  prev: "ha-ft", next: "blob-storage",
  render(c) {
    c.innerHTML = `
      ${hero(this)}

      <div class="section-title">🔑 Authentication & Authorization — Comprehensive Theory & Architecture</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.05)">
        <h3 style="color:var(--accent2)">🏢 The Office Building Analogy</h3>
        <p style="font-size:.88rem;color:var(--text2);line-height:1.8">
          • <strong>Authentication (AuthN):</strong> At the main entrance gate, security checks your official photo ID card. <em>("Who are you? -> Yes, you are Dinesh.")</em><br>
          • <strong>Authorization (AuthZ):</strong> Inside the building, you swipe your keycard at the executive server room door. <em>("Are you allowed to enter this specific room? -> No, 403 Forbidden.")</em>
        </p>
      </div>

      <div class="section-title">📌 Core Distinction</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0">
        <div class="card" style="border-color:var(--cyan)">
          <h3 style="color:var(--cyan)">🔑 Authentication (AuthN)</h3>
          <p style="font-size:.85rem;color:var(--text2)"><em>Question: "Who are you?"</em></p>
          <ul style="margin-top:8px;font-size:.84rem;color:var(--text2);line-height:1.8;padding-left:16px">
            <li>Verifies user identity credentials</li>
            <li>Happens <strong>FIRST</strong> in request lifecycle</li>
            <li>Uses Passwords, OTP, OAuth, JWT, Biometrics</li>
            <li><strong>Failure Code:</strong> 401 Unauthorized</li>
            <li><strong>Example:</strong> Dinesh logs into PLAYKERS with email/password ✅</li>
          </ul>
        </div>
        <div class="card" style="border-color:var(--purple)">
          <h3 style="color:var(--purple)">🛡️ Authorization (AuthZ)</h3>
          <p style="font-size:.85rem;color:var(--text2)"><em>Question: "What are you allowed to do?"</em></p>
          <ul style="margin-top:8px;font-size:.84rem;color:var(--text2);line-height:1.8;padding-left:16px">
            <li>Checks permissions & roles (RBAC / ABAC)</li>
            <li>Happens <strong>AFTER</strong> successful authentication</li>
            <li>Determines ALLOW vs DENY for endpoints & resources</li>
            <li><strong>Failure Code:</strong> 403 Forbidden</li>
            <li><strong>Example:</strong> Dinesh (PLAYER) tries DELETE /users → 403 Forbidden ❌</li>
          </ul>
        </div>
      </div>

      <div class="section-title">⚙️ Interactive Security Simulator — PLAYKERS Booking System</div>
      <div class="anim-container">
        <div class="anim-label">Test logging in as different user roles and making API requests (Watch 401 vs 403 responses)</div>
        <canvas id="authCanvas" height="300"></canvas>
        <div class="anim-controls" style="flex-wrap:wrap;gap:6px;">
          <button class="anim-btn active" id="authBtnDinesh" onclick="authLogin('dinesh')">👤 Login: Dinesh (PLAYER)</button>
          <button class="anim-btn" id="authBtnArun" onclick="authLogin('arun')">🏟️ Login: Arun (TURF_OWNER)</button>
          <button class="anim-btn" id="authBtnAdmin" onclick="authLogin('admin')">👑 Login: Admin (ADMIN)</button>
          <button class="anim-btn" id="authBtnAnon" onclick="authLogin('anon')">🚫 Logout (Anonymous)</button>
          <button class="anim-btn" onclick="authCallAPI('book')">⚽ POST /book-turf</button>
          <button class="anim-btn" onclick="authCallAPI('add')">🏟️ POST /add-turf</button>
          <button class="anim-btn" onclick="authCallAPI('delete')">❌ DELETE /users/123</button>
        </div>
        <div id="authStatus" style="font-size:.82rem;color:var(--text2);margin-top:8px;min-height:20px;padding:4px 8px;">Status: Logged in as Dinesh (Role: PLAYER) | JWT Issued: eyJhbGciOi...</div>
      </div>

      <div class="section-title">🔐 Password Hashing & Security (Argon2id / bcrypt)</div>
      <div class="card">
        <h3>Never store plain-text passwords!</h3>
        <p>Storing plain-text passwords in databases is illegal and dangerous. Always apply salted cryptographic hashing:</p>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.82rem;line-height:2;margin-top:10px">
          Plain Password ("password123") + Random Salt<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          bcrypt / Argon2id Hashing Algorithm<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          Stored Hash: $2b$12$e86xJ.. (Irreversible & Immune to Rainbow Table attacks)
        </div>
      </div>

      <div class="section-title">📱 Multi-Factor Authentication (MFA)</div>
      <div class="card">
        <p>MFA combines two or more distinct verification factors:</p>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px">
          <div style="background:rgba(99,102,241,.08);padding:10px;border-radius:6px">
            <strong style="color:var(--accent2);font-size:.8rem">1. Something You Know</strong>
            <p style="font-size:.76rem;color:var(--text2);margin-top:4px">Passwords, PINs, secret security questions.</p>
          </div>
          <div style="background:rgba(34,197,94,.08);padding:10px;border-radius:6px">
            <strong style="color:var(--green);font-size:.8rem">2. Something You Have</strong>
            <p style="font-size:.76rem;color:var(--text2);margin-top:4px">Phone SMS OTP, Authenticator app TOTP, Hardware YubiKey.</p>
          </div>
          <div style="background:rgba(236,72,153,.08);padding:10px;border-radius:6px">
            <strong style="color:#ec4899;font-size:.8rem">3. Something You Are</strong>
            <p style="font-size:.76rem;color:var(--text2);margin-top:4px">Biometric Fingerprint, Face ID scan, Iris recognition.</p>
          </div>
        </div>
      </div>

      <div class="section-title">🎟️ JSON Web Tokens (JWT) Deep-Dive</div>
      <div class="card">
        <h3>Stateless Token Structure & Warning</h3>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.8rem;line-height:2">
          <span style="color:var(--red)">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>.<span style="color:var(--purple)">eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoiUExBWUVSIiwiaWF0IjoxNTE2MjM5MDIyfQ</span>.<span style="color:var(--cyan)">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>
        </div>
        <p style="margin-top:10px;font-size:.84rem;color:var(--text2)">
          ⚠️ <strong>IMPORTANT:</strong> JWT payloads are <em>encoded</em> (Base64URL), not <em>encrypted</em>. Anyone can decode and view claims! Never store passwords, secret keys, or credit card numbers in a JWT payload.
        </p>
      </div>

      <div class="section-title">⚡ Access Token vs Refresh Token Architecture</div>
      <div class="card">
        <table class="compare-table">
          <tr><th>Token Type</th><th>Lifespan</th><th>Usage & Storage</th><th>Purpose</th></tr>
          <tr><td><span class="tag tag-green">Access Token</span></td><td>Short (15 minutes)</td><td>Sent in <code>Authorization: Bearer</code> header</td><td>Stateless API request authorization</td></tr>
          <tr><td><span class="tag tag-purple">Refresh Token</span></td><td>Long (7–30 days)</td><td>Stored in HttpOnly Secure Cookie</td><td>Obtain new Access Token when expired</td></tr>
        </table>
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:1.9;margin-top:10px">
          Access Token Expired (401) → Client sends Refresh Token → Auth Server verifies → Issues New Access Token ✅
        </div>
      </div>

      <div class="section-title">🛡️ RBAC vs ABAC (Role vs Attribute-Based Access Control)</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0">
        <div class="card" style="border-color:var(--blue)">
          <h3 style="color:var(--blue)">👔 Role-Based Access Control (RBAC)</h3>
          <p style="font-size:.84rem;color:var(--text2)">Permissions assigned strictly based on user role (PLAYER / TURF_OWNER / ADMIN).</p>
          <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.76rem;margin-top:8px">
            if (user.role === 'ADMIN') allow();
          </div>
        </div>
        <div class="card" style="border-color:var(--green)">
          <h3 style="color:var(--green)">🎯 Attribute-Based Access Control (ABAC)</h3>
          <p style="font-size:.84rem;color:var(--text2)">Evaluates attributes: User ID, Resource Owner ID, Location, Time, & Environment.</p>
          <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.76rem;margin-top:8px">
            if (user.role === 'TURF_OWNER' && user.id === turf.ownerId) allow();
          </div>
        </div>
      </div>

      <div class="section-title">🚨 401 vs 403 vs 404 (Security Obfuscation)</div>
      <table class="compare-table">
        <tr><th>Status Code</th><th>Meaning</th><th>When Returned</th></tr>
        <tr><td><span class="tag tag-red">401 Unauthorized</span></td><td>Authentication Missing / Invalid</td><td>No token, expired JWT, invalid digital signature.</td></tr>
        <tr><td><span class="tag tag-yellow">403 Forbidden</span></td><td>Identity Verified, Access Denied</td><td>Dinesh (PLAYER) trying to access ADMIN endpoints.</td></tr>
        <tr><td><span class="tag tag-cyan">404 Not Found</span></td><td>Security Obfuscation / Missing</td><td>Returned instead of 403 to hide existence of sensitive internal URLs from attackers!</td></tr>
      </table>

      <div class="section-title">🔗 Service-to-Service Authentication in Microservices</div>
      <div class="card">
        <p>How does Payment Service know a request genuinely came from Booking Service?</p>
        <ul style="font-size:.84rem;color:var(--text2);line-height:1.9;padding-left:18px">
          <li><strong>mTLS (Mutual TLS):</strong> Both services verify client/server X.509 SSL certificates.</li>
          <li><strong>OAuth 2.0 Client Credentials:</strong> Booking Service gets a service-to-service JWT token.</li>
          <li><strong>Identity Propagation:</strong> API Gateway strips client headers and injects trusted internal headers (e.g. <code>X-User-Id: 123</code>, <code>X-User-Role: PLAYER</code>).</li>
        </ul>
      </div>

      <div class="section-title">⚠️ Common Security Attacks & Protections</div>
      <table class="compare-table">
        <tr><th>Attack Type</th><th>Description</th><th>Protection Mechanism</th></tr>
        <tr><td><strong style="color:var(--red)">Brute Force</strong></td><td>Automated scripts guess passwords rapidly</td><td>Rate limiting, CAPTCHA, Account locking</td></tr>
        <tr><td><strong style="color:var(--yellow)">Credential Stuffing</strong></td><td>Using leaked credentials from other sites</td><td>Multi-Factor Authentication (MFA), Anomaly detection</td></tr>
        <tr><td><strong style="color:var(--purple)">Token Theft / XSS</strong></td><td>Stealing JWT tokens from client memory</td><td>HttpOnly Secure Cookies, Short Token TTL, HTTPS encryption</td></tr>
      </table>

      <div class="section-title">🗺️ Complete Microservices Security Architecture</div>
      <div class="card">
        <div class="highlight" style="font-family:'Fira Code',monospace;font-size:.78rem;line-height:2">
                     USER<br>
                       │<br>
                       ▼<br>
                  LOGIN / SIGNUP<br>
                       │<br>
                       ▼<br>
                 AUTH SERVICE<br>
                       │<br>
              Verify Credentials (bcrypt / Argon2id)<br>
                       │<br>
                       ▼<br>
              Access Token (JWT) Issued<br>
                       │<br>
                       ▼<br>
                   API GATEWAY<br>
                       │<br>
                 Verify Token Signature (AuthN)<br>
                       │<br>
          ┌────────────┼────────────┐<br>
          ▼            ▼            ▼<br>
      BOOKING       PAYMENT       MATCH<br>
      SERVICE       SERVICE       SERVICE<br>
          │<br>
          ▼<br>
   RBAC / ABAC Permission Check (AuthZ)<br>
          │<br>
      ALLOW (200 OK) / DENY (403 Forbidden)
        </div>
      </div>

      <div class="section-title">🧠 Master Interview Cheat Sheet</div>
      <div class="card" style="border-color:var(--accent);background:rgba(99,102,241,0.06)">
        <p style="font-size:.92rem;line-height:1.8">
          • <strong>AuthN (Authentication):</strong> Verifies WHO you are. (Passwords, OTP, OAuth, JWT)<br>
          • <strong>AuthZ (Authorization):</strong> Verifies WHAT you can do. (RBAC, ABAC, Scopes)<br>
          • <strong>401 Unauthorized:</strong> Missing or invalid credentials. ("Who are you?")<br>
          • <strong>403 Forbidden:</strong> Authenticated identity lacks permission. ("I know you, but NO.")<br>
          • <strong>OAuth 2.0:</strong> Delegated authorization framework. | <strong>OIDC:</strong> Identity layer on top of OAuth.<br>
          • <strong>Password Rule:</strong> Never store plain-text; always salt & hash using <code>Argon2id</code> or <code>bcrypt</code>.
        </p>
      </div>

      <div class="real-world">
        <div class="real-world-title">🌍 Real-World: Auth0, Keycloak & AWS Cognito</div>
        <p>Modern cloud architectures offload authentication to dedicated Identity Providers (IdP) like Auth0, Keycloak, or AWS Cognito, providing single sign-on (SSO), social logins, MFA, and automated JWT token rotation out of the box.</p>
      </div>

      ${navButtons(this)}`;
    requestAnimationFrame(() => initAuthCanvas());
  }
},

// ── BLOB STORAGE ──────────────────────────────────────────────
"blob-storage": {
  title: "Blob Storage",
  badge: "Storage & Scale", badgeClass: "badge-storage",
  subtitle: "Blob (Binary Large Object) storage is designed for unstructured data like images, videos, and files at massive scale.",
  prev: "auth-authz", next: "search",
  render(c) {
    c.innerHTML = `
      ${hero(this)}
      <div class="section-title">📦 How Blob Storage Works</div>
      <div class="anim-container">
        <div class="anim-label">Upload / Download Flow</div>
        <canvas id="blobCanvas" height="200"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="simulateBlob('upload')">Simulate Upload</button>
          <button class="anim-btn" onclick="simulateBlob('download')">Simulate Download</button>
        </div>
      </div>
      <div class="card">
        <h3>Key Characteristics</h3>
        <ul>
          <li><strong>Flat namespace</strong> — no directory hierarchy (though paths can simulate it)</li>
          <li><strong>Immutable</strong> — objects replaced, not modified in place</li>
          <li><strong>Infinite scale</strong> — exabytes of storage available</li>
          <li><strong>Metadata</strong> — key-value tags on each object</li>
          <li><strong>Access control</strong> — public URLs, signed URLs, ACLs</li>
        </ul>
      </div>
      <div class="real-world">
        <div class="real-world-title">🌍 Real-World Example</div>
        <p><strong>Instagram</strong> stores billions of photos in AWS S3. When you upload, the image goes to S3 → a CDN caches it → users download from the nearest edge. S3 stores the data across multiple availability zones automatically, guaranteeing 99.999999999% (11 nines) durability.</p>
      </div>
      <div class="card">
        <h3>Popular Blob Storage Services</h3>
        <p>
          <span class="tag tag-yellow">AWS S3</span>
          <span class="tag tag-blue">Azure Blob Storage</span>
          <span class="tag tag-red">Google Cloud Storage</span>
          <span class="tag tag-green">Cloudflare R2</span>
          <span class="tag tag-purple">MinIO (self-hosted)</span>
        </p>
      </div>
      ${navButtons(this)}`;
    initBlobCanvas();
  }
},

// ── SEARCH ────────────────────────────────────────────────────
search: {
  title: "Search Systems",
  badge: "Storage & Scale", badgeClass: "badge-storage",
  subtitle: "Full-text search engines use inverted indexes to enable fast, relevant searching across billions of documents.",
  prev: "blob-storage", next: "realtime",
  render(c) {
    c.innerHTML = `
      ${hero(this)}
      <div class="section-title">🔍 Inverted Index</div>
      <div class="anim-container">
        <div class="anim-label">How an Inverted Index Works</div>
        <canvas id="searchCanvas" height="200"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="searchDemo('netflix')">Search "netflix"</button>
          <button class="anim-btn" onclick="searchDemo('stream')">Search "stream"</button>
          <button class="anim-btn" onclick="searchDemo('movie')">Search "movie"</button>
        </div>
        <div id="searchResult" style="font-size:.82rem;color:var(--text2);margin-top:8px;min-height:24px;"></div>
      </div>
      <div class="card">
        <h3>How Elasticsearch Works</h3>
        <ul>
          <li><strong>Indexing</strong> — text is tokenized, normalized, stored in inverted index</li>
          <li><strong>Sharding</strong> — index split across primary shards for scale</li>
          <li><strong>Replicas</strong> — each shard replicated for HA and read throughput</li>
          <li><strong>Relevance scoring</strong> — TF-IDF and BM25 algorithms rank results</li>
        </ul>
      </div>
      <div class="real-world">
        <div class="real-world-title">🌍 Real-World Example</div>
        <p><strong>LinkedIn</strong> uses Elasticsearch for job and profile search across 900M+ users. <strong>GitHub</strong> indexes code for search across 200M+ repositories. <strong>Wikipedia</strong> full-text search runs on Elasticsearch with custom relevance tuning for encyclopedia articles.</p>
      </div>
      ${navButtons(this)}`;
    initSearchCanvas();
  }
},

// ── REAL-TIME ─────────────────────────────────────────────────
realtime: {
  title: "Real-time Systems",
  badge: "Storage & Scale", badgeClass: "badge-storage",
  subtitle: "Real-time systems deliver data to users instantly — chat, live updates, notifications, and collaborative editing.",
  prev: "search", next: null,
  render(c) {
    c.innerHTML = `
      ${hero(this)}
      <div class="section-title">🔔 Real-time Protocols</div>
      <div class="anim-container">
        <div class="anim-label">WebSocket Connection — Bidirectional</div>
        <canvas id="rtCanvas" height="220"></canvas>
        <div class="anim-controls">
          <button class="anim-btn" onclick="rtSend('client')">Client → Server</button>
          <button class="anim-btn" onclick="rtSend('server')">Server → Client</button>
          <button class="anim-btn" onclick="rtSend('broadcast')">Broadcast</button>
        </div>
      </div>
      <table class="compare-table">
        <tr><th>Technology</th><th>Direction</th><th>Use Case</th></tr>
        <tr><td>WebSocket</td><td>Bidirectional</td><td>Chat, collaborative editing, live gaming</td></tr>
        <tr><td>Server-Sent Events</td><td>Server → Client</td><td>Live feeds, stock tickers, notifications</td></tr>
        <tr><td>Long Polling</td><td>Simulated push</td><td>Legacy fallback</td></tr>
        <tr><td>WebRTC</td><td>P2P</td><td>Video calls, screen sharing</td></tr>
      </table>
      <div class="real-world">
        <div class="real-world-title">🌍 Real-World Example</div>
        <p><strong>Slack</strong> uses WebSockets to push messages instantly. When you send a message, it goes server → all connected clients in the channel via persistent WebSocket connections. They maintain millions of open connections using lightweight connection servers separate from application servers.</p>
      </div>
      <div class="section-title">🎉 You've completed the roadmap!</div>
      <div class="card">
        <p>You've covered the core system design concepts. Next steps:</p>
        <ul>
          <li>Practice designing systems from scratch (URL shortener, Twitter, Netflix)</li>
          <li>Deep dive into specific technologies: Kafka, Kubernetes, Redis</li>
          <li>Study real engineering blogs: AWS Architecture Blog, Netflix Tech Blog, Uber Engineering</li>
        </ul>
      </div>
      ${navButtons(this)}`;
    initRTCanvas();
  }
},

}; // end TOPICS

// ============================================================
//  SHARED HELPERS
// ============================================================
function hero(t) {
  return `<div class="topic-hero fade-in">
    <div class="topic-badge ${t.badgeClass}">${t.badge}</div>
    <div class="topic-title">${t.title}</div>
    <div class="topic-subtitle">${t.subtitle}</div>
  </div>`;
}

function navButtons(t) {
  const prev = t.prev ? `<button class="btn btn-outline" onclick="loadTopic('${t.prev}')">← Previous</button>` : '';
  const next = t.next ? `<button class="btn btn-primary" onclick="loadTopic('${t.next}')">Next →</button>` : '<button class="btn btn-success">🎉 All Done!</button>';
  return `<div class="nav-buttons">${prev}${next}</div>`;
}
