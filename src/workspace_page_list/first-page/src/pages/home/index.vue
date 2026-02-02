<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function push() {
  router.push('/list');
}

function forward() {
  router.forward();
}

</script>

<template>
  <div class="container">
    <h3>Home page</h3>
    <ul>
      <!-- <li><a href="/demo/nest-route-demo/list">to list use a link</a></li> -->
      <li><router-link to="/list">to list use route linker</router-link></li>
      <li><button @click="push">to list use router.push</button></li>
      <!-- 不行，vue-router 不响应原生 pushState -->
      <!-- <li><button @click="pushState">to list use history.pushState</button></li> -->
      <li><button @click="forward">forward use $route.back</button></li>
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
