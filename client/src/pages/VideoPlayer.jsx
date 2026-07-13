import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  RiThumbUpLine, RiThumbUpFill, RiThumbDownLine, RiThumbDownFill,
  RiShareLine, RiPlayListAddLine, RiCheckLine,
} from 'react-icons/ri';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatViews, getTimeAgo, getAvatarUrl, formatSubscribers, getThumbnailUrl } from '../utils/helpers';
import VideoCard from '../components/VideoCard/VideoCard';
import Comments from '../components/Comments/Comments';

export default function VideoPlayer() {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetch = async () => {
      setLoading(true);
      try {
        const [videoRes, relatedRes] = await Promise.all([
          API.get(`/videos/${id}`),
          API.get(`/videos/${id}/related`),
        ]);
        const v = videoRes.data.data;
        setVideo(v);
        setRelated(relatedRes.data.data);
        setSubscriberCount(v.uploader?.subscribers?.length || 0);
        if (user) {
          setLiked(v.likes?.includes(user._id));
          setDisliked(v.dislikes?.includes(user._id));
          const channelRes = await API.get(`/users/${v.uploader?._id}`);
          setSubscribed(channelRes.data.data?.subscribers?.includes(user._id));
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return;
    try {
      const { data } = await API.post(`/videos/${id}/like`);
      setLiked(data.liked);
      if (data.liked) setDisliked(false);
      setVideo(v => ({ ...v, likes: data.liked ? [...(v.likes || []), user._id] : (v.likes || []).filter(x => x !== user._id) }));
    } catch (e) {}
  };

  const handleDislike = async () => {
    if (!user) return;
    try {
      const { data } = await API.post(`/videos/${id}/dislike`);
      setDisliked(data.disliked);
      if (data.disliked) setLiked(false);
    } catch (e) {}
  };

  const handleSubscribe = async () => {
    if (!user) return;
    try {
      const { data } = await API.post(`/users/${video.uploader._id}/subscribe`);
      setSubscribed(data.subscribed);
      setSubscriberCount(c => data.subscribed ? c + 1 : c - 1);
    } catch (e) {}
  };

  if (loading) return (
    <div className="p-6 max-w-7xl mx-auto animate-pulse">
      <div className="aspect-video bg-yt-surface rounded-xl mb-4" />
      <div className="h-6 bg-yt-surface rounded w-3/4 mb-3" />
      <div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-yt-surface" /><div className="flex-1 h-10 bg-yt-surface rounded" /></div>
    </div>
  );

  if (!video) return <div className="p-10 text-center text-yt-subtext">Video not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Player */}
          <div className="rounded-xl overflow-hidden bg-black aspect-video w-full">
            <video
              key={id}
              controls
              autoPlay
              className="w-full h-full"
              poster={getThumbnailUrl(video.thumbnailUrl)}
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser doesn't support HTML5 video.
            </video>
          </div>

          {/* Title */}
          <h1 className="text-lg font-bold mt-4 leading-snug">{video.title}</h1>

          {/* Actions row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <Link to={`/channel/${video.uploader?._id}`} className="flex items-center gap-3 group">
              <img src={getAvatarUrl(video.uploader?.avatar, video.uploader?.username)} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-medium text-sm group-hover:text-yt-subtext transition-colors">{video.uploader?.channelName || video.uploader?.username}</p>
                <p className="text-xs text-yt-subtext">{formatSubscribers(subscriberCount)}</p>
              </div>
            </Link>
            {user && user._id !== video.uploader?._id && (
              <button onClick={handleSubscribe}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${subscribed ? 'bg-yt-surface hover:bg-yt-hover' : 'bg-white text-black hover:bg-gray-200'}`}>
                {subscribed && <RiCheckLine size={16} />}
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <div className="flex rounded-full overflow-hidden bg-yt-surface">
                <button onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-yt-hover border-r border-yt-border transition-colors ${liked ? 'text-white' : 'text-yt-subtext'}`}>
                  {liked ? <RiThumbUpFill size={18} /> : <RiThumbUpLine size={18} />}
                  <span>{formatViews(video.likes?.length || 0)}</span>
                </button>
                <button onClick={handleDislike}
                  className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-yt-hover transition-colors ${disliked ? 'text-white' : 'text-yt-subtext'}`}>
                  {disliked ? <RiThumbDownFill size={18} /> : <RiThumbDownLine size={18} />}
                </button>
              </div>
              <button className="flex items-center gap-2 bg-yt-surface hover:bg-yt-hover px-4 py-2 rounded-full text-sm transition-colors">
                <RiShareLine size={16} /> Share
              </button>
              <button className="flex items-center gap-2 bg-yt-surface hover:bg-yt-hover px-4 py-2 rounded-full text-sm transition-colors hidden sm:flex">
                <RiPlayListAddLine size={16} /> Save
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-yt-surface rounded-xl p-4 mt-4">
            <p className="text-sm font-medium">
              {formatViews(video.views)} views · {getTimeAgo(video.createdAt)}
              {video.tags?.length > 0 && <span className="text-blue-400 ml-2">{video.tags.map(t => `#${t}`).join(' ')}</span>}
            </p>
            <div className={`mt-2 text-sm leading-relaxed whitespace-pre-line ${!showFullDesc ? 'line-clamp-3' : ''}`}>
              {video.description || 'No description provided.'}
            </div>
            {video.description?.length > 200 && (
              <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-sm font-medium mt-1 hover:text-yt-subtext transition-colors">
                {showFullDesc ? 'Show less' : '...more'}
              </button>
            )}
          </div>

          {/* Comments */}
          <Comments videoId={id} commentCount={video.commentCount} />
        </div>

        {/* Sidebar */}
        <div className="xl:w-96 flex-shrink-0">
          <div className="space-y-3">
            {related.map(v => <VideoCard key={v._id} video={v} horizontal />)}
            {related.length === 0 && <p className="text-yt-subtext text-sm">No related videos.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
