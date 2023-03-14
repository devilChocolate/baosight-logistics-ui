/*
 * loading插件-默认配置
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {

	/*
	 * loading需要覆盖的 DOM 节点
	 */
	target:{
 		//type:Object,
 		default(){
			return document.body;
		}
 	},

	/*
	 * 尺寸
	 */
	size:{
 		type:Number,
 		default:50
 	},

	/*
	 * 覆盖层背景颜色
	 */
	masterBackground:{
 		type:String,
 		default:'rgba(0,0,0,0)'
 	},

	/*
	 * 盒子背景颜色
	 */
	boxBackground:{
  		type:String,
  		default:'rgba(0,0,0,0.4)'
  	},

	/*
	 * 是否序列帧
	 */
	frameable:{
		type:Boolean,
 		default:false
	},

	/*
	 * 是否独立存在
	 */
	alone:{
		type:Boolean,
 		default:false
	},

	/*
	 * 自动关闭时间
	 */
	time:{
		type:Number,
  		default:null
	}
}
