FROM node:20-alpine

WORKDIR /var/www

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Default command (can be overridden)
CMD ["npm", "run", "dev"]

