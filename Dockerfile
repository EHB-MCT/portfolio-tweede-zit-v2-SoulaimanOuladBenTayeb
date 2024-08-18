FROM node:16-alpine

WORKDIR /usr/src/app

COPY build/images/api/package*.json ./

RUN npm install --quiet

COPY build/images/api/ .

# Ensure the frontend files are copied to the right place
COPY build/images/frontend /usr/src/app/frontend

EXPOSE 3000

CMD ["npm", "start"]
