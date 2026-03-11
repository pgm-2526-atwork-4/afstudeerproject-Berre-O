import { error, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

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

  return { client };
};

export const actions: Actions = {
  saveNote: async ({ locals, params, request }) => {
    const { supabase } = locals;
    const { session } = await locals.safeGetSession();
    const formData = await request.formData();
    const information = formData.get("information")?.toString().trim();

    if (!information) {
      return fail(400, { error: "Note content is required" });
    }

    const { data: newNote, error: dbError } = await supabase
      .from("notes")
      .insert({
        client_id: params.slug,
        information,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Failed to save note:", dbError);
      return fail(500, { error: "Failed to save note" });
    }

    const { error: logError } = await supabase
      .from("logs")
      .insert({
        user_id: session?.user?.id,
        client_id: params.slug,
        action: "Added Note"
        });

        if (logError) {
          console.error("Failed to create log:", logError)
        }

    return { success: true, note: newNote };
  },

  updateWarning: async ({ locals, params, request }) => {
    const { supabase } = locals;
    const { session } = await locals.safeGetSession();
    const formData = await request.formData();
    const warning = formData.get("warning") === "true";

    const { error: logError } = await supabase
      .from("logs")
      .insert({
        user_id: session?.user?.id,
        client_id: params.slug,
        action: warning ? "Enabled warning" : "Disabled warning"
        });

        if (logError) {
          console.error("Failed to create log:", logError)
        }

    const { error: dbError } = await supabase
      .from("software")
      .update({ warning })
      .eq("id", params.slug);

    if (dbError) {
      console.error("Failed to update warning:", dbError);
      return fail(500, { error: "Failed to update warning" });
    }

    return { success: true };
  },

  updateSoftware: async ({ locals, params, request }) => {
    const { supabase } = locals;
    const { session } = await locals.safeGetSession();
    const formData = await request.formData();
    const status = formData.get("status") === "true";

        const { error: logError } = await supabase
      .from("logs")
      .insert({
        user_id: session?.user?.id,
        client_id: params.slug,
        action: status ? "Enabled software" : "Disabled software"
        });

        if (logError) {
          console.error("Failed to create log:", logError)
        }

    const { error: dbError } = await supabase
      .from("software")
      .update({ status })
      .eq("id", params.slug);

    if (dbError) {
      console.error("Failed to update software status:", dbError);
      return fail(500, { error: "Failed to update software status" });
    }

    return { success: true };
  },
};
