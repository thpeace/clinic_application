/// <reference types="vite/client" />

// ============================================================================
// Custom Environment Variables
// ============================================================================
interface ImportMetaEnv {
    // API Configuration
    readonly VITE_API_BASE_URL: string;

    // App Configuration
    readonly VITE_APP_NAME?: string;
    readonly VITE_APP_VERSION?: string;

    // Feature Flags
    readonly VITE_ENABLE_DEBUG_MODE?: string;
    readonly VITE_ENABLE_ANALYTICS?: string;

    // Built-in Vite variables
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
