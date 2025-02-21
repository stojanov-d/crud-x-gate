import pkg from 'bcryptjs';
const { hash } = pkg;

import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  User.beforeCreate(async (user) => {
    user.password = await hash(user.password, 8);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      user.password = await hash(user.password, 8);
    }
  });

  return User;
};