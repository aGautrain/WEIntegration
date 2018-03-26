# ESIRMonitoring

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.


# Configuration

The monitoring needs to interact with a REST API (= http server with defined endpoints serving JSON objects)
Adress of the server is written in /src/app/admin.service.ts
Replace `const server: string = 'http://151.80.140.30/';` with the one you use

> npm install


# Test command

> ng serve --open

# Build prod command

> ng build --env=prod --base-href=/

! workaround if error with ng build --prod --aot :
https://github.com/angular/angular-cli/issues/4551
! easy solution : generate a new project with angular-cli and then copy/paste src

This produces dist folder, allowing you to serve it for your clients !