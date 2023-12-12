<script setup>
import {useStore} from "@/stores";

const store = useStore();
store.auth.user = null
</script>

<template>
    <router-view/>
</template>

<style>
*{
  margin: 0;
  padding: 0;
}
body,html{
    margin: 0;
    padding: 0;
}
</style>