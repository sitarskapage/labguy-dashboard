# Lab Guy Dashboard

## Installation

1. `npm i`

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

1. Known issues

- Unnecessary re-renders of forms caused by Snackbar appearance
  - possible solutions: Redux
- Low performance of Library
  - possible solutions: Redux, pagination
