FROM node:13.14.0-alpine3.10

WORKDIR /app

COPY package*.json ./

RUN npm install -g serve

COPY . .

EXPOSE 7000

CMD [ "node", "index.js" ]