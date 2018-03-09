<template>
  <div>
    <div class="header">
      <div v-if="title" class="title">{{title}}</div>
      <div class="search-operate">
        <el-input class="search" v-if="showFilter" v-model="filterInput" suffix-icon="el-icon-search" placeholder="Search...">
        </el-input>
        <slot name="operateBtn">
        </slot>
      </div>
    </div>
    <el-table ref="table" v-on="$listeners" v-bind="getTableBind()" v-loading="loading" :data="filteredData">
      <template v-for="item in renderColumn">
        <!--普通列-->
        <el-table-column v-if="isDefaultCol(item.type)" :key="item.prop" v-bind=getColBind(item)>
          <template slot-scope="scope">
            <component :is="item.component" v-bind="getScopeBind(scope,item)">
            </component>
          </template>
        </el-table-column>
        <!--expand-->
        <el-table-column v-else-if="item.type === 'expand'" v-bind="item" :key="item.prop">
          <template slot-scope="scope">
            <slot name="expand" v-bind="scope"></slot>
          </template>
        </el-table-column>
        <!--多选selection-->
        <el-table-column v-else v-bind="item" :key="item.prop">
        </el-table-column>
      </template>
      <template slot="append">
        <slot name="append"></slot>
      </template>
    </el-table>
    <div v-if="showPagination">
      <el-pagination
        class="pager"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="changePage"
        @size-change="handleSizeChange"
        :total="pageTotal"
        :current-page="page.curPage"
        :page-size="page.size"
        :page-sizes="[20, 50,100]">
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from '@/config/base.imports';

const COLUMN_TYPES: Array<string> = ['expand', 'index', 'selection'];

const COLUMN_PROPS = {
	component: {
		functional: true,
		props: ['row', 'col', 'column'],
		render(h, { props: { row, col } }) {
			const { formatter } = col;
			return formatter ? formatter(row, col, row[col.prop]) : row[col.prop];
		},
	},
};

const BOOLEAN_KEYS = [
	'fit',
	'stripe',
	'border',
	'show-header',
	'highlight-current-row',
	'default-expand-all',
	'show-summary',
];

interface column {
	label: string;
	prop: string;
	sortable: boolean;
	[propName: string]: any;
}

@Component({
	name: 'SearchTable',
})
export default class SearchTable extends Vue {
	// 列表头
	@Prop({ default: '' })
	title: string;
	// 表格列配置 同element table
	@Prop({ required: true })
	columns: column[];
	// 表格数据
	@Prop({ required: true })
	data: any[];
	// 表格loading
	@Prop({ default: false })
	loading: boolean;
	// 是否显示filter
	@Prop({ default: false })
	showFilter: boolean;
	// 是否显示分页
	@Prop({ default: false })
	showPagination: boolean;

	filterInput: string = '';
	page: any = {
		curPage: 1,
		size: 20,
	};
	dataFilterBySearch: Array<any> = [];
	tableHeight: Number = 0;
	get renderColumn() {
		return this.columns.map((item) => Object.assign({}, COLUMN_PROPS, item));
	}
	get filteredData() {
		if (this.showFilter) {
			this.dataFilterBySearch = this.data.filter((item) =>
				Object.values(item).some(
					(v) => v && v.toString().includes(this.filterInput),
				),
			);
		} else {
			this.dataFilterBySearch = this.data;
		}
		if (this.showPagination) {
			let begin = (this.page.curPage - 1) * this.page.size;
			return this.dataFilterBySearch.slice(begin, begin + this.page.size);
		} else {
			return this.dataFilterBySearch;
		}
	}
	get pageTotal() {
		return this.dataFilterBySearch.length;
	}

	isDefaultCol(type) {
		return !COLUMN_TYPES.includes(type);
	}
	getTableBind(this: Vue) {
		const { $attrs } = this;
		const bind = {};
		Object.keys($attrs).forEach((key) => {
			const v = $attrs[key];
			const uniformKey = key.replace(/([A-Z])/, '-$1').toLowerCase();
			bind[key] = ~BOOLEAN_KEYS.indexOf(uniformKey) && v === '' ? true : v;
		});
		return bind;
	}
	getScopeBind({ row, column }, col) {
		const props = { row, column, col };
		return props;
	}
	getColBind(col) {
		const bind = Object.assign({}, col);
		delete bind.component;
		delete bind.listeners;
		delete bind.propsHandler;
		return bind;
	}
	clearSelection(this: any) {
		this.$refs.table.clearSelection();
	}
	changePage(index) {
		this.page.curPage = index;
	}
	handleSizeChange(size) {
		this.page.size = size;
	}
}
</script>
<style scoped>
.header {
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.title {
	flex: 0 0 200px;
}
.search-operate {
	flex: 1;
	text-align: right;
}
.search {
	max-width: 200px;
	margin-right: 10px;
}

.pager {
	float: right;
}
</style>
