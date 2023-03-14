<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <transition name="app_dialog" v-on:after-leave="afterLeave">
        <div class="app_dialog-master" v-if="visible" v-show="showable" :style="getMasterStyle">
            <div class="app_dialog-container" :class="{in:isNative&&animated,ease:!cursorDown&&isNative&&animated}" ref="container" :style="getContainerStyle">
                <div class="app_dialog-head flex-row align-center"
                    :class="{'has-drag':dragable&&cursorDown}"
                    v-if="title&&title.length"
                    @mousedown="handleMouseDownHead">
                    <div class="app_dialog-title flex1 flex-row align-stretch" :class="{'has-close':closeable}">
                        <span>{{title}}</span>
                        <div class="flex1" v-if="slotTitle" v-html="slotTitle"></div>
                        <slot v-else name="title"></slot>
                    </div>
                    <div class="app_dialog-close" v-if="closeable" @mousedown.stop @click="close" title="关闭"></div>
                </div>
                <div class="app_dialog-close no-title" v-if="closeable&&!(title&&title.length)" @click="close" title="关闭"></div>
                <div class="app_dialog-body" ref="body">
                    <div class="app_dialog-info" :class="{in:isNative||!!state,hidden:!isNative&&!animated}">
                        <bsx-scrollbar
                            ref="main"
                            class="app_dialog-main"
                            :margin="10"
                            :space="5"
                            @bsx-scrollbar-scroll="handleScroll"
                            @bsx-scrollbar-resize="handleResize"
                            :style="getScrollStyle">
                            <slot name="body"></slot>
                        </bsx-scrollbar>
                        <div class="app_dialog-bottom flex-row align-center" v-if="button&&button.length">
                            <a href="javascript:;" :class="getButtonClass(item)" v-for="(item,i) in button" @click="handleButtonClick(item)">{{item.text}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import config from '../config';
import mixinBase from './mixins/base';
import mixinApi from './mixins/api';
import TWEEN from './mixins/tween';

export default {
    name:'bsx-dialog',
    data() {
        return {
            spaceHeight:30,
            lastWidth:400,
            lastHeight:300,
            maxHeight:null,
            animated:false,
            top:0,
            opacity:0
        }
    },
    props:{
        ...config,
        /*
    	 * 是否native
    	 */
    	isNative:{
    		type:Boolean,
    		default:false
    	}
    },
    computed:{
        /*
    	 * 获取覆盖透明层样式
    	 */
        getMasterStyle(){
            return {
                height:`${this.getWarpStyle.height}px`
            };
        },
        /*
    	 * 获取内容层样式
    	 */
        getContainerStyle(){
            let o={
                top:`${this.top}px`,
                width:`${this.lastWidth}px`,
                marginLeft:`${this.moveX}px`,
                marginTop:`${this.moveY}px`
            };
            if(!this.isNative||(this.isNative&&!this.animated)){
                o.opacity=this.opacity;
            };
            if(!this.isNative&&!this.animated){
                o.height=`${this.lastHeight}px`;
            };
            return o;
        },
        /*
    	 * 获取滚动盒子样式
    	 */
        getScrollStyle(){
            let o={};
            if(this.maxHeight){
                o.maxHeight=`${this.maxHeight}px`;
            };
            if(!this.animated){
                o.width=`${Math.min(this.width,this.getWarpStyle.width*0.8)}px`;
                o.height=`${this.lastHeight-this.getConstHeight}px`;
            };
            return o;
        },
        /*
    	 * 获取滚动ref
    	 */
        scrollbar(){
            return this.$refs.main;
        },
        /*
    	 * 获取滚动块子内容
    	 */
        _slot(){
            return this.scrollbar.getContentComponent();
        },
        /*
    	 * 获取子组件
    	 */
        getInstance(){
            return this.component||this._slot;
        },
        /*
    	 * 获取弹出框头尾高度
    	 */
        getConstHeight(){
            let h=0;
            if(this.title&&this.title.length){
                h+=49;
            };
            if(this.button&&this.button.length){
                h+=65;
                if(this.isNative){
                    h-=15;
                };
            };
            return h;
        },
        /*
    	 * 获取body尺寸
    	 */
        getWarpStyle(){
            let style=document.body.getBoundingClientRect();
            const mainStyle=document.getElementById('app-main-section').getBoundingClientRect();
            style.width=Math.max(style.width,window.innerWidth);
            style.height=Math.max(mainStyle.height,style.height,window.innerHeight);
            return style;
        }
    },
    mixins:[
        mixinBase,
        mixinApi
    ],
    watch:{
        /*
    	 * 监听是否初始化完成
    	 */
        animated(flag){
            flag&&this.afterEnter();
        }
    },
    created(){

    },
    mounted(){
        this.show();
        this.$nextTick(()=>{
            if(this.$slots.body){
                document.body.appendChild(this.$el);
            };
            this.init();
        });
    },
    methods:{
        /*
    	 * 初始化
    	 */
        init(){
            if(!this.$slots.body){
                this.showLoading();
                this.setHeight().then(()=>{
                    this.showContent();
                    this.animated=true;
                });
            }else{
                let {top,height}=this.getBoxClientRect();
                this.lastWidth=Math.min(this.width,this.getWarpStyle.width*0.8);
                this.lastHeight=height+this.getConstHeight;
                if(!this.isNative){
                    this.opacity=1;
                    this.top=top;
                    this.showContent();
                    this.$nextTick(()=>{
                        this.animated=true;
                    });
                }else{
                    this.top=top-30;
                    this.setAnimate({
                        top:top,
                        opacity:1
                    },400).then(()=>{
                        this.$nextTick(()=>{
                            this.animated=true;
                        });
                    });
                    this.renderAnimate();
                };
            };
        },
        /*
    	 * 设置高度
    	 */
        setHeight(){
            return new Promise((resolve,reject)=>{
                let {top,height,scrollTop,viewHeight}=this.getBoxClientRect();
                this.top=scrollTop+(viewHeight-this.lastHeight)/2;
                this.setAnimate({
                    top:top,
                    width:Math.min(this.width,this.getWarpStyle.width*0.8),
                    height:height+this.getConstHeight,
                    opacity:this.isNative?0:1
                },this.isNative?this.animated?300:0:800).then(()=>{
                    this.scrollbar&&this.scrollbar.update();
                    resolve();
                });
                this.renderAnimate();
            });
        },
        /*
    	 * 获取内容Rect
    	 */
        getBoxClientRect(){
            let viewWidth=window.innerWidth,
                viewHeight=window.innerHeight,
                style=this.getInstance.$el.getBoundingClientRect(),
                height=style.height+this.getConstHeight,
                boxTop=0,
                boxHeight=0;
            if(this.isNative){
                if(height+2*this.spaceHeight>viewHeight){
                    this.maxHeight=viewHeight-2*this.spaceHeight-this.getConstHeight;
                    boxTop=Math.abs(this.getWarpStyle.top)+this.spaceHeight;
                    boxHeight=this.maxHeight;
                }else{
                    boxTop=(viewHeight-height-2*this.spaceHeight)/2+this.spaceHeight+Math.abs(this.getWarpStyle.top);
                    boxHeight=style.height;
                };
            }else{
                if(height+2*this.spaceHeight>=this.getWarpStyle.height){
                    this.maxHeight=this.getWarpStyle.height-2*this.spaceHeight-this.getConstHeight-Math.abs(this.getWarpStyle.top);
                    boxTop=Math.abs(this.getWarpStyle.top)+this.spaceHeight;
                    boxHeight=this.maxHeight;
                }else{
                    if(height+2*this.spaceHeight>viewHeight){
                        if(height+2*this.spaceHeight+Math.abs(this.getWarpStyle.top)>this.getWarpStyle.height){
                            boxTop=this.getWarpStyle.height-this.spaceHeight-height;
                            boxHeight=style.height;
                        }else{
                            boxTop=this.spaceHeight+Math.abs(this.getWarpStyle.top);
                            boxHeight=style.height;
                        };
                    }else{
                        boxTop=(viewHeight-height-2*this.spaceHeight)/2+this.spaceHeight+Math.abs(this.getWarpStyle.top);
                        boxHeight=style.height;
                    };
                    this.maxHeight=null;
                };
            };
            return {
                viewHeight,
                top:boxTop,
                scrollTop:Math.abs(this.getWarpStyle.top),
                //scrollTop:0,
                height:boxHeight
            };
        },
        /*
    	 * 初始化动画
    	 */
        setAnimate({top,width,height,opacity},time=800){
            return new Promise((resolve,reject)=>{
                new TWEEN.Tween({
                    opacity:this.opacity,
                    top:this.top,
                    width:this.lastWidth,
                    height:this.lastHeight
                }).to({
                    opacity:opacity,
                    top:top,
                    width:width,
                    height:height
                },time).easing(this.isNative?TWEEN.Easing.Cubic.Out:TWEEN.Easing.Back.Out).onUpdate(tween=>{
                    this.opacity=tween.opacity;
                    this.top=tween.top;
                    this.lastWidth=tween.width;
                    this.lastHeight=tween.height;
                }).onComplete(tween=>{
                    this.stop();
                    resolve();
                }).start();
            });
        },
        /*
    	 * 执行动画
    	 */
        renderAnimate(){
            if(TWEEN.update()){
                this._animateFrame=requestAnimationFrame(this.renderAnimate);
            };
        },
        /*
    	 * 停止动画
    	 */
        stop(){
            this._animateFrame&&cancelAnimationFrame(this._animateFrame);
        }
    },
    components:{

    },
    beforeDestroy(){
        this.stop();
        this.component&&this.component.$destroy();
    }
}
</script>

<style lang="scss">

</style>
