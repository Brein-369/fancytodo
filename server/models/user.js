'use strict';
const {
  Model
} = require('sequelize');

const {hashPassword, comparePassword} = require('../helpers/bcrypt.js')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Todo)
    }
  };
  User.init({
    email: {
      allowNull : false,
      unique : {
        msg : "try another email"
      },
      type : DataTypes.STRING,
      validate :{
        isEmail :{
          args : true ,
          msg : "Should input with email format"
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull : false,
      validate :{ 
        len : {
          args : [6,12],
          msg : "password min 6 characters max 12 characters"
        }
      }
    } 
    
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((instance, options)=>{
    instance.password = hashPassword(instance.password)
  })

  return User;
};