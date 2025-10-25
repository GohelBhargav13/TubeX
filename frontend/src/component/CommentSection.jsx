import React from "react";

const CommentSection = ({ comments = [] }) => {
  console.log("Type of comments : ", typeof comments);
  console.log(comments);

  const handleComment = () => {
    console.log("Button Clicked")
  }

  return (
    <div className="mt-6">
      <h2 className="font-bold text-xl mb-4">
        {comments.length || 0} Comments
      </h2>

      {/* Comment Input */}
      <div className="flex items-start mb-6">
        <img
          src="https://via.placeholder.com/40" // User avatar placeholder
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="cursor-pointer bg-black text-white p-2 rounded-xl ml-2" onClick={() => handleComment()}>Comment</button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment?._id} className="flex items-start space-x-4">
              {/* User Avatar */}
              <img
                src={
                  comment?.user?.user_avatar || "https://via.placeholder.com/40"
                }
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              {/* Comment Body */}
              <div className="bg-gray-100 p-3 rounded-lg flex-1 justify-items-start">
                <p className="font-medium text-gray-800">
                  {comment?.user?.userFirstName} {comment?.user?.userLastName}
                </p>
                <p className="text-gray-700">{comment?.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
