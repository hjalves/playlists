import pprint

import requests


class APITest(object):
    def __init__(self, test, config):
        self.name = test['name']
        self.description = test.get('description')
        self.method = test['method'].upper()
        self.url = test['url']
        self.params = test.get('params', {})
        self.url_params = test.get('url-vars', {})
        self.full_url = config.get('base-url', '') + test['url']
        for key, value in self.url_params.items():
            self.full_url = self.full_url.replace(':' + key, str(value))
        self.execution_code = test.get('execute')
        self.http_session = requests.Session()
        authorization = config.get('authorization')
        if authorization:
            self.http_session.headers.update({'Authorization': authorization})

    def runtest(self):
        print('\nTest name:', self.name)
        print('Description:', self.description)
        print('Endpoint:', self.method, self.full_url)
        if self.params:
            print('Arguments:', ', '.join('%s=%r' % kv for kv in
                                          self.params.items()))
        print('-' * 50)

        # Perform request
        params = self.params if self.method == 'GET' else None
        data = self.params if self.method != 'GET' else None
        response = self.http_session.request(self.method, self.full_url,
                                             params=params, json=data)
        result = response.json() if response.text else None
        print('Status code: ', response.status_code)
        print('Result (body): \n%s' % pprint.pformat(result))

        def expect_status(expected):
            actual = response.status_code
            message = 'Status code is %s. Expected %s.' % (actual, expected)
            assert actual == expected, message

        if self.execution_code:
            pseudo_filename = 'API Test: %s' % self.name
            compiled = compile(self.execution_code, pseudo_filename, 'exec')
            exec(compiled, {}, {'response': response,
                                'status': response.status_code,
                                'result': result,
                                'raise_for_status': response.raise_for_status,
                                'expect_status': expect_status})
