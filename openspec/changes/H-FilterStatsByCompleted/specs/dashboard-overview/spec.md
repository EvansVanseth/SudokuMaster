# Delta for Dashboard Overview

## MODIFIED Requirements

### Requirement: Display Stats Cards

The system **MUST** display four stat cards on `/dashboard`. All statistics, including **Total games played** (count of records with `status = 'completed'`), **Games completed** (same count), **Win rate %** (percentage of completed games where `is_winner = true`), and **Average time spent** (mean `time_spent` across all **completed** games), **MUST** be calculated using **ONLY** games with `status = 'completed'`.

The stats query **MUST NOT** fetch the `board` JSONB column.

(Previously: Stat cards displayed stats calculated from ALL games, including in-progress and completed games.)

#### Scenario: Stats reflect only completed user games

- GIVEN a user has 10 total games (7 completed, 3 pending), of which 5 completed games are wins
- WHEN the dashboard loads
- THEN stat cards show: total = 7, completed = 7, win rate = 71%, avg time = mean of 7 completed games only

#### Scenario: User has zero completed games

- GIVEN a user with only pending games
- WHEN the dashboard loads
- THEN stat cards show: total = 0, completed = 0, win rate = 0%, avg time = 0
