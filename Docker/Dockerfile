FROM docker-virtual.artifactory.corp.alleninstitute.org/aics-nginx:1.13.3-1.1.1

ARG TEMPLATE_DIR
ARG FILENAME

ENV TEMPLATE_DIR=${TEMPLATE_DIR:-/templates} \
    FILENAME=${FILENAME:-nginx.conf.j2}

ENV CONF_FILE="${TEMPLATE_DIR}/${FILENAME}"

COPY Docker/${FILENAME} ${CONF_FILE}

RUN mkdir app
COPY dist app
