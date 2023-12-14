<template>
    <el-row style="width: 100vw;height: 100vh;overflow: hidden">
        <el-col :lg="15" :md="15" :sm="15" :span="18" :xl="16" class="hidden-xs-only" style="height: 100%;-webkit-app-region: drag;
  -webkit-user-select: none;">
            <div style="flex: 1;width: 100%;height: 100%;">
                <el-image fit="cover"
                          src="https://www.ourcatimg.top/avatar/2257a3401d59fa5f2985f75796ed6e0f.jpg"
                          style="width: 100%;height: 100%;"></el-image>
            </div>
        </el-col>
        <el-divider border-style="double" class="hidden-xs-only" direction="vertical" style="height: 100%;margin: 0"/>
        <el-col :lg="8" :md="8" :sm="8" :span="6" :xl="7">
            <router-view v-slot="{ Component }">
                <transition mode="out-in" name="el-fade-in-linear">
                    <component :is="Component"/>
                </transition>
            </router-view>
        </el-col>
    </el-row>
</template>

<script setup>
import 'element-plus/theme-chalk/display.css'
</script>

<style scoped>
</style>