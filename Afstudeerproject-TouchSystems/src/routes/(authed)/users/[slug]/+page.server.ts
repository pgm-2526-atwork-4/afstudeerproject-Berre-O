import { error, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { supabase } = locals;
  const { slug } = params;

  if (!supabase) {
    console.error("Supabase client is not available on locals");
    throw error(500, "Supabase client not initialized");
  }

  const { data: profile, error: dbError } = await supabase
    .from("profile")
    .select(`*`)
    .eq("id", slug)
    .single();

  if (dbError) {
    console.error("Supabase error:", dbError);
    throw error(404, "Client not found");
  }

  return { profile };
};
