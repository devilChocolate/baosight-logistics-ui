/*
 * tool-默认配置
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {
	/*
	 * 选中方式 单选/复选
	 */
	checkType:{
		type:String,
		validator(value){
			return [
				'radio',
				'checkbox'
			].indexOf(value)!==-1;
		}
	},
	/*
	 * 当checkType为checkbox时才生效
	 */
	isCheckAll:{
		type:Boolean,
		default:false
	},
	/*
	 * 是否禁用状态
	 */
	isDisabled:{
		type:Boolean,
		default:false
	},
	/*
	 * 翻页记录选中filter,返回唯一id(当checkType为checkbox时才生效)
	 */
	historyCheckFilterId:[String,Function],
	/*
	 * 行数据处理 ->主要处理 disabled checked 状态
	 */
	customRowData:Function,
	/*
	 * 是否支持列排序
	 */
	orderable:{
		type:Boolean,
		default:false
	},
	/*
	 * 行排序请求-是否开启
	 */
	sortAxiosEnabled:{
		type:Boolean,
		default:false
	},
	/*
	 * 本地缓存对应唯一id
	 */
	gridId:String
}
