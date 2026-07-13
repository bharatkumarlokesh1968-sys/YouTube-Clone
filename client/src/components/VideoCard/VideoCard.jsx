import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiMoreLine, RiPlayListAddLine, RiShareLine, RiEyeOffLine } from 'react-icons/ri';
import { formatViews, getTimeAgo, getAvatarUrl, getThumbnailUrl } from '../../utils/helpers';

export default function VideoCard({ video, horizontal = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (!video) return null;

  const uploader = video.uploader || {};

  if (horizontal) {
    return (
      <div className="flex gap-3 animate-fade-up">
        <Link to={`/watch/${video._id}`} className="relative flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden bg-yt-surface group">
          <img src={getThumbnailUrl(video.thumbnailUrl)} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">{video.duration || '0:00'}</span>
        </Link>
        <div className="flex-1 min-w-0 pt-1">
          <Link to={`/watch/${video._id}`} className="font-medium text-sm line-clamp-2 hover:text-yt-subtext transition-colors">{video.title}</Link>
          <Link to={`/channel/${uploader._id}`} className="text-xs text-yt-subtext hover:text-white mt-1 block transition-colors">{uploader.channelName || uploader.username}</Link>
          <p className="text-xs text-yt-subtext">{formatViews(video.views)} views · {getTimeAgo(video.createdAt)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up group" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Thumbnail */}
      <Link to={`/watch/${video._id}`} className="relative block rounded-xl overflow-hidden bg-yt-surface aspect-video">
        <img
          src={getThumbnailUrl(video.thumbnailUrl)}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
          {video.duration || '0:00'}
        </span>
        {hovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center">
              <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex gap-3 mt-3">
        <Link to={`/channel/${uploader._id}`} className="flex-shrink-0">
          <img src={getAvatarUrl(uploader.avatar, uploader.username)} alt={uploader.username}
            className="w-9 h-9 rounded-full object-cover hover:opacity-80 transition-opacity" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-1">
            <Link to={`/watch/${video._id}`} className="font-medium text-sm line-clamp-2 leading-snug flex-1 hover:text-gray-300 transition-colors">
              {video.title}
            </Link>
            <div className="relative flex-shrink-0 mt-0.5">
              <button
                onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
                className="p-1 rounded-full hover:bg-yt-hover opacity-0 group-hover:opacity-100 transition-all"
              >
                <RiMoreLine size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 w-48 bg-yt-surface rounded-xl shadow-xl border border-yt-border py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setMenuOpen(false)}>
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-yt-hover transition-colors">
                    <RiPlayListAddLine size={16} /> Save to playlist
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-yt-hover transition-colors">
                    <RiShareLine size={16} /> Share
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-yt-hover transition-colors">
                    <RiEyeOffLine size={16} /> Not interested
                  </button>
                </div>
              )}
            </div>
          </div>
          <Link to={`/channel/${uploader._id}`} className="flex items-center gap-1 text-xs text-yt-subtext hover:text-white mt-1 transition-colors">
            {uploader.channelName || uploader.username}
            {uploader.isVerified && (
              <svg className="w-3 h-3 text-yt-subtext" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            )}
          </Link>
          <p className="text-xs text-yt-subtext">
            {formatViews(video.views)} views · {getTimeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
