import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import VideoCard from '../components/VideoCard/VideoCard';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('relevance');

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/search?q=${encodeURIComponent(q)}&sort=${sort}`);
        setVideos(data.data);
      } catch (e) {}
      setLoading(false);
    };
    if (q) search();
  }, [q, sort]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-yt-subtext text-sm">
          {loading ? 'Searching...' : `${videos.length} results for "${q}"`}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-yt-subtext">Sort by:</span>
          {['relevance', 'views', 'likes'].map(s => (
            <button key={s} onClick={() => setSort(s)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${sort === s ? 'bg-white text-black' : 'bg-yt-surface hover:bg-yt-hover'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-64 h-36 bg-yt-surface rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-2">
                <div className="h-4 bg-yt-surface rounded w-full" />
                <div className="h-4 bg-yt-surface rounded w-3/4" />
                <div className="h-3 bg-yt-surface rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">No results for "{q}"</p>
          <p className="text-yt-subtext text-sm mt-2">Try different keywords or check your spelling.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map(v => (
            <div key={v._id} className="flex gap-4 animate-fade-up">
              <div className="w-64 flex-shrink-0">
                <VideoCard video={v} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
