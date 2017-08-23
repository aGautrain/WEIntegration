/**
 * Account.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	autoPK: false,

  attributes: {
	  email: {
		  type: 'string',
		  required: true,
		  unique: true,
		  primaryKey: true
	  },
	  password: {
		  type: 'string',
		  required: true
	  },
	  playerRef: {
		  model: 'player'
	  }
  },
  
  // user : { email, password, name, firstName, team, thumbnail }
  register: function(user,cb){
	  
		if(!user) {
				err = new Error();
				err.message = 'FATAL ERROR : api/models/Player.js initialize()';
				err.status = 404;
				return cb(err);
		}
		
		Player.initialize({
			name: user.name,
			firstName: user.firstName,
			team: user.team,
			thumbnail: user.thumbnail
		}, function(err,player){
			if(err) return cb(err);
			
			Account.create({
				email: user.email,
				password: user.password,
				playerRef: player.id
			}).exec(function(err,account){
				if(err) return cb(err);
				
				sails.log.info('New user added to the database successfully');
				
				return cb(null,account);
			});
		});
  }
};

