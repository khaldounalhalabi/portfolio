# Khaldoun Portfolio

A personal portfolio website with a Supabase-backed admin dashboard. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and shadcn/ui. The project is organized as a monorepo with the Next.js application under `application/` and Supabase configuration/migrations under `supabase/`.

## Project Overview

- **Frontend**: Next.js 16.2.2 (App Router), React 19.2.4, TypeScript 5
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix UI primitives), custom dark theme
- **Backend/Data**: Supabase (PostgreSQL + Auth + Storage)
- **State & Forms**: TanStack Query, React Hook Form + Zod, Sonner toasts
- **Rich Text**: TipTap editor with custom extensions
- **Icons**: Lucide React + Tabler Icons
- **Charts**: Recharts
- **Package Manager**: npm
- **Repository**: https://github.com/khaldounalhalabi/portfolio

## Directory Structure

```
portfolio/
├── application/           # Next.js application
│   ├── app/               # App Router routes
│   │   ├── (portfolio)/     # Public portfolio routes (marketing site)
│   │   │   ├── contact/
│   │   │   ├── experience/
│   │   │   ├── projects/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/     # Admin dashboard routes (auth-protected)
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── request-password-reset/
│   │   │   │   ├── reset-password/
│   │   │   │   └── confirm/route.ts
│   │   │   └── dashboard/
│   │   │       ├── experiences/
│   │   │       ├── site-settings/
│   │   │       ├── skill-categories/
│   │   │       ├── user-details/
│   │   │       └── layout.tsx
│   │   ├── layout.tsx       # Root layout (fonts, providers, Toaster)
│   │   ├── page.tsx         # Home page (portfolio landing)
│   │   └── globals.css      # Tailwind CSS entry + theme variables
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (Button, Card, Sidebar, etc.)
│   │   ├── forms/           # Reusable form components (Form, FormInput, FormTiptap, etc.)
│   │   ├── tiptap/          # TipTap editor components and extensions
│   │   ├── portfolio/       # Portfolio-specific components
│   │   ├── experiences/     # Experience CRUD components
│   │   ├── site-settings/   # Site settings CRUD components
│   │   ├── skill-categories/# Skill categories CRUD components
│   │   ├── user/            # User profile components
│   │   └── providers/       # React context providers (QueryClientProvider)
│   ├── lib/
│   │   ├── supabase/        # Supabase client/server setup
│   │   ├── portfolio/       # Portfolio data queries, types, defaults, rich-text utils
│   │   └── utils.ts         # Utility functions (cn, getUserInitials, etc.)
│   ├── services/
│   │   ├── contracts/       # BaseService (generic Supabase CRUD)
│   │   ├── ExperienceService.ts
│   │   ├── SiteSettingService.ts
│   │   └── SkillCategoryService.ts
│   ├── models/              # Type aliases for Supabase table rows
│   ├── hooks/               # Custom React hooks (useResourceMutation, useMobile)
│   ├── enums/               # TypeScript enums (SiteSettingKeyEnum)
│   ├── types/               # Helper types (Path, PathValue)
│   ├── integrations/supabase/ # Supabase integration (database.types.ts, server client)
│   └── public/              # Static assets
├── supabase/                # Supabase local dev config & migrations
│   ├── migrations/            # SQL migration files (timestamped)
│   ├── seed.sql               # Seed data (admin user, projects, skill groups, contact info)
│   ├── site-settings-seeder.sql
│   ├── skill-categories-seeder.sql
│   ├── experiences-seeder.sql
│   └── config.toml            # Supabase CLI configuration
├── package.json             # Root package with workspace scripts
└── .gitignore
```

## Build and Development Commands

All commands are run from the repository root. The root `package.json` proxies to `application/`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (`next dev` inside `application/`) |
| `npm run build` | Build for production (`next build` inside `application/`) |
| `npm run start` | Start production server (`next start` inside `application/`) |
| `npm run lint` | Run ESLint (`eslint` inside `application/`) |
| `npm run db:reset` | Stop, start, and reset local Supabase DB with seeds |
| `npm run db:types` | Generate TypeScript types from local Supabase schema into `application/integrations/supabase/database.types.ts` |

Inside `application/`, you can also run `npm run dev`, `npm run build`, `npm run start`, `npm run lint` directly.

## Environment Variables

Create `application/.env` (not committed) with:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

The `.env.example` file lists the required keys. The application uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for both browser and server clients.

## Technology Stack Details

### Next.js & React
- Uses **Next.js 16.2.2** with the **App Router** (`app/` directory).
- **React 19.2.4** — note that this is a newer version than typical training data; APIs and conventions may differ.
- Server Components are used by default for data fetching (e.g., `getPortfolioData()`).
- Client Components are marked with `"use client"` for interactivity (forms, mutations, sidebar, etc.).

### Tailwind CSS & Styling
- **Tailwind CSS v4** with the new `@import "tailwindcss"` syntax.
- Custom theme variables defined in `app/globals.css` using CSS custom properties (`--background`, `--primary`, etc.).
- Dark theme is the default (`html className="dark"`).
- Custom utilities: `container-shell`, `grid-fade`, `text-glow`.
- Fonts: Inter (sans), Space Grotesk (heading) via `next/font/google`.

### shadcn/ui
- Initialized with `style: "radix-nova"`, `rsc: true`, `tsx: true`.
- Components are located in `components/ui/` and follow the `cva` (class-variance-authority) pattern.
- Aliases: `@/components/ui`, `@/lib/utils`, `@/components`, `@/hooks`.

### Supabase
- **Auth**: Email/password authentication. Auth confirmation route at `app/(dashboard)/auth/confirm/route.ts`.
- **Database**: PostgreSQL with Row Level Security (RLS) policies. Tables: `projects`, `skill_groups`, `contact_info`, `contact_links`, `experiences`, `site_settings`.
- **Storage**: `portfolio-images` bucket for project images.
- **Local Dev**: Supabase CLI with `config.toml`. Local services run on ports 54321 (API), 54322 (DB), 54323 (Studio), 54324 (Inbucket).
- **Type Generation**: `npm run db:types` generates `database.types.ts` from the local schema.

### Data Fetching & State Management
- **Server-side**: Direct Supabase client calls in Server Components (`lib/supabase/server.ts`, `integrations/supabase/server.ts`).
- **Client-side**: `@supabase/ssr` browser client (`lib/supabase/client.ts`) for auth and mutations.
- **TanStack Query**: Used for client-side mutations with automatic cache invalidation via `useResourceMutation` hook.
- **React Hook Form + Zod**: All forms use `Form` component (`components/forms/form.tsx`) with Zod validation and `zodResolver`.

### Service Layer
- `BaseService` (`services/contracts/BaseService.ts`) provides generic CRUD operations (`all`, `show`, `store`, `update`, `delete`, `indexWithPagination`) typed against Supabase table rows.
- Concrete services (`ExperienceService`, `SiteSettingService`, `SkillCategoryService`) extend `BaseService` and specify their table name.
- Services use the singleton pattern via `static make()`.

## Code Style Guidelines

- **Language**: TypeScript with strict mode enabled (`tsconfig.json`).
- **Imports**: Use path aliases (`@/components`, `@/lib`, `@/services`, etc.).
- **Components**: Functional components with explicit return types when exported. Props interfaces use `React.ComponentProps` or custom interfaces.
- **Styling**: Tailwind utility classes. Use `cn()` from `lib/utils.ts` for conditional class merging.
- **Forms**: Always use the `Form` wrapper component with Zod validation. Use `FormInput`, `FormTiptap`, `FormDatepicker`, etc. for fields.
- **Icons**: Prefer `lucide-react` icons.
- **Server-only code**: Mark server-only modules with `"server-only"` import (e.g., `lib/portfolio/queries.ts`).

## Testing

There are currently **no automated tests** (no Jest, Vitest, or Playwright configuration found). Testing is manual via the dev server and Supabase Studio.

## Security Considerations

- **RLS Policies**: All public tables have RLS enabled. Public read access is granted via `FOR SELECT USING (true)` policies. Write access requires authentication.
- **Auth**: Password-based auth with Supabase. Session management via cookies (`lib/supabase/proxy.ts` middleware pattern).
- **Sanitization**: Rich text content is sanitized with `sanitize-html` before rendering (`lib/portfolio/rich-text.ts`). Allowed tags are restricted to safe HTML elements.
- **Environment Variables**: Never commit `.env` or Supabase service role keys. The `.gitignore` excludes `.env` files.
- **Image Domains**: `next.config.ts` dynamically allows the Supabase storage hostname for Next.js Image optimization.

## Deployment

The project is designed for deployment on **Vercel** (standard Next.js deployment). The Supabase backend is hosted separately. Ensure environment variables are configured in the deployment platform.

## Important Notes for Agents

- This is **Next.js 16 / React 19** — APIs and file structure may differ from older versions. Always check the current codebase patterns before writing new code.
- The `BaseService` pattern is central to data mutations. When adding new tables, create a model type alias, a service extending `BaseService`, and use it in components.
- When adding new form fields, use the existing `Form*` components in `components/forms/` rather than raw inputs.
- The portfolio data has **default fallbacks** (`lib/portfolio/default-content.ts`) so the site renders even if Supabase is unavailable.
- The dashboard uses a sidebar layout (`components/app-sidebar.tsx`) with navigation items defined inline. Add new dashboard sections there.
- Always regenerate Supabase types after schema changes: `npm run db:types`.
