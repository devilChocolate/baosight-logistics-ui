/*
 * 配置config列表
 *
 * @Author: 谢力
 * @Date:   2018-11-08 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-08 14:08:56
 */
import axios from './src/axios';
import base from './src/base';
import loading from './src/loading';
import page from './src/page';
import result from './src/result';
import style from './src/style';
import tool from './src/tool';

export default {
    ...axios,
    ...base,
    ...loading,
    ...page,
    ...result,
    ...style,
    ...tool
};
