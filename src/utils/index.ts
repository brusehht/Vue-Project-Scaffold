import Vue from 'vue';
import FUNC_OPTIONS from '@/assets/json/functionType.json';

function keysToLabel(prop: string, val: any) {
  if (prop === 'status') {
    switch (val) {
      case 1:
        return 'Pending';
      case 2:
        return 'Active';
      case 3:
        return 'Partial';
      default:
        break;
    }
  } else if (prop === 'syncStatus') {
    switch (val) {
      case 1:
        return 'Synced';
      case 2:
        return 'Unsync';
      case 0:
        return 'NA';
    }
  } else {
    throw Error('prop not valid')
  }
}

export default {
  /**
   * 动态设置table高度
   * @param  {string} 元素选择器 类jquery
   * @return {number} 除去所传入元素的页面剩余高度
   */
  setTableHeight(...el) {
    const h =
      window.innerHeight -
      el.reduce((sum, cur) => sum + document.querySelector(cur).offsetHeight, 0);
    return h;
  },
  isOtherNode(node) {
    return node.neType === 'others';
  },
  keysToLabel,
  uuid() {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  },
  createSpecs({ type, isMain = true, cb, multiSelect = false }) {
    let specs;
    if (isMain) {
      switch (type) {
        case 'sid':
          specs = [
            {
              label: 'SID',
              prop: 'sid',
              width: 280,
              sortable: true
            },
            {
              label: 'Node',
              prop: 'neId',
              sortable: true,
              formatter: (row, col, cell) => {
                const transData = cb();
                const node = transData.nodes.find((item) => {
                  return cell === item.id;
                });
                row.neName = node ? node.label : '';
                return row.neName;
              },
            },
            {
              'label': 'Function',
              'prop': 'function',
              'min-width': 120,
              'sortable': true,
              'formatter': (row, col, cell) => {
                return FUNC_OPTIONS.find((item) => item.value === cell).label;
              },
            },
            {
              label: 'Name',
              prop: 'name',
              sortable: true,
            },
            {
              'label': 'Provisioning Status',
              'prop': 'status',
              'min-width': 160,
              'sortable': true,
              'formatter': (row, col, cell) => {
                return keysToLabel('status', cell);
              },
            },
            {
              'label': 'Sync Status',
              'prop': 'syncStatus',
              'min-width': 120,
              'sortable': true,
              'formatter': (row, col, cell) => {
                return keysToLabel('syncStatus', cell);
              },
            },
            {
              'label': 'Creator',
              'prop': 'creator',
              'min-width': 120,
              'sortable': true,
            },
            {
              'label': 'Activate Time',
              'prop': 'activeTime',
              'min-width': 150,
              'sortable': true,
            },
          ];
          break;
        case 'segmentList':
          specs = [
            {
              label: 'Segment List Name',
              prop: 'name',
              sortable: true,
            },
            {
              label: 'SID List',
              prop: 'points',
              sortable: true,
              formatter: (row, col, cell) => {
                const transData = cb();
                let sidList = '';
                cell.list.map((item) => {
                  const current = transData.sidInfo.find(
                    (sid) => sid.svcId === item.endPoint,
                  ).sid;
                  if (sidList) {
                    sidList = sidList.concat(',', current);
                  } else {
                    sidList = sidList.concat(current);
                  }
                });
                row.sidList = sidList;
                return sidList;
              },
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
          break;
        case 'path':
          specs = [
            {
              label: 'Name',
              prop: 'name',
              sortable: true,
            },
            {
              label: 'Head',
              prop: 'head',
              sortable: true,
              formatter: (row, col, cell) => {
                const transData = cb();
                const neId = row.points.list.find((item) => item.type === 0).neId;
                const ne = transData.nodes.find((item) => {
                  return neId === item.id;
                });
                row.head = ne.label;
                return ne.label;
              },
            },
            {
              label: 'End',
              prop: 'end',
              sortable: true,

              formatter: (row, col, cell) => {
                const transData = cb();
                const neId = row.points.list.find((item) => item.type === 1).neId;
                const ne = transData.nodes.find((item) => {
                  return neId === item.id;
                });
                row.end = ne.label;
                return ne.label;
              },
            },
            {
              label: 'Provisioning Status',
              prop: 'status',
              sortable: true,

              formatter: (row, col, cell) => {
                return keysToLabel('status', cell);
              },
            },
            {
              label: 'Sync Status',
              prop: 'syncStatus',
              sortable: true,

              formatter: (row, col, cell) => {
                return keysToLabel('syncStatus', cell);
              },
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
          break;
        case 'policy':
          specs = [
            {
              label: 'Name',
              prop: 'name',
              sortable: true,
            },
            {
              label: 'Color',
              prop: 'color',
              sortable: true,
            },
            {
              label: 'Head',
              prop: 'head',
              sortable: true,
              formatter: (row, col, cell) => {
                const transData = cb();
                const neId = row.points.list.find((item) => item.type === 0).neId;
                const ne = transData.nodes.find((item) => {
                  return neId === item.id;
                });
                row.head = ne.label;
                return ne.label;
              },
            },
            {
              label: 'End',
              prop: 'end',
              sortable: true,

              formatter: (row, col, cell) => {
                const transData = cb();
                const neId = row.points.list.find((item) => item.type === 1).neId;
                const ne = transData.nodes.find((item) => {
                  return neId === item.id;
                });
                row.end = ne.label;
                return ne.label;
              },
            },
            {
              label: 'Provisioning Status',
              prop: 'status',
              sortable: true,
              formatter: (row, col, cell) => {
                return keysToLabel('status', cell);
              },
            },
            {
              label: 'Sync Status',
              prop: 'syncStatus',
              sortable: true,
              formatter: (row, col, cell) => {
                return keysToLabel('syncStatus', cell);
              },
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
          break;
        case 'lp':
          specs = [
            {
              label: 'Protection Name',
              prop: 'name',
              sortable: true,
            },
            {
              label: 'Provisioning Status',
              prop: 'status',
              sortable: true,
              formatter: (row, col, cell) => {
                return keysToLabel('status', cell);
              },
            },
            {
              label: 'Node Name',
              prop: 'neId',
              sortable: true,
              formatter: (row, col, cell) => {
                const transData = cb();
                const node = transData.nodes.find((item) => {
                  return item.id === cell;
                });
                row.neName = node.label;
                return row.neName;
              },
            },
            {
              label: 'Link  Interface',
              prop: 'interface',
              sortable: true,
            },
            {
              label: 'Destination Prefix',
              prop: 'destIp',
              sortable: true,
            },
            {
              label: 'Prefix Length',
              prop: 'mask',
              sortable: true,
            },
            {
              label: 'RepairTunnel - SID List',
              prop: 'tInsert',
              sortable: true,
              formatter: (row, col, cell) => {
                return cell.join(',');
              },
            },
          ];
          break;
        case 'ce':
          specs = [
            {
              label: 'Name',
              prop: 'name',
              sortable: true,
            },
            {
              label: 'Type',
              prop: 'type',
              sortable: true,
              formatter(row, column, cell) {
                return cell === 0 ? 'VPWS' : 'L3 VPN';
              },
            },
            {
              label: 'ProvisioningStatus',
              prop: 'status',
              sortable: true,
              formatter(row, column, cell) {
                return keysToLabel('status', cell);
              },
            },
            {
              label: 'Sync Status',
              prop: 'syncStatus',
              sortable: true,
              formatter(row, column, cell) {
                return keysToLabel('syncStatus', cell);
              },
            },
            {
              label: 'Client',
              prop: 'client',
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
          break;
        default:
          break;
      }
    } else {
      switch (type) {
        case 'sid':
          specs = [
            {
              label: 'SID',
              prop: 'sid',
              sortable: true,
            },
            {
              label: 'Name',
              prop: 'name',
              sortable: true,
            },
          ];
          break;
        case 'segmentList':
          specs = [
            {
              label: 'Name',
              prop: 'name',
              sortable: true,
            },
            {
              label: 'Type',
              prop: 'type',
              sortable: true,
              formatter: (row, col, cellValue) => {
                switch (cellValue) {
                  case 1:
                    return 'Dynamic';
                  case 2:
                    return 'explicit';
                }
              },
            },
            {
              label: 'Weight',
              prop: 'weight',
              sortable: true,
            },
          ];
          break;
        case 'path':
          specs = [
            {
              label: 'Path Name',
              prop: 'name',
              sortable: true,
            },
            {
              label: 'Preference',
              prop: 'preference',
              sortable: true,
            },
            {
              label: 'Valid Status',
              prop: 'valid',
              sortable: true,
              formatter: (row, col, cell) => {
                return cell.toString();
              },
            },
            {
              label: 'Work/Standby',
              prop: 'work',
              sortable: true,
            },
            {
              label: 'Min-Active-Number',
              prop: 'minActiveNum',
              sortable: true,
            },
            {
              label: 'Provisioning Status',
              prop: 'status',
              sortable: true,
              formatter: (row, col, cell) => {
                return keysToLabel('status', cell);
              },
            },
            {
              label: 'Sync Status',
              prop: 'syncStatus',
              sortable: true,
              formatter: (row, col, cell) => {
                return keysToLabel('syncStatus', cell);
              },
            },
            {
              label: 'Active Time',
              prop: 'activeTime',
              sortable: true,
            },
          ];
          break;
        case 'policy':
          specs = [
            {
              label: 'Name',
              prop: 'name',
              sortable: true,
            },
            {
              label: 'Color',
              prop: 'color',
              sortable: true,
            },
            {
              label: 'Provisioning Status',
              prop: 'status',
              sortable: true,
              formatter: (row, col, cell) => {
                return keysToLabel('status', cell);
              },
            },
            {
              label: 'Sync Status',
              prop: 'syncStatus',
              sortable: true,
              formatter: (row, col, cell) => {
                return keysToLabel('syncStatus', cell);
              },
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
          break;
        default:
          break;
      }
    }
    if (multiSelect) {
      specs.unshift({
        type: 'selection',
        prop: '__selection__',
        width: 50,
      });
    }
    return specs;
  },
};
