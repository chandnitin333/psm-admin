# Step 1: Use Node.js to build the Angular app
FROM node:18-alpine AS build-stage
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./
RUN npm install

# Copy all project files and build the application
COPY . .
RUN npm run build --prod




# Use official NGINX image
FROM nginx:alpine

# Remove the default NGINX page
RUN rm -rf /usr/share/nginx/html/*

# Copy the Angular build output to NGINX's html directory
COPY dist/psm/browser /usr/share/nginx/html

# Expose port 80 to serve the app
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
