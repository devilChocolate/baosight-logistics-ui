<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <div class="bsx-form-box relative flex-row align-stretch align-start-row" :class="{'no-gridable':!gridable}">
        <div class="bsx-form-label flex-row" :class="{'align-end-row':!!labelWidth}" :style="getLabelStyle" v-if="showLabel"><i v-if="showRequiredStar" class="star">*</i>{{label}}：</div>
        <div class="flex1 relative bsx-form-upload">
            <template v-if="editabled">
                <el-upload
                    class="bsx-form-upload-cell flex-row align-center"
                    ref="cell"
                    :multiple="multiple"
                    :limit="getLimit"
                    :disabled="isDisabled"
                    :data="getAxiosParam"
                    :name="uploadFileKey"
                    :show-file-list="false"
                    :drag="false"
                    :auto-upload="true"
                    :action="getAction"
                    :on-success="handleOnSuccess"
                    :on-error="handleOnError"
                    :on-change="handleOnChange"
                    :on-progress="handleOnProgress"
                    :before-upload="handleBeforeUpload"
                    :before-remove="handleBeforeRemove"
                    :on-exceed="handleOnExceed">
                    <el-button @click.prevent="handleClickUploadButton" :disabled="disabled" :size="size" slot="trigger" type="primary">点击上传</el-button>
                    <p slot="tip" class="bsx-form-upload-tip flex1 mar-left-5">{{getTipText}}</p>
                </el-upload>
                <div class="bsx-form-upload-message" v-if="errorMessage&&errorMessage.length">
                    <div class="flex-row" v-for="(item,i) in errorMessage" :key="i">
                        <p class="flex1">{{item.msg||item}}</p>
                        <i class="el-input__icon el-icon-warning"></i>
                    </div>
                </div>
            </template>
            <div class="bsx-form-upload-list" v-if="files&&files.length">
                <div class="bsx-form-upload-item flex-row align-start-row"
                    :class="{editable:editabled&&!disabled,'p-r':editabled&&!item.loading}"
                    v-for="(item,i) in files"
                    :key="i">
                    <i class="iconfont m1" :class="getFileIcon(item)"></i>
                    <p class="bsx-form-upload-name flex1">
                        <a href="javascript:;" v-if="editabled" @click="handleOnPreview(item)">{{item.name}}.{{item.type}}</a>
                        <a :href="item.src" target="_blank" v-else>{{item.name}}.{{item.type}}</a>
                    </p>
                    <template v-if="item.loading">
                        <div class="mar-left-10 bsx-form-upload-loading">
                            <bsx-loading :size="30" :target="null" box-background="rgba(0,0,0,0)"></bsx-loading>
                        </div>
                        <span class="mar-left-5 bsx-form-upload-loading-text">{{item.percent}}%</span>
                    </template>
                    <template v-else-if="editabled">
                        <i class="el-input__icon el-icon-success mf m3"></i>
                        <i class="el-input__icon el-icon-delete mf m2" @click="deleteItem(item)" v-if="!disabled"></i>
                    </template>
                </div>
            </div>
            <template v-else-if="!editabled">-</template>
        </div>
    </div>
</template>

<script>
import config from '@/components/bsx/src/bsx-grid/config';
import mixinCommon from '../mixins/common';
import {
    isArray,
    isFunction,
    isPlainObject,
    extend
} from '@/utils/tool';

export default {
    data(){
        return {
            files:[],
            errorMessage:[]
        };
    },
    props:{
        /*
    	 * 输入框中是否显示选中值的完整路径
    	 */
        multiple:config.multiple,
        /*
    	 * 多选连接符
    	 */
        multipleLimit:config.multipleLimit,
        /*
    	 * 上传的附件字段名
    	 */
        uploadFileKey:config.uploadFileKey,
        /*
    	 * 上传的单个附件最大大小
    	 */
        uploadFileMaxSize:config.uploadFileMaxSize,
        /*
    	 * 上传附件接受类型
    	 */
        uploadFileAccept:config.uploadFileAccept,
        /*
    	 * 请求地址
    	 */
    	axiosUrl:config.axiosUrl,
    	/*
    	 * 请求参数
    	 */
    	axiosParam:config.axiosParam,
        /*
    	 * 请求type
    	 */
    	axiosType:config.axiosType,
        /*
    	 * 请求结果格式化
    	 */
    	axiosMap:config.axiosMap
    },
    mixins:[
        mixinCommon('upload')
    ],
    computed:{
        getLabelStyle(){
            if(this.labelWidth){
                return {
                    width:`${this.labelWidth}px`
                };
            };
        },
        getAction(){
            return isPlainObject(this.axiosUrl)?this.axiosUrl.upload:this.axiosUrl;
        },
        getAxiosParam(){
            return isFunction(this.axiosMap)?this.axiosMap('send',this.axiosParam,this.getAxiosIndex.upload):this.axiosParam;
        },
        getTipText(){
            let str='';
            if(isArray(this.uploadFileAccept)){
                str=`只能上传${this.uploadFileAccept.join('/')}附件,且`;
            };
            return `${str}单个附件不超过${this.uploadFileMaxSize}`;
        },
        getMaxSize(){
            let type=this.uploadFileMaxSize.match(/[A-Z]+$/g),
                num=parseFloat(this.uploadFileMaxSize);
            if(type){
                type=type[0].toUpperCase();
                if(type.indexOf('GB')!==-1){
                    num=Math.round(num*1024*1024*1024);
                }else if(type.indexOf('MB')!==-1){
                    num=Math.round(num*1024*1024);
                }else if(type.indexOf('KB')!==-1){
                    num=Math.round(num*1024);
                };
            };
            return num;
        },
        isDisabled(){
            return this.disabled||(!this.disabled&&this.files.length>=this.multipleLimit)
        },
        getLimit(){
            return this.multipleLimit-this.files.length;
        },
        hasVal(){
            return !!(this.files&&this.files.length);
        }
    },
    watch:{
        errorMessage(val){
            this.refreshTableHeight();
        },
        files(val){
            this.refreshTableHeight();
        }
    },
    beforeCreate(){

    },
    created(){

    },
    mounted(){

    },
    methods:{
        /*
         * 更新
         */
        update(files){
            this.files=files||[];
        },
        /*
         * 获取值
         */
        getValue(){
            return {
                value:this.files
            };
        },
        /*
    	 * 验证
    	 */
        fetchValid(){
            this.errorMessage.splice(0,this.errorMessage.length);
            if(this.isValidMust||(!this.isValidMust&&this.hasVal)){
                if(this.isValidMust&&!this.hasVal){
                    this.errorMessage.push(this.validator.msg||'至少上传1个附件');
                    return false;
                };
            };
            return true;
        },
        /*
    	 * 校验单个附件格式
    	 */
        isValid(file){
            if(isArray(this.uploadFileAccept)){
                let types=['image','pdf','excel','word'];
                for(let i=0;i<this.uploadFileAccept.length;i++){
                    let index=types.indexOf(this.uploadFileAccept[i]);
                    if(index!==-1){
                        let funs=types[index].toLowerCase().replace(/\b(\w)|\s(\w)/g,function(m){
                            return m.toUpperCase();
                        });
                        let flag=this[`is${funs}`](file.name);
                        if(flag){
                            return this.isOverSize(file);
                        }else{
                            return {
                                flag:false,
                                msg:`${file.name}附件格式不正确`
                            };
                        };
                    };
                };
                return {
                    flag:false,
                    msg:`${file.name}不支持的格式`
                };
            };
            return this.isOverSize(file);
        },
        /*
    	 * 是否超出最大size
    	 */
        isOverSize(file){
            if(file.size>this.getMaxSize){
                return {
                    flag:false,
                    msg:`${file.name}超出最大附件大小${this.uploadFileMaxSize}`
                };
            };
            return {
                flag:true
            };
        },
        /*
    	 * 是否excel
    	 */
        isExcel(src){
            return /(.*)\.xl(s[xmb]|t[xm]|am)$/.test(src);
        },
        /*
    	 * 是否word
    	 */
        isWord(src){
            return /(.*)\.(dox|docx|doc)$/.test(src);
        },
        /*
    	 * 是否pdf
    	 */
        isPdf(src){
            return /(.*)\.pdf$/.test(src);
        },
        /*
    	 * 是否图片
    	 */
        isImage(src){
            return /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(src);
        },
        /*
    	 * 获取附件格式图标
    	 */
        getFileIcon(item){
            if(this.isImage(item.src)){
                return ['icon-tupian','image'];
            }else if(this.isPdf(item.src)){
                return ['icon-pdf','pdf'];
            }else if(this.isExcel(item.src)){
                return ['icon-Excel','excel'];
            }else if(this.isWord(item.src)){
                return ['icon-word','word'];
            }else{
                return ['icon-wenjian'];
            };
        },
        /*
    	 * 删除附件
    	 */
        deleteItem(item){
            this.showConfirm({
                content:'确定要删除吗？',
                sure:({node,close})=>{
                    const loading=this.$$loading({
                        target:node,
                        size:40
                    });
                    this.$http({
                        method:this.axiosType,
                        url:isPlainObject(this.axiosUrl)?this.axiosUrl.delete:this.axiosUrl,
                        data:isFunction(this.axiosMap)?this.axiosMap('delete',{
                            file:item,
                            ...this.axiosParam
                        },this.getAxiosIndex.delete):this.axiosParam,
                        noLoading:true
                    }).then(res=>{
                        res=res.data;
                        // if(isFunction(this.axiosMap)){
                        //     res=this.axiosMap('response',res,this.getAxiosIndex.delete);
                        // };
                        loading&&loading.close();
                        close();
                        this.removeFile(item.id);
                        this.showToast({
                            content:'删除成功！',
                            status:true,
                            target:this.$dom[5]
                        });
                    }).catch(({msg})=>{
                        loading&&loading.close();
                        close();
                        this.showMessages(msg);
                    });
                    // this.$http[this.axiosType]({
                    //     name:isPlainObject(this.axiosName)?this.axiosName.delete:this.axiosName,
                    //     data:isFunction(this.axiosMap)?this.axiosMap('delete',{
                    //         file:item,
                    //         ...this.axiosParam
                    //     },this.getAxiosIndex.delete):this.axiosParam,
                    //     loading:{
                    //         enabled:true,
                    //         target:node,
                    //         size:40
                    //     }
                    // }).then(res=>{
                    //     // if(isFunction(this.axiosMap)){
                    //     //     res=this.axiosMap('response',res,this.getAxiosIndex.delete);
                    //     // };
                    //     close();
                    //     this.removeFile(item.id);
                    //     this.showToast({
                    //         content:'删除成功！',
                    //         status:true,
                    //         target:this.$dom[5]
                    //     });
                    // }).catch(({msg})=>{
                    //     close();
                    //     this.showMessages(msg);
                    // });
                }
            });
        },
        /*
    	 * 删除附件
    	 */
        removeFile(id){
            for(let i=0;i<this.files.length;i++){
                if(this.files[i].id==id){
                    this.files.splice(i,1);
                    return;
                };
            };
        },
        /*
    	 * 点击上传按钮
    	 */
        handleClickUploadButton(){
            setTimeout(()=>{
                this.errorMessage.splice(0,this.errorMessage.length);
            },100);
            if(!this.disabled&&this.isDisabled){
                this.showMessages(`最多只能上传${this.multipleLimit}个附件`);
            };
        },
        /*
    	 * 上传附件之前的钩子
    	 */
        handleBeforeUpload(file){
            //console.log('handleBeforeUpload',file)
            let valid=this.isValid(file);
            if(!valid.flag){
                this.errorMessage.push({
                    id:file.uid,
                    msg:valid.msg
                });
                return false;
            }else{
                let name=file.name.split('.');
                this.files.push({
                    src:file.name,
                    name:name.slice(0,name.length-1).join('.'),
                    type:name[name.length-1],
                    size:file.size,
                    id:file.uid,
                    loading:true,
                    percent:0
                });
            };
        },
        /*
    	 * 删除附件之前的钩子
    	 */
        handleBeforeRemove(file,fileList){
            //console.log('handleBeforeRemove',file,fileList)
        },
        /*
    	 * 附件上传时的钩子
    	 */
        handleOnProgress(event,file,fileList){
            //console.log('handleOnProgress',event,file,fileList)
            for(let i=0;i<this.files.length;i++){
                if(this.files[i].id==file.uid&&this.files[i].loading){
                    this.files[i].percent=event.percent;
                    break;
                };
            };
        },
        /*
    	 * 附件上传成功时的钩子
    	 */
        handleOnSuccess(response,file,fileList){
            //console.log('handleOnSuccess',response,file,fileList)
            if(isFunction(this.axiosMap)){
                response=this.axiosMap('response',response,this.getAxiosIndex.upload);
            };
            for(let i=0;i<this.files.length;i++){
                if(this.files[i].id==file.uid){
                    delete this.files[i].loading;
                    delete this.files[i].percent;
                    this.files[i].id=response.id;
                    this.files[i].src=response.src;
                    break;
                };
            };
            this.fetchEmit();
        },
        /*
    	 * emit指令
    	 */
        fetchEmit(){
            if(this.gridable){
                this.$parent.handleCellChange({
                    files:this.files
                });
            }else{
                this.$emit('value-change',{
                    files:this.files
                });
            };
        },
        /*
    	 * 附件上传失败时的钩子
    	 */
        handleOnError(err,file,fileList){
            //console.log('handleOnError',file,fileList)
            //console.log(err,err.message)
            for(let i=0;i<this.errorMessage.length;i++){
                if(this.errorMessage[i].id==file.uid){
                    this.errorMessage[i].msg=`${file.name}上传失败`;
                    break;
                };
            };
            this.errorMessage.push({
                id:file.uid,
                msg:`${file.name}上传失败`
            });
            this.removeFile(file.uid);
        },
        /*
    	 * 附件状态改变时的钩子，添加附件、上传成功和上传失败时都会被调用
    	 */
        handleOnChange(file,fileList){
            //console.log('handleOnChange',file,fileList)
        },
        /*
    	 * 展示附件
    	 */
        handleOnPreview(item){
            if(item.src&&this.isImage(item.src)){
                if(!item.loading){
                    this.showMessages('查看放大图片');
                }else{
                    this.showMessages('请上传完成后再试');
                };
            }else{
                this.showMessages('该附件格式不支持预览');
            };
        },
        /*
    	 * 附件超出个数限制时的钩子
    	 */
        handleOnExceed(files,fileList){
            this.showMessages(`最多只能上传${this.multipleLimit}个附件`);
        },
        /*
    	 * 清空已上传的文件列表
    	 */
        clearFiles(){
            this.$refs.cell&&this.$refs.cell.clearFiles();
            this.files.splice(0,this.files.length);
            this.errorMessage.splice(0,this.errorMessage.length);
        },
        /*
    	 * 手动上传文件列表
    	 */
        submit(){
            this.$refs.cell&&this.$refs.cell.submit();
        },
        /*
    	 * 取消上传请求
    	 */
        abort(){
            this.$refs.cell&&this.$refs.cell.abort();
        }
    },
    components:{

    },
    beforeDestroy(){
        this.abort();
    }
}
</script>

<style lang="scss">

</style>
