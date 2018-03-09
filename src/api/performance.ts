import BaseApi from './base';

class Performance extends BaseApi {
	constructor() {
		super();
	}
	getCurrentPerf(input) {
		return this.post('performance/perf/current', input);
	}
	getPerfByEntity(input) {
		return this.post('performance/perf/resource/entity', input);
	}
	getPerfMonitor(input) {
		return this.post('performance/perf/resources/entity/monitor', input);
	}
	setPerfMonitor(input) {
		return this.post('performance/perf/resources/entity/setmon ', input);
	}
}

export default new Performance();
