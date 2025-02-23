FROM node:20

RUN apt-get update && apt-get install -y iputils-ping
WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8000

CMD ["node", "index.js"]
