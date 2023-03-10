/*
 * form-item插件-默认配置
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {
	/*
	 * all 标题
	 */
	label:String,
	/*
	 * 是否显示label
	 */
	showLabel:Boolean,
	/*
	 * 标题宽度
	 */
	labelWidth:Number,
	/*
	 * 文本宽度
	 */
	textWidth:[Number,String],
	/*
	 * 当内容过长被隐藏时显示 tooltip
	 */
	showOverflowTooltip:Boolean,
	/*
	 * 是否显示必填星星
	 */
	showRequiredStar:Boolean,
	/*
	 * checkbox 设置 indeterminate 状态
	 */
	indeterminate:{
		type:Boolean,
		default:false
	},
	/*
	 * all 占位
	 */
	placeholder:String,
	/*
	 * 尺寸
	 */
	size:{
		type:String,
		default:'mini',
		validator(value){
			return 'mini,small,medium'.split(',').indexOf(value)!==-1;
		}
	},
	/*
	 * all 值  upload-Array  radio-Boolean
	 */
	value:'',
	/*
	 * auto-complete 值对应code
	 */
	code:String,
	/*
	 * select/cascader 值对应标题
	 */
	title:String,
	/*
	 * all 值对应字段名
	 */
	prop:String,
	/*
	 * auto-complete 值对应code字段名
	 */
	propCode:String,
	/*
	 * select/cascader 值对应标题字段名
	 */
	propTitle:String,
	/*
	 * textarea 行数
	 */
	row:Number,
	/*
	 * all 是否禁用
	 */
	disabled:{
		type:Boolean,
		default:false
	},
	/*
	 * all 是否只读
	 */
	readonly:{
		type:Boolean,
		default:false
	},
	/*
	 * all 是否编辑状态
	 */
	editabled:{
		type:Boolean,
		default:false
	},
	/*
	 * all 自定义格式化方法/日历格式
	 */
	format:[Function,String],
	/*
	 * input/auto-complete 自定义后置插槽icon
	 */
	slotIcon:String,
	/*
	 * input/auto-complete 自定义前置插槽icon
	 */
	prefixIcon:String,
	/*
	 * all 格式校验
	 */
	validator:{
		type:Object,
		default(){
			return {};
		}
	},
	/*
	 * select/upload 是否多选
	 */
	multiple:{
		type:Boolean,
		default:false
	},
	/*
	 * select/cascader/calendar 多选连接符
	 */
	multipleSeparate:{
		type:String,
		default:','
	},
	/*
	 * select/upload 多选最大个数
	 */
	multipleLimit:Number,
	/*
	 * select/cascader 原始数据
	 */
	dataSource:[Object,Array],
	/*
	 * select/auto-complete/cascader/upload 请求地址
	 */
	axiosUrl:[String,Object],
	/*
	 * select/auto-complete/cascader/upload 请求type
	 */
	axiosType:{
		type:String,
		default:'get',
		validator(value){
			return 'get,post'.split(',').indexOf(value)!==-1;
		}
	},
	/*
	 * select/auto-complete/cascader/upload 请求参数
	 */
	axiosParam:Object,
	/*
	 * select/auto-complete/cascader/upload 请求参数/结果格式化
	 */
	axiosMap:Function,
	/*
	 * calendar 日历类型
	 */
	calendarType:{
		type:String,
		default:'date',
		validator(value){
			return 'year,month,date,dates,week,datetime,datetimerange,daterange,monthrange'.split(',').indexOf(value)!==-1;
		}
	},
	/*
	 * calendar 日历禁止筛选回调
	 */
	pickerFilter:Function,
	/*
	 * auto-complete 是否在输入框 focus 时显示建议列表
	 */
	triggerOnFocus:{
		type:Boolean,
		default:false
	},
	/*
	 * cascader 输入框中是否显示选中值的完整路径
	 */
	showAllLevels:{
		type:Boolean,
		default:true
	},
	/*
	 * upload 上传的文件字段名
	 */
	uploadFileKey:{
		type:String,
		default:'file'
	},
	/*
	 * upload 上传的单个文件最大大小
	 */
	uploadFileMaxSize:{
		type:String,
		default:'3MB'
	},
	/*
	 * upload 上传文件接受类型   array-['image','pdf','excel','word']
	 */
	uploadFileAccept:{
		type:[Array,String],
		default:'all'
	}
}
