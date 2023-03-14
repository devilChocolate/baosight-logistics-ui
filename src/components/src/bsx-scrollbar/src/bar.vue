<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <div class="app_scrollbar-track" :class="[direction]" :style="getTrackStyle" @mousedown="clickTrackHandler">
        <div class="app_scrollbar-thumb" ref="thumb" :style="getThumbStyle" @mousedown="clickThumbHandler"></div>
    </div>
</template>

<script>
import {on,off} from '@/utils/dom';

export default {
    data() {
        return {
            scrollBarMap:{
                vertical:{
            		offset:'offsetHeight',
            		scroll:'scrollTop',
            		scrollSize:'scrollHeight',
            		size:'height',
            		key:'vertical',
            		axis:'Y',
            		client:'clientY',
            		direction:'top'
            	},
            	horizontal:{
            		offset:'offsetWidth',
            	    scroll:'scrollLeft',
            	    scrollSize:'scrollWidth',
            	    size:'width',
            	    key:'horizontal',
            	    axis:'X',
            	    client:'clientX',
            	    direction:'left'
            	}
            }
        }
    },
    props:{
        /*
    	 * 尺寸
    	 */
        thumbSize:Number,
        /*
    	 * 间距
    	 */
        space:Number,
        /*
    	 * 方向
    	 */
        direction:{
            type:String,
            validator(value){
    			return ['vertical','horizontal'].indexOf(value)!==-1;
    		}
        },
        /*
    	 * 滑块大小
    	 */
        size:String,
        /*
    	 * 是否开启
    	 */
        enabled:Boolean,
        /*
    	 * 滑块移动位置
    	 */
        move:Number,
        /*
    	 * 边距
    	 */
        margin:Number
    },
    computed:{
        wrap(){
            return this.$parent.wrap;
        },
        bar(){
            return this.scrollBarMap[this.direction];
        },
        getThumbStyle(){
            return {
                [this.bar.size]:this.size,
                transform:`translate${this.bar.axis}(${this.move}%)`
            };
        },
        getTrackStyle(){
            return {
                vertical:{
                    top:`${this.margin}px`,
                    bottom:`${this.margin}px`,
                    right:`${this.space}px`,
                    width:`${this.thumbSize}px`
                },
                horizontal:{
                    left:`${this.margin}px`,
                    right:`${this.margin}px`,
                    bottom:`${this.space}px`,
                    height:`${this.thumbSize}px`
                }
            }[this.direction];
        }
    },
    mounted(){

    },
    methods:{
        /*
         * 点击滑块区域
         */
        clickTrackHandler(e){
            if(this.enabled){
                let rect=e.target.getBoundingClientRect(),
                    offset=Math.abs(rect[this.bar.direction]-e[this.bar.client]),
                    thumbHalf=this.$refs.thumb[this.bar.offset]/2,
                    thumbPositionPercentage=(offset-thumbHalf)*100/this.$el[this.bar.offset];
                this.wrap[this.bar.scroll]=thumbPositionPercentage*this.wrap[this.bar.scrollSize]/100;
            };
        },
        /*
         * 点击滑块
         */
        clickThumbHandler(e){
            if(this.enabled){
                if(e.ctrlKey||e.button===2){
                    return;
                };
                this.startDrag(e);
                let rect=e.currentTarget.getBoundingClientRect();
                this[this.bar.axis]=e.currentTarget[this.bar.offset]-(e[this.bar.client]-rect[this.bar.direction]);
            };
        },
        /*
         * 拖拽滑块
         */
        startDrag(e){
            e.stopImmediatePropagation();
            this.cursorDown=true;
            on(document,'mousemove',this.mouseMoveDocumentHandler);
            on(document,'mouseup',this.mouseUpDocumentHandler);
            document.onselectstart=()=>false;
        },
        /*
         * 移动滑块
         */
        mouseMoveDocumentHandler(e){
            if(this.cursorDown===false){
                return;
            };
            let prevPage=this[this.bar.axis];
            if(!prevPage){
                return;
            };
            let rect=this.$el.getBoundingClientRect(),
                offset=e[this.bar.client]-rect[this.bar.direction],
                thumbClickPosition=this.$refs.thumb[this.bar.offset]-prevPage,
                thumbPositionPercentage=(offset-thumbClickPosition)*100/this.$el[this.bar.offset];
            this.wrap[this.bar.scroll]=thumbPositionPercentage*this.wrap[this.bar.scrollSize]/100;
        },
        /*
         * 释放滑块
         */
        mouseUpDocumentHandler(){
            this.cursorDown=false;
            this[this.bar.axis]=0;
            document.onselectstart=null;
            off(document,'mousemove',this.mouseMoveDocumentHandler);
            off(document,'mouseup',this.mouseUpDocumentHandler);
        }
    },
    components:{

    },
    beforeDestroy(){
        this.mouseUpDocumentHandler();
    }
}
</script>

<style lang="scss">

</style>
