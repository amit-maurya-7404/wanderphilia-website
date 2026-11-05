'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  Globe,
  Sliders,
  Image as ImageIcon,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DestinationPageItem,
  DEFAULT_DESTINATION_SECTIONS,
  DEFAULT_SECTION_TITLES,
  DestinationFaqItem
} from '@/lib/destinations';

interface DestinationEditorModalProps {
  open: boolean;
  destination: DestinationPageItem | null;
  onClose: () => void;
  onSuccess: (saved: DestinationPageItem) => void;
}

export function DestinationEditorModal({
  open,
  destination,
  onClose,
  onSuccess,
}: DestinationEditorModalProps) {
  const isEditing = Boolean(destination && destination.slug);

  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [destName, setDestName] = useState('');
  const [region, setRegion] = useState<'Domestic' | 'International'>('Domestic');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState<number>(19999);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Sections toggle
  const [sections, setSections] = useState(DEFAULT_DESTINATION_SECTIONS);
  const [titles, setTitles] = useState(DEFAULT_SECTION_TITLES);

  // FAQs
  const [faqs, setFaqs] = useState<DestinationFaqItem[]>([]);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basics' | 'sections' | 'hero' | 'faqs'>('basics');

  useEffect(() => {
    if (destination) {
      setSlug(destination.slug || '');
      setName(destination.name || '');
      setDestName(destination.destination || '');
      setRegion(destination.region || 'Domestic');
      setTagline(destination.tagline || '');
      setDescription(destination.description || '');
      setStartingPrice(destination.startingPrice || 19999);
      setHeroImages(destination.heroImages && destination.heroImages.length > 0 ? destination.heroImages : []);
      setIsActive(destination.isActive !== false);
      setSections({
        ...DEFAULT_DESTINATION_SECTIONS,
        ...(destination.sections || {}),
      });
      setTitles({
        ...DEFAULT_SECTION_TITLES,
        ...(destination.sectionTitles || {}),
      });
      setFaqs(destination.faqs || []);
    } else {
      // Create mode defaults
      setSlug('');
      setName('');
      setDestName('');
      setRegion('Domestic');
      setTagline('');
      setDescription('');
      setStartingPrice(19999);
      setHeroImages([
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1565716665452-2a4e3445b378?auto=format&fit=crop&w=1200&q=80'
      ]);
      setIsActive(true);
      setSections(DEFAULT_DESTINATION_SECTIONS);
      setTitles(DEFAULT_SECTION_TITLES);
      setFaqs([
        {
          question: 'What is the best time to visit?',
          answer: 'The destination can be visited throughout the year. Peak season brings the most pleasant climate for sightseeing and outdoors.'
        },
        {
          question: 'Are customizable packages available?',
          answer: 'Yes, all itineraries can be tailored to match your travel dates, preferred hotels, sightseeing preferences, and vehicle types.'
        }
      ]);
    }
    setError(null);
    setActiveTab('basics');
  }, [destination, open]);

  // Handle destName change -> auto suggest slug and name if creating
  const handleDestNameChange = (val: string) => {
    setDestName(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      setSlug(generatedSlug);
      setName(`${val} Tour Packages 2026`);
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setHeroImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setHeroImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setFaqs((prev) => [...prev, { question: newFaqQ.trim(), answer: newFaqA.trim() }]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setError(null);

    if (!slug.trim()) {
      setError('Please provide a URL slug (e.g. kerala, andaman, dubai).');
      setActiveTab('basics');
      return;
    }
    if (!destName.trim()) {
      setError('Please provide a destination name (e.g. Kerala).');
      setActiveTab('basics');
      return;
    }
    if (!name.trim()) {
      setError('Please provide a page heading (e.g. Kerala Tour Packages 2026).');
      setActiveTab('basics');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<DestinationPageItem> = {
        slug: slug.trim().toLowerCase(),
        name: name.trim(),
        destination: destName.trim(),
        region,
        tagline: tagline.trim(),
        description: description.trim(),
        startingPrice: Number(startingPrice) || 0,
        heroImages: heroImages.filter(Boolean),
        sections,
        sectionTitles: titles,
        faqs: faqs.filter((f) => f.question?.trim()),
        isActive,
      };

      const res = await fetch('/api/admin/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save destination page');
      }

      onSuccess(data.destination as DestinationPageItem);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving destination');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {isEditing ? `Edit ${destination?.destination || 'Destination'} Page` : 'Create New Destination Page'}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  {isEditing ? 'Live Editor' : 'New Page'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure URL slug, hero banners, and toggle page sections without writing code
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TAB BUTTONS */}
        <div className="px-6 pt-3 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('basics')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'basics'
                ? 'border-orange-500 text-orange-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" /> General & SEO
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sections'
                ? 'border-orange-500 text-orange-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Page Sections Toggle
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hero'
                ? 'border-orange-500 text-orange-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Hero Banners ({heroImages.length})
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'faqs'
                ? 'border-orange-500 text-orange-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> FAQs ({faqs.length})
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {error}
            </div>
          )}

          {/* TAB 1: BASICS */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Destination Name *
                  </label>
                  <Input
                    value={destName}
                    onChange={(e) => handleDestNameChange(e.target.value)}
                    placeholder="e.g. Kerala, Andaman, Dubai"
                    className="bg-slate-950 border-slate-800 text-white text-xs h-10"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Short location name</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="bg-slate-800/80 px-2.5 h-10 flex items-center text-slate-400 text-xs rounded-l-md border border-r-0 border-slate-800">
                      /trips/
                    </span>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="kerala"
                      className="bg-slate-950 border-slate-800 text-orange-400 font-mono text-xs h-10 rounded-l-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Live link: <code className="text-orange-400">wanderphilia.com/trips/{slug || 'destination'}</code>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Page Heading (H1) *
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kerala Tour Packages 2026"
                    className="bg-slate-950 border-slate-800 text-white text-xs h-10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Region Category
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 text-white text-xs h-10 rounded-md px-3 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Domestic">Domestic (India)</option>
                    <option value="International">International</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tagline / Subheading
                  </label>
                  <Input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. God's Own Country - Houseboats & Backwaters"
                    className="bg-slate-950 border-slate-800 text-white text-xs h-10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Starting Price (₹)
                  </label>
                  <Input
                    type="number"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                    placeholder="19999"
                    className="bg-slate-950 border-slate-800 text-white text-xs h-10"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Displayed in the hero badge</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hero Overview Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview paragraph describing the highlights and experiences of this destination..."
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs p-3 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Publish Status</p>
                  <p className="text-[11px] text-slate-400">
                    {isActive ? 'Page is live and accessible to visitors' : 'Page is draft / hidden from public'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: SECTIONS TOGGLE */}
          {activeTab === 'sections' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-between text-xs text-orange-300">
                <span>Toggle which sections appear on this destination page and customize their headings.</span>
              </div>

              {/* SECTION: AVAILABLE PACKAGES */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <div>
                      <h3 className="text-xs font-bold text-white">Section 1: Available Tour Packages</h3>
                      <p className="text-[11px] text-slate-400">Primary list of tours for this destination</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sections.available}
                      onChange={(e) => setSections({ ...sections, available: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ff5d09]"></div>
                  </label>
                </div>

                {sections.available && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Section Title</label>
                      <Input
                        value={titles.availableTitle || ''}
                        onChange={(e) => setTitles({ ...titles, availableTitle: e.target.value })}
                        placeholder="Available Tour Packages"
                        className="bg-slate-900 border-slate-800 text-white text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Section Subtitle (Category Tag)</label>
                      <Input
                        value={titles.availableSubtitle || ''}
                        onChange={(e) => setTitles({ ...titles, availableSubtitle: e.target.value })}
                        placeholder="Curated Experiences"
                        className="bg-slate-900 border-slate-800 text-white text-xs h-8"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: FAMILY PACKAGES */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <div>
                      <h3 className="text-xs font-bold text-white">Section 2: Family Special Packages</h3>
                      <p className="text-[11px] text-slate-400">Family-friendly vacation itineraries</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sections.family}
                      onChange={(e) => setSections({ ...sections, family: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                {sections.family && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Section Title</label>
                      <Input
                        value={titles.familyTitle || ''}
                        onChange={(e) => setTitles({ ...titles, familyTitle: e.target.value })}
                        placeholder="Family Special Packages"
                        className="bg-slate-900 border-slate-800 text-white text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Section Subtitle</label>
                      <Input
                        value={titles.familySubtitle || ''}
                        onChange={(e) => setTitles({ ...titles, familySubtitle: e.target.value })}
                        placeholder="Memorable Journeys"
                        className="bg-slate-900 border-slate-800 text-white text-xs h-8"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: CUSTOMIZED PACKAGES */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <div>
                      <h3 className="text-xs font-bold text-white">Section 3: Customized Tour Packages</h3>
                      <p className="text-[11px] text-slate-400">Tailor-made itineraries with private cabs & hotels</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sections.custom}
                      onChange={(e) => setSections({ ...sections, custom: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>

                {sections.custom && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Section Title</label>
                      <Input
                        value={titles.customTitle || ''}
                        onChange={(e) => setTitles({ ...titles, customTitle: e.target.value })}
                        placeholder="Customized Tour Packages"
                        className="bg-slate-900 border-slate-800 text-white text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Section Subtitle</label>
                      <Input
                        value={titles.customSubtitle || ''}
                        onChange={(e) => setTitles({ ...titles, customSubtitle: e.target.value })}
                        placeholder="Tailored For You"
                        className="bg-slate-900 border-slate-800 text-white text-xs h-8"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: RELATED PACKAGES */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <h3 className="text-xs font-bold text-white">Section 4: Related / Trending Packages</h3>
                      <p className="text-[11px] text-slate-400">Display other trending destinations (e.g. Rajasthan, Ladakh)</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sections.related}
                      onChange={(e) => setSections({ ...sections, related: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {sections.related && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Section Title</label>
                      <Input
                        value={titles.relatedTitle || ''}
                        onChange={(e) => setTitles({ ...titles, relatedTitle: e.target.value })}
                        placeholder="Trending Tour Packages"
                        className="bg-slate-900 border-slate-800 text-white text-xs h-8"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Section Subtitle</label>
                      <Input
                        value={titles.relatedSubtitle || ''}
                        onChange={(e) => setTitles({ ...titles, relatedSubtitle: e.target.value })}
                        placeholder="Explore More"
                        className="bg-slate-900 border-slate-800 text-white text-xs h-8"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* MORE SECTIONS GRID: Duration Filter, Reviews, Gallery, FAQs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Duration Filter Bar</h4>
                    <p className="text-[10px] text-slate-400">Allows visitors to filter by 5N, 6N, 7N, etc.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={sections.durationFilter}
                    onChange={(e) => setSections({ ...sections, durationFilter: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-slate-900 border-slate-700"
                  />
                </div>

                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Customer Reviews</h4>
                    <p className="text-[10px] text-slate-400">4.9 Star cards & Google/FB ratings</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={sections.reviews}
                    onChange={(e) => setSections({ ...sections, reviews: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-slate-900 border-slate-700"
                  />
                </div>

                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Visual Photo Gallery</h4>
                    <p className="text-[10px] text-slate-400">Interactive traveler photography carousel</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={sections.gallery}
                    onChange={(e) => setSections({ ...sections, gallery: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-slate-900 border-slate-700"
                  />
                </div>

                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Frequently Asked Questions</h4>
                    <p className="text-[10px] text-slate-400">Collapsible Q&A accordion section</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={sections.faqs}
                    onChange={(e) => setSections({ ...sections, faqs: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-slate-900 border-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HERO IMAGES */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste image URL (https://images.unsplash.com/... or /images/...)"
                  className="bg-slate-950 border-slate-800 text-white text-xs h-9 flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleAddImage}
                  className="bg-[#ff5d09] hover:bg-orange-600 text-white text-xs h-9 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Image
                </Button>
              </div>

              {heroImages.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl">
                  <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No hero images added yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Add image URLs to show in the rotating hero banner</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {heroImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-950"
                    >
                      <img
                        src={img}
                        alt={`Hero ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as any).src = '/images/placeholder.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-2">
                        <span className="text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                        <button
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 rounded-full bg-red-600/80 hover:bg-red-600 text-white cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-orange-400" /> Add New FAQ
                </h4>
                <Input
                  value={newFaqQ}
                  onChange={(e) => setNewFaqQ(e.target.value)}
                  placeholder="Question (e.g. Is Meghalaya safe for solo female travelers?)"
                  className="bg-slate-900 border-slate-800 text-white text-xs h-8"
                />
                <textarea
                  rows={2}
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                  placeholder="Answer explanation..."
                  className="w-full bg-slate-900 border border-slate-800 text-white text-xs p-2.5 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                />
                <Button
                  size="sm"
                  onClick={handleAddFaq}
                  disabled={!newFaqQ.trim() || !newFaqA.trim()}
                  className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs h-8 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Question to FAQ List
                </Button>
              </div>

              <div className="space-y-2.5">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">
                        {idx + 1}. {faq.question}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFaq(idx)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-[#ff5d09] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs h-9 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                  Saving to MongoDB...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  {isEditing ? 'Save Changes' : 'Publish Destination Page'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
