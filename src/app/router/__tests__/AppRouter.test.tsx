import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FC, ReactNode } from 'react';

// Mock ProtectedRoute to just render children
vi.mock('../../../features/auth/components/ProtectedRoute', () => ({
  ProtectedRoute: (({ children }: { children: ReactNode }) => <>{children}</>) as FC<{ children: ReactNode }>,
}));

// Mock useAuth
vi.mock('../../../features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock gamePersistence so HistoryPage loads correctly
vi.mock('../../../features/game/services/gamePersistence', () => ({
  loadCompletedGamesForUser: vi.fn().mockResolvedValue([]),
}));

import { AppRouter } from '../AppRouter';
import { useAuth } from '../../../features/auth/hooks/useAuth';

describe('AppRouter — /dashboard/history route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'test@test.com' } as any,
      isLoading: false,
      session: { access_token: 'token' } as any,
      signOut: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithEmail: vi.fn(),
      signUpWithEmail: vi.fn(),
    });
  });

  it('navega a /dashboard/history y renderiza HistoryPage', async () => {
    // Use pushState to set the URL before rendering
    window.history.pushState({}, '', '/dashboard/history');

    render(<AppRouter />);

    await waitFor(() => {
      expect(screen.getByText('Historial')).toBeInTheDocument();
    });

    // Verify HistoryPage content renders
    expect(
      screen.getByText(
        'Revisa tus partidas completadas, filtra por dificultad y ordena por fecha.'
      )
    ).toBeInTheDocument();
  });
});
