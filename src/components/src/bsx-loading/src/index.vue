<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <transition name="app_loading" v-on:after-leave="afterLeave">
        <div class="app_loading-container" v-show="visible" :id="id" :style="this.getContainerStyle">
            <div class="app_loading-content" :style="this.getContentStyle">
                <bsx-frame v-if="frameable" ref="frame"
                    image="sprite/loading"
                    :infinite="true"
                    :speed="40"
                    :max="89"
                    :rows="8">
                </bsx-frame>
                <div v-else class="app_loading-box">
                    <svg viewBox="25 25 50 50" class="app_loading-circular">
                        <circle cx="50" cy="50" r="20" fill="none" class="app_loading-path"></circle>
                    </svg>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import config from '../config';

export default {
    name:'bsx-loading',
    data() {
        return {
            visible:false,
            removeable:false
        }
    },
    props:{
        ...config,
        /*
    	 * 定位方式
    	 */
    	position:{
     		type:String,
     		default:'absolute'
     	},
        /*
    	 * 唯一标识码
    	 */
    	id:{
     		type:String,
     		default:''
     	}
    },
    computed:{
        getContainerStyle(){
            return {
                position:this.position,
                background:this.masterBackground,
                opacity:this.opacity,
                zIndex:+new Date
            };
        },
        getContentStyle(){
            return {
                width:`${this.size}px`,
                height:`${this.size}px`,
                background:this.boxBackground
            };
        }
    },
    mounted(){
        if(this.time){
            this.__timer=setTimeout(()=>{
                this.close();
            },this.time);
        };
        if(!this.target){
            this.show();
        };
    },
    methods:{
        show(){
            this.visible=true;
            this.frameable&&this.$refs.frame.start();
        },
        hide(){
            this.visible=false;
            this.frameable&&this.$refs.frame.stop();
        },
        close(){
            if(!this.alone){
                this.removeable=true;
                this.hide();
            };
        },
        afterLeave(){
            if(this.removeable){
                this.__timer&&clearTimeout(this.__timer);
                this.remove&&this.remove();
            };
        }
    },
    beforeDestroy(){
        this.frameable&&this.$refs.frame.stop();
    }
}
</script>

<style lang="scss">

</style>
