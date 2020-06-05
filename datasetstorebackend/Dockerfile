FROM node:13.14.0-alpine3.10

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7000 9229

CMD [ "node", "--inspect=0.0.0.0:9229", "index.js" ]
