import React, { useState } from 'react';
import axios from 'axios';

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post(
          `http://localhost/posts/${postId}/comments`,
          { content },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            withCredentials: false
          }
      );

      console.log('Comment created:', response.data);
      setContent('');
    } catch (err) {
      console.error('Error creating comment:', err);
      setError('Error creating comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Add a Comment</label>
          <input
            value={content}
            onChange={e => setContent(e.target.value)}
            className="form-control"
            placeholder="Type your comment here..."
          />
        </div>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        <button className="btn btn-primary mt-2" disabled={isSubmitting || !content}>
          {isSubmitting ? 'Adding...' : 'Add Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentCreate;
