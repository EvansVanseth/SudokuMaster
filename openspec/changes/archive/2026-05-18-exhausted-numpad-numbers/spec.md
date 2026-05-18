# Numpad Exhaustion Specification

## Purpose

Visual feedback when a number 1–9 is fully placed on the board. Once all 9 instances of a number exist (clue + player cells), the corresponding Numpad button disables so the player cannot click it. This reduces useless clicks and gives immediate board-completion awareness.

No domain-layer changes — all logic lives in the store/component layer as pure derivations.

## Requirements

### Requirement: Exhaustion Detection

The system **MUST** provide a pure function `getExhaustedNumbers(board: Board): Set<number>` that counts occurrences of each number 1–9 across all 81 cells (both `isClue` and player cells). A number **SHALL** be considered exhausted when its count equals exactly 9. A number **SHALL** be considered not exhausted when its count is less than 9. The function **MUST** return an empty `Set` when the board is empty or uninitialized.

#### Scenario: All nine instances of a number are on the board

- GIVEN a board with exactly 9 cells containing `value: 1` (mix of clue and player cells)
- WHEN `getExhaustedNumbers(board)` is called
- THEN the returned set contains `1`

#### Scenario: Partial instances — number not yet exhausted

- GIVEN a board with exactly 8 cells containing `value: 1`
- WHEN `getExhaustedNumbers(board)` is called
- THEN `1` is NOT in the returned set

#### Scenario: Multiple numbers exhausted simultaneously

- GIVEN a board where numbers 1 and 2 each have 9 instances, but 3 has only 7
- WHEN `getExhaustedNumbers(board)` is called
- THEN the returned set contains `1` and `2`, but NOT `3`

#### Scenario: Empty board returns empty set

- GIVEN an empty board (`board.length === 0`)
- WHEN `getExhaustedNumbers(board)` is called
- THEN the returned set is empty

#### Scenario: No numbers exhausted

- GIVEN a board where every number 1–9 has fewer than 9 instances
- WHEN `getExhaustedNumbers(board)` is called
- THEN the returned set is empty

### Requirement: Numpad Button Disabled State

The Numpad **SHALL** derive an `exhaustedNumbers` set from the current board using `useMemo`. Each number button **MUST** have its `disabled` property set to `true` when `exhaustedNumbers.has(num)` is true, in addition to the existing `status === 'solved'` guard. The Borrar button **MUST NOT** be affected by exhaustion state — its disabled logic remains unchanged. On new game (`startGame`), the board reference changes and `useMemo` **MUST** re-derive, resetting all buttons to enabled.

#### Scenario: Exhausted number button is disabled

- GIVEN a board where number `1` is exhausted (9 instances)
- WHEN the Numpad renders
- THEN the button containing `1` has `disabled={true}`

#### Scenario: Non-exhausted number button stays enabled

- GIVEN a board where number `1` has 8 instances
- WHEN the Numpad renders
- THEN the button containing `1` has `disabled={false}`

#### Scenario: Deleting a cell re-enables a previously exhausted button

- GIVEN a board where number `1` is exhausted (9 instances), and player deletes one cell containing `1` (count drops to 8)
- WHEN the Numpad re-renders after the board update
- THEN the button containing `1` has `disabled={false}`

#### Scenario: New game resets all exhaustion

- GIVEN a board where `1` was exhausted (9 instances)
- WHEN `startGame` is called
- THEN `useMemo` re-derives with the new board and all number buttons have `disabled={false}`

#### Scenario: Borrar unaffected by exhaustion

- GIVEN any board state (including all numbers exhausted)
- WHEN the Numpad renders
- THEN the Borrar button's disabled state depends only on the existing `status === 'solved'` guard — it is NEVER disabled due to exhaustion

#### Scenario: Solved game still disables all buttons

- GIVEN a solved board (`status === 'solved'`)
- WHEN the Numpad renders
- THEN all buttons (numbers + Borrar) are disabled, consistent with existing behavior

## Out of Scope

- Animations or flash on exhaustion transition
- Sound effects
- Changes to the Borrar button behavior
- Any domain-layer modifications (`src/domain/` is untouched)
