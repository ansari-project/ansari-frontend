# Ansari Frontend Development Guide

## Important Workflow Rules
- **ALWAYS get explicit confirmation before making any code changes**
- Propose changes clearly and wait for approval before implementation
- When suggesting multiple changes, present them as separate options
- For complex changes, outline the approach and seek confirmation first

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
- Base new features on `develop` branch
- Keep commits focused on single concerns
- Include relevant context in commit messages