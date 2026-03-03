// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session } from '@auth/sveltekit';
import { SupabaseClient, Session, User } from '@supabase/supabase-js'

declare global {
    namespace App {
        interface Locals {
            auth(): Promise<Session | null>;
            supabase: SupabaseClient
            safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
        }
        interface PageData {
            session: Session | null;
        }
    }
}

export {};
