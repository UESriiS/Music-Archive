const db = require("../config/db");
const Genre = db.genre;

exports.findAll = (req, res) => {
    Genre.findAll({
        attributes: [
            'genre_id',
            'title',
            'parent'
        ],
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Error retrieving genres."
            });
        });
};