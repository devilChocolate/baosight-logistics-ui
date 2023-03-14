<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <form-box
        ref="box"
        :label="label"
        :text-width="textWidth"
        :show-overflow-tooltip="showOverflowTooltip"
        :show-label="showLabel"
        :label-width="labelWidth"
        :show-required-star="showRequiredStar"
        :item-class="['bsx-form-calendar',getFormInputVaildClass,getFormInputClass]"
        :editabled="editabled"
        :gridable="gridable"
        :value="getTitle">
        <template v-slot:value="{value}">
            <slot v-if="$scopedSlots.default" :value="value"></slot>
            <template v-else>{{value}}</template>
        </template>
        <template v-slot:edit>
            <el-date-picker
                class="flex1"
                ref="cell"
                :size="size"
                v-model="modelVal"
                :disabled="disabled"
                :clearable="true"
                :editable="false"
                :type="calendarType"
                :format="format"
                :placeholder="getPlaceholder.start"
                :start-placeholder="getPlaceholder.start"
                :end-placeholder="getPlaceholder.end"
                range-separator="至"
                @change="handleChangeDate"
                @mouseenter.native="handleMouseEnterInput"
                @mouseleave.native="handleMouseLeaveInput"
                @blur="handleBlurInput"
                @focus="handleFocusInput"
                :picker-options="pickerOptions"
                :prefix-icon="getPrefixIcon"
                popper-class="bsx-form-popper-calendar">
            </el-date-picker>
            <form-error v-if="showErrorMessageFlag" :message="getErrorMessage" :size="size"></form-error>
        </template>
    </form-box>
</template>

<script>
import config from '@/components/bsx/src/bsx-grid/config';
import formBox from '../common/box';
import formError from '../common/error';
import mixinCommon from '../mixins/common';
import mixinInput from '../mixins/input';
import mixinCalendar from '../mixins/calendar';
import fecha from './date';
import {
    isPlainObject,
    isArray
} from '@/utils/tool';

export default {
    data(){
        return {

        };
    },
    props:{
        /*
    	 * 日历类型
    	 */
        calendarType:config.calendarType,
        /*
    	 * 多选连接符
    	 */
        multipleSeparate:config.multipleSeparate,
        /*
    	 * 日历禁止筛选回调
    	 */
        pickerFilter:config.pickerFilter
    },
    mixins:[
        mixinCommon('calendar'),
        mixinCalendar,
        mixinInput('calendar')
    ],
    computed:{
        getFormInputClass(){
            return {
                'active':!this.showValidFlag&&this.isEntered&&this.hasVal&&!this.disabled
            };
        },
        isRange(){
            return this.calendarType.indexOf('range')!==-1;
        },
        getPlaceholder(){
            if(this.isRange){
                let placeholder=this.placeholder.split(this.multipleSeparate);
                return {
                    start:placeholder[0],
                    end:placeholder[1]
                };
            };
            return {
                start:this.placeholder
            };
        },
        getPrefixIcon(){
            if(this.showValidFlag&&this.getValidatorFlag){
                if(this.getValidatorStatus){
                    if(!this.getShowValidatorFlag){
                        return 'el-icon-success bsx-form-valid-icon ok';
                    };
                }else{
                    return 'el-icon-warning bsx-form-valid-icon fail';
                };
            };
            return 'el-icon-date';
        },
        getTitle(){
            return this.getFormatVal('至','-');
        }
    },
    beforeCreate(){

    },
    created(){

    },
    mounted(){

    },
    methods:{
        /*
         * 获取值
         */
        getValue(){
            return {
                value:this.getFormatVal()
            };
        },
        /*
         * 格式化值
         */
        getFormatVal(separate,placeholder=''){
            if(this.isRange){
                let arr=[
                    isArray(this.modelVal)&&this.modelVal[0]?fecha.format(this.modelVal[0],this.format):placeholder,
                    isArray(this.modelVal)&&this.modelVal[1]?fecha.format(this.modelVal[1],this.format):placeholder
                ];
                if(separate){
                    arr=arr.join(separate);
                };
                return arr;
            };
            return this.modelVal?fecha.format(this.modelVal,this.format):placeholder;
        },
        /*
    	 * 选择值回调
    	 */
        async handleChangeDate(val){
            if(!this.disabled){
                if(this.validator.trigger=='blur'){
                    let flag=await this.fetchValid();
                    this.fetchEmit(flag);
                }else{
                    this.fetchEmit(true);
                };
            };
        },
        /*
    	 * emit指令
    	 */
        fetchEmit(flag){
            let val=this.getValue();
            if(this.gridable){
                if(flag){
                    this.$parent.$parent.handleCellChange(val);
                };
            }else{
                if(flag){
                    this.$parent.$emit('value-change',val);
                };
            };
        },
        /*
         * 移出
         */
        handleMouseLeaveInput(){
            if(this.disabled){
                return;
            };
            this.isEntered=false;
        },
        /*
    	 * 初始化日期
    	 */
        initVal(modelVal){
            if(this.isRange){
                if(modelVal){
                    let val=modelVal.length?modelVal.split(this.multipleSeparate):[];
                    this.modelVal=[
                        this.getDateVal(val[0]),
                        this.getDateVal(val[1])
                    ];
                };
            }else{
                this.modelVal=this.getDateVal(modelVal);
            };
        },
        /*
         * 获取日期对象
         */
        getDateVal(date){
            return date?new Date(date):'';
        },
        /*
    	 * 隐藏弹出组件
    	 */
        hidePopper(){
            this.$refs.cell&&this.$refs.cell.handleClose();
        }
    },
    components:{
        formBox,
        formError
    },
    beforeDestroy(){

    }
}
</script>

<style lang="scss">

</style>
