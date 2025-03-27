FROM node:18-alpine3.18 as build

WORKDIR /app

RUN apk add --no-cache libssl1.1

COPY package*.json .

RUN yarn install

COPY . .

RUN npx prisma generate

EXPOSE 25556