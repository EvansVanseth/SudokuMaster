# Delta for Feedback Modal

## MODIFIED Requirements

### Requirement: Feedback Modal Display
The `FeedbackModal` MUST provide a mechanism for users to submit feedback.
(Previously: The feedback modal was available without version tracking)

#### Scenario: Modal Visibility
- GIVEN the user clicks the feedback trigger
- WHEN the modal is rendered
- THEN the user can input their feedback

#### Scenario: Version Tracking in Modal
- GIVEN the `FeedbackModal` is open
- WHEN the component is rendered
- THEN the version `__APP_VERSION__` MUST be displayed
