# GearUp 🏋️

**"Rent Sports & Outdoor Gear Instantly"**

---

## Project Overview

GearUp is a backend API for a sports and outdoor equipment rental service. Customers can browse available gear, place rental orders, and return equipment. Providers manage their gear inventory and fulfill rental orders. Admins oversee the platform, manage users, and moderate listings.

---

## Roles & Permissions

| Role         | Description                | Key Permissions                                               |
| ------------ | -------------------------- | ------------------------------------------------------------- |
| **Customer** | Users who rent sports gear | Browse gear, place rental orders, track status, leave reviews |
| **Provider** | Gear vendors/rental shops  | Manage gear inventory, view orders, update order status       |
| **Admin**    | Platform moderators        | Manage all users, oversee all rentals, manage categories      |

> 💡 **Note**: Users select their role during registration.

---

## 🛠️ Tech Stack

### Backend

| Technology        | Purpose                   |
| ----------------- | ------------------------- |
| Node.js + Express | REST API                  |
| TypeScript        | Type safety (recommended) |
| Postgres + Prisma | Database + ORM            |
| JWT               | Authentication            |

### Deployment

| Service       | Purpose                |
| ------------- | ---------------------- |
| Vercel/Render | Backend API deployment |

---

## Features

### Public Features

- Browse all available sports & outdoor gear
- Search and filter by category, price, brand, and availability
- View gear details with specifications

### Customer Features

- Register and login as customer
- Place rental orders (select dates + items)
- **Make payments via Stripe or SSLCommerz when placing or confirming an order**
- **View payment history and payment status**
- Track rental order status
- Leave reviews after returning gear
- Manage profile

### Provider Features

- Register and login as provider
- Add, edit, and remove gear from inventory
- Manage stock and availability
- View incoming rental orders
- Update order status (confirm, mark picked up, mark returned)

### Admin Features

- View all users (customers and providers)
- Manage user status (suspend/activate)
- View all gear listings and rental orders
- Manage gear categories

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description                           |
| ------ | -------------------- | ------------------------------------- |
| POST   | `/api/auth/register` | Register new user (customer/provider) |
| POST   | `/api/auth/login`    | Login user, return JWT                |
| GET    | `/api/auth/me`       | Get current authenticated user        |

### Gear (Public)

| Method | Endpoint          | Description                                        |
| ------ | ----------------- | -------------------------------------------------- |
| GET    | `/api/gear`       | Get all gear with filters (category, price, brand) |
| GET    | `/api/gear/:id`   | Get gear details                                   |
| GET    | `/api/categories` | Get all gear categories                            |

### Rental Orders

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| POST   | `/api/rentals`     | Create new rental order  |
| GET    | `/api/rentals`     | Get user's rental orders |
| GET    | `/api/rentals/:id` | Get rental order details |

### Payments (Stripe / SSLCommerz)

| Method | Endpoint                | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| POST   | `/api/payments/create`  | Create a payment intent/session for a rental order |
| POST   | `/api/payments/confirm` | Confirm/verify payment (webhook or callback)       |
| GET    | `/api/payments`         | Get user's payment history                         |
| GET    | `/api/payments/:id`     | Get payment details                                |

### Provider Management

| Method | Endpoint                   | Description                    |
| ------ | -------------------------- | ------------------------------ |
| POST   | `/api/provider/gear`       | Add gear to inventory          |
| PUT    | `/api/provider/gear/:id`   | Update gear listing            |
| DELETE | `/api/provider/gear/:id`   | Remove gear from inventory     |
| GET    | `/api/provider/orders`     | Get provider's incoming orders |
| PATCH  | `/api/provider/orders/:id` | Update rental order status     |

### Reviews

| Method | Endpoint       | Description                         |
| ------ | -------------- | ----------------------------------- |
| POST   | `/api/reviews` | Create review (after rental return) |

### Admin

| Method | Endpoint               | Description                           |
| ------ | ---------------------- | ------------------------------------- |
| GET    | `/api/admin/users`     | Get all users                         |
| PATCH  | `/api/admin/users/:id` | Update user status (suspend/activate) |
| GET    | `/api/admin/gear`      | Get all gear listings                 |
| GET    | `/api/admin/rentals`   | Get all rental orders                 |

---

## Database Tables

## [GearUp SQL](./src/db/gearUp.sql)

## Quick links (Live)

```text
Backend Repo : https://github.com/ashfaqshuvo007/GearUp

Live API : https://gear-up-delta.vercel.app/

API Docs : https://documenter.getpostman.com/view/7324207/2sBY4LQgZL

Demo Video : https://drive.google.com/file/d/1oQdTi6bBzzeRjtRrFXXOmMeTyKlbD-fJ/view?usp=sharing

Admin Email : admin@gmail.com

Admin Password : 123456
```

## Flow Diagrams

### 🏋️ Customer Journey

```

                              ┌──────────────┐
                              │   Register   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Browse Gear  │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  View Gear   │
                              │   Details    │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Place Rental │
                              │    Order     │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  Make Payment│
                              │(Stripe/SSLC) │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Pick Up    │
                              │    Gear      │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Return Gear  │
                              │ Leave Review │
                              └──────────────┘

```

### 🏪 Provider Journey

```

                              ┌──────────────┐
                              │   Register   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  Add Gear    │
                              │  Inventory   │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ Manage Stock │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │ View Orders  │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │Update Status │
                              └──────────────┘

```

### 📊 Rental Order Status

```

                              ┌──────────────┐
                              │    PLACED    │
                              └──────────────┘
                               /            \
                              /              \
                       (provider)       (customer)
                        confirms         cancels
                            /                \
                           ▼                  ▼
                    ┌──────────────┐   ┌──────────────┐
                    │  CONFIRMED   │   │  CANCELLED   │
                    └──────────────┘   └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    PAID      │
                    │  (Stripe/    │
                    │  SSLCommerz) │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  PICKED_UP   │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  RETURNED    │
                    └──────────────┘

```

---

## Contact Me:

- [LinkedIn](https://www.linkedin.com/in/ashfaqhahmed/)
- [Twitter](https://twitter.com/ashfaq8495)

## Security Vulnerabilities

If you discover a security vulnerability within the repo, please send an e-mail to Ashfaq Hussain Ahmed via [ashfaqshuvo14@gmail.com](mailto:ashfaqshuvo14@gmail.com). All security vulnerabilities will be promptly addressed.

## License

The repository is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
