import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiUploadCloud2Line, RiImageAddLine, RiCloseLine } from 'react-icons/ri';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../utils/helpers';

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const thumbRef = useRef(null);

  const [form, setForm] = useState({ title: '', description: '', category: 'Other', tags: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-lg font-medium">Sign in to upload videos</p>
      <button onClick={() => navigate('/login')} className="btn-red">Sign in</button>
    </div>
  );

  const handleThumb = (e) => {
    const f = e.target.files[0];
    if (f) { setThumbFile(f); setThumbPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return setError('Please select a video file');
    if (!form.title.trim()) return setError('Please enter a title');
    setUploading(true); setError(''); setProgress(0);
    try {
      const fd = new FormData();
      fd.append('video', videoFile);
      if (thumbFile) fd.append('thumbnail', thumbFile);
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('tags', form.tags);
      const { data } = await API.post('/videos/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      navigate(`/watch/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Upload video</h1>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video drop zone */}
        {!videoFile ? (
          <div onClick={() => videoRef.current.click()}
            className="border-2 border-dashed border-yt-border rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors group">
            <RiUploadCloud2Line size={52} className="text-yt-subtext group-hover:text-blue-500 transition-colors mb-4" />
            <p className="font-medium text-lg mb-1">Drag & drop or click to upload</p>
            <p className="text-yt-subtext text-sm">MP4, MOV, AVI, MKV (max 100MB)</p>
            <input ref={videoRef} type="file" accept="video/*" hidden onChange={(e) => setVideoFile(e.target.files[0])} />
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-yt-surface rounded-xl border border-yt-border">
            <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{videoFile.name}</p>
              <p className="text-xs text-yt-subtext">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button type="button" onClick={() => setVideoFile(null)} className="p-1 hover:bg-yt-hover rounded-full transition-colors"><RiCloseLine /></button>
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Title <span className="text-yt-red">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-yt-surface border border-yt-border rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors"
              placeholder="Add a title that describes your video"
              maxLength={150}
            />
            <p className="text-xs text-yt-subtext mt-1 text-right">{form.title.length}/150</p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full bg-yt-surface border border-yt-border rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors resize-none"
              placeholder="Tell viewers about your video"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-yt-surface border border-yt-border rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors">
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full bg-yt-surface border border-yt-border rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors"
              placeholder="react, tutorial, programming" />
          </div>

          {/* Thumbnail */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Thumbnail</label>
            <div className="flex gap-4 items-start">
              <div onClick={() => thumbRef.current.click()}
                className="w-40 h-24 border-2 border-dashed border-yt-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors overflow-hidden flex-shrink-0">
                {thumbPreview ? (
                  <img src={thumbPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <><RiImageAddLine size={24} className="text-yt-subtext mb-1" /><span className="text-xs text-yt-subtext">Upload thumbnail</span></>
                )}
              </div>
              <p className="text-xs text-yt-subtext mt-2">Upload a picture that shows what's in your video. A good thumbnail stands out and draws viewers' attention. 1280×720px (16:9) recommended.</p>
              <input ref={thumbRef} type="file" accept="image/*" hidden onChange={handleThumb} />
            </div>
          </div>
        </div>

        {/* Upload progress */}
        {uploading && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex justify-between text-sm">
              <span className="text-yt-subtext">Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-yt-surface rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
          <button type="submit" disabled={uploading || !videoFile}
            className="btn-red disabled:opacity-40 disabled:cursor-not-allowed">
            {uploading ? 'Uploading...' : 'Upload video'}
          </button>
        </div>
      </form>
    </div>
  );
}
