# Migration from Leaflet to Google Maps

## What Changed

The Communally web app has been migrated from **Leaflet.js** (open-source) to **Google Maps JavaScript API** for a more professional mapping experience.

## Changes Made

### 1. **Dependencies Updated**
- ✅ Removed: Leaflet.js library
- ✅ Added: Google Maps JavaScript API

### 2. **Map Features Enhanced**

**Before (Leaflet):**
- Basic 2D map
- Simple markers
- Limited interaction
- No satellite view
- No street view

**After (Google Maps):**
- Professional Google Maps interface
- Multiple map types (Road, Satellite, Terrain, Hybrid)
- Street View integration
- Better mobile performance
- Native marker animations (drop effect)
- Auto-fit bounds to show all markers
- Better touch controls
- Full screen mode

### 3. **Code Changes**

**State Object:**
```javascript
// Added:
markers: []          // Track all map markers
infoWindow: null     // Shared info window for popups
googleMapsLoaded: false  // Track API load status
```

**Map Initialization:**
- Replaced `L.map()` with `new google.maps.Map()`
- Replaced `L.marker()` with `new google.maps.Marker()`
- Custom SVG markers with emoji icons
- Info windows instead of popups
- Auto-bounds fitting

**Map Methods:**
- `map.flyTo()` → `map.panTo()` + `map.setZoom()`
- `map.invalidateSize()` → `google.maps.event.trigger(map, 'resize')`
- `marker.bindPopup()` → `marker.addListener('click')` + InfoWindow

### 4. **Visual Improvements**

- **Marker Design**: Green circular markers with emoji icons
- **Info Windows**: Cleaner design with better spacing
- **Map Controls**: Native Google Maps controls (zoom, street view, fullscreen)
- **Loading State**: Shows "Loading Google Maps..." message while API loads

## Setup Required

### Get Your Google Maps API Key

1. Go to https://console.cloud.google.com/
2. Create/select a project
3. Enable "Maps JavaScript API"
4. Create an API key
5. Add to `app.html` (line ~17)

**See `GOOGLE_MAPS_SETUP.md` for detailed instructions.**

## Pricing

- **$200 FREE credit per month** from Google
- Covers approximately **28,000 map loads/month**
- Most small apps never exceed free tier
- Billing setup required (but won't charge until you exceed free quota)

## Testing Locally

Once you add your API key:

```bash
# Start server
python3 -m http.server 8080

# Open in browser
http://localhost:8080/app.html
```

Then:
1. Click "Continue as Guest"
2. Click "Explore Map" in sidebar
3. See all 6 job opportunities on Google Maps
4. Click markers to view job details
5. Try different map types (Satellite, Terrain)

## Features Now Available

✅ **Multiple Map Views**
- Roadmap (default)
- Satellite
- Terrain
- Hybrid

✅ **Interactive Controls**
- Street View
- Full Screen
- Zoom controls
- Map type selector

✅ **Better Markers**
- SVG-based custom markers
- Drop animation on load
- Hover effects
- Rich info windows

✅ **Mobile Optimization**
- Better touch gestures
- Faster rendering
- Native mobile controls

✅ **Professional Features**
- Auto-fit all markers in view
- Click list item to fly to marker
- Smooth pan/zoom animations

## Future Enhancements (Easy to Add)

Now that we're using Google Maps, you can easily add:

- **User Location**: Real-time tracking
- **Directions**: Navigate from user to job
- **Radius Search**: Show jobs within X miles
- **Place Autocomplete**: Better location input when posting jobs
- **Traffic Layer**: Show real-time traffic
- **Marker Clustering**: Group nearby markers at low zoom
- **Heatmap**: Visualize job density
- **Geofencing**: Notifications when jobs posted nearby
- **Custom Map Styling**: Match your brand colors

## Rollback (if needed)

If you need to revert to Leaflet:
1. The old Leaflet code is in the git history
2. Or we can restore it from backup

## Support

- Google Maps API Docs: https://developers.google.com/maps/documentation/javascript
- Pricing Calculator: https://mapsplatformtransition.withgoogle.com/
- Support: https://developers.google.com/maps/support
