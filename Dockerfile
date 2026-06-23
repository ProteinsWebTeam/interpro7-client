FROM node:20 AS build
WORKDIR /app
ENV HUSKY=0
ENV PUPPETEER_SKIP_DOWNLOAD=true

COPY package*.json ./
RUN npm ci

COPY . .
COPY config.yml.example config.yml
RUN npx patch-package
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80