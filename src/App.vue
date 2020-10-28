<template>
  <div id="app">
    <div class="main">
      hello vue.
      <div class="footer">
        footer
        <a-icon type="qq"></a-icon>
      </div>
    </div>
  </div>
</template>

<script>
import request from "./utils/request";
export default {
  name: "App",
  mounted() {
    this.test();
  },
  methods: {
    test() {
      const obj = { a: 1, b: 2 };
      console.log(obj?.a, 2 ** 3);
      request({
        config: {
          method: "GET",
          url: "/web/test/get-data"
        },
        error: { message: "查询失败" }
      }).then(({ data }) => console.log(data));
    }
  }
};
</script>

<style lang="less" scoped>
#app {
  .main {
    font-weight: bold;
    color: blueviolet;
  }
}
</style>
