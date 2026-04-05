export const REPORT_CONTENT = `
# Empire Collaboration Guide — RevenueFlows AI

## Who This Is For
Jagan and Ishan — two partners building the RevenueFlows AI empire. Jagan runs operations and strategy from Edmonton, Canada. Ishan manages Antigravity (VS Code + Gemini) with MCP servers and integrations. Both use Claude Code.

---

## SECTION 1: THE PROBLEM — WHY WE NEED THIS

Right now, Jagan and Ishan each have their own separate GitHub, Vercel, and Supabase accounts. Projects are scattered across both accounts with no shared home.

This causes real problems:
- "Which repo has the latest version?" — constant confusion
- "Where is this deployed?" — nobody knows without checking both Vercels
- "Why can't Claude Code find the API keys?" — because they're saved in random project folders instead of one central place
- If Ishan builds something, Jagan can't easily access, deploy, or work on it (and vice versa)
- No clean way to both work on the same project without sharing passwords (which is bad)
- No audit trail — if something breaks, who changed what?

The core issue: We're running a two-person company with single-person tooling. Everything is siloed.

---

## SECTION 2: THREE OPTIONS WE CONSIDERED

### Option A: Shared Organization
Create a shared GitHub org (like a company workspace). Both partners are members. All repos, deployments, and databases are accessible from one place.

PROS:
- One source of truth — no "which repo is latest?" confusion
- Both partners push code under their own names — full audit trail
- Vercel auto-deploys from the shared repos — one deployment pipeline
- Supabase shared via team membership — both see the same dashboard
- Industry standard — this is how every company works
- Revoking access is one click, no password changes

CONS:
- Requires 12 minutes of setup (one-time)
- Need to transfer existing repos and projects

### Option B: Fork + Pull Request Model
Each person keeps their own GitHub/Vercel. One person's repo is the "source of truth." The other forks (copies) and submits pull requests (change proposals).

PROS:
- No org setup needed
- Clear separation of ownership

CONS:
- Too much friction for a two-person team
- Designed for open-source contributors (strangers), not partners
- Vercel deploys from two different places — confusing
- Easy to get out of sync — "is your fork up to date?"
- Double the maintenance

### Option C: Monorepo with Ownership Boundaries
One shared repo, but different folders mapped to different Vercel projects.

PROS:
- Shared code between projects is easy
- One repo to rule them all

CONS:
- Unnecessary complexity for current needs
- One bad commit can affect multiple projects
- CI/CD configuration gets complicated
- May be useful later when we have shared components

---

## SECTION 3: THE DECISION

We chose Option A: Shared Organization.

WHY:
1. It's the simplest model that solves all our problems
2. It's the industry standard — every company from 2 people to 10,000 uses this
3. One-time 12-minute setup eliminates ongoing confusion forever
4. Each person keeps their identity — commits show who did what
5. No password sharing, no Terms of Service violations
6. Easy to scale — add more team members later without changing anything

ACCOUNT ROLES:
- Ishan's accounts are the MAIN ones (production — what customers see)
- Jagan's accounts are the SANDBOX (testing, experiments, prototypes)
- Rule: Test on Jagan's. Ship on Ishan's (the org).
- Think of it as: Ishan's = restaurant kitchen serving customers. Jagan's = home kitchen trying new recipes.

---

## SECTION 4: IMPLEMENTATION — SETUP STEPS

Total time: approximately 12 minutes. All steps are on Ishan's side. Jagan just accepts the invites.

### Step 1: GitHub — Create an Organization (5 minutes)
1. Go to github.com, click profile icon, "Your organizations", "New organization"
2. Choose the FREE plan
3. Name it "revenueflows-ai" or "empire-hq"
4. Settings, Members, Invite member, add Jagan's GitHub username
5. Optionally move existing repos: Repo Settings, Danger Zone, Transfer ownership, select the org

### Step 2: Vercel — Create a Team (5 minutes)
1. Go to vercel.com, top-left dropdown, "Create Team"
2. Name it to match the GitHub org
3. Team Settings, Git, Connect GitHub, authorize the org
4. Team Settings, Members, Invite, add Jagan's email
5. Optionally transfer existing projects to the team

### Step 3: Supabase — Add Team Member (2 minutes)
1. Open Supabase project dashboard
2. Click org/team name in sidebar, go to Members
3. Invite Jagan's email as a member

### What Jagan Does After
Accept all three invites via email. Keep personal accounts active as testing sandbox.

---

## SECTION 5: HOW GITHUB WORKS — VERSION CONTROL

GitHub is like Google Docs for code. It saves every version, tracks who changed what, and lets you go back to any previous version.

### The Three Steps: Edit, Commit, Push
1. EDIT: Change code on your computer. Only you can see it.
2. COMMIT: Save with a note explaining what changed. Example: "Fixed broken contact form." Each commit is a permanent snapshot.
3. PUSH: Upload your commits to GitHub (the cloud). Now your partner can see them, and Vercel auto-deploys.

Think of commits as saving your progress in a video game. Push is uploading your save file to the cloud.

### Version History Is Automatic
Every commit is saved forever. You never need to manually back anything up. You can see the full timeline and go back to any point.

### Branches — Safe Experimentation
A branch is a parallel copy of your code where you can experiment without affecting the live version.
- MAIN branch = the live website. Don't experiment here.
- TEST branch = your experimental copy. Break things freely.
When your experiment works, merge it into main. When it fails, delete the branch. Main was never touched.

### Pull Requests
A formal request saying "I made these changes, please review and merge." Your partner can review, comment, or approve. Great for tracking what changed and why.

### Reverting
Tell Claude Code: "Revert to the version before I broke X." The broken version stays in history (nothing deleted), but active code goes back to the working version.

---

## SECTION 6: HOW VERCEL WORKS — DEPLOYMENT

Vercel takes your code from GitHub, builds it, and serves it as a live website. You never manually deploy.

### The Chain
Push to GitHub → Vercel detects it (seconds) → Vercel builds automatically → Site is live

### Every Deployment Is Saved
Every push creates a separate deployment. You can see them all in your dashboard. Each is a fully working version you can visit.

### Instant Revert (Vercel's Superpower)
If the live site breaks: Vercel dashboard → find last working deployment → click "Promote to Production." Fixed in 5 seconds. No code changes needed.

### Preview Deployments
Push to a branch (not main) → Vercel creates a preview URL automatically. Only you can see it. Check it, verify it works, then merge to main. The live site is never touched until you're sure.

### Environment Variables
API keys for production go in Vercel's Environment Variables dashboard (Settings → Environment Variables). Encrypted, secure, never in code.

---

## SECTION 7: HOW SUPABASE WORKS — DATABASE

Supabase is where data lives — leads, users, settings. Like a powerful Google Sheet that apps read and write to.

### Two Types of Changes
DATA CHANGES (low risk): Adding/editing/deleting rows. Like editing a Google Sheet. Real-time.
STRUCTURE CHANGES (high risk): Adding/removing tables or columns. If you delete a column, data is gone forever.

### Version History Is NOT Automatic
Unlike GitHub and Vercel, Supabase does not auto-save versions. Safeguards:
- Daily backups (paid plans): Restore to yesterday from dashboard
- Migrations: Like commits for database structure. Can roll back.
- Point-in-time recovery (higher plans): Restore to any specific minute

### Testing Database Changes
NEVER experiment on production. Use Jagan's personal Supabase with fake data. Apply to production only when proven.

---

## SECTION 8: THE COMPLETE WORKFLOW — END TO END EXAMPLE

Example: Adding a "phone number" field to the lead manager.

1. Create a branch: "add-phone-field" — safe copy, live site untouched
2. Test database changes on sandbox Supabase with fake data
3. Write code on the branch (Claude Code helps)
4. Commit and push to GitHub
5. Check Vercel preview URL — test everything
6. Merge branch into main
7. Vercel auto-deploys to live site
8. Apply database change to production Supabase
9. Verify on live site

IF SOMETHING GOES WRONG:
- Preview broken? Don't merge. Fix on branch, push again.
- Live site broken after merge? Vercel → previous deployment → "Promote to Production." Fixed in 5 seconds.
- Database change broke things? Restore from backup or roll back migration.

---

## SECTION 9: DECISION FRAMEWORK — WHERE SHOULD I DO THIS?

Building a new feature to test → Your accounts (sandbox)
Feature works, ready to ship → Org (shared) accounts
Quick experiment / throwaway prototype → Your accounts
Fixing a bug on a live app → Org, but make a branch first
Learning something new → Your accounts
Anything a customer will see → Org accounts ONLY
Database experiment → Your Supabase (never production)

THE SIMPLE TEST: If you're asking "Should I do this on the live one?" — the answer is probably no. Do it on yours first.

---

## SECTION 10: API KEYS & ENVIRONMENT VARIABLES

### Central .env File
All API keys live in one central .env file at the project root. Currently 10 services active:
Apify, Instantly, DeBounce, Apollo, OpenRouter, Supabase, AWeber, GitHub, Vercel, Gmail (2 accounts)

### How Keys Flow
- Local development: Keys from .env or .env.local files
- Production (Vercel): Keys in Vercel Environment Variables dashboard (encrypted)
- The .env file is NEVER committed to GitHub

### About OpenRouter
Universal credit card for AI models. One key accesses hundreds of models. The code specifies which model to use, not the key.

### The Scattered Keys Problem (Fixed)
Previous Claude Code sessions saved keys in project-specific .env.local files instead of the central .env. Fixed by consolidating all keys into the central file.

---

## SECTION 11: SECURITY — NEVER SHARE PASSWORDS

Why not share login credentials:
- Can't track who did what
- To revoke access, must change passwords everywhere
- Accidents are untraceable
- Violates platform Terms of Service

The right way:
- GitHub: Org membership, each commits under own name
- Vercel: Team membership, each has own login
- Supabase: Team membership, each has own login
- Revoking access = remove member, one click, no disruption

---

## SECTION 12: COMMON SCENARIOS

Q: Built something on personal Vercel, how to move to org?
A: Transfer GitHub repo to org (Settings → Transfer), then import into Vercel team.

Q: Urgent bug on live app?
A: Clone repo, create branch, fix, push, check preview, merge. If truly urgent, push directly to main.

Q: Partner's change broke live site?
A: Vercel dashboard → last working deployment → "Promote to Production." Fixed in 5 seconds.

Q: Want to try new tech stack?
A: Personal accounts only. Don't touch org until proven.

Q: Claude Code can't find API key?
A: Check central .env first, then project .env.local, then Vercel environment variables.

Q: Both edited same file simultaneously?
A: Git flags a "merge conflict" showing both versions. Claude Code resolves it.

Q: Accidentally pushed secrets to GitHub?
A: Immediately rotate (regenerate) exposed keys. Remove from code, push clean version.

Q: How to know which Supabase a Vercel app uses?
A: Check Vercel project Environment Variables — SUPABASE_URL tells you.
`;

export const SECTION_IDS = [
  { id: "problem", title: "The Problem", number: 1 },
  { id: "options", title: "Options At Our Disposal", number: 2 },
  { id: "analysis", title: "Analyzing Each Option", number: 3 },
  { id: "decision", title: "The Decision", number: 4 },
  { id: "implementation", title: "Implementation — Setup Steps", number: 5 },
  { id: "github", title: "How GitHub Works", number: 6 },
  { id: "vercel", title: "How Vercel Works", number: 7 },
  { id: "supabase", title: "How Supabase Works", number: 8 },
  { id: "workflow", title: "End-to-End Workflow", number: 9 },
  { id: "where", title: "Where Should I Do This?", number: 10 },
  { id: "api-keys", title: "API Keys & Secrets", number: 11 },
  { id: "security", title: "Security Rules", number: 12 },
  { id: "scenarios", title: "Common Scenarios", number: 13 },
];
