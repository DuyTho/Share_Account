FROM node:20-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Khởi chạy Next.js
CMD ["npm", "run", "dev"]