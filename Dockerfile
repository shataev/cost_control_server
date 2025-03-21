FROM node:18-bookworm

ARG MONGO_URL=${MONGO_URL}
ARG SECRET_KEY=${SECRET_KEY}
ARG SECRET_KEY_REFRESH=${SECRET_KEY_REFRESH}
ARG VERIFICATION_CODE=${VERIFICATION_CODE}
ARG CLIENT_URL=${CLIENT_URL}
ARG CLIENT_URL=${TELEGRAM_BOT_TOKEN}

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g pm2

COPY ./package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY ./ /usr/src/app

ENV NODE_ENV production
ENV PORT 80

EXPOSE 80

CMD ["pm2-runtime", "index.js"]
