<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <div class="app_dialog-text flex-row align-center">
        <i class="iconfont app_dialog-icon" :class="[icon]" v-if="icon"></i>
        <div class="app_dialog-msg flex-col align-center">
            <p v-html="content"></p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props:{
        /*
    	 * 内容icon
    	 */
        icon:String,
        /*
    	 * 内容
    	 */
        content:String
    },
    computed:{

    },
    mounted(){

    },
    methods:{

    },
    components:{

    }
}
</script>

<style lang="scss">

</style>
