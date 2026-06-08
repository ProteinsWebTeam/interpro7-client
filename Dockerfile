FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache git

ENV HUSKY=0
ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN npm ci

COPY . .

ARG CONFIG=dev
RUN cp config/${CONFIG}_config.yml config.yml

RUN npm run deploy
RUN npx patch-package

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "start"]