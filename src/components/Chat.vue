<template>
  <div style="padding: 0;background-color: white;">
    <el-row style="height: 100%;">
      <el-col :span="2" style="background-color : #e4e4e4;">
        <el-row align="top" style="height: 100%;-webkit-app-region: drag;
  -webkit-user-select: none;">
          <el-col style="height: 10%;-webkit-app-region: no-drag">
            <el-row justify="center">
              <el-avatar :src="store.auth.user.avatar" style="margin-top: 35%" @click="logout()"/>
            </el-row>
          </el-col>
          <el-col style="height: 16%;-webkit-app-region: no-drag">
            <el-row justify="center" style="-webkit-app-region: no-drag" @click="showUser">
              <svg class="icon" height="32" p-id="1804" style="margin-top: 35%" t="1700119874796"
                   version="1.1" viewBox="0 0 1024 1024" width="32" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M781.057249 700.01639c35.385444-51.799415 55.965346-113.698966 55.965346-180.21401 0-182.092176-154.169444-329.70802-344.343727-329.708019S148.335141 337.720195 148.335141 519.812371 302.504585 849.52039 492.678868 849.52039c60.64078 0 117.605151-15.025327 167.08683-41.37959l142.530809 39.811122c6.623532 1.848195 12.807493-4.08601 11.219044-10.779473L781.057249 700.01639zM373.13561 552.790166a47.017085 47.017085 0 0 1-47.064039-0.00999 47.046057 47.046057 0 0 1-23.517034-40.770186c0.00999-22.827707 16.40398-42.368624 38.902009-46.324761 22.488039-3.956137 44.576468 8.801405 52.378849 30.260449 7.79239 21.459044-0.929093 45.425639-20.699785 56.844488z m160.743024-17.283122c-10.6496 18.44199-32.34841 27.4432-52.928312 21.938576-20.569912-5.504624-34.885932-24.136429-34.895922-45.43563h-0.589424a47.483629 47.483629 0 0 1 24.116448-40.770185c18.44199-10.6496 41.739239-7.582595 56.794537 7.472702 15.075278 15.055298 18.142283 38.352546 7.502673 56.794537z m142.710634-0.349659c-10.559688 18.41202-32.158595 27.4432-52.678556 22.018498s-34.845971-23.936624-34.925892-45.165893a47.345764 47.345764 0 0 1 23.38716-40.770185c18.362068-10.6496 41.579395-7.642537 56.614713 7.332839 15.045307 14.975376 18.162263 38.182712 7.602575 56.584741z"
                    fill="#040000" p-id="1805"></path>
              </svg>
            </el-row>
            <el-row justify="center" style="-webkit-app-region: no-drag" @click="showFriend">
              <svg class="icon" height="32" p-id="6689" style="margin-top: 35%"
                   t="1700136931940"
                   version="1.1" viewBox="0 0 1024 1024" width="32" xmlns="http://www.w3.org/2000/svg">
                <path class="selected"
                      d="M707.654621 852.250483a24.417103 24.417103 0 0 1-15.889655-6.779586l-92.654345-94.914207a78.918621 78.918621 0 0 1-22.598621-54.23669 70.091034 70.091034 0 0 1 22.598621-54.23669 72.386207 72.386207 0 0 1 103.953655 0l2.259862 2.259862 2.259862-2.259862a72.386207 72.386207 0 0 1 103.953655 0 78.918621 78.918621 0 0 1 22.598621 54.23669 70.091034 70.091034 0 0 1-22.598621 54.23669l-92.654345 94.914207c0.070621 4.519724-6.708966 6.779586-11.228689 6.779586z"
                      data-spm-anchor-id="a313x.search_index.0.i1.157d3a81iDRVW6"
                      fill="#d81e06"
                      p-id="6690"></path>
                <path class=""
                      d="M569.803034 752.816552c-24.858483-27.118345-20.338759-85.874759 0-112.993104a94.260966 94.260966 0 0 1 81.355035-38.417655 257.288828 257.288828 0 0 0-94.914207-40.606896 198.196966 198.196966 0 1 0-266.593103-185.379311 199.379862 199.379862 0 0 0 126.552275 185.379311A316.468966 316.468966 0 0 0 176.587034 820.612414c0 2.259862-2.259862 33.897931 29.378207 33.897931H664.717241c-29.378207-31.638069-61.016276-63.276138-94.914207-101.693793z"
                      data-spm-anchor-id="a313x.search_index.0.i0.157d3a81iDRVW6"
                      fill="#2c2c2c" p-id="6691"></path>
              </svg>
            </el-row>
          </el-col>
          <el-col style="height: 16%">

          </el-col>
          <el-col style="height: 16%">

          </el-col>
          <el-col style="height: 16%">

          </el-col>
          <el-col style="height: 16%">

          </el-col>
        </el-row>
      </el-col>
      <!-----------------------------人物列表----------------------------------->
      <el-col :span="5" style="background-color: white;user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select:none;">
        <el-row justify="center" style="padding: 3%;height: 7vh;width: 20vw;">
          <el-input v-model="input" placeholder="搜索" style="width: 10vw;height: 35px;"/>
          <el-button :icon="Search" style="width: 20px;margin-left: 5px;height: 35px;" @click="table = true"/>
        </el-row>
        <el-row style="margin-top: 1vh;">
          <el-divider style="margin: 0;width: 20vw;"/>
        </el-row>
        <n-scrollbar v-if="showUserList" style="max-height: 90vh">
          <div>
            <el-row v-for="user in store.userList.userList" :key="user.id" :class="{active: isActive === user.id}"
                    class="message" style="height: 11vh;" @click="getUser(user)">
              <el-col :span="6" style="padding-left: 5%">
                <el-avatar :size="45"
                           :src="user.avatar"/>
              </el-col>
              <el-col :span="17" style="padding-left: 8%">
                <div style="font-weight: bold">{{ user.username }}</div>
                <el-text class="w-100px mb-2" style="margin-top: 2%;max-width: 100px" truncated>
                  {{ user.newMessageName }} {{ user.newMessage }}
                </el-text>
                <n-badge :value="user.level" style="float: right;margin-top: 2%"/>
              </el-col>
            </el-row>
          </div>
        </n-scrollbar>
        <!----------------->
        <n-scrollbar v-if="showFriendList" style="max-height: 90vh">
          <div>
            <el-row v-for="user in store.friendList.friendList" align="middle" class="message"
                    style="height: 11vh;" @dblclick="getFriend(user)">
              <el-col :span="6" style="padding-left: 5%">
                <el-avatar :size="45"
                           :src="user.avatar"/>
              </el-col>
              <el-col :span="17" style="padding-left: 8%">
                <div style="font-weight: bold">{{ user.username }}</div>
              </el-col>
            </el-row>
          </div>
        </n-scrollbar>
      </el-col>
      <el-col :span="17" style="background-color: #f0f0f0;">
        <ChatBox :messageList="messageList" :user="user"/>
      </el-col>
    </el-row>
    <el-drawer
        v-model="table"
        direction="rtl"
        size="40%"
        title="添加好友/群"
    >
      <Friend/>
    </el-drawer>
  </div>
</template>

<script setup>
import {useStore} from "@/stores"
import {reactive, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import ChatBox from "@/components/ChatBox.vue";
import {NBadge, NScrollbar} from "naive-ui";
import router from "@/router";
import {ElMessage} from "element-plus";
import {get} from "@/net";
import Friend from "@/components/Friend.vue";

const store = useStore()
const props = defineProps(["messageList"])
const messageList = props.messageList
const showFriendList = ref(false)
const showUserList = ref(true)
const isActive = ref('')
const {ipcRenderer} = require('electron');
const table = ref(false)
const showFriend = () => {
  showUserList.value = false
  showFriendList.value = true
}

const logout = () => {
  get('/cat/auth/logout', (data) => {
    localStorage.removeItem("SCHOOL_CAT_TOKEN")
    ElMessage.success(data.message)
    store.auth.user = null
    store.messageList.length = 0
    store.userList.userList.length = 0
    store.friendList.friendList.length = 0
    router.push('/')
  })
}

const showUser = () => {
  showUserList.value = true
  showFriendList.value = false
}


const user = reactive({
  id: '',
  avatar: '',
  username: '',
  isGroup: ''
})


const input = ref(null)
const getUser = (one) => {
  user.id = one.id
  isActive.value = one.id
  user.avatar = one.avatar
  user.username = one.username
  user.isGroup = one.isGroup
  store.MessageNum = store.MessageNum - one.level
  one.level = 0;
}
const getFriend = (one) => {
  if (store.userList.userList.some(x => x.id == one.id)) {
    isActive.value = one.id
    showUserList.value = true
    showFriendList.value = false
    return;
  }
  isActive.value = one.id
  store.userList.userList.push(one)
  showUserList.value = true
  showFriendList.value = false
}

const openFriend = () => {
  ipcRenderer.send('open-friend-win')
}
</script>

<style scoped>
.message:hover {
  background-color: #e8e8e8;
}

.active {
  background-color: #e8e8e8;
}

.message {
  height: 10vh;
  padding-top: 5%;
  padding-bottom: 5%;
}

.icon:active {
  background-color: #d5d5d5;
}

.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>