/**
 * PlayerController
 *
 * @description :: Server-side logic for managing Players
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const sha256 = require('sha256');

module.exports = {

    // POST : Log a user in the app and sending him a session cookie + his player ID
    login: function (req, res) {
        // check params (email/pass)
        if (_.isUndefined(req.body['email'])) return res.badRequest('Pas d\'email');
        if (_.isUndefined(req.body['password'])) return res.badRequest('Pas de mot de passe');

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";

        sails.log.verbose(logTime + " Tentative de connexion");

        // find a match
        Account.findOne({
                email: req.body['email'],
                password: sha256(req.body['password'])
            })
            .populate('playerRef')
            .exec(function (err, account) {

                if (err) return res.serverError();

                if (!account) return res.forbidden('Mauvais login/mot de passe ou compte inexistant');

                sails.log.verbose(logTime + " Connexion réussie");
                sails.log.debug(account);

                // req.session.playerID = account.playerRef.id;

                return res.json(account.playerRef);


            });
    },

    me: function (req, res) {
        /*if(_.isUndefined(req.session.playerID)){
        	sails.log.error('NO SESSION ID');
        	return res.forbidden('Must be logged in');
        } 
		
        if(req.session.playerID < 0 || req.session.playerID > 9999){
        	sails.log.error('NO VALID SESSION ID');
        	return res.forbidden('Must be logged in with a valid session');
        }*/

        // TO BE REPLACED BY THE ABOVE ONCE SESSION WORKED
        if (_.isUndefined(req.query.id)) {
            return res.forbidden('Il faut se connecter au préalable');
        }

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";

        sails.log.verbose(logTime + " Envoi du profil d'un joueur entamé..");

        Player.findOne({
                id: req.query.id // TODO: req.session.playerID
            })
            .populate('team')
            .populate('challengesTodo')
            .populate('challengesDoing')
            .populate('challengesDone')
            .exec(function (err, player) {

                if (err) return res.serverError();

                if (!player) return res.badRequest('Merci de vous reconnecter');

                var playerCompleted = player;
                // Calculating the amount of points player has
                var points = playerCompleted['advantage'];
                var currentChall;
                for (var i = 0; i < player.challengesDone.length; i++) {
                    currentChall = player.challengesDone[i];
                    if (currentChall.repeatable) {
                        points += (currentChall.reward * player.challengesRepeated[currentChall.name]);
                    } else {
                        points += currentChall.reward;
                    }
                }

                playerCompleted.points = points;
				// playerCompleted.points = 0;

                // No need removing repeatable challenges done (front will do it)			

                // Adding a virtual attribute to challenges to do

                for (var j = 0; j < player.challengesTodo.length; j++) {
                    currentChall = player.challengesTodo[j];
                    if (currentChall['repeatable']) {
                        if (player.challengesRepeated[currentChall['name']] != undefined) {
                            playerCompleted.challengesTodo[j]['repeated'] = player.challengesRepeated[currentChall['name']];
                        }
                    }
                }

                for (var k = 0; k < player.challengesDoing.length; k++) {
                    currentChall = player.challengesDoing[k];
                    if (currentChall['repeatable']) {
                        if (player.challengesRepeated[currentChall['name']] != undefined) {
                            playerCompleted.challengesDoing[k]['repeated'] = player.challengesRepeated[currentChall['name']];
                        }
                    }
                }

                sails.log.verbose(logTime + " Fin de l'envoi du profil");
                sails.log.debug(playerCompleted);

                return res.json(playerCompleted);
            });

    },

    setAdvantage: function (req, res) {
        if (_.isUndefined(req.body['team'])) return res.badRequest();
        if (_.isUndefined(req.body['player'])) return res.badRequest();
        if (_.isUndefined(req.body['advantage'])) return res.badRequest();
        if (_.isUndefined(req.body['comment'])) return res.badRequest();
        if (req.body['advantage'] < -9999 || req.body['advantage'] > 9999) return res.badRequest();

        var comment = ('Vous avez désormais un avantage de ' + req.body['advantage'] + ' points.');
        comment += (' Motif : ' + req.body['comment']);

        var advantage = req.body['advantage'];

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";

        sails.log.info(logTime + " L'avantage du joueur #" + req.body['player'] + " va être modifié");

        // Setting the advantage
        Player
            .update(req.body['player'], {
                'advantage': advantage
            })
            .exec(function (err, updatedPlayer) {
                if (err) return res.serverError();
                if (!updatedPlayer) return res.badRequest('Impossible de trouver le joueur en question.');
                if (updatedPlayer.length !== 1) return res.badRequest('Impossible de trouver le joueur en question.');

                // Creating a note to inform
                Note.create({
                    player: req.body['player'],
                    content: comment
                }).exec(function (err, note) {
                    if (err) sails.log.error(err);
                });

                var player = "" + updatedPlayer[0]['firstName'] + " " + updatedPlayer[0]['name'] + " (" + updatedPlayer[0]['id'] + ")";

                sails.log.info(logTime + " Avantage du joueur changé avec succès");
                sails.log.debug(updatedPlayer[0]);

                return res.json(updatedPlayer[0]);

            });
    },

    setThumbnail: function (req, res) {


        if (_.isUndefined(req.body['player'])) return res.badRequest();
        if (_.isUndefined(req.body['thumbnail'])) return res.badRequest();

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";

        var inputPlayer = req.body['player'];
        var inputThumbnail = req.body['thumbnail'];

        sails.log.info(logTime + " La miniature du joueur #" + inputPlayer + " va être modifiée");

        Player.findOne(inputPlayer).exec(function (err, playerFound) {
            if (err) return res.serverError();
            if (!playerFound) return res.badRequest('Ce joueur n\'existe pas');

            var update = playerFound;
            update.thumbnail = inputThumbnail;

            Player.update(inputPlayer, update).exec(function (err, updatedPlayer) {
                if (err) return res.serverError();
                if (updatedPlayer.length == 0) return res.serverError();

                sails.log.info(logTime + " Miniature changée avec succès");

                return res.json(updatedPlayer[0]);
            });
        });

    },

    getPlayers: function (req, res) {
        Player.find().exec(function (err, players) {
            if (err) return res.serverError();

            return res.json(players);
        });
    },

    state: function (req, res) {
        sails.log.info(req.session);

        return res.json(req.session);
    },

    logout: function (req, res) {

        // req.session.playerID = -1;

        return res.ok();

    }

};
