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

  <el-row v-show="appear" class="text-area" style="height: 25vh;padding: 5px">
    <el-col>
      <el-row>
        <el-col :span="1">
          <el-upload
              :headers="headerObj"
              :on-success="handle_success"
              :show-file-list="false"
              action="https://www.ourcats.top:8080/cat/upload/avatar-img"
              style="margin-top: 5px"
          >
            <el-icon size="20">
              <PictureFilled/>
            </el-icon>
          </el-upload>
        </el-col>
        <el-col :span="1" >
          <V3Emoji
              size="small"
              @click-emoji="appendText"
              style="margin: 0;padding: 0"
          >
          </V3Emoji>
        </el-col>
      </el-row>
    </el-col>
    <el-col>
      <el-input
          v-model="messageContent"
          :autosize="{ minRows: 3, maxRows: 4 }"
          type="textarea"
          style="height: 15vh"
          @keydown.enter.native.prevent="handleEnterKey($event)"
      />
    </el-col>
  </el-row>
  <el-row justify="end" style="margin-top: 3px">
    <el-col :span="3">
      <el-button v-show="appear" :disabled="(messageContent == null || messageContent == '')"
                 style="height: 30px;float: right" type="primary" @click="clickSendMessage()">
        发送
      </el-button>
    </el-col>
  </el-row>
</template>

<script setup>
import {ElMessage} from "element-plus";
import {nextTick, reactive, ref, watch} from 'vue'
import {useStore} from '@/stores'
import {postJson} from "@/net";
import {NImage, NInput} from "naive-ui";
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
const appendText = (val) => {
  messageContent.value += val;
};

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
messageList.value = props.messageList

//监听messageList的值，如果改变，则滑动到最底下
watch(() => messageList.value, () => {
  nextTick(() => {
    scrollContainer.value.lastElementChild.scrollIntoView()
  })
}, {
  deep: true//深度监听
})
//监听messageList的长度，发送改变时，寻找应该到谁的前端
watch(
    () => messageList.value.length,
    () => {
      getMessageById(user.id)
    }
)
//观察user的变化，滑动到最底下，并且获得这个user的消息
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

//获得发给该用户的消息
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

function handleEnterKey(e) {
  if (e.ctrlKey && e.keyCode == 13) { //用户点击了ctrl+enter触发
    messageContent.value += '\n';
  } else { //用户点击了enter触发
    clickSendMessage();
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

:deep(.el-textarea__inner) {
  border: 0;
  resize: none;
  background-color:#f0f0f0;
}
:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 0px;
}
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 0px;
}
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 0px;
}
</style>