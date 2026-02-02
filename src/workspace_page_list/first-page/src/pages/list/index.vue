<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import { useRouter } from 'vue-router';

const router = useRouter();

async function back() {
  router.back();
}

</script>

<template>
  <div class="container">
    <h3>list page</h3>
    <ul>
      <li><router-link to="/">back to home use router-link</router-link></li>
      <li><button @click="back">back use $route.back</button></li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
