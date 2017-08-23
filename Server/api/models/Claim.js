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
			if(claim) return cb(new Error('You\'ve already claimed that challenge'));
			
			// If can claim (not treating the collective challenges yet) :
			Claim.create({
				claimer: inputPlayer,
				challenge: inputChall,
				resolved: false,
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
					if(!player) return cb(new Error('No player found'));
					
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
  }
};

