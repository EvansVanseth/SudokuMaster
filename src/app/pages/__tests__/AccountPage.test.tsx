
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, type Mock } from 'vitest';
import AccountPage from '../AccountPage';
import { useAuth } from '../../../features/auth/hooks/useAuth';

vi.mock('../../../features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('AccountPage', () => {
  it('renders user email and controls', () => {
    (useAuth as unknown as Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Cerrar Sesión/i })).toBeDefined();
    expect(screen.getByPlaceholderText(/Nuevo nombre/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Actualizar/i })).toBeDefined();
  });

  it('calls signOut when Logout button is clicked', async () => {
    const signOutMock = vi.fn();
    (useAuth as unknown as Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      signOut: signOutMock,
    });

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );
    const logoutButton = screen.getByRole('button', { name: /Cerrar Sesión/i });
    fireEvent.click(logoutButton);
    expect(signOutMock).toHaveBeenCalled();
  });
});
