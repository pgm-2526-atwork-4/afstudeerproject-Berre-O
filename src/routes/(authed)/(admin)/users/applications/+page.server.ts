import { fail, redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  const { data: pending } = await locals.supabase
    .from("profile")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return { pending };
};

export const actions = {
  approve: async ({ request, locals }) => {
    const form = await request.formData();
    const userId = form.get("userId");

    if (!userId) {
      return fail(400, { message: "Invalid request" });
    }

    const { error } = await locals.supabase
      .from("profile")
      .update({ status: "approved" })
      .eq("id", userId);

    if (error) {
      return fail(500, { message: "Failed to approve user" });
    }

    throw redirect(303, "/users/applications");
  },

  reject: async ({ request, locals }) => {
    const form = await request.formData();
    const userId = form.get("userId");

    if (!userId) {
      return fail(400, { message: "Invalid request" });
    }

    const { error } = await locals.supabase
      .from("profile")
      .update({ status: "rejected" })
      .eq("id", userId);

    if (error) {
      return fail(500, { message: "Failed to reject user" });
    }

    throw redirect(303, "/users/applications");
  },
};
