import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { CHURCH_INFO } from '../../data/churchData';
import { QrCode, Building2, Copy, Check, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TRANSLATIONS } from '../../data/translations';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'bank'>('upi');
  const [selectedFund, setSelectedFund] = useState('General Tithe & Offering');
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const funds = [
    { 
      id: 'tithe', 
      name: language === 'en' ? 'General Tithe & Offering' : 'దశమభాగములు మరియు కానుకలు', 
      desc: language === 'en' ? 'Sustaining local gospel ministry, worship, and branch maintenance' : 'శాఖల పరిచర్య మరియు నిర్వహణ కొరకు' 
    },
    { 
      id: 'missions', 
      name: language === 'en' ? 'Missions & Outreach' : 'సువార్త మరియు మిషన్ పరిచర్య', 
      desc: language === 'en' ? 'Supporting evangelism and gospel meetings' : 'సువార్త కూటములు మరియు పరిచర్య కొరకు' 
    },
    { 
      id: 'building', 
      name: language === 'en' ? 'Sanctuary Infrastructure' : 'మందిర నిర్మాణ మరియు అభివృద్ధి నిధి', 
      desc: language === 'en' ? 'Branch maintenance, acoustics, and seating facilities' : 'మందిరాల మరమ్మతులు మరియు వసతుల కొరకు' 
    },
    { 
      id: 'mercy', 
      name: language === 'en' ? 'Mercy, Food & Needy Relief' : 'పేదలకు సహాయం మరియు నిత్యావసరాలు', 
      desc: language === 'en' ? 'Rations for widows and care for struggling families' : 'విధవరాండ్రకు రేషన్ సరుకులు మరియు పేదలకు సహాయం' 
    },
  ];

  const presetAmounts = [500, 1000, 2500, 5000, 10000];
  const currentAmountValue = selectedAmount === 'custom' ? Number(customAmount) || 0 : selectedAmount;

  const upiUrl = `upi://pay?pa=${CHURCH_INFO.giving.upiVpa}&pn=${encodeURIComponent(CHURCH_INFO.giving.beneficiaryName)}&am=${currentAmountValue || ''}&cu=INR&tn=${encodeURIComponent(selectedFund)}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.giving.title}
      subtitle={t.giving.desc}
      maxWidth="2xl"
    >
      {/* Tab Switcher */}
      <div className="flex border-b border-stone-300 dark:border-stone-800 mb-6">
        <button
          onClick={() => setActiveTab('upi')}
          className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'upi'
              ? 'border-sacred-rust text-sacred-rust dark:border-sacred-gold dark:text-sacred-gold bg-stone-100 dark:bg-stone-900/60'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{t.giving.tabUpi}</span>
        </button>

        <button
          onClick={() => setActiveTab('bank')}
          className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'bank'
              ? 'border-sacred-rust text-sacred-rust dark:border-sacred-gold dark:text-sacred-gold bg-stone-100 dark:bg-stone-900/60'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t.giving.tabBank}</span>
        </button>
      </div>

      {/* TAB 1: UPI / QR PAYMENT */}
      {activeTab === 'upi' && (
        <div className="space-y-6">
          {/* Fund selection */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-2">
              {t.giving.selectPurpose}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {funds.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFund(f.name)}
                  className={`p-3 text-left border text-xs transition-colors ${
                    selectedFund === f.name
                      ? 'border-sacred-rust bg-sacred-rust/10 text-sacred-rust font-bold dark:border-sacred-gold dark:text-sacred-gold'
                      : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span className="font-bold block">{f.name}</span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount presets */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-2">
              {t.giving.selectAmount}
            </label>
            <div className="flex flex-wrap gap-2">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`px-4 py-2 border font-mono font-bold text-xs transition-colors ${
                    selectedAmount === amt
                      ? 'bg-sacred-rust text-white border-sacred-rust dark:bg-sacred-gold dark:text-stone-950 dark:border-sacred-gold shadow-sharp-sm'
                      : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:border-sacred-rust'
                  }`}
                >
                  ₹ {amt.toLocaleString('en-IN')}
                </button>
              ))}
              <div className="relative flex-1 min-w-[130px]">
                <span className="absolute left-3 top-2 text-xs font-mono text-stone-400">₹</span>
                <input
                  type="number"
                  placeholder={t.giving.customAmount}
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount('custom');
                  }}
                  className="w-full pl-7 pr-3 py-1.5 text-xs font-mono bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
                />
              </div>
            </div>
          </div>

          {/* Interactive QR Display & VPA Details */}
          <div className="p-6 bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 shadow-sharp-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual QR Simulation */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="p-3 bg-white border-2 border-stone-900 shadow-sharp inline-block">
                {/* Dynamically generated SVG QR code */}
                <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" />
                  {/* Position squares */}
                  <rect x="6" y="6" width="28" height="28" stroke="#141210" strokeWidth="6" fill="white" />
                  <rect x="14" y="14" width="12" height="12" fill="#141210" />
                  <rect x="66" y="6" width="28" height="28" stroke="#141210" strokeWidth="6" fill="white" />
                  <rect x="74" y="14" width="12" height="12" fill="#141210" />
                  <rect x="6" y="66" width="28" height="28" stroke="#141210" strokeWidth="6" fill="white" />
                  <rect x="14" y="74" width="12" height="12" fill="#141210" />
                  {/* Pattern elements */}
                  <rect x="42" y="10" width="8" height="8" fill="#141210" />
                  <rect x="52" y="18" width="6" height="6" fill="#141210" />
                  <rect x="42" y="32" width="6" height="6" fill="#141210" />
                  <rect x="18" y="44" width="6" height="6" fill="#141210" />
                  <rect x="30" y="44" width="8" height="8" fill="#141210" />
                  <rect x="44" y="44" width="14" height="14" fill="#C2410C" />
                  <rect x="64" y="44" width="8" height="8" fill="#141210" />
                  <rect x="78" y="44" width="6" height="6" fill="#141210" />
                  <rect x="42" y="66" width="8" height="8" fill="#141210" />
                  <rect x="58" y="66" width="6" height="6" fill="#141210" />
                  <rect x="74" y="66" width="10" height="10" fill="#141210" />
                  <rect x="42" y="80" width="12" height="6" fill="#141210" />
                  <rect x="62" y="82" width="6" height="6" fill="#141210" />
                  <rect x="78" y="82" width="8" height="8" fill="#141210" />
                </svg>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-2 block">
                {t.giving.scanUpi}
              </span>
              <span className="text-xs font-mono font-bold text-sacred-rust dark:text-sacred-gold mt-0.5">
                {currentAmountValue ? `₹ ${currentAmountValue.toLocaleString('en-IN')}` : 'Any Offering Amount'}
              </span>
            </div>

            {/* VPA Details */}
            <div className="md:col-span-7 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  {t.giving.officialVpa}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm sm:text-base font-bold p-2 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex-1 border border-stone-300 dark:border-stone-700 truncate">
                    {CHURCH_INFO.giving.upiVpa}
                  </span>
                  <button
                    onClick={() => copyToClipboard(CHURCH_INFO.giving.upiVpa, 'vpa')}
                    className="p-2.5 bg-stone-900 text-white hover:bg-stone-800 border border-stone-700 transition-colors shrink-0"
                    title="Copy UPI ID"
                  >
                    {copiedField === 'vpa' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  {language === 'en' ? 'Account Beneficiary Name' : 'ఖాతా లబ్ధిదారు పేరు'}
                </span>
                <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                  {CHURCH_INFO.giving.beneficiaryName}
                </p>
              </div>

              {/* Direct UPI Intent Button (Mobile) */}
              <div className="pt-2">
                <a
                  href={upiUrl}
                  className="w-full py-2.5 px-4 bg-sacred-rust hover:bg-[#A3360A] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sharp-sm transition-colors border border-sacred-rust"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t.giving.openUpiApps}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BANK TRANSFER DETAILS */}
      {activeTab === 'bank' && (
        <div className="space-y-4">
          <div className="p-4 bg-stone-100 dark:bg-stone-900/60 border border-stone-300 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
            {language === 'en'
              ? 'You may contribute tithes and offerings directly through NetBanking / NEFT / RTGS / IMPS transfer to our church trust bank account:'
              : 'నెట్‌బ్యాంకింగ్, నెఫ్ట్ (NEFT) లేదా ఆర్‌టిజిఎస్ (RTGS) ద్వారా చర్చి ట్రస్ట్ అధికారిక బ్యాంక్ ఖాతాకు కానుకలు పంపవచ్చు:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: language === 'en' ? 'Account Name' : 'ఖాతా పేరు', val: CHURCH_INFO.giving.beneficiaryName, key: 'name' },
              { label: language === 'en' ? 'Bank Name' : 'బ్యాంకు పేరు', val: CHURCH_INFO.giving.bankName, key: 'bank' },
              { label: language === 'en' ? 'Account Number' : 'ఖాతా సంఖ్య', val: CHURCH_INFO.giving.accountNumber, key: 'acc' },
              { label: language === 'en' ? 'IFSC Code' : 'ఐఎఫ్‌ఎస్‌సి కోడ్', val: CHURCH_INFO.giving.ifscCode, key: 'ifsc' },
              { label: language === 'en' ? 'Branch' : 'శాఖ', val: CHURCH_INFO.giving.branch, key: 'branch' },
              { label: language === 'en' ? 'Account Type' : 'ఖాతా రకము', val: CHURCH_INFO.giving.accountType, key: 'type' },
            ].map((field) => (
              <div key={field.key} className="p-3 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                    {field.label}
                  </span>
                  <span className="font-mono text-xs font-bold text-stone-900 dark:text-white block mt-0.5">
                    {field.val}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(field.val, field.key)}
                  className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
                  title="Copy"
                >
                  {copiedField === field.key ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Footer */}
      <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
        <span className="flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-sacred-rust fill-current" />
          <span>{language === 'en' ? 'Every offering is prayerfully and faithfully stewarded.' : 'ప్రతి కానుక ప్రార్థనాపూర్వకంగా దేవుని పని కొరకు వినియోగించబడుతుంది.'}</span>
        </span>
        <button onClick={onClose} className="hover:text-stone-300 font-bold uppercase">
          {language === 'en' ? 'Close' : 'మూసివేయి'}
        </button>
      </div>
    </Modal>
  );
};
