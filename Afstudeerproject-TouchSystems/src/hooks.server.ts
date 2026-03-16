import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/sveltekit/providers/github";
import { createServerClient } from "@supabase/ssr";
import { type Handle, redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import type { Database } from "$lib/database.types";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

const authHandle = SvelteKitAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
}).handle;

const supabaseHandle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient<Database>(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: "/" });
          });
        },
      },
    },
  );

  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();

    if (!session) {
      return { session: null, user: null };
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();

    if (error) {
      return { session: null, user: null };
    }

    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};

const approvalHandle: Handle = async ({ event, resolve }) => {
  const { user } = await event.locals.safeGetSession();

  if (user) {
    const { data: profile } = await event.locals.supabase
      .from("profile")
      .select("status")
      .eq("id", user.id)
      .single();

    const pathname = event.url.pathname;
    const isAuthRoute = pathname.startsWith("/auth");
    const isPendingRoute = pathname === "/pending";
    const isRejectedRoute = pathname === "/rejected";

    if (profile?.status === "pending" && !isPendingRoute && !isAuthRoute) {
      redirect(303, "/pending");
    }

    if (profile?.status === "rejected" && !isRejectedRoute && !isAuthRoute) {
      redirect(303, "/rejected");
    }
  }

  return resolve(event);
};

export const handle: Handle = sequence(authHandle, supabaseHandle, approvalHandle);