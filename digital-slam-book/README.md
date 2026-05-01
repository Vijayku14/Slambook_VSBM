# College Passout Digital Slam Book

A full-stack alumni/passout slam book app for college students with a public submission form, gallery, admin dashboard, local image uploads, JWT login, likes, and PDF export.

## Alumni Features

Students can submit:

```text
Name, nickname, college name, batch/passout year, department/course, roll number,
current status, current city, LinkedIn/social link, best college memory,
farewell message, future goals, favorite teacher/mentor,
achievements, advice for juniors, and photo.
```

## Folder Structure

```text
digital-slam-book/
  client/                 React + Tailwind frontend
  server/                 Express + MongoDB backend
    uploads/              Locally uploaded images
```

## Setup

1. Install dependencies:

```bash
npm install
npm run install-all
```

2. Create `server/.env` from `server/.env.example` and update the values:

```bash
cp server/.env.example server/.env
```

3. Start MongoDB locally or use MongoDB Atlas.

4. Run the app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Admin Login

On first server start, the app creates an admin user from these `.env` values:

```text
ADMIN_EMAIL=admin@slambook.local
ADMIN_PASSWORD=admin123
```

Change these before deploying.

## API Routes

```text
POST   /api/slam              Create alumni entry with image upload
GET    /api/slam              Fetch all entries
POST   /api/slam/:id/like     Like an entry
DELETE /api/slam/:id          Delete entry, admin only
GET    /api/slam/export/pdf   Download all entries as PDF, admin only
POST   /api/auth/login        Admin login
GET    /api/auth/me           Verify admin session
```

## Deploy Frontend on Netlify

Netlify should deploy the React frontend. The Express backend needs a Node host such as Render, Railway, Fly.io, or a VPS.

### Netlify Build Settings

This project includes `netlify.toml`, so Netlify can auto-use:

```text
Base directory: client
Build command: npm run build
Publish directory: dist
```

### Netlify Environment Variable

After your backend is deployed, add this environment variable in Netlify:

```text
VITE_API_URL=https://your-backend-url.example.com
```

Then redeploy the Netlify site.

### Backend Production Environment

On your backend host, set:

```text
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
CLIENT_URL=https://your-netlify-site.netlify.app
JWT_SECRET=a_long_random_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_strong_password
```

If you use a custom domain and a Netlify preview URL, you can allow multiple frontend origins:

```text
CLIENT_URL=https://your-netlify-site.netlify.app,https://yourcustomdomain.com
```
