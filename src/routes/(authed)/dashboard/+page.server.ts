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

  const totalClients = clients.length;
  const activeClients = clients.filter(
      (c) => c.software?.status).length;
  const inactiveClients = totalClients - activeClients;
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const newThisMonth = clients.filter((c) => {
  const createdAt = new Date(c.created_at);
    return (
      createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear
    );
  }).length;

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  const expiringSoon = clients.filter((c) => {
    if (!c.subscriptions?.expiration_date) return false;
    const expirationDate = new Date(c.subscriptions.expiration_date);
    return expirationDate > now && expirationDate <= thirtyDaysFromNow;
  });

  const stats = {
    totalClients,
    newThisMonth,
    expiringSoon,
    inactiveClients
  }

  return { clients: clients ?? [],
          stats
   };
};
