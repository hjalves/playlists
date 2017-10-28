import logging
from pprint import pformat

from rest_framework import routers

from . import views

logger = logging.getLogger(__name__)

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'songs', views.SongViewSet)

app_name = 'playlists_api'
urlpatterns = router.urls

logger.debug("Routes: %s", pformat(urlpatterns))
