# Wasla Platform

The "Wasla" platform is a modern web application built using the latest frontend technologies to provide a seamless and contemporary user experience. The platform aims to facilitate communication, contract creation, and the management of projects and posts.

## 🚀 Tech Stack

This project is built relying on a stack of top-tier modern libraries and frameworks:

- **Core Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Programming Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching:** [React Query (@tanstack/react-query)](https://tanstack.com/query/latest)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Typography:** Cairo Font (`@fontsource/cairo`) for excellent Arabic language support.
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Real-time Communication:** [Socket.io-client](https://socket.io/) (For messaging and notifications)
- **Carousels:** [Swiper](https://swiperjs.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🌟 Key Features

The codebase is organized based on a Feature-based Architecture to ensure easy maintenance and scalability. The project includes the following features:

- **Auth:** Secure user login and registration.
- **Home:** Landing page showcasing customized posts and recommendations.
- **Posts:** Creation and display of posts and project cards.
- **Contracts:** Creation, management, and tracking of contracts between parties to guarantee rights.
- **Messages:** Real-time chat system for communication between users.
- **Notifications:** Instant alerts for users regarding important updates.
- **Profile & User-Profile:** Management of user data and their portfolio.
- **Search:** A search engine for quick access to projects and users.
- **Reviews:** A rating system to build trust and reliability.
- **Skills:** Management, display, and filtering of user skills.

## 📂 Folder Structure

```text
wasla/
├── public/             # Images and static assets
├── src/
│   ├── app/            # App routes and pages (Next.js App Router)
│   ├── components/     # Shared global UI components
│   ├── features/       # Components and logic grouped by feature (Posts, Contracts, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API calls and server communication functions
│   ├── styles/         # Global styles (globals.css)
│   ├── utils/          # Helper functions
│   ├── proxy.ts        # Proxy configuration for server connections
│   ├── tokens.ts       # Design tokens
│   └── types.ts        # TypeScript Interfaces/Types definitions
├── .env.local          # Environment Variables
├── tailwind.config.ts  # Tailwind CSS configuration
└── package.json        # Project details and dependencies
```

## 🛠️ Getting Started (Development Environment)

### Prerequisites
- Install [Node.js](https://nodejs.org/) (Version 18 or higher).
- Use `npm` package manager.

### Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```

3. **View the Application:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 📜 Available Scripts

- `npm run dev`: Starts the application in development mode.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server after building.
- `npm run lint`: Checks for code errors and formats the code using ESLint.
- `npm run typecheck`: Ensures the project is free of TypeScript errors.
