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
        :item-class="['bsx-form-cascader',getFormInputVaildClass]"
        :editabled="editabled"
        :format="formatVal"
        :gridable="gridable"
        :value="getTitle">
        <template v-slot:value="{value}">
            <slot v-if="$scopedSlots.default" :value="value"></slot>
            <template v-else>{{value}}</template>
        </template>
        <template v-slot:edit>
            <el-cascader
                v-if="visible"
                class="flex1"
                ref="cell"
                :size="size"
                :placeholder="placeholder"
                :disabled="disabled"
                :clearable="!showValidFlag"
                :show-all-levels="showAllLevels"
                :separator="multipleSeparate"
                :debounce="300"
                popper-class="bsx-form-popper-cascader"
                v-model="modelVal"
                :options="dataSource"
                :props="getCascaderProps"
                @blur="handleBlurInput"
                @focus="handleFocusInput"
                @mouseenter.native="handleMouseEnterInput"
                @mouseleave.native="handleMouseLeaveInput"
                @change="handleChangeSelect"
                @visible-change="handleDropSelect">
            </el-cascader>
            <template v-if="showValidFlag&&getValidatorFlag">
                <div class="user-icon" :class="[size]">
                    <template v-if="getValidatorStatus">
                        <i v-if="!getShowValidatorFlag" class="el-input__icon el-icon-success bsx-form-valid-icon ok"></i>
                    </template>
                    <i v-else class="el-input__icon el-icon-warning bsx-form-valid-icon fail"></i>
                </div>
            </template>
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
    isFunction,
    isPlainObject
} from '@/utils/tool';

export default {
    data(){
        return {
            visible:true
        };
    },
    props:{
        /*
         * 值对应标题
         */
        title:config.title,
        /*
    	 * 输入框中是否显示选中值的完整路径
    	 */
        showAllLevels:config.showAllLevels,
        /*
    	 * 多选连接符
    	 */
        multipleSeparate:config.multipleSeparate,
        /*
    	 * 原始数据
    	 */
    	dataSource:config.dataSource,
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
        mixinCommon('cascader'),
        mixinInput('cascader')
    ],
    computed:{
        getCascaderProps(){
            return {
                expandTrigger:'click',
                multiple:false,
                checkStrictly:false,
                lazy:!!!this.dataSource,
                lazyLoad:this.getAsycInfo
            };
        },
        getTitle(){
            return this.showAllLevels?this.modelTitle.map(title=>{
                return this.formatText(title);
            }).join(this.multipleSeparate):this.modelTitle[this.modelTitle.length-1]||'';
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
         * 获取值
         */
        getValue(){
            return {
                value:this.modelVal,
                title:this.modelTitle
            };
        },
        /*
    	 * 设置标题
    	 */
        setTitle(){
            let cascader=this.$refs.cell;
            if(cascader){
                let node=cascader.getCheckedNodes()[0];
                this.modelTitle=(node&&node.pathLabels)||[];
            };
        },
        /*
    	 * 获取数据
    	 */
        getAsycInfo(node,resolve){
            this.$http({
                method:this.axiosType,
                url:isPlainObject(this.axiosUrl)?this.axiosUrl[node.level]:this.axiosUrl,
                data:isFunction(this.axiosMap)?this.axiosMap('send',{
                    node:node,
                    ...this.axiosParam
                },node.level):this.axiosParam,
                noLoading:true
            }).then(res=>{
                res=res.data;
                if(isFunction(this.axiosMap)){
                    res=this.axiosMap('response',res,node.level);
                };
                resolve(res);
            }).catch(({msg})=>{
                resolve([]);
            });
        },
        /*
    	 * 选择值回调
    	 */
        async handleChangeSelect(val){
            if(!this.disabled){
                this.setTitle();
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
    	 * 下拉出现/消失回调
    	 */
        handleDropSelect(flag){
            if(flag){
                this.hideError();
            }else if(this.hasVal&&this.validator.trigger=='blur'&&!this.disabled){
                this.modelVal.length&&this.fetchValid();
            };
        },
        /*
         * 失去焦点
         */
        handleBlurInput(){
            this.isFocused=false;
            this.isEntered=false;
            this.hideError();
            if(this.disabled||this.readonly){
                return;
            };
        },
        /*
    	 * 重置弹出组件
    	 */
        resetPopper(){
            if(this.$refs.cell){
                this.visible=false;
                this.$nextTick(()=>{
                    this.visible=true;
                });
            };
        },
        /*
    	 * 隐藏弹出组件
    	 */
        hidePopper(){
            this.$refs.cell&&this.$refs.cell.toggleDropDownVisible(false);
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
