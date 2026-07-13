require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Video = require('./models/Video');
const Comment = require('./models/Comment');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/youtube-clone';

const categories = ['Gaming', 'Music', 'Tech', 'Vlog', 'Education', 'Sports', 'Comedy', 'News'];

const sampleUsers = [
  { username: 'techguru', email: 'tech@example.com', password: 'password123', channelName: 'Tech Guru', channelDescription: 'All about technology and gadgets!', avatar: 'https://i.pravatar.cc/150?img=1', isVerified: true },
  { username: 'musicvibes', email: 'music@example.com', password: 'password123', channelName: 'Music Vibes', channelDescription: 'The best music content online.', avatar: 'https://i.pravatar.cc/150?img=2', isVerified: true },
  { username: 'gamerzone', email: 'gamer@example.com', password: 'password123', channelName: 'Gamer Zone', channelDescription: 'Gaming walkthroughs and reviews.', avatar: 'https://i.pravatar.cc/150?img=3' },
  { username: 'dailyvlog', email: 'vlog@example.com', password: 'password123', channelName: 'Daily Vlog', channelDescription: 'My daily life adventures.', avatar: 'https://i.pravatar.cc/150?img=4' },
  { username: 'sciencelab', email: 'science@example.com', password: 'password123', channelName: 'Science Lab', channelDescription: 'Science made fun and easy.', avatar: 'https://i.pravatar.cc/150?img=5', isVerified: true },
];

const videoTitles = [
  ['Top 10 Programming Languages 2024', 'How AI is Changing Software Development', 'Build a Full-Stack App in 1 Hour', 'React vs Vue vs Angular 2024', 'The Future of Web Development'],
  ['Best Chill Music Mix', 'Top Hits of 2024 Compilation', 'Lo-fi Study Beats', 'Piano Covers of Popular Songs', 'Epic Orchestra Soundtracks'],
  ['Minecraft Survival Episode 1', 'Call of Duty Best Moments', 'GTA 6 First Impressions', 'Top 10 RPG Games 2024', 'Chess vs Computers'],
  ['Day in My Life as a Developer', 'Tokyo Travel Vlog', 'Morning Routine 2024', 'Cooking Challenge with Friends', 'Road Trip Across America'],
  ['How Black Holes Work', 'Quantum Physics Explained Simply', 'The Science of Sleep', 'Climate Change Facts 2024', 'Brain Hacks for Better Memory'],
];

const durations = ['4:32', '8:15', '12:47', '6:03', '22:10', '3:58', '15:23', '9:41', '7:17', '18:55'];

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('🔌 Connected to MongoDB');

  await User.deleteMany({});
  await Video.deleteMany({});
  await Comment.deleteMany({});
  console.log('🧹 Cleared existing data');

  const users = [];
  for (const u of sampleUsers) {
    const hashedPw = await bcrypt.hash(u.password, 12);
    const user = await User.create({ ...u, password: hashedPw });
    users.push(user);
  }
  console.log(`👥 Created ${users.length} users`);

  // Add subscriptions
  users[1].subscribers.push(users[0]._id, users[2]._id);
  users[0].subscribers.push(users[1]._id, users[3]._id);
  await users[0].save();
  await users[1].save();

  const videos = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < 5; j++) {
      const cat = categories[i % categories.length];
      const v = await Video.create({
        title: videoTitles[i][j],
        description: `This is an amazing video about ${videoTitles[i][j].toLowerCase()}. Like and subscribe for more content!`,
        videoUrl: `https://www.w3schools.com/html/mov_bbb.mp4`,
        thumbnailUrl: `https://picsum.photos/seed/${i * 10 + j + 100}/1280/720`,
        uploader: users[i]._id,
        views: Math.floor(Math.random() * 2000000),
        likes: [users[(i + 1) % 5]._id, users[(i + 2) % 5]._id],
        category: cat,
        tags: [cat.toLowerCase(), 'trending', '2024'],
        duration: durations[j % durations.length],
      });
      videos.push(v);
    }
  }
  console.log(`🎬 Created ${videos.length} videos`);

  const commentTexts = [
    'This is absolutely amazing content! Keep it up 🔥',
    'I learned so much from this video, thank you!',
    'Best channel on YouTube, no cap 💯',
    'Can you make more videos like this?',
    'This helped me so much with my project!',
    'Subscribed! Worth every second.',
    'The editing on this is top-notch.',
    'Came here from the algorithm and stayed for the content 😂',
  ];

  for (const v of videos.slice(0, 10)) {
    for (let k = 0; k < 3; k++) {
      await Comment.create({
        text: commentTexts[k % commentTexts.length],
        author: users[k % users.length]._id,
        video: v._id,
        likes: [users[(k + 1) % 5]._id],
      });
    }
    await Video.findByIdAndUpdate(v._id, { commentCount: 3 });
  }
  console.log('💬 Created sample comments');

  console.log('\n✅ Seed complete!');
  console.log('📧 Test login: tech@example.com / password123');
  mongoose.disconnect();
};

seed().catch((e) => { console.error(e); process.exit(1); });
