import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const { session } = await locals.safeGetSession();
  if (session) {
    throw redirect(303, "/dashboard");
  }
  return {};
};

export const actions: Actions = {
  register: async ({ locals, request }) => {
    const { supabase } = locals;
    const formData = await request.formData();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();
    const name = formData.get("name")?.toString().trim();

    if (!email || !password || !name) {
      return fail(400, { error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return fail(400, { error: "Passwords do not match" });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return fail(400, { error: authError.message });
    }

    if (authData.user) {
      const { error: profileError } = await supabase.from("profile").insert({
        id: authData.user.id,
        name,
        admin: false,
      });

      if (profileError) {
        console.error("Failed to create profile:", profileError);
        return fail(500, { error: "Failed to create profile" });
      }
    }

    return {
      success: true,
      message: "Check your email for the confirmation link!",
    };
  },

  login: async ({ locals, request }) => {
    const { supabase } = locals;
    const formData = await request.formData();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return fail(400, { error: "Email and password are required" });
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return fail(400, { error: authError.message });
    }

    throw redirect(303, "/dashboard");
  },
};
