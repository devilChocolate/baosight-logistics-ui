/*
 * 公共表单验证方法
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 *
 *
 * ''required''  			  非空
 * ''ACSII''  				  仅ACSII字符
 * ''number''  				  纯数字，不能包含任何非数字
 * ''integer''  			  正负整数
 * ''negativeInteger''  	  负整数
 * ''positiveInteger''  	  正整数
 * ''float''  				  正负浮点数
 * ''negativeFloat''  		  负浮点数
 * ''positiveFloat''  		  正浮点数
 * ''alphabet''  			  大小写字母
 * ''LETTER''  				  大写字母
 * ''letter''  				  小写字母
 * ''chinese''  			  中文
 * ''color''  				  16进制色值
 * ''date''  				  日期
 * ''card''  				  验证国内银行卡号
 * ''username''  			  用户名
 * ''password''  			  密码
 * ''trueName''  			  真实姓名
 * ''tellphone''  			  手机号码
 * ''phoneNumber''  		  包括验证国内区号,国际区号,分机号
 * ''email''  				  邮箱
 * ''QQ''  					  QQ
 * ''IDcard''  				  身份证
 * ''bankNumber''			  银行卡号
 * ''carNumber''			  车牌号码
 * ''IP''  					  IP地址
 * ''postCode''  			  邮政编码
 * ''img''  				  图片
 * ''file''  				  判断压缩文件
 * ''site'' 				  网址
 * ''ftp''  				  ftp地址
 * ''passport''  			  护照号码
 * ''driver''  				  驾驶证
 * ''ccv''  				  验证CCV
 * ''creditCard''  			  验证信用卡
 * ''usaCreditCard''  		  验证美国信用卡
 * ''usaPostCard''  		  验证美国邮政编码
 */

import { isNumber, isPlainObject, isString, isRegExp, extend } from './tool'

const regexp = function(decimal) {
    return {
        required: /\S+/,
        ACSII: /^[\x00-\xFF]+$/,
        number: /^([+-]?)\d*\.?\d+$/,
        integer: /^-?[1-9]\d*$/,
        negativeInteger: /^-[1-9]\d*$/,
        positiveInteger: /^[0-9]\d*$/,
        float: /^-?(([1-9]\d+|\d)(\.\d{1,})?)$/,
        negativeFloat: new RegExp('^-(([1-9]\\d+|\\d)(\\.\\d{1,' + (isNumber(decimal) ? decimal : '') + '})?)$'),
        positiveFloat: new RegExp('^([1-9]\\d+|\\d)(\\.\\d{1,' + (isNumber(decimal) ? decimal : '') + '})?$'),
        alphabet: /^[A-Za-z]+$/,
        LETTER: /^[A-Z]+$/,
        letter: /^[a-z]+$/,
        chinese: /^[\u4e00-\u9fa5]+$/,
        color: /^#[a-fA-F0-9]{6}$/,
        date: /^\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}$/,
        username: /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/,
        password: /^(?![0-9]+$)(?![a-zA-Z]+$)[!"#$%&'()*+,\-.:;<=>?@\[\\\]^_`{|}~A-Za-z0-9]{8,20}$/,
        trueName: /^[?!$%~_#`.·@^\u4e00-\u9fa5]+$/,
        tellphone: /^1[3|4|5|7|8|9][0-9]\d{8}$/,
        phoneNumber: /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
        email: /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/,
        QQ: /^[1-9]*[1-9][0-9]*$/,
        IDcard: {
            name: 'checkIDCard',
            15: /^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/,
            18: /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})([0-9xX])$/
        },
        IP: /((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))/,
        postCode: /^[0-9]{6}$/,
        img: /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/,
        file: /(.*)\.(rar|zip|7zip|tgz)$/,
        site: /[a-zA-z]+:\/\/[^\s]+/,
        ftp: /ftp\:\/\/[^:]*:@([^\/]*)/,
        passport: /^[0-9]{9}$/,
        driver: /\d{15}$/,
        ccv: /^[0-9]{3}$/,
        creditCard: /^(4\\d{12}(?:\\d{3})?)$/,
        usaCreditCard: /^[3-6]\d{14,15}$/,
        usaPostCard: /^\d{5}$|^\d{9}$/,
        carNumber: {
            name: 'checkCarNumber'
        },
        bankNumber: {
            name: 'checkBankNumber'
        },
        area: { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }
    };
};

class Validator {
    /*
	 * 初始化
	 */
    constructor(options){
        let defaults = {
            value: null,
            type: null,
            isMust: true,
            decimal: 2,
            regexp: null,
            msg: '校验失败信息'
        };
        this.options = extend(true, {}, defaults, options);
        this.regexp = regexp(this.options.decimal);
        if (this.options.type && isString(this.options.type)) {
            this.options.type = this.options.type.split('|');
        };
        this.status = this.load(this.options.type);
        return this;
	}
    /*
	 * 校验载入
	 */
    load(type){
        if(this.options.isMust) {
            return this.test(type);
        } else {
            return this.match('required') ? this.test(type) : true;
        };
    }
    /*
	 * 循环校验
	 */
    test(type){
        if (isRegExp(this.options.regexp)) {
            return this.options.regexp.test(this.options.value);
        } else {
            for (let i = 0; i < type.length; i++) {
                if (this.match(type[i])) {
                    return true;
                };
            };
            return false;
        };
    }
    /*
	 * 校验匹配
	 */
    match(type){
        let info = this.regexp[type];
        if (isPlainObject(info)) {
            return this[info.name](this.options.value);
        } else if (isRegExp(info)) {
            return info.test(this.options.value);
        } else {
            return false;
        };
    }
    /*
	 * 检测车牌号
	 * @vehicleNumber 车牌号
	 */
    checkCarNumber(vehicleNumber){
        if (vehicleNumber.length == 7) {
            return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(vehicleNumber);
        };
        return false;
    }
    /*
	 * 检测银行卡号
	 * @bankno 银行卡号
	 */
    checkBankNumber(bankno){
        let lastNum = bankno.substr(bankno.length - 1, 1),
            first15Num = bankno.substr(0, bankno.length - 1);
        for (let i = first15Num.length - 1, newArr = []; i > -1; i--) {
            newArr.push(first15Num.substr(i, 1));
        };
        for (let j = 0, arrJiShu = [], arrJiShu2 = [], arrOuShu = []; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) {
                if (parseInt(newArr[j]) * 2 < 9) {
                    arrJiShu.push(parseInt(newArr[j]) * 2);
                } else {
                    arrJiShu2.push(parseInt(newArr[j]) * 2);
                };
            } else {
                arrOuShu.push(newArr[j]);
            };
        };
        for (let h = 0, jishu_child1 = [], jishu_child2 = []; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        };
        let sumJiShu = 0,
            sumOuShu = 0,
            sumJiShuChild1 = 0,
            sumJiShuChild2 = 0,
            sumTotal = 0;
        for (let m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        };
        for (let n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        };
        for (let p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        };
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
        let k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10,
            luhm = 10 - k;
        return lastNum == luhm && lastNum.length != 0;
    }
    /*
	 * 检测身份证号
	 * @bankno 身份证号
	 */
    checkIDCard(value){
        let l = value.length,
            re = this.regexp.IDcard[l];
        if (!this.match('required')) {
            this.options.msg = '请输入15或18位数的身份证号';
            return false;
        };
        var idcard_array = value.split('');
        if (this.regexp.area[parseInt(value.substr(0, 2))] == null) {
            this.options.msg = '身份证号码地区正确';
            return false;
        };
        var a = value.match(re);
        if (a != null) {
            var DD = new Date((l == 15 ? '19' : '') + a[3] + '/' + a[4] + '/' + a[5]),
                flag = DD.getFullYear() == ((l == 15 ? '19' : '') + a[3]) && (DD.getMonth() + 1) == a[4] && DD.getDate() == a[5];
            if (!flag) {
                this.options.msg = '身份证出生日期不对';
                return false;
            };
            if (l == 18) {
                var S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3,
                    Y = S % 11,
                    JYM = '10X98765432',
                    M = JYM.substr(Y, 1);
                if (M == idcard_array[17]) {
                    return true;
                } else {
                    this.options.msg = '身份证号码校验错误';
                    return false;
                };
            };
            return true;
        } else {
            this.options.msg = '身份证含有非法字符';
            return false;
        };
    }
};

export default function(options) {
    let result = new Validator(options);
    if (options.promised) {
        return new Promise((resolve, reject) => {
            result.status ? resolve() : reject(result.options.msg);
        });
    } else {
        return result.status;
    };
}
