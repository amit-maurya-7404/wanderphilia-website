'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  Calendar,
  Clock,
  User,
  Tag,
  Link as LinkIcon,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DbBlog } from '@/lib/blogs-db';
import { VisualBlogEditor } from './visual-blog-editor';

interface BlogEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  blog: DbBlog | null;
}

export function BlogEditorModal({ isOpen, onClose, onSaved, blog }: BlogEditorModalProps) {
  const isEditing = !!blog;

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Rajasthan guide');
  const [author, setAuthor] = useState('Huzaifa AK at Wanderphilia');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [readTime, setReadTime] = useState<number>(5);
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  // UI state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or reset on open/blog change
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || '');
      setSlug(blog.slug || '');
      setCategory(blog.category || 'General');
      setAuthor(blog.author || 'Huzaifa AK at Wanderphilia');
      setDate(blog.date || new Date().toISOString().split('T')[0]);
      setLastUpdated(blog.lastUpdated || '');
      setReadTime(blog.readTime || 5);
      setImage(blog.image || '');
      setExcerpt(blog.excerpt || '');
      setContentHtml(blog.contentHtml || blog.content || '');
      setStatus(blog.status || 'published');
    } else {
      setTitle('');
      setSlug('');
      setCategory('Rajasthan guide');
      setAuthor('Huzaifa AK at Wanderphilia');
      setDate(new Date().toISOString().split('T')[0]);
      setLastUpdated('November 2026');
      setReadTime(5);
      setImage('');
      setExcerpt('');
      setContentHtml('<p>Start writing your blog story here...</p>');
      setStatus('published');
    }
    setError(null);
  }, [blog, isOpen]);

  // Auto-generate slug from title for new blogs
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isEditing) {
      const generatedSlug = newTitle
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
      setSlug(generatedSlug);
    }
  };

  // Hero Image file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to upload image');
      }

      const data = await res.json();
      if (data.url) {
        setImage(data.url);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!slug.trim()) {
      setError('Slug is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        id: blog?.id,
        title: title.trim(),
        slug: slug.trim(),
        newSlug: isEditing && blog?.slug !== slug.trim() ? slug.trim() : undefined,
        category: category.trim(),
        author: author.trim(),
        date,
        lastUpdated: lastUpdated.trim(),
        readTime: Number(readTime) || 5,
        image: image.trim() || '/images/default-blog.jpg',
        excerpt: excerpt.trim(),
        content: contentHtml.replace(/<[^>]*>?/gm, ' ').substring(0, 300),
        contentHtml,
        status,
      };

      const res = await fetch('/api/admin/blogs', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save blog');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving blog');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? `Editing "${blog.title}"` : 'Easy visual editor: type text, format headings, and add photos with 1 click'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form id="blog-form" onSubmit={handleSave} className="space-y-6">
            {/* Top row: Title & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-orange-400" /> Blog Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Best Time to Visit Rajasthan..."
                  required
                  className="bg-slate-950 border-slate-800 text-white placeholder-slate-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-orange-400" /> URL Slug *
                </label>
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-3 focus-within:ring-2 focus-within:ring-orange-500">
                  <span className="text-xs text-slate-500 shrink-0">/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="best-time-to-visit-rajasthan"
                    required
                    className="w-full bg-transparent text-sm text-white focus:outline-none py-2"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Category, Author, Read Time, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-400" /> Category
                </label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Rajasthan guide"
                  className="bg-slate-950 border-slate-800 text-white text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-400" /> Author
                </label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Huzaifa AK at Wanderphilia"
                  className="bg-slate-950 border-slate-800 text-white text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-400" /> Read Time (min)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={readTime}
                  onChange={(e) => setReadTime(parseInt(e.target.value) || 5)}
                  className="bg-slate-950 border-slate-800 text-white text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            {/* Row 3: Publish Date & Last Updated */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" /> Published Date
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white text-sm rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Last Updated Badge Text</label>
                <Input
                  value={lastUpdated}
                  onChange={(e) => setLastUpdated(e.target.value)}
                  placeholder="e.g. November 2026"
                  className="bg-slate-950 border-slate-800 text-white text-sm rounded-xl"
                />
              </div>
            </div>

            {/* Row 4: Cover Banner Image (URL + File Upload) */}
            <div className="space-y-2 p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-orange-400" /> Main Hero / Cover Banner Image
                </span>
                {image && <span className="text-[11px] text-emerald-400 font-normal">Cover selected</span>}
              </label>
              
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://... or /images/blogs/..."
                  className="bg-slate-900 border-slate-800 text-white text-sm rounded-xl flex-1"
                />

                <label className="cursor-pointer shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition">
                  <Upload className="w-3.5 h-3.5" />
                  {uploadingImage ? 'Uploading...' : 'Upload Cover Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {image && (
                <div className="mt-3 relative w-full h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={image}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src = '/images/default-blog.jpg';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Row 5: Excerpt */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Short Excerpt / Summary (Teaser for Google & cards) *
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="A short 1-2 sentence hook for search engines and blog cards..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Row 6: Visual Article Content Editor (Zero Tech, 100% Visual!) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-orange-400" /> Article Content (Visual Editor - Like Word / Google Docs)
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Type directly, select text for Headings/Bold, and click "+ Photo" to insert pictures visually.
                </span>
              </label>

              <VisualBlogEditor
                value={contentHtml}
                onChange={setContentHtml}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/80 bg-slate-900/95 sticky bottom-0 z-20">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="blog-form"
            disabled={saving}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 shadow-lg shadow-orange-500/20"
          >
            {saving ? (
              'Saving...'
            ) : isEditing ? (
              'Update Blog Post'
            ) : (
              'Publish Blog Post'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
