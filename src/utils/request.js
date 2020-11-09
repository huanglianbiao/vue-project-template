import Axios from 'axios';
import {Notification} from 'ant-design-vue';
import {Loading} from 'element-ui';
import {INTERNAL_SERVER_ERROR} from 'http-status-codes';

const HTTP_SUCCESS_CODE = '0';
const API_BASE_URL = '';

Axios.defaults.baseURL = API_BASE_URL;
// 设置接口超时时间
// Axios.defaults.timeout = 6000;
Axios.defaults.withCredentials = false;

// 设置post请求请求头
Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 添加请求拦截器
Axios.interceptors.request.use(
  config => {
    // todo 请求头中加token信息
    /*if (token) {
    config.headers["Authorization"] = "web " + token;
  }*/

    return config;
  },
  error => {
    // 对请求错误处理
    return Promise.reject(error);
  }
);

// 添加响应拦截器
Axios.interceptors.response.use(
  response => {
    const {
      data: {code}
    } = response;
    if (code !== HTTP_SUCCESS_CODE) {
      return Promise.reject(response);
    }
    return Promise.resolve(response);
  },
  error => {
    // 对响应错误处理
    if (!error.response) {
      const status = error.response.status;
      switch (status) {
        case INTERNAL_SERVER_ERROR: {
          message('服务器内部错误，请联系管理员');
          break;
        }
        default: {
          if (error?.response?.data?.message) {
            message('error', error.response.data.message);
          }
        }
      }
      return Promise.reject(error);
    }
  }
);

function message(msg) {
  Notification({
    message: msg,
    type: 'error'
  });
}

let loadingInstance;

const startLoading = target => {
  loadingInstance = Loading.service({
    target: target || document.body,
    lock: true
  });
};

const endLoading = () => {
  loadingInstance?.close();
};

// 预设超时时长
const timeout = ms => new Promise((_, reject) => setTimeout(() => reject(Symbol.for('timeout')), ms));

// 防止loading过程太短一闪而过
const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

const handleSuccess = data => {
  const response = Array.isArray(data) ? data[0] : data;
  return Promise.resolve(response.data);
};

const handleError = err => {
  return Promise.reject(err);
};

const timeoutAndDelay = ({promise, timeoutTime = 300, delayTime = 500, loadingTarget}) => {
  return Promise.race([promise, timeout(timeoutTime)])
    .then(handleSuccess)
    .catch(err => {
      if (err === Symbol.for('timeout')) {
        loadingTarget && startLoading(loadingTarget);
        return Promise.all([promise, delay(delayTime)])
          .then(handleSuccess)
          .catch(handleError)
          .finally(() => {
            loadingTarget && endLoading();
          });
      }
      return handleError(err);
    });
};

const request = ({config, success, error, loadingTarget}) => {
  return timeoutAndDelay({
    loadingTarget,
    promise: Axios(config).then(
      response => {
        if (success) {
          Notification.success(success);
        }
        return Promise.resolve(response);
      },
      ({response}) => {
        if (error) {
          const errorMessage = error;
          if (response.data.msg) {
            errorMessage.message = response.data.msg;
          }
          Notification.error(errorMessage);
        }
        return Promise.reject(response);
      }
    )
  });
};

export default request;
