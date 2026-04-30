# MobileStore Inventory Suite

A full-stack mobile store inventory management system built with **Spring Boot Microservices** and a **React** frontend.

---

## Architecture Overview

```
Frontend (React + Vite)  :5173
        │
        ▼  /auth/**  /store/**
API Gateway (Spring Cloud Gateway)  :8080
        │
        ├──▶ auth-service       :8081
        ├──▶ customer-service   :8082
        ├──▶ mobile-service     :8083
        ├──▶ order-service      :8084
        └──▶ billing-service    :8085

Service Registry (Eureka)  :8761
```

---

## Services

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| `service-registry` | 8761 | — | Eureka discovery server |
| `api-gateway` | 8080 | — | Spring Cloud Gateway + JWT validation |
| `auth-service` | 8081 | `authdb` | Register/login, JWT generation |
| `customer-service` | 8082 | `customerdb` | Customer CRUD |
| `mobile-service` | 8083 | `mobiledb` | Mobile inventory CRUD |
| `order-service` | 8084 | `orderdb` | Order management |
| `billing-service` | 8085 | `billingdb` | Bill generation from orders |

---

## Tech Stack

**Backend**
- Java 21
- Spring Boot 3.x
- Spring Cloud Gateway (reactive)
- Spring Cloud Netflix Eureka
- Spring Security + JWT (JJWT)
- Spring Data JPA + Hibernate
- MySQL

**Frontend**
- React 19 + Vite
- React Router v6
- TanStack Query (React Query)
- Tailwind CSS + shadcn/ui
- Lucide React icons

---

## Prerequisites

- Java 21
- Maven 3.9+
- MySQL 8+
- Node.js 18+

---

## Database Setup

Create the following MySQL databases:

```sql
CREATE DATABASE authdb;
CREATE DATABASE customerdb;
CREATE DATABASE mobiledb;
CREATE DATABASE orderdb;
CREATE DATABASE billingdb;
```

Default credentials used across all services:
```
username: root
password: Bhavya@123
```

Update `application.properties` in each service if your credentials differ.

---

## Running the Project

Start services **in this order**:

### 1. Service Registry (Eureka)
```bash
cd service-registry
./mvnw spring-boot:run
```
Visit: http://localhost:8761

### 2. API Gateway
```bash
cd api-gateway
./mvnw spring-boot:run
```

### 3. Microservices (any order)
```bash
cd auth-service && ./mvnw spring-boot:run
cd customer-service && ./mvnw spring-boot:run
cd mobile-service && ./mvnw spring-boot:run
cd order-service && ./mvnw spring-boot:run
cd billing-service && ./mvnw spring-boot:run
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```
Visit: http://localhost:5173

---

## API Endpoints

All requests go through the gateway at `http://localhost:8080`.

### Auth (public)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |

### Mobiles (authenticated)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/mobiles` | List all mobiles |
| POST | `/store/mobiles` | Add a mobile |
| PUT | `/store/mobiles/{id}` | Update a mobile |
| DELETE | `/store/mobiles/{id}` | Delete a mobile |
| PUT | `/store/mobiles/reduce-stock` | Reduce stock by quantity |

### Customers (authenticated)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/customers` | List all customers |
| POST | `/store/customers` | Add a customer |
| DELETE | `/store/customers/{id}` | Delete a customer |

### Orders (authenticated)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/store/orders` | List all orders |
| POST | `/store/orders` | Create an order |
| DELETE | `/store/orders/{id}` | Delete an order |

### Billing (authenticated)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/store/bills/order/{orderId}` | Generate a bill for an order |
| GET | `/store/bills` | List all bills |
| GET | `/store/bills/{id}` | Get a bill by ID |

---

## Authentication

The system uses **JWT (Bearer token)** authentication.

1. Register via `POST /auth/register` with `{ username, password, role }`
2. Login via `POST /auth/login` — returns `{ token: "eyJ..." }`
3. Include the token in subsequent requests: `Authorization: Bearer <token>`

Roles: `ADMIN`, `USER`

The gateway validates the JWT on every request to protected routes using a shared secret key.

> **Important:** Both `auth-service` and `api-gateway` must use the **same JWT secret** in their respective `JwtUtil.java` files.

---

## Frontend Routes

| Path | Description |
|------|-------------|
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | Overview dashboard |
| `/store/mobiles` | Mobile inventory |
| `/store/customers` | Customer list |
| `/store/orders` | Orders |
| `/store/billing` | Billing |

---

## Project Structure

```
mobile-store-microservices/
├── api-gateway/
├── auth-service/
├── customer-service/
├── mobile-service/
├── order-service/
├── billing-service/
├── service-registry/
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        └── lib/
            ├── api.js       # API client
            └── auth.jsx     # Auth context
```
