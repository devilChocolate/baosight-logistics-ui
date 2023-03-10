/*
 * style-默认配置
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {
  /*
   * 是否带边框
   */
  isBorder: {
    type: Boolean,
    default: false,
  },
  /*
   * 是否斑马纹
   */
  stripe: {
    type: Boolean,
    default: true,
  },
  /*
   * 列表高度
   */
  listHeight: {
    type: [Number, String],
    default: "auto",
  },
};
