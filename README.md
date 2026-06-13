# Notes Manager

## Project Overview

This repository contains a Notes Manager application with separate frontend and backend projects inside `notes-manager/frontend` and `notes-manager/backend`.

## Prerequisites

- Node.js installed (recommended version 18+)
- npm available on the command line
- Angular CLI installed globally if you plan to run frontend commands directly: `npm install -g @angular/cli`

Use the following admin login to access the app:

- Username: `admin`
- Password: `admin123`

## Setup

Install dependencies for the root project and both workspaces:

```bash
npm install
cd notes-manager/backend && npm install
cd ../frontend && npm install
```

> Alternatively, install backend and frontend dependencies directly with `npm install --prefix notes-manager/backend` and `npm install --prefix notes-manager/frontend`.

## Workflow Commands

### Root commands

From the repository root:

```bash
npm run start
npm run start:backend
npm run start:frontend
```

- `npm run start` - starts both backend and frontend together using `concurrently`.
- `npm run start:backend` - starts only the backend server.
- `npm run start:frontend` - starts only the Angular frontend.

### Backend commands

From `notes-manager/backend`:

```bash
npm start
```

This runs the backend server with:

```bash
node server.js
```

### Frontend commands

From `notes-manager/frontend`:

```bash
npm start
npm run build
npm run watch
npm test
```

- `npm start` - runs `ng serve` to start the Angular development server.
- `npm run build` - builds the production frontend.
- `npm run watch` - builds continuously in development mode.
- `npm test` - runs frontend tests using the Angular test runner.

## Admin Credentials



## Notes

- The backend is implemented with Express and Mongoose.
- The frontend is implemented with Angular.
- When using the root `npm run start`, both services must have their dependencies installed.
