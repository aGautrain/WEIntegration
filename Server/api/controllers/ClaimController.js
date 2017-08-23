/**
 * ClaimController
 *
 * @description :: Server-side logic for managing claims
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	claim: function(req,res){
		if(_.isUndefined(req.query.id)){
			return res.forbidden('Must give an ID');
		}
		
		if(_.isUndefined(req.query.challenge)){
			return res.forbidden('Must give a challenge ID');
		}
		
		sails.log.debug('Player #' + req.query.id + ' is claiming challenge "' + req.query.challenge + '"');
		
		Claim.claimChallenge({
			player: req.query.id,
			challenge: req.query.challenge
		}, function(err, result){
			if(err) {
				sails.log.error(err);
				return res.forbidden('Claim has failed');
			}
			
			if(!result) return res.serverError();
			
			sails.log.info('Challenge well claimed');
			return res.json(result);
		});
	}
	
};

