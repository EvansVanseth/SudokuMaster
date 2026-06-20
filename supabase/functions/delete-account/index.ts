import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Resend } from "npm:resend@2.0.0"
import { getAccountDeletedTemplate } from "./template.ts"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

serve(async (req) => {
  // Manejo de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    // Inicializar el cliente admin con la SERVICE_ROLE_KEY
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Obtener el ID del usuario desde el JWT de la petición
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No autorizado')
    }
    
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(jwt)
    
    if (authError || !user) {
      throw new Error('No autorizado')
    }

    const email = user.email!

    // Borrado definitivo
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
    
    if (deleteError) {
      throw deleteError
    }

    // Enviar correo de confirmación
    await resend.emails.send({
      from: 'SudokuMaster <seguridad@sudokumaster.games>',
      to: [email],
      subject: 'Cuenta eliminada correctamente',
      html: getAccountDeletedTemplate(email),
    })

    return new Response(JSON.stringify({ message: "Cuenta eliminada correctamente" }), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
      status: 400,
    })
  }
})
