# College Passout Digital Slam Book

A full-stack alumni/passout slam book app for college students with a public submission form, gallery, admin dashboard, local image uploads, JWT login, likes, PDF export, and Firebase Firestore database.

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
  server/                 Express + Firebase Firestore backend
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

3. Create a Firebase project and add the Firebase Admin SDK credentials to `server/.env`.

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

## Firebase Firestore Setup

1. Go to `https://console.firebase.google.com`.
2. Click `Add project`.
3. Create a project, for example `vsbm-digital-slam-book`.
4. In the left menu, open `Build > Firestore Database`.
5. Click `Create database`.
6. Choose `Start in production mode`.
7. Choose a nearby region and create the database.
8. Go to `Project settings > Service accounts`.
9. Click `Generate new private key`.
10. Download the JSON file and keep it private.

From that JSON file, copy these values into Render or `server/.env`:

```text
project_id      -> FIREBASE_PROJECT_ID
client_email    -> FIREBASE_CLIENT_EMAIL
private_key     -> FIREBASE_PRIVATE_KEY
```

Important: never commit the downloaded Firebase JSON key file to GitHub.

## Deploy Frontend on Netlify

Netlify should deploy the React frontend. The Express + Firebase Admin backend needs a Node host such as Render, Railway, Fly.io, or a VPS.

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
CLIENT_URL=https://your-netlify-site.netlify.app
JWT_SECRET=a_long_random_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_strong_password
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n
```

If you use a custom domain and a Netlify preview URL, you can allow multiple frontend origins:

```text
CLIENT_URL=https://your-netlify-site.netlify.app,https://yourcustomdomain.com
```
