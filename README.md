# TaskFlow Frontend

This is the standalone React and Vite frontend for the TaskFlow MERN application.

## Local setup

1. Install Node.js 24 LTS.
2. Open a terminal in this folder.
3. Copy `.env.example` to `.env`.
4. Set the API address in `.env`:

```env
VITE_API_URL=https://task-flow-frontend-eosin.vercel.app/
```

5. Install and start:

```bash
npm install
npm run dev
```

Open `https://task-flow-frontend-eosin.vercel.app/`.

## Vercel deployment

Import this folder or its GitHub repository into Vercel. Add:

```text
Key: VITE_API_URL
Value: https://taskflow-backend-sukq.onrender.com/api
Environments: Production, Preview, Development
```

Then deploy or redeploy the project.
