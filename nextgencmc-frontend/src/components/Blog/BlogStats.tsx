"use client";

import React, { useState } from 'react';

interface BlogStatsProps {
  postId: string;
  postSlug: string;
  views: number;
  likes: number;
  comments: number;
  readingTime: number;
  initialIsLiked?: boolean;
}

const BlogStats: React.FC<BlogStatsProps> = ({ 
  postId,
  postSlug,
  views, 
  likes, 
  comments, 
  readingTime,
  initialIsLiked = false
}) => {
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleLike = async () => {
    try {
      const response = await fetch('/api/blog/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, postSlug }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentLikes(data.likes);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mb-8 py-6 border-y border-gray-200 dark:border-gray-700">
      {/* Views */}
      <div className="flex items-center gap-2 text-body-color">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="font-medium">{views.toLocaleString()} views</span>
      </div>

      {/* Likes */}
      <button 
        onClick={handleLike}
        className={`flex items-center gap-2 transition-all duration-300 ${
          isLiked 
            ? 'text-red-500 transform scale-110' 
            : 'text-body-color hover:text-red-500'
        }`}
      >
        <svg 
          className="w-5 h-5 transition-all duration-300" 
          fill={isLiked ? "currentColor" : "none"} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="font-medium">{currentLikes.toLocaleString()} likes</span>
      </button>

      {/* Comments */}
      <div className="flex items-center gap-2 text-body-color">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="font-medium">{comments.toLocaleString()} comments</span>
      </div>

      {/* Reading Time */}
      <div className="flex items-center gap-2 text-body-color">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{readingTime} min read</span>
      </div>
    </div>
  );
};

export default BlogStats;