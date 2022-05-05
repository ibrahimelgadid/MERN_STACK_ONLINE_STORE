//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const postModel = require("../models/postModel");
const asyncHandler = require("express-async-handler");
const postValidators = require("../validation/postValidators");
const commentValidators = require("../validation/commentValidators");
const { isOwner, notOwner } = require("../helpers/privilleges");

//---------------------------------------------|
//           GET ALL POSTS
//---------------------------------------------|
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await postModel
    .find()
    .populate("user", ["name", "avatar"])
    .populate("comments.user", ["name", "avatar"])
    .sort({ createdAt: -1 });
  res.json(posts);
});

//---------------------------------------------|
//           GET POST BY ID
//---------------------------------------------|
const getPostById = asyncHandler(async (req, res) => {
  const post = await postModel
    .findById(req.params.postID)
    .populate("user", ["name", "avatar"]);
  res.json(post);
});

//---------------------------------------------|
//           POST NEW POST
//---------------------------------------------|
const addNewPost = asyncHandler(async (req, res) => {
  const { errors, isValid } = postValidators(req.body);
  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }

  const newPostModel = new postModel({
    text: req.body.text,
    user: req.user.id,
  });

  await newPostModel.save();

  const newPost = await postModel.populate(newPostModel, {
    path: "user",
    select: ["name", "avatar"],
  });
  res.status(200).json(newPost);
});

//---------------------------------------------|
//           EDIT POST
//---------------------------------------------|
const editPost = asyncHandler(async (req, res) => {
  const { errors, isValid } = postValidators(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const post = await postModel.findById({ _id: req.params.postID });
  if (!notOwner(req, res, post.user, "post")) {
    post.text = req.body.text;
    const updatedPost = await postModel
      .findByIdAndUpdate(
        { _id: req.params.postID },
        { $set: post },
        { new: true }
      )
      .populate("user", "-password")
      .populate("comments.user", "-password");
    res.status(200).json(updatedPost);
  }
});

//---------------------------------------------|
//           DELETE POST
//---------------------------------------------|
const deletePost = asyncHandler(async (req, res) => {
  const post = await postModel.findById(req.params.postID);
  // Check for post owner
  if (!notOwner(req, res, post.user, "post")) {
    // Delete
    await postModel.deleteOne({ _id: req.params.postID });
    res.json({ success: true });
  }
});

//---------------------------------------------|
//          ADD LIKE TO POST
//---------------------------------------------|
const addLikeToPost = asyncHandler(async (req, res) => {
  const post = await postModel.findById(req.params.postID);
  // check if user already liked this post
  if (
    post.likes.filter((like) => like.user.toString() === req.user.id).length > 0
  ) {
    return res.status(400).json({
      alreadyLiked: "You already Liked this post",
    });
  }
  // check if this user unliked this post and delete him from unlike list
  const getIndexOfUser = post.unlikes
    .map((item) => item.user.toString())
    .indexOf(req.user.id);
  if (getIndexOfUser > -1) {
    post.unlikes.splice(getIndexOfUser, 1);
  }
  // Add this user id to likes list
  post.likes.unshift({ user: req.user.id });
  // postModel.save().then(post => res.json(post));
  const savedPost = await post.save();
  // .then((post) => {
  await postModel.populate(savedPost.comments, {
    path: "user",
    select: "-passpord",
  });
  await postModel.populate(savedPost, {
    path: "user",
    select: "-passpord",
  });
  res.status(200).json(savedPost);
});

//---------------------------------------------|
//           ADD UNLIKE TO POST
//---------------------------------------------|
const addUnLikeToPost = asyncHandler(async (req, res) => {
  const post = await postModel.findById(req.params.postID);
  // check if user already liked this post
  if (
    post.unlikes.filter((unlike) => unlike.user.toString() === req.user.id)
      .length > 0
  ) {
    return res.status(400).json({
      alreadUnLiked: "You already unLiked this post",
    });
  }
  // check if this user unliked this post and delete him from unlike list
  const getIndexOfUser = post.likes
    .map((item) => item.user.toString())
    .indexOf(req.user.id);
  if (getIndexOfUser > -1) {
    post.likes.splice(getIndexOfUser, 1);
  }
  // Add this user id to likes list
  post.unlikes.unshift({ user: req.user.id });
  // postModel.save().then(post => res.json(post));
  const savedPost = await post.save();
  // .then((post) => {
  await postModel.populate(savedPost.comments, {
    path: "user",
    select: "-passpord",
  });
  await postModel.populate(savedPost, {
    path: "user",
    select: "-passpord",
  });
  res.status(200).json(savedPost);
});

//---------------------------------------------|
//           ADD NEW COMMENT
//---------------------------------------------|
const addNewComment = asyncHandler(async (req, res) => {
  const { errors, isValid } = commentValidators(req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }

  const post = await postModel.findById(req.params.postID);
  if (post) {
    const newComment = {
      comment: req.body.comment,
      user: req.user.id,
    };

    // Add to comments array
    post.comments.unshift(newComment);

    // Save
    const updatedPostWithNewComment = await post.save();
    await postModel.populate(updatedPostWithNewComment.comments, {
      path: "user",
      select: ["name", "avatar"],
    });
    await postModel.populate(updatedPostWithNewComment, {
      path: "user",
      select: ["name", "avatar"],
    });
    res.status(200).json(updatedPostWithNewComment);
  } else {
    res.status(404).json({ postnotfound: "No post found" });
  }
});
//---------------------------------------------|
//           DELETE COMMENT
//---------------------------------------------|
const deleteComment = asyncHandler(async (req, res) => {
  const post = await postModel.findById(req.params.postID);
  if (post) {
    // Check to see if comment exists
    if (
      post.comments.filter(
        (comment) => comment._id.toString() === req.params.commentID
      ).length === 0
    ) {
      return res
        .status(404)
        .json({ commentnotexists: "Comment does not exist" });
    }

    // Get remove index
    const removeIndex = post.comments
      .map((item) => item._id.toString())
      .indexOf(req.params.commentID);

    if (!notOwner(req, res, post.comments[removeIndex].user, "comment")) {
      // Splice comment out of array
      post.comments.splice(removeIndex, 1);
      const updatedPostWithDeleteComment = await post.save();
      await postModel.populate(updatedPostWithDeleteComment.comments, {
        path: "user",
        select: ["name", "avatar"],
      });
      await postModel.populate(updatedPostWithDeleteComment, {
        path: "user",
        select: ["name", "avatar"],
      });
      res.status(200).json(updatedPostWithDeleteComment);
    }
  } else {
    res.status(404).json({ postnotfound: "No post found" });
  }
});

// export modules
module.exports = {
  getAllPosts,
  getPostById,
  addNewPost,
  editPost,
  deletePost,
  addLikeToPost,
  addUnLikeToPost,
  addNewComment,
  deleteComment,
};
