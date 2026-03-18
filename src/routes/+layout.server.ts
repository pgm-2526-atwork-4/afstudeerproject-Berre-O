import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

export const load: LayoutServerLoad = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();

  if (!session || !user) {
    return {
      session,
      user,
      profile: null,
      supabase: {
        url: PUBLIC_SUPABASE_URL,
        anonKey: PUBLIC_SUPABASE_ANON_KEY,
      },
    };
  }

  const { data: profile, error: profileError } = await locals.supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    throw error(500, { message: "Could not fetch profile" });
  }

  return {
    session,
    user,
    profile: profile,
    supabase: {
      url: PUBLIC_SUPABASE_URL,
      anonKey: PUBLIC_SUPABASE_ANON_KEY,
    },
  };
};
