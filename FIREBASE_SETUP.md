# Firebase Setup for Communally Web App

## Overview
The web app now uses Firebase for authentication and data storage, matching the iOS app's backend.

## Setup Instructions

### 1. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your Communally project (or create a new one)
3. Click the gear icon ⚙️ > **Project settings**
4. Scroll down to "Your apps" section
5. Click "Add app" and select **Web** (</>) if you haven't already
6. Copy the Firebase configuration object

### 2. Update app.html

Replace the Firebase config in `app.html` (around line 816) with your actual credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Under "Sign-in method", enable **Google** sign-in
4. Add your authorized domains (localhost, your production domain)

### 4. Set Up Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose a location closest to your users

### 5. Create Firestore Collections

The app uses these collections (they'll be created automatically):

- **users** - User profiles and stats
  - Fields: `uid`, `email`, `displayName`, `userType`, `jobsCompleted`, `rating`, `totalEarned`, `skills`
  
- **opportunities** - Job postings
  - Fields: `title`, `type`, `desc`, `location`, `pay`, `hirer`, `hirerId`, `lat`, `lng`, `status`, `createdAt`, `applicants`
  
- **applications** - Job applications
  - Fields: `opportunityId`, `applicantId`, `applicantName`, `hirerId`, `status`, `createdAt`

### 6. Set Up Firestore Security Rules

In Firestore, go to **Rules** and use these basic rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all, but only write their own
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone authenticated can read opportunities
    match /opportunities/{oppId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && resource.data.hirerId == request.auth.uid;
    }
    
    // Applications are visible to applicant and hirer
    match /applications/{appId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.applicantId || 
         request.auth.uid == resource.data.hirerId);
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
  }
}
```

### 7. Test the App

1. Start your local server: `python3 -m http.server 8080`
2. Open http://localhost:8080/app.html
3. Click "Continue with Google" to sign in
4. Try posting an opportunity
5. Try browsing and applying to jobs

## Features Integrated

✅ **Firebase Authentication** - Google Sign-In  
✅ **Firestore Database** - Real-time opportunity updates  
✅ **User Profiles** - Synced with Firestore  
✅ **Post Opportunities** - Saved to Firestore  
✅ **Apply to Jobs** - Application tracking  
✅ **Real-time Updates** - Live data synchronization  

## Fallback Mode

If Firebase isn't configured or has errors, the app will fall back to sample data for demo purposes.

## Matching iOS App

The web app uses the same Firebase project and data structure as the iOS app, ensuring:
- Users can sign in on both platforms
- Opportunities posted on iOS appear on web (and vice versa)
- All data is synchronized in real-time

## Troubleshooting

**Issue**: Sign-in popup doesn't work  
**Fix**: Make sure Google sign-in is enabled in Firebase Console and localhost is in authorized domains

**Issue**: Can't read/write data  
**Fix**: Check Firestore security rules and ensure test mode is enabled during development

**Issue**: "Firebase not defined" error  
**Fix**: Make sure Firebase SDK scripts are loading correctly (check network tab in DevTools)

## Next Steps

- Add email/password authentication
- Implement messaging with Firestore
- Add real-time chat
- Add payment integration (Stripe)
- Add notifications
- Add profile editing
- Add job completion flow
