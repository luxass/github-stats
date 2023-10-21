<script setup lang="ts">
const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <nav class="flex items-center justify-between flex-wrap">
    <div class="flex gap-2 items-center">
      <Icon name="octicon:mark-github" size="32" />
      <h1>github-stats</h1>
    </div>

    <div class="flex items-center justify-between gap-2">
      <NuxtLink href="https://github.com/luxass/github-stats">
        <Icon name="octicon:mark-github" size="24" />
      </NuxtLink>

      <button title="Toggle Dark Mode" class="ml1 text-lg op-50 hover:op-75" @click="toggleDark()">
        <ClientOnly>
          <Icon :name="isDark ? 'carbon:sun' : 'carbon:moon'" size="24" />

          <template #fallback>
            <Icon name="iconoir:question-mark" size="24" />
          </template>
        </ClientOnly>
      </button>
    </div>
  </nav>
  <div class="flex items-center justify-center flex-1">
    <div class="border border-dashed border-neutral-700 rounded p-8">
      <h1 class="text-3xl mb-8">
        GitHub Readme Stats
      </h1>
      <p>
        Archived repository, please use
        <NuxtLink to="https://github.com/anuraghazra/github-readme-stats" class="underline underline-offset-5">
          GitHub Readme Stats
        </NuxtLink>instead.
      </p>
    </div>
  </div>
  <footer class="text-center">
    <samp>this site is not affiliated with <NuxtLink href="https://github.com" target="_blank" rel="noopener noreferrer"><span class="italic">GitHub</span></NuxtLink> in any way.</samp>
  </footer>
</template>
