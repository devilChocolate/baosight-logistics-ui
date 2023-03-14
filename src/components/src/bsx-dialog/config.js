/*
 * 自定义弹出框插件-默认配置
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {

	/*
	 * Dialog需要覆盖的 DOM 节点
	 */
	target:Object,

	/*
	 * 宽度
	 */
	width:{
 		type:Number,
 		default:800
 	},

	/*
	 * 是否有关闭按钮
	 */
	closeable:{
 		type:Boolean,
 		default:true
 	},

	/*
	 * 标题
	 */
	title:String,

	/*
	 * 标题是否具备拖拽功能
	 */
	dragable:{
		type:Boolean,
 		default:true
	},

	/*
	 * 内容组件
	 */
	component:[Object,Function],

	/*
	 * 组件对应数据
	 */
	data:Object,

	/*
	 * 插槽-title
	 */
	slotTitle:String,

	/*
	 * 关闭回调
	 */
	closeCallback:Function,

	/*
	 * 初始化OK回调
	 */
	callback:Function,

	/*
	 * 内部存在滚动条-滚动回调
	 */
	scrollBack:Function,

	/*
	 * 拖拽开启-拖拽回调
	 */
	dragBack:Function,

	/*
	 * 按钮列表 ->{text:'',class:'',plain:false,callback(){}}
	 */
	button:{
		type:Array,
		default(){
			return [];
		}
	}
}
