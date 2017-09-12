const Sequelize = require('sequelize');

// module.exports = function(models) {
    const db = new Sequelize('gabble', 'christianhaasis', '', {
        dialect: 'postgres',
    });

    const User = db.define('user', {
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        name: Sequelize.STRING,
    });

    const Message = db.define('message', {
         body: Sequelize.STRING(140),
         userId: Sequelize.INTEGER,
    });

    const Like = db.define('like', {
      messageId: Sequelize.INTEGER,
      userId: Sequelize.INTEGER,

    });


    User.hasMany(Message, {foreignkey: 'userId'});
    User.hasMany(Like, {foreignkey: 'userId'});
    Message.belongsTo(User, {foreignKey: 'userId'});
    Message.hasMany(Like, {foreignKey: 'messageId'});
    Like.belongsTo(Message, {foreignKey: 'messageId'});
    Like.belongsTo(User, {foreignKey: 'userId'});
    User.sync();
    Message.sync();
    Like.sync();

      //  Message.belongsTo(User);
      //  Like.belongsTo(Message);
      //  Like.belongsTo(User);

      // User.hasMany(Message)
      //
      //  Message.belongsTo(User, {foreignKey: 'userId'});
      //  Like.belongsTo(Message, {foreignKey: 'messageId'});
      //  Like.belongsTo(User, {foreignKey: 'userId'});

    //
    // // Sychronize the schemas with the database, meaning make
    // // sure all tables exist and have the right fields.
    //
    // return User.sync()
    //     .then(() => Message.sync())
    //     .then(() => Like.sync())
    //     .then(() => {
    //         return { User, Message, Like };
    //     });

        //  User.sync().then(function () {
        //     console.log('user model syncd');
        //  });
         //
        //  Message.sync().then(function () {
        //     console.log('message model syncd');
        //  });
         //
        //  Like.sync().then(function () {
        //     console.log('like model syncd');
        //  });

        // Todo.create({
        //      item: 'Create todo list',
        //      complete: false,
        // });
    // });

// };
// ************* Schema End **********************

module.exports = {
  User: User,
  Message: Message,
  Like: Like,

}
