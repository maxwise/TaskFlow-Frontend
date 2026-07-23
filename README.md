# TaskFlow Frontend

This is the standalone React and Vite frontend for the TaskFlow MERN application.

## Local setup

1. Install Node.js 24 LTS.
2. Open a terminal in this folder.
3. Copy `.env.example` to `.env`.
4. Set the API address in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

5. Install and start:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Vercel deployment

Import this folder or its GitHub repository into Vercel. Add:

```text
Key: VITE_API_URL
Value: https://YOUR-RENDER-SERVICE.onrender.com/api
Environments: Production, Preview, Development
```

Then deploy or redeploy the project.
