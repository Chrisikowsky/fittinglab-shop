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

# Fix: Ensure admin files are in the 'dashboard' folder to match medusa-config path
# We copy instead of move to be safe (so it exists in both admin and dashboard)
RUN cp -r .medusa/server/public/admin .medusa/server/public/dashboard

# Debug: List build artifacts to confirm dashboard files exist
RUN echo "Checking build output..." && ls -R .medusa/server/public

# Expose port (Medusa default 9000)
EXPOSE 9000

# Start the application
CMD ["yarn", "start"]
