import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "@/UserContext";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { UserInfo } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/posts/post/${id}`
        );
        setPostInfo(response.data.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("An error occurred while fetching the post.");
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:3000/api/posts/delete/${id}`);
        navigate("/");
        toast.success("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("An error occurred while deleting the post.");
      }
    }
  };

  if (!postInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={`http://localhost:3000/${postInfo.cover}`}
            alt={postInfo.title}
            className="w-full h-96 object-cover"
          />
        </div>

        <div className="p-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {postInfo.title}
          </h1>
          <div className="mb-4 text-gray-500">
            <span className="font-semibold mr-2">
              {format(new Date(postInfo.createdAt), "dd MMM yyyy, HH:mm")}
            </span>
            <span className="font-semibold text-gray-700">
              {postInfo.author.username}
            </span>
          </div>

          <div className="flex justify-between mb-4">
            {UserInfo && UserInfo.id === postInfo.author._id && (
              <div className="flex space-x-2">
                <Link to={`/edit/${postInfo._id}`}>
                  <Button className="flex items-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 shadow-lg transition duration-200 ease-in-out">
                    <FilePenLine className="h-4 w-4 " />
                   
                  </Button>
                </Link>
                <Button
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 shadow-lg transition duration-200 ease-in-out"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 " />
                 
                </Button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div
              className="text-gray-700 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: postInfo.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
