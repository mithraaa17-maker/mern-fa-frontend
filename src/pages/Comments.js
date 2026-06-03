import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { useAppContext } from '../context/AppContext';
import { formatDateTime } from '../utils/helpers';
import '../styles/comments.css';

const Comments = () => {
  const { state, dispatch } = useAppContext();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueId, setIssueId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (issueId) {
      fetchComments();
    }
  }, [issueId]);

  const fetchComments = async () => {
    try {
      const response = await apiService.getComments(issueId);
      setComments(response.data.data.comments);
      dispatch({ type: 'SET_COMMENTS', payload: response.data.data.comments });
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.createComment(issueId, message);
      setComments([...comments, response.data.data]);
      dispatch({ type: 'ADD_COMMENT', payload: response.data.data });
      setMessage('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete comment?')) {
      try {
        await apiService.deleteComment(commentId);
        setComments(comments.filter(c => c._id !== commentId));
        dispatch({ type: 'DELETE_COMMENT', payload: commentId });
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  return (
    <div className="comments-container">
      <h1>Comments</h1>
      
      <div className="comment-input">
        <input
          type="text"
          placeholder="Enter Issue ID"
          value={issueId}
          onChange={(e) => setIssueId(e.target.value)}
        />
      </div>

      {issueId && (
        <>
          <form onSubmit={handleAddComment} className="add-comment-form">
            <textarea
              placeholder="Add a comment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">Post Comment</button>
          </form>

          <div className="comments-list">
            {loading ? (
              <div className="loading">Loading comments...</div>
            ) : comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-header">
                    <strong>{comment.user?.name || 'Unknown'}</strong>
                    <span className="comment-time">
                      {formatDateTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="comment-message">{comment.message}</p>
                  {state.authUser?._id === comment.user?._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="btn-danger btn-small"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;
