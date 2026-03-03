import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const query = event.url.searchParams.get("q") ?? "";

  const allItems = [
    { id: 1, name: "Touch Panel A1", category: "Restaurant", status: "Active" },
    { id: 2, name: "Touch Panel B2", category: "Café", status: "Inactive" },
    { id: 3, name: "Controller X1", category: "Restaurant", status: "Active" },
    { id: 4, name: "Controller X2", category: "Controllers", status: "Active" },
    {
      id: 5,
      name: "Sensor Module S1",
      category: "Sensors",
      status: "Inactive",
    },
    { id: 6, name: "Sensor Module S2", category: "Sensors", status: "Active" },
    { id: 7, name: "Display Unit D1", category: "Displays", status: "Active" },
    {
      id: 8,
      name: "Display Unit D2",
      category: "Displays",
      status: "Inactive",
    },
  ];

  const filtered = query
    ? allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.status.toLowerCase().includes(query.toLowerCase()),
      )
    : allItems;

  return {
    items: filtered,
    query,
  };
};
