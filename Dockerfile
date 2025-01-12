# Step 1: Use Node.js to build the Angular app
FROM node:18-alpine AS build-stage
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all project files and build the application
COPY . .
RUN npm run build --prod  # or npm run build for non-prod builds

# Step 2: Use official NGINX image
FROM nginx:alpine

# Remove the default NGINX page
RUN rm -rf /usr/share/nginx/html/*

# Copy the Angular build output to NGINX's html directory
COPY --from=build-stage /app/dist/psm/browser /usr/share/nginx/html

# Copy the custom nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (NGINX default) for serving the app
EXPOSE 80

# Start NGINX to serve the app
CMD ["nginx", "-g", "daemon off;"]
