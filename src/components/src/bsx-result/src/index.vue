<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <transition name="app_result" v-on:after-leave="afterLeave">
        <div class="app_result-container flex-col" v-show="visible">
            <bsx-scrollbar class="flex1" view-class="flex-col align-center" :margin="5">
                <div class="relative">
                    <img v-if="getImageEnabled" :src="getImageUrl" class="app_result-img"/>
                    <template v-if="mini">
                        <p class="app_result-text">{{msg}}<span class="app_result-text-tip" @click.stop="handleRefresh" v-if="buttonable"><i class="iconfont app_result-icon icon-shuaxin1"></i><a class="app_result-button-mini" href="javascript:;">点击重新刷新</a></span></p>
                    </template>
                    <template v-else>
                        <p class="app_result-text mar-bottom-20">{{msg}}</p>
                        <a class="app_result-button flex-row align-center" v-if="buttonable" href="javascript:;" @click.stop="handleRefresh"><i class="iconfont app_result-icon icon-shuaxin1"></i>点击重新刷新</a>
                    </template>
                </div>
            </bsx-scrollbar>
        </div>
    </transition>
</template>

<script>
import config from '../config';

export default {
    name:'bsx-result',
    data() {
        return {
            visible:false,
            removeable:false
        }
    },
    props:{
        ...config
    },
    computed:{
        getImageUrl(){
            return this.imageurl||require('@/assets/images/error.png');
        },
        getImageEnabled(){
            return this.mini?false:this.imageable;
        }
    },
    mounted(){
        if(!this.target){
            this.show();
        };
    },
    methods:{
        show(){
            this.visible=true;
        },
        hide(){
            this.visible=false;
        },
        close(){
            this.removeable=true;
            this.hide();
        },
        handleRefresh(){
            this.hide();
            if(this.refresh){
                this.refresh();
            }else{
                this.$emit('bsx-result-refresh');
            };
        },
        afterLeave(){
            if(this.removeable){
                this.remove&&this.remove();
            };
        }
    }
}
</script>

<style lang="scss">

</style>
