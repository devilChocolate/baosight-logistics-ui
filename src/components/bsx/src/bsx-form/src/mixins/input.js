/*
 * form-item/input 混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
 export default type=>{
     return {
        data(){
            return {
                isFocused:false,
                isEntered:false
            };
        },
        props:{

        },
        watch:{
            modelVal(val){
                this.isEntered=this.isFocused?this.hasVal:false;
            }
        },
        computed:{

        },
        created(){

        },
        methods:{
            /*
             * 单击slot-icon
             */
            handleSlotIconClick(){
                if(this.disabled||this.readonly){
                    return;
                };
                if(this.editabled){
                    if(this.gridable){
                        this.$parent.$parent.handleCellInputIconClick(this.modelVal);
                    }else{
                        this.$parent.$emit('slot-icon-click',this.modelVal);
                    };
                };
            },
            /*
             * 获取焦点
             */
            handleFocusInput(){
                this.hideError();
                if(this.hasVal){
                    this.isFocused=true;
                    this.isEntered=true;
                };
            },
            /*
             * 失去焦点
             */
            handleBlurInput(){
                this.isFocused=false;
                this.isEntered=false;
                this.hideError();
                if(this.disabled||this.readonly){
                    return;
                };
                if(this.hasVal){
                    if(this.validator.trigger=='blur'){
                        let flag=this.fetchValid();
                        (type=='input'||type=='textarea')&&!this.gridable&&flag&&this.$parent.$emit('value-change',{
                            value:this.modelVal,
                            code:this.modelCode
                        });
                    }else{
                        (type=='input'||type=='textarea')&&!this.gridable&&this.$parent.$emit('value-change',{
                            value:this.modelVal,
                            code:this.modelCode
                        });
                    };
                };
            },
            /*
             * 移入
             */
            handleMouseEnterInput(){
                if(this.disabled||this.readonly){
                    return;
                };
                if(!this.showValidFlag&&this.hasVal){
                    this.isEntered=true;
                };
            },
            /*
             * 移出
             */
            handleMouseLeaveInput(){
                if(this.disabled||this.readonly){
                    return;
                };
                if(!this.isFocused){
                    this.isEntered=false;
                };
            }
        }
    };
};
