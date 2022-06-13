<template>
  <q-slide-transition>
    <div
      v-if="wsStore.hasCallInvite"
      class="q-pa-none flex full-width"
      :class="wsStore.myPeerConnection ? 'bg-green' : 'bg-green-2'"
    >

      <template v-if="!wsStore.myPeerConnection">
        <q-space v-if="$q.screen.gt.md"/>
        <q-btn
          icon="call"
          color="green"
          stretch
          @click="wsStore.handleCallOffer"
        />
        <q-space v-if="$q.screen.lt.lg"/>
      </template>

      <q-item :dark="false" class="text-black">
<!--        <q-item-section avatar>-->
<!--          <q-avatar>-->
<!--            <q-img :src="wsStore.caller.profile.avatar" alt=""/>-->
<!--            &lt;!&ndash;            <q-img src="https://picsum.photos/60" alt=""/>&ndash;&gt;-->
<!--          </q-avatar>-->
<!--        </q-item-section>-->

        <q-item-section>
          <q-item-label lines="1">
            {{ wsStore.callOfferData.name }}
          </q-item-label>
<!--          <q-item-label caption lines="1">-->
<!--            test-->
<!--          </q-item-label>-->
        </q-item-section>
      </q-item>

      <q-space v-if="$q.screen.lt.lg || wsStore.myPeerConnection"/>
      <q-btn
        icon="phone_disabled"
        color="red"
        stretch
        @click="wsStore.rejectCall"
      />
      <q-space v-if="$q.screen.gt.md && !wsStore.myPeerConnection"/>

    </div>
  </q-slide-transition>
</template>

<script setup>
import useWebsocketStore from 'src/stores/websocket'

const wsStore = useWebsocketStore()

</script>

<style scoped>

</style>
