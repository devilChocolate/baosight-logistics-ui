/*
 * 日历-混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
 import {
     getDateInfo
 } from '@/utils/tool';

 let shortcuts=function(type){
     return {
         daterange:[
             {
                 text: '本月',
                 onClick:picker=>{
                     let start=new Date(),
                         end=new Date();
                     start.setDate(1);
                     let endMonth=end.getMonth(),
                         nextMonth=++endMonth,
                         nextMonthFirstDay=new Date(end.getFullYear(),nextMonth,1);
                     //end=new Date(nextMonthFirstDay-1000*60*60*24);
                     picker.$emit('pick',[start,end]);
                 }
             },
             {
                 text: '今年至今',
                 onClick:picker=>{
                     let start=new Date(),
                         end=new Date();
                     start.setMonth(0);
                     start.setDate(1);
                     picker.$emit('pick',[start,end]);
                 }
             },
             {
                 text: '最近3天',
                 onClick:picker=>{
                     this.setPickerDay(picker,3);
                 }
             },
             {
                 text: '最近1周',
                 onClick:picker=>{
                     this.setPickerDay(picker,7);
                 }
             },
             {
                 text: '最近1个月',
                 onClick:picker=>{
                     this.setPickerMonth(picker,1);
                 }
             },
             {
                 text: '最近3个月',
                 onClick:picker=>{
                     this.setPickerMonth(picker,3);
                 }
             },
             {
                 text:'最近6个月',
                 onClick:picker=>{
                     this.setPickerMonth(picker,6);
                 }
             },
             {
                 text:'最近1年',
                 onClick:picker=>{
                     this.setPickerMonth(picker,12);
                 }
             }
         ],
         date:[
             {
                 text: '今天',
                 onClick:picker=>{
                     picker.$emit('pick',new Date());
                 }
             },
             {
                 text: '昨天',
                 onClick:picker=>{
                     picker.$emit('pick',this.setPickerDay(null,1)[0]);
                 }
             },
             {
                 text: '3天前',
                 onClick:picker=>{
                     picker.$emit('pick',this.setPickerDay(null,3)[0]);
                 }
             },
             {
                 text: '1周前',
                 onClick:picker=>{
                     picker.$emit('pick',this.setPickerDay(null,7)[0]);
                 }
             },
             {
                 text:'1个月前',
                 onClick:picker=>{
                     picker.$emit('pick',this.setPickerMonth(null,1)[0]);
                 }
             },
             {
                 text:'3个月前',
                 onClick:picker=>{
                     picker.$emit('pick',this.setPickerMonth(null,3)[0]);
                 }
             },
             {
                 text:'6个月前',
                 onClick:picker=>{
                     picker.$emit('pick',this.setPickerMonth(null,6)[0]);
                 }
             },
             {
                 text:'1年前',
                 onClick:picker=>{
                     picker.$emit('pick',this.setPickerMonth(null,12)[0]);
                 }
             }
         ]
     }[type];
 };

 export default {
     data(){
         return {

         };
     },
     props:{

     },
     computed:{
         pickerOptions(){
             return {
                 disabledDate:time=>{
                    // let now=getDateInfo(),
                    //     next=new Date(now.year,now.month,1).getTime(),
                    //     prev=new Date(now.year,now.month-3,1).getTime();
                    // time=time.getTime();
                    // return type=='month'&&(time<prev||time>=next);
                    if(this.pickerFilter){
                        return this.pickerFilter(time,this.calendarType);
                    };
                 },
                 shortcuts:shortcuts.call(this,this.calendarType)
             };
         }
     },
     watch:{

     },
     mounted(){

     },
     methods:{
         setPickerMonth(picker,len=0){
             let start=new Date(),
                 end=new Date();
             start.setMonth(start.getMonth()-len);
             if(picker){
                 picker.$emit('pick',[start,end]);
             }else{
                 return [start,end];
             };
         },
         setPickerDay(picker,len=0){
             let start=new Date(),
                 end=new Date();
             start.setTime(start.getTime()-3600*1000*24*len);
             if(picker){
                 picker.$emit('pick',[start,end]);
             }else{
                 return [start,end];
             };
         }
     },
     components:{

     },
     beforeDestroy(){

     }
 };
