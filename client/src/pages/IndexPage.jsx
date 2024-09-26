import Post from "@/components/Post";
import React, { useEffect, useState } from "react";
import axios from "axios";

const IndexPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/posts/get").then((response) => {
      const getPosts = response.data.data;
      setPosts(getPosts);
    });
  }, []);

  return (
    <div className="mt-6 flex flex-col items-center space-y-8 px-4 lg:px-0">
      {posts.length > 0 ? (
        posts.map((post, index) => <Post {...post} key={index} />)
      ) : (
        <p className="text-gray-500">No posts available.</p>
      )}
    </div>
  );
};

export default IndexPage;
