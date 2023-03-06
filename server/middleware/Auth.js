const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Schema/userSchema');

module.exports = function (req, res, next) {
  if (req.headers.authorization.split(' ')[1] === 'null') {
    res.send({message: 'Please Login', success: false});
  } else {
    jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.JWT_KEY,
      function (err, payload) {
        if (err) {
          console.log(err);
          res.send({message: err.message, success: false});
        } else {
          const {userId} = payload;
          User.findOne({_id: userId}, function (err, found) {
            if (err) {
              res.send({message: err.message, success: false});
            } else {
              if (found) {
                req.user = found;
                next();
              } else {
                res.send({message: 'User Not Found', success: false});
              }
            }
          });
        }
      }
    );
  }
};
