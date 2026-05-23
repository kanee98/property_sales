# Deployment Guide (cPanel / Shared Hosting)

## 1) Build on Linux via GitHub Actions
Workflow:
- `.github/workflows/build-linux.yml`

Artifact output:
- `standalone/`
- `next-static/`
- `public/`
- `app.cjs`
- `package.json`

## 2) Upload artifact to server
Target app root:
- `/home/propwise/propwise`

Replace existing build/runtime folders with artifact contents.

Create static assets path:
- `/home/propwise/propwise/.next/static`

Copy all files from artifact `next-static/` into server `.next/static/`.

## 3) Node app startup
Use `app.cjs` startup file.

`app.cjs` runs:
- production: `./standalone/server.js`
- development fallback for local only

## 4) Environment variables
Set in cPanel Node App:
- `NODE_ENV=production`
- `DATABASE_URL=...`
- `NEXTAUTH_SECRET=...`
- `JWT_SECRET=...`
- `NEXT_TELEMETRY_DISABLED=1`

## 5) Prisma
Run once after deployment if schema changed:
- `npm run gen`
- `npm run db:push`

## 6) Restart app
After upload/env updates:
- Stop app
- Start app

## 7) Troubleshooting
- Never upload Windows-built `.next` to Linux.
- Keep only one lockfile strategy (`package-lock.json` preferred).
- If routes fail, clear old artifacts:
  - `.next`
  - old `standalone`
  - old generated prisma output folders
