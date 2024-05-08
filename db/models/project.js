'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define('project', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'New project',
    validate: {
      notNull: {
        msg: 'title cannot be null'
      },
      notEmpty: {
        msg: 'title cannot be empty'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '',
    validate: {
      notNull: {
        msg: 'description cannot be null'
      }
    }
  },
  jsonValue: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: '{}',
    validate: {
      notNull: {
        msg: 'jsonValue cannot be null'
      },
      notEmpty: {
        msg: 'jsonValue cannot be empty'
      }
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  freezeTableName: true,
  modelName: 'project'
});
