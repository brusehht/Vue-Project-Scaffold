import config from '@/config/index';
const { websocketconfig } = config;

const wsinit = (wsUrl, name) => {
  const websocket = new WebSocket(websocketconfig.baseURL + wsUrl);
  websocket.binaryType = websocketconfig.binaryType;
  websocket.onopen = (evt) => {
    console.log(name + ' Websocket Open');
  };
  websocket.onclose = (evt) => {
    console.log(name + ' Websocket Close');
  };
  websocket.onerror = (evt) => {
    console.log(name + ' Websocket Error');
  };
  return websocket;
};

export default {
  getFilteredWs(url, name) {
    return wsinit(url, name);
  },
  getAlarmStaticWs() {
    return wsinit('/alarm/statistic', 'Alarm Static');
  },
  getCurrentAlarmWs() {
    return wsinit('/alarm/current/notification', 'Current Alarm');
  },
  createCurrentPerfWs(url) {
    return wsinit(url, 'Current Perf');
  },
};
