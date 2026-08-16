import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MdSettings,
  MdPerson,
  MdCloudUpload,
  MdLogout,
  MdChevronRight,
  MdNotifications
} from 'react-icons/md';

import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="px-4 sm:px-8 py-6 max-w-4xl mx-auto">

      {/* Title */}
      <div className="flex items-center gap-3 mb-8">
        <MdSettings size={28} />

        <h1 className="text-2xl font-bold">
          Settings
        </h1>
      </div>

      {/* Account */}
      <div className="bg-yt-surface border border-yt-border rounded-xl mb-6">

        <div className="p-5 border-b border-yt-border">
          <h2 className="text-lg font-semibold">
            Account
          </h2>

          <p className="text-sm text-yt-subtext mt-1">
            Your account information
          </p>
        </div>

        {user && (
          <div className="p-5 flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
              {user.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="font-medium">
                {user.channelName || user.username}
              </p>

              <p className="text-sm text-yt-subtext">
                @{user.username}
              </p>

              <p className="text-sm text-yt-subtext">
                {user.email}
              </p>
            </div>

          </div>
        )}

      </div>

      {/* Channel */}
      {user && (
        <div className="bg-yt-surface border border-yt-border rounded-xl mb-6">

          <div className="p-5 border-b border-yt-border">
            <h2 className="text-lg font-semibold">
              Channel
            </h2>

            <p className="text-sm text-yt-subtext mt-1">
              Manage your channel
            </p>
          </div>

          {/* My Channel */}
          <Link
            to={`/channel/${user._id}`}
            className="flex items-center gap-4 p-5 hover:bg-yt-hover transition-colors"
          >
            <MdPerson size={24} />

            <div className="flex-1">
              <p className="font-medium">
                My Channel
              </p>

              <p className="text-sm text-yt-subtext">
                View your channel
              </p>
            </div>

            <MdChevronRight size={24} />
          </Link>

          {/* Upload */}
          <Link
            to="/upload"
            className="flex items-center gap-4 p-5 border-t border-yt-border hover:bg-yt-hover transition-colors"
          >
            <MdCloudUpload size={24} />

            <div className="flex-1">
              <p className="font-medium">
                Upload Video
              </p>

              <p className="text-sm text-yt-subtext">
                Upload a new video
              </p>
            </div>

            <MdChevronRight size={24} />
          </Link>

          {/* Subscriptions */}
          <Link
            to="/subscriptions"
            className="flex items-center gap-4 p-5 border-t border-yt-border hover:bg-yt-hover transition-colors"
          >
            <MdPerson size={24} />

            <div className="flex-1">
              <p className="font-medium">
                Subscriptions
              </p>

              <p className="text-sm text-yt-subtext">
                View your subscribed channels
              </p>
            </div>

            <MdChevronRight size={24} />
          </Link>

        </div>
      )}

      {/* Notifications */}
      <div className="bg-yt-surface border border-yt-border rounded-xl mb-6">

        <div className="flex items-center gap-4 p-5">

          <MdNotifications size={24} />

          <div className="flex-1">
            <p className="font-medium">
              Notifications
            </p>

            <p className="text-sm text-yt-subtext">
              Notification settings
            </p>
          </div>

          <span className="text-xs text-yt-subtext">
            Coming soon
          </span>

        </div>

      </div>

      {/* Logout */}
      {user && (
        <div className="bg-yt-surface border border-yt-border rounded-xl">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-5 hover:bg-red-500/10 text-red-400 transition-colors"
          >

            <MdLogout size={24} />

            <div className="flex-1 text-left">
              <p className="font-medium">
                Sign out
              </p>

              <p className="text-sm opacity-70">
                Sign out from your YourTube account
              </p>
            </div>

            <MdChevronRight size={24} />

          </button>

        </div>
      )}

    </div>
  );
}