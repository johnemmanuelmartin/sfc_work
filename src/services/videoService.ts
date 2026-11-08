import { VideoItem, PlaylistDef } from '../types';
import { ARCHIVED_VIDEOS, FEATURED_LIVESTREAM, DEFAULT_PLAYLISTS, CHURCH_INFO } from '../data/churchData';
import { youtubeApiService } from './youtubeApiService';

// Versioned storage keys so any previously cached mock placeholder videos or stale live states are cleanly purged
const STORAGE_KEY_VIDEOS = 'sfc_videos_v8';
const STORAGE_KEY_PLAYLISTS = 'sfc_playlists_v8';
const STORAGE_KEY_FEATURED = 'sfc_featured_v8';
const STORAGE_KEY_LIVE_STATE = 'sfc_live_broadcast_v8';

// Known dummy / unverified video IDs to strictly reject from cache
const BANNED_MOCK_IDS = new Set([
  'dQw4w9WgXcQ', 
  '1y_fl8fTjH4', 
  'kJQP7kiw5Fk', 
  '9bZkp7q19f0', 
  'L_LUpnjgPso', 
  'fJ9rUzIMcZQ',
  '_z7jLDvaFB8',
  'RxlP2o0vY2Y'
]);

// Playlists that should never be shown unless explicitly created on YouTube
const BANNED_CATEGORY_IDS = new Set(['worship', 'special', 'youth']);

export interface LiveBroadcastState {
  isLive: boolean;
  liveVideoId?: string;
  customLiveTitle?: string;
  broadcastType?: 'sunday' | 'bible_study' | 'prayer' | 'special';
  startedAt?: number; // Timestamp when broadcast was toggled on
}

export const videoService = {
  // Get all active playlists in required order
  getPlaylists(): PlaylistDef[] {
    if (typeof window === 'undefined') return DEFAULT_PLAYLISTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PLAYLISTS);
      if (stored) {
        const parsed: PlaylistDef[] = JSON.parse(stored);
        // Clean out any obsolete unmentioned categories from previous versions
        const cleaned = parsed.filter(p => !BANNED_CATEGORY_IDS.has(p.id));
        // Ensure locked_in_with_god always has its verified YouTube playlist ID
        return cleaned.map(p => {
          if (p.id === 'locked_in_with_god' && !p.youtubePlaylistId) {
            return { ...p, youtubePlaylistId: 'PL1VI4g-eqBnYwwwmnlf4njHPO8VrqRdkN' };
          }
          return p;
        });
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

  // Get live broadcast toggle status (No hardcoded time series!)
  // Live state is strictly active only when toggled on or verified active
  getLiveBroadcastState(): LiveBroadcastState {
    if (typeof window === 'undefined') return { isLive: false };
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LIVE_STATE);
      if (stored) {
        const parsed: LiveBroadcastState = JSON.parse(stored);
        if (parsed.isLive) {
          // Safety auto-expiration: if a stream was toggled on more than 5 hours ago, auto-reset to offline
          const now = Date.now();
          if (parsed.startedAt && now - parsed.startedAt > 5 * 60 * 60 * 1000) {
            this.setLiveBroadcastState({ isLive: false });
            return { isLive: false };
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load live broadcast state', e);
    }

    return { isLive: false };
  },

  // Set live broadcast state (with timestamp)
  setLiveBroadcastState(state: LiveBroadcastState): void {
    if (typeof window === 'undefined') return;
    const enriched = {
      ...state,
      startedAt: state.isLive ? (state.startedAt || Date.now()) : undefined
    };
    localStorage.setItem(STORAGE_KEY_LIVE_STATE, JSON.stringify(enriched));
  },

  // Live Sync with YouTube Data API v3 or fallback RSS Feed
  // Only populates 'All Videos' and detects active Live broadcasts
  // All other playlist filters show directly from actual YouTube playlists
  async syncLatestVideos(): Promise<{
    videos: VideoItem[];
    isLive: boolean;
    liveVideo?: VideoItem;
  }> {
    let currentVideos = this.getVideos();
    const liveState = this.getLiveBroadcastState();
    let isLive = liveState.isLive;
    let liveVideo: VideoItem | undefined;

    // 1. If Google Cloud YouTube Data API v3 key is provided, perform automated live check & upload sync
    if (youtubeApiService.hasApiKey()) {
      try {
        const liveCheck = await youtubeApiService.checkIsChannelLive();
        if (liveCheck.isLive && liveCheck.videoId) {
          isLive = true;
          liveVideo = {
            id: `yt-live-${liveCheck.videoId}`,
            title: liveCheck.title || 'SUNDAY SERVICE | SALEM FELLOWSHIP | LIVE BROADCAST',
            titleTe: 'సేలెం ఫెలోషిప్ చర్చి — ప్రత్యక్ష ప్రసారం',
            youtubeId: liveCheck.videoId,
            category: 'all',
            speaker: 'Pastor P. David Paul',
            speakerTe: 'పాస్టర్ పి. డేవిడ్ పాల్',
            date: 'LIVE NOW',
            dateTe: 'ప్రత్యక్ష ప్రసారం',
            duration: 'LIVE',
            language: 'Telugu',
            isLiveStream: true,
            description: liveCheck.description || 'Live broadcast from Salem Fellowship Church Kalyan Nagar Main Branch.',
            descriptionTe: 'కళ్యాణ్ నగర్ ప్రధాన మందిరము నుండి ప్రత్యక్ష ప్రసారం.'
          };

          this.setLiveBroadcastState({
            isLive: true,
            liveVideoId: liveCheck.videoId,
            customLiveTitle: liveCheck.title,
            startedAt: Date.now()
          });
        } else if (!liveCheck.isLive && liveState.isLive) {
          // Channel is confirmed offline via Google Cloud API
          this.setLiveBroadcastState({ isLive: false });
          isLive = false;
        }

        // Fetch latest uploaded videos directly from YouTube Channel Uploads playlist
        const apiVideos = await youtubeApiService.fetchChannelUploads(15);
        if (apiVideos.length > 0) {
          const existingIds = new Set(currentVideos.map(v => v.youtubeId));
          const newVideos = apiVideos.filter(f => !existingIds.has(f.youtubeId));
          if (newVideos.length > 0) {
            const merged = [...newVideos, ...currentVideos];
            this.saveVideos(merged);
            currentVideos = merged;
          }
          return { videos: currentVideos, isLive, liveVideo };
        }
      } catch (err) {
        console.warn('YouTube Data API sync error, falling back to RSS feed', err);
      }
    }

    // 2. Fallback: Public Channel RSS Feed (Strictly for 'All Videos', no auto-categorization!)
    try {
      const feedUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${CHURCH_INFO.youtubeChannelId}`
      )}`;

      const res = await fetch(feedUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
          const feedItems: VideoItem[] = [];

          for (const item of data.items) {
            let ytId = '';
            if (item.guid && item.guid.includes('yt:video:')) {
              ytId = item.guid.split('yt:video:')[1];
            } else if (item.link && item.link.includes('v=')) {
              ytId = item.link.split('v=')[1].split('&')[0];
            }

            if (!ytId || BANNED_MOCK_IDS.has(ytId)) continue;

            const title = item.title || '';

            // Format date
            let formattedDate = 'Recent Broadcast';
            if (item.pubDate) {
              const d = new Date(item.pubDate);
              if (!isNaN(d.getTime())) {
                const day = String(d.getDate()).padStart(2, '0');
                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                formattedDate = `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
              }
            }

            // General channel uploads belong to 'all' — no heuristic guessing of categories!
            feedItems.push({
              id: `yt-${ytId}`,
              title: title,
              titleTe: title,
              youtubeId: ytId,
              category: 'all',
              speaker: 'Pastor P. David Paul',
              speakerTe: 'పాస్టర్ పి. డేవిడ్ పాల్',
              date: formattedDate,
              dateTe: formattedDate,
              duration: 'Full Service',
              language: 'Telugu',
              description: item.description || 'Service broadcast from Salem Fellowship Church Hyderabad.',
              descriptionTe: 'కళ్యాణ్ నగర్ ప్రధాన మందిరము నుండి వాక్య పరిచర్య.'
            });
          }

          if (feedItems.length > 0) {
            const existingIds = new Set(currentVideos.map(v => v.youtubeId));
            const newVideos = feedItems.filter(f => !existingIds.has(f.youtubeId));

            if (newVideos.length > 0) {
              const merged = [...newVideos, ...currentVideos];
              this.saveVideos(merged);
              return { videos: merged, isLive, liveVideo };
            }
          }
        }
      }
    } catch (e) {
      console.warn('Could not sync latest YouTube feed (offline or rate limited)', e);
    }

    return { videos: currentVideos, isLive, liveVideo };
  },

  // Reset to original factory defaults
  resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY_VIDEOS);
    localStorage.removeItem(STORAGE_KEY_PLAYLISTS);
    localStorage.removeItem(STORAGE_KEY_FEATURED);
    localStorage.removeItem(STORAGE_KEY_LIVE_STATE);
    // Also remove legacy keys
    localStorage.removeItem('sfc_videos_v7');
    localStorage.removeItem('sfc_playlists_v7');
    localStorage.removeItem('sfc_featured_v7');
    localStorage.removeItem('sfc_live_broadcast_v7');
    localStorage.removeItem('sfc_videos_v6');
    localStorage.removeItem('sfc_playlists_v6');
    localStorage.removeItem('sfc_featured_v6');
    localStorage.removeItem('sfc_live_broadcast_v6');
    localStorage.removeItem('sfc_videos_v5');
    localStorage.removeItem('sfc_playlists_v5');
    localStorage.removeItem('sfc_featured_v5');
    localStorage.removeItem('sfc_live_broadcast_v5');
    localStorage.removeItem('sfc_videos_v4');
    localStorage.removeItem('sfc_playlists_v4');
    localStorage.removeItem('sfc_featured_v4');
    localStorage.removeItem('sfc_live_broadcast_v4');
    localStorage.removeItem('sfc_admin_videos');
    localStorage.removeItem('sfc_admin_playlists');
    localStorage.removeItem('sfc_admin_featured_id');
  },

  // Export current catalog as JSON text for permanent code backup
  exportCatalogJson(): string {
    return JSON.stringify(
      {
        channelId: CHURCH_INFO.youtubeChannelId,
        channelUrl: CHURCH_INFO.socials.youtube,
        exportedAt: new Date().toISOString(),
        playlists: this.getPlaylists(),
        videos: this.getVideos(),
      },
      null,
      2
    );
  }
};
