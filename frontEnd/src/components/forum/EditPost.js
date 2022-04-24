import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import { editPost, getPost } from "../../ReduxCycle/actions/postsActions";
import isEmpty from "../../utilis/isEmpty";

function EditPost({ postID, handleClose }) {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState("");
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

    EditPost(postData, postID);
    handleClose(true);
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
      if (!isEmpty(errorsFromState)) {
        Object.values(errors).map((value) =>
          toast.warn(value, { theme: "colored" })
        );
      }
    } else {
      setIsMounted(true);
    }
    // eslint-disable-next-line
  }, [errors, errorsFromState]);

  return (
    <form onSubmit={handleSumit}>
      <div className="input-group mb-3">
        <button className="input-group-text" id="prefixId">
          Edit
        </button>
        <textarea
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
    </form>
  );
}

export default EditPost;
