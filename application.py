#!/usr/bin/env python
# -*- coding: utf-8 -*-
# This file is for Apache + mod_wsgi (AWS Beanstalk)

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "playlists.settings")
application = get_wsgi_application()
