import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"
import { getPasswordChangeTemplate } from "./template.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  // CORS igual que en send-feedback
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    const { email } = await req.json();

    await resend.emails.send({
      from: 'SudokuMaster <seguridad@sudokumaster.games>', // Ajustado al dominio de tu otra función
      to: email, // Resend acepta string o array
      subject: 'Contraseña actualizada correctamente',
      html: getPasswordChangeTemplate(email)
    });

    return new Response(JSON.stringify({ message: "Notificación enviada" }), {
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