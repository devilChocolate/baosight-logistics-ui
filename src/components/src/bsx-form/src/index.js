/*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */
import config from '@/components/bsx/src/bsx-grid/config';
import radio from './radio';
import checkbox from './checkbox';
import input from './input';
import textarea from './textarea';
import select from './select';
import calendar from './calendar';
import cascader from './cascader';
import upload from './upload';

export default {
    name:'bsx-form-item',
    data(){
        return {

        };
    },
    props:{
        /*
    	 * 类型
    	 */
    	type:String,
        /*
         * 是否grid模式
         */
        gridable:{
            type:Boolean,
            default:false
        },
        /*
    	 * 默认参数
    	 */
        ...config
    },
    computed:{
        getComponent(){
            return {
                radio:radio,
                checkbox:checkbox,
                input:input,
                password:input,
                textarea:textarea,
                select:select,
                calendar:calendar,
                cascader:cascader,
                'auto-complete':input,
                upload:upload
            }[this.type];
        }
    },
    watch:{

    },
    created(){

    },
    mounted(){

    },
    methods:{

    },
    render(h){
        return h(this.getComponent,{
            props:{
                ...this.$props,
                type:this.type
            },
            ref:'formItem',
            scopedSlots:this.$scopedSlots
        });
    }
};
