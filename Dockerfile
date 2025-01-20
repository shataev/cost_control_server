FROM node:18-bookworm
ARG MONGO_URL=${MONGO_URL}
ARG SECRET_KEY=${SECRET_KEY}
ARG SECRET_KEY_REFRESH=${SECRET_KEY_REFRESH}
ARG VERIFICATION_CODE=${VERIFICATION_CODE}
ARG CLIENT_URL=${CLIENT_URL}
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY ./ /usr/src/app
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
CMD [ "npm", "start" ]