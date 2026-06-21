import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DashboardPage } from '../pages/DashboardPage';
import * as gamePersistence from '../../../features/game/services/gamePersistence';
import type { GameStats } from '../../../domain/types';
import type { RemoteGameSummaryRecord } from '../../../features/game/services/gamePersistence';

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

const mockStats: GameStats = {
  totalGames: 10,
  completedGames: 7,
  completedByDifficulty: { easy: 3, medium: 2, hard: 2 },
  avgTimeOverall: 150,
  avgTimeByDifficulty: { easy: 60, medium: 180, hard: 300 },
};

const mockPendingGames: RemoteGameSummaryRecord[] = [
  { id: 'game-1', user_id: 'user-123', difficulty: 'easy', status: 'in_progress', time_spent: 120, is_winner: false, created_at: '2026-05-18T10:00:00Z', updated_at: '2026-05-18T10:00:00Z' },
  { id: 'game-2', user_id: 'user-123', difficulty: 'hard', status: 'in_progress', time_spent: 300, is_winner: false, created_at: '2026-05-17T09:00:00Z', updated_at: '2026-05-17T09:00:00Z' },
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
      user: { id: 'user-1' } as any,
      isLoading: false,
      session: { access_token: 'token' } as any,
      signOut: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithEmail: vi.fn(),
      signUpWithEmail: vi.fn(),
      getDisplayName: vi.fn(),
      profile: { full_name: 'Test' },
      refreshProfile: vi.fn(),
      isGoogleUser: false,
    } as any);
   });

  it('renderiza stats cards agrupados con valores correctos', async () => {
    vi.mocked(gamePersistence.getGameStats).mockResolvedValue(mockStats);
    vi.mocked(gamePersistence.loadPendingGamesForUser).mockResolvedValue([]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    // Global card
    expect(screen.getByText('Global')).toBeInTheDocument();
    expect(screen.getByText('Total Partidas')).toBeInTheDocument();

    // Difficulty cards + NewGameSection buttons comparten las etiquetas
    expect(screen.getAllByText('Fácil').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Media').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Difícil').length).toBeGreaterThanOrEqual(1);

    // 3 completadas en Fácil, 2 en Media, 2 en Difícil
    expect(screen.getAllByText('3')).toHaveLength(1);
    expect(screen.getAllByText('2')).toHaveLength(2);
  });

  it('muestra el nombre del usuario en el saludo', async () => {
    vi.mocked(gamePersistence.getGameStats).mockResolvedValue(mockStats);
    vi.mocked(gamePersistence.loadPendingGamesForUser).mockResolvedValue([]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/Test/)).toBeInTheDocument();
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

  it('llama a deleteSavedGame y refresca stats al confirmar eliminación', async () => {
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
    // Stats should be refreshed after delete
    expect(gamePersistence.getGameStats).toHaveBeenCalledWith('user-1');
  });
});
