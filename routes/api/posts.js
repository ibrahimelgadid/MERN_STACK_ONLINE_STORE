//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../../models/Post');
const validateCommentInput = require('../../validation/comment');
const validatePostInput = require('../../validation/post');


//---------------------------------------------|
//             GET TEST POST                   |
//---------------------------------------------|
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));



//---------------------------------------------|
//             GET ALL POSTS                   |
//---------------------------------------------|
router.get('/', (req, res) => {
  Post.find()
  .populate('user', ['name', 'avatar'])
  .populate('comments.user', ['name', 'avatar'])
  .sort({ createdAt: -1 })
  .then(posts => res.json(posts))
  .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});



//---------------------------------------------|
//             GET POST BY ID                  |
//---------------------------------------------|
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
  .populate('user', ['name', 'avatar'])
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});



//---------------------------------------------|
//             POST NEW POST                   |
//---------------------------------------------|
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      user: req.user.id
    });


    newPost.save()
    .then(post=>{
      Post.populate(newPost, {path:"user", select:['name','avatar']})
      .then(p=>res.status(200).json(p))
    }).catch(err=>console.log(err))

  }
);


//---------------------------------------------|
//             EDIT EXIST POST                 |
//---------------------------------------------|
router.put(
  '/:postid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById({_id:req.params.postid})
    .then(post=>{
      if (post.user.toString() === req.user.id) {
        post.text = req.body.text;
        Post.findByIdAndUpdate({_id:req.params.postid}, {$set:post}, {new:true})
        .then(done=>{
          Post.populate(post.comments, {path:"user", select:['name','avatar']})
          Post.populate(post, {path:"user", select:['name','avatar']})
          .then(p=>res.status(200).json(p))
        })
      }else{
        return res.status(400).json({notOwner:'You are not owner of this post'})
      }
    })

  }
);



//---------------------------------------------|
//             DELETE POST BY ID               |
//---------------------------------------------|
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
      // Check for post owner
      if (post.user.toString() !== req.user.id) {
        return res
          .status(401)
          .json({ notauthorized: 'User not authorized' });
      }

      // Delete
      post.remove().then(() => res.json({ success: true }));
    })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);



//---------------------------------------------|
//             POST LIKE                       |
//---------------------------------------------|
router.post('/like/:id', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
      // check if user already liked this post
      if (
        post.likes.filter(like => like.user.toString() === req.user.id)
          .length > 0
      ) {
        return res.status(400).json({ 
          alreadyLiked: 'You already Liked this post'
        });
      }
      // check if this user unliked this post and delete him from unlike list
        const getIndexOfUser = post.unlikes
        .map(item => item.user.toString())
        .indexOf(req.user.id);
        if (getIndexOfUser>-1) {
          post.unlikes.splice(getIndexOfUser, 1);
        }
        // Add this user id to likes list
          post.likes.unshift({ user: req.user.id });
          // post.save().then(post => res.json(post));
          post.save()
          .then(post=>{
            Post.populate(post.comments, {path:"user", select:['name','avatar']})
            Post.populate(post, {path:"user", select:['name','avatar']})
            .then(p=>res.status(200).json(p))
          }).catch(err=>console.log(err))
      })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);



//---------------------------------------------|
//             POST UNLIKE                     |
//---------------------------------------------|
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
    .then(post => {

      // check if user already unliked this post
      if (
        post.unlikes.filter(unlike => unlike.user.toString() === req.user.id)
          .length > 0
      ) {
        return res.status(400).json({ 
          alreadyUnLiked: 'You already UnLiked this post' 
        });
      }

        // check if this user liked this post and delete him from like list
        const getIndexOfUser = post.likes
        .map(item => item.user.toString())
        .indexOf(req.user.id);

        if (getIndexOfUser>-1) {
          post.likes.splice(getIndexOfUser, 1);
        }
        // Add user id to unlikes array
          post.unlikes.unshift({ user: req.user.id });
          post.save()
          .then(post=>{
            Post.populate(post.comments, {path:"user", select:['name','avatar']})
            Post.populate(post, {path:"user", select:['name','avatar']})
            .then(p=>res.status(200).json(p))
          }).catch(err=>console.log(err))
      })
    .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);



//---------------------------------------------|
//             POST COMMENT                    |
//---------------------------------------------|
router.post(
  '/comment/:postid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.postid)
      .then(post => {
        const newComment = {
          comment: req.body.comment,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save()
        .then(post=>{
          Post.populate(post.comments, {path:"user", select:['name','avatar']})
          Post.populate(post, {path:"user", select:['name','avatar']})
          .then(p=>res.status(200).json(p))
        }).catch(err=>console.log(err))
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);


//---------------------------------------------|
//            EDIT EXIST COMMENT               |
//---------------------------------------------|
router.put(
  '/:postid/comment/:commentId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById({_id:req.params.postid})
    .then(post=>{
      if (post.user.toString() === req.user.id) {
        let desiredComment = post.comments.map(comment=>comment.id).indexOf(req.params.commentId)
        post.comments[desiredComment].comment = req.body.comment;
        Post.findByIdAndUpdate({_id:req.params.postid}, {$set:post}, {new:true})
          .then(done=>{
            return res.status(200).json(done);
        })
      }else{
        return res.status(400).json({notOwner:'You are not owner of this post'})
      }
    })
  }
);



//---------------------------------------------|
//              DELETE COMMENT                 |
//---------------------------------------------|
router.delete(
  '/comment/:postid/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    Post.findById(req.params.postid)
    .then(post => {
      // Check to see if comment exists
      if (
        post.comments.filter(
          comment => comment._id.toString() === req.params.comment_id
        ).length === 0
      ) {
        return res
          .status(404)
          .json({ commentnotexists: 'Comment does not exist' });
      }

      // Get remove index
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

      // Splice comment out of array
      post.comments.splice(removeIndex, 1);
            post.save()
            .then(post=>{
              Post.populate(post.comments, {path:"user", select:['name','avatar']})
              Post.populate(post, {path:"user", select:['name','avatar']})
              .then(p=>res.status(200).json(p))
            }).catch(err=>console.log(err))

        

      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  });


module.exports = router;
