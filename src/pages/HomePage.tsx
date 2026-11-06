import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../features/home/HeroSection';
import { QuickActionGrid } from '../features/home/QuickActionGrid';
import { FEATURED_LIVESTREAM, CHURCH_BRANCHES, CHURCH_INFO } from '../data/churchData';
import { ArrowRight, Heart, Radio, Quote } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';

export const HomePage: React.FC = () => {
  const { language } = useLanguage();

  const featuredTitle = language === 'en' ? FEATURED_LIVESTREAM.title : (FEATURED_LIVESTREAM.titleTe || FEATURED_LIVESTREAM.title);
  const featuredDesc = language === 'en' ? FEATURED_LIVESTREAM.description : (FEATURED_LIVESTREAM.descriptionTe || FEATURED_LIVESTREAM.description);
  const featuredSpeaker = language === 'en' ? FEATURED_LIVESTREAM.speaker : (FEATURED_LIVESTREAM.speakerTe || FEATURED_LIVESTREAM.speaker);
  const featuredSeries = language === 'en' ? FEATURED_LIVESTREAM.series : (FEATURED_LIVESTREAM.seriesTe || FEATURED_LIVESTREAM.series);

  return (
    <div>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Quick Action Tiles */}
      <QuickActionGrid />

      {/* 3. Featured Telugu Broadcast Spotlight */}
      <section className="py-16 bg-sacred-cream dark:bg-sacred-obsidian border-b border-stone-300 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-[2px] bg-sacred-rust inline-block"></span>
                <span className="text-xs uppercase tracking-widest font-bold text-sacred-rust dark:text-sacred-gold">
                  {language === 'en' ? 'Recent Live Service Spotlight' : 'ఆదివారపు ప్రత్యక్ష ప్రసారం'}
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold uppercase text-stone-900 dark:text-stone-100">
                {language === 'en' ? 'Word & Telugu Worship' : 'వాక్యము & ఆరాధన'}
              </h2>
            </div>
            <Link to="/live">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <span>{language === 'en' ? 'View All Sermons' : 'అన్ని సందేశాలు'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="bg-stone-950 border-2 border-sacred-rust shadow-sharp overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 aspect-video bg-black relative">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${FEATURED_LIVESTREAM.youtubeId}?autoplay=0&rel=0`}
                title={featuredTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              ></iframe>
            </div>

            <div className="lg:col-span-5 p-6 md:p-8 bg-sacred-espresso text-stone-100 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider">
                    {language === 'en' ? 'Sunday 10 AM – 1 PM' : 'ఆదివారం 10 AM – 1 PM'}
                  </span>
                  <span className="px-2 py-0.5 bg-sacred-gold text-stone-950 font-bold text-[10px] uppercase">
                    Telugu
                  </span>
                </div>

                <h3 className="font-display text-lg md:text-xl font-bold uppercase text-white tracking-wide">
                  {featuredTitle}
                </h3>

                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  {featuredDesc}
                </p>

                <div className="mt-4 pt-3 border-t border-stone-800 text-xs text-stone-400 space-y-1">
                  <p><strong>{language === 'en' ? 'Speaker:' : 'వాక్య పరిచర్య:'}</strong> {featuredSpeaker}</p>
                  <p><strong>{language === 'en' ? 'Series:' : 'అంశం:'}</strong> {featuredSeries}</p>
                  <p><strong>{language === 'en' ? 'Time:' : 'సమయం:'}</strong> 10:00 AM – 01:00 PM IST</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <Link to="/live" className="flex-1">
                  <Button variant="primary" size="sm" fullWidth className="flex items-center justify-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Watch Telugu Sermons' : 'వాక్య ప్రసారాలు చూడండి'}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 6 Branches Across Hyderabad Spotlight */}
      <section className="py-16 bg-stone-100 dark:bg-sacred-espresso border-b border-stone-300 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-[2px] bg-stone-500 inline-block"></span>
                <span className="text-xs uppercase tracking-widest font-bold text-stone-600 dark:text-sacred-gold">
                  {language === 'en' ? 'Branches' : 'శాఖలు'}
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold uppercase text-stone-900 dark:text-stone-100">
                {language === 'en' ? 'Church Branches' : 'చర్చి శాఖలు'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {language === 'en'
                  ? 'All branches hold Sunday 10 AM to 1 PM service and Last Saturday All-Night Prayer.'
                  : 'అన్ని శాఖలలో ఆదివారం ఉదయం 10 నుండి 1 గంట వరకు ఆరాధన మరియు రాత్రి ప్రార్థన జరుగును.'}
              </p>
            </div>
            <Link to="/branches">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                <span>{language === 'en' ? 'View All Branches' : 'అన్ని శాఖల వివరాలు'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHURCH_BRANCHES.map((branch) => {
              const bName = language === 'en' ? branch.name : (branch.nameTe || branch.name);
              const bLocality = language === 'en' ? branch.locality : (branch.localityTe || branch.locality);
              const bAddress = language === 'en' ? branch.address : (branch.addressTe || branch.address);
              const bPastor = language === 'en' ? branch.pastorInCharge : (branch.pastorInChargeTe || branch.pastorInCharge);

              return (
                <div
                  key={branch.id}
                  className={`bg-white dark:bg-stone-900 border-2 p-6 flex flex-col justify-between shadow-sharp-sm transition-all ${
                    branch.isMainBranch
                      ? 'border-sacred-rust shadow-sharp-warm'
                      : 'border-stone-300 dark:border-stone-800 hover:border-sacred-gold'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 bg-sacred-rust/10 border border-sacred-rust/40 text-sacred-rust text-[10px] font-bold uppercase">
                        {bLocality}
                      </span>
                      {branch.isMainBranch && (
                        <span className="px-2 py-0.5 bg-sacred-gold text-stone-950 text-[9px] font-black uppercase">
                          {language === 'en' ? 'Main Branch' : 'ప్రధాన శాఖ'}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-base uppercase text-stone-900 dark:text-white mb-1">
                      {bName}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mb-4 line-clamp-2">
                      {bAddress}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-dashed border-stone-200 dark:border-stone-800 text-xs">
                      <div className="flex justify-between text-[11px] text-stone-700 dark:text-stone-300 font-medium">
                        <span>{language === 'en' ? 'Sunday Worship:' : 'ఆదివారం ఆరాధన:'}</span>
                        <span className="font-bold text-sacred-rust dark:text-sacred-gold font-mono">10:00 AM – 1:00 PM</span>
                      </div>
                      {branch.isMainBranch && (
                        <div className="flex justify-between text-[11px] text-sacred-gold font-bold">
                          <span>{language === 'en' ? 'Tue Bible Study:' : 'మంగళవారం బైబిల్ స్టడీ:'}</span>
                          <span className="font-mono">6:00 – 7:00 PM</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[10px] text-stone-500">
                        <span>{language === 'en' ? 'Last Saturday:' : 'నెల చివరి శనివారం:'}</span>
                        <span>{language === 'en' ? 'All-Night Prayer' : 'రాత్రి ప్రార్థన'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500">{bPastor}</span>
                    <Link to="/branches" className="text-xs font-bold uppercase text-sacred-rust dark:text-sacred-gold hover:underline flex items-center gap-1">
                      <span>{language === 'en' ? 'Details & Map' : 'వివరాలు'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Key Ordinance Banner: Bible Study & All-Night Prayer */}
      <section className="py-16 bg-sacred-cream dark:bg-sacred-obsidian border-b border-stone-300 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tuesday Bible Study Card */}
            <div className="bg-stone-950 text-white border-2 border-sacred-gold p-8 shadow-sharp flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 bg-sacred-gold text-stone-950 text-[10px] font-black uppercase tracking-wider inline-block mb-3">
                  {language === 'en' ? 'Kalyan Nagar Main Branch' : 'కళ్యాణ్ నగర్ ప్రధాన శాఖ'}
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-white mb-2">
                  {language === 'en' ? 'Tuesday In-Depth Bible Study' : 'మంగళవారం బైబిల్ స్టడీ'}
                </h3>
                <p className="font-mono text-sacred-gold text-sm font-bold mb-3">
                  {language === 'en' ? 'Every Tuesday Evening 06:00 PM – 07:00 PM' : 'ప్రతి మంగళవారం సాయంత్రం 06:00 PM – 07:00 PM'}
                </p>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {language === 'en'
                    ? 'A dedicated hour of systematic verse-by-verse scripture exposition, doctrine clarification, and spiritual growth at our main sanctuary.'
                    : 'కళ్యాణ్ నగర్ ప్రధాన మందిరములో దేవుని వాక్యమును వచన వచనముగా పరిశీలించి అధ్యయనము చేయు సమయం. సందేహాల నివృత్తి మరియు ఆత్మీయ క్షేమాభివృద్ధి.'}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-400">Speaker: Pastor P. David Paul</span>
                <Link to="/events" className="text-xs font-bold uppercase text-sacred-gold hover:underline flex items-center gap-1">
                  <span>{language === 'en' ? 'Learn More' : 'మరిన్ని వివరాలు'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Last Saturday All-Night Prayer Card */}
            <div className="bg-stone-950 text-white border-2 border-sacred-rust p-8 shadow-sharp flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 bg-sacred-rust text-white text-[10px] font-bold uppercase tracking-wider inline-block mb-3">
                  {language === 'en' ? 'Across All 6 Branches' : 'అన్ని 6 శాఖలలో'}
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-white mb-2">
                  {language === 'en' ? 'Monthly All-Night Prayer Vigil' : 'నెల చివరి శనివారం రాత్రి ప్రార్థన'}
                </h3>
                <p className="font-mono text-sacred-rust text-sm font-bold mb-3">
                  {language === 'en' ? '10:00 PM to 05:00 AM (Last Saturday)' : 'రాత్రి 10:00 PM నుండి తెల్లవారుజామున 05:00 AM వరకు'}
                </p>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {language === 'en'
                    ? 'United overnight prayer watch interceding for family breakthroughs, physical healing, youth deliverance, and revival in Hyderabad.'
                    : 'కుటుంబాల క్షేమము, విముక్తి, వ్యాధుల నుండి స్వస్థత మరియు హైదరాబాద్ నగర రక్షణ కొరకు సంఘముగా ఏకమనస్సుతో రాత్రంతా చేసే శక్తివంతమైన విజ్ఞాపన.'}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-400">At Kalyan Nagar, Alwyn, Vanasthalipuram...</span>
                <Link to="/events" className="text-xs font-bold uppercase text-sacred-rust hover:underline flex items-center gap-1">
                  <span>{language === 'en' ? 'View Details' : 'వివరాలు'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Giving Callout */}
      <section className="py-16 bg-stone-100 dark:bg-sacred-espresso border-b border-stone-300 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-sacred-rust fill-current" />
                <span className="text-xs font-bold uppercase tracking-wider text-sacred-rust dark:text-sacred-gold">
                  {language === 'en' ? 'Tithes & Sacred Offerings' : 'దశమభాగములు మరియు కానుకలు'}
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold uppercase text-stone-900 dark:text-white">
                {language === 'en' ? 'Support Salem Fellowship Church Ministry' : 'సేలెం ఫెలోషిప్ పరిచర్యకు సహకరించండి'}
              </h2>
              <p className="text-xs md:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
                {language === 'en'
                  ? 'Your faithful contributions support gospel proclamation across Hyderabad, humanitarian assistance for widows and needy families, and church maintenance.'
                  : 'మీ దశమభాగములు మరియు కానుకల ద్వారా హైదరాబాద్ శాఖలలో పరిచర్య, పేదలకు సహాయం, మరియు సువార్త కార్యక్రమాలు నిర్వహించబడుతున్నాయి.'}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-stone-600 dark:text-stone-400 font-mono">
                <span className="p-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800">
                  UPI VPA: <strong>{CHURCH_INFO.giving.upiVpa}</strong>
                </span>
                <span className="p-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800">
                  Bank: <strong>HDFC Bank (SR Nagar / Sanath Nagar, Hyderabad)</strong>
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link to="/give">
                <Button variant="primary" size="lg" fullWidth className="flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{language === 'en' ? 'Give Online via UPI / Bank' : 'కానుకలు చెల్లించండి'}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pastoral Excerpt Plaque */}
      <section className="py-16 bg-sacred-cream dark:bg-sacred-obsidian">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <Quote className="w-10 h-10 mx-auto text-sacred-rust opacity-60" />
          <p className="font-serif italic text-lg md:text-xl text-stone-800 dark:text-stone-200 leading-relaxed">
            {language === 'en'
              ? '“God’s Word is a lamp unto our feet and a light unto our path. Stand steadfast in prayer.”'
              : '“దేవుని వాక్యమే మన పాదములకు దీపము, మన త్రోవకు వెలుగు. నమ్మకంగా ప్రార్థనలో నిలబడండి.”'}
          </p>
          <div>
            <span className="font-display font-bold text-sm uppercase text-stone-900 dark:text-white block">
              {language === 'en' ? 'Pastor P. David Paul' : 'పాస్టర్ పి. డేవిడ్ పాల్'}
            </span>
            <span className="text-xs text-sacred-gold uppercase font-semibold">
              {language === 'en' ? 'Senior Minister — Kalyan Nagar (Main Branch)' : 'కళ్యాణ్ నగర్ ప్రధాన శాఖ కాపరి'}
            </span>
          </div>
          <div className="pt-2">
            <Link to="/leadership">
              <Button variant="outline" size="sm">
                {language === 'en' ? 'Meet Branch Pastors' : 'శాఖా కాపరుల వివరాలు'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
