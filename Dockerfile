# Use the official Node.js image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY build/images/api/package*.json ./

# Install dependencies
RUN npm install --quiet

# Copy the rest of the application code to the container
COPY build/images/api/ .

# Copy the frontend files into the container
COPY build/images/frontend /usr/src/app/frontend

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
