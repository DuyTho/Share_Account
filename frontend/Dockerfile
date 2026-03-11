FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Mở cổng 3000
EXPOSE 3000

# Khởi chạy Next.js
CMD ["npm", "run", "dev"]