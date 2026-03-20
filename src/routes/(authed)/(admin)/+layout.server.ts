import { error, redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
  const { session } = await locals.safeGetSession();

  if (!session) throw redirect(303, "/login");

  const { data: profile, error: profileError } = await locals.supabase
    .from("profile")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (profileError || !profile) {
    throw error(500, { message: "Could not fetch profile" });
  }

  if (profile.admin !== true) {
    throw error(403, { message: "Not Ge-authoriseert" });
  }

  return {
    user: profile,
  };
};
