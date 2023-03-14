/*
 * result插件-默认配置
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {

	/*
	 * result需要覆盖的 DOM 节点
	 */
	target:{
 		//type:Object,
 		default:document.body
 	},
	/*
	 * 结果信息
	 */
	msg:{
		type:String,
		default:''
	},
	/*
	 * 是否mini展示方式
	 */
	mini:{
		type:Boolean,
		default:true
	},
	/*
	 * 图片地址
	 */
	imageurl:{
		type:String,
		default:''
	},
	/*
	 * 是否展示图片
	 */
	imageable:{
		type:Boolean,
		default:false
	},
	/*
	 * 是否显示按钮
	 */
	buttonable:{
		type:Boolean,
		default:true
	},
	/*
	 * refresh回调
	 */
	refreshCallBack:{
		type:Function,
  		default:null
	}
}
