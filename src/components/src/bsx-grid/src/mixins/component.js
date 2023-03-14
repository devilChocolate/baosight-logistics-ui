/*
 * grid component混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {
    data(){
        return {
            tableStatus:false
        };
    },
    props:{
        
    },
    created(){

    },
    methods:{
        /*
         * 创建loading
         */
        initLoading(){
            return this.$$loading({
                ...this.loading,
                target:this.$refs.body
            }).hide();
        },
        /*
         * 创建result
         */
        initResult(){
            return this.$$result({
                target:this.$refs.body,
                ...this.dataResult,
                refreshCallBack:()=>{
                    this.getPageInfo(this.currentPage);
                }
            }).hide();
        },
        /*
         * 显示loading
         */
        showLoading(){
            this._loading&&this._loading.show();
            this._result&&this._result.hide();
            this.tableStatus=false;
        },
        /*
         * 显示result
         */
        showResult(msg){
            this._loading&&this._loading.hide();
            this._result&&this._result.set(msg).show();
            this.tableStatus=false;
        },
        /*
         * 显示内容
         */
        showContent(){
            this._loading&&this._loading.hide();
            this._result&&this._result.hide();
            this.tableStatus=true;
        }
    }
};
