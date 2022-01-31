<template>
  <template v-if="banners.length > 0">
    <q-banner
      v-for="(banner, i) in banners"
      :key="i"
      :class="[`bg-${banner.bgColor}`, `text-${banner.textColor}`]"
      class="q-ma-sm rounded-borders"
      dense
      inline-actions
    >
      {{ banner.text }}
      <template v-slot:action>
        <q-btn
          :class="[`text-${banner.textColor}`]"
          icon="close"
          round
          flat
          @click="generalStore.DeleteBanner(banner)"
        />
      </template>
    </q-banner>
  </template>
</template>

<script setup>
import useGeneralStore from '../../stores/general'
import {computed} from 'vue'

const generalStore = useGeneralStore()
const banners = computed(() => generalStore.banners)

</script>
