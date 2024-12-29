# Lab Guy Dashboard

## Installation

1. `npm i`
2. Create/add in `.gitignore` file in root directory
   ```js
   # labguy
   .env
   /public/tinymce/
   ```
3. Create/add variables in `.env` file in root directory
   ```js
   VITE_ADMIN_PATH="/admin"    #change it
   VITE_SERVER_API_URL="http://localhost:3000/api"    #change it
   ```
4. You are good to go!
   ```js
   npm run dev
   npm run build
   npm run preview
   ```

## Todo

1. General

2. Details

3. Future

- Add Vimeo, Soundcloud support

4. Known issues

- Unnecessary re-renders of forms caused by Snackbar appearance
  - possible solutions: Redux
- Low performance of Library
  - possible solutions: Redux, pagination
