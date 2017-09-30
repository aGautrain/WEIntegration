/**
 * ChallengeController
 *
 * @description :: Server-side logic for managing Challenges
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    // POST - remove challenge from player challengesDone collection
    remove: function (req, res) {
        if (_.isUndefined(req.body['challenge'])) return res.badRequest();
        if (_.isUndefined(req.body['player'])) return res.badRequest();

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";

        sails.log.info(logTime + " Demande de retrait d'un challenge à un joueur..");

        Player.findOne(req.body['player']).exec(function (err, playerFound) {
            if (err) return res.serverError();
            if (!playerFound) return res.badRequest('Joueur inexistant !');


            playerFound.challengesDone.remove(req.body['challenge']);
            playerFound.challengesTodo.add(req.body['challenge']);
            playerFound.save(function (err) {
                if (err) return res.serverError();

                sails.log.info(logTime + " Challenge retiré !");

                return res.json(playerFound);

            });

        });
    }

};
