# pull official python base image
FROM python:3.7-stretch

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
