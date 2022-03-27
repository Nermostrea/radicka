# Dockerfile
FROM node:16 as builder

RUN mkdir -p /radicka
WORKDIR /radicka
COPY . /radicka

RUN yarn install
RUN yarn build

EXPOSE 5000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=5000

CMD [ "yarn", "start" ]
