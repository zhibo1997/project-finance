<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-dialog-provider>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
<script setup>
import naiveUI from "naive-ui";
const { zhCN, dateZhCN } = naiveUI;
const { NConfigProvider, NMessageProvider, NDialogProvider } = naiveUI;
</script>
