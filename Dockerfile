FROM oven/bun:alpine

COPY package.json ./
COPY bun.lockb ./
COPY src src

RUN bun install

ENTRYPOINT [ "bun", "start:graphql" ]