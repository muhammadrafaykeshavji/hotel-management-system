# 🏨 LuxuryStay Hospitality — Enterprise Hotel Management System
> **Aptech eProject**: LuxuryStay Hospitality MERN Enterprise Hotel Management System  
> **Design Reference & Inspiration**: [Pearl Continental Hotels & Resorts (PC Hotels)](https://www.pchotels.com/)  
> **Brand Palette**: Charcoal (`#171717`), Ivory (`#F7F4EE`), Muted Gold (`#B89B62`), White (`#FFFFFF`), Soft Gray (`#777777`)  
> **Typography**: Playfair Display / Cormorant Garamond (Headings) & Plus Jakarta Sans / Inter (Body & UI)

---

## 🌟 Executive Summary

**LuxuryStay Hospitality** is an enterprise-grade full-stack MERN (MongoDB, Express.js, React.js, Node.js) Hotel Management System designed to deliver a 5-star digital guest journey inspired by Pakistan's premier luxury hotel network, **Pearl Continental Hotels & Resorts**.

The platform features multi-property hotel listings across Pakistani cities (Karachi, Lahore, Islamabad, Bhurban, Gwadar, Malam Jabba), real-time server-side room availability validation, transparent dynamic pricing breakdown, promotional offer code engine, QR-code self-check-in, branded PDF tax invoice generation, and comprehensive role-based operational dashboards for hotel administration, reception, housekeeping, maintenance, and restaurant kitchen staff.

---

## 🏗️ Architecture & Tech Stack

```
               ┌────────────────────────────────────────────────────────┐
               │         React 19 Frontend (PC Hotels Inspired)         │
               │  Bootstrap 5 + Custom Luxury CSS (Charcoal / Ivory)    │
               │  Recharts Analytics + Socket.IO Client + HTML5 QR      │
               └───────────────────────────┬────────────────────────────┘
                                           │ REST API / WebSockets
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │              Node.js + Express.js Backend              │
               │  JWT Access & Refresh Tokens + Speakeasy 2FA (TOTP)    │
               │  Helmet + HPP + Express Rate Limit + Mongo Sanitize    │
               │  PDFKit (Branded Invoices) + Nodemailer Email Dispatch │
               └───────────────────────────┬────────────────────────────┘
                                           │ Mongoose ODM
                                           ▼
               ┌────────────────────────────────────────────────────────┐
               │             MongoDB Atlas (Cloud Database)             │
               │  Hotels, Rooms, Bookings, Users, Offers, CRM, Orders   │
               └────────────────────────────────────────────────────────┘
```

### Frontend
- **Framework**: React 19 (Hooks, Suspense, Lazy-loading)
- **Routing**: React Router DOM v7
- **Styling**: Bootstrap 5 + Custom LuxuryStay Theme (`luxuryStayTheme.css` & `premium.css`)
- **Icons**: FontAwesome 6, RemixIcon, Lucide React, React Icons
- **Real-Time Client**: Socket.IO Client 4.8
- **Data Visualization**: Recharts 3.8 (Occupancy, Revenue, RevPAR, ADR)
- **Scanner**: html5-qrcode (Mobile QR room check-in)

### Backend
- **Server**: Node.js v24 + Express 5
- **Database Engine**: MongoDB Atlas via Mongoose 9.6
- **Security & RBAC**: Helmet 8, Express-Rate-Limit, HPP, Express-Mongo-Sanitize, Bcryptjs, JWT (with refresh rotation)
- **Two-Factor Auth**: Speakeasy (TOTP QR codes)
- **Document Generation**: PDFKit (Luxury tax invoices / guest folios)
- **Real-Time Gateway**: Socket.IO 4.8
- **Scheduled Automation**: node-cron (automated check-in/out alerts & daily mongodump backup trigger)

---

## 🏛️ Multi-Property Hotel Network

The system natively models distinct luxury properties across Pakistan:

| Property | City | Category | Starting Rate (PKR) | Highlights |
|---|---|---|---|---|
| **LuxuryStay Pearl Continental Karachi** | Karachi | Urban Flagship | PKR 22,000 / night | Club Road, 5 Specialty Restaurants, Executive Lounge, Infinity Pool |
| **LuxuryStay Grand Lahore** | Lahore | Mughal Heritage | PKR 24,000 / night | Historic Mall Road, Royal Mughlai Dining, Landscaped Gardens |
| **LuxuryStay Margalla Islamabad** | Islamabad | Capital Sanctuary | PKR 26,000 / night | Margalla Hills Terrace, Diplomatic Security Suite, Indoor Heated Pool |
| **LuxuryStay Hilltop Resort Bhurban** | Bhurban | Alpine Mountain | PKR 28,000 / night | Murree Hills, 9-Hole Golf Course, Pine Balconies, Heated Pool |
| **LuxuryStay Zaver Bay Gwadar** | Gwadar | Coastal Cliff | PKR 20,000 / night | Koh-e-Batil Cliff, Arabian Sea Terraces, Fresh Seafood Grill |
| **LuxuryStay Mountain Resort Malam Jabba** | Malam Jabba | Ski & Snowboard | PKR 25,000 / night | Swat Valley, Direct Ski-In / Ski-Out, Chairlift, Alpine Hot Tubs |

---

## 🛎️ Core Features & Capabilities

### 1. Public Guest Website (PC Hotels Experience)
- **Regal Header & Navigation**: Top utility bar with UAN helpline (`+92 21 111 505 505`), direct access to destinations, rooms, dining, offers, and guest accounts.
- **Quick Booking Engine**: Hero search widget allowing destination, check-in, check-out, guest count, and room type filtering.
- **Featured Destinations**: Interactive property showcase with star ratings, starting rates in PKR, and direct reservation triggers.
- **Special Offers & Packages (`/offers`)**: Active packages (`WEEKEND20`, `NORTH25`, `BIZFLAT5K`, `HONEYMOON15`) with one-click code copy and live server-side validation.
- **Rooms & Suites Showcase (`/room`)**: Filterable by single, double, deluxe, and presidential suite categories.
- **Culinary Sanctuary (`/restaurant`)**: Dum Pukht (Royal Mughlai), Sakura (Pan-Asian Teppanyaki), and Terrace Lounge menus.
- **Privilege Club Membership**: Guest loyalty rewards program with tier benefits and point accumulation.

### 2. Robust Hotel Booking Flow
1. **Search**: Guest selects property, dates, guests, and room type.
2. **Availability Check**: Real-time server-side database validation (`isRoomAvailableForDates`) preventing double bookings and overlap conflicts.
3. **Transparent Price Calculation**:
   - Nights × Room Base Rate
   - Validated promo code discount deduction
   - 13% GST & service charges breakdown
   - Total amount payable in PKR
4. **Payment Flexibility**:
   - **Pay at Hotel**: Cash or Credit Card upon check-in.
   - **Demo Online Payment**: Clearly labeled sandbox mode for simulated card and mobile wallet checkout with verified database recording.
5. **Instant Confirmation**: Reference booking number, QR check-in code, and guest folio generation.

### 3. Guest Self-Service Portal (`/profile`)
- View upcoming, active, and past reservations.
- Download verified PDF invoices with itemized tax breakdowns.
- Request hotel amenities (extra bedding, room service, housekeeping, concierge).
- Submit star feedback and reviews.
- QR check-in code access for express reception arrival.
- Cancel bookings in accordance with hotel policy.

### 4. Enterprise Admin & Staff Dashboards
- **Role-Based Access Control**:
  - `admin` & `manager`: Live occupancy, revenue in PKR, ADR, RevPAR, room status, audit logs.
  - `receptionist`: Walk-in booking creation, guest check-in/out, room assignment, invoice printing.
  - `housekeeping`: Real-time room cleaning status, task assignments.
  - `maintenance`: Facility issue reporting, resolution logs.
  - `kitchen`: Restaurant order queue, preparation tracking.
- **Business Intelligence**:
  - Occupancy Rate: `(Occupied Rooms / Total Rooms) × 100`
  - ADR (Average Daily Rate): `Total Revenue / Total Nights`
  - RevPAR (Revenue Per Available Room): `Total Revenue / Total Rooms`
  - One-click CSV export for finance and audit compliance.

---

## 📡 API Endpoint Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new guest with privacy consent | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT tokens | Public (Rate-limited) |
| `POST` | `/api/auth/refresh` | Refresh expired access token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private |
| `POST` | `/api/auth/2fa/setup` | Generate TOTP QR code for 2FA | Private |
| `POST` | `/api/auth/2fa/verify` | Verify 2FA token | Private |

### Hotels & Destinations (`/api/hotels`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/hotels` | Get all hotels with city, price, and facility filters | Public |
| `GET` | `/api/hotels/featured` | Fetch featured properties for homepage | Public |
| `GET` | `/api/hotels/cities` | List unique cities with active properties | Public |
| `GET` | `/api/hotels/:id` | Fetch single hotel with its rooms | Public |
| `POST` | `/api/hotels` | Create new hotel property | Admin, Manager |
| `PUT` | `/api/hotels/:id` | Update hotel property details | Admin, Manager |

### Rooms (`/api/rooms`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/rooms` | List all rooms with status and filter support | Public |
| `GET` | `/api/rooms/:id` | Get details of a single room | Public |
| `POST` | `/api/rooms` | Create a new room with image upload | Admin, Manager |
| `PUT` | `/api/rooms/:id` | Update room price, type, or status | Admin, Manager |
| `DELETE` | `/api/rooms/:id` | Remove room from inventory | Admin |

### Bookings & Reservations (`/api/bookings`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/bookings` | Create reservation with overlap check | Authenticated Guest |
| `GET` | `/api/bookings/my` | List current user's reservations | Authenticated Guest |
| `GET` | `/api/bookings/all` | List all hotel reservations | Staff |
| `GET` | `/api/bookings/:id/invoice` | Download official PDF tax invoice | Owner or Staff |
| `POST` | `/api/bookings/:id/invoice/email` | Dispatch PDF invoice via email | Owner or Staff |
| `PUT` | `/api/bookings/:id/checkin` | Process guest check-in | Receptionist, Admin |
| `PUT` | `/api/bookings/:id/checkout` | Process guest check-out & billing | Receptionist, Admin |
| `PUT` | `/api/bookings/:id/cancel` | Cancel reservation per policy | Owner or Staff |

### Special Offers & Promo Codes (`/api/offers`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/offers` | Fetch active promotional packages | Public |
| `POST` | `/api/offers/validate` | Server-side validation of promo code | Public |
| `POST` | `/api/offers` | Create new promotional package | Admin |

### System & Health (`/api/health`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Health check endpoint returning status & timestamp | Public |

---

## 💾 Safe Database Seeding

The application includes an idempotent, non-destructive seed script that populates realistic 5-star Pakistani luxury hotels, room inventories, and promotional packages into MongoDB Atlas without creating duplicate records or erasing live customer bookings:

```bash
# Run from repository root or backend folder
npm run seed --prefix backend
```

**Seeded Entities:**
- 6 LuxuryStay Hotels (Karachi, Lahore, Islamabad, Bhurban, Gwadar, Malam Jabba)
- Room mappings across Single, Double, Deluxe, and Suite categories
- 4 Promo Codes: `WEEKEND20` (20% Off), `NORTH25` (25% Off), `BIZFLAT5K` (Flat PKR 5,000 Off), `HONEYMOON15` (15% Off)

---

## 🧪 Testing & Verification

The test suite validates pricing calculations, server-side room availability mathematics, model constraints, and RBAC authorization:

```bash
# Run Mocha unit test suite
npm test --prefix backend
```

**Actual Execution Results:**
- `20 passing (108ms)`
- Validated:
  - Base price calculations without rules
  - Weekend surcharges and seasonal percentage discounts
  - Flat amount special event pricing
  - Date overlap mathematics (`overlaps` function: back-to-back booking compatibility, boundary touch tolerance)
  - Booking model required schema constraints & default statuses

---

## 🛡️ Security, Privacy & Compliance

- **No Exposed Secrets**: All sensitive connection strings, JWT secrets, and email credentials reside strictly in `backend/.env` (gitignored). `.env.example` is provided with placeholders only.
- **HTTP Security Headers**: Powered by Helmet to prevent clickjacking, MIME-sniffing, and cross-site injections.
- **Strict Rate Limiting**: Dedicated rate-limiters for general API traffic, login/registration brute-force protection, and password resets.
- **Input Sanitization**: MongoDB query operator injection protection via `express-mongo-sanitize` and HTTP parameter pollution protection via `hpp`.
- **Audit Logging**: Sensitive administrative actions (room additions, price updates, invoice dispatches, staff changes) are recorded in the `AuditLog` collection.
- **Privacy & Consent**: User registrations require explicit consent recording timestamped in the database.

---

## 🗄️ MongoDB Backup & Restore Strategy

### 1. Automated Scheduled Backups
Configured in `backend/cron/backupJob.js`. When `BACKUP_ENABLED=true` and `NODE_ENV=production` are set, a daily `mongodump` triggers at 02:00 AM with a 7-day retention purge policy.

### 2. Manual Backup Command
```bash
cd backend
node scripts/backupDb.js
```
The script automatically masks passwords from console logs and writes to `backups/<dbname>_<timestamp>`.

### 3. Restore Command
```bash
mongorestore --uri="<YOUR_MONGO_URI>" --drop --nsInclude="hotel_db.*" backups/<dump_folder>/hotel_db
```

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18 or higher; tested on Node.js v24)
- npm (v9 or higher)
- Active MongoDB Atlas connection URI

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/eshalasad19/Hotel-Management-System-Enterprise.git
cd Hotel-Management-System-Enterprise

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hotel_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_luxurystay_2026
JWT_REFRESH_SECRET=super_secret_jwt_refresh_key_luxurystay_2026
JWT_EXPIRES_IN=1d
EMAIL_USER=reservations@theluxurystay.com
EMAIL_PASS=your_email_app_password
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend (`frontend/.env`):**
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_SERVER_URL=http://localhost:5001
```

### 3. Seed Realistic Hotel Data
```bash
npm run seed --prefix backend
```

### 4. Launch Development Servers
```bash
# Terminal 1: Launch Backend API
cd backend
npm run dev    # or npm start

# Terminal 2: Launch React Frontend
cd frontend
npm start
```
The frontend will open in your browser at `http://localhost:3000`.

---

## 🌐 Production Deployment Guide

### Option A: Render (Backend) + Vercel (Frontend)
1. **Database**: Create a free MongoDB Atlas cluster and whitelist `0.0.0.0/0` (or host IPs).
2. **Backend on Render**:
   - Create a Web Service connected to your repository with root directory `backend`.
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables from `backend/.env.example`.
3. **Frontend on Vercel**:
   - Create a project with root directory `frontend`.
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Add environment variable: `REACT_APP_API_URL=https://<your-render-app>.onrender.com/api`.
   - Update `ALLOWED_ORIGINS` in Render backend with your Vercel URL.

### Option B: Monolithic Node.js Host (Hostinger / VPS)
The backend is pre-configured to serve the compiled frontend from `backend/Public`:
1. Build frontend: `npm run build --prefix frontend`
2. Sync build to backend: `Copy-Item -Path "frontend/build/*" -Destination "backend/Public" -Recurse -Force`
3. Launch Node.js on `Index.js`. Requests to `/api/*` are handled by Express routers, while all frontend paths resolve to `backend/Public/index.html`.

---

## 📋 Aptech eProject Submission Deliverables

- [x] **Project Overview & Architecture**: Full MERN stack with PC Hotels luxury design reference.
- [x] **Live MongoDB Atlas Integration**: Cloud database connected with indexed schemas.
- [x] **Multi-Property Hotel Model**: Karachi, Lahore, Islamabad, Bhurban, Gwadar, Malam Jabba.
- [x] **Complete Booking Engine**: Server-side double-booking prevention, promo code engine, transparent tax breakdown, demo payment handling.
- [x] **Automated Invoicing**: Downloadable luxury PDF folios generated via PDFKit.
- [x] **Role-Based Access Control**: Separate portals for Admin, Manager, Receptionist, Housekeeping, Maintenance, Kitchen, and Guest.
- [x] **Security & Audit Logs**: Rate limiting, Helmet, Mongo sanitize, HPP, and audit logging.
- [x] **Automated Unit Testing**: Mocha test suite with 20 passing tests.
- [x] **Clean Production Build**: React 19 production build verified (`Compiled successfully`).
- [x] **User & Developer Guides**: Comprehensive API docs, seed guides, and deployment instructions.

---
**Author**: Eshal Asad — Aptech eProject 2026  
**License**: Educational & Portfolio Demonstration  
