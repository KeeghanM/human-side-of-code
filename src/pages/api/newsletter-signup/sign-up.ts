export const prerender = false

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json()
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': `${import.meta.env.BREVO_API_KEY}`,
      },
      body: JSON.stringify({ email, listIds: [2] }), // 2 is the ID of the list we want to add the contact to "Registered Interest"
    })
    if (!response.ok) {
      const err = await response.text()

      return new Response(err, { status: 500 })
    }

    return new Response(null, { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 })
  }
}
