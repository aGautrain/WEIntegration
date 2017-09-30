/**
 * TeamController
 *
 * @description :: Server-side logic for managing Teams
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    getTeam: function (req, res) {
        if (_.isUndefined(req.param('teamName'))) return res.json({
            success: false,
            message: 'Précisez la Team'
        });

        Team.getTeam(req.param('teamName'), function (err, team) {
            if (err) return res.json({
                success: false,
                message: 'Erreur serveur'
            });

            return res.json({
                success: true,
                result: team
            });
        });
    },

    getTeams: function (req, res) {

        Team.getTeams({}, function (err, teams) {
            if (err) return res.json({
                success: false,
                message: 'Erreur serveur'
            });

            return res.json(teams);
        });
    },

    setAdvantage: function (req, res) {
        if (_.isUndefined(req.body['team'])) return res.badRequest();
        if (_.isUndefined(req.body['advantage'])) return res.badRequest();
        if (_.isUndefined(req.body['comment'])) return res.badRequest();
        if (req.body['advantage'] < -9999 || req.body['advantage'] > 9999) return res.badRequest();

        var comment = ('La Team ' + req.body['team'] + ' à désormais un avantage de ' + req.body['advantage'] + ' points.');
        comment += (' Motif : ' + req.body['comment']);

        var advantage = req.body['advantage'];

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";

        sails.log.info(logTime + " L'avantage de la team '" + req.body['team'] + "' va être modifié");

        // Setting the advantage
        Team
            .update(req.body['team'], {
                'advantage': advantage
            })
            .exec(function (err, updatedTeam) {
                if (err) return res.serverError();
                if (!updatedTeam) return res.badRequest('Impossible de trouver l\'équipe demandée.');

                // Creating a note to inform
                Note.create({
                    team: req.body['team'],
                    content: comment
                }).exec(function (err, note) {
                    if (err) sails.log.error(err);
                });

                sails.log.info(logTime + " Avantage de la team changé avec succès");
                sails.log.debug(updatedTeam[0]);

                return res.json(updatedTeam);

            });
    },

    getAdvantages: function (req, res) {
        Team.find({}).exec(function (err, teams) {
            if (err) return res.serverError();

            if (!teams) return res.serverError('Aucune team existante');

            return res.json(teams);
        });
    }

};
