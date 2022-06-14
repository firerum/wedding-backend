FROM node:14.3-alpine
WORKDIR /backend
COPY package.* /backend/
RUN yarn install
COPY . /backend/
CMD node index.js