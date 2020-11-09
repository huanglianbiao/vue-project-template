<template>
  <el-popover v-model="visible" class="hs-table-filter" trigger="click" @show="handleShow" @after-leave="handleHide">
    <div class="hs-table-filter-wrapper">
      <el-input size="mini" v-model="input" prefix-icon="el-icon-search" placeholder="请输入内容" clearable></el-input>
      <vxe-table
          ref="table"
          size="mini"
          border
          resizable
          stripe
          align="center"
          show-overflow
          highlight-hover-row
          auto-resize
          column-width="auto"
          max-height="55%"
          :data="data"
          :loading="false"
          :checkbox-config="{ trigger: 'row' }"
          @checkbox-all="selectAllEvent"
          @checkbox-change="selectChangeEvent"
          @header-cell-click="headCellClick"
          :cell-style="{ cursor: 'pointer', 'user-select': 'none' }"
          :header-cell-style="{ cursor: 'pointer', 'user-select': 'none' }"
      >
        >
        <vxe-table-column type="checkbox" width="35"/>
        <vxe-table-column field="field" title="全选" show-overflow :formatter="column.formatter"/>
      </vxe-table>
      <div class="hs-table-filter-footer">
        <el-button size="mini" @click="handleCancel">清空</el-button>
        <el-button size="mini" type="primary" @click="handleOK">确定</el-button>
      </div>
    </div>
    <span slot="reference" :style="{ color: filterList.length !== 0 ? '#5e5dff' : '#909399', cursor: 'pointer' }">
      ¶
    </span>
  </el-popover>
</template>

<script>
import {debounce} from 'lodash';

export default {
  name: 'ItemFilter',
  props: {
    fetch: {
      type: Function,
      default() {
        return () => new Promise();
      }
    },
    formatter: {
      type: Function,
      default() {
        return () => new Promise();
      }
    },
    filterList: {
      type: Array,
      default() {
        return [];
      }
    },
    column: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      input: '',
      data: [],
      allData: [],
      checked: [],
      visible: false,
      loading: false
    };
  },
  mounted() {
    this.handleSearchChange = debounce(this.handleSearchChange, 300);
  },
  watch: {
    input(newValue) {
      this.handleSearchChange(newValue);
    }
  },
  methods: {
    handleShow() {
      this.loading = true;
      this.fetch(this.column.field)
          .then(data => {
            this.data = data.map(item => ({
              field: item
            }));
            this.allData = this.data;
            this.$nextTick().then(() => {
              const checkRowKeys = this.data.filter(({field}) => this.filterList.includes(field));
              this.$refs.table.setCheckboxRow(checkRowKeys, true);
              this.checked = checkRowKeys;
              // if (this.filterList.length === 0) {
              //   this.$refs.table.setAllCheckboxRow(true);
              // } else {
              //   const checkRowKeys = this.data.filter(({ field }) => this.filterList.includes(field));
              //   this.$refs.table.setCheckboxRow(checkRowKeys, true);
              // }
            });
          })
          .finally(() => {
            this.loading = false;
          });
    },
    handleHide() {
      this.input = '';
      this.allData = [];
      this.data = [];
      this.checked = [];
    },
    selectAllEvent({checked, records}) {
      this.checked = records;
    },
    selectChangeEvent({checked, records}) {
      this.checked = records;
    },
    handleOK() {
      this.$emit(
          'change',
          this.column.field,
          this.checked.map(({field}) => field)
      );
      this.visible = false;
    },
    handleCancel() {
      this.$emit('clear-item', this.column.field);
      this.visible = false;
    },
    handleSearchChange(value) {
      this.data = this.allData.filter(item => {
        let formatterValue = '';
        if (this.column.formatter) {
          formatterValue = this.column.formatter({cellValue: item.field});
        }
        return item.field?.toString().includes(value) || formatterValue?.toString().includes(value);
      });
    },
    headCellClick({$columnIndex, triggerSort}) {
      if ($columnIndex === 1 && !triggerSort) {
        this.$refs?.table?.toggleAllCheckboxRow();
      }
    }
  }
};
</script>

<style lang="less">
.hs-table-filter {
  position: relative;

  .hs-table-filter-icon {
    width: 12px;
    height: 12px;
    margin: 0 0 -1px 2px;
    color: #5554e6;
    cursor: pointer;
  }

  .filtered {
    background-color: #5554e6;
  }
}

.hs-table-filter-wrapper {
  display: flex;
  flex-direction: column;

  .el-input {
    margin-bottom: 10px;
  }

  .hs-table-filter-footer {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.vxe-table--tooltip-wrapper {
  z-index: 3000 !important; // 高于el-popover的z-index
}
</style>
