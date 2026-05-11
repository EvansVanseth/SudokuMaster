import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Usamos import.meta.env que es lo estándar en Vite/Vitest
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl || '', serviceRoleKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

describe('Auth Flow Verification', () => {
  const testEmail = `user${Math.floor(Math.random() * 1000000)}@test.com`;
  const testPassword = 'Password123!';
  let userId: string;

  it('debería permitir el registro de un nuevo usuario', async () => {
    // Usamos el cliente admin para crear el usuario directamente y evitar límites de envío de emails
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });

    expect(error).toBeNull();
    expect(data.user).not.toBeNull();
    expect(data.user?.email).toBe(testEmail);
    
    if (data.user) {
      userId = data.user.id;
    }
  });

  it('debería confirmar que el usuario existe en el sistema', async () => {
    // Usamos el cliente admin para buscar al usuario por ID
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    expect(error).toBeNull();
    expect(data.user).not.toBeNull();
    expect(data.user?.id).toBe(userId);
  });

  it('debería permitir la eliminación del usuario correctamente', async () => {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    expect(error).toBeNull();

    // Verificar que ya no existe
    const { data: dataCheck, error: errorCheck } = await supabaseAdmin.auth.admin.getUserById(userId);
    expect(dataCheck.user).toBeNull();
    expect(errorCheck).not.toBeNull();
  });
});
