# LandingPage Specification

## Purpose
Manages the landing page display, including trivia rotation and board/trivia progress tracking.

## Requirements

### Requirement: Trivia Rotation Logic
The system MUST unify trivia logic within the `useSudokuRotation` hook.

#### Scenario: Trivia Rotation
- GIVEN the landing page is loaded
- WHEN trivia logic is invoked
- THEN `useSudokuRotation` provides consistent trivia data.

### Requirement: Progress Tracking
The system MUST maintain separate progress tracking for trivia and the Sudoku board.

#### Scenario: Trivia Progress Tracking
- GIVEN a user is on the landing page
- WHEN interacting with trivia
- THEN trivia progress is tracked independently of the board.

#### Scenario: Board Progress Tracking
- GIVEN a user is on the landing page
- WHEN interacting with a board
- THEN board progress is tracked independently of trivia.

### Requirement: Landing Page Rendering
The system MUST render both trivia and board elements with their respective progress.

#### Scenario: Rendering
- GIVEN the landing page is loaded
- WHEN rendering the page
- THEN both trivia (with its progress) and the board (with its progress) are displayed.
