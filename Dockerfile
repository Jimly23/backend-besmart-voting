FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files dan install dependencies
COPY package*.json ./
RUN npm install

# Copy semua file (misalnya src/)
COPY . .

# Jalankan aplikasi
CMD ["node", "app.js"]

# Expose port
EXPOSE 5000
