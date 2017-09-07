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

    User.sync();

    const Message = db.define('message', {
         body: Sequelize.STRING(140),
         userId: Sequelize.INTEGER,
    });

    Message.sync();

    const Like = db.define('like', {
      messageId: Sequelize.INTEGER,
      userId: Sequelize.INTEGER,
      liked: Sequelize.BOOLEAN,
    });

    Like.sync();

       Message.belongsTo(User);
       Like.belongsTo(Message);
       Like.belongsTo(User);
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
