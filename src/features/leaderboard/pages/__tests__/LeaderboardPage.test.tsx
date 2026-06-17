import { render, screen } from '@testing-library/react';
import { LeaderboardPage } from '../LeaderboardPage';
import { describe, it, expect } from 'vitest';

describe('LeaderboardPage', () => {
    it('renders title', () => {
        render(<LeaderboardPage />);
        expect(screen.getByText(/leaderboard/i)).toBeInTheDocument();
    });
});
