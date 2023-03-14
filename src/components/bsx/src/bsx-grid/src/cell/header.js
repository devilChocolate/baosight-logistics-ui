/*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */
export default {
    data(){
        return {

        };
    },
    props:{
        /*
         * 列数据
         */
        col:Object
    },
    mixins:[

    ],
    computed:{

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

    },
    render(h){
        if(this.col.instance&&this.col.instance.$scopedSlots.header){
            return h('div',{
                class:{
                    'flex-row':true
                }
            },[
                this.col.instance.getColumnHeaderVNode({
                    col:this.col
                })
            ]);
        }else{
            return h('span',this.col.label);
        };
    },
    beforeDestroy(){

    }
};
