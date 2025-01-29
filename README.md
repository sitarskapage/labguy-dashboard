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
## Auto-updates
**CAUTION** this will synchronize your commit history.

1. Create Personal Access Token (PAT) with repo and workflow permissions
2. Add secrets to the forked repo:
   ```
   PAT
   VITE_ADMIN_PATH
   VITE_SERVER_API_URL
   ```
3. Go to Actions and enable all available actions.
   
## Todo

1. Future improvements

- Optimize re-renders of forms caused by Snackbar appearance
  - possible solutions: Redux
- Optimize Library
  - possible solutions: Redux, pagination
