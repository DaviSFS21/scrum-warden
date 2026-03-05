# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: serve with nginx ────────────────────────────────────────────────
FROM nginx:stable-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy Vite production build
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config is provided via docker-compose volume / build arg;
# a default is embedded here for standalone use.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
