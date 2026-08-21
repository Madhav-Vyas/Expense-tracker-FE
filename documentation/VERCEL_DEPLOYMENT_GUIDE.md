# Vercel Deployment Guide (Frontend & Backend)

This guide walks you through deploying both the **Express Backend** and **React/Vite Frontend** to Vercel and resolving any CORS or serverless connection issues.

---

## 📋 Prerequisites

1. A free **[Vercel Account](https://vercel.com/signup)**.
2. A free **[MongoDB Atlas Database](https://www.mongodb.com/atlas/database)**.

> [!IMPORTANT]
> **MongoDB Atlas Network Access (Crucial)**:
> In your MongoDB Atlas dashboard, go to **Network Access** -> **Add IP Address** -> select **Allow Access from Anywhere (`0.0.0.0/0`)**.
> Since Vercel executes serverless functions on dynamic IP addresses, without `0.0.0.0/0` MongoDB Atlas will reject connections and cause `FUNCTION_INVOCATION_FAILED` errors on Vercel.

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
   Go to your backend project on [vercel.com](https://vercel.com/dashboard) -> **Settings** -> **Environment Variables**, and add:
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

5. Verify backend is healthy:
   - Visit in your browser: `https://<your-backend-app>.vercel.app/api/status`
   - You should see `{"status":"ok", "message":"Expense Tracker Backend API is operational", "database":{"status":"Connected", "connected":true}}`.

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
   - `VITE_API_URL`: `https://<your-backend-app>.vercel.app/api/v1` *(Note: without trailing slash)*

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

## 🛠️ Architecture & CORS Handling

1. **Universal CORS & Preflight (`server.js`)**: Dynamic origin reflection allowing all frontend clients while supporting `credentials: true`. Immediate 200 response on `OPTIONS` ensures preflights never timeout.
2. **Serverless MongoDB Fail-Fast & Connection Reuse**: Cached DB pooling with strict timeout prevents serverless lambda timeouts (`FUNCTION_INVOCATION_FAILED`).
3. **Dual-Route Mounting**: Endpoints are mounted on both `/api/v1` and `/v1` to seamlessly handle direct API calls and rewrite paths.
4. **Cross-Origin Cookie Support (`authController.js`)**: Configured with `SameSite: "none"` and `Secure: true` in production environments for seamless cross-domain cookie handling.
5. **Frontend SPA Routing (`vercel.json`)**: Configured with SPA rewrite rule so refreshing `/dashboard` or `/analytics` routes works seamlessly.

