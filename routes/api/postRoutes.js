//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require("express");
const router = express.Router();
const passport = require("passport");
const postModel = require("../../models/postModel");
const commentValidators = require("../../validation/commentValidators");
const postValidators = require("../../validation/postValidators");

//---------------------------------------------|
//             GET ALL POSTS                   |
//---------------------------------------------|
router.get("/", (req, res) => {
  postModel
    .find()
    .populate("user", ["name", "avatar"])
    .populate("comments.user", ["name", "avatar"])
    .sort({ createdAt: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostsfound: "No posts found" }));
});

//---------------------------------------------|
//             GET POST BY ID                  |
//---------------------------------------------|
router.get("/:postID", (req, res) => {
  postModel
    .findById(req.params.postID)
    .populate("user", ["name", "avatar"])
    .then((post) => res.json(post))
    .catch((err) =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
});

//---------------------------------------------|
//             POST NEW POST                   |
//---------------------------------------------|
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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

    newPostModel
      .save()
      .then((post) => {
        postModel
          .populate(newPostModel, {
            path: "user",
            select: ["name", "avatar"],
          })
          .then((p) => res.status(200).json(p));
      })
      .catch((err) => console.log(err));
  }
);

//---------------------------------------------|
//             EDIT EXIST POST                 |
//---------------------------------------------|
router.put(
  "/:postID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = postValidators(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    postModel.findById({ _id: req.params.postID }).then((post) => {
      if (post.user.toString() === req.user.id) {
        post.text = req.body.text;
        postModel
          .findByIdAndUpdate(
            { _id: req.params.postID },
            { $set: post },
            { new: true }
          )
          .populate("user", "-password")
          .populate("comments.user", "-password")
          .then((post) => {
            res.status(200).json(post);
          });
      } else {
        return res
          .status(400)
          .json({ notOwner: "You are not owner of this post" });
      }
    });
  }
);

//---------------------------------------------|
//             DELETE POST BY ID               |
//---------------------------------------------|
router.delete(
  "/:postID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    postModel
      .findById(req.params.postID)
      .then((post) => {
        // Check for post owner
        if (post.user.toString() !== req.user.id) {
          res.status(401).json({ notauthorized: "User not authorized" });
        } else {
          // Delete
          postModel.remove().then(() => res.json({ success: true }));
        }
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

//---------------------------------------------|
//             POST LIKE                       |
//---------------------------------------------|
router.post(
  "/like/:postID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    postModel
      .findById(req.params.postID)
      .then((post) => {
        // check if user already liked this post
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length > 0
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
        post
          .save()
          .then((post) => {
            postModel.populate(post.comments, {
              path: "user",
              select: ["name", "avatar"],
            });
            postModel
              .populate(post, {
                path: "user",
                select: ["name", "avatar"],
              })
              .then((p) => res.status(200).json(p));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

//---------------------------------------------|
//             POST UNLIKE                     |
//---------------------------------------------|
router.post(
  "/unlike/:postID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    postModel
      .findById(req.params.postID)
      .then((post) => {
        // check if user already unliked this post
        if (
          post.unlikes.filter(
            (unlike) => unlike.user.toString() === req.user.id
          ).length > 0
        ) {
          return res.status(400).json({
            alreadyUnLiked: "You already UnLiked this post",
          });
        }

        // check if this user liked this post and delete him from like list
        const getIndexOfUser = post.likes
          .map((item) => item.user.toString())
          .indexOf(req.user.id);

        if (getIndexOfUser > -1) {
          post.likes.splice(getIndexOfUser, 1);
        }
        // Add user id to unlikes array
        post.unlikes.unshift({ user: req.user.id });
        post
          .save()
          .then((post) => {
            postModel.populate(post.comments, {
              path: "user",
              select: ["name", "avatar"],
            });
            postModel
              .populate(post, {
                path: "user",
                select: ["name", "avatar"],
              })
              .then((p) => res.status(200).json(p));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

//---------------------------------------------|
//             POST COMMENT                    |
//---------------------------------------------|
router.post(
  "/comment/:postID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = commentValidators(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    postModel
      .findById(req.params.postID)
      .then((post) => {
        const newComment = {
          comment: req.body.comment,
          user: req.user.id,
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post
          .save()
          .then((post) => {
            postModel.populate(post.comments, {
              path: "user",
              select: ["name", "avatar"],
            });
            postModel
              .populate(post, {
                path: "user",
                select: ["name", "avatar"],
              })
              .then((p) => res.status(200).json(p));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

//---------------------------------------------|
//            EDIT EXIST COMMENT               |
//---------------------------------------------|
router.put(
  "/:postID/comment/:commentID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = commentValidators(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    postModel.findById({ _id: req.params.postID }).then((post) => {
      if (postModel.user.toString() === req.user.id) {
        let desiredComment = postModel.comments
          .map((comment) => comment.id)
          .indexOf(req.params.commentID);
        postModel.comments[desiredComment].comment = req.body.comment;
        postModel
          .findByIdAndUpdate(
            { _id: req.params.postID },
            { $set: post },
            { new: true }
          )
          .then((done) => {
            return res.status(200).json(done);
          });
      } else {
        return res
          .status(400)
          .json({ notOwner: "You are not owner of this post" });
      }
    });
  }
);

//---------------------------------------------|
//              DELETE COMMENT                 |
//---------------------------------------------|
router.delete(
  "/comment/:postID/:commentID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    postModel
      .findById(req.params.postID)
      .then((post) => {
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

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);
        post
          .save()
          .then((post) => {
            postModel.populate(post.comments, {
              path: "user",
              select: ["name", "avatar"],
            });
            postModel
              .populate(post, {
                path: "user",
                select: ["name", "avatar"],
              })
              .then((p) => res.status(200).json(p));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
