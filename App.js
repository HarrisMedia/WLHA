import './_kexy_env'; // Kexy env polyfill (must be first!)
import './_kexy_context'; // Kexy context tracker
import './_kexy_vision'; // Kexy vision (screenshot capture)
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Alert,
  Linking,
  Share,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// ====== SERVICES (Consolidated) ======

// Now Playing Service
class NowPlayingService {
  static async fetchNowPlaying() {
    try {
      // Replace with your actual metadata API endpoint
      // Most radio stations provide metadata through Icecast/Shoutcast APIs
      const response = await fetch('https://your-radio-api.com/nowplaying', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          song: data.title || 'Unknown Song',
          artist: data.artist || 'WLHA Radio',
          album: data.album || 'Live Stream',
          artwork: data.artwork_url || null,
          duration: data.duration || null,
          startTime: data.started_at || new Date().toISOString(),
        };
      }
    } catch (error) {
      console.log('Metadata fetch error:', error);
    }

    // Fallback data when API is unavailable
    return {
      song: 'Live Programming',
      artist: 'WLHA Radio',
      album: 'The Big 64',
      artwork: null,
      duration: null,
      startTime: new Date().toISOString(),
    };
  }

  // Simulate metadata updates for demo purposes
  static getMockNowPlaying() {
    const mockTracks = [
      {
        song: 'Sweet Caroline',
        artist: 'Neil Diamond',
        album: 'Brother Love\'s Travelling Salvation Show',
        artwork: null,
      },
      {
        song: 'Don\'t Stop Believin\'',
        artist: 'Journey',
        album: 'Escape',
        artwork: null,
      },
      {
        song: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        artwork: null,
      },
      {
        song: 'Hotel California',
        artist: 'Eagles',
        album: 'Hotel California',
        artwork: null,
      },
      {
        song: 'Imagine',
        artist: 'John Lennon',
        album: 'Imagine',
        artwork: null,
      },
      {
        song: 'The Big 64 Morning Show',
        artist: 'WLHA Radio',
        album: 'Live Programming',
        artwork: null,
      }
    ];

    return mockTracks[Math.floor(Math.random() * mockTracks.length)];
  }

  // Start polling for metadata updates
  static startMetadataPolling(callback, intervalMs = 30000) {
    const poll = async () => {
      const nowPlaying = await this.fetchNowPlaying();
      callback(nowPlaying);
    };

    // Initial fetch
    poll();

    // Set up periodic polling
    return setInterval(poll, intervalMs);
  }

  static stopMetadataPolling(intervalId) {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
}

// Media Session Service
class MediaSession {
  static sound = null;
  static isPlaying = false;
  static nowPlaying = null;

  // Initialize media session for car integration
  static async setupMediaSession(sound, nowPlayingData) {
    this.sound = sound;
    this.nowPlaying = nowPlayingData;

    if (Platform.OS === 'ios') {
      try {
        console.log('Setting up iOS MediaPlayer integration');
        this.updateiOSNowPlaying(nowPlayingData);
      } catch (error) {
        console.log('iOS MediaPlayer setup error:', error);
      }
    } else if (Platform.OS === 'android') {
      try {
        console.log('Setting up Android MediaSession integration');
        this.updateAndroidMediaSession(nowPlayingData);
      } catch (error) {
        console.log('Android MediaSession setup error:', error);
      }
    }
  }

  // Update iOS Now Playing info for CarPlay
  static updateiOSNowPlaying(nowPlayingData) {
    if (Platform.OS === 'ios') {
      try {
        console.log('Updated iOS Now Playing:', nowPlayingData);
      } catch (error) {
        console.log('iOS Now Playing update error:', error);
      }
    }
  }

  // Update Android Media Session for Android Auto
  static updateAndroidMediaSession(nowPlayingData) {
    if (Platform.OS === 'android') {
      try {
        console.log('Updated Android Media Session:', nowPlayingData);
      } catch (error) {
        console.log('Android Media Session update error:', error);
      }
    }
  }

  // Handle play/pause from car controls
  static async handlePlayPause() {
    try {
      if (!this.sound) return;

      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await this.sound.pauseAsync();
          this.isPlaying = false;
        } else {
          await this.sound.playAsync();
          this.isPlaying = true;
        }
      }
    } catch (error) {
      console.log('Media control error:', error);
    }
  }

  // Setup remote control listeners
  static setupRemoteControls() {
    try {
      console.log('Remote controls setup complete');
    } catch (error) {
      console.log('Remote control setup error:', error);
    }
  }

  // Cleanup media session
  static cleanup() {
    try {
      console.log('Media session cleaned up');
    } catch (error) {
      console.log('Media session cleanup error:', error);
    }
  }

  // Update now playing information
  static updateNowPlaying(nowPlayingData) {
    this.nowPlaying = nowPlayingData;
    
    if (Platform.OS === 'ios') {
      this.updateiOSNowPlaying(nowPlayingData);
    } else if (Platform.OS === 'android') {
      this.updateAndroidMediaSession(nowPlayingData);
    }
  }
}

// Notification Service
class NotificationService {
  static notificationId = null;
  static isSupported = false;

  // Setup notification permissions - fallback implementation
  static async setupNotifications() {
    try {
      this.isSupported = false;
      console.log('Notifications not available in this environment - using fallback');
      return false;
    } catch (error) {
      console.log('Notification setup fallback:', error);
      this.isSupported = false;
      return false;
    }
  }

  // Show persistent notification for radio playback - fallback implementation
  static async showPlaybackNotification(nowPlaying, isPlaying) {
    try {
      if (!this.isSupported) {
        console.log('📻 Notification (fallback):', {
          title: 'WLHA Radio - The Big 64',
          body: isPlaying 
            ? `♪ ${nowPlaying.song} - ${nowPlaying.artist}` 
            : 'Radio Paused - Tap to resume',
          isPlaying: isPlaying
        });
        return null;
      }

      return null;
    } catch (error) {
      console.log('Notification error (fallback):', error);
      return null;
    }
  }

  // Update existing notification - fallback implementation
  static async updatePlaybackNotification(nowPlaying, isPlaying) {
    return this.showPlaybackNotification(nowPlaying, isPlaying);
  }

  // Clear playback notification - fallback implementation
  static async clearPlaybackNotification() {
    try {
      if (this.notificationId) {
        console.log('📻 Clearing notification (fallback)');
        this.notificationId = null;
      }
    } catch (error) {
      console.log('Clear notification error (fallback):', error);
    }
  }

  // Handle notification interactions - fallback implementation
  static setupNotificationListeners(onPlayPause) {
    console.log('📻 Notification listeners setup (fallback)');
    
    return {
      remove: () => console.log('Notification listener removed (fallback)')
    };
  }

  // Cleanup - fallback implementation
  static cleanup() {
    console.log('📻 Notification service cleanup (fallback)');
    this.clearPlaybackNotification();
  }
}

// ====== MAIN APP COMPONENT ======

export default function App() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [nowPlaying, setNowPlaying] = useState({
    song: 'Loading...',
    artist: 'WLHA Radio',
    album: 'Live Stream'
  });
  const [isFavorited, setIsFavorited] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const metadataInterval = useRef(null);

  // Stream URL - you'll need to replace with actual WLHA stream URL
  const STREAM_URL = 'https://streaming.live365.com/a04907_2';

  useEffect(() => {
    setupAudio();
    startPulseAnimation();
    startMetadataUpdates();
    setupNotifications();
    
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      NowPlayingService.stopMetadataPolling(metadataInterval.current);
      NotificationService.cleanup();
      MediaSession.cleanup();
    };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.log('Audio setup error:', error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startRotationAnimation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRotationAnimation = () => {
    rotateAnim.stopAnimation();
    rotateAnim.setValue(0);
  };

  const togglePlayback = async () => {
    if (!sound) {
      await playStream();
    } else if (isPlaying) {
      await pauseStream();
    } else {
      await resumeStream();
    }
  };

  const playStream = async () => {
    try {
      setIsLoading(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: STREAM_URL },
        { shouldPlay: true, volume: volume, isLooping: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
      startRotationAnimation();
      MediaSession.setupMediaSession(newSound, nowPlaying);
      NotificationService.showPlaybackNotification(nowPlaying, true);
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to WLHA Radio. Please check your internet connection.');
      console.log('Play error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pauseStream = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
      stopRotationAnimation();
      NotificationService.updatePlaybackNotification(nowPlaying, false);
    }
  };

  const resumeStream = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
      startRotationAnimation();
      NotificationService.updatePlaybackNotification(nowPlaying, true);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      if (!status.isPlaying && !status.positionMillis) {
        // Stream ended, try to reconnect
        reconnectStream();
      }
    }
  };

  const reconnectStream = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setTimeout(playStream, 2000);
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: 'Check out WLHA Radio - The Big 64! Listen live on mobile at lakeshore64.com',
        title: 'WLHA Radio - The Big 64',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const startMetadataUpdates = () => {
    metadataInterval.current = NowPlayingService.startMetadataPolling((metadata) => {
      setNowPlaying(metadata);
      MediaSession.updateNowPlaying(metadata);
    }, 30000); // Update every 30 seconds
  };

  const setupNotifications = async () => {
    await NotificationService.setupNotifications();
    NotificationService.setupNotificationListeners(togglePlayback);
  };

  const openRequestLine = () => {
    Alert.alert(
      'Request Line',
      'Call (414) 255-9542 to request your favorite songs!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => Linking.openURL('tel:414-255-9542') }
      ]
    );
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    Alert.alert(
      isFavorited ? 'Removed from Favorites' : 'Added to Favorites',
      `"${nowPlaying.song}" by ${nowPlaying.artist}`
    );
  };

  const openWebsite = () => {
    Linking.openURL('https://lakeshore64.com');
  };

  const sendMessage = () => {
    Alert.alert(
      'Send Message',
      'Text us your requests and comments!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Text Now', onPress: () => Linking.openURL('sms:414-255-9542') }
      ]
    );
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <View style={styles.background}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <MaterialIcons name="radio" size={40} color="white" />
                <Text style={styles.logoText}>WLHA</Text>
              </View>
              <Text style={styles.slogan}>The Big 64</Text>
            </View>
          </View>

          {/* Now Playing Card */}
          <View style={styles.nowPlayingCard}>
            <Animated.View 
              style={[
                styles.albumArt,
                { 
                  transform: [
                    { scale: pulseAnim },
                    { rotate: isPlaying ? spin : '0deg' }
                  ] 
                }
              ]}
            >
              <View style={styles.albumGradient}>
                <Text style={styles.albumText}>WLHA</Text>
                <Text style={styles.albumSubText}>64</Text>
              </View>
            </Animated.View>

            <View style={styles.trackInfo}>
              <Text style={styles.songTitle} numberOfLines={2}>
                {nowPlaying.song}
              </Text>
              <Text style={styles.artistName} numberOfLines={1}>
                {nowPlaying.artist}
              </Text>
              <Text style={styles.albumName} numberOfLines={1}>
                Live on WLHA Radio
              </Text>
            </View>
          </View>

          {/* Player Controls */}
          <View style={styles.playerControls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setVolume(Math.max(0, volume - 0.1))}
            >
              <Ionicons name="volume-low" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.playButton, isLoading && styles.loadingButton]}
              onPress={togglePlayback}
              disabled={isLoading}
            >
              {isLoading ? (
                <MaterialIcons name="autorenew" size={40} color="white" />
              ) : isPlaying ? (
                <Ionicons name="pause" size={40} color="white" />
              ) : (
                <Ionicons name="play" size={40} color="white" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setVolume(Math.min(1, volume + 0.1))}
            >
              <Ionicons name="volume-high" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Status */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: isPlaying ? '#2ecc71' : '#95a5a6' }]} />
            <Text style={styles.statusText}>
              {isPlaying ? 'LIVE ON AIR' : 'OFFLINE'}
            </Text>
          </View>

          {/* Interactive Features Row 1 */}
          <View style={styles.featuresContainer}>
            <TouchableOpacity style={styles.featureButton} onPress={openRequestLine}>
              <Ionicons name="call" size={24} color="#fff" />
              <Text style={styles.featureText}>Request Line</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureButton} onPress={sendMessage}>
              <Ionicons name="chatbubble" size={24} color="#fff" />
              <Text style={styles.featureText}>Text Us</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureButton} onPress={shareApp}>
              <Ionicons name="share-social" size={24} color="#fff" />
              <Text style={styles.featureText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Interactive Features Row 2 */}
          <View style={styles.featuresContainer}>
            <TouchableOpacity style={styles.featureButton} onPress={toggleFavorite}>
              <Ionicons 
                name={isFavorited ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorited ? "#ff6b6b" : "#fff"} 
              />
              <Text style={[styles.featureText, isFavorited && { color: '#ff6b6b' }]}>
                Favorites
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureButton} onPress={openWebsite}>
              <Ionicons name="globe" size={24} color="#fff" />
              <Text style={styles.featureText}>Website</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureButton}>
              <Ionicons name="newspaper" size={24} color="#fff" />
              <Text style={styles.featureText}>News</Text>
            </TouchableOpacity>
          </View>

          {/* Station Info */}
          <View style={styles.stationInfo}>
            <Text style={styles.infoTitle}>About WLHA Radio</Text>
            <Text style={styles.infoText}>
              We've traded carrier current for live streaming 24/7. Listen on this app, on Alexa or on lakeshore64.com
            </Text>
            <Text style={styles.frequency}>📻 640 AM</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    marginLeft: 10,
  },
  slogan: {
    fontSize: 20,
    color: '#ff6b6b',
    fontWeight: '600',
    marginTop: 5,
  },
  nowPlayingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  albumArt: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  albumGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
  },
  albumSubText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginTop: -2,
  },
  trackInfo: {
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 16,
    color: '#ff6b6b',
    marginBottom: 4,
  },
  albumName: {
    fontSize: 14,
    color: '#bbb',
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  controlButton: {
    padding: 15,
    marginHorizontal: 20,
  },
  playButton: {
    backgroundColor: '#ff6b6b',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingButton: {
    backgroundColor: '#95a5a6',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  featureButton: {
    alignItems: 'center',
    padding: 15,
  },
  featureText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  stationInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  frequency: {
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: '600',
  },
});