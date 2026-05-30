import { useState } from "react";

const accent = "#8b5cf6";
const light = "#f5f3ff";

const TOOLS = [
  {
    category: "Version Control",
    color: "#f97316",
    bg: "#fff7ed",
    border: "rgba(249,115,22,0.25)",
    desc: "Track every change in your code. Roll back to any point in time.",
    tools: [
      { name: "Git", desc: "The standard. Every developer uses it.", used: "Everywhere" },
      { name: "GitHub", desc: "Store your code online. Collaborate with teams.", used: "90% of companies" },
    ]
  },
  {
    category: "Containerisation",
    color: "#0891b2",
    bg: "#ecfeff",
    border: "rgba(8,145,178,0.25)",
    desc: "Package your app so it runs the same everywhere — your laptop, staging, production.",
    tools: [
      { name: "Docker", desc: "Pack your app + all its dependencies into a box.", used: "Standard" },
      { name: "Kubernetes", desc: "Manage thousands of Docker containers at once.", used: "Large scale" },
    ]
  },
  {
    category: "CI/CD",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "rgba(139,92,246,0.25)",
    desc: "Automatically test and deploy your code every time you make a change.",
    tools: [
      { name: "GitHub Actions", desc: "Automate testing & deployment from GitHub.", used: "Most popular" },
      { name: "Jenkins", desc: "Older but powerful CI/CD automation tool.", used: "Enterprise" },
    ]
  },
  {
    category: "Cloud",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "rgba(245,158,11,0.25)",
    desc: "Run your servers in the cloud instead of buying physical hardware.",
    tools: [
      { name: "AWS", desc: "Amazon's cloud. The biggest, most used.", used: "#1 worldwide" },
      { name: "GCP / Azure", desc: "Google and Microsoft's clouds.", used: "Enterprise" },
    ]
  },
  {
    category: "Monitoring",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "rgba(16,185,129,0.25)",
    desc: "Know when something breaks — before your users tell you.",
    tools: [
      { name: "Grafana", desc: "Beautiful dashboards for your server metrics.", used: "Standard" },
      { name: "Sentry", desc: "Catch errors in real-time.", used: "Every startup" },
    ]
  },
  {
    category: "Infrastructure as Code",
    color: "#ec4899",
    bg: "#fdf2f8",
    border: "rgba(236,72,153,0.25)",
    desc: "Define your entire infrastructure in code files — reproducible, version-controlled.",
    tools: [
      { name: "Terraform", desc: "Create cloud infrastructure with code.", used: "Industry standard" },
      { name: "Ansible", desc: "Automate server configuration.", used: "Ops teams" },
    ]
  },
];

const TERMINAL_COMMANDS = [
  { cmd: "ls", desc: "List files in current directory", output: "app.py  requirements.txt  Dockerfile  README.md", hint: "Like opening a folder on your desktop" },
  { cmd: "pwd", desc: "Show current directory path", output: "/home/user/my-app", hint: "Where am I on the server right now?" },
  { cmd: "cat README.md", desc: "Read a file", output: "# My App\nA simple web application.\n\nRun with: python app.py", hint: "Print file contents to screen" },
  { cmd: "ps aux", desc: "Show running processes", output: "USER  PID  %CPU  %MEM  COMMAND\nroot    1   0.0   0.1  python app.py\nnginx  42   0.1   0.2  nginx: master", hint: "See everything currently running on the server" },
  { cmd: "df -h", desc: "Check disk space", output: "Filesystem  Size  Used  Avail  Use%\n/dev/sda1   50G   12G    38G   24%", hint: "How full is the server's hard drive?" },
  { cmd: "curl localhost:8000", desc: "Make an HTTP request", output: '{"status":"ok","message":"App is running!"}', hint: "Test if your app is responding" },
];

export default function DevOpsLesson1() {
  const [step, setStep] = useState(0);
  const [activeTool, setActiveTool] = useState(null);
  const [terminalHistory, setTerminalHistory] = useState([
    { type: "system", text: "Welcome to Defy Terminal — your first Linux server 🖥️" },
    { type: "system", text: "Try the commands on the right. Type them in or click to auto-fill." },
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
        : { type: "error", text: `bash: ${cmd}: command not found\nTry one of the commands from the list →` }
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
    if (s < 2) setTimeout(() => setStep(s + 1), 400);
  };

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
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>DevOps / Cloud — The Profession</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Lesson 1 · 75 XP</div>
          </div>
          <div style={{ marginLeft: "auto", background: light, border: `1px solid ${accent}20`, borderRadius: 100, padding: "4px 12px", fontSize: 11, color: accent, fontWeight: 700, flexShrink: 0 }}>
            {completed.length}/3 done
          </div>
        </div>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 10px", display: "flex", gap: 6, overflowX: "auto" }}>
          {["1. What is DevOps?", "2. Your first terminal", "3. Your first Dockerfile"].map((label, i) => (
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

        {/* ═══ STEP 0: WHAT IS DEVOPS ══════════════════════════ */}
        {step === 0 && (
          <div>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>The Profession</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>Bad deployments cost<br/><span style={{ color: accent }}>billions. DevOps prevents that.</span></h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>These aren't hypothetical risks. These are real disasters that happened to real companies — because they didn't have proper DevOps practices.</p>
            </div>

            {/* Real disaster stories */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Real stories. Real consequences.</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>Click each story to see what went wrong — and how DevOps would have prevented it.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {[
                  { company: "Knight Capital", icon: "💸", color: "#ef4444" },
                  { company: "GitLab", icon: "🗄️", color: "#f59e0b" },
                  { company: "Amazon", icon: "📦", color: "#10b981" },
                  { company: "Netflix", icon: "🎬", color: "#8b5cf6" },
                ].map((s, i) => (
                  <button key={i} onClick={() => setBeforeAfter(s.company)}
                    style={{ padding: "8px 16px", borderRadius: 100, border: `1.5px solid ${beforeAfter === s.company ? s.color : "#e8e8f0"}`, background: beforeAfter === s.company ? `${s.color}15` : "transparent", color: beforeAfter === s.company ? s.color : "#64748b", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: beforeAfter === s.company ? 700 : 500, display: "flex", alignItems: "center", gap: 6, transition: "all .15s" }}>
                    <span>{s.icon}</span> {s.company}
                  </button>
                ))}
              </div>

              {beforeAfter === "Knight Capital" && (
                <div style={{ background: "#fff1f2", border: "1.5px solid #fecaca", borderRadius: 18, padding: "24px 28px" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#dc2626", marginBottom: 8 }}>💸 Knight Capital lost $440 million in 45 minutes</div>
                  <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: "0 0 20px" }}>August 1, 2012. Knight Capital deployed new trading software to their servers. But one engineer forgot to update the code on one of the eight servers. That single server was still running old code from 2003 — an abandoned feature called "Power Peg" that was never meant to be activated.<br/><br/>When the market opened, that one server went rogue. It started buying and selling stocks at a loss, millions of times per minute. By the time someone found the kill switch — 45 minutes later — the company had lost $440 million.<br/><br/>Knight Capital was sold 3 months later. The entire company, destroyed by one missed deployment step.</p>
                  <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#dc2626", marginBottom: 8 }}>How DevOps would have prevented this:</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {["Automated deployment would push to ALL servers simultaneously — no human error", "Health checks would detect the rogue server immediately", "Feature flags would allow instant rollback without redeployment", "Canary deployment would test on 1 server before rolling out to all 8"].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#475569" }}><span style={{ color: "#10b981", fontWeight: 700 }}>✓</span>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {beforeAfter === "GitLab" && (
                <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 18, padding: "24px 28px" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#d97706", marginBottom: 8 }}>🗄️ GitLab accidentally deleted their production database</div>
                  <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: "0 0 20px" }}>January 31, 2017. A GitLab engineer was fighting a spam attack at 11pm and was exhausted. He ran a cleanup command — but on the production database instead of the staging database. In seconds, 300GB of customer data was gone.<br/><br/>They scrambled to restore from backups. That's when they discovered: none of the backup systems were actually working. Five different backup methods — all failed.<br/><br/>GitLab lost 6 hours of data for all their users. They streamed the entire disaster live on YouTube. 18 hours of downtime. The engineer publicly apologised.</p>
                  <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#d97706", marginBottom: 8 }}>How DevOps would have prevented this:</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {["Environment separation — prod commands require extra confirmation", "Automated backup testing — restore drills every week", "Database access controls — destructive commands require two people", "Monitoring alerts — data deletion triggers immediate alarm"].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#475569" }}><span style={{ color: "#10b981", fontWeight: 700 }}>✓</span>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {beforeAfter === "Amazon" && (
                <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 18, padding: "24px 28px" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#16a34a", marginBottom: 8 }}>📦 How Amazon went from 1 deploy/day to 1 deploy/11 seconds</div>
                  <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: "0 0 20px" }}>In 2010, Amazon was one giant application — millions of lines of code, hundreds of engineers, deployments that took days and terrified everyone.<br/><br/>They made a radical decision: break the monolith into hundreds of small, independent services (microservices). Each team owns their service, deploys independently, and is responsible for keeping it running — "you build it, you run it."<br/><br/>They also built internal tools to automate everything: testing, deployment, rollback, monitoring. The result: Amazon can now deploy to production over 50 million times per year — once every 0.6 seconds. A single engineer can deploy a change and have it live for millions of users within minutes.</p>
                  <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#16a34a", marginBottom: 8 }}>The DevOps practices that made this possible:</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {["Microservices — small, independent deployable units", "CI/CD pipelines — every commit automatically tested and deployed", "Blue/green deployments — zero downtime, instant rollback", "Chaos engineering — intentionally break things to find weaknesses"].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#475569" }}><span style={{ color: "#10b981", fontWeight: 700 }}>✓</span>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {beforeAfter === "Netflix" && (
                <div style={{ background: light, border: `1.5px solid ${accent}30`, borderRadius: 18, padding: "24px 28px" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: accent, marginBottom: 8 }}>🎬 Netflix intentionally breaks its own servers</div>
                  <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: "0 0 20px" }}>In 2010, Netflix moved to AWS cloud. Shortly after, an AWS outage took down Netflix for hours. Millions of subscribers couldn't watch anything.<br/><br/>Netflix's response was counterintuitive: they built a tool called Chaos Monkey. Its entire job is to randomly kill servers and services in production — during business hours. On purpose.<br/><br/>The logic: if your system can survive random failures in normal operation, it can survive any outage. They also built Chaos Gorilla (kills entire availability zones) and Chaos Kong (kills entire AWS regions).<br/><br/>Today Netflix has 99.99% uptime despite running on infrastructure that breaks constantly. Because they've broken everything first and fixed it.</p>
                  <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: accent, marginBottom: 8 }}>The lesson for DevOps:</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {["Resilience by design — assume everything will fail, build for it", "Chaos engineering — test failure scenarios before they happen in real life", "Graceful degradation — when part breaks, rest keeps working", "Auto-healing — systems detect and fix themselves without human intervention"].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#475569" }}><span style={{ color: accent, fontWeight: 700 }}>✓</span>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!["Knight Capital","GitLab","Amazon","Netflix"].includes(beforeAfter) && (
                <div style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: 16, padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                  Click a company above to see their story 👆
                </div>
              )}
            </div>

            {/* Before / After mindset */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>The mindset shift</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>DevOps isn't just tools. It's a completely different way of thinking about software delivery.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#ef4444", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Old way 😰</div>
                  {["Deploy once a month — massive, terrifying release", "\"It worked on my machine\" — different environments", "Dev writes code, Ops runs it — blame game when it breaks", "Manual deployments at 2am — hope nothing goes wrong", "Nobody touches production — too scared"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, padding: "10px 14px", background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 10, fontSize: 13, color: "#475569", alignItems: "flex-start" }}>
                      <span style={{ color: "#ef4444", fontWeight: 700, flexShrink: 0 }}>✗</span>{item}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#10b981", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>DevOps way 🚀</div>
                  {["Deploy dozens of times a day — small changes, low risk", "Docker containers — identical everywhere, no surprises", "One team owns full lifecycle — you build it, you run it", "Automated pipelines — push code, pipeline does the rest", "Deploy confidently — instant rollback if something breaks"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, fontSize: 13, color: "#475569", alignItems: "flex-start" }}>
                      <span style={{ color: "#10b981", fontWeight: 700, flexShrink: 0 }}>✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Day in the life */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>A day in the life of a DevOps engineer</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>Not as scary as it sounds.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { time: "9:00", task: "Check monitoring dashboards", detail: "Are all services healthy? Any alerts overnight?" },
                  { time: "10:00", task: "Review failed CI/CD pipeline", detail: "Why did the automated tests fail? Fix the config." },
                  { time: "11:30", task: "Write Terraform code", detail: "Spin up new servers for the upcoming launch." },
                  { time: "14:00", task: "Help dev team with Docker", detail: "Their app won't start. Fix the Dockerfile." },
                  { time: "15:30", task: "Deploy new version", detail: "Push button. Watch automated pipeline run. Done in 3 minutes." },
                  { time: "17:00", task: "Write runbooks", detail: "Document how to fix common issues so anyone can do it." },
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

            {/* Tools overview */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>The DevOps toolbox</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>6 categories. You don't need to know all of these on day one — but you need to know they exist. Click each to learn more.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: activeTool !== null ? 16 : 0 }}>
                {TOOLS.map((t, i) => (
                  <div key={i} onClick={() => setActiveTool(activeTool === i ? null : i)}
                    style={{ background: activeTool === i ? t.bg : "#f8fafc", border: `1.5px solid ${activeTool === i ? t.color : "#e8e8f0"}`, borderRadius: 14, padding: "16px", cursor: "pointer", transition: "all .15s" }}
                    onMouseEnter={e => { if (activeTool !== i) e.currentTarget.style.borderColor = t.border; }}
                    onMouseLeave={e => { if (activeTool !== i) e.currentTarget.style.borderColor = "#e8e8f0"; }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: activeTool === i ? t.color : "#0f172a", marginBottom: 4 }}>{t.category}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>{t.tools.map(tool => tool.name).join(" · ")}</div>
                  </div>
                ))}
              </div>
              {activeTool !== null && (
                <div style={{ background: TOOLS[activeTool].bg, border: `1.5px solid ${TOOLS[activeTool].border}`, borderRadius: 16, padding: "20px 24px" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TOOLS[activeTool].color, marginBottom: 8 }}>{TOOLS[activeTool].category}</div>
                  <p style={{ fontSize: 14, color: "#475569", margin: "0 0 16px", lineHeight: 1.6 }}>{TOOLS[activeTool].desc}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {TOOLS[activeTool].tools.map((tool, j) => (
                      <div key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", borderRadius: 12, padding: "12px 14px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 3 }}>{tool.name}</div>
                          <div style={{ fontSize: 13, color: "#64748b" }}>{tool.desc}</div>
                        </div>
                        <div style={{ background: TOOLS[activeTool].bg, border: `1px solid ${TOOLS[activeTool].border}`, borderRadius: 100, padding: "3px 10px", fontSize: 11, color: TOOLS[activeTool].color, fontWeight: 700, flexShrink: 0 }}>{tool.used}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Salary */}
            <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 16, padding: "18px 22px", marginBottom: 24, display: "flex", gap: 14 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>💰</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }}>Why DevOps engineers are well paid</div>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>When production breaks, the company loses money every second. Knight Capital lost $440M in 45 minutes. DevOps engineers are the ones who prevent this. Salaries range from <strong>$3,000 to $12,000/mo</strong> — senior cloud architects earn even more.</p>
              </div>
            </div>

            <button onClick={() => completeStep(0)}
              style={{ width: "100%", padding: "14px", background: accent, border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}35` }}>
              Now let me try a real terminal →
            </button>
          </div>
        )}

        {/* ═══ STEP 1: TERMINAL ════════════════════════════════ */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>Your First Terminal</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>96% of servers run Linux.<br/><span style={{ color: accent }}>This is how you talk to them.</span></h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>No mouse. No icons. Just you and a black screen. Scary at first — but after 10 minutes it feels like a superpower. Try the commands below.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
              {/* Terminal */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* Window chrome */}
                <div style={{ background: "#1e293b", borderRadius: "14px 14px 0 0", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }}/>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }}/>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }}/>
                  <div style={{ fontSize: 11, color: "#64748b", marginLeft: 8, fontFamily: "monospace" }}>user@defy-server:~$</div>
                </div>
                {/* Terminal body */}
                <div style={{ background: "#0f172a", flex: 1, padding: "16px", fontFamily: "'Fira Code','Courier New',monospace", fontSize: 13, lineHeight: 1.8, minHeight: 320, overflowY: "auto" }}>
                  {terminalHistory.map((item, i) => (
                    <div key={i} style={{ marginBottom: 4 }}>
                      {item.type === "system" && <div style={{ color: "#475569", fontStyle: "italic" }}>// {item.text}</div>}
                      {item.type === "input" && <div style={{ color: "#86efac" }}>$ {item.text}</div>}
                      {item.type === "output" && <div style={{ color: "#e2e8f0", whiteSpace: "pre-wrap" }}>{item.text}</div>}
                      {item.type === "error" && <div style={{ color: "#f87171", whiteSpace: "pre-wrap" }}>{item.text}</div>}
                    </div>
                  ))}
                  {/* Input line */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{ color: "#86efac" }}>$</span>
                    <input value={termInput} onChange={e => setTermInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && termInput.trim()) runCommand(termInput); }}
                      placeholder="type a command..."
                      style={{ flex: 1, background: "transparent", border: "none", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit" }}
                      autoFocus/>
                  </div>
                </div>
                <div style={{ background: "#1e293b", borderRadius: "0 0 14px 14px", padding: "8px 16px", fontSize: 11, color: "#475569", fontFamily: "monospace" }}>
                  Press Enter to run · Click any command on the right to auto-fill
                </div>
              </div>

              {/* Commands reference */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Available commands — click to try:</div>
                {TERMINAL_COMMANDS.map((c, i) => (
                  <div key={i} onClick={() => { setTermInput(c.cmd); }}
                    style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 12, padding: "12px 14px", cursor: "pointer", transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}50`; e.currentTarget.style.background = light; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e8f0"; e.currentTarget.style.background = "#fff"; }}>
                    <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: accent, marginBottom: 4 }}>{c.cmd}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{c.desc}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>💡 {c.hint}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#78350f", margin: 0, lineHeight: 1.6 }}>
                <strong>Real talk:</strong> These same commands run on every Linux server in the world — AWS, Google Cloud, your startup's production server. Learn these 6 and you can navigate any server on the planet.
              </p>
            </div>

            <button onClick={() => completeStep(1)}
              style={{ width: "100%", padding: "14px", background: accent, border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}35` }}>
              Now let's containerise something →
            </button>
          </div>
        )}

        {/* ═══ STEP 2: DOCKERFILE ══════════════════════════════ */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>Your First Dockerfile</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>Docker — the most important<br/><span style={{ color: accent }}>DevOps tool you'll learn.</span></h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>Docker packages your app into a container — a box that runs identically everywhere. No more "it works on my machine".</p>
            </div>

            {/* What is Docker */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Docker — the shipping container for software</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>Before Docker existed, deploying software was a nightmare. Here's the real story.</p>

              {/* The problem */}
              <div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#dc2626", marginBottom: 12 }}>😱 The "works on my machine" problem — before Docker</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "Developer builds app on Mac with Python 3.9, specific library versions, a local database",
                    "Sends code to colleague — \"it doesn't work\" — colleague has Python 3.7 and different libraries",
                    "Deploy to staging server — breaks again — server has Ubuntu, developer has macOS",
                    "Deploy to production — breaks again — production has different environment variables set",
                    "3 days of debugging environment issues instead of building features",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "#475569", alignItems: "flex-start" }}>
                      <span style={{ color: "#ef4444", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>{item}
                    </div>
                  ))}
                </div>
              </div>

              {/* The solution */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#16a34a", marginBottom: 12 }}>🐳 Docker's solution — a container with everything inside</div>
                <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, margin: "0 0 12px" }}>
                  Think of a shipping container. Before shipping containers, loading cargo was chaos — every ship, every port, different systems. Then someone standardised the box. Now any crane can load any container onto any ship.
                </p>
                <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, margin: 0 }}>
                  Docker does the same for software. You pack your app + Python + all libraries + all config into one standard box (container). That box runs identically on your laptop, your colleague's Windows PC, the staging server in Germany, and AWS production in the US.
                </p>
              </div>

              {/* What's inside a container */}
              <div style={{ background: "#0f172a", borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>What lives inside a Docker container</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { item: "Your app code", icon: "📝", desc: "app.py, index.js — whatever you wrote" },
                    { item: "Runtime", icon: "⚙️", desc: "Python 3.11, Node.js 18 — exact version" },
                    { item: "Dependencies", icon: "📦", desc: "All libraries, exact versions, no surprises" },
                    { item: "Environment config", icon: "🔧", desc: "Environment variables, ports, settings" },
                    { item: "OS layer", icon: "🐧", desc: "Minimal Linux — just enough to run" },
                    { item: "Start command", icon: "▶️", desc: "Exactly how to start your app" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.05)", borderRadius: 10 }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{item.item}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key benefits */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                  { icon: "📦", title: "Packages everything", desc: "Your code + Python + all libraries + config — all in one box. Nothing left out." },
                  { icon: "🔄", title: "Runs the same everywhere", desc: "Laptop, server, cloud — identical. The \"works on my machine\" problem disappears forever." },
                  { icon: "⚡", title: "Starts in seconds", desc: "Containers start instantly. Scale from 1 to 1000 instances in minutes on any cloud." },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 14, padding: "18px" }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dockerfile anatomy */}
            <div style={{ background: "#0f172a", borderRadius: 20, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>A typical Dockerfile — explained</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { code: "FROM python:3.11-slim", color: "#f9a8d4", meaning: "Start from an official Python image — like a clean computer with Python installed" },
                  { code: "WORKDIR /app", color: "#7dd3fc", meaning: "Create a folder called /app and work inside it" },
                  { code: "COPY requirements.txt .", color: "#86efac", meaning: "Copy the list of libraries your app needs" },
                  { code: "RUN pip install -r requirements.txt", color: "#fcd34d", meaning: "Install all those libraries inside the container" },
                  { code: "COPY . .", color: "#86efac", meaning: "Copy all your app code into the container" },
                  { code: "CMD [\"python\", \"app.py\"]", color: "#a78bfa", meaning: "When the container starts, run this command" },
                ].map((line, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "center" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 12, color: line.color, padding: "6px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 8 }}>{line.code}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>→ {line.meaning}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Dockerfile */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Now generate your own</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5 }}>Describe your app in plain English. We'll write the Dockerfile and explain every line.</p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {["A Python Flask web app", "A Node.js REST API", "A React frontend app", "A data science Jupyter notebook"].map((idea, i) => (
                  <button key={i} onClick={() => setDockerIdea(idea)}
                    style={{ padding: "6px 14px", background: light, border: `1px solid ${accent}20`, borderRadius: 100, color: accent, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600 }}>
                    {idea}
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <textarea value={dockerIdea} onChange={e => setDockerIdea(e.target.value)}
                    placeholder="e.g. A Python app that serves a REST API with FastAPI"
                    style={{ width: "100%", height: 100, background: "#f8fafc", border: "1.5px solid #e8e8f0", borderRadius: 12, padding: "12px 14px", color: "#0f172a", fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.65, boxSizing: "border-box", transition: "border .2s" }}
                    onFocus={e => e.target.style.borderColor = `${accent}80`}
                    onBlur={e => e.target.style.borderColor = "#e8e8f0"}/>
                  <button onClick={generateDockerfile} disabled={!dockerIdea.trim() || dockerLoading}
                    style={{ marginTop: 10, width: "100%", padding: "12px", background: dockerIdea.trim() ? accent : "#f1f5f9", border: "none", borderRadius: 12, color: dockerIdea.trim() ? "#fff" : "#94a3b8", fontWeight: 800, fontSize: 14, cursor: dockerIdea.trim() ? "pointer" : "default", fontFamily: "inherit", boxShadow: dockerIdea.trim() ? `0 6px 20px ${accent}35` : "none", transition: "all .2s" }}>
                    {dockerLoading ? "Generating Dockerfile..." : "Generate Dockerfile →"}
                  </button>
                </div>

                <div>
                  {dockerLoading && (
                    <div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 12, padding: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {[0,1,2].map(j => <div key={j} style={{ width: 8, height: 8, borderRadius: "50%", background: accent, animation: `pulse 1.2s ease-in-out ${j*.2}s infinite` }}/>)}
                      </div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>Writing your Dockerfile...</div>
                    </div>
                  )}
                  {dockerfile && !dockerfile.error && (
                    <div>
                      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                        📦 {dockerfile.what_it_does}
                      </div>
                      <div style={{ background: "#0f172a", borderRadius: 10, padding: "14px", fontFamily: "monospace", fontSize: 12, color: "#86efac", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                        {dockerfile.dockerfile}
                      </div>
                    </div>
                  )}
                  {dockerfile?.error && (
                    <div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 12, padding: "16px", color: "#dc2626", fontSize: 13 }}>
                      Something went wrong. Try again!
                    </div>
                  )}
                  {!dockerLoading && !dockerfile && (
                    <div style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: 12, padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#cbd5e1" }}>
                      <div style={{ fontSize: 36 }}>🐳</div>
                      <div style={{ fontSize: 13 }}>Your Dockerfile appears here</div>
                    </div>
                  )}
                </div>
              </div>

              {dockerfile && !dockerfile.error && dockerfile.explanation && (
                <div style={{ marginTop: 16, background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 14, padding: "18px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Line by line</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {dockerfile.explanation.map((item, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div style={{ background: "#0f172a", borderRadius: 8, padding: "7px 10px", fontFamily: "monospace", fontSize: 11, color: "#7dd3fc" }}>{item.line}</div>
                        <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, paddingTop: 2 }}>→ {item.meaning}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {dockerfile && !dockerfile.error && (
              <div>
                <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 16, padding: "18px 22px", marginBottom: 16, display: "flex", gap: 14 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>🎉</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }}>You just wrote your first Dockerfile.</div>
                    <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>This file, combined with Docker, means your app can run on any server in the world in seconds. That's the power of containerisation — and now you understand it.</p>
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
                <div style={{ fontSize: 15, color: "#475569", marginBottom: 20 }}>You earned 75 XP and got your first real taste of DevOps.</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  {["What DevOps is", "6 tool categories", "Linux terminal", "Docker concepts", "Wrote a Dockerfile"].map((s, i) => (
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
