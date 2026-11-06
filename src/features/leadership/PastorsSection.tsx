import React, { useState } from 'react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LEADERSHIP_TEAM } from '../../data/churchData';
import { Pastor } from '../../types';
import { Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PastorsSectionProps {
  onOpenPrayerModal?: () => void;
}

export const PastorsSection: React.FC<PastorsSectionProps> = () => {
  const { t, language } = useLanguage();
  const [selectedPastor, setSelectedPastor] = useState<Pastor | null>(null);
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    phone: '',
    topic: 'Spiritual Guidance & Prayer',
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentBooked(true);
  };

  return (
    <section id="leadership" className="py-16 md:py-24 bg-sacred-cream dark:bg-sacred-obsidian border-b border-stone-300 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={t.leadership.eyebrow}
          title={t.leadership.title}
          description={t.leadership.desc}
        />

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {LEADERSHIP_TEAM.map((pastor) => {
            const pastorName = language === 'te' && pastor.nameTe ? pastor.nameTe : pastor.name;
            const pastorRole = language === 'te' && pastor.roleTe ? pastor.roleTe : pastor.role;
            const pastorBio = language === 'te' && pastor.bioTe ? pastor.bioTe : pastor.bio;
            const pastorQuote = language === 'te' && pastor.quoteTe ? pastor.quoteTe : pastor.quote;
            const pastorCounseling = language === 'te' && pastor.counselingDaysTe ? pastor.counselingDaysTe : pastor.counselingDays;

            return (
              <div
                key={pastor.id}
                className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 hover:border-sacred-rust transition-all flex flex-col justify-between shadow-sharp-sm group"
              >
                {/* Portrait container with sharp border */}
                <div className="relative aspect-[4/5] bg-stone-950 overflow-hidden border-b-2 border-stone-200 dark:border-stone-800">
                  <img
                    src={pastor.imageUrl}
                    alt={pastorName}
                    className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-sacred-gold block">
                      {pastorRole}
                    </span>
                    <h3 className="font-display font-bold text-lg uppercase leading-tight">
                      {pastorName}
                    </h3>
                  </div>
                </div>

                {/* Bio & Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {pastorBio}
                  </p>

                  {pastorQuote && (
                    <p className="text-[11px] font-serif italic text-stone-500 border-l-2 border-sacred-rust pl-2">
                      {pastorQuote}
                    </p>
                  )}

                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-300">
                      <Clock className="w-3.5 h-3.5 text-sacred-gold shrink-0" />
                      <span>{t.leadership.counselingLabel}</span>
                    </span>
                    <span className="text-[10px] block mt-0.5">{pastorCounseling}</span>
                  </div>
                </div>

                {/* Booking CTA */}
                <div className="p-4 bg-stone-50 dark:bg-stone-950/70 border-t border-stone-200 dark:border-stone-800">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setSelectedPastor(pastor);
                      setAppointmentBooked(false);
                    }}
                    className="border-stone-400 dark:border-stone-700 text-xs"
                  >
                    {t.leadership.requestCounselBtn}
                  </Button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Counseling Appointment Modal */}
      {selectedPastor && (
        <Modal
          isOpen={!!selectedPastor}
          onClose={() => setSelectedPastor(null)}
          title={`${t.leadership.modalTitle} ${language === 'te' && selectedPastor.nameTe ? selectedPastor.nameTe : selectedPastor.name}`}
          subtitle={language === 'te' && selectedPastor.roleTe ? selectedPastor.roleTe : selectedPastor.role}
        >
          {appointmentBooked ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 mx-auto bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-display text-lg font-bold uppercase text-stone-900 dark:text-white">
                {t.leadership.successTitle}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
                {t.leadership.successDesc} {language === 'te' && selectedPastor.nameTe ? selectedPastor.nameTe : selectedPastor.name}.
              </p>
              <Button variant="primary" size="sm" onClick={() => setSelectedPastor(null)}>
                {t.leadership.doneBtn}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-3">
              <div className="p-3 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300">
                <strong>{t.leadership.modalRegularWindow}</strong>{' '}
                {language === 'te' && selectedPastor.counselingDaysTe
                  ? selectedPastor.counselingDaysTe
                  : selectedPastor.counselingDays}
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.leadership.modalFullName}
                </label>
                <input
                  type="text"
                  required
                  value={appointmentForm.name}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, name: e.target.value })}
                  placeholder="e.g. John Emmanuel"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.leadership.modalPhone}
                </label>
                <input
                  type="tel"
                  required
                  value={appointmentForm.phone}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.leadership.modalTopic}
                </label>
                <select
                  value={appointmentForm.topic}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, topic: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
                >
                  <option value="Spiritual Guidance & Prayer">Spiritual Guidance & Prayer / ఆత్మీయ మార్గదర్శకత్వం</option>
                  <option value="Pre-Marital & Marriage Counseling">Marriage / Family Counseling / వివాహ కౌన్సెలింగ్</option>
                  <option value="Bereavement & Grief Support">Bereavement & Health Prayer / అనారోగ్య ప్రార్థన</option>
                  <option value="Vocational & Life Calling">Career & Life Direction / ఉద్యోగ సలహాలు</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedPastor(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {t.leadership.modalConfirmBtn}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </section>
  );
};
