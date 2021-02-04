import Vue from "vue";

import XEUtils from "xe-utils";
// import VXETable from "vxe-table";
// import "vxe-table/lib/style.css";
// "vxe-table": "^2.9.26",
// "xe-utils": "^2.8.1"
// Vue.use(VXETable);

import { VXETable, Table, Header, Column, Grid, Pager, Select, Icon } from "vxe-table";
import zhCN from "vxe-table/lib/locale/lang/zh-CN";

// 按需加载的方式默认是不带国际化的，需要自行导入
VXETable.setup({
  i18n: key => XEUtils.get(zhCN, key)
});

// Vue.use(VXETable);
Vue.use(Header);
Vue.use(Column);
Vue.use(Grid);
Vue.use(Pager);
Vue.use(Select);
Vue.use(Icon);

// 再安装核心库
Vue.use(Table);
