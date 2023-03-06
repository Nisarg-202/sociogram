const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const Auth = require('./Auth');
const {
  SignUp,
  Login,
  checkAuth,
  addPost,
  getPosts,
  onLike,
  getUser,
  Friend,
  uploadImage,
  FollowFriend,
  deletePost,
  ProfileChange,
  addComment,
  getComment,
  addMessage,
  getMessage,
} = require('../routes/routes');

router.get('/getPosts', Auth, getPosts);

router.get('/getComment', Auth, getComment);

router.get('/getMessage', Auth, getMessage);

router.post(
  '/signup',
  [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({
      min: 6,
    }),
  ],
  SignUp
);

router.post(
  '/login',
  [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({
      min: 6,
    }),
  ],
  Login
);

router.post('/checkAuth', Auth, checkAuth);

router.post('/addPost', Auth, addPost);

router.post('/like', Auth, onLike);

router.post('/getUser', Auth, getUser);

router.post('/Friend', Auth, Friend);

router.post('/Follow', Auth, FollowFriend);

router.post('/uploadImage', Auth, uploadImage);

router.post('/deletePost', Auth, deletePost);

router.post('/ProfileChange', Auth, ProfileChange);

router.post('/addComment', Auth, addComment);

router.post('/addMessage', Auth, addMessage);

module.exports = router;
