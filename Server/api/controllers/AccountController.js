/**
 * AccountController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	registerUser: function(req,res){
		// On a besoin de : { email, password, name, firstName, team, thumbnail }
		if(_.isUndefined(req.body['email'])) return res.badRequest();
		if(_.isUndefined(req.body['password'])) return res.badRequest();
		if(_.isUndefined(req.body['name'])) return res.badRequest();
		if(_.isUndefined(req.body['firstName'])) return res.badRequest();
		if(_.isUndefined(req.body['team'])) return res.badRequest();
		if(_.isUndefined(req.body['thumbnail'])) return res.badRequest();
		
		Account.register({
			email: req.body['email'],
			password: req.body['password'],
			name: req.body['name'],
			firstName: req.body['firstName'],
			team: req.body['team'],
			thumbnail: req.body['thumbnail']			
		}, function(err, account){
			if(err) return res.json({success:false,message:'Erreur serveur'});
			
			return res.json(account);
		});
	}
};

