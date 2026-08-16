import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';

import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import Search from './pages/Search';
import Channel from './pages/Channel';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Trending from './pages/Trending';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';

export default function App() {
  const [sidebarMini, setSidebarMini] = useState(false);

  return (
    <AuthProvider>
      <Router>

        <div className="min-h-screen bg-yt-dark text-yt-text">

          {/* Navbar */}
          <Navbar
            onMenuClick={() => setSidebarMini(!sidebarMini)}
          />

          <div className="flex pt-14">

            {/* Sidebar */}
            <Sidebar mini={sidebarMini} />

            {/* Main Content */}
            <main
              className={`flex-1 min-w-0 transition-all duration-200 ${
                sidebarMini ? 'ml-16' : 'ml-60'
              }`}
            >

              <Routes>

                {/* Home */}
                <Route
                  path="/"
                  element={<Home />}
                />

                {/* Video Player */}
                <Route
                  path="/watch/:id"
                  element={<VideoPlayer />}
                />

                {/* Search */}
                <Route
                  path="/search"
                  element={<Search />}
                />

                {/* Channel */}
                <Route
                  path="/channel/:id"
                  element={<Channel />}
                />

                {/* Authentication */}
                <Route
                  path="/login"
                  element={<Login />}
                />

                <Route
                  path="/register"
                  element={<Register />}
                />

                {/* Upload */}
                <Route
                  path="/upload"
                  element={<Upload />}
                />

                {/* Trending */}
                <Route
                  path="/trending"
                  element={<Trending />}
                />

                {/* Subscriptions */}
                <Route
                  path="/subscriptions"
                  element={<Subscriptions />}
                />

                {/* Settings */}
                <Route
                  path="/settings"
                  element={<Settings />}
                />

              </Routes>

            </main>

          </div>

        </div>

      </Router>
    </AuthProvider>
  );
}