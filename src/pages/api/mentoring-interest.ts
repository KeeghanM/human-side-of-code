export const prerender = false

import type { APIRoute } from 'astro'
import sanitizeHtml from 'sanitize-html'

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData()

    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const currentRole = formData.get('current-role') as string
    const strugglingWith = formData.get('struggling-with') as string
    const areas = formData.getAll('areas') as string[]
    const availability = formData.get('availability') as string

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': `${import.meta.env.BREVO_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: name.split(' ')[0] || name, // Takes first name if provided
          LASTNAME: name.split(' ').slice(1).join(' ') || '', // Takes rest as last name
          CURRENT_ROLE: currentRole,
          AREAS: areas.join(', '), // Comma-separated list of selected modules
          STRUGGLING_WITH: sanitizeHtml(strugglingWith),
          AVAILABILITY: sanitizeHtml(availability),
        },
        listIds: [6],
        updateEnabled: true, // Updates contact if they already exist
      }),
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
