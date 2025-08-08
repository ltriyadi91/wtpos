# WTPOS - Web-based Invoice System

A modern, full-stack Invoice Creator built with Next.js, Node.js, and PostgreSQL.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **UI Components**: Mantine UI

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: RESTful API
- **Containerization**: Docker

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL
- **Environment Management**: Dotenv

## Project Structure

```
wtpos/
├── backend/              # Backend server
│   ├── prisma/           # Database schema and migrations
│   ├── src/              # Source code
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   ├── .env              # Environment variables
│   ├── be.dockerfile     # Backend Dockerfile
│   └── package.json      # Backend dependencies
│
├── frontend/             # Frontend application
│   ├── public/           # Static files
│   ├── src/              # Source code
│   │   ├── app/          # Next.js app directory
│   │   ├── components/   # Reusable components
│   │   ├── lib/          # Utility functions
│   │   └── styles/       # Global styles
│   ├── fe.dockerfile     # Frontend Dockerfile
│   └── package.json      # Frontend dependencies
│
├── compose.yaml          # Docker Compose configuration
```

## Local Development with Docker Compose

### Prerequisites
- Docker and Docker Compose installed
- Node.js (for local development without Docker)

### Quick Start


1. Start all services:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - PostgreSQL: localhost:5632

### Or Using Manual Development Commands

#### Backend
- Make sure you already running the PostgreSQL at local
  Or just install using docker just use docker compose only db
    ```bash
    docker compose up -d db
    ```

- Install dependencies:
  ```bash
  cd backend
  pnpm install
  ```

- Run generate prisma client:
  ```bash
  npx prisma generate
  ```

- Run database existing migrations:
  ```bash
  npx prisma migrate reset
  ```

- Start development server:
  ```bash
  pnpm dev
  ```

#### Frontend
- Install dependencies:
  ```bash
  cd frontend
  pnpm install
  ```

- Start development server:
  ```bash
  pnpm dev
  ```

## API Endpoints

### Products
- `GET /api/products/seacr/q=design` - Search product by search query
- `GET /api/products/:id` - Get product by ID

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices/revenue?range=week` - Get invoice revenue by range

## Frontend Pages

### Dashboard
- `/dashboard` - Main dashboard with sales overview
- `/invoices/new` - Invoice management

## Environment Variables

### Backend
Create a `.env` file in the `backend` directory with the following variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5632/postgres?schema=public"
NODE_ENV=development
PORT=4000
```

### Frontend
Create a `.env` file in the `frontend` directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_NODE_ENV=development
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
