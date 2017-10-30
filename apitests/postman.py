#!/usr/bin/env python

from time import strftime

from loader import yaml_load_file
from postman_collection import Collection, Folder, Request


def create_postman_collection(postman_yaml, name=None, data_format=None,
                              base_url=None):
    name = name or postman_yaml.get('name')
    data_format = data_format or postman_yaml.get('data-format')
    base_url = base_url or postman_yaml.get('base-url')

    folders = postman_yaml.get('folders')

    collection = Collection(name)

    for group in folders:
        folder = Folder(group.get('name', 'Unnamed'))
        collection.add_folder(folder)

        config = group['config']
        base_url = base_url or config['base-url']

        for test in group['tests']:
            name = test['name']
            description = test.get('description')
            url = base_url + test['url']
            method = test['method']
            urlvars = test.get('url-vars')
            # TODO: do not assume that only get methods have url params
            params = test.get('params') if method == 'GET' else None
            data = test.get('params') if method != 'GET' else None
            json = None
            if data_format == 'json' and data:
                json, data = data, None
            #headers = {'Authorization': '{{Authorization}}'}
            headers = {}
            request = Request(name=name, description=description,
                              url=url, method=method,
                              headers=headers, urlvars=urlvars,
                              params=params, data=data, json=json)
            folder.add_request(request)

    return collection


if __name__ == '__main__':
    postman = yaml_load_file('tests/postman.yaml')
    create_postman_collection(
        postman, name='Playlists API v1 (localhost:8000)',
        data_format='json',
        base_url='http://localhost:8000/api/v1'
    ).save_to_file('collections/playlists-v1-%s-localhost.json' % strftime('%Y%m%d-%H%M'))

    create_postman_collection(
        postman, name='Playlists API v1 (playlists.xor.pt)',
        data_format='json',
        base_url='https://playlists.xor.pt/api/v1'
    ).save_to_file('collections/playlists-v1-%s.json' % strftime('%Y%m%d-%H%M'))
