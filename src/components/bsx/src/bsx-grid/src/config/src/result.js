/*
 * result-默认配置
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {
	/*
	 * 数据结果展示
	 */
	dataResult:{
		type:Object,
		default(){
			return {
				imageable:true,
				buttonable:true
			};
		}
	}
}
