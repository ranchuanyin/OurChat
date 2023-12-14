<script setup>
import {Close, FullScreen, Minus} from "@element-plus/icons-vue";
import {onMounted} from "vue";

const { ipcRenderer } = require('electron');

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
  <div class="win-icon" id="min" style="right: 7vw;">
    <el-icon style="left:20%;top:50%;">
      <Minus/>
    </el-icon>
  </div>
  <div class="win-icon" id="max" style="right: 4vw;">
    <el-icon style="left:20%;top:50%;">
      <FullScreen/>
    </el-icon>
  </div>
  <div class="win-icon" id="close" style="right: 1vw;">
    <el-icon style="left:20%;top:50%;">
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
  width: 2vw;
  position: absolute;z-index: 5;top: 0;
  opacity: 0.8;
}
.win-icon:hover{
  background-color: red;
}
</style>