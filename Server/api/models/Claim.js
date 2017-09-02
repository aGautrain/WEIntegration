/**
 * Claim.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
	  
	  claimer: {
		  model: 'player',
		  required: true
	  },
	  challenge: {
		  model: 'challenge',
		  required: true
	  },
	  resolved: {
		  type: 'boolean',
		  required: true,
		  defaultsTo: false
	  },
	  resolution: {
		  type: 'string',
		  required: true,
		  defaultsTo: 'waiting'
	  },
	  claimerComment: {
		  type: 'text',
		  required: false
	  },
	  solverComment: {
		  type: 'text',
		  required: false
	  },
	  claimerProof: {
		  type: 'string',
		  required: false
	  }

  },
  
  // opts must contain challenge, player, captain, comment, (facultative for now)
  claimChallenge: function(opts,cb){
	  
		if(!opts) {
				err = new Error();
				err.message = 'FATAL ERROR : api/models/Claim.js canClaim() no opts provided';
				err.status = 404;
				return cb(err);
		}
		
		var inputChall = opts.challenge; // challenge id (name)
		var inputPlayer = opts.player; // player id
		var inputCaptain = opts.captain; // player is captain (boolean)
		var inputComment = opts.comment || "";
		
		sails.log.debug('Static method claimChallenge invoked with : #' + inputPlayer + ' and "' + inputChall + '"');
		
		// CHECK IF ALREADY CLAIMING
		
		Claim
		.findOne()
		.where({
			challenge: inputChall,
			claimer: inputPlayer,
			resolved: false
		})
		.exec(function (err, claim){
			if(err) return cb(err);
			if(claim) return cb(new Error('Challenge déjà réclamé !'));
			
			// CHECK IF COLLECTIVE
			Challenge
			.findOne(inputChall)
			.exec(function(err, chall){
				if(err) return cb(err);
				if(!chall) return cb(new Error('Challenge inexistant.'));
				
				if(chall.collective && !inputCaptain){
					return cb(new Error('Seul le capitaine de l\'équipe peut réclamer ce challenge !'));
				}
				
				// CHECK UNICITY OF COLLECTIVE CHALLENGE
				/*if(chall.collective && inputCaptain){
					Player.getCaptains(inputPlayer, function(err, captains){
						if(err) return cb(err);
						if(!captains) return cb(new Error('Il n\'y a pas de capitaine dans cette équipe.'));
						
						var otherCaptains = captains;
						otherCaptains.splice(captains.indexOf(inputPlayer), 1);
						Claim
						.find({
							or: [
								{
									challenge: inputChall,
									claimer: otherCaptains,
									resolved: false
								},
								{
									challenge: inputChall,
									claimer: otherCaptains,
									resolved: true,
									resolution: 'accepted'
								}
							]							
						})
						.exec(function (err, cantClaim){
							if(err) return cb(err);
							if(cantClaim) return cb(new Error('Ce challenge collectif est déjà demandé ou obtenu par votre équipe.'));
						});
					});
				}*/
				// END CHECK UNICITY OF COLLECTIVE CHALLENGE
				
				
				// CREATE CLAIM
				Claim.create({
					claimer: inputPlayer,
					challenge: inputChall,
					resolved: false,
					resolution: "waiting",
					claimerComment: inputComment,
					solverComment: "",
					claimerProof: "Not implemented"
				}).exec(function (err, created){
					if(err) return cb(err);
					
					// TRANSFER CHALLENGE FROM "TO DO" TO "DOING"
					Player.findOne({
						id: inputPlayer
					})
					.exec(function (err, player){
						if(err) return cb(err);
						if(!player) return cb(new Error('Joueur introuvable.'));
						
						// transfer here
						player.challengesTodo.remove(inputChall);
						player.challengesDoing.add(inputChall);
						
						player.save(function(err){
							if(err) return cb(err);
							
							sails.log.info('New challenge claimed');
							return cb(null,created);
						});
					
					});	// END TRANSFER CHALLENGE FROM "TO DO" TO "DOING"
				
				}); // END CREATE CLAIM
				
				
			}); // END CHECK IF COLLECTIVE
			
		}); // END CHECK IF ALREADY CLAIMING
  },
  
  acceptClaim: function(opts, cb){
		if(!opts) {
				err = new Error();
				err.message = 'FATAL ERROR : api/models/Claim.js acceptClaim() no opts provided';
				err.status = 404;
				return cb(err);
		}
		
		var inputPlayer = opts.player;
		var inputClaim = opts.claim;
		var inputSolverComment = opts.comment;
		
		sails.log.debug('Static method acceptClaim invoked with : player#' + inputPlayer + ' and claim#' + inputClaim);
		
		Claim
		.findOne({
			id: inputClaim,
			resolved: false
		})
		.populate('challenge')
		.exec(function(err, claim){
			if(err) return cb(err);
			if(!claim) return cb(new Error('Demande inexistante ou bien déjà traitée !'));
			
			var challengeConcerned = claim.challenge;
			
			var updatedClaim = claim;
			updatedClaim.resolved = true;
			updatedClaim.resolution = "accepted";
			if(inputSolverComment != undefined && inputSolverComment != null){
				updatedClaim.solverComment = inputSolverComment
			}
			
			// We can now accept it (update record)
			Claim
			.update({id: inputClaim}, updatedClaim)
			.exec(function (err, updated){
				if(err) return cb(err);
				if(!updated) return cb(new Error('Erreur lors de la validation'));
				
				// And then transfer the challenge of the player concerned
				Player
				.findOne({
					id: inputPlayer
				})
				.exec(function(err,player){
					if(err) return cb(err);
					if(!player) return cb(new Error('Joueur introuvable.'));
					
					player.challengesDoing.remove(challengeConcerned['name']);
					player.challengesDone.add(challengeConcerned['name']);
					// CHECK IF REPEATABLE 
					if(challengeConcerned['repeatable']){
						
						// IF REPEATABLE WE SAVE PLAYER + INCREMENT COUNTER
						
						player.challengesTodo.add(challengeConcerned['name']);
						
						
						player.save(function(err){
							if(err) return cb(err);
							
							var counter = player.challengesRepeated[challengeConcerned['name']];
							if(counter == undefined){
								// never done before
								counter = 1;
							} else {
								// already done yet
								counter++;
							}
							
							player.challengesRepeated[challengeConcerned['name']] = counter;
							var challCounters = player.challengesRepeated;
							
							Player
							.update(player.id, {challengesRepeated: challCounters})
							.exec(function(err, updatedPlayer){
								if(err) return cb(err);
								if(!updatedPlayer) return cb(new Error('Joueur introuvable'));
								
								sails.log.info('Claim successfuly accepted and counter increased');
								return cb(null, updated);
							});
							
							
						});
						
					} else {
						
						// IF NOT REPEATABLE JUST ENDING
						player.save(function(err){
							if(err) return cb(err);
							
							sails.log.info('Claim successfuly accepted');
							return cb(null,updated);
							
						});
					}
				});
				
			});
		});
		
  },
  
  refuseClaim: function(opts, cb){
		if(!opts) {
				err = new Error();
				err.message = 'FATAL ERROR : api/models/Claim.js acceptClaim() no opts provided';
				err.status = 404;
				return cb(err);
		}
		
		var inputPlayer = opts.player;
		var inputClaim = opts.claim;
		var inputSolverComment = opts.comment;
		
		sails.log.debug('Static method refuseClaim invoked with : player#' + inputPlayer + ' and claim#' + inputClaim);
		
		Claim
		.findOne()
		.where({
			id: inputClaim,
			resolved: false
		})
		.exec(function(err, claim){
			if(err) return cb(err);
			if(!claim) return cb(new Error('Demande inexistante ou bien déjà traitée !'));
			
			var updatedClaim = claim;
			updatedClaim.resolved = true;
			updatedClaim.resolution = "refused";
			if(inputSolverComment != undefined && inputSolverComment != null){
				updatedClaim.solverComment = inputSolverComment
			}
			
			// We can now accept it (update record)
			Claim
			.update({id: inputClaim}, updatedClaim)
			.exec(function (err, updated){
				if(err) return cb(err);
				if(!updated) return cb(new Error('Erreur lors du refus'));
				
				// And then transfer the challenge of the player concerned
				Player
				.findOne({
					id: inputPlayer
				})
				.exec(function(err,player){
					if(err) return cb(err);
					if(!player) return cb(new Error('Joueur introuvable.'));
					
					player.challengesDoing.remove(claim.challenge);
					player.challengesTodo.add(claim.challenge);
					player.save(function(err){
						if(err) return cb(err);
						
						sails.log.info('Claim successfuly refused');
						return cb(null,updated);
						
					});
				});
				
			});
		});
		
  }
};

