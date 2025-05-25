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
- Implemented server-side logic for all folder CRUD operations (`getInitialFoldersAndEnsureRootAction`, `createFolderAction`, `renameFolderAction`, `deleteFolderAction`, `moveFolderAction`) in `src/app/mookie/actions/folderActions.ts`.
  - Actions include data validation, interaction with Supabase, and path revalidation (`revalidatePath("/mookie/content")`).
  - `getInitialFoldersAndEnsureRootAction` ensures a root folder ("/") exists, creating it if necessary with `created_by_user_id` and a "root" slug.
  - `createFolderAction` generates slugs, sets `created_by_user_id`.
  - `renameFolderAction` preserves slugs and adds server-side name validation.
  - `deleteFolderAction` includes server-side checks for root folder and children.
  - `moveFolderAction` includes server-side checks for root, self-parenting, and simple child-parent cycle, updates `parent_id`.
- Replaced browser prompt for folder creation with a shadcn/ui Dialog (CreateFolderDialog) in the content folder tree.
- Users can now enter a folder name and edit the auto-generated slug before saving.
- Updated backend (createFolderAction) to accept and use a custom slug from the client, supporting user-edited slugs.

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
- Refactored `src/app/mookie/content/components/list/Folders.tsx`:
  - Component now accepts `initialData: Folder[]` as a prop.
  - Removed all client-side Supabase calls for data fetching and mutations.
  - All folder operations (`handleCreate`, `handleRename`, `handleDelete`, `handleMove`) now call their respective Server Actions from `folderActions.ts`.
  - Optimistic updates on the client are preserved.
  - Removed client-side data refetching logic, relying on Server Action `revalidatePath` and optimistic updates.
  - Removed direct usage of Supabase client SDK from the component.
- Updated `NOTES.md` to reflect the shift to Server Components for reads and Server Actions for writes (this was done previously but worth noting completion of refactor based on it).
- `folderActions.ts`: `getSupabaseServerActionClient` helper had `await` removed from `cookies()` call (though linter errors persist for user to resolve).

### Fixed

- Resolved issue with ContentZone items being undefined
- Fixed ContentCard action button visibility based on isNew flag
- Addressed session management in protected routes
- Fixed auth callback handling for magic links
- Fixed Sheet z-index issue so the drawer always appears above the app background and content.
- Resolved a TypeError in dynamic page routes by adding nullish checks for `root` and `props` when generating metadata titles.
- Updated all usages of `getPage` in dynamic page routes to properly use `await`, as `getPage` is an async function.
- Resolved various linter errors in `Folders.tsx` related to prop changes and type consistency after introducing `slug` and server actions.
- Changed `catch(error: any)` to `catch(error: unknown)` in server actions for better type safety.

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

### Pending Linter Issues in `folderActions.ts` (User to resolve)

- `Cannot find module '@/types_db'`: User needs to generate Supabase type definitions into `src/types_db.ts`.
- `Property 'get'/'set' does not exist on type 'Promise<ReadonlyRequestCookies>'`: This appears to be a TypeScript environment or tool configuration issue related to `next/headers`. The code `const cookieStore = cookies();` is standard.
