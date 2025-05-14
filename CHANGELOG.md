# Changelog

All notable changes to the Mooki project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project structure with Next.js and TypeScript
- Basic layout components (AdminHeader, AdminNavi)
- Content management system architecture
- ContentCard component with support for:
  - Display of content metadata
  - Action buttons (edit, delete, copy)
  - "New item" mode
  - Delete confirmation flow
- ContentCardSkeleton for loading states
- ContentZone component for managing card layouts
- Zone-specific components (PagesZone, VideosZone)
- AdminContext for global state management
- STRUCTURE.md documentation
- Supabase integration with:
  - Server-side client setup
  - Client-side client setup
  - Middleware for session management
  - Environment variable validation
- Supabase Auth implementation:
  - Magic link authentication
  - Email/password authentication
  - Session management
  - Protected routes
  - Auth callback handling
  - Sign in/up/out functionality
  - Password reset flow
  - SMTP configuration support
- Integrated `AdminSheet` (shadcn/ui Sheet) at the root of the MookiLayout for contextual add/edit forms.

### Changed

- Refactored content management to use isolated zone components
- Moved data management into individual zone components
- Updated ContentCard to show only Add button for new items
- Improved component isolation to prevent unnecessary re-renders
- Enhanced authentication flow with Supabase integration
- Updated `AdminSheet` UI for the Add Page form:
  - The form is now a flex column layout with a scrollable content area, ensuring the Save button is always visible at the bottom.
  - Improved Sheet styling: white background, full height, no padding/gap on the main container, and a border on the header and footer.
  - Added a high z-index to the Sheet to ensure it appears above all other content.
  - The Close button is now always visible at the bottom of the Sheet.

### Fixed

- Resolved issue with ContentZone items being undefined
- Fixed ContentCard action button visibility based on isNew flag
- Addressed session management in protected routes
- Fixed auth callback handling for magic links
- Fixed Sheet z-index issue so the drawer always appears above the app background and content.
- Resolved a TypeError in dynamic page routes by adding nullish checks for `root` and `props` when generating metadata titles.
- Updated all usages of `getPage` in dynamic page routes to properly use `await`, as `getPage` is an async function.

## [0.1.0] - 2024-03-19

### Added

- Initial project setup
- Basic routing structure
- Layout components
- Content management components
- Context management
- Documentation
- Supabase project configuration
- Authentication system setup

### Known Issues

- Data fetching is currently simulated
- No error handling implemented
- No real API integration
- No search or filtering functionality
- No pagination or infinite scroll
- SMTP rate limiting for email authentication
- Need to configure redirect URLs for production deployment
