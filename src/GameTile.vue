<template>
  <div class="relative w-full">
    <button type="button" class="w-full cursor-pointer" @click="$emit('click')">
      <div class="relative min-h-28 flex flex-row items-center group">
        <div
          class="absolute bg-linear-to-br from-blue-300 to-blue-400 hover:from-blue-200 group-hover:to-blue-300 inset-2 left-8 rounded-2xl"
        />
        <div
          class="absolute z-1 size-28 bg-no-repeat bg-center bg-contain transition-200 group-hover:scale-110"
          :style="{ backgroundImage: `url('${game.thumbnail}')` }"
        />
        <div class="absolute top-4 right-4 flex flex-row items-center gap-1 text-lg text-blue-800">
          <template v-for="code in game.catcodes" :key="code">
            <div
              v-if="categories[code]"
              class="text-sm md:text-base"
              :class="categories[code].iconClass"
            />
          </template>
        </div>
        <div class="absolute left-28 p-4 text-left text-black">
          <div class="font-bold text-base/4 md:text-lg/5 mb-1">
            {{ game.name
            }}<span
              v-if="game.expansions.length"
              class="ml-1 bg-red-600 text-white rounded-full px-1 md:px-2 text-xs md:text-sm"
              >+EXP</span
            >
          </div>
          <div class="flex flex-row items-center gap-x-1 md:gap-x-2 flex-wrap">
            <Chip icon-class="i-mdi-account-group"
              ><template v-if="game.minplayers !== game.maxplayers">{{ game.minplayers }}-</template
              >{{ game.maxplayers
              }}<span v-if="expandedPlayers" class="text-red"> ({{ expandedPlayers }})</span></Chip
            >
            <Chip icon-class="i-mdi-clock"
              ><template v-if="game.mintime !== game.maxtime">{{ game.mintime }}-</template
              >{{ game.maxtime }}'</Chip
            >
            <Chip icon-class="i-mdi-brain">{{ complexityFmt.format(game.complexity) }}</Chip>
          </div>
        </div>
      </div>
    </button>
    <Transition
      enter-from-class="absolute -translate-y-4 opacity-0"
      leave-to-class="absolute -translate-y-4 opacity-0"
    >
      <div v-if="open" class="lg:absolute top-26 w-full transition z-10">
        <div class="mx-4 rounded-xl bg-slate-700 text-white p-2">
          <div class="flex flex-row justify-between gap-4">
            <div>
              <div v-if="game.designers.length" class="text-sm">
                <span class="font-bold">Designer:</span> {{ game.designers.join(", ") }}
              </div>
              <div v-if="game.expansions.length" class="text-red-400">
                <div class="font-bold text-sm">Espansioni:</div>
                <ul class="list-disc list-inside text-sm">
                  <li v-for="exp in game.expansions" :key="exp.bggid">
                    {{ exp.name }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="shrink-0 text-right">
              <ul class="text-sm">
                <template v-for="code in game.catcodes" :key="code">
                  <div v-if="categories[code]" class="flex flex-row justify-end items-center gap-1">
                    {{ categories[code].name }}
                    <div :class="categories[code].iconClass" />
                  </div>
                </template>
              </ul>
            </div>
          </div>
          <div class="mt-2 flex flex-row justify-center">
            <a
              :href="`https://boardgamegeek.com/boardgame/${game.bggid}`"
              target="_blank"
              class="rounded-xl bg-slate-500 hover:bg-slate-400 px-4 py-1"
              >Scheda BGG</a
            >
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import Chip from "./Chip.vue"

const categories = {
  1002: { name: "Carte", iconClass: "i-mdi-cards" },
  // 1010: { name: "Fantasy", iconClass: "i-mdi-unicorn" },
  // 1016: { name: "Science Fiction", iconClass: "i-mdi-home" },
  1021: { name: "Economia", iconClass: "i-mdi-currency-usd" },
  1023: { name: "Bluff", iconClass: "i-game-icons-silenced" },
  // 1029: { name: "City Building", iconClass: "i-mdi-home" },
  1030: { name: "Party Game", iconClass: "i-mdi-party-popper" },
  1032: { name: "Azione e destrezza", iconClass: "i-mdi-hand-front-right" },
  // 1035: { name: "Medioevo", iconClass: "i-game-icons-medieval-gate" },
  1037: { name: "In tempo reale", iconClass: "i-mdi-clock-alert-outline" },
  1039: { name: "Deduzione", iconClass: "i-mdi-brain" },
  // 1046: { name: "Lotta", iconClass: "i-game-icons-punch" },
  1079: { name: "Humor", iconClass: "i-game-icons-clown" },
  // 1089: { name: "Animali", iconClass: "i-mdi-home" },
  2002: { name: "Piazza tessere", iconClass: "i-mdi-puzzle" },
  2012: { name: "Aste", iconClass: "i-mdi-gavel" },
  2023: { name: "Cooperativo", iconClass: "i-mdi-handshake" },
  2040: { name: "Gestione mano", iconClass: "i-game-icons-card-pick" },
  2072: { name: "Dadi", iconClass: "i-game-icons-perspective-dice-six-faces-one" },
  2082: { name: "Piazza lavoratori", iconClass: "i-game-icons-3d-meeple" },
  2685: { name: "Eliminazione", iconClass: "i-mdi-account-off" },
  2984: { name: "Draft", iconClass: "i-game-icons-card-exchange" },
} as Record<string, { name: string; iconClass: string }>

const props = defineProps<{ game: any; open?: boolean }>()
defineEmits<{ click: [] }>()

const complexityFmt = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 1 })

const expandedPlayers = computed(() => {
  const expMin = Math.min(
    props.game.minplayers,
    ...props.game.expansions.map((exp) => exp.minplayers),
  )
  const expMax = Math.max(
    props.game.maxplayers,
    ...props.game.expansions.map((exp) => exp.maxplayers),
  )
  return expMin != props.game.minplayers || expMax != props.game.maxplayers
    ? `${expMin}-${expMax}`
    : null
})
</script>
