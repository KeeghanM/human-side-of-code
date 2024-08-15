import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.BREVO_API_KEY}`,
      },
      body: JSON.stringify({ email, listIds: [2] }), // 2 is the ID of the list we want to add the contact to "Registered Interest"
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Failed to register interest: ${message}`);
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    return new Response(message, { status: 500 });
  }
};
