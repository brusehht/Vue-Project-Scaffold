import Utils from '@/utils/';

const mixin = {
  data() {
    return {
      tableHeight: 800,
    };
  },
  computed: {

  },
  mounted(this: any) {
    // 确保dom全部更新后获取元素高度
    this.$nextTick(() => {
      this.tableHeight = Utils.setTableHeight() - 30;
    });
  },
};

export default mixin;
