"""
Django settings for production environment.
"""

from .settings import *

# Disable debug mode
DEBUG = False

# Restrict allowed hosts
ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
    'playlists.eu-west-2.elasticbeanstalk.com',
    'playlists.ml',
    'playlists.xor.pt'
]

# Production logging is at level INFO or WARNING
LOGGING['handlers']['console']['level'] = 'INFO'

# Try to import SECRET_KEY. If nonexistent, generate a new file
try:
    from .secret_key import SECRET_KEY
except ImportError:
    # Secret key generation
    from django.utils.crypto import get_random_string
    settings_dir = os.path.abspath(os.path.dirname(__file__))
    chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)'
    SECRET_KEY = get_random_string(50, chars)
    with open(os.path.join(settings_dir, 'secret_key.py'), 'w') as f:
        f.write("SECRET_KEY = %r\n" % SECRET_KEY)
