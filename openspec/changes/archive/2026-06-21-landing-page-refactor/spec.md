# Delta for Landing Page Refactor

## ADDED Requirements

### Requirement: Landing Page Game Loop

The system MUST implement a 15-second trivia-style linear progress bar for the game session.
The system MUST rotate the displayed content automatically every 15 seconds.

#### Scenario: Auto-rotation of content
- GIVEN the landing page is active
- WHEN 15 seconds have passed
- THEN the system MUST update the displayed board content
- AND the progress bar MUST reset to 0%

#### Scenario: Manual content switch
- GIVEN a user clicks the next/previous navigation element
- WHEN clicked
- THEN the system MUST immediately switch the content
- AND the timer/progress bar MUST reset to 0%

### Requirement: Scroll Indicator

The system MUST display a "bouncing arrow" visual scroll indicator when the landing page content extends beyond the viewport on mobile devices.

#### Scenario: Indicator visibility on mobile
- GIVEN the user is on a mobile device
- WHEN the page content exceeds the viewport height
- THEN the system MUST display the bouncing scroll indicator at the bottom of the screen

## MODIFIED Requirements

### Requirement: Leaderboard UI Component

The system MUST display a `LeaderboardPage` containing a table of rankings.
The layout MUST be responsive: it SHALL display as side-by-side components on desktop and stacked components on mobile.
(Previously: The system MUST display a `LeaderboardPage` containing a table of rankings.)

#### Scenario: Responsive layout verification
- GIVEN the user is on a desktop device
- WHEN the leaderboard is rendered
- THEN the system MUST apply a side-by-side layout for leaderboard sections

#### Scenario: Mobile stacking verification
- GIVEN the user is on a mobile device
- WHEN the leaderboard is rendered
- THEN the system MUST apply a stacked layout for leaderboard sections
