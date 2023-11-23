FROM node:20.9-alpine3.18
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Build image
RUN npm run build

EXPOSE $PORT
CMD [ "node", "dist/main.js" ]