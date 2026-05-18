import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FilterBar } from '../FilterBar';

describe('FilterBar', () => {
  it('renderiza el selector de dificultad con opción All seleccionada por defecto', () => {
    render(
      <FilterBar
        difficulty="all"
        sortOrder="desc"
        onDifficultyChange={vi.fn()}
        onSortToggle={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('all');
  });

  it('renderiza las 4 opciones de dificultad en el select', () => {
    render(
      <FilterBar
        difficulty="all"
        sortOrder="desc"
        onDifficultyChange={vi.fn()}
        onSortToggle={vi.fn()}
      />
    );

    expect(screen.getByRole('option', { name: 'Todas' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Fácil' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Media' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Difícil' })).toBeInTheDocument();
  });

  it('muestra el valor de dificultad seleccionado', () => {
    render(
      <FilterBar
        difficulty="hard"
        sortOrder="desc"
        onDifficultyChange={vi.fn()}
        onSortToggle={vi.fn()}
      />
    );

    expect(screen.getByRole('combobox')).toHaveValue('hard');
  });

  it('llama a onDifficultyChange al seleccionar una dificultad', async () => {
    const user = userEvent.setup();
    const onDifficultyChange = vi.fn();

    render(
      <FilterBar
        difficulty="all"
        sortOrder="desc"
        onDifficultyChange={onDifficultyChange}
        onSortToggle={vi.fn()}
      />
    );

    await user.selectOptions(screen.getByRole('combobox'), 'medium');
    expect(onDifficultyChange).toHaveBeenCalledWith('medium');
  });

  it('renderiza el botón de ordenación con texto correcto para newest-first', () => {
    render(
      <FilterBar
        difficulty="all"
        sortOrder="desc"
        onDifficultyChange={vi.fn()}
        onSortToggle={vi.fn()}
      />
    );

    const sortButton = screen.getByRole('button');
    expect(sortButton).toHaveTextContent('Más recientes');
  });

  it('renderiza el botón de ordenación con texto correcto para oldest-first', () => {
    render(
      <FilterBar
        difficulty="all"
        sortOrder="asc"
        onDifficultyChange={vi.fn()}
        onSortToggle={vi.fn()}
      />
    );

    const sortButton = screen.getByRole('button');
    expect(sortButton).toHaveTextContent('Más antiguas');
  });

  it('llama a onSortToggle al hacer click en el botón de ordenación', async () => {
    const user = userEvent.setup();
    const onSortToggle = vi.fn();

    render(
      <FilterBar
        difficulty="all"
        sortOrder="desc"
        onDifficultyChange={vi.fn()}
        onSortToggle={onSortToggle}
      />
    );

    await user.click(screen.getByRole('button'));
    expect(onSortToggle).toHaveBeenCalledOnce();
  });

  it('tiene aria-label accesible en el botón de ordenación', () => {
    render(
      <FilterBar
        difficulty="all"
        sortOrder="desc"
        onDifficultyChange={vi.fn()}
        onSortToggle={vi.fn()}
      />
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Cambiar ordenación');
  });
});
