import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { supabase } = locals;
  const { slug } = params;

  if (!supabase) {
    console.error("Supabase client is not available on locals");
    throw error(500, "Supabase client not initialized");
  }

  const { data: client, error: dbError } = await supabase
    .from("Clients")
    .select(
      `
      *,
      subscriptions (*),
      software (*),
      notes (*),
      contact (*)
    `,
    )
    .eq("id", slug)
    .single();

  if (dbError) {
    console.error("Supabase error:", dbError);
    throw error(404, "Client not found");
  }

  console.log("Client from DB:", client);

  return { client };
};
