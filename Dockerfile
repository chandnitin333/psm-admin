# Use an official Node.js runtime as the base image
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Install the Angular dependencies
RUN npm install

# Copy the rest of the Angular application code
COPY . .

# Build the Angular application for production
RUN npm run build --prod

# Use an official NGINX image to serve the built Angular app
FROM nginx:alpine

# Copy the build output to the NGINX HTML directory
COPY --from=build /app/dist/your-angular-app /usr/share/nginx/html

# Expose port 4222
EXPOSE 4222

# Update NGINX configuration to listen on port 4222
RUN sed -i 's/listen       80;/listen       4222;/g' /etc/nginx/conf.d/default.conf

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
