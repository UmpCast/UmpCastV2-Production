# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /code

# add `/code/node_modules/.bin` to $PATH
ENV PATH /code/node_modules/.bin:$PATH

# install app dependencies
COPY package.json /code/
COPY yarn.lock /code/
RUN yarn install --silent
RUN yarn global add react-scripts@3.4.1

# add app
COPY . /code/