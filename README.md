# Smart Digital Society Management System

A production-ready MERN stack foundation for managing residential societies digitally.

## Tech Stack

| Layer    | Technology        |
| -------- | ----------------- |
| Frontend | React, Vite       |
| Backend  | Node.js, Express  |

## Project Structure

```
smart-digital-society-management-system/
├── client/        # React + Vite frontend
├── server/        # Node.js + Express backend
├── docs/          # Project documentation
├── prompts/       # AI / development prompts
├── screenshots/   # UI screenshots
└── README.md
```

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

## Getting Started

### 1. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 2. Configure environment

```bash
cd server
copy .env.example .env
```

### 3. Run development servers

**Backend** (port 5000):

```bash
cd server
npm run dev
```

**Frontend** (port 5173):

```bash
cd client
npm run dev
```

### 4. Verify

- Frontend: http://localhost:5173
- API health: http://localhost:5000/api/health

## Scripts

### Client

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |

### Server

| Command       | Description             |
| ------------- | ----------------------- |
| `npm run dev` | Start with nodemon      |
| `npm start`   | Start production server |

## License

ISC
