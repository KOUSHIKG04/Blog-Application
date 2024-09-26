import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";

const Post = ({ _id, title, summary, content, cover, createdAt, author }) => {
  return (
    <div className="bg-white border shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row w-full max-w-4xl mb-6 transition-transform transform  ">
      <Link to={`/post/${_id}`} className="w-full lg:w-1/3 lg:h-64">
        <img
          src={`http://localhost:3000/${cover}`}
          alt={title}
          className="h-64 lg:h-64 object-cover w-full"
        />
      </Link>

      <div className="w-full p-6 flex flex-col justify-between">
        <div>
          <Link to={`/post/${_id}`}>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 hover:text-blue-500 transition-colors">
              {title}
            </h2>
          </Link>

          <div className="mb-2 text-gray-500">
            <span className="text-gray-700 font-semibold"> {author.username}, </span>
            <time className="font-semibold">
              {format(new Date(createdAt), "dd MMM yyyy, HH:mm")}
            </time>
           
          </div>

          <p className="text-gray-700 leading-relaxed">
            {summary} &nbsp;
            <Link
              to={`/post/${_id}`}
              className="mt-4 text-blue-500 font-semibold hover:underline"
            >
              Read more
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
