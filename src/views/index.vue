<template>
  <div ref="main" class="main">
    <a-list :data-source="list" item-layout="horizontal">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        >
          <div slot="title">{{ item.name }}</div>
          <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PubSub, { TopicsEnum } from "@utils/PubSub";

export default {
  name: "index",
  data() {
    return {
      list: []
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
    ...mapActions("home", ["getHomeData"]),
    test() {
      const obj = { a: 1, b: 2 };
      console.log(obj?.a, 2 ** 3);
      this.getHomeData({
        loadingTarget: this.$refs.main
      }).then(data => {
        this.list = data;
        console.log(data);
        console.log(this.homeData);

        PubSub.$emit(TopicsEnum.test, data);
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
}
</style>
