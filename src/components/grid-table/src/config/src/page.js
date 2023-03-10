/*
 * page-默认配置
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {
  /*
   * 是否展示分页
   */
  pageEnabled: {
    type: Boolean,
    default: true,
  },
  /*
   * 单页条数
   */
  pageLimit: {
    type: Number,
    default: 10,
  },
  /*
   * 分页展示条数
   */
  pageSizes: {
    type: Array,
    default() {
      return [5, 10, 20, 30, 50, 100, 200, 500, 1000];
    },
  },
  /*
   * 分页翻页截取
   */
  pageIntercept: Function,
};
