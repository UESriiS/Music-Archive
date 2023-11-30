const db = require("../config/db");
const Info = db.info;
const User = require("./user-controller")
const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth-config");

/*
    Find all Info
*/
exports.findAll = async (req, res) => {
  try {
    const infoList = await Info.findAll({
      order: [
        ['id', 'ASC']
      ],
      raw: true
    });
    if (infoList.length == 0) {
      res.status(400).send({
        message: "Error retrieving information."
      });
      return;
    }
    res.send(infoList);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Error retrieving information."
    });
  }
};

/*
  Delete a Review by ID
*/
exports.delete = (req, res) => {

  const token = req.headers["x-access-token"];
  const decodedToken = jwt.verify(token, authConfig.secret);

  const user = User.getUserById(decodedToken.id);
  if (user.is_admin == false) {
    res.send({
      message: "You do not have the privileges to perform this action."
    });
  }

  Info.destroy({ where: { id: req.params.id } })
    .then(num => {
      if (num >= 1) {
        res.send({
          message: "Information was deleted successfully!"
        });
      } else {
        res.status(404).send({
          message: 'Error deleting Information.'
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error deleting Information."
      });
    });
};

/*
  Create Information
*/
exports.create = async (req, res) => {

  const token = req.headers["x-access-token"];
  const decodedToken = jwt.verify(token, authConfig.secret);

  const user = User.getUserById(decodedToken.id);
  if (user.is_admin == false) {
    res.send({
      message: "You do not have the privileges to perform this action."
    });
  }

  Info.create({
    created_by: decodedToken.id,
    title: req.body.title,
    content: req.body.content,
    infoKey: req.body.infoKey
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error creating Information."
      });
    });
};

/*
 Update Information
*/
exports.update = async (req, res) => {

  const token = req.headers["x-access-token"];
  const decodedToken = jwt.verify(token, authConfig.secret);

  const user = User.getUserById(decodedToken.id);
  if (user.is_admin == false) {
    res.send({
      message: "You do not have the privileges to perform this action."
    });
  }

  Info.update(
    {
      modified_by: decodedToken.id,
      title: req.body.title,
      content: req.body.content,
      infoKey: req.body.description
    },
    { where: { id: req.params.id } }
  )
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Information was Updated successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error updating Information."
      });
    });
};