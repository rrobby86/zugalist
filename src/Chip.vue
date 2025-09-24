<template>
  <div class="relative w-fit md:py-1 flex flex-row items-center">
    <div
      class="absolute size-6 md:size-8 rounded-full md:bg-slate-300 flex flex-row justify-center items-center"
    >
      <div class="text-lg md:text-xl" :class="iconClass"></div>
    </div>
    <div
      class="ml-3 pl-3 md:pl-6 md:pr-2 md:bg-slate-800 md:text-white rounded-full font-bold text-sm"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ iconClass?: string }>()
defineSlots<{ default: any }>()
</script>
