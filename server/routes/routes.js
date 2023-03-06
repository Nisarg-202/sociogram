const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const {validationResult} = require('express-validator');
const User = require('../Schema/userSchema');
const Post = require('../Schema/postSchema');
const Follow = require('../Schema/followSchema');
const Comment = require('../Schema/CommentSchema');
const Message = require('../Schema/MessageSchema');

const SignUp = function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.send({success: false, message: 'Please Enter a valid keys'});
  } else {
    const {email, password, name} = req.body;
    bcrypt.hash(password, 10, async function (err, hash) {
      const user = new User({
        email,
        password: hash,
        name,
      });
      await user.save(function (err) {
        if (err) {
          res.send({success: false, message: 'Failed!'});
        } else {
          jwt.sign(
            {userId: user._id},
            process.env.JWT_KEY,
            {expiresIn: '2h'},
            function (err, token) {
              if (err) {
                res.send({success: false, message: 'Failed!'});
              } else {
                res.send({token, success: true, user: user._id});
              }
            }
          );
        }
      });
    });
  }
};

const Login = function (req, res) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.send({success: false, message: 'Please Enter a valid keys'});
  } else {
    const {email, password} = req.body;
    User.findOne({email}, function (err, found) {
      if (err) {
        res.send({success: false, message: 'Failed!'});
      } else {
        if (found) {
          bcrypt.compare(password, found.password, function (err, result) {
            if (result) {
              jwt.sign(
                {userId: found._id},
                process.env.JWT_KEY,
                {expiresIn: '2h'},
                function (err, token) {
                  if (err) {
                    res.send({success: false, message: 'Failed!'});
                  } else {
                    res.send({token, success: true, user: found._id});
                  }
                }
              );
            } else {
              res.send({success: false, message: 'Wrong Password'});
            }
          });
        } else {
          res.send({success: false, message: 'User not found please Sign Up'});
        }
      }
    });
  }
};

const checkAuth = function (req, res) {
  res.send({user: req.user._id, success: true});
};

const addPost = async function (req, res) {
  const {title, description} = req.body;
  const {image} = req.files;
  cloudinary.uploader
    .upload_stream(async function (err, result) {
      if (err) {
        console.log(err);
      } else {
        const post = new Post({
          title,
          description,
          imageUrl: result.secure_url,
          userId: req.user._id,
          createdAt: new Date().toISOString(),
        });
        await post.save(function (err) {
          if (err) {
            res.send({success: false});
          } else {
            res.send({success: true});
          }
        });
      }
    })
    .end(image.data);
};

const getPosts = function (req, res) {
  Post.find(function (err, found) {
    if (err) {
      res.send({success: false, message: 'Please try Again!'});
    } else {
      if (found) {
        res.send({success: true, posts: found});
      } else {
        res.send({success: true, posts: []});
      }
    }
  });
};

const onLike = function (req, res) {
  const {_id} = req.body;
  const currentUser = req.user._id;
  Post.findOne({_id}, async function (err, found) {
    if (err) {
      res.send({success: false, message: 'Please try Again!'});
    } else {
      if (found) {
        let post_occur = false;
        found.like.forEach(function (item) {
          if (item.toString() == currentUser.toString()) {
            post_occur = true;
          }
        });
        if (post_occur) {
          const new_posts = found.like.filter(function (item) {
            return item.toString() != currentUser.toString();
          });
          found.like = new_posts;
          await found.save();
        } else {
          found.like.push(currentUser);
          await found.save();
        }
        res.send({success: true});
      } else {
        res.send({success: false, message: 'Not Found!'});
      }
    }
  });
};

const getUser = function (req, res) {
  User.find(function (err, found) {
    if (err) {
      res.send({success: false, message: err.message});
    } else {
      if (found) {
        res.send({success: true, users: found});
      } else {
        res.send({success: false, message: 'Not Found!'});
      }
    }
  }).select({password: 0, email: 0});
};

const Friend = function (req, res) {
  Follow.find(function (err, found) {
    if (err) {
      res.send({success: false, message: err.message});
    } else {
      if (found) {
        res.send({success: true, friends: found});
      } else {
        res.send({success: true, friends: []});
      }
    }
  });
};

const FollowFriend = async function (req, res) {
  const {from, to} = req.body;
  Follow.find(async function (err, found) {
    if (err) {
      res.send({success: false});
    } else {
      if (found) {
        let previousFound = false;
        found.forEach(function (item) {
          if (
            item.from.toString() == from.toString() &&
            item.to.toString() == to.toString()
          ) {
            previousFound = true;
          }
        });
        if (previousFound) {
          Follow.deleteOne({from, to}, function (err) {
            if (err) {
              console.log(err);
            }
          });
          res.send({success: true});
        } else {
          const follow = new Follow({
            from,
            to,
          });
          follow.save(function (err) {
            if (err) {
              res.send({success: false, message: err.message});
            } else {
              res.send({success: true});
            }
          });
        }
      } else {
        const follow = new Follow({
          from,
          to,
        });
        follow.save(function (err) {
          if (err) {
            res.send({success: false, message: err.message});
          } else {
            res.send({success: true});
          }
        });
      }
    }
  });
};

const uploadImage = async function (req, res) {
  const {image} = req.files;

  await cloudinary.uploader
    .upload_stream(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        User.findOne({_id: req.user._id}, async function (err, found) {
          if (err) {
            res.send({success: false, message: err.message});
          } else {
            if (found) {
              found.profileImageUrl = result.secure_url;
              found.save();
              res.send({success: true});
            } else {
              res.send({success: false, message: 'Not Found!'});
            }
          }
        });
      }
    })
    .end(image.data);
};

const deletePost = async function (req, res) {
  const {id} = req.body;
  await Post.findOne({_id: id}, function (err, found) {
    if (err) {
      console.log(err);
    } else {
      fs.unlinkSync(found.imageUrl);
    }
  });
  await Post.deleteOne({_id: id}, function (err) {
    if (err) {
      res.send({success: false, message: 'Please Try Again Later!'});
    } else {
      res.send({success: true});
    }
  });
};

const ProfileChange = async function (req, res) {
  const {id, name, description} = req.body;
  await User.findOneAndUpdate(
    {_id: id},
    {$set: {name, description}},
    function (err) {
      if (err) {
        res.send({success: false, message: 'Please Try Again Later!'});
      } else {
        res.send({success: true});
      }
    }
  );
};

const addComment = async function (req, res) {
  const {from, to, comment, postId} = req.body;
  const myComment = new Comment({
    from,
    to,
    comment,
    postId,
  });
  await myComment.save(function (err) {
    if (err) {
      res.send({success: false, message: err.message});
    } else {
      res.send({success: true});
    }
  });
};

const getComment = function (req, res) {
  Comment.find(function (err, found) {
    if (err) {
      res.send({success: false});
    } else {
      if (found) {
        res.send({success: true, comments: found});
      } else {
        res.send({success: false});
      }
    }
  });
};

const addMessage = async function (req, res) {
  const {from, to, message} = req.body;
  const myMessage = new Message({
    from,
    to,
    message,
    createdAt: new Date().toISOString(),
  });
  await myMessage.save(async function (err) {
    if (err) {
      res.send({success: false, message: 'Please Try Again Later!'});
    } else {
      await Message.find(function (err, found) {
        if (err) {
          res.send({success: false, message: 'Please Try Again Later!'});
        } else {
          if (found) {
            res.send({success: true, messages: found});
          } else {
            res.send({success: true, messages: []});
          }
        }
      });
    }
  });
};

const getMessage = async function (req, res) {
  await Message.find(function (err, found) {
    if (err) {
      res.send({success: false, message: 'Please Try Again Later!'});
    } else {
      if (found) {
        res.send({success: true, messages: found});
      } else {
        res.send({success: true, messages: []});
      }
    }
  });
};

exports.SignUp = SignUp;
exports.Login = Login;
exports.checkAuth = checkAuth;
exports.addPost = addPost;
exports.getPosts = getPosts;
exports.onLike = onLike;
exports.getUser = getUser;
exports.Friend = Friend;
exports.FollowFriend = FollowFriend;
exports.uploadImage = uploadImage;
exports.deletePost = deletePost;
exports.ProfileChange = ProfileChange;
exports.addComment = addComment;
exports.getComment = getComment;
exports.addMessage = addMessage;
exports.getMessage = getMessage;
