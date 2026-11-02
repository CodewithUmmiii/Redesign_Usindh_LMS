# University of Sindh — LMS Portal (Reengineered Frontend)

Frontend-only reengineering of the University of Sindh LMS for the *Software Reengineering* assignment.
Built with **React 18 + Vite + React Router** (the "R" of MERN). The Express/Node/MongoDB side is not part of this
deliverable; the app talks to it through a service layer that currently returns sample data.

## Run

```bash
cd client
npm install
cp .env.example .env      # VITE_USE_MOCK=true by default
npm run dev               # http://localhost:5173
npm run build             # production build in client/dist
```

Demo sign-in: pick **Teacher / Student / Admin** on the login page (any password works in prototype mode).

## Folder structure

```
client/
├─ index.html
├─ vite.config.js              dev proxy: /api -> http://localhost:5000 (Express)
├─ .env.example                VITE_USE_MOCK, VITE_API_BASE_URL, VITE_LOGO_URL
├─ public/favicon.svg
└─ src/
   ├─ main.jsx · App.jsx       providers + lazy-loaded, role-guarded routes
   ├─ config/                  env.js (flags, branding), nav.js (role-based sidebar)
   ├─ context/                 Auth, Toast, Theme (light/dark)
   ├─ hooks/useAsync.js        loading / error / reload helper
   ├─ services/                one file per API domain (+ client.js, mockDb.js)
   ├─ data/mock.js             sample data + transcribed survey data
   ├─ utils/                   format, grading, CSV download
   ├─ components/
   │  ├─ layout/               AppShell, Sidebar, Topbar, RouteGuards
   │  ├─ ui/                   Card, Badge, Modal, Tabs, Progress, Brand (logo) …
   │  └─ charts/               dependency-free SVG Bar / Line / Ring charts
   ├─ pages/                   one file per screen (below)
   └─ styles/                  tokens · base · layout · components · pages (.css)
```

## Pages

| Route | Who | What |
|---|---|---|
| `/login` | all | Role-based sign-in |
| `/dashboard` | all | Role-aware summary, deadlines, live classes, calendar |
| `/courses`, `/courses/:id` | all | Course workspace: **syllabus progress tracker**, materials (upload), roster, announcements |
| `/attendance` | all | Teacher: one-screen marking, bulk actions, history, <75% flags. Student: per-course view |
| `/assignments` | teacher, student | Create / submit / track |
| `/quizzes` | teacher, student | Quiz builder with question-bank quick-build; timed student attempts |
| `/results` | all | Teacher: **editable marks distribution** + gradebook. Student: **self-service marksheet (PDF/CSV)** |
| `/live` | teacher, student | Schedule and join live classes |
| `/messages` | all | Direct messages + course announcements |
| `/calendar` | all | Month view of classes, deadlines, exams |
| `/reports` | teacher, admin | Grade distribution, attendance trend, at-risk students |
| `/integrations` | all | Linked services hub (SIS, fee, email, library, exam, attendance; transport planned) |
| `/profile` | all | Editable display name and contact details, notification preferences |
| `/survey-insights` | all | Survey results and the finding → design-decision traceability matrix |

## Connecting the real backend

Set `VITE_USE_MOCK=false`. Each function in `src/services/*.js` already has its REST call, e.g.:

```
POST /auth/login            GET  /courses            GET  /courses/:id/students
POST /courses/:id/materials GET  /attendance?course=&date=      POST /attendance
GET  /assignments           POST /assignments        POST /assignments/:id/submit
GET  /quizzes               POST /quizzes            POST /quizzes/:id/attempt
GET  /results/gradebook?course=   PUT /results/gradebook?course=   GET /results/me
GET  /messages              POST /messages/:id       GET /notifications
GET  /live                  POST /live               GET /events        GET /integrations
```

Auth uses `Authorization: Bearer <token>` (token stored by the login flow).

## Branding / assets

* The logo is **hotlinked** from `https://usindh.edu.pk/resource/images/logo.png` (set `VITE_LOGO_URL`). If it cannot
  load, a "US" monogram is shown. For an offline build, download the logo yourself, put it in `client/public/` and set
  `VITE_LOGO_URL=/logo.png`.
* Colours are placeholders in the university's green/gold spirit, defined once in `src/styles/tokens.css`
  — adjust them there if the official palette differs.

## Honest notes

* All people, roll numbers, marks and dates are **fictional sample data**.
* The original portal page requires a login and could not be inspected, so the feature set is driven by the survey,
  not by a copy of the old screens.
* The survey has **2 respondents**, transcribed from handwriting; a few ticks were ambiguous and are flagged on the
  Survey Insights page.
