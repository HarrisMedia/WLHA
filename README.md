# WLHA Radio - The Big 64 📻

A professional mobile radio app for WLHA Radio featuring live streaming, now playing information, and interactive features. Built with React Native and Expo for iOS and Android with CarPlay and Android Auto compatibility.

## Features

- 🎵 **Live Audio Streaming** - High-quality live radio stream
- 📱 **Now Playing Info** - Real-time song and artist information  
- 🚗 **CarPlay & Android Auto** - Seamless car integration
- 📞 **Request Line** - Direct calling and texting to the station
- ❤️ **Favorites** - Save your favorite songs
- 🔔 **Background Playback** - Continues playing when app is in background
- 📢 **Push Notifications** - Station updates and now playing info
- 🎨 **Custom Branding** - WLHA colors and "The Big 64" theming

## Setup Instructions

### 1. Stream Configuration
Update the stream URL in `App.js`:
```javascript
const STREAM_URL = 'YOUR_ACTUAL_STREAM_URL_HERE';
```

### 2. Metadata API
Configure your now playing API in `components/NowPlayingService.js`:
```javascript
const response = await fetch('YOUR_METADATA_API_ENDPOINT', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 3. Contact Information
Update phone numbers in `App.js`:
- Request line: `tel:555-643-9542` 
- Text line: `sms:555-643-9542`

### 4. Branding Assets
Replace placeholder assets in the `assets/` folder:
- `wlha-logo.png` - App icon (1024x1024)
- `wlha-logo.png` - Splash screen image
- `adaptive-icon.png` - Android adaptive icon
- `favicon.png` - Web favicon
- `notification-icon.png` - Notification icon

## Production Setup

### CarPlay & Android Auto
For full CarPlay and Android Auto support, integrate:
- `react-native-track-player` for professional audio handling
- `react-native-music-control` for remote control integration

### Metadata Integration
Common radio metadata sources:
- **Icecast/Shoutcast**: `http://yourserver:port/status-json.xsl`
- **Radio-Locator API**: Professional metadata service
- **Custom API**: Build your own metadata endpoint

### Push Notifications
Configure push notifications through:
1. Expo Push Notifications service
2. Firebase Cloud Messaging
3. Apple Push Notification service

## Technical Details

### Audio Streaming
- Uses Expo AV for reliable audio playback
- Supports background audio with proper audio session management
- Handles network interruptions and auto-reconnection

### Responsive Design  
- Mobile-first design optimized for all screen sizes
- Dark theme with WLHA brand colors
- Smooth animations and haptic feedback

### Performance
- Efficient metadata polling (30-second intervals)
- Optimized for battery life during extended playback
- Minimal bandwidth usage for metadata updates

## Deployment

### Expo Development
```bash
npx expo start
```

### Build for Stores
```bash
# iOS
eas build --platform ios

# Android  
eas build --platform android
```

## Support

For technical support or customization requests, contact the development team.

---

**WLHA Radio - The Big 64** 📻  
*Your favorite music, now mobile*