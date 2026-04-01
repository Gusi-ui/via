import type { APIRoute } from 'astro';

export const prerender = false;

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const sanitize = (input: string): string =>
  input.replace(/[<>]/g, '').trim();

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as Partial<ContactPayload>;

    const name = sanitize(body.name || '');
    const email = sanitize(body.email || '');
    const message = sanitize(body.message || '');

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos son obligatorios.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'El email no es válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Los campos exceden la longitud máxima permitida.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // In production, integrate with Cloudflare Email Workers, Resend, or similar.
    // For now, log the submission (visible in Cloudflare Worker logs).
    console.log('Contact form submission:', { name, email, message: message.slice(0, 100) });

    // TODO: Replace with actual email sending service
    // Example with Resend:
    // const resend = new Resend(env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'web@viandalucia.org',
    //   to: 'viandalucia@viandalucia.org',
    //   subject: `Contacto web: ${name}`,
    //   text: `Nombre: ${name}\nEmail: ${email}\nMensaje:\n${message}`,
    // });

    return new Response(
      JSON.stringify({ success: true, message: 'Mensaje enviado correctamente.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
