import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  // CORS para permitir peticiones desde tu app
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    const { message, app_version, user_email } = await req.json();

    await resend.emails.send({
      from: 'SudokuMaster <feedback@sudokumaster.games>', // O un email verificado en Resend
      to: 'evansvanseth@gmail.com',
      subject: 'Nueva sugerencia de SudokuMaster',
      html: `<p><strong>Versión:</strong> ${app_version}</p>
             <p><strong>De:</strong> ${user_email}</p>
             <p><strong>Mensaje:</strong> ${message}</p>`
    });

    return new Response(JSON.stringify({ message: "Enviado correctamente" }), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
      status: 400,
    });
  }
});
