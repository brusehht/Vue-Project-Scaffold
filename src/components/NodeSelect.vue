<template>
  <el-select v-model="currentNode" filterable multiple remote clearable :remote-method="nodeQuery"
             placeholder="Select Source" value-key="id" @change="nodeChange">
    <el-option
      v-for="item in optionalNodes"
      :key="item.id"
      :label="item.label"
      :value="item">
    </el-option>
  </el-select>
</template>
<style>
.el-select {
	width: 100%;
}
</style>
<script lang="ts">
import { Component, Prop, Vue, Utils, CommonAPI } from '@/config/base.imports';
import TopoAPI from '@/api/topology';
@Component({
	name: 'NodeSelect',
})
export default class NodeSelect extends Vue {
	@Prop() neFilter: string[];
	//Source下拉框中的候选Node
	optionalNodes: Array<any> = [];
	//所有的Node列表
	allNodeList: Array<any>;
	currentNode: Array<any> = [];
	//判断Source的上一次动作是什么
	sourceAction: string;

	getOptionalNodes() {
		TopoAPI.getAllNodes().then((res) => {
			this.allNodeList = res;
			this.optionalNodes = res;
			this.$nextTick(function() {
				this.setCurrentNode();
			});
		});
	}
	nodeChange(node) {
		this.sourceAction = 'change';
		this.currentNode = node;
		this.$emit('change', node);
	}
	nodeQuery(query) {
		//只当输入值的时候才进行query，下拉选择的时候不进行query
		if (
			query &&
			(this.sourceAction === 'query' || this.currentNode.length === 0)
		) {
			this.optionalNodes = this.allNodeList.filter((item) => {
				return Object.values(item).some((val) =>
					val
						.toString()
						.toLowerCase()
						.includes(query.toLowerCase()),
				);
			});
		}
		this.sourceAction = 'query';
	}
	setCurrentNode() {
		if (this.neFilter && this.neFilter.length > 0) {
			this.currentNode = this.allNodeList.filter((item) =>
				this.neFilter.some((node) => node === item.id),
			);
			this.$emit('change', this.currentNode);
		}
	}
	reset() {
		this.currentNode = [];
	}
	created() {
		this.getOptionalNodes();
	}
}
</script>
