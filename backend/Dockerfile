FROM node:25.3-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run tsc
RUN mkdir -p dist/routes/openapi dist/types/schemas \
  && cp src/routes/openapi/openapi.json dist/routes/openapi/openapi.json \
  && cp src/types/schemas/*.json dist/types/schemas/

FROM node:25.3-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 4242
CMD ["node", "dist/index.js"]
