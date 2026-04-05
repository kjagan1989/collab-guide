export const REPORT_CONTENT = `
# Collaboration Guide — RevenueFlows AI

## Who This Is For
Jagan and Ishan — two partners building the RevenueFlows AI shared. Jagan runs operations and strategy from Edmonton, Canada. Ishan manages Antigravity (VS Code + Gemini) with MCP servers and integrations. Both use Claude Code.

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
Create a shared workspace that both partners own together. Like renting an office together instead of working from separate apartments.

GITHUB: We create a GitHub Organization (e.g., "revenueflows-ai"). This is a shared space above both personal accounts. All shared repos move here. Both partners are members with push access. When Jagan commits, it shows as Jagan. When Ishan commits, it shows as Ishan. Full audit trail. Both can create branches, submit pull requests, and merge from one shared home.

VERCEL: We create a Vercel Team and connect it to the GitHub org. Now there's only ONE Vercel watching the repos. When either partner pushes code, this one Vercel team picks it up and auto-deploys. No more "is it on Jagan's Vercel or Ishan's Vercel?" — there's only one. Both can see all deployments and roll back if something breaks.

SUPABASE: One person owns the Supabase project (whoever handles billing — Ishan). The other is invited as a team member. Both see the same database, tables, API keys, and dashboard. No password sharing. Each logs in with their own account.

Used by: Every company, from 2-person startups to Fortune 500.

PROS:
- One source of truth — no version confusion
- Both push code under their own names — full audit trail
- One Vercel deployment pipeline
- Industry standard
- Revoking access is one click
- Scales to more team members

CONS:
- 12 minutes of one-time setup
- Need to transfer existing repos

### Option B: Fork + Pull Request Model
Each person keeps their own separate accounts. One repo is the "source of truth." The other makes a copy (fork), works on it, sends changes back as a proposal (pull request).

GITHUB: Ishan's GitHub has the main repo. Jagan "forks" it — creating a complete copy under his own GitHub. Jagan works on his copy, then submits a pull request. Ishan reviews and approves. Problem: Jagan's fork easily gets out of date. Every time Ishan makes changes, Jagan must manually sync his fork. Two copies of the same code floating around.

VERCEL: Each person connects their own Vercel to their own GitHub repo. Two Vercels deploying two copies of the same project. Which one is the "real" site? Which URL do customers use? Confusing. If Jagan forgets to sync his fork, his Vercel deploys an outdated version.

SUPABASE: Both apps need to point to the same database. But Jagan doesn't have access to Ishan's Supabase dashboard unless credentials are shared. Either share passwords (bad) or Jagan works with a separate test database and hopes structures stay in sync (fragile).

Used by: Open-source projects with hundreds of strangers contributing. Not designed for partners.

PROS:
- No org setup needed
- Clear separation of ownership

CONS:
- Too much friction for 2 people
- Designed for strangers, not partners
- Two Vercels deploying — confusing
- Easy to get out of sync
- Double the maintenance

### Option C: Monorepo with Ownership Boundaries
Put everything into one single giant repository. Each person's projects get their own folder. Shared code goes in a shared folder.

GITHUB: One repo with folders: /lead-manager (Jagan's), /antigravity (Ishan's), /shared (components both use). Both push to the same repo. Problem: one bad commit in any folder can affect the entire repo. If you break /shared, every project depending on it might break. The repo gets very large very fast.

VERCEL: Multiple Vercel projects pointing to different folders within the same repo. Vercel can be configured to only deploy when specific folders change. But this configuration is tricky — needs "root directory" settings and "ignore build step" rules. More complex to set up and maintain.

SUPABASE: No difference from Option A. Supabase doesn't care about repo structure. But managing database migrations becomes trickier with multiple apps in one repo.

Used by: Google, Meta, and large companies with thousands of developers and deeply shared codebases. Overkill for us now, potentially useful later.

PROS:
- Shared code between projects is easy
- One repo to manage

CONS:
- Unnecessary complexity right now
- One bad commit affects multiple projects
- CI/CD config gets complicated

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
3. Name it "revenueflows-ai" or "shared-hq"
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
A: Here is exactly what happens step by step:
1. You and your partner both make changes to the same file on your own computers.
2. One person pushes their changes to GitHub first. This works fine — no problem.
3. The second person tries to push. GitHub says "hold on, someone changed this file after you last downloaded it."
4. The second person needs to "pull" (download) the latest version first. Git will try to combine both sets of changes automatically.
5. If you both changed DIFFERENT parts of the file — Git merges them automatically. Done. No issue.
6. If you both changed the SAME lines — Git can't decide which version to keep. It marks those specific lines with both versions and says "you pick." This is called a "merge conflict."
7. What you see: The file will have markers showing "Jagan's version" and "Ishan's version" for the conflicting lines. Everything else is already merged.
8. What you do: Tell Claude Code "resolve the merge conflict in [filename]." Claude Code looks at both versions, picks the right combination, and fixes it for you. You commit and push. Done.
9. To AVOID this entirely: Before you start working, tell Claude Code "pull the latest changes." This downloads your partner's latest work so you're starting from the same version.

Q: Accidentally pushed secrets to GitHub?
A: This is urgent. Here is what to do immediately:
1. Go to the service dashboard where the key was created (e.g., Supabase dashboard, OpenRouter dashboard).
2. Regenerate / rotate the API key. This makes the old key stop working instantly, even though it's visible in the Git history.
3. Copy the new key.
4. Update your local .env file with the new key.
5. Update Vercel Environment Variables with the new key (Project → Settings → Environment Variables).
6. Tell Claude Code to make sure the .env file is in .gitignore (it should already be).
7. Push a clean commit. The old commit with the exposed key still exists in Git history, but it doesn't matter because the key has been regenerated and the old one no longer works.

Q: How to know which Supabase a Vercel app uses?
A: Go to Vercel → click the project → Settings → Environment Variables. Look for SUPABASE_URL. The URL tells you which Supabase project it connects to. It will look something like "https://abcdefg.supabase.co" — that ID matches a specific project in your Supabase dashboard.

Q: What does "commit" mean?
A: A commit is saving your work with a description. When you change code on your computer, those changes only exist on your machine. A "commit" packages up all your changes and saves them as a snapshot with a message like "Added phone number field to lead form." After committing, you "push" to upload that snapshot to GitHub so your partner can see it and Vercel can deploy it. Each commit is permanent — you can always go back to any previous commit.

Q: What does "push" mean?
A: Push means uploading your committed changes from your computer to GitHub (the cloud). Before you push, your work only exists on your machine. After you push, your partner can see it, and Vercel automatically picks it up and deploys it. You tell Claude Code "push to GitHub" and it does it.

Q: What does "pull" mean?
A: Pull means downloading the latest changes from GitHub to your computer. If your partner pushed changes, you need to "pull" to get their latest work before you start making your own changes. Tell Claude Code "pull the latest changes" before starting work. This prevents merge conflicts.

Q: What is a branch?
A: A branch is a separate copy of your code where you can make changes without affecting the live website. The "main" branch is the live site — customers see this. You create a new branch (e.g., "add-phone-field"), make your changes there, test them using Vercel's preview URL, and when everything works, you merge (combine) your branch back into main. If your experiment fails, you just delete the branch — the live site was never touched.

Q: What is a pull request?
A: A pull request (PR) is a formal way of saying "I made changes on my branch, please review them before they go live." You create a PR on GitHub, your partner can see exactly what changed, leave comments, ask for modifications, or approve it. Once approved, the changes merge into the main branch and Vercel auto-deploys. It's optional for a two-person team — you can also merge directly — but it creates a nice record of what changed and why.

Q: How do I start working on a project?
A: Step by step:
1. Tell Claude Code "clone [repo name] from the org" — this downloads the project to your computer.
2. Tell Claude Code "pull the latest changes" — makes sure you have the most recent version.
3. Tell Claude Code "create a new branch called [describe-your-change]" — this creates a safe sandbox.
4. Make your changes (Claude Code helps you write code).
5. Tell Claude Code "commit with message [what you changed]" — saves your work.
6. Tell Claude Code "push" — uploads to GitHub. Vercel creates a preview URL.
7. Check the preview URL to make sure everything works.
8. Tell Claude Code "create a pull request" or "merge to main" — goes live.

Q: Do I need to know how to code?
A: No. Claude Code writes the code for you. You describe what you want in plain English ("add a phone number field to the lead form") and Claude Code builds it. You still need to understand the workflow (branch → commit → push → preview → merge) but the actual coding is handled by AI.
`;

export const SECTION_IDS = [
  { id: "problem", title: "The Problem", number: 1 },
  { id: "options", title: "Options At Our Disposal", number: 2 },
  { id: "implementation", title: "Implementation", number: 3 },
  { id: "reference", title: "Quick Reference", number: 4 },
];
