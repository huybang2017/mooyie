# 🧱 Mooyie - Movie Ticket Booking Project Template

Mooyie is a modern, full-stack web application for booking movie tickets online. It features real-time seat selection, instant notifications, and a powerful admin dashboard. Mooyie is designed for speed, scalability, and developer experience.

---

## Giai đoạn 1: **Preparation & Analysis**

### 1. Requirements Analysis

- **Project Goal:**
  Build a robust, real-time movie ticket booking platform for cinemas, supporting both end-users and administrators.
- **Key Features:**
  - User registration, login, and profile management
  - Browse, search, and filter movies (now showing, coming soon)
  - Book tickets with real-time seat selection and instant booking confirmation
  - Notification bell for new movies, showtimes, and ticket status (real-time, via WebSocket)
  - Admin dashboard: manage movies, showtimes, theaters, bookings, users, and comments
  - Responsive UI (React + Vite) for all devices
  - SEO-friendly and fast static frontend
  - Automated CI/CD deployment pipeline

### 2. Tech Stack Selection

| Component    | Technology                                           |
| ------------ | ---------------------------------------------------- |
| Backend API  | NestJS (TypeScript)                                  |
| ORM/Database | Prisma ORM + PostgreSQL                              |
| Real-time    | Socket.io                                            |
| Frontend     | React (Vite, TypeScript, Redux)                      |
| Styling      | CSS Modules / Tailwind (optional)                    |
| Hosting      | Render.com (Backend & DB), Vercel/Netlify (Frontend) |
| Content      | Dynamic (API-driven)                                 |
| CI/CD        | GitHub Actions + Render/Vercel                       |

### 3. Project Initialization

- Clone the repository:
```bash
  git clone https://github.com/huybang2017/mooyie.git
cd mooyie
  ```
- Directory structure:
  ```
  /back-end   # NestJS API (backend server)
  /front-end  # React client (frontend web app)
  ```
- Setup environment variables for both backend and frontend (see `.env.example` in each folder).

---

## Giai đoạn 2: **Theme & Branding Design**

### 4. Brand Identity

- **Logo:** `public/logo.png` (customizable)
- **Color Palette:**
  - `--color-bg: #18181b` (background)
  - `--color-primary: #e11d48` (main accent)
  - `--color-accent: #fbbf24` (highlight)
  - `--color-text: #f3f4f6` (text)
  - See the [Color Palette](#-color-palette) section below for full details and theming.

### 5. Style Guide

- CSS variables in `front-end/src/index.css` for easy theming
- Reusable components for logo, headings, buttons, notification bell, etc.
- Fully responsive for mobile & desktop

---

## Giai đoạn 3: **Content Development**

### 6. Content Structure

- Dynamic content via API:
  - Movies, showtimes, theaters, bookings, notifications, users
- Admins can create/update content via the dashboard

### 7. Collections & Filtering

- Movie filtering by status (now showing, coming soon), genre, and search
- Bookings filtered by user and status
- Notifications filtered by user and read/unread status

### 8. SEO Metadata

- Dynamic meta tags per page (React Helmet or Vite plugin)
- OpenGraph/Twitter Card support for movie pages

---

## Giai đoạn 4: **UI/UX Optimization**

### 9. Homepage Design

- Hero banner with featured movies
- "Now Showing" and "Coming Soon" sections
- Call-to-action buttons for booking

### 10. Movie Listing Page

- Grid layout, pagination, filter by genre/status
- Search bar for quick access

### 11. Movie Detail & Booking

- Detailed movie info, showtimes, seat selection
- Booking form with real-time seat updates
- Related movies section

---

## Main Pages Overview

A summary of all main pages/screens in Mooyie, their purpose, and key features:

| Page                 | Purpose & Features                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| **Home**             | Landing page. Shows hero banner, featured movies, "Now Showing" and "Coming Soon" sections.         |
| **Movies**           | Browse/search/filter all movies. Grid layout, genre/status filters, pagination, search bar.         |
| **Movie Detail**     | Detailed info for a movie: description, cast, showtimes, trailer, poster, related movies.           |
| **Booking**          | Seat selection (real-time), booking form, instant confirmation, ticket summary.                     |
| **Bookings**         | User's booking history: list, status, details, cancel/refund (if allowed).                          |
| **Login/Register**   | User authentication: login, register, forgot password.                                              |
| **Profile**          | View/edit user info, change password, see personal activity.                                        |
| **Notifications**    | Bell icon in header. Shows real-time and historical notifications (new movies, showtimes, tickets). |
| **Admin Dashboard**  | Admin-only. Manage movies, showtimes, theaters, users, bookings, comments. Analytics overview.      |
| **Admin: Movies**    | CRUD for movies: add, edit, delete, manage posters/trailers, set status (now showing/coming soon).  |
| **Admin: Showtimes** | CRUD for showtimes: schedule, assign to theaters, manage seat maps.                                 |
| **Admin: Theaters**  | Manage theater info, seating layouts, availability.                                                 |
| **Admin: Users**     | View/search users, manage roles, ban/unban, reset passwords.                                        |
| **Admin: Bookings**  | View/search all bookings, manage status, handle issues.                                             |
| **Admin: Comments**  | Moderate user comments, delete/report abuse.                                                        |
| **Error/Not Found**  | Friendly 404 and error pages.                                                                       |

Each page is designed for clarity, speed, and a seamless user experience, with real-time updates where relevant.

---

## Giai đoạn 5: **Performance & SEO Optimization**

### 12. Images

- Use WebP where possible for performance
- Lazy loading for posters and images
- Alt text for all images for accessibility

### 13. Technical SEO

- Meta tags in layout
- Sitemap.xml generation (frontend)
- Structured Data (JSON-LD for movies)
- OpenGraph/Twitter Cards for social sharing

### 14. Performance Tuning

- CSS/JS minification (Vite)
- Inlining critical CSS
- Service Worker (optional, for offline support)

---

## Giai đoạn 6: **Deployment & Maintenance**

### 15. Deployment

- **Backend:**
  - Deploy on Render.com (Dockerfile buildpack)
  - Set environment variables in Render dashboard
  - Using aiven PostgreSQL for database
- **Frontend:**
  - Deploy on Vercel/Netlify (build: `npm run build`, publish: `dist`)
  - Set `VITE_API_URL` to backend endpoint
- **Database:**
  - PostgreSQL on Render (use Internal Database URL)

### 16. CI/CD Setup

- GitHub Actions for auto build & deploy
- Preview URLs for PRs (Vercel)

### 17. Documentation

- `README.md` includes:
  - Project introduction & features
  - Tech stack
  - Local setup guide
  - Deployment instructions
  - How to add new movies/showtimes
  - API docs: `/api/swagger` (backend)

---

## 🎨 Color Palette

| Token/Variable                 | Light Mode Example           | Dark Mode Example            | Description                        |
| ------------------------------ | ---------------------------- | ---------------------------- | ---------------------------------- |
| `--color-bg` / `--background`  | `oklch(1 0 0)`               | `oklch(0.141 0.005 285.823)` | Main background color              |
| `--color-foreground`           | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)`           | Main text color                    |
| `--color-card`                 | `oklch(1 0 0)`               | `oklch(0.21 0.006 285.885)`  | Card background                    |
| `--color-card-foreground`      | `oklch(0.141 0.005 285.823)` | `oklch(0.985 0 0)`           | Card text                          |
| `--color-primary`              | `oklch(0.723 0.219 149.579)` | `oklch(0.696 0.17 162.48)`   | Primary brand color (buttons, etc) |
| `--color-primary-foreground`   | `oklch(0.982 0.018 155.826)` | `oklch(0.393 0.095 152.535)` | Text on primary                    |
| `--color-secondary`            | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` | Secondary UI elements              |
| `--color-secondary-foreground` | `oklch(0.21 0.006 285.885)`  | `oklch(0.985 0 0)`           | Text on secondary                  |
| `--color-accent`               | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` | Accent color                       |
| `--color-accent-foreground`    | `oklch(0.21 0.006 285.885)`  | `oklch(0.985 0 0)`           | Text on accent                     |
| `--color-muted`                | `oklch(0.967 0.001 286.375)` | `oklch(0.274 0.006 286.033)` | Muted backgrounds                  |
| `--color-muted-foreground`     | `oklch(0.552 0.016 285.938)` | `oklch(0.705 0.015 286.067)` | Muted text                         |
| `--color-destructive`          | `oklch(0.577 0.245 27.325)`  | `oklch(0.704 0.191 22.216)`  | Error/destructive actions          |
| `--color-border`               | `oklch(0.92 0.004 286.32)`   | `oklch(1 0 0 / 10%)`         | Borders                            |
| `--color-input`                | `oklch(0.92 0.004 286.32)`   | `oklch(1 0 0 / 15%)`         | Input backgrounds                  |
| `--color-ring`                 | `oklch(0.723 0.219 149.579)` | `oklch(0.527 0.154 150.069)` | Focus ring                         |
| ...                            | ...                          | ...                          | ...                                |

- All colors use the [OKLCH color space](https://oklch.com/) for better accessibility and perceptual uniformity.
- The palette is fully themeable: switch between light/dark by toggling the `.dark` class on `<html>` or `<body>`.
- You can override or extend these variables in your own CSS for custom branding.

**Usage Example in CSS:**

```css
.button-primary {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border-radius: var(--radius-md);
}
```

---

## 📦 Project Outcomes

| Item                         | Status |
| ---------------------------- | ------ |
| Real-time movie booking      | ✅     |
| Responsive, SEO-optimized UI | ✅     |
| Admin dashboard              | ✅     |
| Real-time notifications      | ✅     |
| CI/CD auto deployment        | ✅     |
| Custom branding              | ✅     |

- **GitHub:** [github.com/huybang2017/mooyie](https://github.com/huybang2017/mooyie)
- **Live Demo:** _[https://mooyie.vercel.app]_

---

Mooyie is a great starting point for any modern full-stack web project. Fork, adapt, and build your own platform!
