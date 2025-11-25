Academy Assignment 4 – User Management App
Overview

This project is a User Management web application built with React and TypeScript. It demonstrates how to build a secure and responsive admin dashboard using modern React tooling. The app includes authentication, CRUD operations for users (create, read, update, delete), search, optimistic updates, and a clean user interface with dark‑mode support. It was designed as part of an academy assignment and uses a mock API for local development.

Key Features
Feature	Description
Login & Protected Routes	Users must log in to access the dashboard. The app stores a JWT in local storage, checks its expiration on each page load, and redirects unauthenticated users to the login page
raw.githubusercontent.com
.
Dashboard	After logging in, users land on a dashboard that displays a list of all users. It includes a search bar and quick actions for editing or deleting records
raw.githubusercontent.com
raw.githubusercontent.com
.
Create User	An “Add User” page features a form for entering first name, last name, email, date of birth and status. Unsaved changes are stored as a draft in localStorage, and the form uses React Hook Form and Zod for validation
raw.githubusercontent.com
raw.githubusercontent.com
.
Edit & Update User	The “Edit User” page pre‑populates the form with existing data and performs optimistic updates. Users can reset the form to the current server state, and there is robust error handling with retry options
raw.githubusercontent.com
raw.githubusercontent.com
.
Delete & Confirm	A delete action triggers a confirmation modal; successful deletions show toast notifications and the user list updates automatically
raw.githubusercontent.com
.
Search & Prefetch	The user list includes a search input that filters by name, and hovering over an Edit button prefetches the user data to speed up navigation
raw.githubusercontent.com
.
Dark‑Mode Toggle	A simple toggle, stored in local storage, switches between light and dark themes across the whole app
raw.githubusercontent.com
.
State Management	Authentication and theme state are managed with Zustand stores
raw.githubusercontent.com
raw.githubusercontent.com
, while server interactions use React Query hooks that handle caching, optimistic updates and error handling
raw.githubusercontent.com
raw.githubusercontent.com
.
Mock API & Error Handling	The app integrates with a mock backend via vite-plugin-mock. API functions add auth headers and handle 401 errors by logging the user out automatically
raw.githubusercontent.com
raw.githubusercontent.com
.
Tech Stack

The project relies on the following libraries and tools:

React 19 with TypeScript – the foundation of the UI

Vite – fast dev server and build tool

React Router v7 – routing and route protection
raw.githubusercontent.com

Tailwind CSS – responsive styling and utility classes

React Hook Form & Zod – forms and schema validation
raw.githubusercontent.com

Zustand – lightweight state management for auth and theme toggles
raw.githubusercontent.com
raw.githubusercontent.com

@tanstack/react-query – data fetching, caching, optimistic updates
raw.githubusercontent.com
raw.githubusercontent.com

date-fns – date parsing and formatting

React Hot Toast – notifications on success or error events

Vite Plugin Mock – provides a mock REST API during development

Project Structure
Academy-Assignment-4/
├── src/
│   ├── api/              # API client functions and auth helpers:contentReference[oaicite:22]{index=22}:contentReference[oaicite:23]{index=23}
│   ├── components/       # Reusable UI components (organisms, molecules and atoms)
│   ├── hooks/            # React Query hooks for CRUD and prefetching:contentReference[oaicite:24]{index=24}
│   ├── layouts/          # Layouts for auth pages and dashboard
│   ├── pages/            # Page components such as Login, Dashboard, Add/Edit User
│   ├── router/           # Route definitions and lazy loading:contentReference[oaicite:25]{index=25}
│   ├── schemas/          # Zod schemas for form validation
│   ├── store/            # Zustand stores for auth and theme:contentReference[oaicite:26]{index=26}:contentReference[oaicite:27]{index=27}
│   ├── types/            # TypeScript interfaces and types
│   └── utils/            # Utility functions (e.g., debounce)
├── mock/                 # Mock API handlers and static data
├── public/
│   └── index.html        # HTML template
└── package.json          # Scripts and dependencies:contentReference[oaicite:28]{index=28}

Getting Started

Follow these steps to run the project locally:

Clone the repository

git clone https://github.com/mariok56/Academy-Assignment-4.git
cd Academy-Assignment-4


Install dependencies

npm install


Start the development server

npm run dev


The app will run on http://localhost:5173 by default. The mock API will also be available automatically via Vite.

Build for production

npm run build


The optimized build will be output to the dist directory.

Environment Variables

This project doesn’t require a real backend during development. The mock API is configured in vite.config.ts. If you decide to connect to a real backend, you can supply environment variables (e.g. VITE_API_URL) in a .env file. See src/api/userApi.ts for how headers and base URLs are defined
raw.githubusercontent.com
.

Contributing

Contributions are welcome! If you spot a bug or have a feature request, open an issue or a pull request. When submitting a PR, please:

Create a descriptive branch name.

Follow the existing code style and include relevant tests if applicable.

Add or update the README if your changes affect usage.

License

This project is provided for educational purposes as part of an academy assignment and does not have an explicit open‑source license. Please contact the repository owner for permissions beyond personal use.
