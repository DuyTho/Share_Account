FROM node:20-slim

# Cài đặt các thư viện hệ thống bắt buộc để Puppeteer/Chromium có thể chạy
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Mở cổng 8080
EXPOSE 8080

# Khởi chạy server
CMD ["npm", "run", "dev"]