FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base AS development
CMD ["npm", "run", "dev"]

FROM base AS build-stage
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build-stage /app/dist ./dist
CMD ["node", "dist/index.js"]