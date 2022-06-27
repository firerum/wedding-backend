FROM node:alpine
WORKDIR /backend
COPY package.* /backend/
RUN yarn install
COPY . /backend/
EXPOSE 5000
CMD node index.js