# Use an official Node.js runtime as a parent image
FROM node:18.16.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY . .

RUN npm install -g vite
# Install app dependencies
RUN npm install && npm cache clean --force

# Expose the port your app will run on
EXPOSE 5173

# Define the command to run your app
CMD ["npm", "start"]
