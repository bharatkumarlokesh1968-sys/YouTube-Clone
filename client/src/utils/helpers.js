export const formatViews = (views) => {
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views?.toString() || '0';
};

export const formatSubscribers = (count) => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M subscribers`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K subscribers`;
  return `${count || 0} subscribers`;
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
};

export const getAvatarUrl = (avatar, username) => {
  if (avatar && avatar.startsWith('http')) return avatar;
  if (avatar) return avatar;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username || 'U')}&background=FF0000&color=fff&size=128`;
};

export const getThumbnailUrl = (url) => {
  if (!url) return `https://picsum.photos/seed/default/1280/720`;
  if (url.startsWith('http')) return url;
  return url;
};

export const CATEGORIES = ['All', 'Gaming', 'Music', 'Tech', 'Vlog', 'Education', 'Sports', 'Comedy', 'News'];
