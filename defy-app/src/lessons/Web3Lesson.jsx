import { useState } from "react";

const accent = "#8b5cf6";
const light = "#f5f3ff";

const WEB_EVOLUTION = [
  {
    era: "Web1",
    years: "1991–2004",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
    headline: "Read-only internet",
    desc: "Static pages. You could only consume content, not create it. No accounts, no interaction. Like a digital newspaper.",
    examples: ["Static HTML pages", "Early Yahoo, AltaVista", "You read, someone else writes"],
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
    desc: "Social media, apps, user-generated content. You can create and share. But there's a catch: corporations own everything you create.",
    examples: ["Facebook, Instagram, YouTube", "Google, Amazon, Apple", "Your posts, photos, data — owned by the platform"],
    power: "Big Tech companies",
    your_data: "Owned by the platform. Monetised without your consent. Can be deleted anytime.",
  },
  {
    era: "Web3",
    years: "2015–future",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    headline: "Read-write-own internet",
    desc: "Decentralised. You own your data, your identity, your digital assets. No single company controls the rules. Code replaces middlemen.",
    examples: ["Ethereum, Solana blockchains", "DeFi, NFTs, DAOs", "Your wallet = your identity, owned by you"],
    power: "Distributed — no single owner",
    your_data: "Owned by you. On the blockchain. No one can take it away.",
  },
];

const REAL_USE_CASES = [
  {
    category: "Finance without banks",
    icon: "🏦",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    headline: "Sending $1M internationally in 10 seconds for $0.50",
    story: "Traditional wire transfer: 3–5 business days, $25–50 fee, requires bank account, can be blocked or frozen.\n\nWith a crypto wallet: send any amount, anywhere, in seconds, for cents. No bank needed. No permission required. Can't be stopped.\n\nIn 2022, Ukraine received $100M in crypto donations in days when traditional banking was disrupted by the war. The blockchain didn't care about geopolitics.",
    impact: "1.7 billion unbanked people worldwide can now access financial services"
  },
  {
    category: "Art & Ownership",
    icon: "🎨",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    headline: "Digital artist makes $69M from a JPEG",
    story: "Beeple, a digital artist, spent 13 years making one piece of art per day. He sold them for $100 each.\n\nIn March 2021, he minted his work as an NFT and sold it at Christie's for $69 million.\n\nBefore blockchain, digital art could be copied infinitely — there was no concept of 'original'. NFTs created provable scarcity and ownership on-chain.\n\nMore importantly: royalties. Every time an NFT resells, the original creator automatically gets a percentage — enforced by the smart contract, forever.",
    impact: "Artists can now earn royalties on secondary sales — something impossible with traditional art"
  },
  {
    category: "Organisations without bosses",
    icon: "🗳️",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    headline: "A $10B fund run by anonymous internet strangers",
    story: "MakerDAO is a financial protocol managing over $10 billion in assets. It has no CEO, no board, no headquarters.\n\nDecisions are made by token holders voting on proposals. Code executes the results automatically. No human can override the rules — they're written in smart contracts.\n\nThis is a DAO (Decentralised Autonomous Organisation). It's like a company where the rules are code, shareholders vote on everything, and nobody can be fired or corrupt the system.",
    impact: "New organisational structure: companies run by code, owned by participants"
  },
  {
    category: "Contracts without lawyers",
    icon: "📜",
    color: "#ef4444",
    bg: "#fff1f2",
    border: "#fecaca",
    headline: "A vending machine that can't lie, cheat, or be bribed",
    story: "Vitalik Buterin, Ethereum's creator, described smart contracts with a vending machine analogy:\n\nYou put money in, press a button, get a snack. The machine doesn't have feelings, can't be bribed, doesn't have a bad day. It executes its rules exactly, every time.\n\nSmart contracts work the same way. They're code that lives on the blockchain and executes automatically when conditions are met — without any human involvement.\n\nReal example: Uniswap, a decentralised exchange with $1B+ daily volume, has no employees handling trades. Pure code.",
    impact: "Eliminates middlemen (lawyers, banks, notaries) for any agreement that can be coded"
  },
];

const FAKE_TRANSACTIONS = [
  { hash: "0x4a9f...3e2b", from: "0xd3CdA...91F3", to: "0x742E...Fc32", value: "0.5 ETH", time: "2 mins ago", type: "Transfer" },
  { hash: "0x7b2c...8f4a", from: "0xA4B5...2C1D", to: "Uniswap V3", value: "1,200 USDC", time: "5 mins ago", type: "Swap" },
  { hash: "0x1e3d...7c9b", from: "0x91A3...4F2E", to: "0x3B6D...8A1C", value: "0.01 ETH", time: "8 mins ago", type: "NFT Sale" },
  { hash: "0x9f4e...2a7c", from: "0x5C2A...9D4B", to: "Aave Protocol", value: "5,000 USDC", time: "12 mins ago", type: "Deposit" },
  { hash: "0x2c8b...5e1f", from: "0x8E1F...3C7A", to: "0xF4D2...6B9E", value: "2.3 ETH", time: "15 mins ago", type: "Transfer" },
];

const FAKE_BLOCKS = [
  { number: "19847234", transactions: 187, miner: "0x95222...7534", reward: "0.063 ETH", time: "12 secs ago" },
  { number: "19847233", transactions: 203, miner: "0x4838...3823", reward: "0.071 ETH", time: "24 secs ago" },
  { number: "19847232", transactions: 156, miner: "0x1f9090...aa72", reward: "0.058 ETH", time: "36 secs ago" },
];

export default function Web3Lesson1() {
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
          system: `You are a Web3 teacher for absolute beginners. Create a simple Solidity smart contract.
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
          messages: [{ role: "user", content: `Create a simple smart contract for: ${contractIdea}` }]
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
    if (s < 2) setTimeout(() => setStep(s + 1), 400);
  };

  const era = WEB_EVOLUTION.find(e => e.era === activeEra);
  const useCase = REAL_USE_CASES[activeCase];

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
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Web3 / Blockchain — The New Internet</div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Lesson 1 · 75 XP</div>
          </div>
          <div style={{ marginLeft: "auto", background: light, border: `1px solid ${accent}20`, borderRadius: 100, padding: "4px 12px", fontSize: 11, color: accent, fontWeight: 700, flexShrink: 0 }}>
            {completed.length}/3 done
          </div>
        </div>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 10px", display: "flex", gap: 6, overflowX: "auto" }}>
          {["1. What is Web3?", "2. Live blockchain explorer", "3. Your first smart contract"].map((label, i) => (
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

        {/* ═══ STEP 0: WHAT IS WEB3 ════════════════════════════ */}
        {step === 0 && (
          <div>
            <div style={{ marginBottom: 36 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>The New Internet</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>Web3 isn't about crypto.<br/><span style={{ color: accent }}>It's about who owns the internet.</span></h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>Right now, five companies control most of the internet. Web3 is an attempt to change that — to build an internet where users own their data, their identity, and their digital assets.</p>
            </div>

            {/* Web evolution */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>The internet has had 3 eras. We're entering the third.</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>Click each era to understand the shift.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                {WEB_EVOLUTION.map(w => (
                  <div key={w.era} onClick={() => setActiveEra(w.era)}
                    style={{ background: activeEra === w.era ? w.bg : "#f8fafc", border: `2px solid ${activeEra === w.era ? w.color : "#e8e8f0"}`, borderRadius: 16, padding: "20px", cursor: "pointer", transition: "all .2s", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: activeEra === w.era ? w.color : "#94a3b8", marginBottom: 4 }}>{w.era}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>{w.years}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: activeEra === w.era ? "#0f172a" : "#64748b" }}>{w.headline}</div>
                  </div>
                ))}
              </div>

              {era && (
                <div style={{ background: era.bg, border: `1.5px solid ${era.border}`, borderRadius: 16, padding: "22px 26px", transition: "all .3s" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: era.color, marginBottom: 10 }}>{era.era}: {era.headline}</div>
                  <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.75, margin: "0 0 18px", fontWeight: 500 }}>{era.desc}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div style={{ background: "#fff", borderRadius: 12, padding: "14px" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Examples</div>
                      {era.examples.map((e, i) => <div key={i} style={{ fontSize: 12, color: "#475569", marginBottom: 4, lineHeight: 1.4 }}>• {e}</div>)}
                    </div>
                    <div style={{ background: "#fff", borderRadius: 12, padding: "14px" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Power held by</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: era.color }}>{era.power}</div>
                    </div>
                    <div style={{ background: "#fff", borderRadius: 12, padding: "14px" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Your data</div>
                      <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{era.your_data}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Real use cases */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Real use cases. Not speculation.</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>Web3 is already changing these industries. Click each to see the real story.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {REAL_USE_CASES.map((c, i) => (
                  <button key={i} onClick={() => setActiveCase(i)}
                    style={{ padding: "8px 16px", borderRadius: 100, border: `1.5px solid ${activeCase === i ? c.color : "#e8e8f0"}`, background: activeCase === i ? c.bg : "transparent", color: activeCase === i ? c.color : "#64748b", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: activeCase === i ? 700 : 500, display: "flex", alignItems: "center", gap: 6, transition: "all .15s" }}>
                    <span>{c.icon}</span> {c.category}
                  </button>
                ))}
              </div>
              <div style={{ background: useCase.bg, border: `1.5px solid ${useCase.border}`, borderRadius: 18, padding: "24px 28px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: useCase.color, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{useCase.category}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", marginBottom: 16, letterSpacing: -0.5 }}>{useCase.headline}</div>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.8, margin: "0 0 18px", whiteSpace: "pre-line", fontWeight: 500 }}>{useCase.story}</p>
                <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>🌍</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: useCase.color, marginBottom: 3 }}>Bigger picture</div>
                    <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{useCase.impact}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Day in the life */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>A day in the life of a Web3 developer</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.5 }}>The highest-paid developers in tech. Here's why.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { time: "9:00", task: "Audit a smart contract", detail: "One bug can drain millions. Review every line before deployment." },
                  { time: "10:30", task: "Write Solidity code", detail: "Build the logic for a DeFi protocol. Handle edge cases — there are no refunds on blockchain." },
                  { time: "13:00", task: "Deploy to testnet", detail: "Test everything on a fake blockchain before touching real money." },
                  { time: "15:00", task: "Write tests", detail: "100% test coverage is the minimum. In Web3, bugs cost real money." },
                  { time: "16:30", task: "Deploy to mainnet", detail: "Moment of truth. Code is now immutable. It will run forever exactly as written." },
                  { time: "17:30", task: "Monitor transactions", detail: "Watch the contract on Etherscan. Check for unusual patterns or exploits." },
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

            {/* Key concepts */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "28px", marginBottom: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>5 concepts you need to know</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { term: "Blockchain", color: "#8b5cf6", def: "A database where records are stored in blocks, chained together, and copied across thousands of computers. Impossible to alter without everyone noticing." },
                  { term: "Smart Contract", color: "#3b82f6", def: "Code that lives on the blockchain and executes automatically when conditions are met. Like a vending machine — no human involvement, no possibility of cheating." },
                  { term: "Wallet", color: "#10b981", def: "Your identity on Web3. A pair of cryptographic keys — one public (like your bank account number), one private (like your PIN). You own it, nobody else." },
                  { term: "Gas", color: "#f59e0b", def: "The fee you pay to run code on Ethereum. Every computation costs gas. This prevents spam and pays the network validators." },
                  { term: "DeFi", color: "#ef4444", def: "Decentralised Finance. Financial services (lending, trading, savings) built on smart contracts. No banks, no middlemen. $100B+ locked in these protocols." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, padding: "16px", background: "#f8fafc", borderRadius: 14, alignItems: "flex-start" }}>
                    <div style={{ background: item.color, borderRadius: 10, padding: "4px 12px", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0, marginTop: 2 }}>{item.term}</div>
                    <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>{item.def}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary */}
            <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 16, padding: "18px 22px", marginBottom: 24, display: "flex", gap: 14 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>💰</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }}>Web3 developers are the highest-paid engineers in tech</div>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>Smart contract bugs can cost millions — so companies pay premium for talent. Junior Web3 devs start at <strong>$4,000–6,000/mo</strong>. Senior Solidity engineers earn <strong>$15,000–25,000/mo</strong>. Auditors (security specialists) earn even more. Supply is extremely low, demand is growing.</p>
              </div>
            </div>

            <button onClick={() => completeStep(0)}
              style={{ width: "100%", padding: "14px", background: accent, border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}35` }}>
              Now let me see the blockchain live →
            </button>
          </div>
        )}

        {/* ═══ STEP 1: BLOCKCHAIN EXPLORER ════════════════════ */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>Live Blockchain</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>The blockchain is public.<br/><span style={{ color: accent }}>Anyone can see everything.</span></h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>This is one of the most radical ideas in Web3. Every transaction, every contract, every wallet balance — visible to anyone on earth, forever. Explore it below.</p>
            </div>

            {/* What is a block explorer */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>What is a block explorer?</div>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>Etherscan is like a search engine for the Ethereum blockchain. You can look up any wallet address, any transaction, any smart contract. Think of it as a public ledger that anyone can read — but nobody can edit. The simulation below mirrors how real block explorers work.</p>
            </div>

            {/* Live blocks */}
            <div style={{ background: "#0f172a", borderRadius: 20, padding: "24px 28px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", animation: "pulse 2s infinite" }}/>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Latest Blocks — Ethereum Mainnet</div>
                <div style={{ fontSize: 11, color: "#475569", marginLeft: "auto" }}>New block every ~12 seconds</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {FAKE_BLOCKS.map((block, i) => (
                  <div key={i} onClick={() => setActiveBlock(activeBlock === i ? null : i)}
                    style={{ background: activeBlock === i ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${activeBlock === i ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all .15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>⬛</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>Block #{block.number}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{block.time}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{block.transactions} txns</div>
                      <div style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>{block.reward}</div>
                    </div>
                    {activeBlock === i && (
                      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {[
                          { label: "Block number", value: `#${block.number}` },
                          { label: "Transactions", value: `${block.transactions} included` },
                          { label: "Mined by", value: block.miner },
                          { label: "Block reward", value: block.reward },
                          { label: "What this means", value: "This block was added to the permanent, immutable chain. These transactions can never be changed." },
                        ].map((item, j) => (
                          <div key={j} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "10px 12px", gridColumn: item.label === "What this means" ? "1 / -1" : "auto" }}>
                            <div style={{ fontSize: 10, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                            <div style={{ fontSize: 12, color: "#e2e8f0", fontFamily: item.label === "What this means" ? "inherit" : "monospace" }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Live transactions */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Latest Transactions</div>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5 }}>Every transaction is public. Click any row to see the details.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr 1fr 1fr", gap: 8, padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
                  <div>Hash</div><div>From</div><div>To</div><div>Value</div><div>Type</div>
                </div>
                {FAKE_TRANSACTIONS.map((tx, i) => (
                  <div key={i} onClick={() => setActiveTx(activeTx === i ? null : i)}
                    style={{ background: activeTx === i ? light : "#f8fafc", border: `1px solid ${activeTx === i ? `${accent}30` : "#f1f5f9"}`, borderRadius: 10, overflow: "hidden", cursor: "pointer", transition: "all .15s" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr 1fr 1fr", gap: 8, padding: "12px", alignItems: "center" }}>
                      <div style={{ fontFamily: "monospace", fontSize: 12, color: accent, fontWeight: 600 }}>{tx.hash}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b" }}>{tx.from}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b" }}>{tx.to}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{tx.value}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: accent, background: light, borderRadius: 100, padding: "2px 8px", textAlign: "center" }}>{tx.type}</div>
                    </div>
                    {activeTx === i && (
                      <div style={{ padding: "14px 16px", borderTop: `1px solid ${accent}20`, background: "#fff" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          {[
                            { label: "Transaction hash", value: tx.hash + "...f4a9" },
                            { label: "Time", value: tx.time },
                            { label: "From wallet", value: tx.from + "...2b4c" },
                            { label: "To address", value: tx.to + "...9d1e" },
                            { label: "Value transferred", value: tx.value },
                            { label: "Transaction type", value: tx.type },
                            { label: "Why this is important", value: "This transaction is now permanent. It cannot be reversed, edited, or deleted by anyone — not even the sender.", span: true },
                          ].map((item, j) => (
                            <div key={j} style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px", gridColumn: item.span ? "1 / -1" : "auto" }}>
                              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                              <div style={{ fontSize: 12, color: "#334155", fontFamily: item.span ? "inherit" : "monospace" }}>{item.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key insight */}
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 16, padding: "18px 22px", marginBottom: 24, display: "flex", gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#78350f", marginBottom: 4 }}>Everything you just saw is real data — just simulated format.</div>
                <p style={{ fontSize: 13, color: "#92400e", margin: 0, lineHeight: 1.6 }}>The real Etherscan (etherscan.io) shows exactly this — but with billions of real transactions. Any wallet address, any transaction in history, searchable by anyone. This transparency is what makes blockchain trustworthy: you don't need to trust people, you can verify yourself.</p>
              </div>
            </div>

            <button onClick={() => completeStep(1)}
              style={{ width: "100%", padding: "14px", background: accent, border: "none", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 8px 24px ${accent}35` }}>
              Now let me write code for the blockchain →
            </button>
          </div>
        )}

        {/* ═══ STEP 2: SMART CONTRACT ══════════════════════════ */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "inline-block", background: light, color: accent, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 100, marginBottom: 16, border: `1px solid ${accent}20` }}>Your First Smart Contract</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1.5, margin: "0 0 12px" }}>Code that lives forever<br/><span style={{ color: accent }}>and executes automatically.</span></h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 500 }}>A smart contract is code deployed on the blockchain. Once deployed, it runs exactly as written — forever. No one can change it, stop it, or override it.</p>
            </div>

            {/* What makes smart contracts special */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>What makes smart contracts different from regular code</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { title: "Regular code", items: ["Runs on a server someone controls", "Can be changed or taken down", "You have to trust the operator", "Server can go offline", "Company can change the rules"], color: "#ef4444", bg: "#fff1f2", border: "#fecaca" },
                  { title: "Smart contract", items: ["Runs on thousands of computers", "Immutable once deployed", "Code is the law — verifiable by anyone", "Runs as long as Ethereum exists", "Rules cannot change without everyone agreeing"], color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" },
                ].map((col, i) => (
                  <div key={i} style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 14, padding: "18px" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: col.color, marginBottom: 12 }}>{col.title}</div>
                    {col.items.map((item, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: "#475569" }}>
                        <span style={{ color: col.color, fontWeight: 700, flexShrink: 0 }}>{i === 0 ? "✗" : "✓"}</span>{item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Solidity basics */}
            <div style={{ background: "#0f172a", borderRadius: 20, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Solidity — the language of smart contracts</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { code: "pragma solidity ^0.8.0;", color: "#f9a8d4", meaning: "Specify which version of Solidity to use" },
                  { code: "contract MyContract {", color: "#7dd3fc", meaning: "Define a new smart contract — like a class in other languages" },
                  { code: "  mapping(address => uint) balances;", color: "#86efac", meaning: "Store data: a dictionary mapping wallet addresses to numbers" },
                  { code: "  function deposit() public payable {", color: "#fcd34d", meaning: "A function anyone can call, that accepts ETH payment" },
                  { code: "    balances[msg.sender] += msg.value;", color: "#a78bfa", meaning: "Add the sent ETH to the caller's balance" },
                  { code: "  emit Deposited(msg.sender, msg.value);", color: "#86efac", meaning: "Log an event — like a receipt on the blockchain" },
                ].map((line, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "center" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 12, color: line.color, padding: "6px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 8 }}>{line.code}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>→ {line.meaning}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate contract */}
            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 20, padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Write your first smart contract</div>
              <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5 }}>Describe your idea in plain English. We'll generate the Solidity code and explain every line.</p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {["A voting system", "A simple savings wallet", "A crowdfunding campaign", "A digital ownership certificate", "A tip jar for creators"].map((idea, i) => (
                  <button key={i} onClick={() => setContractIdea(idea)}
                    style={{ padding: "6px 14px", background: light, border: `1px solid ${accent}20`, borderRadius: 100, color: accent, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 600, transition: "all .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#ede9fe"}
                    onMouseLeave={e => e.currentTarget.style.background = light}>
                    {idea}
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <textarea value={contractIdea} onChange={e => setContractIdea(e.target.value)}
                    placeholder="e.g. A contract where people can vote for their favourite option"
                    style={{ width: "100%", height: 110, background: "#f8fafc", border: "1.5px solid #e8e8f0", borderRadius: 12, padding: "12px 14px", color: "#0f172a", fontSize: 14, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.65, boxSizing: "border-box", transition: "border .2s" }}
                    onFocus={e => e.target.style.borderColor = `${accent}80`}
                    onBlur={e => e.target.style.borderColor = "#e8e8f0"}/>
                  <button onClick={generateContract} disabled={!contractIdea.trim() || contractLoading}
                    style={{ marginTop: 10, width: "100%", padding: "12px", background: contractIdea.trim() ? accent : "#f1f5f9", border: "none", borderRadius: 12, color: contractIdea.trim() ? "#fff" : "#94a3b8", fontWeight: 800, fontSize: 14, cursor: contractIdea.trim() ? "pointer" : "default", fontFamily: "inherit", boxShadow: contractIdea.trim() ? `0 6px 20px ${accent}35` : "none", transition: "all .2s" }}>
                    {contractLoading ? "Writing Solidity..." : "Generate Smart Contract →"}
                  </button>
                </div>

                <div>
                  {contractLoading && (
                    <div style={{ background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 12, padding: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {[0,1,2].map(j => <div key={j} style={{ width: 8, height: 8, borderRadius: "50%", background: accent, animation: `pulse 1.2s ease-in-out ${j*.2}s infinite` }}/>)}
                      </div>
                      <div style={{ fontSize: 13, color: "#64748b" }}>Writing your Solidity contract...</div>
                    </div>
                  )}

                  {contract && !contract.error && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: accent, marginBottom: 3 }}>{contract.contract_name}</div>
                        <div style={{ fontSize: 13, color: "#475569" }}>{contract.what_it_does}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Replaces: {contract.real_world_analogy}</div>
                      </div>
                      <div style={{ background: "#0f172a", borderRadius: 10, padding: "14px", fontFamily: "monospace", fontSize: 12, color: "#86efac", lineHeight: 1.8, whiteSpace: "pre-wrap", maxHeight: 200, overflowY: "auto" }}>
                        {contract.code}
                      </div>
                    </div>
                  )}

                  {contract?.error && (
                    <div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: 12, padding: "16px", color: "#dc2626", fontSize: 13 }}>
                      Something went wrong. Try again!
                    </div>
                  )}

                  {!contractLoading && !contract && (
                    <div style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: 12, padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#cbd5e1" }}>
                      <div style={{ fontSize: 36 }}>⛓️</div>
                      <div style={{ fontSize: 13, textAlign: "center" }}>Your smart contract appears here</div>
                    </div>
                  )}
                </div>
              </div>

              {contract && !contract.error && contract.explanation && (
                <div style={{ marginTop: 16, background: "#f8fafc", border: "1px solid #e8e8f0", borderRadius: 14, padding: "18px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Line by line</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                    {contract.explanation.map((item, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div style={{ background: "#0f172a", borderRadius: 8, padding: "7px 10px", fontFamily: "monospace", fontSize: 11, color: "#7dd3fc" }}>{item.line}</div>
                        <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, paddingTop: 2 }}>→ {item.meaning}</div>
                      </div>
                    ))}
                  </div>
                  {contract.how_it_works && (
                    <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: accent, marginBottom: 6, letterSpacing: 1.5, textTransform: "uppercase" }}>How someone uses this contract</div>
                      <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{contract.how_it_works}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {contract && !contract.error && (
              <div>
                <div style={{ background: light, border: `1px solid ${accent}20`, borderRadius: 16, padding: "18px 22px", marginBottom: 16, display: "flex", gap: 14 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>🎉</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: accent, marginBottom: 4 }}>You just wrote code that could live on the blockchain forever.</div>
                    <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>This Solidity contract, once deployed, would execute automatically, be visible to anyone, and run as long as Ethereum exists. That's the promise of Web3 — code as law, transparent and unstoppable.</p>
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
                <div style={{ fontSize: 15, color: "#475569", marginBottom: 20 }}>You earned 75 XP and understood the foundations of Web3.</div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  {["Web1 → Web2 → Web3", "Real use cases", "Blockchain explorer", "Transactions & blocks", "Wrote a smart contract"].map((s, i) => (
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
