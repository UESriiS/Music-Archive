const dbConfig = require("./db-config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.sequelize = sequelize;
db.genre = require("../models/genre")(sequelize, Sequelize);
db.artist = require("../models/artist")(sequelize, Sequelize);
db.album = require("../models/album")(sequelize, Sequelize);
db.track = require("../models/track")(sequelize, Sequelize);
db.favourite = require("../models/favourite")(sequelize, Sequelize);
db.user = require("../models/user")(sequelize, Sequelize);
db.review = require("../models/review")(sequelize, Sequelize);
db.info = require("../models/information")(sequelize, Sequelize);

module.exports = db;