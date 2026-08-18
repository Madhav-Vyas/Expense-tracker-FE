# Vercel Deployment Guide (Frontend & Backend)

This guide walks you through deploying both the **Express Backend** and **React/Vite Frontend** to Vercel.

---

## 📋 Prerequisites
1. A free **[Vercel Account](https://vercel.com/signup)**.
2. A free **[MongoDB Atlas Database](https://www.mongodb.com/atlas/database)** (Cloud MongoDB connection string, since Vercel serverless functions cannot connect to `localhost:27017`).

---

## 🚀 Option 1: Deploy via Vercel CLI (Fastest)

### Step 1: Log in to Vercel CLI
Open your terminal and run:
```bash
npx vercel login
```
Follow the prompt in your browser to authenticate your account.

---

### Step 2: Deploy the Backend API (`Expense Tracker BE`)

1. Open your terminal in the backend directory:
   ```bash
   cd "d:/Full-stack apps/Expense tracker/Expense Tracker BE"
   ```

2. Run the deployment command:
   ```bash
   npx vercel
   ```
   *Answer the prompts:*
   - **Set up and deploy?** `Y`
   - **Which scope?** *(Select your Vercel account)*
   - **Link to existing project?** `N`
   - **Project name?** `expense-tracker-backend` (or your choice)
   - **Directory located?** `./`
   - **Want to modify settings?** `N`

3. Set your Production Environment Variables on Vercel:
   Go to your project on [vercel.com](https://vercel.com/dashboard) -> **Settings** -> **Environment Variables**, and add:
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/expense_tracker?retryWrites=true&w=majority`
   - `JWT_SECRET`: `your-secure-random-jwt-secret-key-123456`
   - `JWT_EXPIRES_IN`: `90d`
   - `JWT_COOKIE_EXPIRES_IN`: `90`
   - `NODE_ENV`: `production`

4. Deploy to Production:
   ```bash
   npx vercel --prod
   ```
   *Copy your deployed backend URL (e.g. `https://expense-tracker-backend.vercel.app`).*

5. Verify backend is healthy by visiting in your browser:
   `https://<your-backend-app>.vercel.app/api/status`

---

### Step 3: Deploy the Frontend App (`Expense Tracker FE`)

1. Open your terminal in the frontend directory:
   ```bash
   cd "d:/Full-stack apps/Expense tracker/Expense Tracker FE"
   ```

2. Run the deployment command:
   ```bash
   npx vercel
   ```
   *Answer the prompts:*
   - **Set up and deploy?** `Y`
   - **Which scope?** *(Select your Vercel account)*
   - **Link to existing project?** `N`
   - **Project name?** `expense-tracker-frontend`
   - **Directory located?** `./`
   - **Framework Preset?** `Vite`
   - **Want to modify settings?** `N`

3. Set your Production Environment Variable on Vercel:
   Go to your frontend project on [vercel.com](https://vercel.com/dashboard) -> **Settings** -> **Environment Variables**, and add:
   - `VITE_API_URL`: `https://<your-backend-app>.vercel.app/api/v1`

4. Deploy to Production:
   ```bash
   npx vercel --prod
   ```
   *Your frontend is now live at `https://expense-tracker-frontend.vercel.app`!*

---

## 🌐 Option 2: Deploy via Vercel Web Dashboard (GitHub Connected)

If your project is pushed to a GitHub repository, you can deploy both directly from the Vercel Web Dashboard:

### 1. Deploy Backend:
1. Go to [Vercel Dashboard](https://vercel.com/new) -> **Add New...** -> **Project**.
2. Select your repository.
3. In **Root Directory**, click **Edit** and select `Expense Tracker BE`.
4. Under **Environment Variables**, add:
   - `MONGODB_URI`: *(Your MongoDB Atlas connection string)*
   - `JWT_SECRET`: *(Your secret)*
   - `JWT_EXPIRES_IN`: `90d`
   - `JWT_COOKIE_EXPIRES_IN`: `90`
   - `NODE_ENV`: `production`
5. Click **Deploy**.
6. Copy the deployed backend URL (e.g., `https://expense-tracker-backend.vercel.app`).

### 2. Deploy Frontend:
1. Go back to [Vercel Dashboard](https://vercel.com/new) -> **Add New...** -> **Project**.
2. Select the same repository.
3. In **Root Directory**, click **Edit** and select `Expense Tracker FE`.
4. Framework preset will automatically detect **Vite**.
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://<your-backend-app>.vercel.app/api/v1`
6. Click **Deploy**.

---

## 🛠️ Configurations Implemented
1. **Backend Serverless Routing (`Expense Tracker BE/vercel.json`)**: Configured `@vercel/node` to route all endpoints to `server.js`.
2. **Database Connection Reuse (`Expense Tracker BE/server.js`)**: Implemented cached connection pooling (`connectDB`) to prevent database connection exhaustion in serverless environments.
3. **CORS Flexibility (`Expense Tracker BE/server.js`)**: Automatically allows requests from `localhost`, `*.vercel.app` domains, and custom URLs.
4. **Frontend SPA Rewrites (`Expense Tracker FE/vercel.json`)**: Added rewrite rules to `/index.html` so client-side routing (`/dashboard`, `/analytics`, `/all-transactions`) works on page refresh.
5. **Dynamic API Configuration (`Expense Tracker FE/src/api/`)**: `authAPIs.js` and `transactionAPIs.js` now dynamically resolve `import.meta.env.VITE_API_URL`.
