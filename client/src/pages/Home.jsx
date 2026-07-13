import React, { useState, useEffect } from 'react';
import localVideos from "../data/videos";
import VideoCard from '../components/VideoCard/VideoCard';
import { CATEGORIES } from '../utils/helpers';

export default function Home() {

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {

    setLoading(true);

    setTimeout(() => {
      setVideos(localVideos);
      setLoading(false);
    }, 1000);

  }, [activeCategory]);

  return (

    <div className="px-4 pb-8">

      {/* Category chips */}

      <div className="sticky top-14 z-30 bg-yt-dark py-3 -mx-4 px-4">

        <div className="flex gap-2 overflow-x-auto no-scrollbar">

          {CATEGORIES.map(cat => (

            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? 'chip-active' : 'chip'}
            >
              {cat}
            </button>

          ))}

        </div>

      </div>

      {loading ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 pt-4">

          {[...Array(8)].map((_, i) => (

            <div key={i} className="animate-pulse">

              <div className="aspect-video bg-gray-700 rounded-xl mb-3" />

              <div className="flex gap-3">

                <div className="w-9 h-9 rounded-full bg-gray-700 flex-shrink-0" />

                <div className="flex-1 space-y-2">

                  <div className="h-3 bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />

                </div>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">

          {videos.map((video) => (

            <div
              key={video.id}
              className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition duration-300"
            >

              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-3">

                <h2 className="text-white font-semibold text-lg line-clamp-2">
                  {video.title}
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  {video.channel}
                </p>

                <p className="text-gray-500 text-xs mt-1">
                  {video.views}
                </p>

                <video
                  controls
                  className="w-full mt-3 rounded-lg"
                >
                  <source src={video.videoUrl} type="video/mp4" />
                </video>

              </div>

            </div>

          ))}

          {videos.length === 0 && (

            <div className="col-span-full text-center py-20 text-gray-400">

              <p className="text-4xl mb-3">🎬</p>

              <p className="text-lg font-medium text-white">
                No videos found
              </p>

              <p className="text-sm mt-1">
                Try another category.
              </p>

            </div>

          )}

        </div>

      )}

    </div>
  );
}