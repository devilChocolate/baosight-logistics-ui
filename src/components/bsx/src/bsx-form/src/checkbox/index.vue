<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <div class="bsx-form-checkbox flex-row align-center" @click.stop>
        <el-checkbox
            v-model="val"
            size="mini"
            :disabled="disabled"
            @change="handleChange"
            :indeterminate="indeterminate"
            :label="label">
        </el-checkbox>
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
        disabled:config.disabled,
        /*
         * 设置 indeterminate 状态
         */
        indeterminate:config.indeterminate
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
            const parent=this.$parent.$parent;
            if(parent.$parent.$options.propsData.type=='body'){
                parent.$emit('bsx-cell-change',{
                    value:this.val
                });
            }else{
                if(parent.$parent.$parent.$parent.handleCheckBoxChange){
                    parent.$parent.$parent.$parent.handleCheckBoxChange(this.val);
                }else{
                    parent.$emit('bsx-cell-change',this.val);
                };
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
