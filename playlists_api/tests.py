from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Song, User


songs = [
    Song(title='Me And The Bean', artist='Spoon', album='Girls Can Tell'),
    Song(title='Cherry Pie', artist='Warrant', album='Cherry Pie'),
    Song(title='Eye of the Tiger', artist='Survivor', album='Rocky IV'),
    Song(title='Bohemian Rhapsody - Remastered', artist='Queen',
         album='Greatest Hits - We Will Rock You Edition'),
    Song(title='Holiday In Cambodia', artist='Dead Kennedys',
         album='OMFG! That’s Punk'),
    Song(title='Alex Chilton', artist='The Replacements',
         album='Random Noise'),
    Song(title='Nine In The Afternoon - Radio Mix',
         artist='Panic! At The Disco', album='Pretty. Odd.'),
    Song(title="Runnin' Down A Dream",
         artist='Tom Petty and the Heartbreakers',
         album='Anthology: Through The Years'),
    Song(title='Chimney', artist='Yellow Moon Band',
         album='Travels into Several Remote Nations of the World'),
    Song(title='Surf Hell', artist='Little Barrie', album='King Of The Waves'),
    Song(title='Anarchy In The UK', artist='Sex Pistols',
         album="The Great Rock 'N' Roll Swindle"),
    Song(title='Sharp Dressed Man - Remastered', artist='ZZ Top',
         album='Rancho Texicano: The Very Best of ZZ Top'),
    Song(title='Pump It Up', artist='Elvis Costello & The Attractions',
         album="This Year's Model"),
    Song(title="Sweet Child O' Mine", artist="Guns N' Roses",
         album='Greatest Hits'),
    Song(title='Electric Eye', artist='Judas Priest',
         album='Screaming For Vengeance'),
    Song(title='Burnished', artist='White Denim', album='D'),
    Song(title='Jessica', artist='The Allman Brothers Band',
         album='A Decade Of Hits 1969-1979'),
    Song(title='Nearly Lost You', artist='Screaming Trees',
         album='Sweet Oblivion'),
    Song(title='Go Your Own Way', artist='Fleetwood Mac', album='Rumours'),
    Song(title='Creep', artist='Radiohead', album='The Best Of'),
    Song(title='Knights Of Cydonia', artist='Muse',
         album='Black Holes And Revelations (Updated 09 version)'),
    Song(title='Even Flow', artist='Pearl Jam', album='Ten'),
    Song(title='Hit Me With Your Best Shot - 1999 Digital Remaster',
         artist='Pat Benatar', album='Synchronistic Wanderings'),
    Song(title='What I Got', artist='Sublime',
         album='Sublime (Explicit Version)'),
    Song(title='Cigarettes, Wedding Bands', artist='Band of Horses',
         album='Cease To Begin'),
    Song(title='Black Magic Woman / Gypsy Queen', artist='Santana'),
    Song(title='Maps', artist='Yeah Yeah Yeahs', album='Maps'),
    Song(title='Hey You', artist='The Exies', album='Head For The Door'),
    Song(title='Free Bird', artist='Lynyrd Skynyrd',
         album="(Pronounced 'Leh-'Nérd 'Skin-'Nérd) [Expanded Edition]"),
    Song(title='Man in the Box', artist='Alice In Chains',
         album='The Essential Alice In Chains')
]


users = [
    User(email='eramos@mail.pt', full_name='Emília Ramos'),
    User(email='esousa@mail.pt', full_name='Enzo Sousa'),
    User(email='alopes@mail.pt', full_name='Artur Lopes'),
    User(email='gpires@mail.pt', full_name='Gabriel Pires'),
    User(email='evieira@mail.pt', full_name='Eduarda Vieira'),
    User(email='aandrade@mail.pt', full_name='Alícia Andrade'),
    User(email='lcarneiro@mail.pt', full_name='Leonardo Carneiro'),
    User(email='bazevedo@mail.pt', full_name='Bernardo Azevedo'),
    User(email='iteixeira@mail.pt', full_name='Inês Teixeira'),
    User(email='kcunha@mail.pt', full_name='Kyara Cunha')
]


class GetAllSongsTest(APITestCase):

    def setUp(self):
        Song.objects.bulk_create(songs)

    def test_get_all_songs(self):
        url = reverse('playlists_api:song-list')
        # url = reverse('playlists_api:song-detail', args=[1])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 30)
        results = response.data['results']
        self.assertEqual(len(results), 10)
        self.assertEquals(results[0]['title'], 'Me And The Bean')
        self.assertEquals(results[0]['artist'], 'Spoon')
        self.assertEquals(results[0]['album'], 'Girls Can Tell')


class GetAllUsersTest(APITestCase):

    def setUp(self):
        User.objects.bulk_create(users)

    def test_get_all_users(self):
        url = reverse('playlists_api:user-list')
        # url = reverse('playlists_api:song-detail', args=[1])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 10)
        results = response.data['results']
        self.assertEqual(len(results), 10)
        self.assertEquals(results[0]['email'], 'eramos@mail.pt')
        self.assertEquals(results[0]['full_name'], 'Emília Ramos')
