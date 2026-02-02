<script setup lang="ts">
function stopAClickPopup(e: Event) {
  if (e.target instanceof HTMLElement) {
    if (e.target.getAttribute('href')) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
</script>

<template>
  <div @click="stopAClickPopup">
    <router-view />
  </div>
</template>