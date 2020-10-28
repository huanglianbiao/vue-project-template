<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
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
