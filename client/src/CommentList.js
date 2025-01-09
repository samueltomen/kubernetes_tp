import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:31593/posts/${postId}/comments`,
        {
          headers: {
            'Accept': 'application/json'
          },
          withCredentials: false
        }
      );

      console.log(`Comments fetched for post ${postId}:`, res.data);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Error fetching comments. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Rafraîchir les commentaires toutes les 2 secondes
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [postId]);

  const getCommentContent = (comment) => {
    switch (comment.status) {
      case 'approved':
        return comment.content;
      case 'pending':
        return 'This comment is awaiting moderation';
      case 'rejected':
        return 'This comment has been rejected';
      default:
        return 'Unknown status';
    }
  };

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (comments.length === 0) {
    return <div className="text-muted">No comments yet</div>;
  }

  return (
    <div>
      <h4 className="mb-3">Comments</h4>
      <ul className="list-group">
        {comments.map(comment => (
          <li key={comment.id} className="list-group-item">
            {getCommentContent(comment)}
            {comment.status === 'pending' && (
              <span className="badge bg-warning text-dark ms-2">Pending</span>
            )}
            {comment.status === 'rejected' && (
              <span className="badge bg-danger ms-2">Rejected</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
