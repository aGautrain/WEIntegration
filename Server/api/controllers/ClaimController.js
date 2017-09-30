/**
 * ClaimController
 *
 * @description :: Server-side logic for managing claims
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    // POST - Claiming a challenge with optionnal proof/comment
    claim: function (req, res) {
        // CHECK PARAMS
        if (_.isUndefined(req.body['id'])) {
            return res.forbidden('Tu n\'es plus connecté');
        }

        if (_.isUndefined(req.body['challenge'])) {
            return res.forbidden('Ce challenge n\'existe pas !');
        }

        var comment = "";
        if (!(_.isUndefined(req.body['comment']))) {
            comment = req.body['comment'];
        }

        var proofUrl = "";
        if (!(_.isUndefined(req.body['proof']))) {
            proofUrl = req.body['proof'];
        }

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";


        // END CHECK PARAMS
        sails.log.debug(logTime + ' Le joueur #' + req.body['id'] + ' réclame "' + req.body['challenge'] + '"');

        // CHECK CAPTAIN STATUS
        Player
            .findOne(req.body['id'])
            .exec(function (err, playerFound) {
                if (err) return res.forbidden('Quelque chose ne fonctionne pas..');
                if (!playerFound) return res.forbidden('Tu n\'es plus connecté');

                var isCaptain = playerFound.isCaptain;

                // CLAIM CHALLENGE
                Claim.claimChallenge({
                    player: req.body['id'],
                    challenge: req.body['challenge'],
                    captain: isCaptain,
                    comment: comment,
                    proof: proofUrl
                }, function (err, result) {
                    if (err) {
                        sails.log.error(logTime + ' Une erreur a eue lieu lors de la réclamation');
                        sails.log.debug(err);
                        var msg = err.message || 'Quelque chose ne fonctionne pas..';
                        return res.forbidden(msg);
                    }

                    if (!result) return res.serverError();

                    sails.log.info(logTime + " La réclamation est un succès");
                    sails.log.debug(result);

                    return res.json(result);
                }); // END CLAIM CHALLENGE

            }); // END CHECK CAPTAIN STATUS


    },

    // GET - Obtain list of actions related to the current player
    story: function (req, res) {
        if (_.isUndefined(req.query.id)) {
            return res.forbidden('Tu n\'es plus connecté');
        }

        var playerId = req.query.id;

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";

        sails.log.debug(logTime + ' Le joueur #' + playerId + ' réclame son journal');

        Player.getCaptains(playerId, function (err, captains) {
            if (err) return res.serverError();
            if (!captains) return res.json({});

            // SEARCH CLAIMS
            Claim
                .find({
                    or: [
                        {
                            claimer: playerId
				},
                        {
                            claimer: captains
				}
			]
                })
                .populate('challenge')
                .exec(function (err, claims) {
                    if (err) return res.serverError();
                    if (!claims) return res.json({});

                    var records = [];
                    var description = "";
                    for (var i = 0; i < claims.length; i++) {


                        if (claims[i]['claimer'] != playerId) {
                            // TEAM CHALLENGE

                            if (claims[i]['challenge']['collective']) {
                                description = 'Votre capitaine a réclamé "' + claims[i]['challenge']['name'] + '".';
                                records.push({
                                    date: claims[i]['createdAt'],
                                    desc: description
                                });

                                if (claims[i]['resolved']) {
                                    if (claims[i]['resolution'] === 'accepted') {
                                        description = 'Challenge "' + claims[i]['challenge']['name'] + '" d\'équipe validé !';
                                    } else if (claims[i]['resolution'] === 'refused') {
                                        description = 'Challenge "' + claims[i]['challenge']['name'] + '" d\'équipe refusé.';
                                    }

                                    if (claims[i]['solverComment'] != "") {
                                        description += (' Commentaire : "' + claims[i]['solverComment'] + '"');
                                    }

                                    records.push({
                                        date: claims[i]['updatedAt'],
                                        desc: description
                                    });
                                }
                            }

                            // END TEAM CHALLENGE
                        } else {
                            // INDIVIDUAL CHALLENGE

                            description = 'Challenge "' + claims[i]['challenge']['name'] + '" réclamé.';
                            records.push({
                                date: claims[i]['createdAt'],
                                desc: description
                            });

                            if (claims[i]['resolved']) {
                                if (claims[i]['resolution'] === 'accepted') {
                                    description = 'Challenge "' + claims[i]['challenge']['name'] + '" validé !';
                                } else if (claims[i]['resolution'] === 'refused') {
                                    description = 'Challenge "' + claims[i]['challenge']['name'] + '" refusé.';
                                }

                                if (claims[i]['solverComment'] != "") {
                                    description += (' Commentaire : "' + claims[i]['solverComment'] + '"');
                                }

                                records.push({
                                    date: claims[i]['updatedAt'],
                                    desc: description
                                });
                            }
                        } // END INDIVIDUAL CHALLENGE
                    }

                    // ADDING THE NOTES OF THE TEAM 
                    Player.findOne(playerId).exec(function (err, playerFound) {
                        if (err) return res.serverError();
                        if (!playerFound) return res.forbidden('Tu n\'es plus connecté !');

                        var teamOfPlayer = playerFound.team;

                        Note.find({
                            or: [
                                {
                                    team: teamOfPlayer
                         },
                                {
                                    global: true
                         },
                                {
                                    player: playerId
                         }
                        ]
                        }).exec(function (err, notes) {
                            if (err) return res.serverError();

                            for (var j = 0; j < notes.length; j++) {
                                records.push({
                                    date: notes[j]['createdAt'],
                                    desc: notes[j]['content']
                                });
                            }

                            sails.log.info(logTime + " Journal retourné avec succès");
                            return res.json(records);
                        });
                    });


                });
            // END SEARCH CLAIMS
        });


    },

    // ADMIN ONLY
    accept: function (req, res) {
        if (_.isUndefined(req.query.id)) {
            return res.forbidden('Tu n\'es plus connecté');
        }

        if (_.isUndefined(req.query.claim)) {
            return res.forbidden('Cette demande n\'existe pas ou plus !');
        }

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";

        sails.log.debug(logTime + ' La réclamation #' + req.query.claim + ' est sur le point d\'être acceptée');

        if (!_.isUndefined(req.query.comment) && req.query.comment != "") {

            Claim.acceptClaim({
                player: req.query.id,
                claim: req.query.claim,
                comment: req.query.comment
            }, function (err, result) {
                if (err) {
                    sails.log.error(err);
                    var msg = err.message || 'Quelque chose ne fonctionne pas..';
                    return res.forbidden(msg);
                }

                if (!result) return res.serverError();

                sails.log.info(logTime + ' Réclamation acceptée avec succès');
                sails.log.debug(result);

                return res.json(result);
            });

        } else {

            Claim.acceptClaim({
                player: req.query.id,
                claim: req.query.claim
            }, function (err, result) {
                if (err) {
                    sails.log.error(err);
                    var msg = err.message || 'Quelque chose ne fonctionne pas..';
                    return res.forbidden(msg);
                }

                if (!result) return res.serverError();

                sails.log.info(logTime + ' Réclamation acceptée avec succès');
                sails.log.debug(result);

                return res.json(result);
            });
        }
    },

    // ADMIN ONLY
    refuse: function (req, res) {
        if (_.isUndefined(req.query.id)) {
            return res.forbidden('Tu n\'es plus connecté');
        }

        if (_.isUndefined(req.query.claim)) {
            return res.forbidden('Cette demande n\'existe pas ou plus !');
        }

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";

        sails.log.debug(logTime + ' La réclamation #' + req.query.claim + ' est sur le point d\'être refusée');


        if (!_.isUndefined(req.query.comment) && req.query.comment != "") {

            Claim.refuseClaim({
                player: req.query.id,
                claim: req.query.claim,
                comment: req.query.comment
            }, function (err, result) {
                if (err) {
                    sails.log.error(err);
                    var msg = err.message || 'Quelque chose ne fonctionne pas..';
                    return res.forbidden(msg);
                }

                if (!result) return res.serverError();

                sails.log.info(logTime + ' Réclamation refusée avec succès');
                sails.log.debug(result);

                return res.json(result);
            });

        } else {

            Claim.refuseClaim({
                player: req.query.id,
                claim: req.query.claim
            }, function (err, result) {
                if (err) {
                    sails.log.error(err);
                    var msg = err.message || 'Quelque chose ne fonctionne pas..';
                    return res.forbidden(msg);
                }

                if (!result) return res.serverError();

                sails.log.info(logTime + ' Réclamation refusée avec succès');
                sails.log.debug(result);

                return res.json(result);
            });
        }

    },

    // ADMIN ONLY
    list: function (req, res) {
        Claim
            .find({})
            .populate('claimer')
            .populate('challenge')
            .exec(function (err, claims) {
                if (err) return res.serverError();
                if (!claims) return res.json({});
                return res.json(claims);
            });
    }

};
