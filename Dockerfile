FROM node:lts

LABEL org.opencontainers.image.description "Fixes Meta's Threads metadata for sites like Discord, Telegram, etc."
LABEL org.opencontainers.image.source "https://github.com/milanmdev/fixthreads"

WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
CMD yarn start