/**
 * NoteController
 *
 * @description :: Server-side logic for managing Notes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    // ADMIN ONLY
    writeToAll: function (req, res) {
        if (_.isUndefined(req.body['content'])) return res.badRequest('Aucun contenu donné');

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";

        var inputText = req.body['content'];

        Note.create({
            content: inputText,
            global: true
        }).exec(function (err, noteCreated) {
            if (err) return res.serverError();
            if (!noteCreated) return res.serverError();


            sails.log.info(logTime + " Ajout d'une nouvelle note globale !");
            sails.log.debug(noteCreated);

            return res.json(noteCreated);

        });
    },


    // ADMIN ONLY
    writeToPlayer: function (req, res) {
        if (_.isUndefined(req.body['content'])) return res.badRequest('Aucun contenu donné');
        if (_.isUndefined(req.body['player'])) return res.badRequest('Aucun joueur cible fourni');

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";

        var inputText = req.body['content'];
        var inputPlayer = req.body['player'];

        Note.create({
            content: inputText,
            global: false,
            player: inputPlayer
        }).exec(function (err, noteCreated) {
            if (err) return res.serverError();
            if (!noteCreated) return res.serverError();


            sails.log.info(logTime + " Ajout d'une nouvelle note personnelle !");
            sails.log.debug(noteCreated);

            return res.json(noteCreated);

        });
    },
	
	// ADMIN ONLY
    writeToTeam: function (req, res) {
        if (_.isUndefined(req.body['content'])) return res.badRequest('Aucun contenu donné');
        if (_.isUndefined(req.body['team'])) return res.badRequest('Aucune équipe cible fournie');

        var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";

        var inputText = req.body['content'];
        var inputTeam = req.body['team'];

        Note.create({
            content: inputText,
            global: false,
            team: inputTeam
        }).exec(function (err, noteCreated) {
            if (err) return res.serverError();
            if (!noteCreated) return res.serverError();


            sails.log.info(logTime + " Ajout d'une nouvelle note de team !");
            sails.log.debug(noteCreated);

            return res.json(noteCreated);

        });
    },
	
	getAllNotes: function(req, res) {
		var date = new Date();
        var logTime = "[" + date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "]";
		
		Note.find({}).exec(function(err, notes){
			if(err) return res.serverError();
			
			var indexes = {};
			
			for(var i = 0; i < notes.length; i++){
				// Two possibilities : note belongs to a player OR to a team
				// And then two possibilities : player/team has already some notes OR don't
				if(notes[i]['player'] != undefined && notes[i]['player'] != null){
					if(indexes[notes[i]['player']] == undefined){
						indexes[notes[i]['player']] = [];	
					}
					indexes[notes[i]['player']].push(notes[i]);
				} else if(notes[i]['team'] != undefined && notes[i]['team'] != null){
					if(indexes[notes[i]['team']] == undefined){
						indexes[notes[i]['team']] = [];
					}
					indexes[notes[i]['team']].push(notes[i]);
				}
			}
			
			sails.log.info(logTime + " Envoi des notes indexées par propriétaire");
			sails.log.debug(indexes);
			
			return res.json(indexes);
		});
	}

};
