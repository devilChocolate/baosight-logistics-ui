/*
 * grid插件
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import Vue from 'vue';
import grid from './src';
import column from './src/column';

Vue.component(grid.name,grid);
Vue.component(column.name,column);

export default grid;
