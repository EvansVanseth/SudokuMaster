# Skill Registry — SudokuMaster

Generated: 2026-05-18T15:47

## User Skills (global)

### branch-pr
- **Trigger**: Creating, opening, or preparing PRs for review
- **Path**: `C:\Users\albus\.config\opencode\skills\branch-pr\SKILL.md`
- **Rules**:
  - Always check for existing issue before creating PR
  - Use issue-first workflow: GH issues → branch → PR
  - Create PR only after changes are committed and pushed
  - Return PR URL on completion
  - Never force-push or skip hooks

### chained-pr
- **Trigger**: PRs over 400 lines, stacked PRs, review slices
- **Path**: `C:\Users\albus\.config\opencode\skills\chained-pr\SKILL.md`
- **Rules**:
  - Split oversized changes into chained PRs
  - Each PR must be independently reviewable
  - Protect review focus — max ~400 lines per PR
  - Chain PRs with dependency tracking

### cognitive-doc-design
- **Trigger**: Writing guides, READMEs, RFCs, onboarding, architecture, or review-facing docs
- **Path**: `C:\Users\albus\.config\opencode\skills\cognitive-doc-design\SKILL.md`
- **Rules**:
  - Design docs that reduce cognitive load
  - Use progressive disclosure for complex topics
  - Separate reference from tutorial content
  - Keep diagrams and code samples close to relevant explanation

### comment-writer
- **Trigger**: PR feedback, issue replies, reviews, Slack messages, or GitHub comments
- **Path**: `C:\Users\albus\.config\opencode\skills\comment-writer\SKILL.md`
- **Rules**:
  - Write warm, direct collaboration comments
  - Be specific and constructive in feedback
  - Address code, not the person
  - Suggest improvements with reasoning

### customize-opencode
- **Trigger**: Editing opencode configuration files
- **Path**: `C:\Users\albus\.config\opencode\skills\customize-opencode\SKILL.md`
- **Rules**:
  - Use ONLY for opencode's own configuration
  - Not for user's application code
  - Respect opencode config file formats (JSONC)
  - Validate config changes for correctness

### go-testing
- **Trigger**: Go tests, go test coverage, Bubbletea teatest, golden files
- **Path**: `C:\Users\albus\.config\opencode\skills\go-testing\SKILL.md`
- **Rules**:
  - Apply focused Go testing patterns
  - Use golden files for complex output comparison
  - Prefer table-driven tests
  - Use teatest for Bubbletea component testing

### issue-creation
- **Trigger**: Creating GitHub issues, bug reports, or feature requests
- **Path**: `C:\Users\albus\.config\opencode\skills\issue-creation\SKILL.md`
- **Rules**:
  - Always check for existing issue before creating
  - Use issue-first workflow
  - Provide reproduction steps for bugs
  - Link related issues and PRs

### judgment-day
- **Trigger**: judgment day, dual review, adversarial review
- **Path**: `C:\Users\albus\.config\opencode\skills\judgment-day\SKILL.md`
- **Rules**:
  - Run blind dual review
  - Fix confirmed issues
  - Re-judge after fixes
  - Document all findings

### sdd-apply
- **Trigger**: Orchestrator launches apply for change tasks
- **Path**: `C:\Users\albus\.config\opencode\skills\sdd-apply\SKILL.md`
- **Rules**:
  - Implement SDD tasks from specs and design
  - Follow design exactly; do not deviate without spec update
  - Keep tests with implementation
  - One commit per task when possible

### sdd-archive
- **Trigger**: Orchestrator launches archive after implementation
- **Path**: `C:\Users\albus\.config\opencode\skills\sdd-archive\SKILL.md`
- **Rules**:
  - Sync delta specs after implementation
  - Move completed changes to archive
  - Update status in tracking
  - Keep spec history intact

### sdd-design
- **Trigger**: Orchestrator launches design for a change
- **Path**: `C:\Users\albus\.config\opencode\skills\sdd-design\SKILL.md`
- **Rules**:
  - Create technical design from specs
  - Cover architecture, data flow, component tree
  - Address tradeoffs explicitly
  - Produce implementation-ready design

### sdd-explore
- **Trigger**: Orchestrator launches exploration or requirement clarification
- **Path**: `C:\Users\albus\.config\opencode\skills\sdd-explore\SKILL.md`
- **Rules**:
  - Explore SDD ideas before committing to a change
  - Focus on feasibility and approach
  - Document findings for decision making
  - Do not implement — explore only

### sdd-init
- **Trigger**: sdd init, iniciar sdd, openspec init
- **Path**: `C:\Users\albus\.config\opencode\skills\sdd-init\SKILL.md`
- **Rules**:
  - Initialize SDD context, testing capabilities, registry, and persistence
  - Detect real stack, conventions, architecture, testing tools
  - Always persist testing capabilities separately
  - Build .atl/skill-registry.md
  - Never create openspec/ in engram mode

### sdd-onboard
- **Trigger**: Orchestrator launches onboarding for full SDD cycle
- **Path**: `C:\Users\albus\.config\opencode\skills\sdd-onboard\SKILL.md`
- **Rules**:
  - Walk users through the SDD workflow on the real codebase
  - Cover proposal → spec → design → tasks → apply → verify → archive
  - Use actual project examples
  - Ensure user understands each phase before proceeding

### sdd-propose
- **Trigger**: Orchestrator launches proposal work for a change
- **Path**: `C:\Users\albus\.config\opencode\skills\sdd-propose\SKILL.md`
- **Rules**:
  - Create SDD change proposal with intent, scope, and approach
  - Define clear success criteria
  - Identify affected files and modules
  - Get approval before proceeding to spec

### sdd-spec
- **Trigger**: Orchestrator launches spec work for a change
- **Path**: `C:\Users\albus\.config\opencode\skills\sdd-spec\SKILL.md`
- **Rules**:
  - Write SDD delta specs with requirements and scenarios
  - Include acceptance criteria
  - Cover edge cases and error states
  - Spec must be testable

### sdd-tasks
- **Trigger**: Orchestrator launches task planning for a change
- **Path**: `C:\Users\albus\.config\opencode\skills\sdd-tasks\SKILL.md`
- **Rules**:
  - Break SDD change into implementation tasks
  - Each task must be independently verifiable
  - Estimate complexity per task
  - Order tasks by dependency

### sdd-verify
- **Trigger**: SDD verification phase, verify change
- **Path**: `C:\Users\albus\.config\opencode\skills\sdd-verify\SKILL.md`
- **Rules**:
  - Execute tests and prove implementation matches specs
  - Verify against design and tasks
  - Document verification results
  - Flag any deviations found

### skill-creator
- **Trigger**: New skills, agent instructions, documenting AI usage patterns
- **Path**: `C:\Users\albus\.config\opencode\skills\skill-creator\SKILL.md`
- **Rules**:
  - Create LLM-first skills with valid frontmatter
  - Required: frontmatter, Activation Contract, Hard Rules, Decision Gates
  - Target 180-450 body tokens
  - Keep description under 250 chars, one line, quoted

### skill-registry
- **Trigger**: Create or update the project skill registry
- **Path**: `C:\Users\albus\.config\opencode\skills\skill-registry\SKILL.md`
- **Rules**:
  - Create or update .atl/skill-registry.md
  - Scan user and project skill directories
  - Deduplicate by skill name (project-level wins)
  - Extract compact rules (5-15 lines per skill)

### work-unit-commits
- **Trigger**: Implementation, commit splitting, chained PRs
- **Path**: `C:\Users\albus\.config\opencode\skills\work-unit-commits\SKILL.md`
- **Rules**:
  - Plan commits as reviewable work units
  - Keep tests and docs with code changes
  - One logical change per commit
  - Use conventional commit messages

## Project Conventions

- **Stack**: React 19 + Vite 8 + TypeScript 6 + Supabase + Vercel
- **Architecture**: Feature-Sliced Design (FSD) + Hexagonal (isolated domain)
- **Testing**: Vitest 4 + Testing Library (jsdom) — tests in `__tests__/` co-located with source
- **Linting**: ESLint 10 with typescript-eslint, react-hooks, react-refresh
- **Type Checking**: tsc (in build step via `tsc -b && vite build`)
- **State**: Zustand 5
- **Routing**: React Router 7
- **Styling**: CSS Modules
- **Commits**: Conventional commits (from git log: `fix:`, `style:` prefixes)
- **Credentials**: Security-sensitive keys in `security_connections.md` (gitignored)
- **DB Schema**: Documented in `CONTEXT/supabase_schema.sql`
