FROM node:latest

WORKDIR /user/app

COPY package*.json . 

RUN npm install --quiet

COPY ./ ./

CMD ["npm", "start"]