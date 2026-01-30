# Email Scheduling System – Full Stack Assignment

## Overview

This project is a full-stack email scheduling system designed to demonstrate backend scalability, reliability, and clean architecture, along with a simple and functional frontend dashboard. Users can schedule emails to be sent at a future time, monitor their delivery status, and verify that scheduled emails persist and execute correctly even after server restarts.

The system uses a queue-based architecture with Redis and BullMQ to handle delayed and background email processing, ensuring robustness and fault tolerance.

---

## Tech Stack

### Backend

- Node.js
- Express.js
- Prisma ORM
- SQLite (persistence)
- Redis (Docker)
- BullMQ (job queue and scheduling)
- Nodemailer + Ethereal Email
- express-rate-limit

### Frontend

- React (Vite)
- Tailwind CSS v4
- Axios
- React Router

---

## Architecture Overview

The system follows a producer–consumer model:

1. **API Server (Express)**
   - Accepts email scheduling requests
   - Persists email metadata in the database
   - Pushes delayed jobs into Redis using BullMQ

2. **Redis + BullMQ**
   - Stores delayed jobs
   - Ensures persistence across restarts
   - Manages retries, backoff, concurrency, and rate limiting

3. **Worker Process**
   - Listens to the email queue
   - Sends emails asynchronously
   - Updates delivery status in the database

4. **Frontend Dashboard**
   - Displays scheduled, sent, and failed emails
   - Allows scheduling new emails
   - Consumes read-optimized backend APIs

---

## How Scheduling Works

1. User schedules an email with a future timestamp.
2. Backend validates input and date format.
3. Email is saved to the database with status `SCHEDULED`.
4. A BullMQ delayed job is created using the email ID as the job ID (idempotency).
5. At the scheduled time, the worker consumes the job and sends the email.
6. Email status is updated to `SENT` or `FAILED`.

---

## Persistence on Restart

- Email metadata is stored in the database.
- Delayed jobs are persisted in Redis.
- If the API server or worker restarts, BullMQ resumes pending jobs automatically.
- Scheduled emails are still delivered at the correct time after restart.

---

## Rate Limiting and Concurrency

### API Rate Limiting

- Implemented using `express-rate-limit`
- Prevents excessive API requests per client

### Worker Concurrency

- Configured using BullMQ worker options
- Controls the number of concurrent email sends
- Includes retry attempts with exponential backoff

---

## Backend Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- Docker

### Clone Repository

```bash
git clone https://github.com/aakarsh5/Outbox-Labs.git
cd Backend
```

### Install Dependencies

```bash
npm install
```

### Start Redis (Docker)

```bash
docker pull redis
docker run -p 6379:6379 redis
```

### Environment Variables

Create a `.env` file in `Backend/`:

```env
PORT=5000
DATABASE_URL="file:./dev.db"
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
ETHEREAL_USER=your_ethereal_user
ETHEREAL_PASS=your_ethereal_password
```

### Run Database Migration

```bash
npx prisma migrate dev --name init
```

### Start Backend Server

```bash
npm run dev
```

### Start Worker (Separate Terminal)

```bash
node src/workers/emailWorker.js
```

---

## Health Check

```http
GET /health
```

Used for service availability and monitoring.

---

## Email APIs

### Schedule Email

```http
POST /api/emails/schedule
```

Request Body:

```json
{
  "to": "test@example.com",
  "subject": "Test Email",
  "body": "Hello from scheduler",
  "scheduledAt": "2026-01-30T05:10:00Z"
}
```

### Get Emails (Dashboard)

```http
GET /api/emails
GET /api/emails?status=SCHEDULED
GET /api/emails?status=SENT
GET /api/emails?status=FAILED
```

---

## Frontend Setup Instructions

### Navigate to Frontend

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Start Frontend

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## Frontend Features

- Dashboard displaying all emails
- Status filters (All, Scheduled, Sent, Failed)
- Compose email form with date-time picker
- Automatic refresh of email status
- Minimal and clean UI using Tailwind CSS

---

## Assumptions and Trade-offs

- SQLite is used for simplicity and quick setup.
- Authentication is omitted to focus on scheduling logic.
- Ethereal Email is used instead of real SMTP for testing.
- Frontend is intentionally minimal to emphasize backend reliability.

---

## Key Highlights

- Restart-safe scheduling
- Queue-based background processing
- Clean separation of concerns
- Read-optimized dashboard APIs
- Production-style error handling and retries

---

## Author Notes

This project demonstrates backend system design, reliability, and full-stack integration using modern tools and best practices.
