# Mookie Project Notes

## Architectural Decisions

### Folder Management (as of YYYY-MM-DD - please update date)

- **Shared Folders**: Folders are not user-specific. All authenticated users within the application share and see the same folder structure.
- **Auditing Creator**: The `folders` table includes a `created_by_user_id` column (stores `auth.uid()`). Its purpose is for auditing, not access control.
- **Folder Slugs**: Each folder has a `slug` column (type `TEXT`, `UNIQUE`, `NOT NULL`).
  - Slugs are generated automatically (server-side) from the folder name upon creation.
  - Intended for URLs and remain stable post-creation (name changes don't auto-update slug).
- **Data Access Pattern (IMPORTANT SECURITY & BEST PRACTICE)**:
  - **Reading Folders**: Initial folder data should be fetched by a **Server Component** and passed as props to any client component needing it (like the folder tree). Direct client-side fetching from database is disallowed.
  - **Mutating Folders (Create, Update, Delete, Move)**: All folder mutations initiated from client components must be handled via **Server Actions**. Client components will call these server actions and not directly interact with the Supabase client SDK for database operations.
  - Server Actions and Server Components will use a server-side Supabase client.
- **Row Level Security (RLS) for Folders**:
  - **Read Access**: RLS Policy: `TO authenticated USING (true);` (Any authenticated user can read all folders).
  - **Write Access (Server Actions will handle logic, RLS is a safeguard)**:
    - `INSERT`: RLS Policy: `TO authenticated WITH CHECK (created_by_user_id = auth.uid());` (Ensures creator is correctly set).
    - `UPDATE`, `DELETE`: RLS Policy: `TO authenticated USING (true) WITH CHECK (true);` (Currently any authenticated user, future roles via Server Action logic).
- **Root Folder**: A single, global root folder ("/") is automatically ensured/created server-side (e.g., during the initial data fetch in a Server Component or via a dedicated Server Action if necessary). Its `created_by_user_id` and `slug` are set upon creation.

**Future Considerations for Folders**:

- Role-based permissions for managing folders (implemented within Server Actions).
- Tracking `updated_by_user_id` and `updated_at` (via Server Actions).
- More robust server-side slug uniqueness checks or suffixing on collision within Server Actions.
- Manual editing of slugs post-creation (via a new Server Action).
