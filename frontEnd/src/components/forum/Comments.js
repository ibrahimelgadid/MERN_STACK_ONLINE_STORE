import React, { useState } from "react";
import Moment from "react-moment";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { deleteComment } from "../../ReduxCycle/actions/postsActions";

function Comments({ comment, postID }) {
  const [actions, setActions] = useState(false);

  const DeleteComment = bindActionCreators(deleteComment, useDispatch());

  const handleDelete = (commentID) => {
    DeleteComment(postID, commentID);
  };

  return (
    <div className="direct-chat-msg">
      <div className="direct-chat-infos clearfix">
        <span className="direct-chat-name float-left">{comment.user.name}</span>
        <span className="direct-chat-timestamp float-right">
          <Moment format="DD MMM YYYY, HH:mm">{comment.date}</Moment>
        </span>
      </div>
      <img
        alt=""
        className="direct-chat-img"
        src={
          comment.user.avatar === "noimage.png"
            ? `../../../images/${comment.user.avatar}`
            : `http://localhost:5000/userAvatar/${comment.user.avatar}`
        }
      />
      <div className="direct-chat-text">
        {actions && (
          <span className="">
            <i
              style={{ cursor: "pointer" }}
              onClick={() => handleDelete(comment._id)}
              className="fas fa-times text-danger mr-2"
            ></i>
            <i
              style={{ cursor: "pointer" }}
              className="fas fa-edit text-primary mr-2"
            ></i>
          </span>
        )}
        {comment.comment}
        {/* edit modal launcher */}
        <span className="float-start" onClick={() => setActions(!actions)}>
          <i
            style={{ cursor: "pointer" }}
            className="fas fa-ellipsis-v mr-3"
          ></i>
        </span>
      </div>
    </div>
  );
}

export default Comments;
