import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../api/fetchLeaderboard';
import styles from './LeaderboardSection.module.css';

interface Player {
    user_id: string;
    display_name: string;
    total_score: number;
}

const MOCK_DATA: Player[] = [
    { user_id: '1', display_name: 'Juan Alonso Garcia', total_score: 50 },
    { user_id: '2', display_name: 'Maria Sudoku Picapiedra', total_score: 45 },
    { user_id: '3', display_name: 'Pedro Master Galandero', total_score: 40 },
    { user_id: '4', display_name: 'Ana Pro', total_score: 35 },
    { user_id: '5', display_name: 'Luis Fan', total_score: 30 },
    { user_id: '6', display_name: 'Sara Gamer', total_score: 25 },
    { user_id: '7', display_name: 'Javi Player', total_score: 20 },
    { user_id: '8', display_name: 'Elena Sudoku', total_score: 15 },
    { user_id: '9', display_name: 'Carlos Bot', total_score: 10 },
    { user_id: '10', display_name: 'Sofia Newbie', total_score: 5 },
];

export function LeaderboardSection({ useMock = true }: { useMock?: boolean }) {
    const [players, setPlayers] = useState<Player[] | null>(useMock ? MOCK_DATA : null);
    const [loading, setLoading] = useState(!useMock);

    useEffect(() => {
        if (useMock) return;

        fetchLeaderboard().then(res => {
            if (res.data) setPlayers(res.data);
            setLoading(false);
        });
    }, [useMock]);

    if (loading) return <div>Cargando ranking...</div>;
    if (!players || players.length === 0) return <div>No hay jugadores aún.</div>;

    return (
        <section className={styles.leaderboardSection}>
            <h2>Top 10 Jugadores</h2>
            <div className={styles.podium}>
                {players.slice(1, 2).map(p => (
                    <div key={p.user_id} className={`${styles.podiumItem} ${styles.podium2}`}>
                        <div className={styles.nameWrapper}>
                            <span className={styles.nameText}>{p.display_name}</span>
                        </div>
                        <div className={styles.borderWrapper}>
                            <span className={styles.scoreText}>{p.total_score}</span>
                        </div>
                    </div>
                ))}
                {players.slice(0, 1).map(p => (
                    <div key={p.user_id} className={`${styles.podiumItem} ${styles.podium1}`}>
                        <div className={styles.nameWrapper}>
                            <span className={styles.nameText}>{p.display_name}</span>
                        </div>
                        <div className={styles.borderWrapper}>
                            <span className={styles.scoreText}>{p.total_score}</span>
                        </div>
                    </div>
                ))}
                {players.slice(2, 3).map(p => (
                    <div key={p.user_id} className={`${styles.podiumItem} ${styles.podium3}`}>
                        <div className={styles.nameWrapper}>
                            <span className={styles.nameText}>{p.display_name}</span>
                        </div>
                        <div className={styles.borderWrapper}>
                            <span className={styles.scoreText}>{p.total_score}</span>
                        </div>
                    </div>
                ))}
            </div>
            <ol className={styles.leaderboardList}>
                {players.slice(3).map((player, index) => (
                    <li key={player.user_id} className={styles.listItem}>
                        <span>{index + 4}. {player.display_name}</span>
                        <span>{player.total_score} pts</span>
                    </li>
                ))}
            </ol>
        </section>
    );
}
