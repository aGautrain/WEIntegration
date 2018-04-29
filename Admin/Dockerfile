FROM node:carbon

# where to fetch data - build-time arg
ARG API_PROVIDER=localhost


COPY . /usr/frontend/admin/
WORKDIR /usr/frontend/admin/

# fetching source code from github
RUN git clone https://github.com/aGautrain/WEIntegration.git /usr/github/
RUN cp /usr/github/Admin/. /usr/frontend/admin/ -r

# replacing host
RUN sed -i "s/YOUR_API_ADDR/$API_PROVIDER/g" /usr/frontend/admin/src/environments/environment.prod.ts
RUN cat /usr/frontend/admin/src/environments/environment.prod.ts


RUN npm install @angular/cli@1.2.6
RUN npm install

EXPOSE 4200

CMD npx ng serve --prod --host=0.0.0.0 --public-host=$HOST_ADDR --port=4200
