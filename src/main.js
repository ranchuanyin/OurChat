
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import axios from "axios";

const app = createApp(App)

app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})
axios.defaults.baseURL = "http://localhost:8080"
axios.defaults.headers.common["Authorization"] = localStorage.getItem("SCHOOL_CAT_TOKEN")

app.use(createPinia().use(piniaPluginPersistedstate))
app.mount('#app')
