//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const router = require("express").Router();
const passport = require("passport");
const {
  getAllPosts,
  getPostById,
  addNewPost,
  editPost,
  deletePost,
  addLikeToPost,
  addUnLikeToPost,
  addNewComment,
  deleteComment,
} = require("../../controllers/postControllers");

//---------------------------------------------|
//             GET ALL POSTS                   |
//---------------------------------------------|
router.route("/").get(getAllPosts);

//---------------------------------------------|
//             GET POST BY ID                  |
//---------------------------------------------|
router
  .route("/:postID")
  .get(passport.authenticate("jwt", { session: false }), getPostById);

//---------------------------------------------|
//             POST NEW POST                   |
//---------------------------------------------|
router
  .route("/")
  .post(passport.authenticate("jwt", { session: false }), addNewPost);

//---------------------------------------------|
//             EDIT EXIST POST                 |
//---------------------------------------------|
router
  .route("/:postID")
  .put(passport.authenticate("jwt", { session: false }), editPost);

//---------------------------------------------|
//             DELETE POST BY ID               |
//---------------------------------------------|
router
  .route("/:postID")
  .delete(passport.authenticate("jwt", { session: false }), deletePost);

//---------------------------------------------|
//             ADD LIKE TO POST
//---------------------------------------------|
router
  .route("/like/:postID")
  .post(passport.authenticate("jwt", { session: false }), addLikeToPost);

//---------------------------------------------|
//            ADD UNLIKE TO POST
//---------------------------------------------|
router
  .route("/unlike/:postID")
  .post(passport.authenticate("jwt", { session: false }), addUnLikeToPost);

//---------------------------------------------|
//             ADD NEW COMMENT
//---------------------------------------------|
router
  .route("/comment/:postID")
  .post(passport.authenticate("jwt", { session: false }), addNewComment);

//---------------------------------------------|
//              DELETE COMMENT                 |
//---------------------------------------------|
router
  .route("/comment/:postID/:commentID")
  .delete(passport.authenticate("jwt", { session: false }), deleteComment);

module.exports = router;
