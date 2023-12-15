<template>
    <el-row style="width: 100vw;height: 100vh;overflow: hidden">
        <el-col :lg="14" :md="14" :sm="14" :span="14" :xl="14" class="hidden-xs-only" style="height: 100%;-webkit-app-region: drag;
  -webkit-user-select: none;">
            <div style="flex: 1;width: 100%;height: 100%;">
                <el-image fit="cover"
                          src="https://www.ourcatimg.top/image/avatar/2257a3401d59fa5f2985f75796ed6e0f.jpg"
                          style="width: 100%;height: 100%;"></el-image>
            </div>
        </el-col>
        <el-col :lg="10" :md="10" :sm="10" :span="10" :xl="10">
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