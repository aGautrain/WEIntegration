/**
 * Challenge.js
 *
 * @description :: Challenges can be claimed by players. If claim is accepted the player will then be
 *                 granted the reward of the challenge. It is possible to follow the challenges status of
 *                 a player following the three collections "challengesTodo/Doing/Done".
 *                 Challenges have metadata (repeatable, collective, etc..) which affects the way they can be claimed
 *                 or the way the reward is given
 *
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
