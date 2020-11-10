const delay = require("mocker-api/lib/delay");
const Mock = require("mockjs");

const proxy = {
  [`GET /web/test/get-data`]: (req, res) => {
    return res.json(
      Mock.mock({
        code: "0",
        "data|100": [
          {
            name: '@string("upper", 5)',
            "age|18-55": 19,
            time: "@datetime"
          }
        ]
      })
    );
  },
  [`POST /web/test/query-list`]: (req, res) => {
    const { pageStart, pageSize } = req.body;
    let { list } = Mock.mock({
      "list|100": [
        {
          name: '@string("upper", 5)',
          "age|18-55": 19,
          time: "@datetime"
        }
      ]
    });

    return res.json({
      code: "0",
      data: {
        list: list.slice(0, pageSize),
        pageStart: 1,
        pageSize: 10,
        total: list.length
      }
    });
  }
};

const ENABLE_MOCK = true;

module.exports = ENABLE_MOCK ? delay(proxy, 1000) : {};
