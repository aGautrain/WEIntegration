/**
 * Challenge.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	autoPK: false,

  attributes: {
	  
	  name: {
		  type: 'string',
		  required: true,
		  unique: true,
		  primaryKey: true
	  },
	  desc: {
		  type: 'text',
		  required: true
	  },
	  collective: {
		  type: 'boolean',
		  defaultsTo: false,
		  required: true
	  },
	  repeatable: {
		  type: 'boolean',
		  defaultsTo: false,
		  required: true
	  },
	  category: {
		  type: 'string',
		  enum: [
			'Vie de l\'école',
			'Social',
			'En équipe',
			'Beauf',
			'Hot'],
		  required: true
	  },
	  thumbnail: {
		  type: 'string',
		  required: false
	  },
	  reward: {
		  type: 'integer',
		  defaultsTo: 0,
		  required: true
	  }

  }
};

