/*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */
import config from '../../config';

export default {
    name:'bsx-grid-column',
    data(){
        return {

        };
    },
    props:{
        /*
         * 类型
         */
        type:{
            type:String,
            default:'input',
            validator(value){
                return [
                    'custom',
                    'radio',
                    'checkbox',
                    'input',
                    'password',
                    'textarea',
                    'select',
                    'calendar',
                    'cascader',
                    'auto-complete',
                    'upload'
                ].indexOf(value)!==-1;
            }
        },
        /*
         * 宽度
         */
        width:{
            type:[Number,String],
            default:100
        },
        /*
         * 宽度
         */
        minWidth:{
            type:[Number,String],
            default:60
        },
        /*
         * 字段名
         */
        prop:String,
        /*
         * 字段名-对应code名
         */
        propCode:String,
        /*
         * 字段名-对应title名
         */
        propTitle:String,
        /*
         * 对齐方式
         */
        align:{
            type:String,
            default:'left',
            validator(value){
                return ['left','center','right'].indexOf(value)!==-1;
            }
        },
        /*
         * 锁住列
         */
        locked:{
            type:String,
            default:'center',
            validator(value){
                return ['left','center','right'].indexOf(value)!==-1;
            }
        },
        /*
         * 当内容过长被隐藏时显示 tooltip
         */
        showOverflowTooltip:{
            type:Boolean,
            default:false
        },
        /*
    	 * 工具功能是否开启
    	 */
    	toolEnabled:{
    		type:Boolean,
    		default:true
    	},
        /*
         * 是否显示
         */
        visible:{
            type:Boolean,
            default:true
        },
        /*
         * 是否支持导出  不支持类型upload
         */
        exportable:{
            type:Boolean,
            default:true
        },
        /*
         * 是否支持排序
         */
        sortable:{
            type:Boolean,
            default:false
        },
        /*
         * 是否支持汇总
         */
        sumable:{
            type:Boolean,
            default:false
        },
        /*
         * 是否支持选中汇总
         */
        checkSumable:{
            type:Boolean,
            default:false
        },
        /*
         * 是否高亮
         */
        highlightable:{
            type:Boolean,
            default:false
        },
        /*
    	 * cascader 级联数据合并依赖-当原始值不存在时执行
         * Function时,@return 真实值
         * String时 以,隔开 例如 'provice,city,area'
    	 */
    	depend:[String,Array,Function],
        /*
    	 * cascader 级联数据合并依赖-当原始值不存在时执行
         * Function时,@return 真实值
         * String时 以,隔开 例如 'proviceName,cityName,areaName'
    	 */
    	dependTitle:[String,Array],
        /*
    	 * cascader 级联数据解除依赖合并-当@depend为Function存在时执行,与@depend对应
         * @return 真实值
    	 */
        dependCompile:Function,
        /*
    	 * config
    	 */
        ...config
    },
    created(){

    },
    mounted(){

    },
    methods:{
        /*
    	 * 单元格值改变
    	 */
        handleCellChange(index,value,col,row){
            this.$emit('value-change',{
                index:index,
                value:value,
                col:col,
                row:row
            });
        },
        /*
    	 * 自定义图标单击
    	 */
        handleCellInputIconClick(index,value,col,row){
            this.$emit('slot-icon-click',{
                index:index,
                value:value,
                col:col,
                row:row
            });
        },
        /*
    	 * 获取列作用域slot
    	 */
        getColumnVNode(data){
            if(this.$scopedSlots.default){
                return this.$scopedSlots.default(data);
            };
        },
        /*
    	 * 获取列作用域slot-头部
    	 */
        getColumnHeaderVNode(data){
            if(this.$scopedSlots.header){
                return this.$scopedSlots.header(data);
            };
        }
    },
    render(h){

    }
};
