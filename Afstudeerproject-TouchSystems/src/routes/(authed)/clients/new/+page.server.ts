import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { supabase } = locals;

    if (!supabase) {
      return fail(500, { error: "Supabase client not initialized" });
    }

    const fd = await request.formData();

    const name = fd.get("name") as string;
    const type = fd.get("type") as string;
    const company_number = fd.get("company_number") as string;
    const first_name = fd.get("first_name") as string;
    const last_name = fd.get("last_name") as string;
    const email = fd.get("email") as string;
    const phone = fd.get("phone") as string;
    const adres = fd.get("adres") as string;
    const sub_type = fd.get("sub_type") as string;
    const sub_status = fd.get("sub_status") as string;
    const start_date = fd.get("start_date") as string;
    const expiration_date = fd.get("expiration_date") as string;
    const notes = fd.get("notes") as string;

    const formData = {
      name,
      type,
      company_number,
      first_name,
      last_name,
      email,
      phone,
      adres,
      sub_type,
      sub_status,
      start_date,
      expiration_date,
      notes,
    };

    if (!name?.trim()) {
      return fail(400, { error: "Name is required.", data: formData });
    }
    if (!type) {
      return fail(400, { error: "Type is required.", data: formData });
    }
    if (!sub_type) {
      return fail(400, {
        error: "Subscription type is required.",
        data: formData,
      });
    }
    if (!start_date) {
      return fail(400, { error: "Start date is required.", data: formData });
    }
    if (!expiration_date) {
      return fail(400, {
        error: "Expiration date is required.",
        data: formData,
      });
    }

    const { data: client, error: clientError } = await supabase
      .from("Clients")
      .insert({
        name: name.trim(),
        type,
        company_number: company_number ? parseInt(company_number) : null,
      })
      .select()
      .single();

    if (clientError) {
      console.error("Client insert error:", clientError);
      return fail(500, { error: "Failed to create client.", data: formData });
    }

    const { error: contactError } = await supabase.from("contact").insert({
      id: client.id,
      person_firstname: first_name || null,
      person_lastname: last_name || null,
      email: email || null,
      phone: phone || null,
      adres: adres || null,
    });

    if (contactError) {
      console.error("Contact insert error:", contactError);
    }

    const { error: subError } = await supabase.from("subscriptions").insert({
      id: client.id,
      type: sub_type,
      status: sub_status || "Payed",
      start_date: start_date,
      expiration_date: expiration_date,
    });

    if (subError) {
      console.error("Subscription insert error:", subError);
    }

    const { error: softwareError } = await supabase.from("software").insert({
      id: client.id,
      status: false,
      warning: false,
    });

    if (softwareError) {
      console.error("Software insert error:", softwareError);
    }

    const { session } = await locals.safeGetSession();

    const { error: logError } = await supabase
      .from("logs")
      .insert({
        user_id: session?.user?.id,
        client_id: client.id,
        action: "Added new client"
        });

        if (logError) {
          console.error("Failed to create log:", logError)
        }

    if (notes?.trim()) {
      const { error: noteError } = await supabase.from("notes").insert({
        client_id: client.id,
        information: notes.trim(),
      });

      if (noteError) {
        console.error("Note insert error:", noteError);
      }
    }
    throw redirect(303, `/search/${client.id}`);
  },
};
