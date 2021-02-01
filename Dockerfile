FROM node:14-alpine

# Create working directory
RUN mkdir -p /app/server
WORKDIR /app/server

COPY package.json /app/server
COPY yarn.lock /app/server

RUN yarn install

COPY . /app/server

CMD ["yarn", "run", "dev"]
