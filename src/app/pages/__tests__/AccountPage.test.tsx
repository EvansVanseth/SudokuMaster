
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, type Mock } from 'vitest';
import AccountPage from '../AccountPage';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { useAccount } from '../../../features/account/hooks/useAccount';

vi.mock('../../../features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../features/account/hooks/useAccount', () => ({
  useAccount: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...(actual as any),
      useNavigate: vi.fn(),
    };
});

describe('AccountPage', () => {
  const navigateMock = vi.fn();
  (useNavigate as unknown as Mock).mockReturnValue(navigateMock);

  it('renders user email and controls', () => {
    (useAuth as unknown as Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      signOut: vi.fn(),
    });
    (useAccount as unknown as Mock).mockReturnValue({
        isGoogleUser: false,
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

  it('renders email input for google user', () => {
    (useAuth as unknown as Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      signOut: vi.fn(),
    });
    (useAccount as unknown as Mock).mockReturnValue({
        isGoogleUser: true,
    });

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/Escribe tu email para confirmar/i)).toBeDefined();
  });

  it('redirects to home after successful deletion', async () => {
    const deleteAccountMock = vi.fn().mockResolvedValue(true);
    (useAuth as unknown as Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      signOut: vi.fn(),
    });
    (useAccount as unknown as Mock).mockReturnValue({
        isGoogleUser: false,
        deleteAccount: deleteAccountMock,
    });

    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );
    
    // Open delete confirmation modal
    const passwordInput = screen.getByPlaceholderText(/Contraseña para confirmar/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const deleteButton = screen.getByRole('button', { name: /Eliminar Cuenta/i });
    fireEvent.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /Confirmar eliminación/i });
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
        expect(deleteAccountMock).toHaveBeenCalled();
        expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });
});
