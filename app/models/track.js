const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('track', {
    track_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    album_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    album_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_id: {
      type: DataTypes.BIGINT,
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
    artist_website: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    license_image_file: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    license_image_file_large: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    license_parent_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    license_title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    license_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_bit_rate: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    track_comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_composer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_copyright_c: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_copyright_p: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_date_created: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_date_recorded: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_disc_number: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    track_duration: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_explicit: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_explicit_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_favorites: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_file: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_genres: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_image_file: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_information: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_instrumental: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_interest: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    track_language_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_listens: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    track_lyricist: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_number: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_publisher: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_title: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    track_url: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'track',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "tracks_pkey",
        unique: true,
        fields: [
          { name: "track_id" },
        ]
      },
    ]
  });
};
