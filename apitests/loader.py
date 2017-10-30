import os
from collections import OrderedDict

import yaml
import yaml.resolver


class Loader(yaml.Loader):
    def __init__(self, stream):
        self._root = os.path.split(stream.name)[0]
        super(Loader, self).__init__(stream)

    def include(self, node):
        filename = os.path.join(self._root, self.construct_scalar(node))
        with open(filename, 'r') as f:
            return yaml.load(f, Loader)

    def construct_mapping(self, node, deep=False):
        self.flatten_mapping(node)
        return OrderedDict(self.construct_pairs(node))


Loader.add_constructor('!include', Loader.include)
# mapping is loaded as an OrderedDict
Loader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,
                       Loader.construct_mapping)


def yaml_load(stream):
    return yaml.load(stream, Loader)


def yaml_load_file(filename):
    with open(filename, 'rt') as f:
        return yaml_load(f)
