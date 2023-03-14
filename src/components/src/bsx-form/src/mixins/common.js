/*
 * form-item/common 混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import config from '@/components/bsx/src/bsx-grid/config';
import Validator from '@/utils/validator';
import {
    isFunction,
    isEmptyObject,
    isPlainObject,
    getStrLength,
    isEmpty,
    isArray,
    isString
} from '@/utils/tool';

export default type=>{
    return {
        data(){
            return {
                modelVal:'',
                modelTitle:'',
                modelCode:'',
                validMessage:null,
                showValidFlag:false,
                getValidatorStatus:false
            };
        },
        props:{
            /*
        	 * 标题
        	 */
            label:config.label,
            /*
        	 * 文本宽度
        	 */
            textWidth:config.textWidth,
            /*
             * 当内容过长被隐藏时显示 tooltip
             */
            showOverflowTooltip:config.showOverflowTooltip,
            /*
        	 * 标题宽度
        	 */
        	labelWidth:config.labelWidth,
        	/*
        	 * 是否显示必填星星
        	 */
        	showRequiredStar:config.showRequiredStar,
            /*
        	 * 占位
        	 */
        	placeholder:config.placeholder,
            /*
        	 * 值
        	 */
            value:config.value,
            /*
        	 * 是否禁用
        	 */
        	disabled:config.disabled,
            /*
        	 * 是否编辑状态
        	 */
            editabled:config.editabled,
            /*
        	 * 自定义格式化方法/日历格式
        	 */
            format:config.format,
            /*
        	 * 格式校验
        	 */
            validator:config.validator,
            /*
        	 * 是否grid模式
        	 */
            gridable:{
                type:Boolean,
                default:false
            },
            /*
        	 * 尺寸
        	 */
            size:config.size,
            /*
        	 * 是否显示label
        	 */
            showLabel:config.showLabel,
            /*
        	 * 值对应字段名
        	 */
        	prop:config.prop,
        	/*
        	 * 值对应code字段名
        	 */
        	propCode:config.propCode,
        	/*
        	 * 值对应标题字段名
        	 */
        	propTitle:config.propTitle,
            /*
        	 * 类型
        	 */
        	type:config.type
        },
        watch:{
            value(val){
                !this.editabled&&this.reset({
                    value:val
                });
            },
            title(val){
                !this.editabled&&this.reset({
                    title:val
                });
            },
            code(val){
                !this.editabled&&this.reset({
                    code:val
                });
            },
            hasVal(val){
                !val&&this.hideError();
            },
            editabled(val){
                !val&&this.hideError();
            }
        },
        computed:{
            getValidatorFlag(){
                return !isEmptyObject(this.validator);
            },
            getShowValidatorFlag(){
                return this.getValidatorFlag&&this.validator.hasOwnProperty('showValid')&&!this.validator.showValid;
            },
            getFormInputVaildClass(){
                return {
                    'true':this.showValidFlag&&this.getValidatorFlag&&this.getValidatorStatus&&!this.getShowValidatorFlag,
                    'error':this.showValidFlag&&this.getValidatorFlag&&!this.getValidatorStatus
                };
            },
            showErrorMessageFlag(){
                return this.showValidFlag&&this.getValidatorFlag&&!this.getValidatorStatus;
                //return this.showValidFlag&&this.getValidatorFlag&&!this.getValidatorStatus&&!this.gridable;
            },
            getErrorMessage(){
                return `${this.validMessage}`;
            },
            hasVal(){
                return !isEmpty(this.modelVal);
            },
            isValidMust(){
                return this.getValidatorFlag&&this.validator.isMust!=false;
            },
            getAxiosIndex(){
                let o={};
                if(this.axiosName&&isPlainObject(this.axiosName)){
                    Object.keys(this.axiosName).forEach((key,index)=>{
                        o[key]=index;
                    });
                };
                return o;
            }
        },
        created(){
            this.reset();
        },
        mounted(){
            this.refreshTableHeight();
        },
        methods:{
            /*
             * 获取值
             */
            getValue(){
                return {
                    value:this.modelVal,
                    code:this.modelCode
                };
            },
            /*
        	 * 重置
        	 */
            reset(obj){
                let {value,code,title}=obj||{};
                value=value||this.value||'';
                code=code||this.code||'';
                title=title||this.title||'';
                if(type=='calendar'){
                    this.modelVal=value;
                    this.initVal(value);
                }else if((type=='select'&&this.multiple)||type=='cascader'){
                    let _val=isArray(this.modelVal)?this.modelVal.join(this.multipleSeparate):this.modelVal;
                    this.modelVal=value.length?value.split(this.multipleSeparate):[];
                    this.modelTitle=title.length?title.split(this.multipleSeparate):[];
                    if(type=='cascader'&&_val!=value){
                        this.resetPopper();
                    };
                }else if(type=='upload'){
                    this.modelVal=JSON.parse(JSON.stringify(value));
                    this.update(this.modelVal);
                }else{
                    this.modelVal=value;
                    this.modelTitle=title;
                    this.modelCode=code;
                };
                this.validMessage=null;
                this.hideError();
            },
            /*
        	 * 显示错误信息
        	 */
            showError(){
                this.showValidFlag=true;
            },
            /*
        	 * 隐藏错误信息
        	 */
            hideError(){
                this.showValidFlag=false;
            },
            /*
        	 * 校验格式
        	 */
            async fetchValid(){
                this.showError();
                if(this.isValidMust||(!this.isValidMust&&this.hasVal)){
                    if(this.isValidMust&&!this.hasVal){
                        this.validMessage='不能为空';
                        return this.getValidatorStatus=false;
                    };
                    if(isFunction(this.validator.valid)){
                        let result=await new Promise((resolve,reject)=>{
                            this.validator.valid(this.modelVal,this.modelCode,resolve);
                        });
                        if(!result.flag){
                            this.validMessage=result.msg;
                        };
                        return this.getValidatorStatus=result.flag;
                    }else if(this.validator.type||this.validator.regexp){
                        let flag=Validator({
                            ...this.validator,
                            ...{
                                value:this.modelVal
                            }
                        });
                        if(!flag){
                            this.validMessage=this.validator.msg||'格式不正确';
                        };
                        return this.getValidatorStatus=flag;
                    }else if(this.getValidatorFlag&&isString(this.modelVal)){
                        let strLen=getStrLength(this.modelVal);
                        if(!isEmpty(this.validator.length)){
                            let flag=strLen==this.validator.length;
                            if(!flag){
                                this.validMessage=`必须${this.validator.length}位字符`;
                            };
                            return this.getValidatorStatus=flag;
                        }else if(!isEmpty(this.validator.minLength)){
                            let flag=strLen>=this.validator.minLength;
                            if(!flag){
                                this.validMessage=`小于最小${this.validator.minLength}位字符`;
                            };
                            return this.getValidatorStatus=flag;
                        }else if(!isEmpty(this.validator.maxLength)){
                            let flag=strLen<=this.validator.maxLength;
                            if(!flag){
                                this.validMessage=`大于最大${this.validator.maxLength}位字符`;
                            };
                            return this.getValidatorStatus=flag;
                        };
                    };
                    return this.getValidatorStatus=true;
                };
                return this.getValidatorStatus=true;
            },
            /*
        	 * 格式化数据展示
        	 */
            formatVal(val){
                return (this.format||this.formatText)(val);
            },
            /*
        	 * 刷新表格高度
        	 */
            refreshTableHeight(){
                this.$nextTick(()=>{
                    let flag=true,instance=this;
                    while(flag&&instance){
                        if(instance.refreshTableBodyRowsHeight){
                            instance.refreshTableBodyRowsHeight('refreshTableHeight',300);
                            flag=false;
                        }else{
                            instance=instance.$parent;
                        };
                    };
                });
            }
        }
    };
};
