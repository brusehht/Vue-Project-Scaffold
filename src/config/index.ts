import { Message } from 'element-ui';

interface Settings {
  axiosconfig: any;
  axioscallback: any;
  websocketconfig: any;
  [propName: string]: any;
}

const settings: Settings = {
  // axios的全局配置
  axiosconfig: systemConfig.odlConfig,
  // axios回调函数
  axioscallback: {
    showError(error, errorType) {
      let message;
      if (error.data) {
        message = error.data.details.length > 0 ? error.data.details : error.data.message;
      } else if (error.message) {
        message = error.message;
      } else {
        message = 'Unexpected Error';
      }
      switch (errorType) {
        case 'request':
          Message({
            showClose: true,
            message,
            type: 'error',
          });
          break;
        case 'response':
          if (error.status === 401) {
            Message({
              showClose: true,
              message: 'Auth error：' + message,
              type: 'error',
            });
          } else if (error.status === 404) {
            Message({
              showClose: true,
              message: 'Resource not found error：' + message,
              type: 'error',
            });
          } else {
            Message({
              showClose: true,
              message,
              type: 'error',
            });
          }
          break;
        default:
      }
    },
  },
  websocketconfig: systemConfig.webSocketConfig,
};

export default settings;
