/**
 * TeamController
 *
 * @description :: Server-side logic for managing Teams
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	getTeam: function(req,res){
		if(_.isUndefined(req.param('teamName'))) return res.json({success:false,message:'Précisez la Team'});
		
		Team.getTeam(req.param('teamName'), function(err,team){
			if(err) return res.json({success:false,message:'Erreur serveur'});
			
			return res.json({success:true,result:team});
		});
	},
	
	getTeams: function(req,res){
		
		Team.getTeams({}, function(err,teams){
			if(err) return res.json({success:false,message:'Erreur serveur'});
			
			return res.json(teams);
		});
	}
	
};

