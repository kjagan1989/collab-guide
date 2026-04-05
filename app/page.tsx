"use client";

import { useState, useRef, useEffect } from "react";
import { SECTION_IDS } from "./report-content";

/* ─── AI Search ─── */
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
      setAnswer(data.error || data.answer);
    } catch {
      setAnswer("Could not reach the AI. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all duration-300 group cursor-text shadow-sm"
        >
          <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-slate-400 text-left text-sm sm:text-base">Have a question? Ask AI anything about this guide...</span>
        </button>
      ) : (
        <div className="bg-white border border-blue-200 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:border-blue-400 transition-colors">
                <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                  placeholder='"Should I deploy on my Vercel or the shared one?"'
                  className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-base"
                />
              </div>
              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-medium transition-colors shrink-0"
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
                className="px-3 py-3 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Should I work on my Vercel or the shared one?",
                "How do I revert a broken deployment?",
                "Where do API keys go?",
                "What is a branch?",
                "How do I move a project to the org?",
              ].map((q) => (
                <button key={q} onClick={() => setQuestion(q)} className="text-xs px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
          {answer && (
            <div className="border-t border-slate-100 p-5 bg-blue-50/50">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{answer}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Table of Contents ─── */
function TableOfContents() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); }); },
      { rootMargin: "-100px 0px -60% 0px" }
    );
    SECTION_IDS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="hidden xl:block fixed left-6 top-1/2 -translate-y-1/2 z-40">
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 w-56 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 px-2">Contents</p>
        <div className="space-y-0.5">
          {SECTION_IDS.map(({ id, title, number }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                activeSection === id
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                activeSection === id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400"
              }`}>{number}</span>
              <span className="truncate">{title}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ─── Reusable Components ─── */

function SectionHeader({ id, number, title, subtitle }: { id: string; number: number; title: string; subtitle: string }) {
  return (
    <div id={id} className="scroll-mt-24 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">{number}</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h2>
      </div>
      <p className="text-slate-500 text-lg ml-[52px]">{subtitle}</p>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm ${className}`}>{children}</div>;
}

function InfoBox({ type, title, children }: { type: "tip" | "warning" | "rule" | "why"; title: string; children: React.ReactNode }) {
  const styles = {
    tip: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-600", titleColor: "text-emerald-700" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-600", titleColor: "text-amber-700" },
    rule: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600", titleColor: "text-blue-700" },
    why: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600", titleColor: "text-purple-700" },
  };
  const s = styles[type];
  const icons = {
    tip: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    warning: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />,
    rule: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    why: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  };
  return (
    <div className={`${s.bg} border ${s.border} rounded-xl p-5 my-5`}>
      <div className="flex items-center gap-2 mb-2">
        <svg className={`w-5 h-5 ${s.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">{icons[type]}</svg>
        <span className={`font-semibold text-sm ${s.titleColor}`}>{title}</span>
      </div>
      <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function StepItem({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 mt-0.5">{number}</div>
      <div className="flex-1">
        <h4 className="text-slate-900 font-semibold mb-1">{title}</h4>
        <div className="text-slate-500 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function ProCon({ type, text }: { type: "pro" | "con"; text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className={`mt-0.5 shrink-0 ${type === "pro" ? "text-emerald-500" : "text-red-400"}`}>
        {type === "pro" ? "+" : "\u2013"}
      </span>
      <span className="text-slate-600">{text}</span>
    </div>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <TableOfContents />

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 pt-14 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            RevenueFlows AI &mdash; Internal Guide
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Empire Collaboration<br />
            <span className="text-blue-600">Guide</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-2">
            How Jagan and Ishan work together on GitHub, Vercel, and Supabase &mdash; what we decided, why, and how it works.
          </p>
          <p className="text-slate-400 text-sm">
            Last updated: April 5, 2026
          </p>
        </div>
      </header>

      {/* AI Search */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        <AiSearch />
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 pb-24 space-y-20">

        {/* ── 1. THE PROBLEM ── */}
        <section>
          <SectionHeader id="problem" number={1} title="The Problem" subtitle="Why we need to change how we work together." />

          <Card>
            <h3 className="text-xl font-bold text-slate-900 mb-4">What&apos;s Going Wrong</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Right now, Jagan and Ishan each have their own <strong className="text-slate-800">separate</strong> GitHub, Vercel, and Supabase accounts. Projects are scattered across both accounts with no shared home.
            </p>
            <div className="space-y-3">
              {[
                { pain: "\"Which repo has the latest version?\"", detail: "Constant confusion about where code lives" },
                { pain: "\"Where is this deployed?\"", detail: "Nobody knows without checking both Vercels" },
                { pain: "\"Why can't Claude Code find the API keys?\"", detail: "Keys saved in random project folders, not centralized" },
                { pain: "Can't work on each other's projects", detail: "No clean way to access, deploy, or contribute without sharing passwords" },
                { pain: "No audit trail", detail: "If something breaks, nobody knows who changed what" },
                { pain: "Duplication everywhere", detail: "Same setup work done twice, same keys scattered in multiple places" },
              ].map((item) => (
                <div key={item.pain} className="flex items-start gap-3 p-4 bg-red-50/50 border border-red-100 rounded-xl">
                  <span className="text-red-400 mt-0.5 shrink-0">&#10005;</span>
                  <div>
                    <p className="text-slate-800 font-medium text-sm">{item.pain}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <InfoBox type="why" title="The Core Issue">
              We&apos;re running a <strong>two-person company</strong> with <strong>single-person tooling</strong>. Everything is siloed. We need shared infrastructure.
            </InfoBox>
          </Card>
        </section>

        {/* ── 2. OPTIONS ── */}
        <section>
          <SectionHeader id="options" number={2} title="Options At Our Disposal" subtitle="Three approaches to solve the collaboration problem." />

          <div className="grid gap-6">
            {/* Option A */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">A</span>
                <h3 className="text-lg font-bold text-slate-900">Shared Organization</h3>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                Create a shared workspace on GitHub (called an &quot;organization&quot;) and Vercel (called a &quot;team&quot;). All repos and deployments live there. Both partners are members.
              </p>
              <p className="text-slate-500 text-xs italic mb-3">Think of it like renting an office together instead of working from separate apartments.</p>
            </Card>

            {/* Option B */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center">B</span>
                <h3 className="text-lg font-bold text-slate-900">Fork + Pull Request Model</h3>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                Each person keeps their own accounts. One person&apos;s repo is the &quot;source of truth.&quot; The other makes a copy (fork), works on it, then sends changes back for review (pull request).
              </p>
              <p className="text-slate-500 text-xs italic">Used by open-source projects with hundreds of strangers contributing.</p>
            </Card>

            {/* Option C */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center">C</span>
                <h3 className="text-lg font-bold text-slate-900">Monorepo with Ownership Boundaries</h3>
              </div>
              <p className="text-slate-600 text-sm mb-4">
                One giant repo with separate folders for each person&apos;s projects. Each folder maps to a different deployment.
              </p>
              <p className="text-slate-500 text-xs italic">Used by large companies (Google, Meta) with thousands of developers.</p>
            </Card>
          </div>
        </section>

        {/* ── 3. ANALYSIS ── */}
        <section>
          <SectionHeader id="analysis" number={3} title="Analyzing Each Option" subtitle="Pros, cons, and who each approach is really built for." />

          {/* Option A Analysis */}
          <Card>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">A</span>
              <h3 className="text-lg font-bold text-slate-900">Shared Organization</h3>
              <span className="ml-auto px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">Best Fit</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">Pros</p>
                <div className="space-y-2">
                  <ProCon type="pro" text="One source of truth — no version confusion" />
                  <ProCon type="pro" text="Both push code under their own names — full audit trail" />
                  <ProCon type="pro" text="Vercel auto-deploys from shared repos — one pipeline" />
                  <ProCon type="pro" text="Industry standard — how every company works" />
                  <ProCon type="pro" text="Revoking access is one click" />
                  <ProCon type="pro" text="Scales to more team members without changes" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3">Cons</p>
                <div className="space-y-2">
                  <ProCon type="con" text="12 minutes of one-time setup" />
                  <ProCon type="con" text="Need to transfer existing repos and projects" />
                </div>
              </div>
            </div>
          </Card>

          {/* Option B Analysis */}
          <Card className="mt-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center">B</span>
              <h3 className="text-lg font-bold text-slate-900">Fork + Pull Request</h3>
              <span className="ml-auto px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-200">Not For Us</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">Pros</p>
                <div className="space-y-2">
                  <ProCon type="pro" text="No org setup needed" />
                  <ProCon type="pro" text="Clear separation of ownership" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3">Cons</p>
                <div className="space-y-2">
                  <ProCon type="con" text="Too much friction for 2 people" />
                  <ProCon type="con" text="Designed for strangers, not partners" />
                  <ProCon type="con" text="Vercel deploys from two places — confusing" />
                  <ProCon type="con" text="Easy to get out of sync" />
                  <ProCon type="con" text="Double the maintenance" />
                </div>
              </div>
            </div>
          </Card>

          {/* Option C Analysis */}
          <Card className="mt-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center">C</span>
              <h3 className="text-lg font-bold text-slate-900">Monorepo</h3>
              <span className="ml-auto px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">Maybe Later</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">Pros</p>
                <div className="space-y-2">
                  <ProCon type="pro" text="Shared code between projects is easy" />
                  <ProCon type="pro" text="One repo to manage" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3">Cons</p>
                <div className="space-y-2">
                  <ProCon type="con" text="Unnecessary complexity right now" />
                  <ProCon type="con" text="One bad commit can affect multiple projects" />
                  <ProCon type="con" text="CI/CD config gets complicated" />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ── 4. THE DECISION ── */}
        <section>
          <SectionHeader id="decision" number={4} title="The Decision" subtitle="What we chose and why." />

          <Card>
            <div className="text-center py-4 mb-6">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">We chose</p>
              <h3 className="text-3xl font-bold text-slate-900">Option A: Shared Organization</h3>
            </div>

            <InfoBox type="why" title="Why This Wins">
              <ul className="space-y-1.5 mt-1">
                <li>1. <strong>Simplest model</strong> that solves all our problems</li>
                <li>2. <strong>Industry standard</strong> — every company from 2 to 10,000 people uses this</li>
                <li>3. <strong>12-minute one-time setup</strong> eliminates ongoing confusion forever</li>
                <li>4. <strong>Each person keeps their identity</strong> — commits show who did what</li>
                <li>5. <strong>No password sharing</strong>, no Terms of Service violations</li>
                <li>6. <strong>Scales effortlessly</strong> — add more people later without changing anything</li>
              </ul>
            </InfoBox>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Account Roles</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium w-1/3"></th>
                    <th className="text-left py-3 px-4 text-blue-600 font-semibold">Ishan&apos;s (Main / Production)</th>
                    <th className="text-left py-3 px-4 text-purple-600 font-semibold">Jagan&apos;s (Sandbox / Testing)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Purpose", "The live empire", "Testing & experiments"],
                    ["Who sees it", "Customers & partners", "Only Jagan"],
                    ["Data", "Real customer data", "Fake test data"],
                    ["Risk level", "Be careful here", "Break anything you want"],
                    ["Analogy", "Restaurant kitchen (live orders)", "Home kitchen (trying recipes)"],
                  ].map(([label, col1, col2]) => (
                    <tr key={label} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-800 font-medium">{label}</td>
                      <td className="py-3 px-4 text-slate-500">{col1}</td>
                      <td className="py-3 px-4 text-slate-500">{col2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <InfoBox type="rule" title="The One Rule">
              <strong>Test on Jagan&apos;s. Ship on Ishan&apos;s (the org).</strong>
            </InfoBox>
          </Card>
        </section>

        {/* ── 5. IMPLEMENTATION ── */}
        <section>
          <SectionHeader id="implementation" number={5} title="Implementation" subtitle="Step-by-step setup. Total time: ~12 minutes." />

          <Card>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">1</span>
              <h3 className="text-lg font-bold text-slate-900">GitHub &mdash; Create an Organization</h3>
              <span className="text-xs text-slate-400 ml-auto">~5 min</span>
            </div>
            <p className="text-slate-500 text-sm mb-5 ml-10">This creates the shared workspace where all code lives.</p>
            <StepItem number={1} title="Go to GitHub">Profile icon (top right) &rarr; &quot;Your organizations&quot; &rarr; &quot;New organization&quot;</StepItem>
            <StepItem number={2} title="Choose the FREE plan">Enough for private repos with collaborators. No credit card needed.</StepItem>
            <StepItem number={3} title="Name it"><code className="bg-slate-100 px-2 py-0.5 rounded text-blue-600 text-sm">revenueflows-ai</code> or <code className="bg-slate-100 px-2 py-0.5 rounded text-blue-600 text-sm">empire-hq</code></StepItem>
            <StepItem number={4} title="Invite Jagan">Org page &rarr; Settings &rarr; Members &rarr; Invite &rarr; Add Jagan&apos;s GitHub username</StepItem>
            <StepItem number={5} title="Move existing repos (optional)">Repo &rarr; Settings &rarr; Danger Zone &rarr; &quot;Transfer ownership&quot; &rarr; Select the org</StepItem>
          </Card>

          <Card className="mt-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">2</span>
              <h3 className="text-lg font-bold text-slate-900">Vercel &mdash; Create a Team</h3>
              <span className="text-xs text-slate-400 ml-auto">~5 min</span>
            </div>
            <p className="text-slate-500 text-sm mb-5 ml-10">This connects deployments to the shared GitHub org.</p>
            <StepItem number={1} title="Create Team">vercel.com &rarr; Top-left dropdown &rarr; &quot;Create Team&quot;</StepItem>
            <StepItem number={2} title="Name it">Match the GitHub org (e.g., &quot;RevenueFlows AI&quot;)</StepItem>
            <StepItem number={3} title="Connect GitHub">Team Settings &rarr; Git &rarr; Connect GitHub &rarr; Authorize the org</StepItem>
            <StepItem number={4} title="Invite Jagan">Team Settings &rarr; Members &rarr; Invite &rarr; Add email</StepItem>
            <StepItem number={5} title="Move projects (optional)">Each project &rarr; Settings &rarr; Transfer &rarr; Select the team</StepItem>
          </Card>

          <Card className="mt-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">3</span>
              <h3 className="text-lg font-bold text-slate-900">Supabase &mdash; Add Team Member</h3>
              <span className="text-xs text-slate-400 ml-auto">~2 min</span>
            </div>
            <p className="text-slate-500 text-sm mb-5 ml-10">Both partners see the same database and dashboard.</p>
            <StepItem number={1} title="Open Supabase">Go to your project dashboard</StepItem>
            <StepItem number={2} title="Team settings">Click org/team name in sidebar &rarr; Members</StepItem>
            <StepItem number={3} title="Invite Jagan">Add email as member. Done.</StepItem>
          </Card>

          <InfoBox type="tip" title="After Setup — What Jagan Does">
            Accept all three invites (GitHub, Vercel, Supabase) via email. Keep personal accounts active as your testing sandbox.
          </InfoBox>
        </section>

        {/* ── 6. HOW GITHUB WORKS ── */}
        <section>
          <SectionHeader id="github" number={6} title="How GitHub Works" subtitle="Your code storage + version history." />

          <Card>
            <InfoBox type="why" title="What Is GitHub?">
              <strong>Google Docs for code.</strong> It saves every version, tracks who changed what, and lets you go back to any previous version. Your code lives on your computer AND on GitHub (the cloud).
            </InfoBox>

            <h3 className="text-lg font-bold text-slate-900 mb-6 mt-6">The Three Steps</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { n: "1", title: "Edit", desc: "Change code on your computer. Only you can see it.", color: "bg-blue-50 border-blue-100" },
                { n: "2", title: "Commit", desc: "\"Save\" with a note: \"Fixed contact form.\" Permanent snapshot.", color: "bg-purple-50 border-purple-100" },
                { n: "3", title: "Push", desc: "Upload to GitHub (cloud). Partner sees it. Vercel auto-deploys.", color: "bg-emerald-50 border-emerald-100" },
              ].map((s) => (
                <div key={s.n} className={`p-5 ${s.color} rounded-xl border text-center`}>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <span className="text-lg font-bold text-slate-700">{s.n}</span>
                  </div>
                  <h4 className="text-slate-800 font-semibold mb-1">{s.title}</h4>
                  <p className="text-slate-500 text-xs">{s.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-sm mt-4 text-center italic">
              Commits = saving progress in a video game. Push = uploading your save to the cloud.
            </p>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Version History &mdash; Always Automatic</h3>
            <p className="text-slate-600 text-sm mb-4">Every commit is saved forever. You never manually back anything up.</p>
            <div className="space-y-2 ml-4 border-l-2 border-slate-200 pl-6">
              {[
                { date: "April 5", msg: "Fixed broken contact form", tag: "latest" },
                { date: "April 4", msg: "Added new pricing page", tag: "" },
                { date: "April 3", msg: "Updated logo", tag: "" },
                { date: "April 1", msg: "Initial launch", tag: "first" },
              ].map((c) => (
                <div key={c.date} className="relative">
                  <div className="absolute -left-[31px] w-3 h-3 rounded-full bg-white border-2 border-slate-300" />
                  <p className="text-sm">
                    <span className="text-slate-400">{c.date}</span>
                    <span className="text-slate-700 ml-3">&quot;{c.msg}&quot;</span>
                    {c.tag && <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${c.tag === "latest" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-400"}`}>{c.tag}</span>}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-4">You can go back to any of these at any time. Nothing is ever deleted.</p>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Branches &mdash; Safe Experimentation</h3>
            <div className="bg-slate-50 rounded-xl p-6 mb-4 border border-slate-100">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <div className="flex-1 h-2 bg-emerald-100 rounded-full" />
                  <span className="text-xs text-emerald-600 font-mono shrink-0">main (live site)</span>
                </div>
                <div className="flex items-center gap-3 ml-12">
                  <div className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                  <div className="flex-1 h-2 bg-purple-100 rounded-full" />
                  <span className="text-xs text-purple-600 font-mono shrink-0">your-feature (experiments)</span>
                </div>
              </div>
            </div>
            <p className="text-slate-600 text-sm mb-2"><strong className="text-slate-800">Main branch</strong> = the live website. Don&apos;t experiment here.</p>
            <p className="text-slate-600 text-sm mb-2"><strong className="text-slate-800">Feature branch</strong> = your sandbox. When it works, merge into main. When it fails, delete it. Main was never touched.</p>
            <p className="text-slate-600 text-sm"><strong className="text-slate-800">Pull Request</strong> = &quot;I made changes, please review and merge.&quot; Creates an audit trail.</p>
          </Card>

          <InfoBox type="tip" title="Reverting Mistakes">
            Tell Claude Code: &quot;Revert to the version before I broke X.&quot; The broken version stays in history, but active code goes back to the working version. Push the revert, and Vercel auto-deploys the fix.
          </InfoBox>
        </section>

        {/* ── 7. HOW VERCEL WORKS ── */}
        <section>
          <SectionHeader id="vercel" number={7} title="How Vercel Works" subtitle="Your hosting. Push code → site goes live." />

          <Card>
            <InfoBox type="why" title="What Is Vercel?">
              Vercel takes your code from GitHub, builds it into a working website, and serves it to anyone who visits your URL. <strong>You never manually deploy.</strong>
            </InfoBox>

            <h3 className="text-lg font-bold text-slate-900 mb-4 mt-6">The Deployment Chain</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 justify-center py-4">
              {[
                { label: "Push to GitHub", n: "1" },
                { label: "Vercel detects", n: "2" },
                { label: "Auto-builds", n: "3" },
                { label: "Site is live", n: "4" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 font-bold">{step.n}</span>
                    </div>
                    <p className="text-xs text-slate-500">{step.label}</p>
                  </div>
                  {i < 3 && <span className="hidden sm:block text-slate-300 text-xl mx-2">&rarr;</span>}
                </div>
              ))}
            </div>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Every Deployment Is Saved</h3>
            <div className="space-y-2">
              {[
                { time: "April 5, 3:42pm", status: "LIVE", current: true },
                { time: "April 5, 1:15pm", status: "ready", current: false },
                { time: "April 4, 9:30pm", status: "ready", current: false },
                { time: "April 3, 6:00pm", status: "ready", current: false },
              ].map((d) => (
                <div key={d.time} className={`flex items-center gap-3 p-3 rounded-lg ${d.current ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-100"}`}>
                  <span className={`w-2 h-2 rounded-full ${d.current ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className="text-sm text-slate-600">{d.time}</span>
                  <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${d.current ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>{d.status}</span>
                </div>
              ))}
            </div>

            <InfoBox type="rule" title="Vercel's Superpower — Instant Revert">
              Site broke? Dashboard &rarr; find last working deployment &rarr; <strong>&quot;Promote to Production.&quot;</strong> Fixed in 5 seconds. One click. No code changes.
            </InfoBox>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Preview Deployments</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-600">Live site:</span>
                <code className="text-xs bg-white px-2 py-1 rounded text-emerald-600 ml-auto border border-emerald-100">your-app.vercel.app</code>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-100 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm text-slate-600">Preview (only you):</span>
                <code className="text-xs bg-white px-2 py-1 rounded text-purple-600 ml-auto border border-purple-100">test-feature-abc.vercel.app</code>
              </div>
            </div>
            <p className="text-slate-500 text-sm">Push to a branch (not main) &rarr; Vercel creates a preview URL. Test it, then merge when ready. Live site stays untouched.</p>
          </Card>
        </section>

        {/* ── 8. HOW SUPABASE WORKS ── */}
        <section>
          <SectionHeader id="supabase" number={8} title="How Supabase Works" subtitle="Your database. Where data lives." />

          <Card>
            <InfoBox type="why" title="What Is Supabase?">
              Where your <strong>data</strong> lives &mdash; leads, users, settings. Think of it as a powerful Google Sheet that your apps read and write to automatically.
            </InfoBox>

            <h3 className="text-lg font-bold text-slate-900 mb-4 mt-6">Two Types of Changes</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl">
                <h4 className="text-emerald-700 font-semibold mb-2">Data Changes (Low Risk)</h4>
                <p className="text-slate-500 text-sm">Adding/editing/deleting rows. Like editing a Google Sheet. Happens in real-time.</p>
              </div>
              <div className="p-5 bg-red-50 border border-red-100 rounded-xl">
                <h4 className="text-red-700 font-semibold mb-2">Structure Changes (High Risk)</h4>
                <p className="text-slate-500 text-sm">Adding/removing tables or columns. Delete a column = data gone forever.</p>
              </div>
            </div>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Version History &mdash; NOT Automatic</h3>
            <InfoBox type="warning" title="Supabase does NOT auto-save versions like GitHub and Vercel">
              You need to be careful. Use these safeguards:
            </InfoBox>
            <div className="space-y-3 mt-4">
              {[
                { title: "Daily Backups", desc: "Paid plans back up daily. Restore to yesterday from dashboard." },
                { title: "Migrations", desc: "\"Commits for your database structure.\" Claude Code creates these. Rollback if needed." },
                { title: "Point-in-Time Recovery", desc: "Higher plans let you restore to any specific minute." },
              ].map((item) => (
                <div key={item.title} className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="text-slate-800 font-medium text-sm">{item.title}</p>
                  <p className="text-slate-500 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          <InfoBox type="rule" title="Testing Database Changes">
            <strong>NEVER experiment on production.</strong> Use Jagan&apos;s personal Supabase with fake data. Apply to production only when proven.
          </InfoBox>
        </section>

        {/* ── 9. END-TO-END WORKFLOW ── */}
        <section>
          <SectionHeader id="workflow" number={9} title="End-to-End Workflow" subtitle='Real example: Adding a "phone number" field to the lead manager.' />

          <Card>
            <StepItem number={1} title="Create a branch">Tell Claude Code: &quot;Create a branch called add-phone-field.&quot; Safe copy. Live site untouched.</StepItem>
            <StepItem number={2} title="Test on sandbox database">Add &quot;phone_number&quot; column on your personal Supabase. Verify with fake data.</StepItem>
            <StepItem number={3} title="Write the code">Claude Code updates the app on your branch. Forms, displays, API calls.</StepItem>
            <StepItem number={4} title="Commit and push">Claude Code commits with a message and pushes to GitHub.</StepItem>
            <StepItem number={5} title="Check the preview">Vercel creates a preview URL. Visit it. Test everything.</StepItem>
            <StepItem number={6} title="Merge to main">Looks good? Merge. Vercel auto-deploys.</StepItem>
            <StepItem number={7} title="Update production database">Apply the column change to the real Supabase.</StepItem>
            <StepItem number={8} title="Verify">Check live site. Phone numbers work. Done.</StepItem>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">If Something Goes Wrong</h3>
            <div className="space-y-3">
              {[
                { stage: "Preview broken", color: "bg-amber-50 border-amber-100", textColor: "text-amber-700", fix: "Don't merge. Fix on branch, push again. Preview updates automatically." },
                { stage: "Live site broken after merge", color: "bg-red-50 border-red-100", textColor: "text-red-700", fix: "Vercel dashboard → previous deployment → \"Promote to Production.\" Fixed in 5 seconds." },
                { stage: "Database change broke things", color: "bg-red-50 border-red-100", textColor: "text-red-700", fix: "Restore from Supabase backup or roll back migration." },
              ].map((item) => (
                <div key={item.stage} className={`p-4 ${item.color} border rounded-lg`}>
                  <p className={`${item.textColor} font-medium text-sm`}>{item.stage}</p>
                  <p className="text-slate-500 text-xs mt-1">{item.fix}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ── 10. WHERE SHOULD I DO THIS ── */}
        <section>
          <SectionHeader id="where" number={10} title="Where Should I Do This?" subtitle="The quick-reference cheat sheet." />

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">What you&apos;re doing</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Where</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { what: "Building a new feature to test", where: "Your accounts (sandbox)", color: "text-purple-600" },
                    { what: "Feature works, ready to ship", where: "Org (shared) accounts", color: "text-blue-600" },
                    { what: "Quick experiment / throwaway", where: "Your accounts", color: "text-purple-600" },
                    { what: "Fixing a bug on a live app", where: "Org — but branch first", color: "text-blue-600" },
                    { what: "Learning something new", where: "Your accounts", color: "text-purple-600" },
                    { what: "Anything a customer sees", where: "Org accounts ONLY", color: "text-blue-600" },
                    { what: "Database experiment", where: "Your Supabase (never production)", color: "text-purple-600" },
                  ].map((row) => (
                    <tr key={row.what} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-600">{row.what}</td>
                      <td className={`py-3 px-4 font-semibold ${row.color}`}>{row.where}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <InfoBox type="rule" title="The Simple Test">
              Asking yourself &quot;Should I do this on the live one?&quot; &mdash; the answer is probably no. Do it on yours first.
            </InfoBox>
          </Card>
        </section>

        {/* ── 11. API KEYS ── */}
        <section>
          <SectionHeader id="api-keys" number={11} title="API Keys & Secrets" subtitle="Where they live and how they flow between environments." />

          <Card>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Active Services (10)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {["Apify", "Instantly", "DeBounce", "Apollo", "OpenRouter", "Supabase", "AWeber", "GitHub", "Vercel", "Gmail"].map((s) => (
                <div key={s} className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-center">
                  <p className="text-slate-700 text-sm font-medium">{s}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">How Keys Flow</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <span className="text-blue-500 shrink-0 mt-0.5 font-bold">Local</span>
                <p className="text-slate-600 text-sm">Keys come from <code className="bg-white px-1.5 py-0.5 rounded text-sm border border-slate-200">.env</code> or <code className="bg-white px-1.5 py-0.5 rounded text-sm border border-slate-200">.env.local</code> files on your computer.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                <span className="text-emerald-600 shrink-0 mt-0.5 font-bold">Live</span>
                <p className="text-slate-600 text-sm">Keys are set in <strong>Vercel Environment Variables</strong> dashboard. Encrypted, secure, never in code.</p>
              </div>
            </div>
            <InfoBox type="warning" title="The .env file is NEVER committed to GitHub">
              It&apos;s in .gitignore. Each developer has their own local copy. Production keys live in Vercel&apos;s dashboard only.
            </InfoBox>
          </Card>
        </section>

        {/* ── 12. SECURITY ── */}
        <section>
          <SectionHeader id="security" number={12} title="Security Rules" subtitle="Never share passwords. Use platform collaboration instead." />

          <Card>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3">Never Do This</p>
                <div className="space-y-2">
                  {[
                    "Share login credentials",
                    "Put API keys in code files",
                    "Commit .env files to GitHub",
                    "Use one account for two people",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 p-2 bg-red-50 border border-red-100 rounded-lg">
                      <span className="text-red-400 text-sm">&#10005;</span>
                      <span className="text-slate-600 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">Always Do This</p>
                <div className="space-y-2">
                  {[
                    "Use org/team membership",
                    "Each person uses their own login",
                    "Keys in Vercel dashboard (encrypted)",
                    "Revoke access by removing member",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                      <span className="text-emerald-500 text-sm">&#10003;</span>
                      <span className="text-slate-600 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ── 13. COMMON SCENARIOS ── */}
        <section>
          <SectionHeader id="scenarios" number={13} title="Common Scenarios" subtitle="Quick answers to questions that will come up." />

          <div className="space-y-4">
            {[
              { q: "I built something on my personal Vercel. How do I move it to the org?", a: "Transfer the GitHub repo to the org first (repo Settings \u2192 Transfer). Then import it into the Vercel team." },
              { q: "Need to fix a bug on a live app urgently.", a: "Clone the repo, create a branch, fix, push, check preview, merge. If truly urgent, push directly to main \u2014 but branching is safer." },
              { q: "My partner's change broke the live site.", a: "Vercel dashboard \u2192 find last working deployment \u2192 \"Promote to Production.\" Fixed in 5 seconds." },
              { q: "Want to try a completely new tech stack.", a: "Personal accounts only. Don\u2019t touch the org until it\u2019s proven." },
              { q: "Claude Code can't find an API key.", a: "Check central .env \u2192 then project .env.local \u2192 then Vercel environment variables." },
              { q: "We both edited the same file at the same time.", a: "Git flags a \"merge conflict\" showing both versions. Claude Code resolves it." },
              { q: "Accidentally pushed API keys to GitHub.", a: "Immediately rotate (regenerate) the keys. Remove from code, push clean version." },
              { q: "Which Supabase does a Vercel app use?", a: "Check Vercel project \u2192 Settings \u2192 Environment Variables. SUPABASE_URL tells you." },
            ].map((item, i) => (
              <Card key={i}>
                <h4 className="text-slate-800 font-semibold text-sm mb-2 flex items-start gap-2">
                  <span className="text-blue-500 shrink-0 font-bold">Q</span>
                  {item.q}
                </h4>
                <p className="text-slate-500 text-sm flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0 font-bold">A</span>
                  {item.a}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-12 border-t border-slate-200">
          <p className="text-slate-400 text-sm">Empire Collaboration Guide &mdash; RevenueFlows AI</p>
          <p className="text-slate-300 text-xs mt-1">Built by Claude Code &middot; April 2026</p>
        </footer>
      </main>
    </div>
  );
}
