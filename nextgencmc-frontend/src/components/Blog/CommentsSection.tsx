"use client";

import React, { useState } from 'react';

export interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  createdAt: Date;
  isApproved: boolean;
}

interface CommentsSectionProps {
  postId: string;
  initialComments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId, initialComments }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState({
    author: '',
    email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author.trim() || !newComment.email.trim() || !newComment.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        author: newComment.author,
        email: newComment.email,
        content: newComment.content,
        createdAt: new Date(),
        isApproved: true
      };

      setComments(prev => [comment, ...prev]);
      setNewComment({ author: '', email: '', content: '' });
      setIsSubmitting(false);
      
      // Save to localStorage for persistence
      const storedComments = JSON.parse(localStorage.getItem(`comments-${postId}`) || '[]');
      storedComments.unshift(comment);
      localStorage.setItem(`comments-${postId}`, JSON.stringify(storedComments));
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewComment(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Load comments from localStorage on component mount
  React.useEffect(() => {
    const storedComments = localStorage.getItem(`comments-${postId}`);
    if (storedComments) {
      try {
        const parsedComments = JSON.parse(storedComments);
        setComments(parsedComments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        })));
      } catch (error) {
        console.error('Error loading comments from localStorage:', error);
      }
    }
  }, [postId]);

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-black dark:text-white mb-8 flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Leave a Comment</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-body-color mb-2">
                Name *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={newComment.author}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-black dark:text-white"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-body-color mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={newComment.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-black dark:text-white"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-body-color mb-2">
              Comment *
            </label>
            <textarea
              id="content"
              name="content"
              value={newComment.content}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-black dark:text-white"
              placeholder="Share your thoughts..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-body-color">
            <p className="text-lg">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {comment.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="font-semibold text-black dark:text-white">
                      {comment.author}
                    </h5>
                    <span className="text-xs text-body-color bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {comment.isApproved ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-body-color mb-3 leading-relaxed">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-body-color">
                    <span>{comment.email}</span>
                    <span>•</span>
                    <span>
                      {comment.createdAt.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;