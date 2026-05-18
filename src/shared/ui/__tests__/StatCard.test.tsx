import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from '../StatCard';

describe('StatCard', () => {
  it('renderiza label y value correctamente', () => {
    render(<StatCard label="Total Games" value={42} />);

    expect(screen.getByText('Total Games')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renderiza value como string', () => {
    render(<StatCard label="Win Rate" value="71%" />);

    expect(screen.getByText('Win Rate')).toBeInTheDocument();
    expect(screen.getByText('71%')).toBeInTheDocument();
  });

  it('muestra el icono cuando se proporciona', () => {
    render(
      <StatCard
        label="Games"
        value={10}
        icon={<span data-testid="test-icon">🏆</span>}
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });
});
