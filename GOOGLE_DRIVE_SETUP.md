# Google Drive Image Integration Setup

## Overview
The admin panel now integrates with Google Drive to allow admins to select and insert product images directly from Google Drive.

## Prerequisites
- Google Cloud Project
- Google Drive API enabled
- OAuth 2.0 credentials configured

## Setup Steps

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter project name (e.g., "Jewelry Store Images")
4. Click "Create"

### 2. Enable Google Drive API
1. In Cloud Console, search for "Google Drive API"
2. Click on it and select "Enable"
3. Wait for it to enable

### 3. Enable Google Picker API
1. Search for "Google Picker API" in Cloud Console
2. Click on it and select "Enable"

### 4. Create OAuth 2.0 Credentials
1. Go to "Credentials" in the left menu
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. If prompted, configure the OAuth consent screen first:
   - Select "External" user type
   - Fill in app name, user support email, developer contact
   - Add required scopes: `https://www.googleapis.com/auth/drive.readonly`
4. Return to create credentials:
   - Select "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000` (development)
     - `http://localhost:5173` (Vite dev server)
     - Your production domain
   - Click "Create"

### 5. Get Your Credentials
1. Copy the **Client ID** and **API Key** from the credentials page
2. Update your frontend `.env` file:

```env
# .env
VITE_GOOGLE_API_KEY=your_api_key_here
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

### 6. Test the Integration
1. Start the frontend: `npm run dev`
2. Navigate to Admin → Products → Add Product
3. Click "Select Images from Drive" button
4. You'll be prompted to sign in with your Google Account
5. Select images from your Google Drive
6. Images will be added to the form

## Troubleshooting

### "Google API credentials not configured" error
- Verify both `VITE_GOOGLE_API_KEY` and `VITE_GOOGLE_CLIENT_ID` are set in `.env`
- Restart the development server after updating `.env`

### "Failed to open Google Drive picker" error
- Ensure you're signed into a Google Account
- Check that Google Drive API is enabled in Cloud Console
- Verify the Client ID matches your project
- Check browser console for more detailed error messages

### Images not displaying
- Google Drive URLs should be accessible publicly or shared with you
- The system generates public view URLs: `https://drive.google.com/uc?id={fileId}&export=view`
- Ensure images are accessible and not in a private folder

### CORS Issues
- Google Drive API should handle CORS automatically
- If issues persist, check that your domain is in the authorized redirect URIs

## Features
- ✅ Select multiple images at once from Google Drive
- ✅ First selected image becomes the main product image
- ✅ Support for up to 4 images per product (1 main + 3 side views)
- ✅ Image preview with remove button
- ✅ Direct display of cloud-hosted images (no local file upload)
- ✅ Automatic public URL generation for display

## Notes
- Images are stored as Google Drive public view URLs in the database
- No file upload to your server - images remain on Google Drive
- URLs are direct accessible links via `drive.google.com/uc?id=...`
- Admins can share/unshare images without affecting the store (as long as URLs remain public)
