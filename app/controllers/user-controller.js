const db = require("../config/db");
const User = db.user;
const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth-config");
const bcrypt = require("bcryptjs")
var EmailValidator = require("email-validator");

function hashPassword(plaintextPassword) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(plaintextPassword, salt);
  return hash;
}

exports.create = async (req, res) => {
  if (!req.body.username) {
    return res.status(400).send({
      message: "Invalid username"
    });
  }
  if (!req.body.password) {
    return res.status(400).send({
      message: "Invalid password"
    });
  }
  if (!EmailValidator.validate(req.body.email)) {
    return res.status(400).send({
      message: "Invalid email address"
    });
  }
  const existingUser = await User.findOne({
    where: {
      email: req.body.email
    },
    raw: true
  })
  if (existingUser) {
    return res.status(400).send({
      message: "Email already exists!"
    });
  }
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword(req.body.password)
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Error creating user."
    });
  });
}

exports.findAll = (req, res) => {
  User.findAll({
    order: [
      ['id', 'ASC']
    ]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error retrieving users."
      });
    });
}

exports.login = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email }, raw: true });
  if (!user) {
    return res.status(400).send({
      message: "Wrong email or password!"
    });
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(400).send({
      message: "Wrong email or password!"
    });
  }
  if (user.is_inactive) {
    return res.status(400).send({
      message: "Inactive user, please contact admin!"
    });
  }
  const token = jwt.sign(user, authConfig.secret);
  return res.send({ ...user, token: token })
}

exports.update = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email }, raw: true });
  if (!user) {
    return res.status(400).send({
      message: "User not exist!"
    });
  }
  if (!req.body.password) {
    return res.status(400).send({
      message: "Password can not be empty!"
    });
  }

  User.update(
    { password: hashPassword(req.body.password) },
    { where: { email: req.body.email } }
  ).then(num => {
    if (num == 1) {
      res.send({
        message: "Successfully updated user password."
      });
    } else {
      res.send({
        message: "Error updating user password."
      });
    }
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Error updating user password."
    });
  });
}

exports.getUserById = async (id) => {
  const user = await User.findOne({
    where: { id: id },
    raw: true
  });
  return user;
};