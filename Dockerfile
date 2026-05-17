# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
ENV APP_URL=http://localhost:3000
ENV API_URL=https://sunpyramidtours.com/api/
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.output /app/.output
EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV APP_URL=http://localhost:3000
ENV API_URL=https://sunpyramidtours.com/api/
CMD ["node", ".output/server/index.mjs"]
