<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <div class="app_grid-column-info">
        <bsx-scrollbar class="app_grid-column-main" :margin="8" :space="5" :thumb-size="4">
            <div class="flex-col app_grid-column-group">
                <template v-for="(cols,type,i) in modelList" v-if="cols.length">
                    <transition-group class="app_grid-column-rows flex-col"
                        name="flip-list"
                        tag="div"
                        :key="i">
                        <div
                            class="el-checkbox"
                            :class="{actived:item.prop==col.prop}"
                            :key="`${item.prop}`"
                            v-for="(item,j) in cols">
                            <div class="flex-row align-between-row el-checkbox__label">
                                <span class="flex1">{{item.title}}</span>
                                <div class="flex-row align-center">
                                    <i class="iconfont icon-shangjiantou1" :class="{'disabled':j==0}" @click="handleUp(item,j,cols)" title="上移"></i>
                                    <i class="iconfont icon-xiajiantou1" :class="{'disabled':j==cols.length-1}" @click="handleDown(item,j,cols)" title="下移"></i>
                                </div>
                            </div>
                        </div>
                    </transition-group>
                </template>
            </div>
        </bsx-scrollbar>
        <div class="mar-top-5 app_grid-column-bottom">
            <div class="flex-row">
                <el-button type="primary" size="small" class="flex1" @click="save">保存</el-button>
                <el-button type="primary" size="small" plain class="flex1" @click="reset(list)">重置</el-button>
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
            modelList:{}
        };
    },
    props:{
        /*
         * 数据列表
         */
        list:{
            type:Object,
            default:{}
        }
    },
    mixins:[
        mixinCommon
    ],
    computed:{

    },
    watch:{
        list:{
            handler(val){
                this.reset(val);
            },
            deep:true,
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
            this.getGrid.handleRestore('order');
        },
        /*
         * 重置
         */
        reset(val){
            val=val||this.list||{};
            this.modelList=JSON.parse(JSON.stringify(val));
        },
        /*
         * 上移
         */
        handleUp(item,index,cols,type){
            if(index!=0){
                cols.splice(index,1);
                cols.splice(index-1,0,item);
                cols=cols.map((col,i)=>{
                    col.sortIndex=col.unSortIndex?col.sortIndex:i;
                    return col;
                });
            };
        },
        /*
         * 下移
         */
        handleDown(item,index,cols){
            if(index!=cols.length-1){
                cols.splice(index,1);
                cols.splice(index+1,0,item);
                cols=cols.map((col,i)=>{
                    col.sortIndex=col.unSortIndex?col.sortIndex:i;
                    return col;
                });
            };
        },
        /*
         * 保存
         */
        save(){
            this.getGrid.hideCellPopper();
            this.getGrid.handleColumnOrderChange({
                list:this.modelList
            });
            this.$emit('change-save');
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
