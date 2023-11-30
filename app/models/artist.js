const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('artist', {
    artist_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    artist_active_year_begin: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_active_year_end: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_associated_labels: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_contact: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_date_created: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_donation_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_favorites: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_flattr_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_handle: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_image_file: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_images: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_latitude: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_location: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_longitude: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_members: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_paypal_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artist_related_projects: {
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
    artist_wikipedia_page: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'artist',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "artists_pkey",
        unique: true,
        fields: [
          { name: "artist_id" },
        ]
      },
    ]
  });
};
