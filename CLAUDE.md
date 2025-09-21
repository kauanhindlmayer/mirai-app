# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mirai is a Vue 3 + TypeScript web-based project management tool focused on Agile/Scrum workflows and team collaboration. It uses a modern frontend stack with PrimeVue components and TailwindCSS for styling.

## Development Commands

### Core Development

- `pnpm start` - Start development server (alias for `vite`)
- `pnpm build` - Full production build with type checking
- `pnpm preview` - Preview production build locally

### Testing

- `pnpm test:unit` - Run unit tests with Vitest
- `pnpm test:e2e` - Run end-to-end tests with Playwright

### Code Quality

- `pnpm lint` - Run both oxlint and eslint with auto-fix
- `pnpm type-check` - TypeScript type checking with vue-tsc
- `pnpm format` - Format code with Prettier

### Individual Tools

- `pnpm lint:oxlint` - Fast linting with oxlint (correctness rules)
- `pnpm lint:eslint` - Standard ESLint with auto-fix

## Architecture

### Tech Stack

- **Framework**: Vue 3 with Composition API and `<script setup>`
- **TypeScript**: Full TypeScript with strict type checking
- **Build Tool**: Vite with optimized dev experience
- **State Management**: Pinia stores with auto-imports
- **Data Fetching**: @pinia/colada for query management with 200ms delay
- **UI Components**: PrimeVue with auto-import resolver
- **Styling**: TailwindCSS + SCSS for component styling
- **Real-time**: SignalR for live updates
- **Forms**: @primevue/forms with Yup validation
- **Routing**: File-based routing with unplugin-vue-router

### Project Structure

```
src/
├── api/           # API service functions (auto-imported)
├── assets/        # SCSS styles and fonts
├── components/    # Vue components (auto-imported)
├── composables/   # Vue composables (auto-imported)
├── layout/        # Layout components
├── pages/         # File-based routes
├── plugins/       # Vue plugins configuration
├── queries/       # Pinia Colada query definitions
├── router/        # Router configuration and guards
├── stores/        # Pinia stores (auto-imported)
├── types/         # TypeScript type definitions
└── utils/         # Utility functions (auto-imported)
```

### Key Architectural Patterns

1. **Auto-imports**: Most Vue APIs, Pinia functions, and project utilities are auto-imported
2. **File-based routing**: Routes are generated from `src/pages/` directory structure
3. **Component organization**: Components grouped by feature (boards, projects, work-items, etc.)
4. **State management**: Composition API stores with HMR support
5. **Real-time updates**: SignalR composable for live collaboration features
6. **API proxy**: Development server proxies `/api` to backend service
7. **Type safety**: Strict TypeScript with comprehensive type definitions

### Configuration Notes

- Vite config includes auto-import for components, composables, stores, and utilities
- TailwindCSS uses custom breakpoints and dark mode via class selector
- SCSS preprocessing with modern compiler API
- Development server runs on port 5173 with API proxy to backend
- PrimeVue components auto-imported and themed
- SignalR connections use WebSockets with automatic reconnection

### Testing Setup

- Unit tests: Vitest with Vue Test Utils and JSDOM
- E2E tests: Playwright for browser automation
- Pre-commit hooks: Husky with lint-staged for code quality

## Code Standards

**IMPORTANT**: Follow all coding standards defined in `.claude/rules/code-standards.md`. This includes naming conventions, component structure, state management practices, and styling guidelines.

## Development Notes

- The app uses file-based routing - new pages go in `src/pages/`
- Components in `src/components/` and `src/layout/` are auto-imported
- API calls should go in `src/api/` and queries in `src/queries/`
- Stores use the Composition API pattern with `defineStore()`
- Real-time features use the `useSignalR` composable
- The alias `~` maps to `src/` directory
