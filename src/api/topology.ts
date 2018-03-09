import BaseApi from './base';

class TopoAPI extends BaseApi {
	constructor() {
		super();
	}
	getTopTopologyId(type) {
		return this.get('topology/topology/toplevelid/' + type);
	}
	getAllNodes() {
		return this.get('topology/topology/all/nodes');
	}
	getDetailById(input) {
		return this.post('service/data/information', input);
	}
	getGroupTree(id) {
		return this.get('topology/topology/group/' + id);
	}
	getNodes(topologyId: string, groupId: string) {
		return this.get('topology/topology/nodes/' + topologyId + '/' + groupId);
	}
	getCardByNe(neId) {
		return this.get('mitresource/operations/getCards/' + neId);
	}
	getPortByCard(neId, cardId) {
		return this.get(`mitresource/operations/getPorts/${neId}?cardId=${cardId}`);
	}
}

export default new TopoAPI();
