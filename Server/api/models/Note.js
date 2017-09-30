/**
 * Note.js
 *
 * @description :: A note is a way to communicate with players. They will be visible
 *                 in the journal of those concerned by the note.
 *                 Global is the most important note type, all players will see it
 *                 Team specified (and global == false) means the note will be available for all the team members
 *                 Player specified (and global == false) means only the player will be allowed to see the note
 *                   
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
        player: {
            model: 'player',
            required: false
        },
        global: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        }
    }
};
