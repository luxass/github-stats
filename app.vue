<script setup lang="ts">
import "./styles/global.css";

useHead({
  title: "github stats",
});

useSeoMeta({
  description: "An archive of the github-stats project.",
  ogTitle: "github stats",
  ogDescription: "An archive of the github-stats project.",
});

defineOgImage({
  title: "github stats",
  description: "An archive of the github-stats project.",
  component: "Base",
});
</script>

<template>
  <div class="md:px14 py3 md:py10 flex flex-col h-full">
    <NuxtPage />
  </div>
</template>
