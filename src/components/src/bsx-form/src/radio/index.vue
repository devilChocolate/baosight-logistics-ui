<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <div class="bsx-form-radio flex-row align-center" @click.stop>
        <el-radio
            v-model="val"
            size="mini"
            :disabled="disabled"
            @change="handleChange"
            :label="label">
        </el-radio>
    </div>
</template>

<script>
import config from '@/components/bsx/src/bsx-grid/config';

export default {
    data(){
        return {
            val:false,
            label:true
        };
    },
    props:{
        /*
         * 值
         */
        value:config.value,
        /*
         * 是否禁用
         */
        disabled:config.disabled
    },
    mixins:[

    ],
    computed:{

    },
    watch:{
        value(val){
            this.val=val;
        }
    },
    beforeCreate(){

    },
    created(){
        this.val=this.value;
    },
    mounted(){

    },
    methods:{
        /*
    	 * 选中
    	 */
        handleChange(){
            if(this.val==this.label){
                this.$parent.$parent.$emit('bsx-cell-change',{
                    value:this.val
                });
            };
        }
    },
    components:{

    },
    beforeDestroy(){

    }
}
</script>

<style lang="scss">

</style>
