import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  RiHomeFill,
  RiFireLine,
  RiHistoryLine,
  RiThumbUpLine,
  RiPlayListLine,
  RiSettings3Line,
  RiQuestionLine,
  RiMusicLine,
  RiGamepadLine,
  RiNewspaperLine,
  RiTrophyLine,
  RiLightbulbLine,
} from 'react-icons/ri';

import { MdSubscriptions } from "react-icons/md";

import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { icon: RiHomeFill, label: 'Home', path: '/' },
  { icon: RiFireLine, label: 'Trending', path: '/trending' },
  { icon: MdSubscriptions, label: 'Subscriptions', path: '/subscriptions' },
];

const LIBRARY_ITEMS = [
  { icon: RiHistoryLine, label: 'History', path: '/history' },
  { icon: RiPlayListLine, label: 'Playlists', path: '/playlists' },
  { icon: RiThumbUpLine, label: 'Liked Videos', path: '/liked' },
];

const EXPLORE_ITEMS = [
  { icon: RiMusicLine, label: 'Music', path: '/search?q=music&type=video' },
  { icon: RiGamepadLine, label: 'Gaming', path: '/search?q=gaming&type=video' },
  { icon: RiNewspaperLine, label: 'News', path: '/search?q=news&type=video' },
  { icon: RiTrophyLine, label: 'Sports', path: '/search?q=sports&type=video' },
  { icon: RiLightbulbLine, label: 'Learning', path: '/search?q=education&type=video' },
];

export default function Sidebar({ mini }) {

  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  if (mini) {
    return (
      <aside className="fixed left-0 top-14 bottom-0 w-16 bg-yt-dark flex flex-col items-center pt-2 gap-1 z-40">

        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (

          <Link
            key={path}
            to={path}
            title={label}
            className={`flex flex-col items-center gap-1 w-14 py-3 rounded-xl hover:bg-yt-hover transition-colors ${
              isActive(path) ? 'bg-yt-hover' : ''
            }`}
          >
            <Icon size={20} />
            <span className="text-[9px]">{label}</span>

          </Link>
        ))}

      </aside>
    );
  }

  return (

    <aside className="fixed left-0 top-14 bottom-0 w-60 bg-yt-dark overflow-y-auto z-40 px-2">

      <div className="py-2">

        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (

          <Link
            key={path}
            to={path}
            className={isActive(path) ? 'sidebar-item-active' : 'sidebar-item'}
          >

            <Icon size={20} />
            <span>{label}</span>

          </Link>
        ))}

      </div>

      <hr className="border-yt-border my-2" />

      {user && (
        <>

          <div className="py-2">

            <p className="px-3 py-1 text-sm font-medium mb-1">
              You
            </p>

            {LIBRARY_ITEMS.map(({ icon: Icon, label, path }) => (

              <Link
                key={path}
                to={path}
                className="sidebar-item"
              >

                <Icon size={20} />
                <span>{label}</span>

              </Link>

            ))}

          </div>

          <hr className="border-yt-border my-2" />

        </>
      )}

      <div className="py-2">

        <p className="px-3 py-1 text-sm font-medium mb-1">
          Explore
        </p>

        {EXPLORE_ITEMS.map(({ icon: Icon, label, path }) => (

          <Link
            key={path}
            to={path}
            className="sidebar-item"
          >

            <Icon size={20} />
            <span>{label}</span>

          </Link>

        ))}

      </div>

      <hr className="border-yt-border my-2" />

      <div className="py-2">

        <Link to="/settings" className="sidebar-item">

          <RiSettings3Line size={20} />
          <span>Settings</span>

        </Link>

        <Link to="/help" className="sidebar-item">

          <RiQuestionLine size={20} />
          <span>Help</span>

        </Link>

      </div>

      <div className="px-3 py-4 text-[11px] text-yt-subtext">

        <p>© 2024 YourTube Clone</p>

        <p className="mt-1">
          Built with React + Node.js
        </p>

      </div>

    </aside>
  );
}