from .models import Song, User
from rest_framework import serializers


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('id', 'title', 'artist', 'album')


class UserSerializer(serializers.ModelSerializer):
    song_count = serializers.ReadOnlyField(source='songs.count')

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'song_count')
