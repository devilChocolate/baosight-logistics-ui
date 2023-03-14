<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <bsx-dialog
        class="app_dialog-confirm"
        ref="dialog"
        :is-native="true"
        :title="title"
        :slotTitle="slotTitle"
        :closeable="closeable"
        :button="button"
        :width="width"
        :dragable="true"
        @bsx-dialog-close="handleClose">
        <confirm-content slot="body"
            :icon="icon"
            :content="content">
        </confirm-content>
    </bsx-dialog>
</template>

<script>
import config from '../config';
import confirmContent from './inner/content';

export default {
    name:'bsx-confirm',
    data() {
        return {

        }
    },
    props:{
        ...config,
        /*
    	 * 按钮列表
    	 */
    	button:{
      		type:Array,
            default(){
                return [
                    {
                        text:'确认',
                        'class':'blue',
                        callback:(node,close,instance)=>{
                            this.handleSure(node);
                        }
                    },
                    {
                        text:'取消',
                        'class':'grey',
                        plain:true,
                        callback:(node,close,instance)=>{
                            this.handleCancel(node);
                        }
                    }
                ];
            }
      	}
    },
    computed:{

    },
    mounted(){

    },
    methods:{
        /*
    	 * 显示
    	 */
        show(){
            this.$refs.dialog.show();
        },
        /*
    	 * 关闭
    	 */
        close(){
            this.$refs.dialog.close();
        },
        /*
    	 * 确定
    	 */
        handleSure(node){
            if(this.sure){
                this.sure({
                    node,
                    close:this.close
                });
            }else{
                this.$emit('bsx-confirm-sure',{
                    node,
                    close:this.close
                });
            };
        },
        /*
    	 * 取消
    	 */
        handleCancel(node){
            this.autoClose&&this.close();
            if(this.cancel){
                this.cancel({
                    node,
                    close:this.close
                });
            }else{
                this.$emit('bsx-confirm-cancel',{
                    node,
                    close:this.close
                });
            };
        },
        /*
    	 * 手动关闭
    	 */
        handleClose(){
            this.closeCallback&&this.closeCallback({
                node:this.$refs.dialog.$refs.container,
                close:this.close
            });
        }
    },
    components:{
        confirmContent
    }
}
</script>

<style lang="scss">

</style>
