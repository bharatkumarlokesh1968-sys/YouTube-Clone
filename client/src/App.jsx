import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMini, setSidebarMini] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-yt-dark text-yt-text">
          <Navbar onMenuClick={() => setSidebarMini(!sidebarMini)} />
          <div className="flex pt-14">
            <Sidebar mini={sidebarMini} />
            <main className={`flex-1 min-w-0 transition-all duration-200 ${sidebarMini ? 'ml-16' : 'ml-60'}`}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/watch/:id" element={<VideoPlayer />} />
                <Route path="/search" element={<Search />} />
                <Route path="/channel/:id" element={<Channel />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}
