StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform
Live Website: https://studiospace-client-rosy.vercel.app
StudioSpace is a peer-to-peer marketplace where creators discover, book and host photography studios, film stages, podcast lounges, music suites and art workshops.
Features
Discover studios: Search, filter by category and browse featured studios fetched live from MongoDB via the Express API.
Full studio CRUD: Authenticated hosts can add, view, update and delete their own listings, with a custom confirmation modal for deletes.
Booking system: Date and time booking modal with automatic hour and price calculation, Pending status, cancellation for pending bookings, and PDF invoice download for confirmed bookings.
Authentication: Email/password login and registration with password validation, Google login via the server, and JWT stored in an HTTPOnly cookie by the server.
Wishlist: Logged-in users can save studios with the heart icon on any studio card and manage them on the wishlist page.
Theme customization: One-click light/dark theme toggle in the navbar, persisted in localStorage across reloads.
Polished UX: Sonner toasts for every auth, CRUD and booking action, skeleton loaders, friendly empty states, a custom 404 page, and a responsive layout for mobile, tablet and desktop.
Tech Stack
Next.js 14 (App Router, JavaScript), React 18
Plain CSS in app/globals.css (light/dark theme via data-theme)
Swiper for hero and gallery sliders, Sonner for toasts, jsPDF for booking invoices
Express.js + MongoDB backend (separate repository) — all data calls use credentials: "include" so the server's HTTPOnly JWT cookie is sent
Local Setup
Clone this repository and install dependencies:
   npm install
Copy the environment template and point it at your server:
   cp .env.example .env.local
   Set NEXT_PUBLIC_API_URL to your server URL (default http://localhost:5000). Optionally set NEXT_PUBLIC_IMGBB_KEY to enable direct image uploads; otherwise paste an image URL in the studio form.
Make sure the StudioSpace server is running, then start the client:
   npm run dev
   Open http://localhost:3000.
For a production build:
   npm run build
   npm start
Examiner Test Credentials
Email: i.zahid.hasan25@gmail.com
Password: Zahid123
Note: these credentials must exist in the server database (seeded by the server team). If the account does not exist yet, register a new account from the Register page, or use Google login.
Routes
/ Home · /studios Explore · /studios/[id] Details · /studios/edit/[id] Edit (private)
/login · /register · /add-studio (private) · /my-listings (private)
/my-bookings (private) · /wishlist (private) · /dashboard (private)