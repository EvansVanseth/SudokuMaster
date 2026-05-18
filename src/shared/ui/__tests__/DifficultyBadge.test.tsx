import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DifficultyBadge } from '../DifficultyBadge';

describe('DifficultyBadge', () => {
  it('muestra el texto en español para easy', () => {
    render(<DifficultyBadge difficulty="easy" />);
    expect(screen.getByText('Fácil')).toBeInTheDocument();
  });

  it('muestra el texto en español para medium', () => {
    render(<DifficultyBadge difficulty="medium" />);
    expect(screen.getByText('Media')).toBeInTheDocument();
  });

  it('muestra el texto en español para hard', () => {
    render(<DifficultyBadge difficulty="hard" />);
    expect(screen.getByText('Difícil')).toBeInTheDocument();
  });
});
