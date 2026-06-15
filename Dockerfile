FROM node:22-slim AS builder
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG PUBLIC_DIRECTUS_URL
ARG PUBLIC_SITE_URL
ARG DIRECTUS_SERVER_TOKEN
RUN pnpm build

FROM node:22-slim
RUN corepack enable
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json .
EXPOSE 3000
CMD ["node", "build"]
