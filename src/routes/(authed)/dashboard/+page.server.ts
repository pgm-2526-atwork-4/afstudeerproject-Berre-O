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
    .select(
      `*,
        subscriptions (*),
        software (*)
        `,
    )
    .order("name", { ascending: true });

  if (dbError) {
    console.error("Supabase error:", dbError);
    throw error(500, "Error fetching clients");
  }

  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.software?.status).length;
  const inactiveClients = totalClients - activeClients;
  const now = new Date();

  const nowUTC = new Date(now.getTime());
  const thisMonth = nowUTC.getUTCMonth();
  const thisYear = nowUTC.getUTCFullYear();

  const thirtyDaysFromNow = new Date(now.getTime());
  thirtyDaysFromNow.setUTCDate(thirtyDaysFromNow.getUTCDate() + 30);

for (const client of clients) {
    if (
        client.subscriptions?.expiration_date &&
        client.subscriptions?.status === "Payed"
    ) {
        const expirationDate = new Date(client.subscriptions.expiration_date);

        if (
            now > expirationDate ||
            (expirationDate <= thirtyDaysFromNow && expirationDate > now)
        ) {
            const [datePart] = client.subscriptions.expiration_date.split('T');
            const [year, month, day] = datePart.split('-').map(Number);

            let newYear = year;
            let newMonth = month;

            if (client.subscriptions?.type === "Monthly") {
                newMonth += 1;
                if (newMonth > 12) {
                    newMonth = 1;
                    newYear += 1;
                }
            } else if (client.subscriptions?.type === "Yearly") {
                newYear += 1;
            }

            const newDateString = `${newYear}-${String(newMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const { error: updateError } = await supabase
                .from("subscriptions")
                .update({ expiration_date: newDateString })
                .eq("id", client.subscriptions.id);

            if (!updateError) {
                client.subscriptions.expiration_date = newDateString;
                client.software.status = true;
            } else {
                console.error("Error updating subscription:", updateError);
            }
        }
    }
}

  const newThisMonth = clients.filter((c) => {
    const createdAt = new Date(c.created_at);
    return (
      createdAt.getUTCMonth() === thisMonth &&
      createdAt.getUTCFullYear() === thisYear
    );
  }).length;

  const expiringSoon = clients.filter((c) => {
    if (!c.subscriptions?.expiration_date) return false;
    const expirationDate = new Date(c.subscriptions.expiration_date);
    return expirationDate > now && expirationDate <= thirtyDaysFromNow;
  });

  const stats = {
    totalClients,
    newThisMonth,
    expiringSoon,
    inactiveClients,
  };

  return { clients: clients ?? [], stats };
};
