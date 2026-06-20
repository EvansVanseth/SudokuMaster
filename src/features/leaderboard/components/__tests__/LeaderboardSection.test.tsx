import { render, screen, waitFor } from '@testing-library/react';
import { LeaderboardSection } from '../LeaderboardSection';
import { vi, describe, it, expect, type Mock } from 'vitest';
import * as api from '../../api/fetchLeaderboard';

vi.mock('../../api/fetchLeaderboard');

describe('LeaderboardSection', () => {
    it('renders loading state', () => {
        (api.fetchLeaderboard as unknown as Mock).mockReturnValue(new Promise(() => {}));
        render(<LeaderboardSection useMock={false} />);
        expect(screen.getByText(/cargando ranking/i)).toBeInTheDocument();
    });

    it('renders data after fetch', async () => {
        (api.fetchLeaderboard as unknown as Mock).mockResolvedValue({ data: [{ user_id: '1', display_name: 'Player1', total_score: 100 }], error: null });
        render(<LeaderboardSection useMock={false} />);
        await waitFor(() => expect(screen.getByText(/Player1/i)).toBeInTheDocument());
    });
});
