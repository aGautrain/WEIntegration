/**
 * Player.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
	  name: {
		  type: 'string',
		  required: true
	  },
	  firstName: {
		  type: 'string',
		  required: true
	  },
	  team: {
		  model: 'team'
	  },
	  isCaptain: {
		  type: 'boolean',
		  defaultsTo: false,
		  required: true
	  },
	  thumbnail: {
		  type: 'string',
		  required: true
	  },
	  challengesTodo: {
		  collection: 'challenge'		  
	  },
	  challengesDoing: {
		  collection: 'challenge'
	  },
	  challengesDone: {
		  collection: 'challenge'
	  },
	  challengesRepeated: {
		  type: 'json',
		  defaultsTo: {}
	  }
	  // points : calculated with challengesDone

  },
  
		// player : { name, firstName, team, thumbnail }
		// static method to properly create a player
		initialize: function(player, cb){
			
			if(!player) {
				err = new Error();
				err.message = 'FATAL ERROR : api/models/Player.js initialize()';
				err.status = 404;
				return cb(err);
			}
			
			Player.create(player).exec(function(err,playerCreated){
				if(err) return cb(err);
				
				// For each initialization we go looking for all challenges (cost a lot for 10+ players)
				Challenge.find({}).exec(function(err,challenges){
					if(err) return cb(err);
					// On a bien les challenges sous la forme d'un tableau
					// On retient uniquement les id
					var chall_ids = [];
					for(var i = 0; i < challenges.length; i++){
						chall_ids.push(challenges[i].name);
					}
					
					// On les ajoute au joueur initialisé
					playerCreated.challengesTodo.add(chall_ids);
					playerCreated.save(function(err){
                        if(err) return cb(err);
						sails.log.info('Done initializing the player ' + playerCreated.firstName);
						return cb(null,playerCreated);
                        
                    });
				});
			});
			
		},
		
		// Returning an array of Player id (captains)
		getCaptains: function(player, cb){
			
			if(!player) {
				err = new Error();
				err.message = 'FATAL ERROR : api/models/Player.js getCaptains()';
				err.status = 404;
				return cb(err);
			}
			
			Player.findOne(player).exec(function(err, playerFound){
				if(err) return cb(err);
				if(!playerFound) return cb(new Error('Tu n\'es plus connecté'));
				
				Team.findOne(playerFound.team).populate('members').exec(function(err, teamFound){
					if(err) return cb(err);
					if(!teamFound) return cb(new Error('Impossible de trouver ton équipe ?!'));
					
					var captains = [];
					for(var i = 0; i < teamFound.members.length; i++){
						if(teamFound.members[i]['isCaptain']){
							captains.push(teamFound.members[i]['id']);
						}
					}
					
					return cb(null, captains);
				});
			});
		}
};

