import { useState } from 'react';
import { supabase } from '../../../shared/api/supabaseClient';
import { useAuth } from '../../auth/hooks/useAuth';

export const useAccount = () => {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGoogleUser = user?.app_metadata?.provider === 'google';

  const updateProfile = async (fullName: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);
      
      if (err) throw err;
      
      // Actualizar el contexto en memoria
      await refreshProfile();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (isGoogleUser) {
        setError('No puedes cambiar la contraseña de una cuenta vinculada a Google.');
        return false;
    }
    if (!user || !user.email) return false;
    setLoading(true);
    setError(null);
    try {
        // 1. Verify current password
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword
        });

        if (authError) throw new Error('Contraseña actual incorrecta');

        // 2. Update password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (updateError) throw updateError;
        
        await supabase.functions.invoke('notify-password-change', {
          body: { email: user.email }
        });

        return true;
    } catch (e: any) {
        setError(e.message);
        return false;
    } finally {
        setLoading(false);
    }
  };

  const deleteAccount = async (confirmation: string) => {
    if (!user || !user.email) return;
    setLoading(true);
    setError(null);
    try {
        // 1. Verificar identidad
        if (isGoogleUser) {
            if (confirmation !== user.email) throw new Error('El email no coincide.');
        } else {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: confirmation
            });
            if (authError) throw new Error('Contraseña incorrecta');
        }

        // 2. LLAMADA A LA NUEVA EDGE FUNCTION
        const { error: fnError } = await supabase.functions.invoke('delete-account', {
            body: { } // El ID ya lo detectamos en el servidor vía JWT
        });

        if (fnError) throw new Error('Error al eliminar la cuenta');

        // 3. Sign out obligatorio tras el borrado
        await supabase.auth.signOut();
    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  };

  return { loading, error, isGoogleUser, updateProfile, changePassword, deleteAccount };
};
