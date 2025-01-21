# Step 1: Use Node.js to build the Angular app
FROM node:18-alpine AS build-stage
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all project files and build the application
COPY . .
RUN npm run build

# Step 2: Use official NGINX image
FROM nginx:alpine

# Remove the default NGINX page
RUN rm -rf /usr/share/nginx/html/*

# Copy the Angular build output to NGINX's html directory
COPY --from=build-stage /app/dist/psm/browser /usr/share/nginx/html

# Copy the custom NGINX config with the corrected structure
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 4222 to serve the app
EXPOSE 4222

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
