# Dashboard Overview Specification

## Purpose

Stats aggregation and pending-game management for authenticated users. Computes statistics client-side from queried game records and displays actionable pending games.

## Requirements

### Requirement: Display Stats Cards

The system **MUST** display four stat cards on `/dashboard`:

- **Total games played** — count of all records for the user (`in_progress` + `completed`)
- **Games completed** — count of records with `status = 'completed'`
- **Win rate %** — percentage of completed games where `is_winner = true`
- **Average time spent** — mean `time_spent` across all games (overall) AND broken down per difficulty

Stats **MUST** be computed client-side from the full query result set. The stat query **MUST NOT** fetch the `board` JSONB column.

#### Scenario: Stats reflect all user games

- GIVEN a user has 10 total games (7 completed, 3 pending), of which 5 completed games are wins
- WHEN the dashboard loads
- THEN stat cards show: total = 10, completed = 7, win rate = 71%, avg time = correct mean

#### Scenario: User has zero games

- GIVEN a newly registered user with no games
- WHEN the dashboard loads
- THEN stat cards show: total = 0, completed = 0, win rate = 0%, avg time = 0

### Requirement: Display Pending Games List

The system **MUST** list pending games (`status = 'in_progress'`) showing difficulty, time spent (formatted as Xm Ys), last updated timestamp, and Resume / Delete action buttons. The list **MUST** be sorted by `updated_at` descending (most recently updated first). Clicking Resume **MUST** restore game state and navigate to `/game/{difficulty}`. Clicking Delete **MUST** remove the record after confirmation in a modal.

#### Scenario: Resume a pending game

- GIVEN the user has a pending game with `difficulty = 'medium'` and `id = 'abc-123'`
- WHEN they click "Resume" on that row
- THEN the system restores the game state and navigates to `/game/medium`

#### Scenario: Delete a pending game (with confirmation)

- GIVEN the user clicks "Delete" on a pending game
- WHEN they confirm in the modal
- THEN the record is removed from the database and the list updates without a full reload

#### Scenario: No pending games

- GIVEN the user has no `in_progress` games
- WHEN the dashboard loads
- THEN the pending games section shows an empty-state message: "No tienes partidas pendientes."

### Requirement: Responsive Layout

The dashboard **MUST** use CSS Modules with the existing dark theme. Stats cards **MUST** display in a 2x2 grid on desktop (`>=768px`) and stack vertically on mobile. The pending games table **MUST** be horizontally scrollable on narrow viewports.

#### Scenario: Desktop layout

- GIVEN a viewport width of 1024px
- WHEN the dashboard renders
- THEN stat cards are arranged in a 2-column grid with equal width

#### Scenario: Mobile layout

- GIVEN a viewport width of 375px
- WHEN the dashboard renders
- THEN stat cards stack vertically (single column) and the games table scrolls horizontally

### Requirement: Protected Route

The `/dashboard` route **MUST** be wrapped in `ProtectedRoute`. Unauthenticated users **MUST** be redirected to `/login`.

#### Scenario: Unauthenticated access

- GIVEN a user who is not signed in
- WHEN they navigate to `/dashboard`
- THEN they are redirected to `/login`

### Requirement: Pure Domain Types

A `GameStats` interface **MUST** be defined in `src/domain/types.ts` with fields: `totalGames`, `completedGames`, `winRate`, `avgTimeOverall`, `avgTimeByDifficulty`. This type **MUST** be pure TypeScript — no React, no Supabase imports.

#### Scenario: Domain type is isolated

- GIVEN the `GameStats` type definition
- WHEN inspected
- THEN it contains no React, Supabase, or any external dependency imports
