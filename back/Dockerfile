FROM node:22-alpine3.19

RUN mkdir /app
WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD ["npm", "start"]
