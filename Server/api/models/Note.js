/**
 * Note.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
	content: {
		type: 'string',
		required: true,
		defaultsTo: ""
	},
	team: {
		model: 'team',
		required: false
	},
	global: {
		type: 'boolean',
		required: true,
		defaultsTo: false
	}
  }
};

