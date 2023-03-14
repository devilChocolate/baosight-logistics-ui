<template>
  <div id="app">
    <div id="app-main-section" class="app-main">
      <table-view></table-view>
    </div>
  </div>
</template>

<script>
import tableView from './views/tableView.vue'
export default {
  components: { tableView },
  name: 'App',
  created(){
    //console.log(this.$$loading,'this.$$loading');
  }
}
</script>

