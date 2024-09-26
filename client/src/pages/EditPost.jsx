import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/api/posts/post/${id}`).then((response) => {
      const postInfo = response.data.data;
      setTitle(postInfo.title);
      setSummary(postInfo.summary);
      setContent(postInfo.content);
    });
  }, [id]);

  async function updatePost(e) {
    e.preventDefault();
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (files && files[0]) {
      data.set("files", files[0]); 
    }

    try {
      await axios.put(`http://localhost:3000/api/posts/edit/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      navigate("/");
      toast.success("Post updated successfully");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form
        onSubmit={updatePost}
        className="flex flex-col max-w-md w-full  rounded-lg bg-white mb-28"
      >
        <div className="mb-4">
          <Input
            id="title"
            name="title"
            placeholder=" Title"
            className="border-gray-300  focus:ring focus:ring-blue-200 rounded-lg"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
          />
        </div>

        <div className="mb-4">
          <Input
            id="summary"
            name="summary"
            type="text"
            placeholder="Summary"
            className="border-gray-300  focus:ring focus:ring-blue-200 rounded-lg"
            onChange={(e) => setSummary(e.target.value)}
            value={summary}
            required
          />
        </div>

        <div className="mb-4">
          <Input
            id="picture"
            type="file"
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>

        <div className="mb-4">
          {/* <textarea
            id="content"
            placeholder="Write your content here..."
            rows="10"
            className="w-full p-2 border-2 border-gray-300  rounded-lg shadow-sm resize-none"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          /> */}
          <ReactQuill
        className="border-gray-300  focus:ring focus:ring-blue-200 rounded-lg"
        onChange={(newValue) => setContent(newValue)}
        value={content}
        modules={modules}
        formats={formats}
      />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-200 rounded-lg shadow-md"
        >
         UPDATE POST
        </Button>
      </form>
    </div>
  );
};

export default EditPost;
