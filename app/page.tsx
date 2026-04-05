"use client";

import { useState, useRef, useEffect } from "react";
import { SECTION_IDS } from "./report-content";

function AiSearch() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAsk = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (data.error) {
        setAnswer(data.error);
      } else {
        setAnswer(data.answer);
      }
    } catch {
      setAnswer("Could not reach the AI. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 px-6 py-4 bg-slate-800/80 border border-slate-700 rounded-2xl hover:bg-slate-800 hover:border-blue-500/50 transition-all duration-300 group cursor-text"
        >
          <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-slate-400 text-left">Ask AI anything about this guide... &quot;Should I deploy on my Vercel or the org?&quot;</span>
        </button>
      ) : (
        <div className="bg-slate-800/80 border border-blue-500/30 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/5">
          <div className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 bg-slate-900/80 rounded-xl px-4 py-3 border border-slate-700 focus-within:border-blue-500/50 transition-colors">
                <svg className="w-5 h-5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                  placeholder='Try: "How do I revert a broken deployment?"'
                  className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-base"
                />
              </div>
              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-medium transition-colors shrink-0"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Thinking
                  </span>
                ) : "Ask"}
              </button>
              <button
                onClick={() => { setIsOpen(false); setAnswer(""); setQuestion(""); }}
                className="px-3 py-3 text-slate-500 hover:text-slate-300 transition-colors"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Should I work on my Vercel or the shared one?",
                "How do I revert a broken deployment?",
                "Where do I put API keys?",
                "How do branches work?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setQuestion(q); }}
                  className="text-xs px-3 py-1.5 bg-slate-700/50 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-slate-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          {answer && (
            <div className="border-t border-slate-700/50 p-5 bg-slate-900/40">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {answer}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TableOfContents() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    SECTION_IDS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="hidden xl:block fixed left-6 top-1/2 -translate-y-1/2 z-40">
      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 w-56">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 px-2">Contents</p>
        <div className="space-y-0.5">
          {SECTION_IDS.map(({ id, title, number }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                activeSection === id
                  ? "bg-blue-600/20 text-blue-300 font-medium"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-700/30"
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                activeSection === id ? "bg-blue-600/30 text-blue-300" : "bg-slate-700/50 text-slate-500"
              }`}>
                {number}
              </span>
              <span className="truncate">{title.split("—")[0].trim()}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* Section Components */

function SectionHeader({ id, number, title, subtitle }: { id: string; number: number; title: string; subtitle: string }) {
  return (
    <div id={id} className="scroll-mt-24 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
          {number}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
      </div>
      <p className="text-slate-400 text-lg ml-[52px]">{subtitle}</p>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

function InfoBox({ type, title, children }: { type: "tip" | "warning" | "rule" | "example"; title: string; children: React.ReactNode }) {
  const styles = {
    tip: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", icon: "text-emerald-400", titleColor: "text-emerald-300" },
    warning: { bg: "bg-amber-500/5", border: "border-amber-500/20", icon: "text-amber-400", titleColor: "text-amber-300" },
    rule: { bg: "bg-blue-500/5", border: "border-blue-500/20", icon: "text-blue-400", titleColor: "text-blue-300" },
    example: { bg: "bg-purple-500/5", border: "border-purple-500/20", icon: "text-purple-400", titleColor: "text-purple-300" },
  };
  const s = styles[type];
  const icons = {
    tip: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    warning: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />,
    rule: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    example: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
  };

  return (
    <div className={`${s.bg} border ${s.border} rounded-xl p-5 my-5`}>
      <div className="flex items-center gap-2 mb-2">
        <svg className={`w-5 h-5 ${s.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">{icons[type]}</svg>
        <span className={`font-semibold text-sm ${s.titleColor}`}>{title}</span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function ComparisonRow({ label, col1, col2 }: { label: string; col1: string; col2: string }) {
  return (
    <tr className="border-b border-slate-700/50">
      <td className="py-3 px-4 text-slate-300 font-medium">{label}</td>
      <td className="py-3 px-4 text-slate-400">{col1}</td>
      <td className="py-3 px-4 text-slate-400">{col2}</td>
    </tr>
  );
}

function StepItem({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0 mt-0.5">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="text-white font-semibold mb-1">{title}</h4>
        <div className="text-slate-400 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <TableOfContents />

      {/* Header */}
      <header className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/5" />
        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            RevenueFlows AI &mdash; Internal Guide
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Empire Collaboration<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Guide</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-2">
            Everything Jagan and Ishan need to know about working together on GitHub, Vercel, and Supabase.
          </p>
          <p className="text-slate-500 text-sm">
            Last updated: April 5, 2026
          </p>
        </div>
      </header>

      {/* AI Search */}
      <div className="max-w-4xl mx-auto px-6 -mt-6 relative z-10">
        <AiSearch />
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 pb-24 space-y-20">

        {/* SECTION 1 */}
        <section>
          <SectionHeader
            id="decision"
            number={1}
            title="The Decision"
            subtitle="Why we chose the Shared Organization model."
          />

          <Card>
            <h3 className="text-xl font-bold text-white mb-4">What Is a Shared Organization?</h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              Instead of repos living under Jagan&apos;s GitHub or Ishan&apos;s GitHub, we create a shared workspace (called an &quot;organization&quot; on GitHub, a &quot;team&quot; on Vercel). All empire repos live there. Both partners are members. Both can push code, review each other&apos;s work, and deploy.
            </p>
            <p className="text-slate-400">
              Think of it like <strong className="text-white">renting an office together</strong> instead of working from separate apartments.
            </p>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Options We Evaluated</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                <span className="text-red-400 text-lg mt-0.5">&#10007;</span>
                <div>
                  <p className="text-white font-medium">Fork + Pull Request Model</p>
                  <p className="text-slate-400 text-sm mt-1">Each person copies the repo, works on their copy, then sends changes back. Too much friction for a two-person team. Designed for open-source strangers, not partners.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <span className="text-amber-400 text-lg mt-0.5">&#8776;</span>
                <div>
                  <p className="text-white font-medium">Monorepo with Ownership Boundaries</p>
                  <p className="text-slate-400 text-sm mt-1">One giant repo with folders for each person&apos;s projects. Might use later if we need shared code across multiple apps. Unnecessary complexity for now.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <span className="text-emerald-400 text-lg mt-0.5">&#10003;</span>
                <div>
                  <p className="text-white font-medium">Shared Organization (CHOSEN)</p>
                  <p className="text-slate-400 text-sm mt-1">One GitHub org, one Vercel team, shared Supabase access. Simple, clean, one source of truth. This is what companies of any size use.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Account Roles</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium w-1/3"></th>
                    <th className="text-left py-3 px-4 text-blue-300 font-semibold">Ishan&apos;s Accounts (Main)</th>
                    <th className="text-left py-3 px-4 text-purple-300 font-semibold">Jagan&apos;s Accounts (Sandbox)</th>
                  </tr>
                </thead>
                <tbody>
                  <ComparisonRow label="Purpose" col1="The live empire" col2="Testing & experiments" />
                  <ComparisonRow label="Who sees it" col1="Customers & partners" col2="Only Jagan" />
                  <ComparisonRow label="Data" col1="Real customer data" col2="Fake test data" />
                  <ComparisonRow label="Risk level" col1="Be careful" col2="Break anything" />
                  <ComparisonRow label="Analogy" col1="Restaurant kitchen (live orders)" col2="Home kitchen (trying recipes)" />
                </tbody>
              </table>
            </div>
            <InfoBox type="rule" title="The One Rule">
              <strong>Test on Jagan&apos;s. Ship on Ishan&apos;s (the org).</strong>
            </InfoBox>
          </Card>
        </section>

        {/* SECTION 2 */}
        <section>
          <SectionHeader
            id="setup"
            number={2}
            title="Setup Instructions"
            subtitle="What Ishan needs to do. Total time: ~12 minutes."
          />

          <Card>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-sm">1</span>
              GitHub &mdash; Create an Organization
              <span className="text-xs text-slate-500 font-normal ml-auto">~5 minutes</span>
            </h3>
            <StepItem number={1} title="Go to GitHub">
              Click your profile icon (top right) &rarr; &quot;Your organizations&quot; &rarr; &quot;New organization&quot;
            </StepItem>
            <StepItem number={2} title="Choose the FREE plan">
              It&apos;s enough for private repos with collaborators. No credit card needed.
            </StepItem>
            <StepItem number={3} title="Name it">
              Something like <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300">revenueflows-ai</code> or <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300">empire-hq</code>
            </StepItem>
            <StepItem number={4} title="Invite Jagan">
              Org page &rarr; Settings &rarr; Members &rarr; Invite member &rarr; Add Jagan&apos;s GitHub username
            </StepItem>
            <StepItem number={5} title="Move existing repos (optional)">
              Any repo &rarr; Settings &rarr; Danger Zone &rarr; &quot;Transfer ownership&quot; &rarr; Select the new org
            </StepItem>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-sm">2</span>
              Vercel &mdash; Create a Team
              <span className="text-xs text-slate-500 font-normal ml-auto">~5 minutes</span>
            </h3>
            <StepItem number={1} title="Create Team">
              vercel.com &rarr; Top-left dropdown (your name) &rarr; &quot;Create Team&quot;
            </StepItem>
            <StepItem number={2} title="Name it">
              Match the GitHub org name (e.g., &quot;RevenueFlows AI&quot;)
            </StepItem>
            <StepItem number={3} title="Connect GitHub">
              Team Settings &rarr; Git &rarr; Connect GitHub &rarr; Authorize the org
            </StepItem>
            <StepItem number={4} title="Invite Jagan">
              Team Settings &rarr; Members &rarr; Invite &rarr; Add Jagan&apos;s email
            </StepItem>
            <StepItem number={5} title="Move existing projects (optional)">
              Each project &rarr; Settings &rarr; Transfer &rarr; Select the team
            </StepItem>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-sm">3</span>
              Supabase &mdash; Add Team Member
              <span className="text-xs text-slate-500 font-normal ml-auto">~2 minutes</span>
            </h3>
            <StepItem number={1} title="Open Supabase">
              Go to your project dashboard
            </StepItem>
            <StepItem number={2} title="Go to Team settings">
              Click the org/team name in the sidebar &rarr; Members
            </StepItem>
            <StepItem number={3} title="Invite Jagan">
              Add Jagan&apos;s email as a member. Done.
            </StepItem>
          </Card>

          <InfoBox type="tip" title="What Jagan does after">
            Accept all three invites (GitHub, Vercel, Supabase) &mdash; they arrive by email. Keep your personal accounts active as your testing sandbox.
          </InfoBox>
        </section>

        {/* SECTION 3 */}
        <section>
          <SectionHeader
            id="github"
            number={3}
            title="How GitHub Works"
            subtitle="Code storage + version history. Think: Google Docs for code."
          />

          <Card>
            <h3 className="text-xl font-bold text-white mb-6">The Three Steps: Edit &rarr; Commit &rarr; Push</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">1</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Edit</h4>
                <p className="text-slate-400 text-sm">Change code on your computer. Only you can see it.</p>
              </div>
              <div className="p-5 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">2</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Commit</h4>
                <p className="text-slate-400 text-sm">Click &quot;Save&quot; with a note: &quot;Fixed contact form.&quot; Permanent snapshot.</p>
              </div>
              <div className="p-5 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">3</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Push</h4>
                <p className="text-slate-400 text-sm">Upload to GitHub (cloud). Partner can see it. Vercel auto-deploys.</p>
              </div>
            </div>
            <InfoBox type="tip" title="Think of it this way">
              Commits = saving your progress in a video game. Push = uploading your save file to the cloud.
            </InfoBox>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Version History &mdash; Always Automatic</h3>
            <p className="text-slate-300 mb-4">Every commit is saved forever. You never need to manually back anything up. The timeline looks like this:</p>
            <div className="space-y-2 ml-4 border-l-2 border-slate-700 pl-6">
              {[
                { date: "April 5", msg: "Fixed broken contact form", tag: "latest" },
                { date: "April 4", msg: "Added new pricing page", tag: "" },
                { date: "April 3", msg: "Updated logo", tag: "" },
                { date: "April 1", msg: "Initial launch", tag: "first" },
              ].map((c) => (
                <div key={c.date} className="relative">
                  <div className="absolute -left-[31px] w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-600" />
                  <p className="text-sm">
                    <span className="text-slate-500">{c.date}</span>
                    <span className="text-white ml-3">&quot;{c.msg}&quot;</span>
                    {c.tag && <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${c.tag === "latest" ? "bg-emerald-500/10 text-emerald-300" : "bg-slate-700 text-slate-400"}`}>{c.tag}</span>}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm mt-4">You can go back to any of these at any time.</p>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Branches &mdash; Parallel Universes for Code</h3>
            <div className="bg-slate-900/60 rounded-xl p-6 mb-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
                  <div className="flex-1 h-2 bg-emerald-500/20 rounded-full" />
                  <span className="text-xs text-emerald-300 font-mono shrink-0">main (live site)</span>
                </div>
                <div className="flex items-center gap-3 ml-12">
                  <div className="w-3 h-3 rounded-full bg-purple-400 shrink-0" />
                  <div className="flex-1 h-2 bg-purple-500/20 rounded-full" />
                  <span className="text-xs text-purple-300 font-mono shrink-0">test-branch (your experiments)</span>
                </div>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              <strong className="text-white">Main branch</strong> = the live website. Don&apos;t experiment here.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              <strong className="text-white">Test branch</strong> = your experimental copy. Break things freely. When it works, merge into main. When it fails, delete the branch. Main was never touched.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">Pull Request (PR)</strong> = a formal request saying &quot;I made these changes, please review and merge.&quot; Your partner can review, comment, or approve. Great for tracking what changed and why.
            </p>
          </Card>

          <InfoBox type="warning" title="Reverting">
            Tell Claude Code: &quot;Revert to the version before I broke X.&quot; The broken version stays in history (nothing is deleted), but the active code goes back to the working version. Push the revert, and Vercel auto-deploys the fix.
          </InfoBox>
        </section>

        {/* SECTION 4 */}
        <section>
          <SectionHeader
            id="vercel"
            number={4}
            title="How Vercel Works"
            subtitle="Hosting + auto-deployment. Push code, site goes live."
          />

          <Card>
            <h3 className="text-lg font-bold text-white mb-4">The Deployment Chain</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 justify-center py-6">
              {[
                { label: "Push to GitHub", icon: "1" },
                { label: "Vercel detects it", icon: "2" },
                { label: "Auto-builds", icon: "3" },
                { label: "Site is live", icon: "4" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-300 font-bold text-lg">{step.icon}</span>
                    </div>
                    <p className="text-xs text-slate-400">{step.label}</p>
                  </div>
                  {i < 3 && <span className="hidden sm:block text-slate-600 text-xl mx-2">&rarr;</span>}
                </div>
              ))}
            </div>
            <InfoBox type="tip" title="You never manually deploy">
              Just push to GitHub. Vercel does the rest. You don&apos;t log into Vercel to deploy.
            </InfoBox>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Every Deployment Is Saved</h3>
            <div className="space-y-2">
              {[
                { time: "April 5, 3:42pm", status: "LIVE", current: true },
                { time: "April 5, 1:15pm", status: "ready", current: false },
                { time: "April 4, 9:30pm", status: "ready", current: false },
                { time: "April 3, 6:00pm", status: "ready", current: false },
              ].map((d) => (
                <div key={d.time} className={`flex items-center gap-3 p-3 rounded-lg ${d.current ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-900/40"}`}>
                  <span className={`w-2 h-2 rounded-full ${d.current ? "bg-emerald-400" : "bg-slate-600"}`} />
                  <span className="text-sm text-slate-300">{d.time}</span>
                  <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${d.current ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700/50 text-slate-500"}`}>{d.status}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm mt-4">Each one is a fully working version of your site. You can visit any of them.</p>
          </Card>

          <InfoBox type="rule" title="Vercel's Superpower: Instant Revert">
            If the live site breaks, go to Vercel dashboard &rarr; find the last working deployment &rarr; click <strong>&quot;Promote to Production.&quot;</strong> Site is back in 5 seconds. No code changes needed. Just one click.
          </InfoBox>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Preview Deployments (Test Before Going Live)</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-slate-300">Live site:</span>
                <code className="text-xs bg-slate-900 px-2 py-1 rounded text-emerald-300 ml-auto">your-app.vercel.app</code>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-sm text-slate-300">Preview (only you):</span>
                <code className="text-xs bg-slate-900 px-2 py-1 rounded text-purple-300 ml-auto">test-feature-abc123.vercel.app</code>
              </div>
            </div>
            <p className="text-slate-400 text-sm">Push to a branch (not main) &rarr; Vercel creates a preview URL automatically. Check it, verify it works, then merge to main.</p>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-3">Environment Variables</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              API keys your live app needs (Supabase, Stripe, etc.) go in <strong className="text-white">Vercel&apos;s Environment Variables dashboard</strong>, not in code files. They&apos;re encrypted and secure. Go to: Project &rarr; Settings &rarr; Environment Variables.
            </p>
          </Card>
        </section>

        {/* SECTION 5 */}
        <section>
          <SectionHeader
            id="supabase"
            number={5}
            title="How Supabase Works"
            subtitle="Your database. Where data lives."
          />

          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Two Types of Changes</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <h4 className="text-emerald-300 font-semibold mb-2">Data Changes (Low Risk)</h4>
                <p className="text-slate-400 text-sm">Adding/editing/deleting rows. Like editing a Google Sheet. Happens in real-time. Example: adding a new lead.</p>
              </div>
              <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-xl">
                <h4 className="text-red-300 font-semibold mb-2">Structure Changes (High Risk)</h4>
                <p className="text-slate-400 text-sm">Adding/removing tables or columns. If you delete a column, all data in it is gone forever. Always be careful.</p>
              </div>
            </div>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Version History &mdash; NOT Automatic</h3>
            <InfoBox type="warning" title="Unlike GitHub and Vercel, Supabase does NOT auto-save versions">
              This is the one place you need to be careful. Use these safeguards:
            </InfoBox>
            <div className="space-y-3 mt-4">
              <div className="p-4 bg-slate-900/40 rounded-lg">
                <p className="text-white font-medium text-sm">Daily Backups</p>
                <p className="text-slate-400 text-xs mt-1">On paid plans, your database is backed up daily. Restore to yesterday from the dashboard.</p>
              </div>
              <div className="p-4 bg-slate-900/40 rounded-lg">
                <p className="text-white font-medium text-sm">Migrations</p>
                <p className="text-slate-400 text-xs mt-1">Like &quot;commits for your database structure.&quot; Claude Code can create these. If something goes wrong, roll back.</p>
              </div>
              <div className="p-4 bg-slate-900/40 rounded-lg">
                <p className="text-white font-medium text-sm">Point-in-Time Recovery</p>
                <p className="text-slate-400 text-xs mt-1">On higher plans, restore to any specific minute. Like rewinding a video.</p>
              </div>
            </div>
          </Card>

          <InfoBox type="rule" title="Testing Database Changes">
            <strong>NEVER experiment on production.</strong> Use Jagan&apos;s personal Supabase. Create a test project, copy the table structure (not real data), fill with fake data, test there. Apply to production only when it works.
          </InfoBox>
        </section>

        {/* SECTION 6 */}
        <section>
          <SectionHeader
            id="workflow"
            number={6}
            title="The Complete Workflow"
            subtitle='Example: Adding a "phone number" field to the lead manager.'
          />

          <Card>
            <div className="space-y-0">
              <StepItem number={1} title="Create a Branch">
                Tell Claude Code: &quot;Create a branch called add-phone-field.&quot; Now you have a safe copy. Live site is untouched.
              </StepItem>
              <StepItem number={2} title="Test Database Changes">
                On your personal Supabase (sandbox), add a &quot;phone_number&quot; column. Verify with fake data.
              </StepItem>
              <StepItem number={3} title="Write the Code">
                Claude Code modifies the app on your branch. Forms, displays, API calls &mdash; all updated. Not on main.
              </StepItem>
              <StepItem number={4} title="Commit and Push">
                Claude Code commits: &quot;Added phone number field&quot; and pushes to GitHub.
              </StepItem>
              <StepItem number={5} title="Check the Preview">
                Vercel creates a preview URL for your branch. Visit it. Test everything. Fill in forms.
              </StepItem>
              <StepItem number={6} title="Merge">
                Everything works. Merge the branch into main.
              </StepItem>
              <StepItem number={7} title="Auto-Deploy">
                Vercel detects the merge and deploys. Live site has the new feature.
              </StepItem>
              <StepItem number={8} title="Update Production Database">
                Apply the same column change to production Supabase.
              </StepItem>
              <StepItem number={9} title="Verify">
                Check the live site. Phone numbers work. Done.
              </StepItem>
            </div>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">If Something Goes Wrong</h3>
            <div className="space-y-3">
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                <p className="text-amber-300 font-medium text-sm">Preview looks broken (Step 5)</p>
                <p className="text-slate-400 text-xs mt-1">Don&apos;t merge. Fix the code on your branch and push again. Preview updates automatically.</p>
              </div>
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
                <p className="text-red-300 font-medium text-sm">Live site broken after merge (Step 7)</p>
                <p className="text-slate-400 text-xs mt-1">Vercel dashboard &rarr; previous deployment &rarr; &quot;Promote to Production.&quot; Fixed in 5 seconds. Then fix code on a new branch.</p>
              </div>
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
                <p className="text-red-300 font-medium text-sm">Database change breaks things (Step 8)</p>
                <p className="text-slate-400 text-xs mt-1">Restore from Supabase backup or roll back the migration.</p>
              </div>
            </div>
          </Card>
        </section>

        {/* SECTION 7 */}
        <section>
          <SectionHeader
            id="decisions"
            number={7}
            title="Decision Framework"
            subtitle='The "Where should I do this?" cheat sheet.'
          />

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">What you&apos;re doing</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Where</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { what: "Building a new feature to test", where: "Your accounts", color: "text-purple-300" },
                    { what: "Feature works, ready to ship", where: "Org (shared) accounts", color: "text-blue-300" },
                    { what: "Quick experiment / throwaway prototype", where: "Your accounts", color: "text-purple-300" },
                    { what: "Fixing a bug on a live app", where: "Org — but make a branch first", color: "text-blue-300" },
                    { what: "Learning something new", where: "Your accounts", color: "text-purple-300" },
                    { what: "Anything a customer will see", where: "Org accounts ONLY", color: "text-blue-300" },
                    { what: "Database experiment", where: "Your Supabase (never production)", color: "text-purple-300" },
                  ].map((row) => (
                    <tr key={row.what} className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-slate-300">{row.what}</td>
                      <td className={`py-3 px-4 font-medium ${row.color}`}>{row.where}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <InfoBox type="rule" title="The Simple Test">
              If you&apos;re asking &quot;Should I do this on the live one?&quot; &mdash; the answer is probably no. Do it on yours first.
            </InfoBox>
          </Card>
        </section>

        {/* SECTION 8 */}
        <section>
          <SectionHeader
            id="api-keys"
            number={8}
            title="API Keys & Environment Variables"
            subtitle="Where secrets live and how they flow."
          />

          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Currently Active Services (10)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "Apify", desc: "Scraping" },
                { name: "Instantly", desc: "Cold email" },
                { name: "DeBounce", desc: "Email verification" },
                { name: "Apollo", desc: "Contact enrichment" },
                { name: "OpenRouter", desc: "AI models" },
                { name: "Supabase", desc: "Database" },
                { name: "AWeber", desc: "Email marketing" },
                { name: "GitHub", desc: "Version control" },
                { name: "Vercel", desc: "Deployment" },
                { name: "Gmail", desc: "2 accounts" },
              ].map((s) => (
                <div key={s.name} className="p-3 bg-slate-900/40 rounded-lg">
                  <p className="text-white text-sm font-medium">{s.name}</p>
                  <p className="text-slate-500 text-xs">{s.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">How Keys Flow</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-slate-900/40 rounded-lg">
                <span className="text-blue-400 shrink-0 mt-0.5">&#9679;</span>
                <div>
                  <p className="text-white font-medium text-sm">Local Development (your computer)</p>
                  <p className="text-slate-400 text-xs mt-1">Keys come from the .env or .env.local file in the project folder.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-900/40 rounded-lg">
                <span className="text-emerald-400 shrink-0 mt-0.5">&#9679;</span>
                <div>
                  <p className="text-white font-medium text-sm">Production (Vercel)</p>
                  <p className="text-slate-400 text-xs mt-1">Keys are set in Vercel&apos;s Environment Variables dashboard. Encrypted. Never in code.</p>
                </div>
              </div>
            </div>
            <InfoBox type="warning" title="The .env file is NEVER committed to GitHub">
              It&apos;s in .gitignore. Each developer has their own local copy. Production keys live in Vercel&apos;s dashboard only.
            </InfoBox>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-3">About OpenRouter</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              OpenRouter is like a <strong className="text-white">universal credit card for AI models</strong>. One API key gives you access to hundreds of models (Gemini, Claude, GPT, etc.).
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              The key alone doesn&apos;t pick a model &mdash; your <strong className="text-white">code specifies which model</strong> to use in each API call. Example: &quot;Nano Banana 2&quot; in the AI Tools app is actually <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300 text-xs">google/gemini-3.1-flash-image-preview</code>.
            </p>
          </Card>
        </section>

        {/* SECTION 9 */}
        <section>
          <SectionHeader
            id="security"
            number={9}
            title="Never Share Passwords"
            subtitle="Use platform collaboration features instead."
          />

          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Why Not Just Share Login Credentials?</h3>
            <div className="space-y-3">
              {[
                { title: "Can't track who did what", desc: "Commits, deploys, and changes all show the same person." },
                { title: "Security risk", desc: "To revoke access, you'd have to change passwords everywhere." },
                { title: "Accidents untraceable", desc: "If something gets deleted, you can't tell who did it." },
                { title: "Violates Terms of Service", desc: "Most platforms prohibit account sharing." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                  <span className="text-red-400 mt-0.5">&#10007;</span>
                  <div>
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-white mb-4">The Right Way</h3>
            <div className="space-y-3">
              {[
                { platform: "GitHub", how: "Org membership. Each person commits under their own name." },
                { platform: "Vercel", how: "Team membership. Each person has their own login." },
                { platform: "Supabase", how: "Team membership. Each person has their own login." },
              ].map((item) => (
                <div key={item.platform} className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                  <span className="text-emerald-400 mt-0.5">&#10003;</span>
                  <div>
                    <p className="text-white text-sm font-medium">{item.platform}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{item.how}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm mt-4">Revoking access = remove the member. One click. No password changes. No disruption.</p>
          </Card>
        </section>

        {/* SECTION 10 */}
        <section>
          <SectionHeader
            id="scenarios"
            number={10}
            title="Common Scenarios"
            subtitle="Quick answers to questions that will come up."
          />

          <div className="space-y-4">
            {[
              {
                q: "I built something on my personal Vercel. How do I move it to the org?",
                a: "Transfer the GitHub repo to the org first (repo Settings \u2192 Transfer). Then import it into the Vercel team. Vercel will auto-deploy from the org repo."
              },
              {
                q: "I need to fix a bug on a live app urgently.",
                a: "Clone the repo, create a branch, fix the bug, push, check the preview URL, then merge to main. If truly urgent, you can push directly to main \u2014 but branching is always safer."
              },
              {
                q: "My partner made a change that broke the live site.",
                a: "Vercel dashboard \u2192 find the last working deployment \u2192 click \"Promote to Production.\" Fixed in 5 seconds while you figure out the code."
              },
              {
                q: "I want to try a completely new tech stack or tool.",
                a: "Do it on your personal accounts. Don\u2019t touch the org until you\u2019ve proven it works."
              },
              {
                q: "Claude Code says it can't find the Supabase API key.",
                a: "Check the central .env file first. If the key is there, make sure the project\u2019s .env.local also has it. If missing from both, check Vercel\u2019s environment variables."
              },
              {
                q: "We both edited the same file at the same time.",
                a: "Git handles this. It flags a \"merge conflict\" and shows both versions. Claude Code helps resolve it."
              },
              {
                q: "I accidentally pushed secrets (API keys) to GitHub.",
                a: "Immediately rotate (regenerate) the exposed keys. Remove secrets from code and push a clean version. Old commits with secrets still exist, but the rotated keys won\u2019t work."
              },
              {
                q: "How do I know which Supabase project a Vercel app is connected to?",
                a: "Check the Vercel project\u2019s Environment Variables (Settings \u2192 Environment Variables). The SUPABASE_URL tells you which project."
              },
            ].map((item, i) => (
              <Card key={i}>
                <h4 className="text-white font-semibold text-sm mb-2 flex items-start gap-2">
                  <span className="text-blue-400 shrink-0">Q:</span>
                  {item.q}
                </h4>
                <p className="text-slate-400 text-sm flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0 font-semibold">A:</span>
                  {item.a}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-12 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            Empire Collaboration Guide &mdash; RevenueFlows AI
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Built by Claude Code &middot; April 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
