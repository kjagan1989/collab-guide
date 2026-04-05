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
    <div className="w-full max-w-4xl mx-auto mb-10">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all duration-300 group cursor-text shadow-sm"
        >
          <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span className="text-slate-400 text-left text-sm sm:text-base">Have a question? Ask AI anything about this guide...</span>
        </button>
      ) : (
        <div className="bg-white border border-blue-200 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:border-blue-400 transition-colors">
                <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input ref={inputRef} type="text" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAsk()} placeholder="Ask anything about collaboration, deployment, reverting..." className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 outline-none text-base" />
              </div>
              <button onClick={handleAsk} disabled={loading || !question.trim()} className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-medium transition-colors shrink-0">
                {loading ? <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Thinking</span> : "Ask"}
              </button>
              <button onClick={() => { setIsOpen(false); setAnswer(""); setQuestion(""); }} className="px-3 py-3 text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Should I work on my Vercel or the shared one?", "How do I revert a broken deployment?", "Where do API keys go?", "What if we both edit the same file?"].map((q) => (
                <button key={q} onClick={() => setQuestion(q)} className="text-xs px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition-colors">{q}</button>
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
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 w-52 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3 px-2">Sections</p>
        <div className="space-y-0.5">
          {SECTION_IDS.map(({ id, title, number }) => (
            <a key={id} href={`#${id}`} className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs transition-all duration-200 ${activeSection === id ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}>
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${activeSection === id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400"}`}>{number}</span>
              <span className="truncate">{title}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ─── Reusable ─── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm ${className}`}>{children}</div>;
}

function Callout({ type, title, children }: { type: "info" | "warning" | "rule"; title: string; children: React.ReactNode }) {
  const s = {
    info: { bg: "bg-blue-50", border: "border-blue-200", title: "text-blue-700", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    warning: { bg: "bg-amber-50", border: "border-amber-200", title: "text-amber-700", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /> },
    rule: { bg: "bg-emerald-50", border: "border-emerald-200", title: "text-emerald-700", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
  }[type];
  return (
    <div className={`${s.bg} border ${s.border} rounded-xl p-5 my-5`}>
      <div className="flex items-center gap-2 mb-2">
        <svg className={`w-5 h-5 ${s.title}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
        <span className={`font-semibold text-sm ${s.title}`}>{title}</span>
      </div>
      <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-slate-600 leading-relaxed">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function PlatformBlock({ tag, label, children }: { tag: string; label: string; children: React.ReactNode }) {
  return (
    <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{tag}</span>
        {label}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function StepItem({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-5">
      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 mt-0.5">{number}</div>
      <div className="flex-1">
        <h4 className="text-slate-900 font-semibold mb-1">{title}</h4>
        <div className="text-slate-500 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/* ─── Collapsible Reference Section ─── */
function RefSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors">
        <span className="font-semibold text-slate-800">{title}</span>
        <svg className={`w-5 h-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && <div className="px-5 pb-5 border-t border-slate-100">{children}</div>}
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
            Ishan &amp; Jagan
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Collaboration <span className="text-blue-600">Guide</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            How Jagan and Ishan work together on GitHub, Vercel, and Supabase.
          </p>
        </div>
      </header>

      {/* AI Search */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        <AiSearch />
      </div>

      <main className="max-w-4xl mx-auto px-6 pb-24 space-y-16">

        {/* ══════════════ 1. THE PROBLEM ══════════════ */}
        <section>
          <div id="problem" className="scroll-mt-24 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 font-bold text-sm">1</span>
              The Problem
            </h2>
          </div>

          <Card>
            <p className="text-slate-600 mb-5">We each have our own GitHub, Vercel, and Supabase. Projects are scattered across both accounts. This causes:</p>
            <ul className="space-y-2">
              <Bullet>No shared home for code &mdash; constant &quot;which repo is the latest?&quot; confusion</Bullet>
              <Bullet>Two separate Vercels deploying &mdash; nobody knows which URL is the real one</Bullet>
              <Bullet>Can&apos;t access each other&apos;s Supabase without sharing passwords</Bullet>
              <Bullet>API keys scattered in random folders &mdash; new Claude Code sessions can&apos;t find them</Bullet>
              <Bullet>No audit trail &mdash; if something breaks, nobody knows who changed what</Bullet>
              <Bullet>Can&apos;t collaborate on the same project without messy workarounds</Bullet>
            </ul>
            <p className="text-slate-800 font-semibold text-sm mt-5 pt-4 border-t border-slate-100">We&apos;re running a two-person company with single-person tooling. We need shared infrastructure.</p>
          </Card>
        </section>

        {/* ══════════════ 2. OPTIONS ══════════════ */}
        <section>
          <div id="options" className="scroll-mt-24 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">2</span>
              Options At Our Disposal
            </h2>
            <p className="text-slate-500 mt-2 ml-12">Three approaches. Each explained fully for GitHub, Vercel, and Supabase.</p>
          </div>

          {/* ── OPTION A ── */}
          <Card>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">A</span>
              <h3 className="text-xl font-bold text-slate-900">Shared Organization</h3>
              <span className="ml-auto px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">Chosen</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 ml-11">Create a shared workspace that both partners own. One home for everything.</p>

            <div className="space-y-4">
              <PlatformBlock tag="GH" label="GitHub">
                <ul className="space-y-2">
                  <Bullet>We create a GitHub <strong>Organization</strong> (e.g., &quot;revenueflows-ai&quot;)</Bullet>
                  <Bullet>This is a shared space that sits above both our personal accounts</Bullet>
                  <Bullet>All shared repos move into the org &mdash; not under Jagan&apos;s or Ishan&apos;s personal GitHub</Bullet>
                  <Bullet>Both of us are members with full push access</Bullet>
                  <Bullet>When Jagan commits, it shows as Jagan. When Ishan commits, it shows as Ishan. Full audit trail.</Bullet>
                  <Bullet>Both can create branches, submit pull requests, review, and merge</Bullet>
                </ul>
                <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Reverting &amp; Fixing Issues</p>
                  <ul className="space-y-1.5">
                    <Bullet>Every commit is a saved snapshot. You can revert to any previous version at any time.</Bullet>
                    <Bullet>Revert is instant &mdash; tell Claude Code &quot;revert to the last working version&quot; and push</Bullet>
                    <Bullet>Nothing is ever deleted. The broken version stays in history, active code goes back to the working version.</Bullet>
                    <Bullet>Both partners can see the full history of every change ever made</Bullet>
                  </ul>
                </div>
              </PlatformBlock>

              <PlatformBlock tag="VC" label="Vercel">
                <ul className="space-y-2">
                  <Bullet>We create a Vercel <strong>Team</strong> and connect it to the GitHub org</Bullet>
                  <Bullet>Only ONE Vercel watches the repos &mdash; no more &quot;is it on Jagan&apos;s or Ishan&apos;s Vercel?&quot;</Bullet>
                  <Bullet>When either of us pushes code to GitHub, Vercel auto-deploys within seconds</Bullet>
                  <Bullet>Both partners are team members &mdash; both see all deployments and can manage projects</Bullet>
                  <Bullet>Every push to a branch (not main) gets a <strong>preview URL</strong> &mdash; test before going live</Bullet>
                  <Bullet>API keys for production go in Vercel&apos;s Environment Variables dashboard (encrypted, not in code)</Bullet>
                </ul>
                <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Reverting &amp; Fixing Issues</p>
                  <ul className="space-y-1.5">
                    <Bullet>Every deployment is saved forever. Vercel keeps a complete list of every version.</Bullet>
                    <Bullet>Site broke? Go to Vercel dashboard &rarr; find the last working deployment &rarr; click &quot;Promote to Production&quot;</Bullet>
                    <Bullet><strong>Fixed in 5 seconds. One click. No code changes needed.</strong></Bullet>
                    <Bullet>Then fix the code on a new branch, test via preview URL, and merge when ready</Bullet>
                  </ul>
                </div>
              </PlatformBlock>

              <PlatformBlock tag="SB" label="Supabase">
                <ul className="space-y-2">
                  <Bullet>One person owns the Supabase project (whoever handles billing &mdash; Ishan)</Bullet>
                  <Bullet>The other is invited as a <strong>team member</strong></Bullet>
                  <Bullet>Both see the same database, tables, API keys, and dashboard</Bullet>
                  <Bullet>No password sharing. Each person logs in with their own account.</Bullet>
                  <Bullet>Data changes (adding/editing rows) happen in real-time, like editing a Google Sheet</Bullet>
                  <Bullet>Structure changes (adding/removing columns or tables) are higher risk &mdash; deleted data is gone</Bullet>
                </ul>
                <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Reverting &amp; Fixing Issues</p>
                  <ul className="space-y-1.5">
                    <Bullet>Supabase does <strong>NOT</strong> auto-save versions like GitHub and Vercel</Bullet>
                    <Bullet>Daily backups (paid plans) &mdash; restore your entire database to yesterday</Bullet>
                    <Bullet>Migrations &mdash; like &quot;commits for your database structure.&quot; Can be rolled back.</Bullet>
                    <Bullet>Point-in-time recovery (higher plans) &mdash; restore to any specific minute</Bullet>
                    <Bullet><strong>Rule: Never experiment on the production database.</strong> Use a personal Supabase with fake data for testing.</Bullet>
                  </ul>
                </div>
              </PlatformBlock>
            </div>
          </Card>

          {/* ── OPTION B ── */}
          <Card className="mt-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 font-bold text-sm flex items-center justify-center">B</span>
              <h3 className="text-xl font-bold text-slate-900">Fork + Pull Request Model</h3>
              <span className="ml-auto px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-200">Rejected</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 ml-11">Each person keeps their own accounts. One repo is the &quot;source of truth.&quot; The other copies it and sends changes back.</p>

            <div className="space-y-4">
              <PlatformBlock tag="GH" label="GitHub">
                <ul className="space-y-2">
                  <Bullet>Ishan&apos;s GitHub has the main repo</Bullet>
                  <Bullet>Jagan &quot;forks&quot; it &mdash; creates a complete copy under his own GitHub</Bullet>
                  <Bullet>Jagan works on his copy, then submits a &quot;pull request&quot; to merge changes back</Bullet>
                  <Bullet>Ishan reviews and approves each change</Bullet>
                  <Bullet><strong>Problem:</strong> Jagan&apos;s fork easily gets out of date. Every time Ishan makes changes, Jagan has to manually sync his copy.</Bullet>
                  <Bullet><strong>Problem:</strong> Two copies of the same code floating around. Which one is current?</Bullet>
                </ul>
              </PlatformBlock>

              <PlatformBlock tag="VC" label="Vercel">
                <ul className="space-y-2">
                  <Bullet>Each person connects their own Vercel to their own GitHub repo</Bullet>
                  <Bullet><strong>Two Vercels deploying two copies</strong> of the same project</Bullet>
                  <Bullet>Which URL is the &quot;real&quot; site? Which one do customers use?</Bullet>
                  <Bullet>If Jagan forgets to sync his fork, his Vercel deploys an outdated version</Bullet>
                </ul>
              </PlatformBlock>

              <PlatformBlock tag="SB" label="Supabase">
                <ul className="space-y-2">
                  <Bullet>Both apps need to point to the same database</Bullet>
                  <Bullet>But Jagan can&apos;t see Ishan&apos;s Supabase dashboard without sharing passwords</Bullet>
                  <Bullet>Either share credentials (bad) or work with separate databases and hope they stay in sync (fragile)</Bullet>
                </ul>
              </PlatformBlock>

              <PlatformBlock tag="FIX" label="Reverting & Fixing Issues">
                <ul className="space-y-2">
                  <Bullet>GitHub reverting works the same as Option A (per-repo)</Bullet>
                  <Bullet>But Vercel reverting is confusing &mdash; two Vercels, two deployment histories, two dashboards to check</Bullet>
                  <Bullet>Supabase &mdash; same challenges as Option A, but worse because access may not be shared</Bullet>
                </ul>
              </PlatformBlock>
            </div>

            <p className="text-sm text-slate-500 mt-5 ml-2 italic">Built for open-source projects with hundreds of strangers. Too much friction for two partners.</p>
          </Card>

          {/* ── OPTION C ── */}
          <Card className="mt-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 font-bold text-sm flex items-center justify-center">C</span>
              <h3 className="text-xl font-bold text-slate-900">Monorepo</h3>
              <span className="ml-auto px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">Maybe Later</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 ml-11">One giant repo. Each person&apos;s projects get their own folder. Shared code in a shared folder.</p>

            <div className="space-y-4">
              <PlatformBlock tag="GH" label="GitHub">
                <ul className="space-y-2">
                  <Bullet>One single repo with a folder structure:</Bullet>
                </ul>
                <div className="bg-white border border-slate-200 rounded-lg p-3 font-mono text-xs text-slate-600 mt-2 mb-2 ml-4">
                  <div>/lead-manager &nbsp;&nbsp;&rarr; Jagan&apos;s project</div>
                  <div>/antigravity &nbsp;&nbsp;&nbsp;&rarr; Ishan&apos;s project</div>
                  <div>/shared &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&rarr; components both use</div>
                </div>
                <ul className="space-y-2">
                  <Bullet>Both push to the same repo</Bullet>
                  <Bullet><strong>Problem:</strong> One bad commit in /shared can break every project that depends on it</Bullet>
                  <Bullet><strong>Problem:</strong> Repo gets very large very fast</Bullet>
                </ul>
              </PlatformBlock>

              <PlatformBlock tag="VC" label="Vercel">
                <ul className="space-y-2">
                  <Bullet>Multiple Vercel projects pointing to different folders within the same repo</Bullet>
                  <Bullet>Vercel can be configured to only rebuild when files in a specific folder change</Bullet>
                  <Bullet><strong>Problem:</strong> Tricky to configure. Needs &quot;root directory&quot; settings and &quot;ignore build step&quot; rules.</Bullet>
                  <Bullet>More complex to set up and maintain than separate repos</Bullet>
                </ul>
              </PlatformBlock>

              <PlatformBlock tag="SB" label="Supabase">
                <ul className="space-y-2">
                  <Bullet>No difference from Option A &mdash; Supabase doesn&apos;t care about repo structure</Bullet>
                  <Bullet>But managing database migrations gets trickier with multiple apps in one repo</Bullet>
                </ul>
              </PlatformBlock>

              <PlatformBlock tag="FIX" label="Reverting & Fixing Issues">
                <ul className="space-y-2">
                  <Bullet>Reverting one project&apos;s code might accidentally revert another project&apos;s changes (since they share a repo)</Bullet>
                  <Bullet>Need careful commit discipline to keep projects independent</Bullet>
                  <Bullet>Vercel reverting works per-project, but the shared codebase adds risk</Bullet>
                </ul>
              </PlatformBlock>
            </div>

            <p className="text-sm text-slate-500 mt-5 ml-2 italic">Used by Google and Meta. Potentially useful later if we build shared components across many apps.</p>
          </Card>

          {/* Decision summary */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">Our Decision</p>
            <p className="text-2xl font-bold text-slate-900 mb-2">Option A: Shared Organization</p>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">Simplest approach. Industry standard. 12-minute setup. Full audit trail. Easy reverting on all three platforms. Scales to more people without changes.</p>
          </div>

          {/* Account roles */}
          <Card className="mt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Who Owns What</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium"></th>
                    <th className="text-left py-3 px-4 text-blue-600 font-semibold">Ishan&apos;s Accounts (Production)</th>
                    <th className="text-left py-3 px-4 text-purple-600 font-semibold">Jagan&apos;s Accounts (Sandbox)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Purpose", "Live apps customers see", "Testing & experiments"],
                    ["Data", "Real customer data", "Fake test data"],
                    ["Risk", "Be careful", "Break anything"],
                    ["When to use", "Shipping to production", "Trying new ideas"],
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
            <Callout type="rule" title="The Rule">
              <strong>Test on Jagan&apos;s. Ship on Ishan&apos;s (the org).</strong>
            </Callout>
          </Card>
        </section>

        {/* ══════════════ 3. IMPLEMENTATION ══════════════ */}
        <section>
          <div id="implementation" className="scroll-mt-24 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">3</span>
              Implementation
            </h2>
            <p className="text-slate-500 mt-2 ml-12">What Ishan needs to do. Total time: ~12 minutes. Jagan just accepts invites.</p>
          </div>

          <Card>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">1</span>
              <h3 className="text-lg font-bold text-slate-900">GitHub &mdash; Create an Organization</h3>
              <span className="text-xs text-slate-400 ml-auto">~5 min</span>
            </div>
            <p className="text-slate-500 text-sm mb-5 ml-10">Creates the shared workspace where all code lives.</p>
            <StepItem number={1} title="Create the org">GitHub.com &rarr; Profile icon (top right) &rarr; &quot;Your organizations&quot; &rarr; &quot;New organization&quot;</StepItem>
            <StepItem number={2} title="Pick the free plan">Enough for private repos with collaborators. No credit card.</StepItem>
            <StepItem number={3} title="Name it"><code className="bg-slate-100 px-2 py-0.5 rounded text-blue-600 text-sm">revenueflows-ai</code> or <code className="bg-slate-100 px-2 py-0.5 rounded text-blue-600 text-sm">shared-hq</code></StepItem>
            <StepItem number={4} title="Invite Jagan">Org page &rarr; Settings &rarr; Members &rarr; Invite member &rarr; Add Jagan&apos;s GitHub username</StepItem>
            <StepItem number={5} title="Move existing repos (optional)">Repo &rarr; Settings &rarr; Danger Zone &rarr; &quot;Transfer ownership&quot; &rarr; Select the org</StepItem>
          </Card>

          <Card className="mt-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">2</span>
              <h3 className="text-lg font-bold text-slate-900">Vercel &mdash; Create a Team</h3>
              <span className="text-xs text-slate-400 ml-auto">~5 min</span>
            </div>
            <p className="text-slate-500 text-sm mb-5 ml-10">Connects deployments to the shared GitHub org.</p>
            <StepItem number={1} title="Create the team">vercel.com &rarr; Top-left dropdown &rarr; &quot;Create Team&quot;</StepItem>
            <StepItem number={2} title="Name it">Match the GitHub org name</StepItem>
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
            <p className="text-slate-500 text-sm mb-5 ml-10">Both partners see the same database.</p>
            <StepItem number={1} title="Open project">Go to Supabase dashboard</StepItem>
            <StepItem number={2} title="Go to team settings">Click org/team name in sidebar &rarr; Members</StepItem>
            <StepItem number={3} title="Invite Jagan">Add email as member. Done.</StepItem>
          </Card>

          <Callout type="info" title="After setup &mdash; What Jagan does">
            Accept all three invites via email (GitHub, Vercel, Supabase). Keep personal accounts active as testing sandbox.
          </Callout>
        </section>

        {/* ══════════════ 4. QUICK REFERENCE ══════════════ */}
        <section>
          <div id="reference" className="scroll-mt-24 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">4</span>
              Quick Reference
            </h2>
            <p className="text-slate-500 mt-2 ml-12">Expand any section below when you need it.</p>
          </div>

          <div className="space-y-3">
            <RefSection title="Where Should I Do This? (Cheat Sheet)">
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 text-slate-400 font-medium">Task</th>
                    <th className="text-left py-2 px-3 text-slate-400 font-medium">Where</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ["Building a new feature to test", "Your accounts (sandbox)"],
                      ["Feature works, ready to ship", "Org (shared)"],
                      ["Quick experiment / throwaway", "Your accounts"],
                      ["Fixing a bug on a live app", "Org \u2014 but make a branch first"],
                      ["Learning something new", "Your accounts"],
                      ["Anything a customer will see", "Org ONLY"],
                      ["Database experiment", "Your Supabase (never production)"],
                    ].map(([task, where]) => (
                      <tr key={task} className="border-b border-slate-100">
                        <td className="py-2 px-3 text-slate-600">{task}</td>
                        <td className="py-2 px-3 text-slate-800 font-medium">{where}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-slate-500 text-sm mt-3 italic">If you&apos;re asking &quot;Should I do this on the live one?&quot; &mdash; the answer is probably no.</p>
            </RefSection>

            <RefSection title="How a Typical Change Works (End-to-End)">
              <div className="mt-4 space-y-3">
                {[
                  ["1. Create a branch", "Safe copy. Live site untouched."],
                  ["2. Test database changes", "On your personal Supabase with fake data."],
                  ["3. Write code on the branch", "Claude Code helps."],
                  ["4. Commit and push", "Saves to GitHub."],
                  ["5. Check the preview URL", "Vercel auto-generates one for your branch. Test everything."],
                  ["6. Merge to main", "Vercel auto-deploys to the live site."],
                  ["7. Update production database", "Apply the same structure change to the real Supabase."],
                  ["8. Verify", "Check the live site."],
                ].map(([step, desc]) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="text-slate-800 font-medium text-sm shrink-0 w-44">{step}</span>
                    <span className="text-slate-500 text-sm">{desc}</span>
                  </div>
                ))}
              </div>
            </RefSection>

            <RefSection title="API Keys & Environment Variables">
              <div className="mt-4 space-y-3">
                <p className="text-slate-600 text-sm"><strong>10 active services:</strong> Apify, Instantly, DeBounce, Apollo, OpenRouter, Supabase, AWeber, GitHub, Vercel, Gmail (2 accounts)</p>
                <ul className="space-y-2">
                  <Bullet><strong>On your computer:</strong> Keys live in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">.env</code> or <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">.env.local</code> files</Bullet>
                  <Bullet><strong>In production:</strong> Keys go in Vercel Environment Variables dashboard (encrypted)</Bullet>
                  <Bullet><strong>The .env file is NEVER committed to GitHub</strong> &mdash; it&apos;s in .gitignore</Bullet>
                  <Bullet>Each developer keeps their own local .env. Production keys live in Vercel only.</Bullet>
                </ul>
              </div>
            </RefSection>

            <RefSection title="Security Rules">
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-2">Never</p>
                  <ul className="space-y-1.5">
                    <Bullet>Share login credentials</Bullet>
                    <Bullet>Put API keys in code files</Bullet>
                    <Bullet>Commit .env files to GitHub</Bullet>
                    <Bullet>Use one account for two people</Bullet>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">Always</p>
                  <ul className="space-y-1.5">
                    <Bullet>Use org/team membership</Bullet>
                    <Bullet>Each person uses their own login</Bullet>
                    <Bullet>Store production keys in Vercel (encrypted)</Bullet>
                    <Bullet>Revoke access by removing the member</Bullet>
                  </ul>
                </div>
              </div>
            </RefSection>

            <RefSection title="Common Scenarios">
              <div className="mt-4 space-y-4">
                {[
                  { q: "Built something on my personal Vercel. How to move it?", a: "Transfer the GitHub repo to the org (Settings \u2192 Transfer). Then import into the Vercel team." },
                  { q: "Partner's change broke the live site.", a: "Vercel dashboard \u2192 find last working deployment \u2192 \"Promote to Production.\" Fixed in 5 seconds." },
                  { q: "Want to try a new tech stack.", a: "Personal accounts only. Don\u2019t touch the org until it\u2019s proven." },
                  { q: "Claude Code can't find an API key.", a: "Check central .env \u2192 then project .env.local \u2192 then Vercel environment variables." },
                  { q: "We both edited the same file.", a: "Git flags a \"merge conflict\" showing both versions. Claude Code resolves it." },
                  { q: "Accidentally pushed API keys to GitHub.", a: "Immediately regenerate the exposed keys on the service dashboard. Remove from code, push clean version." },
                ].map((item, i) => (
                  <div key={i} className="border-b border-slate-100 pb-3 last:border-0">
                    <p className="text-sm text-slate-800 font-medium">{item.q}</p>
                    <p className="text-sm text-slate-500 mt-1">{item.a}</p>
                  </div>
                ))}
              </div>
            </RefSection>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-slate-200">
          <p className="text-slate-400 text-sm">Collaboration Guide &mdash; Ishan &amp; Jagan</p>
          <p className="text-slate-300 text-xs mt-1">Built by Claude Code &middot; April 2026</p>
        </footer>
      </main>
    </div>
  );
}
