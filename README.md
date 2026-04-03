# FinVault — Finance Dashboard

A clean, interactive, and fully responsive **Finance Dashboard UI** built with React, Tailwind CSS, Recharts, and Zustand. Designed as a frontend screening assignment for Zorvyn, this project demonstrates component architecture, state management, role-based UI, data visualization, and thoughtful UX design.

---

## 🖥️ Live Preview

> Run locally with `npm run dev` → [http://localhost:5173](http://localhost:5173)

---

## ✨ Features

### Core Requirements
| Feature | Status |
|---|---|
| Dashboard Overview (Summary Cards) | ✅ |
| Time-based Visualization (Balance Trend — Area Chart) | ✅ |
| Categorical Visualization (Spending Breakdown — Donut Chart) | ✅ |
| Transactions Table with Date, Amount, Category, Type | ✅ |
| Search, Filter & Sort on Transactions | ✅ |
| Basic Role-Based UI (Admin / Viewer) | ✅ |
| Insights Section | ✅ |
| State Management (Zustand) | ✅ |
| Responsive Design | ✅ |
| Empty / No-data States | ✅ |

### Optional Enhancements
| Feature | Status |
|---|---|
| Dark Mode | ✅ |
| Data Persistence (localStorage via Zustand persist) | ✅ |
| Export to CSV & JSON | ✅ |
| Animations & Transitions | ✅ |
| Advanced Filtering & Grouping | ✅ |

---

## 🗂️ Project Structure

```
finance-dashboard/
│
├── public/
│   └── index.html                  # HTML entry with Google Fonts
│
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx           # Main dashboard page layout
│   │   │   ├── SummaryCards.jsx        # Balance / Income / Expense KPI cards
│   │   │   ├── BalanceTrend.jsx        # 6-month area chart (time-based viz)
│   │   │   ├── SpendingBreakdown.jsx   # Donut chart by category (categorical viz)
│   │   │   └── RecentTransactions.jsx  # Latest 5 transactions widget
│   │   │
│   │   ├── transactions/
│   │   │   ├── Transactions.jsx        # Full transaction table + filters
│   │   │   └── TransactionModal.jsx    # Add / Edit transaction modal
│   │   │
│   │   ├── insights/
│   │   │   └── Insights.jsx            # Insights page (charts + observations)
│   │   │
│   │   └── layout/
│   │       ├── Sidebar.jsx             # Navigation + Role switcher
│   │       └── Header.jsx              # Page title + Dark mode + Export
│   │
│   ├── store/
│   │   └── useStore.js                 # Zustand global store (persisted)
│   │
│   ├── data/
│   │   └── mockData.js                 # 30+ mock transactions + helpers
│   │
│   ├── utils/
│   │   └── helpers.js                  # formatCurrency, filterTransactions, export
│   │
│   ├── App.jsx                         # Root component + dark mode effect
│   ├── index.js                        # React DOM entry
│   └── index.css                       # Tailwind directives + CSS variables
│
├── tailwind.config.js                  # Custom colors, fonts, animations
├── postcss.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **npm** v8 or higher

Check your versions:
```bash
node -v
npm -v
```

### Installation

**1. Clone or download the project:**
```bash
git clone https://github.com/sahilGidwani-26/Finance-dashboard.git
cd finance-dashboard
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start the development server:**
```bash
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173).

### Build for Production

```bash
npm run build
```

## 🌐 Live Demo

👉 (https://finance-dashboard5.netlify.app/)

The optimized build will be in the `/build` folder.

---

## 📱 Pages & Navigation

### 1. Dashboard
The main landing page showing:
- **3 KPI Cards** — Total Balance, Total Income, Total Expenses with animated number counters and month-over-month change indicators
- **Balance Trend Chart** — Area chart showing Income vs Expenses across the last 6 months
- **Spending Breakdown** — Interactive donut chart with per-category drill-down
- **Recent Transactions** — Latest 5 transactions with a quick link to the full list

### 2. Transactions
Full transaction management page with:
- **Search** — Real-time search across description, category, and amount
- **Filters** — Filter by type (income/expense), category, and date range
- **Sort** — Sort by newest/oldest/highest/lowest amount
- **Table** — Date, Description, Category, Type badge, Amount
- **Add Transaction** (Admin only) — Modal form with validation
- **Edit Transaction** (Admin only) — Pre-filled modal
- **Delete Transaction** (Admin only) — Confirmation prompt
- **Export** — Download filtered results as CSV or JSON

### 3. Insights
Data analysis page featuring:
- **4 KPI Cards** — Top category, Savings rate, Avg daily spend, Expense change %
- **Monthly Comparison Chart** — Grouped bar chart (Income / Expenses / Savings, 6 months)
- **Highest Spending Categories** — Ranked list with progress bars and % of total
- **Spending Pattern Radar** — Radar chart across top 6 expense categories
- **This Month vs Last Month** — Side-by-side comparison cards with delta indicators
- **Smart Observations** — Auto-generated, color-coded insights based on your actual data

---

## 🔐 Role-Based UI

Switch roles using the toggle in the sidebar. No backend is involved — roles are simulated on the frontend.

| Action | Admin | Viewer |
|---|---|---|
| View Dashboard | ✅ | ✅ |
| View Transactions | ✅ | ✅ |
| View Insights | ✅ | ✅ |
| Add Transaction | ✅ | ❌ |
| Edit Transaction | ✅ | ❌ |
| Delete Transaction | ✅ | ❌ |
| Export Data | ✅ | ❌ |

Role preference is persisted in localStorage and restored on page reload.

---

## 🗃️ State Management

Global state is managed with **Zustand** and persisted to `localStorage` using the `persist` middleware.

**Persisted state includes:**
- `darkMode` — current theme preference
- `role` — selected role (admin/viewer)
- `transactions` — all transaction records (including user-added ones)

**Ephemeral state (in-memory only):**
- `filters` — search, type, category, sort, date range
- `activePage` — current navigation page
- `sidebarOpen` — mobile sidebar visibility

```js
// Example usage in any component
import useStore from '../store/useStore';

const { transactions, addTransaction, role, darkMode } = useStore();
```

---

## 📊 Data & Charts

All data is **mock / static** — no backend or API calls are made. Charts are built with **Recharts**.

### Mock Data (`src/data/mockData.js`)
- 30+ pre-seeded transactions across 6 months
- 9 categories: Food, Transport, Shopping, Health, Entertainment, Utilities, Salary, Freelance, Investment
- Helper functions: `getMonthlyTrend()`, `getSpendingByCategory()`, `getSummary()`

### Charts Used
| Chart | Library | Location |
|---|---|---|
| Area Chart (balance trend) | Recharts | `BalanceTrend.jsx` |
| Pie / Donut Chart (spending) | Recharts | `SpendingBreakdown.jsx` |
| Grouped Bar Chart (monthly) | Recharts | `Insights.jsx` |
| Radar Chart (patterns) | Recharts | `Insights.jsx` |

---

## 🎨 Design System

### Fonts
- **Display / Headings:** Syne (Google Fonts)
- **Body / UI:** DM Sans (Google Fonts)
- **Numbers / Code:** JetBrains Mono (Google Fonts)

### Color Palette
| Token | Light | Dark | Usage |
|---|---|---|---|
| `--bg-primary` | `#f5f5f7` | `#0a0a18` | Page background |
| `--bg-card` | `#ffffff` | `#141428` | Card surfaces |
| `--accent` | `#00ff88` | `#4fffb0` | Primary actions, highlights |
| `--text-primary` | `#0a0a18` | `#f5f5f7` | Headings, values |
| `--text-muted` | `#6e6e85` | `#6e6e85` | Labels, hints |

### Theming
All colors use **CSS custom properties** toggled by a `.dark` class on `<html>`. This enables smooth transitions and easy extension.

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.2 | UI framework |
| `react-dom` | ^18.2 | DOM rendering |
| `recharts` | ^2.10 | Data visualization |
| `zustand` | ^4.5 | State management |
| `lucide-react` | ^0.363 | Icon library |
| `date-fns` | ^3.3 | Date formatting & math |
| `tailwindcss` | ^3.4 | Utility-first CSS |
| `autoprefixer` | ^10.4 | CSS vendor prefixes |
| `postcss` | ^8.4 | CSS processing |

---

## 🧠 Approach & Decisions

**Why Zustand over Redux?**
Zustand provides the same scalability as Redux but with dramatically less boilerplate. For a dashboard of this scope it's the right tradeoff — simple to set up, easy to debug, and supports middleware (like `persist`) out of the box.

**Why CSS variables over pure Tailwind for theming?**
Tailwind's `darkMode: 'class'` works well for static values, but dynamic theming (smooth transitions, runtime switching) is cleaner with CSS custom properties. Both are used together — Tailwind for layout and spacing, CSS vars for color tokens.

**Mock data structure**
Transactions are stored as a flat array with a `categoryMeta` object embedded for display. This avoids repeated lookups and keeps component code clean.

**Role simulation**
Roles are stored in Zustand and checked at the component level via simple conditionals. No routing guards are needed since all pages are accessible — only write actions are gated.

---


## 🙋 Author

Built as part of the **Zorvyn Frontend Screening Assessment**.

---

## 📄 License

This project is for assessment purposes only.
