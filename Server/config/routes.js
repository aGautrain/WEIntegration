/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {


    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

    
	// 'post /register': 'AccountController.registerUser',
    'post /login': 'PlayerController.login',
    'get /me': 'PlayerController.me',
    'get /logout': 'PlayerController.logout',
    // 'post /claim': 'ClaimController.claim',
    'get /journal': 'ClaimController.story',
    'get /team': 'TeamController.getTeam',
    'get /teams': 'TeamController.getTeams',
    'post /me/thumbnail': 'PlayerController.setThumbnail',

    // Admin routes below -- only available from the admin console

    'get /admin/accept': 'ClaimController.accept',
    'get /admin/refuse': 'ClaimController.refuse',
    'get /admin/list': 'ClaimController.list',

    'post /admin/advantage': 'TeamController.setAdvantage',
    'post /admin/advantage/player': 'PlayerController.setAdvantage',

    'post /admin/note/write': 'NoteController.writeToAll',
    'post /admin/note/write/player': 'NoteController.writeToPlayer',
	'post /admin/note/write/team': 'NoteController.writeToTeam',

    'get /admin/teams': 'TeamController.getAdvantages',
    'get /admin/players': 'PlayerController.getPlayers',
	'get /admin/notes': 'NoteController.getAllNotes',

    'post /admin/challenge/revert': 'ChallengeController.remove',
	
	// cheat road for seeing scores
	'get /admin/teams/details': 'TeamController.getTeams'



};
