// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session } from '@auth/sveltekit';

declare global {
    namespace App {
        interface Locals {
            auth(): Promise<Session | null>;
        }
        interface PageData {
            session: Session | null;
        }
    }
}

export {};
