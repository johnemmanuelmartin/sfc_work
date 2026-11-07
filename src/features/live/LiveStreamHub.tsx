import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { CHURCH_INFO } from '../../data/churchData';
import { VideoItem, PlaylistDef } from '../../types';
import { videoService } from '../../services/videoService';
import { Play, Search, Calendar, User, Clock, Share2, Check, Youtube, Radio, BookOpen } from 'lucide-react';
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

  // Sync on mount or when returning
  useEffect(() => {
    setVideos(videoService.getVideos());
    setPlaylists(videoService.getPlaylists());
    setLiveState(videoService.getLiveBroadcastState());
  }, []);

  const filteredVideos = videos.filter((v) => {
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const titleToSearch = language === 'en' ? v.title : (v.titleTe || v.title);
    const speakerToSearch = language === 'en' ? v.speaker : (v.speakerTe || v.speaker);
    const descToSearch = language === 'en' ? v.description : (v.descriptionTe || v.description);

    const matchesQuery = searchQuery === '' || 
      titleToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speakerToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descToSearch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

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

  const iframeSrc = selectedVideo.youtubeId === 'live_stream'
    ? `https://www.youtube.com/embed/live_stream?channel=${CHURCH_INFO.youtubeChannelId}`
    : `https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=0&rel=0`;

  const externalVideoUrl = selectedVideo.youtubeId === 'live_stream'
    ? `https://youtube.com/channel/${CHURCH_INFO.youtubeChannelId}/live`
    : `https://youtube.com/watch?v=${selectedVideo.youtubeId}`;

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
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>

          {/* Player Metadata Bar */}
          <div className="p-6 md:p-8 bg-sacred-espresso border-t border-stone-800 text-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 bg-stone-800 text-sacred-gold border border-stone-700 text-[10px] font-bold uppercase tracking-wider">
                  {selectedVideo.category.replace('_', ' ')}
                </span>
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
            
            {/* Category / Playlist Tabs (Including Custom Playlists) */}
            <div className="flex flex-wrap gap-1.5">
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => setSelectedCategory(pl.id)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors ${
                    selectedCategory === pl.id
                      ? 'bg-stone-900 text-sacred-gold border-stone-700 dark:bg-stone-800 dark:text-sacred-gold shadow-sharp-sm'
                      : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-500'
                  }`}
                >
                  {language === 'te' ? pl.nameTe : pl.nameEn}
                </button>
              ))}
            </div>

            {/* Search Controls */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.live.searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-500 focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>
        </div>

        {/* Empty Category Notice (When Playlists are being prepared) */}
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
        ) : (
          /* Video Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const isPlaying = selectedVideo.id === video.id;
              const videoTitle = language === 'en' ? video.title : (video.titleTe || video.title);
              const videoSpeaker = language === 'en' ? video.speaker : (video.speakerTe || video.speaker);
              const videoDate = language === 'en' ? video.date : (video.dateTe || video.date);

              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video);
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className={`group cursor-pointer bg-white dark:bg-stone-900 border-2 transition-all duration-150 flex flex-col justify-between shadow-sharp-sm ${
                    isPlaying 
                      ? 'border-stone-900 dark:border-sacred-gold shadow-sharp' 
                      : 'border-stone-300 dark:border-stone-800 hover:border-stone-600'
                  }`}
                >
                  {/* Thumbnail facade */}
                  <div className="relative aspect-video bg-stone-950 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
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
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 font-mono text-[10px] text-stone-200">
                      {video.duration}
                    </span>
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-sacred-gold text-[10px] font-bold uppercase tracking-wider">
                      {video.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display font-bold text-sm uppercase leading-snug line-clamp-2 text-stone-900 dark:text-white group-hover:text-sacred-gold transition-colors mb-2">
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
                      <span className="font-medium text-stone-700 dark:text-stone-300">{videoSpeaker}</span>
                      <span>{videoDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
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
