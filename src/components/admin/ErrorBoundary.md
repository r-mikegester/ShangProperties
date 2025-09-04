# Error Boundary Component

## Overview

The Error Boundary component is a React error boundary that catches JavaScript errors anywhere in the child component tree, logs those errors, and displays a fallback UI instead of the component tree that crashed.

## Features

- Catches unhandled errors in the component tree
- Provides a user-friendly error display
- Responsive design that works on all device sizes
- Detailed error information for debugging
- Retry and refresh functionality

## Implementation Details

The Error Boundary is implemented as a class component following React's error boundary patterns. It implements two key lifecycle methods:

1. `static getDerivedStateFromError()` - Updates state to display the fallback UI
2. `componentDidCatch()` - Logs the error information for debugging

## Usage

Wrap any component tree that might throw errors with the Error Boundary:

```jsx
import ErrorBoundary from '../components/admin/ErrorBoundary';

<ErrorBoundary>
  <MyComponentTree />
</ErrorBoundary>
```

### Custom Fallback UI

You can provide a custom fallback UI:

```jsx
<ErrorBoundary fallback={<CustomErrorComponent />}>
  <MyComponentTree />
</ErrorBoundary>
```

## Error Handling Flow

1. When an error occurs in a child component:
   - The error is caught by the Error Boundary
   - Component state is updated to show the error UI
   - Error details are logged to the console

2. User can:
   - See error details in an expandable section
   - Try again with the "Try Again" button
   - Refresh the page with the "Refresh Page" button

## Design

The error display features:
- Clear visual indication of an error with a warning icon
- Simple, understandable error message
- Expandable details section for developers
- Responsive layout that works on mobile and desktop
- Consistent styling with the admin interface color scheme
- Clear call-to-action buttons for recovery

## Best Practices

1. Place error boundaries strategically around components that might fail
2. Don't overuse error boundaries - they should be placed at strategic points in the component tree
3. Log errors to your error reporting service in production
4. Provide meaningful error messages to users
5. Test error scenarios to ensure the boundary works as expected

## Testing

To test the Error Boundary:
1. Navigate to the "Error Test" page in the admin panel
2. Click the "Throw Error" button
3. Observe the error boundary catching and displaying the error
4. Use the "Try Again" or "Refresh Page" buttons to recover