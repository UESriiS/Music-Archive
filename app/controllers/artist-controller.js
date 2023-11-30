const db = require("../config/db");
const { Op } = require("sequelize");
const Artist = db.artist;

exports.findOne = (req, res) => {
    const id = req.params.id;

    Artist.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: 'Error retrieving artist.'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error retrieving artist."
            });
        });
};

exports.findIds = (req, res) => {
    const query = req.query;
    var condition = {};
    for (var key in query) {
        if (key === 'name') {
            condition = {
                artist_name: {
                    [Op.iLike]: `%${query[key]}%`
                }
            };
            break;
        }
    }
    Artist.findAll({
        attributes: ['artist_id'],
        where: condition
    })
        .then(data => {
            if (data) {
                res.send(data.map(x => x.artist_id));
            } else {
                res.status(404).send({
                    message: 'Error retrieving artist.'
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error retrieving artist."
            });
        });
};