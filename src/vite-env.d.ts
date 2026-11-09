/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** The public site address, resolved at build time. Empty during local development. */
declare const __SITE_URL__: string;
