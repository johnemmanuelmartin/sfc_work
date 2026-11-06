import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { VideoItem, PlaylistDef } from '../types';
import { videoService } from '../services/videoService';
import { CHURCH_INFO, LEADERSHIP_TEAM } from '../data/churchData';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  RotateCcw, 
  Check, 
  Radio, 
  Youtube, 
  ListPlus, 
  Search,
  User,
  Tag
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>(() => videoService.getVideos());
  const [playlists, setPlaylists] = useState<PlaylistDef[]>(() => videoService.getPlaylists());
  const [featuredId, setFeaturedId] = useState<string>(() => videoService.getFeaturedVideo().id);

  const [searchQuery, setSearchQuery] = useState('');
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [isNewVideoModalOpen, setIsNewVideoModalOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New video form
  const [videoForm, setVideoForm] = useState<Partial<VideoItem>>({
    title: '',
    titleTe: '',
    youtubeId: '',
    category: 'all',
    speaker: 'Pastor P. David Paul',
    speakerTe: 'పాస్టర్ పి. డేవిడ్ పాల్',
    series: 'LOCKED - IN WITH GOD',
    scriptureRef: '',
    duration: '45 mins',
    date: 'Recent Stream',
    description: '',
  });

  // New playlist form
  const [playlistForm, setPlaylistForm] = useState({
    id: '',
    nameEn: '',
    nameTe: '',
    youtubePlaylistId: '',
  });

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.youtubeId) return;

    // Extract 11-char YouTube ID if a full link was pasted
    let cleanId = videoForm.youtubeId.trim();
    if (cleanId.includes('watch?v=')) {
      cleanId = cleanId.split('watch?v=')[1].split('&')[0];
    } else if (cleanId.includes('youtu.be/')) {
      cleanId = cleanId.split('youtu.be/')[1].split('?')[0];
    }

    if (editingVideo) {
      const updated: VideoItem = {
        ...editingVideo,
        ...videoForm,
        youtubeId: cleanId,
        id: editingVideo.id,
      } as VideoItem;
      const newList = videoService.updateVideo(updated);
      setVideos(newList);
      showStatus('Video metadata updated successfully!');
      setEditingVideo(null);
    } else {
      const newVideo: VideoItem = {
        id: `vid-${Date.now()}`,
        title: videoForm.title,
        titleTe: videoForm.titleTe || videoForm.title,
        youtubeId: cleanId,
        category: videoForm.category || 'all',
        speaker: videoForm.speaker || 'Pastor P. David Paul',
        speakerTe: videoForm.speakerTe || 'పాస్టర్ పి. డేవిడ్ పాల్',
        series: videoForm.series || 'Sunday Liturgy',
        scriptureRef: videoForm.scriptureRef || '',
        duration: videoForm.duration || '45 mins',
        date: videoForm.date || 'Recent Stream',
        language: 'Telugu',
        description: videoForm.description || '',
      };
      const newList = videoService.addVideo(newVideo);
      setVideos(newList);
      showStatus('New video added to catalog!');
      setIsNewVideoModalOpen(false);
    }

    // Reset form
    setVideoForm({
      title: '',
      titleTe: '',
      youtubeId: '',
      category: 'all',
      speaker: 'Pastor P. David Paul',
      speakerTe: 'పాస్టర్ పి. డేవిడ్ పాల్',
      series: 'LOCKED - IN WITH GOD',
      scriptureRef: '',
      duration: '45 mins',
      date: 'Recent Stream',
      description: '',
    });
  };

  const handleDeleteVideo = (id: string) => {
    if (window.confirm('Are you sure you want to remove this video from the website catalog?')) {
      const updated = videoService.deleteVideo(id);
      setVideos(updated);
      showStatus('Video removed from catalog.');
    }
  };

  const handleSetFeatured = (video: VideoItem) => {
    videoService.setFeaturedVideo(video.id);
    setFeaturedId(video.id);
    showStatus(`"${video.title}" set as active livestream spotlight!`);
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistForm.nameEn) return;

    const id = playlistForm.id.trim() || playlistForm.nameEn.toLowerCase().replace(/\s+/g, '_');
    const newPl: PlaylistDef = {
      id,
      nameEn: playlistForm.nameEn,
      nameTe: playlistForm.nameTe || playlistForm.nameEn,
      youtubePlaylistId: playlistForm.youtubePlaylistId,
      isCustom: true,
    };

    const updated = videoService.addPlaylist(newPl);
    setPlaylists(updated);
    setIsPlaylistModalOpen(false);
    setPlaylistForm({ id: '', nameEn: '', nameTe: '', youtubePlaylistId: '' });
    showStatus(`Playlist "${newPl.nameEn}" created!`);
  };

  const handleExportJson = () => {
    const json = videoService.exportCatalogJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sfc-video-catalog-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('Catalog exported to JSON file!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all video tags and playlists to original factory defaults?')) {
      videoService.resetToDefaults();
      setVideos(videoService.getVideos());
      setPlaylists(videoService.getPlaylists());
      setFeaturedId(videoService.getFeaturedVideo().id);
      showStatus('Catalog reset to defaults.');
    }
  };

  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.series && v.series.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (v.scriptureRef && v.scriptureRef.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="py-12 md:py-20 bg-sacred-cream dark:bg-sacred-obsidian min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow="Media Administration & Catalog Manager"
          title="YouTube Video & Metadata Admin Center"
          description="Manage sermon metadata (Pastors, Topics, Scripture References), assign playlists, and set the active live stream for Salem Fellowship Church."
        />

        {/* Channel Info & Quick Actions Bar */}
        <div className="mb-8 p-6 bg-stone-900 border-2 border-stone-800 shadow-sharp text-stone-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-500" />
              <span className="font-display font-bold uppercase text-white tracking-wider text-base">
                Salem Fellowship Church Channel
              </span>
            </div>
            <p className="text-xs font-mono text-stone-400">
              Channel ID: <span className="text-sacred-gold">{CHURCH_INFO.youtubeChannelId}</span> • Handle: <span className="text-stone-300">@salemfellowshipchurch</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingVideo(null);
                setIsNewVideoModalOpen(true);
              }}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Video</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPlaylistModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <ListPlus className="w-4 h-4 text-sacred-gold" />
              <span>Add Custom Playlist</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="flex items-center gap-1.5 border-stone-700 text-stone-300"
              title="Download backup JSON"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 border-stone-700 text-stone-400 hover:text-red-400"
              title="Restore factory default videos"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* Status Notification Toast */}
        {statusMessage && (
          <div className="mb-6 p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Playlists Overview */}
        <div className="mb-8 p-5 bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 shadow-sharp-sm">
          <span className="text-[11px] uppercase font-bold tracking-wider text-stone-400 block mb-2">
            Active Playlist Tabs ({playlists.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {playlists.map((pl) => (
              <span
                key={pl.id}
                className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 text-xs font-medium flex items-center gap-1.5"
              >
                <Tag className="w-3 h-3 text-sacred-gold" />
                <span>{pl.nameEn} ({pl.nameTe})</span>
                {pl.id === 'locked_in_with_god' && (
                  <span className="px-1.5 py-0.2 bg-sacred-gold text-stone-950 text-[9px] font-black uppercase">
                    Active Series
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Search & Video Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display font-bold uppercase text-lg text-stone-900 dark:text-white">
              Video Catalog ({filtered.length})
            </h3>
            <div className="relative w-64 sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search by title, speaker, series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 shadow-sharp-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 dark:bg-stone-950 text-stone-700 dark:text-stone-300 uppercase font-bold tracking-wider border-b border-stone-300 dark:border-stone-800">
                <tr>
                  <th className="p-3 w-16">Preview</th>
                  <th className="p-3">Title & Scripture</th>
                  <th className="p-3">Speaker / Pastor</th>
                  <th className="p-3">Playlist / Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {filtered.map((video) => {
                  const isFeatured = featuredId === video.id;

                  return (
                    <tr key={video.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="p-3">
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/default.jpg`}
                          alt=""
                          className="w-14 h-10 object-cover bg-black border border-stone-700"
                        />
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-stone-900 dark:text-white block">
                          {video.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500 font-mono">
                          <span>ID: {video.youtubeId}</span>
                          {video.scriptureRef && (
                            <span className="text-sacred-gold font-serif italic">
                              • {video.scriptureRef}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3 text-stone-700 dark:text-stone-300 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>{video.speaker}</span>
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-[10px] font-bold uppercase text-stone-800 dark:text-sacred-gold">
                          {video.category.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {isFeatured ? (
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-bold uppercase flex items-center gap-1 w-max">
                            <Radio className="w-3 h-3 text-emerald-400" />
                            <span>Spotlight Live</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetFeatured(video)}
                            className="text-[10px] text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 uppercase font-semibold underline"
                          >
                            Set Spotlight
                          </button>
                        )}
                      </td>

                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingVideo(video);
                              setVideoForm({ ...video });
                            }}
                            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
                            title="Edit metadata"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="p-1.5 hover:bg-red-950 hover:text-red-400 text-stone-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL: ADD / EDIT VIDEO METADATA */}
      {(isNewVideoModalOpen || editingVideo) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsNewVideoModalOpen(false);
            setEditingVideo(null);
          }}
          title={editingVideo ? `Edit Video: ${editingVideo.title}` : 'Add New Video to Catalog'}
          subtitle="Enrich with Pastor, Series, Scripture, and Playlist metadata"
        >
          <form onSubmit={handleSaveVideo} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                YouTube Video URL or Video ID *
              </label>
              <input
                type="text"
                required
                value={videoForm.youtubeId || ''}
                onChange={(e) => setVideoForm({ ...videoForm, youtubeId: e.target.value })}
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  English Title *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title || ''}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. LOCKED - IN WITH GOD | Session 16"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Telugu Title
                </label>
                <input
                  type="text"
                  value={videoForm.titleTe || ''}
                  onChange={(e) => setVideoForm({ ...videoForm, titleTe: e.target.value })}
                  placeholder="e.g. లాక్డ్ - ఇన్ విత్ గాడ్ | సెషన్ 16"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Speaker / Pastor
                </label>
                <select
                  value={videoForm.speaker || ''}
                  onChange={(e) => {
                    const sp = e.target.value;
                    const pastor = LEADERSHIP_TEAM.find((p) => p.name === sp);
                    setVideoForm({
                      ...videoForm,
                      speaker: sp,
                      speakerTe: pastor?.nameTe || sp,
                    });
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
                >
                  {LEADERSHIP_TEAM.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.role})
                    </option>
                  ))}
                  <option value="SFC Worship Team">SFC Worship Team</option>
                  <option value="Guest Minister">Guest Minister</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Playlist / Category
                </label>
                <select
                  value={videoForm.category || 'all'}
                  onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
                >
                  {playlists.map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Series / Topic
                </label>
                <input
                  type="text"
                  value={videoForm.series || ''}
                  onChange={(e) => setVideoForm({ ...videoForm, series: e.target.value })}
                  placeholder="e.g. LOCKED - IN WITH GOD"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Scripture Reading
                </label>
                <input
                  type="text"
                  value={videoForm.scriptureRef || ''}
                  onChange={(e) => setVideoForm({ ...videoForm, scriptureRef: e.target.value })}
                  placeholder="e.g. Psalm 91:1-16 or Romans 8:28"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500 font-serif"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Approx Duration
                </label>
                <input
                  type="text"
                  value={videoForm.duration || ''}
                  onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                  placeholder="e.g. 45 mins"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Service Date / Period
                </label>
                <input
                  type="text"
                  value={videoForm.date || ''}
                  onChange={(e) => setVideoForm({ ...videoForm, date: e.target.value })}
                  placeholder="e.g. Online Devotional Series"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Brief Description / Summary
              </label>
              <textarea
                rows={2}
                value={videoForm.description || ''}
                onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                placeholder="Key sermon outline or summary..."
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-stone-200 dark:border-stone-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsNewVideoModalOpen(false);
                  setEditingVideo(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Video Metadata
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: ADD CUSTOM PLAYLIST */}
      {isPlaylistModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPlaylistModalOpen(false)}
          title="Create Custom Playlist"
          subtitle="Add a custom category tab to group church sermons and videos"
        >
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Playlist Name (English) *
              </label>
              <input
                type="text"
                required
                value={playlistForm.nameEn}
                onChange={(e) => setPlaylistForm({ ...playlistForm, nameEn: e.target.value })}
                placeholder="e.g. Youth Camp 2026 or Special Conventions"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Playlist Name (Telugu)
              </label>
              <input
                type="text"
                value={playlistForm.nameTe}
                onChange={(e) => setPlaylistForm({ ...playlistForm, nameTe: e.target.value })}
                placeholder="e.g. యూత్ క్యాంప్ 2026"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                YouTube Playlist ID (Optional)
              </label>
              <input
                type="text"
                value={playlistForm.youtubePlaylistId}
                onChange={(e) => setPlaylistForm({ ...playlistForm, youtubePlaylistId: e.target.value })}
                placeholder="e.g. PLxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-stone-500"
              />
              <span className="text-[10px] text-stone-500 block mt-1">
                Can be obtained from the URL of your playlist on YouTube: `youtube.com/playlist?list=PL...`
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-stone-200 dark:border-stone-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsPlaylistModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Create Playlist
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
