<template>
  <div id="app">
    <div class="main">
      hello vue.
      <div class="footer">footer</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    this.test();
  },
  methods: {
    test() {
              const obj = { a: 1, b: 2 };
      console.log(obj?.a);
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
