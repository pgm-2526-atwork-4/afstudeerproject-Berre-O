import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const id = params.slug;

  // Replace with your actual data source
  const client = {
    id,
    name: "TestRestaurant",
    initials: "TR",
    type: "Restaurant",
    status: "Actief",
    softwareStatus: "Active",
    contact: {
      email: "test@testrestaurant.com",
      address: "Keizersgracht 42, 1015 CX Amsterdam",
      phone: "+31 020 456 7890",
      kvk: "30906877564545454",
    },
    account: {
      subscriptionType: "Yearly",
      softwareStatus: "Active",
      subscriptionPrice: "€1500",
    },
    notes: [
      {
        id: 1,
        date: "15/02/2026",
        author: "Admin",
        content:
          "Large restaurant with 150 seats. Uses TouchSuite including table displays. Requested custom menu integration for their seasonal menu rotations.",
      },
    ],
    software: {
      warning: false,
      disable: false,
    },
  };

  return { client };
};
