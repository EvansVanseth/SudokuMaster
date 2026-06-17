
import { render, screen, fireEvent } from '@testing-library/react';
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

    render(<AccountPage />);
    expect(screen.getByText(/test@example.com/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /logout/i })).toBeDefined();
    expect(screen.getByPlaceholderText(/new full name/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /update name/i })).toBeDefined();
  });

  it('calls signOut when Logout button is clicked', async () => {
    const signOutMock = vi.fn();
    (useAuth as unknown as Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      signOut: signOutMock,
    });

    render(<AccountPage />);
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    expect(signOutMock).toHaveBeenCalled();
  });
});
