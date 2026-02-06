FROM node:20-slim

WORKDIR /app/backend

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies using clean install
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Build the project
RUN yarn build

# Expose Medusa port
EXPOSE 9000

# Start command
CMD ["yarn", "start"]
