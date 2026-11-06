export type ServiceLanguage = 'Telugu' | 'Telugu & English' | 'English';

export interface ServiceTiming {
  day: string;
  dayTe?: string;
  time: string;
  timeTe?: string;
  language: string;
  name: string;
  nameTe?: string;
  isSpecial?: boolean;
}

export interface ChurchBranch {
  id: string;
  name: string;
  nameTe?: string;
  locality: string;
  localityTe?: string;
  city: string;
  state: string;
  address: string;
  addressTe?: string;
  landmark?: string;
  landmarkTe?: string;
  pastorInCharge: string;
  pastorInChargeTe?: string;
  pastorContact: string;
  whatsappNumber: string;
  email: string;
  languages: string[];
  services: ServiceTiming[];
  googleMapsUrl: string;
  isMainBranch?: boolean;
}

export type VideoCategory =
  | 'all'
  | 'locked_in_with_god'
  | 'sermons'
  | 'bible_study'
  | 'worship'
  | 'special'
  | 'youth'
  | string;

export interface PlaylistDef {
  id: string;
  nameEn: string;
  nameTe: string;
  youtubePlaylistId?: string;
  isCustom?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  titleTe?: string;
  teluguTitle?: string;
  youtubeId: string;
  category: VideoCategory;
  speaker: string;
  speakerTe?: string;
  date: string;
  dateTe?: string;
  duration: string;
  language: string;
  series?: string;
  seriesTe?: string;
  scriptureRef?: string;
  description: string;
  descriptionTe?: string;
  isLiveStream?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  titleTe?: string;
  subtitle: string;
  subtitleTe?: string;
  date: string;
  dateTe?: string;
  time: string;
  timeTe?: string;
  venue: string;
  venueTe?: string;
  branchArea: string;
  branchAreaTe?: string;
  category: string;
  speaker?: string;
  speakerTe?: string;
  description: string;
  descriptionTe?: string;
  badge?: string;
  badgeTe?: string;
  isUpcoming: boolean;
}

export interface Pastor {
  id: string;
  name: string;
  nameTe?: string;
  role: string;
  roleTe?: string;
  title: string;
  titleTe?: string;
  bio: string;
  bioTe?: string;
  imageUrl: string;
  branch: string;
  branchTe?: string;
  counselingDays: string;
  counselingDaysTe?: string;
  quote?: string;
  quoteTe?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  titleTe?: string;
  category: 'Worship' | 'Baptism' | 'Outreach' | 'Youth' | 'All-Night Prayer';
  imageUrl: string;
  date: string;
  caption: string;
  captionTe?: string;
}

export interface Newsletter {
  id: string;
  title: string;
  titleTe?: string;
  edition: string;
  editionTe?: string;
  monthYear: string;
  monthYearTe?: string;
  themeVerse: string;
  themeVerseTe?: string;
  pdfUrl?: string;
  summary: string;
  summaryTe?: string;
  topics: string[];
  topicsTe?: string[];
}
