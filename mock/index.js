const delay = require('mocker-api/lib/delay');
const Mock = require('mockjs');

const proxy = {
  [`GET /web/test/get-data`]: (req, res) => {
    return res.json(
      Mock.mock({
        code: '0',
        'data|10': [
          {
            name: 'name',
            age: 'age'
          }
        ]
      })
    );
  }
};

const ENABLE_MOCK = true;

module.exports = ENABLE_MOCK ? delay(proxy, 1000) : {};
