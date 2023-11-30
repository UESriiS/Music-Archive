const db = require("../config/db");
const User = db.user;
const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth-config");
const bcrypt = require("bcryptjs")

function hashPassword(plaintextPassword) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(plaintextPassword, salt);
  return hash;
}

function isUserAdmin(req) {
  const token = req.headers["x-access-token"];
  const decodedToken = jwt.verify(token, authConfig.secret);
  const userId = decodedToken.id;
  const user =  User.findOne({
    where: { id: userId },
    raw: true
  });
  if(user==null || user==undefined || user.is_admin==false) {
    res.status(401).send({
      message: "The user doesn't exist or is not privileged to execute this operation."
    });
    return;
  }
}

/*
    Update a User's Status
*/
exports.updateUserStatus = async (req, res) => {

  isUserAdmin(req); 
  const userId =  req.params.user_id;
  if (!userId) {
    res.status(400).send({
      message: "No User ID provided."
    });
    return;
  }
  
  const user = await User.findOne({
    where: { id: userId },
    raw: true
  });
  if(user==null || user==undefined) {
    res.status(400).send({
      message: "The user doesn't exist."
    });
    return;
  }

  User.update(
    { is_inactive: req.body.is_inactive },
    { where: { id: userId } }
  ).then(num => {
    if (num == 1) {
      res.send({
        updated: true
      });
    } else {
      res.send({
        message: "Error updating user status."
      });
    }
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Error updating user status."
    });
  });
};

/*
    Promote a User to admin
    Note: Only current Admins can Promote Users
*/
exports.updateUserPrivileges = async (req, res) => {

  isUserAdmin(req); 
  const userId =  req.params.user_id;
  if (!userId) {
    res.status(400).send({
      message: "No User ID provided."
    });
    return;
  }
  
  const user = await User.findOne({
    where: { id: userId },
    raw: true
  });
  if(user==null || user==undefined) {
    res.status(400).send({
      message: "The user doesn't exist."
    });
    return;
  }

  User.update(
    { is_admin: req.body.is_admin },
    { where: { id: userId } }
  ).then(num => {
    if (num == 1) {
      res.send({
        updated: true
      });
    } else {
      res.send({
        message: "Error updating user privileges."
      });
    }
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Error updating user privileges."
    });
  });
};

/*
    Edit the Review Visibility Flag
    Note: Only current Admins can Promote Users
*/
exports.updateReviewVisibilityFlag = async (req, res) => {

  isUserAdmin(req); 
 
};