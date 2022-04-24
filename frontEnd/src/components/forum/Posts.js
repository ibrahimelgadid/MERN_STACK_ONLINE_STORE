import Comments from "./Comments";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import {
  addNewComment,
  deletePost,
  likePost,
  unLikePost,
} from "../../ReduxCycle/actions/postsActions";
import { useState } from "react";
import EditPost from "./EditPost";
import { Modal } from "react-bootstrap";
import { imgServer } from "../../utilis/imageServer";

function Posts({ post }) {
  const [postID, setPostID] = useState("");
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const DeletePost = bindActionCreators(deletePost, useDispatch());
  const LikePost = bindActionCreators(likePost, useDispatch());
  const UnLikePost = bindActionCreators(unLikePost, useDispatch());
  const AddNewComment = bindActionCreators(addNewComment, useDispatch());
  const { user } = useSelector((state) => state.authReducer);

  const handleLike = (id) => {
    LikePost(id);
  };
  const handleUnLike = (id) => {
    UnLikePost(id);
  };
  const handleDelete = (id) => {
    DeletePost(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const commentData = { comment };
    AddNewComment(commentData, post._id);
    setComment("");
    // console.log(commentData, post._id);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">
          <img
            alt=""
            style={{ borderRadius: "50px", width: "50px", height: "50px" }}
            src={
              post.user.avatar === "noimage.png"
                ? `../../../images/${post.user.avatar}`
                : `${imgServer}/userAvatar/${post.user.avatar}`
            }
          />{" "}
          {post.user.name}
        </h5>
        {user.id === post.user._id ? (
          <span className="float-end">
            <i
              style={{ cursor: "pointer" }}
              onClick={() => handleDelete(post._id)}
              className="fas fa-times text-danger mr-2"
            ></i>
            <i
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPostID(post._id);
                handleShow();
              }}
              className="fas fa-edit text-primary"
            ></i>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Edit post</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <EditPost postID={postID} handleClose={handleClose} />
              </Modal.Body>
            </Modal>
          </span>
        ) : null}
        <p className="card-text">{post.text}</p>
        <p className="card-text">
          <small className="mr-3">
            <i className="fas fa-calendar-check"></i>{" "}
            <Moment format="DD MMM, YYYY HH:mm">{post.createdAt}</Moment>
          </small>

          <small className="">
            <i className="fas fa-comment-dots "></i> {post.comments.length}{" "}
            Comments
          </small>

          <small style={{ cursor: "pointer" }} className="ml-4">
            <i
              onClick={() => handleUnLike(post._id)}
              className={`${
                post.unlikes.length > 0 ? "text-primary" : "text-dark"
              } fas fa-thumbs-down mr-2`}
            >
              {post.unlikes.length}
            </i>

            <i
              onClick={() => handleLike(post._id)}
              className={`${
                post.likes.length > 0 ? "text-primary" : "text-dark"
              } fas fa-thumbs-up`}
            >
              {post.likes.length}
            </i>
          </small>
        </p>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <button className="input-group-text" id="prefixId">
              Comment
            </button>
            <textarea
              className="form-control"
              placeholder="Leave comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
        </form>
        {post.comments.map((comment) => (
          <Comments key={comment._id} comment={comment} postID={post._id} />
        ))}
      </div>
    </div>
  );
}

export default Posts;
