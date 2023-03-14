<!-- /*
 * form插件
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */ -->
<template>
     <div class="bsx-form">
         <slot></slot>
     </div>
</template>

<script>
import mixinBase from './mixins/base';
import {
    isArray
} from '@/utils/tool';

export default {
    name:'bsx-form',
    data() {
        return {

        }
    },
    props:{

    },
    computed:{

    },
    mixins:[
        mixinBase
    ],
    mounted(){

    },
    methods:{
        /*
         * 隐藏弹框
         */
        hidePopper(){
            let items=this._getItems();
            items.forEach(item=>{
                item.hidePopper&&item.hidePopper();
            });
        },
        /*
         * 验证
         */
        async fetchValid(prop){
            let items=this._getItems(),
                flag=true;
            for(let i=0;i<items.length;i++){
                if(!prop||(prop&&items[i].prop==prop)){
                    let _flag=await items[i].fetchValid();
                    flag=flag&&_flag;
                    if(prop){
                        break;
                    };
                };
            };
            return flag;
        },
        /*
         * 获取数据
         */
        getValue(){
            let items=this._getItems(),o={};
            items.forEach(item=>{
                let info=item.getValue();
                if(item.prop){
                    o[item.prop]=isArray(info.value)&&item.type!='upload'?info.value.join(item.multipleSeparate):info.value;
                };
                if(item.propCode){
                    o[item.propCode]=info.code;
                };
                if(item.propTitle){
                    o[item.propTitle]=info.title.join(item.multipleSeparate);
                };
            });
            return o;
        },
        /*
         * 重置
         */
        reset(){
            let items=this._getItems();
            items.forEach(item=>{
                item.reset();
            });
        },
        /*
         * 设置值
         */
        setValue(obj){
            if(obj){
                let items=this._getItems();
                items.forEach(item=>{
                    if(obj.hasOwnProperty(item.prop)){
                        item.reset({
                            title:obj[item.prop],
                            code:obj[item.propCode],
                            value:obj[item.propTitle]
                        });
                    };
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
