# Auth Specification

## Purpose

Manage user authentication state and profile synchronization.

## Requirements

### Requirement: Profile Synchronization

The system MUST fetch and synchronize user profile data from `public.profiles` on auth initialization.

#### Scenario: Profile Synchronization on Login

- GIVEN the user logs in
- WHEN the auth state is established
- THEN the system MUST fetch the user's profile from `public.profiles`
- AND update the `AuthContext` to include the user's profile data.
