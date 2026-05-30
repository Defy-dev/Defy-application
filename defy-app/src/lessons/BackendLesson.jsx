import { useState } from "react";

const accent = "#8b5cf6";
const light = "#f5f3ff";

const LANGUAGES = [
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "rgba(139,92,246,0.3)",
    tagline: "Simple, readable, #1 for beginners",
    why: "Python reads almost like English. You focus on logic, not syntax. It's also the same language used in AI/ML — so it opens two career paths at once.",
    used_by: ["Instagram", "Spotify", "Dropbox", "Reddit", "NASA"],
    framework: "FastAPI",
    framework_desc: "Modern, fast, auto-generates documentation",
    example: `@app.get("/hello")
def say_hello():
    return {"message": "Hello, World!"}`,
    verdict: "Best choice if you're starting from zero."
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "🟨",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "rgba(245,158,11,0.3)",
    tagline: "The language of the web",
    why: "JavaScript runs in browsers AND on servers. If you already know some frontend, backend JS feels natural. But the syntax is trickier for absolute beginners.",
    used_by: ["Netflix", "LinkedIn", "Uber", "PayPal", "Walmart"],
    framework: "Node.js + Express",
    framework_desc: "Lightweight, flexible, huge ecosystem",
    example: `app.get('/hello', (req, res) => {
  res.json({ message: 'Hello, World!' })
})`,
    verdict: "Great if you plan to do frontend too."
  }
];

const HTTP_METHODS = [
  { method: "GET", color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", desc: "Read data", example: "Load your Instagram feed", analogy: "Asking to SEE something — no changes made" },
  { method: "POST", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", desc: "Create data", example: "Post a new photo", analogy: "Sending something NEW to the server" },
  { method: "PUT", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", desc: "Update data", example: "Edit your bio", analogy: "Replacing something that already exists" },
  { method: "DELETE", color: "#ef4444", bg: "#fff1f2", border: "#fecaca", desc: "Remove data", example: "Delete a post", analogy: "Telling the server to remove something" },
];

const STATUS_CODES = [
  { code: "200", name: "OK", color: "#10b981", desc: "Everything worked perfectly" },
  { code: "201", name: "Created", color: "#3b82f6", desc: "New item was successfully created" },
  { code: "404", name: "Not Found", color: "#f59e0b", desc: "The thing you asked for doesn't exist" },
  { code: "500", name: "Server Error", color: "#ef4444", desc: "Something broke on the server side" },
];

export default function BackendLesson1() {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState(null);
  const [activeMethod, setActiveMethod] = useState("GET");
  const [requestSent, setRequestSent] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState(null);
  const [idea, setIdea] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [celebration, setCelebration] = useState(false);
  const [journeyStep, setJourneyStep] = useState(0);

  const lang = LANGUAGES.find(l => l.id === language);
  const method = HTTP_METHODS.find(m => m.method === activeMethod);

  const simulateRequest = () => {
    setRequestLoading(true);
    setRequestSent(false);
    setTimeout(() => {
      setRequestLoading(false);
      setRequestSent(true);
    }, 1200);
  };

  const generateCode = async () => {
    if (!idea.trim() || codeLoading) return;
    setCodeLoading(true);
    setGeneratedCode(null);
    try {
      const langName = lang?.name || "Python";
      const framework = lang?.framework || "FastAPI";
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          system: `You are a friendly backend coding teacher for absolute beginners. 
When given an API idea, write a simple ${langName} (${framework}) endpoint for it.

Return JSON only:
{
  "endpoint": "the URL path e.g. /todos",
  "method": "GET or POST",
  "code": "the actual code snippet (5-15 lines max)",
  "explanation": [
    {"line": "the code line", "meaning": "plain English explanation"},
    {"line": "next line", "meaning": "explanation"}
  ],
  "what_it_does": "one sentence plain English description"
}`,
          messages: [{ role: "user", content: `Create a simple API endpoint for: ${idea}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      setGeneratedCode(JSON.parse(clean));
    } catch {
      setGeneratedCode({ error: true });
    }
    setCodeLoading(false);
  };

  const completeStep = (s) => {
    if (!completed.includes(s)) {
      setCompleted(p => [...p, s]);
      setCelebration(true);
      setTimeout(() => setCelebration(false), 2000);
    }
    if (s < 2) setTimeout(() => setStep(s + 1), 400);
  };

  const JOURNEY_STEPS = [
    { icon: "💻", label: "You type a URL", desc: "You open your browser and type instagram.com" },
    { icon: "🔍", label: "DNS lookup", desc: "Browser asks: 'What's the IP address of instagram.com?' — like looking up a name in a phone book" },
    { icon: "🤝", label: "Connection", desc: "Browser connects to Instagram's server — a computer in a data centre, running 24/7" },
    { icon: "📤", label: "HTTP Request", desc: "Browser sends: 'GET / HTTP/1.1' — 'Please give me the homepage'" },
    { icon: "⚙️", label: "Server processes", desc: "Instagram's backend code runs. It checks who you are, fetches your feed from a database." },
    { icon: "📥", label: "Response sent", desc: "Server sends back HTML, CSS, JS files + your data. Status: 200 OK" },
    { icon: "🎨", label: "Browser renders", desc: "Your browser reads the files and draws the page. Done — in under 1 second." },
  ];

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
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Backend — How the Internet Works</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Lesson 1 · 75 XP</div>
          </div>
          <div style={{ marginLeft: "auto", background: light, border: `1px solid ${accent}20`, borderRadius: 100, padding: "4px 12px", fontSize: 11, color: accent, fontWeight: 700, flexShrink: 0 }}>
            {completed.length}/3 done
          </div>
        </div>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 10px", display: "flex", gap: 6, overflowX: "auto" }}>
          {["1. Choose your language", "2. What happens when you open a site?", "3. Build your first endpoint"].map((label, i) => (
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

        {/* ═══ STEP 0: CHOOSE YOUR LANGUAGE ═══════════════════ */}
        {step === 0 && (
          <div>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>First things first</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>Pick your language.<br/>This is your starting point.</h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>Backend developers write code that runs on servers. But which language? This choice shapes your learning path — so let's make it deliberately.</p>
            </div>

            {/* Language cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
              {LANGUAGES.map(l => (
                <div key={l.id} onClick={() => setLanguage(l.id)}
                  style={{ background: language === l.id ? l.bg : "#fff", border: `2px solid ${language === l.id ? l.color : "#e8e8f0"}`, borderRadius: 20, padding: "28px", cursor: "pointer", transition: "all .2s", boxShadow: language === l.id ? `0 8px 32px ${l.color}20` : "none", position: "relative" }}
                  onMouseEnter={e => { if (language !== l.id) { e.currentTarget.style.borderColor = l.border; e.currentTarget.style.transform = "translateY(-2px)"; }}}
                  onMouseLeave={e => { if (language !== l.id) { e.currentTarget.style.borderColor = "#e8e8f0"; e.currentTarget.style.transform = "none"; }}}>
                  {language === l.id && (
                    <div style={{ position: "absolute", top: 16, right: 16, width: 24, height: 24, borderRadius: "50%", background: l.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</div>
                  )}
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{l.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", marginBottom: 4, letterSpacing: -0.5 }}>{l.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: l.color, marginBottom: 14 }}>{l.tagline}</div>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: "0 0 16px" }}>{l.why}</p>

                  {/* Used by */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: 1 }}>USED BY</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {l.used_by.map((company, i) => (
                        <div key={i} style={{ background: language === l.id ? "#fff" : "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: "#475569", fontWeight: 600 }}>{company}</div>
                      ))}
                    </div>
                  </div>

                  {/* Framework */}
                  <div style={{ background: language === l.id ? "#fff" : "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", marginBottom: 3 }}>Framework: {l.framework}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{l.framework_desc}</div>
                  </div>

                  {/* Code preview */}
                  <div style={{ marginTop: 14, background: "#0f172a", borderRadius: 10, padding: "12px 14px", fontFamily: "'Fira Code',monospace", fontSize: 12, color: "#7dd3fc", lineHeight: 1.8, whiteSpace: "pre" }}>{l.example}</div>

                  <div style={{ marginTop: 14, fontSize: 13, fontWeight: 700, color: l.color }}>{l.verdict}</div>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 16, padding: "18px 22px", marginBottom: 24, display: "flex", gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#78350f", marginBottom: 4 }}>Not sure? Start with Python.</div>
                <p style={{ fontSize: 13, color: "#92400e", margin: 0, lineHeight: 1.6 }}>Python is easier to read, has cleaner syntax, and the same language is used in AI/ML. Most bootcamps and courses start here. You can always learn JavaScript later — and it'll feel easier after Python.</p>
              </div>
            </div>

            <button onClick={() => { if (language) completeStep(0); }} disabled={!language}
              style={{ width: "100%", padding: "14px", background: language ? (lang?.color || accent) : "#f1f5f9", border: "none", borderRadius: 14, color: language ? "#fff" : "#94a3b8", fontWeight: 800, fontSize: 15, cursor: language ? "pointer" : "default", fontFamily: "inherit", boxShadow: language ? `0 8px 24px ${lang?.color || accent}35` : "none", transition: "all .2s" }}>
              {language ? `I'm learning ${lang?.name} — let's go →` : "Select a language to continue"}
            </button>
          </div>
        )}

        {/* ═══ STEP 1: HOW THE INTERNET WORKS ═════════════════ */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>Behind the scenes</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>Every time you open a website,<br/><span style={{ color: accent }}>7 things happen in under 1 second.</span></h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>You never see this. But as a backend developer, this is your world. Click each step to understand what's happening.</p>
            </div>

            {/* Journey visualiser */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {JOURNEY_STEPS.map((s, i) => (
                  <div key={i} onClick={() => setJourneyStep(i)}
                    style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", borderRadius: 14, cursor: "pointer", background: journeyStep === i ? light : "transparent", border: `1.5px solid ${journeyStep === i ? accent : "transparent"}`, transition: "all .15s" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: journeyStep === i ? accent : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, transition: "all .15s" }}>{s.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: journeyStep === i ? 6 : 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: journeyStep === i ? accent : "#94a3b8", letterSpacing: 1 }}>STEP {i + 1}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: journeyStep === i ? "#0f172a" : "#64748b" }}>{s.label}</div>
                      </div>
                      {journeyStep === i && (
                        <p style={{ fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.65, fontWeight: 500 }}>{s.desc}</p>
                      )}
                    </div>
                    <div style={{ color: journeyStep === i ? accent : "#cbd5e1", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{journeyStep === i ? "▲" : "▼"}</div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setJourneyStep(j => Math.max(0, j - 1))} disabled={journeyStep === 0}
                  style={{ padding: "10px 20px", background: "transparent", border: "1.5px solid #e8e8f0", borderRadius: 10, color: "#64748b", cursor: journeyStep === 0 ? "default" : "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13, opacity: journeyStep === 0 ? 0.4 : 1 }}>← Previous</button>
                {journeyStep < JOURNEY_STEPS.length - 1 ? (
                  <button onClick={() => setJourneyStep(j => j + 1)}
                    style={{ flex: 1, padding: "10px", background: accent, border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Next step →</button>
                ) : (
                  <div style={{ flex: 1, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px", textAlign: "center", fontSize: 13, color: "#16a34a", fontWeight: 700 }}>✓ You've seen all 7 steps!</div>
                )}
              </div>
            </div>

            {/* HTTP Methods */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>HTTP Methods — 4 things you can ask a server</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.6 }}>Every request you send to a server has a method — it tells the server what you want to do. Click each one.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
                {HTTP_METHODS.map(m => (
                  <div key={m.method} onClick={() => setActiveMethod(m.method)}
                    style={{ background: activeMethod === m.method ? m.bg : "#f8fafc", border: `2px solid ${activeMethod === m.method ? m.color : "#e8e8f0"}`, borderRadius: 14, padding: "16px", cursor: "pointer", textAlign: "center", transition: "all .15s" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: m.color, marginBottom: 4 }}>{m.method}</div>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{m.desc}</div>
                  </div>
                ))}
              </div>
              {method && (
                <div style={{ background: method.bg, border: `1px solid ${method.border}`, borderRadius: 14, padding: "16px 20px" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{method.method} — {method.desc}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ fontSize: 13, color: "#475569" }}>📱 <strong>Real example:</strong> {method.example}</div>
                    <div style={{ fontSize: 13, color: "#475569" }}>💡 <strong>Think of it as:</strong> {method.analogy}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Status codes */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Status Codes — the server's reply</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px", lineHeight: 1.6 }}>Every response has a number that tells you what happened. You've already seen one — 404 Not Found when a page doesn't exist.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {STATUS_CODES.map(s => (
                  <div key={s.code} onClick={() => setActiveStatus(activeStatus === s.code ? null : s.code)}
                    style={{ background: activeStatus === s.code ? s.color + "15" : "#f8fafc", border: `2px solid ${activeStatus === s.code ? s.color : "#e8e8f0"}`, borderRadius: 14, padding: "16px", cursor: "pointer", transition: "all .15s", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: s.color, letterSpacing: -1 }}>{s.code}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginTop: 4 }}>{s.name}</div>
                    {activeStatus === s.code && <div style={{ fontSize: 12, color: "#475569", marginTop: 8, lineHeight: 1.4 }}>{s.desc}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Simulate request */}
            <div style={{ background: "#0f172a", borderRadius: 20, padding: "28px", marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>See a real request happen</div>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 20px", lineHeight: 1.5 }}>This is what your browser sends when it loads a page. Click the button and watch it happen.</p>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "16px", marginBottom: 16, fontFamily: "'Fira Code',monospace", fontSize: 12, lineHeight: 1.8 }}>
                <div style={{ color: "#94a3b8", marginBottom: 4 }}>// Request being sent:</div>
                <div><span style={{ color: "#86efac" }}>GET</span> <span style={{ color: "#7dd3fc" }}>https://api.example.com/users</span> <span style={{ color: "#94a3b8" }}>HTTP/1.1</span></div>
                <div><span style={{ color: "#a78bfa" }}>Host:</span> <span style={{ color: "#fcd34d" }}>api.example.com</span></div>
                <div><span style={{ color: "#a78bfa" }}>Accept:</span> <span style={{ color: "#fcd34d" }}>application/json</span></div>
              </div>
              <button onClick={simulateRequest} disabled={requestLoading}
                style={{ padding: "12px 24px", background: accent, border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginBottom: 14 }}>
                {requestLoading ? "Sending request..." : "Send Request →"}
              </button>
              {requestLoading && (
                <div style={{ display: "flex", gap: 6, alignItems: "center", color: "#94a3b8" }}>
                  {[0,1,2].map(j => <div key={j} style={{ width: 8, height: 8, borderRadius: "50%", background: accent, animation: `pulse 1.2s ease-in-out ${j*.2}s infinite` }}/>)}
                  <span style={{ marginLeft: 8, fontSize: 13 }}>Waiting for server...</span>
                </div>
              )}
              {requestSent && !requestLoading && (
                <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "14px 16px", fontFamily: "'Fira Code',monospace", fontSize: 12, lineHeight: 1.8 }}>
                  <div style={{ color: "#6ee7b7", marginBottom: 4 }}>// Response received:</div>
                  <div><span style={{ color: "#86efac" }}>200 OK</span></div>
                  <div><span style={{ color: "#a78bfa" }}>Content-Type:</span> <span style={{ color: "#fcd34d" }}>application/json</span></div>
                  <div style={{ marginTop: 8, color: "#e2e8f0" }}>{`[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]`}</div>
                </div>
              )}
            </div>

            <button onClick={() => completeStep(1)}
              style={{ width: "100%", padding: "14px", background: accent, border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}35` }}>
              I get it — now let me build something →
            </button>
          </div>
        )}

        {/* ═══ STEP 2: BUILD YOUR FIRST ENDPOINT ══════════════ */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>Build it</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>Describe what you want.<br/><span style={{ color: accent }}>We'll write the {lang?.name || "Python"} code.</span></h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>Tell us what your API should do — in plain English. No code knowledge needed. The AI will generate real {lang?.framework || "FastAPI"} code and explain every single line.</p>
            </div>

            {/* Language badge */}
            {lang && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: lang.bg, border: `1px solid ${lang.border}`, borderRadius: 100, padding: "6px 16px", marginBottom: 24, fontSize: 13, color: lang.color, fontWeight: 700 }}>
                <span>{lang.icon}</span> Building with {lang.name} + {lang.framework}
                <button onClick={() => setStep(0)} style={{ background: "transparent", border: "none", color: lang.color, cursor: "pointer", fontSize: 11, fontWeight: 600, padding: 0, marginLeft: 4 }}>change →</button>
              </div>
            )}

            {/* Ideas */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "24px 28px", marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 12 }}>Need inspiration? Try one of these:</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["A todo list API", "A weather endpoint", "A user login endpoint", "A product catalogue", "A simple calculator API"].map((idea, i) => (
                  <button key={i} onClick={() => setIdea(idea)}
                    style={{ padding: "7px 14px", background: light, border: `1px solid ${accent}20`, borderRadius: 100, color: accent, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600, transition: "all .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                    onMouseLeave={e => e.currentTarget.style.background = light}>
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Input */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>Describe your API in plain English</div>
                <textarea value={idea} onChange={e => setIdea(e.target.value)}
                  placeholder="e.g. An endpoint that returns a list of all users in my app"
                  style={{ width: "100%", height: 120, background: "#fff", border: "1.5px solid #e8e8f0", borderRadius: 14, padding: "14px 16px", color: "#0f172a", fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.65, transition: "border .2s", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = `${accent}80`}
                  onBlur={e => e.target.style.borderColor = "#e8e8f0"}/>
                <button onClick={generateCode} disabled={!idea.trim() || codeLoading}
                  style={{ marginTop: 10, width: "100%", padding: "12px", background: idea.trim() ? accent : "#f1f5f9", border: "none", borderRadius: 12, color: idea.trim() ? "#fff" : "#94a3b8", fontWeight: 800, fontSize: 14, cursor: idea.trim() ? "pointer" : "default", fontFamily: "inherit", boxShadow: idea.trim() ? `0 6px 20px ${accent}35` : "none", transition: "all .2s" }}>
                  {codeLoading ? "Generating code..." : "Generate my code →"}
                </button>
              </div>

              {/* Output */}
              <div>
                {codeLoading && (
                  <div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 14, padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[0,1,2].map(j => <div key={j} style={{ width: 10, height: 10, borderRadius: "50%", background: accent, animation: `pulse 1.2s ease-in-out ${j*.2}s infinite` }}/>)}
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>Writing your {lang?.name} code...</div>
                  </div>
                )}

                {generatedCode && !generatedCode.error && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* What it does */}
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 4 }}>What this endpoint does:</div>
                      <div style={{ fontSize: 14, color: "#15803d", fontWeight: 500 }}>{generatedCode.what_it_does}</div>
                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <div style={{ background: "#dcfce7", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: "#16a34a", fontWeight: 700 }}>{generatedCode.method}</div>
                        <div style={{ background: "#dcfce7", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: "#16a34a", fontWeight: 700, fontFamily: "monospace" }}>{generatedCode.endpoint}</div>
                      </div>
                    </div>

                    {/* Code */}
                    <div style={{ background: "#0f172a", borderRadius: 12, padding: "16px", fontFamily: "'Fira Code',monospace", fontSize: 12, color: "#7dd3fc", lineHeight: 1.8, whiteSpace: "pre-wrap", overflowX: "auto" }}>
                      {generatedCode.code}
                    </div>

                    {/* Line by line */}
                    {generatedCode.explanation && (
                      <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 12, padding: "16px" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Line by line explanation</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {generatedCode.explanation.map((item, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignItems: "flex-start" }}>
                              <div style={{ background: "#0f172a", borderRadius: 8, padding: "8px 10px", fontFamily: "monospace", fontSize: 11, color: "#7dd3fc", lineHeight: 1.5 }}>{item.line}</div>
                              <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, paddingTop: 4 }}>→ {item.meaning}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {generatedCode?.error && (
                  <div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 12, padding: "16px", color: "#dc2626", fontSize: 13 }}>
                    Something went wrong. Try again — errors happen even to senior devs!
                  </div>
                )}

                {!codeLoading && !generatedCode && (
                  <div style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: 14, padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: "#cbd5e1" }}>
                    <div style={{ fontSize: 40 }}>⚙️</div>
                    <div style={{ fontSize: 13, textAlign: "center", lineHeight: 1.5 }}>Your {lang?.name || "backend"} code will appear here</div>
                  </div>
                )}
              </div>
            </div>

            {generatedCode && !generatedCode.error && (
              <div style={{ marginTop: 24 }}>
                <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 16, padding: "18px 22px", marginBottom: 16, display: "flex", gap: 14 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>🎉</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }}>You just wrote your first backend endpoint.</div>
                    <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>Real code. Real {lang?.framework}. Real backend. This is what powers every app you've ever used. And you understood every line of it.</p>
                  </div>
                </div>
                <button onClick={() => completeStep(2)}
                  style={{ width: "100%", padding: "14px", background: accent, border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}35` }}>
                  Claim 75 XP — lesson complete 🏆
                </button>
              </div>
            )}

            {/* Completion */}
            {completed.length === 3 && (
              <div style={{ marginTop: 24, background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 20, padding: "32px", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
                <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Lesson Complete!</div>
                <div style={{ fontSize: 15, color: "#475569", marginBottom: 20 }}>You earned 75 XP and built your first backend endpoint.</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  {["Chose your language", "How internet works", "HTTP methods", "Status codes", "Built an endpoint"].map((s, i) => (
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
      `}</style>
    </div>
  );
}
