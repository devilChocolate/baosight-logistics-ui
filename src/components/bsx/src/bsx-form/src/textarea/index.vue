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
        :item-class="['bsx-form-textarea',getFormInputVaildClass,getFormInputClass]"
        :editabled="editabled"
        :format="formatVal"
        :gridable="gridable"
        :value="modelVal">
        <template v-slot:value="{value}">
            <slot v-if="$scopedSlots.default" :value="value"></slot>
            <template v-else>{{value}}</template>
        </template>
        <template v-slot:edit>
            <el-input
                class="flex1"
                ref="cell"
                :size="size"
                type="textarea"
                :placeholder="placeholder"
                v-model="modelVal"
                :disabled="disabled"
                :readonly="readonly"
                :autosize="false"
                :rows="rowNum"
                resize="none"
                @blur="handleBlurInput"
                @focus="handleFocusInput"
                @mouseenter.native="handleMouseEnterInput"
                @mouseleave.native="handleMouseLeaveInput"
                :clearable="true">
            </el-input>
            <template v-if="showValidFlag&&getValidatorFlag">
                <div class="user-icon" :class="[size]" :style="{marginTop:`${{mini:0,small:-1,medium:-2}[size]}px`}">
                    <template v-if="getValidatorStatus">
                        <i v-if="!getShowValidatorFlag" class="el-input__icon el-icon-success bsx-form-valid-icon ok"></i>
                    </template>
                    <i v-else class="el-input__icon el-icon-warning bsx-form-valid-icon fail"></i>
                </div>
            </template>
            <div class="user-icon" :class="[size]" :style="{marginTop:`${{mini:0,small:-1,medium:-2}[size]}px`}" v-else-if="showCloseFlag">
                <i class="el-input__icon el-icon-circle-close close"
                    @mousedown.prevent
                    @click.stop="clear">
                </i>
            </div>
            <form-error v-if="showErrorMessageFlag" :message="getErrorMessage" :size="size" :style="{marginTop:`${{mini:0,small:-1,medium:-3}[size]}px`}"></form-error>
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
import {
	addResizeListener,
    removeResizeListener
} from '@/utils/resize';
import {
    getDomStyle
} from '@/utils/dom';

export default {
    data(){
        return {
            rowNum:this.row||1
        };
    },
    props:{
        /*
    	 * 是否只读
    	 */
        readonly:config.readonly,
        /*
    	 * 行数
    	 */
        row:config.row
    },
    mixins:[
        mixinCommon('textarea'),
        mixinInput('textarea')
    ],
    computed:{
        showCloseFlag(){
            return this.hasVal&&this.isEntered&&!this.readonly&&!this.disabled;
        },
        getFormInputClass(){
            return {
                'pad-r':!this.showValidFlag&&this.showCloseFlag
            };
        },
        getTdEl(){
            return this.$parent.$el.parentNode.parentNode.parentNode
        }
    },
    watch:{

    },
    beforeCreate(){

    },
    created(){

    },
    mounted(){
        this.editabled&&this.gridable&&addResizeListener(this.getTdEl,this.getRowsNum);
    },
    methods:{
        /*
    	 * 清除
    	 */
        clear(){
            this.modelVal='';
        },
        /*
    	 * 获取行数
    	 */
        getRowsNum(){
            let style=getDomStyle(this.getTdEl),
                height=parseFloat(style.height),
                row=Math.floor((height-23)/16);
            this.rowNum=Math.min(2,Math.max(row,1));
        }
    },
    components:{
        formBox,
        formError
    },
    beforeDestroy(){
        this.editabled&&this.gridable&&removeResizeListener(this.getTdEl,this.getRowsNum);
    }
}
</script>

<style lang="scss">

</style>
