import { useState } from "react";

export default function HTMLLesson() {
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
      emoji: "🏗️",
      hook: "Every website you've ever visited — Google, Instagram, YouTube — starts with HTML. It's the skeleton. Without it, there's nothing to see.",
      content: [
        {
          type: "analogy",
          text: "Think of a website like a human body. HTML is the skeleton — the bones that give everything structure. CSS is the skin and clothes — how it looks. JavaScript is the muscles — what moves and reacts.\n\nYou can't have a body without bones. That's why we start here."
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
          result: "What the browser shows:\n\n【 Hello, World! 】← big bold heading\n\nThis is my first webpage.  ← normal paragraph text"
        },
        {
          type: "insight",
          text: "HTML stands for HyperText Markup Language. \"Markup\" means you're adding labels to content — telling the browser \"this is a heading\", \"this is a paragraph\", \"this is a link\"."
        }
      ]
    },
    {
      id: 1,
      title: "Tags — the building blocks",
      emoji: "🧱",
      hook: "HTML is made of tags. Tags are like labels you wrap around content. Once you understand tags, you understand HTML.",
      content: [
        {
          type: "analogy",
          text: "Imagine you're wrapping a gift. You open the box, put something inside, then close it. Tags work exactly the same way — an opening tag, your content, a closing tag."
        },
        {
          type: "visual",
          label: "Anatomy of an HTML tag",
          code: `<p>This is a paragraph.</p>
 ↑              ↑           ↑
opening tag  content   closing tag
             (the gift)  (has a / slash)`,
          result: "The browser reads this and shows:\n\nThis is a paragraph."
        },
        {
          type: "tags_grid",
          title: "The tags you'll use 90% of the time",
          tags: [
            { tag: "<h1>", desc: "Big heading — like a chapter title", example: "<h1>Welcome</h1>" },
            { tag: "<h2>", desc: "Smaller heading — like a section title", example: "<h2>About Me</h2>" },
            { tag: "<p>", desc: "Paragraph — regular text", example: "<p>I love coding.</p>" },
            { tag: "<a>", desc: "Link — clicking goes somewhere", example: '<a href="google.com">Go</a>' },
            { tag: "<img>", desc: "Image — shows a picture", example: '<img src="photo.jpg">' },
            { tag: "<div>", desc: "Container — groups things together", example: "<div>...</div>" },
          ]
        },
        {
          type: "insight",
          text: "Some tags don't need closing — like <img> and <br>. They're called \"self-closing\" tags because they don't wrap around any content."
        }
      ]
    },
    {
      id: 2,
      title: "Structure that matters",
      emoji: "📐",
      hook: "A good HTML page has a clear structure. Think of it like a letter — there's an envelope (html), a header with your address (head), and the actual letter (body).",
      content: [
        {
          type: "visual",
          label: "Every HTML page has this structure",
          code: `<!DOCTYPE html>        ← "Hey browser, this is HTML5"
<html>                 ← start of the page
  <head>               ← info about the page (not visible)
    <title>My Page</title>  ← tab title in browser
  </head>
  <body>               ← everything the user SEES
    <h1>Hello!</h1>
    <p>Welcome to my site.</p>
  </body>
</html>                ← end of the page`,
          result: "Browser tab shows: My Page\nPage shows: Hello! (big) + Welcome to my site."
        },
        {
          type: "analogy",
          text: "The <head> is like the back of a painting — the canvas, the frame, the artist's notes. Visitors don't see it, but it matters.\n\nThe <body> is the painting itself — what everyone looks at."
        },
        {
          type: "insight",
          text: "Indentation (the spaces before tags) is not required by the browser — but it's required by your sanity. Indented code is readable code. Always indent nested tags."
        }
      ]
    },
    {
      id: 3,
      title: "Common mistakes",
      emoji: "⚠️",
      hook: "Everyone makes these mistakes. You will too. That's fine — knowing them in advance means you'll fix them faster.",
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
              effect: "The browser tries to guess what you meant — and usually guesses wrong. Your layout breaks in unpredictable ways."
            },
            {
              title: "Wrong nesting order",
              bad: `<b><i>Bold and italic</b></i>`,
              good: `<b><i>Bold and italic</i></b>`,
              effect: "Tags must close in reverse order — last opened, first closed. Like stacking boxes: the top one comes off first."
            },
            {
              title: "Missing quotes on attributes",
              bad: `<a href=google.com>Click me</a>`,
              good: `<a href="google.com">Click me</a>`,
              effect: "Some browsers handle it, some don't. Always use quotes — it's a habit that saves you hours of debugging."
            },
            {
              title: "Using <br> for spacing",
              bad: `<p>Line 1</p>
<br><br><br>
<p>Line 2</p>`,
              good: `<p>Line 1</p>
<p>Line 2</p>
<!-- Use CSS margin for spacing -->`,
              effect: "Break tags are for line breaks within text, not for creating space between sections. That's CSS's job."
            }
          ]
        }
      ]
    }
  ];

  const currentSection = sections[activeSection];

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif", color: "#0f172a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e8f0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2, color: "#0f172a" }}>DEF<span style={{ color: accent }}>Y</span></div>
          <div style={{ width: 1, height: 20, background: "#e8e8f0" }}/>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>HTML — Skeleton of the Web</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Frontend Developer · Lesson 1 · 50 XP</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {["theory", "practice"].map(v => (
              <button key={v} onClick={() => setActiveTab(v)} style={{ padding: "7px 16px", borderRadius: 10, border: `1.5px solid ${activeTab === v ? accent : "#e8e8f0"}`, background: activeTab === v ? light : "transparent", color: activeTab === v ? accent : "#64748b", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 700, transition: "all .15s" }}>
                {v === "theory" ? "Theory" : "Practice"}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#f1f5f9" }}>
        <div style={{ height: "100%", width: `${((activeSection + 1) / sections.length) * 100}%`, background: `linear-gradient(90deg, ${accent}, #a78bfa)`, transition: "width .4s" }}/>
      </div>

      {/* THEORY */}
      {activeTab === "theory" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          {/* Section nav */}
          <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
            {sections.map((s, i) => (
              <button key={i} onClick={() => setActiveSection(i)} style={{ padding: "8px 16px", borderRadius: 100, border: `1.5px solid ${activeSection === i ? accent : "#e8e8f0"}`, background: activeSection === i ? light : "#fff", color: activeSection === i ? accent : "#64748b", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: activeSection === i ? 700 : 500, transition: "all .15s", display: "flex", alignItems: "center", gap: 6 }}>
                <span>{s.emoji}</span> {s.title}
              </button>
            ))}
          </div>

          {/* Hook */}
          <div style={{ background: `linear-gradient(135deg, ${light}, #fff)`, border: `1px solid ${accent}25`, borderLeft: `4px solid ${accent}`, borderRadius: "0 16px 16px 0", padding: "20px 24px", marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Why this matters</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", lineHeight: 1.65, margin: 0 }}>{currentSection.hook}</p>
          </div>

          {/* Content blocks */}
          {currentSection.content.map((block, i) => (
            <div key={i} style={{ marginBottom: 28 }}>

              {/* Analogy */}
              {block.type === "analogy" && (
                <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, padding: "24px 28px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>💡 Analogy</div>
                  <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.8, margin: 0, fontWeight: 500, whiteSpace: "pre-line" }}>{block.text}</p>
                </div>
              )}

              {/* Code + Result */}
              {block.type === "visual" && (
                <div>
                  {block.label && <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 10 }}>{block.label}</div>}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Code</div>
                      <div style={{ background: "#0f172a", borderRadius: 14, padding: "20px", fontFamily: "'Fira Code', 'Courier New', monospace", fontSize: 13, color: "#e2e8f0", lineHeight: 1.8, whiteSpace: "pre-wrap", overflowX: "auto" }}>
                        {block.code.split("\n").map((line, j) => (
                          <div key={j}>
                            {line.includes("←") ? (
                              <>
                                <span style={{ color: "#a78bfa" }}>{line.split("←")[0]}</span>
                                <span style={{ color: "#64748b", fontStyle: "italic" }}>←{line.split("←")[1]}</span>
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
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>What the browser shows</div>
                      <div style={{ background: "#fff", border: "2px solid #e8e8f0", borderRadius: 14, padding: "20px", fontSize: 14, color: "#334155", lineHeight: 1.8, whiteSpace: "pre-wrap", minHeight: 120, fontFamily: "inherit" }}>{block.result}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags grid */}
              {block.type === "tags_grid" && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 14 }}>{block.title}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                    {block.tags.map((t, j) => (
                      <div key={j} style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "16px 18px", transition: "all .15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}50`; e.currentTarget.style.background = light; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e8f0"; e.currentTarget.style.background = "#fff"; }}>
                        <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 14, fontWeight: 700, color: accent, marginBottom: 6 }}>{t.tag}</div>
                        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10, lineHeight: 1.4 }}>{t.desc}</div>
                        <div style={{ background: "#0f172a", borderRadius: 8, padding: "8px 12px", fontFamily: "'Fira Code', monospace", fontSize: 12, color: "#7dd3fc" }}>{t.example}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Insight */}
              {block.type === "insight" && (
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 14, padding: "18px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
                  <p style={{ fontSize: 14, color: "#78350f", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{block.text}</p>
                </div>
              )}

              {/* Mistakes */}
              {block.type === "mistakes" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
                    {block.mistakes.map((m, j) => (
                      <div key={j} style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all .2s" }}
                        onClick={() => setShowMistake(showMistake === j ? null : j)}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 10, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>⚠️</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", flex: 1 }}>{m.title}</div>
                          <div style={{ color: "#94a3b8", fontSize: 18 }}>{showMistake === j ? "↑" : "↓"}</div>
                        </div>
                        {showMistake === j && (
                          <div style={{ padding: "0 20px 20px", borderTop: "1px solid #f1f5f9" }}>
                            <div style={{ marginTop: 16 }}>
                              <div style={{ fontSize: 11, fontWeight: 800, color: "#ef4444", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>❌ Wrong</div>
                              <div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px", fontFamily: "'Fira Code', monospace", fontSize: 12, color: "#dc2626", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{m.bad}</div>
                            </div>
                            <div style={{ marginTop: 12 }}>
                              <div style={{ fontSize: 11, fontWeight: 800, color: "#10b981", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>✅ Correct</div>
                              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px", fontFamily: "'Fira Code', monospace", fontSize: 12, color: "#16a34a", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{m.good}</div>
                            </div>
                            <div style={{ marginTop: 12, padding: "12px 14px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, fontSize: 13, color: "#78350f", lineHeight: 1.5 }}>
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
              <button onClick={() => setActiveSection(s => s - 1)} style={{ padding: "12px 24px", background: "#fff", border: "1.5px solid #e8e8f0", borderRadius: 12, color: "#64748b", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 14 }}>← Previous</button>
            )}
            {activeSection < sections.length - 1 ? (
              <button onClick={() => setActiveSection(s => s + 1)} style={{ flex: 1, padding: "13px", background: accent, border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 6px 20px ${accent}35` }}>
                Next: {sections[activeSection + 1].emoji} {sections[activeSection + 1].title} →
              </button>
            ) : (
              <button onClick={() => setActiveTab("practice")} style={{ flex: 1, padding: "13px", background: accent, border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 6px 20px ${accent}35` }}>
                Ready to practice? Let's go →
              </button>
            )}
          </div>
        </div>
      )}

      {/* PRACTICE */}
      {activeTab === "practice" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          {/* Recap */}
          <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "24px 28px", marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Quick Recap</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
              {[
                ["HTML is", "the skeleton of every webpage"],
                ["Tags look like", "<opening> content </closing>"],
                ["Page structure", "html → head + body"],
                ["Most used tags", "h1, h2, p, a, img, div"],
                ["Common mistake", "forgetting closing tags"],
                ["Indentation", "not required but essential"],
              ].map(([k, v], i) => (
                <div key={i} style={{ background: light, borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 13, color: "#334155", fontWeight: 500, lineHeight: 1.4 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Task */}
          <div style={{ background: "#fff", border: `1.5px solid ${accent}30`, borderRadius: 20, padding: "24px 28px", marginBottom: 16, borderLeft: `4px solid ${accent}` }}>
            <div style={{ fontSize: 11, color: accent, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Your Task</div>
            <p style={{ fontSize: 16, color: "#1e293b", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 600 }}>
              Build the HTML structure for a personal portfolio page.
            </p>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", fontWeight: 500 }}>
              Your page must include:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {[
                "A proper HTML structure (DOCTYPE, html, head, body)",
                "A page title in the <head>",
                "Your name as the main heading (h1)",
                "A short bio paragraph (p)",
                "At least 2 links to your social profiles (a)",
                "A section with 3 skills you want to learn (h2 + list or paragraphs)",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: light, border: `1.5px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: accent, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.5, fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 16px", background: "#f8fafc", borderRadius: 12, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
              💡 <strong>Hint:</strong> Start with the skeleton (DOCTYPE → html → head → body), then fill in the content. Don't worry about it looking good — that's CSS's job. Focus on correct structure.
            </div>
          </div>

          <textarea value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder={`<!DOCTYPE html>\n<html>\n  ...\n</html>`}
            style={{ width: "100%", minHeight: 200, background: "#0f172a", border: "1.5px solid #1e293b", borderRadius: 16, padding: "16px 20px", color: "#e2e8f0", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "'Fira Code', 'Courier New', monospace", lineHeight: 1.75, transition: "border .2s" }}
            onFocus={e => e.target.style.borderColor = `${accent}80`}
            onBlur={e => e.target.style.borderColor = "#1e293b"}/>

          <button onClick={() => {}} disabled={!answer.trim()} style={{ marginTop: 12, width: "100%", padding: "14px", background: answer.trim() ? accent : "#f1f5f9", border: "none", borderRadius: 14, color: answer.trim() ? "#fff" : "#94a3b8", fontWeight: 800, fontSize: 15, cursor: answer.trim() ? "pointer" : "default", fontFamily: "inherit", boxShadow: answer.trim() ? `0 8px 24px ${accent}35` : "none", transition: "all .2s" }}>
            Get Feedback from AI Mentor →
          </button>

          <div style={{ marginTop: 20, padding: "16px 20px", background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 14, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
            <strong style={{ color: "#334155" }}>What the mentor will look at:</strong> correct document structure · proper tag nesting · right tag choices · indentation · attributes used correctly
          </div>
        </div>
      )}

      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #e8e8f0; border-radius: 3px; }`}</style>
    </div>
  );
}
