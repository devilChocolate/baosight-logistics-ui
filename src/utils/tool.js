/*
 * 公共方法集合
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
const class2type={};
'Boolean,Number,String,Function,Array,Date,RegExp,Object'.split(',').forEach(value=>{
	class2type['[object '+value+']']=value.toLowerCase();
});

const type=function(obj){
	return obj==null?String(obj):class2type[Object.prototype.toString.call(obj)]||'object';
};

/*
 * 判断是否数字
 */
export const isNumber=(obj)=>{
	return !isNaN(parseFloat(obj))&&isFinite(obj);
};

/*
 * 判断是否字符串
 */
export const isString=(obj)=>{
	return type(obj)==='string';
};

/*
 * 判断是否boolean类型
 */
export const isBoolean=(obj)=>{
	return type(obj)==='boolean';
};

/*
 * 判断是否function类型
 */
export const isFunction=(obj)=>{
	return type(obj)==='function';
};

/*
 * 判断是否Promise类型
 */
export const isPromise=(obj)=>{
	return !!obj&&isFunction(obj.then);
};

/*
 * 判断是否date类型
 */
export const isDate=(obj)=>{
	return type(obj)==='date';
};

/*
 * 判断是否正则
 */
export const isRegExp=(obj)=>{
	return type(obj)==='regexp';
};

/*
 * 判断是否array类型
 */
export const isArray=(obj)=>{
	return Array.isArray(obj);
};

/*
 * 判断是否是window
 */
export const isWindow=(obj)=>{
	return obj!=null&&typeof(window)!=='undefined'&&obj===window;
};

/*
 * 判断是否object类型
 */
export const isPlainObject=(obj)=>{
	if(!obj||type(obj)!=='object'||obj.nodeType||isWindow(obj)){
		return false;
	};
	let hasOwn=Object.prototype.hasOwnProperty;
	try{
		if(obj.constructor&&!hasOwn.call(obj,'constructor')&&!hasOwn.call(obj.constructor.prototype,'isPrototypeOf')){
			return false;
		};
	}catch(e){
		return false;
	};
	for(var key in obj){};
	return key===undefined||hasOwn.call(obj,key);
};

/*
 * 是否是空对象
 */
export const isEmptyObject=(obj)=>{
	return isPlainObject(obj)&&Object.keys(obj).length==0;
};

/*
 * 判断是否是空
 */
export const isEmpty=(str)=>{
	return str=='null'||str==null||str==undefined||str=='undefined'||str==''||str=='{}'||str=='[]'||JSON.stringify(str)=='{}'||JSON.stringify(str)=='[]';
};

/*
 * 浏览器信息
 */
export const browser=((n)=>{
    let u=n.userAgent,app=n.appVersion;
    return {
        touch:('ontouchstart' in window)||window.DocumentTouch&&document instanceof DocumentTouch,//是否支持touch事件
        isInstalledApp:/youragent/g.test(u.toLowerCase()),
        isWeixin:/micromessenger/g.test(u.toLowerCase()),
        isIOS:/iphone|ipad|ipod/g.test(u.toLowerCase()),
        versions:{
            trident:u.indexOf('Trident') > -1, //IE内核
            ie:u.indexOf('Trident')>-1&&((Object.hasOwnProperty.call(window,'ActiveXObject')&&!window.ActiveXObject)||parseInt(u.toLowerCase().match(/msie ([\d.]+)/)[1])),//ie版本(>=ie11为true)
            presto:u.indexOf('Presto') > -1, //opera内核
            webKit:u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko:u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile:!!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
            ios:!!u.match(/(i[^;]+;(U;)? CPU.+Mac OS X)/), //ios终端
            android:u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone:u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPod:u.indexOf('iPod') > -1 , //是否iPod
            iPad:u.indexOf('iPad') > -1, //是否iPad
            webp:document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp')===0,
            chrome:u.indexOf('Chrome') !== -1, //是否chrome
            webApp:u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        },
        language:(n.browserLanguage||n.language).toLowerCase()
    };
})(navigator);

/*
 * 去除首尾空格
 */
export const trim=(str)=>{
	return str.replace(/^\s+|\s+$/gm,'');
};

/*
 * String转Json
 */
export const StringToJson=(obj)=>{
	if(isString(obj)){
		try{
			return JSON.parse(obj);
		}catch(e){
			return obj;
		};
	}else{
		return obj;
	};
};

/*
 * Json转String
 */
export const JsonToString=(obj)=>{
	return (isPlainObject(obj)||isArray(obj))?JSON.stringify(obj):(obj+'');
};

/*
 * 深度拷贝
 */
export const extend=function(){
    let options,name,src,copy,copyIsArray,clone,target=arguments[0]||{},
 		i=1,length=arguments.length,deep=false;
　　 if(isBoolean(target)){
		deep=target;
　　　　 target=arguments[1]||{};
　　　　 i=2;
	 };
	 if(!isPlainObject(target)&&!isFunction(target)){
		target={};
	 };
	 if(length===i){
		target={};
		--i;
	};
	 for(;i<length;i++){
		if((options=arguments[i])!=null){
			for(name in options){
				src=target[name];
				copy=options[name];
				if(target===copy){
					continue;
				};
				// if(deep&&copy&&(isPlainObject(copy)||(copyIsArray=isArray(copy)))){
				// 	if(copyIsArray){
				// 		copyIsArray=false;
				// 		clone=src&&isArray(src)?src:[];
				// 	}else{
				// 		clone=src&&isPlainObject(src)?src:{};
				// 	};
				// 	target[name]=extend(deep,clone,copy);
				// }else if(copy!==undefined){
				// 	target[name]=copy;
				// };
				if(deep&&copy&&(isPlainObject(copy))){
					clone=src&&isPlainObject(src)?src:{};
					target[name]=extend(deep,clone,copy);
				}else if(copy!==undefined){
					target[name]=copy;
				};
			};
		};
	 };
 　　 return target;
};

/*
 * 保留n位小数,默认2位
 * 123.132  => 123.13
 */
export const setDecimalBit=(number,n)=>{
 	if(isNumber(number)){
 		number=(Math.round(number*Math.pow(10,n))*Math.pow(0.1,n)).toFixed(n);
 		number=number.split('.');
 		number=number[1]?[number[0],number[1].slice(0,n)].join('.'):number[0];
        if(!n){
            number=parseInt(number);
        };
 	};
 	return number;
 };

/*
 * 数组求和(递加|递减),默认递加
 * @s add=>递增 minus=>递减
 * [1,2,3]  => 6  => -4
 */
export const getArraySum=(obj,s='add')=>{
	return isArray(obj)&&obj.length>0?eval(obj.join({add:String.fromCharCode(43),minus:String.fromCharCode(45)}[s])):obj;
};

/*
 * 格式化数字  1=>01 =>001
 * @s 前缀几个0
 */
export const prefixNumber=(number,s=1)=>{
	return isNumber(number)&&number<Math.pow(10,s)?new Array(s+1).join('0').concat(number).substring(number.toString().length-1):number;
};

/*
 * 获取日期信息
 */
export const getDateInfo=(date)=>{
	date=date||new Date();
	return {
		year:date.getFullYear(),
		month:date.getMonth()+1,
		day:date.getDate(),
		hour:date.getHours(),
		minute:date.getMinutes(),
		second:date.getSeconds(),
		weekend:date.getDay()
	};
};

/*
 * 格式化日期
 * @format YYYY-MM-DD hh:mm:ss
 */
export const formatDate=(date,format)=>{
	let info=getDateInfo(date),
		map={
			Y:'year',
		    M:'month',
		    D:'day',
		    h:'hour',
		    m:'minute',
		    s:'second'
		};
	format=format||'YYYY-MM-DD hh:mm:ss';
	format=trim(format).replace(/[A-Za-z]{1,}/g,function(a,b,c,d){
		let key,value=a;
		if(a&&(key=map[a.substr(0,1)])){
			value=info[key];
			if(value>100&&a.length<4){
				value=value.toString().slice(-2);
			};
			return prefixNumber(value);
		};
		return a;
	});
	return format;
};

/*
 * 匹配数组中value对应索引
 * getArrayIndex([1,2,3,4,5,'11'],2)  ==> 1
 */
export const getArrayIndex=(arr,value)=>{
	if(!isArray(arr)){
		return null;
	};
	arr=arr.toString();
	return arr.indexOf(value)>=0?arr.replace(new RegExp('((^|,)'+value+'(,|$))','gi'),'$2@$3').replace(/[^,@]/g,'').indexOf('@'):-1;
};

/*
 * 格式化手机号码
 * 13418781234   =>  134 1878 1234
 */
export const formatTellphone=(tellphone)=>{
	tellphone=tellphone.toString().split('');
	tellphone.splice(3,0,String.fromCharCode(32));
	tellphone.splice(8,0,String.fromCharCode(32));
	return tellphone.join('')
};

/*
 * 格式化银行卡号
 * @card卡号 string
 * @m 分割位，默认为4
 * 6222023409027876531  =>  6222 0234 0902 7876 531
 */
export const formatCard=(card,m=4)=>{
	if(isString(card)){
		for(var i=0,str='';i<card.length;i+=m){
			str+=card.substr(i,m-1)+card.charAt(i+m-1).concat(String.fromCharCode(32));
		};
		return trim(str);
	};
	return card;
};

/*
 * 格式化数字 =>13,234,234.89 =>9,872,980.00 =>9,872,900
 * @s 保留n位小数
 */
export const formatNumber=(num,s=2)=>{
	if(isNumber(num)){
		num=setDecimalBit((num),s);
		num=num.toString().split('.');
		let m=num[0].split('').reverse(),d;
		for(let i=1,j=0,q=Math.ceil(m.length/3);i<q;i++){
			m.splice(3*i+j,0,',');
			j++;
		};
		m=m.reverse().join('');
		if(num[1]){
			m=[m,num[1]].join('.');
		};
		return m;
	};
	return num;
};

/*
 * 金额转大写
 */
export const numberToChinese=(number)=>{
	if(isNumber(number)){
		var AA=['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'],
			BB=['','拾','佰','仟','万','亿','圆',''],
			CC=['角', '分', '厘'];
		var a =number.toString().replace(/(^0*)/g, '').split('.'), k = 0, re = '';
		for(var i=a[0].length-1;i>=0;i--){
			switch(k){
				case 0 : re = BB[7] + re; break;
				case 4 : !new RegExp('0{4}\\d{'+ (a[0].length-i-1) +'}M').test(a[0])&&(re = BB[4] + re); break;
				case 8 : re = BB[5] + re; BB[7] = BB[5]; k = 0; break;
			};
			if(k%4 == 2 && a[0].charAt(i)=='0' && a[0].charAt(i+2) != '0') re = AA[0] + re;
			if(a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k%4] + re; k++;
		};
		if(a.length>1){
			re+=BB[6];
			for(var i=0;i<a[1].length;i++){
				re+= AA[a[1].charAt(i)]+CC[i];
				if(i==2) break;
			};
		}else{
			re+='圆整';
		};
		return re;
	};
	return number;
};

/*
 * 隐藏银行卡号|手机号
 * 6222023409027876531 => 6222***********6531
 * 13412345678 => 134****5678
 */
export const hidePanCard=(pan,m=4)=>{
	if(isString(pan)&&(pan=trim(pan)).length>=11){
		return pan.substr(0,m).concat(new Array(pan.length-3-m).join(String.fromCharCode(42))).concat(pan.slice(-4));
	};
	return pan;
};

/*
 * 操作查询url字符串
 */
export const query=(key,href)=>{
	href=(href||window.location.href.replace(window.location.origin,'')).split('?');
	if(href){
		let reg=new RegExp('(^|&)'+key+'=([^&]*)(&|$)','i');
		for(let i=0;i<href.length;i++){
			let str=href[i];
			if(str&&str.length){
				str=str.match(reg);
				if(str){
					return decodeURIComponent(str[2]);
				};
			};
		};
	};
	return null;
};

/*
 * 获取字符串长度,英文占0.5个
 */
export const getStrLength=(str)=>{
	if(str&&str.toString().length){
		str=str.split('');
		let ch=/^[\u4e00-\u9fa5]+$/,
			reg=/[\-,\/,\|,\$,\+,\%,\&,\',\(,\),\*,\x20-\x2f,\x3a-\x40,\x5b-\x60,\x7b-\x7e,\x80-\xff,\u3000-\u3002,\u300a,\u300b,\u300e-\u3011,\u2014,\u2018,\u2019,\u201c,\u201d,\u2026,\u203b,\u25ce,\uff01-\uff5e,\uffe5]/;
		for(var i=0,n=0;i<str.length;i++){
			n+=ch.test(str[i])||reg.test(str[i])?1:0.5;
		};
		return n;
	}else{
		return 0;
	};
};

/*
 * 根据传入参数返回多级对象内部的list
 */
export const getObjResult=(data,key,index=0)=>{
    key=isArray(key)?key:key.split('.');
	if(isArray(data)){
		return data;
	}else if(isPlainObject(data)){
		if(index+1<key.length){
			return getObjResult(data[key[index]],key,++index);
		}else{
			return data[key[index]];
		};
	}else{
		return null;
	};
};

/*
 * 随机生成uid
 */
export const createRandomUid=()=>{
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
		let r=Math.random()*16|0,
			v=c=='x'?r:(r&0x3|0x8);
		return v.toString(16);
	});
};
