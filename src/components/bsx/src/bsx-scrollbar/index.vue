<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <div class="app_scrollbar-container flex-col">
        <div class="app_scrollbar-warp flex1" :class="getWarpClass" ref="wrap" :style="getWarpStyle" @scroll="handleScroll">
            <div class="app_scrollbar-view" :class="getClass(viewClass)" ref="resize" :style="getViewStyle">
                <slot></slot>
            </div>
        </div>
        <template v-if="showThumb">
            <bar v-if="sizeHeight"
                :class="getClass(tackClass)"
                direction="vertical"
                :enabled="enabled.vertical"
                :margin="margin"
                :thumb-size="thumbSize"
                :space="space"
                :size="sizeHeight"
                :move="moveY">
            </bar>
            <bar v-if="sizeWidth"
                :class="getClass(tackClass)"
                direction="horizontal"
                :enabled="enabled.horizontal"
                :margin="margin"
                :thumb-size="thumbSize"
                :space="space"
                :size="sizeWidth"
                :move="moveX">
            </bar>
        </template>
    </div>
</template>

<script>
import {
    isArray
} from '@/utils/tool';
import {
    on,
    off,
	getScrollbarSize
} from '@/utils/dom';
import {
	addResizeListener,
    removeResizeListener
} from '@/utils/resize';
import bar from './src/bar';

export default {
    name:'bsx-scrollbar',
    data() {
        return {
            moveX:0,
            moveY:0,
            sizeWidth:'0',
            sizeHeight:'0',
            enabled:{
                vertical:true,
                horizontal:true
            },
            scrollEmitFlag:true
        }
    },
    props:{
        /*
    	 * 包裹层class
    	 */
    	warpClass:[Array,Object,String],
    	/*
    	 * 视图层class
    	 */
    	viewClass:[Array,Object,String],
        /*
    	 * 滑块层class
    	 */
    	tackClass:[Array,Object,String],
        /*
    	 * 是否显示滚动棒
    	 */
        showThumb:{
            type:Boolean,
            default:true
        },
        /*
    	 * 是否占位
    	 */
    	isHold:{
            type:Boolean,
     		default:false
        },
        /*
    	 * 边距
    	 */
        margin:{
            type:Number,
            default:0
        },
        /*
    	 * 延迟时间
    	 */
        debounce:{
            type:Number,
            default:300
        },
        /*
    	 * 尺寸
    	 */
        thumbSize:{
            type:Number,
            default:6
        },
        /*
    	 * 间距
    	 */
        space:{
            type:Number,
            default:0
        }
    },
    computed:{
        getWarpStyle(){
            const size=getScrollbarSize();
            if(size){
                let o={};
                if(this.sizeHeight){
                    o.marginRight=`-${size}px`;
                };
                if(this.sizeWidth){
                    o.marginBottom=`-${size}px`;
                };
                return o;
            };
        },
        getWarpClass(){
            let arr=this.getClass(this.warpClass);
            arr.push({
                'vertical-hidden':!this.enabled.vertical,
                'horizontal-hidden':!this.enabled.horizontal
            });
            return arr;
        },
        wrap(){
            return this.$refs.wrap;
        },
        getViewStyle(){
            if(this.isHold){
                return {
                    paddingRight:`${this.sizeHeight?10:0}px`,
                    paddingBottom:`${this.sizeWidth?10:0}px`
                };
            };
        }
    },
    watch:{
        sizeWidth(val){
            this.enabled.horizontal=!!val;
        },
        sizeHeight(val){
            this.enabled.vertical=!!val;
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.update();
            addResizeListener(this.$refs.resize,this.handleResize);
            on(window,'resize',this.handleResize);
            // const size=getScrollbarSize();
            // if(size){
            //     const warpStyle=this.wrap.getBoundingClientRect();
            //     const viewStyle=this.$refs.resize.getBoundingClientRect();
            //     if(warpStyle.height==viewStyle.height){
            //         this.wrap.style.overflowY='hidden';
            //         //this.wrap.style.marginBottom=`-${size}px`;
            //     };
            // };
        });
    },
    methods:{
        enabledScrollEmit(){
            this.scrollEmitFlag=true;
        },
        disabledScrollEmit(){
            this.scrollEmitFlag=false;
        },
        scrollTo({left,top}){
            if(left!=undefined){
                this.wrap.scrollLeft=left;
            };
            if(top!=undefined){
                this.wrap.scrollTop=top;
            };
        },
        getContentComponent(){
            return this.$children[0];
        },
        handleScroll(){
            if(!this.wrap){
                return;
            };
            this.moveY=(this.wrap.scrollTop*100)/this.wrap.clientHeight;
            this.moveX=(this.wrap.scrollLeft*100)/this.wrap.clientWidth;
            if(this.scrollEmitFlag){
                this.$emit('bsx-scrollbar-scroll',{
                    horizontal:this.wrap.scrollLeft!=0&&this.wrap.scrollWidth==this.wrap.scrollLeft+this.wrap.clientWidth,
                    vertical:this.wrap.scrollTop!=0&&this.wrap.scrollHeight==this.wrap.scrollTop+this.wrap.clientHeight,
                    scrollTop:this.wrap.scrollTop,
                    scrollLeft:this.wrap.scrollLeft
                });
            };
        },
        update(){
            if(!this.wrap){
                return;
            };
            let heightPercentage=(this.wrap.clientHeight*100/this.wrap.scrollHeight)||0,
                widthPercentage=(this.wrap.clientWidth*100/this.wrap.scrollWidth)||0;
            this.sizeHeight=heightPercentage<100?`${heightPercentage}%`:'';
            this.sizeWidth=widthPercentage<100?`${widthPercentage}%`:'';
            this.enabledScrollEmit();
        },
        handleResize(){
            this.clear();
            this._timer=setTimeout(()=>{
                this.clear();
                this.update();
                this.$emit('bsx-scrollbar-resize',{
                    width:this.wrap.scrollWidth,
                    height:this.wrap.scrollHeight
                });
            },this.debounce);
        },
        setEnabled(direction,flag){
            if(this.enabled.hasOwnProperty(direction)){
                this.enabled[direction]=flag;
            };
        },
        getClass(name){
            return isArray(name)?name:[name];
        },
        clear(){
            this._timer&&clearTimeout(this._timer);
        }
    },
    components:{
        bar
    },
    beforeDestroy(){
        this.clear();
        removeResizeListener(this.$refs.resize,this.handleResize);
        off(window,'resize',this.handleResize);
    }
}
</script>

<style lang="scss">

</style>
