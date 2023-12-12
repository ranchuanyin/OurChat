<template>
      <el-row style="width: 100vw;height: 100vh;overflow: hidden">
        <el-col :lg="17" :md="17" :sm="14" :span="18" :xl="17" class="hidden-xs-only" style="height: 100%">
            <div style="flex: 1;">
                <el-image fit="cover"
                          src="https://www.ourcatimg.top/avatar/2257a3401d59fa5f2985f75796ed6e0f.jpg"
                          style="width: 100%;height: 100%;"></el-image>
            </div>
        </el-col>

        <el-divider class="hidden-xs-only" border-style="double" direction="vertical" style="height: 100%"/>
        <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="2">
          <el-row class="hidden-sm-and-up" justify="center">
            <el-col :span="5">
            </el-col>
          </el-row>

          <div style="height: 100vh;background-color: white">
            <router-view v-slot="{ Component }">
              <transition name="el-fade-in-linear">
                <component :is="Component" style="height: 100%"/>
              </transition>
            </router-view>
          </div>
        </el-col>
      </el-row>
</template>

<script setup>
import 'element-plus/theme-chalk/display.css'
</script>

<style scoped>
</style>