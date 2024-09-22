<script setup>
import NavigationBar from "@/views/NavigationBar.vue";

</script>

<template>
  <div style="display: flex; flex-direction: row">
    <NavigationBar/>
    <router-view />
  </div>

</template>

<style scoped>

</style>