import json
import uuid
from collections import OrderedDict
from operator import attrgetter
from urllib.parse import urlencode

"""
Create Postman collections with ease.
"""


def newid():
    return str(uuid.uuid4())


class Collection(object):
    def __init__(self, name, id=None, description=None):
        self.id = id or newid()
        self.name = name
        self._requests = []
        self._folders = []
        self.description = description

    @property
    def collection_id(self):
        return self.id

    def add_request(self, request):
        """
        Append a folder or a request to collection end

        :param item: The item to append
        :return: None
        """
        # TODO: verify if item already in list
        assert request.id not in self._requests

        request._parent = self
        self._requests.append(request)

    def add_requests(self, requests):
        """
        Extend collection by appending items (folder or requests) from the
        iterable

        :param requests: An iterable of items to append
        :return: None
        """
        for request in requests:
            self.add_request(request)

    def add_folder(self, folder):
        self._folders.append(folder)
        # Should the collection id be added instead?
        folder._collection = self

    def all_requests(self):
        requests = list(self._requests)
        for f in self._folders:
            requests.extend(f._requests)
        return sorted(requests, key=attrgetter('id'))

    def serialize(self):
        obj = OrderedDict()
        obj['id'] = self.id
        obj['name'] = self.name

        if self.description is not None:
            obj['description'] = self.description

        # Only for request ordering (folders do not have order!)
        obj['order'] = [r.id for r in self._requests]
        obj['folders'] = [f.serialize() for f in
                          sorted(self._folders, key=attrgetter('id'))]

        # All request including from folders
        requests = self.all_requests()
        obj['requests'] = [r.serialize() for r in requests]

        return obj

    def jsonify(self, indent=4):
        obj = self.serialize()
        return json.dumps(obj, indent=indent)

    def save_to_file(self, filename, indent=4):
        obj = self.serialize()
        with open(filename, 'wt') as f:
            json.dump(obj, f, indent=indent)


class Folder:
    def __init__(self, name, id=None, description=None, collection=None):
        self.id = id or newid()
        self.name = name
        self.order = []
        self._requests = []
        self._collection = collection

    @property
    def collection_id(self):
        return self._collection.id

    def add_request(self, request):
        # TODO: verify if request already belongs to collection or folder
        assert not request._parent

        request._parent = self
        self._requests.append(request)

    def serialize(self):
        obj = OrderedDict()
        obj['id'] = self.id
        obj['name'] = self.name
        obj['order'] = [r.id for r in self._requests]
        # Not necessary
        # if self._collection is not None:
        #    obj['collection_id'] = self._collection.id
        return obj


class Request(object):
    """A Request object represents a single HTTP Request.

    :param name: Name that describes this request.
    :param url: URL to send in request.
    :param method: HTTP method to use.
    :param headers: dictionary of headers to send.
    :param data: the body to attach to the request. If a dictionary is
    provided, form-encoding will take place.
    :param json: json for the body to attach to the request
    (if data is not specified).
    :param params: dictionary of URL parameters to append to the URL.
    :param urlvars: dictionary of path variables
    :param description: Description of this request in markdown (optional)
    :param id: An uuid that identifies this request (optional)
    """

    def __init__(self, name, url, method=None, headers=None, data=None,
                 json=None, params=None, urlvars=None, description=None,
                 id=None, parent=None):

        self.id = newid() if id is None else id
        self.name = name
        self.url = url
        self.method = method
        self.headers = headers
        self.data = data
        self.json = json  # TODO: Change to a property?
        self.params = params
        self.urlvars = urlvars
        self.description = description
        self._parent = parent
        # Should we set parent here?

    def set_parent(self, parent):
        """Set a parent to this Request object.

        :param parent: A Collection or Folder.
        :return: None
        """
        assert self._parent is None
        # if not hasattr(self._parent, 'collection_id'):
        #    raise TypeError('Parent must be a Collection or a Folder.')
        self._parent = parent

    def serialize(self):
        headers = {} if self.headers is None else self.headers

        obj = OrderedDict()
        obj['id'] = self.id
        obj['name'] = self.name
        obj['url'] = self.url

        # Encode URL parameters
        if self.params:
            # TODO: The original URL cannot have any parameters
            obj['url'] += '?' + urlencode(self.params)

        # Default method: POST if there is a body. GET if there isn't.
        if not self.method:
            obj['method'] = 'POST' if self.data or self.json else 'GET'
        else:
            obj['method'] = self.method

        # Serialize body (data and json)
        if self.data is not None and isinstance(self.data, dict):
            # Can be raw, urlencoded, params
            obj['dataMode'] = 'urlencoded'

            def serialize(v):
                return json.dumps(v) if isinstance(v, (dict, list)) else str(v)

            obj['data'] = [dict(key=k, value=serialize(v), enabled=True,
                                type='text') for k, v in self.data.items()]
        elif self.data is not None:
            obj['dataMode'] = 'raw'
            obj['rawModeData'] = str(self.data)
        elif self.json is not None:
            obj['dataMode'] = 'raw'
            obj['rawModeData'] = json.dumps(self.json, indent=4)
            headers['Content-Type'] = 'application/json'

        # Serialize headers
        obj['headers'] = ''.join('%s: %s\n' % kv for kv in headers.items())

        # Serialize description - always in markdown
        if self.description is not None:
            obj['descriptionFormat'] = 'markdown'
            obj['description'] = self.description

        # URL variables
        if self.urlvars is not None:
            obj['pathVariables'] = self.urlvars

        # collectionId is required
        if self._parent is not None:
            obj['collectionId'] = self._parent.collection_id

        # Is folder optional?
        if isinstance(self._parent, Folder):
            obj['folder'] = self._parent.id

        return obj
