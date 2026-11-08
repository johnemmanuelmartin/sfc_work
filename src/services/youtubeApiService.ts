import { CHURCH_INFO } from '../data/churchData';
import { VideoItem } from '../types';

const STORAGE_KEY_API_KEY = 'sfc_youtube_api_key';
const LIVE_CHECK_CACHE_KEY = 'sfc_yt_live_check_cache';
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes cache to conserve API quota

export interface LiveCheckResult {
  isLive: boolean;
  videoId?: string;
  title?: string;
  description?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
}

export interface YouTubePlaylistInfo {
  id: string; // YouTube Playlist ID (PL...)
  title: string;
  description: string;
  itemCount: number;
}

export const youtubeApiService = {
  // Retrieve the configured Google Cloud YouTube Data API v3 key
  getApiKey(): string {
    if (typeof window === 'undefined') return '';
    const stored = localStorage.getItem(STORAGE_KEY_API_KEY);
    if (stored && stored.trim()) return stored.trim();
    const envKey = (import.meta as any).env?.VITE_YOUTUBE_API_KEY;
    if (typeof envKey === 'string' && envKey.trim()) return envKey.trim();
    return '';
  },

  // Save the YouTube Data API key (from /admin or settings)
  saveApiKey(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  },

  // Whether a key is currently configured
  hasApiKey(): boolean {
    return Boolean(this.getApiKey());
  },

  /**
   * Check if the channel is currently live-streaming via Google Cloud YouTube Data API v3
   * Endpoint: /search?part=snippet&channelId=...&eventType=live&type=video
   * Quota: 100 units per search call (cached for 3 minutes)
   */
  async checkIsChannelLive(forceBypassCache = false): Promise<LiveCheckResult> {
    const key = this.getApiKey();
    if (!key) {
      return { isLive: false };
    }

    // Check cached result to prevent quota exhaustion on frequent refreshes
    if (!forceBypassCache && typeof sessionStorage !== 'undefined') {
      try {
        const cachedRaw = sessionStorage.getItem(LIVE_CHECK_CACHE_KEY);
        if (cachedRaw) {
          const parsed = JSON.parse(cachedRaw);
          if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            return parsed.data;
          }
        }
      } catch (e) {
        // Cache read failure, proceed with network call
      }
    }

    try {
      const channelId = CHURCH_INFO.youtubeChannelId;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${key}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.warn('[YouTube Data API v3] Live check failed:', response.status, errorBody);
        return { isLive: false };
      }

      const data = await response.json();
      const items = data.items || [];

      let result: LiveCheckResult = { isLive: false };

      if (items.length > 0) {
        const item = items[0];
        result = {
          isLive: true,
          videoId: item.id?.videoId,
          title: item.snippet?.title || 'SUNDAY SERVICE | SALEM FELLOWSHIP | LIVE BROADCAST',
          description: item.snippet?.description || 'Salem Fellowship Church Live Broadcast',
          publishedAt: item.snippet?.publishedAt,
          thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url
        };
      }

      // Cache the result
      if (typeof sessionStorage !== 'undefined') {
        try {
          sessionStorage.setItem(LIVE_CHECK_CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: result
          }));
        } catch (e) {
          // Ignore cache write failure
        }
      }

      return result;
    } catch (err) {
      console.warn('[YouTube Data API v3] Network error checking live status:', err);
      return { isLive: false };
    }
  },

  /**
   * Fetch all official playlists created on the channel
   * Endpoint: /playlists?part=snippet,contentDetails&channelId=...
   * Quota: Only 1 unit!
   */
  async fetchChannelPlaylists(): Promise<YouTubePlaylistInfo[]> {
    const key = this.getApiKey();
    if (!key) return [];

    try {
      const channelId = CHURCH_INFO.youtubeChannelId;
      const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${key}`;

      const res = await fetch(url);
      if (!res.ok) return [];

      const data = await res.json();
      const items = data.items || [];

      return items.map((it: any) => ({
        id: it.id,
        title: it.snippet?.title || '',
        description: it.snippet?.description || '',
        itemCount: it.contentDetails?.itemCount || 0
      }));
    } catch (e) {
      console.warn('[YouTube Data API v3] Failed to fetch channel playlists:', e);
      return [];
    }
  },

  /**
   * Fetch videos from a specific YouTube Playlist
   * Endpoint: /playlistItems?part=snippet&playlistId=...
   * Quota: Only 1 unit!
   */
  async fetchPlaylistVideos(playlistId: string, maxResults = 9): Promise<VideoItem[]> {
    const key = this.getApiKey();
    if (!key || !playlistId) return [];

    try {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${key}`;

      const res = await fetch(url);
      if (!res.ok) return [];

      const data = await res.json();
      const items = data.items || [];

      return items
        .filter((it: any) => it.snippet?.resourceId?.videoId && it.snippet?.title !== 'Private video')
        .map((it: any, index: number) => {
          const snippet = it.snippet;
          const videoId = snippet.resourceId.videoId;
          const pubDate = snippet.publishedAt ? new Date(snippet.publishedAt) : new Date();
          const dateStr = pubDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

          return {
            id: `yt-pl-${playlistId}-${videoId}-${index}`,
            title: snippet.title || 'Church Service',
            titleTe: snippet.title || 'సజీవ పరిచర్య',
            youtubeId: videoId,
            category: 'playlist_item',
            speaker: 'Pastor P. David Paul',
            speakerTe: 'పాస్టర్ పి. డేవిడ్ పాల్',
            date: dateStr,
            dateTe: dateStr,
            duration: '45 mins',
            language: 'Telugu',
            series: snippet.title.includes('LOCKED') ? 'Locked - In With God' : 'Sermon Series',
            seriesTe: snippet.title.includes('LOCKED') ? 'లాక్డ్ - ఇన్ విత్ గాడ్' : 'వాక్య శ్రేణి',
            description: snippet.description || 'Salem Fellowship Church sermon recording.',
            descriptionTe: 'సేలెం ఫెలోషిప్ చర్చి దైవ వాక్య సందేశం.'
          } as VideoItem;
        });
    } catch (e) {
      console.warn('[YouTube Data API v3] Failed to fetch playlist items:', e);
      return [];
    }
  },

  /**
   * Fetch the latest uploaded videos directly from the Channel's Uploads playlist
   * Quota: Only 1 unit!
   */
  async fetchChannelUploads(maxResults = 15): Promise<VideoItem[]> {
    const key = this.getApiKey();
    if (!key) return [];

    try {
      // YouTube Channel Uploads playlist is always 'UU' + channelId without 'UC'
      const uploadsPlaylistId = CHURCH_INFO.youtubeChannelId.replace(/^UC/, 'UU');
      return await this.fetchPlaylistVideos(uploadsPlaylistId, maxResults);
    } catch (e) {
      console.warn('[YouTube Data API v3] Failed to fetch channel uploads:', e);
      return [];
    }
  }
};
