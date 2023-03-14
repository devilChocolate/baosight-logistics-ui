<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
     <transition name="app_toast" v-on:after-enter="afterEnter" v-on:after-leave="afterLeave">
         <div class="app_dialog-toast flex-row align-center" :style="getStyle" :class="[status.toString()]" v-if="visible">
            <i class="iconfont app_toast-icon" :class="[getIconClass]"></i>
            <p>{{content}}</p>
         </div>
     </transition>
</template>

<script>
export default {
    name:'bsx-toast',
    data() {
        return {
            visible:false
        }
    },
    props:{
        /*
    	 * 内容
    	 */
    	content:String,
        /*
    	 * 定位方式
    	 */
    	position:String,
    	/*
    	 * 状态
    	 */
    	status:{
    		type:Boolean,
    		default:true
    	},
    	/*
    	 * 延迟自动关闭时间
    	 */
    	delay:{
    		type:Number,
    		default:1500
    	}
    },
    computed:{
        getIconClass(){
            return {
                true:'icon-chenggong',
                false:'icon-guanbi'
            }[this.status];
        },
        getStyle(){
            return {
                position:this.position
            };
        }
    },
    mounted(){

    },
    methods:{
        show(){
            this.visible=true;
            this.timer=setTimeout(()=>{
                this.close();
            },this.delay);
        },
        close(){
            this.visible=false;
        },
        afterEnter(){
            this.__enter?this.__enter():this.$emit('bsx-toast-enter');
        },
        afterLeave(){
            if(this.__remove){
                this.__remove();
            }else{
                this.$emit('bsx-toast-close');
            };
        },
        stop(){
            this.timer&&clearTimeout(this.timer);
        }
    },
    components:{

    },
    beforeDestroy(){
        this.stop();
    }
}
</script>

<style lang="scss">

</style>
