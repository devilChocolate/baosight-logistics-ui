// 导入自己需要的组件
import {
    Popover,
    Checkbox,
    Pagination
  } from "element-ui";
  const element = {
    install: function (Vue) {
      Vue.use(Popover),
      Vue.use(Checkbox),
      Vue.use(Pagination)
    },
  };
  export default element;
  