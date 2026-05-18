import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HistoryList } from '../HistoryList';
import type { GameSummary } from '../../../../domain/types';

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

describe('HistoryList', () => {
  it('renderiza las partidas completadas con dificultad, tiempo, resultado y fecha', () => {
    render(<HistoryList games={mockGames} isLoading={false} error={null} />);

    // Should show difficulty badges
    expect(screen.getByText('Fácil')).toBeInTheDocument();
    expect(screen.getByText('Difícil')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();

    // Should show formatted time
    expect(screen.getByText('2 min 0 seg')).toBeInTheDocument();
    expect(screen.getByText('5 min 5 seg')).toBeInTheDocument();
    expect(screen.getByText('1 min 0 seg')).toBeInTheDocument();

    // Should show won/lost (2 games won, 1 lost)
    const wonElements = screen.getAllByText('Ganada');
    expect(wonElements).toHaveLength(2);
    expect(screen.getByText('Perdida')).toBeInTheDocument();
  });

  it('renderiza el mensaje de empty state cuando no hay partidas', () => {
    render(<HistoryList games={[]} isLoading={false} error={null} />);

    expect(screen.getByText('No hay partidas completadas.')).toBeInTheDocument();
  });

  it('muestra mensaje de carga cuando isLoading es true', () => {
    render(<HistoryList games={[]} isLoading={true} error={null} />);

    expect(screen.getByText('Cargando historial...')).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando hay error', () => {
    render(<HistoryList games={[]} isLoading={false} error="Error de red" />);

    expect(screen.getByText('Error: Error de red')).toBeInTheDocument();
  });

  it('no renderiza la tabla cuando no hay partidas', () => {
    render(<HistoryList games={[]} isLoading={false} error={null} />);

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renderiza la tabla cuando hay partidas', () => {
    render(<HistoryList games={mockGames} isLoading={false} error={null} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('tiene columnas de encabezado correctas', () => {
    render(<HistoryList games={mockGames} isLoading={false} error={null} />);

    expect(screen.getByText('Dificultad')).toBeInTheDocument();
    expect(screen.getByText('Tiempo')).toBeInTheDocument();
    expect(screen.getByText('Resultado')).toBeInTheDocument();
    expect(screen.getByText('Fecha')).toBeInTheDocument();
  });
});
