FROM node:lts-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "db.sql", "server.js", "./"]
RUN npm install
CMD [ "node", "server.js" ]