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
  
  // opts must contain challenge, player, comment (facultative for now)
  claimChallenge: function(opts,cb){
	  
		if(!opts) {
				err = new Error();
				err.message = 'FATAL ERROR : api/models/Claim.js canClaim() no opts provided';
				err.status = 404;
				return cb(err);
		}
		
		var inputChall = opts.challenge;
		var inputPlayer = opts.player;
		
		sails.log.debug('Static method claimChallenge invoked with : #' + inputPlayer + ' and "' + inputChall + '"');
		
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
			
			// If can claim (not treating the collective challenges yet) :
			Claim.create({
				claimer: inputPlayer,
				challenge: inputChall,
				resolved: false,
				resolution: "waiting",
				claimerComment: "Not implemented",
				solverComment: "",
				claimerProof: "Not implemented"
			}).exec(function (err, created){
				if(err) return cb(err);
				
				// We transfer the challenge to his place
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
					
				});	
				
			});
		});
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

