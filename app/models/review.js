const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('review', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    favourite_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    rating: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'review',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "review_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
