#!/usr/bin/env bash

if [[ $1 == "on_success" ]]; then
  curl 'https://notice_path' \
    -H 'Content-Type: application/json' \
    -d "
      {
        \"msgtype\": \"markdown\",
        \"markdown\": {
          \"content\": \"(**前端**)，<font color='info'>部署成功</font>\n>[点击查看](http://host:port)\n$CI_COMMIT_MESSAGE\"
        }
      }"
elif [[ $1 == "on_failure" ]]; then
  curl 'https://notice_path' \
    -H 'Content-Type: application/json' \
    -d '
      {
        "msgtype": "text",
        "text": {
          "content": "(前端)，部署失败",
          "mentioned_list":["huanglianbiao"]
        }
      }'
fi
