const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('genre', {
    genre_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    '#tracks': {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    parent: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    top_level: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'genre',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "genres_pkey",
        unique: true,
        fields: [
          { name: "genre_id" },
        ]
      },
    ]
  });
};
