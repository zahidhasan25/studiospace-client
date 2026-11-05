# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

**Live Website:** https://studiospace-client-rosy.vercel.app

**Server Repository:** https://github.com/zahidhasan25/studiospace-server

**Server API (Live):** https://studiospace-server-psi.vercel.app

StudioSpace is a peer-to-peer marketplace where creators discover, book, and host photography studios, film stages, podcast lounges, music suites, and art workshops — by the hour, from verified hosts, with clear pricing and no surprises.

---

## ✨ Features

### Discover Studios
- Search studios by keyword and filter by category
- Browse featured studios fetched live from MongoDB via the Express API
- Studio details with gallery slider, amenities, pricing, and host information

### Full Studio CRUD
- Authenticated hosts can add, view, update, and delete their own listings
- Custom confirmation modal for deletes (no default browser alerts)
- Image URL support, with optional direct upload via imgbb

### Booking System
- Date and time booking modal with automatic hour and price calculation
- Booking status: **Pending** → **Confirmed** / **Cancelled**
- Double-booking prevention — overlapping bookings for the same studio and date are rejected
- Hosts can confirm bookings made on their studios
- **PDF invoice download** (jsPDF) for confirmed bookings

### Authentication
- Email / password login and registration with password validation
- Google login via the server (OAuth 2.0)
- JWT stored in an HTTP-only cookie by the server
- Private routes stay logged in after a page reload

### Wishlist
- Logged-in users can save studios with the heart icon on any studio card
- Saved studios are managed on the Wishlist page

### Theme Customization
- One-click light / dark theme toggle in the navbar
- Theme preference persists in `localStorage` across reloads

### Polished UX
- Sonner toasts for every auth, CRUD, and booking action
- Skeleton loaders, friendly empty states, and a custom 404 page
- Responsive layout for mobile, tablet, and desktop

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 (App Router, JavaScript), React 18 |
| Styling | Plain CSS in `app/globals.css` (light / dark theme via `data-theme`) |
| UI Libraries | Swiper (hero & gallery sliders), Sonner (toasts), jsPDF (invoices) |
| Backend | Express.js + MongoDB (separate repository) |
| Auth | Email / password (bcrypt + JWT), Google OAuth 2.0 |
| Deployment | Vercel (client + server) |

> All data calls use `credentials: "include"`, so the server's HTTP-only JWT cookie is sent with every request.

---

## 🚀 Local Setup

### 1. Clone this repository and install dependencies

```bash
git clone https://github.com/zahidhasan25/studiospace-client.git
cd studiospace-client
npm install
```

### 2. Configure the environment

```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` to your server URL (default: `http://localhost:5000`).

Optionally, set `NEXT_PUBLIC_IMGBB_KEY` to enable direct image uploads; otherwise, paste an image URL in the studio form.

### 3. Make sure the StudioSpace server is running, then start the client

```bash
npm run dev
```

Open http://localhost:3000.

### Production build

```bash
npm run build
npm start
```

---

## 🔑 Test the App

No test credentials are needed. To test the live site, simply register a new account from the **Register** page, or sign in with **Continue with Google** on the **Login** page. Once logged in, you can add a studio, book a studio, save to your wishlist, and download a PDF invoice for a confirmed booking.

---

## 🧭 Routes

| Route | Description |
| --- | --- |
| `/` | Home |
| `/studios` | Explore studios |
| `/studios/[id]` | Studio details |
| `/studios/edit/[id]` | Edit studio (private) |
| `/login` | Login |
| `/register` | Register |
| `/add-studio` | Add a studio (private) |
| `/my-listings` | My studio listings (private) |
| `/my-bookings` | My bookings (private) |
| `/wishlist` | Wishlist (private) |
| `/dashboard` | Dashboard (private) |

---

## 📝 Notes

- Google login ("Continue with Google") is implemented in the client and server and verified working on the live site.
- The server repository contains the matching API, authentication, booking, and seeding code.
