import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Mock useAuth
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../hooks/useAuth';
import type { User, Session } from '@supabase/supabase-js';

const renderProtected = (initialRoute = '/protected') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  it('muestra loading mientras se verifica la sesión', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: true,
      session: null,
      signOut: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithEmail: vi.fn(),
      signUpWithEmail: vi.fn(),
    });

    renderProtected();

    expect(screen.getByText('Cargando sesión...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirige a /login cuando el usuario no está autenticado', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      session: null,
      signOut: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithEmail: vi.fn(),
      signUpWithEmail: vi.fn(),
    });

    renderProtected();

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renderiza el contenido protegido cuando el usuario está autenticado', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-123' } as unknown as User,
      isLoading: false,
      session: { access_token: 'token' } as unknown as Session,
      signOut: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithEmail: vi.fn(),
      signUpWithEmail: vi.fn(),
    });

    renderProtected();

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});
