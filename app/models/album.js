const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('album', {
    album_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    album_comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_date_created: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_date_released: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_engineer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_favorites: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_handle: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_image_file: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_images: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_information: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_listens: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    album_producer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_tracks: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    album_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'album',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "albums_pkey",
        unique: true,
        fields: [
          { name: "album_id" },
        ]
      },
    ]
  });
};
