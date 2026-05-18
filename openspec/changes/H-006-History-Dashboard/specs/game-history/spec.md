# Game History Specification

## Purpose

Completed games history with difficulty filtering and date sorting. Queries **MUST** select specific columns and **MUST NOT** fetch the `board` JSONB column to avoid transferring large payloads for list-only views.

## Requirements

### Requirement: Display Completed Games List

The system **MUST** display all games with `status = 'completed'`, showing per row: difficulty, time spent (formatted as Xm Ys), won/lost indicator, and date completed (formatted from `updated_at`). The list **MUST** be sorted by `updated_at` descending (newest first) by default.

#### Scenario: List shows completed data correctly

- GIVEN a user has 3 completed games (2 wins, 1 loss)
- WHEN the history page loads
- THEN each row shows the correct difficulty, formatted time, won/lost text, and date

#### Scenario: No completed games

- GIVEN a user with only pending or zero games
- WHEN the history page loads
- THEN an empty-state message is displayed: "No hay partidas completadas."

### Requirement: Filter by Difficulty

The system **MUST** provide a filter bar with options: All (default), Easy, Medium, Hard. Selecting a difficulty **MUST** filter the displayed list to only games of that difficulty. The query **MUST** apply the filter server-side via `.eq('difficulty', value)`.

#### Scenario: Filter to Hard games only

- GIVEN the user has completed games across all difficulties
- WHEN they select "Hard" in the filter
- THEN only games with `difficulty = 'hard'` are shown

#### Scenario: Filter with zero results

- GIVEN the user has completed games but none of difficulty "hard"
- WHEN they select "Hard" in the filter
- THEN the list shows "No hay partidas completadas." with no rows

### Requirement: Sort by Date

The system **MUST** provide a sort toggle between newest-first (default) and oldest-first. Changing sort order **MUST** re-query with `.order('updated_at', { ascending: true/false })`.

#### Scenario: Toggle to oldest-first

- GIVEN the history list shows newest-first by default
- WHEN the user toggles sort to "oldest first"
- THEN rows reorder with the earliest completed game at the top

### Requirement: Query Must Not Select Board

History queries **MUST** use an explicit column list — `id, user_id, difficulty, status, time_spent, is_winner, created_at, updated_at` — and **MUST NOT** use `.select('*')` or include `board` in the column list.

#### Scenario: Column list excludes board

- GIVEN the history query is executed
- WHEN inspected via Supabase query log or type check
- THEN the `board` column is absent from the select list

### Requirement: Protected Route and Responsive Styling

The `/dashboard/history` route **MUST** be wrapped in `ProtectedRoute`. The page **MUST** use CSS Modules matching the existing dark theme. The filter bar **MUST** render horizontally on desktop and wrap on mobile. The games list **MUST** show as a table on desktop and a stacked card layout on mobile.

#### Scenario: Mobile responsive layout

- GIVEN a viewport width of 375px
- WHEN the history page renders
- THEN the filter bar wraps to multiple lines and each game renders as a stacked card

### Requirement: Pure Domain Type

A `GameSummary` interface **MUST** be defined in `src/domain/types.ts` with fields: `id`, `difficulty`, `timeSpent`, `isWinner`, `completedAt`. This type **MUST** be pure TypeScript — no React, no Supabase imports.

#### Scenario: Domain type is isolated

- GIVEN the `GameSummary` type definition
- WHEN inspected
- THEN it contains no external dependency imports
