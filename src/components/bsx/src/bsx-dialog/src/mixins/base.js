/*
 * dialog base混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import {
    on,
    off
} from '@/utils/dom';
import {
	isFunction
} from '@/utils/tool';

export default {
    data(){
        return {
            state:0,
            moveX:0,
            moveY:0,
            cursorDown:false
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
        on(window,'resize',this.handleResize);
        on(document,'keyup',this.handleKeyBoard);
    },
    methods:{
        /*
    	 * 键盘 ESC退出
    	 */
        handleKeyBoard(e){
            if(e.keyCode==27&&this.closeable&&!this.isNative){
                //this.close();
            };
        },
        /*
    	 * 按钮单击
    	 */
        handleButtonClick(item){
            if(isFunction(item.callback)){
                item.callback.apply(this,[this.$refs.container,this.close,this.getInstance].concat(this.args||[]));
            }else{
                this.close();
            };
        },
        /*
    	 * 滚动
    	 */
        handleScroll(data){
            this.scroll?this.scroll(data,this.getInstance):this.$emit('bsx-dialog-scroll',{
                data:data,
                instance:this.getInstance
            });
        },
        /*
    	 * 尺寸变化
    	 */
        handleResize(){
            //this.showable&&this.setHeight();
        },
        /*
         * 点击拖拽
         */
        handleMouseDownHead(e){
            if(this.dragable){
                if(e.ctrlKey||e.button===2){
                    return;
                };
                this.x=e.pageX-this.moveX;
                this.y=e.pageY-this.moveY;
                this.handleStartDragHead(e);
            };
        },
        /*
         * 拖拽
         */
        handleStartDragHead(e){
            e.stopImmediatePropagation();
            this.cursorDown=true;
            on(document,'mousemove',this.HandleMousemoveDocument);
            on(document,'mouseup',this.HandleMouseupDocument);
            document.onselectstart=()=>false;
        },
        /*
         * 移动拖拽
         */
        HandleMousemoveDocument(e){
            if(!this.cursorDown){
                return;
            };
            if(!this.x||!this.y){
                return;
            };
            this.moveX=e.pageX-this.x;
            this.moveY=e.pageY-this.y;
            this.handleDrag?this.handleDrag(this.getInstance):this.$emit('bsx-dialog-drag',{
                instance:this.getInstance
            });
        },
        /*
         * 释放拖拽
         */
        HandleMouseupDocument(){
            this.cursorDown=false;
            delete this.x;
            delete this.y;
            document.onselectstart=null;
            off(document,'mousemove',this.HandleMousemoveDocument);
            off(document,'mouseup',this.HandleMouseupDocument);
        },
        /*
    	 * 显示动画结束后钩子
    	 */
        afterEnter(){
            if(!this.__repeatable){
                this.enter?this.enter():this.$emit('bsx-dialog-enter');
            };
        },
        /*
    	 * 消失动画结束后钩子
    	 */
        afterLeave(){
            if(this.flag){
                this.visible=false;
                this.remove?this.remove():this.$emit('bsx-dialog-close');
            };
        },
        /*
    	 * 辅助显示loading
    	 */
        _fetchShowLoading(){
            if(!this.loading){
                this.loading=this.$$loading({
                    target:this.$refs.body,
                    size:40
                });
            }else{
                this.loading.show();
            };
        },
        /*
    	 * 辅助隐藏loading
    	 */
        _fetchHideLoading(){
            this.loading&&this.loading.hide();
        },
        /*
    	 * 辅助显示内容
    	 */
        _fetchShowContent(){
            this.state=1;
        },
        /*
    	 * 辅助隐藏内容
    	 */
        _fetchHideContent(){
            this.state=0;
        },
        /*
    	 * 获取按钮classname
    	 */
        getButtonClass(item){
            let name=[item.class];
            if(item.plain){
                name.push('plain');
            };
            return name.join('-');
        }
    },
    components:{

    },
    beforeDestroy(){
        off(window,'resize',this.handleResize);
        off(document,'keyup',this.handleKeyup);
    }
};
