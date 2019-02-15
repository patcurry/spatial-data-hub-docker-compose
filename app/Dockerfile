# named static for easy reference
FROM node:10-stretch as static

WORKDIR /usr/src/app/static

COPY ./spatialdatahub.org-static/package*.json /usr/src/app/static/
COPY ./spatialdatahub.org-static/.babelrc /usr/src/app/static/.babelrc
COPY ./spatialdatahub.org-static/src/ /usr/src/app/static/src/


RUN npm install
RUN npm run build

ADD ./spatialdatahub.org-static/build/ /usr/src/app/static/build/

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

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/spatialdatahub.org/entrypoint.sh"]
