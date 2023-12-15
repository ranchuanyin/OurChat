import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import axios from "axios";
import VueVirtualScroller from 'vue-virtual-scroller'



const app = createApp(App)

app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})
axios.defaults.baseURL = "https://www.ourcats.top:8080"
axios.defaults.headers.common["Authorization"] = localStorage.getItem("SCHOOL_CAT_TOKEN")
app.use(VueVirtualScroller)
app.use(createPinia().use(piniaPluginPersistedstate))
app.mount('#app')
