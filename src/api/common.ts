import BaseApi from './base';

class Common extends BaseApi {
	constructor() {
		super();
	}
	public getWebSocketUrl(input, fn, opts) {
		return this.post('websocket/websocket/create', input, opts);
	}
	public getURL(input) {
		return this.get('http://apis.juhe.cn/qrcode/api', input);
	}
}

export default new Common();
