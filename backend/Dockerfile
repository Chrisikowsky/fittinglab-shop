FROM node:20-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies (frozen lockfile for speed/consistency)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Debug: List build artifacts to confirm admin files exist
RUN echo "Checking build output..." && ls -R .medusa

# Expose port (Medusa default 9000, Railway might override or map)
EXPOSE 9000

# Start the application
CMD ["yarn", "start"]
