/**
 * PlayerController
 *
 * @description :: Server-side logic for managing Players
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	// POST : Log a user in the app and sending him a session cookie + his player ID
	login: function(req,res){
		// check params (email/pass)
		if(_.isUndefined(req.body['email'])) return res.badRequest('Email must be defined');
		if(_.isUndefined(req.body['password'])) return res.badRequest('Password must be defined');

		// find a match
		Account.findOne({
			email: req.body['email'],
			password: req.body['password']
		})
		.populate('playerRef')
		.exec(function (err, account) {
			
			if(err) return res.serverError();
			
			if(!account) return res.notFound('No matching account for the given credentials');
			
			sails.log.info('User logged in with id#' + account.playerRef.id);
			
			req.session.playerID = account.playerRef.id;
			
			return res.json(account.playerRef);			
			
			
		});
	},
	
	me: function(req,res){
		/*if(_.isUndefined(req.session.playerID)){
			sails.log.error('NO SESSION ID');
			return res.forbidden('Must be logged in');
		} 
		
		if(req.session.playerID < 0 || req.session.playerID > 9999){
			sails.log.error('NO VALID SESSION ID');
			return res.forbidden('Must be logged in with a valid session');
		}*/
		
		// TO BE REPLACED BY THE ABOVE ONCE SESSION WORKED
		if(_.isUndefined(req.query.id)){
			return res.forbidden('Must give an ID');
		}

		Player.findOne({
			id: req.query.id // TODO: req.session.playerID
		})
		.populate('team')
		.populate('challengesTodo')
		.populate('challengesDoing')
		.populate('challengesDone')
		.exec(function (err, player) {
			
			if(err) return res.serverError();
			
			if(!player) return res.badRequest('The session cookie sent may have expired. Please reconnect !');
			
			var playerCompleted = player;
			// Calculating the amount of points player has
			var points = 0;
			var currentChall;
			for(var i = 0; i < player.challengesDone.length; i++){
				currentChall = player.challengesDone[i];
				if(currentChall.repeatable){
					points += (currentChall.reward * player.challengesRepeated[currentChall.name]);
				} else {
					points += currentChall.reward;
				}
			}
			playerCompleted.points = points;
			
			// No need removing repeatable challenges done (front will do it)			
			
			// Adding a virtual attribute to challenges to do
			
			for(var j = 0; j < player.challengesTodo.length; j++){
				currentChall = player.challengesTodo[j];
				if(currentChall['repeatable']){
					if(player.challengesRepeated[currentChall['name']] != undefined){
						playerCompleted.challengesTodo[j]['repeated'] = player.challengesRepeated[currentChall['name']];
					}
				}
			}
			
			for(var k = 0; k < player.challengesDoing.length; k++){
				currentChall = player.challengesDoing[k];
				if(currentChall['repeatable']){
					if(player.challengesRepeated[currentChall['name']] != undefined){
						playerCompleted.challengesDoing[k]['repeated'] = player.challengesRepeated[currentChall['name']];
					}
				}
			}
			
			return res.json(playerCompleted);
		});
		
	},
	
	state: function(req,res){
		sails.log.info(req.session);
		
		return res.json(req.session);
	},
	
	logout: function(req,res) {
		
		req.session.playerID = -1;
		
		return res.ok();
		
	}
	
};

