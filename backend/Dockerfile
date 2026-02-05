FROM node:20-slim

WORKDIR /app/backend

# Copy package files
COPY package*.json ./

# Install dependencies
# Using npm install to ensure we get everything needed for build
RUN npm install

# Copy source
COPY . .

# Build the project
RUN npm run build

# Expose Medusa port
EXPOSE 9000

# Start command
CMD ["npm", "run", "start"]
