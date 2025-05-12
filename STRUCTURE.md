# Mooki Application Structure

## Overview

Mooki is a content management system with a modular, component-based architecture designed for optimal performance and maintainability. The application uses React with TypeScript and follows a component isolation pattern to minimize unnecessary re-renders. It integrates with Supabase for authentication and data management.

## Directory Structure

```
src/
├── app/
│   ├── (auth-pages)/
│   │   ├── layout.tsx
│   │   ├── smtp-message.tsx
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   └── mookie/
│       ├── components/
│       │   └── AdminBlocks/
│       │       ├── AdminHeader.tsx
│       │       └── AdminNavi.tsx
│       ├── content/
│       │   ├── components/
│       │   │   └── contentmenu/
│       │   │       ├── ContentCard.tsx
│       │   │       ├── ContentCardSkeleton.tsx
│       │   │       ├── ContentZone.tsx
│       │   │       └── zones/
│       │   │           ├── PagesZone.tsx
│       │   │           └── VideosZone.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       ├── context/
│       │   └── AdminContext.tsx
│       └── layout.tsx
├── utils/
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       ├── middleware.ts
│       └── check-env-vars.ts
└── auth.ts
```

## Component Hierarchy

### Layout Components

- `layout.tsx`: Main application layout
  - `AdminHeader`: Top navigation header
  - `AdminNavi`: Side navigation
  - Main content area

### Authentication Pages

- `(auth-pages)/layout.tsx`: Shared layout for authentication pages
- `(auth-pages)/smtp-message.tsx`: SMTP configuration notification component
- `(auth-pages)/sign-in/page.tsx`: Sign in page with:
  - Email/password form
  - Magic link option
  - Error handling
  - Form validation
- `(auth-pages)/sign-up/page.tsx`: Sign up page with:
  - Registration form
  - Email verification
  - Password requirements
  - Terms acceptance
- `(auth-pages)/forgot-password/page.tsx`: Password recovery page with:
  - Email input
  - Reset link generation
  - Success/error states

### Content Management Components

- `page.tsx`: Content management page
  - `PagesZone`: Pages/Articles management zone
  - `VideosZone`: Videos management zone

### Zone Components

Each zone component (`PagesZone`, `VideosZone`):

- Manages its own data state
- Handles its own loading state
- Uses `ContentZone` for rendering
- Isolates re-renders to its own scope

### Content Components

- `ContentZone`: Container component for content cards

  - Manages layout and rendering of cards
  - Handles loading states
  - Uses `ContentCard` for individual items
  - Uses `ContentCardSkeleton` for loading states

- `ContentCard`: Individual content item display

  - Handles display of content metadata
  - Manages action buttons (edit, delete, copy)
  - Supports "new item" mode with different actions
  - Includes delete confirmation flow

- `ContentCardSkeleton`: Loading state placeholder
  - Matches `ContentCard` layout
  - Uses animation for loading indication

## Authentication System

### Supabase Integration

- **Client Setup**
  - `utils/supabase/client.ts`: Browser client for client-side operations
  - `utils/supabase/server.ts`: Server client for server-side operations
  - `utils/supabase/middleware.ts`: Session management and protected routes
  - `utils/supabase/check-env-vars.ts`: Environment variable validation

### Authentication Features

- **Authentication Methods**

  - Magic link authentication
  - Email/password authentication
  - Session management
  - Protected routes
  - Auth callback handling

- **Auth Flow**
  - Sign in/up/out functionality
  - Password reset flow
  - SMTP configuration support
  - Session persistence
  - Route protection

### Auth Components

- `auth.ts`: Main authentication configuration
  - NextAuth integration
  - Supabase adapter setup
  - Provider configuration
  - Session handling
  - Callback management

### Auth Pages Structure

- **Sign In Page**

  - Email/password form
  - Magic link option
  - Form validation
  - Error handling
  - Redirect handling

- **Sign Up Page**

  - Registration form
  - Email verification
  - Password requirements
  - Terms acceptance
  - Success/error states

- **Forgot Password Page**

  - Email input form
  - Reset link generation
  - Success/error states
  - Redirect handling

- **Shared Components**
  - SMTP message component
  - Form validation
  - Error handling
  - Loading states

## Context Management

- `AdminContext`: Global state management
  - Provides content management functions:
    - `addContent(cardType: string)`
    - `editContent(cardType: string, contentId: string)`
    - `deleteContent(cardType: string, contentId: string)`
    - `copyContent(cardType: string, contentId: string)`

## Data Flow

1. Zone components (`PagesZone`, `VideosZone`) manage their own data
2. Data is passed to `ContentZone` as items
3. `ContentZone` renders `ContentCard` components
4. `ContentCard` components use `AdminContext` for actions
5. Actions trigger updates in the respective zone

## Performance Considerations

- Component isolation prevents unnecessary re-renders
- Each zone manages its own state
- Loading states are handled at the zone level
- Skeleton loading provides smooth user experience
- Context functions are memoized to prevent unnecessary re-renders
- Session management optimized for performance
- Protected routes handled efficiently

## Security Considerations

- Environment variables for sensitive data
- Protected routes implementation
- Secure session management
- SMTP configuration for email authentication
- Magic link security measures
- Password reset flow security
- Form validation and sanitization
- CSRF protection
- Rate limiting for auth attempts

## Future Considerations

- Add more zone types as needed
- Implement real data fetching
- Add error handling
- Implement optimistic updates
- Add pagination or infinite scroll
- Implement search and filtering
- Enhance authentication features
- Add role-based access control
- Implement audit logging
- Add two-factor authentication
- Add social authentication providers
- Implement remember me functionality
- Add session timeout handling
