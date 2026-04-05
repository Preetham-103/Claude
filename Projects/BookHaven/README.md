# BookHaven — Book Store Management System

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

A full-stack online bookstore built with a **microservices architecture** — 8 independent Spring Boot services behind an API Gateway, paired with a React frontend.

---

## Architecture Overview

```
Browser (React + Vite — port 5173)
        │
        ▼
API Gateway (Spring Cloud Gateway — port 8000)
JWT Auth · CORS · Route forwarding
        │
        ├──▶ BookService      (port 8001) — book catalog, authors, categories
        ├──▶ InventoryService (port 8002) — stock management
        ├──▶ CartModule       (port 8003) — shopping cart
        ├──▶ PaymentService   (port 8004) — payment processing
        ├──▶ UserService      (port 8006) — auth, profiles
        ├──▶ ReviewService    (port 8007) — book reviews & ratings
        ├──▶ OrderService     (port 8008) — order lifecycle
        └──▶ EurekaServer     (port 8761) — service registry & discovery
```

All services register with **Eureka** for dynamic discovery. Inter-service calls use **Feign clients**. Each service owns its own MySQL database.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, Bootstrap 5.3, styled-components, react-toastify |
| Backend | Java 17/21, Spring Boot 3.5.0, Spring Cloud 2025.0.0 |
| Gateway | Spring Cloud Gateway, JWT (`86400s` expiry) |
| Database | MySQL 8 — one schema per service |
| Service Discovery | Netflix Eureka |
| HTTP Client | Feign (declarative REST between services) |
| API Docs | SpringDoc OpenAPI (Swagger UI per service) |
| Build | Maven 3.x (backend), npm (frontend) |

---

## Project Structure

```
Book-store-managment-system/
├── BookService/            book catalog (CRUD, authors, categories)
├── InventoryService/       stock levels, increment/decrement
├── CartModule/             per-user cart with quantity management
├── PaymentService/         payment initiation and status updates
├── UserService/            registration, login, profile management
├── ReviewService/          book reviews and star ratings
├── OrderService/           order creation and lifecycle tracking
├── GateWay/                API Gateway — JWT auth, routing, CORS
├── eurekaserver/           Eureka service registry dashboard
└── Book-Store-Management-Frontend/   React SPA
    └── src/
        ├── pages/
        │   ├── user/       Home, BookCatalog, BookDetails, Cart, Payment, Invoice, Profile
        │   └── admin/      Dashboard, Books, Orders, Customers, Analytics
        ├── components/     Navbar, AdminNavbar, AdminSidebar, Footer
        ├── services/       axios instance + per-domain service files
        ├── routes/         role-based route guards (AdminRoute, UserRoute)
        └── layout/         Main (user shell), AdminLayout (admin shell)
```

---

## Database Map

| Service | MySQL Database | Port |
|---------|---------------|------|
| BookService | `bookservice` | 8001 |
| InventoryService | `learning` | 8002 |
| CartModule | `CartModule` | 8003 |
| PaymentService | `book_payment` | 8004 |
| UserService | `userservice` | 8006 |
| ReviewService | `reviewdb` | 8007 |
| OrderService | `orderservice` | 8008 |

Default credentials: `root` / `root`. Tables are auto-created (`ddl-auto=update`).

---

## Running Locally

### Prerequisites
- Java 17+, Maven 3.x
- Node.js 18+, npm
- MySQL 8 running on `localhost:3306`

### Start order matters — Eureka must come first

```bash
# 1. Service Registry
cd eurekaserver && mvn spring-boot:run

# 2. Core services (run in separate terminals)
cd BookService      && mvn spring-boot:run   # :8001
cd InventoryService && mvn spring-boot:run   # :8002
cd CartModule       && mvn spring-boot:run   # :8003
cd PaymentService   && mvn spring-boot:run   # :8004
cd UserService      && mvn spring-boot:run   # :8006
cd ReviewService    && mvn spring-boot:run   # :8007
cd OrderService     && mvn spring-boot:run   # :8008

# 3. API Gateway (last)
cd GateWay && mvn spring-boot:run            # :8000

# 4. Frontend
cd Book-Store-Management-Frontend
npm install
npm run dev                                  # :5173
```

### Useful URLs
| URL | Description |
|-----|-------------|
| `http://localhost:5173` | React frontend |
| `http://localhost:8761` | Eureka dashboard |
| `http://localhost:8000/swagger-ui.html` | Aggregated Swagger UI |
| `http://localhost:800X/swagger-ui.html` | Per-service Swagger |

### Run tests
```bash
# All tests in a service
cd BookService && mvn test

# Single test class
mvn test -Dtest=BookApplicationTests
```

---

## Code Flow (Frontend)

```
main.jsx
  └─▶ App.jsx  (pure route map, no logic)
        ├─▶ /login, /register  →  Login.jsx / Register.jsx
        │     └─ POST /auth/login → saves token + user + role to localStorage
        │
        ├─▶ /  (Main layout)
        │     ├─ Navbar  — reads localStorage, subscribes to cartUpdated + profileUpdated events
        │     ├─ <Outlet>  →  Home, BookCatalog, BookDetails, ShoppingCart, Payment, Invoice, Profile
        │     └─ Footer
        │
        └─▶ /admin  (AdminRoute guard — checks localStorage role === "ADMIN")
              └─ AdminLayout  →  AdminSidebar + AdminNavbar + <Outlet>
                    └─ Dashboard, Books, Orders, Customers, Analytics

All API calls → services/api.js (axios instance → http://localhost:8000)
  Request interceptor: attaches Bearer token from localStorage
  Response interceptor: on 401 → clears localStorage → redirects to /login
```

---

## UI/UX Improvements Made

> All changes were applied to the frontend during a focused improvement session.

### Foundation Fixes
- Removed a production debug `border: 2px solid red` leaking into the Home page
- Fixed the Write Review modal — was hardcoded to `top: 25%; left: 27%`, breaking on all screen sizes; replaced with a proper fullscreen centered overlay with fade-in + slide-up animation
- Fixed Analytics admin page forcing horizontal scroll on tablets (`min-width: 700px` inside a mobile media query)
- Fixed invalid CSS `align-items: right` and `justify-content: right` in AdminNavbar
- Removed a duplicate malformed `.shadow-card` block in `StyledWrapper` that was silently breaking card styles

### Color & Contrast
- Review action buttons were failing WCAG AA contrast (ratio ~2:1) — bumped text from `#888` to `#c0c0c0` (~5.3:1)
- Replaced jarring neon `#aaffaa` stock/active badges with soft emerald `#6ee7b7`
- Unified footer hover accent (`#0d6efd` Bootstrap blue → `#667eea` to match navbar)
- `View Book` button on Home cards: pure black → dark slate with purple accent on hover
- Modal inputs in BookDetails: added visible `#667eea` focus ring (was nearly invisible)
- Admin sidebar active item: now distinct from hover state with a blue left border + lighter text

### Component Polish
- **Shimmer skeleton** loading cards on Home page (Trending & Featured sections) — animated gradient while API fetches
- **CSS spinner** on BookDetails loading state — replaced plain grey text
- **Consistent `admin-section-heading`** style (blue left-border) applied across Dashboard, Books, Orders, Customers — mirrors the cyan heading pattern on the user side
- Payment form focus ring changed from Bootstrap's default blue to the site's `#667eea` accent

### Page Completions
- **Invoice page** — was only 23 lines of CSS; added dark background, subtle accent glow on the white receipt card, and a functional back-button style (the class was borrowed from an unimported file)
- **ShoppingCart** — had zero custom CSS; created `ShoppingCart.css` with a contained summary box, a proper purple accent checkout button (replacing `#dee8f1` inline style), empty-state styles, and a styled back button
- **Customers admin** placeholder thumbnail: `#f0f0f0` white square on dark table rows → `#2d3134` dark tile

### Static Book Fallbacks
When the database is disconnected, both **Home** and **Book Catalog** pages show curated static content instead of empty sections:

- **Home → Trending Books:** Jujutsu Kaisen, Spy × Family, Solo Leveling, Blue Lock, Chainsaw Man
- **Home → Featured Books:** Demon Slayer, Attack on Titan, My Hero Academia, One Piece, Naruto
- **Book Catalog:** 20 books across Fantasy, Sci-Fi, Classics, Thriller, and Fiction — cover images served from Open Library's public CDN (no API key required)

Real data automatically replaces static content once the backend is running.

---

## Features

### User
- Browse books by category, author, and price range
- Full-text title search
- Book detail page with ratings and reviews
- Add to cart, adjust quantities, remove items
- Checkout flow → payment → downloadable PDF invoice
- User profile with order history and account settings

### Admin
- Book management — add, update, delete, manage stock
- Order management with status progression
- Customer management
- Revenue and sales analytics with chart exports (CSV)

---

## Authors

**Bhavya Dundigalla / Preetham Dundigalla**

---

*Built with Spring Boot microservices + React. Claude Code was used for code exploration, UI/UX analysis, and frontend improvements during development.*
