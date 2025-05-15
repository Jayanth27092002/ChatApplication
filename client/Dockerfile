# Stage 1: Build the app
FROM node:18-alpine AS builder

WORKDIR /app


# Declare the build argument so you can pass it with `--build-arg`
ARG VITE_SERVER

# Set it as env so npm run build can see it
ENV VITE_SERVER=$VITE_SERVER


COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]