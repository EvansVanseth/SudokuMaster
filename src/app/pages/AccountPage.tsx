
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { supabase } from '../../shared/api/supabaseClient';
import styles from './AccountPage.module.css';
import { DashboardIcon, LogoutIcon } from '../../shared/ui/icons';

const AccountPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      if (data?.full_name) {
        setFullName(data.full_name);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdateName = async () => {
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);
    alert('Nombre actualizado');
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.card} glass-card`}>
        <h1>Mi Cuenta</h1>
        
        <div className={styles.profileInfo}>
          {user && <p className={styles.email}>Email: {user.email}</p>}
          <p className={styles.email}>Nombre actual: {fullName || 'No configurado'}</p>
          
          <div className="form-group">
            <label>Actualizar Nombre Completo</label>
            <input 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Escribe tu nuevo nombre"
            />
          </div>
          <button onClick={handleUpdateName} className="btn-primary" style={{ width: '100%' }}>
            Actualizar Nombre
          </button>
        </div>
        
        <div className={styles.actions}>
          <button onClick={signOut} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <LogoutIcon width={16} height={16} />
            Cerrar Sesión
          </button>
          <button disabled className="btn-secondary">Cambiar Contraseña (próximamente)</button>
          <button disabled className="btn-danger">Eliminar Cuenta (próximamente)</button>
        </div>

        <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <DashboardIcon width={16} height={16} />
            Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
