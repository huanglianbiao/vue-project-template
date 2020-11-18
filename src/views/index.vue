<template>
  <el-container>
    <el-header>
      <div class="logo">Date Assets</div>
      <el-menu :default-active="$route.name" mode="horizontal" @select="menuSelect">
        <template v-for="item in menuList">
          <el-menu-item :index="item.name" :key="item.name">
            {{ item.title }}
          </el-menu-item>
        </template>
      </el-menu>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      activeIndex: "overview",
      menuList: [
        {
          title: "概览",
          name: "overview"
        },
        {
          title: "数据",
          name: "data"
        },
        {
          title: "与我",
          name: "self"
        }
      ]
    };
  },
  methods: {
    menuSelect(name) {
      this.$router.push({ name });
    }
  }
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;

  .el-header {
    background-color: #fff;
    display: flex;
    flex-direction: revert;
    align-items: center;

    .logo {
      width: 200px;
      font-size: 24px;
      font-weight: bold;
    }
  }
}
</style>
