FROM node:22-alpine AS base

FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci
COPY . . 

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG TABLE_NAME
ARG RECAPTCHA_SECRET
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_PLANNER_ID

RUN npm run build


FROM base as runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN addgroup --system -gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD node server.js