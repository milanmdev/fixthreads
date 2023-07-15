FROM node:lts

WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
CMD yarn start