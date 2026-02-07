# Inventory Frontend

React TypeScript frontend for the Inventory Management Application.

## Features

- **Product List View**: Browse products with filtering and pagination
- **Product Detail/Edit View**: Create and edit products with form validation
- **Loading States**: Graceful loading indicators
- **Error Handling**: Clear error messages and retry functionality
- **Image Upload**: Support for product images
- **Responsive Design**: Works on desktop and mobile devices

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3001`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Docker

The frontend is included in the docker-compose setup. To run everything:

```bash
docker compose up --build
```

The frontend will be available at `http://localhost:3001`
