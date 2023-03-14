/*
 * dialog api混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
export default {
    data(){
        return {
            visible:true,
            showable:false
        };
    },
    props:{

    },
    computed:{

    },
    watch:{

    },
    created(){

    },
    mounted(){

    },
    methods:{
        /*
    	 * 关闭
    	 */
        close(){
            this.showable=false;
            this.flag=true;
        },
        /*
    	 * 显示
    	 */
        show(){
            this.showable=true;
            if(!this.__loaded){
                this.__loaded=true;
            }else{
                this.__repeatable=true;
            };
        },
        /*
    	 * 隐藏
    	 */
        hide(){
            this.showable=false;
        },
        /*
    	 * 显示loading
    	 */
        showLoading(){
            this._fetchShowLoading();
            this._fetchHideContent();
        },
        /*
    	 * 显示内容
    	 */
        showContent(){
            this._fetchHideLoading();
            this._fetchShowContent();
        }
    },
    components:{

    },
    beforeDestroy(){
        delete this.flag;
        delete this.__loaded;
        delete this.__repeatable;
    }
};
