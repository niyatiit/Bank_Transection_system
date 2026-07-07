# 💳 Bank Transaction Ledger System

A secure backend banking system built with **Node.js, Express.js, MongoDB, and Mongoose** that demonstrates how modern financial applications process transactions using a **Ledger Architecture** instead of directly updating account balances.

The project focuses on **data integrity, transaction consistency, idempotency, authentication, and immutable ledger records**, making it a great demonstration of backend development best practices.

---

## 🚀 Features

- 🔐 User Authentication using JWT
- 👤 User Registration & Login
- 🏦 Account Management
- 💰 Balance Calculation from Ledger Entries
- 💳 Secure Money Transfer
- 📒 Immutable Ledger System
- 🔄 Idempotent Transactions
- 📧 Email Notification after Successful Transactions
- 🚫 JWT Blacklisting for Logout
- 🛡️ Protected APIs
- ⚡ MongoDB Transactions (ACID Properties)
- 📊 Transaction History
- ✅ Input Validation
- ❌ Proper Error Handling

---

# 🏗️ Project Architecture

```
Client
   │
   ▼
Express Routes
   │
   ▼
Controllers
   │
   ▼
Business Logic
   │
   ▼
MongoDB Transaction Session
   │
   ▼
Models
(Account, Transaction, Ledger, User)
   │
   ▼
MongoDB Database
```

---

# 📂 Project Structure

```
backend-ledger
│
├── src
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   └── transaction.controller.js
│   │
│   ├── middleware
│   │   └── auth.middleware.js
│   │
│   ├── models
│   │   ├── account.model.js
│   │   ├── user.model.js
│   │   ├── ledger.model.js
│   │   ├── transaction.model.js
│   │   └── blackList.model.js
│   │
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   │
│   ├── services
│   │   └── email.service.js
│   │
│   └── app.js
│
├── server.js
├── package.json
└── .env
```

---

# 🛠️ Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- bcrypt

### Email

- Nodemailer

### Other Packages

- Cookie Parser
- Dotenv

### Test API

- postman
- 
---

# 🔐 Authentication APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |
| GET | /api/auth/profile | User Profile |
| GET | /api/auth/logout | Logout User |

---

# 🏦 Account APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/accounts/create | Create Account |
| GET | /api/accounts/balance/:id | Get Account Balance |

---

# 💳 Transaction APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/transactions/create | Transfer Money |
| POST | /api/transactions/initial-fund | Initial Fund Transfer |

---

# 📒 Ledger-Based Accounting

Unlike traditional banking applications that store balances directly inside the account document, this project stores every financial operation inside the **Ledger Collection**.

Every transaction creates:

✔ Debit Entry

✔ Credit Entry

The account balance is calculated dynamically using:

```
Balance = Total Credits − Total Debits
```

This approach guarantees:

- Immutable financial records
- Complete audit history
- Reliable balance calculation
- Easy transaction tracking

---

# 🔄 Idempotent Transactions

To prevent duplicate money transfers caused by network retries or repeated requests, every transaction requires an **Idempotency Key**.

If the same key is used again:

- Completed transaction → Returns previous response
- Pending transaction → Prevents duplicate execution
- Failed transaction → Allows retry

---

# ⚙️ Transaction Workflow

1. Validate Request
2. Validate Idempotency Key
3. Check Account Status
4. Calculate Sender Balance
5. Start MongoDB Transaction
6. Create Pending Transaction
7. Create Debit Ledger Entry
8. Create Credit Ledger Entry
9. Mark Transaction as Completed
10. Commit Transaction
11. Send Email Notification

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Logout using JWT Blacklisting
- Immutable Ledger Entries
- MongoDB Transactions
- Input Validation

---

# ⚙️ Installation

Clone Repository

```bash
git clone https://github.com/niyatiit/Bank_Transaction_system.git
```

Install Dependencies

```bash
npm install
```

Create `.env`

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_ID=your_client_id

CLIENT_SECRET=your_client_secret

REFRESH_TOKEN=your_refresh_token

EMAIL_USER=your_email

```

Run Server

```bash
npm run dev
```

---

# 📸 API Testing

All APIs were tested successfully using **Postman**.

> You can add screenshots of:
>
> - Register
> - Login
> - Create Account
> - Initial Fund
> - Transfer Money
> - Balance API
> - MongoDB Collections

---

# 🚀 Future Improvements

- Account Statement PDF
- Transaction Search & Filters
- Admin Dashboard
- Rate Limiting
- OTP Verification
- Two-Factor Authentication
- Swagger API Documentation
- Docker Support

---

# 👨‍💻 Author

**Niyati Patel**

Backend Developer | Java | Node.js | Express.js | MongoDB

GitHub: https://github.com/niyatiit

LinkedIn: https://www.linkedin.com/in/niyati-patell/

---

## ⭐ If you like this project, don't forget to star the repository!
