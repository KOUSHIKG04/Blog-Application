import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";

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

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const navigate = useNavigate();

  async function createNewPost(e) {
    const sanitizedContent = DOMPurify.sanitize(content);
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", sanitizedContent);
    data.set("files", files[0]);
    e.preventDefault();

    try {
      const res = await axios
        .post("http://localhost:3000/api/posts/posts", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        })
        .then((response) => {
          toast.success("Post created successfully");
          navigate("/");
        });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const { errors } = error.response.data;
        errors.forEach((err) => {
          toast.error(`${err.path[0]}: ${err.message}`);
        });
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form
        onSubmit={createNewPost}
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
          POST
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
