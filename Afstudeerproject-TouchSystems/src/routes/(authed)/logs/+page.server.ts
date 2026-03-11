import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const currentPage = Number(event.url.searchParams.get("page") ?? "1");
  const perPage = 8;
  const { supabase } = event.locals;

  if (!supabase) {
    console.error("Supabase client is not available on locals");
    throw error(500, "Supabase client not initialized");
  }

  const { data: logs, error: dbError } = await supabase
    .from("logs")
    .select(
      `*,
            profile (*),
            Clients (*)
        `,
    )
    .order("created_at", { ascending: false });

  if (dbError) {
    console.error("Supabase error:", dbError);
    throw error(500, "Error fetching logs");
  }

  console.log(logs)

  const allLogs = logs ?? [];
  const totalPages = Math.ceil(allLogs.length / perPage);
  const start = (currentPage - 1) * perPage;
  const paginatedLogs = allLogs.slice(start, start + perPage);

  return {
    logs: paginatedLogs,
    currentPage,
    totalPages,
  };
};
