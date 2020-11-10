import request from "@utils/request";

const home = {
  namespaced: true,
  state: {
    homeData: []
  },
  mutations: {
    setData(state, payload) {
      state.homeData = payload;
    }
  },
  actions: {
    async getHomeData({ commit }, { loadingTarget }) {
      const { data } = await request({
        config: {
          method: "GET",
          url: "/web/test/get-data"
        },
        success: { message: "获取成功" },
        error: { message: "查询失败" },
        loadingTarget
      });
      commit("setData", data);
      return data;
    },
    async queryList({ commit }, params) {
      const { data } = await request({
        config: {
          method: "POST",
          url: "/web/test/query-list",
          data: params
        },
        success: { message: "获取成功" },
        error: { message: "查询失败" }
      });
      return data;
    }
  }
};

export default home;
