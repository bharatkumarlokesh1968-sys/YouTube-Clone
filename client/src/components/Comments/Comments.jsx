import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiThumbUpLine, RiThumbUpFill, RiReplyLine } from 'react-icons/ri';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getAvatarUrl, getTimeAgo, formatViews } from '../../utils/helpers';

function CommentItem({ comment, onLike }) {
  const { user } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const liked = user && comment.likes?.includes(user._id);

  return (
    <div className="flex gap-3 py-3">
      <Link to={`/channel/${comment.author?._id}`}>
        <img src={getAvatarUrl(comment.author?.avatar, comment.author?.username)} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link to={`/channel/${comment.author?._id}`} className="text-sm font-medium hover:text-yt-subtext transition-colors">
            @{comment.author?.username}
          </Link>
          <span className="text-xs text-yt-subtext">{getTimeAgo(comment.createdAt)}</span>
          {comment.isEdited && <span className="text-xs text-yt-subtext">(edited)</span>}
        </div>
        <p className="text-sm mt-1 leading-relaxed">{comment.text}</p>
        <div className="flex items-center gap-4 mt-2">
          <button onClick={() => onLike(comment._id)} className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-white' : 'text-yt-subtext hover:text-white'}`}>
            {liked ? <RiThumbUpFill size={14} /> : <RiThumbUpLine size={14} />}
            {comment.likes?.length > 0 && <span>{formatViews(comment.likes.length)}</span>}
          </button>
          {user && (
            <button onClick={() => setShowReply(!showReply)} className="flex items-center gap-1 text-xs text-yt-subtext hover:text-white transition-colors">
              <RiReplyLine size={14} /> Reply
            </button>
          )}
        </div>
        {showReply && (
          <div className="flex gap-2 mt-2">
            <img src={getAvatarUrl(user?.avatar, user?.username)} alt="" className="w-6 h-6 rounded-full" />
            <input
              className="flex-1 bg-transparent border-b border-yt-border text-sm outline-none focus:border-white pb-1"
              placeholder="Add a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>
        )}
        {comment.replies?.length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">{comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</summary>
            <div className="mt-2 space-y-2 pl-2">
              {comment.replies.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <img src={getAvatarUrl(r.author?.avatar, r.author?.username)} alt="" className="w-6 h-6 rounded-full" />
                  <div>
                    <span className="text-xs font-medium">@{r.author?.username}</span>
                    <span className="text-xs text-yt-subtext ml-2">{getTimeAgo(r.createdAt)}</span>
                    <p className="text-xs mt-0.5">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

export default function Comments({ videoId, commentCount }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [focused, setFocused] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get(`/comments/${videoId}/comments`);
        setComments(data.data);
      } catch (e) {}
      setLoading(false);
    };
    if (videoId) load();
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const { data } = await API.post(`/comments/${videoId}/comments`, { text });
      setComments([data.data, ...comments]);
      setText('');
      setFocused(false);
    } catch (e) {}
  };

  const handleLike = async (commentId) => {
    if (!user) return;
    try {
      await API.post(`/comments/comments/${commentId}/like`);
      setComments(comments.map(c => {
        if (c._id !== commentId) return c;
        const liked = c.likes.includes(user._id);
        return { ...c, likes: liked ? c.likes.filter(id => id !== user._id) : [...c.likes, user._id] };
      }));
    } catch (e) {}
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">{commentCount || comments.length} Comments</h3>

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <img src={getAvatarUrl(user.avatar, user.username)} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
          <div className="flex-1">
            <input
              className="w-full bg-transparent border-b border-yt-border text-sm outline-none focus:border-white pb-2 transition-colors"
              placeholder="Add a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocused(true)}
            />
            {focused && (
              <div className="flex justify-end gap-2 mt-2 animate-fade-in">
                <button type="button" onClick={() => { setFocused(false); setText(''); }} className="btn-ghost text-xs py-1.5 px-3">Cancel</button>
                <button type="submit" disabled={!text.trim()} className="btn-red text-xs py-1.5 px-3 disabled:opacity-40 disabled:cursor-not-allowed">Comment</button>
              </div>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-yt-surface" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-yt-surface rounded w-32" />
                <div className="h-3 bg-yt-surface rounded w-full" />
                <div className="h-3 bg-yt-surface rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-yt-border">
          {comments.map(c => <CommentItem key={c._id} comment={c} onLike={handleLike} />)}
          {comments.length === 0 && <p className="text-yt-subtext text-sm py-4">No comments yet. Be the first!</p>}
        </div>
      )}
    </div>
  );
}
