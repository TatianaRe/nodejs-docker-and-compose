FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . ./
RUN npm run build

FROM nginx:latest AS production
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/conf.d/default.conf /etc/nginx/conf.d

ENTRYPOINT ["nginx", "-g", "daemon off;"]