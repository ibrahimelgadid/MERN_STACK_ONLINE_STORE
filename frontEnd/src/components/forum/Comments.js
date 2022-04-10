import React, { useState } from "react";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { deleteComment } from "../../ReduxCycle/actions/postsActions";
import {imgServer} from "../../utilis/imageServer";

function Comments({ comment, postID }) {
  const [actions, setActions] = useState(false);

  const DeleteComment = bindActionCreators(deleteComment, useDispatch());
  const {user} = useSelector(state=>state.authReducer);
  

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
            : `${imgServer}/userAvatar/${comment.user.avatar}`
        }
      />
      <div className="direct-chat-text">
        {actions && (
            comment.user._id === user.id &&
          <span className="">
            <i
              style={{ cursor: "pointer" }}
              onClick={() => handleDelete(comment._id)}
              className="fas fa-times text-danger mr-2"
            ></i> 
          </span>
          
  
        )}
        {comment.comment}
        {/* edit modal launcher */}
        {comment.user._id === user.id ?
          <span className="float-start" onClick={() => setActions(!actions)}>
            <i
              style={{ cursor: "pointer" }}
              className="fas fa-ellipsis-v mr-3"
            ></i>
          </span>:null
        }
      </div>
    </div>
  );
}

export default Comments;
