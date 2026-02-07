# Inventory Management Application

A full-stack inventory management system built with NestJS (TypeScript) backend, React (TypeScript) frontend, and PostgreSQL database. Features complete Store and Product management with advanced filtering, pagination, inventory analytics, and a modern web interface.

## Quick Start

### Configure environment

1. **Create environment file in `inventory-backend/` Directory:**

```env
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USER=inventory_user
DB_PASSWORD=inventory_password
DB_NAME=inventory_db
DB_SYNC=true
DB_SSL=false

# Storage provider: cloudinary | s3
DEFAULT_STORAGE=cloudinary

# Cloudinary (used when DEFAULT_STORAGE=cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AWS S3 (used when DEFAULT_STORAGE=s3)
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_bucket_name
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
```

**Note:** Replace the Cloudinary credentials (or S3 credentials) with your actual values.

2. **Create environment file in `inventory-frontend/` Directory :**

```env
VITE_API_URL=http://localhost:3000
```

### Using Docker (Recommended)

The easiest way to run the entire application:

**Note:** The `.env` file is loaded by Docker and keeps sensitive data out of `docker-compose.yml`.

1. **Start the application:**
   ```bash
   docker compose up --build
   ```

This will:

- Start a PostgreSQL database container
- Build and start the NestJS backend API
- Build and start the React frontend
- Automatically seed the database with sample stores and products
- Make the API available at `http://localhost:3000`
- Make the frontend available at `http://localhost:3001`

### Manual Setup

#### Backend Setup

1. **Prerequisites:**
   - Node.js 18+
   - PostgreSQL 15+

2. **Install dependencies:**

   ```bash
   cd inventory-backend
   npm install
   ```

3. **Start PostgreSQL** (if not using Docker)

4. **Run the backend:**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000` and seed data will be automatically loaded on first startup.

#### Frontend Setup

1. **Prerequisites:**
   - Node.js 18+
   - Backend API running (see Backend Setup above)

2. **Install dependencies:**

   ```bash
   cd inventory-frontend
   npm install
   ```

3. **Run the frontend:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3001` (or the port specified in Vite config).

**Note:** Make sure the backend API is running and accessible at the URL specified in `VITE_API_URL` (default: `http://localhost:3000`).

## Features

### Frontend Features

- **Product Management**
  - List view with advanced filtering (category, price range, quantity range, store, search)
  - Pagination support
  - Product detail view (read-only)
  - Create, update, and delete products
  - Image upload support for products
  - Form validation with clear error messages

- **Store Management**
  - List view with all stores
  - Store detail view (read-only)
  - Create, update, and delete stores
  - Form validation

- **User Experience**
  - Loading states for async operations
  - Error handling with user-friendly messages
  - Responsive design
  - Navigation between Products and Stores
  - View/Edit mode toggle for details pages

### Backend Features

- **Store Management**: Full CRUD operations
- **Product Management**: Full CRUD with image upload support
- **Advanced Filtering**: Category, price range, quantity range, store filter, and text search
- **Pagination**: Efficient pagination with metadata
- **Inventory Analytics**: Store inventory summary with aggregations
- **Image Storage**: Support for Cloudinary and AWS S3

## API Endpoints

### Stores

- `GET /store` - List all stores
- `GET /store/:id` - Get store details
- `GET /store/:id/inventory-summary` - Get inventory analytics
- `POST /store` - Create a new store
- `PUT /store/:id` - Update a store
- `DELETE /store/:id` - Delete a store

### Products

- `GET /product?category=Electronics&minPrice=10&maxPrice=100&limit=10&offset=0` - List products with filtering and pagination
- `GET /product/:id` - Get product details
- `POST /product` - Create a new product (multipart/form-data with optional image)
- `PUT /product/:id` - Update a product (multipart/form-data with optional image)
- `DELETE /product/:id` - Delete a product

**Example Product Filter Query:**

```
GET /product?category=Electronics&minPrice=50&maxPrice=500&storeId=1&limit=20&offset=0&search=laptop
```

### Miscellaneous

- `GET /miscellaneous/currency/list` - Get list of available currencies

## Decisions & Trade-offs

### Backend Architecture

**Framework Choice: NestJS**

- Chose NestJS for its modular architecture, TypeScript-first approach, and built-in dependency injection
- Provides excellent structure for scalable applications
- Strong TypeORM integration for database operations

**Database: PostgreSQL**

- Selected PostgreSQL for its robustness, ACID compliance, and advanced querying capabilities
- Better suited for production than SQLite for concurrent operations
- TypeORM provides excellent PostgreSQL support with query builder

**Query Builder in Repositories**

- All complex queries (filtering, pagination, aggregations) use TypeORM Query Builder
- Keeps business logic in services, data access patterns in repositories
- Enables efficient SQL generation and type safety

**Validation: Zod**

- Using Zod for runtime validation with `nestjs-zod`
- Provides type-safe DTOs and automatic validation
- Better developer experience than class-validator

**Seed Data Strategy**

- Seed data loads automatically on application startup via `OnModuleInit`
- Only seeds if tables are empty (idempotent)
- Ensures reviewers can immediately interact with the system

### Frontend Architecture

**Framework Choice: React with TypeScript**

- React for component-based UI development and large ecosystem
- TypeScript for type safety and better developer experience
- Vite for fast development and optimized production builds

**State Management**

- React hooks (useState, useEffect) for local component state
- No global state management library (Redux/Zustand) - not needed for current scope
- API calls handled through a centralized service layer

**Routing: React Router**

- Client-side routing with React Router v6
- Clean URL structure (`/products`, `/products/new`, `/products/:id`)
- Navigation component for easy switching between Products and Stores

**API Integration**

- Axios for HTTP requests with centralized error handling
- Type-safe API service layer with TypeScript interfaces
- Automatic error transformation for consistent error display

**UI/UX Decisions**

- View/Edit mode separation: Details pages show read-only view first, edit on demand
- Loading states: Spinner component for async operations
- Error boundaries: Catches React errors to prevent blank pages
- Form validation: Client-side validation with clear error messages
- Responsive design: Works on desktop and mobile devices

### Non-trivial Operation

**Inventory Summary Endpoint** (`GET /store/:id/inventory-summary`)

- Calculates total products, total items, total inventory value, and average product price
- Groups products by category with counts and quantities
- Uses SQL aggregations (SUM, COUNT, AVG) for efficient computation
- Demonstrates complex query building beyond basic CRUD

### Filtering & Pagination

**Product List Endpoint**

- Implements comprehensive filtering: category, price range, quantity range, store, and text search
- Pagination with `limit` and `offset` parameters
- Returns pagination metadata (total, totalPages, current offset/limit)
- All filtering logic uses Query Builder in the repository layer

### Trade-offs Made

1. **Simple State Management**: Using React hooks instead of Redux/Zustand - sufficient for current scope, but could be enhanced for larger applications
2. **Synchronous Seed**: Seed data runs synchronously on startup - acceptable for small datasets, but could be async for larger seeds
3. **Basic Error Handling**: Error handling with user-friendly messages - production would benefit from error tracking (Sentry, etc.)
4. **No Authentication**: Currently no auth system

## Project Structure

```
inventory-app/
├── inventory-backend/          # NestJS Backend
│   ├── src/
│   │   ├── module/
│   │   │   ├── store/          # Store module (CRUD + inventory summary)
│   │   │   ├── product/        # Product module (CRUD + filtering/pagination)
│   │   │   └── miscellaneous/  # Miscellaneous operations (seeding, currencies)
│   │   ├── shared/
│   │   │   ├── config/         # Database, environment configuration
│   │   │   ├── global/
│   │   │   │   ├── model/
│   │   │   │   │   ├── entities/      # TypeORM entities
│   │   │   │   │   ├── repositories/  # Data access repositories
│   │   │   │   │   └── seeds/         # Seed data
│   │   │   │   ├── schemas/           # Zod validation schemas
│   │   │   │   └── enums/             # TypeScript enums
│   │   │   └── util/                  # Utility functions
│   │   └── main.ts                   # Application entry point
│   ├── Dockerfile
│   └── package.json
│
├── inventory-frontend/          # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorDisplay.tsx
│   │   │   └── Loading.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── StoreList.tsx
│   │   │   └── StoreDetail.tsx
│   │   ├── services/           # API service layer
│   │   │   └── api.ts
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── App.tsx             # Main app component with routing
│   │   └── main.tsx            # Application entry point
│   ├── Dockerfile
│   ├── nginx.conf              # Nginx configuration
│   └── package.json
│
├── docker-compose.yml           # Docker orchestration
└── README.md
```
