import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardPage } from '../pages/DashboardPage';
import * as gamePersistence from '../../../features/game/services/gamePersistence';
import type { GameStats, GameSummary } from '../../../domain/types';

// Mock useAuth
vi.mock('../../../features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock gamePersistence functions
vi.mock('../../../features/game/services/gamePersistence', async () => {
  const actual = await vi.importActual('../../../features/game/services/gamePersistence');
  return {
    ...actual,
    loadPendingGamesForUser: vi.fn(),
    getGameStats: vi.fn(),
    loadSavedGameById: vi.fn(),
    deleteSavedGame: vi.fn(),
  };
});

import { useAuth } from '../../../features/auth/hooks/useAuth';

const mockUser = { id: 'user-123', email: 'test@test.com', user_metadata: { display_name: 'TestUser' } };

const mockStats: GameStats = {
  totalGames: 10,
  completedGames: 7,
  winRate: 71.43,
  avgTimeOverall: 150,
  avgTimeByDifficulty: { easy: 60, medium: 180, hard: 300 },
};

const mockPendingGames: GameSummary[] = [
  { id: 'game-1', difficulty: 'easy', timeSpent: 120, isWinner: false, completedAt: '2026-05-18T10:00:00Z' },
  { id: 'game-2', difficulty: 'hard', timeSpent: 300, isWinner: false, completedAt: '2026-05-17T09:00:00Z' },
];

const renderDashboard = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <DashboardPage />
    </MemoryRouter>
  );

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: mockUser as any,
      isLoading: false,
      session: { access_token: 'token' } as any,
      signOut: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithEmail: vi.fn(),
      signUpWithEmail: vi.fn(),
    });
  });

  it('renderiza stats cards con valores correctos', async () => {
    vi.mocked(gamePersistence.getGameStats).mockResolvedValue(mockStats);
    vi.mocked(gamePersistence.loadPendingGamesForUser).mockResolvedValue([]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    expect(screen.getByText('Total Partidas')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('71%')).toBeInTheDocument();
  });

  it('muestra el nombre del usuario en el saludo', async () => {
    vi.mocked(gamePersistence.getGameStats).mockResolvedValue(mockStats);
    vi.mocked(gamePersistence.loadPendingGamesForUser).mockResolvedValue([]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/TestUser/)).toBeInTheDocument();
    });
  });

  it('muestra mensaje de empty state cuando no hay partidas pendientes', async () => {
    vi.mocked(gamePersistence.getGameStats).mockResolvedValue(mockStats);
    vi.mocked(gamePersistence.loadPendingGamesForUser).mockResolvedValue([]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/No tienes partidas pendientes/)).toBeInTheDocument();
    });
  });

  it('muestra la lista de partidas pendientes', async () => {
    vi.mocked(gamePersistence.getGameStats).mockResolvedValue(mockStats);
    vi.mocked(gamePersistence.loadPendingGamesForUser).mockResolvedValue(mockPendingGames);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText('Reanudar').length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getAllByText('Reanudar')).toHaveLength(2);
  });

  it('abre el modal de confirmación al hacer click en Eliminar', async () => {
    const user = userEvent.setup();
    vi.mocked(gamePersistence.getGameStats).mockResolvedValue(mockStats);
    vi.mocked(gamePersistence.loadPendingGamesForUser).mockResolvedValue(mockPendingGames);
    vi.mocked(gamePersistence.deleteSavedGame).mockResolvedValue({});

    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText('Eliminar').length).toBeGreaterThanOrEqual(1);
    });

    await user.click(screen.getAllByText('Eliminar')[0]);

    expect(screen.getByText(/no se puede deshacer/i)).toBeInTheDocument();
  });

  it('llama a deleteSavedGame al confirmar eliminación', async () => {
    const user = userEvent.setup();
    vi.mocked(gamePersistence.getGameStats).mockResolvedValue(mockStats);
    vi.mocked(gamePersistence.loadPendingGamesForUser).mockResolvedValue(mockPendingGames);
    vi.mocked(gamePersistence.deleteSavedGame).mockResolvedValue({});

    renderDashboard();

    await waitFor(() => {
      expect(screen.getAllByText('Eliminar').length).toBeGreaterThanOrEqual(1);
    });

    await user.click(screen.getAllByText('Eliminar')[0]);
    await user.click(screen.getByText('Sí, eliminar'));

    expect(gamePersistence.deleteSavedGame).toHaveBeenCalledWith('game-1');
  });
});
