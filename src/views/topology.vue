<template>
  <div class="home">
		<search-table ref="mainTable" :data="[1]" :columns="pathTableSpecs" title="Path List Table"
                    border stripe fit highlight-current-row showFilter showPagination>
        <template slot="operateBtn">
          <el-button size="small" type="primary" icon="el-icon-edit">
            Check
          </el-button>
        </template>
      </search-table>
		<slide-Dialog header v-model="updateDialogVisible" animation="move-bottom">
    </slide-Dialog>
  </div>
</template>

<script lang="ts">
import {
	Component,
	Prop,
	Vue,
	Utils,
	BaseAPI,
	CommonAPI,
} from '@/config/base.imports';

import Alarm from '../api/alarm';

const pathTableSpecs = [
	{
		label: 'Name',
		prop: 'name',
		sortable: true,
	},
	{
		label: 'Description',
		prop: 'desc',
		sortable: true,
	},
	{
		label: 'Creator',
		prop: 'creator',
		sortable: true,
	},
	{
		label: 'Create Time',
		prop: 'createTime',
		sortable: true,
	},
];
@Component({})
export default class Home extends Vue {
	url: string = '';
	updateDialogVisible: boolean = false;
	pathTableSpecs: Array<any> = pathTableSpecs;
	getCode() {}
	created() {
		Alarm.getAllAlarm()
			.then(res => {
				this.url = res;
			})
			.catch(err => {
				console.dir(err, '111111111');
			});
		Alarm.filterCurrentAlarm({
			id: 1,
		});
	}
}
</script>
