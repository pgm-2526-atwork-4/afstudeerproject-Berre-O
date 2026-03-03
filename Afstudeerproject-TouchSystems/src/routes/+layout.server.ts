import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const authSession = await event.locals.auth();
  const { session: supabaseSession } = await event.locals.safeGetSession();

  return {
    session: authSession ?? supabaseSession,
    supabaseSession,
  };
};
