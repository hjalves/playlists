#!/usr/bin/env python

import codecs
import json
import os
from pathlib import Path
import sys
from urllib.request import urlopen, Request
import unicodedata

import django

# Add project root to $PYTHONPATH
project_root = Path(__file__).parent.parent.absolute()
sys.path.append(str(project_root))

# Load Django environment (settings, apps, db...)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "playlists.settings")
django.setup()

from playlists_api.models import Song, User

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

# ----------------------
# Populate DB with users
# ----------------------

def normalize_str(s):
    # strip the accents from the string and lowercase it
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                   if unicodedata.category(c) != 'Mn').lower()


def gen_email(full_name, domain='mail.pt'):
    split_name = full_name.split()
    mailbox = normalize_str(split_name[0])[0] + normalize_str(split_name[-1])
    return '{}@{}'.format(mailbox, domain)

names = ['Emília Ramos', 'Enzo Sousa', 'Artur Lopes', 'Gabriel Pires',
         'Eduarda Vieira', 'Alícia Andrade', 'Leonardo Carneiro',
         'Bernardo Azevedo', 'Inês Teixeira', 'Kyara Cunha']

User.objects.bulk_create(User(full_name=n, email=gen_email(n)) for n in names)
