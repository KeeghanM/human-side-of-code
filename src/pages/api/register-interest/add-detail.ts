import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, firstName, lastName } = await request.json();
    if (!email) {
      throw new Error("Email is required");
    }

    const response = await fetch(`https://api.brevo.com/v3/contacts/${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "api-key": `${import.meta.env.BREVO_API_KEY}`,
      },
      body: JSON.stringify({
        attributes: {
          FNAME: firstName,
          LNAME: lastName,
        },
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Failed to update details: ${message}`);
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unknown error occurred";
    return new Response(message, { status: 500 });
  }
};
