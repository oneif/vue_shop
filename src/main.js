import Vue from "vue"
import App from "./App.vue"
import router from "./router"

// 导入全局样式表
import "./assets/css/global.css"
// 导入elementUI
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
// 二次封装axios
import api from "./api/index.js"
// 导入树形表格
import treeTable from "vue-table-with-tree-grid"
// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor"

// 导入对应css
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$api = api
Vue.use(treeTable)
Vue.use(VueQuillEditor)

// 注册全局时间过滤器
Vue.filter("dateFormat", function (originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + "").padStart(2, "0")
    const d = (dt.getDate() + "").padStart(2, "0")

    const hh = (dt.getHours() + "").padStart(2, "0")
    const mm = (dt.getMinutes() + "").padStart(2, "0")
    const ss = (dt.getSeconds() + "").padStart(2, "0")
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App),
    beforeCreate () {
        Vue.prototype.$bus = this // 安装全局事件总线
    }
}).$mount("#app")
