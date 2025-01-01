FROM nginx:alpine

# Copy built Angular app to NGINX directory
COPY dist/psm/browser /usr/share/nginx/html



# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
