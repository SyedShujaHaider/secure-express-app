# Use an official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files into container
COPY . .

# Install dependencies
RUN npm install

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]

