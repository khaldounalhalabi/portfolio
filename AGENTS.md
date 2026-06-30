# Khaldoun Portfolio

A personal portfolio website with a Supabase-backed admin dashboard. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and shadcn/ui. The project is organized as a monorepo-style layout with the Next.js application under `application/` and Supabase local configuration/migrations under `supabase/`.

## Project Overview

- **Frontend**: Next.js 16.2.9 (App Router), React 19.2.4, TypeScript 5
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix UI primitives), custom dark theme
- **Backend/Data**: Supabase (PostgreSQL + Auth + Storage)
- **State & Forms**: TanStack Query, React Hook Form + Zod, Sonner toasts
- **Rich Text**: TipTap editor with custom extensions
- **Icons**: Lucide React (with a development stub) + Tabler Icons
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Drag-and-Drop**: @dnd-kit (core, sortable, utilities)
- **Screenshot Capture**: ScreenshotOne API SDK for project images
- **Package Manager**: npm
- **Repository**: https://github.com/khaldounalhalabi/portfolio

## Directory Structure

```
portfolio/
├── application/           # Next.js application (main package)
│   ├── app/               # App Router routes
│   │   ├── (portfolio)/     # Public portfolio routes
│   │   │   ├── contact/
│   │   │   ├── experience/
│   │   │   ├── projects/
│   │   │   │   └── [slug]/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx     # Portfolio landing page
│   │   ├── (dashboard)/     # Admin dashboard routes (auth-protected)
│   │   │   ├── auth/
│   │   │   │   ├── confirm/route.ts
│   │   │   │   ├── login/
│   │   │   │   ├── request-password-reset/
│   │   │   │   └── reset-password/
│   │   │   └── dashboard/
│   │   │       ├── experiences/
│   │   │       ├── projects/
│   │   │       │   └── actions.ts   # Server action for ScreenshotOne captures
│   │   │       ├── site-settings/
│   │   │       ├── skill-categories/
│   │   │       ├── skills/
│   │   │       ├── user-details/
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── layout.tsx       # Root layout (fonts, providers, Toaster)
│   │   └── globals.css      # Tailwind CSS entry + theme variables
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (31+ components)
│   │   ├── forms/           # Reusable form components (Form, FormInput, FormTiptap, etc.)
│   │   ├── tiptap/          # TipTap editor components and extensions
│   │   ├── motion/          # Reusable Framer Motion animation wrappers
│   │   ├── portfolio/       # Portfolio-specific components
│   │   ├── projects/        # Project CRUD components
│   │   ├── experiences/     # Experience CRUD components
│   │   ├── site-settings/   # Site settings CRUD components
│   │   ├── skill-categories/# Skill categories CRUD components
│   │   ├── skills/          # Skills CRUD components
│   │   ├── user/            # User profile components
│   │   └── providers/       # React context providers (QueryClientProvider, AuthProvider, SiteSettingsProvider)
│   ├── lib/
│   │   ├── supabase/        # Supabase browser/server clients and proxy
│   │   ├── lucide-dynamic-stub.tsx  # Dev-only stub for lucide-react/dynamic
│   │   ├── rich-text.ts     # HTML sanitization helpers
│   │   └── utils.ts         # Utility functions (cn, getUserInitials, title, etc.)
│   ├── services/
│   │   ├── contracts/       # BaseService (generic Supabase CRUD)
│   │   ├── ExperienceService.ts
│   │   ├── ProjectService.ts
│   │   ├── SiteSettingService.ts
│   │   ├── SkillCategoryService.ts
│   │   └── SkillService.ts
│   ├── models/              # Type aliases/interfaces from database.types.ts
│   ├── hooks/               # Custom React hooks (useResourceMutation, useIsMobile)
│   ├── enums/               # TypeScript enums (SiteSettingKeyEnum)
│   ├── types/               # Helper types (Path, PathValue)
│   ├── integrations/supabase/ # Generated database.types.ts and server client
│   ├── scripts/             # Build helpers (generate-icons-names-array.js)
│   └── public/              # Static assets
├── supabase/                # Supabase local dev config & migrations
│   ├── migrations/            # SQL migration files (timestamped)
│   ├── seed.sql               # Empty root seed (kept for CLI compatibility)
│   ├── site-settings-seeder.sql
│   ├── skill-categories-seeder.sql
│   ├── skill-seeder.sql
│   ├── experiences-seeder.sql
│   ├── projects-seeder.sql
│   └── config.toml            # Supabase CLI configuration
├── .agents/                 # Agent-specific context (currently empty)
├── .gitignore
└── AGENTS.md                # This file
```

## Build and Development Commands

There is no root `package.json`. The application lives in `application/`, and all npm commands must be run from that directory:

```bash
cd application
npm install
npm run dev
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server with `--max-old-space-size=4096` |
| `npm run build` | Build for production with `--max-old-space-size=2048` and `--experimental-debug-memory-usage` |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint (`eslint`) |
| `npm run db:reset` | Stop, start, and reset local Supabase DB with seeds |
| `npm run db:types` | Generate TypeScript types from local Supabase schema into `application/integrations/supabase/database.types.ts` |

## Environment Variables

Create `application/.env` (not committed) with at least:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SCREENSHOTONE_ACCESS_KEY=<your-screenshotone-access-key>
SCREENSHOTONE_SECRET_KEY=<your-screenshotone-secret-key>
```

The application uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for both browser and server clients. `SUPABASE_SERVICE_ROLE_KEY` is used when service-role access is required. ScreenshotOne keys power the project screenshot capture action (`app/(dashboard)/dashboard/projects/actions.ts`).

## Technology Stack Details

### Next.js & React
- Uses **Next.js 16.2.9** with the **App Router** (`app/` directory).
- **React 19.2.4** — newer APIs and conventions may differ from older versions.
- Server Components are used by default for data fetching.
- Client Components are marked with `"use client"` for interactivity (forms, mutations, sidebar, providers, etc.).
- A custom session proxy is implemented in `application/proxy.ts` instead of a `middleware.ts` file.

### Tailwind CSS & Styling
- **Tailwind CSS v4** with the new `@import "tailwindcss"` syntax and `@tailwindcss/postcss` plugin.
- Custom theme variables defined in `app/globals.css` using CSS custom properties (`--background`, `--primary`, `--secondary`, etc.).
- Dark theme is the default (`html className="dark"`).
- Custom utilities: `container-shell`, `grid-fade`, `.text-glow`, `.noise-overlay`, `.card-hover`, `.glow-border`, and `.glow-border-hover`.
- Fonts: Inter (sans) and Space Grotesk (heading) via `next/font/google`.

### shadcn/ui
- Initialized with `style: "radix-nova"`, `rsc: true`, `tsx: true`, `baseColor: "neutral"`.
- Components are located in `components/ui/` and follow the `cva` (class-variance-authority) pattern.
- Aliases (from `components.json`): `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`.

### Supabase
- **Auth**: Email/password authentication. Auth confirmation route at `app/(dashboard)/auth/confirm/route.ts` handles both OAuth `code` exchange and password-recovery `token_hash` verification.
- **Database**: PostgreSQL with Row Level Security (RLS) policies. Tables: `site_settings`, `skill_categories`, `skills`, `experiences`, `projects`.
- **Storage**: Public bucket `portfolio-images` is created by the projects migration for project images. RLS policies allow public reads and authenticated writes.
- **Local Dev**: Supabase CLI with `supabase/config.toml`. Local services run on ports 54321 (API), 54322 (DB), 54323 (Studio), 54324 (Inbucket).
- **Type Generation**: `npm run db:types` generates `database.types.ts` from the local schema.
- **Seeds**: `config.toml` loads `seed.sql`, `site-settings-seeder.sql`, `skill-categories-seeder.sql`, `experiences-seeder.sql`, `skill-seeder.sql`, and `projects-seeder.sql` in that order during `db reset`.

### Data Fetching & State Management
- **Server-side**: Direct Supabase client calls in Server Components (`lib/supabase/server.ts`).
- **Client-side**: `@supabase/ssr` browser client (`lib/supabase/client.ts`) for auth and mutations.
- **TanStack Query**: Used for client-side mutations with automatic cache invalidation via the `useResourceMutation` hook.
- **React Hook Form + Zod**: All forms use the `Form` wrapper component (`components/forms/form.tsx`) with Zod validation and `zodResolver`.
- **Contexts**: `AuthProvider` manages dashboard auth state; `SiteSettingsProvider` makes site settings available to portfolio layouts.

### Service Layer
- `BaseService` (`services/contracts/BaseService.ts`) provides generic CRUD operations (`all`, `show`, `store`, `update`, `delete`, `indexWithPagination`) typed against Supabase table rows, plus optional relation loading.
- Concrete services (`ExperienceService`, `ProjectService`, `SiteSettingService`, `SkillCategoryService`, `SkillService`) extend `BaseService` and implement `getTable()`.
- Services use the singleton pattern via `static make()`.

### Icons
- Prefer `lucide-react` icons.
- `lucide-react/dynamic` is stubbed in development (`lib/lucide-dynamic-stub.tsx`) via a Turbopack alias in `next.config.ts` to avoid processing ~2,000 dynamic imports, which crashes the dev server.
- `scripts/generate-icons-names-array.js` generates `lib/lucide-icon-names.ts` from the real `lucide-react/dynamic` module for type-safe icon picking.
- Tabler Icons are used via `@tabler/icons-react` where Lucide does not have a suitable icon.

## Code Style Guidelines

- **Language**: TypeScript with strict mode enabled (`tsconfig.json`).
- **Imports**: Use path aliases (`@/components`, `@/lib`, `@/services`, `@/hooks`, etc.). Prettier organizes imports automatically.
- **Components**: Functional components. Props interfaces use `React.ComponentProps` or custom interfaces.
- **Styling**: Tailwind utility classes. Use `cn()` from `lib/utils.ts` for conditional class merging.
- **Forms**: Always use the `Form` wrapper component with Zod validation. Use `FormInput`, `FormTiptap`, `FormDatepicker`, `FormSelect`, `FormTagsInput`, `FormIconPicker`, etc. for fields.
- **Icons**: Prefer `lucide-react` icons. For dynamic icon selection, use the generated `LUCIDE_ICON_NAMES` constant and the icon picker component.
- **Server-only code**: Mark server-only modules with `"server-only"` import when appropriate.
- **Formatting**: Prettier is configured with `prettier-plugin-organize-imports` and `prettier-plugin-tailwindcss`. The `tailwindStylesheet` points to `app/globals.css`.

## Testing

There are currently **no automated tests** (no Jest, Vitest, or Playwright configuration found). Testing is manual via the dev server and Supabase Studio.

## Security Considerations

- **RLS Policies**: All public tables have RLS enabled. Public read access is granted via `FOR SELECT USING (true)` policies. Write access requires authentication.
- **Auth**: Password-based auth with Supabase. Session management via cookies (`lib/supabase/proxy.ts` proxies `/dashboard/:path*` and `/auth/:path*`).
- **Sanitization**: Rich text content is sanitized with `sanitize-html` before rendering (`lib/rich-text.ts`). Allowed tags are restricted to safe HTML elements, and links are forced to `rel="noopener noreferrer"` with `target="_blank"`.
- **Environment Variables**: Never commit `.env` or Supabase service role keys. The `.gitignore` excludes `.env`, `.next/`, `node_modules/`, and TypeScript build info.
- **Image Domains**: `next.config.ts` dynamically allows the Supabase storage hostname for Next.js Image optimization.
- **Storage**: The `portfolio-images` bucket is public; authenticated users can upload, update, and delete objects.

## Deployment

The project is designed for deployment on **Vercel** (standard Next.js deployment). The Supabase backend is hosted separately. Ensure environment variables are configured in the deployment platform. Run `npm run build` from the `application/` directory.

## Important Notes for Agents

- This is **Next.js 16 / React 19** — APIs and file structure may differ from older versions. Always check the current codebase patterns before writing new code.
- The `BaseService` pattern is central to data mutations. When adding new tables, create a model type alias, a service extending `BaseService`, and use it in components.
- When adding new form fields, use the existing `Form*` components in `components/forms/` rather than raw inputs.
- The dashboard uses a sidebar layout (`components/app-sidebar.tsx`) with navigation items defined inline. Add new dashboard sections there.
- The auth/session proxy is `application/proxy.ts`; there is no `middleware.ts`.
- The Next.js app package is at `application/package.json`; do not look for a root `package.json`.
- Project screenshots are captured via the ScreenshotOne server action in `app/(dashboard)/dashboard/projects/actions.ts` and stored in the `portfolio-images` Supabase bucket.
- Portfolio animations are built with Framer Motion. Reusable wrappers live in `components/motion/` (`FadeIn`, `TextReveal`, `StaggerContainer`, `MagneticButton`, `GradientSpotlight`, etc.) and respect `prefers-reduced-motion`.
- Always regenerate Supabase types after schema changes: `npm run db:types`.
