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
		
		sails.log.debug('Static method acceptClaim invoked with : player#' + inputPlayer + ' and claim#' + inputClaim);
		
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
			updatedClaim.resolution = "accepted";
			
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
					
					player.challengesDoing.remove(claim.challenge);
					player.challengesDone.add(claim.challenge);
					player.save(function(err){
						if(err) return cb(err);
						
						sails.log.info('Claim successfuly accepted');
						return cb(null,updated);
						
					});
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

