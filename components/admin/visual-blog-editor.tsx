'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Quote,
  Lightbulb,
  Undo,
  Redo,
  Upload,
  Code,
  Eye,
  Check,
  X,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VisualBlogEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function VisualBlogEditor({ value, onChange }: VisualBlogEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlCode, setHtmlCode] = useState(value || '');

  // Image Upload Dialog State
  const [showImageModal, setShowImageModal] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [imgCaption, setImgCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Link Dialog State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  // Sync initial content once or when value changes externally
  useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '<p>Start writing your blog story here...</p>';
      }
    }
    setHtmlCode(value || '');
  }, [value, isHtmlMode]);

  // Handle content changes in visual editor
  const handleContentChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlCode(html);
      onChange(html);
    }
  };

  // Execute standard formatting commands
  const exec = (command: string, value: string | undefined = undefined) => {
    if (isHtmlMode) return;
    document.execCommand(command, false, value);
    handleContentChange();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Insert Custom Heading
  const formatHeading = (level: 'h2' | 'h3' | 'p') => {
    if (isHtmlMode) return;
    document.execCommand('formatBlock', false, `<${level}>`);
    handleContentChange();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Insert Tip Box
  const insertTipBox = () => {
    if (isHtmlMode) return;
    const tipHtml = `
      <div class="rounded-2xl bg-amber-50/90 border border-amber-200/90 p-5 my-6 text-amber-950 font-normal">
        <p class="font-semibold text-amber-900 mb-1">💡 Insider Tip:</p>
        <p class="text-amber-900/90">Type your helpful travel tip or recommendation here...</p>
      </div>
      <p></p>
    `;
    document.execCommand('insertHTML', false, tipHtml);
    handleContentChange();
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }

      const data = await res.json();
      if (data.url) {
        setImgUrl(data.url);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Image upload error');
    } finally {
      setUploading(false);
    }
  };

  // Insert the Image into the visual editor
  const insertImageToContent = () => {
    if (!imgUrl.trim()) {
      setUploadError('Please select or paste an image URL first');
      return;
    }

    const caption = imgCaption.trim();
    const figureHtml = `
      <figure class="my-8 text-center">
        <img 
          src="${imgUrl.trim()}" 
          alt="${caption || 'Blog image'}" 
          class="rounded-2xl w-full object-cover shadow-lg max-h-[520px] mx-auto"
        />
        ${caption ? `<figcaption class="text-xs sm:text-sm text-slate-500 mt-2.5 text-center italic font-medium">${caption}</figcaption>` : ''}
      </figure>
      <p></p>
    `;

    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('insertHTML', false, figureHtml);
    handleContentChange();

    setShowImageModal(false);
    setImgUrl('');
    setImgCaption('');
    setUploadError(null);
  };

  // Handle Link Insertion
  const insertLink = () => {
    if (linkUrl.trim()) {
      exec('createLink', linkUrl.trim());
    }
    setShowLinkModal(false);
    setLinkUrl('');
  };

  // Handle Switch to/from HTML mode
  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // Switching from HTML to Visual
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlCode;
      }
      onChange(htmlCode);
      setIsHtmlMode(false);
    } else {
      // Switching from Visual to HTML
      if (editorRef.current) {
        setHtmlCode(editorRef.current.innerHTML);
      }
      setIsHtmlMode(true);
    }
  };

  const handleHtmlCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlCode(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="border border-slate-700/80 rounded-2xl overflow-hidden bg-slate-900 shadow-xl">
      {/* Visual Toolbar (No technical jargon!) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-950 border-b border-slate-800 text-slate-200">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Main Action: Add Photo Button */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs rounded-xl shadow-md transition cursor-pointer"
            title="Upload photo from computer or URL"
          >
            <ImageIcon className="w-4 h-4" />
            + Photo / Image
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Heading selection */}
          <button
            type="button"
            onClick={() => formatHeading('h2')}
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-slate-800 transition"
            title="Large Section Heading"
          >
            Main Heading
          </button>

          <button
            type="button"
            onClick={() => formatHeading('h3')}
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-800 transition"
            title="Smaller Subheading"
          >
            Subheading
          </button>

          <button
            type="button"
            onClick={() => formatHeading('p')}
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs border border-slate-800 transition"
            title="Normal Paragraph Text"
          >
            Paragraph
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Text Styling: Bold, Italic, Underline */}
          <button
            type="button"
            onClick={() => exec('bold')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => exec('italic')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => exec('underline')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => exec('insertUnorderedList')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            title="Bullet Points"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => exec('insertOrderedList')}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* Tip Box */}
          <button
            type="button"
            onClick={insertTipBox}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg text-xs font-medium border border-amber-500/20 transition"
            title="Insert Tip or Recommendation Box"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            + Tip Box
          </button>

          {/* Link */}
          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            title="Insert Web Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleHtmlMode}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition ${
              isHtmlMode
                ? 'bg-orange-500 text-white border-orange-600'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            <Code className="w-3 h-3" />
            {isHtmlMode ? 'Visual View' : 'HTML Mode'}
          </button>
        </div>
      </div>

      {/* Editor Content Box */}
      <div className="relative min-h-[460px] max-h-[620px] overflow-y-auto bg-white p-6 sm:p-8 text-slate-800">
        {!isHtmlMode ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            onBlur={handleContentChange}
            className="outline-none min-h-[420px] prose prose-slate max-w-none focus:ring-0 leading-relaxed text-base text-slate-700
              prose-headings:text-slate-900 prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2
              prose-p:text-slate-700 prose-p:my-3 prose-p:leading-relaxed
              prose-ul:list-disc prose-ul:ml-4 prose-ul:my-3
              prose-ol:list-decimal prose-ol:ml-4 prose-ol:my-3
              prose-img:rounded-2xl prose-img:shadow-lg prose-img:mx-auto"
            style={{ minHeight: '400px' }}
          />
        ) : (
          <textarea
            value={htmlCode}
            onChange={handleHtmlCodeChange}
            className="w-full h-full min-h-[420px] font-mono text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-xl p-4 outline-none leading-relaxed"
            placeholder="Type or paste HTML code here..."
          />
        )}
      </div>

      {/* Simple Image Uploader Dialog */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Add Photo to Blog</h3>
                  <p className="text-xs text-slate-400">Choose from computer or paste a photo link</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {uploadError}
              </div>
            )}

            {/* Option 1: Choose File */}
            <div className="space-y-2 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Option 1: Upload from Laptop / Mobile
              </span>
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-lg transition">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading Photo...' : 'Click to Choose Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Option 2: Image URL */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Option 2: Or Paste Photo URL
              </span>
              <Input
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or /images/..."
                className="bg-slate-950 border-slate-800 text-white text-xs rounded-xl"
              />
            </div>

            {/* Photo Caption */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Photo Caption (Text shown directly under photo)
              </label>
              <Input
                value={imgCaption}
                onChange={(e) => setImgCaption(e.target.value)}
                placeholder="e.g. Photo by Yash Raut – Mehrangarh Fort, Jodhpur"
                className="bg-slate-950 border-slate-800 text-white text-xs rounded-xl"
              />
            </div>

            {/* Thumbnail Preview */}
            {imgUrl && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                  <img src={imgUrl} alt="preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <p className="text-emerald-400 font-semibold text-xs mb-0.5">Photo Selected!</p>
                  <p className="text-slate-400 italic truncate text-[11px]">{imgCaption || 'No caption'}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowImageModal(false)}
                className="border-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!imgUrl || uploading}
                onClick={insertImageToContent}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold gap-1.5 shadow-md shadow-orange-500/20"
              >
                <Check className="w-3.5 h-3.5" />
                Insert Photo into Blog
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl text-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4 text-orange-400" /> Insert Link
            </h3>
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com or /trips/..."
              className="bg-slate-950 border-slate-800 text-white text-xs rounded-xl"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowLinkModal(false)}
                className="border-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={insertLink}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold"
              >
                Insert Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

