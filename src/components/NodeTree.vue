<template>
  <div id="node_tree" v-if="reRender">
    <template v-if="isSelectMode">
      <el-popover ref="popover" v-model="popVisible" :width="popWidth">
        <el-tree ref="neTree" lazy
                 node-key="id" highlight-current
                 :props="defaultProps" @current-change="onNodeChange"
                 @check-change="onCheckChange"
                 :load="loadNode"
                 :show-checkbox="showCheckbox">
        </el-tree>
      </el-popover>
      <el-select v-model="selectedList" v-popover:popover popper-class="node_tree_select">
      </el-select>
    </template>
    <template v-else>
      <el-tree ref="neTree" class="noarmalTree"
               check-strictly lazy node-key="id"
               :props="defaultProps" highlight-current
               @current-change="onNodeChange"
               @check-change="onCheckChange"
               :load="loadNode" :show-checkbox="showCheckbox">
      </el-tree>
    </template>
  </div>
</template>
<style>
.node_tree_select {
	display: none !important;
}

#node_tree {
	max-height: 300px;
	overflow: auto;
}

.noarmalTree {
	border: 1px solid #ddd;
	padding: 15px 8px;
	border-radius: 5px;
}

.el-popover {
	max-height: 300px;
	overflow: auto;
}

.el-popover .el-tree-node__content > .el-tree-node__expand-icon {
	padding-right: 10px;
}
</style>
<script lang="ts">
import { Component, Prop, Vue, Utils, CommonAPI } from '@/config/base.imports';
import TopoAPI from '@/api/topology';

interface Node {
	id: string;
	name?: string;
	tree_level?: string;
	[propName: string]: any;
}

@Component({
	name: 'NodeTree',
	watch: {
		neFilter: {
			handler(this: NodeTree, val, oldVal) {
				this.resetSelect();
			},
			deep: true,
		},
	},
})
export default class NodeTree extends Vue {
	@Prop({ default: false })
	isSelectMode: boolean;
	@Prop({
		default() {
			return ['sc', 'port'];
		},
	})
	showLevel: string[];
	@Prop() neFilter: string[];
	@Prop({
		type: Boolean,
		default: false,
	})
	showCheckbox: boolean;

	selectedData = {
		ne: {
			name: '',
		},
		card: {
			name: '',
		},
		port: {
			name: '',
		},
	};
	defaultProps = {
		label: 'name',
		children: 'children',
		isLeaf: (data) => {
			const end = this.showLevel[1] ? this.showLevel[1] : 'port';
			return data.tree_level === end;
		},
	};
	popWidth: number = 500;
	popVisible: boolean = false;
	reRender: boolean = true;
	get selectedList(): string {
		return Object.values(this.selectedData).reduce(
			(sum, item) => sum.concat(item.name, '  '),
			'',
		);
	}
	onNodeChange(data, node) {
		if (data.tree_level === 'Physical') {
			this.selectedData.ne = data;
		} else if (data.tree_level === 'card') {
			this.selectedData.ne = node.parent.data;
			this.selectedData.card = data;
		} else if (data.tree_level === 'port') {
			this.selectedData.ne = node.parent.parent.data;
			this.selectedData.card = node.parent.data;
			this.selectedData.port = data;
		}
		//针对selectMode隐藏select框
		const end = this.showLevel[1] ? this.showLevel[1] : 'port';
		if (data.tree_level === end) {
			this.$emit('current-change', this.selectedData);
			this.popVisible = false;
		}
	}
	onCheckChange(this: any, data, checked, node) {
		const checkedNodes = this.$refs.neTree.getCheckedNodes(true);
		this.$emit('check-change', checkedNodes);
	}
	async loadNode(node, resolve) {
		if (!node.data) {
			node.data = {};
			node.data.tree_level = 'null';
		}
		//展示层次的起点,终点
		const start = this.showLevel[0] ? this.showLevel[0] : 'null';
		const end = this.showLevel[1] ? this.showLevel[1] : 'port';
		switch (node.data.tree_level) {
			case 'null':
				if (start === 'sc') {
					const sc = await TopoAPI.getTopTopologyId('datalink');
					sc.name = 'root';
					sc.tree_level = 'sc';
					resolve([sc]);
				} else if (start === 'Physical') {
					const input = {
						type: 'ne',
						idList: this.neFilter,
					};
					const res = await TopoAPI.getDetailById(input);
					res.nodes.forEach((item) => {
						item.tree_level = 'Physical';
						item.name = item.label;
					});
					const nes = res.nodes;
					resolve(nes);
				}
				break;
			case 'sc':
				const dc = await TopoAPI.getGroupTree(node.data.id);
				dc.forEach((item) => (item.tree_level = 'dc'));
				resolve(dc);
				break;
			case 'dc':
				let group_nes = await TopoAPI.getNodes(node.data.id, node.data.id);
				//如果有传入网元配置 则对网元进行过滤
				if (this.neFilter && this.neFilter.length > 0) {
					group_nes = group_nes.filter(
						(item: Node) =>
							item.type === 'Physical'
								? this.neFilter.some((id) => item.id === id)
								: true,
					);
				}
				group_nes.forEach((item: Node) => (item.tree_level = item.type));
				resolve(group_nes);
				break;
			case 'Group':
				let nes = await TopoAPI.getNodes(node.data.id, node.data.id);
				if (this.neFilter && this.neFilter.length > 0) {
					nes = nes.filter(
						(item) =>
							item.type === 'Physical'
								? this.neFilter.some((id) => item.id === id)
								: true,
					);
				}
				nes.forEach((item) => (item.tree_level = item.type));
				resolve(nes);
				break;
			case 'Physical':
				const cardId = node.data.resourceId[0];
				let cards = [];
				//展示层次为card时展示card
				if (end === 'port') {
					cards = await TopoAPI.getCardByNe(cardId);
					cards.sort((a: any, b: any): number => {
						if (!a || !b) return 0;
						return (
							parseInt(a.id.match(/s=(\d+)/)[1]) -
							parseInt(b.id.match(/s=(\d+)/)[1])
						);
					});
				}
				cards.forEach((item: any) => {
					item.tree_level = 'card';
					item.name = `Slot${item.id.match(/s=(\d+)/)[1]} ${item.cardName}`;
				});
				resolve(cards);
				break;
			case 'card':
				const portId = node.parent.data.id;
				let ports = [];
				if (end === 'port') {
					ports = await TopoAPI.getPortByCard(portId, node.data.id);
					ports.sort((a: any, b: any): number => {
						if (!a || !b) return 0;
						return (
							parseInt(a.id.match(/j=(\d+)/)[1]) -
							parseInt(b.id.match(/j=(\d+)/)[1])
						);
					});
				}
				ports.forEach((item: any) => {
					item.tree_level = 'port';
					item.name = `Port${item.id.match(/j=(\d+)/)[1]}`;
				});
				resolve(ports);
				break;
			default:
				break;
		}
	}
	resetSelect(this: any) {
		//重置选中节点
		this.$refs.neTree.setCurrentNode({});
		this.selectedData = {
			ne: {
				name: '',
			},
			card: {
				name: '',
			},
			port: {
				name: '',
			},
		};
		this.popVisible = false;
		this.reRender = false;
		this.$nextTick(() => {
			this.reRender = true;
		});
	}
	mounted() {
		this.$nextTick(() => {
			this.popWidth = this.$el.offsetWidth - 20;
		});
	}
}
</script>
