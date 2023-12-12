<template>
    <el-row align="middle" style="height: 8vh">
        <el-row>
            <el-col style="margin-left: 1vw">
                <div style="font-weight: bolder;font-size: 100%">{{ user.username }}</div>
            </el-col>
        </el-row>
    </el-row>
    <el-divider style="margin: 0;"/>
    <el-row justify="start" style="height: 60%;width: 100%">
        <el-col>
            <div ref="scrollContainer" style="height:350px;overflow-y: auto;">
                <div v-for="one in message.message">
                    <el-row v-if="one.fromUserId == user.id" style="margin: 2%">
                        <el-col :span="2">
                            <el-row justify="center">
                                <el-avatar :src="one.avatar"/>
                            </el-row>
                        </el-col>
                        <div style="margin-left: 2px">
                            <el-row>
                                <el-col>
                                    <el-text>{{ one.messageUser }}</el-text>
                                </el-col>
                                <div v-if="one.type == 1"
                                     style="background-color: white;padding: 8px;border-radius: 8px;max-width: 300px;">
                                    {{ one.message }}
                                </div>
                                <n-image v-else-if="one.type == 2"
                                         :src="one.message"
                                         width="150"
                                />
                            </el-row>
                        </div>
                    </el-row>

                    <el-row v-else-if="one.toUserId == user.id" justify="end" style="margin: 2%">
                        <div v-if="one.type == 1"
                             style="background-color: white;padding: 8px;border-radius: 8px;max-width: 300px">
                            {{ one.message }}

                        </div>
                        <n-image v-else-if="one.type == 2"
                                 :src="one.message"
                                 width="150"
                        />
                        <el-col :span="2">
                            <el-row justify="center">
                                <el-avatar :src="store.auth.user.avatar"/>
                            </el-row>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-col>
    </el-row>

    <el-divider style="margin: 0;"/>

    <div v-show="appear" class="text-area" style="height: 18vh;padding: 5px">
        <div v-show="appear">
            <el-upload
                :headers="headerObj"
                :on-success="handle_success"
                :show-file-list="false"
                action="http://localhost:8080/cat/upload/avatar-img"
                style="margin-left: 5px"
            >
                <el-icon>
                    <PictureFilled/>
                </el-icon>
            </el-upload>
        </div>
        <V3Emoji
            v-model="messageContent"
            :textArea="true"
        />
        <el-row justify="end" style="margin-top: 3px">
            <el-col :span="3" @keyup.enter="clickSendMessage()">
                <el-button v-show="appear" :disabled="(messageContent == null || messageContent == '')"
                           style="height: 30px;float: right" type="primary" @click="clickSendMessage()">
                    发送
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import {ElMessage} from "element-plus";
import {nextTick, reactive, ref, watch} from 'vue'
import {useStore} from '@/stores'
import {postJson} from "@/net";
import {NImage} from "naive-ui";
import {PictureFilled} from "@element-plus/icons-vue";
import V3Emoji from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'

const headerObj = {
    Authorization: localStorage.getItem("SCHOOL_CAT_TOKEN")
}

const emit = defineEmits(['newMessage'])
const appear = ref(false)
const store = useStore()
const props = defineProps(["user", "messageList"])
const user = props.user
const messageList = ref([])
const message = reactive({
    id: 0,
    message: [],
    newMessage: ''
})

class Message {
    // 构造函数，在创建对象时初始化对象的属性
    constructor(fromUserId, toUserId, message, type) {
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.message = message;
        this.messageDate = new Date();
        this.type = type;
    }
}

const messageContent = ref('')
const scrollContainer = ref(null)


watch(() => messageList.value, () => {
    nextTick(() => {
        scrollContainer.value.lastElementChild.scrollIntoView()
    })
}, {
    deep: true//深度监听
})


messageList.value = props.messageList

const getMessageById = (id) => {
    message.id = id
    if (messageList.value.length === 0) {
        return
    }
    message.message = messageList.value.filter(one => one.fromUserId == message.id || one.toUserId == message.id)
    if (message.message == null || message.message == '') {
        return
    }
    emit('newMessage', message.message.slice(-1)[0].message)
}
watch(
    () => messageList.value.length,
    () => {
        getMessageById(user.id)
    }
)
watch(
    () => user.id,
    () => {
        nextTick(() => {
            scrollContainer.value.lastElementChild.scrollIntoView()
        })
        appear.value = true
        getMessageById(user.id)
    }
)
//---------------------------------发送信息----------------------------------
const clickSendMessage = () => {
    if (messageContent.value == null || messageContent.value == '') {
        ElMessage.warning("发送内容为空")
        return;
    }
    if (!store.userList.userList.some(one => one.id == user.id)) {
        let find = store.friendList.friendList.find(one => one.id == user.id);
        store.userList.userList.push(find)
    }
    let message = messageContent.value
    console.log(message)
    const sendMessage = new Message(store.auth.user.id, user.id, messageContent.value, 1);
    messageList.value.push(sendMessage)
    messageContent.value = ''
    let one = store.userList.userList.find(one => one.id == user.id.toString())
    one.newMessage = message
    one.newMessageName = ''
    if (user.isGroup == false) {
        postJson('/cat/message/pushOne', {
            fromUserId: store.auth.user.id.toString(),
            toUserId: user.id.toString(),
            username: user.username,
            message: message,
            avatar: store.auth.user.avatar,
            type: 1
        }, (data) => {

        }, (data) => {

        })
    } else {
        postJson('/cat/message/pushGroup', {
            messageUserId: store.auth.user.id.toString(),
            messageUser: store.auth.user.username,
            groupId: user.id.toString(),
            username: user.username,
            message: message,
            avatar: store.auth.user.avatar,
            type: 1
        }, (data) => {

        }, (data) => {

        })
    }
}
//-----------------------------------------发送图片---------------------------------
const handle_success = (response) => {
    if (!store.userList.userList.some(one => one.id == user.id)) {
        let find = store.friendList.friendList.find(one => one.id == user.id);
        store.userList.userList.push(find)
    }
    let message = response.data
    const sendMessage = new Message(store.auth.user.id, user.id, response.data, 2);
    messageList.value.push(sendMessage)
    let one = store.userList.userList.find(one => one.id == user.id.toString())
    one.newMessage = '图片'
    one.newMessageName = ''
    if (user.isGroup == false) {
        postJson('/cat/message/pushOne', {
            fromUserId: store.auth.user.id.toString(),
            toUserId: user.id.toString(),
            username: user.username,
            message: message,
            avatar: store.auth.user.avatar,
            type: 2
        }, (data) => {

        }, (data) => {

        })
    } else {
        postJson('/cat/message/pushGroup', {
            messageUserId: store.auth.user.id.toString(),
            messageUser: store.auth.user.username,
            groupId: user.id.toString(),
            username: user.username,
            message: message,
            avatar: store.auth.user.avatar,
            type: 2
        }, (data) => {

        }, (data) => {

        })
    }
}
</script>

<style scoped>
.el-row[contenteditable="true"] {
    outline: none; /* 取消选中时的边框 */
}

::-webkit-scrollbar {
    width: 12px;
}
</style>