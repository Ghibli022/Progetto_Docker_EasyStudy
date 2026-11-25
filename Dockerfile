# STAGE 1: BUILD

FROM node:24.20.0-bookworm-slim AS build

WORKDIR /app/backend

# Installo gli strumenti neccesari alla compilazione di alcune dipendenze contenenti codice nativo come argon2
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./

RUN npm ci --omit=dev


# STAGE 2: PRODUZIONE

FROM node:24.20.0-bookworm-slim AS production

WORKDIR /app/backend

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/backend/node_modules ./node_modules

COPY --chown=node:node backend/ ./
COPY --chown=node:node frontend/ /app/frontend/

RUN mkdir -p /app/backend/uploads \
    && chown node:node /app/backend/uploads

USER node

EXPOSE 3000

CMD ["node", "src/server.js"]
