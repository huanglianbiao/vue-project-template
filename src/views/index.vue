<template>
  <div ref="main" class="main">
    <div ref="container" style="height: 500px">
      <h3>前端筛选、排序、分页</h3>
      <XTable :remote="false" :multiple="false" :table-list="list" :columns="columns">
        <!-- 第一种写法       -->
        <template v-slot:operate="{ row }"></template>
        <!--第二种写法-->
        <div slot="operate" slot-scope="{ row }"></div>
      </XTable>
    </div>

    <div ref="container2" style="height: 500px">
      <h3>后端筛选、排序、分页</h3>
      <XTable
        :remote="true"
        :multiple="false"
        :fetch="getList"
        :columns="columns"
        :fetch-column="getColumnData"
      ></XTable>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PubSub, { TopicsEnum } from "@utils/PubSub";
import XTable from "@components/XTable";

export default {
  name: "index",
  components: { XTable },
  data() {
    return {
      list: [],
      columns: [
        {
          title: "名称",
          field: "name",
          filterType: "item",
          sortable: true
        },
        {
          title: "年龄",
          field: "age",
          filterType: "item",
          sortable: true
        },
        {
          title: "时间",
          field: "time",
          filterType: "item",
          sortable: true
        },
        {
          title: "操作",
          slotName: "operate"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      homeData: state => state.home.homeData
    })
  },
  mounted() {
    this.test();
    PubSub.$on(TopicsEnum.test, data => {
      console.log("PubSub-test: ", data);
    });

    this.$once("hook:beforeDestroy", () => {
      PubSub.$off(TopicsEnum.test);
    });
  },
  methods: {
    ...mapActions("home", ["getHomeData", "queryList"]),
    test() {
      const obj = { a: 1, b: 2 };
      console.log(obj?.a, 2 ** 3);
      this.getHomeData({
        loadingTarget: this.$refs.container
      }).then(data => {
        this.list = data;
        console.log(data);
        console.log(this.homeData);

        PubSub.$emit(TopicsEnum.test, data);
      });
    },
    getList({ pageStart, pageSize, searchKey, searchValue, ascOrDesc, orderBy }) {
      return this.queryList({
        pageStart,
        pageSize,
        searchKey,
        searchValue,
        ascOrDesc,
        orderBy
      });
    },
    getColumnData({ searchKey, searchValue }) {
      console.log(searchKey, searchValue);
      return new Promise(resolve => {
        resolve([1, 2, 3, 4, 5]);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  padding: 20px;
  height: 100%;
  background-color: #eee;
  overflow: auto;
}
</style>
