/// <reference types="svelte" />
declare module '*.svelte' {
  export { SvelteComponentDev as default } from 'svelte/internal';
  export const Types: any;
  // ... other stuff
}

interface Window {
  environment: string;
}