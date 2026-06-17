# App Versioning Specification

## Purpose
Expose the application version at build time for tracking and UI display.

## Requirements

### Requirement: Inject App Version
The system MUST expose the current version from `package.json` as a global constant `__APP_VERSION__` during the build process.

#### Scenario: Build Injection
- GIVEN a `package.json` with a version field
- WHEN the application is built
- THEN `__APP_VERSION__` MUST be defined as a string literal containing the version number
