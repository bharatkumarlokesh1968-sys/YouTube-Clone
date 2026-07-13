import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RiCheckLine, RiBellLine } from 'react-icons/ri';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, formatSubscribers } from '../utils/helpers';
import VideoCard from '../components/VideoCard/VideoCard';

const TABS = ['Videos', 'About'];

export default function Channel() {
  const { id } = useParams();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Videos');
  const [subscribed, setSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [chRes, vidRes] = await Promise.all([
          API.get(`/users/${id}`),
          API.get(`/users/${id}/videos`),
        ]);
        setChannel(chRes.data.data);
        setVideos(vidRes.data.data);
        setSubCount(chRes.data.data.subscribers?.length || 0);
        if (user) setSubscribed(chRes.data.data.subscribers?.includes(user._id));
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, [id, user]);

  const handleSubscribe = async () => {
    if (!user) return;
    try {
      const { data } = await API.post(`/users/${id}/subscribe`);
      setSubscribed(data.subscribed);
      setSubCount(c => data.subscribed ? c + 1 : c - 1);
    } catch (e) {}
  };

  if (loading) return (
    <div className="animate-pulse">
      <div className="h-40 bg-yt-surface" />
      <div className="p-6 flex gap-4"><div className="w-24 h-24 rounded-full bg-yt-border" /><div className="flex-1 space-y-2 pt-4"><div className="h-5 bg-yt-border rounded w-48" /><div className="h-3 bg-yt-border rounded w-32" /></div></div>
    </div>
  );

  if (!channel) return <div className="p-10 text-center text-yt-subtext">Channel not found.</div>;

  return (
    <div>
      {/* Banner */}
      <div className="h-32 sm:h-44 bg-gradient-to-r from-yt-surface to-yt-border overflow-hidden">
        {channel.bannerImage && <img src={channel.bannerImage} alt="" className="w-full h-full object-cover" />}
      </div>

      {/* Channel info */}
      <div className="px-4 sm:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <img src={getAvatarUrl(channel.avatar, channel.username)} alt={channel.username}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-yt-dark -mt-10 sm:-mt-12 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{channel.channelName || channel.username}</h1>
              {channel.isVerified && (
                <svg className="w-5 h-5 text-yt-subtext" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              )}
            </div>
            <p className="text-yt-subtext text-sm">@{channel.username} · {formatSubscribers(subCount)} · {videos.length} videos</p>
          </div>
          {user && user._id !== id && (
            <div className="flex gap-2">
              <button onClick={handleSubscribe}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all text-sm ${subscribed ? 'bg-yt-surface hover:bg-yt-hover' : 'bg-white text-black hover:bg-gray-200'}`}>
                {subscribed && <RiCheckLine size={16} />}
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
              {subscribed && (
                <button className="p-2 bg-yt-surface hover:bg-yt-hover rounded-full transition-colors">
                  <RiBellLine size={18} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-yt-border mt-6">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-white' : 'text-yt-subtext hover:text-white'}`}>
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'Videos' && (
            videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                {videos.map(v => <VideoCard key={v._id} video={v} />)}
              </div>
            ) : (
              <div className="text-center py-16 text-yt-subtext">
                <p className="text-4xl mb-3">📹</p>
                <p>This channel hasn't uploaded any videos yet.</p>
              </div>
            )
          )}
          {activeTab === 'About' && (
            <div className="max-w-2xl space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-yt-subtext text-sm leading-relaxed">{channel.channelDescription || 'No description provided.'}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Stats</h3>
                <p className="text-yt-subtext text-sm">Joined {new Date(channel.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                <p className="text-yt-subtext text-sm">{formatSubscribers(subCount)}</p>
                <p className="text-yt-subtext text-sm">{videos.length} videos</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
