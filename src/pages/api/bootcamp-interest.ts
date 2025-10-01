export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const ageRange = formData.get("age-range") as string;
    const modules = formData.getAll("modules") as string[]; // Gets all checked module values
    const why = formData.get("why") as string;
    const needsAssistance = formData.get("needs-assistance") === "on";
    const needsEquipment = formData.get("needs-equipment") === "on";

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": `${import.meta.env.BREVO_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: name.split(" ")[0] || name, // Takes first name if provided
          LASTNAME: name.split(" ").slice(1).join(" ") || "", // Takes rest as last name
          AGE_RANGE: ageRange,
          MODULES: modules.join(", "), // Comma-separated list of selected modules
          WHY_INTERESTED: why,
          NEEDS_ASSISTANCE: needsAssistance,
          NEEDS_EQUIPMENT: needsEquipment,
        },
        listIds: [5],
        updateEnabled: true, // Updates contact if they already exist
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(err, { status: 500 });
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
};
