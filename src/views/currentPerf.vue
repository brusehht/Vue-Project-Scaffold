<template>
  <div class="current_perf">
		<div id="cur_performance_filterForm">
    <el-row type="flex" align="middle" id="cur_performance_title">
      <el-col :span="4" id="title">Current Performance</el-col>
      <el-col :span="6">
        <el-form>
          <el-form-item label="Source :">
            <node-select  :neFilter="sourceIds" @change="onSourceSelect"></node-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="14" align="right">
        <el-switch @change="setTableHeight" v-model="filterFormVisible" active-text="Hide filter" inactive-text="Show filter"></el-switch>
      </el-col>
    </el-row>
    <el-collapse-transition>
      <el-row v-show="filterFormVisible">
        <el-col :span="11">
          <el-card class="box-card">
            <el-row :gutter="20">
              <el-form :inline="true" v-model="filterForm" label-width="60px" label-position="left">
                <el-col :span="16">
                  <el-form-item label="Entity :">
                    <node-tree isSelectMode :neFilter=filterForm.source
										 show-checkbox :showLevel="['Physical','port']"
										 @current-change="onEntityChange"></node-tree>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Type :">
                    <el-select v-model="filterForm.curType" filterable clearable placeholder="select">
                      <el-option v-for="item in typeOption" :value="item" :key="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <el-row>
              <el-table ref="optionalTable" :data="computedOption" height="300" @selection-change="onLeftSelect" v-loading.body="loadingOption"
                border stripe fit highlight-current-row>
                <el-table-column fixed align="center" type="selection" min-width="40">
                </el-table-column>
                <el-table-column sortable prop="name" label="Monitor Entity" min-width="250">
                </el-table-column>
                <el-table-column sortable prop="object" label="Object" min-width="100">
                </el-table-column>
                <el-table-column sortable prop="perfid" label=" Performance ID" min-width="160">
                </el-table-column>
                <el-table-column sortable prop="type" label=" Type " min-width="120">
                </el-table-column>
                <el-table-column sortable prop="Description" label="Description" min-width="250">
                </el-table-column>
              </el-table>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="1" class="operation_icon">
          <el-row>
            <i class="el-icon-arrow-right" @click="addSelectedData"></i>
          </el-row>
          <el-row>
            <i class="el-icon-arrow-left" @click="deleteSelectedData"></i>
          </el-row>
          <el-row>
            <i class="el-icon-d-arrow-right" @click="addAllData"></i>
          </el-row>
          <el-row>
            <i class="el-icon-d-arrow-left" @click="deleteAllData"></i>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <el-form class="perf_monitor_btn" inline>
              <el-row type="flex" align="middle" justify="end" :gutter="20">
                <el-col :span="10">
                  <el-form-item>
                    <el-select v-model="setMonitorOption" multiple size="small" placeholder="select" class="setMonitorOption">
                      <el-option label="15 Minutes" value="15m"></el-option>
                      <el-option label="24 Hours" value="24h"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10" align="right">
                  <el-button type="primary" size="small" @click="setMonitor('on')" :disabled="isMonitorOnDisabled">
                    Set Monitor On
                  </el-button>
                  <el-button type="primary" size="small" @click="setMonitor('off')" :disabled="isMonitorOffDisabled">
                    Set Monitor Off
                  </el-button>
                </el-col>
              </el-row>
            </el-form>
            <el-table ref="currentTable" :data="currentData" height="300" @selection-change="onRightSelect" border stripe fit highlight-current-row>
              <el-table-column fixed align="center" type="selection" min-width="55">
              </el-table-column>
              <el-table-column sortable prop="name" label="Monitor Entity" min-width="250">
              </el-table-column>
              <el-table-column sortable prop="object" label="Object" min-width="100">
              </el-table-column>
              <el-table-column sortable prop="perfid" label=" Performance ID" min-width="160">
              </el-table-column>
              <el-table-column sortable prop="type" label=" Type " min-width="100">
              </el-table-column>
              <el-table-column sortable prop="15m_monitor" label="15M" min-width="100">
              </el-table-column>
              <el-table-column sortable prop="24h_monitor" label="24H" min-width="100">
              </el-table-column>
              <el-table-column sortable prop="probableCause" label="Random" min-width="120">
              </el-table-column>
              <el-table-column sortable prop="Description" label=" Description" min-width="250">
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-collapse-transition>
    <el-form ref="configForm" :inline="true" :model="configForm" label-position="left">
      <el-row style="margin:10px auto" type="flex" align="middle" :gutter="20">
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="configForm.period" placeholder="select">
              <el-option label="15 Minutes" value="15m"></el-option>
              <el-option label="24 Hours" value="24h"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="Autorefresh:" label-width="120px">
            <el-switch v-model="configForm.autoRefresh"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Interval :" label-width="80px">
            <el-select v-model="configForm.interval" placeholder="select">
              <el-option :value=5></el-option>
              <el-option :value=10></el-option>
              <el-option :value=15></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button size="small" type="primary" @click="initWS">Refresh</el-button>
          <el-button size="small" type="primary" @click="clearTableData">Restart</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
	<el-table
		:data="typedTableData"
		:height="tableHeight"
		border
		stripe
		fit
		ref="currentPerfTable"
		highlight-current-row>
		<el-table-column
			prop="time"
			label="Time"
			align="center"
			min-width="100">
		</el-table-column>
		<el-table-column
			v-for="item in tableSpecs"
			:prop="item.prop"
			:key="item.prop"
			:label="item.label">
		</el-table-column>
	</el-table>
	</div>
</template>
<style>
#cur_performance_filterForm .el-form-item {
	display: inline-flex;
	margin-bottom: 5px;
	width: 100%;
}

#cur_performance_filterForm .el-form-item__content {
	width: 100%;
	flex: 1;
}

#cur_performance_filterForm .el-row {
	margin-top: 0;
}

.el-form .el-select {
	width: 100%;
}

.operation_icon {
	text-align: center;
	margin-top: 100px;
}

.operation_icon i {
	padding: 12px;
	border: 1px solid #ddd;
	border-radius: 10px;
	margin-top: 5px;
	cursor: pointer;
}

.setMonitorOption {
	display: inline-block;
}
</style>
<script lang="ts">
import {
	Component,
	Prop,
	Watch,
	Vue,
	Utils,
	BaseAPI,
	CommonAPI,
	Socket,
} from '@/config/base.imports';
import PerfAPI from '@/api/performance';

@Component({})
export default class Home extends Vue {
	filterFormVisible: boolean = true;
	filterForm = {
		selectedEntity: [],
		curType: '',
		source: [],
	};
	configForm = {
		period: '15m',
		autoRefresh: false,
		interval: 5,
	};
	optionalData: Array<any> = [];
	currentData: Array<any> = [];
	selectedOptionalData: Array<any> = [];
	selectedCurrentData: Array<any> = [];
	loadingOption: boolean = false;
	setMonitorOption = ['15m', '24h'];
	//data
	tableHeight: number = 500;
	tableData: Array<any> = [];
	tableSpecs: Array<any> = [];
	openWs: WebSocket;
	queryInterval: any;
	selectedEntity: any;

	get sourceIds() {
		return this.$route.params.nodeId
			? this.$route.params.nodeId.split(',')
			: [];
	}
	get typeOption() {
		return Array.from(
			new Set(this.optionalData.map((option) => option.type)),
		).sort(
			(a, b) =>
				a
					.trim()
					.toLowerCase()
					.codePointAt(0) -
				b
					.trim()
					.toLowerCase()
					.codePointAt(0),
		);
	}
	get computedOption() {
		//根据type筛选出候选值列表
		return this.optionalData.filter((item) =>
			item.type.includes(this.filterForm.curType),
		);
	}
	get isMonitorOnDisabled() {
		return this.selectedCurrentData.every(
			(item) => item['15m_monitor'] === 'on' && item['24h_monitor'] === 'on',
		);
	}
	get isMonitorOffDisabled() {
		return this.selectedCurrentData.every(
			(item) => item['15m_monitor'] === 'off' && item['24h_monitor'] === 'off',
		);
	}
	get typedTableData() {
		return this.tableData.filter((item) =>
			item.includes(this.configForm.period),
		);
	}
	@Watch('configForm', { deep: true })
	watchConfigForm() {
		if (this.configForm.autoRefresh) {
			this.initWS();
		} else {
			this.$emit('autoRefreshClosed');
		}
	}
	@Watch('currentData')
	watchCurData() {
		if (this.configForm.autoRefresh) {
			this.initWS();
		} else {
			this.$emit('autoRefreshClosed');
		}
	}
	onSourceSelect(source) {
		this.filterForm.source = source.map((item) => item.id);
		console.log(this.filterForm.source);
	}
	onAutoClose() {
		clearInterval(this.queryInterval);
	}
	onEntityChange(selectedEntity) {
		//查询指定Entity的性能指标列表 input格式化
		const _entity = Object.assign({}, selectedEntity);
		delete _entity.children;
		delete _entity.id;
		delete _entity.name;
		this.filterForm.selectedEntity = _entity;
		this.getOptionalData();
	}
	//获取候选值
	getOptionalData() {
		this.loadingOption = true;
		PerfAPI.getPerfByEntity(this.filterForm.selectedEntity).then((res) => {
			//表格值为选中entity节点和监控指标的合并值
			this.optionalData = res.perfs.map((item) =>
				Object.assign({}, this.filterForm.selectedEntity, item),
			);
			this.loadingOption = false;
		});
	}
	//查询单个性能指标的监控状态
	getMonitor(item) {
		//Object.assign第一个参数target为{},否则会保留引用,每次getPerfMonitor只传数组的最后一个item
		let input = Object.assign({}, item);
		delete input.name;
		delete input.Description;
		delete input.type;
		PerfAPI.getPerfMonitor(input).then((res) => {
			this.currentData.push(Object.assign({}, item, res));
		});
	}
	//设置性能指标的监控状态
	setMonitor(this: any, status) {
		this.selectedCurrentData.map((item) => {
			const input = Object.assign({}, item, {
				enabled: status,
			});
			delete input.name;
			delete input.Description;
			delete input.type;
			delete input['15m_monitor'];
			delete input['24h_monitor'];
			if (this.setMonitorOption.length === 2) {
				input['granularity'] = '2';
			} else if (this.setMonitorOption.includes('15m')) {
				input['granularity'] = '0';
			} else if (this.setMonitorOption.includes('24h')) {
				input['granularity'] = '1';
			}
			this.$$apis.topology.setPerfMonitor.call(this, input, (res) => {
				let index = this.currentData.indexOf(item);
				delete res.result;
				this.currentData.splice(index, 1, Object.assign(item, res));
			});
		});
		this.$refs.currentTable.clearSelection();
	}
	//添加选定候选值到监听列表
	addSelectedData(this: any) {
		this.selectedOptionalData.map((item) => {
			//ne-id ltp-id perfid都相同表示指标是同一个
			if (
				!this.currentData.some(
					(data) =>
						data['ne-id'] === item['ne-id'] &&
						data['ltp-id'] === item['ltp-id'] &&
						data.perfid === item.perfid,
				)
			) {
				this.getMonitor(item);
			}
		});
		this.$refs.optionalTable.clearSelection();
	}
	//添加所有候选值到监听列表
	addAllData(this: any) {
		this.computedOption.map((item) => {
			if (!this.currentData.map((data) => data.perfid).includes(item.perfid))
				this.getMonitor(item);
		});
		this.$refs.optionalTable.clearSelection();
	}
	//删除选定候选值到监听列表
	deleteSelectedData(this: any) {
		this.currentData = this.currentData.filter(
			(item) => !this.selectedCurrentData.includes(item),
		);
		this.$refs.currentTable.clearSelection();
	}
	//删除所有候选值到监听列表
	deleteAllData() {
		this.currentData = [];
	}
	onLeftSelect(val) {
		this.selectedOptionalData = val;
	}
	onRightSelect(val) {
		this.selectedCurrentData = val;
	}
	//轮询
	pollQuery() {
		const input: any = {};
		this.currentData.forEach((item, index) => {
			// 添加period
			item.period = this.configForm.period;
			//如果ne-id相同,即为同一entity下,则将其perfid拼接一起 删除当前item
			let sumItem = this.currentData.find((s) => s['ne-id'] === item['ne-id']);
			let sumIndex = this.currentData.findIndex(
				(i) => i['ne-id'] === item['ne-id'],
			);
			if (index > sumIndex) {
				sumItem.perfid += `,${item.perfid}`;
				delete this.currentData[index];
			}
			delete item.name;
			delete item.Description;
			delete item.type;
			delete item['15m_monitor'];
			delete item['24h_monitor'];
		});
		//将undefined值的元素删除
		this.currentData = this.currentData.filter((item) => item);
		input.perfs = this.currentData;
		// input.time = moment().format('YYYY-M-DD HH:mm:ss');
		PerfAPI.getCurrentPerf(input);
	}
	//建立websocket
	initWS() {
		if (this.openWs) this.openWs.close();
		const input = {
			matchContext: {
				uuid: Utils.uuid(),
			},
			subject: 'performance/current/notification',
		};
		//1.post获取websocket的URL，2.创建websocket,3.发起定时轮询query请求
		CommonAPI.getWebSocketUrl.call(this, input, (result) => {
			this.openWs = Socket.createCurrentPerfWs(`/${result.uriSuffix}`);
			clearInterval(this.queryInterval);
			this.pollQuery();
			if (this.configForm.autoRefresh) {
				this.queryInterval = setInterval(
					this.pollQuery,
					this.configForm.interval * 1000,
				);
			}
			this.openWs.onmessage = (evt) => {
				const res = JSON.parse(evt.data);
				const _tableSpec: any[] = [];
				const _row: any = {};
				_row.time = res.time;
				res.perfdatas.map((item) => {
					item.perfdata.map((cur) => {
						let _prop = cur.name.replace(/\./g, '#');
						_row[_prop] = cur['value'] || 'N/A';
						let _spec = {
							prop: _prop,
							label: cur.name,
						};
						if (!_tableSpec.find((spec: any) => spec.label === _spec.label)) {
							_tableSpec.push(_spec);
						}
					});
				});
				this.tableSpecs = _tableSpec;
				if (_row !== {}) this.tableData.push(_row);
			};
		});
	}
	clearTableData() {
		this.tableData = [];
	}
	setTableHeight(status) {
		if (status) {
			this.tableHeight =
				Utils.setTableHeight('#navBar', '#cur_performance_filterForm') - 20;
		} else {
			this.tableHeight =
				Utils.setTableHeight('#navBar', '#cur_performance_filterForm') - 20;
		}
	}
}
</script>
