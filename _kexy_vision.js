// Kexy Vision - Continuous Screenshot Cache
// This file is auto-managed by Kexy - do not edit
import { captureScreen } from 'react-native-view-shot';
import { AppState, PanResponder, View } from 'react-native';

// Only run once (prevent duplicate intervals on HMR)
if (!global.__KEXY_VISION_INITIALIZED__) {
  global.__KEXY_VISION_INITIALIZED__ = true;
  
  let lastCaptureTime = 0;
  const CAPTURE_INTERVAL = 1000; // Capture every 1 second while active
  
  const captureAndCache = async () => {
    // Only capture if app is active
    if (AppState.currentState !== 'active') return;
    
    // Throttle captures (min 500ms between)
    const now = Date.now();
    if (now - lastCaptureTime < 500) return;
    lastCaptureTime = now;
    
    try {
      const base64 = await captureScreen({
        format: 'jpg',
        quality: 0.5,
        result: 'base64',
      });
      console.log('[KEXY_VISION_CACHE]' + base64);
    } catch (e) {
      // Silently fail
    }
  };
  
  // Capture on app state changes
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      setTimeout(captureAndCache, 300);
    }
  });
  
  // Initial capture after app loads
  setTimeout(captureAndCache, 500);
  
  // Periodic capture while active
  setInterval(captureAndCache, CAPTURE_INTERVAL);
}
