# Google Maps API Setup

## Get Your Google Maps API Key

### Step 1: Create/Access Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one
   - Click the project dropdown at the top
   - Click "NEW PROJECT"
   - Name it "Communally" (or any name)
   - Click "CREATE"

### Step 2: Enable Google Maps JavaScript API

1. In the Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Maps JavaScript API"
3. Click on it and press **ENABLE**
4. Also enable these (optional but recommended):
   - Geocoding API (for address lookups)
   - Places API (for location search)
   - Directions API (for route planning)

### Step 3: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **CREATE CREDENTIALS** → **API key**
3. Your API key will be created and displayed
4. **IMPORTANT**: Click "RESTRICT KEY" to secure it

### Step 4: Restrict Your API Key (Security)

1. Under **Application restrictions**:
   - Select "HTTP referrers (web sites)"
   - Add these referrers:
     - `http://localhost:8080/*`
     - `http://127.0.0.1:8080/*`
     - Your production domain when you deploy (e.g., `https://yourdomain.com/*`)

2. Under **API restrictions**:
   - Select "Restrict key"
   - Check "Maps JavaScript API"
   - Check any other APIs you enabled

3. Click **SAVE**

### Step 5: Add API Key to Your App

1. Open `app.html`
2. Find this line (around line 17):
   ```html
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initGoogleMaps"></script>
   ```
3. Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key
4. Save the file

### Step 6: Enable Billing (Required)

Google Maps requires billing to be enabled, but includes **$200 free credit per month**. This covers approximately:
- 28,000 map loads per month
- For most small apps, this is completely free

1. Go to **Billing** in Google Cloud Console
2. Set up a billing account
3. Add payment method (you won't be charged unless you exceed the free tier)

## Testing

After setup:

1. Restart your local server: `python3 -m http.server 8080`
2. Open http://localhost:8080/app.html
3. Click "Continue as Guest"
4. Click "Explore Map" in the sidebar
5. You should see:
   - ✅ Google Maps with satellite/terrain options
   - ✅ Green circular markers for 6 opportunities
   - ✅ Click markers to see job details
   - ✅ Street view control
   - ✅ Full screen option

## Pricing

Google Maps JavaScript API pricing:
- **$200 FREE credit per month** (covers ~28,000 map loads)
- After free credit: $7 per 1,000 loads
- **Most small to medium apps never exceed the free tier**

## Troubleshooting

**Error: "This page can't load Google Maps correctly"**
- Check your API key is correct
- Make sure Maps JavaScript API is enabled
- Verify billing is set up
- Check browser console for specific error

**Map shows but no markers**
- Check browser console for JavaScript errors
- Verify opportunities data is loading (check console logs)
- Make sure `state.googleMapsLoaded` is true

**"RefererNotAllowedMapError"**
- Your referrer isn't authorized
- Add `http://localhost:8080/*` to allowed referrers in API restrictions

## Features Enabled with Google Maps

✅ Satellite & terrain views  
✅ Street view integration  
✅ Better performance on mobile  
✅ Traffic overlay (can be enabled)  
✅ Native marker animations  
✅ Better touch controls  
✅ Automatic marker clustering (can add)  
✅ Drawing tools (can add)  
✅ Heatmaps for job density (can add)  

## Next Steps

Once Google Maps is working, you can add:
- Real-time user location tracking
- Directions from user to job location
- Radius search (show only jobs within X miles)
- Place autocomplete for posting jobs
- Geofencing notifications
