<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <div class="app_grid-column-info">
        <bsx-scrollbar class="app_grid-column-main" :margin="8" :space="5" :thumb-size="4">
            <el-radio-group v-model="modelVal" class="flex-col app_grid-column-group">
                <el-radio class="flex-row align-center-row"
                    :class="{actived:item.value==col.locked}"
                    :label="item.value"
                    :key="i"
                    v-for="(item,i) in modelList">
                    <div class="flex-row align-between-row">
                        <span class="flex1">{{item.title}}</span>
                    </div>
                </el-radio>
            </el-radio-group>
        </bsx-scrollbar>
        <div class="app_grid-column-bottom">
            <div class="flex-row">
                <el-button type="primary" size="small" class="flex1" @click="save">保存</el-button>
                <el-button type="primary" size="small" plain class="flex1" @click="reset(value)">重置</el-button>
            </div>
            <div class="app_grid-column-hr flex-row">
                <el-button class="flex1" type="primary" size="small" plain  @click="restore">一键还原</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import mixinCommon from '../mixins/common';

export default {
    data(){
        return {
            modelList:[
                {
                    title:'左侧',
                    value:'left'
                },
                {
                    title:'中间',
                    value:'center'
                },
                {
                    title:'右侧',
                    value:'right'
                }
            ],
            modelVal:''
        };
    },
    props:{
        /*
         * 数据
         */
        value:String
    },
    mixins:[
        mixinCommon
    ],
    computed:{

    },
    watch:{
        value:{
            handler(val){
                this.reset(val);
            },
            immediate:true
        }
    },
    beforeCreate(){

    },
    created(){

    },
    mounted(){

    },
    methods:{
        /*
         * 一键还原
         */
        restore(){
            this.getGrid.hideCellPopper();
            this.getGrid.handleRestore('locked');
        },
        /*
         * 保存
         */
        save(){
            this.getGrid.hideCellPopper();
            this.getGrid.handleColumnRadioChange({
                type:this.modelVal,
                prop:this.col.prop
            });
            this.$emit('change-save');
        },
        /*
         * 重置
         */
        reset(val){
            val=val||this.value;
            this.modelVal=val;
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
