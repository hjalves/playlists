#!/bin/bash
exec uwsgi --plugins=python3 \
    --chdir=/app \
    --venv=/venv \
    --module=playlists.wsgi:application \
    --env DJANGO_SETTINGS_MODULE=playlists.settings \
    --master \
    --need-app \
    --single-interpreter \
    --socket=:9000 \
    --processes=5 \
    --harakiri=20 \
    --max-requests=5000 \
    --die-on-term \
    --vacuum
