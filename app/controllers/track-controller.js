const db = require("../config/db");
const { Op } = require("sequelize");
const Track = db.track;

exports.findOne = (req, res) => {
  const id = req.params.id;

  Track.findOne({
    attributes: [
      'artist_id',
      'artist_name',
      'album_id',
      'album_title',
      'track_number',
      'track_title',
      'track_duration',
      'track_genres',
      'track_date_created',
      'track_date_recorded',
      'tags'
    ],
    where: { track_id: id }
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Error retrieving track."
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error retrieving track."
      });
    });
};

exports.getTracks = async (trackIds) => {
  return await Track.findAll({
    where: { track_id: trackIds },
    raw: true
  });
};

exports.search = (req, res) => {
  const body = req.body;

  const condition = {
    [Op.and]: [
      { track_genres: { [Op.iLike]: `%${body.track_genres}%` } },
      { artist_name: { [Op.iLike]: `%${body.artist_name}%` } },
      { album_title: { [Op.iLike]: `%${body.album_title}%` } },
      { track_title: { [Op.iLike]: `%${body.track_title}%` } },
    ]
  };

  Track.findAll({
    limit: 100,
    where: { [Op.and]: condition }
  }).then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: "Error retrieving track."
      });
    }
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Error retrieving track."
    });
  });
};

exports.findAll = async (trackIds, ordering = []) => {
  const tracks = await Track.findAll({
    where: {
      track_id: trackIds
    },
    order: ordering,
    raw: true
  });
  return tracks;
};


