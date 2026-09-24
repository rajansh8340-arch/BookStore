# 📚 BookStore — Discover, Read & Rate Books

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%7C%20Memory-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel Deployed](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, full-stack MERN application crafted for avid readers, book clubs, and literature enthusiasts. Browse curated literary classics, read authentic dual-page opening excerpts with text-to-speech voice narration, submit star ratings and community reviews, and manage your personal book catalog.

---

## 🌐 Live Deployments

- **Live Web Application (Frontend):**  
  👉 **[https://book-store-4x3z.vercel.app/](https://book-store-4x3z.vercel.app/)**
- **Production REST API (Backend):**  
  👉 **[https://book-store-one-delta.vercel.app/](https://book-store-one-delta.vercel.app/)**

---

## ✨ Key Features

### 📖 1. Immersive 2-Page Book Reader
- **Authentic Dual-Page Spread:** Modeled after classic physical hardcover books with a realistic center binding crease, gold-foil header stamps, page numbers, and decorative drop-caps.
- **4 Custom Reading Themes:**
  - 📜 **Parchment:** Warm antique paper with rich dark brown ink.
  - ☕ **Sepia:** Gentle coffee-toned palette optimal for evening reading.
  - ☀️ **Clean Modern:** Crisp slate and paper-white design for daylight focus.
  - 🌙 **Midnight Dark:** OLED-friendly deep charcoal background with soft amber text.
- **Adjustable Typography:** On-the-fly font size scaling (`A-` / `A+`) using literary typefaces (*EB Garamond* and *Playfair Display*).
- **Audio Voice Narration (Text-to-Speech):** Integrated browser Web Speech API synthesizes high-quality audio narration for both pages with play, pause, resume, and restart controls.

### ⭐ 2. Interactive Star Rating & Community Reviews
- **Dynamic Star Rating Picker:** Hover-interactive 1-to-5 star rating selector with live sentiment labels (*Poor*, *Fair*, *Good*, *Very Good*, *Masterpiece!*).
- **Weighted Average Calculation:** Automatically updates book average ratings and review counts on every submission.
- **Community Review Feed:** Displays chronological reader reviews, star badges, reviewer names, and personal reflections on each book's detail page.
- **Rating Filtering:** Quickly filter catalog items by rating thresholds (All, 4.0+ Stars, 4.5+ Stars, 4.8+ Top Rated).

### 🔍 3. Discovery, Catalog & Statistics Dashboard
- **Library Overview Banner:** Real-time metrics tracking total books, average library score, total verified reviews, and active literary genres.
- **Interactive Genre Pills:** Instant single-click filtering across genres like *Classic Fiction*, *Dystopian*, *Romance*, *Adventure*, *Coming-of-Age*, and *Historical*.
- **Live Search & Sorting:** Real-time search across titles, authors, and genres, combined with multi-criteria sorting (Highest Rated, Most Reviews, Title A–Z, Year Published).
- **Dual Presentation Views:** Toggle between visual card grid view with book cover themes and structured tabular view.

### 🛡️ 4. Zero-Downtime Serverless Database Architecture
- **Resilient Fallback Engine:** Features non-blocking Mongoose buffering (`bufferCommands: false`) and an in-memory data store with preloaded classic titles. If MongoDB Atlas experiences connection downtime or cold-start lag, the API responds in **<25ms** without throwing 500 errors.
- **CORS Configured for Vercel:** Automated cross-origin resource sharing supporting production Vercel domains, preview branches, and local development environments.

### 🔐 5. User Authentication & Book Management
- **JWT Authentication:** Secure user registration (`/user/signup`) and login (`/user/login`) with encrypted password hashing (`bcrypt`).
- **Complete CRUD Operations:** Add new books with custom cover gradient themes, edit book metadata and sample opening paragraphs, or remove books with confirmation protection.

---

## 🏗️ Architecture & Tech Stack

- **Frontend:** [React 18](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [React Icons](https://react-icons.github.io/react-icons/), [Axios](https://axios-http.com/), [Notistack](https://notistack.com/)
- **Backend:** [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) + In-Memory Store, [JWT](https://jwt.io/), [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Deployment:** [Vercel](https://vercel.com/) (Frontend SPA rewrites + Serverless Node.js backend)

---

## 🚀 Getting Started (Local Development)

### Quick Start via Root Scripts

From the repository root:

```bash
# Run frontend dev server
npm run frontend

# Run backend dev server
npm run backend

# Build production frontend bundle
npm run build
```

---

## 📡 API Reference

Base URL: `https://book-store-one-delta.vercel.app` (or `http://localhost:5555` locally)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/books` | Retrieve all books (with ratings, count, and sample pages) | No |
| `GET` | `/books/:id` | Get details and reviews for a single book | No |
| `POST` | `/books` | Create a new book | No (or Optional Auth) |
| `PUT` | `/books/:id` | Update an existing book's details or sample pages | No (or Optional Auth) |
| `DELETE` | `/books/:id` | Delete a book by ID | No (or Optional Auth) |
| `POST` | `/books/:id/rate` | Submit a 1–5 star rating and review | No |
| `POST` | `/user/signup` | Register a new user account | No |
| `POST` | `/user/login` | Authenticate user and receive JWT token | No |

---

## 📄 License

This project is licensed under the **MIT License**.
