FROM node:13.14.0-alpine3.10

WORKDIR /app

# Copies everything over to Docker environment
COPY ./build .
 
# Installs all node packages
RUN npm install -g serve

EXPOSE 8000

 
# Finally runs the application
CMD [ "serve", "-s", ".", "-l", "8000" ]