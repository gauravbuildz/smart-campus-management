# 📸 Smart Campus Screenshots Catalog & Guide

This directory houses all official screenshots, graphics, and visual materials used in the repository's main [README.md](../README.md). 

Follow the guidelines below to capture high-quality, professional screenshots that align with top-tier open-source standards.

---

## 📅 Screenshot Checklist

| File Name | Page / Section | Target Flow | Status |
| :--- | :--- | :--- | :--- |
| `01-cover.png` | Landing Hero Banner | Project Brand Cover / Banner | ⬜ Pending |
| `02-landing-page.png` | Landing Page Overview | General Public Landing Page | ⬜ Pending |
| `03-login-page.png` | Login Portal | Authentication Gate (Centered) | ⬜ Pending |
| `04-signup-page.png` | Signup Portal | Authentication Registration | ⬜ Pending |
| `05-student-dashboard.png` | Student Home Dashboard | Student Central Hub | ⬜ Pending |
| `06-student-analytics.png` | Student Analytics | Personal Submission Statistics | ⬜ Pending |
| `07-resource-hub.png` | Student Resource Hub | Academic Downloads & Materials | ⬜ Pending |
| `08-service-requests.png` | Student Service Requests | Certificate & ID Applications Desk | ⬜ Pending |
| `09-notices.png` | Student Notices Board | Campus Circulars & Announcements | ⬜ Pending |
| `10-lost-found.png` | Student Lost & Found Feed | Item Listings & Claim Submissions | ⬜ Pending |
| `11-issue-reporting.png` | Student Issue Form | Complaints Logging with Auto-Severity | ⬜ Pending |
| `12-notifications.png` | Student Notifications | Real-Time Inbox Drawer | ⬜ Pending |
| `13-profile.png` | Student Profile & Settings | Account Details & Security Settings | ⬜ Pending |
| `14-admin-dashboard.png` | Admin Home Dashboard | Administrative Operations Control | ⬜ Pending |
| `15-admin-analytics.png` | Admin Analytics | Dynamic Charts & Distribution KPIs | ⬜ Pending |
| `16-student-management.png` | Student Management CRUD | Student Records Control List | ⬜ Pending |
| `17-notice-management.png` | Notice Broadcast Panel | Administrative Announcements Control | ⬜ Pending |
| `18-resource-management.png` | Resource Management | Academic Document Upload Desk | ⬜ Pending |
| `19-service-request-management.png` | Service Request Control | Application Processing & Logs desk | ⬜ Pending |
| `20-lost-found-management.png` | Lost & Found Control | Claim Validation & Verification Desk | ⬜ Pending |
| `21-issue-management.png` | Issues & Ticket Resolution | Complaint Timelines & Administrator Logs | ⬜ Pending |
| `22-notifications-management.png` | Admin Notifications | System Broadcast Alert Logs | ⬜ Pending |
| `23-admin-profile.png` | Admin Profile | Administrator Account Settings | ⬜ Pending |
| `24-mobile-view.png` | Mobile Layout View | Responsiveness Preview (Mobile) | ⬜ Pending |
| `25-tablet-view.png` | Tablet Layout View | Responsiveness Preview (Tablet) | ⬜ Pending |
| `26-dark-mode.png` | Settings/General View | Dark Mode Showcase | ⬜ Pending |

---

## 📷 Capture Guidelines

To maintain visual cohesion, clarity, and professionalism across the repository, all screenshots must adhere to the rules below:

### 🛠️ Technical Specifications
- **Format:** Save files strictly in `.png` format.
- **Resolution:** Capture at **Desktop View (1920×1080)**.
- **Browser Settings:** Use your browser in **Full-Screen Mode** (press `F11` to hide the tabs and address bar).
- **Clean UI:** Ensure no browser bookmarks, address bars, cursor overlays, devtools panels, or download bars are visible in the capture.

### 🎨 Visual & Content Rules
- **Realistic Demo Data:** Populated fields should contain clean, realistic, and coherent data. Avoid placeholder text (like *asdf*, *test123*, *Lorem Ipsum*).
- **No Empty States:** Ensure tables, lists, and charts are fully populated with seed data (e.g. run `npx prisma db seed` before capturing).
- **Consistent Theme:** Use a uniform theme across all dashboard shots (e.g., standard light theme or dark theme) unless capturing the specific `26-dark-mode.png` showcase.
- **High-Quality Rendering:** Verify that text is sharp, layouts are fully loaded, and glassmorphic gradients render smoothly.

---

## 🔍 Page-Specific Rules

### 🌐 Landing Page & Banner
- **01-cover.png:** Capture the clean landing hero banner (first fold of the homepage). Avoid capturing the FAQ or footer in this shot.
- **02-landing-page.png:** Capture the homepage in its entirety (using a full-page scroll capture tool if possible) showing the complete hero, info cards, features, and FAQs.

### 🛡️ Authentication Modals
- **03-login-page.png & 04-signup-page.png:** Trigger the modal, ensure it is horizontally and vertically centered on the screen, and capture it with a clean, uncluttered background.

### 🧑‍🎓 Student Views
- **05-student-dashboard.png:** Show the overview card metrics, notifications count badge, sidebar navigation, and recent activity logs clearly.
- **11-issue-reporting.png:** Type description text that triggers the auto-severity detector (e.g., words like *danger*, *fire*, *leak*) to show the auto-badge calculation in action.

### 👩‍💼 Admin Management Views
- **14-admin-dashboard.png & 15-admin-analytics.png:** Focus on showing the dynamic charts, graphs, data statistics, tables, and the fully populated student grids.
- **21-issue-management.png:** Capture the ticket resolution drawer or timeline view, highlighting administrator feedback comments and status histories.

### 📱 Responsive Previews
- **24-mobile-view.png & 25-tablet-view.png:** Set device emulation in Chrome/Edge DevTools (e.g., iPhone 14 for Mobile, iPad Pro for Tablet) and capture the collapsed menu hamburger icon and stacked card layout.
