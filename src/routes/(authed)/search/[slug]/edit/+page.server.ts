import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { geocodeAddress } from "$lib/geocode";

export const load: PageServerLoad = async ({ locals, params }) => {
  const { supabase } = locals;
  const { slug } = params;

  if (!supabase) {
    throw error(500, "Supabase client not initialized");
  }

  const { data: client, error: dbError } = await supabase
    .from("Clients")
    .select(
      `
            *,
            contact (*),
            subscriptions (*)
        `,
    )
    .eq("id", slug)
    .single();

  if (dbError) {
    throw error(404, "Client not found");
  }

  return { client };
};

export const actions: Actions = {
  updateClient: async ({ locals, params, request }) => {
    const { supabase } = locals;
    const { session } = await locals.safeGetSession();
    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const adres = formData.get("adres")?.toString().trim();
    const company_number = formData.get("company_number")?.toString().trim();
    const subscription_type = formData
      .get("subscription_type")
      ?.toString()
      .trim();
    const subscription_status = formData
      .get("subscription_status")
      ?.toString()
      .trim();
    const subscription_pricing = formData
      .get("subscription_pricing")
      ?.toString()
      .trim();

    if (
      !name ||
      !email ||
      !phone ||
      !adres ||
      !company_number ||
      !subscription_type ||
      !subscription_status ||
      !subscription_pricing
    ) {
      return fail(400, { error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, { error: "Invalid email format" });
    }

    const price = parseFloat(subscription_pricing);
    if (isNaN(price) || price < 0) {
      return fail(400, { error: "Invalid price format" });
    }

    const { error: clientError } = await supabase
      .from("Clients")
      .update({
        name,
        company_number,
      })
      .eq("id", params.slug);

    if (clientError) {
      console.error("Failed to update client:", clientError);
      return fail(500, { error: "Failed to update client information" });
    }

    const { error: contactError } = await supabase
      .from("contact")
      .update({
        email,
        phone,
        adres,
      })
      .eq("id", params.slug);

    if (contactError) {
      console.error("Failed to update contact:", contactError);
      return fail(500, { error: "Failed to update contact information" });
    }

    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .update({
        type: subscription_type,
        status: subscription_status,
        pricing: price,
      })
      .eq("id", params.slug);

    if (subscriptionError) {
      console.error("Failed to update subscription:", subscriptionError);
      return fail(500, { error: "Failed to update subscription information" });
    }

    const coords = await geocodeAddress(adres);
    if (coords) {
      await supabase
        .from("Clients")
        .update({
          lat: coords.lat,
          lng: coords.lng,
        })
        .eq("id", params.slug);
    }
    const { error: logError } = await supabase.from("logs").insert({
      user_id: session?.user?.id,
      client_id: params.slug,
      action: "Updated client information",
    });

    if (logError) {
      console.error("Failed to create log:", logError);
    }

    return { success: true };
  },
};
