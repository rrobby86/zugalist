<template>
  <div class="mx-auto w-full max-w-screen-lg relative p-4">
    <div>{{ allGames }}</div>
  </div>
</template>

<script setup lang="ts">
import allGames from "./games.json"
</script>

<style>
body {
  --at-apply: bg-blue-700 text-white font-default;
}
</style>
