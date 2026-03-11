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
    throw error(404, "User not found");
  }

  return { profile };
};

export const actions: Actions = {
  updateAdmin: async ({ locals, params, request }) => {
    const { supabase } = locals;
    const formData = await request.formData();
    const admin = formData.get("admin") === "true";

    const { error: dbError } = await supabase
      .from("profile")
      .update({ admin })
      .eq("id", params.slug);

    if (dbError) {
      console.error("Failed to update admin status:", dbError);
      return fail(500, { error: "Failed to update admin status" });
    }

    return { success: true };
  },
};
