import BaseApi from './base';

class Alarm extends BaseApi {
  constructor() {
    super();
  }
  public getAllAlarm() {
    return this.get('alarm/current');
  }
  public filterCurrentAlarm(input) {
    return this.post('alarm/current/filter', input);
  }
}

export default new Alarm();
