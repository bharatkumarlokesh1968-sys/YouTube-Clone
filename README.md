<<<<<<< HEAD
# 🎬 YourTube — Full-Stack YouTube Clone

A production-ready YouTube clone built with **React + Vite**, **Node.js/Express**, and **MongoDB**.

---

## 🗂️ Project Structure

```
youtube-clone/
├── client/                          # React frontend (Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx                 # Entry point
│       ├── App.jsx                  # Root with Router & Routes
│       ├── index.css                # Global Tailwind styles
│       ├── components/
│       │   ├── Navbar/
│       │   │   └── Navbar.jsx       # Top navigation bar
│       │   ├── Sidebar/
│       │   │   └── Sidebar.jsx      # Left sidebar navigation
│       │   ├── VideoCard/
│       │   │   └── VideoCard.jsx    # Video grid/list card
│       │   └── Comments/
│       │       └── Comments.jsx     # Comments section + replies
│       ├── pages/
│       │   ├── Home.jsx             # Home feed with category chips
│       │   ├── VideoPlayer.jsx      # Video player with likes/subscribe
│       │   ├── Search.jsx           # Search results page
│       │   ├── Channel.jsx          # Channel profile page
│       │   ├── Login.jsx            # Login page
│       │   ├── Register.jsx         # Registration page
│       │   ├── Upload.jsx           # Video upload page
│       │   ├── Trending.jsx         # Trending videos
│       │   └── Subscriptions.jsx    # Subscription feed
│       ├── context/
│       │   └── AuthContext.jsx      # Auth state (login/register/logout)
│       └── utils/
│           ├── api.js               # Axios instance with JWT interceptors
│           └── helpers.js           # formatViews, getTimeAgo, etc.
│
├── server/                          # Node.js + Express backend
│   ├── server.js                    # Main Express app entry
│   ├── seed.js                      # DB seed script (dummy data)
│   ├── package.json
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── User.js                  # User schema + bcrypt hooks
│   │   ├── Video.js                 # Video schema
│   │   └── Comment.js               # Comment + replies schema
│   ├── controllers/
│   │   ├── authController.js        # Register, login, getMe
│   │   ├── userController.js        # Profile, subscribe, channel videos
│   │   ├── videoController.js       # CRUD, likes, trending, related
│   │   ├── commentController.js     # Comments, replies, likes
│   │   └── searchController.js      # Full-text search
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── videoRoutes.js
│   │   ├── commentRoutes.js
│   │   └── searchRoutes.js
│   └── middleware/
│       ├── authMiddleware.js        # JWT protect + optionalAuth
│       └── uploadMiddleware.js      # Multer video/image upload
│
├── .env                             # Environment variables
├── .gitignore
├── package.json                     # Root scripts (concurrently)
└── README.md
```

---

## ⚡ Prerequisites

- **Node.js** v18+ 
- **MongoDB** running locally (`mongod`) or a MongoDB Atlas URI
- **npm** or **yarn**

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd youtube-clone

# Install all dependencies at once
npm run install:all
```

Or manually:
```bash
npm install            # root
cd client && npm install
cd ../server && npm install
```

### 2. Configure Environment

Edit `.env` in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/youtube-clone
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=100000000
```

### 3. Seed the Database (Optional but Recommended)

```bash
cd server
node seed.js
```

This creates **5 users**, **25 videos**, and **sample comments**.

**Demo credentials after seeding:**
| Email | Password | Channel |
|-------|----------|---------|
| tech@example.com | password123 | Tech Guru ✓ |
| music@example.com | password123 | Music Vibes ✓ |
| gamer@example.com | password123 | Gamer Zone |

### 4. Run the App

```bash
# From root — starts both client and server
npm run dev
```

Or separately:
```bash
npm run server   # http://localhost:5000
npm run client   # http://localhost:5173
```

Open **http://localhost:5173** 🎉

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (auth) |

### Videos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos` | Get all videos (optional ?category=) |
| GET | `/api/videos/trending` | Get trending videos |
| GET | `/api/videos/:id` | Get single video (increments views) |
| GET | `/api/videos/:id/related` | Related videos |
| POST | `/api/videos/upload` | Upload video (auth, multipart) |
| PUT | `/api/videos/:id` | Update video (auth) |
| DELETE | `/api/videos/:id` | Delete video (auth) |
| POST | `/api/videos/:id/like` | Toggle like (auth) |
| POST | `/api/videos/:id/dislike` | Toggle dislike (auth) |

### Users/Channels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user/channel |
| PUT | `/api/users/update` | Update profile (auth) |
| POST | `/api/users/:id/subscribe` | Toggle subscribe (auth) |
| GET | `/api/users/:id/videos` | Get channel videos |
| GET | `/api/users/feed` | Subscription feed (auth) |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/:videoId/comments` | Get video comments |
| POST | `/api/comments/:videoId/comments` | Add comment (auth) |
| PUT | `/api/comments/comments/:id` | Edit comment (auth) |
| DELETE | `/api/comments/comments/:id` | Delete comment (auth) |
| POST | `/api/comments/comments/:id/like` | Like comment (auth) |
| POST | `/api/comments/comments/:id/reply` | Add reply (auth) |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=term` | Search videos |
| GET | `/api/search?q=term&type=channel` | Search channels |
| GET | `/api/search?q=term&sort=views` | Sort by views |

---

## ✨ Features

- 🎬 **Video browsing** with category filters (Gaming, Music, Tech, etc.)
- 🔍 **Search** with sort by relevance, views, or likes
- 📺 **Video player** with HTML5 `<video>` element
- 👤 **Auth** — JWT-based register/login/logout
- ❤️ **Likes/Dislikes** on videos and comments
- 🔔 **Subscribe/Unsubscribe** to channels
- 💬 **Comments** with replies and likes
- 📤 **Video upload** with thumbnail and metadata
- 📊 **Channel profile** with subscriber count and video grid
- 🔥 **Trending** page sorted by views
- 📰 **Subscriptions feed**
- 🌑 **Dark mode** (YouTube-style)
- 📱 **Responsive** — works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS, React Icons |
| HTTP | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Upload | Multer |

---

## 🔧 Common Issues

**MongoDB connection error:**  
Make sure MongoDB is running: `mongod` or use a MongoDB Atlas URI in `.env`.

**CORS errors:**  
Ensure `CLIENT_URL` in `.env` matches your Vite dev server URL.

**Port in use:**  
Change `PORT` in `.env` (server) or the port in `vite.config.js` (client).

**Upload not working:**  
The `server/uploads/` directory is created automatically on first upload.
=======
# YouTube-Clone
2000
>>>>>>> 3fc31f48dbbb4256bdb5a555fd18dbfcf2f9540d
