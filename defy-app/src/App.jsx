import { useState, Suspense, lazy } from "react";

// Lazy load all lessons for performance
const HTMLLesson = lazy(() => import("./lessons/HTMLLesson"));
const HTMLPractice = lazy(() => import("./lessons/HTMLPractice"));
const AIMLLesson = lazy(() => import("./lessons/AIMLLesson"));
const BackendLesson = lazy(() => import("./lessons/BackendLesson"));
const DevOpsLesson = lazy(() => import("./lessons/DevOpsLesson"));
const DataLesson = lazy(() => import("./lessons/DataLesson"));
const Web3Lesson = lazy(() => import("./lessons/Web3Lesson"));

const accent = "#8b5cf6";
const light = "#f5f3ff";

const TRACKS = [
  {
    id: "aiml", title: "AI / ML Engineer", icon: "🧠",
    color: "#8b5cf6", gradient: "linear-gradient(135deg,#7c3aed,#a78bfa)",
    light: "#f5f3ff", border: "rgba(139,92,246,0.3)",
    tag: "Most Wanted", demand: "🔥🔥🔥",
    description: "Neural networks, ML, LLMs, prompt engineering",
    salary: "$3,000–12,000",
    lessons: [
      { id: "aiml-1", title: "A Day in the Life", xp: 75, component: "AIMLLesson" },
    ]
  },
  {
    id: "frontend", title: "Frontend Developer", icon: "💻",
    color: "#10b981", gradient: "linear-gradient(135deg,#059669,#34d399)",
    light: "#f0fdf4", border: "rgba(16,185,129,0.3)",
    tag: "High Demand", demand: "🔥🔥🔥",
    description: "HTML, CSS, JavaScript, React — build what users see",
    salary: "$2,000–8,000",
    lessons: [
      { id: "frontend-1", title: "HTML — Skeleton of the Web", xp: 50, component: "HTMLLesson" },
      { id: "frontend-2", title: "HTML Live Practice", xp: 50, component: "HTMLPractice" },
    ]
  },
  {
    id: "backend", title: "Backend Developer", icon: "⚙️",
    color: "#3b82f6", gradient: "linear-gradient(135deg,#2563eb,#60a5fa)",
    light: "#eff6ff", border: "rgba(59,130,246,0.3)",
    tag: "High Demand", demand: "🔥🔥🔥",
    description: "Python, APIs, databases — the engine behind every app",
    salary: "$2,500–10,000",
    lessons: [
      { id: "backend-1", title: "How the Internet Works", xp: 75, component: "BackendLesson" },
    ]
  },
  {
    id: "data", title: "Data Analyst", icon: "📊",
    color: "#f59e0b", gradient: "linear-gradient(135deg,#d97706,#fbbf24)",
    light: "#fffbeb", border: "rgba(245,158,11,0.3)",
    tag: "Growing Fast", demand: "🔥🔥",
    description: "SQL, Python, visualisation — turn data into decisions",
    salary: "$2,000–7,000",
    lessons: [
      { id: "data-1", title: "Data Is Everywhere", xp: 75, component: "DataLesson" },
    ]
  },
  {
    id: "devops", title: "DevOps / Cloud", icon: "☁️",
    color: "#ef4444", gradient: "linear-gradient(135deg,#dc2626,#f87171)",
    light: "#fff1f2", border: "rgba(239,68,68,0.3)",
    tag: "Premium Pay", demand: "🔥🔥🔥",
    description: "Docker, Kubernetes, CI/CD — keep everything running",
    salary: "$3,000–12,000",
    lessons: [
      { id: "devops-1", title: "The Profession + Docker", xp: 75, component: "DevOpsLesson" },
    ]
  },
  {
    id: "web3", title: "Web3 / Blockchain", icon: "⛓️",
    color: "#ec4899", gradient: "linear-gradient(135deg,#db2777,#f472b6)",
    light: "#fdf2f8", border: "rgba(236,72,153,0.3)",
    tag: "Highest Upside", demand: "🔥🔥",
    description: "Smart contracts, DeFi, Solidity — the decentralised web",
    salary: "$4,000–20,000",
    lessons: [
      { id: "web3-1", title: "The New Internet", xp: 75, component: "Web3Lesson" },
    ]
  },
];

const LESSON_COMPONENTS = {
  AIMLLesson, HTMLLesson, HTMLPractice,
  BackendLesson, DevOpsLesson, DataLesson, Web3Lesson,
};

const LEVELS = [
  { name: "Beginner", min: 0 },
  { name: "Junior", min: 200 },
  { name: "Mid-level", min: 600 },
  { name: "Senior", min: 1200 },
  { name: "Architect", min: 2000 },
  { name: "Legend", min: 3000 },
];

const getLevel = (xp) => {
  let l = LEVELS[0];
  for (const lvl of LEVELS) { if (xp >= lvl.min) l = lvl; }
  return l;
};

const LoadingScreen = () => (
  <div style={{ minHeight: "100vh", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
    <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 2 }}>DEF<span style={{ color: accent }}>Y</span></div>
    <div style={{ display: "flex", gap: 6 }}>
      {[0,1,2].map(j => (
        <div key={j} style={{ width: 10, height: 10, borderRadius: "50%", background: accent, animation: `pulse 1.2s ease-in-out ${j*.2}s infinite` }}/>
      ))}
    </div>
    <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
  </div>
);

export default function DefyApp() {
  const [screen, setScreen] = useState("home"); // home | track | lesson
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [xp, setXp] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeTab, setActiveTab] = useState("tracks");

  const track = TRACKS.find(t => t.id === activeTrackId);
  const lesson = track?.lessons.find(l => l.id === activeLessonId);
  const currentLevel = getLevel(xp);
  const nextLevel = LEVELS.find(l => l.min > xp);
  const xpProgress = nextLevel
    ? ((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  const totalLessons = TRACKS.reduce((a, t) => a + t.lessons.length, 0);

  // ── HOME ──────────────────────────────────────
  if (screen === "home") {
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif", color: "#0f172a" }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>

        <header style={{ background: "#fff", borderBottom: "1px solid #e8e8f0", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 2, color: "#0f172a" }}>
              DEF<span style={{ color: accent }}>Y</span>
            </div>
            <nav style={{ display: "flex", gap: 4, flex: 1 }}>
              {[["tracks","Tracks"],["progress","Progress"],["achievements","Achievements"]].map(([t,l]) => (
                <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: activeTab === t ? light : "transparent", color: activeTab === t ? accent : "#64748b", cursor: "pointer", fontSize: 14, fontWeight: activeTab === t ? 700 : 500, fontFamily: "inherit", transition: "all .15s" }}>
                  {l}
                </button>
              ))}
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8f7ff", border: "1px solid #e8e8f0", borderRadius: 100, padding: "6px 16px 6px 8px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${accent},#a78bfa)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 800 }}>
                {currentLevel.name.slice(0,1)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{currentLevel.name}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1, marginTop: 2 }}>{xp} XP</div>
              </div>
              {nextLevel && (
                <div style={{ width: 48, height: 4, background: "#e8e8f0", borderRadius: 2, overflow: "hidden", marginLeft: 4 }}>
                  <div style={{ height: "100%", width: `${xpProgress}%`, background: `linear-gradient(90deg,${accent},#a78bfa)`, borderRadius: 2, transition: "width .5s" }}/>
                </div>
              )}
            </div>
          </div>
        </header>

        {activeTab === "tracks" && (
          <main style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 32px" }}>
            <div style={{ marginBottom: 56 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 20 }}>
                AI-powered learning
              </div>
              <h1 style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, margin: 0, color: "#0f172a" }}>
                From zero to<br/>
                <span style={{ background: `linear-gradient(135deg,${accent},#a78bfa)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>hired engineer.</span>
              </h1>
              <p style={{ fontSize: 18, color: "#64748b", marginTop: 20, maxWidth: 480, lineHeight: 1.6, fontWeight: 500 }}>
                Every lesson starts with a real task. Practice first — with an AI mentor that gives feedback like a senior colleague.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 18px", fontSize: 13, color: "#475569", fontWeight: 600 }}>{completedLessons.length} of {totalLessons} completed</div>
                <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 12, padding: "10px 18px", fontSize: 13, color: accent, fontWeight: 600 }}>6 career tracks</div>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "10px 18px", fontSize: 13, color: "#16a34a", fontWeight: 600 }}>AI mentor included</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
              {TRACKS.map(t => {
                const done = t.lessons.filter(l => completedLessons.includes(l.id)).length;
                const pct = Math.round((done / t.lessons.length) * 100);
                return (
                  <div key={t.id} onClick={() => { setActiveTrackId(t.id); setScreen("track"); }}
                    style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", cursor: "pointer", transition: "all .2s", position: "relative", overflow: "hidden" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 20px 40px ${t.color}18`; e.currentTarget.style.borderColor = `${t.color}40`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e8e8f0"; }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: t.gradient }}/>
                    <div style={{ display: "inline-block", background: t.light, color: t.color, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "4px 10px", borderRadius: 100, marginBottom: 18 }}>
                      {t.tag}
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 8px", letterSpacing: -0.5 }}>{t.title}</h3>
                    <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 20px", fontWeight: 500 }}>{t.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>💰 {t.salary}</span>
                      <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{done}/{t.lessons.length} lessons</span>
                    </div>
                    <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: t.gradient, borderRadius: 2, transition: "width .5s" }}/>
                    </div>
                    <div style={{ position: "absolute", top: 28, right: 24, width: 32, height: 32, borderRadius: "50%", background: light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: accent, fontWeight: 700 }}>→</div>
                  </div>
                );
              })}
            </div>
          </main>
        )}

        {activeTab === "progress" && (
          <main style={{ maxWidth: 700, margin: "0 auto", padding: "56px 32px" }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 24 }}>Your Progress</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
              {[["⚡ XP", xp, accent], ["📚 Lessons", completedLessons.length, "#10b981"], ["🎯 Tracks", TRACKS.filter(t => t.lessons.some(l => completedLessons.includes(l.id))).length, "#f59e0b"]].map(([label,val,col]) => (
                <div key={label} style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, padding: "24px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: col, letterSpacing: -1 }}>{val}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6, fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>Career Ladder</div>
              {LEVELS.map((l, i) => {
                const reached = xp >= l.min;
                const isCurrent = currentLevel.name === l.name;
                return (
                  <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, opacity: reached ? 1 : 0.3 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: isCurrent ? accent : reached ? light : "#f8fafc", border: `2px solid ${isCurrent ? accent : reached ? `${accent}30` : "#e8e8f0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: isCurrent ? "#fff" : reached ? accent : "#94a3b8", flexShrink: 0 }}>
                      {l.name.slice(0,2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: isCurrent ? accent : "#0f172a" }}>{l.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{l.min} XP{i < LEVELS.length-1 ? ` → ${LEVELS[i+1].min} XP` : "+"}</div>
                    </div>
                    {isCurrent && <div style={{ fontSize: 11, color: accent, background: light, padding: "3px 12px", borderRadius: 100, fontWeight: 700 }}>You are here</div>}
                    {reached && !isCurrent && <div style={{ color: "#22c55e", fontWeight: 800 }}>✓</div>}
                  </div>
                );
              })}
            </div>
          </main>
        )}

        {activeTab === "achievements" && (
          <main style={{ maxWidth: 700, margin: "0 auto", padding: "56px 32px" }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 24 }}>Achievements</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { id: "first", title: "First Step", desc: "Complete your first lesson", icon: "🌱", cond: completedLessons.length >= 1 },
                { id: "xp500", title: "On Fire", desc: "Earn 500 XP", icon: "⚡", cond: xp >= 500 },
                { id: "xp1000", title: "Four Figures", desc: "Earn 1,000 XP", icon: "💎", cond: xp >= 1000 },
                { id: "3tracks", title: "Polymath", desc: "Try 3 different tracks", icon: "🔥", cond: TRACKS.filter(t => t.lessons.some(l => completedLessons.includes(l.id))).length >= 3 },
                { id: "xp2000", title: "Senior Mode", desc: "Earn 2,000 XP", icon: "🚀", cond: xp >= 2000 },
                { id: "alltrack", title: "Legend", desc: "Complete all 6 tracks", icon: "👑", cond: TRACKS.every(t => t.lessons.some(l => completedLessons.includes(l.id))) },
              ].map(a => (
                <div key={a.id} style={{ background: a.cond ? "#fff" : "#fafafa", border: `1px solid ${a.cond ? `${accent}30` : "#e8e8f0"}`, borderRadius: 16, padding: "20px", display: "flex", gap: 14, alignItems: "center", opacity: a.cond ? 1 : 0.4 }}>
                  <span style={{ fontSize: 28, filter: a.cond ? "none" : "grayscale(1)" }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: a.cond ? accent : "#94a3b8" }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}
        <style>{`*{box-sizing:border-box;}::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:#e8e8f0;border-radius:3px;}`}</style>
      </div>
    );
  }

  // ── TRACK ──────────────────────────────────────
  if (screen === "track" && track) {
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif", color: "#0f172a" }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <header style={{ background: "#fff", borderBottom: "1px solid #e8e8f0", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setScreen("home")} style={{ background: "transparent", border: "1px solid #e8e8f0", borderRadius: 10, color: "#64748b", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>← Back</button>
            <span style={{ fontSize: 24 }}>{track.icon}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>{track.title}</div>
              <div style={{ fontSize: 12, color: track.color, fontWeight: 600 }}>{track.description}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "inline-block", background: track.light, color: track.color, fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 100 }}>{track.tag}</div>
          </div>
        </header>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>
          <div style={{ marginBottom: 20, fontSize: 13, color: "#64748b", fontWeight: 600 }}>💰 {track.salary} · {track.demand} Demand</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {track.lessons.map((lesson, idx) => {
              const isDone = completedLessons.includes(lesson.id);
              return (
                <div key={lesson.id} onClick={() => { setActiveLessonId(lesson.id); setScreen("lesson"); }}
                  style={{ background: "#fff", border: `1px solid ${isDone ? `${track.color}30` : "#e8e8f0"}`, borderLeft: `3px solid ${isDone ? track.color : "#e8e8f0"}`, borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${track.color}50`; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = isDone ? `${track.color}30` : "#e8e8f0"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: isDone ? track.light : "#f8fafc", border: `2px solid ${isDone ? track.color : "#e8e8f0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: isDone ? track.color : "#94a3b8", flexShrink: 0 }}>
                    {isDone ? "✓" : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{lesson.title}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3, fontWeight: 500 }}>Lesson {idx + 1} · {lesson.xp} XP</div>
                  </div>
                  {isDone && <div style={{ fontSize: 12, fontWeight: 700, color: track.color, background: track.light, padding: "5px 14px", borderRadius: 100 }}>Completed ✓</div>}
                  {!isDone && <div style={{ color: track.color, fontWeight: 700, fontSize: 18 }}>→</div>}
                </div>
              );
            })}
          </div>
        </div>
        <style>{`*{box-sizing:border-box;}`}</style>
      </div>
    );
  }

  // ── LESSON ──────────────────────────────────────
  if (screen === "lesson" && track && lesson) {
    const LessonComponent = LESSON_COMPONENTS[lesson.component];

    const handleComplete = () => {
      if (!completedLessons.includes(lesson.id)) {
        setCompletedLessons(prev => [...prev, lesson.id]);
        setXp(prev => prev + lesson.xp);
      }
      setScreen("track");
    };

    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        {/* Back button overlay */}
        <div style={{ position: "fixed", top: 12, left: 12, zIndex: 200 }}>
          <button onClick={() => setScreen("track")}
            style={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e8e8f0", borderRadius: 10, color: "#64748b", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", backdropFilter: "blur(8px)" }}>
            ← Lessons
          </button>
        </div>
        <Suspense fallback={<LoadingScreen/>}>
          <LessonComponent/>
        </Suspense>
        <style>{`*{box-sizing:border-box;}@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
      </div>
    );
  }

  return null;
}
