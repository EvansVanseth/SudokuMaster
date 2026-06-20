import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';
import { describe, it, expect } from 'vitest';
import { version } from '../../../../package.json';

describe('Footer', () => {
  it('renders the application version', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(`v${version}`, 'i'))).toBeInTheDocument();
  });
});
