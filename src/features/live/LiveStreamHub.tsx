import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { CHURCH_INFO } from '../../data/churchData';
import { VideoItem, PlaylistDef } from '../../types';
import { videoService } from '../../services/videoService';
import { 
  Play, 
  Search, 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Check, 
  Youtube, 
  Radio, 
  BookOpen, 
  List, 
  LayoutGrid, 
  ChevronDown 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TRANSLATIONS } from '../../data/translations';

export const LiveStreamHub: React.FC = () => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const [videos, setVideos] = useState<VideoItem[]>(() => videoService.getVideos());
  const [playlists, setPlaylists] = useState<PlaylistDef[]>(() => videoService.getPlaylists());
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(() => videoService.getFeaturedVideo());
  const [liveState, setLiveState] = useState(() => videoService.getLiveBroadcastState());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Mobile-responsive display controls
  const [viewMode, setViewMode] = useState<'compact' | 'grid'>('grid');
  const [mobileExpanded, setMobileExpanded] = useState<boolean>(false);

  // Sync latest catalog & auto-detect live broadcast on mount
  useEffect(() => {
    const localVideos = videoService.getVideos();
    const currentLiveState = videoService.getLiveBroadcastState();
    setVideos(localVideos);
    setPlaylists(videoService.getPlaylists());
    setLiveState(currentLiveState);

    // If currently broadcasting live, set the live stream as the default player video
    if (currentLiveState.isLive) {
      const liveItem = (currentLiveState.liveVideoId && currentLiveState.liveVideoId !== 'live_stream')
        ? localVideos.find(v => v.youtubeId === currentLiveState.liveVideoId)
        : null;

      setSelectedVideo(liveItem || {
        id: 'active-live-stream',
        title: currentLiveState.customLiveTitle || 'SUNDAY SERVICE | SALEM FELLOWSHIP | LIVE BROADCAST',
        titleTe: 'సేలెం ఫెలోషిప్ చర్చి — ప్రత్యక్ష ప్రసారం',
        youtubeId: currentLiveState.liveVideoId || 'live_stream',
        category: 'sermons',
        speaker: 'Pastor P. David Paul',
        speakerTe: 'పాస్టర్ పి. డేవిడ్ పాల్',
        date: 'LIVE NOW',
        dateTe: 'ప్రత్యక్ష ప్రసారం',
        duration: 'LIVE',
        language: 'Telugu',
        isLiveStream: true,
        description: 'Live broadcast from Salem Fellowship Church Kalyan Nagar Main Branch. Join us in worship, prayer, and God\'s Word.',
        descriptionTe: 'కళ్యాణ్ నగర్ ప్రధాన మందిరము నుండి ప్రత్యక్ష ప్రసారం.'
      });
    } else {
      setSelectedVideo(videoService.getFeaturedVideo());
    }

    // Background sync with YouTube feed to fetch fresh sermon catalog
    videoService.syncLatestVideos().then(({ videos: syncedVideos, isLive, liveVideo }) => {
      setVideos(syncedVideos);
      if (isLive) {
        setLiveState(prev => ({ ...prev, isLive: true }));
        if (liveVideo) {
          setSelectedVideo(liveVideo);
        }
      }
    });

    // Detect screen width on client to default mobile to compact list view
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setViewMode('compact');
    }
  }, []);

  // Ensure active category is never 'live_now' if church is offline
  useEffect(() => {
    if (!liveState.isLive && selectedCategory === 'live_now') {
      setSelectedCategory('all');
    }
  }, [liveState.isLive, selectedCategory]);

  // When active live stream is present, synthesize dedicated live video item
  const activeLiveItem: VideoItem | null = liveState.isLive
    ? {
        id: 'live-now-active',
        title: liveState.customLiveTitle || (videos[0]?.title.includes('SUNDAY') ? videos[0].title : 'SUNDAY SERVICE | SALEM FELLOWSHIP | LIVE BROADCAST'),
        titleTe: 'సేలెం ఫెలోషిప్ చర్చి — ప్రత్యక్ష ప్రసారం',
        youtubeId: liveState.liveVideoId || (videos[0]?.youtubeId || 'live_stream'),
        category: 'sermons',
        speaker: 'Pastor P. David Paul',
        speakerTe: 'పాస్టర్ పి. డేవిడ్ పాల్',
        date: 'LIVE NOW',
        dateTe: 'ప్రత్యక్ష ప్రసారం',
        duration: 'LIVE',
        language: 'Telugu',
        isLiveStream: true,
        description: 'Live broadcast from Salem Fellowship Church Kalyan Nagar Main Branch.',
        descriptionTe: 'కళ్యాణ్ నగర్ ప్రధాన మందిరము నుండి ప్రత్యక్ష ప్రసారం.'
      }
    : null;

  // Filter videos according to user-selected tab
  let categorizedVideos: VideoItem[] = [];

  if (selectedCategory === 'live_now') {
    // Live Now: Show active live stream first, plus recent live services
    const liveList = activeLiveItem ? [activeLiveItem] : [];
    const pastLive = videos.filter(v => 
      v.isLiveStream || 
      v.category === 'sermons' || 
      v.title.toUpperCase().includes('SUNDAY') ||
      v.title.toUpperCase().includes('BIBLE STUDY')
    );
    const filteredPast = activeLiveItem && activeLiveItem.youtubeId !== 'live_stream'
      ? pastLive.filter(v => v.youtubeId !== activeLiveItem.youtubeId)
      : pastLive;
    categorizedVideos = [...liveList, ...filteredPast];
  } else if (selectedCategory === 'all') {
    // All Videos: Any live stream at the very top, followed by 15 videos by date/time
    const base = activeLiveItem ? [activeLiveItem] : [];
    const rest = activeLiveItem && activeLiveItem.youtubeId !== 'live_stream'
      ? videos.filter(v => v.youtubeId !== activeLiveItem.youtubeId)
      : videos;
    categorizedVideos = [...base, ...rest];
  } else if (selectedCategory === 'sermons') {
    // Sunday Sermons: Live video if active, then Sunday sermons sorted by date
    const sundayMatches = videos.filter(v => v.category === 'sermons' || v.title.toUpperCase().includes('SUNDAY'));
    if (activeLiveItem && (liveState.broadcastType === 'sunday' || activeLiveItem.category === 'sermons')) {
      const filteredSunday = activeLiveItem.youtubeId !== 'live_stream'
        ? sundayMatches.filter(v => v.youtubeId !== activeLiveItem.youtubeId)
        : sundayMatches;
      categorizedVideos = [activeLiveItem, ...filteredSunday];
    } else {
      categorizedVideos = sundayMatches;
    }
  } else if (selectedCategory === 'bible_study') {
    // Bible Study: Live video if active, then all Bible Study sessions
    const bibleMatches = videos.filter(v => 
      v.category === 'bible_study' || 
      v.title.toUpperCase().includes('BIBLE STUDY') || 
      v.title.toUpperCase().includes('HOSEA')
    );
    if (activeLiveItem && (liveState.broadcastType === 'bible_study' || activeLiveItem.category === 'bible_study')) {
      const filteredBible = activeLiveItem.youtubeId !== 'live_stream'
        ? bibleMatches.filter(v => v.youtubeId !== activeLiveItem.youtubeId)
        : bibleMatches;
      categorizedVideos = [activeLiveItem, ...filteredBible];
    } else {
      categorizedVideos = bibleMatches;
    }
  } else {
    // Other playlists (locked_in_with_god, worship, special, youth, custom)
    categorizedVideos = videos.filter(v => v.category === selectedCategory);
  }

  // Search filtering
  const searchFiltered = categorizedVideos.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = (language === 'en' ? v.title : (v.titleTe || v.title)).toLowerCase();
    const speaker = (language === 'en' ? v.speaker : (v.speakerTe || v.speaker)).toLowerCase();
    const desc = (language === 'en' ? v.description : (v.descriptionTe || v.description)).toLowerCase();
    return title.includes(q) || speaker.includes(q) || desc.includes(q);
  });

  // Limits: 15 for 'all', 9 for all other playlists (Requirement 4 & 8)
  const maxLimit = selectedCategory === 'all' ? 15 : 9;
  const filteredVideos = searchFiltered.slice(0, maxLimit);

  // Mobile slice (show 6 initial unless expanded or in grid mode)
  const mobileDisplayLimit = (!mobileExpanded && filteredVideos.length > 6) ? 6 : filteredVideos.length;
  const displayedVideos = filteredVideos.slice(0, mobileDisplayLimit);
  const hiddenOnMobileCount = filteredVideos.length - displayedVideos.length;

  const handleShare = (video: VideoItem) => {
    const url = video.youtubeId === 'live_stream'
      ? `https://youtube.com/channel/${CHURCH_INFO.youtubeChannelId}/live`
      : `https://youtube.com/watch?v=${video.youtubeId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentTitle = language === 'en' ? selectedVideo.title : (selectedVideo.titleTe || selectedVideo.title);
  const currentDesc = language === 'en' ? selectedVideo.description : (selectedVideo.descriptionTe || selectedVideo.description);
  const currentSpeaker = language === 'en' ? selectedVideo.speaker : (selectedVideo.speakerTe || selectedVideo.speaker);
  const currentSeries = language === 'en' ? selectedVideo.series : (selectedVideo.seriesTe || selectedVideo.series);
  const currentDate = language === 'en' ? selectedVideo.date : (selectedVideo.dateTe || selectedVideo.date);

  const activeVideoId = (liveState.isLive && liveState.liveVideoId && selectedVideo.id === 'active-live-stream')
    ? liveState.liveVideoId
    : selectedVideo.youtubeId;

  const iframeSrc = activeVideoId === 'live_stream'
    ? `https://www.youtube.com/embed/live_stream?channel=${CHURCH_INFO.youtubeChannelId}`
    : `https://www.youtube.com/embed/${activeVideoId}?autoplay=0&rel=0`;

  const externalVideoUrl = activeVideoId === 'live_stream'
    ? `https://youtube.com/channel/${CHURCH_INFO.youtubeChannelId}/live`
    : `https://youtube.com/watch?v=${activeVideoId}`;

  return (
    <section id="live" className="py-16 md:py-24 bg-sacred-cream dark:bg-sacred-obsidian border-b border-stone-300 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={t.live.eyebrow}
          title={t.live.title}
          description={t.live.desc}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://www.youtube.com/@salemfellowshipchurch/live"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sharp-sm"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>{language === 'en' ? 'Watch Live on YouTube' : 'యూట్యూబ్‌లో లైవ్'}</span>
              </a>
              <a
                href={CHURCH_INFO.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 border border-stone-700 hover:border-stone-500 text-stone-200 font-bold text-xs uppercase tracking-wider transition-colors shadow-sharp-sm"
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>@salemfellowshipchurch</span>
              </a>
            </div>
          }
        />

        {/* Live Broadcast / Service Status Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900 border-x-2 border-t-2 border-stone-800 text-xs">
          <div className="flex items-center gap-2">
            {liveState.isLive ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-bold text-red-400 uppercase tracking-wider text-[11px]">
                  {language === 'en' ? 'LIVE NOW — SUNDAY SERVICE BROADCAST' : 'ప్రత్యక్ష ప్రసారం — ఆదివారపు సజీవ ఆరాధన'}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-sacred-gold"></span>
                <span className="font-bold text-stone-200 uppercase tracking-wider text-[11px]">
                  {language === 'en' ? 'FEATURED SERVICE / SERMON' : 'ప్రత్యేక వాక్య సందేశం'}
                </span>
                <span className="text-stone-600 hidden sm:inline">•</span>
                <span className="text-stone-400 hidden sm:inline text-[11px]">
                  {language === 'en' ? 'Live Services: Every Sunday 10:00 AM – 01:00 PM (All Branches)' : 'ప్రత్యక్ష ప్రసారం: ప్రతి ఆదివారం ఉదయం 10:00 – మధ్యాహ్నం 1:00'}
                </span>
              </>
            )}
          </div>
          <a
            href="https://www.youtube.com/@salemfellowshipchurch/live"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sacred-gold hover:underline font-bold text-[11px] uppercase tracking-wider"
          >
            <span>{language === 'en' ? 'Open Live Channel' : 'లైవ్ ఛానెల్'}</span>
            <Youtube className="w-3.5 h-3.5 text-red-500" />
          </a>
        </div>

        {/* Featured Video / Main Interactive Player */}
        <div className="mb-14 bg-stone-950 border-x-2 border-b-2 border-stone-800 shadow-sharp overflow-hidden">
          <div className="relative aspect-video w-full bg-stone-950">
            <iframe
              src={iframeSrc}
              title={currentTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="w-full h-full border-0"
            ></iframe>
          </div>

          {/* Player Metadata Bar */}
          <div className="p-6 md:p-8 bg-sacred-espresso border-t border-stone-800 text-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                {selectedVideo.isLiveStream && liveState.isLive ? (
                  <span className="px-2 py-0.5 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>Live Broadcast</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-stone-800 text-sacred-gold border border-stone-700 text-[10px] font-bold uppercase tracking-wider">
                    {selectedVideo.category.replace('_', ' ')}
                  </span>
                )}
                <span className="px-2 py-0.5 bg-stone-900 text-stone-300 border border-stone-700 text-[10px] font-bold uppercase">
                  Telugu (తెలుగు వాక్యము)
                </span>
                {currentSeries && (
                  <span className="text-xs text-stone-400 font-mono">
                    {language === 'en' ? 'Series' : 'అంశం'}: {currentSeries}
                  </span>
                )}
                {selectedVideo.scriptureRef && (
                  <span className="text-xs text-stone-400 font-serif italic border-l border-stone-700 pl-2">
                    <BookOpen className="w-3 h-3 inline mr-1 text-sacred-gold" />
                    {selectedVideo.scriptureRef}
                  </span>
                )}
              </div>

              <h3 className="font-display text-xl md:text-2xl font-bold uppercase text-white tracking-wide">
                {currentTitle}
              </h3>

              <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
                {currentDesc}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 pt-1">
                <span className="flex items-center gap-1.5 font-bold text-sacred-gold">
                  <User className="w-3.5 h-3.5" />
                  {currentSpeaker}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {currentDate}
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedVideo.duration}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare(selectedVideo)}
                className="flex items-center gap-1.5 border-stone-700 text-stone-300"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? t.live.linkCopied : t.live.shareVideo}</span>
              </Button>
              <a
                href={externalVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-red-700 hover:bg-red-800 text-white border border-red-600 shadow-sharp-sm flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.live.openInYoutube}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Video Archive Categorization & Search Controls */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Category / Playlist Tabs in Required Strict Order */}
            {/* Order: Live Now (strictly only when live), All Videos, Sunday Sermons, Bible Study, Any other custom playlists */}
            <div className="flex flex-wrap gap-1.5">
              {playlists
                .filter((pl) => (pl.id === 'live_now' ? liveState.isLive : true))
                .map((pl) => {
                const isSelected = selectedCategory === pl.id;
                const isLiveTab = pl.id === 'live_now';

                return (
                  <button
                    key={pl.id}
                    onClick={() => {
                      setSelectedCategory(pl.id);
                      setMobileExpanded(false);
                      // If user clicks "Live Now" tab, automatically select and play the live broadcast
                      if (isLiveTab && activeLiveItem) {
                        setSelectedVideo(activeLiveItem);
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-stone-900 text-sacred-gold border-stone-700 dark:bg-stone-800 dark:text-sacred-gold shadow-sharp-sm'
                        : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-500'
                    }`}
                  >
                    {isLiveTab && (
                      <span className={`w-2 h-2 rounded-full ${liveState.isLive ? 'bg-red-500 animate-ping' : 'bg-red-400'}`}></span>
                    )}
                    <span>{language === 'te' ? pl.nameTe : pl.nameEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Controls & View Switcher */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.live.searchPlaceholder}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-500 focus:outline-none focus:border-stone-500"
                />
              </div>

              {/* View Switcher: Compact List vs Grid View */}
              <div className="flex items-center border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  className={`p-1.5 text-xs transition-colors ${
                    viewMode === 'compact'
                      ? 'bg-stone-900 text-sacred-gold dark:bg-stone-800 shadow-sharp-sm'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                  title="Compact List View (Recommended on Mobile)"
                  aria-label="Compact List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 text-xs transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-stone-900 text-sacred-gold dark:bg-stone-800 shadow-sharp-sm'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Empty Category Notice */}
        {filteredVideos.length === 0 ? (
          <div className="p-8 bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 text-center space-y-4 shadow-sharp-sm my-6">
            <Youtube className="w-10 h-10 mx-auto text-stone-400" />
            <h4 className="font-display text-lg font-bold uppercase text-stone-900 dark:text-white">
              {language === 'en' ? 'Playlists Under Preparation' : 'ప్లేలిస్ట్‌లు సిద్ధమవుతున్నాయి'}
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
              {language === 'en'
                ? "This playlist category is currently being organized on our YouTube channel. In the meantime, you can explore all videos under the 'All Videos' tab or visit our official channel."
                : "ఈ విభాగానికి సంబంధించిన ప్లేలిస్ట్‌లు ప్రస్తుతం సిద్ధమవుతున్నాయి. 'అన్ని వీడియోలు' విభాగంలో లేదా అధికారిక యూట్యూబ్ ఛానెల్‌లో పూర్తి వీడియోలను చూడవచ్చు."}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-4 py-2 text-xs font-bold uppercase bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 border border-stone-800 shadow-sharp-sm"
              >
                {language === 'en' ? 'View All Videos' : 'అన్ని వీడియోలు చూడండి'}
              </button>
              <a
                href={CHURCH_INFO.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold uppercase border border-stone-400 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-red-600 flex items-center gap-1.5"
              >
                <Youtube className="w-3.5 h-3.5 text-red-600" />
                <span>YouTube Channel</span>
              </a>
            </div>
          </div>
        ) : viewMode === 'compact' ? (
          /* Sleek Compact List View (Drastically reduces scrolling fatigue on mobile) */
          <div className="space-y-3">
            {displayedVideos.map((video) => {
              const isPlaying = selectedVideo.id === video.id || (selectedVideo.youtubeId === video.youtubeId && video.youtubeId !== 'live_stream');
              const videoTitle = language === 'en' ? video.title : (video.titleTe || video.title);
              const videoSpeaker = language === 'en' ? video.speaker : (video.speakerTe || video.speaker);
              const videoDate = language === 'en' ? video.date : (video.dateTe || video.date);
              const isLive = liveState.isLive && (video.id === 'live-now-active' || video.id === 'active-live-stream' || video.isLiveStream);

              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video);
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className={`group cursor-pointer bg-white dark:bg-stone-900 border-2 transition-all duration-150 flex flex-row items-center gap-3.5 p-2.5 sm:p-3 shadow-sharp-sm ${
                    isPlaying 
                      ? 'border-stone-900 dark:border-sacred-gold shadow-sharp bg-stone-50 dark:bg-stone-800/60' 
                      : 'border-stone-300 dark:border-stone-800 hover:border-stone-600'
                  }`}
                >
                  {/* Thumbnail Facade */}
                  <div className="relative w-32 sm:w-44 aspect-video shrink-0 bg-stone-950 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId === 'live_stream' ? (videos[0]?.youtubeId || 'VQ8qNxk-jKk') : video.youtubeId}/mqdefault.jpg`}
                      alt={videoTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-stone-900/90 text-sacred-gold border border-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                    {isLive ? (
                      <span className="absolute top-1 left-1 px-1.5 py-0.2 bg-red-600 text-white font-bold text-[9px] uppercase tracking-wider animate-pulse">
                        LIVE
                      </span>
                    ) : (
                      <span className="absolute top-1 left-1 px-1.5 py-0.2 bg-black/85 text-sacred-gold text-[9px] font-bold uppercase tracking-wider">
                        {video.category.replace('_', ' ')}
                      </span>
                    )}
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/85 font-mono text-[9px] text-stone-200">
                      {video.duration}
                    </span>
                  </div>

                  {/* Card Content (Horizontal layout, concise & scannable) */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm uppercase leading-tight line-clamp-2 text-stone-900 dark:text-white group-hover:text-sacred-gold transition-colors">
                        {videoTitle}
                      </h4>
                      {video.scriptureRef && (
                        <p className="text-[10px] font-serif italic text-stone-500 mt-1 line-clamp-1">
                          <BookOpen className="w-2.5 h-2.5 inline mr-1 text-sacred-gold" />
                          {video.scriptureRef}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-[10px] text-stone-500 flex items-center justify-between mt-1">
                      <span className="font-medium text-stone-700 dark:text-stone-300 truncate mr-2">
                        {videoSpeaker}
                      </span>
                      <div className="flex items-center gap-1 font-mono font-medium text-sacred-gold dark:text-sacred-gold shrink-0">
                        <Calendar className="w-3 h-3 text-sacred-gold" />
                        <span>{videoDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Standard Multi-Column Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedVideos.map((video) => {
              const isPlaying = selectedVideo.id === video.id || (selectedVideo.youtubeId === video.youtubeId && video.youtubeId !== 'live_stream');
              const videoTitle = language === 'en' ? video.title : (video.titleTe || video.title);
              const videoSpeaker = language === 'en' ? video.speaker : (video.speakerTe || video.speaker);
              const videoDate = language === 'en' ? video.date : (video.dateTe || video.date);
              const isLive = liveState.isLive && (video.id === 'live-now-active' || video.id === 'active-live-stream' || video.isLiveStream);

              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video);
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className={`group cursor-pointer bg-white dark:bg-stone-900 border-2 transition-all duration-150 flex flex-col justify-between shadow-sharp-sm ${
                    isPlaying 
                      ? 'border-stone-900 dark:border-sacred-gold shadow-sharp bg-stone-50 dark:bg-stone-800/60' 
                      : 'border-stone-300 dark:border-stone-800 hover:border-stone-600'
                  }`}
                >
                  {/* Thumbnail Facade */}
                  <div className="relative aspect-video bg-stone-950 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId === 'live_stream' ? (videos[0]?.youtubeId || 'VQ8qNxk-jKk') : video.youtubeId}/mqdefault.jpg`}
                      alt={videoTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-stone-900/90 text-sacred-gold border border-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    {isLive ? (
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider border border-red-500 animate-pulse flex items-center gap-1">
                        <Radio className="w-3 h-3" />
                        <span>LIVE NOW</span>
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/85 text-sacred-gold text-[10px] font-bold uppercase tracking-wider border border-stone-800">
                        {video.category.replace('_', ' ')}
                      </span>
                    )}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-stone-950/90 text-sacred-gold border border-stone-700 font-mono text-[11px] font-bold flex items-center gap-1 shadow">
                      <Calendar className="w-3 h-3 text-sacred-gold" />
                      <span>{videoDate}</span>
                    </span>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/85 font-mono text-[10px] text-stone-200 border border-stone-800">
                      {video.duration}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display font-bold text-sm uppercase leading-snug text-stone-900 dark:text-white group-hover:text-sacred-gold transition-colors mb-2 min-h-[56px]">
                        {videoTitle}
                      </h4>
                      {video.scriptureRef && (
                        <p className="text-[11px] font-serif italic text-stone-500 mb-2">
                          <BookOpen className="w-3 h-3 inline mr-1 text-sacred-gold" />
                          {video.scriptureRef}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
                      <span className="font-medium text-stone-700 dark:text-stone-300 truncate mr-2">{videoSpeaker}</span>
                      <div className="flex items-center gap-1 font-mono font-medium text-sacred-gold dark:text-sacred-gold shrink-0">
                        <Calendar className="w-3 h-3 text-sacred-gold" />
                        <span>{videoDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile "Show More" Expander Button */}
        {hiddenOnMobileCount > 0 && !mobileExpanded && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setMobileExpanded(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-sacred-gold font-bold text-xs uppercase tracking-wider shadow-sharp-sm transition-colors"
            >
              <span>
                {language === 'en'
                  ? `Show More Sermons (${hiddenOnMobileCount} More)`
                  : `మరిన్ని వీడియోలు చూడండి (${hiddenOnMobileCount} ఉన్నాయి)`}
              </span>
              <ChevronDown className="w-4 h-4 text-sacred-gold" />
            </button>
          </div>
        )}

        {/* Official YouTube Channel CTA Banner */}
        <div className="mt-12 p-6 bg-stone-100 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-600" />
              <span>{language === 'en' ? 'Salem Fellowship Church on YouTube' : 'యూట్యూబ్‌లో సేలెం ఫెలోషిప్ చర్చి'}</span>
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              {language === 'en'
                ? "Subscribe to @salemfellowshipchurch for weekly Telugu worship services, 'LOCKED - IN WITH GOD' series, and special revival conventions."
                : "వారపు ఆరాధనలు, 'లాక్డ్ - ఇన్ విత్ గాడ్' సందేశాలు మరియు ఉజ్జీవ కూటముల కొరకు మా ఛానెల్‌ను సబ్‌స్క్రైబ్ చేసుకోండి."}
            </p>
          </div>
          <a
            href={CHURCH_INFO.socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sharp-sm flex items-center gap-1.5 shrink-0"
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Visit YouTube Channel' : 'యూట్యూబ్ ఛానెల్ సందర్శించండి'}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
