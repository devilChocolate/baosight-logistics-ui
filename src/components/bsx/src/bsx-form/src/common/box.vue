<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <div class="bsx-form-box relative flex-row align-stretch align-start-row" :class="{'no-gridable':!gridable}">
        <div class="bsx-form-label flex-row" :class="{'align-end-row':!!labelWidth}" :style="getLabelStyle" v-if="showLabel"><i v-if="showRequiredStar" class="star">*</i>{{label}}：</div>
        <div class="flex1 flex-row relative"
            :style="getTextStyle"
            :class="{'align-center':editabled}"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <template v-if="!editabled">
                <el-tooltip v-if="showOverflowTooltip" effect="dark" placement="top" :disabled="!visible" :open-delay="300">
                    <template v-slot:content>
                        <slot name="value" :value="getVal"></slot>
                    </template>
                    <div class="bsx-form-cell flex1 text-overflow">
                        <slot name="value" :value="getVal"></slot>
                    </div>
                </el-tooltip>
                <div v-else class="bsx-form-cell flex1">
                    <slot name="value" :value="getVal"></slot>
                </div>
            </template>
            <div class="bsx-form-input flex1 flex-row" :class="itemClass" v-else>
                <slot name="edit"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import {
    isFunction
} from '@/utils/tool';

export default {
    name:'bsx-form-box',
    data(){
        return {
            visible:false
        };
    },
    props:{
    	editabled:Boolean,
        value:'',
        itemClass:[String,Array],
        format:Function,
        label:String,
        labelWidth:Number,
        textWidth:[Number,String],
        showOverflowTooltip:Boolean,
        showRequiredStar:Boolean,
        showLabel:Boolean,
        gridable:Boolean
    },
    mixins:[

    ],
    computed:{
        getVal(){
            return isFunction(this.format)?this.format(this.value):this.value;
        },
        getLabelStyle(){
            if(this.labelWidth){
                return {
                    width:`${this.labelWidth}px`
                };
            };
        },
        getTextWidth(){
            return Number(this.textWidth)-11;
        },
        getTextStyle(){
            if(this.showOverflowTooltip&&!this.editabled){
                return {
                    width:`${this.getTextWidth}px`
                };
            };
        }
    },
    watch:{

    },
    created(){

    },
    mounted(){

    },
    methods:{
        handleMouseEnter(event){
            if(this.showOverflowTooltip&&!this.editabled){
                this.clearToolTipTimer();
                this.timer=setTimeout(()=>{
                    const el=event.target;
                    // if(el.__child){
                    //     el.__child.parentNode.removeChild(el.__child);
                    //     delete el.__child;
                    // };
                    // console.log('handleMouseEnter',el.__child)
                    if(!el.__child){
                        el.__child=document.createElement('div');
                        el.__child.innerHTML=el.children[0].innerHTML;
                        el.__child.style.position='absolute';
                        el.__child.style.opacity=0;
                        el.__child.style.zIndex=-99;
                        el.__child.style.whiteSpace='nowrap';
                        el.appendChild(el.__child);
                        const style=el.__child.getBoundingClientRect();
                        this.visible=style.width>this.getTextWidth;
                    };
                },300);
            };
        },
        handleMouseLeave(event){
            if(this.showOverflowTooltip&&!this.editabled){
                const el=event.target;
                // console.log('handleMouseLeave',el.__child)
                if(el.__child){
                    el.__child.parentNode.removeChild(el.__child);
                    delete el.__child;
                };
                this.visible=false;
                this.clearToolTipTimer();
            };
        },
        clearToolTipTimer(){
            this.timer&&clearTimeout(this.timer);
        }
    },
    components:{

    },
    beforeDestroy(){
        this.clearToolTipTimer();
    }
}
</script>

<style lang="scss">

</style>
