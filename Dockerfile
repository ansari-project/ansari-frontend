# Web build of the Expo app (react-native-web), served as a static SPA by Caddy.
# Mirrors legacy/frontend-app/Dockerfile in iaser-ai/ansari.
#
#   docker build -t ansari-frontend .
#   docker run -p 8080:8080 ansari-frontend

# --- Build stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# EXPO_PUBLIC_* values are baked into the JS bundle at export time.
# Railway service variables arrive here as build args, so a change to any of
# them needs a redeploy. Declared ARGs are visible as env vars to RUN steps in
# this stage, so no ENV re-export is needed.
ARG EXPO_PUBLIC_ENVIRONMENT
ARG EXPO_PUBLIC_API_URL
ARG EXPO_PUBLIC_API_V2_URL
ARG EXPO_PUBLIC_API_TIMEOUT
ARG EXPO_PUBLIC_SUBSCRIBE_URL
ARG EXPO_PUBLIC_FEEDBACK_EMAIL
ARG EXPO_PUBLIC_COMPREHENSIVE_GUIDE_URL
ARG EXPO_PUBLIC_PRIVACY_URL
ARG EXPO_PUBLIC_TERMS_URL
ARG EXPO_PUBLIC_ENABLE_SHARE
ARG EXPO_PUBLIC_SHARE_URL
ARG EXPO_PUBLIC_SENTRY_DSN

ENV EXPO_NO_TELEMETRY=1

# Manifests first so the dependency layer caches independently of source changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# expo export --platform web --clear -> ./dist
RUN npm run build

# --- Serve stage ---
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /usr/share/caddy

# Railway provides PORT; the Caddyfile falls back to 8080 locally.
EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
