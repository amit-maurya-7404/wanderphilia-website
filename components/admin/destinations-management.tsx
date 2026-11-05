'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Globe,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Layers,
  MapPin,
  Sparkles,
  Tag,
  Eye,
  X,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DestinationPageItem } from '@/lib/destinations';
import { DestinationEditorModal } from '@/components/admin/destination-editor-modal';

export function DestinationsManagement() {
  const [destinations, setDestinations] = useState<DestinationPageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'Domestic' | 'International'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'draft'>('all');

  // Modal State
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<DestinationPageItem | null>(null);

  // Delete State
  const [deletingDest, setDeletingDest] = useState<DestinationPageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/destinations');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setDestinations(data);
        }
      }
    } catch (err) {
      console.error('Error loading destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const handleCreateNew = () => {
    setEditingDestination(null);
    setEditorModalOpen(true);
  };

  const handleEdit = (dest: DestinationPageItem) => {
    setEditingDestination(dest);
    setEditorModalOpen(true);
  };

  const handleSaveSuccess = (saved: DestinationPageItem) => {
    setDestinations((prev) => {
      const exists = prev.some((d) => d.slug.toLowerCase() === saved.slug.toLowerCase());
      if (exists) {
        return prev.map((d) => (d.slug.toLowerCase() === saved.slug.toLowerCase() ? saved : d));
      }
      return [saved, ...prev];
    });
  };

  const confirmDelete = async () => {
    if (!deletingDest) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/destinations?slug=${encodeURIComponent(deletingDest.slug)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDestinations((prev) => prev.filter((d) => d.slug.toLowerCase() !== deletingDest.slug.toLowerCase()));
        setDeletingDest(null);
      } else {
        alert('Failed to delete destination from database.');
      }
    } catch (err) {
      alert('Error deleting destination: ' + err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered Destinations
  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = d.name?.toLowerCase().includes(q);
        const matchesDest = d.destination?.toLowerCase().includes(q);
        const matchesSlug = d.slug?.toLowerCase().includes(q);
        if (!matchesName && !matchesDest && !matchesSlug) return false;
      }

      if (regionFilter !== 'all') {
        if (d.region !== regionFilter) return false;
      }

      if (statusFilter !== 'all') {
        const isLive = d.isActive !== false;
        if (statusFilter === 'live' && !isLive) return false;
        if (statusFilter === 'draft' && isLive) return false;
      }

      return true;
    });
  }, [destinations, searchQuery, regionFilter, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const total = destinations.length;
    const domestic = destinations.filter((d) => d.region === 'Domestic').length;
    const international = destinations.filter((d) => d.region === 'International').length;
    const live = destinations.filter((d) => d.isActive !== false).length;
    return { total, domestic, international, live };
  }, [destinations]);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER & STATS */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
              Page Builder & Dynamic Routing
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Destination Pages & Section Management
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Create and launch new destination pages live at <code className="text-orange-400">wanderphilia.com/trips/[destination]</code> without writing code. Choose banners, starting prices, and toggle page sections on or off.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDestinations}
              disabled={loading}
              className="border-slate-800 bg-slate-950/80 text-slate-300 text-xs h-9 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-orange-400 ${loading ? 'animate-spin' : ''}`} />
              Refresh Pages
            </Button>
            <Button
              size="sm"
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-[#ff5d09] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs h-9 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" /> + Create Destination Page
            </Button>
          </div>
        </div>

        {/* 4 METRIC TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Destinations</span>
              <Globe className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1.5">{metrics.total}</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">{metrics.live} live on website</p>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Domestic (India)</span>
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1.5">{metrics.domestic}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Kerala, Meghalaya, etc.</p>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>International</span>
              <Compass className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1.5">{metrics.international}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Bali, Vietnam, Dubai, etc.</p>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Published Status</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white mt-1.5">{metrics.live}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Instant live rendering</p>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH BAR */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination by name, title, or slug..."
              className="bg-slate-950 border-slate-800 pl-9 text-xs h-9 text-white placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['all', 'Domestic', 'International'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegionFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  regionFilter === r
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'all' ? 'All Regions' : r}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['all', 'live', 'draft'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === s
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s === 'all' ? 'All Status' : s === 'live' ? 'Live Only' : 'Draft'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS LIST TABLE */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Configured Destination Pages ({filtered.length})
            </h2>
          </div>
          <p className="text-[11px] text-slate-400">
            Click "Edit Page" to toggle sections, customize headings, or update hero images
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading destination pages...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Globe className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No destination pages found</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchQuery ? 'Try adjusting your search query or filters.' : 'Get started by creating your first destination page.'}
            </p>
            <Button
              size="sm"
              onClick={handleCreateNew}
              className="bg-[#ff5d09] hover:bg-orange-600 text-white text-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" /> Create Destination Page
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filtered.map((dest) => {
              const sec = dest.sections || {
                available: true,
                family: true,
                custom: true,
                related: true,
                durationFilter: true,
                reviews: true,
                gallery: true,
                faqs: true,
              };
              const heroThumb = dest.heroImages && dest.heroImages.length > 0 ? dest.heroImages[0] : '/images/placeholder.jpg';

              return (
                <div
                  key={dest.slug}
                  className="p-4 sm:p-5 hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                      <img
                        src={heroThumb}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as any).src = '/images/banner1.jpg';
                        }}
                      />
                      <div className="absolute top-1 left-1">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white backdrop-blur-xs">
                          {dest.region}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white hover:text-orange-400 transition-colors">
                          {dest.name}
                        </h3>
                        {dest.isActive !== false ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            Draft
                          </span>
                        )}
                        {dest.isCustom && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            Custom Managed
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span>/trips/{dest.slug}</span>
                        {dest.startingPrice && dest.startingPrice > 0 ? (
                          <span className="text-amber-400 font-sans font-bold">
                            ₹{dest.startingPrice.toLocaleString('en-IN')} starting
                          </span>
                        ) : null}
                      </div>

                      {dest.tagline && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 italic max-w-xl">
                          "{dest.tagline}"
                        </p>
                      )}

                      {/* Active Sections Pills */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-slate-500 font-medium mr-1">Active Sections:</span>
                        {sec.available && (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium">
                            Available Packages
                          </span>
                        )}
                        {sec.family && (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                            Family Packages
                          </span>
                        )}
                        {sec.custom && (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                            Customized
                          </span>
                        )}
                        {sec.related && (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                            Related
                          </span>
                        )}
                        {sec.durationFilter && (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-slate-800 text-slate-300 font-medium">
                            Duration Filter
                          </span>
                        )}
                        {sec.reviews && (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-amber-500/10 text-amber-300 font-medium">
                            Reviews
                          </span>
                        )}
                        {sec.gallery && (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-pink-500/10 text-pink-300 font-medium">
                            Gallery
                          </span>
                        )}
                        {sec.faqs && (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-indigo-500/10 text-indigo-300 font-medium">
                            FAQs ({dest.faqs?.length || 0})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    <a
                      href={`/trips/${dest.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Live <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    <Button
                      size="sm"
                      onClick={() => handleEdit(dest)}
                      className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs h-8 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" /> Edit Page & Sections
                    </Button>

                    {dest.isCustom && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeletingDest(dest)}
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-8 px-2 cursor-pointer"
                        title="Delete Destination Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* DESTINATION EDITOR MODAL */}
      <DestinationEditorModal
        open={editorModalOpen}
        destination={editingDestination}
        onClose={() => setEditorModalOpen(false)}
        onSuccess={handleSaveSuccess}
      />

      {/* CONFIRM DELETE MODAL */}
      {deletingDest && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Destination Page?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to remove <strong>"{deletingDest.name}"</strong>? Visitors to <code className="text-orange-400">/trips/{deletingDest.slug}</code> will no longer see this custom destination page.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-orange-400">
              /trips/{deletingDest.slug}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                disabled={isDeleting}
                onClick={() => setDeletingDest(null)}
                className="border-slate-800 text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Page'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
