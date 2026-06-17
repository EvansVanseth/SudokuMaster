# Leaderboard Specification

## Purpose

The Leaderboard feature provides a global ranking of users based on their total game scores, incentivizing competitive play.

## Requirements

### Requirement: Leaderboard SQL View (Data Source)

The system MUST define a PostgreSQL view `public.user_scores` to aggregate total game scores for all users.
The view SHALL calculate the score based on game difficulty: Easy=1, Medium=3, Hard=5.
The view MUST return: `username`, `total_score`, `games_played`.

#### Scenario: Verify Score Calculation

- GIVEN user has 2 Easy games and 1 Hard game completed
- WHEN the view `user_scores` is queried
- THEN `total_score` MUST be 7 (2*1 + 1*5)
- AND `games_played` MUST be 3

### Requirement: API Fetch (Data Service)

The system MUST provide an API service function to fetch the leaderboard data from the `user_scores` view, sorted by score.

#### Scenario: Fetch Leaderboard Data

- GIVEN the `user_scores` view has populated data
- WHEN `fetchLeaderboard()` service function is called
- THEN the system MUST return a sorted list of `LeaderboardEntry` (Descending by `total_score`)

### Requirement: Leaderboard UI Component

The system MUST display a `LeaderboardPage` containing a table of rankings.

#### Scenario: Display Leaderboard Table

- GIVEN a user navigates to the Leaderboard Page
- WHEN data is successfully fetched
- THEN the system MUST render a table with columns: Rank, Username, Games Played, Total Score
- AND the rows MUST be sorted by Total Score in descending order.

### Requirement: Sorting Logic

The sorting logic SHALL be handled on the database level via the SQL View query.

#### Scenario: Database Sorting Verification

- GIVEN the view query `SELECT * FROM user_scores ORDER BY total_score DESC` is executed
- WHEN data is returned
- THEN the rows MUST appear in descending order of `total_score`.
