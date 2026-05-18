FROM node:18-alpine

WORKDIR /opt/mywebapp

COPY mywebapp/package*.json ./
RUN npm install

COPY mywebapp/ .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]