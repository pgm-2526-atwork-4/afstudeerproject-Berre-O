import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

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
    .order("created_at", { ascending: true });

  if (dbError) {
    console.error("Supabase error:", dbError);
    throw error(500, "Error fetching clients");
  }

  const totalClients = clients.length;
  const activeClients = clients.filter(
    (c) => c.software?.status,
  ).length;
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

  const revenue = clients.reduce(
    (acc, c) => acc + (c.subscriptions?.pricing || 0),
    0,
  );
  const avgSubscriptionPrice = totalClients > 0 ? revenue / totalClients : 0;

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  const expiringSoon = clients.filter((c) => {
    if (!c.subscriptions?.expiration_date) return false;
    const expirationDate = new Date(c.subscriptions.expiration_date);
    return expirationDate > now && expirationDate <= thirtyDaysFromNow;
  }).length;

  const softwareActive = clients.filter(
    (c) => c.software?.status === true,
  ).length;
  const softwareInactive = totalClients - softwareActive;

  const stats = {
    totalClients,
    activeClients,
    inactiveClients,
    newThisMonth,
    revenue: `€${revenue.toFixed(2)}`,
    avgSubscriptionPrice: `€${avgSubscriptionPrice.toFixed(2)}`,
    expiringSoon,
    softwareActive,
    softwareInactive,
  };

  const monthlyNewClientsData: { [key: string]: number } = {};
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(thisYear, thisMonth - i, 1);
    const monthName = monthNames[d.getMonth()];
    monthlyNewClientsData[monthName] = 0;
  }

  clients.forEach((c) => {
    const createdAt = new Date(c.created_at);
    const month = createdAt.getMonth();
    const year = createdAt.getFullYear();
    const monthName = monthNames[month];

    if (
      (year === thisYear && month > thisMonth - 6 && month <= thisMonth) ||
      (year === thisYear - 1 && month > thisMonth + 6)
    ) {
      if (monthlyNewClientsData.hasOwnProperty(monthName)) {
        monthlyNewClientsData[monthName]++;
      }
    }
  });

  const monthlyNewClients = Object.keys(monthlyNewClientsData).map((month) => ({
    month,
    count: monthlyNewClientsData[month],
  }));

  const clientsByTypeData: { [key: string]: { count: number; icon: string } } =
    {};
  const typeToIcon: { [key: string]: string } = {
    Restaurant: "fa-utensils",
    Café: "fa-mug-hot",
    Hotel: "fa-hotel",
    Bar: "fa-martini-glass",
  };

  clients.forEach((c) => {
    if (c.type) {
      if (!clientsByTypeData[c.type]) {
        clientsByTypeData[c.type] = {
          count: 0,
          icon: typeToIcon[c.type] || "fa-store",
        };
      }
      clientsByTypeData[c.type].count++;
    }
  });

  const clientsByType = Object.keys(clientsByTypeData).map((type) => ({
    type,
    ...clientsByTypeData[type],
  }));

  const subscriptionDistributionData: { [key: string]: number } = {
    Yearly: 0,
    Monthly: 0,
    Trial: 0,
  };
  clients.forEach((c) => {
    const type = c.subscriptions?.type;
    if (type && subscriptionDistributionData.hasOwnProperty(type)) {
      subscriptionDistributionData[type]++;
    }
  });

  const subscriptionDistribution = Object.keys(
    subscriptionDistributionData,
  ).map((type) => {
    const count = subscriptionDistributionData[type];
    const percentage = totalClients > 0 ? (count / totalClients) * 100 : 0;
    return {
      type,
      count,
      percentage: Math.round(percentage),
    };
  });

  return {
    stats,
    monthlyNewClients,
    clientsByType,
    subscriptionDistribution,
  };
};
