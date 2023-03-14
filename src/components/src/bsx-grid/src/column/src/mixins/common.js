/*
 * grid column混入
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
        /*
         * 是否子表格折叠
         */
        isExpand:'',
        /*
         * 所属列
         */
        col:Object
    },
    computed:{
        /*
         * 获取grid
         */
        getGrid(){
            let flag=true,parent=this;
            while(flag){
                parent=parent.$parent;
                if(parent&&parent.getHeadData){
                    flag=false;
                };
            };
            return parent;
        }
    },
    watch:{

    },
    created(){

    },
    mounted(){

    },
    methods:{

    },
    components:{

    }
};
