/*
 * axios-默认配置
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {
	/*
	 * 默认自动发送请求
	 */
	axiosAuto:{
		type:Boolean,
		default:true
	},
	/*
	 * 请求地址
	 */
	axiosUrl:[String,Object],
	/*
	 * 请求type
	 */
	axiosType:{
		type:String,
		default:'post',
		validator(value){
			return [
				'get',
				'post'
			].indexOf(value)!==-1;
		}
	},
	/*
	 * 请求参数
	 */
	axiosParam:Object,
	/*
	 * 请求回调钩子
	 */
	axiosMap:Function,
	/*
	 * 空数据字符
	 */
	emptyMessage:{
		type:String,
		default:'没有查询到数据！'
	}
}
