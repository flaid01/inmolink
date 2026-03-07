# InmoLink Real Estate Platform - Project Context

## Project Overview
InmoLink is a modern real estate platform designed for property management, discovery, and professional agent-client interactions. It features a robust real-time backend and a highly interactive frontend.

- **Purpose:** Facilitate property listing, searching, comparing, and lead management for buyers and agents.
- **Core Features:**
    - **Property Search:** Map-based and list-based search with advanced filtering.
    - **Comparisons:** Side-by-side property comparison tool.
    - **Favorites:** User-specific saved properties.
    - **Agent Dashboard:** Management interface for listings, inquiries, and analytics.
    - **User Profiles:** Extended profiles for both regular users and real estate agents.
    - **Inquiries:** Lead generation system connecting buyers with agents.
    - **Document Management:** Secure storage for property-related documents (deeds, contracts, etc.).

## Tech Stack
- **Frontend:**
    - **Framework:** React 19 (TypeScript)
    - **Build Tool:** Vite
    - **Styling:** Tailwind CSS
    - **Notifications:** Sonner
    - **State Management:** Convex React hooks for real-time data.
- **Backend (Convex):**
    - **Database:** Convex (document-based with transactional queries).
    - **Authentication:** `@convex-dev/auth` (integrated with Convex).
    - **File Storage:** Convex Storage for images and documents.
    - **Runtime:** Convex V8 runtime (and Node.js for specific actions).

## Architecture
- **Monorepo-like structure:** Backend logic resides in the `convex/` directory, while the frontend is in `src/`.
- **Data Model:** Defined in `convex/schema.ts` with comprehensive tables for `properties`, `favorites`, `comparisons`, `inquiries`, `propertyViews`, `savedSearches`, `reviews`, `notifications`, `userProfiles`, and `propertyDocuments`.
- **Navigation:** View-based routing in `App.tsx` (`map`, `list`, `property`, `comparison`, `dashboard`, `profile`).

## Building and Running

### Development
To start both the frontend and backend in development mode:
```bash
npm run dev
```
This runs `npm-run-all --parallel dev:frontend dev:backend`.

### Backend Only
```bash
npx convex dev
```

### Frontend Only
```bash
npx vite --open
```

### Production Build
```bash
npm run build
```

### Linting and Type Checking
```bash
npm run lint
```
(Runs `tsc` for both convex and project, plus `convex dev --once` and `vite build`).

## Development Conventions

### Convex Best Practices
- **Function Syntax:** Use the latest syntax from `convex/_generated/server`.
- **Validation:** Always include `v` validators for all function arguments.
- **Indexing:** Never use `.filter()` in queries. Use indexes defined in `schema.ts` with `.withIndex()`.
- **Naming:** Index names should follow the `by_field1_and_field2` convention.
- **Internal Functions:** Use `internalQuery`, `internalMutation`, and `internalAction` for private logic.

### TypeScript
- **Strict Typing:** Use `Id<"tableName">` for document IDs instead of generic strings.
- **Data Model Types:** Use `Doc<"tableName">` for document types.

### UI/UX
- **Components:** Modular components located in `src/components/`.
- **Utility:** Tailwind CSS for all styling; avoid custom CSS unless necessary.
- **Feedback:** Use `sonner` for toast notifications.

## Key Files
- `convex/schema.ts`: The source of truth for the database structure.
- `convex/auth.ts`: Authentication configuration.
- `src/App.tsx`: Main entry point and view orchestration.
- `src/components/`: Core UI modules (MapView, PropertyList, AgentDashboard, etc.).
- `.cursor/rules/convex_rules.mdc`: Specific AI instructions for Convex development.
