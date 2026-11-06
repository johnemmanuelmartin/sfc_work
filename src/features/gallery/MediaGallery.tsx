import React, { useState } from 'react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { GALLERY_PHOTOS } from '../../data/churchData';
import { GalleryPhoto } from '../../types';
import { X, ZoomIn } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MediaGallery: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelEn: 'All Photographs', labelTe: 'అన్ని ఫోటోలు' },
    { id: 'Worship', labelEn: 'Sunday Worship', labelTe: 'ఆదివారపు ఆరాధన' },
    { id: 'All-Night Prayer', labelEn: 'All-Night Prayer', labelTe: 'రాత్రి ప్రార్థన' },
    { id: 'Baptism', labelEn: 'Baptism', labelTe: 'బాప్తిస్మం' },
    { id: 'Outreach', labelEn: 'Relief & Outreach', labelTe: 'సహాయ పరిచర్య' },
    { id: 'Youth', labelEn: 'Youth Fellowship', labelTe: 'యూత్ ఫెలోషిప్' },
  ];

  const filteredPhotos = GALLERY_PHOTOS.filter(
    (photo) => selectedCategory === 'all' || photo.category === selectedCategory
  );

  return (
    <section id="gallery" className="py-16 md:py-24 bg-sacred-cream dark:bg-sacred-obsidian border-b border-stone-300 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          description={t.gallery.desc}
        />

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-sacred-rust text-white border-sacred-rust shadow-sharp-sm'
                  : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-sacred-rust'
              }`}
            >
              {language === 'te' ? cat.labelTe : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => {
            const photoTitle = language === 'te' && photo.titleTe ? photo.titleTe : photo.title;
            const photoCaption = language === 'te' && photo.captionTe ? photo.captionTe : photo.caption;

            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group cursor-pointer bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 hover:border-sacred-rust shadow-sharp-sm overflow-hidden flex flex-col justify-between transition-all"
              >
                <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photoTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 bg-sacred-rust text-white border border-sacred-gold shadow-sharp-sm">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-sacred-gold text-[10px] font-bold uppercase tracking-wider">
                    {photo.category}
                  </span>
                </div>

                <div className="p-4">
                  <h4 className="font-display font-bold text-sm uppercase text-stone-900 dark:text-white group-hover:text-sacred-rust dark:group-hover:text-sacred-gold">
                    {photoTitle}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {photoCaption}
                  </p>
                  <div className="mt-3 pt-2 border-t border-stone-200 dark:border-stone-800 text-[10px] text-stone-400 flex items-center justify-between">
                    <span>{photo.date}</span>
                    <span className="text-sacred-rust dark:text-sacred-gold uppercase font-bold">{t.gallery.viewFull}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-stone-950 border-2 border-sacred-rust text-white shadow-sharp p-4 md:p-6">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-stone-900 border border-stone-700 hover:border-sacred-rust text-stone-300 hover:text-white transition-colors z-10"
              aria-label="Close photo"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] w-full bg-stone-900 overflow-hidden mb-4">
              <img
                src={selectedPhoto.imageUrl}
                alt={language === 'te' && selectedPhoto.titleTe ? selectedPhoto.titleTe : selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-stone-800 pt-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-sacred-gold tracking-widest block mb-0.5">
                  {selectedPhoto.category} • {selectedPhoto.date}
                </span>
                <h3 className="font-display text-lg font-bold uppercase">
                  {language === 'te' && selectedPhoto.titleTe ? selectedPhoto.titleTe : selectedPhoto.title}
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  {language === 'te' && selectedPhoto.captionTe ? selectedPhoto.captionTe : selectedPhoto.caption}
                </p>
              </div>

              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-sacred-rust hover:bg-[#A3360A] text-white border border-sacred-rust shadow-sharp-sm shrink-0"
              >
                {t.gallery.closePreview}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
