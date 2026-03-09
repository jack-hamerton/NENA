# NENA - Frontend Client

This directory contains the frontend web application for NENA (Network for Empowerment & Navigation Application), an anonymous, peer-to-peer social networking platform designed for young adults in Sub-Saharan Africa.

##  Technologies Used

The frontend is built with a modern, high-performance web stack:

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State & Data Fetching:** React Context, [Axios](https://axios-http.com/)
- **Real-time:** [Socket.IO Client](https://socket.io/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Validation:** [Zod](https://zod.dev/)
- **Charts:** [Chart.js](https://www.chartjs.org/) & `react-chartjs-2`

## 📁 Project Structure

The project follows a scalable, domain-driven directory structure located entirely within the `src/` folder:

```text
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── (app)/            # Authenticated application routes (Home, Discover, Messages, etc.)
│   ├── (auth)/           # Authentication routes (Login, Signup)
│   ├── globals.css       # Global styles and Tailwind entry point
│   ├── layout.tsx        # Root application layout
│   └── page.tsx          # Public landing page
├── components/           # Reusable React components
│   ├── analytics/        # Analytics charts and metric cards
│   ├── auth/             # Login and signup forms
│   ├── feed/             # Activity feed, post cards, and post creation
│   ├── layout/           # App shell, sidebar, topbar, and mobile navigation
│   ├── messages/         # Chat interfaces
│   ├── modals/           # Global modals (Campaign Hub, Create Post, Intents)
│   ├── podcasts/         # Audio player interfaces
│   ├── profile/          # User profile headers and stat displays
│   ├── rooms/            # Live audio/video room layouts
│   └── ui/               # Base UI primitives (shadcn/ui configured)
├── context/              # React Context Providers (AuthContext, ThemeContext)
├── hooks/                # Custom React hooks (useAuth, useLocalStorage, useMediaQuery)
├── lib/                  # Utility functions
│   ├── api.ts            # Axios instance and interceptors
│   ├── constants.ts      # Global constants and configuration
│   ├── utils.ts          # Helper functions (Tailwind class merging, formatting)
│   └── validators.ts     # Zod validation schemas
├── services/             # API communication layer
│   └── *.service.ts      # Service files for discrete domains (auth, post, user, etc.)
└── types/                # Core TypeScript interfaces and type definitions
```

##  Core Features & Layouts

### 1. Unified App Shell
The application utilizes an `AppShell` layout component (`src/components/layout/AppShell.tsx`) wrapping all authenticated `(app)` routes. This consistently provides:
- A persistent **Sidebar** navigation for desktop users (`Sidebar.tsx`).
- A top action bar (`Topbar.tsx`).
- A persistent **Mobile Navigation** menu for screen sizes below `1024px` (`MobileNav.tsx`).

### 2. Route Groups
We heavily utilize Next.js Route Groups (`()`) to organize code without affecting the URL architecture:
- `(auth)`: Groups the public-facing authentication pages, enforcing a different layout structure devoid of the standard app navigation.
- `(app)`: The core application surface area requiring an authenticated session.

### 3. Theme System
NENA ships with a custom, highly curated theme system defined in `globals.css` utilizing OKLCH color spaces for optimal vibrancy and dynamic light/dark mode support. 
Theme variants specifically for NENA branding (like the `nena` button and badge variants) implement custom gradients and shadows.

### 4. API Service Layer
All network communications are decoupled from the UI components and housed within `src/services`. They rely on `src/lib/api.ts` which provides a pre-configured Axios instance that automatically intercepts requests to attach Authorization tokens.

##  Getting Started

### Prerequisites
- Node.js (v18.17+ recommended)
- npm or pnpm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Copy the example environment file and configure it to point to your local backend.
   ```bash
   cp .env.local.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##  Code Quality Scripts

- `npm run build`: Creates an optimized production build.
- `npm run type-check`: Validates all TypeScript types across the client.
- `npm run lint`: Runs ESLint to check for code standard violations.
