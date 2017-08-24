/**
 * ClaimController
 *
 * @description :: Server-side logic for managing claims
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	claim: function(req,res){
		if(_.isUndefined(req.query.id)){
			return res.forbidden('Tu n\'es plus connecté');
		}
		
		if(_.isUndefined(req.query.challenge)){
			return res.forbidden('Ce challenge n\'existe pas !');
		}
		
		sails.log.debug('Player #' + req.query.id + ' is claiming challenge "' + req.query.challenge + '"');
		
		Claim.claimChallenge({
			player: req.query.id,
			challenge: req.query.challenge
		}, function(err, result){
			if(err) {
				sails.log.error(err);
				var msg = err.message || 'Quelque chose ne fonctionne pas..';
				return res.forbidden(msg);
			}
			
			if(!result) return res.serverError();
			
			return res.json(result);
		});
	},
	
	// ADMIN ONLY
	accept: function(req,res){
		if(_.isUndefined(req.query.id)){
			return res.forbidden('Tu n\'es plus connecté');
		}
		
		if(_.isUndefined(req.query.claim)){
			return res.forbidden('Cette demande n\'existe pas ou plus !');
		}
		
		sails.log.debug('Accepting claim #' + req.query.claim + ' of player #' + req.query.id);
		
		Claim.acceptClaim({
			player: req.query.id,
			claim: req.query.claim
		}, function(err, result){
			if(err) {
				sails.log.error(err);
				var msg = err.message || 'Quelque chose ne fonctionne pas..';
				return res.forbidden(msg);
			}
			
			if(!result) return res.serverError();
			
			return res.json(result);
		});
	},
	
	// ADMIN ONLY
	refuse: function(req,res){
		if(_.isUndefined(req.query.id)){
			return res.forbidden('Tu n\'es plus connecté');
		}
		
		if(_.isUndefined(req.query.claim)){
			return res.forbidden('Cette demande n\'existe pas ou plus !');
		}
		
		sails.log.debug('Refusing claim #' + req.query.claim + ' of player #' + req.query.id);
		
		Claim.refuseClaim({
			player: req.query.id,
			claim: req.query.claim
		}, function(err, result){
			if(err) {
				sails.log.error(err);
				var msg = err.message || 'Quelque chose ne fonctionne pas..';
				return res.forbidden(msg);
			}
			
			if(!result) return res.serverError();
			
			return res.json(result);
		});
	},
	
	// ADMIN ONLY
	list: function(req,res){
		Claim
		.find({})
		.populate('claimer')
		.populate('challenge')
		.exec(function(err,claims){
			if(err) return res.serverError();
			if(!claims) return res.json({});
			return res.json(claims);
		});
	}
	
};

