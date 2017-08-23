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
			
			if(!player) return res.badRequest('The cookie sent may have expired.');
			
			return res.json(player);
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

