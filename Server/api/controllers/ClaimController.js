/**
 * ClaimController
 *
 * @description :: Server-side logic for managing claims
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	claim: function(req,res){
		// CHECK PARAMS
		if(_.isUndefined(req.query.id)){
			return res.forbidden('Tu n\'es plus connecté');
		}
		
		if(_.isUndefined(req.query.challenge)){
			return res.forbidden('Ce challenge n\'existe pas !');
		}
		
		var comment = "";
		if(!(_.isUndefined(req.query.comment))){
			comment = req.query.comment;
		}
		// END CHECK PARAMS
		sails.log.debug('Player #' + req.query.id + ' is claiming challenge "' + req.query.challenge + '"');
		
		// CHECK CAPTAIN STATUS
		Player
		.findOne(req.query.id)
		.exec(function(err, playerFound){
			if(err) return res.forbidden('Quelque chose ne fonctionne pas..');
			if(!playerFound) return res.forbidden('Tu n\'es plus connecté');
			
			var isCaptain = playerFound.isCaptain;
			
			// CLAIM CHALLENGE
			Claim.claimChallenge({
				player: req.query.id,
				challenge: req.query.challenge,
				captain: isCaptain,
				comment: comment
			}, function(err, result){
				if(err) {
					sails.log.error(err);
					var msg = err.message || 'Quelque chose ne fonctionne pas..';
					return res.forbidden(msg);
				}
				
				if(!result) return res.serverError();
				
				return res.json(result);
			});// END CLAIM CHALLENGE
			
		}); // END CHECK CAPTAIN STATUS
		
		
	},
	
	story: function(req,res){
		if(_.isUndefined(req.query.id)){
			return res.forbidden('Tu n\'es plus connecté');
		}
		
		sails.log.debug('Player #' + req.query.id + ' wants his story');
		
		Player.getCaptains(req.query.id, function(err, captains){
			if(err) return res.serverError();
			if(!captains) return res.json({});
			
			// SEARCH CLAIMS
			Claim
			.find({or: [
				{ 
					claimer: req.query.id 
				},
				{
					claimer: captains
				}
			]})
			.populate('challenge')
			.exec(function (err, claims){
				if(err) return res.serverError();
				if(!claims) return res.json({});
				
				var records = [];
				var description = "";
				for(var i =0; i < claims.length; i++){
					
					
					if(claims[i]['claimer'] != req.query.id){
						// TEAM CHALLENGE
						
						if(claims[i]['challenge']['collective']){
							description = 'Votre capitaine a réclamé "' + claims[i]['challenge']['name'] + '".'; 
							records.push({
								date: claims[i]['createdAt'],
								desc: description 
							});
							
							if(claims[i]['resolved']){
								if(claims[i]['resolution'] === 'accepted'){
									description = 'Challenge "' + claims[i]['challenge']['name'] + '" d\'équipe validé !'; 
								} else if (claims[i]['resolution'] === 'refused'){
									description = 'Challenge "' + claims[i]['challenge']['name'] + '" d\'équipe refusé.'; 
								}
								
								if(claims[i]['solverComment'] != ""){
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
						
						if(claims[i]['resolved']){
							if(claims[i]['resolution'] === 'accepted'){
								description = 'Challenge "' + claims[i]['challenge']['name'] + '" validé !'; 
							} else if (claims[i]['resolution'] === 'refused'){
								description = 'Challenge "' + claims[i]['challenge']['name'] + '" refusé.'; 
							}
							
							if(claims[i]['solverComment'] != ""){
								description += (' Commentaire : "' + claims[i]['solverComment'] + '"');
							}
							
							records.push({
								date: claims[i]['updatedAt'],
								desc: description 
							});
						}
					} // END INDIVIDUAL CHALLENGE
				}
				
				// ADDING THE NOTES OF THE TEAM - team should be given as a cookie var
				Player.findOne(req.query.id).exec(function(err,playerFound){
					if(err) return res.serverError();
					if(!playerFound) return res.forbidden('Tu n\'es plus connecté !');
					
					var teamOfPlayer = playerFound.team;
					
					Note.find({
						team: teamOfPlayer
					}).exec(function(err, notes){
						if(err) return res.serverError();
						
						for(var j = 0; j < notes.length; j++){
							records.push({
								date: notes[j]['createdAt'],
								desc: notes[j]['content']
							});
						}
						
						return res.json(records);
					});
				});
				
				
			});
			// END SEARCH CLAIMS
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
		
		if(!_.isUndefined(req.query.comment) && req.query.comment != ""){
			
			Claim.acceptClaim({
				player: req.query.id,
				claim: req.query.claim,
				comment: req.query.comment
			}, function(err, result){
				if(err) {
					sails.log.error(err);
					var msg = err.message || 'Quelque chose ne fonctionne pas..';
					return res.forbidden(msg);
				}
				
				if(!result) return res.serverError();
				
				return res.json(result);
			});
			
		} else {
		
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
		}
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
		
		
		if(!_.isUndefined(req.query.comment) && req.query.comment != ""){
			
			Claim.refuseClaim({
				player: req.query.id,
				claim: req.query.claim,
				comment: req.query.comment
			}, function(err, result){
				if(err) {
					sails.log.error(err);
					var msg = err.message || 'Quelque chose ne fonctionne pas..';
					return res.forbidden(msg);
				}
				
				if(!result) return res.serverError();
				
				return res.json(result);
			});
			
		} else {
		
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
		}
		
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

