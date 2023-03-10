<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
    <div class="app_grid-column-container flex-row align-stretch">
        <div class="app_grid-column-menu">
            <div class="app_grid-column-menu-item" :class="{ active: index == activeIndex }" :key="index"
                v-for="(title, index, i) in getMenuKey" @click="change(index)">
                <i class="iconfont icon" :class="getIcon[index]"></i>
                <span>{{ title }}</span>
            </div>
        </div>
        <div class="app_grid-column-content" v-if="activeIndex == 0 && getFilterFlag" @change-save="clear">
            <column-filter :list="list" :col="col" :is-expand="isExpand"></column-filter>
        </div>
        <div class="app_grid-column-content" v-if="activeIndex == 1" @change-save="clear">
            <column-check :list="visibleList" :col="col" :is-expand="isExpand"></column-check>
        </div>
        <div class="app_grid-column-content" v-else-if="!isExpand && activeIndex == 2" @change-save="clear">
            <column-radio :value="col.locked" :col="col" :is-expand="isExpand"></column-radio>
        </div>
        <div class="app_grid-column-content" v-else-if="activeIndex == 3" @change-save="clear">
            <column-order :list="orderList" :col="col" :is-expand="isExpand"></column-order>
        </div>
    </div>
</template>

<script>
import columnCheck from './src/check';
import columnOrder from './src/order';
import columnRadio from './src/radio';
import columnFilter from './src/filter';

export default {
    data() {
        return {
            activeIndex: null
        };
    },
    props: {
        /*
         * 是否子表格折叠
         */
        isExpand: '',
        /*
         * 行数据
         */
        list: Array,
        /*
         * 所属列
         */
        col: Object,
        /*
         * 排序列表
         */
        orderList: '',
        /*
         * 显示隐藏列表
         */
        visibleList: '',
        /*
         * 是否显示排序
         */
        showOrder: Boolean,
        /*
         * 表格状态
         */
        tableStatus: Boolean
    },
    computed: {
        getFilterFlag() {
            return 'input|textarea|select|calendar|cascader|auto-complete'.split('|').indexOf(this.col.type) !== -1 && this.list && this.list.length && this.tableStatus;
        },
        getIcon() {
            return {
                0: 'icon-loudou',
                1: 'icon-closed',
                2: 'icon-suoding',
                3: 'icon-icon-'
            };
        },
        getMenuKey() {
            let o = {
                1: '显示隐藏'
            };
            if (!this.isExpand) {
                o['2'] = '解锁';
            };
            if (this.getFilterFlag) {
                o['0'] = '筛选';
            };
            if (this.showOrder) {
                o['3'] = '排序';
            };
            return o;
        }
    },
    methods: {
        /*
         * 选择菜单
         */
        change(index) {
            if (index != this.activeIndex) {
                this.activeIndex = index;
                this.$nextTick(() => {
                    this.$parent.popperJS.update();
                });
            };
        },
        /*
         * 清除
         */
        clear() {
            this.activeIndex = null;
        }
    },
    components: {
        columnCheck,
        columnOrder,
        columnRadio,
        columnFilter
    },
}
</script>
