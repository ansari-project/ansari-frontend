# Ansari Frontend Development Guide

## Important Workflow Rules
- **ALWAYS get explicit confirmation before making any code changes**
- Propose changes clearly and wait for approval before implementation
- When suggesting multiple changes, present them as separate options
- For complex changes, outline the approach and seek confirmation first

## Project Overview

This project uses **Codev** for AI-assisted development.

## Available Protocols

- **SPIR**: Multi-phase development with consultation (`codev/protocols/spir/protocol.md`)
- **TICK**: Fast autonomous implementation (`codev/protocols/tick/protocol.md`)
- **EXPERIMENT**: Disciplined experimentation (`codev/protocols/experiment/protocol.md`)
- **MAINTAIN**: Codebase maintenance (`codev/protocols/maintain/protocol.md`)

## Key Locations

- **Specs**: `codev/specs/` - Feature specifications (WHAT to build)
- **Plans**: `codev/plans/` - Implementation plans (HOW to build)
- **Reviews**: `codev/reviews/` - Reviews and lessons learned
- **Protocols**: `codev/protocols/` - Development protocols

## Quick Start

1. For new features, start with the Specification phase
2. Create exactly THREE documents per feature: spec, plan, and review
3. Follow the protocol phases as defined in the protocol files
4. Use multi-agent consultation when specified

## File Naming Convention

Use sequential numbering with descriptive names:
- Specification: `codev/specs/1-feature-name.md`
- Plan: `codev/plans/1-feature-name.md`
- Review: `codev/reviews/1-feature-name.md`

## Build & Development Commands
- `npm start` or `npm run start:clear`: Start the development server
- `npm run web`: Start the web development server
- `npm run build`: Build for web platform
- `npm run lint`: Run ESLint on all files
- `npx eslint [file-path]`: Lint specific file(s)
- `npx eslint [file-path] --fix`: Auto-fix lint issues in specific file(s)
- `npm run ios` / `npm run android`: Run on iOS/Android simulator
- `npm run ios:device` / `npm run android:device`: Run on physical device

## Code Style Guidelines
- **File Naming**: PascalCase for components (`MessageBubble.tsx`), camelCase for utilities
- **Imports**: Group imports - external libs first, then internal (`@/` alias)
- **Formatting**: Uses Prettier with single quotes, no semi, 120 char width
- **Types**: TypeScript with strict mode, explicit return types on functions
- **Components**: Use functional components with React FC typing
- **State Management**: Redux toolkit with slices pattern
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Error Handling**: Custom error classes, try/catch blocks in services
- **Paths**: Use absolute imports with `@/` alias (`import X from '@/components/Y'`)

## Common Lint Requirements
- Use parentheses in arrow function parameters: `(param) =>`
- Properly format ternary operators: `(condition ? x : y)`
- Use useCallback for functions in components
- Avoid unused variables and imports
- Follow JSDoc format for comments with proper spacing

## Spacing Rules
- No trailing commas after the last parameter in function definitions
- Add trailing commas for objects and arrays with items on multiple lines
- One space after the colon in object properties: `{ prop: value }`
- Add a blank line between distinct logical sections of code
- No blank line between related statements (variable declarations)
- Include a space after comment markers: `// Comment` (not `//Comment`)
- Add a space after if/for/while keywords: `if (condition)` (not `if(condition)`)
- No extra empty lines at the end of blocks
- Keep consistent indentation (2 spaces)

## Git Workflow

**NEVER use `git add -A` or `git add .`** - Always add files explicitly.

- Base new features on `develop` branch
- Keep commits focused on single concerns
- Include relevant context in commit messages

Commit messages format:
```
[Spec 1] Description of change
[Spec 1][Phase: implement] feat: Add feature
```

## CLI Commands

Codev provides three CLI tools:

- **codev**: Project management (init, adopt, update, doctor)
- **af**: Agent Farm orchestration (start, spawn, status, cleanup)
- **consult**: AI consultation for reviews (general, protocol, stats)

For complete reference, see `codev/resources/commands/`:
- `codev/resources/commands/overview.md` - Quick start
- `codev/resources/commands/codev.md` - Project commands
- `codev/resources/commands/agent-farm.md` - Agent Farm commands
- `codev/resources/commands/consult.md` - Consultation commands

## Configuration

Agent Farm is configured via `af-config.json` at the project root. Created during `codev init` or `codev adopt`. Override via CLI flags: `--architect-cmd`, `--builder-cmd`, `--shell-cmd`.

```json
{
  "shell": {
    "architect": "claude",
    "builder": "claude",
    "shell": "bash"
  }
}
```

## Sister Project

This frontend works in tandem with **ansari-multisage** (backend), located at `../ansari-multisage`. Coordinate closely on API contracts, types, endpoints, and event schemas. To message the backend architect: `af send ansari-multisage:architect "<message>"`.

## For More Info

Read the full protocol documentation in `codev/protocols/`.
