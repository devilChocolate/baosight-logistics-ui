<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <div class="app_grid-cell flex-row" v-if="!col.isExpand&&col.prop!=='radio'">
        <template v-if="col.prop!=checkType||col.isIndex">
            <div class="flex1 flex-row" :class="[{center:'align-center',left:'align-start-row',right:'align-end-row'}[col.align]]" @click="handleSortChange(col)">
                <header-cell :col="col"></header-cell>
                <div class="app_grid-tool-btn app_grid-sort"
                    v-if="col.sortable&&(col.type!='upload'||col.type!='custom')"
                    :class="{up:sort[col.prop]&&sort[col.prop]=='asc',down:sort[col.prop]&&sort[col.prop]=='desc'}">
                </div>
            </div>
            <template v-if="col.toolEnabled&&col.prop&&!col.unProp">
                <div class="flex-row align-center align-stretch mar-left-5 app_grid-tool-drop">
                    <el-popover
                        class="flex-row align-center align-stretch"
                        ref="popover"
                        placement="bottom-end"
                        :offset="8"
                        popper-class="app_grid-popover"
                        @show="showPopover(col)"
                        trigger="click">
                        <slot name="tool"></slot>
                        <span class="icon flex-col align-center" slot="reference">
                            <i class="iconfont icon-xiajiantou"></i>
                        </span>
                    </el-popover>
                </div>
            </template>
            <template v-if="col.prop">
                <div class="app_grid-drag prev"
                    v-if="locked=='right'"
                    :class="{'is-drag':dragabled}"
                    @mousedown="clickThumbHandler($event,col,false)">
                </div>
                <div class="app_grid-drag next"
                    v-else="locked!='center'&&i!=cols.length-1"
                    :class="{'is-drag':dragabled}"
                    @mousedown="clickThumbHandler($event,col,true)">
                </div>
            </template>
        </template>
        <bsx-form-item v-else-if="checkType=='checkbox'"
            class="flex1"
            type="checkbox"
            align="center"
            :width="35"
            :disabled="headCheckbox.disabled"
            :indeterminate="indeterminate"
            :value="headCheckbox.value"
            @bsx-cell-change="handleCheckboxChange">
        </bsx-form-item>
    </div>
</template>

<script>
import headerCell from '../cell/header';
import {on,off} from '@/utils/dom';

export default {
    data(){
        return {
            dragabled:false
        };
    },
    props:{
        /*
         * 列
         */
        col:Object,
        /*
    	 * 选中方式
    	 */
        checkType:String,
        /*
    	 * 头部全选
    	 */
        headCheckbox:Object,
        /*
    	 * 全选 indeterminate 状态
    	 */
        indeterminate:Boolean,
        /*
    	 * 行排序
    	 */
        sort:Object,
        /*
         * 锁区域
         */
        locked:String,
        /*
    	 * 行排序请求-是否开启
    	 */
    	sortAxiosEnabled:Boolean
    },
    mixins:[

    ],
    computed:{
        getSlotEnabled(){
            return !!this.col.instance.$scopedSlots.header;
        }
    },
    watch:{

    },
    beforeCreate(){

    },
    created(){

    },
    mounted(){

    },
    methods:{
        /*
         * 排序升降
         */
        handleSortChange(col){
            if(col.sortable){
                let type;
                if(!this.sort[col.prop]){
                    type='desc';
                }else if(this.sort[col.prop]=='asc'){
                    if(this.sortAxiosEnabled){
                        type=null;
                    }else{
                        type='desc';
                    };
                }else if(this.sort[col.prop]=='desc'){
                    type='asc';
                };
                this.$emit('bsx-column-sort',{
                    col:col,
                    sort:type
                });
            };
        },
        /*
    	 * 列操作框显示
    	 */
        showPopover(col){
            const popover=this.$refs[`head_popover_${col.prop}`];
            popover&&popover[0]&&popover[0].$children[0].clear();
        },

        /*
         * 点击拖拽滑块
         */
        clickThumbHandler(e,col,flag){
            if(e.ctrlKey||e.button===2){
                return;
            };
            this.getGrid=this.getRootGrid();
            this.rect=this.getGrid.$el.getBoundingClientRect();
            this.x=e.pageX;
            this.directionFlag=flag;
            this.col=col;
            this.handleStartDrag(e);
        },
        /*
         * 拖拽滑块
         */
        handleStartDrag(e){
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
            if(!this.cursorDown){
                return;
            };
            if(!this.x){
                return;
            };
            this.dragabled=true;
            if(this.directionFlag){
                const size=parseFloat(this.col.minWidth)-parseFloat(this.col.width);
                this.getGrid.dragX=Math.max(size+this.x,e.pageX)-this.rect.left;
                this.size=Math.max(size,e.pageX-this.x);
            }else{
                const size=parseFloat(this.col.width)-parseFloat(this.col.minWidth);
                this.getGrid.dragX=Math.min(size+this.x,e.pageX)-this.rect.left;
                this.size=Math.min(size,e.pageX-this.x);
            };
        },
        /*
         * 释放滑块
         */
        mouseUpDocumentHandler(){
            if(this.dragabled){
                this.$emit('bsx-column-drag',{
                    col:this.col,
                    size:this.directionFlag?this.size:-this.size
                });
                this.dragabled=false;
            };
            delete this.cursorDown;
            delete this.x;
            delete this.col;
            delete this.rect;
            delete this.size;
            delete this.directionFlag;
            this.getGrid.dragX=null;
            delete this.getGrid;
            document.onselectstart=null;
            off(document,'mousemove',this.mouseMoveDocumentHandler);
            off(document,'mouseup',this.mouseUpDocumentHandler);
        },
        /*
    	 * checkbox 全选
    	 */
        handleCheckboxChange(val){
            this.$emit('bsx-cell-change',val);
        },
        /*
         * 获取grid
         */
        getRootGrid(){
            let instance=this;
            while(instance){
                if(instance.refreshTableBodyRowsHeight){
                    return instance;
                }else{
                    instance=instance.$parent;
                };
            };
        }
    },
    components:{
        headerCell
    },
    beforeDestroy(){

    }
}
</script>

<style lang="scss">

</style>
