# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
# For Vite; if you're using Next.js, you'd use `.next` and Node server instead.

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
