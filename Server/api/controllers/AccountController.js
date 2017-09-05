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
		
		var argNotGood = "";
		
		if(!(req.body['email'].includes('@'))  || req.body['email'].length < 5){
			argNotGood = "L\'email entrée est incorrecte !";
		}
		
		if(req.body['password'].length < 3 || req.body['password'].length > 20){
			argNotGood = "Le mot de passe doit comprendre de 3 à 20 caractères.";
		}
		
		if(req.body['name'].length < 2 || req.body['name'].length > 16){
			argNotGood = "Le nom de famille doit comprendre de 2 à 16 caractères.";
		}
		
		if(req.body['firstName'].length < 2 || req.body['firstName'].length > 16){
			argNotGood = "Le prénom doit comprendre de 2 à 16 caractères.";
		}
		
		if(argNotGood !== ""){
			
			return res.forbidden(argNotGood);
			
		} else {
		
			Account
			.find()
			.where({
				email: req.body['email']
			})
			.exec(function(err,acc){
				
				if(err) return res.serverError();
				if(acc.length > 0) {
					sails.log.debug(acc);
					return res.forbidden('Un compte avec cet email existe déjà');
				} else {
				
					Account.register({
						email: req.body['email'],
						password: req.body['password'],
						name: req.body['name'],
						firstName: req.body['firstName'],
						team: req.body['team'],
						thumbnail: req.body['thumbnail']			
					}, function(err, account){
						if(err) return res.serverError();
						
						return res.json(account);
					});
				
				}
			});
			
		}
		
		
		
	}
};

