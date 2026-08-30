# Frontend Documentation

**Project:** Government Subsidy \& Grant Disbursement Tracking System
**Module:** `frontend/`

## 1\. Project Overview

The frontend is a React single-page application for a **Government Subsidy \& Grant Disbursement Tracking System**. It gives citizens ("beneficiaries") a way to browse welfare schemes, apply for grants, upload supporting documents, and track their application through a multi-stage approval and disbursement pipeline. It also gives government staff (front-desk officers, verification/district officers, finance officers, department admins, and a super admin) role-specific dashboards to review, approve, and disburse funds.

The frontend communicates with the backend exclusively over REST/JSON (and `multipart/form-data` for file uploads) using Axios, sending a JWT bearer token on every authenticated request.

**Roles confirmed from the source code** (from `src/pages/auth/Login.jsx`'s `getRoleHome()` role-routing logic and the various `/superadmin`, `/admin`, `/officer`, `/finance`, `/beneficiary` page folders):

* Beneficiary (citizen applicant)
* Front Desk / Field Officer
* Verification / District Officer
* Finance Officer
* Department Admin
* Super Admin

## 2\. Frontend Technology Stack

Confirmed from `frontend/package.json`:

|Technology|Purpose|
|-|-|
|React 19 (`react`, `react-dom`)|Core UI library|
|Vite 8 (`vite`, `@vitejs/plugin-react`)|Dev server and build tool|
|React Router DOM 7|Client-side routing (`BrowserRouter`, `Routes`, `Route`)|
|Axios|HTTP client for all backend API calls|
|Bootstrap 5 + Bootstrap Icons|Base CSS framework and icon set|
|lucide-react|Icon components (imported dependency; usage not exhaustively verified across every page)|
|React Context API (`createContext`/`useContext`)|Global authentication state (`AuthContext`)|
|ESLint 10 (`eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)|Linting (dev dependency only)|

**Not found in `frontend/package.json`:** any charting library (Chart.js, Recharts, etc.), any UI component library beyond Bootstrap, any form-validation library (validation is hand-written), any state-management library beyond React's built-in Context/`useState`.

> \*\*Note on `chart.js` / `react-chartjs-2`:\*\* these two packages are listed in the \*\*root\*\* `package.json` (at the repository root, not inside `frontend/`) and exist in a `node\_modules` folder, but they are not a dependency of the `frontend` app itself and no file under `frontend/src` imports them. They are not part of the deployed frontend bundle.

## 3\. Frontend Architecture

```text
User
  ↓
React UI (Vite dev server / static build)
  ↓
Pages (src/pages/\*\*)  ──uses──>  Reusable Components (src/components/\*\*)
  ↓
Context API (AuthContext) for auth state
  ↓
API layer (src/api/\*.js — one file per backend resource, all built on axiosClient)
  ↓
Axios (JWT attached via request interceptor)
  ↓
REST API (Spring Boot backend, default http://localhost:8080)
```

Each page component (e.g. `SuperAdminDashboard.jsx`, `FinanceDisbursementConsole.jsx`) is responsible for its own data fetching — there is no centralized global store (no Redux/Zustand/etc.). Pages call functions exported from `src/api/\*.js`, hold the results in local `useState`, and render directly. Cross-cutting session state (current user, JWT token, login/logout) is the one piece of state lifted into a shared `AuthContext`.

## 4\. Frontend Project Structure

Directory tree of `frontend/`, excluding `node\_modules`, `dist`, and `.idea` (build output and IDE metadata, not application source):

```text
frontend/
├── public/
├── src/
│   ├── api/                     # One file per backend resource — all HTTP calls live here
│   │   ├── applicationApi.js
│   │   ├── auditApi.js
│   │   ├── authApi.js
│   │   ├── axiosClient.js       # Shared Axios instance, JWT interceptor, 401 handling
│   │   ├── dashboardApi.js
│   │   ├── departmentApi.js
│   │   ├── disbursementApi.js
│   │   ├── documentApi.js
│   │   ├── frontDeskApi.js
│   │   ├── notificationApi.js
│   │   ├── officerApi.js
│   │   ├── otpApi.js
│   │   ├── reportApi.js
│   │   ├── schemeApi.js
│   │   ├── userApi.js
│   │   └── verificationApi.js
│   ├── assets/
│   ├── components/              # Shared/reusable UI pieces
│   │   ├── AboutPortal/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── FeaturedSchemes/
│   │   ├── Footer/
│   │   ├── FormInput/
│   │   ├── Hero/
│   │   ├── Loader/
│   │   ├── Modal/
│   │   ├── Navbar/
│   │   ├── QuickServices/
│   │   ├── Schemes/
│   │   ├── Sidebar/
│   │   └── Table/
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state: user, token, login(), logout()
│   ├── data/
│   ├── layouts/
│   │   └── MainLayout.jsx       # Wraps Navbar + Sidebar + Footer (see note below)
│   ├── pages/
│   │   ├── admin/                # Department Admin pages
│   │   ├── auth/                 # Home, Login, Register, ForgotPassword
│   │   ├── beneficiary/          # Citizen-facing dashboard \& application flow
│   │   ├── finance/               # Finance Officer pages
│   │   ├── officer/               # Front Desk \& Verification Officer pages
│   │   ├── superadmin/            # Super Admin pages
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── RoleSelection.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx         # All route definitions (BrowserRouter)
│   ├── styles/                   # Global and page-specific CSS
│   ├── utils/
│   ├── App.jsx                   # Wraps AppRoutes in AuthProvider
│   ├── App.css
│   ├── index.css
│   └── main.jsx                  # ReactDOM entry point
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

**Folder purposes:**

* **`src/api/`** — every network call to the backend goes through one of these files, each wrapping a single Axios instance (`axiosClient.js`).
* **`src/pages/`** — route-level screens, organized by role folder (`admin/`, `beneficiary/`, `finance/`, `officer/`, `superadmin/`) plus top-level public pages.
* **`src/components/`** — intended shared UI building blocks. Several of these (see [Section 12](#12-uiux-design)) are currently empty placeholder files.
* **`src/context/`** — holds `AuthContext.jsx`, the only global state in the app.
* **`src/layouts/MainLayout.jsx`** — exists in the codebase but is **not referenced from `AppRoutes.jsx` or any page**; it is unused dead code at present.

## 5\. Installation and Setup

**Prerequisites** (inferred from `package.json` engine requirements of the listed tooling — no explicit `engines` field is set in `package.json`, so no Node version constraint is enforced by the project itself):

* Node.js and npm installed (version not pinned by the project)
* A running instance of the backend API (default expected at `http://localhost:8080`, see [Section 10](#10-api-integration))

**Dependency installation**, exact commands from `frontend/package.json`:

```bash
cd frontend
npm install
```

**Environment/configuration:** the frontend reads a single environment variable, `VITE\_API\_BASE\_URL`, via Vite's `import.meta.env` (see `src/api/axiosClient.js`). If this variable is not set, the app falls back to `http://localhost:8080`. A code comment in `axiosClient.js` references a `.env.example` file for guidance, but **no `.env.example` file is present in the uploaded source** — this should be added, or the comment removed, for a smoother setup experience.

To point the frontend at a different backend host, create a `.env` file in `frontend/` with:

```text
VITE\_API\_BASE\_URL=http://your-backend-host:8080
```

**Backend URL/API configuration:** hardcoded default of `http://localhost:8080`, no other base URLs or proxy configuration found in `vite.config.js`.

## 6\. Application Routing

All routes are defined in `src/routes/AppRoutes.jsx` using `react-router-dom`'s `BrowserRouter`/`Routes`/`Route`. **No route-guarding component (e.g. a `ProtectedRoute`/`PrivateRoute`/`RequireAuth` wrapper) exists anywhere in the source code** — every route below is reachable by navigating directly to its URL, regardless of authentication state or role. Role-based access in this frontend is achieved only by:

1. Conditionally showing/hiding navigation links (e.g. in `Navbar.jsx`), and
2. Redirecting the user to a role-appropriate dashboard *after* a successful login (via `getRoleHome()` in `Login.jsx`).

Actual protection of role-restricted operations happens at the backend (see the Backend Documentation's Authorization section) — a user who guesses a protected page's URL will render the page, but any backend call it makes will be rejected with `401`/`403` if they lack a valid token or the required role.

|Route|Page/Module|Access (as implemented)|
|-|-|-|
|`/`|`Home` (auth)|Public|
|`/login`|`Login`|Public|
|`/role-selection`|`RoleSelection`|Public|
|`/register`|`Register`|Public|
|`/forgot-password`|`ForgotPassword`|Public|
|`/dashboard`, `/beneficiary/dashboard`|`Dashboard` (beneficiary)|Not route-guarded; intended for authenticated beneficiaries|
|`/beneficiary/schemes`|`BrowseSchemes`|Not route-guarded; also linked from the public navbar|
|`/beneficiary/schemes/:id`|`SchemeDetails`|Not route-guarded|
|`/beneficiary/apply`|`ApplyScheme`|Not route-guarded|
|`/beneficiary/my-applications`|`MyApplications`|Not route-guarded|
|`/beneficiary/timeline`, `/beneficiary/timeline/:id`|`ApplicationTimeline`|Not route-guarded|
|`/beneficiary/profile`|`Profile`|Not route-guarded|
|`/beneficiary/disbursement`|`DisbursementTracker`|Not route-guarded|
|`/beneficiary/notifications`|`Notifications`|Not route-guarded|
|`/officer/frontdesk`|`FrontDeskDashboard`|Not route-guarded|
|`/officer/frontdesk/application`, `/officer/frontdesk/application/:id`|`FrontDeskApplicationDetails`|Not route-guarded|
|`/officer/verification`|`VerificationDashboard`|Not route-guarded|
|`/officer/verification/review`, `/officer/verification/review/:id`, `/officer/verification/milestone`|`OfficerMilestoneVerification`|Not route-guarded|
|`/finance`, `/finance/dashboard`|`FinanceDashboard`|Not route-guarded|
|`/payment/:id`, `/finance/payment/:id`|`PaymentPage`|Not route-guarded|
|`/finance/disbursement`, `/finance/disbursement/:id`|`FinanceDisbursementConsole`|Not route-guarded|
|`/admin/dashboard`|`DepartmentAdminDashboard`|Not route-guarded|
|`/admin/create-scheme`|`CreateScheme`|Not route-guarded|
|`/admin/manage-schemes`|`ManageSchemes`|Not route-guarded|
|`/admin/manage-officers`|`ManageOfficers`|Not route-guarded|
|`/admin/reports`|`DepartmentReports`|Not route-guarded|
|`/admin/overdue-resolution`|`AdminOverdueResolution`|Not route-guarded|
|`/superadmin/dashboard`|`SuperAdminDashboard`|Not route-guarded|
|`/superadmin/departments`|`DepartmentManagement`|Not route-guarded|
|`/superadmin/schemes`|`ManageSchemes` (shared with admin)|Not route-guarded|
|`/superadmin/users`|`ManageUsers`|Not route-guarded|
|`/superadmin/reports`|`AnalyticsDashboard` (file: `analytics dashboard.jsx`)|Not route-guarded|
|`/superadmin/audit-logs`|`AuditLogViewer`|Not route-guarded|
|`/contact`|`Contact`|Public|
|`/about`|`About`|Public|

## 7\. Application Modules

Modules verified from `src/pages/` and their corresponding `src/api/\*.js` files:

### Beneficiary

* **Purpose:** citizen-facing scheme discovery, application submission, document upload, and status tracking.
* **Main screens:** `Dashboard`, `BrowseSchemes`, `SchemeDetails`, `ApplyScheme`, `MyApplications`, `ApplicationTimeline`, `Profile`, `DisbursementTracker`, `Notifications`.
* **Main actions:** browse active schemes, submit an application, upload required documents, view application status/history, view assigned disbursement milestones, read/mark notifications.
* **Backend interaction:** `applicationApi.js`, `documentApi.js`, `schemeApi.js`, `notificationApi.js`, `disbursementApi.js` (via `getApplicationMilestones`), `userApi.js` (profile).

### Front Desk / Field Officer

* **Purpose:** first-stage review of newly submitted applications.
* **Main screens:** `FrontDeskDashboard`, `FrontDeskApplicationDetails`.
* **Main actions:** approve, return, or reject an application at the field stage (calls the backend's `field-approve` / `field-return` / `field-reject` endpoints).
* **Backend interaction:** `frontDeskApi.js`, `applicationApi.js`.

### Verification / District Officer

* **Purpose:** second-stage (district-level) review of field-approved applications, plus milestone-level verification during disbursement.
* **Main screens:** `VerificationDashboard`, `OfficerMilestoneVerification`.
* **Main actions:** approve/return/reject at the verification stage; review and verify/reject uploaded documents.
* **Backend interaction:** `verificationApi.js`, `applicationApi.js`, `documentApi.js`.

### Finance

* **Purpose:** disbursement of grant funds in staged milestones once an application is verification-approved.
* **Main screens:** `FinanceDashboard`, `PaymentPage`, `FinanceDisbursementConsole`.
* **Main actions:** view the finance queue, initialize an application's milestone plan, release a completed milestone's funds, reject a milestone.
* **Backend interaction:** `disbursementApi.js`, `applicationApi.js`.

### Department Admin

* **Purpose:** scheme lifecycle and officer management within a department.
* **Main screens:** `DepartmentAdminDashboard`, `CreateScheme`, `ManageSchemes`, `ManageOfficers`, `DepartmentReports`, `AdminOverdueResolution`.
* **Main actions:** create/update/delete schemes, create/update/delete officers, review department-level reports, resolve overdue disbursement milestones (admin override).
* **Backend interaction:** `schemeApi.js`, `officerApi.js`, `departmentApi.js`, `disbursementApi.js` (`getOverdueReport`, `resolveOverdueMilestone`).

### Super Admin

See [Section 8](#8-super-admin-module) below.

### Common / Public Pages

* `Home`, `About`, `Contact`, `RoleSelection` — static/public marketing and informational pages, no privileged data.

## 8\. Super Admin Module

Verified from `src/pages/superadmin/SuperAdminDashboard.jsx` and `analytics dashboard.jsx`.

**What Super Admin can see (on `SuperAdminDashboard`):**

* System overview stat cards: total departments, total officers, total beneficiaries (derived client-side by filtering the users list for beneficiary-type roles), active vs. total schemes.
* Fiscal summary: total budget allocated across schemes and amount used, computed either from the raw scheme list or, when available, from the backend's scheme-summary DTOs.
* Application pipeline breakdown (submitted / under review / action required / approved / disbursed / rejected), computed client-side by bucketing each application's `status` string.
* A live-updating clock, a list of recent applications, and a feed of recent audit log entries.
* A notification bell showing unread system notifications for the logged-in super admin user.

**What Super Admin can manage:**

* **Departments** — create new departments via a modal form (`Add Department`).
* **Officers** — assign a new officer to a department with a designation (Front Desk Officer, Verification Officer, Finance Officer, Department Admin) via a modal form (`Add Officer`).
* **Schemes** — launch a new welfare scheme (name, department, budget, grant limits, dates) via a modal form (`Create Scheme`); scheme editing/deletion is handled through the shared `ManageSchemes` page (also used by Department Admin).
* Navigable links to `Manage Users`, `Manage Departments`, `Manage Schemes`, `Audit Trail`, and `Analytics \& Reports`.

**How real backend data is displayed:** every figure on `SuperAdminDashboard` and `AnalyticsDashboard` is fetched live via `Promise.allSettled()` calls into `dashboardApi.js`, `departmentApi.js`, `officerApi.js`, `applicationApi.js`, `schemeApi.js`, `userApi.js`, and `auditApi.js` — there is no hardcoded/sample data in these two pages. Fields display `"..."` while `loading` is `true` and degrade gracefully (the affected section is simply skipped) if an individual API call in the `Promise.allSettled` batch fails.

**How administrative actions interact with the backend:** each modal form (`Add Department`, `Add Officer`, `Create Scheme`) submits via the matching `api/\*.js` function (`createDepartment`, `createOfficer`, `createScheme`), shows a success/error message inline, and — on success — triggers a full data refetch (`fetchAllData(true)`) so the dashboard reflects the change immediately.

**Analytics (`AnalyticsDashboard`, file `analytics dashboard.jsx`):** fetches system overview, scheme summaries, region summaries, and approval-performance data from `dashboardApi.js`, plus applications/departments/officers/users for supplementary context. Also offers **PDF and Excel export** of the scheme-summary report via `reportApi.js` (`downloadSchemeSummaryPdf`, `downloadSchemeSummaryExcel`), which download the backend-generated files as blobs.

## 9\. Authentication and Authorization

**Login:** `Login.jsx` collects `mobileNumber` and `password`, calls `useAuth().login()`, which in turn calls `loginRequest()` in `authApi.js` (`POST /users/login`). On success, the response's JWT `token` and user profile fields are stored.

**Logout:** `AuthContext.logout()` removes `token` and `user` from `localStorage` and clears in-memory state.

**Token storage:** the JWT and a JSON-serialized user object are stored in **`localStorage`** under the keys `"token"` and `"user"` (see `AuthContext.jsx`). This is a plain browser `localStorage` call, not an HttpOnly cookie.

**Token/session handling:** `axiosClient.js` registers a request interceptor that reads the token from `localStorage` on every outgoing request and sets the `Authorization: Bearer <token>` header (stripping any accidental wrapping quotes/whitespace first). A response interceptor watches for HTTP `401` responses and, on receiving one, clears `token` and `user` from `localStorage` (it does not, however, force a redirect or reload — the app relies on the next protected API call failing, or the user manually navigating, to surface the logged-out state).

**Authentication context/state:** `AuthContext` exposes `user`, `token`, `isAuthenticated` (`Boolean(token)`), `login()`, and `logout()` via the `useAuth()` hook. It initializes its state synchronously from `localStorage` on mount, so a page refresh preserves the session as long as the stored token is still valid on the backend.

**Role-aware redirection:** `getRoleHome(role)` in `Login.jsx` maps the backend-provided role string to a starting dashboard route (e.g. any role containing `SUPER\_ADMIN` → `/superadmin/dashboard`, `FINANCE` → `/finance`, etc.) and is used both immediately after login and by the `Navbar`'s "Dashboard" button.

**Protected routes:** as documented in [Section 6](#6-application-routing), **no client-side route guarding exists**. Authorization is enforced only by the backend rejecting unauthenticated/under-privileged API calls; the frontend does not currently prevent an unauthenticated or wrong-role user from rendering a role-specific page shell (though that page's data fetches will fail).

**Password validation on login:** the `Login.jsx` component contains a fully commented-out password-strength validation block — currently, password strength is **not validated client-side** at login. Registration (`Register.jsx`) collects a `password` and `confirmPassword` field consistent with the backend's `User` entity fields.

## 10\. API Integration

All backend calls are routed through **`src/api/axiosClient.js`**, a single shared Axios instance:

```js
const BASE\_URL = import.meta.env.VITE\_API\_BASE\_URL || "http://localhost:8080";
```

* **Base URL configuration:** `VITE\_API\_BASE\_URL` environment variable, defaulting to `http://localhost:8080`.
* **Default headers:** `Content-Type: application/json` (overridden to `multipart/form-data` for the single file-upload call in `documentApi.js`).
* **Authentication headers:** `Authorization: Bearer <token>` attached automatically by the request interceptor when a token is present in `localStorage`.
* **Error handling:** a response interceptor clears the stored session on `401`; beyond that, error handling is done per-call at the page level, typically by reading `err.response?.data?.message` (or the raw string body) and displaying it in an inline alert.

**API summary table** (one row per `src/api/\*.js` file, listing the backend resource it wraps):

|API file|Backend resource|Representative functions|
|-|-|-|
|`authApi.js`|`/users/login`, `/users/register`|`loginRequest`, `registerRequest`|
|`userApi.js`|`/users/\*\*`, `/notifications/\*\*`|`getAllUsers`, `getUserById`, `updateUserById`, `deleteUser`|
|`applicationApi.js`|`/applications/\*\*`, `/disbursement/applications/{id}`|`submitApplication`, `getApplications`, `getAllApplications`, `getMyApplications`, `getApplicationById`, `resubmitApplication`, `searchApplications`|
|`frontDeskApi.js`|`/applications/{id}/field-\*`|`forwardApplication`, `returnApplication`, `rejectApplication`|
|`verificationApi.js`|`/verifications/\*\*`, `/applications/{id}/verify-\*`, `/applications/{id}/field-\*`|`assignOfficers`, `reviewVerification`, `getVerificationHistory`, `verifyApprove/Return/Reject`, `fieldApprove/Return/Reject`|
|`documentApi.js`|`/documents/\*\*`|`uploadDocument`, `getDocumentsByApplication`, `verifyDocument`, `rejectDocument`|
|`disbursementApi.js`|`/disbursement/\*\*`, `/reports/overdue`|`getFinanceQueue`, `releaseMilestone`, `rejectMilestone`, `completeMilestone`, `resolveOverdueMilestone`, `configurePlan`, `initApplicationMilestones`, `getOverdueReport`|
|`schemeApi.js`|`/departmentadmin/schemes/\*\*`|`createScheme`, `getAllSchemes`, `getSchemeById`, `updateScheme`, `deleteScheme`|
|`departmentApi.js`|`/superadmin/departments/\*\*`|`createDepartment`, `getAllDepartments`, `getDepartmentById`, `updateDepartment`, `deleteDepartment`|
|`officerApi.js`|`/superadmin/officers/\*\*`|`createOfficer`, `getAllOfficers`, `getOfficerById`, `updateOfficer`, `deleteOfficer`|
|`otpApi.js`|`/otp/\*\*`|`forgotPasswordSendOtp`, `verifyOtp`, `resetPassword`|
|`notificationApi.js`|`/notifications/\*\*`|`getUserNotifications`, `getUnreadNotifications`, `getUnreadCount`, `markAsRead`|
|`auditApi.js`|`/audit-logs/\*\*`|`getAllAuditLogs`, `getAuditLogsForEntity`|
|`dashboardApi.js`|`/dashboard/\*\*`|`getSystemOverview`, `getSchemeSummary`, `getRegionSummary`, `getApprovalPerformance`|
|`reportApi.js`|`/reports/scheme-summary/pdf`, `/reports/scheme-summary/excel`|`downloadSchemeSummaryPdf`, `downloadSchemeSummaryExcel`|

> \*\*Dead/mismatched code found:\*\* `applicationApi.js` exports `updateApplicationStatus(applicationId, status, remarks)`, which calls `PATCH /applications/{applicationId}/status`. This endpoint \*\*does not exist\*\* on the backend (the backend instead exposes distinct `field-approve`/`field-return`/`field-reject`/`verify-approve`/`verify-return`/`verify-reject` endpoints), and this function is \*\*not called from any page\*\* in the current source. It should be treated as unused/incomplete code, not a working feature.

## 11\. Dashboard and Analytics

Three dashboards were inspected directly (`SuperAdminDashboard.jsx`, `analytics dashboard.jsx` i.e. `AnalyticsDashboard`, and `beneficiary/Dashboard.jsx`); all three fetch their data from the live backend API on mount via `Promise.allSettled()` and do not use hardcoded sample data for their primary figures.

* **Dashboard cards:** stat cards (departments, officers, beneficiaries, active schemes, application pipeline counts, budget totals) are computed from the fetched arrays/DTOs, either directly from backend fields (e.g. `SystemOverviewDTO`) or via client-side aggregation of the raw applications/users/schemes lists (e.g. counting applications by `status`).
* **Charts:** **no charting library is present** in the actual frontend dependencies or imports (see [Section 2](#2-frontend-technology-stack)). What look like charts in the UI are CSS-based elements — progress bars (`<div className="progress-bar" style={{ width: ... }}>`) for budget utilization — not canvas/SVG chart components.
* **Filters:** a scheme search filter (`schemeSearch` state) exists on `AnalyticsDashboard`.
* **Loading/empty states:** all three dashboards track a `loading` boolean and render `"..."` placeholders or empty-state messages (e.g. `"No schemes registered."`) while data is in flight or absent.
* **Data fetching:** always live, via the `src/api/\*.js` layer — no mock/dummy data source was found feeding any dashboard number.

**Important distinction requested by the accuracy rules:** the only place dummy/static data was found feeding user-visible content is `FeaturedSchemes.jsx` on the public homepage, which falls back to four hardcoded sample scheme cards ("Farmer Assistance", "Student Scholarship", "Affordable Housing", "Women Empowerment") **only if** the live `getAllSchemes()` call fails or returns an empty list. When the backend returns real schemes, those are shown instead. This fallback content must not be mistaken for backend data — it is static placeholder content defined directly in the component.

## 12\. UI/UX Design

* **Navigation:** `Navbar.jsx` renders differently based on `isAuthenticated` — showing Login/Register links when logged out, and a notification bell + role-aware "Dashboard" button + "Logout" button when logged in.
* **Sidebar:** `src/components/Sidebar/Sidebar.jsx` exists but its implementation is a bare placeholder (`<aside>Sidebar</aside>`) with no navigation content, and `src/layouts/MainLayout.jsx` (which composes `Navbar` + `Sidebar` + `Footer`) is **not used by any route** — role-specific pages each implement their own header/layout inline rather than sharing this layout component.
* **Cards, Tables, Forms, Buttons:** implemented ad hoc, inline within each page (e.g. `SuperAdminDashboard.jsx` builds its own stat cards, modals, and tables directly with Bootstrap classes) rather than through the shared component folder. Several files under `src/components/` intended as shared primitives — `Table.jsx`, `Card.jsx`, `Modal.jsx`, `Button.jsx`, `FormInput.jsx`, `Loader.jsx`, and `AboutPortal.jsx` — are **empty files with no implementation** in the uploaded source.
* **Icons:** Bootstrap Icons (`bi bi-\*` classes) used throughout; `lucide-react` is a dependency but its actual usage was not exhaustively verified across every page.
* **Modals/popups:** implemented per-page as custom backdrop + card markup (e.g. the Add Department / Add Officer / Create Scheme / Scheme Details modals on `SuperAdminDashboard`), not through the shared `Modal` component (which, as noted above, is empty).
* **Notifications:** an in-app notification bell with a dropdown panel and unread-count badge, backed by `notificationApi.js`.
* **Responsive behavior:** achieved through Bootstrap's grid classes (`col-6 col-md-3`, etc.) applied throughout the dashboard pages.
* **Consistent visual design:** each role area (`admin/`, `beneficiary/`, `finance/`, `officer/`, `superadmin/`) has its own dedicated CSS file per page (e.g. `SuperAdminDashboard.css`), rather than a single shared design-system stylesheet beyond the global Bootstrap import and `src/styles/global.css`.

## 13\. Validation and Error Handling

* **Required fields:** enforced with plain JavaScript conditionals in each form's submit handler (e.g. `CreateScheme`/`SuperAdminDashboard`'s scheme modal requires `schemeName`, `departmentId`, and a positive `totalBudget` before calling the API), not through a validation library.
* **Form validation:** `Login.jsx` validates the mobile number against a `^\[0-9]{10}$` regex; its password-strength check exists in the code but is fully commented out (see [Section 9](#9-authentication-and-authorization)). `Register.jsx` mirrors the backend `User` entity's field set (full name, email, mobile, password/confirm, Aadhaar, DOB, gender, address, district/state/taluka/village, pincode, occupation, disability status, marital status, annual income, category, bank details).
* **Loading states:** every data-fetching page tracks a `loading` (and, where applicable, `refreshing`/`submitting`) boolean, disabling submit buttons and showing `"..."` or spinner text during in-flight requests.
* **Empty states:** explicit "no data" messages are rendered when a fetched list is empty (e.g. `"No schemes registered."`, `"No notifications"`).
* **Success messages:** inline success banners (`modalSuccess` state) shown after successful create/update actions, before the modal auto-closes and the underlying list refetches.
* **Error messages:** inline error banners (`modalError`, `errors.form`, etc.) built by reading `err.response?.data?.message`, falling back to the raw response body or `err.message`, then to a generic fallback string.
* **API/HTTP error handling:** centralized `401` handling in the Axios response interceptor (clears the stored session); all other HTTP error codes are handled per-call at the page level as described above — there is no centralized global error boundary or toast system found in the source.

## 14\. Running the Frontend

Exact scripts from `frontend/package.json`:

```bash
cd frontend
npm install
npm run dev
```

This starts the Vite development server (default `http://localhost:5173`, per Vite's standard defaults — no custom `server.port` override was found in `vite.config.js`).

## 15\. Production Build

Exact command from `frontend/package.json`:

```bash
npm run build
```

This runs `vite build`, producing a static production bundle in `frontend/dist/` (Vite's default output directory; not overridden in `vite.config.js`). A `npm run preview` script is also available to locally preview the production build, and `npm run lint` runs ESLint over the project.

## 16\. Frontend Security Considerations

### Currently Implemented

* JWT bearer token attached automatically to every outgoing request via an Axios request interceptor.
* Stored session is cleared automatically on a `401` response from the backend.
* Login form performs basic client-side mobile-number format validation before submitting.

