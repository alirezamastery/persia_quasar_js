<template>
  <q-drawer
    v-model="generalState.sideOpen"
    show-if-above
    bordered
    elevated
  >
    <q-list>
      <!--      <q-item-label header></q-item-label>-->
      <q-item header class="q-px-md" clickable :to="{name: 'Profile'}">
        <q-item-section avatar>
          <q-avatar>
            <img v-if="profile.avatar" :src="userAvatar" alt="">
            <img v-else :src="require('src/assets/svg/user-blank.svg')" alt="">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user }}</q-item-label>
          <q-item-label caption lines="1">{{ fullName }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-scroll-area style="height: calc(100vh - 56px)">
        <template
          v-for="(item, i) in menuItems"
          :key="i"
        >
          <q-expansion-item
            expand-separator
            :icon="item.icon"
            :label="$t(item.titleI18n)"
            dense-toggle
            default-opened
            :header-style="{ fontSize: '1.1rem' }"
            :header-class="$q.dark.isActive ? 'bg-grey-10 text-light-blue-14' : 'bg-grey-2 text-blue'"
          >
            <q-item
              v-for="(subItem, j) in item.children"
              :key="j"
              :to="{name: subItem.routeName}"
              :inset-level="0.3"
              clickable
              v-ripple
              :active-class="$q.dark.isActive ? 'bg-blue-grey-10 text-blue' : 'bg-blue-1 text-blue'"
            >
              <q-item-section v-if="subItem.icon" avatar>
                <q-icon :name="subItem.icon" :size="$q.screen.gt.sm ? 'xs' : 'sm'"/>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ $t(subItem.titleI18n) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </template>
      </q-scroll-area>
    </q-list>
  </q-drawer>
</template>

<script setup>
import {ref, computed} from 'vue'
import useGeneralStore from '../../stores/general'
import useUserStore from '../../stores/user'
import {axiosInstance} from '../../boot/axios'
import urls from '../../urls'
import {notifyAxiosError, notifyErrors} from '../../composables/notif'
import {useRouter} from 'vue-router'
import {generalState, menuItems} from './composables'

const userStore = useUserStore()
const router = useRouter()

const user = computed(() => userStore.user)
const profile = computed(() => userStore.profile)
const userAvatar = computed(() => userStore.profile.avatar)
const fullName = computed(() => {
  const firstName = userStore.profile.first_name || ''
  const lastName = userStore.profile.last_name || ''
  return firstName + ' ' + lastName
})

if (userStore.isAuthenticated) {
  axiosInstance.get(urls.userProfile)
    .then(res => {
      console.log('profile:' , res)
      userStore.SetProfile(res.data)
    })
    .catch(err => {
      console.log(err)
      router.push({name: 'Login'})
    })
}

</script>

<style scoped>

</style>
