import {reactive, ref} from 'vue'
import {defineStore} from 'pinia'

export const useStore = defineStore('store', () => {
    const auth = reactive({
        user: null,

    })
    const loginNum = reactive({
        loginNum: null
    })
    const isShowBarrage = reactive({
        isShowBarrage: true
    })
    const friendList = reactive({
        friendList: []
    })
    const userList = reactive({
        userList: []
    })
    const messageList = ref([])
    let MessageNum = ref(0)
    return {auth, loginNum, isShowBarrage, friendList, messageList, userList, MessageNum}
}, {
    persist: true
})
