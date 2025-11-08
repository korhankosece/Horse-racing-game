# Horse Racing

A modern horse racing simulation application built with Vue 3 and TypeScript, featuring real-time race tracking, multiple rounds, pause/resume functionality, and comprehensive race results.

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or higher, or v22.12.0+)
- npm or yarn

### Installation

```bash
npm install
```

or

```bash
yarn install
```

### Running the Development Server

```bash
npm run dev
```

or

```bash
yarn dev
```

The application will start at `http://localhost:5173`

## Features

- **Race Program Management**: Generate multi-round race programs with customizable distances and horse assignments
- **Race Control**: Start, pause, and resume races with real-time position tracking
- **Race Visualization**: Live race track with visual progress representation and round transition countdown
- **Results & Statistics**: Real-time results tables, complete race history, and position tracking
- **Accessibility**: ARIA attributes and semantic HTML for inclusive user experience
- **Customizable Configuration**: Easy-to-modify config file for customizing race parameters, speeds, and game rules

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vuex** for state management
- **Vite** for build tooling
- **Vitest** & **Vue Test Utils** for testing
- **SCSS** for styling

## Project Structure

```
src/
  ├── components/     # Reusable components (common, layout, racing)
  ├── composables/   # Vue composition API hooks
  ├── pages/         # Page components
  ├── layouts/       # Layout components
  ├── store/         # Vuex store modules (race, program)
  ├── styles/        # Global styles and theme variables
  ├── types/         # TypeScript type definitions
  ├── utils/         # Utility functions
  ├── data/          # Static data
  └── config/        # Application configuration
```

## Development Summary

This project demonstrates enterprise-level development practices with a focus on clean architecture, comprehensive testing, and maintainable code patterns.

### Architecture & Design Patterns

- **Separation of Concerns**: Complete separation between UI layer and business logic through Vuex store modules and composables. Components remain purely presentational.

- **Modular State Management**: Feature-based Vuex modules (`race`, `program`) with consistent structure (`state.ts`, `getters.ts`, `mutations.ts`, `actions.ts`, `types.ts`).

- **Composition API Pattern**: Custom composables (`useProgram`, `useRace`) provide clean abstraction between components and store, enabling better testability and reusability.

- **Component Architecture**: Strict hierarchy with clear separation between common UI, layout, and feature-specific components following single responsibility principle.

- **Type Safety**: Full TypeScript coverage with strict typing throughout the application.

### Testing Excellence

- **Comprehensive Test Coverage**: 100% code coverage across all critical paths (store modules, composables, components, pages, utilities).

- **Testing Strategy**: Co-located unit tests following the same directory structure. Tests utilize Vitest with Vue Test Utils, featuring comprehensive mocking strategies and helper utilities.

- **Test Quality**: Focus on maintainability with helper functions to reduce duplication. Consistent patterns and best practices across all test files.

### Code Quality & Standards

- **Linting & Formatting**: ESLint with Vue/TypeScript configurations and Prettier for consistent formatting.

- **Type Checking**: Strict TypeScript compilation with `vue-tsc` ensuring type safety at build time.

- **Code Organization**: Consistent file structure, naming conventions, and import grouping throughout the project.

- **Accessibility**: ARIA attributes and semantic HTML for inclusive user experience.

### Development Workflow

- **Build Pipeline**: Parallel type checking and build processes for optimal development experience.
- **Hot Module Replacement**: Fast development feedback with Vite's HMR.
- **Test-Driven Development**: Comprehensive test suite enables confident refactoring and feature additions.

## Configuration

The application includes a comprehensive configuration file (`src/config/index.ts`) that allows you to easily customize the game behavior:

### Available Configuration Options

- **Race Speed & Timing**:
  - `interval`: Race update interval in milliseconds (default: 100ms)
  - `maxSpeed`: Maximum horse speed in pixels per interval (default: 50)

- **Track Settings**:
  - `trackLengths`: Map of race distances (meters) to track lengths (pixels)
  - `trackWidth`: Maximum track width in pixels (default: 1100)

- **Race Distances**:
  - `ROUND_DISTANCES`: Available race distances in meters (default: [1200, 1400, 1600, 1800, 2000, 2200])

- **Horse Settings**:
  - `HORSES_PER_ROUND`: Number of horses per round (default: 10)
  - `TOTAL_HORSES`: Total number of horses in the game (default: 20)

### Example Customization

```typescript
// src/config/index.ts
export const RACE_CONFIG = {
  interval: 50, // Faster updates (50ms instead of 100ms)
  maxSpeed: 75, // Faster horses (75 pixels per interval)
  trackLengths: {
    1200: 800, // Longer tracks for same distance
    1400: 900,
    // ... add more distances
  },
  trackWidth: 1200, // Wider track
} as const

export const ROUND_DISTANCES = [1000, 1500, 2000, 2500] as const
export const HORSES_PER_ROUND = 12
export const TOTAL_HORSES = 24
```

Simply modify the values in `src/config/index.ts` to customize the game to your preferences!

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:unit` - Run unit tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint and fix issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Type check with TypeScript
