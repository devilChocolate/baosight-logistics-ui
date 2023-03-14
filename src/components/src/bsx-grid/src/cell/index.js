/*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */
import bsxFormItem from '@/components/bsx/src/bsx-form/src';
import {
    isFunction,
    extend,
    isBoolean,
    isArray
} from '@/utils/tool';

export default {
    data(){
        return {
            vNode:null
        };
    },
    props:{
        /*
         * 行数据
         */
        row:Object,
        /*
         * 列数据
         */
        col:Object,
        /*
         * 第几行
         */
        index:Number,
        /*
         * 值
         */
        value:{
            default(){
                return '';
            }
        },
        /*
         * 是否编辑
         */
        editabled:Boolean,
        /*
         * 是否新增行
         */
        isAdd:Boolean,
        /*
         * 新增-总条数长度
         */
        addRowsNum:Number,
        /*
         * 正常列表-总条数长度
         */
        listRowsNum:Number
    },
    mixins:[

    ],
    computed:{

    },
    watch:{
        value(val){
            this.vNode=this.getVNode();
        },
        editabled(val){
            this.vNode=this.getVNode();
        },
        row:{
            handler(val){
                this.vNode=this.getVNode();
            },
            deep:true,
            immediate:true
        }
    },
    created(){

    },
    mounted(){

    },
    methods:{
        /*
    	 * 单元格值改变
    	 */
        handleCellChange(val){
            this.col.instance&&this.col.instance.handleCellChange(this.index,val,this.col,this.row);
        },
        /*
    	 * 自定义图标单击
    	 */
        handleCellInputIconClick(val){
            this.col.instance&&this.col.instance.handleCellInputIconClick(this.index,val,this.col,this.row);
        },
        /*
    	 * 获取插槽内容
    	 */
        getVNode(){
            if(this.col.instance){
                return this.col.instance.getColumnVNode({
                    index:this.index,
                    code:this.row[this.col.propCode],
                    value:this.value,
                    col:this.col,
                    row:this.row
                });
            };
        }
    },
    components:{

    },
    render(h){
        let component;
        if(this.col.type!='custom'){
            component=h(bsxFormItem,{
                props:{
                    size:'small',
                    type:this.col.type,
                    label:this.col.label,
                    textWidth:this.col.width,
                    showOverflowTooltip:this.col.showOverflowTooltip,
                    showLabel:false,
                    placeholder:this.col.placeholder,
                    value:isArray(this.value)||isBoolean(this.value)?this.value:`${this.value}`,
                    code:this.row[this.col.propCode],
                    title:this.row[this.col.propTitle],
                    disabled:this.col.disabled||this.row.disabled,
                    readonly:this.col.readonly,
                    editabled:this.editabled,
                    format:isFunction(this.col.format)?val=>this.col.format(this.index,val,this.col,this.row):this.col.format,
                    slotIcon:this.col.slotIcon,
                    gridable:true,
                    validator:{
                        trigger:'blur',
                        ...this.col.validator
                    },
                    multiple:this.col.multiple,
                    multipleSeparate:this.col.multipleSeparate,
                    multipleLimit:this.col.multipleLimit,
                    dataSource:this.col.dataSource,
                    axiosUrl:this.col.axiosUrl,
                    axiosType:this.col.axiosType,
                    axiosParam:extend({},this.row,this.col.axiosParam),
                    axiosMap:isFunction(this.col.axiosMap)?(function(that){
                        return function(){
                            return that.col.axiosMap.apply(null,([].slice.call(arguments,0)).concat(that.col,that.index));
                        };
                    })(this):this.col.axiosMap,
                    calendarType:this.col.calendarType,
                    pickerFilter:this.col.pickerFilter,
                    triggerOnFocus:this.col.triggerOnFocus,
                    showAllLevels:this.col.showAllLevels,
                    uploadFileKey:this.col.uploadFileKey,
                    uploadFileMaxSize:this.col.uploadFileMaxSize,
                    uploadFileAccept:this.col.uploadFileAccept
                },
                scopedSlots:this.vNode?{
                    default:props=>this.vNode
                }:null
            });
        }else{
            component=this.vNode;
        };
        return h('div',{
            class:{
                'app_grid-cell':true,
                'no-custom':!this.editabled&&this.col.type!='custom'
            },
            style:{
                zIndex:(this.isAdd?this.addRowsNum:0)+this.listRowsNum-this.index+3
            },
            on:{
                click:()=>{
                    // const flag=(this.checkType&&this.col.prop==this.checkType)||this.col.unProp||(this.col.type=='custom'||this.col.type=='upload');
                    // if(!this.editabled&&!flag){
                    //     this.$copyText(this.$el.innerText);
                    // };
                }
            }
        },[
            component
        ]);
    },
    beforeDestroy(){

    }
};
