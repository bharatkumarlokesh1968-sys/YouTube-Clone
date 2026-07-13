import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiMenu3Line, RiSearchLine, RiVideoAddLine, RiBellLine, RiCloseLine, RiMicLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import { getAvatarUrl } from '../../utils/helpers';

export default function Navbar({ onMenuClick }) {
  const [query, setQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-yt-dark border-b border-yt-border">
      {/* Left */}
      <div className="flex items-center gap-4 min-w-[180px]">
        <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-yt-hover transition-colors">
          <RiMenu3Line size={22} />
        </button>
        <Link to="/" className="flex items-center gap-1">
          <svg height="20" viewBox="0 0 90 20" className="fill-yt-red">
            <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"/>
            <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" className="fill-white"/>
          </svg>
          <span className="text-white font-bold text-lg tracking-tight hidden sm:block">YourTube</span>
        </Link>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-2xl mx-4">
        <form onSubmit={handleSearch} className="flex">
          <div className="flex flex-1 border border-yt-border rounded-l-full overflow-hidden focus-within:border-blue-500">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-yt-dark px-5 py-2 text-sm outline-none placeholder-yt-subtext"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="px-3 text-yt-subtext hover:text-white">
                <RiCloseLine size={18} />
              </button>
            )}
          </div>
          <button type="submit" className="px-5 bg-yt-surface border border-l-0 border-yt-border rounded-r-full hover:bg-yt-hover transition-colors">
            <RiSearchLine size={18} />
          </button>
          <button type="button" className="ml-3 p-2 rounded-full bg-yt-surface hover:bg-yt-hover transition-colors hidden sm:flex items-center">
            <RiMicLine size={18} />
          </button>
        </form>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 min-w-[180px] justify-end">
        {user ? (
          <>
            <Link to="/upload" className="p-2 rounded-full hover:bg-yt-hover transition-colors hidden sm:flex">
              <RiVideoAddLine size={22} />
            </Link>
            <button className="p-2 rounded-full hover:bg-yt-hover transition-colors relative hidden sm:flex">
              <RiBellLine size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yt-red rounded-full" />
            </button>
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img src={getAvatarUrl(user.avatar, user.username)} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-10 w-56 bg-yt-surface rounded-xl shadow-xl border border-yt-border py-2 animate-fade-in z-50">
                  <div className="px-4 py-2 border-b border-yt-border">
                    <p className="font-medium text-sm">{user.channelName || user.username}</p>
                    <p className="text-xs text-yt-subtext">@{user.username}</p>
                  </div>
                  <Link to={`/channel/${user._id}`} onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-yt-hover transition-colors">Your channel</Link>
                  <Link to="/upload" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-yt-hover transition-colors">Upload video</Link>
                  <hr className="border-yt-border my-1" />
                  <button onClick={() => { logout(); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-yt-hover transition-colors text-yt-subtext">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="flex items-center gap-2 border border-blue-500 text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-500/10 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
