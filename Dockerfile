# Use an official Node runtime as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to
# the working directory
COPY package*.json ./

# Install git (Alpine uses apk, not apt-get)
RUN apk add --no-cache git

# Install app dependencies
RUN npm install

# Copy the app's source code to the working directory
COPY . .

# Expose the port that the app will run on
EXPOSE 8080

# Define the command to run your app
CMD ["npm", "start"]