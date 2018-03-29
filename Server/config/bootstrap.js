/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

    // Check following file /config/env/<your-environment>.js
    if(sails.config.needsBootstrapStep) {
    

        // CHALLENGES INTIALIZATION
        var challs = [
            // VIE DE L'ECOLE
            {
                name: 'Adhérer il te faudra',
                desc: 'Adhérer à l\'ISATI (en plus c\'est cool)',
                category: 'Vie de l\'école',
                collective: false,
                reward: 15
            },
            {
                name: 'Participer tu devras',
                desc: 'Participer au Lundi Isatien',
                category: 'Vie de l\'école',
                collective: false,
                reward: 5
            },
            {
                name: 'Rendre visite à un Club',
                desc: 'Chaque club visité te rapportera 5 points !',
                category: 'Vie de l\'école',
                collective: false,
                repeatable: true,
                reward: 5
            },
            {
                name: 'Le barbecue, c\'est la vie',
                desc: 'Participer au barbecue de rentrée (amène ta saucisse)',
                category: 'Vie de l\'école',
                collective: false,
                reward: 5
            },
            {
                name: 'Isatien tu es devenu',
                desc: 'Compléter toutes les missions de cette catégorie',
                category: 'Vie de l\'école',
                collective: false,
                reward: 20
            },
            // SOCIAL
            {
                name: 'Isati l\'istati, mon copain <3',
                desc: 'Devenir ami avec Isati BDE Esir sur Facebook',
                category: 'Social',
                collective: false,
                reward: 1
            },
            {
                name: 'La meilleure source d\'info',
                desc: 'Rejoindre les groupes "Esir" et "Esir promo 2020" sur Facebook',
                category: 'Social',
                collective: false,
                reward: 2
            },
            {
                name: 'Au point où on en est',
                desc: 'Suivre l\'ESIR sur un max de réseaux sociaux et cie. Sauf Google Plus.',
                category: 'Social',
                collective: false,
                reward: 1
            },
            {
                name: 'La fine équipe',
                desc: 'Intègre l\'une des équipes de sport de classe internationale ! Basket, foot, volley, handball, etc..',
                category: 'Social',
                collective: false,
                reward: 10
            },

            {
                name: 'Tournoi Esirien',
                desc: 'Participe au tournoi de la rentrée ! Des points à gagner pour les meilleurs !',
                category: 'Social',
                collective: true,
                reward: 10
            },
            {
                name: 'Être relou, un état d\'esprit',
                desc: 'Payer un RU avec des pièces rouges - preuve à l\'appui',
                category: 'Social',
                collective: false,
                reward: 10
            },
            {
                name: 'La corruption c\'est bien',
                desc: 'Soudoyer pour gagner. Le bureau du BDE dispose d\'une réserve secrète de points',
                category: 'Social',
                collective: false,
                reward: 0
            },
            {
                name: 'La générosité c\'est mieux',
                desc: 'Offrir des shooters à tes chefs d\'équipe, c\'est aussi un très bon moyen d\'avoir des points (2 par shooter)',
                category: 'Social',
                collective: false,
                reward: 2
            },
            {
                name: 'Chez les copains c\'est encore mieux',
                desc: 'Double mètre de shooters au Meltdown, à seulement ... 25€ ! 2 max',
                category: 'Social',
                collective: true,
                reward: 25
            },
            {
                name: 'Open Bar chez moi',
                desc: 'Organiser une soirée chez l\'un des membres de l\'équipe (chaque présent rapporte 2 points)',
                category: 'Social',
                collective: false,
                reward: 2
            },
            {
                name: 'Saint Michel vous salue',
                desc: 'Participer à la première soirée, rue de la soif à Rennes, avec son groupe',
                category: 'Social',
                collective: false,
                reward: 2
            },
            {
                name: 'Claire fontaine',
                desc: 'Lancer une chanson paillarde en centre-ville ou au RU - preuve exigée !',
                category: 'Social',
                collective: false,
                reward: 4
            },
            {
                name: 'Rouge comme une tomate',
                desc: 'Se teindre les cheveux en rouge, vous en rêviez ? *Bonus proportionnel au nombre de jours teintés et si teinture permanente*',
                category: 'Social',
                collective: false,
                reward: 50
            },
            {
                name: 'Barathon .. 1..2..3..Partez!',
                desc: 'Se prendre en photo avec une consommation dans le plus de bar possible de Rennes (2 points par bar)',
                category: 'Social',
                collective: false,
                repeatable: true,
                reward: 2
            },

            {
                name: 'Quelqu\'un aurait une enveloppe a but contraceptif ?',
                desc: 'Faire une annonce dans le RU pour demander une capote (preuve a l\'appui, +5 points si obtention)',
                category: 'Social',
                collective: false,
                reward: 10
            },
            {
                name: 'Hommage à Bézu',
                desc: 'Lancer une queuleuleu de plus de 50 personnes, place des lices (preuve à l\'appui)',
                category: 'Social',
                collective: true,
                reward: 7
            },
            {
                name: 'PAQUITO PAQUITO PAQUITO',
                desc: 'Lancer un paquito de 25 personnes ou plus (preuve à l\'appui)',
                category: 'Social',
                collective: true,
                reward: 20
            },
            {
                name: 'Un caleçon ou un sort',
                desc: 'Faire ôter le calçon d\'un inconnu dans la rue ou dans un bar (photo requise)',
                category: 'Social',
                collective: false,
                reward: 7
            },
            {
                name: 'Hey Mademoiselle !!',
                desc: 'Faire oter le soutien-gorge d\'une inconnue dans la rue ou un bar (preuve à l\'appui)',
                category: 'Social',
                collective: false,
                reward: 7
            },
            {
                name: 'Répandons l\'amour! et la mononucléose...',
                desc: 'se faire embrasser par un/une inconnu/e (preuve à l\'appui)',
                category: 'Social',
                collective: false,
                reward: 7
            },
            {
                name: 'Ultra sociaux',
                desc: 'Compléter toutes les missions de la catégorie Social',
                category: 'Social',
                collective: false,
                reward: 25
            },



            // EN EQUIPE
            {
                name: 'Autographes à gogo',
                desc: 'Pars à la rencontre des écoles du campus, aggro, insa, chimie, supélec et récolte le plus de signatures possible... sur ton corps (preuve à l\'appui) 20 points max par personne, 1 point/ signature',
                category: 'En équipe',
                collective: false,
                reward: 0
            },
            {
                name: 'Jogging découverte',
                desc: 'Courir autour du campus en sous-vêtements (15 points + 5 par personne si toute l\'équipe est là)',
                category: 'En équipe',
                collective: true,
                reward: 15
            },
            {
                name: 'Cohésion vestimentaire',
                desc: 'Montrez nous que votre équipe est soudée en venant tous habillés pareil (à quelques choses près) à l\'ESIR ou en soirée (preuve à l\'appui)',
                category: 'En équipe',
                collective: true,
                reward: 7
            },
            {
                name: 'Ca a l\'air intéressant ce que tu apprends...',
                desc: 'Se tromper d\'amphi... de bâtiment... d\'école? Assister à un cours dans un amphi d\'une autre école du campus (preuve à l\'appui). Points selon créativité',
                category: 'En équipe',
                collective: false,
                reward: 0
            },
            {
                name: 'Ce n\'est pas si mal le bleu',
                desc: 'L\'équipe doit porter haut et fort les couleurs de l\'école pendant les soirées',
                category: 'En équipe',
                collective: false,
                reward: 6
            },
            {
                name: 'On aurait du choisir architecture',
                desc: 'Faire une pyramide humaine de 3 étages (preuve à l\'appui)',
                category: 'Social',
                collective: true,
                reward: 10
            },
            {
                name: 'Sexy car wash',
                desc: 'Laver une voiture (de préférence celle de ton chef  d\'équipe) de façon très sexy, en équipe (preuve à l\'appui)',
                category: 'En équipe',
                collective: true,
                reward: 25
            },
            {
                name: 'Venez comme vous êtes',
                desc: 'Rentrez dans un bar du centre-ville déquisé (preuve à l\'appui)',
                category: 'En équipe',
                collective: false,
                reward: 7
            },
            {
                name: 'Liés à tout jamais',
                desc: 'Participe à une soirée de la soif avec ton équipe, le tout en étant tous attachés par les pieds. Chaque personne de la chaîne rapporte 10 points.',
                category: 'En équipe',
                collective: true,
                reward: 0
            },
            {
                name: 'On nous appelle les Avengers!',
                desc: 'Réaliser tous les défis de la catégorie En équipe',
                category: 'En équipe',
                collective: true,
                reward: 20
            },
            // BEAUF
            {
                name: 'En sortant de la douche',
                desc: 'Aller à une soirée place des lices un jeudi soir en peignoir (preuve à l\'appui)',
                category: 'Beauf',
                collective: false,
                reward: 20
            },
            {
                name: 'Préparation à l\'Iron man',
                desc: 'Faire 15 pompes au milieu de la foule sur la place des Lices un jeudi soir (preuve à l\'appui, 1x max par équipe)',
                category: 'Beauf',
                collective: true,
                reward: 15
            },
            {
                name: 'Lecture coquine',
                desc: 'Simuler un orgasme à la BU (1x max par équipe) PREUUUUUVE !',
                category: 'Beauf',
                collective: true,
                reward: 15
            },
            {
                name: 'On a le style ou on ne l\'a pas',
                desc: 'Aller en ville en borat (preuve à l\'appui)',
                category: 'Beauf',
                collective: false,
                reward: 20
            },
            {
                name: 'On est en bretagne j\'avais peur qu\'il pleuve',
                desc: 'Aller dans un supermarché en combinaison de plongée (preuve à l\'appui)',
                category: 'Beauf',
                collective: false,
                reward: 15
            },
            {
                name: 'Fier d\'être breton !',
                desc: 'Aller dans un supermarché en tenue de plage (preuve à l\'appui)',
                category: 'Beauf',
                collective: false,
                reward: 15
            },
            {
                name: 'Pêcher un poisson à la poissonerie',
                desc: 'Je crois qu\'un titre ne pourra être plus explicite. N\'oublie pas ta canne à pêche(prevue à l\'appui)',
                category: 'Beauf',
                collective: false,
                reward: 10
            },
            {
                name: 'Hey Macarena!',
                desc: 'Faire une macarena au RU ou dans le hall de l\'ESIR (preuve à l\'appui) 2 points bonus si équipe complète',
                category: 'Beauf',
                collective: true,
                reward: 8
            },
            {
                name: 'La beauf attitude',
                desc: 'Réaliser tous les défis de la catégorie Beauf',
                category: 'Beauf',
                collective: false,
                reward: 20
            },
            // HOT
            {
                name: 'Les Dieux de l\'Esir',
                desc: 'Prendre une photo type Dieux du stade, seul ou en groupe (montre la en privé à ton capitaine si tu préfères)',
                category: 'Hot',
                reward: 15,
                collective: false
            },
            {
                name: 'Je suis sexy en selfie!',
                desc: 'Participer au concours du selfie le plus sexy-beauf ! On élira les gagnants.',
                category: 'Hot',
                collective: false,
                reward: 0
            },
            {
                name: 'Il fait chaud ici',
                desc: 'Se baigner avec son équipe dans une fontaine de la ville (preuve à l\'appui)',
                category: 'Hot',
                collective: true,
                reward: 15
            },
            {
                name: 'Bain moussant',
                desc: 'Tout pareil que le dernier défi mais en rajoutant un peu de mousse',
                category: 'Hot',
                collective: true,
                reward: 10
            },
            {
                name: 'Tous en sous-vêtements',
                desc: 'Prendre une photo de l\'équipe en sous-vêtements',
                category: 'Hot',
                collective: true,
                reward: 30
            },
            {
                name: 'Le défi ultime: le challenge des lices!',
                desc: 'Se faire prendre en photo nue en haut de l\'horloge place des lices',
                category: 'Hot',
                collective: false,
                reward: 50
            },
            {
                name: 'Eske tu bèz?!',
                desc: 'Un(e) Esirien(ne) demande à un(e) parfait(e) inconnu(e) si il(elle) veut coucher avec lui(elle) tout en restant le plus sérieux possible (preuve à l\'appui)',
                category: 'Hot',
                collective: false,
                reward: 0
            },
            {
                name: 'Jamais 2 sans 3',
                desc: 'Propose un plan à 3 tant que t\'y es, plus on est de fou plus on rit !',
                category: 'Hot',
                collective: false,
                reward: 0
            },
            {
                name: 'Disons que l\'on se connait très bien maintenant...',
                desc: 'Réaliser tous les défis de la catégorie Hot',
                category: 'Hot',
                collective: true,
                reward: 40
            }
        ];

            var teams = [
                {
                    name: 'ToyStory',
                    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDjMGZaNTEpTuGvCT9e5h8JLQ3xnDHESmP2Rt_r6yfaCSjLfmuJZwyazk',
                    members: []
                },
                {
                    name: 'Harry Potter',
                    thumbnail: 'http://www.franckymagie.com/images/technique/tour-de-magie.png',
                    members: []
                },
                {
                    name: 'Avengers',
                    thumbnail: 'https://68.media.tumblr.com/avatar_6c6969812f44_128.png',
                    members: []
                },
                {
                    name: 'Pirates des Caraïbes',
                    thumbnail: 'https://68.media.tumblr.com/avatar_45c5488df635_128.png',
                    members: []
                },
                {
                    name: 'Seigneur des anneaux',
                    thumbnail: 'https://68.media.tumblr.com/avatar_78fd14b74e9b_128.png',
                    members: []
                },
                {
                    name: 'X-men',
                    thumbnail: 'https://s-media-cache-ak0.pinimg.com/236x/70/ac/54/70ac54ba852c1619d01e21d3e8e57310.jpg',
                    members: []
                },
                {
                    name: 'Minions',
                    thumbnail: 'http://www.coloriageonline.com/img/categorias/156.gif',
                    members: []
                },
                {
                    name: 'Batman',
                    thumbnail: 'https://batman.myheroeshops.com/bundles/heroeshops/images/upload/11_BATMAN.png',
                    members: []
                },
                {
                    name: 'Star Wars',
                    thumbnail: 'https://lh3.googleusercontent.com/XGQzo00WzL4Icoftl_cpogskee7YMnEMmJufCmL7Gntr-MlReH8VJA9V3vVsauNjSDVS=w128',
                    members: []
                },
                {
                    name: 'Tortues Ninjas',
                    thumbnail: 'https://68.media.tumblr.com/avatar_73f604558d8c_128.png',
                    members: []
                }
            ];

        
        // TEAMS AND MEMBERS INITIALIZATION
        
            var antoine = {
                name: 'Gautrain',
                firstName: 'Antoine',
                team: 'ToyStory',
                isCaptain: true,
                thumbnail: 'https://ionicframework.com/dist/preview-app/www/assets/img/avatar-ts-buzz.png'
            };

            var donovan = {
                name: 'Neveux',
                firstName: 'Donovan',
                team: 'ToyStory',
                isCaptain: true,
                thumbnail: 'https://ionicframework.com/dist/preview-app/www/assets/img/avatar-ts-woody.png'
            };

            var victor = {
                name: 'Melin',
                firstName: 'Victor',
                team: 'Harry Potter',
                thumbnail: 'https://a.wattpad.com/useravatar/harrypotter_31.128.612497.jpg'
            };

            var adam = {
                name: 'Olive',
                firstName: 'Adam',
                team: 'Harry Potter',
                thumbnail: 'http://sf2.be.com/wp-content/uploads/2016/01/Ronald-Weasley-Wallpaper-ronald-weasley-25505354-1024-768.jpg'
            };

            var robin = {
                name: 'Février',
                firstName: 'Robin',
                team: 'Avengers',
                thumbnail: 'https://68.media.tumblr.com/avatar_4da85646ce86_128.png'
            };

            var marion = {
                name: 'Cornilleau',
                firstName: 'Marion',
                team: 'Avengers',
                thumbnail: 'https://a.wattpad.com/useravatar/Natasha_Barton.128.310552.jpg'
            };

            var hugues = {
                name: 'Connan',
                firstName: 'Hugues',
                team: 'Pirates des Caraïbes',
                thumbnail: 'https://68.media.tumblr.com/avatar_43255f8d112a_128.png'
            };

            var amaury = {
                name: 'Berthelot',
                firstName: 'Amaury',
                team: 'Pirates des Caraïbes',
                thumbnail: 'https://68.media.tumblr.com/avatar_35e33376b02f_128.png'
            };

            var thomas = {
                name: 'Legris',
                firstName: 'Thomas',
                team: 'Seigneur des anneaux',
                thumbnail: 'https://pbs.twimg.com/profile_images/634833382103363585/1OFzrfwU_reasonably_small.jpg'
            };

            var anne = {
                name: 'Esperet',
                firstName: 'Anne',
                team: 'Seigneur des anneaux',
                thumbnail: 'https://68.media.tumblr.com/avatar_ff81b0fbba22_128.png'
            };

            var leo = {
                name: 'Guillepin',
                firstName: 'Léo',
                team: 'X-men',
                thumbnail: 'https://68.media.tumblr.com/avatar_b85641c7896e_128.png'
            };

            var sophy = {
                name: 'Brunoy',
                firstName: 'Sophy',
                team: 'X-men',
                thumbnail: 'https://68.media.tumblr.com/avatar_5ac83467a468_128.png'
            };

            var antoineB = {
                name: 'Brazier',
                firstName: 'Antoine',
                team: 'Minions',
                thumbnail: 'https://s-media-cache-ak0.pinimg.com/736x/b3/8e/18/b38e185ea58b2de85a7d2d3232a71cf1.jpg'
            };

            var joceran = {
                name: 'Fichou-Meunier',
                firstName: 'Joceran',
                team: 'Minions',
                thumbnail: 'https://s-media-cache-ak0.pinimg.com/736x/87/02/78/8702787c9b0e0049ea4615bf90f6a0f2.jpg'
            };

            var aurelien = {
                name: 'Descormier',
                firstName: 'Aurélien',
                team: 'Batman',
                thumbnail: 'http://findicons.com/files/icons/1293/the_batman_vol_1/128/batman.png'
            };

            var maxime = {
                name: 'Arif',
                firstName: 'Maxime',
                team: 'Batman',
                thumbnail: 'https://68.media.tumblr.com/avatar_d0ff286240f7_128.png'
            };

            var milad = {
                name: 'Bahiraei',
                firstName: 'Milad',
                team: 'Star Wars',
                thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzYs4LY9S96DNJ2pup6QD7boD3VCLeL5SrD2B9kYdzON4DAPqT'
            };

            var etienne = {
                name: 'Delahaye',
                firstName: 'Etienne',
                team: 'Star Wars',
                thumbnail: 'https://static.anakinworld.com/uploads/entries/square_medium/personnage-yoda.jpg'
            };

            var camille = {
                name: 'Turmel',
                firstName: 'Camille',
                team: 'Tortues Ninjas',
                thumbnail: 'https://s-media-cache-ak0.pinimg.com/736x/bf/55/6f/bf556f861f26a44d50b7ded8556f088a.jpg'
            };

            var alexis = {
                name: 'Nebout',
                firstName: 'Alexis',
                team: 'Tortues Ninjas',
                thumbnail: 'https://s-media-cache-ak0.pinimg.com/736x/44/a5/27/44a527de57ab0fbb08d9814c17862ad1.jpg'
            };
        

        // INITIALIZATION BASED ON OBJECTS DECLARED ABOVE
        
            function initializePlayer(player1) {
                Player.initialize(player1, function (err, player1) {

                    if (err) sails.log.error(err);

                });
            }

            function initializeTeams() {
            
                initializePlayer(antoine);
                initializePlayer(donovan);

                initializePlayer(victor);
                initializePlayer(adam);

                initializePlayer(robin);
                initializePlayer(marion);

                initializePlayer(hugues);
                initializePlayer(amaury);

                initializePlayer(thomas);
                initializePlayer(anne);

                initializePlayer(leo);
                initializePlayer(sophy);

                initializePlayer(antoineB);
                initializePlayer(joceran);

                initializePlayer(maxime);
                initializePlayer(aurelien);

                initializePlayer(etienne);
                initializePlayer(milad);

                initializePlayer(camille);
                initializePlayer(alexis);
            }

        
        Team.create(teams).exec(function (err, teams) {
            if (err) sails.log.error(err);

            Challenge.create(challs).exec(function (err, challenges) {
                if (err) sails.log.error(err);

                initializeTeams();

            });
        });
        
    }
    



    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();



};
