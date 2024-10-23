FROM node:lts

LABEL org.opencontainers.image.description "Fixes Meta's Threads metadata for sites like Discord, Telegram, etc."
LABEL org.opencontainers.image.source "https://github.com/milanmdev/fixthreads"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
WORKDIR /build
COPY . .

RUN pnpm install --frozen-lockfile

CMD pnpm start