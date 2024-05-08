'use strict';
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('../../config/database');
const AppError = require('../../utils/appError');
const project = require('./project');

const user = sequelize.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'username cannot be null'
      },
      notEmpty: {
        msg: 'username cannot be empty'
      },
    }
  },
  type: {
    type: DataTypes.ENUM('0', '1'),
    allowNull: false,
    defaultValue: '1',
    validate: {
      notNull: {
        msg: 'type cannot be null'
      },
      notEmpty: {
        msg: 'type cannot be empty'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'email cannot be null'
      },
      notEmpty: {
        msg: 'email cannot be empty'
      },
      isEmail: {
        msg: 'invalid email address'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'password cannot be null'
      },
      notEmpty: {
        msg: 'password cannot be empty'
      }
    }
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL, // won't be stored in the db, only for programmatic usage
    set(value) {
      if (this.password.length < 7) {
        throw new AppError('Password must be at least 7 characters long', 400);
      }
      if (value === this.password){
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hashedPassword); // passing hashedPassword to password column
      } else {
        throw new AppError('Password and confirm password must be the same', 400);
      }
    }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  freezeTableName: true, // to make 'user' not 'users'
  modelName: 'user',
});

user.hasMany(project, {foreignKey: 'createdBy'});
project.belongsTo(user, {foreignKey: 'createdBy'}); // Define only in one model, otherwise it will be circular dependency error

module.exports = user;
