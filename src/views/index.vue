<template>
  <Chat :messageList="messageList" style="height: 100vh;width: 100vw;"/>
</template>

<script setup>
import "../assets/index.css"
import {onMounted, watch} from "vue";
import {useStore} from "@/stores"
import {get} from "@/net";
import Chat from "@/components/Chat.vue";

const store = useStore();
const messageList = store.messageList
const {ipcRenderer} = require('electron');

let client;
let socket;
// 判断当前浏览器是否支持webSocket

onMounted(
    () => {
        getFriendList()
        websocketConnect()
    }
)

watch(
    () => store.messageList.length,
    () => {
        if (store.messageList.length >= 100000) {
            store.messageList.splice(0, 100)
        }
    }
)

function getFriendList() {
    if (store.friendList.friendList != null) {
        return;
    }
    get(`/cat/message/getFriendList/${store.auth.user.id}`, (data) => {
        store.friendList.friendList = data.data
        if (localStorage.getItem(`friendList:${store.auth.user.id}`) == null) {
            let newArray = store.friendList.friendList.map(obj => obj.avatar);
            ipcRenderer.send("avatarList", newArray)
      localStorage.setItem(`friendList:${store.auth.user.id}`, '1')
    }
  }, (data) => {

  })
}
const websocketConnect = () => {
  if (window.WebSocket) {
    socket = new WebSocket("wss://www.ourcats.top/webSocket")
    getMessage()
    // 相当于channel的read事件，ev 收到服务器回送的消息
    socket.onmessage = function (ev) {
      let message = JSON.parse(ev.data)
      if (message.message !== undefined) {
        if (!store.userList.userList.some(one => one.id == message.fromUserId)) {
          let find = store.friendList.friendList.find(one => one.id == message.fromUserId);
          if (find == null) {
            get(`/cat/user/${message.fromUserId}`, (data) => {
              let user
              if (message.fromUserId[0] == 'G') {
                user = {
                  id: message.fromUserId,
                  avatar: data.data.avatar,
                  username: data.data.username,
                  isGroup: true,
                  level: 0,
                  newMessage: '',
                  newMessageName: ''
                }
              } else {
                user = {
                  id: message.fromUserId,
                  avatar: data.data.avatar,
                  username: data.data.username,
                  isGroup: false,
                  level: 0,
                  newMessage: ''
                }
              }
              store.userList.userList.push(user)
              let one = store.userList.userList.find(one => one.id == message.fromUserId)
              ++one.level
              if (message.type == 2) {
                one.newMessage = '图片'
              } else
                one.newMessage = message.message
              ipcRenderer.send('vue-message', {
                avatar: one.avatar,
                username: one.username,
                message: one.newMessage
              })
              one.newMessageName = message.messageUser
            })
          } else {
            store.userList.userList.push(find)
            let one = store.userList.userList.find(one => one.id == message.fromUserId)
            ++one.level
            if (message.type == 2) {
              one.newMessage = '图片'
            } else
              one.newMessage = message.message
            ipcRenderer.send('vue-message', {
              avatar: one.avatar,
              username: one.username,
              message: one.newMessage
            })
            one.newMessageName = message.messageUser
          }
        } else {
          let one = store.userList.userList.find(one => one.id == message.fromUserId)
          ++one.level
          if (message.type == 2) {
            one.newMessage = '图片'
          } else
            one.newMessage = message.message
          ipcRenderer.send('vue-message', {
            avatar: one.avatar,
            username: one.username,
            message: one.newMessage
          })
          one.newMessageName = message.messageUser
        }
        messageList.push(message)
        ++store.MessageNum
      }
    }
    // 相当于连接开启
    socket.onopen = function (ev) {
      console.log("连接开启了...")
      socket.send(
          JSON.stringify({
            // 连接成功将，用户ID传给服务端
            uid: store.auth.user.id
          })
      );
    }
    // 相当于连接关闭
    socket.onclose = function (ev) {
      console.log("连接关闭了...")
    }
  } else {
    alert("当前浏览器不支持webSocket")
  }
}

const getMessage = () => {
  get(`/cat/auth/message/${store.auth.user.id}`, (data) => {
    let list = data.data.map(one => one.fromUserId)
    messageList.push.apply(messageList, data.data)
    store.MessageNum = data.data.length
  }, (data) => {

  })

}


</script>
<style scoped>


</style>