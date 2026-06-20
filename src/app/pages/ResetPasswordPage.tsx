import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { supabase } from '../../shared/api/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordPage: FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      alert('Contraseña actualizada con éxito.');
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h1>Nueva contraseña</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Nueva contraseña</label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="••••••••"
          />
        </div>
        
        {error && <p style={{ color: '#ff9966' }}>{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  );
};
