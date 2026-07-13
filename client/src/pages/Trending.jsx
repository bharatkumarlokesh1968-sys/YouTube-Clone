import React, { useState, useEffect } from 'react';
import { RiFireLine } from 'react-icons/ri';
import API from '../utils/api';
import VideoCard from '../components/VideoCard/VideoCard';

export default function Trending() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get('/videos/trending');
        setVideos(data.data);
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-yt-red/20 flex items-center justify-center">
          <RiFireLine size={22} className="text-yt-red" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Trending</h1>
          <p className="text-yt-subtext text-xs">Most viewed videos today</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-48 h-28 bg-yt-surface rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-2">
                <div className="h-4 bg-yt-surface rounded w-full" />
                <div className="h-4 bg-yt-surface rounded w-2/3" />
                <div className="h-3 bg-yt-surface rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((v, i) => (
            <div key={v._id} className="flex gap-4 animate-fade-up items-start">
              <span className="text-2xl font-bold text-yt-subtext w-8 text-center pt-3 flex-shrink-0">{i + 1}</span>
              <div className="flex-1"><VideoCard video={v} horizontal /></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
