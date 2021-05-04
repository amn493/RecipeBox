FROM node:12
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./

RUN npm install
# Copy app source code
COPY . .

ENV CONTAINER=docker

#Expose port and start application
EXPOSE 4000
CMD [ "node", "server" ]
