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
client/
├── .env.local.example
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
│
├── public/
│   ├── favicon.ico
│   ├── icons/
│   ├── images/
│   └── sounds/
│
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── loading.tsx
    │   ├── not-found.tsx
    │   ├── page.tsx                    # Landing page
    │   │
    │   ├── (auth)/
    │   │   ├── layout.tsx
    │   │   ├── login/page.tsx
    │   │   └── signup/page.tsx
    │   │
    │   └── (app)/
    │       ├── layout.tsx              # App shell
    │       ├── home/page.tsx
    │       ├── discover/page.tsx
    │       ├── messages/
    │       │   ├── page.tsx
    │       │   └── [conversationId]/page.tsx
    │       ├── rooms/
    │       │   ├── page.tsx
    │       │   └── [roomId]/page.tsx
    │       ├── podcasts/
    │       │   ├── page.tsx
    │       │   └── [podcastId]/page.tsx
    │       ├── profile/[userId]/page.tsx
    │       ├── analytics/page.tsx
    │       ├── calendar/page.tsx
    │       ├── study/page.tsx
    │       ├── settings/page.tsx
    │       └── notifications/page.tsx
    │
    ├── components/
    │   ├── ui/                         # shadcn/ui primitives
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── input.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── skeleton.tsx
    │   │   └── ...
    │   │
    │   ├── layout/
    │   │   ├── AppShell.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── Topbar.tsx
    │   │   └── MobileNav.tsx
    │   │
    │   ├── auth/
    │   │   ├── LoginForm.tsx
    │   │   └── SignupForm.tsx
    │   │
    │   ├── feed/
    │   │   ├── FeedSwiper.tsx
    │   │   ├── PostCard.tsx
    │   │   ├── CreatePost.tsx
    │   │   └── FeedFilters.tsx
    │   │
    │   ├── messages/
    │   │   ├── ConversationList.tsx
    │   │   ├── ChatBubble.tsx
    │   │   └── MessageInput.tsx
    │   │
    │   ├── rooms/
    │   │   ├── RoomCard.tsx
    │   │   └── ControlsBar.tsx
    │   │
    │   ├── podcasts/
    │   │   ├── PodcastCard.tsx
    │   │   └── AudioPlayer.tsx
    │   │
    │   ├── profile/
    │   │   ├── ProfileHeader.tsx
    │   │   └── ProfileStats.tsx
    │   │
    │   ├── analytics/
    │   │   ├── StatsCards.tsx
    │   │   └── EngagementChart.tsx
    │   │
    │   ├── discover/
    │   │   ├── SearchBar.tsx
    │   │   └── TrendingTopics.tsx
    │   │
    │   └── notifications/
    │       ├── NotificationList.tsx
    │       └── NotificationItem.tsx
    │
    ├── context/
    │   ├── AuthContext.tsx
    │   ├── ThemeContext.tsx
    │   └── index.tsx
    │
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── useDebounce.ts
    │   └── useLocalStorage.ts
    │
    ├── lib/
    │   ├── utils.ts              # cn() helper
    │   ├── api.ts                # Axios instance
    │   ├── constants.ts           # App constants
    │   └── validators.ts         # Zod schemas
    │
    ├── services/
    │   ├── auth.service.ts
    │   ├── post.service.ts
    │   ├── user.service.ts
    │   ├── chat.service.ts
    │   ├── room.service.ts
    │   ├── podcast.service.ts
    │   ├── analytics.service.ts
    │   ├── notification.service.ts
    │   └── mocks/
    │       ├── index.ts
    │       ├── users.mock.ts
    │       ├── posts.mock.ts
    │       ├── conversations.mock.ts
    │       ├── rooms.mock.ts
    │       ├── podcasts.mock.ts
    │       └── notifications.mock.ts
    │
    └── types/
        ├── api.ts                # ApiResponse, PaginatedResponse
        ├── auth.ts               # User, AuthState
        ├── post.ts               # Post, Comment
        ├── chat.ts               # Conversation, Message
        ├── room.ts               # Room, Participant
        ├── podcast.ts            # Podcast, Episode
        ├── analytics.ts          # DashboardMetrics
        └── calendar.ts           # CalendarEvent
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
