import React, { useEffect, useState } from "react";
import Posts from "./Posts";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { addNewPost, getPosts } from "../../ReduxCycle/actions/postsActions";
import isEmpty from "../../utilis/isEmpty";
import classnames from "classnames";
import { Spinner } from "react-bootstrap";

function Forum() {
  const [text, setText] = useState("");
  const [Loading, setLoading] = useState(false);
  const { posts, loading } = useSelector((state) => state.postsReducer);
  const [errors, setErrors] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const errorsFromState = useSelector((state) => state.errorsReducer);
  const GetPosts = bindActionCreators(getPosts, useDispatch());
  const AddNewPost = bindActionCreators(addNewPost, useDispatch());

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      text,
    };
    AddNewPost(postData, setLoading);
    setText("");
  };

  useEffect(() => {
    if (isMounted) {
      setErrors(errorsFromState);
    } else {
      setIsMounted(true);
    }
    // eslint-disable-next-line
  }, [errors, errorsFromState]);

  useEffect(() => {
    GetPosts();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="forum">
      <div className="row justify-content-center my-4">
        <div className="col-11 col-md-10">
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <button className="input-group-text" id="prefixId">
                <strong>
                  {Loading ? (
                    <Spinner animation="border" role="status" />
                  ) : (
                    "New Post"
                  )}
                </strong>
              </button>
              <textarea
                // className="form-control"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={classnames("form-control", {
                  "is-invalid": errors.text,
                })}
              ></textarea>
              <div className="invalid-feedback">{errors.text}</div>
            </div>
          </form>

          {isEmpty(posts) && loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => <Posts key={post._id} post={post} />)
          ) : (
            <div className="text-center">
              <strong className="text-danger">
                {" "}
                <i className="fas fa-exclamation-circle"></i> There is no posts
              </strong>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 px-4 ">
        <h4 className="font-italic">Tags</h4>
        <div className="progress mb-2" style={{ height: "1px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: "25%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Forum;
