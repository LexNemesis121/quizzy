# Use an official Node.js runtime as a parent image
FROM node:18.16.0-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Install PM2 globally - for serving the app
RUN npm install -g pm2

# Install app dependencies
RUN npm install && npm cache clean --force

# Keep the Docker image clean by removing any unnecessary cache files
# after installing dependencies
RUN npm rebuild sqlite3

# Actually compiles the TS code so the node process can use the js files instead
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000 8080

# Define the command to run your app
CMD ["pm2-runtime", "npm", "--", "start"]
