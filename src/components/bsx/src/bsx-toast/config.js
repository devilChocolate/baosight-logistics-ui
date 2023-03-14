/*
 * toast插件-默认配置
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {

	/*
	 * Toast需要覆盖的 DOM 节点
	 */
	target:{
 		type:Object,
 		default:document.body
 	},

	/*
	 * 内容
	 */
	content:String,

	/*
	 * 状态
	 */
	status:{
		type:Boolean,
		default:true
	},

	/*
	 * 延迟自动关闭时间
	 */
	delay:{
		type:Number,
		default:1500
	},

	/*
	 * 关闭回调
	 */
	callBack:Function
}
