FROM node:8.9.4-alpine as build

# Create app directory
WORKDIR /usr/src/app

RUN apk update && \
    apk add git python make g++ && \
    rm -rf /var/cache/apk/*

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --production

# This results in a single layer image
FROM node:8.9.4-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

COPY ens.js ens.js
COPY index.js index.js

EXPOSE 80

ENTRYPOINT node index.js
