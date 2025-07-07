# Claim Types Management UI

This directory contains the Claim Types Management UI for the admin console. All data is currently managed in local state and mock arrays. No backend/API integration is present.

## Features
- List, add, and edit claim types
- Validation for name field

## Extending for Backend
- Replace local state with API calls (fetch, create, update, etc.)
- Use React Query or SWR for data fetching/caching
- Add error handling and loading states 