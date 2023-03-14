/*
 * bsx-form 混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
 export default {
    data(){
        return {

        };
    },
    props:{

    },
    watch:{

    },
    computed:{

    },
    created(){

    },
    methods:{
        /*
         * 获取子组件
         */
        _getItems(){
            return this.$children.filter(item=>{
                return !!item.$refs.formItem;
            }).map(item=>{
                return item.$refs.formItem;
            });
        }
    }
};
