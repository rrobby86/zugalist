<template>
  <div class="mx-auto w-full max-w-screen-lg relative p-4">
    <div class="flex flex-row items-center gap-4 mb-10">
      <div class="size-24 md:size-32 shrink-0">
        <img src="./logo.png" />
      </div>
      <div class="grow-1">
        <h1 class="font-bold text-2xl">ZugaLista</h1>
        <div class="text-lg">Cerca tra i giochi della ludoteca di Zuga Remni</div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <select v-model="players" class="w-full bg-blue-300 text-black px-4 py-1 rounded-full">
        <option :value="null">Qualsiasi num. giocatori</option>
        <option v-for="p in [2, 3, 4, 5, 6, 7, 8, 9, 10]" :key="p" :value="p">
          {{ p }} giocatori
        </option>
      </select>
      <select
        v-model="complexityRange"
        class="w-full bg-blue-300 text-black px-4 py-1 rounded-full"
      >
        <option :value="null">Qualsiasi complessità</option>
        <option :value="[1, 2.5]">Leggeri (CR 1-2,5)</option>
        <option :value="[2, 4]">Medi (CR 2-4)</option>
        <option :value="[3, 5]">Complessi (CR 3-5)</option>
      </select>
      <select v-model="durationMin" class="w-full bg-blue-300 text-black px-4 py-1 rounded-full">
        <option :value="null">Qualsiasi durata minima</option>
        <option v-for="mins in durationOptions" :key="mins" :value="mins">
          Minimo {{ mins }} minuti
        </option>
      </select>
      <select v-model="durationMax" class="w-full bg-blue-300 text-black px-4 py-1 rounded-full">
        <option :value="null">Qualsiasi durata massima</option>
        <option v-for="mins in durationOptions" :key="mins" :value="mins">
          Massimo {{ mins }} minuti
        </option>
      </select>
    </div>
    <div class="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <TransitionGroup
        leave-active-class="absolute"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <GameTile
          v-for="game in games"
          :key="game.bggid"
          :game
          :open="expandedId === game.bggid"
          class="transition-400"
          @click="toggleExpanded(game.bggid)"
        />
      </TransitionGroup>
    </div>
    <div class="text-blue-100 text-center text-sm italic [&_a]:underline">
      Dati da <a href="https://boardgamegeek.com/" target="_blank">BoardGameGeek</a> &bullet;
      <a href="https://github.com/rrobby86/zugalist/issues" target="_blank"
        >Segnalazioni e suggerimenti</a
      >
      &bullet;
      <a href="https://github.com/rrobby86/zugalist" target="_blank">Codice sorgente</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import allGames from "./games.json"
import GameTile from "./GameTile.vue"

const durationOptions = [15, 30, 45, 60, 90, 120, 150, 180]

const players = ref<number | null>(null)
const complexityRange = ref<[number, number] | null>(null)
const durationMin = ref<number | null>(null)
const durationMax = ref<number | null>(null)

const games = computed(() => {
  let selected = allGames
  if (players.value !== null) {
    selected = selected.filter(
      (game) =>
        Math.min(game.minplayers, ...game.expansions.map((exp) => exp.minplayers)) <=
          players.value! &&
        Math.max(game.maxplayers, ...game.expansions.map((exp) => exp.maxplayers)) >=
          players.value!,
    )
  }
  if (complexityRange.value !== null) {
    selected = selected.filter(
      (game) =>
        game.complexity >= complexityRange.value![0] &&
        game.complexity <= complexityRange.value![1],
    )
  }
  if (durationMin.value !== null) {
    selected = selected.filter((game) => game.mintime >= durationMin.value!)
  }
  if (durationMax.value !== null) {
    selected = selected.filter((game) => game.maxtime <= durationMax.value!)
  }
  selected.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
  return selected
})

const expandedId = ref<string | null>(null)

function toggleExpanded(id: string) {
  expandedId.value = id !== expandedId.value ? id : null
}
</script>

<style>
body {
  --at-apply: bg-blue-700 text-white font-default;
}
</style>
