import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { editPost, getPost } from "../../ReduxCycle/actions/postsActions";
import isEmpty from "../../utilis/isEmpty";

function EditPost({ postID, handleClose }) {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState("");
  const [Loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const errorsFromState = useSelector((state) => state.errorsReducer);
  const GetPost = bindActionCreators(getPost, useDispatch());
  const EditPost = bindActionCreators(editPost, useDispatch());
  const { post } = useSelector((state) => state.postsReducer);

  const handleSumit = (e) => {
    e.preventDefault();
    const postData = {
      text,
    };

    EditPost(postData, postID, setLoading, handleClose);
  };

  useEffect(() => {
    GetPost(postID);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isEmpty(post)) {
      setText(post.text);
    }
  }, [post]);

  useEffect(() => {
    if (isMounted) {
      setErrors(errorsFromState);
    } else {
      setIsMounted(true);
    }
    // eslint-disable-next-line
  }, [errors, errorsFromState]);

  return (
    <form onSubmit={handleSumit}>
      <div className="input-group mb-3">
        <button className="input-group-text" id="prefixId">
          {Loading ? <Spinner animation="border" role="status" /> : "Edit"}
        </button>
        <textarea
          className={classNames("form-control", { "is-invalid": errors.text })}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div className="invalid-feedback">{errors.text}</div>
      </div>
    </form>
  );
}

export default EditPost;
