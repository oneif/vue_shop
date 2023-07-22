import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式表
import './assets/css/global.css'
// 导入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// 二次封装axios
import api from './api/index.js'
// 导入树形表格
import treeTable from 'vue-table-with-tree-grid'



Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$api = api
Vue.use(treeTable)

new Vue({
  router,
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this // 安装全局事件总线
  },
}).$mount('#app')
