# FinFlow - Tiered Financial Analytics Documentation

Welcome to the comprehensive technical documentation for the **Tiered Financial Analytics** feature. This document explains how both the **Backend (BE)** and **Frontend (FE)** work in simple, beginner-friendly terms, with deep focus on the backend database aggregations, business logic algorithms, and data flow.

---

## Table of Contents
1. [High-Level Architecture](#1-high-level-architecture)
2. [Backend (BE) Logic In-Depth](#2-backend-be-logic-in-depth)
   - [Date Range Utilities](#date-range-utilities)
   - [Tier 1: Simple Summary (`/analytics/summary`)](#tier-1-simple-summary-analytics-summary)
   - [Tier 2: Lifestyle & 50/30/20 Rule (`/analytics/lifestyle`)](#tier-2-lifestyle--503020-rule-analytics-lifestyle)
   - [Tier 3: Cash Runway & Recurring Bills (`/analytics/forecast`)](#tier-3-cash-runway--recurring-bills-analytics-forecast)
   - [API Route Registration & Auth Guard](#api-route-registration--auth-guard)
3. [Frontend (FE) Architecture & Flow](#3-frontend-fe-architecture--flow)
   - [Axios Authorization Interceptor](#axios-authorization-interceptor)
   - [React Query (TanStack Query) Lifecycle](#react-query-tanstack-query-lifecycle)
   - [Real-Time Cache Invalidation](#real-time-cache-invalidation)
   - [Page Division: Dashboard vs. Dedicated Analytics](#page-division-dashboard-vs-dedicated-analytics)
   - [Interactive Features (Slider Simulator & Client Filters)](#interactive-features)
4. [Testing & Verification Reference](#4-testing--verification-reference)

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React 19 + Vite)                │
├───────────────────────────────────┬─────────────────────────────────────┤
│   Overview Dashboard (/dashboard) │   Dedicated Analytics (/analytics)  │
│   • 4 Core Summary Cards          │   • Month & Year Pickers            │
│   • Quick Transaction Logger      │   • Multi-Segment Distribution Bar  │
│   • Simple Radial Rings           │   • 50/30/20 Budget Health Cards    │
│   • Recent Activity Table         │   • Indian Convenience Tax Audit    │
│                                   │   • Runway Burn Simulator Slider    │
│                                   │   • Projected Bills Timeline        │
└───────────────────────────────────┴─────────────────────────────────────┘
                                    │
                                    │ (Axios + JWT Auth Interceptor)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (Express.js)                       │
├─────────────────────────────────────────────────────────────────────────┤
│  Middleware: authMiddleware.js (protect) -> Extracts & Verifies JWT     │
│  Controller: analyticsController.js                                     │
│   ├── /api/v1/analytics/summary   -> Income, Expense, Category %        │
│   ├── /api/v1/analytics/lifestyle -> 50/30/20 Buckets, Convenience Tax  │
│   └── /api/v1/analytics/forecast  -> 90-Day Burn, Runway, Bill Scans   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ (Mongoose Aggregation Pipelines)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              DATABASE (MongoDB)                         │
│  Collections: `users`, `transactions`                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Backend (BE) Logic In-Depth

All backend analytics controllers reside in:
📁 `Expense Tracker BE/controllers/analyticsController.js`

### Date Range Utilities
Financial calculations require strict boundary comparisons (e.g., from the first second of day 1 to the last second of the month's final day).

```javascript
// Calculates start of month (e.g. 2026-08-01T00:00:00.000Z)
// and end of month (e.g. 2026-08-31T23:59:59.999Z)
const getMonthDateRange = (year, month) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
};

// Handles calendar rollover when comparing against the previous month
// (e.g. January 2026 rolls back to December 2025)
const getPreviousMonthAndYear = (year, month) => {
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear = year - 1;
  }
  return { prevYear, prevMonth };
};
```

---

### Tier 1: Simple Summary (`/analytics/summary`)
**Purpose**: Calculates the core cash flow (Total Income, Total Expense, Net Savings) and the category percentage breakdown for a given month.

#### How the Logic Works:
1. **Income vs. Expense Aggregation**:
   Instead of pulling thousands of records into memory, we let MongoDB do the heavy lifting using an aggregation pipeline:
   - **`$match`**: Filters records belonging to `req.user.id` and within `start` and `end` dates.
   - **`$group`**: Groups documents by `$type` (`"income"` or `"expense"`) and computes the sum of `amount`.

   ```javascript
   const summaryAgg = await Transaction.aggregate([
     {
       $match: {
         user: new mongoose.Types.ObjectId(userId),
         date: { $gte: start, $lte: end },
       },
     },
     {
       $group: {
         _id: "$type",
         total: { $sum: "$amount" },
       },
     },
   ]);
   ```

2. **Net Savings Calculation**:
   $$\text{Net Savings} = \text{Total Income} - \text{Total Expense}$$

3. **Category Breakdown Pipeline**:
   Filters only `type: "expense"` and groups by `$category`:
   ```javascript
   const categoryAgg = await Transaction.aggregate([
     {
       $match: {
         user: new mongoose.Types.ObjectId(userId),
         date: { $gte: start, $lte: end },
         type: "expense",
       },
     },
     {
       $group: {
         _id: "$category",
         totalSpent: { $sum: "$amount" },
       },
     },
     { $sort: { totalSpent: -1 } }, // Highest spending first
   ]);
   ```
   Each category's percentage is calculated as:
   $$\text{Category Percentage} = \text{round}\left(\frac{\text{totalSpent}}{\text{totalExpense}} \times 100\right)$$

---

### Tier 2: Lifestyle & 50/30/20 Rule (`/analytics/lifestyle`)
**Purpose**: Categorizes expenses into the classic **50/30/20 financial rule** (**Needs**, **Wants**, **Investments**), tracks Indian **Convenience Tax**, and calculates **Month-over-Month (MoM)** growth.

#### 1. The 50/30/20 Rule Bucketing
- **Needs (50% target)**: Essential survival costs.
  - Categories: `Bills`, `Health`, `Education`.
  - **Special Domestic Help Detection**: People often pay domestic staff (maid, cook, driver) via UPI transfers with descriptions like "Maid salary" or "Kamwali". The code scans descriptions for keywords (`maid`, `cook`, `driver salary`, `salary paid`, `kamwali`) and automatically classifies them under **Needs**.
- **Investments (20% target)**: Wealth building.
  - Category: `Investment` (Mutual funds, SIPs, gold, fixed deposits).
- **Wants (30% target)**: Discretionary lifestyle spending.
  - Categories: `Food`, `Shopping`, `Entertainment`, `Gift`, `Other`.

#### 2. Indian Convenience Tax Calculation
Convenience spending (ordering food delivery instead of cooking, taking a cab instead of public transit) is a major lifestyle drain. The controller scans descriptions against keyword lists:
- **Quick Commerce & Food Delivery**: `swiggy`, `zomato`, `blinkit`, `zepto`, `instamart`, `bigbasket`, `dunzo`.
- **Ride Hailing & Cabs**: `ola`, `uber`, `rapido`, `namma yatri`, `indrive`.

```javascript
if (deliveryKeywords.some((k) => descLower.includes(k))) {
  quickCommerceSpend += t.amount;
}
if (cabKeywords.some((k) => descLower.includes(k))) {
  rideHailingSpend += t.amount;
}
```

#### 3. Month-over-Month (MoM) Growth
Compares current month's expenses against the previous month's total:
$$\text{MoM Growth \%} = \text{round}\left(\frac{\text{Current Expense} - \text{Previous Month Expense}}{\text{Previous Month Expense}} \times 100\right)$$

---

### Tier 3: Cash Runway & Recurring Bills (`/analytics/forecast`)
**Purpose**: Calculates how many months you can survive without new income (**Emergency Runway**) and predicts recurring fixed bills for next month.

#### 1. Emergency Cash Runway Formula
1. **Lifetime Net Surplus**:
   Aggregates all income and expenses across the user's entire account history:
   $$\text{Net Surplus} = \max(0, \text{All-Time Income} - \text{All-Time Expense})$$

2. **Average Monthly Burn Rate (Last 90 Days)**:
   Scans the user's expenses over the last 90 days and divides by 3 to find their realistic average monthly burn rate:
   $$\text{Average Monthly Burn Rate} = \frac{\text{Total Spent in Last 90 Days}}{3}$$

3. **Runway in Months**:
   $$\text{Runway (Months)} = \frac{\text{Net Surplus}}{\text{Average Monthly Burn Rate}}$$
   - $\text{Runway} < 3 \text{ months}$: **Critical Buffer** (Red Alert)
   - $3 \le \text{Runway} < 6 \text{ months}$: **Moderate Buffer** (Amber)
   - $\text{Runway} \ge 6 \text{ months}$: **Healthy Buffer** (Green)

#### 2. Recurring Bill Prediction Algorithm
The controller looks back across the last 60 days to identify recurring bills:
1. Matches expenses in category `Bills` OR descriptions matching recurring utilities:
   `/(rent|maintenance|wifi|broadband|electricity|gas|water|maid|cook|driver|jio|airtel)/i`
2. **Normalizes Labels**: Removes dates and numbers (e.g. "Jio Fiber July 2026" becomes "Jio fiber").
3. **Averages Amount**: Groups repeating instances and computes the average payment amount.
4. Returns the top projected fixed costs with estimated due dates ("First week of next month").

---

### API Route Registration & Auth Guard
Routes are declared in `Expense Tracker BE/routes/analyticsRoutes.js` and registered in `server.js`:

```javascript
const router = express.Router();

// Middleware: Protect all analytics routes with JWT verification
router.use(protect);

router.get("/summary", getAnalyticsSummary);
router.get("/lifestyle", getAnalyticsLifestyle);
router.get("/forecast", getAnalyticsForecast);
```

---

## 3. Frontend (FE) Architecture & Flow

### Axios Authorization Interceptor
Located in `Expense Tracker FE/src/api/transactionAPIs.js`.

**Problem Solved**: In local development, the frontend runs on port `5173` while the backend runs on port `5000`. Cross-origin cookie policies can occasionally block cookies between ports.
**Solution**: We added a request interceptor that retrieves the JWT from Zustand store memory and automatically attaches it to the `Authorization` header:

```javascript
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

---

### React Query (TanStack Query) Lifecycle
Instead of writing complex manual `useEffect` logic, we use **React Query**:
1. **Dynamic Query Keys**:
   ```javascript
   const summaryQuery = useQuery({
     queryKey: ["analytics", "summary", selectedYear, selectedMonth],
     queryFn: () => getAnalyticsSummary({ year: selectedYear, month: selectedMonth }),
   });
   ```
   Whenever the user selects a new Month or Year in the UI, React Query automatically triggers a fetch for that specific date range and caches the result.
2. **Automatic Request Deduplication**: If multiple widgets request `["analytics", "summary", 2026, 8]` at the same time, only 1 network call is sent.

---

### Real-Time Cache Invalidation
When a user logs a transaction in `QuickTransactionBar.jsx` or `AddEditTransactionModal.jsx`, we invalidate the analytics cache:

```javascript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["transactions"] });
  queryClient.invalidateQueries({ queryKey: ["analytics"] }); // Refresh all analytics!
}
```
React Query immediately flags all analytics data as **stale** and re-fetches in the background. The category rings, budget meters, and convenience tax cards update **instantly** without reloading the page.

---

### Page Division: Dashboard vs. Dedicated Analytics

To keep the application clean and uncluttered, we split operational tasks from analytical audits:

| Feature | Operational Dashboard (`/dashboard`) | Dedicated Analytics Page (`/analytics`) |
| :--- | :--- | :--- |
| **Primary Goal** | Daily monitoring & instant transaction logging | In-depth audit, budgeting checks & simulations |
| **Date Range** | Always shows **current month** | Interactive **Month & Year Pickers** (historical view) |
| **Category Breakdown** | Simple radial preview (top 4 categories) | Full multi-segment distribution bar + all category rings |
| **50/30/20 Rule** | Compact summary highlight | Full health cards with limit warnings & insights |
| **Convenience Tax** | Total amount badge | Itemized transaction list of Swiggy, Zomato & Cabs |
| **Cash Runway** | Basic month count | Interactive **Burn Rate Simulator Slider** & Bill Timeline |

---

### Interactive Features

#### 1. Interactive Runway Burn Rate Simulator
Located in `AnalyticsDashboard.jsx`:
- Users can drag a slider to simulate what happens if their monthly living expenses increase or decrease (from 30% to 250% of their actual average burn rate).
- The emergency runway recalculates reactively in real time:
  ```javascript
  const simulatedRunway = simulatedBurnRate > 0 
    ? parseFloat((surplusBalance / simulatedBurnRate).toFixed(1)) 
    : 99;
  ```

#### 2. Client-Side Convenience Tax Filtering
The frontend fetches the month's raw transactions and runs keyword filters on the client side to generate an itemized audit list showing the exact date, description, and cost of every food delivery and taxi ride.

---

## 4. Testing & Verification Reference

We created an automated backend test script at:
📁 `Expense Tracker BE/scratch/testAnalytics.js`

To run the verification test:
```bash
cd "Expense Tracker BE"
node scratch/testAnalytics.js
```

### What the Test Validates:
1. Connects to MongoDB database.
2. Creates a mock user and populates 14 representative transactions (Salary, Rent, Jio Fiber, Apollo Pharmacy, Maid Salary, Zomato, Swiggy, Uber, Netflix, Mutual Funds).
3. Executes `getAnalyticsSummary`, `getAnalyticsLifestyle`, and `getAnalyticsForecast` directly against mock request/response objects.
4. Confirms that all calculations (Income, Expense, 50/30/20 proportions, convenience tax sum, 90-day burn rate, and projected bills) match expected values.

---

*Documentation compiled for FinFlow Expense Tracker.*
