from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import Song, User
from .serializers import SongSerializer, UserSerializer, IdsSerializer


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all().order_by('id')
    serializer_class = SongSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer

    @staticmethod
    def get_validated_ids(request_data):
        serializer = IdsSerializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data['ids']

    @staticmethod
    def serialize_favorite_songs(user):
        songs = user.songs.order_by('id')
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

    @detail_route(methods=['GET', 'POST', 'PUT', 'DELETE'])
    def songs(self, request, pk=None):
        # Get user's favorite songs
        if request.method == 'GET':
            user = self.get_object()
            serializer = SongSerializer(user.songs, many=True)
            return Response(serializer.data)

        # Add to user's favorite songs collection
        elif request.method == 'POST':
            user = self.get_object()
            ids = self.get_validated_ids(request.data)

            if Song.objects.filter(id__in=ids).count() < len(set(ids)):
                message = "Could not find at least one of the given IDs"
                raise ValidationError(dict(ids=[message]))
            if user.songs.filter(id__in=ids).exists():
                message = "At least one Song IDs already present"
                raise ValidationError(dict(ids=[message]))

            user.songs.add(*ids)
            return self.serialize_favorite_songs(user)

        # Replace user's favorite songs
        elif request.method == 'PUT':
            user = self.get_object()
            ids = self.get_validated_ids(request.data)

            if Song.objects.filter(id__in=ids).count() < len(set(ids)):
                message = "Could not find at least one of the given IDs"
                raise ValidationError(dict(ids=[message]))

            user.songs.clear()
            user.songs.add(*ids)
            return self.serialize_favorite_songs(user)

        # Remove from user's favorite songs collection
        elif request.method == 'DELETE':
            user = self.get_object()
            ids = self.get_validated_ids(request.data)

            if user.songs.filter(id__in=ids).count() < len(set(ids)):
                message = "Could not find at least one of the given IDs"
                raise ValidationError(dict(ids=[message]))

            user.songs.remove(*ids)
            return self.serialize_favorite_songs(user)
