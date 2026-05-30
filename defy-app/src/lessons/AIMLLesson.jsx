import { useState } from "react";

const accent = "#8b5cf6";
const light = "#f5f3ff";

// ── DATA ──────────────────────────────────────
const PATHS = [
  {
    id: "user",
    label: "AI User",
    icon: "💬",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
    salary: "$0 — everyone",
    desc: "Uses AI tools built by others. ChatGPT, Midjourney, Notion AI. No code needed.",
    day: ["9am — Opens ChatGPT", "10am — Writes prompts for reports", "2pm — Uses AI to summarise emails", "5pm — Done"],
    tools: ["ChatGPT", "Claude", "Midjourney", "Notion AI"],
    truth: "This is valuable but not a tech career. You're the customer, not the builder."
  },
  {
    id: "builder",
    label: "AI Engineer",
    icon: "⚙️",
    color: "#8b5cf6",
    bg: light,
    border: `rgba(139,92,246,0.3)`,
    salary: "$3,000–12,000/mo",
    desc: "Builds products using AI APIs. Integrates models into apps, writes prompts programmatically, ships AI features.",
    day: ["9am — Reviews API logs", "10am — Writes Python to call GPT/Claude", "1pm — Ships a new AI feature", "4pm — Optimises prompt to cut costs", "6pm — Deploys to production"],
    tools: ["Python", "OpenAI / Anthropic API", "FastAPI", "Langchain", "Vercel"],
    truth: "This is where 80% of AI jobs are. You build the tools others use."
  },
  {
    id: "researcher",
    label: "ML Researcher",
    icon: "🔬",
    color: "#0891b2",
    bg: "#ecfeff",
    border: "rgba(8,145,178,0.3)",
    salary: "$8,000–25,000/mo",
    desc: "Trains new models from scratch. Needs PhD-level math, massive compute, and years of experience.",
    day: ["9am — Reads 3 research papers", "11am — Trains model on 1000 GPUs", "3pm — Analyses loss curves", "7pm — Still training..."],
    tools: ["PyTorch", "CUDA", "Jupyter", "Weights & Biases", "HuggingFace"],
    truth: "This is OpenAI, Google DeepMind. Rare, elite, and needs years of math background."
  }
];

const PARAMS = [
  { key: "temperature", label: "Temperature", min: 0, max: 1, step: 0.1, default: 0.7, desc: "Higher = more creative. Lower = more predictable.", low: "Precise, factual", high: "Creative, unpredictable" },
  { key: "max_tokens", label: "Max Length", min: 50, max: 500, step: 50, default: 200, desc: "Max words in the response.", low: "Short answer", high: "Long detailed answer" },
];

const SYSTEM_PROMPTS = [
  { label: "Friendly tutor", value: "You are a friendly, encouraging tutor. Explain things simply with analogies." },
  { label: "Senior engineer", value: "You are a senior software engineer. Be direct, technical, and concise. No fluff." },
  { label: "Startup founder", value: "You are a startup founder. Think in terms of business impact, speed, and user value." },
  { label: "No role (default)", value: "" },
];

// ── COMPONENT ─────────────────────────────────
export default function AIMLLesson1() {
  const [step, setStep] = useState(0);
  const [activePath, setActivePath] = useState("builder");
  const [params, setParams] = useState({ temperature: 0.7, max_tokens: 200 });
  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPTS[0].value);
  const [userMessage, setUserMessage] = useState("Explain machine learning in 2 sentences.");
  const [apiResponse, setApiResponse] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [learningPlan, setLearningPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [celebration, setCelebration] = useState(false);

  const callAI = async (system, user, temp, tokens) => {
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: tokens,
      messages: [{ role: "user", content: user }],
    };
    if (system) body.system = system;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data.content?.map(b => b.text || "").join("") || "Error.";
  };

  const handleAPICall = async () => {
    setApiLoading(true); setApiResponse(null);
    try {
      const text = await callAI(systemPrompt, userMessage, params.temperature, params.max_tokens);
      setApiResponse(text);
    } catch { setApiResponse("Connection error. Please try again."); }
    setApiLoading(false);
  };

  const handleBuildTool = async () => {
    if (!topic.trim()) return;
    setPlanLoading(true); setLearningPlan(null);
    try {
      const system = "You are a helpful learning coach. Create structured, encouraging learning plans.";
      const user = `Create a 4-week learning plan for someone who wants to learn: "${topic}"\n\nFormat your response as JSON with this exact structure:\n{\n  "title": "Learning Plan: [topic]",\n  "goal": "one sentence goal",\n  "weeks": [\n    { "week": 1, "theme": "week theme", "tasks": ["task1", "task2", "task3"] },\n    { "week": 2, "theme": "week theme", "tasks": ["task1", "task2", "task3"] },\n    { "week": 3, "theme": "week theme", "tasks": ["task1", "task2", "task3"] },\n    { "week": 4, "theme": "week theme", "tasks": ["task1", "task2", "task3"] }\n  ]\n}\n\nReturn ONLY the JSON, no other text.`;
      const raw = await callAI(system, user, 0.7, 800);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setLearningPlan(parsed);
    } catch { setLearningPlan({ error: true }); }
    setPlanLoading(false);
  };

  const completeStep = (s) => {
    if (!completed.includes(s)) {
      setCompleted(p => [...p, s]);
      setCelebration(true);
      setTimeout(() => setCelebration(false), 2000);
    }
    if (s < 2) setTimeout(() => setStep(s + 1), 400);
  };

  const path = PATHS.find(p => p.id === activePath);

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
        {/* Row 1: Logo + lesson info */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 20px 8px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 2, flexShrink: 0 }}>DEF<span style={{ color: accent }}>Y</span></div>
          <div style={{ width: 1, height: 18, background: "#e8e8f0", flexShrink: 0 }}/>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI / ML — A Day in the Life</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Lesson 1 · 75 XP</div>
          </div>
          <div style={{ marginLeft: "auto", background: light, border: `1px solid ${accent}20`, borderRadius: 100, padding: "4px 12px", fontSize: 11, color: accent, fontWeight: 700, flexShrink: 0 }}>
            {completed.length}/3 done
          </div>
        </div>
        {/* Row 2: Step navigation */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 10px", display: "flex", gap: 6, overflowX: "auto" }}>
          {["1. The Profession", "2. What is API?", "3. Build a Tool"].map((label, i) => (
            <button key={i} onClick={() => setStep(i)}
              style={{ padding: "6px 14px", borderRadius: 100, border: `1.5px solid ${step === i ? accent : completed.includes(i) ? "#10b981" : "#e8e8f0"}`, background: step === i ? light : completed.includes(i) ? "#f0fdf4" : "transparent", color: step === i ? accent : completed.includes(i) ? "#10b981" : "#94a3b8", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: step === i ? 700 : 500, transition: "all .15s", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", flexShrink: 0 }}>
              {completed.includes(i) ? "✓" : ""} {label}
            </button>
          ))}
        </div>
        {/* Progress bar */}
        <div style={{ height: 3, background: "#f1f5f9" }}>
          <div style={{ height: "100%", width: `${(completed.length / 3) * 100}%`, background: `linear-gradient(90deg,${accent},#a78bfa)`, transition: "width .4s" }}/>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>

        {/* ═══ STEP 0: THE PROFESSION ═══════════════════════════ */}
        {step === 0 && (
          <div>
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>The Profession</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>There are 3 types of people<br/>in AI. Which one do you want to be?</h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>Click each path to explore. Most people think AI careers mean research — but 80% of jobs are in building.</p>
            </div>

            {/* Path selector */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 32 }}>
              {PATHS.map(p => (
                <div key={p.id} onClick={() => setActivePath(p.id)}
                  style={{ background: activePath === p.id ? p.bg : "#fff", border: `2px solid ${activePath === p.id ? p.color : "#e8e8f0"}`, borderRadius: 20, padding: "24px", cursor: "pointer", transition: "all .2s", boxShadow: activePath === p.id ? `0 8px 32px ${p.color}20` : "none" }}
                  onMouseEnter={e => { if (activePath !== p.id) e.currentTarget.style.borderColor = p.border; }}
                  onMouseLeave={e => { if (activePath !== p.id) e.currentTarget.style.borderColor = "#e8e8f0"; }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{p.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 10 }}>{p.salary}</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>{p.desc}</div>
                </div>
              ))}
            </div>

            {/* Detail panel */}
            <div style={{ background: "#fff", border: `1.5px solid ${path.border}`, borderRadius: 20, padding: "28px 32px", marginBottom: 28, transition: "all .3s" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                {/* A day */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>A typical day</div>
                  {path.day.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: path.color, flexShrink: 0, marginTop: 6 }}/>
                      <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.5, fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
                {/* Tools */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Tools they use</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {path.tools.map((t, i) => (
                      <div key={i} style={{ background: path.bg, border: `1px solid ${path.border}`, borderRadius: 100, padding: "5px 12px", fontSize: 12, color: path.color, fontWeight: 700 }}>{t}</div>
                    ))}
                  </div>
                </div>
                {/* Truth */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>The reality</div>
                  <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 14, padding: "14px 16px" }}>
                    <span style={{ fontSize: 14, color: "#78350f", lineHeight: 1.65, fontWeight: 500 }}>💡 {path.truth}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insight */}
            <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 16, padding: "18px 22px", marginBottom: 28, display: "flex", gap: 14 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>🎯</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }}>Defy teaches you to be an AI Engineer — the builder.</div>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>Not a researcher who needs a PhD. Not a user who just chats with AI. A builder who ships real products using AI APIs. This is where the jobs are, and this is where we're taking you.</p>
              </div>
            </div>

            <button onClick={() => completeStep(0)} style={{ width: "100%", padding: "14px", background: accent, border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}35` }}>
              I want to be a builder — show me how →
            </button>
          </div>
        )}

        {/* ═══ STEP 1: WHAT IS API + EXPLORER ══════════════════ */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>What is an API?</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>This is how engineers<br/>actually talk to AI.</h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>Before we touch anything — let's understand what an API is. It's simpler than it sounds.</p>
            </div>

            {/* API explanation */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px 32px", marginBottom: 28 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>You've used APIs your whole life. You just didn't know it.</div>
              <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: "0 0 24px", fontWeight: 500 }}>
                Almost every app you use makes API requests — all day, every day. You just don't see them. They happen behind the scenes, in milliseconds.
              </p>

              {/* Real life examples */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {[
                  { app: "Instagram", icon: "📸", action: "You open the feed", api: "App sends API request to Instagram servers", result: "Your photos appear" },
                  { app: "Uber", icon: "🚗", action: "You request a ride", api: "App sends API request to Google Maps", result: "Map and route appear" },
                  { app: "Online payment", icon: "💳", action: "You tap 'Pay'", api: "Shop sends API request to your bank", result: "Bank replies 'approved' or 'declined'" },
                  { app: "ChatGPT", icon: "🤖", action: "You send a message", api: "Website sends API request to OpenAI servers", result: "AI answer appears in the chat" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "28px 90px 1fr 1fr", gap: 12, alignItems: "center", padding: "14px 16px", background: "#f8fafc", borderRadius: 14, border: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{item.app}</div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>
                      <span style={{ color: "#94a3b8", fontWeight: 600 }}>You: </span>{item.action}
                      <div style={{ marginTop: 3 }}><span style={{ color: accent, fontWeight: 600 }}>API: </span>{item.api}</div>
                    </div>
                    <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600, lineHeight: 1.4 }}>✓ {item.result}</div>
                  </div>
                ))}
              </div>

              {/* The point */}
              <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 6 }}>So what is an API exactly?</div>
                <p style={{ fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.65 }}>
                  API is just an <strong style={{ color: "#0f172a" }}>address on the internet</strong> that accepts requests and returns data. Think of it like a phone number — you dial it, send a message, get a reply. The "phone" lives on a server somewhere, not on your computer.
                </p>
              </div>

              {/* Key insight */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#166534", marginBottom: 4 }}>When you use ChatGPT or Claude — you're already using an API. You just don't see it.</div>
                  <p style={{ fontSize: 13, color: "#15803d", margin: 0, lineHeight: 1.6 }}>The chat interface is just a pretty wrapper. As an AI engineer you call the same API directly — no wrapper, full control. That's the difference between a user and a builder.</p>
                </div>
              </div>
            </div>

            {/* Transition */}
            <div style={{ background: "#0f172a", borderRadius: 16, padding: "20px 24px", marginBottom: 28, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>🔌</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Now you're going to call the API yourself.</div>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>No code needed yet. Just adjust the settings and click a button. You'll see exactly what gets sent, and what comes back. This is what engineers look at every day.</p>
              </div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>Live API Explorer — try it yourself</div>

            <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>
              {/* Controls */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* System prompt */}
                <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, padding: "20px" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>System Prompt (Role)</div>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px", lineHeight: 1.5 }}>This tells the AI WHO it is before the conversation starts.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                    {SYSTEM_PROMPTS.map((sp, i) => (
                      <button key={i} onClick={() => setSystemPrompt(sp.value)}
                        style={{ padding: "8px 12px", borderRadius: 10, border: `1.5px solid ${systemPrompt === sp.value ? accent : "#e8e8f0"}`, background: systemPrompt === sp.value ? light : "transparent", color: systemPrompt === sp.value ? accent : "#64748b", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: systemPrompt === sp.value ? 700 : 500, textAlign: "left", transition: "all .15s" }}>
                        {sp.label}
                      </button>
                    ))}
                  </div>
                  {systemPrompt && (
                    <div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 8, padding: "10px 12px", fontFamily: "'Fira Code',monospace", fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
                      "{systemPrompt}"
                    </div>
                  )}
                </div>

                {/* Parameters */}
                <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, padding: "20px" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Parameters</div>
                  {PARAMS.map(p => (
                    <div key={p.key} style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{p.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: accent }}>{params[p.key]}</span>
                      </div>
                      <input type="range" min={p.min} max={p.max} step={p.step} value={params[p.key]}
                        onChange={e => setParams(prev => ({ ...prev, [p.key]: parseFloat(e.target.value) }))}
                        style={{ width: "100%", accentColor: accent, marginBottom: 6 }}/>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8" }}>
                        <span>{p.low}</span><span>{p.high}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: message + response */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* JSON preview */}
                <div style={{ background: "#0f172a", borderRadius: 16, padding: "16px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>API Request (what gets sent)</div>
                  <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, lineHeight: 1.8 }}>
                    <div style={{ color: "#64748b" }}>{"{"}</div>
                    <div style={{ paddingLeft: 16 }}>
                      <span style={{ color: "#7dd3fc" }}>"model"</span><span style={{ color: "#94a3b8" }}>: </span><span style={{ color: "#86efac" }}>"claude-sonnet-4"</span><span style={{ color: "#94a3b8" }}>,</span>
                    </div>
                    <div style={{ paddingLeft: 16 }}>
                      <span style={{ color: "#7dd3fc" }}>"max_tokens"</span><span style={{ color: "#94a3b8" }}>: </span><span style={{ color: "#f9a8d4" }}>{params.max_tokens}</span><span style={{ color: "#94a3b8" }}>,</span>
                    </div>
                    {systemPrompt && (
                      <div style={{ paddingLeft: 16 }}>
                        <span style={{ color: "#7dd3fc" }}>"system"</span><span style={{ color: "#94a3b8" }}>: </span><span style={{ color: "#86efac" }}>"{systemPrompt.slice(0, 40)}..."</span><span style={{ color: "#94a3b8" }}>,</span>
                      </div>
                    )}
                    <div style={{ paddingLeft: 16 }}>
                      <span style={{ color: "#7dd3fc" }}>"messages"</span><span style={{ color: "#94a3b8" }}>: [{"{"}</span><span style={{ color: "#7dd3fc" }}>"role"</span><span style={{ color: "#94a3b8" }}>: </span><span style={{ color: "#86efac" }}>"user"</span><span style={{ color: "#94a3b8" }}>, </span><span style={{ color: "#7dd3fc" }}>"content"</span><span style={{ color: "#94a3b8" }}>: </span><span style={{ color: "#86efac" }}>"{userMessage.slice(0, 30)}..."</span><span style={{ color: "#94a3b8" }}>{"}"}</span>]
                    </div>
                    <div style={{ color: "#64748b" }}>{"}"}</div>
                  </div>
                </div>

                {/* User message */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>Your message to the AI</div>
                  <textarea value={userMessage} onChange={e => setUserMessage(e.target.value)}
                    style={{ width: "100%", height: 80, background: "#fff", border: "1.5px solid #e8e8f0", borderRadius: 12, padding: "12px 16px", color: "#0f172a", fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.65, transition: "border .2s", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = `${accent}80`}
                    onBlur={e => e.target.style.borderColor = "#e8e8f0"}/>
                </div>

                <button onClick={handleAPICall} disabled={apiLoading || !userMessage.trim()}
                  style={{ padding: "13px", background: userMessage.trim() ? accent : "#f1f5f9", border: "none", borderRadius: 12, color: userMessage.trim() ? "#fff" : "#94a3b8", fontWeight: 800, fontSize: 14, cursor: userMessage.trim() ? "pointer" : "default", fontFamily: "inherit", boxShadow: userMessage.trim() ? `0 6px 20px ${accent}35` : "none", transition: "all .2s" }}>
                  {apiLoading ? "Calling API..." : "Call the API →"}
                </button>

                {/* Response */}
                <div style={{ flex: 1, background: "#fff", border: "1.5px solid #e8e8f0", borderRadius: 16, padding: "16px 20px", minHeight: 120 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>API Response</div>
                  {apiLoading ? (
                    <div style={{ display: "flex", gap: 6, alignItems: "center", color: "#94a3b8", padding: "8px 0" }}>
                      {[0,1,2].map(j => <div key={j} style={{ width: 8, height: 8, borderRadius: "50%", background: accent, animation: `pulse 1.2s ease-in-out ${j*.2}s infinite` }}/>)}
                      <span style={{ marginLeft: 8, fontSize: 13 }}>Waiting for response...</span>
                    </div>
                  ) : apiResponse ? (
                    <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{apiResponse}</div>
                  ) : (
                    <div style={{ color: "#cbd5e1", fontSize: 13, display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
                      <span>→</span> Response will appear here after you call the API
                    </div>
                  )}
                </div>

                {apiResponse && (
                  <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "14px 18px" }}>
                    <p style={{ fontSize: 13, color: "#78350f", margin: 0, lineHeight: 1.6 }}>
                      <strong>Try this:</strong> Change the system prompt from "Friendly tutor" to "Senior engineer" and send the same message. Notice how the tone and style completely changes — same model, different role.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {apiResponse && (
              <button onClick={() => completeStep(1)} style={{ marginTop: 24, width: "100%", padding: "14px", background: accent, border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}35` }}>
                Now let's build something real →
              </button>
            )}
          </div>
        )}

        {/* ═══ STEP 2: BUILD YOUR FIRST TOOL ═══════════════════ */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>Build Your First AI Tool</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>You just built your first<br/><span style={{ color: accent }}>AI-powered product.</span></h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>Type any topic you want to learn. Our AI will generate a personalised 4-week plan — just for you. This is real AI engineering: input → AI → structured output.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Left: input */}
              <div>
                <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>What do you want to learn?</div>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5 }}>Enter any topic — technical or not. The AI will build a structured plan.</p>
                  <input value={topic} onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. Python, Machine Learning, Public Speaking..."
                    onKeyDown={e => e.key === "Enter" && handleBuildTool()}
                    style={{ width: "100%", padding: "13px 16px", background: "#f8fafc", border: "1.5px solid #e8e8f0", borderRadius: 12, color: "#0f172a", fontSize: 15, outline: "none", fontFamily: "inherit", fontWeight: 500, transition: "border .2s", boxSizing: "border-box", marginBottom: 12 }}
                    onFocus={e => e.target.style.borderColor = `${accent}80`}
                    onBlur={e => e.target.style.borderColor = "#e8e8f0"}/>
                  <button onClick={handleBuildTool} disabled={!topic.trim() || planLoading}
                    style={{ width: "100%", padding: "13px", background: topic.trim() ? accent : "#f1f5f9", border: "none", borderRadius: 12, color: topic.trim() ? "#fff" : "#94a3b8", fontWeight: 800, fontSize: 14, cursor: topic.trim() ? "pointer" : "default", fontFamily: "inherit", boxShadow: topic.trim() ? `0 6px 20px ${accent}35` : "none", transition: "all .2s" }}>
                    {planLoading ? "Building your plan..." : "Generate my learning plan →"}
                  </button>
                </div>

                {/* What's happening under the hood */}
                <div style={{ background: "#0f172a", borderRadius: 16, padding: "20px 22px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>What's happening under the hood</div>
                  {[
                    { step: "1", label: "Your input", desc: `"${topic || "Python"}"`, color: "#7dd3fc" },
                    { step: "2", label: "System prompt", desc: "Structured JSON output instructions", color: "#a78bfa" },
                    { step: "3", label: "API call", desc: "claude-sonnet-4 processes the request", color: "#86efac" },
                    { step: "4", label: "Parse response", desc: "JSON → structured UI", color: "#f9a8d4" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#0f172a", flexShrink: 0 }}>{item.step}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Fira Code',monospace" }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: output */}
              <div>
                {planLoading && (
                  <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[0,1,2].map(j => <div key={j} style={{ width: 12, height: 12, borderRadius: "50%", background: accent, animation: `pulse 1.2s ease-in-out ${j*.2}s infinite`, boxShadow: `0 0 10px ${accent}` }}/>)}
                    </div>
                    <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>AI is building your plan...</div>
                  </div>
                )}

                {learningPlan && !learningPlan.error && (
                  <div style={{ background: "#fff", border: `1.5px solid ${accent}25`, borderRadius: 20, padding: "24px", height: "100%", boxSizing: "border-box" }}>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", marginBottom: 6, letterSpacing: -0.5 }}>{learningPlan.title}</div>
                      <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, background: light, border: `1px solid ${accent}20`, borderRadius: 10, padding: "10px 14px" }}>🎯 {learningPlan.goal}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {learningPlan.weeks?.map((week, i) => (
                        <div key={i} style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 14, padding: "16px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff", flexShrink: 0 }}>W{week.week}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{week.theme}</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            {week.tasks?.map((task, j) => (
                              <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent, flexShrink: 0, marginTop: 6 }}/>
                                <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {learningPlan?.error && (
                  <div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 16, padding: "20px", color: "#dc2626", fontSize: 14 }}>
                    Something went wrong. Try again — AI APIs occasionally have hiccups. That's real engineering too.
                  </div>
                )}

                {!planLoading && !learningPlan && (
                  <div style={{ background: "#fff", border: "1.5px dashed #e2e8f0", borderRadius: 20, padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#cbd5e1" }}>
                    <div style={{ fontSize: 48 }}>📋</div>
                    <div style={{ fontSize: 14, textAlign: "center", lineHeight: 1.5 }}>Your personalised learning plan<br/>will appear here</div>
                  </div>
                )}
              </div>
            </div>

            {learningPlan && !learningPlan.error && (
              <div style={{ marginTop: 24 }}>
                <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 16, padding: "18px 22px", marginBottom: 16, display: "flex", gap: 14 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>🤯</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }}>You just built a real AI product.</div>
                    <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>A user types a topic → your code calls the AI API → the AI returns structured JSON → your UI renders a beautiful plan. That's the full loop. That's what AI engineers do. And you just did it.</p>
                  </div>
                </div>
                <button onClick={() => completeStep(2)} style={{ width: "100%", padding: "14px", background: accent, border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}35` }}>
                  Claim 75 XP — lesson complete 🏆
                </button>
              </div>
            )}
          </div>
        )}

        {/* Completion */}
        {completed.length === 3 && (
          <div style={{ marginTop: 32, background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 20, padding: "32px", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🏆</div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Lesson Complete!</div>
            <div style={{ fontSize: 15, color: "#475569", marginBottom: 24 }}>You earned 75 XP and got a real taste of what AI engineering looks like.</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {["3 types of AI careers", "Live API calls", "System prompts", "JSON parsing", "Built an AI tool"].map((s, i) => (
                <div key={i} style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#16a34a", fontWeight: 700 }}>✓ {s}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pop { from { opacity:0; transform:translateX(-50%) scale(.7); } to { opacity:1; transform:translateX(-50%) scale(1); } }
        @keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #e8e8f0; border-radius: 3px; }
        input[type=range] { height: 4px; }
      `}</style>
    </div>
  );
}
