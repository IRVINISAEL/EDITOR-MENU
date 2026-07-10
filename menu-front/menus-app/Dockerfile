# ---- Etapa 1: dependencias ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# ---- Etapa 2: build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* se "hornea" dentro del bundle en build time
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# ---- Etapa 3: runtime (imagen final, liviana) ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Salida "standalone" de Next.js: server mínimo con solo lo necesario
# --chown asegura que el usuario "node" (no-root) sea dueño de estos archivos
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# No correr como root
USER node

EXPOSE 3000
CMD ["node", "server.js"]
