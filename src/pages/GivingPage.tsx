import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { CHURCH_INFO } from '../data/churchData';
import { QrCode, Building2, Copy, Check, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../data/translations';

export const GivingPage: React.FC = () => {
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
      name: language === 'en' ? 'General Tithe & Offering' : 'దశమభాగములు మరియు సాధారణ కానుకలు', 
      desc: language === 'en' ? 'Sustaining local gospel ministry, worship services, and branch maintenance' : 'శాఖల పరిచర్య, ఆరాధనలు మరియు చర్చి నిర్వహణ కొరకు' 
    },
    { 
      id: 'missions', 
      name: language === 'en' ? 'Missions & Outreach Fund' : 'సువార్త మరియు మిషన్ పరిచర్య', 
      desc: language === 'en' ? 'Evangelistic outreach and church ministries across Hyderabad' : 'సువార్త కూటములు మరియు పరిచర్య కొరకు' 
    },
    { 
      id: 'building', 
      name: language === 'en' ? 'Sanctuary Infrastructure' : 'మందిర నిర్మాణ మరియు అభివృద్ధి నిధి', 
      desc: language === 'en' ? 'Branch sanctuary improvements, acoustics, and seating' : 'మందిరాల మరమ్మతులు, సౌండ్ సిస్టమ్ మరియు అభివృద్ధి కొరకు' 
    },
    { 
      id: 'mercy', 
      name: language === 'en' ? 'Needy, Food & Mercy Relief' : 'పేదలకు సహాయం మరియు నిత్యావసరాలు', 
      desc: language === 'en' ? 'Dry rations for widows and support for underprivileged families' : 'విధవరాండ్రకు రేషన్ సరుకులు మరియు నిరుపేద కుటుంబాలకు సహాయం' 
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
    <div className="py-12 md:py-20 bg-sacred-cream dark:bg-sacred-obsidian min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={t.giving.eyebrow}
          title={t.giving.title}
          description={t.giving.desc}
        />

        {/* Biblical Giving Excerpt */}
        <div className="mb-10 p-6 bg-sacred-espresso text-stone-200 border-2 border-stone-800 shadow-sharp flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-sacred-gold tracking-widest block">
              {language === 'en' ? 'Biblical Stewardship' : 'దైవిక సమర్పణ'}
            </span>
            <p className="font-display text-base md:text-lg font-bold text-white uppercase">
              {CHURCH_INFO.giving.beneficiaryName}
            </p>
            <p className="text-xs text-stone-400">
              {language === 'en'
                ? '“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.” — 2 Corinthians 9:7'
                : '“సంతోషముగా ఇచ్చువానిని దేవుడు ప్రేమించును.” — 2 కొరింథీయులకు 9:7'}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 text-xs font-mono bg-stone-900 border border-stone-800 px-3 py-2 text-stone-300">
            <Heart className="w-4 h-4 text-sacred-rust fill-current" />
            <span>{language === 'en' ? 'Faithful Stewardship' : 'నమ్మకమైన పరిచర్య'}</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-stone-300 dark:border-stone-800 mb-8">
          <button
            onClick={() => setActiveTab('upi')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'upi'
                ? 'border-sacred-rust text-sacred-rust dark:border-sacred-gold dark:text-sacred-gold bg-stone-200/50 dark:bg-stone-900/60'
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
                ? 'border-sacred-rust text-sacred-rust dark:border-sacred-gold dark:text-sacred-gold bg-stone-200/50 dark:bg-stone-900/60'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{t.giving.tabBank}</span>
          </button>
        </div>

        {/* TAB 1: UPI / SCAN */}
        {activeTab === 'upi' && (
          <div className="space-y-8">
            {/* Step 1: Fund Selection */}
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
                {t.giving.selectPurpose}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {funds.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFund(f.name)}
                    className={`p-4 text-left border-2 transition-all flex flex-col justify-between shadow-sharp-sm ${
                      selectedFund === f.name
                        ? 'border-sacred-rust bg-sacred-rust/5 text-sacred-rust dark:border-sacred-gold dark:text-sacred-gold dark:bg-stone-900'
                        : 'border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                    }`}
                  >
                    <span className="font-bold text-xs uppercase block">{f.name}</span>
                    <span className="text-[11px] text-stone-500 block mt-2 leading-relaxed">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Amount Selection */}
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
                {t.giving.selectAmount}
              </h3>
              <div className="flex flex-wrap gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`px-5 py-2.5 border-2 font-mono font-bold text-sm transition-all shadow-sharp-sm ${
                      selectedAmount === amt
                        ? 'bg-sacred-rust text-white border-sacred-rust dark:bg-sacred-gold dark:text-stone-950 dark:border-sacred-gold'
                        : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:border-sacred-rust'
                    }`}
                  >
                    ₹ {amt.toLocaleString('en-IN')}
                  </button>
                ))}
                <div className="relative flex-1 min-w-[160px]">
                  <span className="absolute left-3 top-2.5 text-sm font-mono text-stone-400">₹</span>
                  <input
                    type="number"
                    placeholder={t.giving.customAmount}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount('custom');
                    }}
                    className="w-full pl-8 pr-3 py-2 text-sm font-mono bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust shadow-sharp-sm"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: QR Code & VPA Display */}
            <div className="p-8 bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 shadow-sharp grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 flex flex-col items-center text-center">
                <div className="p-4 bg-white border-2 border-stone-900 shadow-sharp inline-block">
                  <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white" />
                    <rect x="6" y="6" width="28" height="28" stroke="#141210" strokeWidth="6" fill="white" />
                    <rect x="14" y="14" width="12" height="12" fill="#141210" />
                    <rect x="66" y="6" width="28" height="28" stroke="#141210" strokeWidth="6" fill="white" />
                    <rect x="74" y="14" width="12" height="12" fill="#141210" />
                    <rect x="6" y="66" width="28" height="28" stroke="#141210" strokeWidth="6" fill="white" />
                    <rect x="14" y="74" width="12" height="12" fill="#141210" />
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
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mt-3 block">
                  {t.giving.scanUpi}
                </span>
                <span className="text-sm font-mono font-bold text-sacred-rust dark:text-sacred-gold mt-0.5">
                  {currentAmountValue ? `₹ ${currentAmountValue.toLocaleString('en-IN')}` : 'Any Offering Amount'}
                </span>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-xs uppercase font-bold text-stone-400 block tracking-wider">
                    {t.giving.officialVpa}
                  </span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-mono text-base md:text-lg font-bold p-3 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white flex-1 border-2 border-stone-300 dark:border-stone-700 truncate">
                      {CHURCH_INFO.giving.upiVpa}
                    </span>
                    <button
                      onClick={() => copyToClipboard(CHURCH_INFO.giving.upiVpa, 'vpa-page')}
                      className="p-3.5 bg-stone-950 text-white hover:bg-stone-800 border-2 border-stone-800 shadow-sharp-sm transition-colors shrink-0"
                      title="Copy UPI ID"
                    >
                      {copiedField === 'vpa-page' ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs uppercase font-bold text-stone-400 block tracking-wider">
                    {language === 'en' ? 'Verified Church Beneficiary Name' : 'ఖాతా లబ్ధిదారు పేరు'}
                  </span>
                  <p className="font-bold text-sm text-stone-900 dark:text-white">
                    {CHURCH_INFO.giving.beneficiaryName}
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href={upiUrl}
                    className="w-full py-3 px-6 bg-sacred-rust hover:bg-[#A3360A] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sharp transition-colors border border-sacred-rust"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{t.giving.openUpiApps}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BANK TRANSFER */}
        {activeTab === 'bank' && (
          <div className="space-y-6">
            <div className="p-4 bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 shadow-sharp-sm text-xs text-stone-600 dark:text-stone-300">
              {language === 'en'
                ? 'Direct National Electronic Funds Transfer (NEFT / RTGS / IMPS) details for Salem Fellowship Church Trust:'
                : 'సేలెం ఫెలోషిప్ చర్చి ట్రస్ట్ అధికారిక బ్యాంక్ వివరాలు:'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: language === 'en' ? 'Account Beneficiary Name' : 'ఖాతా లబ్ధిదారు పేరు', val: CHURCH_INFO.giving.beneficiaryName, key: 'b-name' },
                { label: language === 'en' ? 'Bank Name' : 'బ్యాంకు పేరు', val: CHURCH_INFO.giving.bankName, key: 'b-bank' },
                { label: language === 'en' ? 'Account Number' : 'ఖాతా సంఖ్య', val: CHURCH_INFO.giving.accountNumber, key: 'b-acc' },
                { label: language === 'en' ? 'IFSC Code' : 'ఐఎఫ్‌ఎస్‌సి కోడ్', val: CHURCH_INFO.giving.ifscCode, key: 'b-ifsc' },
                { label: language === 'en' ? 'Bank Branch' : 'శాఖ', val: CHURCH_INFO.giving.branch, key: 'b-branch' },
                { label: language === 'en' ? 'Account Type' : 'ఖాతా రకము', val: CHURCH_INFO.giving.accountType, key: 'b-type' },
              ].map((field) => (
                <div key={field.key} className="p-4 bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 shadow-sharp-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                      {field.label}
                    </span>
                    <span className="font-mono text-sm font-bold text-stone-900 dark:text-white block mt-1">
                      {field.val}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(field.val, field.key)}
                    className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 transition-colors"
                    title="Copy"
                  >
                    {copiedField === field.key ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
