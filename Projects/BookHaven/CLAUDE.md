# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack Book Store Management System built with a microservices architecture. Backend is Java/Spring Boot; frontend is React.

## Build & Run Commands

All backend services use Maven. Run from within each service directory:

```bash
mvn clean install       # Build
mvn spring-boot:run     # Run
mvn test                # Run all tests
mvn test -Dtest=<TestClassName>  # Run a single test class
```

Frontend:
```bash
cd Book-Store-Management-Frontend
npm install
npm run dev   # Vite dev server at http://localhost:5173
```

## Service Startup Order

Services must start in this order due to Eureka dependency:

1. `eurekaserver` — port 8761, dashboard at http://localhost:8761
2. Backend services (can run in parallel):
   - `BookService` — port 8001
   - `InventoryService` — port 8002
   - `CartModule` — port 8003
   - `PaymentService` — port 8004
   - `UserService` — port 8006
   - `ReviewService` — port 8007
   - `OrderService` — port 8008
3. `GateWay` — port 8000 (all client traffic routes through here)
4. Frontend — port 5173

## Architecture

### Microservices Pattern
Each service is an independent Spring Boot app with its own MySQL database. Services register with Eureka for discovery. All external traffic enters via the API Gateway.

**Tech stack:** Java 17 (Java 21 for GateWay), Spring Boot 3.5.0, Spring Cloud 2025.0.0, MySQL, React 19 + Vite, Maven.

### Inter-Service Communication (Feign Clients)
Services call each other via `@FeignClient`. Some use hardcoded URLs (localhost), others use Eureka service names:

- `BookService` → `InventoryService` (localhost:8002)
- `CartModule` → `BookService`, `InventoryService`, `UserService`
- `OrderService` → `BookService`, `InventoryService`, `PaymentService` (via Eureka: `PAYMENTSERVICE`), `UserService`
- `PaymentService` → `CartModule`, `UserService`
- `ReviewService` → `BookService`, `UserService`
- `UserService` → `CartModule`, `OrderService`, `ReviewService`

### API Gateway (GateWay)
- Routes all requests to downstream services
- JWT authentication (`jwt.secret=HeDjjFiGZB0ZwUstbaLUcmMwf67kB0r6`, 24h expiry)
- Global CORS configured to allow all origins
- Swagger UI aggregated at http://localhost:8000/swagger-ui.html

### Database Configuration
All services use MySQL with `spring.jpa.hibernate.ddl-auto=update` (tables auto-created):

| Service | Database |
|---------|----------|
| BookService | bookservice |
| InventoryService | learning |
| CartModule | CartModule |
| PaymentService | book_payment |
| UserService | userservice |
| ReviewService | reviewdb |
| OrderService | orderservice |

Default credentials across all services: `root` / `root`.

### Code Structure (per service)
Each service follows the same package layout under `src/main/java/com/cts/`:
- `controller/` — REST endpoints
- `service/` — business logic (`IXxxService` interface + `XxxServiceImpl`)
- `repository/` — Spring Data JPA (`IXxxRepository`)
- `entity/` — JPA entities
- `dto/` — Data Transfer Objects (ModelMapper used for conversion)
- `config/` — Feign client beans, ModelMapper config
- `exception/` — `GlobalExceptionHandler`, `ResourceNotFoundException`

### Key API Prefixes
- BookService: `/bookmanage`
- CartModule: `/api/v1/cart`
- OrderService: `/bookstore`
- InventoryService: `/inventory`
- UserService: `/user`, `/profile`
- ReviewService: `/reviews`
- PaymentService: `/payments`

### Swagger / API Docs
Each service exposes Swagger UI at `http://localhost:<port>/swagger-ui.html` via SpringDoc OpenAPI (`springdoc.api-docs.enabled=true`).
