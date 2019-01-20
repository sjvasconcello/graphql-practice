FROM node:8

WORKDIR /app

COPY package.json .

RUN npm install

COPY src .

CMD node index.js