'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  Calendar,
  Clock,
  User,
  Tag,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DbBlog } from '@/lib/blogs-db';
import { BlogEditorModal } from '@/components/admin/blog-editor-modal';

export function BlogsManagement() {
  const [blogs, setBlogs] = useState<DbBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal State
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<DbBlog | null>(null);

  // Delete State
  const [deletingBlog, setDeletingBlog] = useState<DbBlog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blogs');
      if (res.ok) {
        const data = await res.json();
        if (data.blogs && Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        }
      }
    } catch (err) {
      console.error('Error loading blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Unique categories for filter
  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [blogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const titleMatch = blog.title?.toLowerCase().includes(query);
        const excerptMatch = blog.excerpt?.toLowerCase().includes(query);
        const slugMatch = blog.slug?.toLowerCase().includes(query);
        const authorMatch = blog.author?.toLowerCase().includes(query);
        if (!titleMatch && !excerptMatch && !slugMatch && !authorMatch) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'all') {
        const blogStatus = blog.status || 'published';
        if (blogStatus !== statusFilter) return false;
      }

      // Category
      if (categoryFilter !== 'all') {
        if (blog.category !== categoryFilter) return false;
      }

      return true;
    });
  }, [blogs, searchQuery, statusFilter, categoryFilter]);

  // Handle Delete
  const confirmDelete = async () => {
    if (!deletingBlog) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/blogs?slug=${encodeURIComponent(deletingBlog.slug)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.slug !== deletingBlog.slug));
        setDeletingBlog(null);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete blog');
      }
    } catch (err) {
      alert('Error deleting blog');
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats
  const publishedCount = blogs.filter((b) => (b.status || 'published') === 'published').length;
  const draftCount = blogs.filter((b) => b.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Blog & Story Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Travel Blogs & Destination Guides
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Create, edit, and publish rich travel blogs directly to MongoDB. Any team member can upload posts without developer assistance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={loadBlogs}
              disabled={loading}
              className="border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 text-xs gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              onClick={() => {
                setEditingBlog(null);
                setEditorModalOpen(true);
              }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs gap-1.5 shadow-lg shadow-orange-500/20"
            >
              <Plus className="w-4 h-4" />
              Write New Blog
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Articles</span>
            <p className="text-2xl font-bold text-white mt-0.5">{blogs.length}</p>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Published</span>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">{publishedCount}</p>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Drafts</span>
            <p className="text-2xl font-bold text-amber-400 mt-0.5">{draftCount}</p>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Categories</span>
            <p className="text-2xl font-bold text-purple-400 mt-0.5">{categories.length}</p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, excerpt, slug, or author..."
            className="pl-9 bg-slate-950 border-slate-800 text-white placeholder-slate-500 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                statusFilter === 'all' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({blogs.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                statusFilter === 'published' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                statusFilter === 'draft' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          {/* Category filter */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Blogs List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-slate-900 border border-slate-800 rounded-3xl text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-orange-400 mb-3" />
          <p className="text-sm font-medium">Loading articles from MongoDB...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-slate-900 border border-slate-800 rounded-3xl text-center">
          <FileText className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No articles found</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            {searchQuery
              ? `No blogs matching "${searchQuery}". Try clearing search or filters.`
              : 'Start by publishing your first article!'}
          </p>
          <Button
            onClick={() => {
              setEditingBlog(null);
              setEditorModalOpen(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Write First Blog
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlogs.map((b) => {
            const isDraft = b.status === 'draft';
            return (
              <div
                key={b.slug}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all rounded-3xl overflow-hidden flex flex-col group shadow-lg"
              >
                {/* Thumbnail */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as any).src = '/images/default-blog.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur border border-white/10 text-[11px] font-semibold text-white">
                      {b.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur ${
                        isDraft
                          ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                          : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                      }`}
                    >
                      {isDraft ? 'Draft' : 'Live'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-orange-400 transition-colors">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {b.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                      <span className="flex items-center gap-1 truncate max-w-[150px]">
                        <User className="w-3 h-3 text-orange-400 shrink-0" />
                        {b.author}
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {b.readTime || 5} min read
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Live
                      </Link>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingBlog(b);
                            setEditorModalOpen(true);
                          }}
                          className="h-8 px-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 gap-1"
                        >
                          <Edit className="w-3.5 h-3.5 text-orange-400" /> Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingBlog(b)}
                          className="h-8 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      <BlogEditorModal
        isOpen={editorModalOpen}
        onClose={() => {
          setEditorModalOpen(false);
          setEditingBlog(null);
        }}
        onSaved={loadBlogs}
        blog={editingBlog}
      />

      {/* Delete Confirmation Modal */}
      {deletingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Blog Post?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="text-white font-medium">"{deletingBlog.title}"</span>? This will permanently remove the blog from MongoDB and your website.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeletingBlog(null)}
                disabled={isDeleting}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

