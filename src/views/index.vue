<template>
  <div class="main">
    hello vue.
    <div class="footer">
      footer
      <a-icon type="qq"></a-icon>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PubSub, { TopicsEnum } from "@utils/PubSub";

export default {
  name: "index",
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
      this.getHomeData().then(({ data }) => {
        console.log(data);
        console.log(this.homeData);

        PubSub.$emit(TopicsEnum.test, data);
      });
    }
  }
};
</script>

<style scoped></style>
