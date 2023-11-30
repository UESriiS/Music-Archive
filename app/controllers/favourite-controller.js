const db = require("../config/db");
const Track = require("./track-controller");
const User = require("./user-controller")
const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth-config");
const Favourite = db.favourite;
const Review = require("./review-controller");
const track = require("../models/track");
const { Op } = require("sequelize");

/*
    Create a Playlist
*/
exports.create = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decodedToken = jwt.verify(token, authConfig.secret);

    // Check TrackIds
    if (!req.body.name || req.body.name.match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g)) {
      res.status(400).send({
        message: "Invalid playlist name!"
      });
      return;
    }

    if (!req.body.trackIds) {
      res.status(400).send({
        message: "Track Id can not be empty!"
      });
      return;
    }

    const tracks = await Track.getTracks(req.body.trackIds);

    if (tracks === undefined || tracks.length == 0) {
      res.status(400).send({
        message: "All track Ids are invalid!"
      });
      return;
    }

    const trueTrackIds = tracks.map(x => x.track_id);
    let fakeTrackIds = req.body.trackIds.filter(x => !trueTrackIds.includes(x));

    if (fakeTrackIds != 0) {
      res.status(400).send({
        message: `${fakeTrackIds.join(', ')} are invalid track Id`
      });
      return;
    }

    const favouriteCount = await Favourite.count({ where: { created_by: decodedToken.id } });
    if (favouriteCount > 20) {
      res.status(400).send({
        message: "Only up to 20 playlists can be created per user"
      });
      return;
    }

    const favName = req.body.name;
    const existingFav = await Favourite.findOne({
      where: { name: favName },
      raw: true
    });

    if (existingFav) {
      res.status(400).send({
        message: "Name already exists!"
      });
      return;
    }

    Favourite.create({
      name: req.body.name,
      list: req.body.trackIds,
      created_by: decodedToken.id,
      description: req.body.description,
      is_public: false
    }).then(data => {
      res.send(data);
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Error creating playlist."
    });
  }
};

/*
    Find all Playlists
*/
exports.findAll = async (req, res) => {
  try {
    let favourites = [];
    if (req.headers["x-access-token"]) {
      const decodedToken = jwt.verify(req.headers["x-access-token"], authConfig.secret);
      favourites = await Favourite.findAll({
        where: {
          [Op.or]: [
            { created_by: decodedToken.id },
            { is_public: true },
          ]
        },
        raw: true,
        order: [
          ['created_at', 'DESC']
        ]
      });
    } else {
      favourites = await Favourite.findAll({
        where: { is_public: true },
        raw: true,
        limit: 10,
        order: [
          ['modified_at', 'DESC']
        ]
      });
    }

    if (favourites === undefined || favourites.length == 0) {
      return res.status(200).send([]);
    }

    let result = [];
    for (const x of favourites) {
      const user = await User.getUserById(x.created_by);
      const tracks = await Track.getTracks(x.list);
      const totalPlayTime = getTotalPlayTime(tracks);
      const reviews = await Review.getByPlaylist(x.id);
      const revResults = [];
      for (const rev of reviews) {
        if (rev.is_hidden == false) {
          revResults.push(rev);
        }
      }

      const avgRating = getAvgRating(revResults);
      result.push(
        {
          id: x.id,
          name: x.name,
          created_by: x.created_by,
          username: user.username,
          trackIds: x.list,
          description: x.description,
          numberOfTracks: x.list.length,
          totalPlayTime: totalPlayTime,
          trackDetail: tracks,
          averageRating: avgRating,
          modified_at: x.modified_at,
          is_public: x.is_public
        }
      );
    }
    if (result.length == 0) {
      res.status(400).send({
        message: "Error retrieving favourites."
      });
      return;
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Error retrieving playlist."
    });
  }
};

/*
    Find a Playlist
*/
exports.findOne = (req, res) => {
  const name = req.params.name;

  Favourite.findOne({ where: { name: name } })
    .then(data => {
      if (data) {
        res.send(data.list);
      } else {
        res.status(404).send({
          message: 'Error retrieving favourite.'
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error retrieving favourite."
      });
    });
};

/*
    Update a Playlist Name and List
*/
exports.update = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decodedToken = jwt.verify(token, authConfig.secret);

    if (!req.params.id) {
      res.status(400).send({
        message: "Id can not be empty!"
      });
      return;
    }

    // Check TrackIds
    if (!req.body.name || req.body.name.match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g)) {
      res.status(400).send({
        message: "Invalid playlist name!"
      });
      return;
    }

    if (!req.body.trackIds) {
      res.status(400).send({
        message: "Track Id can not be empty!"
      });
      return;
    }

    const tracks = await Track.getTracks(req.body.trackIds);

    if (tracks === undefined || tracks.length == 0) {
      res.status(400).send({
        message: "All track Ids are invalid!"
      });
      return;
    }

    const trueTrackIds = tracks.map(x => x.track_id);
    let fakeTrackIds = req.body.trackIds.filter(x => !trueTrackIds.includes(x));

    if (fakeTrackIds != 0) {
      res.status(400).send({
        message: `${fakeTrackIds.join(', ')} are invalid track Id`
      });
      return;
    }

    let currentDate = new Date();
    Favourite.update(
      {
        name: req.body.name,
        description: req.body.description,
        list: req.body.trackIds,
        modified_by: decodedToken.id,
        modified_at: currentDate,
        is_public: req.body.is_public
      },
      { where: { id: req.params.id } }
    ).then(num => {
      if (num == 1) {
        res.send({
          message: 'Successfully updated playlist.'
        });
      } else {
        res.send({
          message: 'Error updating playlist.'
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Error updating playlist."
    });
  }
};

/*
    Find a Playlist by Name
*/
exports.findOneDetail = async (req, res) => {
  try {
    const name = req.params.name;
    const favourite = await Favourite.findOne({ where: { name: name } });
    if (!favourite) {
      res.status(400).send({
        message: "Favourite list not exists!"
      });
      return;
    }

    const query = req.query;

    let orderBy = "";
    let isDesc = false;
    for (const key in query) {
      if (key === 'orderBy') {
        orderBy = query[key];
      }
      if (key === 'isDesc') {
        isDesc = query[key];
      }
    }
    let ordering = [];
    if (orderBy) {
      const order = isDesc == 'true' ? 'DESC' : 'ASC';
      ordering = [
        [orderBy, order]
      ];
    }

    const result = await Track.findAll(favourite.list, ordering);

    if (result.length == 0) {
      res.status(400).send({
        message: "Error retrieving favourite detail."
      });
      return;
    }

    res.send(result);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Error retrieving favourite detail."
    });
  }
};

/*
    Delete a Playlist by Name
*/
exports.delete = (req, res) => {
  Favourite.destroy({ where: { id: req.params.id } })
    .then(num => {
      if (num >= 1) {
        res.send({
          message: "Playlist was deleted successfully!"
        });
      } else {
        res.status(404).send({
          message: 'Error deleting Playlist.'
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Error deleting Playlist."
      });
    });
};

/*
    Find First 10 Public Playlists
*/
exports.findFirstTen = async (req, res) => {
  try {
    const favourites = await Favourite.findAll({ raw: true });
    const favs = [];
    for (let i = 0; i < 10; i++) {
      const fav = favourites[i];
      if (fav != undefined && fav.is_public != false) {
        favs.push(fav);
      }
    }
    let result = [];
    for (const x of favs) {
      const totalPlayTime = await Track.getTotalPlayTime(x.list);
      result.push(
        {
          Id: x.id,
          Name: x.name,
          "Number Of Tracks": x.list.length,
          "Total Play Time": totalPlayTime

        });
    }

    if (result.length == 0) {
      res.status(400).send({
        message: "Error retrieving favourites."
      });
      return;
    }

    res.send(result);
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Error retrieving favourites."
    });
  }
};

/*
    Find all Private Playlists By User ID
*/
exports.findAuthorizedUserPlaylists = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decodedToken = jwt.verify(token, authConfig.secret);

    const favourites = await Favourite.findAll({ where: { created_by: decodedToken.id } });
    let result = [];
    for (const x of favourites) {
      const totalPlayTime = await Track.getTotalPlayTime(x.list);
      result.push(
        {
          Id: x.id,
          Name: x.name,
          "Number Of Tracks": x.list.length,
          "Total Play Time": totalPlayTime

        });
    }

    if (result.length == 0) {
      res.status(400).send({
        message: "Error retrieving favourites."
      });
      return;
    }

    res.send(result);
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Error retrieving favourites."
    });
  }
};

function getTotalPlayTime(tracks) {
  const durationArrs = tracks
    .map(x => x.track_duration);
  let totolDuration = 0;
  for (let i in durationArrs) {
    totolDuration += timestrToSec(durationArrs[i]);
  }
  // const totolDuration = durationArrs.reduce((a, b) => timestrToSec(a) + timestrToSec(b), 0);
  const totalDuration = new Date(totolDuration * 1000).toISOString().substr(11, 8);
  return totalDuration;
};

function timestrToSec(timestr) {
  let p = timestr.split(':'),
    s = 0, m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10);
    m *= 60;
  }

  return s;
};

function getAvgRating(reviews) {
  if (reviews == null || reviews == undefined) {
    return 0;
  }
  const avgReviewArrs = reviews
    .map(x => x.rating);
  let totalAvg = 0;
  for (let i in avgReviewArrs) {
    totalAvg += avgReviewArrs[i];
  }
  const avgRating = Math.round(totalAvg / avgReviewArrs.length);
  return avgRating;

}