# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

**Live Website:** https://studiospace-client.vercel.app *(placeholder — replace with the deployed URL)*

StudioSpace is a peer-to-peer marketplace where creators discover, book and host photography studios, film stages, podcast lounges, music suites and art workshops.

## Features

- **Discover studios:** Search, filter by category and browse featured studios fetched live from MongoDB via the Express API.
- **Full studio CRUD:** Authenticated hosts can add, view, update and delete their own listings, with a custom confirmation modal for deletes.
- **Booking system:** Date and time booking modal with automatic hour and price calculation, Pending status, cancellation for pending bookings, and PDF invoice download for confirmed bookings.
- **Authentication:** BetterAuth (MongoDB adapter) email/password login and registration with password validation, Google login via BetterAuth social provider, and a session stored in an HTTPOnly cookie (`better-auth.session_token`) by the server.
- **Wishlist:** Logged-in users can save studios with the heart icon on any studio card and manage them on the wishlist page.
- **Theme customization:** One-click light/dark theme toggle in the navbar, persisted in localStorage across reloads.
- **Polished UX:** Sonner toasts for every auth, CRUD and booking action, skeleton loaders, friendly empty states, a custom 404 page, and a responsive layout for mobile, tablet and desktop.

## Tech Stack

- Next.js 14 (App Router, JavaScript), React 18
- Plain CSS in `app/globals.css` (light/dark theme via `data-theme`)
- Swiper for hero and gallery sliders, Sonner for toasts, jsPDF for booking invoices
- Express.js + MongoDB backend with BetterAuth (separate repository) — all data calls use `credentials: "include"` so the server's HTTPOnly BetterAuth session cookie is sent. Google callback is `<SERVER_URL>/api/auth/callback/google` (update it in Google Cloud Console; the old `/api/auth/google/callback` no longer works).

## Local Setup

1. Clone this repository and install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and point it at your server:
   ```bash
   cp .env.example .env.local
   ```
   Set `NEXT_PUBLIC_API_URL` to your server URL (default `http://localhost:5000`). Optionally set `NEXT_PUBLIC_IMGBB_KEY` to enable direct image uploads; otherwise paste an image URL in the studio form.
3. Make sure the StudioSpace server is running, then start the client:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.
4. For a production build:
   ```bash
   npm run build
   npm start
   ```

## Examiner Test Credentials

- Email: `examiner@studiospace.test`
- Password: `Examiner123`

Note: these credentials are created on server startup through BetterAuth's sign-up API (see the server README). If the account does not exist yet, register a new account from the Register page, or use Google login.

## Routes

- `/` Home · `/studios` Explore · `/studios/[id]` Details · `/studios/edit/[id]` Edit (private)
- `/login` · `/register` · `/add-studio` (private) · `/my-listings` (private)
- `/my-bookings` (private) · `/wishlist` (private) · `/dashboard` (private)
