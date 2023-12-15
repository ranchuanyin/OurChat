<script setup>
import {Close, FullScreen, Minus} from "@element-plus/icons-vue";
import {onMounted} from "vue";
import {useStore} from "@/stores";
import router from "@/router";


const { ipcRenderer } = require('electron');
const store = useStore()
onMounted(
    () => {
      var max = document.getElementById('max');
      if (max) {
        max.addEventListener('click', () => {
          //发送最大化命令
          ipcRenderer.send('window-max');
          //最大化图形切换
        })
      }

      var min = document.getElementById('min');
      if (min) {
        min.addEventListener('click', () => {
          //发送最小化命令
          ipcRenderer.send('window-min');
        })
      }

      var close = document.getElementById('close');
      if (close) {
        close.addEventListener('click', () => {
          //发送关闭命令
          ipcRenderer.send('window-close');
        })
      }
    }
)

</script>

<template style="position: relative">
  <div class="win-icon icon-white" id="min" style="right: 6vw;text-align: center">
    <el-icon >
      <Minus/>
    </el-icon>
  </div>
  <div class="win-icon icon-white" id="max" style="right: 3vw;text-align: center">
    <el-icon >
      <FullScreen/>
    </el-icon>
  </div>
  <div class="win-icon icon-red" id="close" style="right: 0;text-align: center">
    <el-icon >
      <Close/>
    </el-icon>
  </div>
  <router-view/>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}

body, html {
  margin: 0;
  padding: 0;
}
.win-icon{
  height: 20px;
  width: 30px;
  position: absolute;z-index: 5;top: 0;
  opacity: 0.8;
}
.icon-white:hover{
  background-color: rgba(228, 228, 228, 0.76);
}
.icon-red:hover{
  background-color: #ee0808;
}
</style>