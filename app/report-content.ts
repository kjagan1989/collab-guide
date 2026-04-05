export const REPORT_CONTENT = `
# Empire Collaboration Guide — RevenueFlows AI

## Who This Is For
Jagan and Ishan — two partners building the RevenueFlows AI empire. Jagan runs operations and strategy from Edmonton, Canada. Ishan manages Antigravity (VS Code + Gemini) with MCP servers and integrations. Both use Claude Code.

## The Problem We're Solving
Right now, Jagan and Ishan each have their own GitHub, Vercel, and Supabase accounts. Projects are scattered across both accounts. When one person builds something, the other can't easily access it, deploy it, or work on it. This causes confusion: "which repo is the latest?", "where is this deployed?", "why can't Claude Code find the API keys?"

This guide lays out exactly how to collaborate cleanly so both partners can work on the same projects without stepping on each other's toes.

---

## SECTION 1: THE DECISION — SHARED ORGANIZATION MODEL

We evaluated three approaches and chose the Shared Organization model.

### What Is a Shared Organization?
Instead of repos living under jagan's-github or ishan's-github, we create a shared workspace (called an "organization" on GitHub, a "team" on Vercel). All empire repos live there. Both partners are members. Both can push code, review each other's work, and deploy.

Think of it like renting an office together instead of working from separate apartments.

### Why We Chose This Over Other Options

OPTION WE REJECTED #1 — FORK + PULL REQUEST MODEL:
Each person keeps their own GitHub/Vercel. One person's repo is the "source of truth." The other person makes a copy (fork), works on it, then sends their changes back for approval (pull request). We rejected this because it creates too much friction for a two-person team. It's designed for open-source projects with strangers, not partners. Vercel would deploy from two places, things get out of sync easily.

OPTION WE REJECTED #2 — MONOREPO WITH OWNERSHIP BOUNDARIES:
One giant repo with folders for different projects (/jagan-project, /ishan-project, /shared-stuff). Each folder maps to a different Vercel deployment. We might use this later if we build multiple apps that share code, but for now it's unnecessary complexity.

THE OPTION WE CHOSE — SHARED ORGANIZATION:
One GitHub org, one Vercel team, shared Supabase access. Simple, clean, one source of truth. This is what companies of any size use.

### Account Roles

ISHAN'S ACCOUNTS = THE LIVE EMPIRE:
- Real apps that customers see
- Real databases with real data
- Real deployments with real URLs
- This is production. Be careful here.

JAGAN'S ACCOUNTS = THE WORKSHOP:
- Test ideas before putting them in the empire
- Break things without consequences
- Try new tools, APIs, experiments
- Build prototypes to show Ishan before merging

Think of it like this: Ishan's accounts are the restaurant kitchen serving customers. Jagan's accounts are the home kitchen where you try new recipes. You don't experiment while orders are going out.

RULE: Test on Jagan's. Ship on Ishan's (the org).

---

## SECTION 2: SETUP INSTRUCTIONS — WHAT ISHAN NEEDS TO DO

Total setup time: approximately 12 minutes. All steps are on Ishan's side. Jagan just accepts the invites.

### Step 1: GitHub — Create an Organization (5 minutes)

1. Go to github.com → click your profile icon (top right) → "Your organizations" → "New organization"
2. Choose the FREE plan (it's enough for private repos with collaborators)
3. Name it something like "revenueflows-ai" or "empire-hq"
4. Go to the org's page → Settings → Members → Invite member
5. Add Jagan's GitHub username and give him "Member" role (or "Owner" if you want equal control)
6. To move existing repos into the org: Go to any repo → Settings → scroll to "Danger Zone" → "Transfer ownership" → select the new org

After this: All empire repos live under github.com/revenueflows-ai instead of personal accounts. Both partners can clone, push, create branches, and submit pull requests.

### Step 2: Vercel — Create a Team (5 minutes)

1. Go to vercel.com → click the dropdown at the top-left (where your name is) → "Create Team"
2. Name the team to match the GitHub org (e.g., "RevenueFlows AI")
3. Go to Team Settings → Git → Connect GitHub → authorize the GitHub org you just created
4. Go to Team Settings → Members → Invite → add Jagan's email
5. To move existing projects: Go to each project → Settings → Transfer → select the team

After this: When either partner pushes code to a repo in the GitHub org, Vercel automatically detects it and deploys. One deployment, one URL, no confusion about "whose Vercel is this on?"

### Step 3: Supabase — Add Jagan as Team Member (2 minutes)

1. Go to your Supabase project dashboard
2. Click the organization/team name in the sidebar
3. Go to "Members" or "Team" settings
4. Invite Jagan's email as a member

After this: Both partners can see the same database, tables, API keys, and dashboard. No need to share passwords.

### What Jagan Does After

1. Accept the GitHub org invite (you'll get an email or notification on GitHub)
2. Accept the Vercel team invite (email)
3. Accept the Supabase team invite (email)
4. Keep your personal GitHub, Vercel, and Supabase accounts active — they're your testing sandbox

---

## SECTION 3: HOW GITHUB WORKS — CODE STORAGE + VERSION HISTORY

### What Is GitHub?
GitHub is Google Docs for code. It saves every version of your code, tracks who changed what, and lets you go back to any previous version. Your code lives on your computer AND on GitHub (the cloud).

### The Three Steps: Edit → Commit → Push

STEP 1 — EDIT: You change code on your computer using Claude Code or VS Code. At this point, the changes only exist on your computer. Nobody else can see them.

STEP 2 — COMMIT: This is like clicking "Save" but with a note explaining what you changed. Example: "Fixed broken contact form" or "Added new pricing section." Each commit is a permanent snapshot of your entire project at that moment.

STEP 3 — PUSH: This sends your committed changes from your computer up to GitHub (the cloud). Now your partner can see them, and Vercel will auto-deploy them.

You can make multiple commits before pushing. Think of commits as saving your progress in a video game, and pushing as uploading your save file to the cloud.

### How Previous Versions Are Saved
It's completely automatic. Every commit is a saved version. Forever. GitHub never deletes history.

You can see the full timeline:
- April 5 — "Fixed broken contact form"
- April 4 — "Added new pricing page"
- April 3 — "Updated logo"
- April 1 — "Initial launch"

Each of these is a complete snapshot of your code at that moment. You can go back to any of them.

### How to Revert If Something Goes Wrong
Tell Claude Code something like "Revert to the version before I broke the contact form" and it will roll the code back. The broken version still exists in history (nothing is ever deleted), but the active code goes back to the working version.

Then push the revert to GitHub, and Vercel will auto-deploy the fixed version.

### What Is a Branch?
A branch is a parallel universe for your code. You create a copy where you can make changes without affecting the main version.

THE MAIN BRANCH: This is the "real" version. The live website runs from this branch. Don't experiment here.

A TEST BRANCH: This is your experimental copy. You can break things, try ideas, and nobody cares because it doesn't affect the main branch.

When your experiment works, you "merge" the test branch into the main branch — your changes become part of the real version.

When your experiment fails, you just delete the test branch. The main branch was never touched.

### What Is a Pull Request (PR)?
When you're done working on a branch, you create a "pull request" — this is a formal request saying "Hey, I made these changes on my branch, please review them and merge them into the main branch."

Your partner can review the changes, comment, request modifications, or approve and merge. This is how you prevent bad code from reaching the live site.

For a two-person team, you can also just merge directly without a formal review if you trust each other's work. But the PR history is still useful for tracking what changed and why.

---

## SECTION 4: HOW VERCEL WORKS — HOSTING + AUTO-DEPLOYMENT

### What Is Vercel?
Vercel is where your website/app actually lives on the internet. It takes your code from GitHub, builds it into a working website, and serves it to anyone who visits your URL.

### How Deployment Works
You never manually deploy. Here's the chain:

1. You push code to GitHub
2. Vercel detects the change (within seconds)
3. Vercel builds your app automatically
4. Your site is live at your URL (e.g., your-app.vercel.app)

That's it. Push to GitHub = deployed. You don't log into Vercel to do anything.

### How Previous Versions Are Saved
Every single push creates a separate deployment in Vercel. You can see them all in your dashboard:

- April 5, 3:42pm — LIVE (current)
- April 5, 1:15pm — ready
- April 4, 9:30pm — ready
- April 3, 6:00pm — ready

Every one of those is a fully working version of your website that you can visit and test, even the old ones. Vercel gives each deployment its own unique URL.

### How to Revert If Something Goes Wrong
Go to your Vercel dashboard → find the last deployment that was working → click "Promote to Production."

Your site is back to normal in about 5 seconds. No code changes needed. No Git commands. Just click a button.

THIS IS VERCEL'S SUPERPOWER. Even if your code is a complete mess right now, you can instantly revert the live website to any previous version with one click.

### Preview Deployments (Testing Before Going Live)
When you push code to a branch that is NOT the main branch, Vercel creates a "preview deployment" with its own URL:

- Live site: your-app.vercel.app
- Preview: test-new-pricing-abc123.vercel.app (only you can see this)

You check the preview URL. Does it look right? Does everything work?
- If yes → merge the branch into main → Vercel deploys it to the live URL
- If no → delete the branch. The live site was never touched.

### Environment Variables on Vercel
API keys and secrets that your live app needs (Supabase URL, API keys, etc.) should be stored in Vercel's Environment Variables dashboard, NOT in files.

Go to your project on Vercel → Settings → Environment Variables → add your keys there.

These are encrypted and secure. They're available to your app at runtime but never visible in your code or Git history.

---

## SECTION 5: HOW SUPABASE WORKS — YOUR DATABASE

### What Is Supabase?
Supabase is your database — where your data lives. Leads, users, settings, anything your app needs to remember. Think of it as a really powerful Google Sheet that your apps can read and write to automatically.

### Two Types of Changes

DATA CHANGES (adding/editing/deleting rows):
- These happen live, in real-time, as the app runs
- Example: A new lead is added to the leads table
- There's no commit or push — it just happens, like editing a Google Sheet
- Low risk — you can always add or edit rows

STRUCTURE CHANGES (adding tables, columns, changing field types):
- Example: Adding a new "phone_number" column to the leads table
- These affect the shape of your database, not just the data in it
- HIGH RISK — if you delete a column, all the data in that column is gone forever
- Always be careful with structure changes

### How Previous Versions Are Saved
Supabase does NOT auto-save versions like GitHub and Vercel. This is the one place where you need to be careful.

DAILY BACKUPS: On paid Supabase plans, your database is backed up daily. You can restore to yesterday's version from the dashboard.

MIGRATIONS: These are like "commits for your database structure." Claude Code can create migration files that track every structure change. If something goes wrong, you can roll back the migration.

POINT-IN-TIME RECOVERY: On higher Supabase plans, you can restore your database to any specific minute. Like rewinding a video to exactly where you want.

### How to Revert If Something Goes Wrong

WRONG DATA (accidentally deleted rows, bad data entered):
- Restore from your daily backup
- Or if you have point-in-time recovery, restore to the exact minute before the mistake

WRONG STRUCTURE (accidentally deleted a column or table):
- If you used migrations, roll back the migration
- If not, restore from backup
- Worst case, contact Supabase support

### Testing Database Changes Safely
NEVER experiment on the production database (Ishan's Supabase). Use Jagan's personal Supabase for testing.

1. Create a test project on your personal Supabase
2. Copy the table structure from production (not the real data)
3. Fill it with fake test data
4. Point your test code at your test Supabase
5. Once everything works, apply the same changes to production

---

## SECTION 6: THE COMPLETE WORKFLOW — HOW A TYPICAL CHANGE HAPPENS

Here's an example of building a new feature from start to finish:

### Scenario: Adding a "phone number" field to the lead manager

STEP 1 — CREATE A BRANCH:
Tell Claude Code: "Create a new branch called add-phone-field"
Now you have a safe copy to work on. The live site is untouched.

STEP 2 — TEST DATABASE CHANGES:
On your personal Supabase (sandbox), add a "phone_number" column to the leads table. Verify it works with fake data.

STEP 3 — WRITE THE CODE:
Claude Code modifies the lead manager code to include the phone number field in forms, displays, and API calls. All on your branch, not the main branch.

STEP 4 — COMMIT AND PUSH:
Claude Code commits: "Added phone number field to lead manager"
Claude Code pushes to GitHub.

STEP 5 — CHECK THE PREVIEW:
Vercel automatically creates a preview deployment for your branch. Visit the preview URL and test everything. Fill in forms, check displays, make sure nothing is broken.

STEP 6 — MERGE:
Everything looks good. Create a pull request (or merge directly). The branch merges into main.

STEP 7 — AUTO-DEPLOY:
Vercel detects the merge to main and auto-deploys. The live site now has the phone number field.

STEP 8 — UPDATE PRODUCTION DATABASE:
Now apply the same database change (add phone_number column) to the production Supabase.

STEP 9 — VERIFY:
Check the live site. Phone numbers work. Done.

### If Something Goes Wrong at Any Point

AT STEP 5 (preview looks broken): Don't merge. Fix the code on your branch and push again. The preview will update.

AT STEP 7 (live site is broken after merge): Go to Vercel dashboard → click the previous working deployment → "Promote to Production." Site is fixed in 5 seconds. Then fix the code on a new branch.

AT STEP 8 (database change breaks things): Restore from Supabase backup or roll back the migration.

---

## SECTION 7: DECISION FRAMEWORK — WHERE SHOULD I DO THIS?

### Quick Decision Table

BUILDING A NEW FEATURE TO TEST → Your GitHub + Your Vercel + Your Supabase
FEATURE WORKS, READY TO SHIP → Push to the org GitHub → Deploys to org Vercel → Update org Supabase
QUICK EXPERIMENT / THROWAWAY PROTOTYPE → Your accounts
FIXING A BUG ON A LIVE APP → Org GitHub (with collaborator access), make a branch first
LEARNING SOMETHING NEW → Your accounts
ANYTHING A CUSTOMER WILL SEE → Org accounts only
DATABASE EXPERIMENT → Your Supabase (never experiment on production)

### When Should I Work on My Partner's Vercel/Project vs Mine?

USE THE ORG (ISHAN'S/SHARED):
- When the work will go live
- When you're fixing something that's already deployed
- When both of you need to see/access the project
- When it's a real product, not an experiment

USE YOUR OWN:
- When you're not sure if the idea will work
- When you might break things
- When you're learning or prototyping
- When you want to test before proposing it to the team

THE RULE: If you're asking "should I do this on the live one?", the answer is probably no. Do it on yours first.

---

## SECTION 8: API KEYS & ENVIRONMENT VARIABLES

### The Central .env File
Location: Project root .env file
This is the master list of all API keys. Every new Claude Code session should check this file first.

Currently active services (10 total):
1. Apify — Twitter scraping, web scraping, lead scraping
2. Instantly — Cold email sending, warm-up, campaigns
3. DeBounce — Email verification
4. Apollo — Contact enrichment, decision maker emails
5. OpenRouter — AI processing (access to Gemini and other models)
6. Supabase — Database URL + anon key + service role key
7. AWeber — Email marketing
8. GitHub — Token for repos, version control
9. Vercel — Token for deployments
10. Gmail — 2 accounts (personal + business) with app passwords

### The Scattered Keys Problem (Now Fixed)
Previous Claude Code sessions saved API keys only in project-specific .env.local files inside each project folder, NOT in the central .env. This caused new Claude Code threads to think the keys didn't exist.

Solution: All keys have been consolidated into the central .env file. Project-specific .env.local files also exist but are copies.

Rule for future sessions: When a new API key is provided, ALWAYS save it to the central .env AND to any project-specific .env.local that needs it.

### How API Keys Work Across Environments

LOCAL DEVELOPMENT (your computer): Keys come from the .env or .env.local file in the project folder.

PRODUCTION (Vercel): Keys are set in Vercel's Environment Variables dashboard. These are encrypted and never visible in code.

IMPORTANT: The .env file is never committed to GitHub (it's in .gitignore). Each developer has their own local copy. Production keys live in Vercel's dashboard.

### About OpenRouter
OpenRouter is like a universal credit card for AI models. One API key gives you access to hundreds of models (Gemini, Claude, GPT, etc.). But the key alone doesn't pick a model — your code specifies which model to use in each API call.

Example: The AI Tools app uses OpenRouter with the model ID "google/gemini-3.1-flash-image-preview" (branded as "Nano Banana 2"). The model is selected in the code or admin dashboard, not by the key.

---

## SECTION 9: NEVER SHARE PASSWORDS — USE PLATFORM COLLABORATION

### Why Not Just Share Login Credentials?

TRACKING: When both people use the same account, you can't tell who did what. Git blame, commit history, deploy logs — all show the same person.

SECURITY: If you need to revoke access, you have to change the password everywhere. With proper collaboration, you just remove the member.

ACCIDENTS: If one person changes a setting or accidentally deletes something, you can't trace who did it.

TERMS OF SERVICE: Most platforms explicitly prohibit account sharing.

### The Right Way

GITHUB: Org membership or collaborator access per repo. Each person commits under their own name.

VERCEL: Team membership. Each person has their own login and can see all team projects.

SUPABASE: Team membership. Each person has their own login and can see the shared project.

ACCESS CONTROL: You can set different permission levels (admin, member, read-only) depending on what each person should be able to do.

REVOKING ACCESS: Remove the member. One click. No password changes needed. No disruption.

---

## SECTION 10: COMMON SCENARIOS & ANSWERS

SCENARIO: I built something on my personal Vercel. How do I move it to the org?
ANSWER: Transfer the GitHub repo to the org first (repo Settings → Transfer). Then import it into the Vercel team. Vercel will auto-deploy from the org repo going forward.

SCENARIO: I need to fix a bug on a live app urgently.
ANSWER: Clone the repo from the org, create a branch, fix the bug, push, check the preview URL, then merge to main. If it's truly urgent and you're confident, you can push directly to main — but branching is always safer.

SCENARIO: My partner made a change that broke the live site.
ANSWER: Go to Vercel dashboard → find the last working deployment → click "Promote to Production." The site is fixed in 5 seconds while you figure out what went wrong in the code.

SCENARIO: I want to try a completely new tech stack or tool.
ANSWER: Do it on your personal accounts. Don't touch the org until you've proven it works.

SCENARIO: Claude Code says it can't find the Supabase API key.
ANSWER: Check the central .env file first. If the key is there, make sure the project's .env.local also has it. If it's missing from both, check Vercel's environment variables dashboard — it might only be set there.

SCENARIO: We both edited the same file at the same time.
ANSWER: Git handles this. When the second person tries to push, Git will flag a "merge conflict" and show both versions. Claude Code can help resolve it by combining the changes or choosing one version.

SCENARIO: I accidentally pushed secrets (API keys) to GitHub.
ANSWER: Immediately rotate (regenerate) the exposed keys on the respective service dashboards. Then remove the secrets from the code and push a clean version. The old commit with secrets will still exist in history, but the keys will no longer work because you rotated them.

SCENARIO: Can I deploy my branch to a custom URL for client demos?
ANSWER: Yes. Vercel preview deployments get auto-generated URLs. You can also assign a custom domain to any deployment from the Vercel dashboard.

SCENARIO: How do I know which Supabase project a Vercel app is connected to?
ANSWER: Check the Vercel project's Environment Variables (Settings → Environment Variables). The SUPABASE_URL will tell you which Supabase project it points to.
`;

export const SECTION_IDS = [
  { id: "decision", title: "The Decision — Shared Organization Model", number: 1 },
  { id: "setup", title: "Setup Instructions — What Ishan Needs To Do", number: 2 },
  { id: "github", title: "How GitHub Works", number: 3 },
  { id: "vercel", title: "How Vercel Works", number: 4 },
  { id: "supabase", title: "How Supabase Works", number: 5 },
  { id: "workflow", title: "The Complete Workflow", number: 6 },
  { id: "decisions", title: "Decision Framework — Where Should I Do This?", number: 7 },
  { id: "api-keys", title: "API Keys & Environment Variables", number: 8 },
  { id: "security", title: "Never Share Passwords", number: 9 },
  { id: "scenarios", title: "Common Scenarios & Answers", number: 10 },
];
