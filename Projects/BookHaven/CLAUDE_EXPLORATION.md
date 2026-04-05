# Exploring Claude Code — A Hands-On Session

> **Project used as learning medium:** BookHaven — a full-stack book store management system (Spring Boot microservices + React frontend)

This document captures everything I explored with **Claude Code** in a single session, using a real-world codebase as the sandbox. The goal wasn't just to fix the project — it was to understand what Claude Code is capable of.

---

## What is Claude Code?

Claude Code is Anthropic's AI coding assistant that runs in your terminal and IDE. Unlike a chat interface, it has direct access to your filesystem, can read/write/edit files, run terminal commands, search code, and execute multi-step tasks autonomously. It understands your entire codebase — not just the file you paste in.

---

## 1. `/init` — Letting Claude Understand the Codebase

The very first thing I tried was the `/init` command. Claude Code:

- Crawled every service directory (`BookService`, `CartModule`, `GateWay`, `eurekaserver`, etc.)
- Read all `pom.xml` files, `application.properties`, main classes, controllers, and Feign clients
- Figured out the startup order (Eureka → services → Gateway → Frontend) by reading config
- Mapped inter-service dependencies just from `@FeignClient` annotations
- Generated a `CLAUDE.md` file at the repo root

The `CLAUDE.md` file is a persistent context file — every future Claude Code session in this repo reads it first, so Claude never starts from scratch. It contained build commands, startup order, database mapping, port numbers, and the code structure.

**Takeaway:** `/init` is the right first step in any new codebase. It's not just documentation — it's Claude's long-term memory for the project.

---

## 2. Code Flow Explanation — Reading Across Multiple Files

I asked Claude to explain the frontend code flow starting from `main.jsx`.

Instead of summarizing one file, Claude:
- Traced the entire execution path: `main.jsx` → `App.jsx` → layouts → route guards → pages
- Read `RoleRoutes.jsx`, `Main.jsx`, `AdminLayout.jsx`, `Login.jsx`, `Navbar.jsx`, and `api.js` in parallel
- Explained the `localStorage`-based auth pattern and *why* it was done that way
- Identified the custom `EventEmitter` pub/sub pattern used for real-time cart badge and profile image updates
- Drew the full data flow from user action → service function → axios → API Gateway → microservice → MySQL → back up

**Takeaway:** Claude doesn't just read one file — it builds a mental model of the system by reading across files simultaneously. The explanations are architectural, not just line-by-line.

---

## 3. Screenshot Debugging — UI Issues from an Image

I shared a screenshot of the live app showing empty "Trending Books" and "Featured Books" sections on the Home page. No code was pasted.

Claude:
- Identified the root cause: API calls failing because the database wasn't running
- Looked at `Home.jsx` to understand the state management (`useState`, `useEffect`)
- Added a static fallback array (`STATIC_TRENDING`, `STATIC_FEATURED`) with 5 books each
- Used manga titles matching the aesthetic already established in the carousel
- Made the fallback smart: real API data replaces static content automatically when the DB reconnects
- Used only the **local asset images already in the project** — no external URLs needed

**Takeaway:** Claude Code understands visual context from screenshots and maps it back to the actual code. It also respects existing project conventions (local assets, component patterns) rather than introducing new dependencies.

---

## 4. Memory System — Saving Preferences Across Sessions

During the session I told Claude: *"Use comments sparingly. Only comment complex code."*

Claude immediately:
- Created a memory file at `~/.claude/projects/.../memory/feedback_comments.md`
- Stored the rule, the reason, and when to apply it
- Updated `MEMORY.md` (the memory index) so future sessions load this preference automatically

The memory system has 4 types: `user` (who you are), `feedback` (how to work), `project` (current goals), and `reference` (where to find things).

**Takeaway:** Claude Code has persistent memory across sessions. You only need to state preferences once — they survive context resets, new sessions, and even weeks later.

---

## 5. Plan Mode — Designing Before Executing

When I asked *"What UI/UX enhancements can we make?"*, Claude entered **Plan Mode** automatically.

What happened in Plan Mode:
1. **Two Explore agents ran in parallel** — one scanned every user-facing CSS file, the other scanned every admin CSS file and JSX component. Both ran simultaneously, not sequentially.
2. **A Plan agent** took the findings and designed a prioritized implementation plan
3. Claude presented the plan for approval **before writing a single line of code**
4. Once I approved, it exited Plan Mode and implemented everything

The plan was organized into 4 groups:
- Group 1: Foundation fixes (bugs that break things)
- Group 2: Color & contrast improvements
- Group 3: Component polish (loaders, animations)
- Group 4: Page completions (pages with missing CSS)

**Takeaway:** For non-trivial tasks, Claude uses Plan Mode to research first and propose before acting. You stay in control of what gets changed. The parallel agent execution means it gathers information much faster than a sequential approach.

---

## 6. Multi-File Editing — Implementing the UI Overhaul

After plan approval, Claude made changes across **16 files in one session**:

| What changed | Files |
|---|---|
| Removed debug red border visible in production | `Home.css` |
| Fixed modal that was hardcoded off-center on mobile | `BookDetails.css` |
| Fixed chart overflow forcing horizontal scroll on tablets | `Analytics.css` |
| Fixed invalid CSS crashing admin navbar layout | `AdminNavbar.css` |
| Removed duplicate broken CSS block | `StyledWtapper.jsx` |
| Fixed WCAG contrast failure on review buttons | `ReviewCard.css` |
| Softened neon badge colors | `Book.css`, `Customers.css` |
| Unified accent color in footer to match navbar | `Footer.css` |
| Added visible active state to admin sidebar | `AdminSidebar.css` |
| Added shimmer skeleton loader to Home sections | `Home.css` + `Home.jsx` |
| Added CSS spinner to BookDetails loading state | `BookDetails.css` |
| Added consistent section heading style across admin pages | `Dashboard.css`, `Orders.css`, `Book.css`, `Customers.css` |
| Fixed payment form focus ring color | `payment.css` |
| Completed Invoice page styling (was only 23 lines) | `Invoice.css` |
| Created ShoppingCart CSS from scratch | New `ShoppingCart.css` + `ShoppingCart.jsx` |

After every batch of changes, Claude ran `npm run build` to verify no errors were introduced.

**Takeaway:** Claude tracks all the changes it plans to make, executes them in logical batches, and self-verifies. It doesn't just edit — it tests.

---

## 7. Static Catalog Books — External Images + Graceful Fallback

For the Book Catalog page (20 empty slots when DB is offline), I asked Claude to populate it with real book cover images from the web.

Claude:
- Used **Open Library's public covers CDN** (`covers.openlibrary.org/b/isbn/{ISBN}-L.jpg`) — no API key, no rate limits
- Chose 20 books across 5 genres (Fantasy, Sci-Fi, Classics, Thriller, Fiction) using ISBNs it was confident about
- Wired them into the existing `BookCard` component — which already had `imageUrl` fallback support
- Made the fallback conditional: static books show only when `books.length === 0`; real data takes over automatically
- Kept pagination hidden for static books, active for real data

**Takeaway:** Claude reasons about *which* external services are appropriate (public CDN, no auth needed), matches the data structure to the existing component interface, and builds self-healing fallbacks instead of hardcoded replacements.

---

## 8. README Generation — Summarizing the Session

Finally, I asked Claude to write this document. The first attempt was a standard project README. When I clarified that I wanted a *learning journal focused on Claude Code*, it rewrote it entirely from a different angle — documenting the exploration, not the project.

**Takeaway:** Claude takes direction well. "Not like this" is a valid instruction — it doesn't get defensive or re-explain its previous output. It just does it differently.

---

## Before & After: Code Changes

Every change below was made by Claude Code in this session. The "Before" is exactly what was in the file; the "After" is what Claude wrote.

---

### 1. Debug Red Border (Home.css)

A `border: 2px solid red` left in production was making every book card show a red outline on the Home page.

**Before**
```css
.book-container {
  border: 2px solid red;
}
```

**After** — deleted entirely. No replacement needed.

---

### 2. "View Book" Button (Home.css)

The button was pure black — invisible against a dark card background.

**Before**
```css
.btn-view-book {
  background-color: #000;
  color: white;
  ...
}
.btn-view-book:hover {
  background-color: #333;
}
```

**After**
```css
.btn-view-book {
  background-color: #1e293b;
  color: #e2e8f0;
  border: 1px solid #334155;
  ...
}
.btn-view-book:hover {
  background-color: #667eea;
  color: #fff;
  border-color: #667eea;
  transform: scale(1.05);
}
```

---

### 3. Write Review Modal (BookDetails.css)

The modal was hardcoded to `top: 25%; left: 27%` — it appeared off-center on every screen except the exact resolution it was tested on.

**Before**
```css
.modal-overlay {
  position: fixed;
  top: 25%;
  left: 27%;
  z-index: 1000;
}

@media (max-width: 600px) {
  .modal-overlay {
    top: 20%;
    left: 5%;
  }
}
```

**After** — fullscreen flex centering, works on any screen width:
```css
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  animation: overlayFadeIn 0.2s ease;
}
.modal-content {
  background: #222;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  animation: modalSlideIn 0.25s ease;
}
@keyframes overlayFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes modalSlideIn {
  from { opacity: 0; transform: translateY(-20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```

---

### 4. Loading Spinner (BookDetails.css)

The loading state was a plain grey text string — easy to miss on a dark background.

**Before**
```css
.loading {
  color: #888;
  text-align: center;
  padding: 2rem;
}
```

**After** — animated CSS spinner:
```css
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  flex-direction: column;
  gap: 1rem;
  color: #555;
}
.loading::before {
  content: '';
  width: 48px; height: 48px;
  border: 3px solid #333;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

---

### 5. Admin Sidebar Active State (AdminSidebar.css)

The active and hover states were identical — you couldn't tell which page you were on.

**Before**
```css
.sidebar-link:hover {
  background-color: #2d3034;
}
.sidebar-link.active {
  background-color: #2d3034;  /* same as hover */
}
```

**After** — visually distinct active state with blue left border:
```css
.sidebar-link:hover {
  background-color: #2d3034;
}
.sidebar-link.active {
  background-color: #1e3a5f;
  border-left: 3px solid #667eea;
  padding-left: calc(1rem - 3px);
  color: #93c5fd;
}
```

---

### 6. Review Button Contrast (ReviewCard.css)

The like/dislike buttons on reviews were `#888` text on a `#2a2a2a` background — a contrast ratio of ~2:1, which fails WCAG AA (minimum 4.5:1 for normal text).

**Before**
```css
.review-actions button {
  color: #888;
  border: 1px solid #444;
}
```

**After** — ~5.3:1 contrast ratio, passes WCAG AA:
```css
.review-actions button {
  color: #c0c0c0;
  border: 1px solid #555;
}
```

---

### 7. Neon Stock Badges (Book.css / Customers.css)

The "In Stock" and "Active" badges used pure `#aaffaa` green — a glowing neon color that was harsh on the eyes against the dark admin theme.

**Before**
```css
.stock-badge.in {
  background-color: #2d3333;
  color: #aaffaa;
}
```

**After** — muted emerald, same semantic meaning, no eye-strain:
```css
.stock-badge.in {
  background-color: #1e3329;
  color: #6ee7b7;
}
```

---

### 8. Analytics Mobile Overflow (Analytics.css)

A chart container inside a `max-width: 768px` media query had `min-width: 700px` — forcing horizontal scroll on every mobile and tablet screen.

**Before**
```css
@media (max-width: 768px) {
  .chart-wrapper {
    min-width: 700px;
  }
}
```

**After**
```css
@media (max-width: 768px) {
  .chart-wrapper {
    min-width: 0;
    width: 100%;
  }
}
```

---

### 9. Footer Accent Color (Footer.css)

The footer used Bootstrap's default `#0d6efd` blue on hover — mismatched with the navbar's `#667eea` purple-blue accent used everywhere else.

**Before**
```css
.social-link:hover { color: #0d6efd; }
.footer-link:hover { color: #0d6efd; }
```

**After** — unified with the site's accent color:
```css
.social-link:hover { color: #667eea; }
.footer-link:hover { color: #667eea; }
```

---

### 10. Payment Form Focus Ring (payment.css)

The focus ring on payment form inputs used Bootstrap's default `#80bdff` blue, inconsistent with every other focused element on the site.

**Before**
```css
.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}
```

**After**
```css
.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
```

---

### 11. Skeleton Loader — Home Page (Home.jsx + Home.css)

Before the API responded, both "Trending Books" and "Featured Books" sections showed nothing — just a blank gap in the layout.

**Before** (Home.jsx)
```jsx
// No loading state — sections were just empty until data arrived
{trends.map((book) => (
  <BookCard key={book.bookId} book={book} />
))}
```

**After** — 5 animated shimmer placeholder cards shown during fetch:
```jsx
const SkeletonCards = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={i}>
        <div className="skeleton-card">
          <div className="skeleton-img" />
          <div className="skeleton-body">
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" />
          </div>
        </div>
      </div>
    ))}
  </>
);

// In render:
{loading ? <SkeletonCards /> : (trends.length > 0 ? trends : STATIC_TRENDING).map(...)}
```

And the CSS for the shimmer effect:
```css
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton-img {
  height: 260px;
  background: linear-gradient(90deg, #1e1e1e 25%, #2a2a2a 50%, #1e1e1e 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

### 12. Static Book Fallback — Home Page (Home.jsx)

When the database is offline, both sections were completely empty. Now they show curated static books, and real data takes over automatically when the DB reconnects.

**Before**
```jsx
// No fallback — empty array = empty section
const [trends, setTrends] = useState([]);
// ...
{trends.map((book) => <BookCard book={book} />)}
```

**After**
```jsx
const STATIC_TRENDING = [
  { bookId: "t1", title: "Jujutsu Kaisen Vol.1", author: { authName: "Gege Akutami" }, price: 349, img: book1 },
  { bookId: "t2", title: "Spy x Family Vol.13",  author: { authName: "Tatsuya Endo" },  price: 299, img: book2 },
  // ... 3 more
];

// Render: real data if available, static fallback if not
{(trends.length > 0 ? trends : STATIC_TRENDING).map((book) => (
  <BookCard key={book.bookId} book={book} />
))}
```

---

### 13. ShoppingCart Checkout Button (ShoppingCart.jsx)

The checkout button had an inline `backgroundColor: "#dee8f1"` — a light blue-grey that stood out badly against the dark page.

**Before**
```jsx
<button
  style={{ height: "40px", backgroundColor: "#dee8f1" }}
  className="btn w-100"
  onClick={handleCheckout}
>
  Proceed to Checkout
</button>
```

**After** — proper accent color, hover lift animation, defined in `ShoppingCart.css`:
```jsx
<button className="btn-checkout w-100" onClick={handleCheckout}>
  Proceed to Checkout
</button>
```
```css
/* ShoppingCart.css */
.btn-checkout {
  background-color: #667eea;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}
.btn-checkout:hover {
  background-color: #5a6fd6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
```

---

### 14. Static Catalog Books (BookCatalog.jsx)

When the database was offline, the catalog showed 20 empty card slots — the component structure was there but no data rendered.

**Before**
```jsx
// books.length === 0 → the else branch showed nothing (empty grid)
{books.length > 0 ? (
  books.map((book) => <BookCard book={book} />)
) : (
  <p>No books found.</p>
)}
```

**After** — 20 real book covers from Open Library's public CDN:
```jsx
const STATIC_CATALOG_BOOKS = [
  { bookId: "s1",  title: "Harry Potter & the Sorcerer's Stone",
    author: { authName: "J.K. Rowling" }, price: 499,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg" },
  { bookId: "s2",  title: "The Hobbit",
    author: { authName: "J.R.R. Tolkien" }, price: 449,
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg" },
  // ... 18 more across Fantasy, Sci-Fi, Classics, Thriller, Fiction
];

// In render:
{books.length > 0 ? (
  <>
    <RealBookGrid books={paginatedBooks} />
    <Pagination />   {/* only shown for real data */}
  </>
) : (
  <StaticGrid books={STATIC_CATALOG_BOOKS} />  // no pagination for static
)}
```

The CDN URL pattern: `covers.openlibrary.org/b/isbn/{ISBN}-L.jpg` — no API key, no rate limits, fully public.

---

## Summary of Claude Code Features Used

| Feature | What it did |
|---|---|
| `/init` | Crawled the entire repo and generated `CLAUDE.md` |
| Parallel agents | Read 18 CSS files + all JSX pages simultaneously in Plan Mode |
| Plan Mode | Researched → proposed → awaited approval → executed |
| Memory system | Saved coding preferences that persist across future sessions |
| Screenshot input | Diagnosed empty UI sections from a browser screenshot |
| Multi-file editing | Changed 16 files in one session with build verification |
| Code explanation | Traced full execution path across 8+ files into a clear architecture diagram |
| Build verification | Ran `npm run build` after changes to confirm zero errors |
| Autonomous fallback design | Built self-healing static → real data patterns |

---

## What I Learned

- **Claude Code is not an autocomplete tool.** It's an autonomous agent that plans, researches, edits, and verifies — the whole loop.
- **`/init` should always be your first command** in any new repo. The `CLAUDE.md` it generates pays dividends in every future session.
- **Plan Mode is worth using for anything non-trivial.** Getting a written plan before code is changed is genuinely useful — you catch misunderstandings before they become bugs.
- **The memory system is a real feature, not a gimmick.** State your preferences once; they carry forward.
- **You can direct Claude with screenshots, not just code.** Showing a broken UI is enough context for it to find and fix the root cause.
- **Claude respects the codebase it's in.** It used the existing component patterns, existing asset files, and existing color palette — it didn't invent new patterns or add unnecessary dependencies.

---

*Session conducted on 05-Apr-2026 using Claude Code (claude-sonnet-4-6) inside VS Code.*
