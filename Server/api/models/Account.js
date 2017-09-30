/**
 * Account.js
 *
 * @description :: Account represents the authentication informations (password/email)
 *                 And a reference to the Player associated with the account instance
 * 
 * @methods     :: register ->  create account and initialize players
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    autoPK: false,

    attributes: {
        email: {
            type: 'string',
            required: true,
            unique: true,
            primaryKey: true
        },
        password: {
            type: 'string',
            required: true
        },
        playerRef: {
            model: 'player'
        }
    },

    // user : { email, password, name, firstName, team, thumbnail }
    register: function (user, cb) {

        if (!user) {
            err = new Error();
            err.message = 'FATAL ERROR : api/models/Player.js initialize()';
            err.status = 404;
            return cb(err);
        }

        Player.initialize({
            name: user.name,
            firstName: user.firstName,
            team: user.team,
            thumbnail: user.thumbnail
        }, function (err, player) {
            if (err) return cb(err);

            Account.create({
                email: user.email,
                password: user.password,
                playerRef: player.id
            }).exec(function (err, account) {
                if (err) return cb(err);

                return cb(null, account);
            });
        });
    }
};
