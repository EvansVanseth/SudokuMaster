# SudokuMaster 🧩

Beyond just numbers — a robust, architecture-first Sudoku experience.

SudokuMaster is an open-source web application designed to challenge your mind with dynamic puzzles, complete with user authentication, game persistence, and competitive leaderboards. Built to demonstrate clean architectural principles (FSD + Hexagonal), it’s as robust under the hood as it is intuitive to play.

## Key Features

- **Dynamic Puzzles:** Rotating challenges with a unique solution guarantee, powered by our high-performance engine.
- **Intelligent Play:** Real-time feedback with a permissive mode, allowing you to focus on logic rather than error-blocking.
- **Persistence:** Never lose your game — progress is saved automatically.
- **Competitive Spirit:** Challenge yourself and climb the Top 10 Leaderboard.

## Built for Developers

We believe great experiences start with great code. SudokuMaster leverages:

- **React 19 + Vite + TypeScript** for a fast, type-safe frontend.
- **Supabase** (PostgreSQL) for a scalable BaaS backend.
- **FSD (Feature-Sliced Design) + Hexagonal Architecture** to keep our game core (the Sudoku engine) entirely decoupled from UI and infrastructure.

## Security First

We take security seriously:
- **Centralized Validation:** OWASP-level logic in our domain layer.
- **Dictionary Protection:** Robust denylist implementation against common passwords.

---

## Get Started

Built with love and clean code. Play, fork, or contribute!

