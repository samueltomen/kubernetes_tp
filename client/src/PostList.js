import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
  const [posts, setPosts] = useState({});
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost/posts', {
        headers: {
          'Accept': 'application/json'
        },
        withCredentials: false
      });

      console.log('Posts fetched:', res.data);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Error fetching posts. Please refresh the page.');
    }
  };

  useEffect(() => {
    fetchPosts();
    // Rafraîchir les posts toutes les 2 secondes
    const interval = setInterval(fetchPosts, 2000);
    return () => clearInterval(interval);
  }, []);

  const renderedPosts = Object.values(posts).map(post => {
    return (
      <div
        className="card"
        style={{ width: '30%', marginBottom: '20px', padding: '20px' }}
        key={post.id}
      >
        <div className="card-body">
          <h3 className="card-title">{post.title}</h3>
          <div className="card-text">
            <CommentList postId={post.id} />
            <CommentCreate postId={post.id} />
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex flex-row flex-wrap justify-content-between">
        {renderedPosts.length === 0 ? (
          <p>No posts yet. Create one above!</p>
        ) : (
          renderedPosts
        )}
      </div>
    </div>
  );
};

export default PostList;
