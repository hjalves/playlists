#!/usr/bin/env python

import codecs
import json
import os
from pathlib import Path
import sys
from urllib.request import urlopen, Request

import django

# Add project root to $PYTHONPATH
project_root = Path(__file__).parent.parent.absolute()
sys.path.append(str(project_root))

# Load Django environment (settings, apps, db...)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "playlists.settings")
django.setup()

from playlists_api.models import Song

# ----------------------
# Populate DB with songs
# ----------------------

# freemusicarchive.org replies with a 403 if User-Agent is 'Python-urllib/3.6'
headers = {'User-Agent' : 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'}
request = Request('http://freemusicarchive.org/recent.json', headers=headers)
reader = codecs.getreader("utf-8")

with urlopen(request) as response:
    data = json.load(reader(response))

songs = [(track['track_title'], track['album_title'], track['artist_name'])
         for track in data['aTracks']]

Song.objects.bulk_create(Song(title=title, album=album or '', artist=artist)
                         for title, album, artist in songs)
