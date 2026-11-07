import { VideoItem, PlaylistDef } from '../types';
import { ARCHIVED_VIDEOS, FEATURED_LIVESTREAM, DEFAULT_PLAYLISTS } from '../data/churchData';

// Versioned storage keys so any previously cached mock placeholder videos are cleanly purged
const STORAGE_KEY_VIDEOS = 'sfc_videos_v3';
const STORAGE_KEY_PLAYLISTS = 'sfc_playlists_v3';
const STORAGE_KEY_FEATURED = 'sfc_featured_v3';
const STORAGE_KEY_LIVE_STATE = 'sfc_live_broadcast_v3';

// Known dummy / mock video IDs to strictly reject from cache
const BANNED_MOCK_IDS = new Set(['dQw4w9WgXcQ', '1y_fl8fTjH4', 'kJQP7kiw5Fk', '9bZkp7q19f0', 'L_LUpnjgPso', 'fJ9rUzIMcZQ']);

export interface LiveBroadcastState {
  isLive: boolean;
  liveVideoId?: string;
  customLiveTitle?: string;
}

export const videoService = {
  // Get all active playlists (defaults + custom created)
  getPlaylists(): PlaylistDef[] {
    if (typeof window === 'undefined') return DEFAULT_PLAYLISTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PLAYLISTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse playlists from localStorage', e);
    }
    return DEFAULT_PLAYLISTS;
  },

  // Save updated playlists
  savePlaylists(playlists: PlaylistDef[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(playlists));
  },

  // Add a new custom playlist
  addPlaylist(newPl: PlaylistDef): PlaylistDef[] {
    const list = this.getPlaylists();
    const updated = [...list, newPl];
    this.savePlaylists(updated);
    return updated;
  },

  // Get all videos with custom metadata tags applied
  getVideos(): VideoItem[] {
    if (typeof window === 'undefined') return ARCHIVED_VIDEOS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_VIDEOS);
      if (stored) {
        const parsed: VideoItem[] = JSON.parse(stored);
        // Filter out any stale mock/dummy videos if present
        const sanitized = parsed.filter(v => !BANNED_MOCK_IDS.has(v.youtubeId));
        if (sanitized.length > 0) {
          return sanitized;
        }
      }
    } catch (e) {
      console.warn('Failed to parse videos from localStorage', e);
    }
    return ARCHIVED_VIDEOS;
  },

  // Save videos catalog
  saveVideos(videos: VideoItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(videos));
  },

  // Update a single video's metadata
  updateVideo(updatedVideo: VideoItem): VideoItem[] {
    const list = this.getVideos();
    const updated = list.map((v) => (v.id === updatedVideo.id ? updatedVideo : v));
    this.saveVideos(updated);
    return updated;
  },

  // Add a new video from YouTube
  addVideo(newVideo: VideoItem): VideoItem[] {
    const list = this.getVideos();
    const updated = [newVideo, ...list];
    this.saveVideos(updated);
    return updated;
  },

  // Delete a video
  deleteVideo(videoId: string): VideoItem[] {
    const list = this.getVideos();
    const updated = list.filter((v) => v.id !== videoId);
    this.saveVideos(updated);
    return updated;
  },

  // Get the featured / active spotlight video
  getFeaturedVideo(): VideoItem {
    if (typeof window === 'undefined') return FEATURED_LIVESTREAM;
    try {
      const featuredId = localStorage.getItem(STORAGE_KEY_FEATURED);
      if (featuredId) {
        const all = this.getVideos();
        const found = all.find((v) => v.id === featuredId);
        if (found && !BANNED_MOCK_IDS.has(found.youtubeId)) return found;
      }
    } catch (e) {
      console.warn('Failed to load featured video', e);
    }
    return FEATURED_LIVESTREAM;
  },

  // Set active featured video
  setFeaturedVideo(videoId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_FEATURED, videoId);
  },

  // Get live broadcast toggle status
  getLiveBroadcastState(): LiveBroadcastState {
    if (typeof window === 'undefined') return { isLive: false };
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LIVE_STATE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load live broadcast state', e);
    }
    return { isLive: false };
  },

  // Set live broadcast state
  setLiveBroadcastState(state: LiveBroadcastState): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_LIVE_STATE, JSON.stringify(state));
  },

  // Reset to original factory defaults
  resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY_VIDEOS);
    localStorage.removeItem(STORAGE_KEY_PLAYLISTS);
    localStorage.removeItem(STORAGE_KEY_FEATURED);
    localStorage.removeItem(STORAGE_KEY_LIVE_STATE);
    // Also remove legacy keys
    localStorage.removeItem('sfc_admin_videos');
    localStorage.removeItem('sfc_admin_playlists');
    localStorage.removeItem('sfc_admin_featured_id');
  },

  // Export current catalog as JSON text for permanent code backup
  exportCatalogJson(): string {
    return JSON.stringify(
      {
        channelId: "UCr5yBJUWrX4CNIuzHUtVtJw",
        channelUrl: "https://www.youtube.com/@salemfellowshipchurch",
        exportedAt: new Date().toISOString(),
        playlists: this.getPlaylists(),
        videos: this.getVideos(),
      },
      null,
      2
    );
  }
};
