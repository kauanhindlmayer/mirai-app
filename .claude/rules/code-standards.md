# Code Standards

## Naming Conventions

- All source code must be written in English
- Use PascalCase for:
  - Vue component names (both file names and component names)
  - TypeScript interfaces, types, classes, and enums
  - Constants and exported functions
- Use camelCase for:
  - Variables, functions, and method names
  - Composable function names (prefixed with `use`)
  - Store names and store properties
  - Props and emits
- Use kebab-case for:
  - CSS classes and SCSS variables
  - HTML attributes and custom events
  - File names for pages, utilities, and composables (except components)
  - Directory names
- Prefix TypeScript interfaces with `I` when needed for clarity
- Use descriptive names for async functions ending with `Async` when not obvious from context
- Use `_` prefix for private properties in classes
- Store files should be named descriptively (e.g., `user.ts`, `project.ts`)

## Code Quality

- Avoid abbreviations, but also don't write names longer than 30 characters
- Declare constants to represent magic numbers and strings for readability
- Functions should perform a clear and well-defined action, reflected in their name, which should start with a verb
- Prefer explicit typing over `any` or implicit types
- Use TypeScript strict mode features

## Function Design

- Whenever possible, avoid passing more than 3 parameters; prefer using objects or composables
- Avoid side effects; functions should either mutate state or return values, not both
- Never nest more than two if/else statements; always prefer early returns
- Never use boolean parameters to switch function behavior; extract to specific functions instead
- Prefer pure functions and immutable data patterns
- Use composables for complex stateful logic instead of large components

## Component Structure

- Keep components under 200 lines; extract sub-components when needed
- Use `<script setup>` syntax for all new components
- Structure `<script setup>` blocks in this order:
  1. Imports
  2. Props and emits definitions
  3. Composables and reactive state
  4. Computed properties
  5. Methods and event handlers
  6. Lifecycle hooks
- Prefer composition over inheritance; use composables for shared logic
- Use provide/inject sparingly; prefer props and stores

## Vue-Specific Standards

- Always define prop types explicitly using TypeScript
- Use `ref()` for primitive values, `reactive()` for objects when object reactivity is needed
- Prefer `computed()` over methods for derived state
- Use `watch()` and `watchEffect()` judiciously; avoid overuse
- Always use `key` attributes in `v-for` loops with meaningful unique values
- Prefer `v-show` for frequently toggled elements, `v-if` for conditional rendering

## Code Style

- Avoid blank lines inside functions and methods
- Avoid using comments whenever possible; let code be self-documenting
- Never declare more than one variable on the same line
- Declare variables as close as possible to where they will be used
- Use destructuring for props and composable returns when appropriate
- Prefer template literals over string concatenation
- Use optional chaining (`?.`) and nullish coalescing (`??`) operators

## File Organization

- Group related components in feature-based directories
- Keep API calls in `src/api/` directory
- Use `src/composables/` for reusable stateful logic
- Place utility functions in `src/utils/`
- Define types in `src/types/` with clear, descriptive names
- One main export per file (component, composable, utility)

## State Management

- Use Pinia stores for application-wide state
- Keep component-local state in components using `ref()` and `reactive()`
- Use composables for shared stateful logic between components
- Avoid deeply nested state structures
- Use store actions for complex state mutations
- Leverage auto-imports for store usage

## Styling Standards

- Use TailwindCSS utility classes for styling when possible
- Write custom SCSS only when TailwindCSS is insufficient
- Follow BEM methodology for custom CSS class names
- Use CSS custom properties for theme-related values
- Avoid inline styles; prefer CSS classes
- Use PrimeVue theming system for consistent component styling
