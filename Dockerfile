FROM node:20-alpine

WORKDIR /app

# Add dependencies for prisma and nextjs
RUN apk add --no-cache openssl gcompat libc6-compat

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Generate prisma client
RUN npx prisma generate

EXPOSE 3000

# Start script will be provided by docker-compose.yml
CMD ["npm", "run", "dev"]
