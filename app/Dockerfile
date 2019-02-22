# named static for easy reference
FROM node:10-stretch as static

# set working directory
WORKDIR /usr/src/app/spatialdatahub.org-static/

# make a static directory outside of the working directory
RUN mkdir /usr/src/app/static/

# from host computer to docker
# we should be in the app directory for this
# we want to move the package.json, package-lock.json, .bablerc and src directory
# to the docker image then run npm build from the spatialdatahub-static directory
# and have the static files (css, images, django admin, and js) moved to the
# newly created static directory

###### What we want in the docker container ######
# app
# |
# |__spatialdatahub.org
# |
# |__spatialdatahub.org-static     - ideally this whole directory wouldn't be in the container
# |  |                             - but I don't know how to do it otherwise
# |  |__package.json     
# |  |__package-lock.json     
# |  |__.bablerc
# |  |__src
# |
# |__static
#    |
#    |__js
#    |  |__bundle.js
#    |
#    |__css
#    |__images
#    |__admin

COPY ./spatialdatahub.org-static/package.json /usr/src/app/spatialdatahub.org-static/package.json
COPY ./spatialdatahub.org-static/package-lock.json /usr/src/app/spatialdatahub.org-static/package-lock.json

# run npm install
RUN npm install

# move .babelrc over
COPY ./spatialdatahub.org-static/.babelrc /usr/src/app/spatialdatahub.org-static/.babelrc

# src directory has all the javascript stuff
COPY ./spatialdatahub.org-static/src/ /usr/src/app/spatialdatahub.org-static/src/

# copy the css, images and django admin stuff to the static dir in the container
COPY ./spatialdatahub.org-static/build/ /usr/src/app/static/

RUN ls ../static

# build the javascript file and move the files to the static directory
# a
#RUN npm run build
RUN npm run build-and-move-files

RUN ls ../static
RUN ls ../static/js

# something is happening to the static file in the python section
# it is getting overwritten

# it seems like the directories are not persisting
# between containers

# pull official python base image
# named final because final stage
FROM python:3.7-stretch as final

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY --from=static /usr/src/app/static/ /usr/src/app/static/

# this returned the message 
# ls: cannot access '/usr/src/app/': No such file or directory
RUN ls /usr/src/app/

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
# this is the problem
COPY ./spatialdatahub.org /usr/src/app/spatialdatahub.org
RUN pwd
RUN ls ..
RUN ls ../static/
RUN ls ../spatialdatahub.org-static/

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/spatialdatahub.org/entrypoint.sh"]
