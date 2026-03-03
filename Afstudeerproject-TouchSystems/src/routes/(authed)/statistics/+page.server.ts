import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  // Replace with actual data source
  const stats = {
    totalClients: 156,
    activeClients: 132,
    inactiveClients: 24,
    newThisMonth: 8,
    revenue: "€23.400",
    avgSubscriptionPrice: "€1.200",
    expiringSoon: 5,
    softwareActive: 118,
    softwareInactive: 38,
  };

  const monthlyNewClients = [
    { month: "Sep", count: 4 },
    { month: "Oct", count: 7 },
    { month: "Nov", count: 3 },
    { month: "Dec", count: 6 },
    { month: "Jan", count: 5 },
    { month: "Feb", count: 8 },
  ];

  const clientsByType = [
    { type: "Restaurant", count: 68, icon: "fa-utensils" },
    { type: "Café", count: 42, icon: "fa-mug-hot" },
    { type: "Hotel", count: 28, icon: "fa-hotel" },
    { type: "Bar", count: 18, icon: "fa-martini-glass" },
  ];

  const recentActivity = [
    {
      id: 1,
      date: "13/02/2026",
      action: "Software Uitgezet",
      client: "Restaurant De Tuin",
      type: "warning",
    },
    {
      id: 2,
      date: "13/02/2026",
      action: "Klant Aangemaakt",
      client: "Café Central",
      type: "success",
    },
    {
      id: 3,
      date: "12/02/2026",
      action: "Licentie Verlengd",
      client: "Hotel Markt",
      type: "info",
    },
    {
      id: 4,
      date: "12/02/2026",
      action: "Software Aangezet",
      client: "Bar Zuid",
      type: "success",
    },
    {
      id: 5,
      date: "11/02/2026",
      action: "Klant Verwijderd",
      client: "Restaurant Plein",
      type: "danger",
    },
  ];

  const subscriptionDistribution = [
    { type: "Yearly", count: 98, percentage: 63 },
    { type: "Monthly", count: 45, percentage: 29 },
    { type: "Trial", count: 13, percentage: 8 },
  ];

  return {
    stats,
    monthlyNewClients,
    clientsByType,
    recentActivity,
    subscriptionDistribution,
  };
};
