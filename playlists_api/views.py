from django.http.response import Http404
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from .models import Song, User
from .serializers import SongSerializer, UserSerializer


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all().order_by('id')
    serializer_class = SongSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer

    @detail_route(methods=['GET', 'POST', 'DELETE'])
    def songs(self, request, pk=None):
        if request.method == 'GET':
            user = self.get_object()
            serializer = SongSerializer(user.songs, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            user = self.get_object()
            ids = request.data['ids']   # TODO: Test if int list
            songs = Song.objects.filter(id__in=ids)
            if songs.count() < len(set(ids)):
                raise Http404()
            user.songs.add(*ids)
            serializer = SongSerializer(user.songs, many=True)
            return Response(serializer.data)
        elif request.method == 'DELETE':
            user = self.get_object()
            ids = request.data['ids']   # TODO: Test if int list
            user.songs.remove(*ids)
            serializer = SongSerializer(user.songs, many=True)
            return Response(serializer.data)
