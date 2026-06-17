import { render, screen } from '@testing-library/react';
import { AppLayout } from '../AppLayout';
import { describe, it, expect } from 'vitest';

describe('AppLayout', () => {
  it('renders children and footer', () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    // Assuming Footer is rendered within a footer tag
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
