// src/global.d.ts or any .d.ts file included in your tsconfig.json

declare global {
  interface Window {
    __DEV__: boolean
  }
}

// This file doesn't need to export anything
export {}
