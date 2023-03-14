/*
 * form插件
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import Vue from 'vue';
import form from './form';
import formItem from './src';

Vue.component(form.name,form);
Vue.component(formItem.name,formItem);

export default form;
