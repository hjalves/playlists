#!/bin/bash -e

/venv/bin/python manage.py migrate

uwsgi --plugins=python3 \
    --chdir=/app \
    --venv=/venv \
    --module=playlists.wsgi:application \
    --env DJANGO_SETTINGS_MODULE=playlists.settings \
    --master \
    --need-app \
    --single-interpreter \
    --http-socket=:8000 \
    --socket=:9000 \
    --processes=5 \
    --harakiri=20 \
    --max-requests=5000 \
    --vacuum

#    --home=/path/to/virtual/env \   # optional path to a virtualenv
#    --daemonize=/var/log/uwsgi/yourproject.log      # background the process
