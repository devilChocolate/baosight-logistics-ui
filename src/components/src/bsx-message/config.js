/*
 * 提示框插件-默认配置
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {

	/*
	 * Message需要覆盖的 DOM 节点
	 */
	target:Object,

	/*
	 * 标题
	 */
	title:{
		type:String,
		default:'系统提示'
	},

	/*
	 * 宽度
	 */
	width:Number,

	/*
	 * 内容
	 */
	content:String,

	/*
	 * 是否关闭按钮-点击自动关闭
	 */
	autoClose:{
		type:Boolean,
		default:true
	},

	/*
	 * 是否有关闭按钮
	 */
	closeable:{
 		type:Boolean,
 		default:true
 	},

	/*
	 * 确认钩子
	 */
	sure:Function,

	/*
	 * 关闭钩子
	 */
	close:Function
}
