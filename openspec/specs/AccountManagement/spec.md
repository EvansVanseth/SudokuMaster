# AccountManagement Specification

## Purpose
Manage user account settings, profile information, and authentication status.

## Requirements

### Requirement: Profile Update

The system MUST allow users to update their profile information stored in the `profiles` table.

#### Scenario: Successful Profile Update

- GIVEN the user is logged in
- WHEN they submit updated profile data (e.g., username)
- THEN the system updates the corresponding record in the `profiles` table
- AND displays a success confirmation to the user

#### Scenario: Failed Profile Update

- GIVEN the user is logged in
- WHEN they submit profile data that fails validation or the database update fails
- THEN the system displays an error message to the user

### Requirement: Authentication Management

The system MUST allow users to sign out via the Auth SDK.

#### Scenario: Sign Out

- GIVEN the user is logged in
- WHEN they trigger the sign out action
- THEN the system calls the Auth SDK `signOut` function
- AND redirects the user to the landing page

### Requirement: Account Management UI

The system MUST provide a structured UI for profile management, authentication control, and secure account deletion. The UI SHOULD feature a consistent layout and display error alerts for failed mutations.

#### Scenario: UI Structure

- GIVEN the user is on the Account Management page
- WHEN the page renders
- THEN it SHOULD display input fields for profile data
- AND a dedicated "Sign Out" button
- AND a dedicated "Delete Account" button

#### Scenario: Error Alert Display

- GIVEN the user is on the Account Management page
- WHEN an action (e.g., profile update, deletion) fails
- THEN the system SHOULD display a clear, dismissible error alert.

### Requirement: useAccount Hook

The system MUST provide a `useAccount` hook to centralize profile and account-related logic.

#### Scenario: useAccount Data Access

- GIVEN the user is logged in
- WHEN the `useAccount` hook is called
- THEN it SHOULD return the current user profile, `updatePassword`, and `deleteAccount` methods.

### Requirement: Account Deletion

The system MUST require password confirmation to delete an account.

#### Scenario: Successful Account Deletion

- GIVEN the user is on the Account Management page
- WHEN they request account deletion
- AND provide the correct password confirmation
- THEN the system deletes the account and redirects to the landing page.

#### Scenario: Failed Account Deletion

- GIVEN the user is on the Account Management page
- WHEN they request account deletion
- AND provide an incorrect password
- THEN the system displays an error alert indicating invalid password.
