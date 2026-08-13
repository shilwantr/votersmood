# 🏛 VotersMood (JanMat Official Gazette) — Platform Features & Architecture

> **Official Gazette Political Intelligence & Verified Constituency Feedback Engine**  
> A high-performance, dark-gazette styled Indian political intelligence platform built with Vite React, Express Node.js backend, and persistent Cloud Firestore (`votersmood78`) database.

---

## 📋 Comprehensive Feature Matrix

### 1. 💬 Civic Discussions & Public Open Questions
- **Verified Constituency Insights**: Registered citizens can post insights, feedback, and open questions directed at elected representatives or civic topics.
- **Strict Character Limits**: Post composer enforces a **500-character maximum** with real-time `(0/500 CHARS MAX)` counter validation.
- **Representative & Topic Tagging**: Associate posts directly with elected leaders (e.g., *Devendra Fadnavis*, *Rahul Gandhi*) and political hashtags (e.g., `#WATERANDINFRASTRUCTURE`).
- **Post Management**: Authors and platform administrators can delete insights with immediate feed updates.

---

### 2. 👍 Interactive Representative & Post Reactions
- **Dual Reaction Engine**: Citizens can react with **👍 Agree** and **😄 Funny** to posts, comments, and representative profile cards.
- **Live Counter Sync**: Toggling reactions immediately updates reaction tallies locally and syncs with Cloud Firestore DB (`reactions` collection).
- **Micro-Spring Animations**: Button interactions feature spring scale micro-animations (`transform: scale(1.05)`).
- **Page Refresh Persistence**: User reaction choices are stored in Cloud Firestore DB and browser storage, preserving active filled states (**`👍 AGREED`** / **`😄 FUNNY`**) across page reloads.

---

### 3. 🗳 5-Step Official Guided Election Poll
- **Resident vs. Observer Segregation**: Distinguishes votes cast by verified constituency residents from non-resident observer citizens.
- **5-Step Interactive Guided Voting**:
  1. Candidate Selection
  2. State Verification (*"Do you reside in this election state?"*)
  3. Constituency Verification (*"Are you a registered voter in this constituency?"*)
  4. Final Vote Confirmation
  5. Live Segregated Results View
- **1-Vote Per User Rule**: Enforces a strict single vote limit per registered user using composite keys (`userId_electionId`) stored in Cloud Firestore DB (`votes` collection).
- **Page Refresh Vote Persistence**: Voted users automatically resume at Step 6 (Results View) upon refreshing the browser, displaying a **`✓ YOUR VOTE CONFIRMED IN DB`** badge.

---

### 4. 📊 Community Mini Issue Polls
- **Citizen-Created Mini Surveys**: Citizens can create local civic surveys (min 2, max 6 options) for neighborhood issues (e.g. *Water Pipeline Upgrades*, *Streetlights*).
- **Real-Time Percentage Progress Bars**: Dynamic progress bars displaying vote percentages per option.
- **Admin Moderation & Featuring**: Platform admins can pin surveys with a **`★ FEATURED SURVEY`** badge or remove inappropriate polls.
- **Vote Confirmation**: Displays **`✓ VOTE CONFIRMED`** badge for option selections across sessions.

---

### 5. 🏛 Top 5 Featured Representatives (Ranked by Open Questions)
- **Open Question Ranking**: Home page sidebar highlights **top 5 elected representatives** sorted strictly by total **`openQuestionsCount`** descending.
- **Automatic Question Counter Sync**: Posting an open question targeting a leader automatically increments their `openQuestionsCount` in Cloud Firestore DB; deleting decrements it.
- **Visual Rank Badges**: Clear `#1 RANK` through `#5 RANK` badges cleanly formatted without overlapping party or chamber badges.

---

### 6. ⚡ Live Polling Signals & Engagement Sidebar
- **Real-Time Polling Statistics**: Aggregates total election votes, resident voter percentage, and observer voter percentage directly from Cloud Firestore DB.
- **Live Voting Activity Feed**: Displays recent anonymous vote receipts (`• Verified Resident from Nagpur South West voted 2 mins ago`).
- **Most Discussed Constituencies**: Ranks constituencies based on live citizen post volume.
- **Trending Election Hashtags**: Displays active trending hashtags.
- **Auto-Refresh Engine**: Automatically polls `GET /api/polls/signals` every 15 seconds with a **`● LIVE DB SYNC`** status indicator.

---

### 7. 🗂 Server-Indexed Leader Directory
- **Multi-Filter Search**: Search representatives by name, constituency, state (28 states + 8 UTs), political party (BJP, INC, AAP, SP, TMC, Shiv Sena, MNS, etc.), and chamber (`MP_LS`, `MP_RS`, `MLA`, `MLC`, `MAYOR`).
- **Infinite Scroll Pagination**: Infinite scroll observer fetching batch results (`GET /api/leaders?page=1&limit=6`).
- **Detailed Leader Profiles**: Dedicated pages for each representative displaying biography, portfolios, committees, agree/funny reaction counts, and tagged open questions.

---

### 8. 🛠 Admin Control Panel & Custom Representative Engine
- **Admin Control Dashboard**: Overview metrics for total registered citizens, active election polls, public discussions, and representative database records.
- **Custom Add/Edit Representative Modal**:
  - Add custom political parties (*"➕ Custom Party..."*).
  - Add custom representative titles/types (`MAYOR`, `CORPORATOR`, `GOVERNOR`).
  - Input custom government positions, portfolios, and parliamentary committees with keyboard tag handling.
  - Upsert directly to Cloud Firestore DB via `setDoc(docRef, data, { merge: true })`.
- **Dynamic Election Creator**: Create custom multi-candidate election polls with start/end dates, state targeting, and NOTA support.

---

### 9. 📈 Trending Topics & Reaction Volume Ranking
- **Rolling Window Calculation**: Ranks political topics over a 24-hour or 48-hour rolling window.
- **Reaction Volume Sorting**: Posts and topics are sorted by combined reaction volume (`agreeCount + funnyCount`).

---

### 10. ☁️ Cloud Firestore Persistence & Vercel Deployment
- **Cloud Firestore DB (`votersmood78`)**: Full server-isolated database persistence for users, leaders, posts, comments, polls, votes, and reactions.
- **Vercel Fullstack Deployment**: Configured with Vercel Serverless Functions (`api/index.js`) for the Express backend and static SPA fallback for the Vite React frontend.

---

## 🛠 Tech Stack Summary
| Layer | Technology |
| :--- | :--- |
| **Frontend** | Vite React 18, Vanilla CSS (Gazette Dark Theme), Lucide Icons |
| **Backend API** | Node.js, Express.js (Vercel Serverless Compatible) |
| **Database** | Cloud Firestore (`votersmood78`) |
| **Deployment** | Vercel Fullstack (`vercel.json`) |
| **Repository** | GitHub (`shilwantr/votersmood.git`) |
