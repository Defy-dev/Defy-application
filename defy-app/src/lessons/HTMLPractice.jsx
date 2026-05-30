import { useState, useEffect } from "react";

const accent = "#7c3aed";
const light = "#f3f0ff";

const STEPS = [
  {
    id: 0,
    title: "Your first heading",
    instruction: "Type your name inside the h1 tag to create a big heading.",
    hint: "Replace 'Your Name Here' with your actual name",
    starter: `<h1>Your Name Here</h1>`,
    goal: "See your name appear as a big bold heading",
    tip: "h1 is the biggest heading — like the title of a book. There should only be one h1 per page."
  },
  {
    id: 1,
    title: "Add a bio",
    instruction: "Add a paragraph below your heading that describes you in one sentence.",
    hint: "Use the <p> tag for paragraphs",
    starter: `<h1>Your Name Here</h1>\n<p>Write something about yourself here.</p>`,
    goal: "See your heading AND a paragraph below it",
    tip: "The browser automatically adds space between block elements like h1 and p. No need to add blank lines."
  },
  {
    id: 2,
    title: "Make a link",
    instruction: "Add a link to your favourite website below your bio.",
    hint: 'Use <a href="URL">text</a> — put the URL inside the href attribute',
    starter: `<h1>Your Name Here</h1>\n<p>Write something about yourself here.</p>\n<a href="https://google.com">Visit my favourite site</a>`,
    goal: "See a clickable blue link appear on your page",
    tip: 'The href attribute tells the browser WHERE to go. Without it, the link goes nowhere. Always include https:// in the URL.'
  },
  {
    id: 3,
    title: "Build a full page",
    instruction: "Wrap everything in the proper HTML structure — DOCTYPE, html, head, and body.",
    hint: "Your content goes inside <body>. The <head> holds the <title>.",
    starter: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Portfolio</title>\n  </head>\n  <body>\n    <h1>Your Name Here</h1>\n    <p>Write something about yourself here.</p>\n    <a href="https://google.com">Visit my favourite site</a>\n  </body>\n</html>`,
    goal: "See the full page structure with a title in the browser tab",
    tip: "Notice how the indentation makes the structure readable? The head and body are 'inside' html. Your content is 'inside' body. This nesting is everything."
  },
];

export default function HTMLPractice() {
  const [step, setStep] = useState(0);
  const [code, setCode] = useState(STEPS[0].starter);
  const [preview, setPreview] = useState("");
  const [completed, setCompleted] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPreview(code), 300);
    return () => clearTimeout(timer);
  }, [code]);

  const handleStepChange = (newStep) => {
    setStep(newStep);
    setCode(STEPS[newStep].starter);
  };

  const handleComplete = () => {
    if (!completed.includes(step)) {
      setCompleted(prev => [...prev, step]);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    if (step < STEPS.length - 1) {
      setTimeout(() => handleStepChange(step + 1), 500);
    }
  };

  const currentStep = STEPS[step];

  const previewHTML = `
    <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 24px;
            color: #0f172a;
            line-height: 1.6;
            max-width: 600px;
          }
          h1 { font-size: 28px; font-weight: 800; margin: 0 0 12px; color: #0f172a; }
          h2 { font-size: 20px; font-weight: 700; margin: 16px 0 8px; color: #1e293b; }
          p { font-size: 15px; color: #475569; margin: 0 0 12px; }
          a { color: #7c3aed; text-decoration: underline; }
          ul, ol { padding-left: 20px; color: #475569; }
          li { margin-bottom: 4px; font-size: 15px; }
          img { max-width: 100%; border-radius: 8px; }
          .empty-state {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #94a3b8;
            font-size: 14px;
            text-align: center;
            padding: 40px;
          }
        </style>
      </head>
      <body>
        ${code.trim() ? code : '<div class="empty-state">Start typing to see your page appear here ✨</div>'}
      </body>
    </html>
  `;

  return (
    <div style={{ height: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif", color: "#0f172a", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>

      {/* Celebration */}
      {showCelebration && (
        <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", background: accent, color: "#fff", padding: "12px 28px", borderRadius: 100, fontWeight: 800, fontSize: 15, zIndex: 999, boxShadow: `0 8px 32px ${accent}50`, animation: "pop .35s cubic-bezier(.175,.885,.32,1.275)", whiteSpace: "nowrap" }}>
          ✨ Nice work! Moving to the next step →
        </div>
      )}

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e8f0", flexShrink: 0 }}>
        <div style={{ padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 2 }}>DEF<span style={{ color: accent }}>Y</span></div>
          <div style={{ width: 1, height: 18, background: "#e8e8f0" }}/>
          <div style={{ fontSize: 14, fontWeight: 700 }}>HTML — Live Practice</div>
          {/* Step progress */}
          <div style={{ display: "flex", gap: 6, marginLeft: "auto", alignItems: "center" }}>
            {STEPS.map((s, i) => (
              <button key={i} onClick={() => handleStepChange(i)}
                style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${step === i ? accent : completed.includes(i) ? "#10b981" : "#e8e8f0"}`, background: step === i ? light : completed.includes(i) ? "#f0fdf4" : "#fff", color: step === i ? accent : completed.includes(i) ? "#10b981" : "#94a3b8", cursor: "pointer", fontSize: 11, fontWeight: 800, fontFamily: "inherit", transition: "all .15s" }}>
                {completed.includes(i) ? "✓" : i + 1}
              </button>
            ))}
            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginLeft: 4 }}>{completed.length}/{STEPS.length} done</span>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 3, background: "#f1f5f9" }}>
          <div style={{ height: "100%", width: `${((completed.length) / STEPS.length) * 100}%`, background: `linear-gradient(90deg, ${accent}, #a78bfa)`, transition: "width .4s" }}/>
        </div>
      </header>

      {/* Main — split view */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>

        {/* LEFT — Editor */}
        <div style={{ display: "flex", flexDirection: "column", borderRight: "1px solid #e8e8f0", overflow: "hidden" }}>
          {/* Task */}
          <div style={{ padding: "20px 24px", background: "#fff", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: accent, flexShrink: 0 }}>
                {step + 1}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{currentStep.title}</div>
            </div>
            <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, margin: "0 0 10px", fontWeight: 500 }}>{currentStep.instruction}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                💡 {currentStep.hint}
              </div>
              <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: accent, fontWeight: 600 }}>
                🎯 Goal: {currentStep.goal}
              </div>
            </div>
          </div>

          {/* Code editor */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 12, left: 16, fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", zIndex: 1, background: "#0f172a", padding: "3px 8px", borderRadius: 6 }}>HTML</div>
            <textarea value={code} onChange={e => setCode(e.target.value)}
              style={{ width: "100%", height: "100%", background: "#0f172a", border: "none", padding: "44px 20px 20px", color: "#e2e8f0", fontSize: 14, resize: "none", outline: "none", fontFamily: "'Fira Code', 'Courier New', monospace", lineHeight: 1.8, boxSizing: "border-box" }}
              spellCheck={false}
            />
          </div>

          {/* Bottom bar */}
          <div style={{ padding: "14px 20px", background: "#fff", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
            <div style={{ flex: 1, fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
              <strong style={{ color: "#475569" }}>Pro tip:</strong> {currentStep.tip}
            </div>
            <button onClick={handleComplete} style={{ padding: "10px 20px", background: accent, border: "none", borderRadius: 10, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 16px ${accent}35`, whiteSpace: "nowrap", flexShrink: 0 }}>
              {step < STEPS.length - 1 ? "Looks good →" : "Complete lesson ✓"}
            </button>
          </div>
        </div>

        {/* RIGHT — Live Preview */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", background: "#fff", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {/* Browser chrome mock */}
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }}/>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }}/>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }}/>
            </div>
            <div style={{ flex: 1, background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
              🌐 preview — your page
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "4px 10px", borderRadius: 100 }}>
              ● Live
            </div>
          </div>
          <iframe
            srcDoc={previewHTML}
            style={{ flex: 1, border: "none", background: "#fff" }}
            title="Live Preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>

      <style>{`
        @keyframes pop { from { opacity: 0; transform: translateX(-50%) scale(.7); } to { opacity: 1; transform: translateX(-50%) scale(1); } }
        * { box-sizing: border-box; }
        textarea { caret-color: #a78bfa; }
      `}</style>
    </div>
  );
}
