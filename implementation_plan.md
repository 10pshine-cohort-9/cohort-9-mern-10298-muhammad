# Update Export / Import to .txt & Address CodeRabbit Reviews

## Goal Description
The user wants to export and import notes as standard `.txt` files rather than a `.json` array, making it easier to write notes in Notepad and upload them. Additionally, we need to address several CodeRabbit review comments involving HTML sanitization, shared validation schemas, and Git ignore configurations.

## Proposed Changes

### Frontend 
#### [MODIFY] [frontend/src/components/Dashboard.jsx](./frontend/src/components/Dashboard.jsx)
- **Install `jszip`:** Add `jszip` to the frontend to handle zipping multiple `.txt` files on the client-side.
- **Export Logic:** Loop through all notes, create a `.txt` file for each (using the title as the filename), add them to a JSZip instance, generate the `.zip` Blob, and trigger the download.
- **Import Logic:** Update the hidden file input to accept `accept=".txt"` and `multiple`. Build an array of note objects where `title` = filename (minus `.txt`) and `content` = file contents. 
- **Refactor `fetchNotes`:** Move `fetchNotes` out of the `useEffect` callback into component scope so it is accessible to `handleFileChange`, reusing that shared function.
- **Validation:** Reuse a shared plain-JavaScript runtime schema for imported notes to validate title and content types before sending to the backend.

#### [MODIFY] [frontend/src/components/Login.jsx](./frontend/src/components/Login.jsx)
- **Placeholder Update:** Align the signup placeholder with existing tests by restoring the placeholder to "e.g. John Doe".
- **Hero Image Accessibility:** Update the hero `<img>` element with `alt=""` and `aria-hidden="true"` to mark it as decorative.

### Backend
#### [MODIFY] [backend/controllers/noteController.js](./backend/controllers/noteController.js)
- **Install `sanitize-html`:** Apply a strict server-side HTML allowlist sanitizer to note content in `createNote`, `updateNote`, and `importNotes` before database writes.
- **Validation Schema:** Introduce one shared plain-JavaScript runtime schema for imported notes, validate that every item is a non-null plain object with correct title and content fields, returning 400 before the INSERT when validation fails.

### Other Configurations
#### [MODIFY] [.gitignore](./.gitignore)
- Add `.scannerwork` to ignore configuration so stale SonarQube task metadata is not committed.
- **Note:** Remove `.scannerwork/report-task.txt` from Git index.

#### [MODIFY] [README.md](./README.md)
- Update the authentication description to hyphenate as "JWT-based authentication".
- Update the stack label from "MERN" to accurately reflect the MySQL-based stack (e.g., "MySQL, Express, React, Node.js").

## Verification Plan
1. Test downloading the `.zip` file, extracting it, and verifying the `.txt` files contain correct content.
2. Test uploading 2-3 `.txt` files made in Notepad.
3. Attempt to upload a malformed or XSS-injected `.txt` file to ensure the backend validation and HTML sanitization strip malicious content.
4. Verify Git status ignores the `.scannerwork` directory.
