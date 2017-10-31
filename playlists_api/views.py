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

    @detail_route(methods=['GET', 'POST', 'DELETE'])
    def songs(self, request, pk=None):
        if request.method == 'GET':
            user = self.get_object()
            serializer = SongSerializer(user.songs, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            user = self.get_object()

            serializer = IdsSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            ids = serializer.validated_data['ids']

            if Song.objects.filter(id__in=ids).count() < len(set(ids)):
                message = "Could not find at least one of the given IDs"
                raise ValidationError(dict(ids=[message]))
            if user.songs.filter(id__in=ids).exists():
                message = "At least one Song IDs already present"
                raise ValidationError(dict(ids=[message]))

            user.songs.add(*ids)
            serializer = SongSerializer(user.songs, many=True)
            return Response(serializer.data)

        elif request.method == 'DELETE':
            user = self.get_object()

            serializer = IdsSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            ids = serializer.validated_data['ids']

            if user.songs.filter(id__in=ids).count() < len(set(ids)):
                message = "Could not find at least one of the given IDs"
                raise ValidationError(dict(ids=[message]))

            user.songs.remove(*ids)
            serializer = SongSerializer(user.songs, many=True)
            return Response(serializer.data)
