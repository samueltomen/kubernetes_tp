import React from "react";
import PostCreate from "./PostCreate";
import PostList from "./PostList";

const App = () => {
  return (
    <div className="container">
      <h1>Créer un topic</h1>
      <PostCreate />
      <hr />
      <h1>Post</h1>
      <PostList />
    </div>
  );
};
export default App;
