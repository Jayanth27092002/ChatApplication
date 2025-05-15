# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Make sure the backend listens on all interfaces
ENV PORT=4000
EXPOSE 4000

CMD ["node", "app.js"]