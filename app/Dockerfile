# named static for easy reference
FROM node:10-stretch as static

# set working directory
WORKDIR /usr/src/app/spatialdatahub.org-static/

RUN pwd
RUN ls

# make a static directory outside of the working directory
RUN mkdir /usr/src/app/static/

# copy package.json files, .babelrc
COPY ./package*.json /usr/src/app/spatialdatahub.org-static/
COPY ./.babelrc /usr/src/app/spatialdatahub.org-static/.babelrc

# src directory has all the javascript stuff
COPY ./src/ /usr/src/app/spatialdatahub.org-static/src/

# copy the css, images and django admin stuff to the static dir in the container
COPY ./build/ /usr/src/app/static/

# make sure you are in right directory
RUN pwd
# list contents
RUN ls

# install everything
RUN npm install

# build the javascript file
#RUN npm run build
RUN npm run build-and-move-files

# this may be a problematic step
# maybe it should be carried out by an npm script
#COPY ./build/ /usr/src/app/static/

RUN pwd
RUN ls

#ADD ./static/ /usr/src/app/static/

#ADD ./spatialdatahub.org-static/build/ /usr/src/app/static/build/

# pull official python base image
# named final because final stage
FROM python:3.7-stretch as final

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set work directory
WORKDIR /usr/src/app/spatialdatahub.org

# install netcat
RUN apt-get update && apt-get install netcat -y

# install dependencies
COPY ./spatialdatahub.org/requirements.txt /usr/src/app/spatialdatahub.org/

RUN pip install --upgrade pip
RUN pip install -r /usr/src/app/spatialdatahub.org/requirements.txt

# copy entrypoint.sh
COPY ./spatialdatahub.org/entrypoint.sh /usr/src/app/spatialdatahub.org/entrypoint.sh

# copy project
COPY . /usr/src/app/
RUN pwd
RUN ls
RUN ls ..
RUN ls ../static/
RUN ls ../spatialdatahub.org-static/

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/spatialdatahub.org/entrypoint.sh"]
