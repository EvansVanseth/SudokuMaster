import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HistoryPage } from '../HistoryPage';
import * as gamePersistence from '../../../game/services/gamePersistence';
import type { GameSummary } from '../../../../domain/types';

// Mock useAuth
vi.mock('../../../auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock gamePersistence
vi.mock('../../../game/services/gamePersistence', async () => {
  const actual = await vi.importActual('../../../game/services/gamePersistence');
  return {
    ...actual,
    loadCompletedGamesForUser: vi.fn(),
  };
});

import { useAuth } from '../../../auth/hooks/useAuth';
import type { User, Session } from '@supabase/supabase-js';

const mockUser = { id: 'user-123', email: 'test@test.com', user_metadata: { display_name: 'TestUser' } };

const mockGames: GameSummary[] = [
  {
    id: 'game-1',
    difficulty: 'easy',
    timeSpent: 120,
    isWinner: true,
    completedAt: '2026-05-15T12:00:00Z',
  },
  {
    id: 'game-2',
    difficulty: 'hard',
    timeSpent: 305,
    isWinner: false,
    completedAt: '2026-05-14T09:00:00Z',
  },
  {
    id: 'game-3',
    difficulty: 'medium',
    timeSpent: 60,
    isWinner: true,
    completedAt: '2026-05-13T18:30:00Z',
  },
];

const renderHistoryPage = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard/history']}>
      <HistoryPage />
    </MemoryRouter>
  );

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser as unknown as User,
      isLoading: false,
      session: { access_token: 'token' } as unknown as Session,
      signOut: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithEmail: vi.fn(),
      signUpWithEmail: vi.fn(),
    });
  });

  it('carga partidas completadas al montar y las muestra', async () => {
    vi.mocked(gamePersistence.loadCompletedGamesForUser).mockResolvedValue(mockGames);

    renderHistoryPage();

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    // Badge text also appears in <option> elements; verify data content renders
    const badges = screen.getAllByText('Fácil');
    expect(badges.length).toBeGreaterThanOrEqual(1);
    expect(badges.some((el) => el.tagName === 'SPAN')).toBe(true);

    const medioBadges = screen.getAllByText('Media');
    expect(medioBadges.length).toBeGreaterThanOrEqual(1);
    expect(medioBadges.some((el) => el.tagName === 'SPAN')).toBe(true);

    const hardBadges = screen.getAllByText('Difícil');
    expect(hardBadges.length).toBeGreaterThanOrEqual(1);
    expect(hardBadges.some((el) => el.tagName === 'SPAN')).toBe(true);
  });

  it('muestra mensaje de empty state cuando no hay partidas completadas', async () => {
    vi.mocked(gamePersistence.loadCompletedGamesForUser).mockResolvedValue([]);

    renderHistoryPage();

    await waitFor(() => {
      expect(screen.getByText('No hay partidas completadas.')).toBeInTheDocument();
    });
  });

  it('filtra por dificultad al seleccionar en FilterBar', async () => {
    const user = userEvent.setup();
    vi.mocked(gamePersistence.loadCompletedGamesForUser).mockResolvedValue(mockGames);

    renderHistoryPage();

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Fácil')).toBeInTheDocument();
    });

    // Select "Difícil" filter
    await user.selectOptions(screen.getByRole('combobox'), 'hard');

    // Should re-query with difficulty filter
    expect(gamePersistence.loadCompletedGamesForUser).toHaveBeenCalledWith('user-123', {
      difficulty: 'hard',
      sortOrder: 'desc',
    });
  });

  it('cambia ordenación al hacer click en el toggle de orden', async () => {
    const user = userEvent.setup();
    vi.mocked(gamePersistence.loadCompletedGamesForUser).mockResolvedValue(mockGames);

    renderHistoryPage();

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Fácil')).toBeInTheDocument();
    });

    // Click sort toggle
    await user.click(screen.getByRole('button', { name: 'Cambiar ordenación' }));

    // Should re-query with asc sort order
    expect(gamePersistence.loadCompletedGamesForUser).toHaveBeenCalledWith('user-123', {
      sortOrder: 'asc',
    });
  });

  it('no llama a loadCompletedGamesForUser cuando no hay usuario', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      session: null,
      signOut: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithEmail: vi.fn(),
      signUpWithEmail: vi.fn(),
    });

    renderHistoryPage();

    expect(gamePersistence.loadCompletedGamesForUser).not.toHaveBeenCalled();
  });

  it('usa columnas explícitas sin board en la consulta', async () => {
    vi.mocked(gamePersistence.loadCompletedGamesForUser).mockResolvedValue(mockGames);

    renderHistoryPage();

    await waitFor(() => {
      expect(gamePersistence.loadCompletedGamesForUser).toHaveBeenCalled();
    });

    // Verify the function was called with correct options — column exclusion is
    // enforced in persistence layer (tested in gamePersistence.test.ts), but we
    // verify the page passes the expected options (no difficulty filter by default)
    const callArg = vi.mocked(gamePersistence.loadCompletedGamesForUser).mock.calls[0][1];
    expect(callArg).toEqual({ sortOrder: 'desc' });
    expect(callArg).not.toHaveProperty('difficulty');
  });
});
