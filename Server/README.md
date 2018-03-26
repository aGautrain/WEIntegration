# Server2018

a [Sails](http://sailsjs.org) application

Folders api, assets and config are responsible for the application logic

Init server (when at root of WEIntegration) :

	> npm install sails -g
	> sails new Server20XX
	> move Server/api Server20XX/
	> move Server/config Server20XX/
	> move Server/assets Server20XX/
	> move Server/package.json Server20XX/
	> cd Server20XX
	> npm install
	
Now the server is ready but we still need to figure out a few things before starting it

1°) Database
	
	Registering a new database is quite easy with Sails, open /config/connections.js
	and follow one of the existing model
	(if changing from Mongodb to a SQL database, you will need to set up an adaptator)
	
	Then you need to change the attribute `connection` of the `models` contained in /config/models.js
	
	Done !
	
