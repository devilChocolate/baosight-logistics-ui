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
        :item-class="[getFormInputVaildClass,getFormInputClass]"
        :editabled="editabled"
        :format="formatVal"
        :gridable="gridable"
        :value="modelVal">
        <template v-slot:value="{value}">
            <slot v-if="$scopedSlots.default" :value="value"></slot>
            <template v-else>{{value}}</template>
        </template>
        <template v-slot:edit>
            <el-autocomplete
                v-if="axiosUrl"
                class="flex1"
                :class="{'has-prefix':!!prefixIcon}"
                ref="cell"
                type="text"
                :size="size"
                :placeholder="placeholder"
                v-model="modelVal"
                :disabled="disabled"
                :readonly="readonly"
                :debounce="300"
                :trigger-on-focus="triggerOnFocus"
                value-key="value"
                :hide-loading="true"
                popper-class="bsx-form-popper-suggest"
                :fetch-suggestions="querySearchAsync"
                @select="handleQuerySelect"
                @input="handleQueryChange"
                @blur="handleBlurInput"
                @focus="handleFocusInput"
                @mouseenter.native="handleMouseEnterInput"
                @mouseleave.native="handleMouseLeaveInput"
                :clearable="!showValidFlag">
                <i v-if="prefixIcon"
                    slot="prefix"
                    :class="prefixIcon">
                </i>
                <template v-if="showValidFlag&&getValidatorFlag">
                    <template v-if="getValidatorStatus">
                        <i v-if="!getShowValidatorFlag"
                            slot="suffix"
                            class="el-input__icon el-icon-success bsx-form-valid-icon ok">
                        </i>
                    </template>
                    <i v-else
                        slot="suffix"
                        class="el-input__icon el-icon-warning bsx-form-valid-icon fail">
                    </i>
                </template>
                <template v-else>
                    <i v-if="slotIcon"
                        slot="suffix"
                        :class="slotIcon"
                        @mousedown.prevent
                        @click.stop="handleSlotIconClick">
                    </i>
                </template>
            </el-autocomplete>
            <el-input
                v-else
                class="flex1"
                :class="{'has-prefix':!!prefixIcon}"
                ref="cell"
                :size="size"
                :type="type=='password'?type:'text'"
                :placeholder="placeholder"
                v-model="modelVal"
                :disabled="disabled"
                :readonly="readonly"
                @blur="handleBlurInput"
                @focus="handleFocusInput"
                @mouseenter.native="handleMouseEnterInput"
                @mouseleave.native="handleMouseLeaveInput"
                :clearable="!showValidFlag">
                <i v-if="prefixIcon"
                    slot="prefix"
                    :class="prefixIcon">
                </i>
                <template v-if="showValidFlag&&getValidatorFlag">
                    <template v-if="getValidatorStatus">
                        <i v-if="!getShowValidatorFlag"
                            slot="suffix"
                            class="el-input__icon el-icon-success bsx-form-valid-icon ok">
                        </i>
                    </template>
                    <i v-else
                        slot="suffix"
                        class="el-input__icon el-icon-warning bsx-form-valid-icon fail">
                    </i>
                </template>
                <template v-else>
                    <i v-if="slotIcon"
                        slot="suffix"
                        :class="slotIcon"
                        @mousedown.prevent
                        @click.stop="handleSlotIconClick">
                    </i>
                </template>
            </el-input>
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
import {
    extend,
    isFunction
} from '@/utils/tool';

export default {
    data(){
        return {

        };
    },
    props:{
        /*
         * 值对应code
         */
        code:config.code,
        /*
    	 * 是否只读
    	 */
        readonly:config.readonly,
        /*
    	 * 自定义后置插槽icon
    	 */
        slotIcon:config.slotIcon,
        /*
    	 * 自定义前置插槽icon
    	 */
        prefixIcon:config.prefixIcon,
        /*
    	 * 是否在输入框 focus 时显示建议列表
    	 */
        triggerOnFocus:config.triggerOnFocus,
        /*
    	 * 请求地址
    	 */
    	axiosUrl:config.axiosUrl,
    	/*
    	 * 请求type
    	 */
    	axiosType:config.axiosType,
    	/*
    	 * 请求参数
    	 */
    	axiosParam:config.axiosParam,
    	/*
    	 * 请求结果格式化
    	 */
    	axiosMap:config.axiosMap
    },
    mixins:[
        mixinCommon('input'),
        mixinInput('input')
    ],
    computed:{
        getFormInputClass(){
            return {
                'pad-r':!this.showValidFlag&&this.slotIcon&&this.isEntered&&!this.readonly&&!this.disabled
            };
        }
    },
    watch:{

    },
    beforeCreate(){

    },
    created(){

    },
    mounted(){

    },
    methods:{
        /*
    	 * 值改变回调
    	 */
        handleQueryChange(val){
            this.modelCode='';
        },
        /*
    	 * 选择值回调
    	 */
        async handleQuerySelect(item){
            this.modelCode=item.code;
            this.modelVal=item.value;
            if(!this.disabled&&!this.readonly){
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
            let val={
                value:this.modelCode,
                title:this.modelVal
            };
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
    	 * 模糊查询钩子
    	 */
        querySearchAsync(queryString,cb){
            if(!this.disabled&&!this.readonly){
                if(this.__suggest&&this.__suggest.name==queryString){
                    cb(this.__suggest.list);
                }else{
                    this.$http({
                        method:this.axiosType,
                        url:this.axiosUrl,
                        data:isFunction(this.axiosMap)?this.axiosMap('send',extend(this.axiosParam,{
                            queryKey:queryString
                        }),null):this.axiosParam,
                        noLoading:true
                    }).then(res=>{
                        res=res.data;
                        if(isFunction(this.axiosMap)){
                            res=this.axiosMap('response',res);
                        };
                        this.__suggest={
                            name:queryString,
                            list:res
                        };
                        cb(res);
                    }).catch(({msg})=>{
                        cb([]);
                    });
                    // this.$http[this.axiosType]({
                    //     name:this.axiosName,
                    //     data:isFunction(this.axiosMap)?this.axiosMap('send',extend(this.axiosParam,{
                    //         queryKey:queryString
                    //     }),null):this.axiosParam,
                    //     loading:{
                    //         enabled:false
                    //     }
                    // }).then(res=>{
                    //     if(isFunction(this.axiosMap)){
                    //         res=this.axiosMap('response',res);
                    //     };
                    //     this.__suggest={
                    //         name:queryString,
                    //         list:res
                    //     };
                    //     cb(res);
                    // }).catch(({msg})=>{
                    //     cb([]);
                    // });
                };
            }else{
                cb([]);
            };
        },
        /*
    	 * 隐藏弹出组件
    	 */
        hidePopper(){
            this.$refs.cell.close&&this.$refs.cell.close();
        }
    },
    components:{
        formBox,
        formError
    },
    beforeDestroy(){
        this.__suggest&&delete this.__suggest;
    }
}
</script>

<style lang="scss">

</style>
