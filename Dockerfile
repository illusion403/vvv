# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from vvv-proj directory
COPY vvv-proj/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code from vvv-proj directory
COPY vvv-proj/ .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built app to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
