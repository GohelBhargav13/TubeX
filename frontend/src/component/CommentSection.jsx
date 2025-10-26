import React, { useEffect, useState } from "react";
import socket from "../Server/Server.js"
import { toast } from "react-hot-toast"

const CommentSection = ({ comments = [],userInfo,videoId }) => {
  // console.log("Type of comments : ", typeof comments);
  // console.log(comments);

  const [commentsState,setComments] = useState([])
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    setComments(comments)

    socket.on("VideoCommentUpdated", ({ New_Comment,commentCount,userId,message,commentId,videoId }) => {
        console.log(typeof New_Comment);
        console.log("Comment Count is : ",commentCount)

        // comment is not here than return 
        if(!New_Comment) return;

        setComments((prev) => [ ...prev,New_Comment ])
        if(userId === userInfo?._id && message) toast.success(message)
    })

    socket.on("deleteCommentUpdate", ({ commentId,userId,videoID,message,success,r_comments,commentCounts }) => {
        if(success){
          console.log(typeof r_comments);

          console.log("Flow is here")
          setComments((prev) => [...prev.filter((com) => com?._id.toString() !== commentId.toString() )] )           
        }

         if(userId === userInfo?._id && message) toast.success(message)
          // console.log(`This comment : ${commentId} is deleted on this video ${videoID} and remaining comments are : ${commentCounts}`)
    })

    socket.on("ErrorInSocket" ,({message}) => toast.error(message))

    return () => {
      socket.off("VideoCommentUpdated")
      socket.off("deleteCommentUpdate")
      socket.off("ErrorInSocket")
    }

  },[])

  // Handle a New Comment
  const handleComment = (comment,commentId,userId,videoId) => {
    console.log("Nutton Clicked")
    socket.emit("commentPost",{ comment,commentId,userId,videoId })
    setNewComment("")
  }

  // Handle a Delete Comment
  const handleDeleteComment = (commentId,userId,videoID) => {
      socket.emit("deleteComment", { commentId,userId,videoID })
  }

  return (
    <div className="mt-6">
      <h2 className="font-bold text-xl mb-4">
        {commentsState.length || 0} Comments
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
          value={newComment}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="cursor-pointer bg-black text-white p-2 rounded-xl ml-2" onClick={() => handleComment(newComment,commentsState?._id,userInfo?._id,videoId)}>Comment</button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {commentsState.length > 0 ? (
          commentsState.map((comment) => (
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
                  {commentsState?.user?.userFirstName || comment?.user?.userFirstName} {comment?.user?.userLastName}
                </p>
                <p className="text-gray-700">{comment?.comment}</p>
              </div>
               { comment?.user?._id === userInfo?._id  && <button className="cursor-pointer bg-black text-white p-2 rounded-xl ml-2" onClick={() => handleDeleteComment(comment?._id,userInfo?._id,videoId)} >delete</button> }
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
