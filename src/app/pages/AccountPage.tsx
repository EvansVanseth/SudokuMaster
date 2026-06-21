import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useAccount } from '../../features/account/hooks/useAccount';
import styles from './AccountPage.module.css';
import { DashboardIcon, LogoutIcon } from '../../shared/ui/icons';
import { Modal } from '../../shared/ui/Modal';
import { validatePassword } from '../../domain/auth/password';

const AccountPage = () => {
  const { user, signOut, profile } = useAuth();
  const { loading, error, isGoogleUser, updateProfile, changePassword, deleteAccount } = useAccount();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handlePasswordChange = async () => {
    if (passwordError) return;
    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      setShowSuccessModal(true);
      setCurrentPassword('');
      setNewPassword('');
    }
  };

  return (
    <div className={styles.page}>
      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <h2>¡Éxito!</h2>
          <p>Contraseña modificada con éxito.</p>
          <button className="btn-primary" onClick={() => setShowSuccessModal(false)}>Cerrar</button>
        </div>
      </Modal>
      
      <Modal isOpen={showDeleteConfirmModal} onClose={() => setShowDeleteConfirmModal(false)}>
        <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <h2>¿Estás seguro?</h2>
          <p>Esta acción es irreversible. Se eliminarán permanentemente tus datos de perfil, estadísticas y partidas guardadas.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-secondary" onClick={() => setShowDeleteConfirmModal(false)}>Cancelar</button>
              <button className="btn-danger" onClick={async () => { 
                  const success = await deleteAccount(deletePassword); 
                  if (success) {
                      setShowDeleteConfirmModal(false); 
                      navigate('/'); 
                  }
              }}>Confirmar eliminación</button>
          </div>
        </div>
      </Modal>

      <div className={`${styles.card} glass-card`}>
        <h1>Mi Cuenta</h1>
        
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.profileInfo}>
          <h3>Identificación</h3>
          <p className={styles.profileData}><span className={styles.label}>Email:</span> <span className={styles.value}>{user?.email}</span></p>
          
          <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
            <label>Actualizar Nombre</label>
            <input 
              className={styles.input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={profile?.full_name || "Nuevo nombre"}
            />
            <button onClick={() => updateProfile(fullName)} className="btn-primary" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>
        
        <div className={styles.profileInfo}>
          <h3>Seguridad</h3>
          {!isGoogleUser && (
              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <input className={styles.input} type={showCurrentPassword ? 'text' : 'password'} placeholder="Contraseña actual" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                    <label htmlFor="showCurrentPassword" style={{ fontSize: '0.85rem', marginRight: '1rem', marginLeft: '1rem' }}>Mostrar</label>
                    <input
                      id="showCurrentPassword"
                      type="checkbox"
                      checked={showCurrentPassword}
                      onChange={(e) => setShowCurrentPassword(e.target.checked)}
                      style={{ margin: 0 }}
                    />
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                <input className={styles.input} type={showNewPassword ? 'text' : 'password'} placeholder="Nueva contraseña" value={newPassword} onChange={(e) => handleNewPasswordChange(e.target.value)} />
                {passwordError && <p className={styles.error} style={{ marginTop: '0.5rem' }}>{passwordError}</p>}
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                    <label htmlFor="showNewPassword" style={{ fontSize: '0.85rem', marginRight: '1rem', marginLeft: '1rem' }}>Mostrar</label>
                    <input
                      id="showNewPassword"
                      type="checkbox"
                      checked={showNewPassword}
                      onChange={(e) => setShowNewPassword(e.target.checked)}
                      style={{ margin: 0 }}
                    />
                  </div>
                </div>
                <button 
                  onClick={handlePasswordChange} 
                  className="btn-secondary" 
                  disabled={loading || !currentPassword || !newPassword || !!passwordError}
                >
                    Cambiar Contraseña
                </button>
              </div>
          )}
          {isGoogleUser && (
            <p className={styles.profileData}>La gestión de contraseña se realiza a través de tu cuenta de Google.</p>
          )}

          <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
            <h3>Eliminar cuenta</h3>
            <input 
              className={styles.input} 
              type={showDeletePassword ? "text" : (isGoogleUser ? "text" : "password")} 
              placeholder={isGoogleUser ? "Escribe tu email para confirmar" : "Contraseña para confirmar"} 
              value={deletePassword} 
              onChange={(e) => setDeletePassword(e.target.value)} 
            />
            {!isGoogleUser && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                <label htmlFor="showDeletePassword" style={{ fontSize: '0.85rem', marginRight: '1rem', marginLeft: '1rem' }}>Mostrar</label>
                <input
                  id="showDeletePassword"
                  type="checkbox"
                  checked={showDeletePassword}
                  onChange={(e) => setShowDeletePassword(e.target.checked)}
                  style={{ margin: 0 }}
                />
              </div>
            )}
            <button 
              onClick={() => setShowDeleteConfirmModal(true)} 
              className="btn-danger" 
              disabled={loading || !deletePassword || (isGoogleUser ? deletePassword !== user?.email : deletePassword.length === 0)}
            >
                Eliminar Cuenta
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={signOut} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <LogoutIcon width={16} height={16} />
            Cerrar Sesión
          </button>
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
