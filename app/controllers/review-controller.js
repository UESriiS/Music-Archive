const db = require("../config/db");
const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth-config");
const Review = db.review;
const User = require("./user-controller")

/*
    Find all Reviews
*/
exports.findAll = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      order: [
        ['id', 'ASC']
      ],   
      raw: true
    });
    if (reviews.length == 0) {
      res.status(400).send({
        message: "Error retrieving reviews."
      });
      return;
    }
    for (x of reviews) {
      const user = await User.getUserById(x.created_by);
      if (user) x.created_by_name = user.username;
      else x.created_by_name = "";
    }
    res.status(200).send(reviews);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Error retrieving reviews."
    });
  }
};

/*
  Update a Review
*/
exports.update = (req, res) => {

  const token = req.headers["x-access-token"];
  const decodedToken = jwt.verify(token, authConfig.secret);

  if (!req.params.id) {
    res.status(400).send({
      message: "Id can not be empty!"
    });
    return;
  }

  Review.update(
    {
      favourite_id: req.body.favourite_id,
      rating: req.body.rating,
      comment: req.body.comment,
      is_hidden: req.body.is_hidden
    },
    { where: { id: req.params.id } }
  ).then(num => {
    if (num == 1) {
      res.send({
        updated: true
      });
    } else {
      res.send({
        message: 'Error updating review.'
      });
    }
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error updating review."
      });
    });
};

/*
  Delete a Review
*/
exports.delete = (req, res) => {

  const token = req.headers["x-access-token"];
  const decodedToken = jwt.verify(token, authConfig.secret);

  Review.destroy({ where: { id: req.params.id } })
    .then(num => {
      if (num >= 1) {
        res.send({
          message: "Review was deleted successfully!"
        });
      } else {
        res.status(404).send({
          message: 'Error deleting Review.'
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error deleting Review."
      });
    });
};

/*
Retrieve All Reviews by User
*/
exports.getByUserId = async (user_id) => {
  if (!req.params.user_id) {
    res.status(400).send({
      message: "Id cannot be empty."
    });
    return;
  }
  const reviews = await Review.findAll({
    where: { created_by: user_id },
    raw: true
  });

  if (reviews == null || reviews == undefined) {
    res.status(400).send({
      message: "No Reviews could be found."
    });
    return;
  }
  return reviews;
};

/*
  Create a Review
*/
exports.create = async (req, res) => {

  const token = req.headers["x-access-token"];
  const decodedToken = jwt.verify(token, authConfig.secret);

  if (isNaN(req.body.rating) || req.body.rating > 5 || req.body.rating < 1) {
    return res.status(400).send({
      message: "Invalid Rating. Ratings must be between 1 and 10"
    });
  }

  Review.create({
    favourite_id: req.body.favourite_id,
    rating: req.body.rating,
    created_by: decodedToken.id,
    comment: req.body.comment,
    is_hidden: false
  })
    .then(data => {
      res.status(200).send({
        message: "Successfully created review."
      });
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Error creating review."
      });
    });
};

/*
Retrieve All Reviews by Playlist
*/
exports.getByPlaylist = async (fav_id) => {
  if (!fav_id) {
    res.status(400).send({
      message: "Id cannot be empty."
    });
    return;
  }
  const reviews = await Review.findAll({
    where: { favourite_id: fav_id },
    raw: true
  });

  if (reviews == null || reviews == undefined) {
    res.status(400).send({
      message: "No Reviews could be found."
    });
    return;
  }
  return reviews;
};

