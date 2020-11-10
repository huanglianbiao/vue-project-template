<template>
  <vxe-grid
    class="hs-remote-table"
    size="small"
    height="auto"
    border
    resizable
    stripe
    auto-resize
    highlight-hover-row
    show-header-overflow="ellipsis"
    show-overflow
    :data="tableData"
    :loading="false"
    :seq-config="{ startIndex: (tablePage.currentPage - 1) * tablePage.pageSize }"
    :pager-config="tablePage"
    :sort-config="{
      remote: remote,
      defaultSort: {
        field: defaultOrderField,
        order: defaultOrderBy
      }
    }"
    :filter-config="{
      remote: remote
    }"
    v-bind="tableProps"
    @sort-change="handleSortChange"
    @page-change="handlePageChange"
    @checkbox-all="selectAllEvent"
    @checkbox-change="selectChangeEvent"
  >
    <vxe-table-column v-if="multiple" type="checkbox" width="60" fixed="left" />
    <vxe-table-column
      v-for="(column, index) in columns"
      :key="index"
      v-bind="column"
      :formatter="column.formatter ? column.formatter : defaultFormatter"
    >
      <template v-slot:header>
        <span>{{ column.title }}</span>
        <ItemFilter
          v-if="column.filterType === 'item'"
          :filter-list="getFilterValue(column.field)"
          :column="column"
          :fetch="fetchField"
          @change="handleFilter"
          @clear-item="clearFilter"
        />
      </template>
      <template v-if="column.slotName" v-slot="{ row }">
        <slot :name="column.slotName" v-bind:row="row" />
      </template>
    </vxe-table-column>
  </vxe-grid>
</template>

<script>
import ItemFilter from "./ItemFilter";
import { toLine, defaultPage, makePageSizes, validateValue, geCharCode } from "./utils";
import { cloneDeep } from "lodash";

export default {
  name: "XTable",
  components: {
    ItemFilter
  },
  props: {
    remote: {
      ype: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    defaultOrderField: {
      type: String,
      default: ""
    },
    defaultOrderBy: {
      type: String,
      default: ""
    },
    defaultSearchKey: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultSearchValue: {
      type: Array,
      default() {
        return [];
      }
    },
    tableProps: {
      type: Object,
      default() {
        return {
          align: "center"
        };
      }
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    fetch: {
      type: Function,
      default() {
        return () => new Promise();
      }
    },
    tableList: {
      type: Array,
      default() {
        return [];
      }
    },
    fetchColumn: {
      type: Function,
      default() {
        return () => new Promise();
      }
    },
    fieldType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: true,
      tableData: [],
      tablePage: {
        total: defaultPage.total,
        currentPage: defaultPage.pageStart,
        pageSize: defaultPage.pageSize,
        align: "center",
        pageSizes: makePageSizes(),
        layouts: ["Total", "PrevJump", "PrevPage", "Number", "NextPage", "NextJump", "FullJump", "Sizes"],
        size: "small"
      },
      checked: [],
      searchKey: this.defaultSearchKey,
      searchValue: this.defaultSearchValue,
      ascOrDesc: this.defaultOrderBy,
      orderBy: this.defaultOrderField,
      localFilterAllList: [] // 全部数据经本地筛选后的数据
    };
  },
  watch: {
    tableList: {
      handler() {
        !this.remote && this.getLocalList(this.getQueryParams());
      }
    }
  },
  mounted() {
    this.remote && this.fetchData();
  },
  methods: {
    getQueryParams(params = {}) {
      const { currentPage: pageStart, pageSize } = this.tablePage;
      const { searchKey, searchValue, ascOrDesc, orderBy } = this;
      return Object.assign(
        {
          pageStart,
          pageSize,
          searchKey,
          searchValue,
          ascOrDesc,
          orderBy
        },
        params
      );
    },
    fetchData(params) {
      this.loading = true;
      const newParams = this.getQueryParams(params);
      if (!this.remote) {
        return this.getLocalList(newParams);
      }
      return this.fetch(newParams)
        .then(({ list, total }) => {
          this.tableData = list;
          this.tablePage.total = total;
          this.checked = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    fetchField(key) {
      const { ascOrDesc, orderBy } = this;
      const searchKey = cloneDeep(this.searchKey);
      const searchValue = cloneDeep(this.searchValue);

      // 合并
      const index = searchKey.findIndex(item => item === key);
      if (index !== -1) {
        searchKey.splice(index, 1);
        searchValue.splice(index, 1);
      }

      // 约定放在第一位
      searchKey.unshift(key);
      searchValue.unshift([]);

      const newParams = { ascOrDesc, orderBy, searchKey, searchValue };

      if (!this.remote) {
        return this.getLocalFilterList(newParams);
      }

      return this.fetchColumn(newParams);
    },
    handleSortChange({ column, property, order }) {
      this.ascOrDesc = order;
      this.orderBy = order ? property : "";
      return this.fetchData();
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.fetchData();
    },
    handleFilter(key, value) {
      let index = this.searchKey.findIndex(item => item === key);
      if (index === -1) {
        index = this.searchKey.push(key) - 1;
      }
      this.searchValue[index] = value;

      this.tablePage.currentPage = 1; // 初始化分页
      this.fetchData();
    },
    getFilterValue(key) {
      const index = this.searchKey.findIndex(item => item === key);
      if (index === -1) {
        return [];
      }
      return this.searchValue[index];
    },
    selectAllEvent({ checked, records }) {
      this.checked = records;
    },
    selectChangeEvent({ checked, records }) {
      this.checked = records;
    },
    getLocalList(newParams) {
      // 筛选
      this.filterLocalTableData(newParams);

      // 排序
      this.localTableSort(newParams);

      // 分页
      this.tableData = this.getPaginationData(newParams);

      this.tablePage.total = this.localFilterAllList.length;
      this.checked = [];
      this.loading = false;
    },
    filterLocalTableData({ searchKey = [], searchValue = [] }) {
      let filterList = cloneDeep(this.tableList);

      searchKey.forEach((key, index) => {
        filterList = this.handleFilterList(filterList, item => {
          return searchValue[index].length ? searchValue[index].includes(item[key]) : true;
        });
      });
      return (this.localFilterAllList = filterList);
    },
    handleFilterList(list, fn) {
      return list.filter(item => fn(item));
    },
    getPaginationData({ pageStart = 1, pageSize }) {
      const start = (pageStart - 1) * pageSize;
      const cloneList = cloneDeep(this.localFilterAllList);
      return cloneList.splice(start, pageSize);
    },
    getLocalFilterList({ searchKey = [], searchValue = [] }) {
      const field = searchKey.shift();
      searchValue.shift();

      return new Promise(resolve => {
        const list = [];
        this.filterLocalTableData({ searchKey, searchValue }).forEach(item => {
          if (validateValue(item[field]) && !list.includes(item[field])) {
            list.push(item[field]);
          }
        });
        resolve(list);
      });
    },
    localTableSort({ orderBy, ascOrDesc }) {
      // ascOrDesc为null时
      if (!ascOrDesc) {
        return;
      }
      this.localFilterAllList.sort((prev, next) => {
        const prevCode = geCharCode(prev[orderBy]);
        const nextCode = geCharCode(next[orderBy]);
        if (ascOrDesc === "desc") {
          return nextCode - prevCode;
        } else {
          return prevCode - nextCode;
        }
      });
    },
    getLocalFilterData() {
      return this.localFilterAllList;
    },
    clearFilter(field) {
      if (field) {
        this.searchKey.forEach((key, index) => {
          if (key === field) {
            this.searchKey.splice(index, 1);
            this.searchValue.splice(index, 1);
            this.getFilterValue(key);

            return this.fetchData();
          }
        });
      } else {
        this.searchKey = [];
        this.searchValue = [];
        this.fetchData();
      }
    },
    defaultFormatter({ cellValue }) {
      if (!validateValue(cellValue)) {
        return "--";
      }
      return cellValue;
    }
  }
};
</script>

<style lang="less">
.hs-remote-table {
  .vxe-table {
    .vxe-header--row {
      .vxe-cell {
        display: flex;
        align-items: center;
        .vxe-cell--sort {
          display: flex;
          flex-direction: column;
          font-size: 10px;

          .el-icon-caret-top {
            margin-bottom: -3px;
          }

          .el-icon-caret-bottom {
            margin-top: -3px;
          }
        }
      }

      .vxe-cell--title {
        display: inline-block;
      }
    }
  }
}
</style>
