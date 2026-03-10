import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { supabase } = locals;

  if (!supabase) {
    console.error("Supabase client is not available on locals");
    throw error(500, "Supabase client not initialized");
  }

  const { data: clients, error: dbError } = await supabase
    .from("Clients")
    .select(`*,
        subscriptions (*),
        software (*)
        `)
    .order("name", { ascending: true });

  if (dbError) {
    console.error("Supabase error:", dbError);
    throw error(500, "Error fetching clients");
  }

  console.log("Clients from DB:", clients);

  return { clients: clients ?? [] };
};
