from django.db import models


class Song(models.Model):
    title = models.CharField(max_length=50)
    artist = models.CharField(max_length=50)
    album = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return '%s - %s' % (self.artist, self.title)


class User(models.Model):
    email = models.EmailField()
    full_name = models.CharField(max_length=70)
    songs = models.ManyToManyField(Song)

    def __str__(self):
        return self.email
