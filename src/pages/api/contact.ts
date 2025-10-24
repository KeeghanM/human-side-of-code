export const prerender = false

import type { APIRoute } from 'astro'
import sanitizeHtml from 'sanitize-html'

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData()

    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    // First, save the contact to Brevo
    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': `${import.meta.env.BREVO_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: name.split(' ')[0] || name,
          LASTNAME: name.split(' ').slice(1).join(' ') || '',
        },
        listIds: [7],
        updateEnabled: true,
      }),
    })

    if (!contactResponse.ok) {
      const err = await contactResponse.text()
      console.error('Failed to save contact:', err)
      // Don't fail the whole request if contact saving fails
    }

    // Send transactional email
    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': `${import.meta.env.BREVO_API_KEY}`,
      },
      body: JSON.stringify({
        sender: {
          name: 'HuSOC Contact Form',
          email: 'hello@humansideofcode.org', // Must be verified in Brevo
        },
        to: [
          {
            email: 'keeghan@humansideofcode.org', // Your email
            name: 'Keeghan',
          },
        ],
        cc: [
          {
            email: email, // CC the person who submitted
            name: name,
          },
        ],
        subject: `${subject}`,
        htmlContent: sanitizeHtml(`
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This message was sent via the HuSOC contact form. You can reply directly to this email to continue the conversation.</p>
        `),
        replyTo: {
          email: email,
          name: name,
        },
      }),
    })

    if (!emailResponse.ok) {
      const err = await emailResponse.text()
      console.error('Failed to send email:', err)
      return new Response(err, { status: 500 })
    }

    return new Response(null, { status: 200 })
  } catch (err) {
    console.error('Contact form error:', err)
    return new Response(JSON.stringify(err), { status: 500 })
  }
}
