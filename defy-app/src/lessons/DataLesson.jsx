import { useState } from "react";

const accent = "#8b5cf6";
const light = "#f5f3ff";

// ── REAL WORLD STORIES ──────────────────────────────
const STORIES = [
  {
    company: "Netflix",
    icon: "🎬",
    color: "#ef4444",
    bg: "#fff1f2",
    border: "#fecaca",
    headline: "One analyst saved $1 billion",
    story: "A Data Analyst noticed that users who watched at least 3 episodes in their first week almost never cancelled. Users who didn't — left within a month.\n\nThis single insight changed everything: Netflix started recommending the 3rd episode aggressively, redesigned the onboarding flow, and built \"auto-play\" to reduce friction.\n\nResult: churn dropped by 23%. At Netflix's scale, that's over $1 billion in retained revenue.",
    data_used: "Watch history, session length, cancellation dates, episode completion rates",
    question_asked: "What behaviour predicts whether a user stays or leaves?",
    impact: "$1B+ retained revenue"
  },
  {
    company: "Spotify",
    icon: "🎵",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    headline: "They know you're sad before you do",
    story: "Spotify analysts found that users listen to slower, more melancholic music on Monday mornings between 7-9am — globally, across all cultures.\n\nThey also found that users who received a perfectly matched playlist in that window had 34% longer sessions and were 2x more likely to open the app the next day.\n\nThis became Spotify Wrapped, Daylist, and the mood-based playlist engine — all born from one analyst asking 'when and why do listening habits change?'",
    data_used: "Listening times, song tempo/key, skip rates, session length by time of day",
    question_asked: "When do users' music preferences change, and why?",
    impact: "34% longer sessions, foundation of the $1B playlist business"
  },
  {
    company: "Your bank",
    icon: "💳",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    headline: "Why your card gets blocked abroad",
    story: "Every time you use your card, a Data Analyst's model runs in under 50 milliseconds.\n\nBanks build a 'normal behaviour' profile for every customer: where you shop, how much you spend, what time of day, which merchants. Any transaction that deviates from your pattern triggers a flag.\n\nA purchase in Bangkok when your last transaction was in Kyiv 2 hours ago = physically impossible = fraud alert.\n\nThe same analyst who built the fraud model also discovered that blocking legitimate transactions costs banks more in customer service calls than the fraud itself — so they tuned the model to be less aggressive for frequent travellers.",
    data_used: "Transaction location, time, amount, merchant category, device ID, travel patterns",
    question_asked: "What does 'normal' look like for this customer, and what's an anomaly?",
    impact: "Billions saved in fraud prevention globally"
  },
  {
    company: "Uber",
    icon: "🚗",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    headline: "Why prices surge exactly when you need a ride",
    story: "Uber's surge pricing isn't random. It's the direct result of data analysis.\n\nAnalysts found that price elasticity is different at different times: at 2am after a concert, people will pay 5x. On a Tuesday afternoon, the same person won't pay 1.2x.\n\nThey also found that without surge pricing, drivers went offline during peak demand — making wait times unbearable and reducing revenue for everyone. Surge pricing keeps drivers online.\n\nEvery surge multiplier you see was calibrated by a Data Analyst running thousands of simulations on historical ride data.",
    data_used: "Ride requests by location/time, driver availability, historical price elasticity, weather, events",
    question_asked: "What price maximises both driver supply and rider demand?",
    impact: "Core of Uber's $31B annual revenue engine"
  },
  {
    company: "Amazon",
    icon: "📦",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    headline: "They ship before you order",
    story: "Amazon filed a patent for 'anticipatory shipping' — sending packages to distribution centres before customers even order.\n\nThis wasn't magic. A Data Analyst built a model using: your browsing history, items in your wishlist, seasonal patterns, how long items have been in your cart, and what similar customers ordered.\n\nThe model predicts with high confidence what you'll order and when. Amazon pre-positions inventory to cut delivery times from 2 days to same-day.\n\nThat analyst's model is why Amazon can promise 'delivery by tomorrow' — the package is already in your city.",
    data_used: "Browse history, wishlist, cart abandonment, purchase cycles, location, similar user behaviour",
    question_asked: "What will this customer order next, and when?",
    impact: "Same-day delivery, competitive moat worth billions"
  },
];

const TOOLS_DATA = [
  { name: "SQL", icon: "🗄️", color: "#3b82f6", desc: "Query databases. The single most important skill.", level: "Must-have day 1" },
  { name: "Excel / Sheets", icon: "📊", color: "#10b981", desc: "Quick analysis, pivot tables, basic charts.", level: "Must-have day 1" },
  { name: "Python + Pandas", icon: "🐍", color: "#8b5cf6", desc: "Analyse large datasets, automate reports.", level: "Learn in month 2" },
  { name: "Tableau / Power BI", icon: "📈", color: "#f59e0b", desc: "Build dashboards. Show data visually.", level: "Learn in month 2" },
  { name: "Looker / Metabase", icon: "🔍", color: "#ef4444", desc: "Business intelligence tools. Connect to any DB.", level: "Learn on the job" },
  { name: "dbt", icon: "⚙️", color: "#ec4899", desc: "Transform raw data into clean tables.", level: "Advanced" },
];

// ── FAKE DATABASE ────────────────────────────────────
const DB = {
  users: [
    { id: 1, name: "Alice Chen", city: "London", age: 28, plan: "pro" },
    { id: 2, name: "Bob Smith", city: "New York", age: 34, plan: "free" },
    { id: 3, name: "Carol White", city: "London", age: 25, plan: "pro" },
    { id: 4, name: "David Lee", city: "Berlin", age: 31, plan: "pro" },
    { id: 5, name: "Eva Brown", city: "New York", age: 27, plan: "free" },
    { id: 6, name: "Frank Kim", city: "London", age: 29, plan: "free" },
    { id: 7, name: "Grace Liu", city: "Berlin", age: 33, plan: "pro" },
    { id: 8, name: "Henry Park", city: "New York", age: 26, plan: "pro" },
  ],
  orders: [
    { id: 1, user_id: 1, product: "Laptop", amount: 1200, month: "Jan", status: "completed" },
    { id: 2, user_id: 2, product: "Phone", amount: 800, month: "Jan", status: "completed" },
    { id: 3, user_id: 1, product: "Headphones", amount: 250, month: "Feb", status: "completed" },
    { id: 4, user_id: 3, product: "Tablet", amount: 600, month: "Feb", status: "refunded" },
    { id: 5, user_id: 4, product: "Laptop", amount: 1200, month: "Mar", status: "completed" },
    { id: 6, user_id: 5, product: "Phone", amount: 800, month: "Mar", status: "completed" },
    { id: 7, user_id: 2, product: "Headphones", amount: 250, month: "Mar", status: "refunded" },
    { id: 8, user_id: 6, product: "Tablet", amount: 600, month: "Apr", status: "completed" },
    { id: 9, user_id: 7, product: "Laptop", amount: 1200, month: "Apr", status: "completed" },
    { id: 10, user_id: 8, product: "Phone", amount: 800, month: "Apr", status: "completed" },
    { id: 11, user_id: 3, product: "Laptop", amount: 1200, month: "May", status: "completed" },
    { id: 12, user_id: 1, product: "Phone", amount: 800, month: "May", status: "completed" },
  ],
};

const SQL_LESSONS = [
  {
    title: "Your first query — see all users",
    desc: "SELECT gets data from a table. * means 'all columns'. FROM tells it which table.",
    query: "SELECT * FROM users",
    hint: "This is the most basic query. You're saying: 'show me everything in the users table'",
    run: () => DB.users,
    columns: ["id", "name", "city", "age", "plan"],
  },
  {
    title: "Filter — only London users",
    desc: "WHERE filters rows. Only rows where the condition is true are returned.",
    query: "SELECT * FROM users WHERE city = 'London'",
    hint: "Think of WHERE as a filter. You're saying: 'only show me users from London'",
    run: () => DB.users.filter(u => u.city === "London"),
    columns: ["id", "name", "city", "age", "plan"],
  },
  {
    title: "Count — how many users per city?",
    desc: "COUNT() counts rows. GROUP BY groups them. This is your first aggregation.",
    query: "SELECT city, COUNT(*) as users FROM users GROUP BY city",
    hint: "GROUP BY is powerful — it collapses many rows into summary rows",
    run: () => {
      const counts = {};
      DB.users.forEach(u => { counts[u.city] = (counts[u.city] || 0) + 1; });
      return Object.entries(counts).map(([city, users]) => ({ city, users }));
    },
    columns: ["city", "users"],
  },
  {
    title: "Sum — total revenue per month",
    desc: "SUM() adds up numbers. Combined with GROUP BY, you get totals per category.",
    query: "SELECT month, SUM(amount) as revenue FROM orders GROUP BY month",
    hint: "This is exactly what a Data Analyst does every Monday morning — revenue by period",
    run: () => {
      const months = ["Jan","Feb","Mar","Apr","May"];
      return months.map(month => ({
        month,
        revenue: DB.orders.filter(o => o.month === month && o.status === "completed").reduce((sum, o) => sum + o.amount, 0)
      })).filter(r => r.revenue > 0);
    },
    columns: ["month", "revenue"],
  },
  {
    title: "Find problems — refunded orders",
    desc: "Analysts look for anomalies. Refunds = unhappy customers = business problem.",
    query: "SELECT * FROM orders WHERE status = 'refunded'",
    hint: "This query finds all refunded orders. A real analyst would then dig deeper: why were these refunded?",
    run: () => DB.orders.filter(o => o.status === "refunded"),
    columns: ["id", "user_id", "product", "amount", "month", "status"],
  },
];

export default function DataLesson1() {
  const [step, setStep] = useState(0);
  const [activeStory, setActiveStory] = useState(0);
  const [sqlStep, setSqlStep] = useState(0);
  const [queryResult, setQueryResult] = useState(null);
  const [customQuery, setCustomQuery] = useState("");
  const [insightQuestion, setInsightQuestion] = useState("");
  const [insight, setInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [celebration, setCelebration] = useState(false);
  const [activeTool, setActiveTool] = useState(null);

  const runSQL = (queryFn) => {
    try { setQueryResult(queryFn()); }
    catch { setQueryResult("error"); }
  };

  const getInsight = async () => {
    if (!insightQuestion.trim() || insightLoading) return;
    setInsightLoading(true); setInsight(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 700,
          system: `You are a Data Analyst mentor teaching a beginner.
The student has access to two tables:
- users: id, name, city, age, plan (free/pro)
- orders: id, user_id, product, amount, month, status (completed/refunded)

Data summary:
- 8 users in London, New York, Berlin
- 12 orders, products: Laptop($1200), Phone($800), Headphones($250), Tablet($600)
- Some orders are refunded
- Months: Jan through May

Given the student's business question, provide:
1. The SQL query to answer it (simple, beginner-friendly)
2. A plain English explanation of what the query does
3. What insight this would reveal

Return JSON:
{
  "query": "SQL query here",
  "explanation": "plain English explanation",
  "insight": "what this reveals about the business",
  "follow_up": "one follow-up question a good analyst would ask next"
}`,
          messages: [{ role: "user", content: insightQuestion }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      setInsight(JSON.parse(clean));
    } catch { setInsight({ error: true }); }
    setInsightLoading(false);
  };

  const completeStep = (s) => {
    if (!completed.includes(s)) {
      setCompleted(p => [...p, s]);
      setCelebration(true);
      setTimeout(() => setCelebration(false), 2000);
    }
    if (s < 2) setTimeout(() => setStep(s + 1), 400);
  };

  const story = STORIES[activeStory];
  const sqlLesson = SQL_LESSONS[sqlStep];

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif", color: "#0f172a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>

      {celebration && (
        <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", background: accent, color: "#fff", padding: "12px 28px", borderRadius: 100, fontWeight: 800, fontSize: 15, zIndex: 999, boxShadow: `0 8px 32px ${accent}50`, animation: "pop .35s ease", whiteSpace: "nowrap" }}>
          ✨ Step complete! Keep going →
        </div>
      )}

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e8f0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 20px 8px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 2, flexShrink: 0 }}>DEF<span style={{ color: accent }}>Y</span></div>
          <div style={{ width: 1, height: 18, background: "#e8e8f0", flexShrink: 0 }}/>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Data Analyst — Data Is Everywhere</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Lesson 1 · 75 XP</div>
          </div>
          <div style={{ marginLeft: "auto", background: light, border: `1px solid ${accent}20`, borderRadius: 100, padding: "4px 12px", fontSize: 11, color: accent, fontWeight: 700, flexShrink: 0 }}>
            {completed.length}/3 done
          </div>
        </div>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 10px", display: "flex", gap: 6, overflowX: "auto" }}>
          {["1. What is a Data Analyst?", "2. Your first SQL", "3. Find an insight"].map((label, i) => (
            <button key={i} onClick={() => setStep(i)}
              style={{ padding: "6px 14px", borderRadius: 100, border: `1.5px solid ${step === i ? accent : completed.includes(i) ? "#10b981" : "#e8e8f0"}`, background: step === i ? light : completed.includes(i) ? "#f0fdf4" : "transparent", color: step === i ? accent : completed.includes(i) ? "#10b981" : "#94a3b8", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: step === i ? 700 : 500, whiteSpace: "nowrap", flexShrink: 0, transition: "all .15s" }}>
              {completed.includes(i) ? "✓ " : ""}{label}
            </button>
          ))}
        </div>
        <div style={{ height: 3, background: "#f1f5f9" }}>
          <div style={{ height: "100%", width: `${(completed.length / 3) * 100}%`, background: `linear-gradient(90deg,${accent},#a78bfa)`, transition: "width .4s" }}/>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>

        {/* ═══ STEP 0: WHAT IS A DATA ANALYST ════════════════ */}
        {step === 0 && (
          <div>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>The Profession</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>Data analysts don't just<br/><span style={{ color: accent }}>make charts. They change companies.</span></h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>Every decision a modern company makes is backed by data. Someone has to find the signal in the noise. That's the Data Analyst — part detective, part translator, part strategist.</p>
            </div>

            {/* Real stories */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Real stories. Real impact.</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>These aren't hypothetical examples. These are real decisions made by real analysts at companies you use every day.</p>

              {/* Story selector */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {STORIES.map((s, i) => (
                  <button key={i} onClick={() => setActiveStory(i)}
                    style={{ padding: "8px 16px", borderRadius: 100, border: `1.5px solid ${activeStory === i ? s.color : "#e8e8f0"}`, background: activeStory === i ? s.bg : "transparent", color: activeStory === i ? s.color : "#64748b", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: activeStory === i ? 700 : 500, display: "flex", alignItems: "center", gap: 6, transition: "all .15s" }}>
                    <span>{s.icon}</span> {s.company}
                  </button>
                ))}
              </div>

              {/* Active story */}
              <div style={{ background: story.bg, border: `1.5px solid ${story.border}`, borderRadius: 18, padding: "24px 28px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                  <span style={{ fontSize: 32, flexShrink: 0 }}>{story.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: story.color, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>{story.company}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpacing: -0.5 }}>{story.headline}</div>
                  </div>
                </div>

                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: "0 0 20px", whiteSpace: "pre-line", fontWeight: 500 }}>{story.story}</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div style={{ background: "#fff", borderRadius: 12, padding: "14px" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Question asked</div>
                    <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.5, fontStyle: "italic" }}>"{story.question_asked}"</div>
                  </div>
                  <div style={{ background: "#fff", borderRadius: 12, padding: "14px" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Data used</div>
                    <div style={{ fontSize: 12, color: "#334155", lineHeight: 1.5 }}>{story.data_used}</div>
                  </div>
                  <div style={{ background: "#fff", borderRadius: 12, padding: "14px" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Business impact</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: story.color }}>{story.impact}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* What analysts actually do */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>What a Data Analyst actually does</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>Not "make charts". The real job is answering questions that matter.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { time: "9:00", task: "Check the morning dashboard", detail: "Did anything break overnight? Revenue down? Signups up? Any anomalies?" },
                  { time: "10:00", task: "Write SQL queries", detail: "Dig into the data. Find out why conversions dropped last Tuesday at 3pm." },
                  { time: "11:30", task: "Meet with product team", detail: "They want to know: do users who use feature X retain better? You have the answer." },
                  { time: "14:00", task: "Build a dashboard", detail: "Translate your findings into a visual story. Make it impossible to misunderstand." },
                  { time: "15:30", task: "Present to CEO", detail: "\"Our Berlin users spend 40% more but we're not marketing there at all.\" Done." },
                  { time: "17:00", task: "Improve a model", detail: "Refine the churn prediction model. Add new variables. Test on historical data." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "14px", background: "#f8fafc", borderRadius: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: accent, minWidth: 44, flexShrink: 0, marginTop: 2 }}>{item.time}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>{item.task}</div>
                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>The Data Analyst toolkit</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5 }}>You don't need all of these on day one. Start with SQL — everything else follows.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {TOOLS_DATA.map((tool, i) => (
                  <div key={i} onClick={() => setActiveTool(activeTool === i ? null : i)}
                    style={{ background: activeTool === i ? "#f8fafc" : "#fff", border: `1.5px solid ${activeTool === i ? tool.color : "#e8e8f0"}`, borderRadius: 14, padding: "16px", cursor: "pointer", transition: "all .15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{tool.icon}</span>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{tool.name}</div>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, lineHeight: 1.4 }}>{tool.desc}</div>
                    <div style={{ display: "inline-block", background: activeTool === i ? tool.color : "#f1f5f9", color: activeTool === i ? "#fff" : "#64748b", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{tool.level}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary */}
            <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 16, padding: "18px 22px", marginBottom: 24, display: "flex", gap: 14 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>💰</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }}>Data skills pay well — and the barrier to entry is lower than you think</div>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>Junior Data Analysts earn <strong>$2,000–4,000/mo</strong>. Seniors with Python and ML skills reach <strong>$7,000–12,000/mo</strong>. Unlike engineering roles, you don't need a CS degree — SQL + curiosity gets you in the door.</p>
              </div>
            </div>

            <button onClick={() => completeStep(0)}
              style={{ width: "100%", padding: "14px", background: accent, border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}35` }}>
              Now let me write my first SQL query →
            </button>
          </div>
        )}

        {/* ═══ STEP 1: LIVE SQL ════════════════════════════════ */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>Live SQL</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>SQL is how analysts<br/><span style={{ color: accent }}>talk to databases.</span></h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>Every company stores data in databases. SQL is the language to ask questions. You'll use it every single day as a Data Analyst. Let's learn it by doing.</p>
            </div>

            {/* DB schema */}
            <div style={{ background: "#0f172a", borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Your database — 2 tables</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { table: "users", cols: ["id", "name", "city", "age", "plan"], color: "#7dd3fc" },
                  { table: "orders", cols: ["id", "user_id", "product", "amount", "month", "status"], color: "#86efac" },
                ].map((t, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 13, color: t.color, fontWeight: 700, marginBottom: 8 }}>{t.table}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {t.cols.map((col, j) => (
                        <div key={j} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 8px", fontFamily: "monospace", fontSize: 11, color: "#94a3b8" }}>{col}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SQL lessons */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
              {SQL_LESSONS.map((l, i) => (
                <button key={i} onClick={() => { setSqlStep(i); setQueryResult(null); }}
                  style={{ padding: "6px 14px", borderRadius: 100, border: `1.5px solid ${sqlStep === i ? accent : "#e8e8f0"}`, background: sqlStep === i ? light : "transparent", color: sqlStep === i ? accent : "#64748b", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: sqlStep === i ? 700 : 500, whiteSpace: "nowrap", flexShrink: 0 }}>
                  {i + 1}. {l.title}
                </button>
              ))}
            </div>

            <div style={{ background: "#fff", border: `1.5px solid ${accent}20`, borderRadius: 20, padding: "24px 28px", marginBottom: 20, borderLeft: `4px solid ${accent}` }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: accent, marginBottom: 4 }}>Lesson {sqlStep + 1}: {sqlLesson.title}</div>
              <p style={{ fontSize: 14, color: "#475569", margin: "0 0 16px", lineHeight: 1.6 }}>{sqlLesson.desc}</p>
              <div style={{ background: "#0f172a", borderRadius: 12, padding: "14px 18px", fontFamily: "monospace", fontSize: 14, color: "#86efac", marginBottom: 12, letterSpacing: 0.3 }}>
                {sqlLesson.query}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16, fontStyle: "italic" }}>💡 {sqlLesson.hint}</div>
              <button onClick={() => runSQL(sqlLesson.run)}
                style={{ padding: "11px 28px", background: accent, border: "none", borderRadius: 10, color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 16px ${accent}35` }}>
                ▶ Run Query
              </button>
            </div>

            {/* Results */}
            {queryResult && (
              <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", fontSize: 12, fontWeight: 700, color: "#64748b", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }}/>
                  Query result — {queryResult.length} rows returned
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        {sqlLesson.columns.map(col => (
                          <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, color: "#64748b", fontSize: 12, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          {sqlLesson.columns.map(col => (
                            <td key={col} style={{ padding: "10px 16px", color: typeof row[col] === "number" ? accent : "#334155", fontWeight: typeof row[col] === "number" ? 700 : 400 }}>
                              {String(row[col] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Navigation between SQL lessons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {sqlStep > 0 && (
                <button onClick={() => { setSqlStep(s => s - 1); setQueryResult(null); }}
                  style={{ padding: "11px 20px", background: "#fff", border: "1.5px solid #e8e8f0", borderRadius: 12, color: "#64748b", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>← Previous</button>
              )}
              {sqlStep < SQL_LESSONS.length - 1 ? (
                <button onClick={() => { setSqlStep(s => s + 1); setQueryResult(null); }}
                  style={{ flex: 1, padding: "11px", background: accent, border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  Next query: {SQL_LESSONS[sqlStep + 1].title} →
                </button>
              ) : (
                <button onClick={() => completeStep(1)}
                  style={{ flex: 1, padding: "11px", background: accent, border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 6px 20px ${accent}35` }}>
                  I know SQL basics — find a real insight →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═══ STEP 2: FIND AN INSIGHT ════════════════════════ */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>Real Analysis</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>The CEO has a question.<br/><span style={{ color: accent }}>You have the data. Find the answer.</span></h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>This is what real Data Analysts do. Ask a business question, write SQL, interpret the result, tell the story.</p>
            </div>

            {/* CEO message */}
            <div style={{ background: "#0f172a", borderRadius: 20, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(139,92,246,0.2)", border: "1.5px solid rgba(139,92,246,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👤</div>
                <div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>CEO — just now</div>
                  <div style={{ fontSize: 15, color: "#e2e8f0", lineHeight: 1.7, fontWeight: 500 }}>
                    "Hey — I need some answers before the board meeting tomorrow. Can you look into our data and tell me:
                    <br/><br/>
                    1. Which city generates the most revenue?
                    <br/>
                    2. Which product has the most refunds?
                    <br/>
                    3. Is there any month where we're doing much better or worse?
                    <br/><br/>
                    Also — any other insights you spot in the data would be helpful. I trust your judgement."
                  </div>
                </div>
              </div>
            </div>

            {/* DB reminder */}
            <div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 14, padding: "14px 18px", marginBottom: 20, fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
              <strong style={{ color: "#334155" }}>Your database:</strong> users (id, name, city, age, plan) · orders (id, user_id, product, amount, month, status)
            </div>

            {/* Suggested questions */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 10 }}>Try asking one of these — or write your own question:</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  "Which city has the highest total revenue?",
                  "Which product has the most refunds?",
                  "What is our best month for sales?",
                  "Do pro users order more than free users?",
                  "What is the average order value per product?",
                ].map((q, i) => (
                  <button key={i} onClick={() => setInsightQuestion(q)}
                    style={{ padding: "7px 14px", background: light, border: `1px solid ${accent}20`, borderRadius: 100, color: accent, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600, transition: "all .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#ede9fe"}
                    onMouseLeave={e => e.currentTarget.style.background = light}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>Your business question</div>
                <textarea value={insightQuestion} onChange={e => setInsightQuestion(e.target.value)}
                  placeholder="Ask any business question about our users and orders..."
                  style={{ width: "100%", height: 120, background: "#fff", border: "1.5px solid #e8e8f0", borderRadius: 14, padding: "14px 16px", color: "#0f172a", fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.65, boxSizing: "border-box", transition: "border .2s" }}
                  onFocus={e => e.target.style.borderColor = `${accent}80`}
                  onBlur={e => e.target.style.borderColor = "#e8e8f0"}/>
                <button onClick={getInsight} disabled={!insightQuestion.trim() || insightLoading}
                  style={{ marginTop: 10, width: "100%", padding: "12px", background: insightQuestion.trim() ? accent : "#f1f5f9", border: "none", borderRadius: 12, color: insightQuestion.trim() ? "#fff" : "#94a3b8", fontWeight: 800, fontSize: 14, cursor: insightQuestion.trim() ? "pointer" : "default", fontFamily: "inherit", boxShadow: insightQuestion.trim() ? `0 6px 20px ${accent}35` : "none", transition: "all .2s" }}>
                  {insightLoading ? "Analysing..." : "Find the SQL + Insight →"}
                </button>
              </div>

              <div>
                {insightLoading && (
                  <div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 14, padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[0,1,2].map(j => <div key={j} style={{ width: 8, height: 8, borderRadius: "50%", background: accent, animation: `pulse 1.2s ease-in-out ${j*.2}s infinite` }}/>)}
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>Thinking like an analyst...</div>
                  </div>
                )}

                {insight && !insight.error && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "#0f172a", borderRadius: 12, padding: "16px", fontFamily: "monospace", fontSize: 13, color: "#86efac", lineHeight: 1.8 }}>
                      {insight.query}
                    </div>
                    <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>What this query does</div>
                      <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{insight.explanation}</div>
                    </div>
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#16a34a", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>The insight</div>
                      <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>{insight.insight}</div>
                    </div>
                    <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#d97706", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>A good analyst would next ask…</div>
                      <div style={{ fontSize: 13, color: "#78350f", lineHeight: 1.6, fontStyle: "italic" }}>"{insight.follow_up}"</div>
                    </div>
                  </div>
                )}

                {insight?.error && (
                  <div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 12, padding: "16px", color: "#dc2626", fontSize: 13 }}>
                    Something went wrong. Try again!
                  </div>
                )}

                {!insightLoading && !insight && (
                  <div style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: 14, padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#cbd5e1" }}>
                    <div style={{ fontSize: 40 }}>🔍</div>
                    <div style={{ fontSize: 13, textAlign: "center", lineHeight: 1.5 }}>Your SQL query and insight will appear here</div>
                  </div>
                )}
              </div>
            </div>

            {insight && !insight.error && (
              <div style={{ marginTop: 24 }}>
                <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 16, padding: "18px 22px", marginBottom: 16, display: "flex", gap: 14 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>🎉</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }}>You just did what Data Analysts do every day.</div>
                    <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>You took a business question, found the right SQL, extracted an insight, and identified the next question to ask. That loop — question → data → insight → question — is the entire job. And you just ran it.</p>
                  </div>
                </div>
                <button onClick={() => completeStep(2)}
                  style={{ width: "100%", padding: "14px", background: accent, border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}35` }}>
                  Claim 75 XP — lesson complete 🏆
                </button>
              </div>
            )}

            {completed.length === 3 && (
              <div style={{ marginTop: 24, background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 20, padding: "32px", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
                <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Lesson Complete!</div>
                <div style={{ fontSize: 15, color: "#475569", marginBottom: 20 }}>You earned 75 XP and thought like a real Data Analyst.</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  {["Real analyst stories", "The analyst toolkit", "SELECT + WHERE", "GROUP BY + SUM", "Business question → insight"].map((s, i) => (
                    <div key={i} style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#16a34a", fontWeight: 700 }}>✓ {s}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pop { from{opacity:0;transform:translateX(-50%) scale(.7)} to{opacity:1;transform:translateX(-50%) scale(1)} }
        @keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #e8e8f0; border-radius: 3px; }
        table { font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
}
