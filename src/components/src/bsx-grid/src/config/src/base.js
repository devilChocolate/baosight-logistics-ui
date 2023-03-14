/*
 * init-默认配置
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {
	/*
	 * 当checkType存在时,是否单击行自动选中该行
	 */
	checkRowTriggerClick:{
		type:Boolean,
		default:false
	},
	/*
	 * 是否显示头部
	 */
	showHeader:{
		type:Boolean,
		default:true
	},
	/*
	 * 是否显示序号
	 */
	showIndex:{
		type:Boolean,
		default:false
	},
	/*
	 * 是否是子grid
	 */
	isChildGrid:{
		type:Boolean,
		default:false
	},
	/*
	 * 导出excel文件名
	 */
	exportExcelFileName:String,
	/*
	 * 原始数据
	 */
	dataSource:Array,
	/*
	 * 折叠子表钩子
	 */
	expandChange:Function
}
