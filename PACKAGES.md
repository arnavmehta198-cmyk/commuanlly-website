# Package Dependencies - iOS vs Web Version

This document tracks all packages/dependencies used in both the iOS and Web versions of Communally to ensure feature parity.

## iOS Dependencies (from Package.resolved)

### Core Firebase Services
- **firebase-ios-sdk** (12.6.0)
  - FirebaseAuth
  - FirebaseFirestore
  - FirebaseCore
  - FirebaseStorage
  - FirebaseMessaging
  - **Web Equivalent**: Firebase JS SDK 10.7.1 (compat mode)
    - `firebase-app-compat.js`
    - `firebase-auth-compat.js`
    - `firebase-firestore-compat.js`
    - `firebase-storage-compat.js`
    - `firebase-messaging-compat.js`

### Authentication
- **googlesignin-ios** (9.0.0)
  - Google Sign-In for iOS
  - **Web Equivalent**: Google Identity Services (GSI)
    - `https://accounts.google.com/gsi/client`

### Payments
- **stripe-ios** (25.3.1)
  - StripePaymentSheet
  - StripeCore
  - StripeUICore
  - **Web Equivalent**: Stripe.js v3
    - `https://js.stripe.com/v3/`

### Messaging UI
- **messagekit** (5.0.0)
  - Chat UI components
  - **Web Equivalent**: Custom implementation using Firebase Firestore real-time listeners + HTML/CSS
- **inputbaraccessoryview** (7.0.3)
  - Message input bar
  - **Web Equivalent**: Custom HTML input with JavaScript handlers

### Maps & Location
- **MapKit** (Native iOS)
  - Apple Maps integration
  - **Web Equivalent**: Leaflet.js (1.9.4)
    - `leaflet@1.9.4` (main library)
    - `leaflet-fullscreen@1.0.2` (fullscreen plugin)
    - `leaflet.locatecontrol@0.78.0` (location control plugin)
- **CoreLocation** (Native iOS)
  - Location services
  - **Web Equivalent**: HTML5 Geolocation API (native browser API)

### Media & Photos
- **PhotosUI** (Native iOS)
  - Photo picker
  - **Web Equivalent**: HTML5 File API + `<input type="file">` with image preview

### Notifications
- **UserNotifications** (Native iOS)
  - Push notifications
  - **Web Equivalent**: Firebase Cloud Messaging (FCM) via `firebase-messaging-compat.js`

### Supporting Libraries (iOS only - not needed in web)
- **abseil-cpp-binary** - C++ utilities (iOS only)
- **app-check** - App attestation (iOS only)
- **appauth-ios** - OAuth (used by GoogleSignIn)
- **google-ads-on-device-conversion-ios-sdk** - Ads (iOS only)
- **googleappmeasurement** - Analytics (iOS only)
- **googledatatransport** - Data transport (iOS only)
- **googleutilities** - Google utilities (iOS only)
- **grpc-binary** - gRPC (iOS only)
- **gtm-session-fetcher** - Session management (iOS only)
- **gtmappauth** - OAuth helper (iOS only)
- **interop-ios-for-google-sdks** - SDK interop (iOS only)
- **leveldb** - Database (iOS only)
- **nanopb** - Protocol buffers (iOS only)
- **promises** - Promise library (iOS only)
- **swift-protobuf** - Protocol buffers (iOS only)

## Firebase Functions (Backend)

Both iOS and Web versions use the same Firebase Functions backend:

### Dependencies (from firebase-functions/package.json)
- **firebase-admin** (^12.0.0)
- **firebase-functions** (^5.0.0)
- **stripe** (^17.4.0)
- **cors** (^2.8.5)

## Web Version Current Packages

### Loaded via CDN (in index.html)
```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"></script>

<!-- Google Sign-In -->
<script src="https://accounts.google.com/gsi/client" async defer></script>

<!-- Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>

<!-- Leaflet.js Maps -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet-fullscreen@1.0.2/dist/leaflet.fullscreen.css" />
<script src="https://unpkg.com/leaflet-fullscreen@1.0.2/dist/Leaflet.fullscreen.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet.locatecontrol@0.78.0/dist/L.Control.Locate.min.css" />
<script src="https://unpkg.com/leaflet.locatecontrol@0.78.0/dist/L.Control.Locate.min.js"></script>
```

### Native Browser APIs (No CDN needed)
- **HTML5 Geolocation API** - Location services
- **HTML5 File API** - Photo uploads
- **Web Push API** - Push notifications (via FCM)

## Feature Parity Status

✅ **Complete Matches:**
- Firebase Auth, Firestore, Storage, Messaging
- Google Sign-In
- Stripe Payments
- Maps (Leaflet.js replaces MapKit)
- Location Services (HTML5 Geolocation replaces CoreLocation)
- Photo Uploads (HTML5 File API replaces PhotosUI)
- Push Notifications (FCM replaces UserNotifications)

✅ **Equivalent Implementations:**
- Messaging UI (Custom HTML/CSS/JS replaces MessageKit)
- Message Input (Custom input replaces InputBarAccessoryView)

## Version Notes

- **Firebase**: iOS uses 12.6.0, Web uses 10.7.1 (latest stable web SDK)
- **Stripe**: iOS uses 25.3.1, Web uses v3 (latest)
- **Google Sign-In**: iOS uses 9.0.0, Web uses latest GSI (Google Identity Services)
- **Maps**: iOS uses native MapKit, Web uses Leaflet.js 1.9.4

## Maintenance

When updating packages:
1. Update iOS dependencies in Xcode (Swift Package Manager)
2. Update web dependencies in `index.html` (CDN links)
3. Update this document to reflect changes
4. Test feature parity between platforms
