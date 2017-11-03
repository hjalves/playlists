release: python manage.py migrate --noinput
web: gunicorn -e DJANGO_SETTINGS_MODULE=playlists.prod_settings playlists.wsgi --log-file -
