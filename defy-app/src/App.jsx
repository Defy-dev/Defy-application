import { useState, useRef, useEffect } from "react";
// ── TRANSLATE WRAPPER ─────────────────────────
const LANGS = [
{code:"Ukrainian",flag:" ",label:"UA"},
{code:"Russian",flag:" ",label:"RU"},
{code:"Spanish",flag:" ",label:"ES"},
{code:"German",flag:" ",label:"DE"},
{code:"French",flag:" ",label:"FR"},
{code:"Polish",flag:" ",label:"PL"},
];
function TranslateWrapper({ children, onBack }) {
const [translateLang, setTranslateLang] = useState(null);
const [tooltip, setTooltip] = useState(null);
const handleMouseUp = async (e) => {
if (!translateLang) return;
const sel = window.getSelection();
if (sel && sel.toString().trim().length > 0) {
const word = sel.toString().trim();
if (word.split(" ").length > 6) return;
setTooltip({ word, translation: "...", x: e.clientX, y: e.clientY });
try {
const res = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
model: "claude-sonnet-4-20250514", max_tokens: 60,
messages: [{ role: "user", content: `Translate "${word}" to ${translateLang}. Rep
})
});
const data = await res.json();
const tr = data.content?.map(b => b.text || "").join("") || "?";
setTooltip(t => t ? { ...t, translation: tr } : null);
} catch { setTooltip(null); }
}
};
return (
<div onMouseUp={handleMouseUp} style={{position:"relative"}}>
{/* Translate bar */}
<div style={{position:"fixed",bottom:16,right:16,zIndex:9999,display:"flex",alignItems:
<span style={{fontSize:14}}> </span>
<select value={translateLang||""} onChange={e=>setTranslateLang(e.target.value||null)
style={{border:"none",background:"transparent",fontSize:12,fontFamily:"inherit",col
<option value="">Translate</option>
{LANGS.map(l=><option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
</select>
{translateLang && <span style={{fontSize:11,color:"#94a3b8"}}>select any word</span>}
</div>
{/* Tooltip */}
{tooltip && (
<div style={{position:"fixed",left:tooltip.x+12,top:tooltip.y-44,background:"#0f172a"
<div style={{fontSize:10,color:"#7c3aed",fontWeight:800,letterSpacing:1,textTransfo
<div>{tooltip.translation}</div>
</div>
)}
{children}
</div>
);
}
// ── END TRANSLATE WRAPPER ──────────────────────
const accent = "#8b5cf6";
const light = "#f5f3ff";
// ── DATA ──────────────────────────────────────
const PATHS = [
{
id: "user",
label: "AI User",
icon: " ",
color: "#64748b",
bg: "#f8fafc",
border: "#e2e8f0",
salary: "$0 — everyone",
desc: "Uses AI tools built by others. ChatGPT, Midjourney, Notion AI. No code needed.",
day: ["9am — Opens ChatGPT", "10am — Writes prompts for reports", "2pm — Uses AI to summa
tools: ["ChatGPT", "Claude", "Midjourney", "Notion AI"],
truth: "This is valuable but not a tech career. You're the customer, not the builder."
},
{
id: "builder",
label: "AI Engineer",
icon: " ",
color: "#8b5cf6",
bg: "#f5f3ff",
border: "rgba(139,92,246,0.3)",
salary: "$3,000–12,000/mo",
desc: "Builds products using AI APIs. Integrates models into apps, writes prompts program
day: ["9am — Reviews API logs", "10am — Writes Python to call GPT/Claude", "1pm — Ships a
tools: ["Python", "OpenAI / Anthropic API", "FastAPI", "Langchain", "Vercel"],
truth: "This is where 80% of AI jobs are. You build the tools others use."
},
{
id: "researcher",
label: "ML Researcher",
icon: " ",
color: "#0891b2",
bg: "#ecfeff",
border: "rgba(8,145,178,0.3)",
salary: "$8,000–25,000/mo",
desc: "Trains new models from scratch. Needs PhD-level math, massive compute, and years o
day: ["9am — Reads 3 research papers", "11am — Trains model on 1000 GPUs", "3pm — Analyse
tools: ["PyTorch", "CUDA", "Jupyter", "Weights & Biases", "HuggingFace"],
truth: "This is OpenAI, Google DeepMind. Rare, elite, and needs years of math background.
}
];
const PARAMS = [
{ key: "temperature", label: "Temperature", min: 0, max: 1, step: 0.1, default: 0.7, { key: "max_tokens", label: "Max Length", min: 50, max: 500, step: 50, default: 200, desc:
desc:
];
const SYSTEM_PROMPTS = [
{ label: "Friendly tutor", value: "You are a friendly, encouraging tutor. Explain things si
{ label: "Senior engineer", value: "You are a senior software engineer. Be direct, technica
{ label: "Startup founder", value: "You are a startup founder. Think in terms of business i
{ label: "No role (default)", value: "" },
];
// ── COMPONENT ─────────────────────────────────
function AIMLLesson1({ onBack }) {
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
const text = await callAI(systemPrompt, userMessage, params.temperature, params.max_tok
setApiResponse(text);
} catch { setApiResponse("Connection error. Please try again."); }
setApiLoading(false);
};
const handleBuildTool = async () => {
if (!topic.trim()) return;
setPlanLoading(true); setLearningPlan(null);
try {
const system = "You are a helpful learning coach. Create structured, encouraging learni
const user = `Create a 4-week learning plan for someone who wants to learn: "${topic}"\
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
if (s < 2) setTimeout(() => { setStep(s + 1); ; }, 400);
};
const path = PATHS.find(p => p.id === activePath);
return (
<TranslateWrapper onBack={onBack}>
<div style={{ height: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans','D
{celebration && (
<div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
Step complete! Keep going →
</div>
)}
{/* Header */}
<header style={{ background: "#fff", borderBottom: "1px solid #e8e8f0", position: "stic
{/* Row 1: Logo + lesson info */}
<div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 20px 8px", display: "fl
<button onClick={onBack} style={{background:"transparent",border:"1px solid #e8e8f0
<div style={{ width: 1, height: 18, background: "#e8e8f0", flexShrink: 0 }}/>
<div style={{ minWidth: 0 }}>
<div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowra
<div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Lesson 1 · 75 XP
</div>
<div style={{ marginLeft: "auto", background: light, border: `1px solid ${accent}20
{completed.length}/3 done
</div>
</div>
{/* Row 2: Step navigation */}
<div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 10px", display: "flex
{["1. The Profession", "2. What is API?", "3. Build a Tool"].map((label, i) => (
<button key={i} onClick={() => { setStep(i); ; }}
style={{ padding: "6px 14px", borderRadius: 100, border: `1.5px solid ${step ==
{completed.includes(i) ? "✓" : ""} {label}
</button>
))}
</div>
{/* Progress bar */}
<div style={{ height: 3, background: "#f1f5f9" }}>
<div style={{ height: "100%", width: `${(completed.length / 3) * 100}%`, background
</div>
</header>
<div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
{/* ═══ STEP 0: THE PROFESSION ═══════════════════════════ */}
{step === 0 && (
<div>
<div style={{ marginBottom: 40 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
{/* Path selector */}
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220p
{PATHS.map(p => (
<div key={p.id} onClick={() => setActivePath(p.id)}
style={{ background: activePath === p.id ? p.bg : "#fff", border: `2px soli
onMouseEnter={e => { if (activePath !== p.id) e.currentTarget.style.borderC
onMouseLeave={e => { if (activePath !== p.id) e.currentTarget.style.borderC
<div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
<div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom
<div style={{ fontSize: 13, fontWeight: 700, color: p.color, marginBottom:
<div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>{p.desc}<
</div>
))}
</div>
{/* Detail panel */}
<div style={{ background: "#fff", border: `1.5px solid ${path.border}`, borderRad
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(22
{/* A day */}
<div>
<div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacin
{path.day.map((item, i) => (
<div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignIt
<div style={{ width: 6, height: 6, borderRadius: "50%", background: pat
<span style={{ fontSize: 13, color: "#334155", lineHeight: 1.5, fontWei
</div>
))}
</div>
{/* Tools */}
<div>
<div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacin
<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
{path.tools.map((t, i) => (
<div key={i} style={{ background: path.bg, border: `1px solid ${path.bo
))}
</div>
</div>
{/* Truth */}
<div>
<div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacin
<div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRad
<span style={{ fontSize: 14, color: "#78350f", lineHeight: 1.65, fontWeig
</div>
</div>
</div>
</div>
{/* Insight */}
<div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 1
<span style={{ fontSize: 22, flexShrink: 0 }}> </span>
<div>
</div>
</div>
<div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>Not
<button onClick={() => completeStep(0)} style={{ width: "100%", padding: "14px",
I want to be a builder — show me how →
</button>
</div>
)}
{/* ═══ STEP 1: WHAT IS API + EXPLORER ══════════════════ */}
{step === 1 && (
<div>
<div style={{ marginBottom: 36 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
{/* API explanation */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 8
<p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: "0 0 24px"
Almost every app you use makes API requests — all day, every day. You just do
</p>
{/* Real life examples */}
<div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom:
{[
{ app: "Instagram", icon: " ", action: "You open the feed", api: "App send
{ app: "Uber", icon: " ", action: "You request a ride", api: "App sends AP
{ app: "Online payment", icon: " ", action: "You tap 'Pay'", api: "Shop se
{ app: "ChatGPT", icon: " ", action: "You send a message", api: "Website s
].map((item, i) => (
<div key={i} style={{ display: "grid", gridTemplateColumns: "28px 90px 1fr
<span style={{ fontSize: 18 }}>{item.icon}</span>
<div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{item.ap
<div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>
<span style={{ color: "#94a3b8", fontWeight: 600 }}>You: </span>{item.a
<div style={{ marginTop: 3 }}><span style={{ color: accent, fontWeight:
</div>
<div style={{ fontSize: 12, color: "#10b981", fontWeight: 600, lineHeight
</div>
))}
</div>
{/* The point */}
<div style={{ background: light, border: `1px solid ${accent}20`, borderRadius:
<div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 6 }
<p style={{ fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.65 }}>
API is just an <strong style={{ color: "#0f172a" }}>address on the internet
</p>
</div>
{/* Key insight */}
<div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius:
<span style={{ fontSize: 20, flexShrink: 0 }}> </span>
<div>
<div style={{ fontSize: 14, fontWeight: 700, color: "#166534", marginBottom
<p style={{ fontSize: 13, color: "#15803d", margin: 0, lineHeight: 1.6 }}>T
</div>
</div>
</div>
{/* Transition */}
<div style={{ background: "#0f172a", borderRadius: 16, padding: "20px 24px", marg
<div style={{ fontSize: 32, flexShrink: 0 }}> </div>
<div>
</div>
</div>
<div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }
<p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>No
<div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 2,
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280p
{/* Controls */}
<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
{/* System prompt */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius:
<div style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8", letterSpacin
<p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px", lineHeight:
<div style={{ display: "flex", flexDirection: "column", gap: 6, marginBotto
{SYSTEM_PROMPTS.map((sp, i) => (
<button key={i} onClick={() => setSystemPrompt(sp.value)}
style={{ padding: "8px 12px", borderRadius: 10, border: `1.5px {sp.label}
</button>
solid
))}
</div>
{systemPrompt && (
<div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderR
"{systemPrompt}"
</div>
)}
</div>
}}>{p.
{/* Parameters */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius:
<div style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8", letterSpacin
{PARAMS.map(p => (
<div key={p.key} style={{ marginBottom: 20 }}>
<div style={{ display: "flex", justifyContent: "space-between", marginB
<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" <span style={{ fontSize: 13, fontWeight: 800, color: accent }}>{param
</div>
<input type="range" min={p.min} max={p.max} step={p.step} value={params
onChange={e => setParams(prev => ({ ...prev, [p.key]: parseFloat(e.ta
style={{ width: "100%", accentColor: accent, marginBottom: 6 }}/>
<div style={{ display: "flex", justifyContent: "space-between", fontSiz
<span>{p.low}</span><span>{p.high}</span>
</div>
<div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{p.desc}<
</div>
))}
</div>
</div>
{/* Right: message + response */}
<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
{/* JSON preview */}
<div style={{ background: "#0f172a", borderRadius: 16, padding: "16px 20px" }
<div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacin
<div style={{ fontFamily: "'Fira Code',monospace", fontSize: 12, lineHeight
<div style={{ color: "#64748b" }}>{"{"}</div>
<div style={{ paddingLeft: 16 }}>
<span style={{ color: "#7dd3fc" }}>"model"</span><span style={{ color:
</div>
<div style={{ paddingLeft: 16 }}>
<span style={{ color: "#7dd3fc" }}>"max_tokens"</span><span style={{ co
</div>
{systemPrompt && (
<div style={{ paddingLeft: 16 }}>
<span style={{ color: "#7dd3fc" }}>"system"</span><span style={{ colo
</div>
)}
<div style={{ paddingLeft: 16 }}>
<span style={{ color: "#7dd3fc" }}>"messages"</span><span style={{ colo
</div>
<div style={{ color: "#64748b" }}>{"}"}</div>
</div>
</div>
{/* User message */}
<div>
<div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom
<textarea value={userMessage} onChange={e => setUserMessage(e.target.value)
style={{ width: "100%", height: 80, background: "#fff", border: "1.5px so
onFocus={e => e.target.style.borderColor = `${accent}80`}
onBlur={e => e.target.style.borderColor = "#e8e8f0"}/>
</div>
<button onClick={handleAPICall} disabled={apiLoading || !userMessage.trim()}
style={{ padding: "13px", background: userMessage.trim() ? accent : "#f1f5f
{apiLoading ? "Calling API..." : "Call the API →"}
</button>
{/* Response */}
<div style={{ flex: 1, background: "#fff", border: "1.5px solid #e8e8f0", bor
<div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacin
{apiLoading ? (
<div style={{ display: "flex", gap: 6, alignItems: "center", color: "#94a
{[0,1,2].map(j => <div key={j} style={{ width: 8, height: 8, borderRadi
<span style={{ marginLeft: 8, fontSize: 13 }}>Waiting for response...</
</div>
) : apiResponse ? (
<div style={{ fontSize: 14, color: "#334155", lineHeight: 1.75, whiteSpac
) : (
<div style={{ color: "#cbd5e1", fontSize: 13, display: "flex", alignItems
<span>→</span> Response will appear here after you call the API
</div>
)}
</div>
{apiResponse && (
<div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRad
<p style={{ fontSize: 13, color: "#78350f", margin: 0, lineHeight: 1.6 }}
<strong>Try this:</strong> Change the system prompt from "Friendly tuto
</p>
</div>
)}
</div>
</div>
{apiResponse && (
<button onClick={() => completeStep(1)} style={{ marginTop: 24, width: "100%",
Now let's build something real →
</button>
)}
</div>
)}
{/* ═══ STEP 2: BUILD YOUR FIRST TOOL ═══════════════════ */}
{step === 2 && (
<div>
<div style={{ marginBottom: 36 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280p
{/* Left: input */}
<div>
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius:
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "
<p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", lineHeight:
<input value={topic} onChange={e => setTopic(e.target.value)}
placeholder="e.g. Python, Machine Learning, Public Speaking..."
onKeyDown={e => e.key === "Enter" && handleBuildTool()}
style={{ width: "100%", padding: "13px 16px", background: "#f8fafc", bord
onFocus={e => e.target.style.borderColor = `${accent}80`}
onBlur={e => e.target.style.borderColor = "#e8e8f0"}/>
<button onClick={handleBuildTool} disabled={!topic.trim() || planLoading}
style={{ width: "100%", padding: "13px", background: topic.trim() ? accen
{planLoading ? "Building your plan..." : "Generate my learning plan →"}
</button>
</div>
{/* What's happening under the hood */}
<div style={{ background: "#0f172a", borderRadius: 16, padding: "20px 22px" }
<div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacin
{[
{ step: "1", label: "Your input", desc: `"${topic || "Python"}"`, color:
{ step: "2", label: "System prompt", desc: "Structured JSON output instru
{ step: "3", label: "API call", desc: "claude-sonnet-4 processes the requ
{ step: "4", label: "Parse response", desc: "JSON → structured UI", color
].map((item, i) => (
<div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignIt
<div style={{ width: 22, height: 22, borderRadius: "50%", background: i
<div>
</div>
</div>
<div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{it
<div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Fira Code
))}
</div>
</div>
{/* Right: output */}
<div>
{planLoading && (
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius
<div style={{ display: "flex", gap: 8 }}>
{[0,1,2].map(j => <div key={j} style={{ width: 12, height: 12, borderRa
</div>
<div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>AI is bu
</div>
)}
border
{learningPlan && !learningPlan.error && (
<div style={{ background: "#fff", border: `1.5px solid ${accent}25`, <div style={{ marginBottom: 20 }}>
<div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", marginBo
<div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, backgrou
</div>
<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
{learningPlan.weeks?.map((week, i) => (
<div key={i} style={{ background: "#f8fafc", border: "1px solid #e8e8
<div style={{ display: "flex", alignItems: "center", gap: 10, margi
<div style={{ width: 28, height: 28, borderRadius: 8, background:
<div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
</div>
<div style={{ display: "flex", flexDirection: "column", gap: {week.tasks?.map((task, j) => (
<div key={j} style={{ display: "flex", gap: 8, alignItems: "fle
<div style={{ width: 5, height: 5, borderRadius: "50%", backg
<span style={{ fontSize: 13, color: "#475569", lineHeight: 1.
</div>
))}
5 }}>
</div>
</div>
))}
</div>
</div>
)}
{learningPlan?.error && (
<div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRad
Something went wrong. Try again — AI APIs occasionally have hiccups. That
</div>
)}
{!planLoading && !learningPlan && (
<div style={{ background: "#fff", border: "1.5px dashed #e2e8f0", borderRad
<div style={{ fontSize: 48 }}> </div>
<div style={{ fontSize: 14, textAlign: "center", lineHeight: 1.5 }}>Your
</div>
)}
</div>
</div>
{learningPlan && !learningPlan.error && (
<div style={{ marginTop: 24 }}>
<div style={{ background: light, border: `1px solid ${accent}20`, borderRadiu
<span style={{ fontSize: 22, flexShrink: 0 }}> </span>
<div>
<div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom:
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}
</div>
</div>
<button onClick={() => completeStep(2)} style={{ width: "100%", padding: "14p
Claim 75 XP — lesson complete
</button>
</div>
)}
</div>
)}
{/* Completion */}
{completed.length === 3 && (
<div style={{ marginTop: 32, background: "#f0fdf4", border: "1.5px solid #bbf7d0",
<div style={{ fontSize: 52, marginBottom: 12 }}> </div>
<div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }
<div style={{ fontSize: 15, color: "#475569", marginBottom: 24 }}>You earned 75 X
<div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap
{["3 types of AI careers", "Live API calls", "System prompts", "JSON parsing",
<div key={i} style={{ background: "#dcfce7", border: "1px solid #bbf7d0", bor
))}
</div>
</div>
)}
</div>
<style>{`
@keyframes pop { from { opacity:0; transform:translateX(-50%) scale(.7); } to { opaci
@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:sc
* { box-sizing: border-box; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: #e8e8f0; border-radius: 3px; }
input[type=range] { height: 4px; }
`}</style>
</div>
</TranslateWrapper>
);
}
function HTMLLesson({ onBack }) {
const [activeTab, setActiveTab] = useState("theory");
const [activeSection, setActiveSection] = useState(0);
const [answer, setAnswer] = useState("");
const [showMistake, setShowMistake] = useState(null);
const accent = "#7c3aed";
const light = "#f3f0ff";
const sections = [
{
id: 0,
title: "What even is HTML?",
emoji: " ",
hook: "Every website you've ever visited — Google, Instagram, YouTube — starts with HTM
content: [
{
type: "analogy",
text: "Think of a website like a human body. HTML is the skeleton — the bones that
},
{
type: "visual",
label: "A webpage is just a text file with special tags",
code: `<!DOCTYPE html>
<html>
<head>
<title>My First Page</title>
</head>
<body>
<h1>Hello, World!</h1>
<p>This is my first webpage.</p>
</body>
</html>`,
},
{
result: "What the browser shows:\n\n【 Hello, World! 】← big bold heading\n\nThis is
type: "insight",
text: "HTML stands for HyperText Markup Language. \"Markup\" means you're adding la
}
]
},
{
id: 1,
title: "Tags — the building blocks",
emoji: " ",
hook: "HTML is made of tags. Tags are like labels you wrap around content. Once you und
content: [
{
type: "analogy",
text: "Imagine you're wrapping a gift. You open the box, put something inside, then
},
{
type: "visual",
label: "Anatomy of an HTML tag",
code: `<p>This is a paragraph.</p>
↑ ↑ ↑
opening tag content closing tag
(the gift) (has a / slash)`,
result: "The browser reads this and shows:\n\nThis is a paragraph."
},
{
type: "tags_grid",
title: "The tags you'll use 90% of the time",
tags: [
{ tag: "<h1>", desc: "Big heading — like a chapter title", example: "<h1>Welcome<
{ tag: "<h2>", desc: "Smaller heading — like a section title", example: "<h2>Abou
{ tag: "<p>", desc: "Paragraph — regular text", example: "<p>I love coding.</p>"
{ tag: "<a>", desc: "Link — clicking goes somewhere", example: '<a href="google.c
{ tag: "<img>", desc: "Image — shows a picture", example: '<img src="photo.jpg">'
{ tag: "<div>", desc: "Container — groups things together", example: "<div>...</d
]
},
{
type: "insight",
text: "Some tags don't need closing — like <img> and <br>. They're called \"self-cl
}
]
},
{
id: 2,
title: "Structure that matters",
emoji: " ",
hook: "A good HTML page has a clear structure. Think of it like a letter — there's an e
content: [
{
type: "visual",
label: "Every HTML page has this structure",
code: `<!DOCTYPE html> ← "Hey browser, this is HTML5"
<html> ← start of the page
<head> </head>
← info about the page (not visible)
<title>My Page</title> ← tab title in browser
<body> ← everything the user SEES
<h1>Hello!</h1>
<p>Welcome to my site.</p>
</body>
</html> ← end of the page`,
result: "Browser tab shows: My Page\nPage shows: Hello! (big) + Welcome to my site.
},
{
type: "analogy",
text: "The <head> is like the back of a painting — the canvas, the frame, the artis
},
{
type: "insight",
text: "Indentation (the spaces before tags) is not required by the browser — }
but it
]
},
{
id: 3,
title: "Common mistakes",
emoji: " ",
hook: "Everyone makes these mistakes. You will too. That's fine — knowing them in advan
content: [
{
type: "mistakes",
mistakes: [
{
title: "Forgetting the closing tag",
bad: `<p>This paragraph never ends...
<p>Now both paragraphs are broken`,
good: `<p>This paragraph ends properly.</p>
<p>And this one too.</p>`,
effect: "The browser tries to guess what you meant — and usually guesses },
{
wrong.
title: "Wrong nesting order",
bad: `<b><i>Bold and italic</b></i>`,
good: `<b><i>Bold and italic</i></b>`,
effect: "Tags must close in reverse order — last opened, first closed. Like sta
},
{
title: "Missing quotes on attributes",
bad: `<a href=google.com>Click me</a>`,
good: `<a href="google.com">Click me</a>`,
effect: "Some browsers handle it, some don't. Always use quotes — it's a habit
},
{
title: "Using <br> for spacing",
bad: `<p>Line 1</p>
<br><br><br>
<p>Line 2</p>`,
good: `<p>Line 1</p>
<p>Line 2</p>
<!-- Use CSS margin for spacing -->`,
effect: "Break tags are for line breaks within text, not for creating space bet
}
]
}
]
}
];
const currentSection = sections[activeSection];
return (
<TranslateWrapper onBack={onBack}>
<div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans'
{/* Header */}
<header style={{ background: "#fff", borderBottom: "1px solid #e8e8f0", position: "stic
<div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", minHeight: 60, disp
<button onClick={onBack} style={{background:"transparent",border:"1px solid #e8e8f0
<div>
<div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>HTML — Skeleton
<div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Frontend Develop
</div>
<div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
{["theory", "practice"].map(v => (
<button key={v} onClick={() => setActiveTab(v)} style={{ padding: "7px 16px", b
{v === "theory" ? "Theory" : "Practice"}
</button>
))}
</div>
</div>
</header>
{/* Progress bar */}
<div style={{ height: 3, background: "#f1f5f9" }}>
<div style={{ height: "100%", width: `${((activeSection + 1) / sections.length) * 100
</div>
{/* THEORY */}
{activeTab === "theory" && (
<div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
{/* Section nav */}
<div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
{sections.map((s, i) => (
<button key={i} onClick={() => setActiveSection(i)} style={{ padding: "8px 16px
<span>{s.emoji}</span> {s.title}
</button>
))}
</div>
`1px s
2, tex
{/* Hook */}
<div style={{ background: `linear-gradient(135deg, ${light}, #fff)`, border: <div style={{ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", lineHeight: 1.65, ma
</div>
{/* Content blocks */}
{currentSection.content.map((block, i) => (
<div key={i} style={{ marginBottom: 28 }}>
{/* Analogy */}
{block.type === "analogy" && (
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius:
<div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacin
<p style={{ fontSize: 15, color: "#334155", lineHeight: 1.8, margin: 0, fon
</div>
)}
{/* Code + Result */}
{block.type === "visual" && (
<div>
{block.label && <div style={{ fontSize: 13, fontWeight: 700, color: "#64748
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minma
<div>
<div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSp
<div style={{ background: "#0f172a", borderRadius: 14, padding: "20px",
{block.code.split("\n").map((line, j) => (
<div key={j}>
{line.includes("←") ? (
<>
<span style={{ color: "#a78bfa" }}>{line.split("←")[0]}</span
<span style={{ color: "#64748b", fontStyle: "italic" }}>←{lin
</>
) : line.startsWith("<") || line.includes("<") ? (
<span style={{ color: "#7dd3fc" }}>{line}</span>
) : (
<span>{line}</span>
)}
</div>
))}
</div>
</div>
<div>
</div>
</div>
</div>
<div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSp
<div style={{ background: "#fff", border: "2px solid #e8e8f0", borderRa
)}
{/* Tags grid */}
{block.type === "tags_grid" && (
<div>
<div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minm
{block.tags.map((t, j) => (
<div key={j} style={{ background: "#fff", border: "1px solid #e8e8f0",
onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}50
onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e8f0"; e
<div style={{ fontFamily: "'Fira Code', monospace", fontSize: 14, fon
<div style={{ fontSize: 13, color: "#64748b", marginBottom: 10, lineH
<div style={{ background: "#0f172a", borderRadius: 8, padding: "8px 1
</div>
))}
</div>
</div>
)}
{/* Insight */}
{block.type === "insight" && (
<div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadiu
<span style={{ fontSize: 20, flexShrink: 0 }}> </span>
<p style={{ fontSize: 14, color: "#78350f", lineHeight: 1.7, margin: </div>
0, fon
)}
{/* Mistakes */}
{block.type === "mistakes" && (
<div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minm
{block.mistakes.map((m, j) => (
<div key={j} style={{ background: "#fff", border: "1px solid #e8e8f0",
onClick={() => setShowMistake(showMistake === j ? null : j)}
onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba
onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
<div style={{ padding: "16px 20px", display: "flex", alignItems: "cen
<div style={{ width: 32, height: 32, borderRadius: 10, background:
<div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", flex
<div style={{ color: "#94a3b8", fontSize: 18 }}>{showMistake === j
</div>
{showMistake === j && (
<div style={{ padding: "0 20px 20px", borderTop: "1px solid #f1f5f9
<div style={{ marginTop: 16 }}>
<div style={{ fontSize: 11, fontWeight: 800, color: "#ef4444",
<div style={{ background: "#fff1f2", border: "1px solid #fecaca
</div>
<div style={{ marginTop: 12 }}>
<div style={{ fontSize: 11, fontWeight: 800, color: "#10b981",
<div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0
</div>
<div style={{ marginTop: 12, padding: "12px 14px", background: "#
<strong>What happens:</strong> {m.effect}
</div>
</div>
)}
</div>
))}
</div>
</div>
)}
</div>
))}
{/* Navigation */}
<div style={{ display: "flex", gap: 10, marginTop: 40 }}>
{activeSection > 0 && (
<button onClick={() => setActiveSection(s => s - 1)} style={{ padding: "12px 24
)}
{activeSection < sections.length - 1 ? (
<button onClick={() => setActiveSection(s => s + 1)} style={{ flex: 1, padding:
Next: {sections[activeSection + 1].emoji} {sections[activeSection + 1].title}
</button>
) : (
<button onClick={() => setActiveTab("practice")} style={{ flex: 1, padding: "13
Ready to practice? Let's go →
</button>
)}
</div>
</div>
)}
{/* PRACTICE */}
{activeTab === "practice" && (
<div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
{/* Recap */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, pa
<div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 2,
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180
{[
["HTML is", "the skeleton of every webpage"],
["Tags look like", "<opening> content </closing>"],
["Page structure", "html → head + body"],
["Most used tags", "h1, h2, p, a, img, div"],
["Common mistake", "forgetting closing tags"],
["Indentation", "not required but essential"],
].map(([k, v], i) => (
<div key={i} style={{ background: light, borderRadius: 12, padding: "12px 14p
<div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 4
<div style={{ fontSize: 13, color: "#334155", fontWeight: 500, lineHeight:
</div>
))}
</div>
</div>
{/* Task */}
<div style={{ background: "#fff", border: `1.5px solid ${accent}30`, borderRadius:
<div style={{ fontSize: 11, color: accent, fontWeight: 800, letterSpacing: <p style={{ fontSize: 16, color: "#1e293b", lineHeight: 1.7, margin: "0 0 16px",
Build the HTML structure for a personal portfolio page.
</p>
2, tex
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px",
Your page must include:
</p>
{[
<div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20
"A proper HTML structure (DOCTYPE, html, head, body)",
"A page title in the <head>",
"Your name as the main heading (h1)",
"A short bio paragraph (p)",
"At least 2 links to your social profiles (a)",
"A section with 3 skills you want to learn (h2 + list or paragraphs)",
].map((item, i) => (
<div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
<div style={{ width: 22, height: 22, borderRadius: "50%", background: light
<span style={{ fontSize: 14, color: "#334155", lineHeight: 1.5, fontWeight:
</div>
))}
</div>
<div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 12, font
<strong>Hint:</strong> Start with the skeleton (DOCTYPE → html → head → body
</div>
</div>
<textarea value={answer} onChange={e => setAnswer(e.target.value)}
placeholder={`<!DOCTYPE html>\n<html>\n ...\n</html>`}
style={{ width: "100%", minHeight: 200, background: "#0f172a", border: "1.5px sol
onFocus={e => e.target.style.borderColor = `${accent}80`}
onBlur={e => e.target.style.borderColor = "#1e293b"}/>
<button onClick={() => {}} disabled={!answer.trim()} style={{ marginTop: 12, Get Feedback from AI Mentor →
width:
</button>
<div style={{ marginTop: 20, padding: "16px 20px", background: "#f8fafc", border: "
<strong style={{ color: "#334155" }}>What the mentor will look at:</strong> corre
</div>
</div>
)}
<style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 5px; } ::-webkit-sc
</div>
</TranslateWrapper>
);
}
// removed duplicate accent (line 965)
// removed duplicate light (line 966)
const LANGUAGES = [
{
id: "python",
name: "Python",
icon: " ",
color: "#8b5cf6",
bg: "#f5f3ff",
border: "rgba(139,92,246,0.3)",
tagline: "Simple, readable, #1 for beginners",
why: "Python reads almost like English. You focus on logic, not syntax. It's also the sam
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
icon: " ",
color: "#f59e0b",
bg: "#fffbeb",
border: "rgba(245,158,11,0.3)",
tagline: "The language of the web",
why: "JavaScript runs in browsers AND on servers. If you already know some frontend, back
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
{ method: "GET", color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", desc: "Read data", exa
{ method: "POST", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", desc: "Create data",
{ method: "PUT", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", desc: "Update data", e
{ method: "DELETE", color: "#ef4444", bg: "#fff1f2", border: "#fecaca", desc: "Remove data"
];
const STATUS_CODES = [
{ code: "200", name: "OK", color: "#10b981", desc: "Everything worked perfectly" },
{ code: "201", name: "Created", color: "#3b82f6", desc: "New item was successfully created"
{ code: "404", name: "Not Found", color: "#f59e0b", desc: "The thing you asked for doesn't
{ code: "500", name: "Server Error", color: "#ef4444", desc: "Something broke on the server
];
function BackendLesson1({ onBack }) {
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
if (s < 2) setTimeout(() => { setStep(s + 1); ; }, 400);
};
const JOURNEY_STEPS = [
{ icon: " { icon: " { icon: " { icon: " { icon: " { icon: " { icon: " ", label: "You type a URL", desc: "You open your browser and type instagram.co
", label: "DNS lookup", desc: "Browser asks: 'What's the IP address of instagr
", label: "Connection", desc: "Browser connects to Instagram's server — a comp
", label: "HTTP Request", desc: "Browser sends: 'GET / HTTP/1.1' — 'Please giv
", label: "Server processes", desc: "Instagram's backend code runs. It checks
", label: "Response sent", desc: "Server sends back HTML, CSS, JS files + your
", label: "Browser renders", desc: "Your browser reads the files and draws the
];
return (
<TranslateWrapper onBack={onBack}>
<div style={{ height: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans','D
{celebration && (
<div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
Step complete! Keep going →
</div>
)}
{/* Header */}
<header style={{ background: "#fff", borderBottom: "1px solid #e8e8f0", position: "stic
<div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 20px 8px", display: "fl
<button onClick={onBack} style={{background:"transparent",border:"1px solid #e8e8f0
<div style={{ width: 1, height: 18, background: "#e8e8f0", flexShrink: 0 }}/>
<div style={{ minWidth: 0 }}>
<div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowra
<div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Lesson 1 · 75 XP
</div>
<div style={{ marginLeft: "auto", background: light, border: `1px solid ${accent}20
{completed.length}/3 done
</div>
</div>
<div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 10px", display: "flex
{["1. Choose your language", "2. What happens when you open a site?", "3. Build you
<button key={i} onClick={() => { setStep(i); ; }}
style={{ padding: "6px 14px", borderRadius: 100, border: `1.5px solid ${step ==
{completed.includes(i) ? "✓ " : ""}{label}
</button>
))}
</div>
<div style={{ height: 3, background: "#f1f5f9" }}>
<div style={{ height: "100%", width: `${(completed.length / 3) * 100}%`, background
</div>
</header>
<div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
{/* ═══ STEP 0: CHOOSE YOUR LANGUAGE ═══════════════════ */}
{step === 0 && (
<div>
<div style={{ marginBottom: 36 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
{/* Language cards */}
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280p
{LANGUAGES.map(l => (
<div key={l.id} onClick={() => setLanguage(l.id)}
style={{ background: language === l.id ? l.bg : "#fff", border: `2px solid
onMouseEnter={e => { if (language !== l.id) { e.currentTarget.style.borderC
onMouseLeave={e => { if (language !== l.id) { e.currentTarget.style.borderC
{language === l.id && (
<div style={{ position: "absolute", top: 16, right: 16, width: 24, height
)}
<div style={{ fontSize: 36, marginBottom: 12 }}>{l.icon}</div>
<div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", marginBottom
<div style={{ fontSize: 13, fontWeight: 700, color: l.color, marginBottom:
<p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: "0 0
{/* Used by */}
<div style={{ marginBottom: 16 }}>
<div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBott
<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
{l.used_by.map((company, i) => (
<div key={i} style={{ background: language === l.id ? "#fff" : ))}
</div>
</div>
"#f8fa
{/* Framework */}
<div style={{ background: language === l.id ? "#fff" : "#f8fafc", border: "
<div style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", marginBott
<div style={{ fontSize: 12, color: "#64748b" }}>{l.framework_desc}</div>
</div>
{/* Code preview */}
<div style={{ marginTop: 14, background: "#0f172a", borderRadius: 10, paddi
<div style={{ marginTop: 14, fontSize: 13, fontWeight: 700, color: l.color
</div>
))}
</div>
{/* Recommendation */}
<div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 1
<span style={{ fontSize: 20, flexShrink: 0 }}> </span>
<div>
</div>
</div>
<div style={{ fontSize: 14, fontWeight: 700, color: "#78350f", marginBottom:
<p style={{ fontSize: 13, color: "#92400e", margin: 0, lineHeight: 1.6 }}>Pyt
<button onClick={() => { if (language) completeStep(0); }} disabled={!language}
style={{ width: "100%", padding: "14px", background: language ? (lang?.color ||
{language ? `I'm learning ${lang?.name} — let's go →` : "Select a language to c
</button>
</div>
)}
{/* ═══ STEP 1: HOW THE INTERNET WORKS ═════════════════ */}
{step === 1 && (
<div>
<div style={{ marginBottom: 36 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
{/* Journey visualiser */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
{/* Steps */}
<div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 2
{JOURNEY_STEPS.map((s, i) => (
<div key={i} onClick={() => setJourneyStep(i)}
style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14
<div style={{ width: 40, height: 40, borderRadius: 12, background: <div style={{ flex: 1 }}>
<div style={{ display: "flex", alignItems: "center", gap: 8, marginBott
<div style={{ fontSize: 11, fontWeight: 800, color: journeyStep === i
<div style={{ fontSize: 14, fontWeight: 700, color: journeyStep === i
</div>
{journeyStep === i && (
<p style={{ fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.
journe
)}
</div>
</div>
<div style={{ color: journeyStep === i ? accent : "#cbd5e1", fontSize: 16
))}
</div>
{/* Navigation */}
<div style={{ display: "flex", gap: 10 }}>
<button onClick={() => setJourneyStep(j => Math.max(0, j - 1))} disabled={jou
style={{ padding: "10px 20px", background: "transparent", border: "1.5px so
{journeyStep < JOURNEY_STEPS.length - 1 ? (
<button onClick={() => setJourneyStep(j => j + 1)}
style={{ flex: 1, padding: "10px", background: accent, border: "none", bo
) : (
<div style={{ flex: 1, background: "#f0fdf4", border: "1px solid #bbf7d0",
)}
</div>
</div>
{/* HTTP Methods */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.6
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(16
{HTTP_METHODS.map(m => (
<div key={m.method} onClick={() => setActiveMethod(m.method)}
style={{ background: activeMethod === m.method ? m.bg : "#f8fafc", border
<div style={{ fontSize: 14, fontWeight: 900, color: m.color, marginBottom
<div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{m.desc}
</div>
))}
</div>
{method && (
<div style={{ background: method.bg, border: `1px solid ${method.border}`, bo
<div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom
<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
<div style={{ fontSize: 13, color: "#475569" }}> <strong>Real example:<
<div style={{ fontSize: 13, color: "#475569" }}> <strong>Think of it as
</div>
</div>
)}
</div>
{/* Status codes */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px", lineHeight: 1.6
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(16
{STATUS_CODES.map(s => (
<div key={s.code} onClick={() => setActiveStatus(activeStatus === s.code ?
style={{ background: activeStatus === s.code ? s.color + "15" : "#f8fafc"
<div style={{ fontSize: 22, fontWeight: 900, color: s.color, letterSpacin
<div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginTop:
{activeStatus === s.code && <div style={{ fontSize: 12, color: "#475569",
</div>
))}
</div>
</div>
{/* Simulate request */}
<div style={{ background: "#0f172a", borderRadius: 20, padding: "28px", marginBot
<div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
<p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 20px", lineHeight: 1.5
<div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding:
<div style={{ color: "#94a3b8", marginBottom: 4 }}>// Request being sent:</di
<div><span style={{ color: "#86efac" }}>GET</span> <span style={{ color: "#7d
<div><span style={{ color: "#a78bfa" }}>Host:</span> <span style={{ color: "#
<div><span style={{ color: "#a78bfa" }}>Accept:</span> <span style={{ color:
</div>
<button onClick={simulateRequest} disabled={requestLoading}
style={{ padding: "12px 24px", background: accent, border: "none", borderRadi
{requestLoading ? "Sending request..." : "Send Request →"}
</button>
{requestLoading && (
<div style={{ display: "flex", gap: 6, alignItems: "center", color: "#94a3b8"
{[0,1,2].map(j => <div key={j} style={{ width: 8, height: 8, borderRadius:
<span style={{ marginLeft: 8, fontSize: 13 }}>Waiting for server...</span>
</div>
)}
{requestSent && !requestLoading && (
<div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,
<div style={{ color: "#6ee7b7", marginBottom: 4 }}>// Response received:</d
<div><span style={{ color: "#86efac" }}>200 OK</span></div>
<div><span style={{ color: "#a78bfa" }}>Content-Type:</span> <span style={{
<div style={{ marginTop: 8, color: "#e2e8f0" }}>{`[{"id":1,"name":"Alice"},
</div>
)}
</div>
<button onClick={() => completeStep(1)}
style={{ width: "100%", padding: "14px", background: accent, border: "none", bo
I get it — now let me build something →
</button>
</div>
)}
{/* ═══ STEP 2: BUILD YOUR FIRST ENDPOINT ══════════════ */}
{step === 2 && (
<div>
<div style={{ marginBottom: 32 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
{/* Language badge */}
{lang && (
<div style={{ display: "inline-flex", alignItems: "center", gap: 8, background:
<span>{lang.icon}</span> Building with {lang.name} + {lang.framework}
<button onClick={() => { setStep(0); ; }} style={{ background: "transparent",
</div>
)}
produc
{/* Ideas */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 12
<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
{["A todo list API", "A weather endpoint", "A user login endpoint", "A <button key={i} onClick={() => setIdea(idea)}
style={{ padding: "7px 14px", background: light, border: `1px solid ${acc
onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
onMouseLeave={e => e.currentTarget.style.background = light}>
{idea}
</button>
))}
</div>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280p
{/* Input */}
<div>
<div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom:
<textarea value={idea} onChange={e => setIdea(e.target.value)}
placeholder="e.g. An endpoint that returns a list of all users in my app"
style={{ width: "100%", height: 120, background: "#fff", border: "1.5px sol
onFocus={e => e.target.style.borderColor = `${accent}80`}
onBlur={e => e.target.style.borderColor = "#e8e8f0"}/>
<button onClick={generateCode} disabled={!idea.trim() || codeLoading}
style={{ marginTop: 10, width: "100%", padding: "12px", background: idea.tr
{codeLoading ? "Generating code..." : "Generate my code →"}
</button>
</div>
{/* Output */}
<div>
{codeLoading && (
<div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRad
<div style={{ display: "flex", gap: 6 }}>
{[0,1,2].map(j => <div key={j} style={{ width: 10, height: 10, borderRa
</div>
<div style={{ fontSize: 13, color: "#64748b" }}>Writing your {lang?.name}
</div>
)}
{generatedCode && !generatedCode.error && (
<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
{/* What it does */}
<div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderR
<div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBo
<div style={{ fontSize: 14, color: "#15803d", fontWeight: 500 }}>{gener
<div style={{ marginTop: 8, display: "flex", gap: 8 }}>
<div style={{ background: "#dcfce7", borderRadius: 100, padding: "3px
<div style={{ background: "#dcfce7", borderRadius: 100, padding: "3px
</div>
</div>
{/* Code */}
<div style={{ background: "#0f172a", borderRadius: 12, padding: "16px", f
{generatedCode.code}
</div>
letter
{/* Line by line */}
{generatedCode.explanation && (
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRa
<div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
{generatedCode.explanation.map((item, i) => (
<div key={i} style={{ display: "grid", gridTemplateColumns: "repe
<div style={{ background: "#0f172a", borderRadius: 8, padding:
<div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5,
</div>
))}
</div>
</div>
)}
</div>
)}
{generatedCode?.error && (
<div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRad
Something went wrong. Try again — errors happen even to senior devs!
</div>
)}
{!codeLoading && !generatedCode && (
<div style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0", <div style={{ fontSize: 40 }}> </div>
<div style={{ fontSize: 13, textAlign: "center", lineHeight: 1.5 }}>Your
</div>
border
)}
</div>
</div>
{generatedCode && !generatedCode.error && (
<div style={{ marginTop: 24 }}>
<div style={{ background: light, border: `1px solid ${accent}20`, borderRadiu
<span style={{ fontSize: 22, flexShrink: 0 }}> </span>
<div>
<div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom:
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}
</div>
</div>
<button onClick={() => completeStep(2)}
style={{ width: "100%", padding: "14px", background: accent, border: Claim 75 XP — lesson complete
</button>
</div>
"none"
)}
#bbf7d
{/* Completion */}
{completed.length === 3 && (
<div style={{ marginTop: 24, background: "#f0fdf4", border: "1.5px solid <div style={{ fontSize: 48, marginBottom: 12 }}> </div>
<div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom:
<div style={{ fontSize: 15, color: "#475569", marginBottom: 20 }}>You earned
<div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "
{["Chose your language", "How internet works", "HTTP methods", "Status code
<div key={i} style={{ background: "#dcfce7", border: "1px solid #bbf7d0",
))}
</div>
</div>
)}
</div>
)}
</div>
<style>{`
@keyframes pop { from{opacity:0;transform:translateX(-50%) scale(.7)} to{opacity:1;tr
@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:sc
* { box-sizing: border-box; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: #e8e8f0; border-radius: 3px; }
`}</style>
</div>
</TranslateWrapper>
);
}
// removed duplicate accent (line 1479)
// removed duplicate light (line 1480)
// ── REAL WORLD STORIES ──────────────────────────────
const STORIES = [
{
},
{
},
{
},
{
company: "Netflix",
icon: " ",
color: "#ef4444",
bg: "#fff1f2",
border: "#fecaca",
headline: "One analyst saved $1 billion",
story: "A Data Analyst noticed that users who watched at least 3 episodes in their first
data_used: "Watch history, session length, cancellation dates, episode completion rates",
question_asked: "What behaviour predicts whether a user stays or leaves?",
impact: "$1B+ retained revenue"
company: "Spotify",
icon: " ",
color: "#10b981",
bg: "#f0fdf4",
border: "#bbf7d0",
headline: "They know you're sad before you do",
story: "Spotify analysts found that users listen to slower, more melancholic music data_used: "Listening times, song tempo/key, skip rates, session length by time of question_asked: "When do users' music preferences change, and why?",
impact: "34% longer sessions, foundation of the $1B playlist business"
on Mon
day",
company: "Your bank",
icon: " ",
color: "#3b82f6",
bg: "#eff6ff",
border: "#bfdbfe",
headline: "Why your card gets blocked abroad",
story: "Every time you use your card, a Data Analyst's model runs in under 50 millisecond
data_used: "Transaction location, time, amount, merchant category, device ID, travel patt
question_asked: "What does 'normal' look like for this customer, and what's an anomaly?",
impact: "Billions saved in fraud prevention globally"
company: "Uber",
icon: " ",
color: "#f59e0b",
bg: "#fffbeb",
border: "#fde68a",
headline: "Why prices surge exactly when you need a ride",
story: "Uber's surge pricing isn't random. It's the direct result of data analysis.\n\nAn
data_used: "Ride requests by location/time, driver availability, historical price elastic
question_asked: "What price maximises both driver supply and rider demand?",
impact: "Core of Uber's $31B annual revenue engine"
},
{
company: "Amazon",
icon: " ",
color: "#8b5cf6",
bg: "#f5f3ff",
border: "#ddd6fe",
headline: "They ship before you order",
story: "Amazon filed a patent for 'anticipatory shipping' — sending packages to distribut
data_used: "Browse history, wishlist, cart abandonment, purchase cycles, location, question_asked: "What will this customer order next, and when?",
impact: "Same-day delivery, competitive moat worth billions"
simila
},
];
const TOOLS_DATA = [
{ name: "SQL", icon: " { name: "Excel / Sheets", icon: " { name: "Python + Pandas", icon: " { name: "Tableau / Power BI", icon: " { name: "Looker / Metabase", icon: " { name: "dbt", icon: " ", color: "#3b82f6", desc: "Query databases. The single most import
", color: "#10b981", desc: "Quick analysis, pivot tables
", color: "#8b5cf6", desc: "Analyse large datasets, aut
", color: "#f59e0b", desc: "Build dashboards. Show d
", color: "#ef4444", desc: "Business intelligence too
", color: "#ec4899", desc: "Transform raw data into clean tables.",
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
{ id: 1, user_id: 1, product: "Laptop", amount: 1200, month: "Jan", status: "completed" }
{ id: 2, user_id: 2, product: "Phone", amount: 800, month: "Jan", status: "completed" },
{ id: 3, user_id: 1, product: "Headphones", amount: 250, month: "Feb", status: "completed
{ id: 4, user_id: 3, product: "Tablet", amount: 600, month: "Feb", status: "refunded" },
{ id: 5, user_id: 4, product: "Laptop", amount: 1200, month: "Mar", status: "completed" }
{ id: 6, user_id: 5, product: "Phone", amount: 800, month: "Mar", status: "completed" },
{ id: 7, user_id: 2, product: "Headphones", amount: 250, month: "Mar", status: "refunded"
{ id: 8, user_id: 6, product: "Tablet", amount: 600, month: "Apr", status: "completed" },
{ id: 9, user_id: 7, product: "Laptop", amount: 1200, month: "Apr", status: "completed" }
{ id: 10, user_id: 8, product: "Phone", amount: 800, month: "Apr", status: "completed" },
{ id: 11, user_id: 3, product: "Laptop", amount: 1200, month: "May", status: "completed"
{ id: 12, user_id: 1, product: "Phone", amount: 800, month: "May", status: "completed" },
],
};
const SQL_LESSONS = [
{
title: "Your first query — see all users",
desc: "SELECT gets data from a table. * means 'all columns'. FROM tells it which table.",
query: "SELECT * FROM users",
hint: "This is the most basic query. You're saying: 'show me everything in the users tabl
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
hint: "This is exactly what a Data Analyst does every Monday morning — revenue by period"
run: () => {
const months = ["Jan","Feb","Mar","Apr","May"];
return months.map(month => ({
month,
revenue: DB.orders.filter(o => o.month === month && o.status === "completed").reduce(
})).filter(r => r.revenue > 0);
},
columns: ["month", "revenue"],
},
{
title: "Find problems — refunded orders",
desc: "Analysts look for anomalies. Refunds = unhappy customers = business problem.",
query: "SELECT * FROM orders WHERE status = 'refunded'",
hint: "This query finds all refunded orders. A real analyst would then dig deeper: run: () => DB.orders.filter(o => o.status === "refunded"),
columns: ["id", "user_id", "product", "amount", "month", "status"],
why we
},
];
function DataLesson1({ onBack }) {
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
if (s < 2) setTimeout(() => { setStep(s + 1); ; }, 400);
};
const story = STORIES[activeStory];
const sqlLesson = SQL_LESSONS[sqlStep];
return (
<TranslateWrapper onBack={onBack}>
<div style={{ height: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans','D
{celebration && (
<div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
Step complete! Keep going →
</div>
)}
{/* Header */}
<header style={{ background: "#fff", borderBottom: "1px solid #e8e8f0", position: "stic
<div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 20px 8px", display: "fl
<button onClick={onBack} style={{background:"transparent",border:"1px solid #e8e8f0
<div style={{ width: 1, height: 18, background: "#e8e8f0", flexShrink: 0 }}/>
<div style={{ minWidth: 0 }}>
<div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowra
<div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Lesson 1 · 75 XP
</div>
<div style={{ marginLeft: "auto", background: light, border: `1px solid ${accent}20
{completed.length}/3 done
</div>
</div>
<div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 10px", display: "flex
{["1. What is a Data Analyst?", "2. Your first SQL", "3. Find an insight"].map((lab
<button key={i} onClick={() => { setStep(i); ; }}
style={{ padding: "6px 14px", borderRadius: 100, border: `1.5px solid ${step ==
{completed.includes(i) ? "✓ " : ""}{label}
</button>
))}
</div>
<div style={{ height: 3, background: "#f1f5f9" }}>
<div style={{ height: "100%", width: `${(completed.length / 3) * 100}%`, background
</div>
</header>
<div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
{/* ═══ STEP 0: WHAT IS A DATA ANALYST ════════════════ */}
{step === 0 && (
<div>
<div style={{ marginBottom: 36 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
{/* Real stories */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5
{/* Story selector */}
<div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
{STORIES.map((s, i) => (
<button key={i} onClick={() => setActiveStory(i)}
style={{ padding: "8px 16px", borderRadius: 100, border: `1.5px solid ${a
<span>{s.icon}</span> {s.company}
</button>
))}
</div>
{/* Active story */}
<div style={{ background: story.bg, border: `1.5px solid ${story.border}`, bord
<div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBotto
<span style={{ fontSize: 32, flexShrink: 0 }}>{story.icon}</span>
<div>
<div style={{ fontSize: 11, fontWeight: 800, color: story.color, letterSp
<div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpac
</div>
</div>
<p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: "0 0 20p
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(
<div style={{ background: "#fff", borderRadius: 12, padding: "14px" }}>
<div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpac
<div style={{ fontSize: 12, color: "#334155", lineHeight: 1.5, fontStyle:
</div>
<div style={{ background: "#fff", borderRadius: 12, padding: "14px" }}>
<div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpac
<div style={{ fontSize: 12, color: "#334155", lineHeight: 1.5 }}>{story.d
</div>
<div style={{ background: "#fff", borderRadius: 12, padding: "14px" }}>
<div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", letterSpac
<div style={{ fontSize: 13, fontWeight: 800, color: story.color }}>{story
</div>
</div>
</div>
</div>
{/* What analysts actually do */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(28
{[
{ time: "9:00", task: "Check the morning dashboard", detail: "Did anything
{ time: "10:00", task: "Write SQL queries", detail: "Dig into the data. Fin
{ time: "11:30", task: "Meet with product team", detail: "They want to know
{ time: "14:00", task: "Build a dashboard", detail: "Translate your finding
{ time: "15:30", task: "Present to CEO", detail: "\"Our Berlin users spend
{ time: "17:00", task: "Improve a model", detail: "Refine the churn predict
].map((item, i) => (
<div key={i} style={{ display: "flex", gap: 12, padding: "14px", background
<div style={{ fontSize: 11, fontWeight: 800, color: accent, minWidth: 44,
<div>
<div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBo
<div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{item.
</div>
</div>
))}
</div>
</div>
{/* Tools */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(22
{TOOLS_DATA.map((tool, i) => (
<div key={i} onClick={() => setActiveTool(activeTool === i ? null : i)}
style={{ background: activeTool === i ? "#f8fafc" : "#fff", border: `1.5p
<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom
<span style={{ fontSize: 20 }}>{tool.icon}</span>
<div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{tool.
</div>
<div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, lineHeight
<div style={{ display: "inline-block", background: activeTool === i ? too
</div>
))}
</div>
</div>
{/* Salary */}
<div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 1
<span style={{ fontSize: 22, flexShrink: 0 }}> </span>
<div>
</div>
</div>
<div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>Jun
<button onClick={() => completeStep(0)}
style={{ width: "100%", padding: "14px", background: accent, border: "none", bo
Now let me write my first SQL query →
</button>
</div>
)}
{/* ═══ STEP 1: LIVE SQL ════════════════════════════════ */}
{step === 1 && (
<div>
<div style={{ marginBottom: 32 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
{/* DB schema */}
<div style={{ background: "#0f172a", borderRadius: 16, padding: "20px 24px", marg
<div style={{ fontSize: 11, fontWeight: 800, color: "#475569", letterSpacing: 1
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(28
{[
{ table: "users", cols: ["id", "name", "city", "age", "plan"], color: "#7dd
{ table: "orders", cols: ["id", "user_id", "product", "amount", "month", "s
].map((t, i) => (
<div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 1
<div style={{ fontFamily: "monospace", fontSize: 13, color: t.color, font
<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
{t.cols.map((col, j) => (
<div key={j} style={{ background: "rgba(255,255,255,0.08)", borderRad
))}
</div>
</div>
))}
</div>
</div>
}}>
{/* SQL lessons */}
<div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" {SQL_LESSONS.map((l, i) => (
<button key={i} onClick={() => { setSqlStep(i); setQueryResult(null); }}
style={{ padding: "6px 14px", borderRadius: 100, border: `1.5px solid ${sql
{i + 1}. {l.title}
</button>
))}
</div>
<div style={{ background: "#fff", border: `1.5px solid ${accent}20`, borderRadius
<div style={{ fontSize: 13, fontWeight: 800, color: accent, marginBottom: 4 }}>
<p style={{ fontSize: 14, color: "#475569", margin: "0 0 16px", lineHeight: 1.6
<div style={{ background: "#0f172a", borderRadius: 12, padding: "14px 18px", fo
{sqlLesson.query}
</div>
<div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16, fontStyle: "ita
<button onClick={() => runSQL(sqlLesson.run)}
style={{ padding: "11px 28px", background: accent, border: "none", borderRadi
▶ Run Query
</button>
</div>
13 }}>
{/* Results */}
{queryResult && (
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16
<div style={{ padding: "12px 20px", background: "#f8fafc", borderBottom: "1px
<div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b98
Query result — {queryResult.length} rows returned
</div>
<div style={{ overflowX: "auto" }}>
<table style={{ width: "100%", borderCollapse: "collapse", fontSize: <thead>
<tr style={{ background: "#f8fafc" }}>
{sqlLesson.columns.map(col => (
<th key={col} style={{ padding: "10px 16px", textAlign: "left", fon
))}
</tr>
</thead>
<tbody>
{queryResult.map((row, i) => (
<tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}
onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
onMouseLeave={e => e.currentTarget.style.background = "transparent"
{sqlLesson.columns.map(col => (
<td key={col} style={{ padding: "10px 16px", color: typeof {String(row[col] ?? "")}
</td>
row[co
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
style={{ padding: "11px 20px", background: "#fff", border: "1.5px solid #e8
)}
}}
{sqlStep < SQL_LESSONS.length - 1 ? (
<button onClick={() => { setSqlStep(s => s + 1); setQueryResult(null); style={{ flex: 1, padding: "11px", background: accent, border: "none", bord
Next query: {SQL_LESSONS[sqlStep + 1].title} →
</button>
) : (
<button onClick={() => completeStep(1)}
style={{ flex: 1, padding: "11px", background: accent, border: "none", bord
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
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
— just
{/* CEO message */}
<div style={{ background: "#0f172a", borderRadius: 20, padding: "24px 28px", marg
<div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
<div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(139,
<div>
<div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>CEO <div style={{ fontSize: 15, color: "#e2e8f0", lineHeight: 1.7, fontWeight:
"Hey — I need some answers before the board meeting tomorrow. Can you loo
<br/><br/>
1. Which city generates the most revenue?
<br/>
2. Which product has the most refunds?
<br/>
3. Is there any month where we're doing much better or worse?
<br/><br/>
Also — any other insights you spot in the data would be helpful. I </div>
</div>
</div>
</div>
trust
{/* DB reminder */}
<div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 1
<strong style={{ color: "#334155" }}>Your database:</strong> users (id, name, c
</div>
{/* Suggested questions */}
<div style={{ marginBottom: 16 }}>
<div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 10
<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
{[
"Which city has the highest total revenue?",
"Which product has the most refunds?",
"What is our best month for sales?",
"Do pro users order more than free users?",
"What is the average order value per product?",
].map((q, i) => (
<button key={i} onClick={() => setInsightQuestion(q)}
style={{ padding: "7px 14px", background: light, border: `1px solid ${acc
onMouseEnter={e => e.currentTarget.style.background = "#ede9fe"}
onMouseLeave={e => e.currentTarget.style.background = light}>
{q}
</button>
))}
</div>
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280p
<div>
<div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom:
<textarea value={insightQuestion} onChange={e => setInsightQuestion(e.target.
placeholder="Ask any business question about our users and orders..."
style={{ width: "100%", height: 120, background: "#fff", border: "1.5px sol
onFocus={e => e.target.style.borderColor = `${accent}80`}
onBlur={e => e.target.style.borderColor = "#e8e8f0"}/>
<button onClick={getInsight} disabled={!insightQuestion.trim() || insightLoad
style={{ marginTop: 10, width: "100%", padding: "12px", background: insight
{insightLoading ? "Analysing..." : "Find the SQL + Insight →"}
</button>
</div>
<div>
{insightLoading && (
<div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRad
<div style={{ display: "flex", gap: 6 }}>
{[0,1,2].map(j => <div key={j} style={{ width: 8, height: 8, borderRadi
</div>
<div style={{ fontSize: 13, color: "#64748b" }}>Thinking like an analyst.
</div>
)}
{insight && !insight.error && (
<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
<div style={{ background: "#0f172a", borderRadius: 12, padding: "16px", f
{insight.query}
</div>
<div style={{ background: light, border: `1px solid ${accent}20`, borderR
<div style={{ fontSize: 11, fontWeight: 800, color: accent, letterSpaci
<div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{insig
</div>
<div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderR
<div style={{ fontSize: 11, fontWeight: 800, color: "#16a34a", letterSp
<div style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>{insig
</div>
<div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderR
<div style={{ fontSize: 11, fontWeight: 800, color: "#d97706", letterSp
<div style={{ fontSize: 13, color: "#78350f", lineHeight: 1.6, fontStyl
</div>
</div>
)}
{insight?.error && (
<div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRad
Something went wrong. Try again!
</div>
)}
{!insightLoading && !insight && (
<div style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0", <div style={{ fontSize: 40 }}> </div>
<div style={{ fontSize: 13, textAlign: "center", lineHeight: 1.5 }}>Your
</div>
border
)}
</div>
</div>
{insight && !insight.error && (
<div style={{ marginTop: 24 }}>
<div style={{ background: light, border: `1px solid ${accent}20`, borderRadiu
<span style={{ fontSize: 22, flexShrink: 0 }}> </span>
<div>
<div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom:
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}
</div>
</div>
<button onClick={() => completeStep(2)}
style={{ width: "100%", padding: "14px", background: accent, border: Claim 75 XP — lesson complete
</button>
</div>
"none"
)}
#bbf7d
{completed.length === 3 && (
<div style={{ marginTop: 24, background: "#f0fdf4", border: "1.5px solid <div style={{ fontSize: 48, marginBottom: 12 }}> </div>
<div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom:
<div style={{ fontSize: 15, color: "#475569", marginBottom: 20 }}>You earned
<div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "
{["Real analyst stories", "The analyst toolkit", "SELECT + WHERE", "GROUP B
<div key={i} style={{ background: "#dcfce7", border: "1px solid #bbf7d0",
))}
</div>
</div>
)}
</div>
)}
</div>
<style>{`
@keyframes pop { from{opacity:0;transform:translateX(-50%) scale(.7)} to{opacity:1;tr
@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:sc
* { box-sizing: border-box; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: #e8e8f0; border-radius: 3px; }
table { font-variant-numeric: tabular-nums; }
`}</style>
</div>
</TranslateWrapper>
);
}
// removed duplicate accent (line 2127)
// removed duplicate light (line 2128)
const TOOLS = [
{
category: "Version Control",
color: "#f97316",
bg: "#fff7ed",
border: "rgba(249,115,22,0.25)",
desc: "Track every change in your code. Roll back to any point in time.",
tools: [
{ name: "Git", desc: "The standard. Every developer uses it.", used: "Everywhere" },
{ name: "GitHub", desc: "Store your code online. Collaborate with teams.", used: "90% o
]
},
{
},
{
},
{
},
{
},
{
category: "Containerisation",
color: "#0891b2",
bg: "#ecfeff",
border: "rgba(8,145,178,0.25)",
desc: "Package your app so it runs the same everywhere — your laptop, staging, production
tools: [
{ name: "Docker", desc: "Pack your app + all its dependencies into a box.", used: "Stan
{ name: "Kubernetes", desc: "Manage thousands of Docker containers at once.", used: "La
]
category: "CI/CD",
color: "#8b5cf6",
bg: "#f5f3ff",
border: "rgba(139,92,246,0.25)",
desc: "Automatically test and deploy your code every time you make a change.",
tools: [
{ name: "GitHub Actions", desc: "Automate testing & deployment from GitHub.", used: "Mo
{ name: "Jenkins", desc: "Older but powerful CI/CD automation tool.", used: "Enterprise
]
category: "Cloud",
color: "#f59e0b",
bg: "#fffbeb",
border: "rgba(245,158,11,0.25)",
desc: "Run your servers in the cloud instead of buying physical hardware.",
tools: [
{ name: "AWS", desc: "Amazon's cloud. The biggest, most used.", used: "#1 worldwide" },
{ name: "GCP / Azure", desc: "Google and Microsoft's clouds.", used: "Enterprise" },
]
category: "Monitoring",
color: "#10b981",
bg: "#f0fdf4",
border: "rgba(16,185,129,0.25)",
desc: "Know when something breaks — before your users tell you.",
tools: [
{ name: "Grafana", desc: "Beautiful dashboards for your server metrics.", used: "Standa
{ name: "Sentry", desc: "Catch errors in real-time.", used: "Every startup" },
]
category: "Infrastructure as Code",
color: "#ec4899",
bg: "#fdf2f8",
border: "rgba(236,72,153,0.25)",
desc: "Define your entire infrastructure in code files — reproducible, version-controlled
tools: [
{ name: "Terraform", desc: "Create cloud infrastructure with code.", used: "Industry st
{ name: "Ansible", desc: "Automate server configuration.", used: "Ops teams" },
]
},
];
const TERMINAL_COMMANDS = [
{ cmd: "ls", desc: "List files in current directory", output: "app.py requirements.txt Do
{ cmd: "pwd", desc: "Show current directory path", output: "/home/user/my-app", hint: "Wher
{ cmd: "cat README.md", desc: "Read a file", output: "# My App\nA simple web application.\n
{ cmd: "ps aux", desc: "Show running processes", output: "USER PID %CPU %MEM COMMAND\nr
{ cmd: "df -h", desc: "Check disk space", output: "Filesystem Size Used Avail Use%\n/de
{ cmd: "curl localhost:8000", desc: "Make an HTTP request", output: '{"status":"ok","messag
];
function DevOpsLesson1({ onBack }) {
const [step, setStep] = useState(0);
const [activeTool, setActiveTool] = useState(null);
const [terminalHistory, setTerminalHistory] = useState([
{ type: "system", text: "Welcome to Defy Terminal — your first Linux server " },
{ type: "system", text: "Try the commands on the right. Type them in or click to auto-fil
]);
const [termInput, setTermInput] = useState("");
const [dockerIdea, setDockerIdea] = useState("");
const [dockerfile, setDockerfile] = useState(null);
const [dockerLoading, setDockerLoading] = useState(false);
const [completed, setCompleted] = useState([]);
const [celebration, setCelebration] = useState(false);
const [beforeAfter, setBeforeAfter] = useState("before");
const runCommand = (cmd) => {
const found = TERMINAL_COMMANDS.find(c => c.cmd === cmd.trim());
const newHistory = [
...terminalHistory,
{ type: "input", text: cmd },
found
? { type: "output", text: found.output }
: { type: "error", text: `bash: ${cmd}: command not found\nTry one of the commands fr
];
setTerminalHistory(newHistory);
setTermInput("");
};
const generateDockerfile = async () => {
if (!dockerIdea.trim() || dockerLoading) return;
setDockerLoading(true);
setDockerfile(null);
try {
const res = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
model: "claude-sonnet-4-20250514",
max_tokens: 800,
system: `You are a friendly DevOps teacher for absolute beginners.
Create a simple Dockerfile for the app described. Return JSON only:
{
"app_name": "short name",
"base_image": "e.g. python:3.11-slim",
"dockerfile": "full Dockerfile content",
"explanation": [
{"line": "FROM python:3.11-slim", "meaning": "plain English explanation"},
{"line": "WORKDIR /app", "meaning": "explanation"}
],
"what_it_does": "one sentence what this container does"
}`,
messages: [{ role: "user", content: `Create a Dockerfile for: ${dockerIdea}` }]
})
});
const data = await res.json();
const raw = data.content?.map(b => b.text || "").join("") || "";
const clean = raw.replace(/```json|```/g, "").trim();
setDockerfile(JSON.parse(clean));
} catch {
setDockerfile({ error: true });
}
setDockerLoading(false);
};
const completeStep = (s) => {
if (!completed.includes(s)) {
setCompleted(p => [...p, s]);
setCelebration(true);
setTimeout(() => setCelebration(false), 2000);
}
if (s < 2) setTimeout(() => { setStep(s + 1); ; }, 400);
};
return (
<TranslateWrapper onBack={onBack}>
<div style={{ height: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans','D
{celebration && (
<div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
Step complete! Keep going →
</div>
)}
{/* Header */}
<header style={{ background: "#fff", borderBottom: "1px solid #e8e8f0", position: "stic
<div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 20px 8px", display: "fl
<button onClick={onBack} style={{background:"transparent",border:"1px solid #e8e8f0
<div style={{ width: 1, height: 18, background: "#e8e8f0", flexShrink: 0 }}/>
<div style={{ minWidth: 0 }}>
<div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowra
<div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Lesson 1 · 75 XP
</div>
<div style={{ marginLeft: "auto", background: light, border: `1px solid ${accent}20
{completed.length}/3 done
</div>
</div>
<div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 10px", display: "flex
{["1. What is DevOps?", "2. Your first terminal", "3. Your first Dockerfile"].map((
<button key={i} onClick={() => { setStep(i); ; }}
style={{ padding: "6px 14px", borderRadius: 100, border: `1.5px solid ${step ==
{completed.includes(i) ? "✓ " : ""}{label}
</button>
))}
</div>
<div style={{ height: 3, background: "#f1f5f9" }}>
<div style={{ height: "100%", width: `${(completed.length / 3) * 100}%`, background
</div>
</header>
<div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
{/* ═══ STEP 0: WHAT IS DEVOPS ══════════════════════════ */}
{step === 0 && (
<div>
<div style={{ marginBottom: 36 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
{/* Real disaster stories */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5
<div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
{[
{ company: "Knight Capital", icon: " { company: "GitLab", icon: " { company: "Amazon", icon: " { company: "Netflix", icon: " ", color: "#ef4444" },
", color: "#f59e0b" },
", color: "#10b981" },
", color: "#8b5cf6" },
].map((s, i) => (
<button key={i} onClick={() => setBeforeAfter(s.company)}
style={{ padding: "8px 16px", borderRadius: 100, border: `1.5px solid ${b
<span>{s.icon}</span> {s.company}
</button>
))}
</div>
{beforeAfter === "Knight Capital" && (
<div style={{ background: "#fff1f2", border: "1.5px solid #fecaca", borderRad
<div style={{ fontSize: 18, fontWeight: 900, color: "#dc2626", marginBottom
<p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: "0 0 2
<div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px" }}
<div style={{ fontSize: 12, fontWeight: 800, color: "#dc2626", marginBott
<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
{["Automated deployment would push to ALL servers simultaneously <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "
— no h
))}
</div>
</div>
</div>
)}
{beforeAfter === "GitLab" && (
<div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRad
<div style={{ fontSize: 18, fontWeight: 900, color: "#d97706", marginBottom
<p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: "0 0 2
<div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px" }}
<div style={{ fontSize: 12, fontWeight: 800, color: "#d97706", marginBott
<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
{["Environment separation — prod commands require extra confirmation",
<div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "
))}
</div>
</div>
</div>
)}
{beforeAfter === "Amazon" && (
<div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRad
<div style={{ fontSize: 18, fontWeight: 900, color: "#16a34a", marginBottom
<p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: "0 0 2
<div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px" }}
<div style={{ fontSize: 12, fontWeight: 800, color: "#16a34a", marginBott
<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
{["Microservices — small, independent deployable units", "CI/CD pipelin
<div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "
))}
</div>
</div>
</div>
)}
{beforeAfter === "Netflix" && (
<div style={{ background: light, border: `1.5px solid ${accent}30`, borderRad
<div style={{ fontSize: 18, fontWeight: 900, color: accent, marginBottom: 8
<p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: "0 0 2
<div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px" }}
<div style={{ fontSize: 12, fontWeight: 800, color: accent, marginBottom:
<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
{["Resilience by design — assume everything will fail, build for <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "
it", "
))}
</div>
</div>
</div>
)}
{!["Knight Capital","GitLab","Amazon","Netflix"].includes(beforeAfter) && (
<div style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRa
Click a company above to see their story
</div>
)}
</div>
{/* Before / After mindset */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(28
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
<div style={{ fontSize: 12, fontWeight: 800, color: "#ef4444", letterSpacin
{["Deploy once a month — massive, terrifying release", "\"It worked on my m
<div key={i} style={{ display: "flex", gap: 8, padding: "10px 14px", back
<span style={{ color: "#ef4444", fontWeight: 700, flexShrink: 0 }}>✗</s
</div>
))}
</div>
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
<div style={{ fontSize: 12, fontWeight: 800, color: "#10b981", letterSpacin
{["Deploy dozens of times a day — small changes, low risk", "Docker contain
<div key={i} style={{ display: "flex", gap: 8, padding: "10px 14px", back
<span style={{ color: "#10b981", fontWeight: 700, flexShrink: 0 }}>✓</s
</div>
))}
</div>
</div>
</div>
{/* Day in the life */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(28
{[
{ time: "9:00", task: "Check monitoring dashboards", detail: "Are all servi
{ time: "10:00", task: "Review failed CI/CD pipeline", detail: "Why did the
{ time: "11:30", task: "Write Terraform code", detail: "Spin up new servers
{ time: "14:00", task: "Help dev team with Docker", detail: "Their app won'
{ time: "15:30", task: "Deploy new version", detail: "Push button. Watch au
{ time: "17:00", task: "Write runbooks", detail: "Document how to fix commo
].map((item, i) => (
<div key={i} style={{ display: "flex", gap: 12, padding: "14px", background
<div style={{ fontSize: 11, fontWeight: 800, color: accent, minWidth: 44,
<div>
<div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBo
<div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{item.
</div>
</div>
))}
</div>
</div>
{/* Tools overview */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(22
{TOOLS.map((t, i) => (
<div key={i} onClick={() => setActiveTool(activeTool === i ? null : i)}
style={{ background: activeTool === i ? t.bg : "#f8fafc", border: `1.5px
onMouseEnter={e => { if (activeTool !== i) e.currentTarget.style.borderCo
onMouseLeave={e => { if (activeTool !== i) e.currentTarget.style.borderCo
<div style={{ fontSize: 13, fontWeight: 800, color: activeTool === i ? t.
<div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>{t.tools
</div>
))}
</div>
{activeTool !== null && (
<div style={{ background: TOOLS[activeTool].bg, border: `1.5px solid ${TOOLS[
<div style={{ fontSize: 14, fontWeight: 700, color: TOOLS[activeTool].color
<p style={{ fontSize: 14, color: "#475569", margin: "0 0 16px", lineHeight:
<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
{TOOLS[activeTool].tools.map((tool, j) => (
<div key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start
<div style={{ flex: 1 }}>
<div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marg
<div style={{ fontSize: 13, color: "#64748b" }}>{tool.desc}</div>
</div>
<div style={{ background: TOOLS[activeTool].bg, border: `1px solid ${
</div>
))}
</div>
</div>
)}
</div>
{/* Salary */}
<div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 1
<span style={{ fontSize: 22, flexShrink: 0 }}> </span>
<div>
</div>
</div>
<div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>Whe
<button onClick={() => completeStep(0)}
style={{ width: "100%", padding: "14px", background: accent, border: "none", bo
Now let me try a real terminal →
</button>
</div>
)}
{/* ═══ STEP 1: TERMINAL ════════════════════════════════ */}
{step === 1 && (
<div>
<div style={{ marginBottom: 32 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
<div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
{/* Terminal */}
<div style={{ display: "flex", flexDirection: "column" }}>
{/* Window chrome */}
<div style={{ background: "#1e293b", borderRadius: "14px 14px 0 0", padding:
<div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4
<div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59
<div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b
<div style={{ fontSize: 11, color: "#64748b", marginLeft: 8, fontFamily: "m
</div>
{/* Terminal body */}
<div style={{ background: "#0f172a", flex: 1, padding: "16px", fontFamily: "'
{terminalHistory.map((item, i) => (
<div key={i} style={{ marginBottom: 4 }}>
{item.type === "system" && <div style={{ color: "#475569", fontStyle: "
{item.type === "input" && <div style={{ color: "#86efac" }}>$ {item.tex
{item.type === "output" && <div style={{ color: "#e2e8f0", whiteSpace:
{item.type === "error" && <div style={{ color: "#f87171", whiteSpace: "
</div>
))}
{/* Input line */}
<div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }
<span style={{ color: "#86efac" }}>$</span>
<input value={termInput} onChange={e => setTermInput(e.target.value)}
onKeyDown={e => { if (e.key === "Enter" && termInput.trim()) runCommand
placeholder="type a command..."
style={{ flex: 1, background: "transparent", border: "none", color: "#e
autoFocus/>
</div>
</div>
<div style={{ background: "#1e293b", borderRadius: "0 0 14px 14px", padding:
Press Enter to run · Click any command on the right to auto-fill
</div>
</div>
{/* Commands reference */}
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
<div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom:
{TERMINAL_COMMANDS.map((c, i) => (
<div key={i} onClick={() => { setTermInput(c.cmd); }}
style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 1
onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}50`; e
onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e8f0"; e.cur
<div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, col
<div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{c.desc}
<div style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}> {
</div>
))}
</div>
</div>
<div style={{ marginTop: 24, background: "#fffbeb", border: "1px solid #fde68a",
<p style={{ fontSize: 13, color: "#78350f", margin: 0, lineHeight: 1.6 }}>
<strong>Real talk:</strong> These same commands run on every Linux server in
</p>
</div>
<button onClick={() => completeStep(1)}
style={{ width: "100%", padding: "14px", background: accent, border: "none", bo
Now let's containerise something →
</button>
</div>
)}
{/* ═══ STEP 2: DOCKERFILE ══════════════════════════════ */}
{step === 2 && (
<div>
<div style={{ marginBottom: 32 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
{/* What is Docker */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5
{/* The problem */}
<div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius:
<div style={{ fontSize: 13, fontWeight: 800, color: "#dc2626", marginBottom:
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{[
"Developer builds app on Mac with Python 3.9, specific library versions,
"Sends code to colleague — \"it doesn't work\" — colleague has Python 3.7
"Deploy to staging server — breaks again — server has Ubuntu, developer h
"Deploy to production — breaks again — production has different environme
"3 days of debugging environment issues instead of building features",
].map((item, i) => (
<div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "#47
<span style={{ color: "#ef4444", fontWeight: 700, flexShrink: 0, </div>
))}
margin
</div>
</div>
{/* The solution */}
<div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius:
<div style={{ fontSize: 13, fontWeight: 800, color: "#16a34a", marginBottom:
<p style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, margin: "0 0 12p
Think of a shipping container. Before shipping containers, loading cargo wa
</p>
</p>
</div>
<p style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, margin: 0 Docker does the same for software. You pack your app + Python + all librari
}}>
{/* What's inside a container */}
<div style={{ background: "#0f172a", borderRadius: 16, padding: "20px 24px", ma
<div style={{ fontSize: 12, fontWeight: 800, color: "#475569", letterSpacing:
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(
{[
{ item: "Your app code", icon: " ", desc: "app.py, index.js — whatever y
{ item: "Runtime", icon: " ", desc: "Python 3.11, Node.js 18 — exact ver
{ item: "Dependencies", icon: " ", desc: "All libraries, exact versions,
{ item: "Environment config", icon: " ", desc: "Environment variables, p
{ item: "OS layer", icon: " ", desc: "Minimal Linux — just enough to run
{ item: "Start command", icon: " ", desc: "Exactly how to start your app
].map((item, i) => (
<div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", bac
<span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
<div>
<div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{ite
<div style={{ fontSize: 11, color: "#64748b" }}>{item.desc}</div>
</div>
</div>
))}
</div>
</div>
{/* Key benefits */}
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(22
{[
{ icon: " ", title: "Packages everything", desc: "Your code + Python + all
{ icon: " ", title: "Runs the same everywhere", desc: "Laptop, server, clo
{ icon: " ", title: "Starts in seconds", desc: "Containers start instantly
].map((item, i) => (
<div key={i} style={{ background: "#f8fafc", borderRadius: 14, padding: "18
<div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
<div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBott
<div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{item.de
</div>
))}
</div>
</div>
{/* Dockerfile anatomy */}
<div style={{ background: "#0f172a", borderRadius: 20, padding: "24px 28px", marg
<div style={{ fontSize: 13, fontWeight: 800, color: "#94a3b8", letterSpacing: 1
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{[
{ code: "FROM python:3.11-slim", color: "#f9a8d4", meaning: "Start from an
{ code: "WORKDIR /app", color: "#7dd3fc", meaning: "Create a folder called
{ code: "COPY requirements.txt .", color: "#86efac", meaning: "Copy the lis
{ code: "RUN pip install -r requirements.txt", color: "#fcd34d", meaning: "
{ code: "COPY . .", color: "#86efac", meaning: "Copy all your app code into
{ code: "CMD [\"python\", \"app.py\"]", color: "#a78bfa", meaning: "When th
].map((line, i) => (
<div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fi
<div style={{ fontFamily: "monospace", fontSize: 12, color: line.color, p
<div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>→ {line.
</div>
))}
</div>
</div>
{/* Generate Dockerfile */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5
<div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
{["A Python Flask web app", "A Node.js REST API", "A React frontend app", "A
<button key={i} onClick={() => setDockerIdea(idea)}
style={{ padding: "6px 14px", background: light, border: `1px solid ${acc
{idea}
</button>
))}
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(28
<div>
<textarea value={dockerIdea} onChange={e => setDockerIdea(e.target.value)}
placeholder="e.g. A Python app that serves a REST API with FastAPI"
style={{ width: "100%", height: 100, background: "#f8fafc", border: "1.5p
onFocus={e => e.target.style.borderColor = `${accent}80`}
onBlur={e => e.target.style.borderColor = "#e8e8f0"}/>
<button onClick={generateDockerfile} disabled={!dockerIdea.trim() || docker
style={{ marginTop: 10, width: "100%", padding: "12px", background: docke
{dockerLoading ? "Generating Dockerfile..." : "Generate Dockerfile →"}
</button>
</div>
<div>
{dockerLoading && (
<div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderR
<div style={{ display: "flex", gap: 6 }}>
{[0,1,2].map(j => <div key={j} style={{ width: 8, height: 8, borderRa
</div>
<div style={{ fontSize: 13, color: "#64748b" }}>Writing your Dockerfile
</div>
)}
{dockerfile && !dockerfile.error && (
<div>
<div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borde
{dockerfile.what_it_does}
</div>
<div style={{ background: "#0f172a", borderRadius: 10, padding: "14px",
{dockerfile.dockerfile}
</div>
</div>
)}
{dockerfile?.error && (
<div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderR
Something went wrong. Try again!
</div>
)}
{!dockerLoading && !dockerfile && (
<div style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0", bord
<div style={{ fontSize: 36 }}> </div>
<div style={{ fontSize: 13 }}>Your Dockerfile appears here</div>
</div>
)}
</div>
</div>
{dockerfile && !dockerfile.error && dockerfile.explanation && (
<div style={{ marginTop: 16, background: "#f8fafc", border: "1px solid #e8e8f
<div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacin
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{dockerfile.explanation.map((item, i) => (
<div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(aut
<div style={{ background: "#0f172a", borderRadius: 8, padding: <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, "7px 1
paddin
</div>
))}
</div>
</div>
)}
</div>
{dockerfile && !dockerfile.error && (
<div>
<div style={{ background: light, border: `1px solid ${accent}20`, borderRadiu
<span style={{ fontSize: 22, flexShrink: 0 }}> </span>
<div>
<div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom:
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}
</div>
</div>
<button onClick={() => completeStep(2)}
style={{ width: "100%", padding: "14px", background: accent, border: Claim 75 XP — lesson complete
</button>
</div>
"none"
)}
#bbf7d
{completed.length === 3 && (
<div style={{ marginTop: 24, background: "#f0fdf4", border: "1.5px solid <div style={{ fontSize: 48, marginBottom: 12 }}> </div>
<div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom:
<div style={{ fontSize: 15, color: "#475569", marginBottom: 20 }}>You earned
<div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "
{["What DevOps is", "6 tool categories", "Linux terminal", "Docker concepts
<div key={i} style={{ background: "#dcfce7", border: "1px solid #bbf7d0",
))}
</div>
</div>
)}
</div>
)}
</div>
<style>{`
@keyframes pop { from{opacity:0;transform:translateX(-50%) scale(.7)} to{opacity:1;tr
@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:sc
* { box-sizing: border-box; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: #e8e8f0; border-radius: 3px; }
`}</style>
</div>
</TranslateWrapper>
);
}
// removed duplicate accent (line 2805)
// removed duplicate light (line 2806)
const WEB_EVOLUTION = [
{
era: "Web1",
years: "1991–2004",
color: "#64748b",
bg: "#f8fafc",
border: "#e2e8f0",
headline: "Read-only internet",
desc: "Static pages. You could only consume content, not create it. No accounts, no inter
examples: ["Static HTML pages", "Early Yahoo, AltaVista", "You read, someone else writes"
power: "A few website owners",
your_data: "N/A — no accounts existed",
},
{
era: "Web2",
years: "2004–now",
color: "#3b82f6",
bg: "#eff6ff",
border: "#bfdbfe",
headline: "Read-write internet",
desc: "Social media, apps, user-generated content. You can create and share. But there's
examples: ["Facebook, Instagram, YouTube", "Google, Amazon, Apple", "Your posts, photos,
power: "Big Tech companies",
your_data: "Owned by the platform. Monetised without your consent. Can be deleted anytime
},
{
era: "Web3",
years: "2015–future",
color: "#8b5cf6",
bg: "#f5f3ff",
border: "#ddd6fe",
headline: "Read-write-own internet",
desc: "Decentralised. You own your data, your identity, your digital assets. No single co
examples: ["Ethereum, Solana blockchains", "DeFi, NFTs, DAOs", "Your wallet = your power: "Distributed — no single owner",
your_data: "Owned by you. On the blockchain. No one can take it away.",
identi
},
];
const REAL_USE_CASES = [
{
category: "Finance without banks",
icon: " ",
color: "#10b981",
bg: "#f0fdf4",
border: "#bbf7d0",
headline: "Sending $1M internationally in 10 seconds for $0.50",
story: "Traditional wire transfer: 3–5 business days, $25–50 fee, requires bank account,
impact: "1.7 billion unbanked people worldwide can now access financial services"
},
{
category: "Art & Ownership",
icon: " ",
color: "#f59e0b",
bg: "#fffbeb",
border: "#fde68a",
headline: "Digital artist makes $69M from a JPEG",
story: "Beeple, a digital artist, spent 13 years making one piece of art per day. He sold
impact: "Artists can now earn royalties on secondary sales — something impossible with tr
},
{
category: "Organisations without bosses",
icon: " ",
color: "#8b5cf6",
bg: "#f5f3ff",
border: "#ddd6fe",
headline: "A $10B fund run by anonymous internet strangers",
story: "MakerDAO is a financial protocol managing over $10 billion in assets. It has no C
impact: "New organisational structure: companies run by code, owned by participants"
},
{
category: "Contracts without lawyers",
icon: " ",
color: "#ef4444",
bg: "#fff1f2",
border: "#fecaca",
headline: "A vending machine that can't lie, cheat, or be bribed",
story: "Vitalik Buterin, Ethereum's creator, described smart contracts with a vending mac
impact: "Eliminates middlemen (lawyers, banks, notaries) for any agreement that can be co
},
];
const FAKE_TRANSACTIONS = [
{ hash: "0x4a9f...3e2b", from: "0xd3CdA...91F3", to: "0x742E...Fc32", value: "0.5 ETH", tim
{ hash: "0x7b2c...8f4a", from: "0xA4B5...2C1D", to: "Uniswap V3", value: "1,200 USDC", time
{ hash: "0x1e3d...7c9b", from: "0x91A3...4F2E", to: "0x3B6D...8A1C", value: "0.01 ETH", tim
{ hash: "0x9f4e...2a7c", from: "0x5C2A...9D4B", to: "Aave Protocol", value: "5,000 USDC", t
{ hash: "0x2c8b...5e1f", from: "0x8E1F...3C7A", to: "0xF4D2...6B9E", value: "2.3 ETH", time
];
const FAKE_BLOCKS = [
{ number: "19847234", transactions: 187, miner: "0x95222...7534", reward: "0.063 ETH", time
{ number: "19847233", transactions: 203, miner: "0x4838...3823", reward: "0.071 ETH", time:
{ number: "19847232", transactions: 156, miner: "0x1f9090...aa72", reward: "0.058 ETH", tim
];
function Web3Lesson1({ onBack }) {
const [step, setStep] = useState(0);
const [activeEra, setActiveEra] = useState("Web3");
const [activeCase, setActiveCase] = useState(0);
const [activeBlock, setActiveBlock] = useState(null);
const [activeTx, setActiveTx] = useState(null);
const [contractIdea, setContractIdea] = useState("");
const [contract, setContract] = useState(null);
const [contractLoading, setContractLoading] = useState(false);
const [completed, setCompleted] = useState([]);
const [celebration, setCelebration] = useState(false);
const generateContract = async () => {
if (!contractIdea.trim() || contractLoading) return;
setContractLoading(true); setContract(null);
try {
const res = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
model: "claude-sonnet-4-20250514",
max_tokens: 900,
system: `You are a Web3 teacher for absolute beginners. Create a simple Solidity sm
Return JSON only:
{
"contract_name": "ContractName",
"what_it_does": "one sentence plain English",
"real_world_analogy": "what this replaces in the real world",
"code": "simple Solidity contract (15-25 lines)",
"explanation": [
{"line": "pragma solidity ^0.8.0;", "meaning": "plain English"},
{"line": "contract ...", "meaning": "plain English"}
],
"how_it_works": "2-3 sentences on how someone would use this contract"
}`,
messages: [{ role: "user", content: `Create a simple smart contract for: ${contract
})
});
const data = await res.json();
const raw = data.content?.map(b => b.text || "").join("") || "";
const clean = raw.replace(/```json|```/g, "").trim();
setContract(JSON.parse(clean));
} catch { setContract({ error: true }); }
setContractLoading(false);
};
const completeStep = (s) => {
if (!completed.includes(s)) {
setCompleted(p => [...p, s]);
setCelebration(true);
setTimeout(() => setCelebration(false), 2000);
}
if (s < 2) setTimeout(() => { setStep(s + 1); ; }, 400);
};
const era = WEB_EVOLUTION.find(e => e.era === activeEra);
const useCase = REAL_USE_CASES[activeCase];
return (
<TranslateWrapper onBack={onBack}>
<div style={{ height: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans','D
{celebration && (
<div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
Step complete! Keep going →
</div>
)}
{/* Header */}
<header style={{ background: "#fff", borderBottom: "1px solid #e8e8f0", position: "stic
<div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 20px 8px", display: "fl
<button onClick={onBack} style={{background:"transparent",border:"1px solid #e8e8f0
<div style={{ width: 1, height: 18, background: "#e8e8f0", flexShrink: 0 }}/>
<div style={{ minWidth: 0 }}>
<div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowra
<div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Lesson 1 · 75 XP
</div>
<div style={{ marginLeft: "auto", background: light, border: `1px solid ${accent}20
{completed.length}/3 done
</div>
</div>
<div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 10px", display: "flex
{["1. What is Web3?", "2. Live blockchain explorer", "3. Your first smart contract"
<button key={i} onClick={() => { setStep(i); ; }}
style={{ padding: "6px 14px", borderRadius: 100, border: `1.5px solid ${step ==
{completed.includes(i) ? "✓ " : ""}{label}
</button>
))}
</div>
<div style={{ height: 3, background: "#f1f5f9" }}>
<div style={{ height: "100%", width: `${(completed.length / 3) * 100}%`, background
</div>
</header>
<div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
{/* ═══ STEP 0: WHAT IS WEB3 ════════════════════════════ */}
{step === 0 && (
<div>
<div style={{ marginBottom: 36 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
{/* Web evolution */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(22
{WEB_EVOLUTION.map(w => (
<div key={w.era} onClick={() => setActiveEra(w.era)}
style={{ background: activeEra === w.era ? w.bg : "#f8fafc", border: `2px
<div style={{ fontSize: 22, fontWeight: 900, color: activeEra === w.era ?
<div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>{w.years
<div style={{ fontSize: 13, fontWeight: 700, color: activeEra === w.era ?
</div>
))}
</div>
{era && (
<div style={{ background: era.bg, border: `1.5px solid ${era.border}`, border
<div style={{ fontSize: 16, fontWeight: 800, color: era.color, marginBottom
<p style={{ fontSize: 14, color: "#334155", lineHeight: 1.75, margin: "0 0
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minma
<div style={{ background: "#fff", borderRadius: 12, padding: "14px" }}>
<div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSp
{era.examples.map((e, i) => <div key={i} style={{ fontSize: 12, color:
</div>
<div style={{ background: "#fff", borderRadius: 12, padding: "14px" }}>
<div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSp
<div style={{ fontSize: 13, fontWeight: 700, color: era.color }}>{era.p
</div>
<div style={{ background: "#fff", borderRadius: 12, padding: "14px" }}>
<div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSp
<div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{era.y
</div>
</div>
</div>
)}
</div>
{/* Real use cases */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5
<div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
{REAL_USE_CASES.map((c, i) => (
<button key={i} onClick={() => setActiveCase(i)}
style={{ padding: "8px 16px", borderRadius: 100, border: `1.5px solid ${a
<span>{c.icon}</span> {c.category}
</button>
))}
</div>
<div style={{ background: useCase.bg, border: `1.5px solid ${useCase.border}`,
<div style={{ fontSize: 11, fontWeight: 800, color: useCase.color, letterSpac
<div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", marginBottom:
<p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: "0 0 18p
<div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", dis
<span style={{ fontSize: 18, flexShrink: 0 }}> </span>
<div>
<div style={{ fontSize: 12, fontWeight: 800, color: useCase.color, <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{useCase
</div>
</div>
</div>
</div>
margin
{/* Day in the life */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(28
{[
{ time: "9:00", task: "Audit a smart contract", detail: "One bug can drain
{ time: "10:30", task: "Write Solidity code", detail: "Build the logic for
{ time: "13:00", task: "Deploy to testnet", detail: "Test everything on a f
{ time: "15:00", task: "Write tests", detail: "100% test coverage is the mi
{ time: "16:30", task: "Deploy to mainnet", detail: "Moment of truth. Code
{ time: "17:30", task: "Monitor transactions", detail: "Watch the contract
].map((item, i) => (
<div key={i} style={{ display: "flex", gap: 12, padding: "14px", background
<div style={{ fontSize: 11, fontWeight: 800, color: accent, minWidth: 44,
<div>
<div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBo
<div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{item.
</div>
</div>
))}
</div>
</div>
{/* Key concepts */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
{[
{ term: "Blockchain", color: "#8b5cf6", def: "A database where records are
{ term: "Smart Contract", color: "#3b82f6", def: "Code that lives on the bl
{ term: "Wallet", color: "#10b981", def: "Your identity on Web3. A pair of
{ term: "Gas", color: "#f59e0b", def: "The fee you pay to run code on Ether
{ term: "DeFi", color: "#ef4444", def: "Decentralised Finance. Financial se
].map((item, i) => (
<div key={i} style={{ display: "flex", gap: 14, padding: "16px", background
<div style={{ background: item.color, borderRadius: 10, padding: "4px 12p
<div style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>{item.d
</div>
))}
</div>
</div>
{/* Salary */}
<div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 1
<span style={{ fontSize: 22, flexShrink: 0 }}> </span>
<div>
<div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 </div>
</div>
}}>Sma
<button onClick={() => completeStep(0)}
style={{ width: "100%", padding: "14px", background: accent, border: "none", bo
Now let me see the blockchain live →
</button>
</div>
)}
{/* ═══ STEP 1: BLOCKCHAIN EXPLORER ════════════════════ */}
{step === 1 && (
<div>
<div style={{ marginBottom: 32 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
{/* What is a block explorer */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16,
<div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 8
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>Ethe
</div>
"rgba(
{/* Live blocks */}
<div style={{ background: "#0f172a", borderRadius: 20, padding: "24px 28px", marg
<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18
<div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981"
<div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Latest Block
<div style={{ fontSize: 11, color: "#475569", marginLeft: "auto" }}>New block
</div>
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{FAKE_BLOCKS.map((block, i) => (
<div key={i} onClick={() => setActiveBlock(activeBlock === i ? null : i)}
style={{ background: activeBlock === i ? "rgba(139,92,246,0.15)" : <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
<div style={{ width: 36, height: 36, borderRadius: 10, background: "rgb
<div style={{ flex: 1 }}>
<div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>Bloc
<div style={{ fontSize: 11, color: "#475569" }}>{block.time}</div>
</div>
<div style={{ fontSize: 12, color: "#94a3b8" }}>{block.transactions} tx
<div style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>{block
</div>
{activeBlock === i && (
<div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba
{[
{ label: "Block number", value: `#${block.number}` },
{ label: "Transactions", value: `${block.transactions} included` },
{ label: "Mined by", value: block.miner },
{ label: "Block reward", value: block.reward },
{ label: "What this means", value: "This block was added to the per
].map((item, j) => (
<div key={j} style={{ background: "rgba(255,255,255,0.05)", borderR
<div style={{ fontSize: 10, color: "#475569", fontWeight: 700, te
<div style={{ fontSize: 12, color: "#e2e8f0", fontFamily: item.la
</div>
))}
</div>
)}
</div>
))}
</div>
</div>
{/* Live transactions */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 6
<p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5
<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
<div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr 1fr 1fr", ga
<div>Hash</div><div>From</div><div>To</div><div>Value</div><div>Type</div>
</div>
{FAKE_TRANSACTIONS.map((tx, i) => (
<div key={i} onClick={() => setActiveTx(activeTx === i ? null : i)}
style={{ background: activeTx === i ? light : "#f8fafc", border: `1px sol
<div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr 1fr 1fr"
<div style={{ fontFamily: "monospace", fontSize: 12, color: accent, fon
<div style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b" }
<div style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b" }
<div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{tx.va
<div style={{ fontSize: 11, fontWeight: 700, color: accent, background:
</div>
{activeTx === i && (
<div style={{ padding: "14px 16px", borderTop: `1px solid ${accent}20`,
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill
{[
{ label: "Transaction hash", value: tx.hash + "...f4a9" },
{ label: "Time", value: tx.time },
{ label: "From wallet", value: tx.from + "...2b4c" },
{ label: "To address", value: tx.to + "...9d1e" },
{ label: "Value transferred", value: tx.value },
{ label: "Transaction type", value: tx.type },
{ label: "Why this is important", value: "This transaction ].map((item, j) => (
<div key={j} style={{ background: "#f8fafc", borderRadius: <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700,
<div style={{ fontSize: 12, color: "#334155", fontFamily: item.
</div>
is now
8, pad
))}
</div>
</div>
)}
</div>
))}
</div>
</div>
{/* Key insight */}
<div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 1
<span style={{ fontSize: 20, flexShrink: 0 }}> </span>
<div>
</div>
</div>
<div style={{ fontSize: 14, fontWeight: 700, color: "#78350f", marginBottom:
<p style={{ fontSize: 13, color: "#92400e", margin: 0, lineHeight: 1.6 }}>The
<button onClick={() => completeStep(1)}
style={{ width: "100%", padding: "14px", background: accent, border: "none", bo
Now let me write code for the blockchain →
</button>
</div>
)}
{/* ═══ STEP 2: SMART CONTRACT ══════════════════════════ */}
{step === 2 && (
<div>
<div style={{ marginBottom: 32 }}>
<div style={{ display: "inline-block", background: light, color: accent, <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, </div>
fontSi
"0 0 1
fontWe
{/* What makes smart contracts special */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 16
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(28
{[
{ title: "Regular code", items: ["Runs on a server someone controls", "Can
{ title: "Smart contract", items: ["Runs on thousands of computers", "Immut
].map((col, i) => (
<div key={i} style={{ background: col.bg, border: `1px solid ${col.border}`
<div style={{ fontSize: 13, fontWeight: 800, color: col.color, marginBott
{col.items.map((item, j) => (
<div key={j} style={{ display: "flex", gap: 8, marginBottom: 8, fontSiz
<span style={{ color: col.color, fontWeight: 700, flexShrink: 0 }}>{i
</div>
))}
</div>
))}
</div>
</div>
{/* Solidity basics */}
<div style={{ background: "#0f172a", borderRadius: 20, padding: "24px 28px", marg
<div style={{ fontSize: 13, fontWeight: 800, color: "#475569", letterSpacing: 1
<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
{[
{ code: "pragma solidity ^0.8.0;", color: "#f9a8d4", meaning: "Specify whic
{ code: "contract MyContract {", color: "#7dd3fc", meaning: "Define a new s
{ code: " mapping(address => uint) balances;", color: "#86efac", meaning:
{ code: " function deposit() public payable {", color: "#fcd34d", meaning:
{ code: " balances[msg.sender] += msg.value;", color: "#a78bfa", meaning
{ code: " emit Deposited(msg.sender, msg.value);", color: "#86efac", meani
].map((line, i) => (
<div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fi
<div style={{ fontFamily: "monospace", fontSize: 12, color: line.color, p
<div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>→ {line.
</div>
))}
</div>
</div>
{/* Generate contract */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20,
<div style={{ fontSize: "clamp(13px,3.5vw,15px)", fontWeight: 800, color: "#0f1
<p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5
<div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
{["A voting system", "A simple savings wallet", "A crowdfunding campaign", "A
<button key={i} onClick={() => setContractIdea(idea)}
style={{ padding: "6px 14px", background: light, border: `1px solid ${acc
onMouseEnter={e => e.currentTarget.style.background = "#ede9fe"}
onMouseLeave={e => e.currentTarget.style.background = light}>
{idea}
</button>
))}
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(28
<div>
<textarea value={contractIdea} onChange={e => setContractIdea(e.target.valu
placeholder="e.g. A contract where people can vote for their favourite op
style={{ width: "100%", height: 110, background: "#f8fafc", border: "1.5p
onFocus={e => e.target.style.borderColor = `${accent}80`}
onBlur={e => e.target.style.borderColor = "#e8e8f0"}/>
<button onClick={generateContract} disabled={!contractIdea.trim() || contra
style={{ marginTop: 10, width: "100%", padding: "12px", background: contr
{contractLoading ? "Writing Solidity..." : "Generate Smart Contract →"}
</button>
</div>
<div>
{contractLoading && (
<div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderR
<div style={{ display: "flex", gap: 6 }}>
{[0,1,2].map(j => <div key={j} style={{ width: 8, height: 8, borderRa
</div>
<div style={{ fontSize: 13, color: "#64748b" }}>Writing your Solidity c
</div>
)}
{contract && !contract.error && (
<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
<div style={{ background: light, border: `1px solid ${accent}20`, borde
<div style={{ fontSize: 12, fontWeight: 700, color: accent, marginBot
<div style={{ fontSize: 13, color: "#475569" }}>{contract.what_it_doe
<div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Replace
</div>
<div style={{ background: "#0f172a", borderRadius: 10, padding: "14px",
{contract.code}
</div>
</div>
)}
{contract?.error && (
<div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderR
Something went wrong. Try again!
</div>
)}
{!contractLoading && !contract && (
<div style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0", bord
<div style={{ fontSize: 36 }}> </div>
<div style={{ fontSize: 13, textAlign: "center" }}>Your smart contract
</div>
)}
</div>
</div>
{contract && !contract.error && contract.explanation && (
<div style={{ marginTop: 16, background: "#f8fafc", border: "1px solid #e8e8f
<div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacin
"7px 1
paddin
<div style={{ display: "flex", flexDirection: "column", gap: 8, marginBotto
{contract.explanation.map((item, i) => (
<div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(aut
<div style={{ background: "#0f172a", borderRadius: 8, padding: <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, </div>
))}
</div>
{contract.how_it_works && (
<div style={{ background: light, border: `1px solid ${accent}20`, borderR
<div style={{ fontSize: 11, fontWeight: 800, color: accent, marginBotto
<div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{contr
</div>
)}
</div>
)}
</div>
{contract && !contract.error && (
<div>
<div style={{ background: light, border: `1px solid ${accent}20`, borderRadiu
<span style={{ fontSize: 22, flexShrink: 0 }}> </span>
<div>
<div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom:
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}
</div>
</div>
<button onClick={() => completeStep(2)}
style={{ width: "100%", padding: "14px", background: accent, border: Claim 75 XP — lesson complete
</button>
</div>
"none"
)}
#bbf7d
{completed.length === 3 && (
<div style={{ marginTop: 24, background: "#f0fdf4", border: "1.5px solid <div style={{ fontSize: 48, marginBottom: 12 }}> </div>
<div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, marginBottom:
<div style={{ fontSize: 15, color: "#475569", marginBottom: 20 }}>You earned
<div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "
{["Web1 → Web2 → Web3", "Real use cases", "Blockchain explorer", "Transacti
<div key={i} style={{ background: "#dcfce7", border: "1px solid #bbf7d0",
))}
</div>
</div>
)}
</div>
)}
</div>
<style>{`
@keyframes pop { from{opacity:0;transform:translateX(-50%) scale(.7)} to{opacity:1;tr
@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:sc
* { box-sizing: border-box; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: #e8e8f0; border-radius: 3px; }
`}</style>
</div>
</TranslateWrapper>
);
}
// removed duplicate accent (line 3427)
// removed duplicate light (line 3428)
const STEPS = [
{
id: 0,
title: "Bad prompt vs Good prompt",
instruction: "See the difference between a vague prompt and a specific one. Click both bu
tip: "A bad prompt gets a generic answer. A good prompt gets exactly what you need.",
badPrompt: "Tell me about marketing",
goodPrompt: "You are a marketing expert. Write 3 Instagram post ideas for a coffee explanation: {
bad: ["No role given — AI doesn't know what perspective to take", "No audience defined
good: ["Role defined — 'You are a marketing expert'", "Audience specified — 'students a
shop t
}
},
{
id: 1,
title: "Write your first prompt",
instruction: "Now it's your turn. Write a prompt for any task you want — but make it spec
tip: "Think: Who is the AI? Who is it helping? What format do you want? What context matt
template: "You are a [ROLE].\n[YOUR TASK HERE]\nFormat: [HOW YOU WANT THE ANSWER]",
ideas: [
"Ask for a study plan for learning Python",
"Get 5 business name ideas for a bakery",
"Explain blockchain to a 10-year-old",
"Write a cold email to a potential client",
]
},
{
id: 2,
elemen
title: "The 4 elements of a great prompt",
instruction: "Review the framework, then write the best prompt you can using all 4 tip: "Professional prompt engineers use this framework every single day. It's not a trick
framework: [
{ letter: "R", word: "Role", desc: "Who is the AI playing?", example: '"You are a senio
{ letter: "T", word: "Task", desc: "What exactly do you need?", example: '"Review this
{ letter: "F", word: "Format", desc: "How should the answer look?", example: '"Give me
{ letter: "C", word: "Context", desc: "What background info matters?", example: '"The a
]
}
];
function AILesson({ onBack }) {
const [step, setStep] = useState(0);
const [prompt, setPrompt] = useState("");
const [response, setResponse] = useState("");
const [loading, setLoading] = useState(false);
const [badResponse, setBadResponse] = useState("");
const [goodResponse, setGoodResponse] = useState("");
const [loadingBad, setLoadingBad] = useState(false);
const [loadingGood, setLoadingGood] = useState(false);
const [completed, setCompleted] = useState([]);
const [showCelebration, setShowCelebration] = useState(false);
const [activeComparison, setActiveComparison] = useState(null);
const callAI = async (userPrompt) => {
const res = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
model: "claude-sonnet-4-20250514",
max_tokens: 400,
messages: [{ role: "user", content: userPrompt }]
})
});
const data = await res.json();
return data.content?.map(b => b.text || "").join("") || "Error. Please try again.";
};
const handleBadPrompt = async () => {
setLoadingBad(true); setBadResponse(""); setActiveComparison("bad");
try { setBadResponse(await callAI(STEPS[0].badPrompt)); }
catch { setBadResponse("Connection error."); }
setLoadingBad(false);
};
const handleGoodPrompt = async () => {
setLoadingGood(true); setGoodResponse(""); setActiveComparison("good");
try { setGoodResponse(await callAI(STEPS[0].goodPrompt)); }
catch { setGoodResponse("Connection error."); }
setLoadingGood(false);
};
const handleSend = async () => {
if (!prompt.trim() || loading) return;
setLoading(true); setResponse("");
try { setResponse(await callAI(prompt)); }
catch { setResponse("Connection error."); }
setLoading(false);
};
const handleComplete = () => {
if (!completed.includes(step)) {
setCompleted(p => [...p, step]);
setShowCelebration(true);
setTimeout(() => setShowCelebration(false), 2000);
}
if (step < STEPS.length - 1) {
setTimeout(() => { setStep(s => s + 1); setPrompt(""); setResponse(""); }, 400);
}
};
return (
<TranslateWrapper onBack={onBack}>
<div style={{ height: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans','D
{/* Celebration */}
{showCelebration && (
<div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
Great work! Next step →
</div>
)}
{/* Header */}
<header style={{ background: "#fff", borderBottom: "1px solid #e8e8f0", position: "stic
<div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", height: 56, display
<button onClick={onBack} style={{background:"transparent",border:"1px solid #e8e8f0
<div style={{ width: 1, height: 18, background: "#e8e8f0" }}/>
<div>
<div style={{ fontSize: 14, fontWeight: 700 }}>AI / ML — Your First Prompt</div>
<div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>AI/ML Engineer ·
</div>
<div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
{STEPS.map((s, i) => (
<button key={i} onClick={() => { setStep(i); setPrompt(""); setResponse(""); }}
style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${ste
{completed.includes(i) ? "✓" : i + 1}
</button>
))}
<span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginLeft: 4 }}>
</div>
</div>
<div style={{ height: 3, background: "#f1f5f9" }}>
<div style={{ height: "100%", width: `${(completed.length / STEPS.length) * 100}%`,
</div>
</header>
<div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
{/* ── STEP 0: Comparison ── */}
{step === 0 && (
<div>
<div style={{ marginBottom: 32 }}>
<div style={{ display: "inline-block", background: light, color: accent, fontSi
<h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, margin: "0 0 10p
<p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWe
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280p
{/* Bad */}
<div style={{ background: "#fff", border: "1.5px solid #fecaca", borderRadius:
<div style={{ padding: "16px 20px", background: "#fff1f2", borderBottom: "1px
<div style={{ width: 28, height: 28, borderRadius: 8, background: "#fee2e2"
<div>
<div style={{ fontSize: 13, fontWeight: 800, color: "#dc2626" }}>Bad Prom
<div style={{ fontSize: 11, color: "#ef4444", fontWeight: 500 }}>Vague, n
</div>
</div>
<div style={{ padding: "16px 20px" }}>
<div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRad
"{STEPS[0].badPrompt}"
</div>
{/* Why it's bad */}
<div style={{ marginBottom: 16 }}>
{STEPS[0].explanation.bad.map((item, i) => (
<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignIt
<span style={{ color: "#ef4444", fontWeight: 700, flexShrink: 0, marg
<span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{it
</div>
))}
</div>
<button onClick={handleBadPrompt} disabled={loadingBad} style={{ width: "10
{loadingBad ? "Asking AI..." : "Try this prompt →"}
</button>
{(loadingBad || badResponse) && (
<div style={{ marginTop: 14, padding: "14px", background: "#f8fafc", bord
{loadingBad ? (
<div style={{ display: "flex", gap: 5, alignItems: "center", color: "
{[0,1,2].map(j => <div key={j} style={{ width: 6, height: 6, <span style={{ marginLeft: 6, fontSize: 12 }}>AI is responding...</
</div>
) : badResponse}
</div>
border
)}
</div>
</div>
{/* Good */}
<div style={{ background: "#fff", border: "1.5px solid #bbf7d0", borderRadius:
<div style={{ padding: "16px 20px", background: "#f0fdf4", borderBottom: "1px
<div style={{ width: 28, height: 28, borderRadius: 8, background: "#dcfce7"
<div>
<div style={{ fontSize: 13, fontWeight: 800, color: "#16a34a" }}>Good Pro
<div style={{ fontSize: 11, color: "#22c55e", fontWeight: 500 }}>Specific
</div>
</div>
<div style={{ padding: "16px 20px" }}>
<div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRad
"{STEPS[0].goodPrompt}"
</div>
<div style={{ marginBottom: 16 }}>
{STEPS[0].explanation.good.map((item, i) => (
<div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignIt
<span style={{ color: "#10b981", fontWeight: 700, flexShrink: 0, marg
<span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>{it
</div>
))}
</div>
<button onClick={handleGoodPrompt} disabled={loadingGood} style={{ width: "
{loadingGood ? "Asking AI..." : "Try this prompt →"}
</button>
{(loadingGood || goodResponse) && (
<div style={{ marginTop: 14, padding: "14px", background: "#f0fdf4", bord
{loadingGood ? (
<div style={{ display: "flex", gap: 5, alignItems: "center", color: "
{[0,1,2].map(j => <div key={j} style={{ width: 6, height: 6, <span style={{ marginLeft: 6, fontSize: 12 }}>AI is responding...</
</div>
) : goodResponse}
border
</div>
)}
</div>
</div>
</div>
{(badResponse && goodResponse) && (
<div style={{ background: light, border: `1px solid ${accent}25`, borderRadius:
<span style={{ fontSize: 22, flexShrink: 0 }}> </span>
<div>
</div>
</div>
<div style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 4
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>T
)}
<button onClick={handleComplete} style={{ width: "100%", padding: "14px", backgro
I get it — let me write my own →
</button>
</div>
)}
{/* ── STEP 1: Write your own ── */}
{step === 1 && (
<div>
<div style={{ marginBottom: 28 }}>
<div style={{ display: "inline-block", background: light, color: accent, fontSi
<h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, margin: "0 0 10p
<p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWe
</div>
{/* Template */}
<div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16,
<div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 1
<div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius:
{STEPS[1].template}
</div>
<div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 10
<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
{STEPS[1].ideas.map((idea, i) => (
<button key={i} onClick={() => setPrompt(`You are a helpful expert.\n${idea
style={{ padding: "7px 14px", background: light, border: `1px solid ${acc
onMouseEnter={e => e.currentTarget.style.background = "#ede9fe"}
onMouseLeave={e => e.currentTarget.style.background = light}>
{idea}
</button>
))}
</div>
</div>
{/* Editor + Response */}
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280p
<div>
<div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom:
<textarea value={prompt} onChange={e => setPrompt(e.target.value)}
placeholder={"You are a [ROLE].\n[YOUR TASK]\nFormat: [HOW YOU WANT THE ANS
style={{ width: "100%", height: 200, background: "#0f172a", border: "1.5px
onFocus={e => e.target.style.borderColor = `${accent}80`}
onBlur={e => e.target.style.borderColor = "#1e293b"}/>
<button onClick={handleSend} disabled={!prompt.trim() || loading}
style={{ marginTop: 10, width: "100%", padding: "12px", background: prompt.
{loading ? "Asking AI..." : "Send to AI →"}
</button>
</div>
<div>
<div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom:
<div style={{ height: 200, background: "#fff", border: "1.5px solid #e8e8f0",
{loading ? (
<div style={{ display: "flex", gap: 6, alignItems: "center", color: "#94a
{[0,1,2].map(j => <div key={j} style={{ width: 8, height: 8, borderRadi
<span style={{ marginLeft: 8, fontSize: 13 }}>AI is thinking...</span>
</div>
) : response ? (
<div style={{ whiteSpace: "pre-wrap" }}>{response}</div>
) : (
<div style={{ textAlign: "center", color: "#cbd5e1", fontSize: 13 }}>
<div style={{ fontSize: 28, marginBottom: 8 }}> </div>
AI response will appear here
</div>
)}
</div>
</div>
</div>
{response && (
<button onClick={handleComplete} style={{ marginTop: 20, width: "100%", padding
Nice! Learn the RTFC framework →
</button>
)}
</div>
)}
{/* ── STEP 2: Framework ── */}
{step === 2 && (
<div>
<div style={{ marginBottom: 28 }}>
<div style={{ display: "inline-block", background: light, color: accent, fontSi
<h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, margin: "0 0 10p
<p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWe
</div>
{/* RTFC cards */}
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160p
{STEPS[2].framework.map((item, i) => (
<div key={i} style={{ background: "#fff", border: `1.5px solid ${accent}20`,
onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentT
onMouseLeave={e => { e.currentTarget.style.borderColor = `${accent}20`; e.c
<div style={{ width: 44, height: 44, borderRadius: 14, background: accent,
<div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom
<div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom
<div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRad
</div>
))}
</div>
{/* Final challenge */}
<div style={{ background: "#fff", border: `1.5px solid ${accent}30`, borderRadius
<div style={{ fontSize: 11, color: accent, fontWeight: 800, letterSpacing: 2, t
<p style={{ fontSize: 15, color: "#1e293b", lineHeight: 1.7, margin: "0 0 8px",
<p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>Choos
</div>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280p
<div>
<textarea value={prompt} onChange={e => setPrompt(e.target.value)}
placeholder={"You are a [ROLE]. (← Role)\n\n[YOUR TASK HERE] (← Task)\n\nCo
style={{ width: "100%", height: 220, background: "#0f172a", border: "1.5px
onFocus={e => e.target.style.borderColor = `${accent}80`}
onBlur={e => e.target.style.borderColor = "#1e293b"}/>
<button onClick={handleSend} disabled={!prompt.trim() || loading}
style={{ marginTop: 10, width: "100%", padding: "12px", background: prompt.
{loading ? "Asking AI..." : "Send →"}
</button>
</div>
<div>
<div style={{ height: 220, background: "#fff", border: "1.5px solid #e8e8f0",
{loading ? (
<div style={{ display: "flex", gap: 6, alignItems: "center", color: "#94a
{[0,1,2].map(j => <div key={j} style={{ width: 8, height: 8, borderRadi
<span style={{ marginLeft: 8 }}>AI is thinking...</span>
</div>
) : response ? (
<div style={{ whiteSpace: "pre-wrap" }}>{response}</div>
) : (
<div style={{ textAlign: "center", color: "#cbd5e1" }}>
<div style={{ fontSize: 28, marginBottom: 8 }}> </div>
<div style={{ fontSize: 13 }}>Your AI response</div>
</div>
)}
</div>
</div>
</div>
{response && (
<div style={{ marginTop: 20 }}>
<div style={{ background: light, border: `1px solid ${accent}20`, borderRadiu
<div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 6
<p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>T
</div>
<button onClick={handleComplete} style={{ width: "100%", padding: "14px", bac
Complete lesson — claim 50 XP
</button>
</div>
)}
</div>
)}
{/* Completed state */}
{completed.length === STEPS.length && step === STEPS.length - 1 && (
<div style={{ marginTop: 24, background: "#f0fdf4", border: "1.5px solid #bbf7d0",
<div style={{ fontSize: 48, marginBottom: 12 }}> </div>
<div style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}
<div style={{ fontSize: 15, color: "#475569", marginBottom: 20 }}>You earned 50 X
<div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap
{["Role-based prompting", "Specific formatting", "RTFC framework", "Live AI int
<div key={i} style={{ background: "#dcfce7", border: "1px solid #bbf7d0", bor
))}
</div>
</div>
)}
</div>
<style>{`
@keyframes pop { from { opacity: 0; transform: translateX(-50%) scale(.7); } to { opa
@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:sc
* { box-sizing: border-box; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-thumb { background: #e8e8f0; border-radius: 3px; }
`}</style>
</div>
</TranslateWrapper>
);
}
const TRACKS = [
{ id:"aiml", title:"AI / ML Engineer", tag:"Most Wanted", color:"#7c3aed", light:"#ede9fe",
curriculum: [
{ level:"Junior", duration:"4–6 months", lessons:[
{id:"a1",title:"What is AI & ML?",practice:"quiz"},
{id:"a2",title:"Why Python for AI",practice:"code"},
{id:"a3",title:"Variables & Data Types",practice:"code"},
{id:"a4",title:"Functions & Logic",practice:"code"},
{id:"a5",title:"Loops & Iteration",practice:"code"},
{id:"a6",title:"Lists, Dicts & Sets",practice:"code"},
{id:"a7",title:"Object-Oriented Python",practice:"code"},
{id:"a8",title:"File I/O & Exceptions",practice:"code"},
{id:"a9",title:"Linear Algebra Basics",practice:"visual"},
{id:"a10",title:"Statistics & Probability",practice:"quiz"},
{id:"a11",title:"Derivatives & Gradients",practice:"visual"},
{id:"a12",title:"Matrix Operations in Python",practice:"code"},
{id:"a13",title:"NumPy — Arrays & Operations",practice:"code"},
{id:"a14",title:"Pandas — DataFrames",practice:"code"},
{id:"a15",title:"Data Cleaning & Missing Values",practice:"code"},
{id:"a16",title:"Exploratory Data Analysis",practice:"build"},
{id:"a17",title:"Matplotlib & Seaborn Charts",practice:"build"},
{id:"a18",title:"Supervised vs Unsupervised",practice:"visual"},
{id:"a19",title:"Training, Validation & Test Sets",practice:"build"},
{id:"a20",title:"Overfitting & Underfitting",practice:"visual"},
{id:"a21",title:"Evaluation Metrics",practice:"code"},
{id:"a22",title:"Linear Regression from Scratch",practice:"build"},
{id:"a23",title:"Logistic Regression",practice:"build"},
{id:"a24",title:"Decision Trees",practice:"visual"},
{id:"a25",title:"Random Forest",practice:"build"},
{id:"a26",title:"Scikit-learn Pipeline",practice:"build"},
{id:"a27",title:"What is an API?",practice:"quiz"},
{id:"a28",title:"REST APIs & JSON",practice:"code"},
{id:"a29",title:"OpenAI API — First Call",practice:"build"},
{id:"a30",title:"Anthropic Claude API",practice:"build"},
{id:"a31",title:"Prompt Engineering Basics",practice:"ai"},
{id:"a32",title:"Advanced Prompting Techniques",practice:"ai"},
{id:"a33",title:"Git Basics",practice:"code"},
{id:"a34",title:"GitHub & Collaboration",practice:"build"},
{id:"a35",title:"Jupyter Notebooks",practice:"build"},
{id:"a36",title:"Project: AI Text Summariser",practice:"project"},
{id:"a37",title:"Project: AI Q&A Bot",practice:"project"},
{id:"a38",title:"Project: ML Price Predictor",practice:"project"},
{id:"a39",title:"Junior Interview Prep",practice:"ai"},
{id:"a40",title:"Junior Level Assessment",practice:"assessment"},
]},
{ level:"Mid-level", duration:"6–10 months", lessons:[
{id:"am1",title:"Neural Networks from Scratch",practice:"build"},
{id:"am2",title:"Backpropagation Deep Dive",practice:"visual"},
{id:"am3",title:"PyTorch Fundamentals",practice:"code"},
{id:"am4",title:"CNNs — Image Classification",practice:"build"},
{id:"am5",title:"RNNs & LSTMs",practice:"build"},
{id:"am6",title:"Attention Mechanism",practice:"visual"},
{id:"am7",title:"Transformers Architecture",practice:"visual"},
{id:"am8",title:"Transfer Learning",practice:"build"},
{id:"am9",title:"Text Preprocessing Pipeline",practice:"code"},
{id:"am10",title:"Tokenisation & Embeddings",practice:"visual"},
{id:"am11",title:"BERT & GPT Families",practice:"quiz"},
{id:"am12",title:"Fine-tuning LLMs",practice:"build"},
{id:"am13",title:"RAG — Retrieval Augmented Gen",practice:"build"},
{id:"am14",title:"Vector Databases",practice:"build"},
{id:"am15",title:"Langchain — Chains & Agents",practice:"build"},
{id:"am16",title:"Function Calling & Tools",practice:"build"},
{id:"am17",title:"Multi-modal Models",practice:"build"},
{id:"am18",title:"Experiment Tracking (MLflow)",practice:"build"},
{id:"am19",title:"Model Versioning & Registry",practice:"code"},
{id:"am20",title:"Data Pipelines & ETL",practice:"build"},
{id:"am21",title:"Model Monitoring in Production",practice:"build"},
{id:"am22",title:"A/B Testing ML Models",practice:"build"},
{id:"am23",title:"FastAPI for ML Serving",practice:"build"},
{id:"am24",title:"Docker for ML",practice:"build"},
{id:"am25",title:"Cloud ML — AWS/GCP Basics",practice:"build"},
{id:"am26",title:"Latency & Cost Optimisation",practice:"quiz"},
{id:"am27",title:"Reinforcement Learning Basics",practice:"visual"},
{id:"am28",title:"RLHF — How ChatGPT was trained",practice:"quiz"},
{id:"am29",title:"Project: Production RAG App",practice:"project"},
{id:"am30",title:"Project: AI Agent with Tools",practice:"project"},
{id:"am31",title:"System Design for AI",practice:"build"},
{id:"am32",title:"Mid-level Interview Prep",practice:"ai"},
{id:"am33",title:"Mid-level Assessment",practice:"assessment"},
]},
{ level:"Senior", duration:"8–12 months", lessons:[
{id:"as1",title:"AI System Architecture",practice:"build"},
{id:"as2",title:"Designing AI Products",practice:"build"},
{id:"as3",title:"Model Quantisation",practice:"code"},
{id:"as4",title:"Knowledge Distillation",practice:"code"},
{id:"as5",title:"Inference Optimisation",practice:"build"},
{id:"as6",title:"Distributed Training",practice:"quiz"},
{id:"as7",title:"AI Safety & Alignment",practice:"quiz"},
{id:"as8",title:"Responsible AI & Ethics",practice:"quiz"},
{id:"as9",title:"Technical Leadership",practice:"ai"},
{id:"as10",title:"Mentoring Junior Engineers",practice:"ai"},
{id:"as11",title:"AI ROI & Business Metrics",practice:"build"},
{id:"as12",title:"Research Paper Reading",practice:"quiz"},
{id:"as13",title:"Contributing to Open Source AI",practice:"build"},
{id:"as14",title:"Senior Assessment",practice:"assessment"},
]},
],
lessons:[
{id:"a1",title:"What is AI & ML?",level:"Junior",xp:50,theory:`**Artificial Intelligenc
{id:"a2",title:"Neural Networks",level:"Junior",xp:75,theory:`**A neural network** is a
{id:"a3",title:"Prompt Engineering",level:"Junior",xp:100,theory:`**Prompt engineering*
]
},
{ id:"frontend", title:"Frontend Developer", tag:"High Demand", color:"#0891b2", light:"#e0
curriculum: [
{ level:"Junior", duration:"5–7 months", lessons:[
{id:"f_j1", title:"How the Web Works — Browsers & Servers", practice:"quiz"},
{id:"f_j2", title:"HTML — Document Structure", practice:"build"},
{id:"f_j3", title:"Semantic HTML — Header, Nav, Main, Footer", practice:"code"},
{id:"f_j4", title:"HTML — Tables & Lists", practice:"build"},
{id:"f_j5", title:"HTML — Forms & Input Elements", practice:"build"},
{id:"f_j6", title:"HTML — Media: Images, Video, Audio", practice:"build"},
{id:"f_j7", title:"CSS — Selectors & Specificity", practice:"code"},
{id:"f_j8", title:"CSS — Box Model & Spacing", practice:"visual"},
{id:"f_j9", title:"CSS — Display & Positioning", practice:"build"},
{id:"f_j10",title:"CSS — Flexbox Layout", practice:"build"},
{id:"f_j11",title:"CSS — Grid Layout", practice:"build"},
{id:"f_j12",title:"CSS — Responsive Design & Media Queries", practice:"build"},
{id:"f_j13",title:"CSS — Variables & Custom Properties", practice:"build"},
{id:"f_j14",title:"CSS — Animations & Transitions", practice:"build"},
{id:"f_j15",title:"CSS — Pseudo-classes & Pseudo-elements", practice:"code"},
{id:"f_j16",title:"JavaScript — Variables, Types & Scope", practice:"code"},
{id:"f_j17",title:"JavaScript — Functions & Arrow Functions", practice:"code"},
{id:"f_j18",title:"JavaScript — Arrays & Array Methods", practice:"code"},
{id:"f_j19",title:"JavaScript — Objects & Destructuring", practice:"code"},
{id:"f_j20",title:"JavaScript — Loops & Iteration", practice:"code"},
{id:"f_j21",title:"JavaScript — DOM Manipulation", practice:"build"},
{id:"f_j22",title:"JavaScript — Events & Event Delegation", practice:"build"},
{id:"f_j23",title:"JavaScript — ES6+ Features", practice:"code"},
{id:"f_j24",title:"JavaScript — Promises & Async/Await", practice:"code"},
{id:"f_j25",title:"JavaScript — Fetch API & REST", practice:"build"},
{id:"f_j26",title:"JavaScript — Error Handling", practice:"code"},
{id:"f_j27",title:"JavaScript — Local Storage", practice:"build"},
{id:"f_j28",title:"JavaScript — Modules & Imports", practice:"code"},
{id:"f_j29",title:"Git — Commits & Branches", practice:"build"},
{id:"f_j30",title:"Git — Pull Requests & Code Review", practice:"build"},
{id:"f_j31",title:"React — Why React Exists", practice:"quiz"},
{id:"f_j32",title:"React — JSX & Components", practice:"build"},
{id:"f_j33",title:"React — Props & Data Flow", practice:"build"},
{id:"f_j34",title:"React — useState Hook", practice:"build"},
{id:"f_j35",title:"React — useEffect Hook", practice:"build"},
{id:"f_j36",title:"React — Lists & Keys", practice:"build"},
{id:"f_j37",title:"React — Conditional Rendering", practice:"build"},
{id:"f_j38",title:"React — Forms & Controlled Inputs", practice:"build"},
{id:"f_j39",title:"React — React Router", practice:"build"},
{id:"f_j40",title:"React — Fetching Data", practice:"build"},
{id:"f_j41",title:"Dev Tools & Debugging", practice:"build"},
{id:"f_j42",title:"npm & Package Management", practice:"build"},
{id:"f_j43",title:"Project: Personal Portfolio", practice:"project"},
{id:"f_j44",title:"Project: Weather App with API", practice:"project"},
{id:"f_j45",title:"Project: Task Manager in React", practice:"project"},
{id:"f_j46",title:"Junior Interview Prep — JS Questions", practice:"ai"},
{id:"f_j47",title:"Junior Assessment", practice:"assessment"},
]},
{ level:"Mid-level", duration:"7–10 months", lessons:[
{id:"f_m1", title:"TypeScript — Types & Interfaces", practice:"code"},
{id:"f_m2", title:"TypeScript — Generics", practice:"code"},
{id:"f_m3", title:"TypeScript — Enums & Utility Types", practice:"code"},
{id:"f_m4", title:"TypeScript with React", practice:"build"},
{id:"f_m5", title:"React — useRef & useCallback", practice:"build"},
{id:"f_m6", title:"React — useMemo & Performance", practice:"build"},
{id:"f_m7", title:"React — Custom Hooks", practice:"build"},
{id:"f_m8", title:"React — Context API", practice:"build"},
{id:"f_m9", title:"Redux Toolkit", practice:"build"},
{id:"f_m10",title:"Zustand & Modern State", practice:"build"},
{id:"f_m11",title:"React Query / TanStack", practice:"build"},
{id:"f_m12",title:"React — Error Boundaries", practice:"build"},
{id:"f_m13",title:"React — Lazy Loading & Suspense", practice:"build"},
{id:"f_m14",title:"Next.js — Pages & Routing", practice:"build"},
{id:"f_m15",title:"Next.js — SSR & SSG", practice:"build"},
{id:"f_m16",title:"Next.js — API Routes", practice:"build"},
{id:"f_m17",title:"Next.js — Server Components", practice:"build"},
{id:"f_m18",title:"Next.js — App Router", practice:"build"},
{id:"f_m19",title:"CSS Modules & Scoped Styles", practice:"build"},
{id:"f_m20",title:"Tailwind CSS", practice:"build"},
{id:"f_m21",title:"Styled Components & Emotion", practice:"build"},
{id:"f_m22",title:"Component Libraries — shadcn/ui", practice:"build"},
{id:"f_m23",title:"Animations — Framer Motion", practice:"build"},
{id:"f_m24",title:"Testing — Jest Basics", practice:"code"},
{id:"f_m25",title:"Testing — React Testing Library", practice:"build"},
{id:"f_m26",title:"Testing — End-to-End with Playwright", practice:"build"},
{id:"f_m27",title:"Web Accessibility — WCAG Standards", practice:"quiz"},
{id:"f_m28",title:"SEO — Meta Tags & Open Graph", practice:"build"},
{id:"f_m29",title:"GraphQL — Queries & Mutations", practice:"build"},
{id:"f_m30",title:"Apollo Client", practice:"build"},
{id:"f_m31",title:"WebSockets & Real-time UI", practice:"build"},
{id:"f_m32",title:"Web Security — XSS & CSRF", practice:"quiz"},
{id:"f_m33",title:"Auth — JWT in Frontend", practice:"build"},
{id:"f_m34",title:"Auth — OAuth & Social Login", practice:"build"},
{id:"f_m35",title:"Storybook — Component Docs", practice:"build"},
{id:"f_m36",title:"Monorepos — Turborepo", practice:"build"},
{id:"f_m37",title:"Project: E-commerce App", practice:"project"},
{id:"f_m38",title:"Project: Real-time Chat", practice:"project"},
{id:"f_m39",title:"Mid-level Interview Prep", practice:"ai"},
{id:"f_m40",title:"Mid-level Assessment", practice:"assessment"},
]},
{ level:"Senior", duration:"8–12 months", lessons:[
{id:"f_s1", title:"Frontend Architecture Patterns", practice:"build"},
{id:"f_s2", title:"Micro-frontends", practice:"quiz"},
{id:"f_s3", title:"Module Federation", practice:"build"},
{id:"f_s4", title:"Core Web Vitals — LCP, FID, CLS", practice:"build"},
{id:"f_s5", title:"Performance Profiling — Chrome DevTools", practice:"build"},
{id:"f_s6", title:"Bundle Analysis & Optimisation", practice:"build"},
{id:"f_s7", title:"Advanced TypeScript Patterns", practice:"code"},
{id:"f_s8", title:"Design System Architecture", practice:"build"},
{id:"f_s9", title:"Accessibility Audit & Remediation", practice:"build"},
{id:"f_s10",title:"Internationalisation (i18n)", practice:"build"},
{id:"f_s11",title:"PWA — Progressive Web Apps", practice:"build"},
{id:"f_s12",title:"Service Workers & Caching", practice:"build"},
{id:"f_s13",title:"CI/CD for Frontend", practice:"build"},
{id:"f_s14",title:"Error Tracking — Sentry", practice:"build"},
{id:"f_s15",title:"Feature Flags & A/B Testing", practice:"build"},
{id:"f_s16",title:"Technical RFC Writing", practice:"ai"},
{id:"f_s17",title:"Code Review Leadership", practice:"ai"},
{id:"f_s18",title:"Mentoring Junior Developers", practice:"ai"},
{id:"f_s19",title:"Frontend Security Audit", practice:"build"},
{id:"f_s20",title:"Senior Assessment", practice:"assessment"},
]},
],
lessons:[
{id:"f1",title:"HTML — Skeleton of the Web",level:"Junior",xp:50,theory:`**HTML** — the
{id:"f2",title:"CSS — Style & Beauty",level:"Junior",xp:75,theory:`**CSS** — controls h
]
},
{ id:"backend", title:"Backend Developer", tag:"High Demand", color:"#059669", light:"#d1fa
curriculum: [
{ level:"Junior", duration:"5–7 months", lessons:[
{id:"b_j1", title:"How the Internet Works — DNS, TCP, HTTP", practice:"quiz"},
{id:"b_j2", title:"HTTP Methods — GET, POST, PUT, DELETE", practice:"quiz"},
{id:"b_j3", title:"REST API Design Principles", practice:"quiz"},
{id:"b_j4", title:"Python — Variables, Types & Functions", practice:"code"},
{id:"b_j5", title:"Python — OOP & Classes", practice:"code"},
{id:"b_j6", title:"Python — Error Handling & Exceptions", practice:"code"},
{id:"b_j7", title:"Python — File I/O & JSON", practice:"code"},
{id:"b_j8", title:"Python — List Comprehensions & Lambdas", practice:"code"},
{id:"b_j9", title:"Python — Virtual Environments & pip", practice:"build"},
{id:"b_j10",title:"FastAPI — First Endpoint", practice:"build"},
{id:"b_j11",title:"FastAPI — Pydantic Models", practice:"build"},
{id:"b_j12",title:"FastAPI — Path & Query Parameters", practice:"code"},
{id:"b_j13",title:"FastAPI — Request Body & Validation", practice:"code"},
{id:"b_j14",title:"FastAPI — Response Models", practice:"build"},
{id:"b_j15",title:"FastAPI — Dependency Injection", practice:"build"},
{id:"b_j16",title:"FastAPI — Middleware", practice:"build"},
{id:"b_j17",title:"SQL — SELECT, WHERE, ORDER BY", practice:"code"},
{id:"b_j18",title:"SQL — JOINs", practice:"code"},
{id:"b_j19",title:"SQL — Aggregation & GROUP BY", practice:"code"},
{id:"b_j20",title:"SQL — Transactions", practice:"code"},
{id:"b_j21",title:"PostgreSQL Setup & psql", practice:"build"},
{id:"b_j22",title:"SQLAlchemy — ORM Basics", practice:"build"},
{id:"b_j23",title:"SQLAlchemy — Relationships", practice:"build"},
{id:"b_j24",title:"Alembic — Database Migrations", practice:"build"},
{id:"b_j25",title:"Authentication — Hashing Passwords", practice:"build"},
{id:"b_j26",title:"Authentication — JWT Tokens", practice:"build"},
{id:"b_j27",title:"Authentication — Refresh Tokens", practice:"build"},
{id:"b_j28",title:"Environment Variables & .env", practice:"code"},
{id:"b_j29",title:"API Error Handling & Status Codes", practice:"code"},
{id:"b_j30",title:"API Documentation — Swagger", practice:"build"},
{id:"b_j31",title:"CORS & Security Headers", practice:"build"},
{id:"b_j32",title:"Git — Branching & Pull Requests", practice:"build"},
{id:"b_j33",title:"Docker — Containerise Your API", practice:"build"},
{id:"b_j34",title:"Project: User Auth System", practice:"project"},
{id:"b_j35",title:"Project: Blog REST API", practice:"project"},
{id:"b_j36",title:"Project: File Upload Service", practice:"project"},
{id:"b_j37",title:"Junior Interview Prep", practice:"ai"},
{id:"b_j38",title:"Junior Assessment", practice:"assessment"},
]},
{ level:"Mid-level", duration:"7–10 months", lessons:[
{id:"b_m1", title:"Advanced SQL — Indexes & EXPLAIN", practice:"code"},
{id:"b_m2", title:"Advanced SQL — Window Functions", practice:"code"},
{id:"b_m3", title:"Advanced SQL — CTEs & Subqueries", practice:"code"},
{id:"b_m4", title:"Database Design & Normalisation", practice:"build"},
{id:"b_m5", title:"Database — N+1 Problem & Solutions", practice:"debug"},
{id:"b_m6", title:"Redis — Caching Strategy", practice:"build"},
{id:"b_m7", title:"Redis — Session Storage", practice:"build"},
{id:"b_m8", title:"Redis — Pub/Sub", practice:"build"},
{id:"b_m9", title:"Celery — Background Tasks", practice:"build"},
{id:"b_m10",title:"Celery — Scheduled Tasks", practice:"build"},
{id:"b_m11",title:"WebSockets — Real-time APIs", practice:"build"},
{id:"b_m12",title:"File Uploads — S3 & Presigned URLs", practice:"build"},
{id:"b_m13",title:"Email — SMTP & SendGrid", practice:"build"},
{id:"b_m14",title:"Push Notifications", practice:"build"},
{id:"b_m15",title:"Testing — pytest Basics", practice:"code"},
{id:"b_m16",title:"Testing — Fixtures & Mocking", practice:"code"},
{id:"b_m17",title:"Testing — Integration Tests", practice:"build"},
{id:"b_m18",title:"Testing — Coverage & CI", practice:"build"},
{id:"b_m19",title:"API Rate Limiting", practice:"build"},
{id:"b_m20",title:"API Versioning", practice:"build"},
{id:"b_m21",title:"API Security — OWASP Top 10", practice:"quiz"},
{id:"b_m22",title:"OAuth 2.0 & Social Login", practice:"build"},
{id:"b_m23",title:"Docker Compose — Multi-service", practice:"build"},
{id:"b_m24",title:"CI/CD — GitHub Actions", practice:"build"},
{id:"b_m25",title:"Message Queues — RabbitMQ", practice:"build"},
{id:"b_m26",title:"Message Queues — Kafka Basics", practice:"quiz"},
{id:"b_m27",title:"Microservices — Patterns & Trade-offs", practice:"quiz"},
{id:"b_m28",title:"Service Communication — gRPC", practice:"build"},
{id:"b_m29",title:"Logging — Structured Logs", practice:"build"},
{id:"b_m30",title:"Monitoring — Prometheus + Grafana", practice:"build"},
{id:"b_m31",title:"Search — Elasticsearch", practice:"build"},
{id:"b_m32",title:"GraphQL — Schema Design", practice:"build"},
{id:"b_m33",title:"GraphQL — Resolvers & DataLoader", practice:"build"},
{id:"b_m34",title:"Project: Production-grade API", practice:"project"},
{id:"b_m35",title:"Project: Real-time Notification System", practice:"project"},
{id:"b_m36",title:"Mid-level Interview Prep", practice:"ai"},
{id:"b_m37",title:"Mid-level Assessment", practice:"assessment"},
]},
{ level:"Senior", duration:"8–12 months", lessons:[
{id:"b_s1", title:"System Design — URL Shortener", practice:"build"},
{id:"b_s2", title:"System Design — Feed System", practice:"build"},
{id:"b_s3", title:"System Design — Chat App", practice:"build"},
{id:"b_s4", title:"Database — Sharding & Partitioning", practice:"quiz"},
{id:"b_s5", title:"Database — Read Replicas", practice:"build"},
{id:"b_s6", title:"Database — CQRS Pattern", practice:"build"},
{id:"b_s7", title:"High Availability & Fault Tolerance", practice:"build"},
{id:"b_s8", title:"Event-Driven Architecture", practice:"build"},
{id:"b_s9", title:"Event Sourcing", practice:"build"},
{id:"b_s10",title:"Distributed Transactions", practice:"quiz"},
{id:"b_s11",title:"API Gateway Patterns", practice:"build"},
{id:"b_s12",title:"Performance Profiling — cProfile", practice:"build"},
{id:"b_s13",title:"Load Testing — Locust", practice:"build"},
{id:"b_s14",title:"Security Audit — Penetration Testing Basics", practice:"build"},
{id:"b_s15",title:"Zero-downtime Deployments", practice:"build"},
{id:"b_s16",title:"Technical RFC Writing", practice:"ai"},
{id:"b_s17",title:"Code Review Leadership", practice:"ai"},
{id:"b_s18",title:"Technical Leadership & Mentoring", practice:"ai"},
{id:"b_s19",title:"Architecting for Scale", practice:"build"},
{id:"b_s20",title:"Senior Assessment", practice:"assessment"},
]},
],
lessons:[
{id:"b1",title:"How the Internet Works",level:"Junior",xp:50,theory:`**What happens whe
{id:"b2",title:"Python & FastAPI",level:"Junior",xp:75,theory:`**Python** — the #1 lang
]
},
{ id:"data", title:"Data Analyst", tag:"Growing Fast", color:"#d97706", light:"#fef3c7", ic
curriculum: [
{ level:"Junior", duration:"4–6 months", lessons:[
{id:"d_j1", title:"Thinking Like an Analyst", practice:"quiz"},
{id:"d_j2", title:"Business Metrics — Revenue, DAU, Churn", practice:"quiz"},
{id:"d_j3", title:"KPIs vs Vanity Metrics", practice:"quiz"},
{id:"d_j4", title:"SQL — SELECT, WHERE, ORDER BY", practice:"code"},
{id:"d_j5", title:"SQL — JOINs — INNER, LEFT, RIGHT", practice:"code"},
{id:"d_j6", title:"SQL — GROUP BY & Aggregation", practice:"code"},
{id:"d_j7", title:"SQL — HAVING & Filtering Groups", practice:"code"},
{id:"d_j8", title:"SQL — Subqueries", practice:"code"},
{id:"d_j9", title:"SQL — CTEs (WITH clause)", practice:"code"},
{id:"d_j10",title:"SQL — Window Functions", practice:"code"},
{id:"d_j11",title:"SQL — Date & Time Functions", practice:"code"},
{id:"d_j12",title:"SQL — String Functions", practice:"code"},
{id:"d_j13",title:"Python — Variables & Data Types", practice:"code"},
{id:"d_j14",title:"Python — Lists, Dicts & Loops", practice:"code"},
{id:"d_j15",title:"Pandas — Loading & Inspecting Data", practice:"code"},
{id:"d_j16",title:"Pandas — Filtering & Selecting", practice:"code"},
{id:"d_j17",title:"Pandas — GroupBy & Aggregation", practice:"code"},
{id:"d_j18",title:"Pandas — Merging DataFrames", practice:"code"},
{id:"d_j19",title:"Data Cleaning — Missing Values", practice:"build"},
{id:"d_j20",title:"Data Cleaning — Duplicates & Outliers", practice:"build"},
{id:"d_j21",title:"Data Cleaning — Type Conversion", practice:"build"},
{id:"d_j22",title:"Exploratory Data Analysis (EDA)", practice:"build"},
{id:"d_j23",title:"Statistics — Mean, Median, Mode", practice:"quiz"},
{id:"d_j24",title:"Statistics — Standard Deviation & Variance", practice:"quiz"},
{id:"d_j25",title:"Statistics — Distributions", practice:"visual"},
{id:"d_j26",title:"Charts — Bar, Line, Scatter, Histogram", practice:"build"},
{id:"d_j27",title:"Matplotlib — Customising Charts", practice:"build"},
{id:"d_j28",title:"Seaborn — Statistical Plots", practice:"build"},
{id:"d_j29",title:"Plotly — Interactive Charts", practice:"build"},
{id:"d_j30",title:"Excel — PivotTables & VLOOKUP", practice:"build"},
{id:"d_j31",title:"Google Sheets for Analysts", practice:"build"},
{id:"d_j32",title:"Tableau — First Dashboard", practice:"build"},
{id:"d_j33",title:"Telling a Story with Data", practice:"ai"},
{id:"d_j34",title:"Project: Sales Performance Dashboard", practice:"project"},
{id:"d_j35",title:"Project: Customer Behaviour Analysis", practice:"project"},
{id:"d_j36",title:"Junior Interview Prep", practice:"ai"},
{id:"d_j37",title:"Junior Assessment", practice:"assessment"},
]},
{ level:"Mid-level", duration:"6–9 months", lessons:[
{id:"d_m1", title:"A/B Testing — Hypothesis Formation", practice:"build"},
{id:"d_m2", title:"A/B Testing — Sample Size & Power", practice:"quiz"},
{id:"d_m3", title:"Statistical Significance & p-values", practice:"quiz"},
{id:"d_m4", title:"Confidence Intervals", practice:"quiz"},
{id:"d_m5", title:"Cohort Analysis", practice:"build"},
{id:"d_m6", title:"Funnel Analysis", practice:"build"},
{id:"d_m7", title:"Retention & Churn Analysis", practice:"build"},
{id:"d_m8", title:"LTV & Unit Economics", practice:"build"},
{id:"d_m9", title:"RFM Segmentation", practice:"build"},
{id:"d_m10",title:"Attribution Modelling", practice:"build"},
{id:"d_m11",title:"Predictive Analytics — Regression", practice:"build"},
{id:"d_m12",title:"Predictive Analytics — Classification", practice:"build"},
{id:"d_m13",title:"Clustering — Customer Segmentation", practice:"build"},
{id:"d_m14",title:"Time Series Analysis", practice:"build"},
{id:"d_m15",title:"ETL Pipelines — Basics", practice:"build"},
{id:"d_m16",title:"BigQuery — Cloud Data Warehouse", practice:"build"},
{id:"d_m17",title:"Snowflake & Redshift Overview", practice:"quiz"},
{id:"d_m18",title:"dbt — Data Modelling", practice:"build"},
{id:"d_m19",title:"dbt — Tests & Documentation", practice:"build"},
{id:"d_m20",title:"Airflow — Workflow Orchestration", practice:"build"},
{id:"d_m21",title:"Advanced Tableau — Calculated Fields", practice:"build"},
{id:"d_m22",title:"Power BI — DAX Basics", practice:"build"},
{id:"d_m23",title:"Looker & Metabase", practice:"build"},
{id:"d_m24",title:"Communicating Insights to Stakeholders", practice:"ai"},
{id:"d_m25",title:"Writing Analytical Reports", practice:"ai"},
{id:"d_m26",title:"Project: Growth Metrics Dashboard", practice:"project"},
{id:"d_m27",title:"Project: A/B Test Analysis", practice:"project"},
{id:"d_m28",title:"Mid-level Interview Prep", practice:"ai"},
{id:"d_m29",title:"Mid-level Assessment", practice:"assessment"},
]},
{ level:"Senior", duration:"6–10 months", lessons:[
{id:"d_s1", title:"Data Strategy for Product Teams", practice:"build"},
{id:"d_s2", title:"North Star Metric Framework", practice:"build"},
{id:"d_s3", title:"Metrics Trees & OKRs", practice:"build"},
{id:"d_s4", title:"Data Governance & Quality", practice:"quiz"},
{id:"d_s5", title:"Privacy & Compliance — GDPR", practice:"quiz"},
{id:"d_s6", title:"Advanced A/B — Multi-variate Testing", practice:"build"},
{id:"d_s7", title:"Bayesian Statistics for Analysts", practice:"quiz"},
{id:"d_s8", title:"Causal Inference", practice:"quiz"},
{id:"d_s9", title:"ML in Production for Analysts", practice:"build"},
{id:"d_s10",title:"Building Self-serve Analytics", practice:"build"},
{id:"d_s11",title:"Data Team Leadership", practice:"ai"},
{id:"d_s12",title:"Executive Storytelling", practice:"ai"},
{id:"d_s13",title:"Influencing Product Decisions", practice:"ai"},
{id:"d_s14",title:"Senior Assessment", practice:"assessment"},
]},
],
lessons:[
{id:"d1",title:"Thinking Like an Analyst",level:"Junior",xp:50,theory:`**Data Analyst**
]
},
{ id:"devops", title:"DevOps / Cloud", tag:"Premium Salaries", color:"#dc2626", light:"#fee
curriculum: [
{ level:"Junior", duration:"5–7 months", lessons:[
{id:"o_j1", title:"What is DevOps & SRE?", practice:"quiz"},
{id:"o_j2", title:"DevOps Culture & Principles", practice:"quiz"},
{id:"o_j3", title:"Linux Command Line Basics", practice:"code"},
{id:"o_j4", title:"File System & Permissions", practice:"code"},
{id:"o_j5", title:"Users, Groups & sudo", practice:"code"},
{id:"o_j6", title:"Processes & systemd", practice:"code"},
{id:"o_j7", title:"Bash Scripting Basics", practice:"code"},
{id:"o_j8", title:"Bash — Variables & Loops", practice:"code"},
{id:"o_j9", title:"Cron Jobs & Scheduling", practice:"build"},
{id:"o_j10",title:"SSH & Remote Access", practice:"build"},
{id:"o_j11",title:"Vim — Editing in Terminal", practice:"code"},
{id:"o_j12",title:"Package Management — apt/yum", practice:"code"},
{id:"o_j13",title:"Networking Basics — OSI Model", practice:"quiz"},
{id:"o_j14",title:"TCP/IP & Subnets", practice:"quiz"},
{id:"o_j15",title:"DNS — How it Works", practice:"quiz"},
{id:"o_j16",title:"HTTP/HTTPS & TLS", practice:"quiz"},
{id:"o_j17",title:"Firewall & iptables", practice:"code"},
{id:"o_j18",title:"Nginx — Web Server Basics", practice:"build"},
{id:"o_j19",title:"Nginx — Reverse Proxy", practice:"build"},
{id:"o_j20",title:"SSL Certificates — Let's Encrypt", practice:"build"},
{id:"o_j21",title:"Git — Branching & Merging", practice:"build"},
{id:"o_j22",title:"Git — Workflows & Pull Requests", practice:"build"},
{id:"o_j23",title:"Docker — Containers vs VMs", practice:"quiz"},
{id:"o_j24",title:"Docker — Images & Containers", practice:"build"},
{id:"o_j25",title:"Dockerfile Best Practices", practice:"build"},
{id:"o_j26",title:"Docker Compose", practice:"build"},
{id:"o_j27",title:"Docker Networking", practice:"build"},
{id:"o_j28",title:"Container Registry", practice:"build"},
{id:"o_j29",title:"Cloud Basics — AWS Overview", practice:"quiz"},
{id:"o_j30",title:"AWS — EC2 & SSH", practice:"build"},
{id:"o_j31",title:"AWS — S3 & Storage", practice:"build"},
{id:"o_j32",title:"AWS — IAM & Permissions", practice:"build"},
{id:"o_j33",title:"AWS — VPC & Security Groups", practice:"build"},
{id:"o_j34",title:"GitHub Actions — First Pipeline", practice:"build"},
{id:"o_j35",title:"CI/CD Concepts & Best Practices", practice:"quiz"},
{id:"o_j36",title:"Monitoring Basics — What to Track", practice:"quiz"},
{id:"o_j37",title:"Project: Deploy a Web App", practice:"project"},
{id:"o_j38",title:"Project: Automated CI Pipeline", practice:"project"},
{id:"o_j39",title:"Junior Interview Prep", practice:"ai"},
{id:"o_j40",title:"Junior Assessment", practice:"assessment"},
]},
{ level:"Mid-level", duration:"7–10 months", lessons:[
{id:"o_m1", title:"Kubernetes Architecture", practice:"visual"},
{id:"o_m2", title:"K8s — Pods & ReplicaSets", practice:"build"},
{id:"o_m3", title:"K8s — Services & Ingress", practice:"build"},
{id:"o_m4", title:"K8s — ConfigMaps & Secrets", practice:"build"},
{id:"o_m5", title:"K8s — Persistent Volumes", practice:"build"},
{id:"o_m6", title:"K8s — RBAC & Security", practice:"build"},
{id:"o_m7", title:"K8s — Horizontal Pod Autoscaling", practice:"build"},
{id:"o_m8", title:"Helm — Package Manager", practice:"build"},
{id:"o_m9", title:"Helm — Writing Custom Charts", practice:"build"},
{id:"o_m10",title:"Terraform — IaC Basics", practice:"build"},
{id:"o_m11",title:"Terraform — Modules & State", practice:"build"},
{id:"o_m12",title:"Ansible — Configuration Mgmt", practice:"build"},
{id:"o_m13",title:"Ansible — Playbooks", practice:"build"},
{id:"o_m14",title:"GitOps — ArgoCD", practice:"build"},
{id:"o_m15",title:"GitOps — Flux", practice:"build"},
{id:"o_m16",title:"Prometheus — Metrics Collection", practice:"build"},
{id:"o_m17",title:"Grafana — Dashboards", practice:"build"},
{id:"o_m18",title:"Alertmanager — Alerts & PagerDuty", practice:"build"},
{id:"o_m19",title:"Logging — ELK Stack", practice:"build"},
{id:"o_m20",title:"Logging — Loki & Grafana", practice:"build"},
{id:"o_m21",title:"Distributed Tracing — Jaeger", practice:"build"},
{id:"o_m22",title:"Service Mesh — Istio Basics", practice:"build"},
{id:"o_m23",title:"Secrets Management — Vault", practice:"build"},
{id:"o_m24",title:"Security Scanning — Trivy", practice:"build"},
{id:"o_m25",title:"Advanced CI/CD — Canary Deploys", practice:"build"},
{id:"o_m26",title:"Blue-Green Deployments", practice:"build"},
{id:"o_m27",title:"Feature Flags", practice:"build"},
{id:"o_m28",title:"Database Operations — Backups", practice:"build"},
{id:"o_m29",title:"Performance Testing — k6", practice:"build"},
{id:"o_m30",title:"Cost Optimisation — AWS", practice:"build"},
{id:"o_m31",title:"Multi-cloud Basics", practice:"quiz"},
{id:"o_m32",title:"Disaster Recovery Planning", practice:"build"},
{id:"o_m33",title:"On-call Basics & SLOs/SLAs", practice:"quiz"},
{id:"o_m34",title:"Project: Full K8s Production Cluster", practice:"project"},
{id:"o_m35",title:"Project: Observability Stack", practice:"project"},
{id:"o_m36",title:"Mid-level Interview Prep", practice:"ai"},
{id:"o_m37",title:"Mid-level Assessment", practice:"assessment"},
]},
{ level:"Senior", duration:"8–12 months", lessons:[
{id:"o_s1", title:"Platform Engineering", practice:"build"},
{id:"o_s2", title:"Internal Developer Platform", practice:"build"},
{id:"o_s3", title:"SRE — Error Budgets", practice:"build"},
{id:"o_s4", title:"SRE — Toil Reduction", practice:"build"},
{id:"o_s5", title:"Incident Management & Postmortems", practice:"build"},
{id:"o_s6", title:"Chaos Engineering — Principles", practice:"build"},
{id:"o_s7", title:"Chaos Engineering — GameDays", practice:"build"},
{id:"o_s8", title:"Zero-trust Security Architecture", practice:"quiz"},
{id:"o_s9", title:"Compliance — SOC2 & ISO27001", practice:"quiz"},
{id:"o_s10",title:"FinOps — Cloud Cost Strategy", practice:"build"},
{id:"o_s11",title:"Capacity Planning", practice:"build"},
{id:"o_s12",title:"Multi-cloud Strategy", practice:"quiz"},
{id:"o_s13",title:"Infrastructure as Product", practice:"build"},
{id:"o_s14",title:"Runbooks & Documentation", practice:"build"},
{id:"o_s15",title:"On-call Culture & Rotation", practice:"ai"},
{id:"o_s16",title:"Staff Engineer Skills", practice:"ai"},
{id:"o_s17",title:"Technical Leadership", practice:"ai"},
{id:"o_s18",title:"Mentoring Junior DevOps", practice:"ai"},
{id:"o_s19",title:"Architecting for Reliability", practice:"build"},
{id:"o_s20",title:"Senior Assessment", practice:"assessment"},
]},
],
lessons:[
{id:"o1",title:"What is DevOps?",level:"Junior",xp:50,theory:`**DevOps** — culture unit
]
},
{ id:"web3", title:"Web3 / Blockchain", tag:"Highest Upside", color:"#7c3aed", light:"#ede9
curriculum: [
{ level:"Junior", duration:"5–7 months", lessons:[
{id:"w_j1", title:"How Blockchain Works — Blocks & Chains", practice:"visual"},
{id:"w_j2", title:"Consensus Mechanisms — PoW vs PoS", practice:"quiz"},
{id:"w_j3", title:"Bitcoin — How it Works", practice:"quiz"},
{id:"w_j4", title:"Ethereum — EVM & Accounts", practice:"quiz"},
{id:"w_j5", title:"Wallets — Public & Private Keys", practice:"build"},
{id:"w_j6", title:"Wallets — MetaMask Setup", practice:"build"},
{id:"w_j7", title:"Transactions — Sending & Signing", practice:"build"},
{id:"w_j8", title:"Gas — Fees & Estimation", practice:"quiz"},
{id:"w_j9", title:"Block Explorers — Etherscan", practice:"build"},
{id:"w_j10",title:"Solidity — Basics & Syntax", practice:"code"},
{id:"w_j11",title:"Solidity — Variables & Types", practice:"code"},
{id:"w_j12",title:"Solidity — Functions & Visibility", practice:"code"},
{id:"w_j13",title:"Solidity — Control Flow", practice:"code"},
{id:"w_j14",title:"Solidity — Arrays & Mappings", practice:"code"},
{id:"w_j15",title:"Solidity — Structs & Enums", practice:"code"},
{id:"w_j16",title:"Solidity — Events", practice:"code"},
{id:"w_j17",title:"Solidity — Modifiers", practice:"code"},
{id:"w_j18",title:"Solidity — Inheritance", practice:"code"},
{id:"w_j19",title:"Solidity — Interfaces & Abstract", practice:"code"},
{id:"w_j20",title:"Solidity — Error Handling", practice:"code"},
{id:"w_j21",title:"Hardhat — Dev Environment Setup", practice:"build"},
{id:"w_j22",title:"Hardhat — Compile & Deploy", practice:"build"},
{id:"w_j23",title:"Testing Contracts with Hardhat", practice:"code"},
{id:"w_j24",title:"Deploying to Testnet — Sepolia", practice:"build"},
{id:"w_j25",title:"Ethers.js — Connect to Contracts", practice:"build"},
{id:"w_j26",title:"MetaMask — dApp Integration", practice:"build"},
{id:"w_j27",title:"IPFS — Decentralised Storage", practice:"build"},
{id:"w_j28",title:"The Graph — Basic Queries", practice:"build"},
{id:"w_j29",title:"Web3.js vs Ethers.js", practice:"quiz"},
{id:"w_j30",title:"Project: ERC-20 Token", practice:"project"},
{id:"w_j31",title:"Project: Simple dApp — Voting", practice:"project"},
{id:"w_j32",title:"Junior Interview Prep", practice:"ai"},
{id:"w_j33",title:"Junior Assessment", practice:"assessment"},
]},
{ level:"Mid-level", duration:"7–10 months", lessons:[
{id:"w_m1", title:"ERC-20 Token Standard — Deep Dive", practice:"build"},
{id:"w_m2", title:"ERC-721 NFT Standard", practice:"build"},
{id:"w_m3", title:"ERC-1155 Multi-token Standard", practice:"build"},
{id:"w_m4", title:"ERC-2981 Royalty Standard", practice:"build"},
{id:"w_m5", title:"DeFi — How it Works", practice:"quiz"},
{id:"w_m6", title:"AMMs — Uniswap Mechanics", practice:"visual"},
{id:"w_m7", title:"Liquidity Pools & LP Tokens", practice:"visual"},
{id:"w_m8", title:"Lending Protocols — Aave, Compound", practice:"quiz"},
{id:"w_m9", title:"Yield Farming & Staking", practice:"quiz"},
{id:"w_m10",title:"Flash Loans", practice:"quiz"},
{id:"w_m11",title:"Oracles — Chainlink Price Feeds", practice:"build"},
{id:"w_m12",title:"Oracles — VRF Randomness", practice:"build"},
{id:"w_m13",title:"Smart Contract Security — Reentrancy", practice:"debug"},
{id:"w_m14",title:"Smart Contract Security — Integer Overflow", practice:"debug"},
{id:"w_m15",title:"Smart Contract Security — Access Control", practice:"debug"},
{id:"w_m16",title:"Smart Contract Security — Front-running", practice:"quiz"},
{id:"w_m17",title:"Slither — Static Analysis", practice:"build"},
{id:"w_m18",title:"Foundry — Advanced Testing", practice:"build"},
{id:"w_m19",title:"Upgradeable Contracts — Proxy Pattern", practice:"build"},
{id:"w_m20",title:"Upgradeable Contracts — Diamond Pattern", practice:"build"},
{id:"w_m21",title:"Subgraphs — The Graph Protocol", practice:"build"},
{id:"w_m22",title:"Layer 2 — Optimistic Rollups", practice:"quiz"},
{id:"w_m23",title:"Layer 2 — ZK Rollups", practice:"quiz"},
{id:"w_m24",title:"Deploying on L2 — Arbitrum", practice:"build"},
{id:"w_m25",title:"Deploying on L2 — Optimism / Base", practice:"build"},
{id:"w_m26",title:"DAO Governance — Snapshot", practice:"build"},
{id:"w_m27",title:"DAO Governance — OpenZeppelin Governor", practice:"build"},
{id:"w_m28",title:"Multisig — Gnosis Safe", practice:"build"},
{id:"w_m29",title:"Account Abstraction — ERC-4337", practice:"quiz"},
{id:"w_m30",title:"Project: DeFi Lending Protocol", practice:"project"},
{id:"w_m31",title:"Project: NFT Marketplace", practice:"project"},
{id:"w_m32",title:"Mid-level Interview Prep", practice:"ai"},
{id:"w_m33",title:"Mid-level Assessment", practice:"assessment"},
]},
{ level:"Senior", duration:"8–12 months", lessons:[
{id:"w_s1", title:"Protocol Design — Tokenomics", practice:"build"},
{id:"w_s2", title:"Protocol Design — Incentive Mechanisms", practice:"build"},
{id:"w_s3", title:"Gas Optimisation — Assembly & Yul", practice:"code"},
{id:"w_s4", title:"Gas Optimisation — Storage Patterns", practice:"code"},
{id:"w_s5", title:"Security Auditing — Methodology", practice:"build"},
{id:"w_s6", title:"Security Auditing — Report Writing", practice:"ai"},
{id:"w_s7", title:"Cross-chain Bridges — Architecture", practice:"quiz"},
{id:"w_s8", title:"Cross-chain Messaging — LayerZero", practice:"build"},
{id:"w_s9", title:"ZK Proofs — Circuits & Constraints", practice:"visual"},
{id:"w_s10",title:"ZK Proofs — Circom & SnarkJS", practice:"build"},
{id:"w_s11",title:"zkEVM Overview", practice:"quiz"},
{id:"w_s12",title:"MEV — Maximal Extractable Value", practice:"quiz"},
{id:"w_s13",title:"Formal Verification Basics", practice:"quiz"},
{id:"w_s14",title:"Contributing to Protocol Research", practice:"ai"},
{id:"w_s15",title:"Technical Leadership in Web3", practice:"ai"},
{id:"w_s16",title:"Senior Assessment", practice:"assessment"},
]},
],
lessons:[
{id:"w1",title:"How Blockchain Works",level:"Junior",xp:50,theory:`**Blockchain** — a d
]
},
];
const ACHIEVEMENTS=[
{id:"first_lesson",title:"First Step",desc:"Completed your first lesson",icon:" {id:"xp_500",title:"On Fire",desc:"500 XP earned",icon:" "},
{id:"xp_1000",title:"Four Figures",desc:"1,000 XP earned",icon:" "},
{id:"three_tracks",title:"Polymath",desc:"Explored 3 different tracks",icon:" "},
{id:"xp_2000",title:"Senior Mode",desc:"2,000 XP — senior level",icon:" "},
{id:"all_done",title:"Legend",desc:"Completed every lesson",icon:" "},
"},
];
const LEVELS=[
{name:"Beginner",min:0},{name:"Junior",min:200},{name:"Mid-level",min:600},
{name:"Senior",min:1200},{name:"Architect",min:2000},{name:"Legend",min:3000},
];
const getLevel=(xp)=>{let l=LEVELS[0];for(const lvl of LEVELS){if(xp>=lvl.min)l=lvl;}return l
const getNextLevel=(xp)=>{for(let i=0;i<LEVELS.length;i++){if(xp<LEVELS[i].min)return LEVELS[
const MENTOR=(lesson)=>`You are a Defy mentor. Evaluate the student's answer to this task.
LESSON: "${lesson.title}"
TASK: "${lesson.task}"
Reply strictly in this format:
**Strengths** — [2-3 specific good points]
**Improve** — [specific gaps]
**Pro insight** — [1 thing a senior would add]
**Score: X/10** — [one sentence why]
Max 150 words. Be direct and encouraging.`;
export default function Defy() {
const [screen,setScreen]=useState("home");
const [activeTrack,setActiveTrack]=useState(null);
const [activeLesson,setActiveLesson]=useState(null);
const [view,setView]=useState("theory");
const [answer,setAnswer]=useState("");
const [feedback,setFeedback]=useState("");
const [loading,setLoading]=useState(false);
const [chatOpen,setChatOpen]=useState(false);
const [chatMsgs,setChatMsgs]=useState([]);
const [chatInput,setChatInput]=useState("");
const [chatLoading,setChatLoading]=useState(false);
const [xp,setXp]=useState(0);
const [done,setDone]=useState([]);
const [achs,setAchs]=useState([]);
const [xpPop,setXpPop]=useState(null);
const [achPop,setAchPop]=useState(null);
const [tab,setTab]=useState("tracks");
const [darkMode,setDarkMode]=useState(false);
const [translateLang,setTranslateLang]=useState(null);
const [tooltip,setTooltip]=useState(null);
const [landingView,setLandingView]=useState(true);
const chatRef=useRef(null);
useEffect(()=>{chatRef.current?.scrollIntoView({behavior:"smooth"});},[chatMsgs]);
const handleWordHover=async(e)=>{
if(!translateLang)return;
const sel=window.getSelection();
if(sel&&sel.toString().trim().length>0){
const word=sel.toString().trim();
if(word.split(" ").length>6)return;
setTooltip({word,translation:"...",x:e.clientX,y:e.clientY});
try{
const res=await fetch("https://api.anthropic.com/v1/messages",{
method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:60,
messages:[{role:"user",content:`Translate "${word}" to ${translateLang}. Reply wi
});
const data=await res.json();
const tr=data.content?.map(b=>b.text||"").join("")||"?";
setTooltip(t=>t?{...t,translation:tr}:null);
}catch{setTooltip(null);}
}
};
const checkAchs=(newXp,newDone)=>{
[{id:"first_lesson",cond:newDone.length>=1},{id:"xp_500",cond:newXp>=500},{id:"xp_1000",c
.forEach(({id,cond})=>{
if(cond&&!achs.includes(id)){
setAchs(p=>[...p,id]);
setAchPop(ACHIEVEMENTS.find(a=>a.id===id));
setTimeout(()=>setAchPop(null),3000);
}
});
};
const submitAnswer=async()=>{
if(!answer.trim()||loading)return;
setLoading(true);setView("feedback");setFeedback("");
try{
const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"
const data=await res.json();
const text=data.content?.map(b=>b.text||"").join("")||"Error. Please try again.";
setFeedback(text);
if(!done.includes(activeLesson.id)){
const g=activeLesson.xp;const nx=xp+g;const nd=[...done,activeLesson.id];
setXp(nx);setDone(nd);setXpPop(`+${g} XP`);setTimeout(()=>setXpPop(null),2000);
checkAchs(nx,nd);
}
}catch{setFeedback("Connection error. Please try again.");}
setLoading(false);
};
const sendChat=async()=>{
if(!chatInput.trim()||chatLoading)return;
const msg={role:"user",content:chatInput};
const msgs=[...chatMsgs,msg];
setChatMsgs(msgs);setChatInput("");setChatLoading(true);
try{
const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"
const data=await res.json();
setChatMsgs(p=>[...p,{role:"assistant",content:data.content?.map(b=>b.text||"").join(""
}catch{setChatMsgs(p=>[...p,{role:"assistant",content:"Connection error."}]);}
setChatLoading(false);
};
const bold=(text)=>text.split(/(\*\*.*?\*\*)/g).map((p,i)=>
p.startsWith("**")&&p.endsWith("**")?<strong key={i} style={{color:"#7c3aed",fontWeight:7
);
const renderText=(text)=>text.split("\n").map((line,i)=>(
<div key={i} style={{marginBottom:line===""?10:0,lineHeight:1.8}}>{bold(line)}</div>
));
const currLevel=getLevel(xp);
const nextLevel=getNextLevel(xp);
const prog=nextLevel?((xp-currLevel.min)/(nextLevel.min-currLevel.min))*100:100;
const track=activeTrack?TRACKS.find(t=>t.id===activeTrack):null;
const Popups=()=>(
<>
{xpPop&&<div style={{position:"fixed",top:80,right:24,background:"#7c3aed",color:"#fff"
{achPop&&<div style={{position:"fixed",bottom:24,right:24,background:"#fff",border:"2px
<span style={{fontSize:30}}>{achPop.icon}</span>
<div><div style={{fontSize:10,color:"#7c3aed",fontWeight:800,letterSpacing:2,textTran
</div>}
</>
);
// ── HOME ──────────────────────────────────
if(screen==="home"){
const total=TRACKS.reduce((a,t)=>a+t.lessons.length,0);
const accent="#7c3aed";
const bg=darkMode?"#0f0a1e":"#fafafa";
const cardBg=darkMode?"#1a1035":"#fff";
const textPrimary=darkMode?"#f0f0ff":"#0f172a";
const textMuted=darkMode?"#6b6a8a":"#64748b";
const border=darkMode?"rgba(255,255,255,0.08)":"#e8e8f0";
const headerBg=darkMode?"rgba(15,10,30,0.95)":"rgba(255,255,255,0.95)";
return(
<div style={{minHeight:"100vh",overflowX:"hidden",background:bg,fontFamily:"'Plus Jakar
onMouseUp={handleWordHover}
onClick={()=>setTooltip(null)}>
{/* Translate tooltip */}
{tooltip&&(
<div style={{position:"fixed",left:tooltip.x+12,top:tooltip.y-40,background:"#0f172
<div style={{fontSize:10,color:"#7c3aed",fontWeight:800,letterSpacing:1,textTrans
<div>{tooltip.translation}</div>
</div>
)}
{/* ── HEADER ── */}
<header style={{background:headerBg,borderBottom:`1px solid ${border}`,position:"stic
<div style={{maxWidth:1100,margin:"0 auto",padding:"0 12px",height:60,display:"flex
<div style={{cursor:"pointer",display:"flex",alignItems:"center",gap:6,flexShrink
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAA
</div>
<nav style={{display:"flex",gap:2,flex:1}}>
{!landingView&&[["tracks","Tracks"],["progress","Progress"],["achievements","Ac
<button key={t} onClick={()=>setTab(t)} style={{padding:"7px 14px",borderRadi
))}
</nav>
<div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"auto"}}>
{/* Translate badge */}
{translateLang&&(
<div style={{display:"flex",alignItems:"center",gap:6,background:"#f3f0ff",bo
<span> </span> Select text to translate
<button onClick={()=>setTranslateLang(null)} style={{background:"none",bord
</div>
)}
{/* Lang picker */}
<div style={{position:"relative"}}>
<select value={translateLang||""} onChange={e=>setTranslateLang(e.target.valu
style={{padding:"6px 10px",borderRadius:10,border:`1px solid ${border}`,bac
<option value=""> Translate</option>
{LANGS.map(l=><option key={l.code} value={l.code}>{l.flag} {l.label}</optio
</select>
</div>
{/* Theme toggle */}
<button onClick={()=>setDarkMode(d=>!d)} style={{width:36,height:36,borderRadiu
{darkMode?" ":" "}
</button>
{/* XP pill */}
{!landingView&&(
<div style={{display:"flex",alignItems:"center",gap:8,background:darkMode?"rg
<div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradi
<div style={{fontSize:12,fontWeight:700,color:textPrimary}}>{currLevel.name
<div style={{fontSize:11,color:textMuted}}>{xp} XP</div>
</div>
)}
</div>
</div>
</header>
{/* ══════════════════════════════════════════ */}
{/* LANDING VIEW */}
{/* ══════════════════════════════════════════ */}
{landingView&&(
<div>
{/* ── HERO ── */}
<section style={{maxWidth:1100,margin:"0 auto",padding:"80px 24px 60px",textAlign
<div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#f3f0f
<span style={{width:6,height:6,borderRadius:"50%",background:accent,display:"
AI-powered IT Academy
<span style={{width:6,height:6,borderRadius:"50%",background:accent,display:"
</div>
<h1 style={{fontSize:"clamp(40px,6vw,72px)",fontWeight:900,lineHeight:1.05,lett
Stop watching tutorials.<br/>
<span style={{background:"linear-gradient(135deg,#7c3aed,#a78bfa)",WebkitBack
</h1>
<p style={{fontSize:"clamp(16px,2vw,20px)",color:textMuted,maxWidth:560,margin:
Every Defy lesson starts with a real task. You attempt it first — then your A
</p>
<div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marg
<button onClick={()=>setLandingView(false)} style={{padding:"16px 36px",backg
onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
onMouseLeave={e=>e.currentTarget.style.transform="none"}>
Start for free →
</button>
<button onClick={()=>setLandingView(false)} style={{padding:"16px 28px",backg
See the tracks
</button>
</div>
{/* Feature badges */}
<div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
{[
[" ","Hover any word to translate — built in"],
[" ","AI mentor on every answer"],
[" ","XP, levels, achievements"],
[" ","Free to start"],
].map(([icon,text],i)=>(
<div key={i} style={{background:cardBg,border:`1px solid ${border}`,borderR
{icon} {text}
</div>
))}
</div>
</section>
{/* ── PAIN SECTION ── */}
<section style={{background:darkMode?"#0a0618":"#f3f0ff",padding:"80px 24px"}}>
<div style={{maxWidth:960,margin:"0 auto"}}>
<div style={{textAlign:"center",marginBottom:56}}>
<h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:900,letterSpacing:-1
Sound familiar?
</h2>
<p style={{fontSize:18,color:textMuted,fontWeight:500}}>You're not alone. T
</div>
{[
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280p
{emoji:" {emoji:" {emoji:" {emoji:" {emoji:" {emoji:" ",pain:"\"I've watched 40 hours of videos and still can't build
",pain:"\"I quit every course by week 3. The theory is so borin
",pain:"\"I don't understand the English terms and keep Googlin
",pain:"\"I finished a bootcamp but still can't get a job.\"",f
",pain:"\"I don't have time for a 6-month course.\"",fix:"Learn
",pain:"\"Good courses cost $3,000. I can't afford that.\"",fix
].map((item,i)=>(
<div key={i} style={{background:cardBg,borderRadius:20,padding:"24px",bor
<div style={{fontSize:32,marginBottom:12}}>{item.emoji}</div>
<p style={{fontSize:14,color:textMuted,lineHeight:1.65,margin:"0 <div style={{height:1,background:border,marginBottom:16}}/>
<p style={{fontSize:14,color:accent,fontWeight:700,lineHeight:1.5,margi
</div>
0 16px
))}
</div>
</div>
</section>
{/* ── HOW IT WORKS ── */}
<section style={{maxWidth:960,margin:"0 auto",padding:"80px 24px"}}>
<div style={{textAlign:"center",marginBottom:56}}>
<h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:900,letterSpacing:-1.5
How Defy works
</h2>
<p style={{fontSize:18,color:textMuted,fontWeight:500}}>Three steps. Every le
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,
{[
{n:"01",title:"Real task first",desc:"You see the challenge before the theo
{n:"02",title:"You attempt it",desc:"Write your answer, build your thinking
{n:"03",title:"AI mentor responds",desc:"Personalised feedback on your spec
].map((step,i)=>(
<div key={i} style={{background:cardBg,borderRadius:20,padding:"32px 28px",
<div style={{fontSize:56,fontWeight:900,color:step.color,opacity:0.12,pos
<div style={{width:44,height:44,borderRadius:14,background:step.color,dis
<h3 style={{fontSize:20,fontWeight:800,color:textPrimary,margin:"0 0 12px
<p style={{fontSize:14,color:textMuted,lineHeight:1.65,margin:0}}>{step.d
</div>
))}
</div>
</section>
{/* ── TRANSLATE FEATURE HIGHLIGHT ── */}
<section style={{background:darkMode?"#0a0618":"#0f172a",padding:"80px 24px"}}>
<div style={{maxWidth:800,margin:"0 auto",textAlign:"center"}}>
<div style={{display:"inline-block",background:"rgba(124,58,237,0.2)",border:
Built-in feature
</div>
<h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:900,letterSpacing:-1.5
Never leave the lesson<br/>to look up a word.
</h2>
<p style={{fontSize:18,color:"rgba(255,255,255,0.5)",maxWidth:520,margin:"0 a
Select any word or phrase in a lesson — Defy instantly translates it to you
</p>
{/* Demo */}
<div style={{background:"#1a1035",borderRadius:20,padding:"28px",border:"1px
<div style={{fontSize:11,fontWeight:800,color:"rgba(124,58,237,0.8)",letter
<p style={{fontSize:16,color:"rgba(255,255,255,0.8)",lineHeight:1.8,margin:
A <span style={{background:"rgba(124,58,237,0.25)",borderRadius:6,padding
</p>
<div style={{marginTop:16,display:"inline-flex",gap:8,alignItems:"center",b
<span style={{fontSize:18}}> </span>
<span style={{fontSize:13,color:"#a78bfa",fontWeight:600}}>Select your la
</div>
</div>
<div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
{[{code:"Ukrainian",flag:" "},{code:"Russian",flag:" "},{code:"Spanish",f
<button key={l.code} onClick={()=>{setTranslateLang(l.code);setLandingVie
style={{padding:"10px 20px",background:"rgba(255,255,255,0.06)",border:
onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,0.2
onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.
{l.flag} {l.code}
</button>
))}
</div>
</div>
</section>
{/* ── AFTER DEFY ── */}
<section style={{maxWidth:960,margin:"0 auto",padding:"80px 24px"}}>
<div style={{textAlign:"center",marginBottom:56}}>
<h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:900,letterSpacing:-1.5
6 months from now
</h2>
<p style={{fontSize:18,color:textMuted,fontWeight:500}}>What changes when you
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,
{[
{before:"Watching a 10-hour Python course for the third time",after:"Built
{before:"Googling \"how to become a developer\" every month",after:"Writing
{before:"Scared to apply because you don't feel \"ready\"",after:"Applied t
{before:"Paying $59/month for Coursera you barely open",after:"$19/month on
].map((item,i)=>(
<div key={i} style={{background:cardBg,border:`1px solid ${border}`,borderR
<div>
<div style={{fontSize:10,fontWeight:800,color:"#ef4444",letterSpacing:1
<p style={{fontSize:13,color:textMuted,lineHeight:1.55,margin:0}}>{item
</div>
<div style={{fontSize:24,textAlign:"center"}}>{item.emoji}</div>
<div>
<div style={{fontSize:10,fontWeight:800,color:"#059669",letterSpacing:1
<p style={{fontSize:13,color:accent,fontWeight:600,lineHeight:1.55,marg
</div>
</div>
))}
</div>
{/* Final CTA */}
<div style={{background:darkMode?"#1a1035":"#f3f0ff",border:`1px solid ${darkMo
<h3 style={{fontSize:"clamp(24px,3.5vw,40px)",fontWeight:900,letterSpacing:-1
Ready to actually build something?
</h3>
<p style={{fontSize:16,color:textMuted,margin:"0 0 32px",lineHeight:1.6}}>Cho
<button onClick={()=>setLandingView(false)} style={{padding:"16px 40px",backg
onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
onMouseLeave={e=>e.currentTarget.style.transform="none"}>
Start for free →
</button>
<p style={{fontSize:12,color:textMuted,marginTop:14}}>No credit card. No dead
</div>
</section>
</div>
)}
{/* ══════════════════════════════════════════ */}
{/* APP VIEW */}
{!landingView&&(
<main style={{maxWidth:1100,margin:"0 auto",padding:"40px 24px"}}>
{/* ── TRACKS ── */}
{tab==="tracks"&&(
<div>
<div style={{marginBottom:32}}>
<h2 style={{fontSize:"clamp(24px,3vw,36px)",fontWeight:900,letterSpacing:-1
<p style={{fontSize:14,color:textMuted,margin:0}}>{done.length} of {TRACKS.
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300p
{TRACKS.map(t=>{
const doneCount=t.lessons.filter(l=>done.includes(l.id)).length;
const pct=Math.round((doneCount/t.lessons.length)*100);
return(
<div key={t.id} onClick={()=>{setActiveTrack(t.id);setScreen("track");}
style={{background:cardBg,border:`1px solid ${border}`,borderRadius:2
onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";
onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTar
{/* Colour header band */}
<div style={{background:`linear-gradient(135deg,${t.color}18,${t.ligh
<div style={{display:"flex",alignItems:"center",justifyContent:"spa
<span style={{fontSize:32}}>{t.icon}</span>
<div style={{background:t.light,color:t.color,fontSize:11,fontWei
</div>
{/* BIG title */}
<h3 style={{fontSize:22,fontWeight:900,color:textPrimary,margin:"0
{/* Salary — prominent, coloured */}
<div style={{display:"inline-flex",alignItems:"center",gap:6,backgr
<span style={{fontSize:16}}> </span>
<span style={{fontSize:15,fontWeight:800,color:t.color}}>{t.salar
<span style={{fontSize:11,color:t.color,opacity:0.7}}>/mo</span>
</div>
</div>
{/* Body */}
<div style={{padding:"18px 24px 20px",flex:1,display:"flex",flexDirec
<p style={{fontSize:14,color:textMuted,lineHeight:1.65,margin:0,fon
{/* Demand badge */}
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:12,fontWeight:600,color:textMuted}}>Demand
<span style={{fontSize:13}}>{t.demand}</span>
</div>
{/* Progress row */}
<div>
<div style={{display:"flex",justifyContent:"space-between",margin
<span style={{fontSize:12,color:textMuted}}>{doneCount} of {t.l
<span style={{fontSize:12,fontWeight:700,color:t.color}}>{pct}%
</div>
<div style={{height:5,background:darkMode?"rgba(255,255,255,0.08)
<div style={{height:"100%",width:`${pct}%`,background:`linear-g
</div>
</div>
{/* CTA row */}
<div style={{display:"flex",alignItems:"center",justifyContent:"spa
<span style={{fontSize:12,color:textMuted,fontWeight:500}}>{t.les
<div style={{display:"flex",alignItems:"center",gap:6,background:
Start →
</div>
</div>
</div>
</div>
);
})}
</div>
</div>
)}
{/* ── PROGRESS ── */}
{tab==="progress"&&(
<div style={{maxWidth:700}}>
<h2 style={{fontSize:28,fontWeight:900,letterSpacing:-1,marginBottom:24,color
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220p
{[["XP Earned",xp,"#7c3aed"],["Lessons",done.length,"#0891b2"],["Badges",ac
<div key={label} style={{background:cardBg,border:`1px solid ${border}`,b
<div style={{fontSize:32,fontWeight:900,color:col,letterSpacing:-1}}>{v
<div style={{fontSize:12,color:textMuted,marginTop:6,fontWeight:600}}>{
</div>
))}
</div>
<div style={{background:cardBg,border:`1px solid ${border}`,borderRadius:20,p
<div style={{fontSize:12,fontWeight:700,color:textMuted,letterSpacing:2,tex
{LEVELS.map((l,i)=>{
const reached=xp>=l.min;const isCurr=currLevel.name===l.name;
return(
<div key={l.name} style={{display:"flex",alignItems:"center",gap:14,mar
<div style={{width:40,height:40,borderRadius:12,background:isCurr?"#7
{l.name.slice(0,2).toUpperCase()}
</div>
<div style={{flex:1}}>
<div style={{fontSize:14,fontWeight:700,color:isCurr?"#7c3aed":text
<div style={{fontSize:11,color:textMuted}}>{l.min} XP{i<LEVELS.leng
</div>
{isCurr&&<div style={{fontSize:11,background:"#f3f0ff",color:"#7c3aed
{reached&&!isCurr&&<div style={{color:"#22c55e",fontWeight:800}}>✓</d
</div>
);
})}
</div>
</div>
)}
{/* ── ACHIEVEMENTS ── */}
{tab==="achievements"&&(
<div style={{maxWidth:700}}>
<h2 style={{fontSize:28,fontWeight:900,letterSpacing:-1,marginBottom:24,color
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280p
{ACHIEVEMENTS.map(a=>{
const earned=achs.includes(a.id);
return(
<div key={a.id} style={{background:earned?cardBg:"transparent",border:`
<span style={{fontSize:28,filter:earned?"none":"grayscale(1)"}}>{a.ic
<div>
<div style={{fontSize:14,fontWeight:800,color:earned?"#7c3aed":text
<div style={{fontSize:12,color:textMuted,marginTop:2}}>{a.desc}</di
</div>
</div>
);
})}
</div>
</div>
)}
</main>
)}
<Popups/>
</div>
<style>{`@keyframes pop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:sca
);
}
// ── TRACK PAGE ─────────────────────────────
if(screen==="track"&&track){
const trackBg = darkMode?"#0f0a1e":"#fafafa";
const trackCard = darkMode?"#1a1035":"#fff";
const trackText = darkMode?"#f0f0ff":"#0f172a";
const trackMuted = darkMode?"#6b6a8a":"#64748b";
const trackBorder = darkMode?"rgba(255,255,255,0.08)":"#e8e8f0";
const trackSub = darkMode?"rgba(255,255,255,0.05)":"#f1f5f9";
const PRACTICE_ICONS = {code:" ",build:" ",quiz:" ",visual:" ",ai:" ",project:" ",
const LEVEL_COLORS = {"Junior":"#059669","Mid-level":"#7c3aed","Senior":"#dc2626"};
const LEVEL_BG = {"Junior":"#d1fae5","Mid-level":"#ede9fe","Senior":"#fee2e2"};
return(
<div style={{minHeight:"100vh",overflowX:"hidden",background:trackBg,fontFamily:"'Plus
<header style={{background:trackCard,borderBottom:"1px solid #e8e8f0",position:"stick
<div style={{maxWidth:1100,margin:"0 auto",padding:"10px 16px",minHeight:56,display
<button onClick={()=>setScreen("home")} style={{background:"transparent",border:"
<div style={{flex:1,minWidth:120}}>
<div style={{fontWeight:900,fontSize:"clamp(14px,3.5vw,18px)",color:trackText,l
<div style={{fontSize:11,color:trackMuted,fontWeight:500,marginTop:2}}>{track.s
</div>
<div style={{display:"inline-block",background:track.light,color:track.color,font
</div>
</header>
<div style={{maxWidth:720,margin:"0 auto",padding:"24px 16px"}}>
<p style={{fontSize:15,color:trackMuted,marginBottom:28,fontWeight:500,lineHeight:1
{/* Available lessons */}
<div style={{marginBottom:32}}>
<div style={{fontSize:12,fontWeight:800,color:trackText,letterSpacing:1.5,textTra
<div style={{display:"flex",flexDirection:"column",gap:10}}>
{track.lessons.map((lesson,idx)=>{
const isDone=done.includes(lesson.id);
const locked=idx>0&&!done.includes(track.lessons[idx-1].id);
return(
<div key={lesson.id} onClick={()=>{if(!locked){setActiveLesson(lesson);setV
style={{background:trackCard,border:`1.5px solid ${isDone?track.color+"40
onMouseEnter={e=>{if(!locked){e.currentTarget.style.borderColor=track.col
onMouseLeave={e=>{e.currentTarget.style.borderColor=isDone?`${track.color
<div style={{width:38,height:38,borderRadius:10,background:isDone?track.l
{locked?" ":isDone?"✓":idx+1}
</div>
<div style={{flex:1}}>
<div style={{fontSize:14,fontWeight:700,color:trackText}}>{lesson.title
<div style={{fontSize:11,color:trackMuted,marginTop:2}}>{lesson.level}
</div>
{isDone&&<div style={{fontSize:11,fontWeight:700,color:track.color,backgr
{!isDone&&!locked&&<div style={{color:track.color,fontWeight:700,fontSize
</div>
);
})}
</div>
</div>
{/* Full roadmap */}
{track.curriculum&&track.curriculum.map((section,si)=>(
<div key={si} style={{marginBottom:28}}>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
<div style={{background:LEVEL_BG[section.level],color:LEVEL_COLORS[section.le
<div style={{fontSize:11,color:trackMuted,fontWeight:500}}>{section.lessons.l
</div>
<div style={{display:"flex",flexDirection:"column",gap:4}}>
{section.lessons.map((lesson,li)=>(
<div key={lesson.id} style={{background:trackCard,border:"1px solid #f1f5f9
<div style={{width:24,height:24,borderRadius:6,background:trackSub,displa
<div style={{flex:1,fontSize:13,fontWeight:500,color:trackMuted}}>{lesson
<div style={{fontSize:10,fontWeight:700,color:trackMuted,background:track
</div>
))}
</div>
</div>
))}
</div>
<Popups/>
<style>{`@keyframes pop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:sca
</div>
);
}
// ── LESSON PAGE ─────────────────────────────
if(screen==="lesson"&&activeLesson&&track){
const goBack=()=>setScreen("track");
if(track.id==="aiml") return <><AIMLLesson1 onBack={goBack}/><Popups/></>;
if(track.id==="frontend") return <><HTMLLesson onBack={goBack}/><Popups/></>;
if(track.id==="backend") return <><BackendLesson1 onBack={goBack}/><Popups/></>;
if(track.id==="data") return <><DataLesson1 onBack={goBack}/><Popups/></>;
if(track.id==="devops") return <><DevOpsLesson1 onBack={goBack}/><Popups/></>;
if(track.id==="web3") return <><Web3Lesson1 onBack={goBack}/><Popups/></>;
}
return null;
}
