FROM node:20 AS build
WORKDIR /app
ENV HUSKY=0
ENV PUPPETEER_SKIP_DOWNLOAD=true

COPY package*.json ./
RUN npm ci

COPY . .

ARG CONFIG_FILE=config/dev_config.yml
COPY $CONFIG_FILE config.yml

RUN npx patch-package
RUN npm run deploy

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80