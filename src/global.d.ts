
/// <reference types="svelte" />
declare module '*.svelte' {
  export { SvelteComponentDev as default } from 'svelte/internal'
  export const Types: any
  // ... other stuff
}
interface iKomidaElectronAPI {
  httpRequest: (options: AxiosRequestConfig) => Promise<AxiosResponse>
}

interface Window {
  environment: string
  opera: any
  safari: any
  iKomidaElectronAPI: iKomidaElectronAPI
}
