# This file is loaded by py.test to discover API tests

import pytest

from apitest import APITest
from loader import yaml_load


def pytest_collect_file(parent, path):
    if path.ext == ".yaml" and path.basename.startswith("test"):
        return APITestFile(path, parent)


class APITestFile(pytest.File):
    def collect(self):
        doc = yaml_load(self.fspath.open())
        if doc:
            config = doc.get('config', {})
            for test in doc.get('tests', []):
                yield APITestItem(test['name'], self, test, config)


class APITestItem(pytest.Item):
    def __init__(self, name, parent, api_test, api_config):
        super(APITestItem, self).__init__(name, parent)
        self.api_test = api_test
        self.api_config = api_config

    def runtest(self):
        test = APITest(self.api_test, self.api_config)
        test.runtest()

    def reportinfo(self):
        return self.fspath, 0, "API Test: %s" % self.name


class YamlException(Exception):
    """ custom exception for error reporting. """
