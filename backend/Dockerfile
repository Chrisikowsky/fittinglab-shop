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

# Expose port (Medusa default 9000)
EXPOSE 9000

# Start the application using direct node execution (Production Mode)
# Added 'ls -laR .medusa' to debug runtime file existence before crash
CMD ["sh", "-c", "echo 'RUNTIME FILE CHECK:' && ls -laR .medusa && npx medusa db:migrate && node .medusa/server/index.js"]
