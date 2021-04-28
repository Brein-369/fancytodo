'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User)
    }
  };
  Todo.init({
    title: {
      allowNull : false,
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          args : true,
          msg : "Title shouldn't be empty"
        }
      }
    },
    description: {
      type : DataTypes.STRING,
      validate : {
        notEmpty : {
          args : true,
          msg : "Description shouldn't be empty"
        }
      }
    },
    status:{
      type : DataTypes.BOOLEAN
    },
    due_date:  {
      type : DataTypes.DATE,
      validate : {
        isAfter : new Date(Date.now() - 86400000).toISOString().split('T')[0]
      }
    },
    UserId : {
      type : DataTypes.INTEGER
    }    
  }, {
    sequelize,
    modelName: 'Todo',
  });

  Todo.beforeCreate((instance, options )=>{
    instance.status = false
  })

  return Todo;
};