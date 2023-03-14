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
        :item-class="['bsx-form-select',getFormInputVaildClass,getFormInputClass]"
        :editabled="editabled"
        :format="formatVal"
        :gridable="gridable"
        :value="getTitle">
        <template v-slot:value="{value}">
            <slot v-if="$scopedSlots.default" :value="value"></slot>
            <template v-else>{{value}}</template>
        </template>
        <template v-slot:edit>
            <el-select
                slot="edit"
                ref="cell"
                class="flex1"
                :size="size"
                v-model="modelVal"
                :disabled="disabled"
                :clearable="!showValidFlag"
                :multiple="multiple"
                :multiple-limit="multipleLimit"
                @change="handleChangeSelect"
                @visible-change="handleDropSelect"
                popper-class="bsx-form-popper-select"
                :placeholder="placeholder">
                <el-option
                    v-for="(item,i) in list"
                    :key="`${i}-${item.value}`"
                    :label="item.label"
                    :value="item.value">
                </el-option>
                <template v-if="showValidFlag&&getValidatorFlag">
                    <template v-if="getValidatorStatus">
                        <i v-if="!getShowValidatorFlag"
                            slot="prefix"
                            class="el-input__icon el-icon-success bsx-form-valid-icon ok">
                        </i>
                    </template>
                    <i v-else
                        slot="prefix"
                        class="el-input__icon el-icon-warning bsx-form-valid-icon fail">
                    </i>
                </template>
            </el-select>
            <form-error v-if="showErrorMessageFlag" :message="getErrorMessage" :size="size"></form-error>
        </template>
    </form-box>
</template>

<script>
import config from '@/components/bsx/src/bsx-grid/config';
import formBox from '../common/box';
import formError from '../common/error';
import mixinCommon from '../mixins/common';
import {
    isFunction,
    isArray
} from '@/utils/tool';

export default {
    data(){
        return {
            list:[],
            source:{}
        };
    },
    props:{
        /*
         * 值对应标题
         */
        title:config.title,
        /*
    	 * 是否多选
    	 */
        multiple:config.multiple,
        /*
    	 * 多选连接符
    	 */
        multipleSeparate:config.multipleSeparate,
        /*
    	 * 多选最大个数
    	 */
        multipleLimit:config.multipleLimit,
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
        mixinCommon('select')
    ],
    computed:{
        getFormInputClass(){
            return {
                'dis-multiple-tags':this.gridable
            };
        },
        getTitle(){
            return this.getArrayVal(this.modelTitle).join(this.multipleSeparate);
        }
    },
    watch:{
        modelVal(val){
            this.setModeTitle();
            this.setMultipleTitle();
        },
        editabled:{
            handler(flag){
                if(flag){
                    this.$nextTick(this.setMultipleTitle);
                };
            },
            immediate:true
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
                value:this.getArrayVal(this.modelVal),
                title:this.getArrayVal(this.modelTitle)
            };
        },
        /*
    	 * 设置标题
    	 */
        setModeTitle(){
            let value=this.getArrayVal(this.modelVal);
            if(value.length){
                if(Object.keys(this.source).length){
                    this.modelTitle=value.map(item=>{
                        return this.formatVal(this.source[item]);
                    });
                };
            }else{
                this.modelTitle=[];
            };
            if(!this._loaded&&!this.list.length){
                let title=this.getArrayVal(this.modelTitle),o={};
                title.map((item,i)=>{
                    o[value[i]]=item;
                });
                this.list=this.formatSourceList(o);
            };
        },
        /*
    	 * 选择值回调
    	 */
        async handleChangeSelect(val){
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
    	 * 下拉出现回调
    	 */
        handleDropSelect(flag){
            if(flag){
                this.getSource();
                this.hideError();
            }else if(this.hasVal&&this.validator.trigger=='blur'&&!this.disabled){
                this.list.length&&this.fetchValid();
            };
        },
        /*
    	 * 设置多选显示标题
    	 */
        setMultipleTitle(){
            if(this.editabled&&this.multiple&&this.gridable){
                if(this.$refs.cell){
                    this.$refs.cell.$children[1].$refs.input.value=this.getTitle;
                };
            };
        },
        /*
    	 * 获取下拉列表内容
    	 */
        getSource(){
            return new Promise((resolve,reject)=>{
                if(this._loaded){
                    resolve();
                }else{
                    if(this.dataSource){
                        this.list=this.formatSourceList(this.source=this.dataSource);
                        this._loaded=true;
                        resolve();
                    }else{
                        this.$http({
                            method:this.axiosType,
                            url:this.axiosUrl,
                            data:isFunction(this.axiosMap)?this.axiosMap('send',this.axiosParam,null):this.axiosParam,
                            noLoading:true
                        }).then(res=>{
                            res=res.data;
                            this.source=isFunction(this.axiosMap)?this.axiosMap('response',res):res;
                            this.list=this.formatSourceList(this.source);
                            this._loaded=true;
                            resolve();
                        }).catch(({msg})=>{
                            this._loaded=true;
                        });
                        // this.$http[this.axiosType]({
                        //     name:this.axiosName,
                        //     data:isFunction(this.axiosMap)?this.axiosMap('send',this.axiosParam,null):this.axiosParam,
                        //     loading:{
                        //         enabled:false
                        //     }
                        // }).then(res=>{
                        //     this.source=isFunction(this.axiosMap)?this.axiosMap('response',res):res;
                        //     this.list=this.formatSourceList(this.source);
                        //     this._loaded=true;
                        //     resolve();
                        // }).catch(({msg})=>{
                        //     this._loaded=true;
                        // });
                    };
                };
            });
        },
        /*
    	 * 格式化下拉数据
    	 */
        formatSourceList(data){
            let res=[];
            Object.keys(data).map(code=>{
    			res.push({
                    label:data[code],
                    value:code
                });
    		});
            return res;
        },
        /*
    	 * 获取数组值
    	 */
        getArrayVal(val){
            return isArray(val)?val:val.length?val.split(this.multipleSeparate):[];
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
