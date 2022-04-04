import React, { useEffect, useState } from "react";
import Posts from "./Posts";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { addNewPost, getPosts } from "../../ReduxCycle/actions/postsActions";
import isEmpty from '../../utilis/isEmpty';
import classnames from "classnames";



function Forum() {

  let [text, setText] = useState('')
  let {posts,loading} = useSelector(state=>state.postsReducer)
  const [errors, setErrors]  = useState('');
  let [isMounted, setIsMounted] = useState(false);


  let errorsFromState = useSelector(state=> state.errorsReducer);
  let GetPosts = bindActionCreators(getPosts, useDispatch())
  let AddNewPost = bindActionCreators(addNewPost, useDispatch())


  let handleSubmit = (e)=>{
    e.preventDefault();
    let postData = {
      text
    }
    AddNewPost(postData);
    setText('')
  }

  useEffect(() => {
    if(isMounted){

      setErrors(errorsFromState)
      
      // if(!isEmpty(errorsFromState)){
      //   Object.values(errors).map(value=>toast.warn(value, {theme:'colored'}))
      // }

    }else{setIsMounted(true)}
    // eslint-disable-next-line
  }, [errors, errorsFromState]);


  useEffect(()=>{
    GetPosts()
    // eslint-disable-next-line
  }, [])

  return (
    <div className="forum">
      <div className="row justify-content-center my-4">
        <div className="col-11 col-md-10">

          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <button className="input-group-text" id="prefixId">
                <strong>New Post</strong>
              </button>
              <textarea 
                // className="form-control"
                value={text}
                onChange={(e)=>setText(e.target.value)}
                className={classnames('form-control',{'is-invalid':errors.text})}
              >
              </textarea>
            </div>
              <p className="text-danger">{errors.text}</p>
          </form>

          {isEmpty(posts)&& loading?(
            <div className="spinner-border my-4" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ):(
            posts.length>0?(
              posts.map(post=>(
                <Posts key={post._id} post={post}/>
              ))
            ):(
              <strong className='text-danger'> <i className='fas fa-exclamation-circle'></i> There is no orders</strong>
            )
          )}
        </div>
      </div>
      {/* <div className="mb-4 px-4 ">

        <h4 className="font-italic">Follow Me</h4>
        <i className="fab fa-facebook-square"></i>
        <i className="fab fa-youtube"></i>
        <i className="fab fa-twitter-square"></i>
      </div> */}
        
      <div className="mb-4 px-4 ">
        <h4 className="font-italic">Tags</h4>
        <div className="progress mb-2" style={{height: "1px"}}>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
            style={{width: "25%"}}
          ></div>
        </div>
        <a className="btn btn-sm btn-outline-info mr-2 mb-2" href="/">
          Summer
        </a>
        <a className="btn btn-sm btn-outline-secondary mr-2 mb-2" href="/">
          Clothing
        </a>
        <a className="btn btn-sm btn-outline-success mr-2 mb-2" href="/">
          Woman
        </a>
        <a className="btn btn-sm btn-outline-danger mr-2 mb-2" href="/">
          Hot Trend
        </a>
        <a className="btn btn-sm btn-outline-dark mr-2 mb-2" href="/">
          Jacket
        </a>
        <a className="btn btn-sm btn-outline-primary mr-2 mb-2" href="/">
          Men
        </a>
        <a className="btn btn-sm btn-outline-warning mr-2 mb-2" href="/">
          Luxyry
        </a>
      </div>
    </div>
  );
}

export default Forum;
