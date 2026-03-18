import type { LayoutServerLoad } from "./$types";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

export const load: LayoutServerLoad = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();

  return {
    session,
    user,
    supabase: {
      url: PUBLIC_SUPABASE_URL,
      anonKey: PUBLIC_SUPABASE_ANON_KEY,
    },
  };
};