import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdSubscriptions } from "react-icons/md";
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard/VideoCard';

export default function Subscriptions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const load = async () => {
      try {
        const { data } = await API.get('/users/feed');
        setVideos(data.data);
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, [user]);

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <RiSubscriptionsLine size={64} className="text-yt-subtext" />
      <h2 className="text-xl font-bold">Don't miss new videos</h2>
      <p className="text-yt-subtext text-sm max-w-xs">Sign in to see updates from your favourite YouTube channels</p>
      <button onClick={() => navigate('/login')} className="btn-red">Sign in</button>
    </div>
  );

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <RiSubscriptionsLine size={24} />
        <h1 className="text-xl font-bold">Subscriptions</h1>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-yt-surface rounded-xl mb-3" />
              <div className="h-3 bg-yt-surface rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 text-yt-subtext">
          <RiSubscriptionsLine size={52} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium text-white">No videos from subscriptions</p>
          <p className="text-sm mt-1">Subscribe to channels to see their videos here.</p>
          <Link to="/" className="btn-red inline-block mt-4">Explore videos</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map(v => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  );
}
