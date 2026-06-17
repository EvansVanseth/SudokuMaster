import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';
import { describe, it, expect } from 'vitest';

describe('Footer', () => {
  it('renders the application version', () => {
    // __APP_VERSION__ is defined in vite.config.ts
    render(<Footer />);
    expect(screen.getByText(/Version: 0.0.0/i)).toBeInTheDocument();
  });
});
