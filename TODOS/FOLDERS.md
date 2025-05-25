Please can we do the following:

- [x] need to setup a folders table in Supabase and the folders need to be added/updated in supabase, you have access to supabase via mcp
- [x] change the icon to be a folder use "Folder" from lucide (and Chevron for open/close)
- [x] be able to add new folders and child subfolders unlimited levels deep (Root folder "/" auto-created, non-editable/deletable)
- [x] edit a folder (except for the root "/" folder)
- [ ] the buttons on the root folder needs to be always visible
- [ ] drag and drop folders (Basic parent update implemented. Full `order` management for siblings is a TODO)
- [ ] remove a folder (only when it has no children or content) (Deletion if no children implemented; content check is a TODO. Root "/" folder cannot be deleted)
- [ ] each row needs to have the icon, folder name, and on the right buttons for editing, deletiing, adding a child folder and an chevron when clicked will call a function that opens the content attached to this folder (Icon, name, edit, delete, add child buttons implemented. Root folder has limited buttons. Chevron for opening content logs to console - functionality TODO)

---

## Tech Debt

- [ ] **Apply Database Migration for Shared Folders**: The database schema for `public.folders` needs to be updated to support shared folders instead of user-specific ones. This involves:
  - Renaming the `user_id` column to `created_by_user_id` (for auditing purposes only).
  - Updating associated foreign keys and indexes.
  - Dropping old RLS policies.
  - Implementing new RLS policies:
    - Allow all authenticated users to read all folders.
    - Allow all authenticated users to manage folders, ensuring `created_by_user_id` is set to `auth.uid()` on insert.
  - (Refer to `NOTES.md` for detailed decisions. The migration script is available in chat history if the automated tool fails again).
- [ ] **Full `order` management for drag-and-drop in `Folders.tsx`**.
- [ ] **Content association with folders & robust delete checks in `Folders.tsx`**.
- [ ] **Implement "Open content" functionality for folders in `Folders.tsx`**.
