/**
 * Team.js
 *
 * @description :: Team is a major component of the game, even while it is a very simple model.
 *                 The name is used as primaryKey for ease of testing.
 *                 There is a one-to-many association between team and players, each player having only one team.
 *                 Advantage represents an offset added to team score.
 *                 The score (points) and number of members (nbMembers) are dynamic attributes given when needed.
 *
 * @methods     :: getTeam ->   return a team completed with dynamic attributes
 *              :: getTeams ->  return all the teams completed with their dynamic attributes
 *
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    autoPK: false,

    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true,
            primaryKey: true
        },
        thumbnail: {
            type: 'string',
            required: true
        },
        members: {
            collection: 'player',
            via: 'team'
        },
        advantage: {
            type: 'integer',
            required: true,
            defaultsTo: 0
        }
        // points : calculated
        // nbMembers : calculated

    },

    // static method
    // Renvoie la représentation d'une team
    getTeam: function (teamName, cb) {

        // Vérification triviale
        if (!teamName) {
            err = new Error();
            err.message = 'Un paramètre est manquant.';
            err.status = 404;
            return cb(err);
        }

        Team.findOne(teamName).populate('members').exec(function (err, team) {
            if (err) return cb(err);
            if (!team) {
                err = new Error();
                err.message = 'Aucune équipe trouvée.';
                err.status = 404;
                return cb(err);
            }

            // On récupère tous les id des membres
            var membersId = [];
            for (var k = 0; k < team.members.length; k++) {
                membersId.push(team.members[k].id);
            }

            Player.find({
                id: membersId
            }).populate('challengesDone').exec(function (err, members) {
                if (err) return cb(err);

                // var teamScore = team.advantage;
				var teamScore = 0;
                var teamMembersRepresentation = [];
                var currentChall;

                for (var i = 0; i < members.length; i++) {

                    if (members[i].advantage != undefined) {
                        members[i].score = members[i].advantage;
                    } else {
                        members[i].score = 0;
                    }

                    for (var j = 0; j < members[i].challengesDone.length; j++) {
                        currentChall = members[i].challengesDone[j];
                        if (members[i].challengesDone[j]['repeatable']) {
                            teamScore += currentChall.reward * members[i].challengesRepeated[currentChall.name];
                            members[i].score += currentChall.reward * members[i].challengesRepeated[currentChall.name];
                        } else {
                            teamScore += currentChall.reward;
                            members[i].score += currentChall.reward;
                        }
                    }
                    // On choisit quoi montrer à la Vue
                    teamMembersRepresentation.push({
                        firstName: members[i].firstName,
                        name: members[i].name,
                        // points: members[i].score,
						points: 0,
                        team: teamName,
                        thumbnail: members[i].thumbnail
                    });
                }

                var teamRepresentation = {
                    name: team.name,
                    // points: teamScore,
					points: 0,
                    nbMembers: members.length,
                    thumbnail: team.thumbnail,
                    members: teamMembersRepresentation
                };

                cb(null, teamRepresentation);
            });
        });
    },

    // static method
    // Renvoie la représentation de toutes les teams
    getTeams: function (noparams, cb) {

        Team.find({}).populate('members').exec(function (err, teams) {
            if (err) return cb(err);

            var teamsRepresentation = {};

            // On construit un dictionnaire indexé par nom de team
            for (var a = 0; a < teams.length; a++) {
                teamsRepresentation[teams[a].name] = {
                    name: teams[a].name,
                    points: teams[a].advantage,
					// points: 0,
                    nbMembers: teams[a].members.length,
                    thumbnail: teams[a].thumbnail,
                    members: []
                };
            }


            // On demande tous les joueurs comme chacun appartient à une team
            Player.find({}).populate('challengesDone').exec(function (err, players) {
                if (err) return cb(err);

                for (var b = 0; b < players.length; b++) {

                    if (players[b].advantage != undefined) {
                        players[b].score = players[b].advantage;
                    } else {
                        players[b].score = 0;
                    }
					
					if(players[b].name == "Lengagne"){
						players[b].score += 27;
					}
					
					if(players[b].name == "Schneider-M."){
						players[b].score += 85;
					}
					
					if(players[b].name == " FANTOU"){
						players[b].score += 110;
					}
					
					if(players[b].name == "Lagarde"){
						players[b].score += 120;
					}
					
					if(players[b].name == "Béquet"){
						players[b].score += 170;
					}
					
					if(players[b].name == "Robino"){
						players[b].score += 68;
					}
					
					

                    var currentChall;
                    for (var c = 0; c < players[b].challengesDone.length; c++) {
                        currentChall = players[b].challengesDone[c];

                        if (currentChall['repeatable']) {
                            players[b].score += (currentChall.reward * players[b].challengesRepeated[currentChall.name]);
                        } else {
                            players[b].score += currentChall.reward;
                        }

                    }

                    // var randomScore = Math.round(Math.random()*10);

                    // On ajoute ensuite au dictionnaire le joueur
                    // Sans oublier d'incrémenter le score de son équipe
                    teamsRepresentation[players[b].team].members.push({
                        firstName: players[b].firstName,
                        name: players[b].name,
                        points: players[b].score,
                        // points: 0,
                        team: players[b].team,
                        thumbnail: players[b].thumbnail
                    });

                    teamsRepresentation[players[b].team].points += players[b].score;
                    // teamsRepresentation[players[b].team].points = 0;
                }

                // On réorganise le dictionnaire par convénience
                var goodTeamsRepresentation = [];
                for (var d = 0; d < teams.length; d++) {
                    goodTeamsRepresentation.push(teamsRepresentation[teams[d].name]);
                }

                cb(null, goodTeamsRepresentation);
            });
        });
    }
};
